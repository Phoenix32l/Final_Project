// imports
require('dotenv').config(); // Load environment variables from a .env file
const express = require('express'); // Express web framework
const mongoose = require('mongoose'); // MongoDB ODM (Object-Document Mapper)
const session = require('express-session'); // Session middleware for Express

// Create an instance of the Express application
const app = express();

// Set the port to either the one specified in the environment variables or 5000
const PORT = process.env.PORT || 5000;

// Connect to the MongoDB database using the provided URI
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Event listeners for database connection status
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to the database!"));

// Middlewares

// Parse URL-encoded and JSON request bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Session middleware setup
app.use(
  session({
    secret: 'my secret key', // Secret used to sign the session ID cookie
    saveUninitialized: true, // Save uninitialized session (new but not modified)
    resave: false // Do not save session if not modified
  })
);

// Middleware to pass session messages to views and delete them afterwards
app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

// Serve static files from the "uploads" directory
app.use(express.static("uploads"));
app.use(express.static("public"));

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Route prefix, using the routes defined in the "routes.js" file
app.use("", require("./routes/routes"));

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});