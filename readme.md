# Instructions to run the project

`npm i` at the root folder.
`npm i` in the frontend folder.
Go to backend/config/ and make a file 'config.env'

## config.env variables

PORT = 4000  
DB_LOCAL_URL = mongodb://localhost:27017/election

JWT_SECRET =  
JWT_EXPIRE_TIME = 7d  
COOKIE_EXPIRES_TIME = 7

SMTP_HOST = smtp.mailtrap.io  
SMTP_PORT = 2525  
SMTP_AUTH_USER =  
SMTP_AUTH_PASS =  
SMTP_FROM_EMAIL = admin@election.com  
SMTP_FROM_NAME = Admin

CLOUDINARY_CLOUD_NAME =  
CLOUDINARY_API_KEY =  
CLOUDINARY_API_SECRET =

SENDGRID_API_KEY =  
SENDER_EMAIL =

> Put your own JWT_SECRET, SMTP_AUTH_USER, SMTP_AUTH_PASS

Go to root folder and make .env file

## .env variables

ACCOUNT_MNEMONIC= <br>
RINKEBY_ENDPOINT=

> Frontend designed using Tailwind

Go to React root folder and make .env file.

## .env variables.

REACT_APP_Contract =  
REACT_APP_BE_URL = 'http://localhost:4000/api'

> Put your own account mnemoic and rinkeby endpoint

### To get the contract address, do the following in root folder

```
node ethereum/compile.js
node ethereum/deploy.js
```

### To run the project

`npm start` at the root folder to start the backend of the application  
`npm run client` to start the fronend <br>
`npm run dev` to start both frontend and backend

# To contribute

## Setting up Branch

```
git checkout -b <branch name>
git push --set-upstream origin <branch name>

```

## If you are behind main branch in commits, run this

`git pull origin main`

After you have pushed your commit. Go to github, repository and create a pull request

> There might be conflicts which you have to fix manually

# Problem Statement

Elections and voting are the basic mechanisms of a democratic system. There have been various attempts to make modern elections more flexible by using digital technologies. Basic characteristics of free and fair elections are intractability, immutable, transparency and the privacy of the involved actors. This corresponds to a few of the many features of blockchain-like decentralized ownership, the immutability of chain, anonymity and distributed ledger. My problem statement is “To create a robust blockchain based election mechanism that will not only be reliable and secure but also flexible according to the current needs”. The main aim of this proposal is to present a robust blockchain-based election mechanism that not only will be reliable but also flexible according to present needs.

# Architecture

<img width="405" alt="image" src="https://github.com/itsSauravK/Election-Voting-Blockchain/assets/47532084/1563e0df-bf60-48ec-ac5c-6c621b72bb2a">

# About

A secured online voting system built using mongoDB, ExpressJS, ReactJS, NodeJS (MERN), Solidity (Smart Contracts), and web3JS. In this application, the admin can start elections, add candidate, manage users and end elections. The user will able to vote and see all the results of the election held till now.


