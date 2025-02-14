import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebase';
import Card from './Card';
import SignOut from '../SignOut';

function GameBoard({ gameCode, playerNumber }) {

    return (
        <div style={{ textAlign: 'center' }}>
            <SignOut></SignOut>
            <h1>Game Board</h1>
        </div>
    );
}

export default GameBoard;
