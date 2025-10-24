import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { userRouter } from "./src/routes/user.route.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", userRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando porta ${PORT}`));
