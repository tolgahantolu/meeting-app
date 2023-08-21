import express from "express";
import dotenv from "dotenv";
import Boom from "@hapi/boom";
import auth from "./routes/auth";
import webhooks from "./routes/webhooks";

dotenv.config();
const app = express();

// middlewares
app.use(express.json());

// midd routes
app.use("/auth", auth);
app.use("/webhooks", webhooks);

app.use((req, res, next) => {
  return next(Boom.notFound("Not found!"));
});

app.use((err, req, res, next) => {
  if (err?.output) {
    return res.status(err.output.statusCode || 500).json(err.output.payload);
  }

  return res.status(500).json(err);
});

app.listen(4000, () => {
  console.log("Server started on port 4000 🚀");
});
