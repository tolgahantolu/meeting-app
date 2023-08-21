import express from "express";
import Boom from "@hapi/boom";
import Hasura from "../../clients/hasura";
import { GET_MEETING_PARTICIPANTS } from "./queries";

const router = express.Router();

router.post("/meeting_created", async (req, res, next) => {
  const meeting = req.body.event.data.new;

  const { mt_participants: participants } = await Hasura.request(
    GET_MEETING_PARTICIPANTS,
    {
      meeting_id: meeting.id,
    }
  );
  console.log(participants);
});

export default router;
