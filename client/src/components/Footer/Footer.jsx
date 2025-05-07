import React from "react";
import styles from "./Footer.module.css";
import logo from "../../assets/cardwarslogo.png";

export function Footer({ sections }) {
    return (
        <div className={styles.footer}>
            <div className={styles.logowrapper}>
                <img src={logo} className={styles.cardwarslogo} />
            </div>
            <hr className={styles.divider} />
            <div className={styles.grid}>
                {sections.map((sec, i) => (
                    <div key={i} className={styles.panel}>
                        <h4>{sec.title}</h4>
                        <ul>
                            {sec.links.map((link, j) => (
                                <li key={j}>{link}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
