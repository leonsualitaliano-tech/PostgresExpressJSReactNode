import express from "express";
import cors from "cors"
import pool from "./db.js";

const app = express();
const port = 3000;

const corsOptions = {
  origin: ['http://localhost:3000', "http://localhost:5173"],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

app.get('/api/test', async (req, res) => {
  console.log('Richiesta ricevuta su /api/test');
  try {
    const { rows } = await pool.query("SELECT NOW()");
    console.log('Connessione al database riuscita');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore del server" });
  }
});

app.post("/api/goals", async (req, res) => {
  console.log('Body della richiesta:', req.body);
  try {
    const { goal, summary } = req.body;
    const result = await pool.query(
      "INSERT INTO goals (goal, summary) VALUES ($1, $2)",
      [goal, summary]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore del server" });
  }
});

app.get("/api/goals", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM goals ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore del server" });
  }
});

app.delete("/api/goals/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM goals WHERE id = $1", [id]);
    res.json({ message: "Obiettivo eliminato con successo" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore del server" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
