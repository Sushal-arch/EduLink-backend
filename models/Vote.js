const mongoose = require("mongoose");

const VoteSchema = new mongoose.Schema({
  voteType: {
    type: String,
    enum: ["upvote", "downvote"],
    required: true,
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Questions",
    required: true,
  },
  user: Object,
});

module.exports = mongoose.model("Votes", VoteSchema);
