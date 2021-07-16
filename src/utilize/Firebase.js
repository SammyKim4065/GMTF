import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const config = {
  apiKey: "AIzaSyBT5yrInPPxLZIVvoBnGpMRE_i6GFU93gs",
  authDomain: "give-me-the-food.firebaseapp.com",
  databaseURL: "https://give-me-the-food-default-rtdb.firebaseio.com",
  projectId: "give-me-the-food",
  storageBucket: "give-me-the-food.appspot.com",
  messagingSenderId: "925392674083",
  appId: "1:925392674083:web:6962d34ba77645a82ac096",
  measurementId: "G-WZGKSVHT6S",
};

export default !firebase.apps.length
  ? firebase.initializeApp(config)
  : firebase.app();
