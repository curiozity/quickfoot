import { types } from '../types/types';
import { firebase, googleAuthProvider } from '../firebase/firebase-config';

export const startLoginEmailPassword = ( email, password ) => {
    return ( dispatch ) => {
        firebase.auth().signInWithEmailAndPassword( email, password )
            .then( ({ user }) => {
                dispatch ( login( user.uid, user.displayName ) )
            })
    }
}

export const startGoogleLogin = () => {
    return ( dispatch ) => {
        firebase.auth().signInWithPopup( googleAuthProvider )
            .then ( ({ user }) => {
                dispatch ( login( user.uid, user.displayName ) )
            })
    }
}

export const login = ( uid, displayName ) => {
    return {
        type: types.login,
        payload: {
            uid,
            displayName,
        }
    }

}

export const startLogout = () => {
    return async( dispatch ) => {
        await firebase.auth().signOut();

        dispatch( logout() );
    }
}

export const logout = () => ({
    type: types.logout
})