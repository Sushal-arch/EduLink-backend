const mongoose = require("mongoose");

const teacherRegisterSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    },
    uid: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      default: "Teacher",
    },
    subjects: [
      {
        name: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const TeacherRegister = mongoose.model("TeacherRegister", teacherRegisterSchema);

module.exports = TeacherRegister;
