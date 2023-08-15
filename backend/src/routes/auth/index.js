import express from "express";
import Boom from "@hapi/boom";

const router = express.Router();

router.post("/register", (req, res, next) => {
  const input = req.body.input.data;

  if (!input.email || !input.password) {
    return next(
      Boom.badRequest(
        "Your data is not valid! Please check your email and password then try again."
      )
    );
  }

  console.log("input", input);
  res.json({ accessToken: "accessToken" });
});

export default router;
