require("dotenv").config();
const express = require("express");
const app = express();
const database = require("./db/database");
const cors = require("cors");
const bcrypt = require("bcrypt");

BigInt.prototype.toJSON = function () {
    return this.toString();
};

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/users", async (req, res) => {
    try {
        const sql = `
      SELECT
        user_id,
        username,
        password_hash    AS password,
        fullname         AS fullname,
        email            AS emailaddress,
        xp,
        coins
      FROM users
    `;
        const rows = await database.pool.query(sql);
        return res.json(rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
});

const path = require("path");
app.use("/images", express.static(path.join(__dirname, "public/images")));

app.get("/users/:userId/cards", async (req, res) => {
    const userId = Number(req.params.userId);
    if (!userId) {
        return res.status(400).json({ error: "Invalid userId" });
    }

    try {
        const sql = `
        SELECT
          c.card_id,
          c.name,
          c.rarity,
          c.faction,
          c.attack,
          c.defense,
          c.cost,
          c.floop_cost,
          c.floop_ability_info,
          c.floop_ability_effect,
          c.floop_ability_effect_value,
          c.image_url,
          pc.quantity
        FROM player_cards pc
        JOIN cards c ON pc.card_id = c.card_id
        WHERE pc.user_id = ?
      `;
        const cards = await database.pool.query(sql, [userId]);
        return res.json(cards);
    } catch (err) {
        console.error("Error loading user cards:", err);
        return res.status(500).json({ error: err.message });
    }
});

app.get("/users/:userId/characters", async (req, res) => {
    const userId = Number(req.params.userId);
    if (!userId) return res.status(400).json({ error: "Invalid userId" });

    try {
        const sql = `
       SELECT
         c.character_id,
         c.character_name,
         c.turns,
         c.ability_info,
         c.ability_effect,
         c.ability_value,
         c.character_image_url
       FROM user_characters uc
       JOIN characters c
         ON uc.character_id = c.character_id
       WHERE uc.user_id = ?
     `;
        const rows = await database.pool.query(sql, [userId]);
        return res.json(rows);
    } catch (err) {
        console.error("Error loading user characters:", err);
        return res.status(500).json({ error: err.message });
    }
});

app.post("/users", async (req, res) => {
    const { fullname, emailaddress, username, password } = req.body;
    if (!fullname || !emailaddress || !username || !password) {
        return res.status(400).json({
            error: "fullname, emailaddress, username and password are required",
        });
    }

    try {
        const password_hash = await bcrypt.hash(password, 10);
        const sql = `
      INSERT INTO users
        (fullname, email, username, password_hash, xp, coins)
      VALUES (?, ?, ?, ?, 0, 0)
    `;
        const result = await database.pool.query(sql, [
            fullname,
            emailaddress,
            username,
            password_hash,
        ]);
        return res.status(201).json({ user_id: result.insertId });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
});

app.patch("/users/:user_id", async (req, res) => {
    const id = Number(req.params.user_id);
    const { username, password, full_name, email } = req.body;

    const fields = [];
    const values = [];

    if (username) {
        fields.push("username = ?");
        values.push(username);
    }
    if (password) {
        const hash = await bcrypt.hash(password, 10);
        fields.push("password_hash = ?");
        values.push(hash);
    }
    if (full_name) {
        fields.push("full_name = ?");
        values.push(full_name);
    }
    if (email) {
        fields.push("email = ?");
        values.push(email);
    }

    if (!fields.length) {
        return res.status(400).json({ error: "No fields to update" });
    }

    values.push(id);
    const sql = `
    UPDATE users
    SET ${fields.join(", ")}
    WHERE user_id = ?
  `;

    try {
        const [result] = await database.pool.query(sql, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.json({ affectedRows: result.affectedRows });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
});

app.delete("/users/:user_id", async (req, res) => {
    const id = Number(req.params.user_id);
    try {
        const sql = "DELETE FROM users WHERE user_id = ?";
        const [result] = await database.pool.query(sql, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.json({ affectedRows: result.affectedRows });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
