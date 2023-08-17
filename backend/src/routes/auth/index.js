import express from "express";
import Boom from "@hapi/boom";
import bcrypt from "bcryptjs";
import Hasura from "../../clients/hasura";
import { IS_USER_EXIST, MUTATION_INSERT_USER, QUERY_LOGIN } from "./queries";
import { loginSchema, registerSchema } from "./validations";
import { signAccessToken, verifyAccessToken } from "./helpers";

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

    const { insert_mt_users_one: user } = await Hasura.request(
      MUTATION_INSERT_USER,
      {
        input: {
          ...input,
          password: hash,
        },
      }
    );

    const accessToken = await signAccessToken(user);

    res.json({ accessToken });
  } catch (error) {
    return next(Boom.badRequest(error));
  }
});

router.post("/login", async (req, res, next) => {
  const input = req.body.input.data;
  input.email = input.email.toLowerCase();

  const { error } = loginSchema.validate(input);
  if (error) return next(Boom.badRequest(error.details[0].message));

  try {
    const { mt_users } = await Hasura.request(QUERY_LOGIN, {
      email: input.email,
    });

    if (mt_users.length === 0) {
      throw Boom.unauthorized(
        "Invalid credentials: Please check your email / password input and try again!"
      );
    }

    const user = mt_users[0];

    const passwordIsMatch = await bcrypt.compare(input.password, user.password);

    if (passwordIsMatch) {
      throw Boom.unauthorized(
        "bbbbbbInvalid credentials: Please check your email / password input and try again!"
      );
    }

    const accessToken = await signAccessToken(user);
    return res.json({ accessToken });
  } catch (error) {
    return next(Boom.badRequest(error));
  }
});

router.post("/me", verifyAccessToken, (req, res, next) => {
  const { aud } = req.payload;
  return res.json({
    user_id: aud,
  });
});

export default router;
