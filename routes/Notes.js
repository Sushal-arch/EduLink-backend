const express = require("express");
const router = express.Router();

const noteDB = require("../models/Notes");

const semester = [
  { name: "First Semester", value: "First Semester" },
  { name: "Second Semester", value: "Second Semester" },
  { name: "Third Semester", value: "Third Semester" },
  { name: "Fourth Semester", value: "Fourth Semester" },
  { name: "Fifth Semester", value: "Fifth Semester" },
  { name: "Sixth Semester", value: "Sixth Semester" },
  { name: "Seventh Semester", value: "Seventh Semester" },
  { name: "Eight Semester", value: "Eight Semester" },
];

router.get("/", async (req, res) => {
  try {
    res.json({
      status: true,
      message: "Semester retrieved successfully",
      data: semester,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error while fetching semester",
      data: error.message,
    });
  }
});

module.exports = router;
