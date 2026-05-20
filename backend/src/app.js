const express = require("express");
const cors = require("cors");

const apiRoutes = require("./routes");
const { errorHandler, notFoundHandler } = require("./middleware/error-handler");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
