const firebase = require('firebase/compat/app');
require('firebase/compat/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyA3I-TPs-BKt89HMe3rdlOmvWLAW7YAafQ",
    authDomain: "grpc-45e9c.firebaseapp.com",
    projectId: "grpc-45e9c",
    storageBucket: "grpc-45e9c.appspot.com",
    messagingSenderId: "1036332256902",
    appId: "1:1036332256902:web:14b2e3a3d404c3e2da0b07"
  };
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore();

  module.exports = { firebaseApp, db };