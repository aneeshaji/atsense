const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');

const {
	apiLimiter,
	aiLimiter,
	authLimiter,
	exportLimiter
} = require('./src/middleware/rateLimiter');

dotenv.config();

const app = express();

// Trust proxy for rate limiting on cloud providers (EC2, Heroku, etc.)
app.set('trust proxy', 1);

connectDB();

app.use(cors());
app.use(express.json());

// Global API Limiter
app.use('/api', apiLimiter);

app.get('/health', (req, res) => {
	res.json({ status: 'OK', message: 'Backend running' });
});

app.use('/api/auth', authLimiter, require('./src/routes/authRoutes'));
app.use('/api/resumes', require('./src/routes/resumeRoutes'));
app.use('/api/ai', aiLimiter, require('./src/routes/aiRoutes'));
app.use('/api/preview', require('./src/routes/previewRoutes'));
app.use('/api/export', exportLimiter, require('./src/routes/exportRoutes'));
app.use('/api/cover-letters', aiLimiter, require('./src/routes/coverLetterRoutes')); // Cover letters also use AI

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(
		`🚀 ATSense API running on port ${PORT} (${process.env.NODE_ENV})`
	);
});
