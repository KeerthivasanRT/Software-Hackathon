const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');
const runSeed = require('./utils/seedAdmin');
const seedMasterData = require('./utils/seedMasterData');
const seedDailyOperations = require('./utils/seedDailyOperations');
const seedManagementOps = require('./utils/seedManagementOps');

// Load environment variables
dotenv.config();

// Connect MongoDB Atlas
connectDB().then(async () => {
  // Run seeders sequentially
  await runSeed();
  if (seedMasterData) await seedMasterData();
  if (seedDailyOperations) await seedDailyOperations();
  if (seedManagementOps) await seedManagementOps();
});

const app = express();

// Security & Logging Middlewares
app.use(helmet());

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes Integration (Phase 1, 2, 3, 4)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/drivers', require('./routes/driverRoutes'));
app.use('/api/buses', require('./routes/busRoutes'));
app.use('/api/routes', require('./routes/routeRoutes'));
app.use('/api/pickup-points', require('./routes/pickupPointRoutes'));

app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/emergency', require('./routes/emergencyRoutes'));

app.use('/api/salary', require('./routes/salaryRoutes'));
app.use('/api/fees', require('./routes/feeRoutes'));
app.use('/api/inspections', require('./routes/inspectionRoutes'));
app.use('/api/fuel-logs', require('./routes/fuelLogRoutes'));
app.use('/api/trips', require('./routes/tripRoutes'));
app.use('/api/calendar', require('./routes/calendarRoutes'));
app.use('/api/maintenance', require('./routes/maintenanceRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Root & Health Check Endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'BIT Smart Transport Enterprise Backend (Phase 1-4 Complete)',
    timestamp: new Date().toISOString()
  });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` 🚀 BIT Transport Full System Server Running on Port ${PORT}`);
  console.log(` 🌐 Base URL: http://localhost:${PORT}`);
  console.log(` 📊 APIs:     http://localhost:${PORT}/api/*`);
  console.log(`=======================================================`);
});
