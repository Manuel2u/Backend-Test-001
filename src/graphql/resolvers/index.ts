import { GraphQLResolverMap } from "@apollo/subgraph/dist/schema-helper";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeResolvers } from "@graphql-tools/merge";
import path from "path";
import config from "../../config";

const typesArray = loadFilesSync(
    path.join(__dirname, config?.app?.env !== "development" ? "./*.resolver.js" : "./*.resolver.ts")
);

const resolvers: GraphQLResolverMap<any> = mergeResolvers(typesArray) as any;
export default resolvers;
