const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const answerDB = require("../models/Answer");
const Filter = require("bad-words");

const profanityWordsFilePath = path.join(__dirname, "profanityWords.json");
const customProfanityWords = JSON.parse(
  fs.readFileSync(profanityWordsFilePath)
);

const profanityFilter = new Filter();
customProfanityWords.forEach((wordObject) => {
  const { value } = wordObject;
  profanityFilter.addWords(value);
});

router.post("/", async (req, res) => {
  if (profanityFilter.isProfane(req.body.answer.toLowerCase())) {
    return res.status(400).send({
      status: false,
      message: "Cannot add answer with offensive words",
    });
  }
  try {
    await answerDB
      .create({
        answer: req.body.answer,
        questionId: req.body.questionId,
        user: req.body.user,
        createdAt: req.body.createdAt,
      })
      .then(() => {
        res.status(201).send({
          status: true,
          message: "Answer added successfully",
        });
      })

      .catch((e) => {
        res.status(400).send({
          status: false,
          message: "Bad request",
        });
      });
  } catch (e) {
    res.status(500).send({
      status: false,
      message: "Error while adding answer",
    });
  }
});

module.exports = router;
