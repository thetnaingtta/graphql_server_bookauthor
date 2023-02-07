const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
  GraphQLInt,
  GraphQLNonNull,
} = require("graphql");

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    book: {
      type: BookType,
      description: "A Single Book",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => books.find((book) => book.id === args.id),
    },
    books: {
      type: new GraphQLList(BookType),
      description: "List of All books",
      resolve: () => books,
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: "List of All Authors",
      resolve: () => books,
    },
    author: {
      type: AuthorType,
      description: "A Single Author",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) =>
        authors.find((author) => author.id === args.id),
    },
  }),
});

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    addBook: {
      type: BookType,
      description: "Add a book",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (partent, args) => {
        const book = {
          id: books.length + 1,
          name: args.name,
          authorId: args.authorId,
        };
        books.push(book);
        return book;
      },
    },
    addAuthor: {
      type: AuthorType,
      description: "Add an author",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (partent, args) => {
        const author = {
          id: authors.length + 1,
          name: args.name,
        };
        authors.push(author);
        return author;
      },
    },
    updateBook: {
      type: BookType,
      description: "Update a book",
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const bookIndex = books.findIndex((book) => book.id === args.id);
        if (bookIndex === -1) {
          throw new Error(`Book with id ${args.id} not found.`);
        }
        books[bookIndex] = {
          id: args.id,
          name: args.name,
          authorId: args.authorId,
        };
        return books[bookIndex];
      },
    },
    updateAuthor: {
      type: AuthorType,
      description: "Update an author",
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const authorIndex = authors.findIndex(
          (author) => author.id === args.id
        );
        if (authorIndex === -1) {
          throw new Error(`Author with id ${args.id} not found.`);
        }
        authors[authorIndex] = {
          id: args.id,
          name: args.name,
        };
        return authors[authorIndex];
      },
    },
    deleteBook: {
      type: GraphQLString,
      description: "Delete a book",
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const bookIndex = books.findIndex((b) => b.id === args.id);
        if (bookIndex === -1) {
          return `Book with ID ${args.id} not found.`;
        }
        books.splice(bookIndex, 1);
        return `Deleted book with book ID ${args.id}.`;
      },
    },
    deleteAuthor: {
      type: GraphQLString,
      description: "Delete an Author",
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const authorIndex = authors.findIndex((a) => a.id === args.id);
        if (authorIndex === -1) {
          return `Author with ID ${args.id} not found.`;
        }
        const author = authors[authorIndex];
        const hasBooks = books.some((b) => b.authorId === author.id);
        if (hasBooks) {
          throw new Error("Author cannot be deleted because they have books.");
        }
        authors.splice(authorIndex, 1);
        return `Deleted author with book ID ${args.id}.`;
      },
    },
  }),
});

const BookType = new GraphQLObjectType({
  name: "Book",
  description: "This represents a book written by an author",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: (book) => {
        return authors.find((author) => author.id === book.authorId);
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "This represents an author of a book",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books: {
      type: new GraphQLList(BookType),
      resolve: (author) => {
        return books.filter((book) => book.authorId === author.id);
      },
    },
  }),
});

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
  { id: 6, name: "1984", authorId: 1 },
  { id: 7, name: "Pride and Prejudice", authorId: 2 },
  { id: 8, name: "The Hobbit", authorId: 2 },
  { id: 9, name: "Little Women", authorId: 3 },
  { id: 10, name: "Animal Farm", authorId: 1 },
  { id: 11, name: "Moby-Dick", authorId: 2 },
  { id: 12, name: "The Adventures of Huckleberry Finn", authorId: 1 },
];

const authors = [
  { id: 1, name: "J.K. Rowling" },
  { id: 2, name: "J.R.R. Tolkien" },
  { id: 3, name: "Harper Lee" },
];

module.exports = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});
