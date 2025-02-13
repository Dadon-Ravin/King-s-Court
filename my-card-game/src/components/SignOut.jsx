import React, { useState } from 'react';
import { getAuth, signOut, signInAnonymously } from 'firebase/auth';


function SignOut() {
    const [currentUserUID, setCurrentUserUID] = useState(null);
    const auth = getAuth();

    const handleSignOut = async () => {
        await signOut(auth);

        const userCredential = await signInAnonymously(auth);
        setCurrentUserUID(userCredential.user.uid);
        console.log('Signed in as:', userCredential.user.uid);
    }

    return (
        <div style={{ textAlign: 'right', marginTop: '50px' }}>
            <button onClick={handleSignOut}>sign out</button>
        </div>
    );
}

export default SignOut;