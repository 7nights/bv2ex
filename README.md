<img width="48px" height="48px" align="right" alt="bv2ex Logo" src="https://i.imgur.com/ZcRXQaA.png" title="bv2ex"/>

# bv2ex

A Better Way to Experience is a redesigned V2EX web application. 

## Installation

Please install [get-v2ex](https://github.com/7nights/get-v2ex) first. And then follow the instruction below.

To install bv2ex:

### Step 1
Click the Releases tab, find the latest release and download it on your server.

```shell
wget bv2ex.zip
```

### Step 2
Move the zip file to the directory of get-v2ex and unzip it there.

```shell
mv bv2ex.zip [path to your get-v2ex]
```

### Step 3
Open `[path to your get-v2ex]/public/config.js`, then fill in all the properties. For example:

```javascript
module.exports = {
  serverAddress: 'https://example.com/api',
  clientAddress: 'http://example.com/',
  firebaseConfig: {},
  fcmPublicVapidKey: ''
};
```
To get Firebase configuration:
  1. **Register your app in your FCM project**
  - In the [Firebase console's project overview page](https://console.firebase.google.com/), click the Web icon (**< >**) to launch the setup workflow.
  - Enter your app's nickname then click **Register**. 
  - At right now you can see a code snippet, then copy what the firebaseConfig is to your `config.js`. For example:
    
    ```javascript
    module.exports = {
      serverAddress: 'https://example.com/api',
      clientAddress: 'http://example.com/',
      firebaseConfig: {
        apiKey: "AIzaSyAmn_CNq_-aun4d428kYKAbjfgsVrhLibc",
        authDomain: "bv2ex-35d15.firebaseapp.com",
        databaseURL: "https://bv2ex-35d15.firebaseio.com",
        projectId: "bv2ex-35d15",
        storageBucket: "bv2ex-35d15.appspot.com",
        messagingSenderId: "728560720104",
        appId: "1:728560720104:web:c834eb2349eb7c64"
      },
      fcmPublicVapidKey: ''
    };
    ```
  2. **Configure web credentials with FCM**
  - Open the [Cloud Messaging](https://console.firebase.google.com/project/_/settings/cloudmessaging/) tab of the Firebase console **Settings** pane and scroll to the Web configuration section.
  - In the **Web Push certificates** tab, click **Generate Key Pair**. The console displays a notice that the key pair was generated, and displays the public key string and date added.
  - Fill in `fcmPublicVapidKey` with the key pair you just generated.

### Step 4

Run build command.
```shell
npm run build
```

