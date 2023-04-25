const express = require("express");
var bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;

app.use(cors());

let dbConfig = {
  /* Notice! These are here for demo purposes. DO NOT COMMIT YOUR INFO to version control*/
  client: "mysql",
  connection: {
    user: "root",
    // user: "testuser",
    // password: "testuserpwd1",
    password: "root123",
    database: "content-db",
  },
  acquireConnectionTimeout: 600000,
};

if (process.env.NODE_ENV == "production") {
  dbConfig.connection.socketPath = process.env.GAE_DB_ADDRESS;
} else if (process.env.NODE_ENV == "production-cloud-run") {
  dbConfig.connection.host = process.env.CLOUD_SQL_HOST;
  dbConfig.connection.socketPath = process.env.GAE_DB_ADDRESS;
} else {
  dbConfig.connection.host = "127.0.0.1";
}

const knex = require("knex")(dbConfig);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  res.json({
    success: true,
    message: "success bang",
    tes: "test",
  });
});

app.get("/content", async (req, res) => {
  const result = await knex.select().table("exampletable");
  res.json(result);
});

app.post("/content", async (req, res) => {
  await knex
    .insert({ content: req.body.content })
    .into("exampletable")
    .then(() => {
      res.json({ success: true, message: "ok" });
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
