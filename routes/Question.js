// const express = require("express");
// const router = express.Router();
// const fs = require("fs");
// const path = require("path");
// const multer = require("multer");
// const questionDB = require("../models/Question");
// const Filter = require("bad-words");
// const sharp = require("sharp");
// const {
//   finalData,
//   findPrioritySubject,
//   findPriority,
//   findRealData,
//   findDataVoted,
// } = require("../Algorithm");

// const multerStorage = multer.memoryStorage();
// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Not an image! Please upload only images."));
//   }
// };

// const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

// const profanityWordsFilePath = path.join(__dirname, "profanityWords.json");
// const customProfanityWords = JSON.parse(
//   fs.readFileSync(profanityWordsFilePath)
// );

// const profanityFilter = new Filter();
// customProfanityWords.forEach((wordObject) => {
//   const { value } = wordObject;
//   profanityFilter.addWords(value);
// });

// router.post("/", upload.single("questionImage"), async (req, res) => {
//   if (
//     profanityFilter.isProfane(req.body.questionName.toLowerCase()) ||
//     profanityFilter.isProfane(req.body.questionSubject.toLowerCase())
//   ) {
//     return res.status(400).send({
//       status: false,
//       message: "Cannot add a question with offensive words",
//     });
//   }
//   // try {
//   //   const originalQuestionImageName = req.file.originalname.split(".")[0];
//   //   const questionImageName = `question-${originalQuestionImageName}-${Date.now()}.jpeg`;

//   //   await sharp(req.file.buffer)
//   //     .toFormat("jpeg")
//   //     .jpeg({ quality: 90 })
//   //     .toFile(
//   //       path.join(__dirname, `../img/questionImages/${questionImageName}`)
//   //     );

//   //   await questionDB.create({
//   //     questionName: req.body.questionName,
//   //     questionSubject: req.body.questionSubject,
//   //     questionImage: questionImageName,
//   //     uid: req.body.uid,
//   //     postedBy: req.body.postedBy,
//   //     createdAt: req.body.createdAt,
//   //     userType: req.body.userType,
//   //     userPhoto: req.body.userPhoto,
//   //   });

//   //   res.status(201).send({
//   //     status: true,
//   //     message: "Question added successfully",
//   //   });
//   // }
//   try {
//     let questionImageName = null; // Initialize to null

//     // Only process the image if it exists
//     if (req.file) {
//       const originalQuestionImageName = req.file.originalname.split(".")[0];
//       questionImageName = `question-${originalQuestionImageName}-${Date.now()}.jpeg`;

//       await sharp(req.file.buffer)
//         .toFormat("jpeg")
//         .jpeg({ quality: 90 })
//         .toFile(
//           path.join(__dirname, `../img/questionImages/${questionImageName}`)
//         );
//     }

//     // Save the question to the database, image is optional
//     await questionDB.create({
//       questionName: req.body.questionName,
//       questionSubject: req.body.questionSubject,
//       questionImage: questionImageName, // Can be null if no image is uploaded
//       uid: req.body.uid,
//       postedBy: req.body.postedBy,
//       createdAt: req.body.createdAt,
//       userType: req.body.userType,
//       userPhoto: req.body.userPhoto,
//     });

