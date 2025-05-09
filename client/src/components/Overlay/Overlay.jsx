import React from "react";
import styles from "./Overlay.module.css";
import backArrow from "../../assets/backarrow.jpg";

export default function Overlay({ isOpen, onClose, children, variant }) {
    if (!isOpen) return null;
    const variantClass =
        variant === "cards"
            ? styles.cardsOverlay
            : variant === "settings"
            ? styles.settingsOverlay
            : "";

    return (
        <div className={styles.overlay}>
            <div className={styles.background} onClick={onClose} />
            <div className={`${styles.container} ${variantClass}`}>
                <button className={styles.close} onClick={onClose}>
                    <img src={backArrow} className={styles.back} />{" "}
                </button>
                <hr />
                <div className={styles.content}> {children} </div>
            </div>
        </div>
    );
}
