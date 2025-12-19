const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
        res.status(429).json({
            message: 'Too many requests, please try again later.',
            retryAfter: req.rateLimit.resetTime
        });
    }
});

// Stricter rate limiter for AI generation (expensive operation)
const aiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit to 5 AI generation requests per 15 minutes
    message: 'Too many AI generation requests, please try again later.',
    skipSuccessfulRequests: false,
    handler: (req, res) => {
        res.status(429).json({
            message: 'Too many AI generation requests. Please try again in 15 minutes.',
            retryAfter: req.rateLimit.resetTime
        });
    }
});

// Auth rate limiter (for login/register)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit to 10 login/register attempts per 15 minutes
    skipSuccessfulRequests: true, // Don't count successful requests
    handler: (req, res) => {
        res.status(429).json({
            message: 'Too many authentication attempts, please try again later.',
            retryAfter: req.rateLimit.resetTime
        });
    }
});

// Export rate limiter
const exportLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 20, // Limit to 20 exports per 10 minutes
    message: 'Too many export requests, please try again later.',
    handler: (req, res) => {
        res.status(429).json({
            message: 'Too many export requests. Please try again in 10 minutes.',
            retryAfter: req.rateLimit.resetTime
        });
    }
});

module.exports = {
    apiLimiter,
    aiLimiter,
    authLimiter,
    exportLimiter
};