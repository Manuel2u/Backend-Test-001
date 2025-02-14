import express, { Request } from "express";
import { json } from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { createServer } from "http";
import { initDb, sequelize } from "./models";
import schema from "./graphql/schemas";
import cors from "cors";
import customError from "./middlewares/custom-error";
import config from "./config";
import { __disolveContext } from "./middlewares/context";
import { initializeApp } from "firebase/app";
import { ExpressAdapter } from "@bull-board/express"
import { createBullBoard } from "@bull-board/api"
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
import { initializeQueues, processLLMQueue, sendReminderQueue } from "./queues/queues";
import { pubsub } from "./redis";
import logger from "./utils/logger";



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
      queues: [new BullMQAdapter(sendReminderQueue), new BullMQAdapter(processLLMQueue)],
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

    const shutdown = async () => {
      console.log("🔻 Graceful shutdown initiated...");

      try {
        // Stop GraphQL Server
        console.log("🛑 Draining GraphQL Server...");
        await graph.stop();

        // Disconnect Redis
        console.log("🛑 Disconnecting Redis...");
        await pubsub.close();

        // Disconnect MongoDB
        console.log("🛑 Closing MongoDB connection...");
        await sequelize.close();

        console.log("✅ Cleanup complete. Exiting now.");
        process.exit(0);
      } catch (error) {
        console.error("❌ Error during shutdown:", error);
        process.exit(1);
      }
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
    process.on("uncaughtException", (err) => {
      console.error("🔥 Uncaught Exception:", err);
      logger.error(`🔥 Uncaught Exception: ${err}`);
      shutdown();
    });
  } catch (e) {
    throw e;
  }
};

start();
