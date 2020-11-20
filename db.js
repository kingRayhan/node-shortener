const mongoose = require("mongoose");
require("colors");

mongoose
  .connect(
    "mongodb+srv://nodejs-shortener:nodejs-shortener@cluster0.tl0w4.mongodb.net/nodejs-shortener",
    {
      useNewUrlParser: true,
    }
  )
  .then((c) => {
    console.log("Database connected".green);
  })
  .catch((e) => {
    console.log("Can not connect to db".red);
  });
