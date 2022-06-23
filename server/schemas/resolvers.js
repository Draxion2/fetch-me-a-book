const { AuthentcationError } = require('apollo-server-express');
const { Book, User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        getOneUser: async (parent, {username}) => {
            return User.findOne({username})
            .select('-__v -password')
            .populate('savedBooks');
        },
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                .select('-_v -password')
                .populate('savedBooks');

                return userData;
            };

            throw new AuthentcationError('Not logged in');
        }
    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },

        login: async (parent, {email, password}) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthentcationError('Incorrect login')
            };

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthentcationError('Incorrect login')
            };

            const token = signToken(user);
            return { token, user }
        },

        saveBook: async (parent, { input }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: input } },
                    { new: true } 
                )
                .select('-_v -password')
                .populate('savedBooks');

                return updatedUser;
            }

            throw new AuthentcationError('You must be logged in');
        },

        removeBook: async (parent, args, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: args.bookId } } },
                    { new: true }
                )
                .populate('savedBooks');

                return updatedUser;
            }

            throw new AuthentcationError('You must be logged in');
        }
    }
};

module.exports = resolvers;