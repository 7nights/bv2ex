self.addEventListener('notificationclick', function(event) {
  const notification = event.notification;
  const data = event.data || (notification.data && notification.data.FCM_MSG && notification.data.FCM_MSG.data || notification.data);
  if (data && data.url) {
    self.clients.openWindow(data.url);
  } else {
    self.clients.openWindow(self.CLIENT_PORTAL_URL);
  }
});

importScripts('https://www.gstatic.com/firebasejs/5.11.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.11.1/firebase-messaging.js');

self.CLIENT_PORTAL_URL = '{{clientAddress}}';

var firebaseConfig = {{firebaseConfig}};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  var notificationOptions = {
    body: payload.notification.body,
    icon: self.CLIENT_PORTAL_URL + '/assets/logo-without-bg.png'
  };

  return self.registration.showNotification(payload.notification.title,
    notificationOptions);
});
