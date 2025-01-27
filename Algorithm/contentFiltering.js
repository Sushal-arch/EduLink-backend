const natural = require("natural");
const cosineSimilarity = require("compute-cosine-similarity");

// Function to calculate content-based similarity
function calculateSimilarity(questions, targetQuestion) {
  const tokenizer = new natural.WordTokenizer();

  // Tokenize and prepare all questions for vectorization
  const questionTokens = questions.map((q) =>
    tokenizer.tokenize(q.questionName.toLowerCase())
  );
  const targetTokens = tokenizer.tokenize(targetQuestion.toLowerCase());

  // Log the tokenized questions and target question
  console.log("Tokenized Questions:", questionTokens);
  console.log("Target Question Tokens:", targetTokens);

  // Create a combined vocabulary
  const vocabulary = [...new Set(questionTokens.flat().concat(targetTokens))];

  // Log the combined vocabulary
  console.log("Vocabulary:", vocabulary);

  // Vectorize questions and the target question
  const vectorize = (tokens) => {
    return vocabulary.map(
      (word) => tokens.filter((token) => token === word).length
    );
  };

  const questionVectors = questionTokens.map((tokens) => vectorize(tokens));
  const targetVector = vectorize(targetTokens);

  // Calculate cosine similarity for each question
  const similarities = questions.map((q, index) => {
    const similarity = Number(
      cosineSimilarity(questionVectors[index], targetVector)
    );

    const upvoteCount = q.votes.upvote || 0;
    // Boost the similarity by the upvote count
    const weightedSimilarity = similarity * (1 + upvoteCount / 100);

    return {
      question: q,
      similarity,
      upvotes: upvoteCount,
      weightedSimilarity,
    };
  });

  // Sort by similarity in descending order
  const sortedSimilarities = similarities.sort(
    (a, b) => b.weightedSimilarity - a.weightedSimilarity
  );

  return sortedSimilarities;
}

module.exports = { calculateSimilarity };

// const natural = require("natural");
// const cosineSimilarity = require("compute-cosine-similarity");

// // Function to calculate content-based similarity
// function calculateSimilarity(questions, targetQuestion) {
//   const tokenizer = new natural.WordTokenizer();

//   // Tokenize and prepare all questions for vectorization
//   const questionTokens = questions.map((q) => {
//     const tokens = tokenizer.tokenize(
//       q.questionName.toLowerCase().replace(/[^\w\s]/g, " ")
//     ); // Keep whitespace

//     return tokens;
//   });

//   const targetTokens = tokenizer.tokenize(
//     targetQuestion.toLowerCase().replace(/[^\w\s]/g, "")
//   );

//   // Create a combined vocabulary
//   const vocabulary = [...new Set(questionTokens.flat().concat(targetTokens))];

//   // Vectorize the questions and the target question
//   const vectorize = (tokens) => {
//     return vocabulary.map(
//       (word) => tokens.filter((token) => token === word).length
//     );
//   };

//   const questionVectors = questionTokens.map((tokens) => vectorize(tokens));
//   const targetVector = vectorize(targetTokens);

//   // Check if the vectors are all zeros (cosine similarity cannot be calculated)
//   if (
//     questionVectors.some((vector) => vector.every((val) => val === 0)) ||
//     targetVector.every((val) => val === 0)
//   ) {
//     return [];
//   }

//   // Calculate cosine similarity for each question
//   const similarities = questions.map((q, index) => {
//     const similarity = cosineSimilarity(questionVectors[index], targetVector);
//     return {
//       question: q,
//       similarity: similarity,
//     };
//   });

//   // Sort by similarity in descending order
//   return similarities.sort((a, b) => b.similarity - a.similarity);
// }

// module.exports = { calculateSimilarity };
