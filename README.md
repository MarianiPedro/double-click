# Fast Double-Click — Aplicação React + Node.js

O projeto Fast Double-Click tem o objetivo de medir o tempo entre dois cliques consecutivos de um usuário e registrar esses resultados. O sistema é composto por duas páginas: uma para registrar cliques e outra para visualizar, filtrar e ordenar os registros obtidos.

## Estrutura do Projeto

``` text
double-click
│
├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx        # Página principal com botão de medição
│   │   │   └── Registros.tsx   # Página de listagem e filtros
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── server.js        ← Servidor Node.js
├── package.json
├── registros.json   # Arquivo de dados (gerado automaticamente)
└── README.md
```

## Pré-requisitos

Antes de rodar o projeto, verifique se você tem instalado:

* Node.js versão 18 ou superior
* npm

Para confirmar, rode:

``` console
node -v
npm -v
```

## Como rodar o projeto

### 1 - Clonar o repositório

``` console
git clone https://github.com/MarianiPedro/double-click.git
cd double-click
```

### 2 - Instalar dependências do Front-end

Dentro da pasta do projeto (onde está o package.json gerado pelo Vite):

``` console
npm install
```

### 3 - Instalar dependências do Back-end

Ainda na raiz do projeto, instale o Express e o CORS:

``` console
npm install express cors
```

### 4 - Rodar o servidor (Back-end)

Use o arquivo server.js com este conteúdo:

``` js
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

// garante o arquivo
function ensureFile() {
  if (!fs.existsSync(REGISTROS_PATH)) fs.writeFileSync(REGISTROS_PATH, "[]", "utf-8");
}

// lê registros
function readRegistros() {
  ensureFile();
  const raw = fs.readFileSync(REGISTROS_PATH, "utf-8");
  try {
    return JSON.parse(raw);
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
  if (!Number.isFinite(elapsedMs) || elapsedMs <= 0)
    return res.status(400).json({ error: "elapsedMs inválido" });

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

// GET /api/registers -> lista todos
app.get("/api/registers", (_req, res) => {
  const registros = readRegistros();
  res.json(registros);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ API rodando em http://localhost:${port}`));
ensureFile();
```

Para iniciar o servidor:

``` console
node server.js
```

### 5 - Configurar o Front-end

Crie um arquivo .env na raiz do projeto com:

``` env
VITE_API_BASE=http://localhost:3000
```

### 6 - Rodar o Front-end

No terminal:

``` console
npm run dev
```

## Como funciona

* Página principal — Home.tsx
  * Possui um único botão.
  * O usuário precisa clicar duas vezes rapidamente.
  * O sistema calcula o tempo entre os dois cliques.
  * O resultado é enviado ao back-end, que salva no arquivo registros.json.

* Página de registros — Registros.tsx
  * Exibe todos os registros salvos com:
  * Data e hora da medição;
  * Tempo registrado (em milissegundos);
  * Permite filtrar por intervalo de datas;
  * Permite ordenar por data ou por tempo, em ordem ascendente ou descendente.
