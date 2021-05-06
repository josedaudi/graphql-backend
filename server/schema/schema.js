const graphql = require('graphql');
const { random } = require('lodash');
const User = require('../model/User');
const Post = require('../model/Post');
const Hobby = require('../model/Hobby');
const _ = require('lodash');

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = graphql;

// Create Types

const UserType = new GraphQLObjectType({
    name: 'User',
    description: "Documentation for User Object Type",
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        profession: {type: GraphQLString},
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args){
                return Post.find({userId: parent.id})
            }
        },
        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args){
                return Hobby.find({userId: parent.id})
            }
        }
    })
})

const HobbyType = new GraphQLObjectType({
    name: 'Hobby',
    description: 'Description for Hobby',
    fields: () => ({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        description: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args){
                return User.findById(parent.userId)
            }
        }
    })
})

const PostType = new GraphQLObjectType({
    name: 'Post',
    description: 'Description for post',
    fields: () => ({
        id: {type: GraphQLID},
        comment: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args){
                return User.findById(parent.userId)
            }
        }
    })
})

// Create Root Query

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: "Root Query Description",
    fields: {
        user: {
            type: UserType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                // We resolve with data and get return data from datasource
                return User.findById(args.id).exec()
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args){
                return User.find();
            }
        },
        hobby: {
            type: HobbyType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                // Get Hobby Object response
                return Hobby.findById(args.id).exec()
            }
        },
        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args){
                return Hobby.find();
            }
        },
        post: {
            type: PostType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                return Post.findById(args.id).exec()
            }
        },

        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args){
                return Post.find();
            }
        },
    }
});

// Mutation

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    description: "Mutations",
    fields: {

        // Create user Object in MongoDB using Mongoose
        CreateUser: {
            type: UserType,
            args: {
                name: {type: GraphQLString},
                age: {type: GraphQLInt},
                profession: {type: GraphQLString}
            },
            resolve(parent, args){
                let user = new User({
                    name: args.name,
                    age: args.age,
                    profession: args.profession
                })
                return user.save()
            } 
        },

        // Update User Object in MongoDB using Mongoose
        UpdateUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: GraphQLInt},
                profession: {type: GraphQLString}
            },
            resolve(parent, args){
                return User.findByIdAndUpdate(
                    args.id, 
                    {
                        $set: {
                            name: args.name,
                            age: args.age,
                            profession: args.profession
                        }
                    }, 
                    {new: true}
                )
            } 
        },


        // Update User Object in MongoDB using Mongoose
        RemoveUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                const removeUser = User.findByIdAndRemove(args.id).exec()
                if(!removeUser){
                    throw new('Error');
                }
                return removeUser;
            } 
        },

        // Create Post Object in MongoDb using Mongoose
        CreatePost: {
            type: PostType,
            args: {
                comment: {type: GraphQLString},
                userId: {type: GraphQLID}
            },
            resolve(parent, args){
                let post = new Post({
                    comment: args.comment,
                    userId: args.userId
                })
                return post.save()
            }
        },

        // Update Post Object in MongoDB using Mongoose
        UpdatePost: {
            type: PostType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                comment: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                return Post.findByIdAndUpdate(
                    args.id, 
                    { $set: { comment: args.comment } }, 
                    { new: true }
                )
            } 
        },

        RemovePost: {
            type: PostType,
            args: { id: { type: new GraphQLNonNull(GraphQLID)}},
            resolve(parent, args){
                const removePost = Post.findByIdAndRemove(args.id).exec()
                if(!removePost){
                    throw new('Error');
                }
                return removePost;
            }
        },

        // Create Hobby Object in MongoDB

        CreateHobby: {
            type: HobbyType,
            args: {
                title: {type: GraphQLString},
                description: {type: GraphQLString},
                userId: {type: GraphQLID}
            },
            resolve(parent, args){
                let hobby = new Hobby({
                    title: args.comment,
                    description: args.description,
                    userId: args.userId
                })
                return hobby.save()
            }
        },

        // Update Hobby Object in MongoDB using Mongoose
        UpdateHobby: {
            type: HobbyType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                title: {type: GraphQLString},
                description: {type: GraphQLString},
            },
            resolve(parent, args){
                return Hobby.findByIdAndUpdate(
                    args.id, 
                    { $set: { title: args.title, description: args.description } }, 
                    { new: true }
                )
            } 
        },

        RemoveHobby: {
            type: HobbyType,
            args: { id: { type: new GraphQLNonNull(GraphQLID)}},
            resolve(parent, args){
                const removeHobby = Hobby.findByIdAndRemove(args.id).exec()
                if(!removeHobby){
                    throw new('Error');
                }
                return removeHobby;
            }
        },
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})