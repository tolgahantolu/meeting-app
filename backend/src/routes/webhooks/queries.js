import { gql } from "graphql-request";

export const GET_MEETING_PARTICIPANTS = gql`
  query getMeetingParticipants($meeting_id: Int!) {
    mt_participants(where: { meeting_id: { _eq: $meeting_id } }) {
      meeting_date
      user {
        id
        email
        name
        surname
      }
    }
  }
`;
