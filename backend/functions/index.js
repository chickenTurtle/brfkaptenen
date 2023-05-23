// See a full list of supported triggers at https://firebase.google.com/docs/functions

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const express = require('express');
const admin = require('firebase-admin');

admin.initializeApp()
const app = express();

app.get('/', (req, res) => {

})

app.post('/create', (req, res) => {

})

app.post('/delete', (req, res) => {

})


exports.api = onRequest(app)