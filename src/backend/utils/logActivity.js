import ActivityLog from "../models/ActivityLog.js";

export async function logActivity({
    req, userId, action, resource, resourceId, metadata
}) {
    try {
        const doc = new ActivityLog({
            userId: userId ?? req?.user?._id,
            action, resource, resourceId, metadata,
            ip: req?.ip,
            userAgent: req?.headers["user-agent"]
        });
        await doc.save();
    } catch (err) {
        // Don't crash app if logging fails; just surface in server logs
        console.error("[ActivityLog] Failed:", err.message);
    }
}

// Express middleware wrapper for convenience
export function activity(action, resource) {
    return async (req, res, next) => {
        // Call this after primary handler sets res.locals.resourceId / metadata if needed
        res.on("finish", () => {
            // Only log success (2xx/3xx); tweak as you like
            if (res.statusCode < 400) {
                logActivity({
                    req,
                    action,
                    resource,
                    resourceId: res.locals?.resourceId,
                    metadata: res.locals?.metadata
                });
            }
        });
        next();
    };
}
