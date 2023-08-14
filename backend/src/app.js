const express = require("express");
const app = express();

// middlewares
app.use(express.json());

app.post("/register", (req, res) => {
  const input = req.body.input.data;

  console.log("input", input);

  res.json({
    accessToken: "accessToken",
  });
});

app.listen(4000, () => {
  console.log("Server started on port 4000 🚀");
});
