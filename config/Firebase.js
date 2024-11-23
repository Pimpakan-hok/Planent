import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDjy8_EaGz9QD6YkWBisvqc31tTGSU58NI",
  authDomain: "planents-aa2b4.firebaseapp.com",
  projectId: "planents-aa2b4",
  storageBucket: "planents-aa2b4.appspot.com",
  messagingSenderId: "658439112796",
  appId: "1:658439112796:web:2b487dd0cc17d17472be99",
  measurementId: "G-29J6QG51H6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var firestore = firebase.firestore();
const auth = firebase.auth();

export default firebase;


