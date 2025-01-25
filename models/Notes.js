const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
