import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));
app.use("/src", express.static(path.join(__dirname, "src")));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
