import { onRequest } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/logger';
import * as express from 'express';
import * as admin from 'firebase-admin'
import { join } from 'path';
import * as bodyParser from 'body-parser';
import { listEvents, signup, createEvent } from "./google";
import { isAuthenticated } from './auth';
import { start } from 'repl';
import * as cors from 'cors';
const serviceAccount = require(join(process.cwd(), "dev_creds.json"));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const app = express();
app.use(bodyParser.json())
app.use(cors({ origin: true }))

app.get('/api/listevents', isAuthenticated, (req, res) => {
    listEvents().then((events) => {
        return res.status(200).send(events.data.items)
    })
})

app.post('/api/create', isAuthenticated, (req, res) => {
    let { startDate, endDate } = req.body;
    let { user } = req;
    if (startDate === endDate)
        return res.status(500).send({ message: "Du måste boka minst 1 natt" })

    createEvent(startDate, endDate, user.displayName, user.email)
        .then((event) => {
            if (event.status == 200)
                return res.status(200).send(event.data)
            else
                return res.status(500).send()
        }).catch((err) => {
            return res.status(err.code).send(err)
        })
})

app.post('/api/delete', isAuthenticated, (req, res) => {
    return res.status(200).send()
})

app.post('/api/signup', (req, res) => {
    let { name, email, password } = req.body;
    if (!name)
        res.status(500).send({ message: "Name is required.", code: "name" })
    signup(name, email, password)
        .then((user) => {
            return res.status(200).send();
        }).catch((err) => {
            return res.status(500).send(err)
        });
})

export const api = onRequest(app)