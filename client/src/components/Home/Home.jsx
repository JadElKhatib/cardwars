import React, { useState } from "react";
import styles from "./Home.module.css";
import userLogo from "../../assets/userlogo.jpg";
import topBarLogo from "../../assets/topbarlogo.png";
import Overlay from "../Overlay/Overlay";
import { useLocation, useNavigate } from "react-router-dom";

export const Home = () => {
    const [modal, setModal] = useState(null);
    const [cards, setCards] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user;
    if (!user) {
        navigate("/", { replace: true });
        return null;
    }

    const openCards = async () => {
        try {
            const res = await fetch(
                `http://localhost:3000/users/${user.user_id}/cards`
            );
            if (!res.ok) throw new Error(`Status ${res.status}`);
            const data = await res.json().catch(() => []);
            setCards(data);
            setModal("cards");
        } catch (err) {
            console.error("Could not load cards:", err);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <img src={topBarLogo} className={styles.headerLogo} />
                <img src={userLogo} className={styles.avatar} />
            </header>

            <main className={styles.main}>
                <div className={styles.bigCard} onClick={() => navigate("/home/characterselect", { state: { user: user } })}>Card Wars</div>
                <div className={styles.sideCards}>
                    <div className={styles.smallCard} onClick={openCards}>
                        Cards
                    </div>
                    <div
                        className={styles.smallCard}
                        onClick={() => setModal("settings")}
                    >
                        Settings
                    </div>
                </div>
            </main>

            <Overlay
                isOpen={modal !== null}
                onClose={() => setModal(null)}
                variant={modal}
            >
                {modal === "cards" && (
                    <div className={styles.cardsContent}>
                        {cards.length === 0 ? (
                            <p>You have no cards yet.</p>
                        ) : (
                            <div className={styles.cardsGrid}>
                                {cards.map((card) => (
                                    <div
                                        key={card.card_id}
                                        className={
                                            `${styles.cardItem} ` +
                                            styles[
                                                `cardItem${card.faction.replace(
                                                    /\s+/g,
                                                    ""
                                                )}`
                                            ]
                                        }
                                    >
                                        <span className={styles.cardCost}>
                                            {card.cost}
                                        </span>
                                        <span
                                            className={
                                                `${styles.cardRarity} ` +
                                                styles[
                                                    `cardRarity${card.rarity.replace(
                                                        /\s+/g,
                                                        ""
                                                    )}`
                                                ]
                                            }
                                        >
                                            {card.rarity}
                                        </span>
                                        <span
                                            className={
                                                `${styles.cardFaction} ` +
                                                styles[
                                                    `cardFaction${card.faction.replace(
                                                        /\s+/g,
                                                        ""
                                                    )}`
                                                ]
                                            }
                                        >
                                            {card.faction}
                                        </span>

                                        {card.image_url && (
                                            <img
                                                src={card.image_url}
                                                alt={card.name}
                                                className={
                                                    `${styles.cardImage} ` +
                                                    styles[
                                                        `cardImage${card.faction.replace(
                                                            /\s+/g,
                                                            ""
                                                        )}`
                                                    ]
                                                }
                                            />
                                        )}

                                        <div className={styles.cardName}>
                                            {card.name}
                                        </div>

                                        <div className={styles.cardAbility}>
                                            <div>
                                                FLOOP ({card.floop_cost} Magic)
                                            </div>
                                            {card.floop_ability_info}
                                        </div>

                                        <div className={styles.cardStats}>
                                            <span>attack: {card.attack}</span>
                                            <span>defense: {card.defense}</span>
                                            <span>
                                                quantity: {card.quantity}
                                            </span>
                                            <span></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                {modal === "settings" && (
                    <>
                        <h2>Settings Content</h2>
                        <p>This is the Settings modal for Home page.</p>
                    </>
                )}
            </Overlay>
        </div>
    );
};
