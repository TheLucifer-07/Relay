import { User } from "../models/User.js";

export async function resolveUserId(idOrKey) {
  if (!idOrKey) return null;
  const value = String(idOrKey);
  if (!value.startsWith("demo-user-")) {
    return value;
  }

  const user = await User.findOne({ seedUserKey: value }).select("_id").lean();
  return user?._id?.toString() || null;
}