//     res.status(201).send({
//       status: true,
//       message: "Question added successfully",
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).send({
//       status: false,
//       message: "Error while adding the question tttt",
//     });
//   }
// });
// router.get("/", async (req, res) => {
//   const userId = req.query.uid;
//   const subjects = await questionDB
//     .find({ uid: userId })
//     .select("questionSubject");
//   // console.log("reqreq", subjects);
//   try {
//     await questionDB
//       .aggregate([
//         {
//           $lookup: {
//             from: "answers",
//             localField: "_id",
//             foreignField: "questionId",
//             as: "allAnswers",
//           },
//         },
//       ])
//       .exec()
//       .then((doc) => {
//         if (subjects.length > 0) {
//           const priorityList = findPrioritySubject(subjects);
//           const gotRealData = finalData(doc, priorityList);
//           // for vote start
//           const votedResult = findDataVoted(gotRealData);
//           // console.log("votedResult---", votedResult);
//           //for vote end
//           const realDataP = findPriority(votedResult);
//           // console.log("votedResult---", realDataP);
//           const realData = findRealData(realDataP);
//           res.status(200).send(realData);
//         } else {
//           res.status(200).send(doc);
//         }
//       })
//       .catch((error) => {
//         res.status(500).send({
//           status: false,
//           message: "Unable to get the question details" + error,
//         });
//       });
//   } catch (e) {
//     res.status(500).send({
//       status: false,
//       message: "Unexpected error",
//     });
//   }
// });

// router.put("/:questionId", async (req, res) => {
//   const { questionId } = req.params;
//   const { questionName, questionUrl, questionSubject, questionImage } =
//     req.body;

//   try {
//     if (
//       profanityFilter.isProfane(questionName) ||
//       profanityFilter.isProfane(questionSubject)
//     ) {
//       return res.status(400).json({
//         status: false,
//         message: "Cannot update a question with offensive words",
//       });
//     }

//     const updatedQuestion = await questionDB.findByIdAndUpdate(
//       questionId,
//       {
//         $set: {
//           questionName,
//           questionUrl,
//           questionImage,
//           questionSubject,
//         },
//       },
//       { new: true }
//     );

//     if (!updatedQuestion) {
//       return res.status(404).json({ message: "Question not found" });
//     }

//     res.status(200).json({
//       status: true,
//       message: "Question updated successfully",
//       updatedQuestion,
//     });
//   } catch (error) {
//     console.error("Error updating question:", error);
//     res.status(500).json({ status: false, message: "Internal Server Error" });
//   }
// });

// router.delete("/:questionId", async (req, res) => {
//   const { questionId } = req.params;

//   try {
//     const deletedQuestion = await questionDB.findByIdAndDelete(questionId);

//     if (!deletedQuestion) {
//       return res.status(404).json({ message: "Question not found" });
//     }

//     res.status(200).json({
//       status: true,
//       message: "Question deleted successfully",
//       deletedQuestion,
//     });
//   } catch (error) {
//     console.error("Error deleting question:", error);
//     res.status(500).json({ status: false, message: "Internal Server Error" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const questionDB = require("../models/Question");
const Filter = require("bad-words");
const sharp = require("sharp");
const { calculateSimilarity } = require("../Algorithm/contentFiltering");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."));
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

const profanityWordsFilePath = path.join(__dirname, "profanityWords.json");
const customProfanityWords = JSON.parse(
  fs.readFileSync(profanityWordsFilePath)
);

const profanityFilter = new Filter();
customProfanityWords.forEach((wordObject) => {
  const { value } = wordObject;
  profanityFilter.addWords(value);
});

// router.post("/", upload.single("questionImage"), async (req, res) => {
//   if (
//     profanityFilter.isProfane(req.body.questionName.toLowerCase()) ||
//     profanityFilter.isProfane(req.body.questionSubject.toLowerCase())
//   ) {
//     return res.status(400).send({
//       status: false,
//       message: "Cannot add a question with offensive words",
//     });
//   }
//   try {
//     let questionImageName = null; // Initialize to null

//     // Only process the image if it exists
//     if (req.file) {
//       const originalQuestionImageName = req.file.originalname.split(".")[0];
//       questionImageName = `question-${originalQuestionImageName}-${Date.now()}.jpeg`;
//       await sharp(req.file.buffer)
//         .toFormat("jpeg")
//         .jpeg({ quality: 90 })
//         .toFile(
//           path.join(__dirname, `../img/questionImages/${questionImageName}`)
//         );
//     }

//     // Save the question to the database, image is optional
//     await questionDB.create({
//       questionName: req.body.questionName,
//       questionSubject: req.body.questionSubject,
//       questionImage: questionImageName, // Can be null if no image is uploaded
//       uid: req.body.uid,
//       postedBy: req.body.postedBy,
//       createdAt: req.body.createdAt || new Date(),
//       userType: req.body.userType,
//       userPhoto: req.body.userPhoto,
//     });

//     // const allQuestions = await questionDB.find();
//     // const recommendations = calculateSimilarity(
//     //   allQuestions,
//     //   req.body.questionName // Use the newly added question as the target
//     // );

//     res.status(201).send({
//       status: true,
//       message: "Question added successfully",
//       // recommendations,
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).send({
//       status: false,
//       message: "Error while adding the question",
//     });
//   }
// });
router.post("/", upload.single("questionImage"), async (req, res) => {
  if (
    profanityFilter.isProfane(req.body.questionName.toLowerCase()) ||
    profanityFilter.isProfane(req.body.questionSubject.toLowerCase())
  ) {
    return res.status(400).send({
      status: false,
      message: "Cannot add a question with offensive words",
    });
  }

  try {
    let imageUrl = null; // Initialize image URL

    // If an image is uploaded, upload it to Cloudinary
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "question_images" }, // Cloudinary folder
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        );
        uploadStream.end(req.file.buffer); // Use Multer buffer
      });

      imageUrl = result.secure_url; // Get Cloudinary image URL
    }

    // Save the question to the database
    await questionDB.create({
      questionName: req.body.questionName,
      questionSubject: req.body.questionSubject,
      questionImage: imageUrl, // Save Cloudinary URL
      uid: req.body.uid,
      postedBy: req.body.postedBy,
      createdAt: req.body.createdAt || new Date(),
      userType: req.body.userType,
      userPhoto: req.body.userPhoto,
    });

    res.status(201).send({
      status: true,
      message: "Question added successfully",
    });
  } catch (error) {
    console.error("Error while adding the question:", error);
    res.status(500).send({
      status: false,
      message: "Error while adding the question",
    });
  }
});

