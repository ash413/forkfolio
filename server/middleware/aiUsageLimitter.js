const { User } = require('../db/db')

const AI_LIMIT = 5; // Max allowed AI requests

const aiUsageLimitter = async (req, res, next) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
      
        if (user.aiUsageCount >= AI_LIMIT) {
            return res.status(403).json({ error: "AI usage limit reached. No more requests allowed." });
        }

        // Send a warning if the user is about to reach the limit
        if (user.aiUsageCount === 3) {
            res.setHeader('X-Warning', 'You have 2 more AI requests left.');
        } else if (user.aiUsageCount === 4) {
            res.setHeader('X-Warning', 'This is your last AI request.');
        }

          // User still has requests left, allow the request to proceed
        next();
    } catch (error) {
        console.error("Error in AI rate limiter:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = aiUsageLimitter;