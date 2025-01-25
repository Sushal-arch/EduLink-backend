const express = require("express");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const TeacherRegister = require("../models/TeacherRegister");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { username, email, photo, subjects, password } = req.body;

    if (!username || !email || !password || !subjects || !subjects.length) {
      return res.status(400).json({
        error:
          "Username, email, password, and at least one subject are required fields",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingTeacher = await TeacherRegister.findOne({
      $or: [{ email }, { uid: uuidv4() }],
    });
    if (existingTeacher) {
      return res
        .status(400)
        .json({ error: "Duplicate teacher entry is not allowed" });
    }

    const uid = uuidv4();

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacherRegister = new TeacherRegister({
      username,
      email,
      photo,
      uid,
      subjects: subjects.map((subject) => ({ name: subject })),
      password: hashedPassword,
    });

    await teacherRegister.save();

    res.status(201).json({
      message: "Teacher registration successful",
      data: teacherRegister,
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
