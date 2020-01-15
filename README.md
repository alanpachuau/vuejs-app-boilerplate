# VueJs Web Application Boilerplate
VueJs Application using Firebase Firestore and Algolia. This boilerplate project includes basic admin layout with user management and login.

## Preliminary Configuration
## Setup
1. Rename .env.example to .env file.
1. Create firebase project in Google firebase console. Then in the console project settings page, add new web app and copy the config file. Now update the configuration in .env file.
1. Create first user in Firebase Authentication page using email. This will be used for logging in the boilerplate app. 
1. Go to Google API Console, first enable IAM service. Then go to IAM Admin page [https://console.developers.google.com/iam-admin/iam]. Under permission tab, look for "PROJECT-ID@appspot.gserviceaccount.com", click edit icon and add new role "Service Account Token Creator". This will be necessary to create custom token for user login.
1. Create new app in Algolia and copy the API Keys and update the .env file.
1. Now, deploy project to firebase. This will deploy rules, indexes, functions and hosting for the base project
    ```
    firebase deploy
    ```
1. Run `npm install` in the project root and functions directory

## General Commands during Development

#### 1. Compiles and hot-reloads for development
```
npm run serve
```

#### 2. Compiles and minifies for production
```
npm run build
```

#### 3. Lints and fixes files
```
npm run lint
```

#### 4. Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
