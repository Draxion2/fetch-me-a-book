const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Book {
        bookId: String
        authors: [String]
        description: String
        title: String,
        image: String,
        link: String
    }

    type User {
        _id: ID
        username: String
        email: String
        savedBooks: [Book]
    }

    input bookFields {
        bookId: String
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        me: User
        getOneUser(username: String!): User
    }

    type Mutation {
        addUser(email: String!, username: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        saveBook(input: bookFields): User
        removeBook(bookId: String!): User
    }
`;

module.exports = typeDefs;