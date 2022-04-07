const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const key = require("./utils/libs/gen-key");
const userRoutes = require('./routes/userRoutes')
const contactRoutes = require('./routes/contactRoutes')
const googlePassport = require('./controllers/User/googleController')
const linkedinPassport = require('./controllers/User/LinkedinController')
const passport = require('passport')
const cookieSession =  require('cookie-session')

const authRouter = require('./routes/user');
const AppError = require("./utils/libs/appError");
const globalErrorHandler = require("./controllers/errorController");
const { successResMsg } = require("./utils/libs/response");

dotenv.config();

if (process.env.NODE_ENV === "production") {
  process.env.ZIGARA_ACCESS_TOKEN_SECRET = key(64);
  process.env.ZIGARA_COOKIE_SECRET = key(64);
}

const app = express();

// Set Security HTTP Headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit Request from same API
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again in an hour!",
});


app.use(cors());

app.set("view engine", "ejs");
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.static("views"));

app.use(cookieSession({
  maxAge: 6*60*60*1000,
  keys: [`${process.env.cookieKey}`]
}))

// Initialize passport
app.use(passport.initialize())
app.use(passport.session())

// Data sanitize against NoSQL Query Injection
app.use(mongoSanitize()); // Checks the request headers, query strings, params for malicious codes

// Import all routes
// const { userRouter } = require("./routes/user/index");



//default Route
app.get("/", (req, res) => {
  res.json({ message: `Welcome to Zigara API v1` });
});

// Home Route
app.get("/api/v1/home", (req, res) => {
  return successResMsg(res, 200, { message: "Welcome to Zigara API" });
});

//   Routes Middleware
app.use("/api/v1/auth", authRouter);
// app.use("/api/v1/user", userRouter);

// adminRouter(app);

app.use(userRoutes)
app.use(contactRoutes)

// Unhandled Routes
app.all("*", (req, res) => {
  res.status(404).json({ message: `Can't find resource ${req.originalUrl} on this server` });
});

// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
