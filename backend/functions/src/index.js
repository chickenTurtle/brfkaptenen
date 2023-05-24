import { onRequest } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/logger';
import * as express from 'express';
import * as admin from 'firebase-admin'
import { join } from 'path';
import * as bodyParser from 'body-parser';
import { listEvents, signup, createEvent } from "./google";
import { isAuthenticated } from './auth';
const serviceAccount = require(join(process.cwd(), "dev_creds.json"));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const app = express();
app.use(bodyParser.json())

app.get('/', (req, res) => {
    return res.status(200).send()
})

app.post('/create', isAuthenticated, (req, res) => {
    let { startDate, endDate } = req.body;
    let { user } = req;
    createEvent(startDate, endDate, user.displayName, user.email).then((event) => {
        if (event.status == 200)
            return res.status(200).send()
        return res.status(500).send()
    }).catch((err) => {
        console.log(err)
        return res.status(500).send()
    })
})

app.post('/delete', isAuthenticated, (req, res) => {
    return res.status(200).send()
})

app.post('/signup', (req, res) => {
    let { name, email, password } = req.body;
    signup(name, email, password)
        .then(() => res.status(200).send())
        .catch(() => res.status(500).send());
})


export const api = onRequest(app)