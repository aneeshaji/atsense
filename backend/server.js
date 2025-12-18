const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');

dotenv.config();

const app = express();

connectDB();


app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
	res.json({ status: 'OK', message: 'Backend running' });
});

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/resumes', require('./src/routes/resumeRoutes'));
app.use('/api/ai', require('./src/routes/aiRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(
		`🚀 ATSense API running on port ${PORT} (${process.env.NODE_ENV})`
	);
});
