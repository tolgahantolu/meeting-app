import express from "express";
import moment from "moment";
import axios from "axios";
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

  const scheduleEvent = {
    type: "create_scheduled_event",
    args: {
      webhook: "{{ACTION_BASE_ENDPOINT}}/webhooks/meeting_reminder",
      schedule_at: moment(participants.meeting_date).subtract(2, "minutes"),
      payload: {
        meeting_id: meeting.id,
      },
    },
  };

  const addEvent = await axios("http://localhost:8080/v1/query", {
    method: "POST",
    data: JSON.stringify(scheduleEvent),
    headers: {
      "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
    },
  });

  const eventData = addEvent.data;
  console.log(participants);
});

router.post("/meeting_reminder", async (req, res, next) => {
  console.log("meeting reminder");
});

export default router;
