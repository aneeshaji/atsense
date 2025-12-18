const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
// const connectDB = require('./config/db');

dotenv.config();
const app = express();


app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
	res.json({ status: 'OK', message: 'Backend running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(
		`🚀 ATSense API running on port ${PORT} (${process.env.NODE_ENV})`
	);
});
