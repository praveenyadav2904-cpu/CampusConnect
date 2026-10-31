
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const connectDB = require('./src/config/database');

const departmentRoutes = require('./src/config/modules/department.routes');
const noticeRoutes = require('./src/config/modules/notice.routes');
const eventRoutes = require('./src/config/modules/event.routes');
const facultyRoutes = require('./src/config/modules/faculty.routes');
const complaintRoutes = require('./src/config/modules/complaint.routes');
const placementRoutes = require('./src/config/modules/placement.routes');
const libraryRoutes = require('./src/config/modules/library.routes');
const qaRoutes = require('./src/config/modules/qa.routes');
const campusSearchRoutes = require('./src/config/modules/campus-search.routes');
const campusLocationRoutes = require('./src/config/modules/campus-location.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Health-check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Campus Connect backend is running!',
    timestamp: new Date().toISOString(),
  });
});

// Departments API
app.use('/api/departments', departmentRoutes);

// Notices API
app.use('/api/notices', noticeRoutes);

// Events API
app.use('/api/events', eventRoutes);

// Faculty API
app.use('/api/faculty', facultyRoutes);

// Complaints API
app.use('/api/complaints', complaintRoutes);

// Placements API
app.use('/api/placements', placementRoutes);

// Library API
app.use('/api/library', libraryRoutes);

// AI Assistant API
app.use('/api/qa', qaRoutes);

// Campus Search API
app.use('/api/campus-search', campusSearchRoutes);

// Campus Locations API
app.use('/api/campus-locations', campusLocationRoutes);

// Handle unknown API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
  });
});

// Start server after MongoDB connects
async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Backend running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start backend:', error.message);
    process.exit(1);
  }
}

startServer();
