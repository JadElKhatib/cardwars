import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import styles from "./DeckSelect.module.css";
import arrow from "../../assets/backarrow.jpg";

export const DeckSelect = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { user, you, opponent } = state || {};

    if (!user || !you || !opponent) {
        return <Navigate to="/" replace />;
    }

    const MAX_DECK = 7;
    const [cards, setCards] = useState([]);
    const [available, setAvailable] = useState({});
    const [deck, setDeck] = useState([]);
    const [selecting, setSelecting] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(
                    `http://localhost:3000/users/${user.user_id}/cards`
                );
                if (!res.ok) throw new Error(`Status ${res.status}`);
                const data = await res.json();
                setCards(data);
                const map = {};
                data.forEach((c) => {
                    map[c.card_id] = { ...c };
                });
                setAvailable(map);
            } catch (err) {
                console.error("Could not load cards:", err);
            }
        })();
    }, [user.user_id]);

    const addToDeck = (card) => {
        if (deck.length >= MAX_DECK) return;
        setDeck([...deck, card]);
        setAvailable((a) => ({
            ...a,
            [card.card_id]: {
                ...a[card.card_id],
                quantity: a[card.card_id].quantity - 1,
            },
        }));
        setSelecting(false);
    };

    const removeFromDeck = (idx) => {
        const removed = deck[idx];
        setDeck(deck.filter((_, i) => i !== idx));
        setAvailable((a) => ({
            ...a,
            [removed.card_id]: {
                ...removed,
                quantity: (a[removed.card_id].quantity || 0) + 1,
            },
        }));
    };

    const expanded = cards.flatMap((card) => {
        const qty = available[card.card_id]?.quantity || 0;
        return Array.from({ length: qty }, (_, i) => ({
            ...card,
            instance: i,
        }));
    });

    return (
        <div
            className={`${styles.deckContainer} ${
                selecting ? styles.selecting : ""
            }`}
        >
            <div className={styles.cardsContent}>
                {expanded.length === 0 ? (
                    <p>You have no cards yet.</p>
                ) : (
                    <div className={styles.cardsGrid}>
                        {expanded.map((card) => (
                            <div
                                key={`${card.card_id}-${card.instance}`}
                                className={`${styles.cardItem} ${
                                    styles[
                                        `cardItem${card.faction.replace(
                                            /\s+/g,
                                            ""
                                        )}`
                                    ]
                                }`}
                                onClick={
                                    selecting
                                        ? () => addToDeck(card)
                                        : undefined
                                }
                            >
                                <span className={styles.cardCost}>
                                    {card.cost}
                                </span>
                                <span
                                    className={`${styles.cardRarity} ${
                                        styles[
                                            `cardRarity${card.rarity.replace(
                                                /\s+/g,
                                                ""
                                            )}`
                                        ]
                                    }`}
                                >
                                    {card.rarity}
                                </span>
                                <span
                                    className={`${styles.cardFaction} ${
                                        styles[
                                            `cardFaction${card.faction.replace(
                                                /\s+/g,
                                                ""
                                            )}`
                                        ]
                                    }`}
                                >
                                    {card.faction}
                                </span>

                                {card.image_url && (
                                    <img
                                        src={card.image_url}
                                        alt={card.name}
                                        className={`${styles.cardImage} ${
                                            styles[
                                                `cardImage${card.faction.replace(
                                                    /\s+/g,
                                                    ""
                                                )}`
                                            ]
                                        }`}
                                    />
                                )}

                                <div className={styles.cardName}>
                                    {card.name}
                                </div>

                                <div className={styles.cardAbility}>
                                    <div>FLOOP ({card.floop_cost} Magic)</div>
                                    {card.floop_ability_info}
                                </div>

                                <div className={styles.cardStats}>
                                    <span>attack: {card.attack}</span>
                                    <span>defense: {card.defense}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.deck}>
                {deck.map((card, idx) => (
                    <div
                        key={`${card.card_id}-${idx}`}
                        className={`${styles.cardItem} ${
                            styles[
                                `cardItem${card.faction.replace(/\s+/g, "")}`
                            ]
                        }`}
                        onClick={() => removeFromDeck(idx)}
                    >
                        <span className={styles.cardCost}>{card.cost}</span>
                        <span
                            className={`${styles.cardRarity} ${
                                styles[
                                    `cardRarity${card.rarity.replace(
                                        /\s+/g,
                                        ""
                                    )}`
                                ]
                            }`}
                        >
                            {card.rarity}
                        </span>
                        <span
                            className={`${styles.cardFaction} ${
                                styles[
                                    `cardFaction${card.faction.replace(
                                        /\s+/g,
                                        ""
                                    )}`
                                ]
                            }`}
                        >
                            {card.faction}
                        </span>

                        {card.image_url && (
                            <img
                                src={card.image_url}
                                alt={card.name}
                                className={`${styles.cardImage} ${
                                    styles[
                                        `cardImage${card.faction.replace(
                                            /\s+/g,
                                            ""
                                        )}`
                                    ]
                                }`}
                            />
                        )}

                        <div className={styles.cardName}>{card.name}</div>

                        <div className={styles.cardAbility}>
                            <div>FLOOP ({card.floop_cost} Magic)</div>
                            {card.floop_ability_info}
                        </div>

                        <div className={styles.cardStats}>
                            <span>attack: {card.attack}</span>
                            <span>defense: {card.defense}</span>
                        </div>
                    </div>
                ))}

                {deck.length < MAX_DECK && (
                    <div
                        className={styles.dashed}
                        onClick={() => setSelecting(true)}
                    >
                        <span className={styles.plus}>+</span>
                    </div>
                )}
            </div>

            <div className={styles.footer}>
                <button
                    className={styles.arrow}
                    onClick={() =>
                        navigate("/home/characterselect", {
                            state: { user, you, opponent },
                        })
                    }
                >
                    <img src={arrow} className={styles.leftarrow} /> Character
                    Select
                </button>
                <button
                    className={styles.arrow}
                    onClick={() =>
                        navigate("/home/characterselect", {
                            state: { user, you, opponent },
                        })
                    }
                >
                    Choose Deck{" "}
                    <img src={arrow} className={styles.rightarrow} />
                </button>
            </div>
        </div>
    );
};
