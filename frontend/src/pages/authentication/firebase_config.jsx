import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
//GetAuth Method is used to Configure our app to use Firebase Authentication
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_APIKEY,
    authDomain: process.env.REACT_APP_AUTHDOMAIN,
    projectId: process.env.REACT_APP_PROJECTID,
    storageBucket: process.env.REACT_APP_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
    appId: process.env.REACT_APP_APPID
};

const requiredConfigKeys = [
    "apiKey",
    "authDomain",
    "projectId",
    "storageBucket",
    "messagingSenderId",
    "appId"
];

export const firebaseIsConfigured = requiredConfigKeys.every(
    (key) => typeof firebaseConfig[key] === "string" && firebaseConfig[key].length > 0
);

let app = null;
let auth = null;
let googleProvider = null;
let db = null;

if (firebaseIsConfigured) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    db = getFirestore(app);
} else {
    console.error(
        "Firebase is not configured. Please create a .env file in the frontend root with REACT_APP_APIKEY, REACT_APP_AUTHDOMAIN, REACT_APP_PROJECTID, REACT_APP_STORAGEBUCKET, REACT_APP_MESSAGINGSENDERID, and REACT_APP_APPID."
    );
}

export { app, auth, db, googleProvider };
