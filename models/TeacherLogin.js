const mongoose = require("mongoose");

const teacherLoginSchema = new mongoose.Schema(
  {
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
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeacherRegister",
    },
  },
  {
    timestamps: true,
  }
);

const TeacherLogin = mongoose.model("TeacherLogin", teacherLoginSchema);

module.exports = TeacherLogin;
