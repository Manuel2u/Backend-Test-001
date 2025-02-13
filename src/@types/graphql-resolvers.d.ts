import { IResolver } from "type";

declare module "graphql-resolvers" {
  export function combineResolvers(...resolvers: IResolver[]): IResolver;
}
