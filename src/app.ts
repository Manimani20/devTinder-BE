import express from "express";
import cookieParser from "cookie-parser";
import { dbConnect } from "./config/database";
import { authRouter } from "./routes/auth";

const app = express();

//body parser middleware
app.use(express.json())

//cookie parser middleware
app.use(cookieParser())

app.use("/",authRouter)

dbConnect().then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
}).catch((err) => {
    console.error("Database connection failed:", err);
});

