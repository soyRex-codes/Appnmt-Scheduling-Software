Below is a comprehensive README.md file that documents your appointment booking system project. It includes setup instructions, usage details, file structure, dependencies, and troubleshooting tips. This will help you or anyone else run the project later.

Appointment Booking System - Sam The Concrete Man
This project is a web-based appointment booking system for "Sam The Concrete Man," allowing users to schedule discovery calls with Alec Oster. The system uses a calendar interface to select dates and times, stores bookings in MongoDB for persistence, sends email confirmations, and provides a feature to cancel bookings.

Features
Calendar Interface: Select a date using FullCalendar to view available time slots.
Time Slot Booking: Choose a time slot and book an appointment with user details (name, email, phone).
Persistent Storage: Bookings are stored in MongoDB, ensuring data persists across server restarts.
Email Notifications: Sends confirmation emails to users upon booking using Nodemailer.
Cancel Booking: Delete existing bookings by specifying the date and time.
Time Zone Support: Supports multiple time zones with a dropdown for selection.
Prerequisites
Before running the project, ensure you have the following installed:

Node.js (v14 or higher): Download Node.js
MongoDB: Install MongoDB Community Edition locally or use MongoDB Atlas.
Local Installation (macOS): Use Homebrew (brew tap mongodb/brew && brew install mongodb-community).
MongoDB Atlas: Sign up at MongoDB Atlas for a cloud database.
Gmail Account: For sending email notifications (or another email service like SendGrid).
Project Structure
text

appointment-booking-system/
├── appointment-booking/
│   ├── index.html        # Main HTML file for the frontend
│   ├── script.js         # Frontend JavaScript for calendar, booking, and deletion logic
│   ├── styles.css        # CSS styles for the frontend (not provided, but referenced)
│   └── (other assets)
├── server/
│   ├── server.js         # Main server setup and MongoDB connection
│   ├── bookingRoutes.js  # Routes for booking, availability, and deletion
│   ├── package.json      # Node.js dependencies and scripts
│   └── node_modules/     # Installed dependencies
├── README.md             # This documentation file
Setup Instructions
1. Clone the Repository
Clone or download this project to your local machine:

bash
git clone <repository-url>
cd appointment-booking-system
2. Install Dependencies
Navigate to the server directory and install the required Node.js packages:

bash
cd server
npm install express cors mongoose nodemailer
3. Set Up MongoDB
Option 1: Local MongoDB
Install MongoDB (if not already installed):
bash


brew tap mongodb/brew
brew install mongodb-community
Start MongoDB:
bash


brew services start mongodb-community
Verify MongoDB is running:
bash


lsof -i :27017
You should see mongod listening on port 27017.
Option 2: MongoDB Atlas
Sign up at MongoDB Atlas.
Create a free cluster, add a database user, and whitelist your IP address.
Get the connection string (e.g., mongodb+srv://<username>:<password>@cluster0.mongodb.net/appointmentDB?retryWrites=true&w=majority).
Update the mongoURI in server.js with your Atlas connection string:
javascript


const mongoURI = 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/appointmentDB?retryWrites=true&w=majority';
4. Configure Email Notifications
In bookingRoutes.js, configure the Nodemailer transporter with your email credentials:

javascript


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com', // Replace with your Gmail address
        pass: 'your-app-password' // Replace with your App Password
    }
});
Gmail Setup:
Enable 2-Step Verification in your Google Account.
Go to "Security" > "App Passwords" > Generate a new App Password for "Mail."
Use the generated 16-character password as your-app-password.
Alternative Email Service: Replace the service and auth with another provider (e.g., SendGrid):
javascript


const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
        user: 'apikey',
        pass: 'your-sendgrid-api-key'
    }
});
5. Run the Server
Start the backend server:

bash


cd server
node server.js
You should see:
text

Server running on http://localhost:3000
Connected to MongoDB
6. Access the Application
Option 1: Open index.html Directly
Navigate to the appointment-booking directory.
Open index.html in your browser (e.g., file:///path/to/appointment-booking-system/appointment-booking/index.html).
Option 2: Serve via Backend
The server is configured to serve static files from appointment-booking.
Open http://localhost:3000 in your browser.
Usage
Booking an Appointment
Select a date from the calendar (valid range: March 2025).
Choose a time slot from the available options.
Fill out the booking form (name, email, phone, optional message).
Select a time zone from the dropdown.
Submit the form to book the appointment.
Receive a confirmation email and see an alert: Appointment booked successfully!.
Canceling a Booking
In the "Cancel Booking" form, enter the date (e.g., 2025-03-10) and time (e.g., 8:30am) of an existing booking.
Submit the form to delete the booking.
See an alert: Booking deleted successfully!.
The time slot will become available again on the calendar.
Listing Bookings (Debugging)
Access http://localhost:3000/api/bookings to view all bookings in JSON format.
Use this to verify the exact date and time values for deletion.
API Endpoints
GET /api/availability/:date:
Returns available time slots for a given date.
Example: GET http://localhost:3000/api/availability/2025-03-10
POST /api/book:
Books an appointment.
Body: { "date": "2025-03-10", "time": "8:30am", "name": "John Doe", "email": "john@example.com", "timezone": "America/Chicago" }
DELETE /api/delete-booking:
Deletes a booking by date and time.
Body: { "date": "2025-03-10", "time": "8:30am" }
GET /api/bookings:
Lists all bookings (for debugging).
Troubleshooting
MongoDB Connection Error:
Ensure MongoDB is running (lsof -i :27017).
Verify the mongoURI in server.js.
For Atlas, check your IP whitelist and credentials.
Email Not Sent:
Check the email and App Password in bookingRoutes.js.
Look for Error booking appointment or sending email: in server logs.
Delete Not Working:
Verify the date and time match exactly (case-sensitive, no extra spaces).
Check browser console for Sending delete request from frontend: and server logs for Received delete request:.
Use /api/bookings to confirm the booking exists.
CORS Issues:
Ensure app.use(cors()) is in server.js.
Verify the frontend is accessing the correct URL (http://localhost:3000).
Next Steps
Dynamic Availability: Move the availability object to MongoDB for dynamic slot management.
HTML Emails: Format confirmation emails with HTML for better presentation.
Admin Interface: Add a UI to list and manage bookings.
Validation: Add schema validation (e.g., email format) in MongoDB.
License
This project is for personal use and not licensed for commercial distribution.

Notes for Later Use
Backup Database: Before making changes, back up your MongoDB database:
bash

mongodump --db appointmentDB
Update Dependencies: Periodically update dependencies in package.json:

bash



npm update