import { onRequest } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/logger';
import express from 'express';
import admin from 'firebase-admin';
import { join } from 'path';
import { listEvents } from "./google";
import { isAuthenticated } from './auth';
const serviceAccount = require(join(process.cwd(), "firebase_admin.json"));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const app = express();

app.get('/', (req, res) => {
    return res.status(200).send()
})

app.get('/create', isAuthenticated, (req, res) => {
    return res.status(200).send()
})

app.post('/delete', (req, res) => {
    return res.status(200).send()
})


exports.api = onRequest(app)