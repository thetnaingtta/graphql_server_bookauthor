// File: schema.js
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
} = require("graphql");

const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
  },
});

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve: () => {
        // Code to retrieve the list of users from a database or API goes here
        return [
          { id: "1", name: "John Doe", email: "john.doe@example.com" },
          { id: "2", name: "Jane Doe", email: "jane.doe@example.com" },
          // ...
        ];
      },
    },
  },
});

module.exports = new GraphQLSchema({ query: Query });
