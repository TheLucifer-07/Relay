import { Listing } from "../models/Listing.js";
import { Profile } from "../models/Profile.js";
import { analyzeListing } from "../services/aiService.js";
import { uploadImage } from "../services/cloudinaryService.js";

export async function getListings(req, res, next) {
  try {
    const { category, search, userId } = req.query;

    const query = { status: { $ne: "Archived" } };

    if (category) {
      query.category = category;
    }

    if (userId) {
      query.userId = userId;
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Sort by matches or creation date
    const sort = search ? { score: { $meta: "textScore" } } : { createdAt: -1 };

    const listings = await Listing.find(query, search ? { score: { $meta: "textScore" } } : {})
      .sort(sort)
      .lean();

    return res.json({ listings });
  } catch (error) {
    next(error);
  }
}

export async function getListingById(req, res, next) {
  try {
    const listing = await Listing.findById(req.params.id).lean();
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Increment view count asynchronously
    Listing.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } }).exec();

    return res.json({ listing });
  } catch (error) {
    next(error);
  }
}

export async function createListing(req, res, next) {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(400).json({ message: "User profile not found. Please complete profile first." });
    }

    const {
      title,
      description,
      category,
      condition,
      value,
      lookingFor,
      lookingForDetails,
      images,
      latitude,
      longitude,
      city,
      isAuctionEligible
    } = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: "Title and Category are required fields." });
    }

    const ownerProfile = {
      initials: profile.avatarInitials,
      avatarColor: profile.avatarColor,
      joinedSince: profile.memberSince,
      completedTrades: profile.successfulTrades,
      responseTime: profile.responseTime,
      tradeHistory: `${profile.successfulTrades} successful relays`,
      name: profile.displayName
    };

    const listing = await Listing.create({
      userId: req.user.id,
      title,
      description,
      category,
      condition: condition || "Good",
      value: value || "",
      lookingFor: lookingFor || "",
      lookingForDetails: lookingForDetails || {},
      ownerProfile,
      ownerName: profile.displayName,
      images: images || [],
      latitude: latitude || profile.latitude,
      longitude: longitude || profile.longitude,
      city: city || profile.city || "Visakhapatnam",
      isAuctionEligible: isAuctionEligible || false,
      detailLabel: "Condition",
      detailValue: condition || "Good",
      status: "Ready to Negotiate"
    });

    const io = req.app.get("io");
    if (io) {
      io.emit("listing_created", listing);
    }

    return res.status(201).json({ listing });
  } catch (error) {
    next(error);
  }
}

export async function updateListing(req, res, next) {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this listing" });
    }

    const updated = await Listing.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { returnDocument: 'after', runValidators: true }
    );

    const io = req.app.get("io");
    if (io) {
      io.emit("listing_updated", updated);
    }

    return res.json({ listing: updated });
  } catch (error) {
    next(error);
  }
}

export async function deleteListing(req, res, next) {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this listing" });
    }

    // Perform soft delete by archiving, or hard delete? The user says:
    // "Owners can archive, republish, or delete their listings. This behavior must be restricted: non-owners should not be allowed to perform these actions."
    // Let's support full deletion if they request it, or archiving.
    await Listing.findByIdAndDelete(req.params.id);

    const io = req.app.get("io");
    if (io) {
      io.emit("listing_deleted", req.params.id);
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function analyzeListingDraft(req, res, next) {
  try {
    let imageUrl = null;
    let analysis = null;

    if (req.file) {
      // Upload to Cloudinary
      imageUrl = await uploadImage(req.file.buffer);
      // Run Gemini analysis on image + text
      analysis = await analyzeListing(req.body, req.file.buffer, req.file.mimetype);
    } else {
      // Run Gemini analysis on text only
      analysis = await analyzeListing(req.body);
    }

    return res.json({ analysis, imageUrl });
  } catch (error) {
    next(error);
  }
}
