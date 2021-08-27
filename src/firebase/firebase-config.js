import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {

    apiKey: "AIzaSyAGOzqvxtzt_aIvKp2usSqn9x4EwNYXMrg",

    authDomain: "quickfoot.firebaseapp.com",

    projectId: "quickfoot",

    storageBucket: "quickfoot.appspot.com",

    messagingSenderId: "651263451801",

    appId: "1:651263451801:web:592a80a136431c60834e08"

};

// Initialize Firebase

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export {
    db,
    googleAuthProvider,
    firebase,
}

