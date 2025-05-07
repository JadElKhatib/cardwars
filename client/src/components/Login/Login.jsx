import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

export const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [notification, setNotification] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch("http://localhost:3000/users");
            const jsonifiedresponse = await response.json();

            if (!response.ok) {
                throw new Error(jsonifiedresponse.error || "Server error");
            }

            if (!Array.isArray(jsonifiedresponse)) {
                throw new Error("Unexpected response");
            }

            const user = jsonifiedresponse.find(
                (u) => u.username === username && u.password === password
            );
            if (user) {
                setNotification("Login successful!");
            } else {
                setNotification("Username or Password is incorrect");
            }
        } catch (err) {
            console.error("Login error:", err);
            setNotification(err.message);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.mainContainer}>
                <div className={styles.content}>
                    <input
                        placeholder="Username"
                        className={styles.loginInput}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        placeholder="Password"
                        type="password"
                        className={styles.loginInput}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className={styles.links}>
                        <span>Forgot Password</span>
                        <span onClick={() => navigate("/signup")}>Sign up</span>
                    </div>
                    <button className={styles.loginBtn} onClick={handleLogin}>
                        Login
                    </button>
                    <div className={styles.notification}>{notification}</div>
                </div>
            </div>
        </div>
    );
};
