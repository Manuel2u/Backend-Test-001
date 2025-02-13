import { Writable } from "stream";
import winston from "winston";
import { getStorage, ref, uploadBytes } from "firebase/storage"
import fs from "fs";



const firebaseLogFilePath = `logs/backend-test-${new Date().toISOString().split("T")[0]}.log`;


class FirebaseStorageStream extends Writable {
    private logFilePath: string;


    constructor(logFilePath: string) {
        super();
        this.logFilePath = logFilePath;
    }

    async _write(chunk: any, encoding: string, callback: (error?: Error | null) => void) {
        try {
            const storage = getStorage();

            const storageRef = ref(storage, this.logFilePath);
            const content = chunk.toString(encoding === "buffer" ? undefined : encoding);

            // Check if local cache exists
            const tempFilePath = `/tmp/${this.logFilePath.replace(/\//g, "_")}`;
            let existingContent = "";

            // Load existing content from a temp file if it exists
            if (fs.existsSync(tempFilePath)) {
                existingContent = fs.readFileSync(tempFilePath, "utf8");
            }

            // Append new log content
            const newContent = existingContent + content;

            // Save to temp file (optional for better performance)
            fs.writeFileSync(tempFilePath, newContent, "utf8");

            // Upload the updated log to Firebase Storage
            const fileBuffer = Buffer.from(newContent, "utf8");
            // Convert the Node.js Buffer to Uint8Array
            await uploadBytes(storageRef, new Uint8Array(fileBuffer));

            console.log(`Log uploaded to Firebase Storage: ${this.logFilePath}`);
            callback();
        } catch (error) {
            console.error("Error writing log to Firebase Storage:", error);
            callback(error);
        }
    }
}


const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: { service: 'backend-test' },
    transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        //
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),

        new winston.transports.Stream({
            stream: new FirebaseStorageStream(firebaseLogFilePath),
        }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

export default logger;