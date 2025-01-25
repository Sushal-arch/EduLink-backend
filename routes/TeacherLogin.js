const express = require("express");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const TeacherRegister = require("../models/TeacherRegister");
const router = express.Router();

router.post(
  "/",
  [
    check("email", "Email is required").notEmpty(),
    check("password", "Password is required").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      const teacher = await TeacherRegister.findOne({ email });

      if (!teacher) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const passwordMatch = await bcrypt.compare(password, teacher.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const { _id, username, uid, type, subjects, createdAt, updatedAt, __v } =
        teacher;
      const responseData = {
        _id,
        username,
        email,
        uid,
        type,
        subjects,
        createdAt,
        updatedAt,
        __v,
      };

      res.status(200).json({ message: "Login successful", data: responseData });
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
