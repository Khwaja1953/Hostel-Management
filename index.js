const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const loginRoutes = require('./routes/login_api'); // Login API
const profileRoutes = require('./routes/profile_api'); // Profile API
const balanceRoutes = require('./routes/admin_mess_balance_api'); // Balance API
const adminRoutes = require('./routes/admin_login_api'); // Admin API
const registerRoutes = require('./routes/regestration_page'); // for new student regestration
const messBalanceRoutes = require('./routes/mess_balance'); // to manage mess balance of students
const updateBalanceRoutes = require('./routes/update_balance'); // to update balance of student
const batchRoutes = require('./routes/batch_api'); // to fetch students batch wise
const documentRoutes = require('./routes/document_api');
const staffRoutes = require('./routes/staff_registration');
const wardenLoginApi = require('./routes/warden_api'); // Warden login API
const registeredstaffRoutes = require('./routes/registered_staff'); // Staff registration API
const aboutRoutes = require('./routes/about_page');
const photosRoute = require('./routes/photos');
const rebateRoute = require('./routes/rebate_api');
const grievanceRoute = require('./routes/grievance_api');
const messMenuApi = require('./routes/mess_menu_api');
const mainRoutes = require('./routes/main');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mount APIs
app.use('/api/login', loginRoutes); // Mount login API
app.use('/api/profile', profileRoutes); // Mount profile API
app.use('/api/balance', balanceRoutes); // Mount balance API
app.use('/api/admin', adminRoutes); // Mount admin API
app.use('/api/register', registerRoutes); 
app.use('/api/messBalance',messBalanceRoutes);
app.use('/api/update_balance',updateBalanceRoutes);
app.use('/api/batches',batchRoutes);
app.use('/api/document', documentRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/warden', wardenLoginApi);
app.use('/api/staff_registration', registeredstaffRoutes); // Mount staff registration API
app.use('/api/about',aboutRoutes);
app.use('/api/photos', photosRoute);
app.use('/api/rebate',rebateRoute);
app.use('/api/grievance',grievanceRoute);
app.use('/api/messmenu', messMenuApi);
app.use('/api/main',mainRoutes);
// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://khwajamuzamil1953:2Xn2ehNcorpp6XSW@cluster0.uaqxmb8.mongodb.net/mak_hostel?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Root Route
app.get('/', (req, res) => {
    res.send('Welcome to the MAK Hostel Backend!');
});

// Fallback Route for Undefined Endpoints
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'An unexpected error occurred' });
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
