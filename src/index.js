require("./models/user.mongoose");
require("./models/csg.mongoose");
require("./models/bill.mongoose");
const express = require("express");

const { mongoConnect } = require("./utils/mongo");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/authRoutes");
const userRouters = require("./routes/userRouters");
const csgRouters = require("./routes/csgRouters");
const billRouters = require("./routes/billRouters");

const requireAuth = require("./middlewares/requireAuth");
const getRandomColor = require("./utils/randomColorGen");

require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(authRoutes);
app.use("/user", userRouters);
app.use("/csg", csgRouters);
app.use("/bill", billRouters);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  const randomColor = getRandomColor();
  res.send(randomColor);
});

async function startServer() {
  await mongoConnect();
  app.listen(PORT, () => {});
}

startServer();
