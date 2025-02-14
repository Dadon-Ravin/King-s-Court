import React from 'react';
import { motion } from "framer-motion";

function Card({ rank, revealed, player, playerNumber }) {
    console.log("Card Info:", { rank, revealed, player, playerNumber });
    // Determine the card color
    const color = player === 1 ? 'red' : 'black';

    // Determine if the card should be face up
    const isFaceUp = revealed || player === playerNumber;

    // Set the correct image path
    const imagePath = isFaceUp
        ? `/images/${color}/${rank}.svg`  // Face-up card
        : `/images/${color}/back.svg`;    // Face-down card

    return (
        <motion.img
            src={imagePath}
            alt={isFaceUp ? `${rank} of ${color}` : 'Card back'}
            onError={(e) => console.error('Image failed to load:', imagePath, e)}
            style={{
                width: '80px',
                height: '120px',
                margin: '5px',
            }}
            whileHover={{ scale: 1.15 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
        />
    );
}

export default Card;
