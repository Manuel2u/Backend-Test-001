import express, { NextFunction, Request, Response } from "express";
import { json } from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { createServer } from "http";
import { useServer } from "graphql-ws/lib/use/ws";
import { initDb, sequelize } from "./models";
import schema from "./graphql/schemas";
import cors from "cors";
import customError from "./middlewares/custom-error";
import config from "./config";
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { __disolveContext } from "./middlewares/context";
import { initializeApp } from "firebase/app";
import { ExpressAdapter } from "@bull-board/express"
import { createBullBoard } from "@bull-board/api"
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
import { initializeQueues, sendReminderQueue } from "./queues/queues";



export interface MyContext {
  user?: any;
  req?: Request;
}


export const start = async () => {
  try {
    const app = express();
    initDb(sequelize);
    // sequelize.sync({ alter: true, force: false });
    await initializeQueues();
    initializeApp(config.firebaseConfig);


    const httpServer = createServer(app);

    app.use(express.json());


    app.use(express.urlencoded({ extended: true }));


    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/admin/queues');

    createBullBoard({
      queues: [new BullMQAdapter(sendReminderQueue)],
      serverAdapter: serverAdapter,
    });

    app.use('/admin/queues', serverAdapter.getRouter());

    const allowedDomains = [
      "http://localhost:8080",
      "http://localhost",
      "https://studio.apollographql.com",
    ];

    const corsOptions = {
      origin: function (origin: string | undefined, callback: any) {
        if (origin === undefined || allowedDomains.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "Authorization",
        "X-PINGOTHER",
        "apollographql-client-name",
        "apollographql-client-version",
        "recent-activity",
        "baggage",
        "sentry-trace",
        "x-setup-key"
      ],
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
    };

    if (config?.app.env === "development") {
      app.use(cors());
    } else if (config?.app.env === "production" || config?.app.env === "staging") {
      app.use(cors(corsOptions));
    }

    const graph = new ApolloServer<MyContext>({
      schema,
    });

    await graph.start();

    app.use("/health", (req, res) => {
      res.status(200).send("All is green!!!");
    });


    app.use(
      "/graphql",
      json(),
      cors<cors.CorsRequest>(corsOptions),
      expressMiddleware(graph, {
        context: __disolveContext,
      })
    );

    //use custom error middleware
    app.use(customError);


    httpServer.listen(config?.app.port, () => {
      console.log(`🚀 server is running on ${config?.app.port}`);
    });
  } catch (e) {
    throw e;
  }
};

start();
