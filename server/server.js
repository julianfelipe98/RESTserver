const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("./config/config");
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("hello world");
});
app.get("/users", (req, res) => {
  res.send("get users");
});
app.post("/users", (req, res) => {
  if (req.body.name === undefined) {
    res.status(400).json({
      ok: false,
      message: "the name es need it",
    });
  } else {
    res.status(201);
    res.json(req.body);
  }
});
app.put("/users", (req, res) => {
  res.send("put users");
});
app.put("/users/:id", (req, res) => {
  let id = req.params.id;
  res.json({
    id,
  });
});
app.delete("/users", (req, res) => {
  res.send("delete users");
});

app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});
