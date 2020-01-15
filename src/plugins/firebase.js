import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/messaging'
import 'firebase/storage'
import 'firebase/auth'
import 'firebase/database'

const config = {
    apiKey: process.env.VUE_APP_FIREBASE_APIKEY,
    authDomain: process.env.VUE_APP_FIREBASE_AUTHDOMAIN,
    databaseURL: process.env.VUE_APP_FIREBASE_DATABASEURL,
    projectId: process.env.VUE_APP_FIREBASE_PROJECTID,
    storageBucket: process.env.VUE_APP_FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGINGSENDERID,
    appId: process.env.VUE_APP_FIREBASE_APPID,
    measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENTID,
};

firebase.initializeApp(config);

// Initialize Cloud Firestore through Firebase
let firestore = firebase.firestore()
let storage = firebase.storage().ref()
let database = firebase.database()

firestore.enablePersistence()
    .catch(function (err) {
        if (err.code === 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled
            // in one tab at a a time.
            // ...
        } else if (err.code === 'unimplemented') {
            // The current browser does not support all of the
            // features required to enable persistence
            // ...
        }
    });

export {
    firestore,
    storage,
    firebase,
    database
}