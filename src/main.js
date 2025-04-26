import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { router } from "./routes/routes.js";

config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", router);

// Default route
app.use("/", (_, res) => {
  res.send("Hello World!");
});

const port = process.env.APP_PORT || 9000;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
