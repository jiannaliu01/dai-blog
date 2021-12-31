let firebaseConfig = {
    apiKey: "AIzaSyA1aHO9S16xz1UllaVfbHA2vQWDzn4nXbk",
    authDomain: "blogging-website-67586.firebaseapp.com",
    projectId: "blogging-website-67586",
    storageBucket: "blogging-website-67586.appspot.com",
    messagingSenderId: "570520604835",
    appId: "1:570520604835:web:c2ebc377581b401c5fef16",
    measurementId: "G-P0NTYT9CRL"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  let db = firebase.firestore();