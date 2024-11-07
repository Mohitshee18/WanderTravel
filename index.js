const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");

dotenv.config();

const app = express();

const userRoutes = require("./routes/User");
const categoryRoutes = require("./routes/Category");
const listingRoutes = require("./routes/Listing");
const reviewRoutes = require("./routes/Review");

require("./config/database").dbConnect();
require("./config/cloudinary").cloudinaryConnect();

const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "https://wanderlust-ivory.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "CORS policy does not allow access from this origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS", // Include OPTIONS
    allowedHeaders: "Content-Type,Authorization,Accept", // Ensure you include all necessary headers
    optionsSuccessStatus: 204, // For legacy browsers
    credentials: true, // Allow cookies or auth headers
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

app.use("/api/v2/auth", userRoutes);
app.use("/api/v2/category", categoryRoutes);
app.use("/api/v2/listing", listingRoutes);
app.use("/api/v2/review", reviewRoutes);

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is active and running ....",
  });
});

app.get("/test", (req, res) => {
  res.send("Test route is working ...");
});

app.listen(port, () => {
  console.log(`Server is running at port ${port} ...`);
});
