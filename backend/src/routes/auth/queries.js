import { gql } from "graphql-request";

export const IS_USER_EXIST = gql`
  query isEmailExist($email: String!) {
    mt_users(where: { email: { _eq: $email } }) {
      id
    }
  }
`;

export const MUTATION_INSERT_USER = gql`
  mutation insertUser($input: mt_users_insert_input!) {
    insert_mt_users_one(object: $input) {
      id
      email
    }
  }
`;
