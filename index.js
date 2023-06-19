import express from 'express';
import errorHandlerMW from "./middleware/errorHandlerMW.js";
import * as indexRouter from "./modules/indexRouter.js"
import { config } from "dotenv";
config({ path: "./config/dot.env" });
import morgan from "morgan";


const app = express();
app.use(express.json());
app.use(morgan("dev"));

export const baseUrl = process.env.BASE_URL;
app.use(`${baseUrl}/user`,indexRouter.userRouter)
app.use(`${baseUrl}/category`,indexRouter.categoryRouter);
app.use(`${baseUrl}/post`,indexRouter.postRouter);
app.use(`${baseUrl}/comment`,indexRouter.commentRouter);
app.use(`${baseUrl}/reply`,indexRouter.replyRouter);

app.all("*", (req, res) => {
    //next(new AppError(`In-valid Routing `+req.originalUrl,404));
    console.log(`In-valid Routing `+req.originalUrl);
    res.status(404).json({status: "Fail", message: `In-valid Routing `+req.originalUrl});
});

// error handler
app.use(errorHandlerMW);

export default app;