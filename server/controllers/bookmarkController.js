import { Bookmark } from "../models/Bookmark.js";
import { Listing } from "../models/Listing.js";

export async function getBookmarks(req, res, next) {
  try {
    const userId = req.params.userId;
    if (userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view these bookmarks" });
    }

    const bookmarks = await Bookmark.find({ userId })
      .lean();

    // Map to listing details
    const listingIds = bookmarks.map((b) => b.listingId);
    const listings = await Listing.find({ _id: { $in: listingIds } }).lean();

    return res.json({ bookmarks: listings });
  } catch (error) {
    next(error);
  }
}

export async function createBookmark(req, res, next) {
  try {
    const userId = req.params.userId;
    const { listingId } = req.body;

    if (userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to bookmark for this user" });
    }

    if (!listingId) {
      return res.status(400).json({ message: "listingId is required" });
    }

    const exists = await Bookmark.findOne({ userId, listingId });
    if (exists) {
      return res.status(400).json({ message: "Listing is already bookmarked" });
    }

    const bookmark = await Bookmark.create({ userId, listingId });
    return res.status(201).json({ bookmark });
  } catch (error) {
    next(error);
  }
}

export async function deleteBookmark(req, res, next) {
  try {
    const { userId, listingId } = req.params;

    if (userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to remove this bookmark" });
    }

    await Bookmark.findOneAndDelete({ userId, listingId });
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}
