importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBSVotC3PvbjA_07yvGmVv-eddpeTfJtVI",
  authDomain: "mydailyibadah.firebaseapp.com",
  projectId: "mydailyibadah",
  storageBucket: "mydailyibadah.firebasestorage.app",
  messagingSenderId: "13340575385",
  appId: "1:13340575385:web:cd1b6259b043e9f040da08",
  measurementId: "G-1Z0WZK6V78"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
