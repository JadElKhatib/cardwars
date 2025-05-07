import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SignUp.module.css";

export const SignUp = () => {
    const navigate = useNavigate();
    const [fullname, setFullname] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const [emailExistNotification, setEmailExistNotification] = useState("");
    const [usernameExistNotification, setUsernameExistNotification] =
        useState("");
    const [passwordsMatchNotification, setPasswordsMatchNotification] =
        useState("");

    const handleSignUp = async () => {
        try {
            const response = await fetch("http://localhost:3000/users");
            const jsonifiedresponse = await response.json();
            if (!response.ok)
                throw new Error(jsonifiedresponse.error || "Server error");
            if (!Array.isArray(jsonifiedresponse))
                throw new Error("Incorrect user data");

            const samePassword = password === passwordConfirm;
            const emailTaken = jsonifiedresponse.some(
                (u) => u.emailaddress === emailAddress
            );
            const usernameTaken = jsonifiedresponse.some(
                (u) => u.username === username
            );

            if (!emailTaken && !usernameTaken && samePassword) {
                const resCreate = await fetch("http://localhost:3000/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        fullname,
                        emailaddress: emailAddress,
                        username,
                        password,
                    }),
                });
                const createPayload = await resCreate.json();
                if (!resCreate.ok)
                    throw new Error(createPayload.error || "Signup failed");
                return navigate("/");
            }

            setEmailExistNotification(emailTaken ? "Email already exists" : "");
            setUsernameExistNotification(
                usernameTaken ? "Username is taken" : ""
            );
            setPasswordsMatchNotification(
                !samePassword ? "Passwords do not match" : ""
            );
        } catch (err) {
            console.error("SignUp error:", err);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.mainContainer}>
                <div className={styles.content}>
                    <h1>Sign Up</h1>
                    <input
                        placeholder="Full Name"
                        className={styles.loginInput}
                        onChange={(e) => setFullname(e.target.value)}
                    />
                    <input
                        placeholder="Email Address"
                        type="email"
                        className={styles.loginInput}
                        onChange={(e) => setEmailAddress(e.target.value)}
                    />
                    <div
                        className={`${styles.notification} ${
                            emailExistNotification ? styles.show : ""
                        }`}
                    >
                        {emailExistNotification}
                    </div>
                    <input
                        placeholder="Username"
                        className={styles.loginInput}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <div
                        className={`${styles.notification} ${
                            usernameExistNotification ? styles.show : ""
                        }`}
                    >
                        {usernameExistNotification}
                    </div>
                    <input
                        placeholder="Password"
                        type="password"
                        className={styles.loginInput}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        placeholder="Reconfirm Password"
                        type="password"
                        className={styles.loginInput}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                    />
                    <div
                        className={`${styles.notification} ${
                            passwordsMatchNotification ? styles.show : ""
                        }`}
                    >
                        {passwordsMatchNotification}
                    </div>
                    <button className={styles.signupBtn} onClick={handleSignUp}>
                        Sign Up
                    </button>
                    <div className={styles.links}>
                        Already have an account?{" "}
                        <span onClick={() => navigate("/")}>Login</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
