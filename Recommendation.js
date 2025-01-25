// Import necessary modules
const express = require("express");
const router = express.Router();
const Post = require("./models/Post"); // Now we're using the Post model
const User = require("./models/User");
const { cosineSimilarity } = require("./utils/similarity");

// Content-based recommendation route
router.get("/recommendations/content/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send("User not found.");

    // Fetch all posts and compute similarity based on user profile
    const posts = await Post.find();
    const recommendations = posts
      .map((post) => ({
        post,
        score: cosineSimilarity(user.profileVector, post.vector), // Adjust similarity calculation as needed
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Top 10 recommendations

    res.json(recommendations.map((r) => r.post));
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error.");
  }
});

// Collaborative filtering route
router.get("/recommendations/collaborative/:userId", async (req, res) => {
  // Implementation of collaborative filtering logic here
});

module.exports = router;
