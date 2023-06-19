process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception Error", err);
    console.log(err.name, err.message, err.stack);
    process.exit(1);
});

import app from "./index.js";
import connectionDB from "./DB/connection.js";
import { config } from "dotenv";
config({path:"./config/dot.env"});

const port = process.env.PORT || 8000;
const server = app.listen(port, async () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    console.log(`http://localhost:${process.env.PORT}${process.env.BASE_URL}`);
    await connectionDB();
});

process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejection Error", err);
    console.log(err.name, err.message, err.stack);
    server.close(() => {
        process.exit(1);
    });
});
