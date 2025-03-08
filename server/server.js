const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const bookingRoutes = require('./bookingRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the appointment-booking directory (for Option 2)
app.use(express.static(path.join(__dirname, '../appointment-booking')));

// MongoDB Connection
const mongoURI = 'mongodb://localhost:27017/appointmentDB';
mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Use the booking routes
app.use(bookingRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});