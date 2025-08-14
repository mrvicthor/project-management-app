import graphql, { GraphQLSchema } from "graphql";
import ProjectModel from "../models/Project.js";
import ClientModel from "../models/Client.js";

const { GraphQLObjectType, GraphQLList } = graphql;

const ClientType = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    id: { type: graphql.GraphQLID },
    name: { type: graphql.GraphQLString },
    email: { type: graphql.GraphQLString },
    phone: { type: graphql.GraphQLString },
  }),
});

const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: graphql.GraphQLID },
    clientId: { type: graphql.GraphQLID },
    name: { type: graphql.GraphQLString },
    description: { type: graphql.GraphQLString },
    status: { type: graphql.GraphQLString },
    client: {
      type: ClientType,
      resolve(parent, args) {
        return ClientModel.findById(parent.clientId);
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    clients: {
      type: new GraphQLList(ClientType),
      resolve(parent, args) {
        return ClientModel.find();
      },
    },
    client: {
      type: ClientType,
      args: { id: { type: graphql.GraphQLID } },
      resolve(parent, args) {
        return ClientModel.findById(args.id);
      },
    },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        return ProjectModel.find();
      },
    },

    project: {
      type: ProjectType,
      args: { id: { type: graphql.GraphQLID } },
      resolve(parent, args) {
        return ProjectModel.findById(args.id);
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQuery,
});

export default schema;
