const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const router = express.Router();

// Define Booking Schema
const bookingSchema = new mongoose.Schema({
    date: { type: String, required: true },
    time: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    timezone: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'rajkushwaha0213@gmail.com', // Replace with your email address
        pass: 'acdq pmzk tkyc btsw' // Replace with your App Password
    }
});

// Simulated availability data
const availability = {
    '2025-03-10': ['8:30am', '9:00am', '9:30am', '10:00am', '11:00am', '2:30pm'],
    '2025-03-11': ['9:00am', '10:00am', '11:00am'],
    '2025-03-12': ['8:30am', '9:30am', '2:30pm'],
    '2025-03-13': ['8:00am', '10:30am', '1:00pm'],
    '2025-03-14': ['9:00am', '11:00am', '2:00pm']
};

// API endpoint to get available slots for a date
router.get('/api/availability/:date', async (req, res) => {
    const date = req.params.date;
    console.log(`Fetching availability for date: ${date}`);
    const slots = availability[date] || [];

    try {
        const booked = await Booking.find({ date: date }).select('time');
        console.log(`Booked slots for ${date}:`, booked.map(b => b.time));
        const availableSlots = slots.filter(slot => !booked.some(b => b.time === slot));
        res.json(availableSlots);
    } catch (error) {
        console.error('Error fetching availability:', error);
        res.status(500).json({ success: false, message: 'Error fetching availability', error });
    }
});

// API endpoint to book a slot
router.post('/api/book', async (req, res) => {
    let { date, time, name, email, timezone } = req.body;
    console.log('Received booking request:', { date, time, name, email, timezone });

    // Normalize inputs
    date = date.trim();
    time = time.trim().toLowerCase();

    if (!availability[date] || !availability[date].includes(time)) {
        console.log('Validation failed: Invalid date or time');
        return res.status(400).json({ success: false, message: 'Invalid date or time' });
    }

    try {
        const existingBooking = await Booking.findOne({ date, time });
        if (existingBooking) {
            console.log('Slot already booked:', { date, time });
            return res.status(400).json({ success: false, message: 'Slot already booked' });
        }

        const booking = new Booking({ date, time, name, email, timezone });
        console.log('Saving booking to MongoDB:', booking);
        await booking.save();
        console.log('Booking saved successfully:', booking);

        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Appointment Confirmation - Rajkumar Kushwaha',
            text: `Hi ${name},\n\nYour appointment with Rajkumar Kushwaha for ${date} at ${time} (${timezone}).\n\nWe look forward to assisting you!\n\nWarm regards,\nRaj Kushwaha\nSoftware Engineer at ConnectX`
        };

        await transporter.sendMail(mailOptions);
        console.log(`Confirmation email sent to ${email}`);

        res.json({ success: true, message: 'Slot booked successfully' });
    } catch (error) {
        console.error('Error booking appointment or sending email:', error);
        res.status(500).json({ success: false, message: 'Error booking appointment', error });
    }
});

// API endpoint to delete a booking
router.delete('/api/delete-booking', async (req, res) => {
    let { date, time } = req.body;
    console.log('Received delete request:', { date, time });

    if (!date || !time) {
        return res.status(400).json({ success: false, message: 'Date and time are required' });
    }

    // Normalize inputs
    date = date.trim();
    time = time.trim().toLowerCase();
    console.log('Normalized delete request:', { date, time });

    try {
        const result = await Booking.deleteOne({ date, time });
        if (result.deletedCount === 0) {
            console.log('No booking found to delete:', { date, time });
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        console.log('Booking deleted successfully:', { date, time });
        res.json({ success: true, message: 'Booking deleted successfully' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ success: false, message: 'Error deleting booking', error });
    }
});

// API endpoint to list all bookings (for debugging)
router.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ success: false, message: 'Error fetching bookings', error });
    }
});

module.exports = router;