import { GraphQLClient } from "graphql-request";

const headers = {
  "Content-Type": "application/json",
};

export default new GraphQLClient("http://localhost:8080/v1/graphql", {
  headers,
});
