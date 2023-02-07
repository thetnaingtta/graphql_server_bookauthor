const { ApolloServer, gql, PubSub } = require("apollo-server");

const typeDefs = gql`
  type Query {
    books: [Book]
    authors: [Author]
    Book: Book
  }
  type Book {
    id: Int!
    name: String!
    authorId: Int!
    author: Author!
  }
  type Author {
    id: Int!
    name: String!
  }
  type Error {
    field: String!
    message: String!
  }
  type AddBookResponse {
    errors: [Error!]!
    book: Book
  }
  input AddBookInfo {
    name: String!
    authorId: Int!
  }
  type Mutation {
    addBook(addbookinfo: AddBookInfo!): AddBookResponse!
  }
  type Subscription {
    bookAdded: Book!
  }
`;

const BOOK_ADDED = "BOOK_ADDED";

const books = [
  { id: 1, name: "Harry Potter and the Chamber of Secrets", authorId: 1 },
  {
    id: 2,
    name: "The Lord of the Rings: The Fellowship of the Ring",
    authorId: 2,
  },
  { id: 3, name: "The Catcher in the Rye", authorId: 1 },
  { id: 4, name: "To Kill a Mockingbird", authorId: 3 },
  { id: 5, name: "The Great Gatsby", authorId: 2 },
];

const authors = [
  { id: 1, name: "J.K. Rowling" },
  { id: 2, name: "J.R.R. Tolkien" },
  { id: 3, name: "Harper Lee" },
];

const resolvers = {
  Subscription: {
    bookAdded: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(BOOK_ADDED),
    },
  },
  Query: {
    books: () => books,
    authors: () => authors,
  },
  Book: {
    author: (book) => {
      const author = authors.find((author) => author.id === book.authorId);
      if (!author) {
        throw new Error(`Author with id ${book.authorId} not found`);
      }
      return author;
    },
  },
  Mutation: {
    addBook: (_, { addbookinfo: { name, authorId } }, { pubsub }) => {
      const book = {
        id: books.length + 1,
        name: name,
        authorId: authorId,
      };

      books.push(book);

      pubsub.publish(BOOK_ADDED, {
        bookAdded: book,
      });

      return {
        errors: [
          {
            field: "name",
            message: "bad",
          },
        ],
        book,
      };
    },
  },
};

const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res, pubsub }),
});

server.listen().then(({ url }) => console.log(`server started at ${url}`));
