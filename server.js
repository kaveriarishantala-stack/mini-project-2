const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/movieDB")
.then(() => console.log("MongoDB Connected Successfully"))
.catch((err) => console.log("Database Connection Error:", err));

// Movie Schema
const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    director: {
        type: String,
        required: true
    },
    releaseYear: {
        type: Number,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 10
    }
});

// Movie Model
const Movie = mongoose.model("Movie", movieSchema);


// ---------------- CRUD OPERATIONS ---------------- //

// CREATE - Add movie
app.post("/movies", async (req, res) => {
    try {
        const movie = new Movie(req.body);
        await movie.save();
        res.status(201).json({
            message: "Movie added successfully",
            movie
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// READ - Get all movies
app.get("/movies", async (req, res) => {
    try {
        const movies = await Movie.find();
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ - Get single movie by ID
app.get("/movies/:id", async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE - Update movie
app.put("/movies/:id", async (req, res) => {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedMovie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        res.status(200).json({
            message: "Movie updated successfully",
            updatedMovie
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE - Remove movie
app.delete("/movies/:id", async (req, res) => {
    try {
        const deletedMovie = await Movie.findByIdAndDelete(req.params.id);

        if (!deletedMovie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        res.status(200).json({
            message: "Movie deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Server Start
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});