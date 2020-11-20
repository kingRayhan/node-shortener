const mongoose = require("mongoose");
require("colors");

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
  })
  .then((c) => {
    console.log("Database connected".green);
  })
  .catch((e) => {
    console.log("Can not connect to db".red);
  });
