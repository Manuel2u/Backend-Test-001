import { IAppContext } from "../../types/app";

declare global {
  namespace Express {
    export interface Request {
      rawBody?: string;
      context: IAppContext;
    }
  }
}

export { }