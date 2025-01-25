const mongoose = require("mongoose");
const username = encodeURIComponent("sushalpokharel@gmail.com");
const password = encodeURIComponent("Dobby@1234"); // Use encodeURIComponent for the password
const url = `mongodb+srv://sushaltukilogic:8EOuwBoBG8I7vksB@defence.1q5pz.mongodb.net/education?retryWrites=true&w=majority&appName=Defence`;

module.exports.connect = () => {
  mongoose
    .connect(url, {})
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((error) => console.log("Error: ", error));
};
