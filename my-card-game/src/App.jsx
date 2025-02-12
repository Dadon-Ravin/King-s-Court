import React, { useState, useEffect } from 'react';
import MainPage from './components/MainPage';
import Lobby from './components/Lobby';
import { getAuth } from 'firebase/auth';

function App() {
  // This state will hold the game code if a game is created.
  const [gameCode, setGameCode] = useState(null);
  const auth = getAuth();
  const [currentUserUID, setCurrentUserUID] = useState(null);

  useEffect(() => {
    // Wait for the auth to initialize.
    if (auth.currentUser) {
      setCurrentUserUID(auth.currentUser.uid);
    }
  }, [auth.currentUser]);

  // If gameCode exists, render the Lobby, otherwise render the MainPage.
  return (
    <div className="App">
      {gameCode ? (
        <Lobby gameCode={gameCode} currentUserUID={currentUserUID} />
      ) : (
        // Pass the setGameCode function as a prop to update gameCode when a game is created.
        <MainPage setGameCode={setGameCode} />
      )}
    </div>
  );
}

export default App;
