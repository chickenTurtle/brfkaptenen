import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/logger";
import * as express from "express";
import * as admin from "firebase-admin";
import { join } from "path";
import * as bodyParser from "body-parser";
import { listEvents, signup, createEvent, listBookings } from "./google";
import { isAuthenticated } from "./auth";
import { start } from "repl";
import * as cors from "cors";
import { sendMail, hashCode } from "./email";
const serviceAccount = require(join(process.cwd(), "creds.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: true }));

app.get("/api/listevents", isAuthenticated, (req, res) => {
  listEvents().then((events) => {
    return res.status(200).send(events.data.items);
  });
});

app.get("/api/bookings", isAuthenticated, (req, res) => {
  listBookings(req.user.email).then((events) => {
    console.log(events.data.items);
    return res.status(200).send(events.data.items);
  });
});

app.post("/api/create", isAuthenticated, (req, res) => {
  let { startDate, endDate } = req.body;
  admin
    .auth()
    .getUser(req.user.uid)
    .then((user) => {
      if (startDate === endDate)
        return res.status(500).send({ message: "Du måste boka minst 1 natt" });

      createEvent(startDate, endDate, user.displayName, user.email)
        .then((event) => {
          if (event.status == 200) return res.status(200).send(event.data);
          else return res.status(500).send();
        })
        .catch((err) => {
          return res.status(err.code).send(err);
        });
    });
});

app.post("/api/delete", isAuthenticated, (req, res) => {
  return res.status(200).send();
});

app.post("/api/verify", isAuthenticated, (req, res) => {
  let { email, hash } = req.body;

  admin
    .auth()
    .getUserByEmail(email)
    .then((user) => {
      if (`${hash}` === `${hashCode(user)}`) {
        admin
          .auth()
          .updateUser(user.uid, {
            emailVerified: true,
          })
          .then(() => {
            return res.status(200).send();
          })
          .catch((err) => {
            return res.status(500).send();
          });
      } else return res.status(500).send();
    });
});

app.post("/api/verified", (req, res) => {
  let { email } = req.body;
  admin
    .auth()
    .getUserByEmail(email)
    .then((user) => {
      if (user.emailVerified) return res.status(200).send();
      else return res.status(500).send();
    });
});

app.post("/api/signup", (req, res) => {
  let { name, email, password } = req.body;
  if (!name)
    res.status(500).send({ message: "Name is required.", code: "name" });
  signup(name, email, password)
    .then((user) => {
      sendMail(user).then((_, err) => {
        if (err)
          return res
            .status(500)
            .send({ message: "Kunde inte skicka verifieringsmail" });
        else return res.status(200).send();
      });
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
});

export const api = onRequest({ region: "europe-west1" }, app);
