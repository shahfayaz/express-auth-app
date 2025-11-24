const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session setup
// Session setup
const { Session } = require('./models');
const geoip = require('geoip-lite');
const requestIp = require('request-ip');

const sessionStore = new SequelizeStore({
  db: sequelize,
  table: 'Session',
  extendDefaultFields: (defaults, session) => {
    return {
      data: defaults.data,
      expires: defaults.expires,
      userId: session.userId,
      ip: session.ip,
      userAgent: session.userAgent,
      city: session.city,
      country: session.country,
    };
  },
});

// Middleware to capture client info (moved after session)
app.use(requestIp.mw());

const AUTH_EXPIRATION = parseInt(process.env.AUTH_EXPIRATION) || 3600000; // Default 1 hour

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: AUTH_EXPIRATION,
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
    },
  })
);

app.use((req, res, next) => {
  if (req.session) {
     const ip = req.clientIp;
     const geo = geoip.lookup(ip);
     
     req.session.ip = ip;
     req.session.userAgent = req.headers['user-agent'];
     if (geo) {
       req.session.city = geo.city;
       req.session.country = geo.country;
     }
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Express Auth App');
});

// Sync session store
sessionStore.sync();

module.exports = app;
