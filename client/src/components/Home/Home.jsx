import React from "react";
import styles from "./Home.module.css";
import userLogo from "../../assets/userlogo.jpg";
import topBarLogo from "../../assets/topbarlogo.png";

export function Home() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <img src={topBarLogo} className={styles.headerLogo} />
                <img src={userLogo} className={styles.avatar} />
            </header>

            <main className={styles.main}>
                <div href="home/cardwars" className={styles.bigCard}>
                    Card Wars
                </div>
                <div className={styles.sideCards}>
                    <div href="home/cards" className={styles.smallCard}>
                        Cards
                    </div>
                    <div href="home/settings" className={styles.smallCard}>
                        Settings
                    </div>
                </div>
            </main>
        </div>
    );
}