// router.get("/", async (req, res) => {
//   const userId = req.query.uid;

//   try {
//     // First, get all questions with answers
//     const questions = await questionDB.aggregate([
//       {
//         $lookup: {
//           from: "answers",
//           localField: "_id",
//           foreignField: "questionId",
//           as: "allAnswers",
//         },
//       },
//       {
//         $project: {
//           questionName: 1,
//           questionSubject: 1,
//           createdAt: 1,
//           questionImage: 1,
//           userPhoto: 1,
//           userType: 1,
//           postedBy: 1,
//           uid: 1,
//           votes: 1,
//           allAnswers: 1,
//         },
//       },
//     ]);

//     // If no questions exist, return an empty response
//     if (!questions.length) {
//       return res.status(200).send({
//         status: true,
//         message: "No questions found",
//         recommendations: [],
//       });
//     }

//     // Fetch the most recent question for the given userId
//     const targetQuestion = await questionDB.aggregate([
//       {
//         $match: {
//           uid: userId, // Match questions by the provided userId
//         },
//       },
//       {
//         $lookup: {
//           from: "answers",
//           localField: "_id",
//           foreignField: "questionId",
//           as: "allAnswers",
//         },
//       },
//       {
//         $sort: {
//           createdAt: -1, // Sort by createdAt to get the most recent first
//         },
//       },
//       {
//         $limit: 1, // Limit to 1 to get the latest question
//       },
//     ]);

//     // Check if targetQuestion array is empty or if the first element is missing
//     if (
//       !targetQuestion ||
//       targetQuestion.length === 0 ||
//       !targetQuestion[0].questionName
//     ) {
//       return res.status(200).send({
//         status: true,
//         message: "Questions retrieved successfully",
//         questions, // Return all questions in the response
//       });
//     }

//     // Assuming calculateSimilarity takes the questions and targetQuestion to generate recommendations
//     const recommendations = calculateSimilarity(
//       questions,
//       targetQuestion[0].questionName || "" // Safeguard with empty string fallback
//     );

//     // Send the successful response with recommendations
//     res.status(200).send({
//       status: true,
//       message: "Questions retrieved successfully",
//       recommendations,
//     });
//   } catch (error) {
//     // Log and send an error response if any issue occurs
//     console.error("Error retrieving questions:", error);
//     res.status(500).send({
//       status: false,
//       message: "Unable to get the question details: " + error.message,
//     });
//   }
// });

