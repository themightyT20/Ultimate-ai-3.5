import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { setupRoutes } from "../routes/index.ts";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // Use Express's built-in JSON parser

setupRoutes(app);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
