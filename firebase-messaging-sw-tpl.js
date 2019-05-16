self.addEventListener('notificationclick', function(event) {
  const notification = event.notification;
  const data = event.data || (notification.data && notification.data.FCM_MSG && notification.data.FCM_MSG.data || notification.data);
  let url;
  if (data && data.url) {
    url = data.url;
  } else {
    url = self.CLIENT_PORTAL_URL;
  }
  return event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    })
      .then((clientList) => {
        if (clientList && clientList[0]) {
          const client = clientList[0];
          client.focus();
          client.postMessage({
            type: 'navigate',
            data: {
              url
            }
          });
        } else if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
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
    ...payload.notification,
    icon: self.CLIENT_PORTAL_URL + '/assets/logo-without-bg.png'
  };

  return self.registration.showNotification(payload.notification.title,
    notificationOptions);
});
