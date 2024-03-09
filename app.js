const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

const authRoutes = require("./routes/auth");


const PORT = process.env.PORT || 3000;
const { MONGODB_URI } = process.env;

app.use(bodyParser.json());

app.use("/auth", authRoutes);


mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