router.get("/", async (req, res) => {
  const userId = req.query.uid;

  try {
    // Get all questions with answers
    const questions = await questionDB.aggregate([
      {
        $lookup: {
          from: "answers",
          localField: "_id",
          foreignField: "questionId",
          as: "allAnswers",
        },
      },
      {
        $project: {
          questionName: 1,
          questionSubject: 1,
          createdAt: 1,
          questionImage: 1,
          userPhoto: 1,
          userType: 1,
          postedBy: 1,
          uid: 1,
          votes: 1,
          allAnswers: 1,
        },
      },
    ]);

    if (!questions.length) {
      return res.status(200).send({
        status: true,
        message: "No questions found",
        recommendations: [], // Always return recommendations, even if empty
      });
    }

    // If a user has a question, retrieve it
    const targetQuestion = await questionDB.aggregate([
      {
        $match: {
          uid: userId, // Match questions by the userId
        },
      },
      {
        $lookup: {
          from: "answers",
          localField: "_id",
          foreignField: "questionId",
          as: "allAnswers",
        },
      },
      {
        $sort: {
          createdAt: -1, // Sort by creation date
        },
      },
      {
        $limit: 1, // Limit to 1 most recent question
      },
    ]);

    // Check if a target question is found for the user
    if (
      !targetQuestion ||
      targetQuestion.length === 0 ||
      !targetQuestion[0].questionName
    ) {
      // No user-specific question, return all questions
      return res.status(200).send({
        status: true,
        message: "Questions retrieved successfully",
        recommendations: questions, // Return all questions
      });
    }

    // Generate recommendations based on similarity
    const recommendations = calculateSimilarity(
      questions,
      targetQuestion[0].questionName || "" // Fallback to empty string if no questionName
    );

    // Send the response with recommendations
    res.status(200).send({
      status: true,
      message: "Questions retrieved successfully",
      recommendations,
    });
  } catch (error) {
    console.error("Error retrieving questions:", error);
    res.status(500).send({
      status: false,
      message: "Unable to get the question details: " + error.message,
    });
  }
});

// router.put("/:questionId", async (req, res) => {
//   const { questionId } = req.params;
//   const { questionName, questionUrl, questionSubject, questionImage } =
//     req.body;

//   try {
//     if (
//       profanityFilter.isProfane(questionName) ||
//       profanityFilter.isProfane(questionSubject)
//     ) {
//       return res.status(400).json({
//         status: false,
//         message: "Cannot update a question with offensive words",
//       });
//     }

//     const updatedQuestion = await questionDB.findByIdAndUpdate(
//       questionId,
//       {
//         $set: {
//           questionName,
//           questionUrl,
//           questionImage,
//           questionSubject,
//         },
//       },
//       { new: true }
//     );

//     if (!updatedQuestion) {
//       return res.status(404).json({ message: "Question not found" });
//     }

//     res.status(200).json({
//       status: true,
//       message: "Question updated successfully",
//       updatedQuestion,
//     });
//   } catch (error) {
//     console.error("Error updating question:", error);
//     res.status(500).json({ status: false, message: "Internal Server Error" });
//   }
// });

router.put("/:questionId", upload.single("questionImage"), async (req, res) => {
  const { questionId } = req.params;
  const { questionName, questionSubject } = req.body;

  try {
    if (
      profanityFilter.isProfane(questionName) ||
      profanityFilter.isProfane(questionSubject)
    ) {
      return res.status(400).json({
        status: false,
        message: "Cannot update a question with offensive words",
      });
    }

    let imageUrl = null;

    // If a new image is uploaded, upload it to Cloudinary
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "question_images" },
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      imageUrl = result.secure_url; // Get Cloudinary image URL
    }

    // Prepare the updated data
    const updatedData = {
      questionName,
      questionSubject,
    };

    if (imageUrl) {
      updatedData.questionImage = imageUrl; // Update the image if a new one is uploaded
    }

    const updatedQuestion = await questionDB.findByIdAndUpdate(
      questionId,
      { $set: updatedData },
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json({
      status: true,
      message: "Question updated successfully",
      updatedQuestion,
    });
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
});

router.delete("/:questionId", async (req, res) => {
  const { questionId } = req.params;

  try {
    const deletedQuestion = await questionDB.findByIdAndDelete(questionId);

    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json({
      status: true,
      message: "Question deleted successfully",
      deletedQuestion,
    });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
});

module.exports = router;
