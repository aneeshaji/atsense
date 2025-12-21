const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../services/emailService');
const { getPasswordResetTemplate } = require('../utils/emailTemplates');


const generateToken = (userId) => {
	return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
		expiresIn: '7d'
	});
};

// REGISTER
exports.register = async (req, res) => {
	const { name, email, password } = req.body;

	try {
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: 'User already exists' });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = await User.create({
			name,
			email,
			password: hashedPassword
		});

		res.status(201).json({
			token: generateToken(user._id),
			user: { id: user._id, name: user.name, email: user.email }
		});
	} catch (error) {
		console.error('REGISTER ERROR:', error);
		res.status(500).json({
			message: 'Server error',
			error: error.message
		});
	}

};

// LOGIN
exports.login = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}

		res.json({
			token: generateToken(user._id),
			user: { id: user._id, name: user.name, email: user.email }
		});
	} catch (err) {
		res.status(500).json({ message: 'Server error' });
	}
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
	const { email } = req.body;

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(32).toString('hex');

		// Hash and set reset token fields
		user.resetPasswordToken = crypto
			.createHash('sha256')
			.update(resetToken)
			.digest('hex');
		user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

		await user.save();

		// Create reset URL
		const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
		console.log(`DEBUG: Using FRONTEND_URL: ${frontendUrl}`);
		const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

		const message = `You are receiving this email because you (or someone else) have requested the reset of a password. Please visit the following link: \n\n ${resetUrl}`;

		try {
			await sendEmail({
				email: user.email,
				subject: 'Password Reset Request',
				message,
				html: getPasswordResetTemplate(resetUrl)
			});

			res.status(200).json({ message: 'Email sent' });
		} catch (err) {
			user.resetPasswordToken = undefined;
			user.resetPasswordExpires = undefined;
			await user.save();

			return res.status(500).json({ message: 'Email could not be sent' });
		}
	} catch (err) {
		res.status(500).json({ message: 'Server error' });
	}
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
	// Get hashed token
	const resetPasswordToken = crypto
		.createHash('sha256')
		.update(req.params.token)
		.digest('hex');

	try {
		const user = await User.findOne({
			resetPasswordToken,
			resetPasswordExpires: { $gt: Date.now() }
		});

		if (!user) {
			return res.status(400).json({ message: 'Invalid or expired token' });
		}

		// Set new password
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(req.body.password, salt);
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;

		await user.save();

		res.status(200).json({
			message: 'Password reset successful',
			token: generateToken(user._id),
			user: { id: user._id, name: user.name, email: user.email }
		});
	} catch (err) {
		res.status(500).json({ message: 'Server error' });
	}
};

