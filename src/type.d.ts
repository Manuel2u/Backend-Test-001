import { MyContext } from "./index";

export type IResolver = (
  parent: any,
  args: any,
  context: MyContext,
  info: any
) => any | Promise<any>;

export type ISubscriptionResolverFunction = (
  parent: any,
  args: any,
  context: MyContext,
  info: any
) => AsyncIterableIterator<any> | Promise<AsyncIterableIterator<any>>;

export type ISubscriptionResolver = {
  subscribe: ISubscriptionResolverFunction;
};

export type IResolvers = {
  [key: string]: {
    [field: string]: IResolver | IResolver[] | ISubscriptionResolver;
  };
  Query?: {
    [field: string]: IResolver | IResolver[];
  };
  Mutation?: {
    [field: string]: IResolver | IResolver[];
  };
  Subscription?: {
    [field: string]: ISubscriptionResolver;
  };
};
