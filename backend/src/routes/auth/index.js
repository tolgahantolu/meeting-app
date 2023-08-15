import express from "express";
import Boom from "@hapi/boom";
import bcrypt from "bcryptjs";
import Hasura from "../../clients/hasura";
import { IS_USER_EXIST, MUTATION_INSERT_USER } from "./queries";
import { registerSchema } from "./validations";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  const input = req.body.input.data;

  input.email = input.email.toLowerCase();

  const { error } = registerSchema.validate(input);

  if (error) return next(Boom.badRequest(error.details[0].message));

  //  if (!input.email || !input.password) {
  //    return next(
  //      Boom.badRequest(
  //        "Your data is not valid! Please check your email and password then try again."
  //      )
  //    );
  //  }

  try {
    const isUserExist = await Hasura.request(IS_USER_EXIST, {
      email: input.email,
    });

    if (isUserExist.mt_users.length > 0)
      throw Boom.conflict(`User already exist! (${input.email})`);

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(input.password, salt);

    const user = await Hasura.request(MUTATION_INSERT_USER, {
      input: {
        ...input,
        password: hash,
      },
    });

    console.log(user);

    res.json({ accessToken: "accessToken" });
  } catch (error) {
    return next(Boom.badRequest(error));
  }
});

export default router;
