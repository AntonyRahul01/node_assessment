const redis = require("../config/redis");
const RATE = parseInt(process.env.RATE_LIMIT_TOKENS_PER_SECOND || "5", 10);

async function rateLimiterPerAccount(req, res, next) {
  try {
    const token = req.headers["cl-x-token"];
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Missing CL-X-TOKEN" });

    const key = `rl:${token}`;
    const maxTokens = RATE;

    const current = await redis.incr(key);
    if (current === 1) {
      await redis.pexpire(key, 1000);
    }
    if (current > maxTokens) {
      return res
        .status(429)
        .json({ success: false, message: "Rate limit exceeded" });
    }
    next();
  } catch (err) {
    console.error("Rate limiter error", err);
    next();
  }
}

module.exports = rateLimiterPerAccount;
