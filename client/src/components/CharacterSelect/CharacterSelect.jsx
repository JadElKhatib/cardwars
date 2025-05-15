import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import styles from "./CharacterSelect.module.css";
import arrow from "../../assets/backarrow.jpg";

export const CharacterSelect = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const user = state?.user;

    if (!user) return <Navigate to="/" replace />;

    const [characters, setCharacters] = useState([]);
    const [youIdx, setYouIdx] = useState(0);
    const [oppIdx, setOppIdx] = useState(0);

    const openCharacters = async () => {
        try {
            const res = await fetch(
                `http://localhost:3000/users/${user.user_id}/characters`
            );
            if (!res.ok) throw new Error(`Status ${res.status}`);
            const data = await res.json();
            setCharacters(data);
            setYouIdx(0);
        } catch (err) {
            console.error("Could not load characters:", err);
        }
    };

    useEffect(() => {
        openCharacters();
    }, []);

    const prevYou = () =>
        setYouIdx((i) => (i - 1 + characters.length) % characters.length);
    const nextYou = () => setYouIdx((i) => (i + 1) % characters.length);

    const prevOpponent = () =>
        setOppIdx((i) => (i - 1 + characters.length) % characters.length);
    const nextOpponent = () => setOppIdx((i) => (i + 1) % characters.length);

    if (characters.length === 0) {
        return <p>Loading characters…</p>;
    }

    const you = characters[youIdx];
    const op = characters[(oppIdx + 1) % characters.length];

    return (
        <div className={styles.picker}>
            <div className={styles.panels}>
                <div className={styles.panel}>
                    <div className={styles.header}>YOU</div>
                    <div className={styles.picture}>
                        <img
                            src={you.character_image_url}
                            alt={you.character_name}
                            className={styles.img}
                        />
                    </div>
                    <div className={styles.info}>
                        <p>Turns: {you.turns}</p>
                        <p>{you.ability_info}</p>
                    </div>
                    <div className={styles.selector}>
                        <button className={styles.arrow} onClick={prevYou}>
                            <img src={arrow} className={styles.minileftarrow} />
                        </button>
                        <span className={styles.name}>
                            {you.character_name}
                        </span>
                        <button className={styles.arrow} onClick={nextYou}>
                            <img
                                src={arrow}
                                className={styles.minirightarrow}
                            />
                        </button>
                    </div>
                </div>

                <div className={styles.panel}>
                    <div className={styles.header}>OPPONENT</div>
                    <div className={styles.picture}>
                        <img
                            src={op.character_image_url}
                            alt={op.character_name}
                            className={styles.img}
                        />
                    </div>
                    <div className={styles.info}>
                        <p>Turns: {op.turns}</p>
                        <p>{op.ability_info}</p>
                    </div>
                    <div className={styles.selector}>
                        <button className={styles.arrow} onClick={prevOpponent}>
                            <img src={arrow} className={styles.minileftarrow} />
                        </button>
                        <span className={styles.name}>{op.character_name}</span>
                        <button className={styles.arrow} onClick={nextOpponent}>
                            <img
                                src={arrow}
                                className={styles.minirightarrow}
                            />
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.footer}>
                <button
                    className={styles.arrow}
                    onClick={() => navigate("/home", { state: { user: user } })}
                >
                    <img src={arrow} className={styles.leftarrow} /> Home
                </button>
                <button
                    className={styles.arrow}
                    onClick={() =>
                        navigate("/home/deckselect", {
                            state: {
                                user: user,
                                you: you,
                                opponent: op
                            },
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
