const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  questionName: String,
  questionImage: String,
  questionSubject: String,
  userPhoto: String,
  userType: String,
  uid: String,
  postedBy: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  answers: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Answers",
  },
  votes: {
    upvote: {
      type: Number,
      default: 0,
    },
    downvote: {
      type: Number,
      default: 0,
    },
  },
});

module.exports = mongoose.model("Questions", QuestionSchema);
