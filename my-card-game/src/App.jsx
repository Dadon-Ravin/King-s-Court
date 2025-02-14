import React, { useState, useEffect } from 'react';
import MainPage from './components/MainPage';
import Lobby from './components/Lobby';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { db } from './firebase';


function App() {
  const [gameCode, setGameCode] = useState(null); // Tracks game code if the user is in a game
  const [currentUserUID, setCurrentUserUID] = useState(null); // Tracks current user UID
  const [loading, setLoading] = useState(true); // For loading state
  const [playerNumber, setPlayerNumber] = useState(null);
  const [oppNumber, setOppNumber] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    // Listen to authentication state changes
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        try {
          await signInAnonymously(auth); // Sign in the user anonymously
        } catch (error) {
          console.error("Error signing in anonymously:", error);
        }
      } else if (user) {
        setCurrentUserUID(user.uid);

        // Listen for changes in the games node to track the user's status
        const gamesRef = ref(db, 'games');
        onValue(gamesRef, (snapshot) => {
          let userInGame = null;

          snapshot.forEach((gameSnapshot) => {
            const gameData = gameSnapshot.val();
            if (gameData.players.player1.id === user.uid || gameData.players.player2?.id === user.uid) {
              userInGame = gameSnapshot.key; // Store game code if user is in a game
              (gameData.players.player1.id === user.uid ? setPlayerNumber(1) : setPlayerNumber(2));

            }
          });

          setGameCode(userInGame); // Set the gameCode to the game ID or null
        });
      }
      setLoading(false); // Set loading to false after auth check
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [auth]);

  if (loading) {
    return <div>Loading...</div>; // Display a loading message while fetching data
  }

  return (
    <div className="App">
      {
        currentUserUID ? (
          gameCode ? (
            <>
              <Lobby gameCode={gameCode} playerNumber={playerNumber} />
            </>
          ) : (
            <>
              <MainPage setGameCode={setGameCode} />
            </>
          )
        ) : (
          <div>Please log in to play.</div> // If no user logged in
        )}
    </div>
  );
}

export default App;
