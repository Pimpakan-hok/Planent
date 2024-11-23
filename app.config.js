import 'dotenv/config';

export default {
  "expo": {
    "owner": "planenter",
    "name": "Planent",
    "slug": "Planent",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    extra: {
      apiKey: "AIzaSyDjy8_EaGz9QD6YkWBisvqc31tTGSU58NI",
      authDomain: "planents-aa2b4.firebaseapp.com",
      projectId: "planents-aa2b4",
      storageBucket: "planents-aa2b4.appspot.com",
      messagingSenderId: "658439112796",
      appId: "1:658439112796:web:2b487dd0cc17d17472be99",
      measurementId: "G-29J6QG51H6"
    }
  }
};