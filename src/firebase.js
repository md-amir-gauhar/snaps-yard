import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyBEtMruqKPBzneYrQHCNyGHW86xml8We8c',
  authDomain: 'quotes-yard.firebaseapp.com',
  databaseURL: 'https://quotes-yard.firebaseio.com',
  projectId: 'quotes-yard',
  storageBucket: 'quotes-yard.appspot.com',
  messagingSenderId: '557423758248',
  appId: '1:557423758248:web:6e49a8cc182648b055ab9d',
  measurementId: 'G-TZMWLCYHL7',
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
