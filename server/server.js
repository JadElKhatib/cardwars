const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const database = require("./db/database");
const bcrypt = require("bcrypt");

BigInt.prototype.toJSON = function () {
    return this.toString();
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get("/users", async (req, res) => {
    try {
        const sql = "SELECT * FROM users";
        const [rows] = await database.pool.query(sql);
        return res.json(rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
});

app.post("/users", async (req, res) => {
    const {
        username,
        password,
        full_name,
        email,
        xp = 0,
        coins = 0,
    } = req.body;
    try {
        const password_hash = await bcrypt.hash(password, 10);
        const sql = `
      INSERT INTO users
        (username, password_hash, full_name, email, xp, coins)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
        const [result] = await database.pool.query(sql, [
            username,
            password_hash,
            full_name,
            email,
            xp,
            coins,
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
    try {
        const password_hash = password
            ? await bcrypt.hash(password, 10)
            : undefined;

        const fields = [];
        const values = [];

        if (username) {
            fields.push("username = ?");
            values.push(username);
        }
        if (password_hash) {
            fields.push("password_hash = ?");
            values.push(password_hash);
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

        const sql = `
      UPDATE users
      SET ${fields.join(", ")}
      WHERE user_id = ?
    `;
        values.push(id);

        const [result] = await database.pool.query(sql, values);
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
        return res.json({ affectedRows: result.affectedRows });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
});
