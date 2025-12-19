// Save this as: src/middleware/rateLimiter.js

const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            message: 'Too many requests, please try again later.',
            retryAfter: req.rateLimit.resetTime
        });
    }
});

// Stricter rate limiter for AI generation
const aiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many AI generation requests, please try again later.',
    skipSuccessfulRequests: false,
    handler: (req, res) => {
        res.status(429).json({
            message: 'Too many AI generation requests. Please try again in 15 minutes.',
            retryAfter: req.rateLimit.resetTime
        });
    }
});

// Auth rate limiter
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    skipSuccessfulRequests: true,
    handler: (req, res) => {
        res.status(429).json({
            message: 'Too many authentication attempts, please try again later.',
            retryAfter: req.rateLimit.resetTime
        });
    }
});

// Export rate limiter
const exportLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 20,
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