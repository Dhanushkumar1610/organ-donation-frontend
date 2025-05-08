const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const doctorRoutes = require('./routes/doctor');
const userRoutes = require('./routes/user');

const app = express();
const server = http.createServer(app);

// Configure CORS to allow requests from your Netlify domain
const corsOptions = {
  origin: ['http://localhost:3000', 'https://your-netlify-app.netlify.app'], // Replace with your Netlify domain
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true,
};
const io = new Server(server, { cors: corsOptions });

// Middleware
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.static('public'));

// MongoDB Connection using environment variable
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/user', userRoutes);

// Socket.IO for real-time notifications
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('newRequest', (data) => {
    io.emit('requestUpdate', data);
  });
  socket.on('newDonation', (data) => {
    io.emit('donationUpdate', data);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));