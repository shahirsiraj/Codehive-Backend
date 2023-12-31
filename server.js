require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.use(
  cors({
    origin: "*",
  })
);

app.options("*", cors());

accessToken = "";
/////////////////////////////// IMPORT ROUTERS /////////////////////////////
const userRouter = require("./routers/users_router");
const postRouter = require("./routers/posts_router");
const commentsRouter = require("./routers/comments_router");
const githubRouter = require("./routers/github_router");
const authMiddleware = require("./middleware/middleware");

///////////////////////////   API ENDPOINT ROUTES //////////////////////////

app.use("/api/users", userRouter);
// app.use("/api/users/:userId", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentsRouter);
app.use("api/github", githubRouter);

//////////////////// API ENDPOINT ROUTES WITH MEDIA ////////////////////////
// app.post("/posts", authMiddleware, upload.single("picture"), createPost);

/////////////////////////////// LISTENER //////////////////////////////////
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log(`MongoDB, ${process.env.MONGO_USER} connected`);

    app.listen(PORT, () => {
      console.log("GitHive App running on port: ", PORT);
    });
  })
  .catch((err) => {
    console.log("Error connecting" + err);
  });
