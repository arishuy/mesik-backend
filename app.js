import express from "express";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import docs from "./docs/index.js";
import routes from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

// parse json request body
app.use(express.json({ limit: "10mb" }));

// parse urlencoded request body
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cors());

// api routes
app.use("/v1", routes);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(docs));

app.use(errorHandler.converter);
app.use(errorHandler.notFound);

export default app;
