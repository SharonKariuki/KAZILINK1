require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Import Routes
const authRoutes = require('./routes/authRoutes');
const workerRoutes = require('./routes/workers');
const employerRoutes = require('./routes/employers');
const matchRoutes = require('./routes/match');
const jobRoutes = require('./routes/jobRoutes');
const adminRoutes = require('./routes/admin');
const kycRoutes = require('./routes/kyc');
const reviewRoutes = require('./routes/reviews');
const bannerRoutes = require('./routes/banner');
const courseRoutes = require('./routes/courses');

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/employers', employerRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/admin/courses', courseRoutes);
// app.use('/api/location', require('./routes/location'));


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
