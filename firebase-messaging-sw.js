importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCs3zQA8NoEysWN_RgNsPQWvETKQFRR0xg",
  authDomain: "cazuelachapina.firebaseapp.com",
  projectId: "cazuelachapina",
  storageBucket: "cazuelachapina.appspot.com",
  messagingSenderId: "184092573788",
  appId: "1:184092573788:web:70ddcece1fb9cbaf8aa699"
});

const messaging = firebase.messaging();