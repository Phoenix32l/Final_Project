const express = require("express");
const router = express.Router();
const User = require("../models/users");
const multer = require("multer");
const fs = require("fs").promises; // Use the promises version of fs for async/await

// Multer Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
});

const upload = multer({
    storage: storage,
}).single("image");

// Route for Adding a New Recipe
router.post("/add", upload, async (req, res) => {
    try {
        const user = new User({
            dish: req.body.dish,
            ingredients: req.body.ingredients,
            instructions: req.body.instructions,
            image: req.file.filename,
        });

        await user.save();

        req.session.message = {
            type: "success",
            message: "Recipe added successfully!",
        };
        res.redirect("/");
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

// Render the Form to Add a New Recipe
router.get("/", async (req, res) => {
    try {
        const users = await User.find().exec();

        res.render("index", {
            title: "Recipe Book",
            users: users,
        });
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

router.get("/add", (req, res) => {
    res.render("add_dish", { title: "Add Recipe" });
});

// Edit
router.get("/edit/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).exec();

        if (!user) {
            return res.redirect("/");
        }

        res.render("edit_dish", {
            title: "Edit Recipe",
            user: user,
        });
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

// Update dish
router.post("/update/:id", upload, async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).exec();

        if (!user) {
            return res.redirect("/");
        }

        let new_image = "";

        if (req.file) {
            new_image = req.file.filename;
            await fs.unlink("./uploads" + req.body.old_image);
        } else {
            new_image = req.body.old_image;
        }

        await User.findByIdAndUpdate(id, {
            dish: req.body.dish,
            ingredients: req.body.ingredients,
            instructions: req.body.instructions,
            image: new_image,
        });

        req.session.message = {
            type: "success",
            message: "Recipe updated successfully!",
        };
        res.redirect("/");
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});


// Delete dish
router.get("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const result = await User.findByIdAndDelete(id).exec();

        if (result.image !== "") {
            await fs.unlink("./uploads/" + result.image);
        }

        req.session.message = {
            type: "info",
            message: "Recipe deleted successfully!",
        };
        res.redirect("/");
    } catch (err) {
        res.json({ message: err.message });
    }
});



// Contact page route
router.get("/contact", (req, res) => {
    res.render("contact", { title: "Contact" });
});

router.post("/contact", async (req, res) => {
    try {
        req.session.message = {
            type: "success",
            message: "Your message has been sent successfully!",
        };
        res.redirect("/contact");
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

module.exports = router;