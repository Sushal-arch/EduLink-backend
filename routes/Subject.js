const express = require("express");
const router = express.Router();

const subjectDB = require("../models/Subject");

const subjects = [
  { name: "Advanced Java", value: "Advanced Java" },
  { name: "Data Warehouse", value: "Data Warehouse" },
  { name: "PoM", value: "PoM" },
  { name: "Project Work", value: "Project Work" },
  { name: "Information Retrieval", value: "Information Retrieval" },
  { name: "Database Administration", value: "Database Administration" },
  { name: "Software Project Management", value: "Software Project Management" },
  { name: "Network Security", value: "Network Security" },
  { name: "Digital System Design", value: "Digital System Design" },
  { name: "Network and System Administration", value: "Network and System Administration" },
  { name: "International Marketing", value: "International Marketing" },
];

router.get("/", async (req, res) => {
  try {
    res.json({
      status: true,
      message: "Subjects retrieved successfully",
      data: subjects,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error while fetching subjects",
      data: error.message,
    });
  }
});

module.exports = router;
