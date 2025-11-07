import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const REGISTROS_PATH = path.join(__dirname, "registros.json");

// garante arquivo
function ensureFile() {
  if (!fs.existsSync(REGISTROS_PATH)) {
    fs.writeFileSync(REGISTROS_PATH, "[]", "utf-8");
  }
}

// lê registros
function readRegistros() {
  ensureFile();
  const raw = fs.readFileSync(REGISTROS_PATH, "utf-8");
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// grava registros
function writeRegistros(registros) {
  fs.writeFileSync(REGISTROS_PATH, JSON.stringify(registros, null, 2), "utf-8");
}

// POST /api/register  { elapsedMs: number }
app.post("/api/register", (req, res) => {
  const elapsedMs = Number(req.body.elapsedMs);
  if (!Number.isFinite(elapsedMs) || elapsedMs <= 0) {
    return res.status(400).json({ error: "elapsedMs inválido" });
  }

  const registros = readRegistros();
  const novo = {
    id: registros.length ? registros[registros.length - 1].id + 1 : 1,
    elapsedMs,
    createdAt: new Date().toISOString(),
  };

  registros.push(novo);
  writeRegistros(registros);
  res.status(201).json(novo);
});

// GET /api/registers  -> lista todos
app.get("/api/registers", (_req, res) => {
  const registros = readRegistros();
  res.json(registros);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ API Fast Double-Click rodando em http://localhost:${port}`);
  ensureFile();
});
