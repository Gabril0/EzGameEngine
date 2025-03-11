const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use("/src", express.static(path.join(__dirname, "src")));

app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
});
