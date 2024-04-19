const express = require("express");
const session = require("express-session");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const { SitemapStream, streamToPromise } = require("sitemap");
const { createGzip } = require("zlib");
const connectDB = require("./config/db");
require("dotenv").config();
const MongoStore = require("connect-mongo"); // Import connect-mongo

// Configure express-session middleware with connect-mongo
app.use(session({
  secret: 'this_is_my_secret_key',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI
  })
}));

// Function to check if the user is authenticated (session variable set)
function isAuthenticated(req, res, next) {
  if (req.session.success) {
    return next();
  }
  res.redirect("/");
}

// Define routes
const routes = [
  { url: "/", changefreq: "weekly", priority: 1 },
  // Add more routes as needed
];

// Generate sitemap
const generateSitemap = async () => {
  const sitemapStream = new SitemapStream({
    hostname: "https://adhilakbar.in",
  });
  const pipeline = sitemapStream.pipe(createGzip());

  routes.forEach((route) => {
    sitemapStream.write(route);
  });

  sitemapStream.end();

  return streamToPromise(pipeline);
};

// Serve sitemap
app.get("/sitemap.xml", async (req, res) => {
  try {
    const sitemap = await generateSitemap();
    res.header("Content-Type", "application/xml");
    res.header("Content-Encoding", "gzip");
    sitemap.pipe(res).once("error", (err) => {
      res.status(500).end();
    });
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});

connectDB();

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Set the view engine to EJS
app.set("view engine", "ejs");
app.use(expressLayouts);

// Set static folder
app.use(express.static("public"));

// Set the directory where the layout file is located
app.set("layout", "layout"); // Refers to views/layout.ejs

// Routes
app.get("/", (req, res) => {
  res.render("pages/index", { title: "Teens Meet" });
});

// Route to set session variable upon successful submission
app.get("/setSuccessSession", (req, res) => {
  req.session.success = true;
  res.json({ success: true });
});

// Render the response page only if the user is authenticated
app.get("/response", isAuthenticated, (req, res) => {
  res.render("pages/response", { title: "Teens Meet" });
});

const delegates = require("./routes/delegates");

app.use("/delegates", delegates);

// Start the server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
