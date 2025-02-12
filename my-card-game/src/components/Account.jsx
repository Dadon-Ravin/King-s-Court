import React, { useState, useEffect } from "react";
import { signUp, logIn, playAsGuest } from "../services/authService";
import { getAuth, signOut } from "firebase/auth";

function Account({ setUser }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const auth = getAuth();

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                setIsLoggedIn(true);
                setUser(user.uid);
            } else {
                setIsLoggedIn(false);
                setUser(null);
            }
        });
    }, [auth, setUser]);

    const handleSignUp = async () => {
        const result = await signUp(username, password);
        if (result.success) {
            setUser(result.uid);
        } else {
            setError(result.message);
        }
    };

    const handleLogIn = async () => {
        const result = await logIn(username, password);
        if (result.success) {
            setUser(result.uid);
        } else {
            setError(result.message);
        }
    };

    const handleGuest = async () => {
        const result = await playAsGuest();
        if (result.success) {
            setUser(result.uid);
        } else {
            setError(result.message);
        }
    };

    const handleSignOut = async () => {
        await signOut(auth);
        setUser(null);
    };

    return (
        <div style={{ position: "absolute", top: 10, right: 10 }}>
            {isLoggedIn ? (
                <button onClick={handleSignOut}>Sign Out</button>
            ) : (
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleLogIn}>Log In</button>
                    <button onClick={handleSignUp}>Sign Up</button>
                    <button onClick={handleGuest}>Play as Guest</button>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </div>
            )}
        </div>
    );
}

export default Account;
