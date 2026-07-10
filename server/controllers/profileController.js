import { Profile } from "../models/Profile.js";
import { Review } from "../models/Review.js";
import { Listing } from "../models/Listing.js";
import { User } from "../models/User.js";

// Private — own profile with all details (authenticated)
export async function getProfileByUserId(req, res, next) {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId }).lean();
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const reviews = await Review.find({ subjectId: req.params.userId })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      profile: { ...profile, reviews: reviews || [] }
    });
  } catch (error) {
    next(error);
  }
}

// Public — safe subset for viewing another user's profile
export async function getPublicProfile(req, res, next) {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId })
      .select("-phone -preferences")
      .lean();

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const user = await User.findById(req.params.userId)
      .select("lastSeenAt createdAt")
      .lean();

    const reviews = await Review.find({ subjectId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const listingCount = await Listing.countDocuments({
      userId: req.params.userId,
      status: { $ne: "Archived" }
    });

    return res.json({
      profile: {
        _id: profile._id,
        userId: profile.userId,
        displayName: profile.displayName,
        avatarUrl: profile.avatarUrl || null,
        avatarInitials: profile.avatarInitials,
        avatarColor: profile.avatarColor,
        bio: profile.bio || "",
        city: profile.city || "Visakhapatnam",
        location: profile.location || "Visakhapatnam",
        memberSince: profile.memberSince || "2025",
        trustScore: profile.trustScore ?? 50,
        successfulTrades: profile.successfulTrades ?? 0,
        successRate: profile.successRate || "0%",
        responseTime: profile.responseTime || "—",
        communityRating: profile.communityRating || null,
        reviewCount: profile.reviewCount || 0,
        listingCount,
        lastSeenAt: user?.lastSeenAt || null,
      },
      reviews: reviews || [],
    });
  } catch (error) {
    next(error);
  }
}

// Public user's active listings
export async function getUserListings(req, res, next) {
  try {
    const listings = await Listing.find({
      userId: req.params.userId,
      status: { $ne: "Archived" }
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return res.json({ listings });
  } catch (error) {
    next(error);
  }
}

// Own profile update (authenticated + authorized)
export async function updateProfile(req, res, next) {
  try {
    if (req.params.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this profile" });
    }

    const updated = await Profile.findOneAndUpdate(
      { userId: req.params.userId },
      { $set: req.body },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.json({ profile: updated });
  } catch (error) {
    next(error);
  }
}

// Submit trader review + recalculate trust score
export async function submitTraderFeedback(req, res, next) {
  try {
    const { subjectId, starRating, title, description, comment, experience, tradeAgain, resource, tradeDate, tags, accuracy, tradeId, conversationId } = req.body;

    if (!subjectId) return res.status(400).json({ message: "subjectId is required" });
    if (!starRating) return res.status(400).json({ message: "starRating is required" });

    if (req.user.id === subjectId.toString()) {
      return res.status(400).json({ message: "You cannot submit feedback for yourself." });
    }

    const sessId = conversationId || tradeId;
    if (sessId) {
      const existing = await Review.findOne({ authorId: req.user.id, sessionId: sessId });
      if (existing) {
        return res.status(400).json({ message: "You have already submitted feedback for this completed trade." });
      }
    }

    const reviewerProfile = await Profile.findOne({ userId: req.user.id });

    const ratingVal = Number(starRating);
    const review = await Review.create({
      sessionId: sessId || null,
      conversationId: String(sessId || ""),
      tradeId: String(tradeId || ""),
      authorId: req.user.id,
      reviewerId: String(req.user.id),
      subjectId,
      reviewedUserId: String(subjectId),
      reviewerName: reviewerProfile?.displayName || "Relay User",
      reviewerInitials: reviewerProfile?.avatarInitials || "RU",
      reviewerColor: reviewerProfile?.avatarColor || "bg-[rgba(141,205,228,0.18)] text-[#8dcde4]",
      starRating: ratingVal,
      rating: ratingVal,
      stars: "★".repeat(ratingVal) + "☆".repeat(5 - ratingVal),
      title: title || "Exchange Feedback",
      description: description || comment || "",
      comment: description || comment || "",
      experience: experience || "Excellent",
      tradeAgain: tradeAgain || "Yes",
      tags: tags || [],
      resource: resource || "",
      tradeDate: tradeDate || new Date().toLocaleDateString(),
      accuracy: accuracy || "Yes",
    });

    const allReviews = await Review.find({ subjectId });
    const reviewCount = allReviews.length;
    const communityRating = allReviews.reduce((sum, r) => sum + r.starRating, 0) / reviewCount;

    // Increment completed trade counter and update trust score
    const subjectProfile = await Profile.findOne({ userId: subjectId });
    const completedCount = (subjectProfile?.successfulTrades || 0) + 1;
    const communityTrustScore = Math.min(100, Math.round(50 + (communityRating * 8) + (completedCount * 2)));

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: subjectId },
      {
        $set: {
          communityRating: Number(communityRating.toFixed(1)),
          reviewCount,
          trustScore: communityTrustScore,
          successfulTrades: completedCount,
        }
      },
      { returnDocument: 'after' }
    ).lean();

    return res.status(201).json({ review, profile: updatedProfile });
  } catch (error) {
    next(error);
  }
}
