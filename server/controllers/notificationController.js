import { Notification } from "../models/Notification.js";

export async function getNotifications(req, res, next) {
  try {
    const userId = req.params.userId;
    if (userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to fetch these notifications" });
    }

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    // Map model fields to exact fields expected by frontend
    const mapped = notifications.map((n) => ({
      id: n._id,
      title: n.title,
      detail: n.detail,
      unread: !n.isRead,
      time: formatRelativeTime(n.createdAt)
    }));

    return res.json({ notifications: mapped });
  } catch (error) {
    next(error);
  }
}

export async function updateNotification(req, res, next) {
  try {
    const notification = await Notification.findById(req.params.notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this notification" });
    }

    const updates = {};
    if (req.body.isRead !== undefined) {
      updates.isRead = req.body.isRead;
      if (req.body.isRead) {
        updates.readAt = new Date();
      }
    }

    const updated = await Notification.findByIdAndUpdate(
      req.params.notificationId,
      { $set: updates },
      { returnDocument: 'after' }
    );

    return res.json({
      notification: {
        id: updated._id,
        title: updated.title,
        detail: updated.detail,
        unread: !updated.isRead,
        time: formatRelativeTime(updated.createdAt)
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function markAllRead(req, res, next) {
  try {
    const userId = req.user.id;
    await Notification.updateMany({ userId, isRead: false }, { $set: { isRead: true, readAt: new Date() } });
    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

function formatRelativeTime(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
