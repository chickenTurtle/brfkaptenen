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

app.get('/listevents', isAuthenticated, (req, res) => {
    listEvents().then((events) => {
        console.log(events)
        res.status(200).json(events.data.items)
        res.send()
    })
})

app.post('/create', isAuthenticated, (req, res) => {
    let { startDate, endDate } = req.body;
    let { user } = req;
    createEvent(startDate, endDate, user.displayName, user.email)
        .then((event) => {
            if (event.status == 200)
                res.status(200).json(event.data).send()
            else
                res.status(500).send()
        }).catch((err) => {
            res.status(err.code).json(err).send()
        })
})

app.post('/delete', isAuthenticated, (req, res) => {
    res.status(200).send()
})

app.post('/signup', (req, res) => {
    let { name, email, password } = req.body;
    if (!name)
        res.status(500).json({ message: "Name is required.", code: "name" }).send()
    signup(name, email, password)
        .then((user) => {
            console.log(user)
            res.status(200).send();
        }).catch((err) => {
            res.status(500).json(err).send()
        });
})


export const api = onRequest(app)