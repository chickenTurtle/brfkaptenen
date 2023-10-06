import { join } from "path";
import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";
import * as admin from "firebase-admin";
import { hashCode, createEmail } from "./email";

const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.labels",
  "https://mail.google.com/",
  "https://www.googleapis.com/auth/gmail.metadata",
];
const CREDENTIALS_PATH = join(process.cwd(), "creds.json");

async function authorize() {
  const auth = new google.auth.GoogleAuth({
    scopes: SCOPES,
    keyFile: CREDENTIALS_PATH,
  });
  return auth.getClient();
}

async function listEvents() {
  let auth = await authorize();
  const calendar = google.calendar({ version: "v3", auth: auth });
  return calendar.events.list({
    calendarId: process.env.CALENDAR_ID,
    timeMin: new Date().toISOString(),
    singleEvents: true,
    orderBy: "startTime",
  });
}

async function createEvent(startDate, endDate, name, email) {
  let auth = await authorize();
  const calendar = google.calendar({ version: "v3", auth: auth });
  return calendar.events.insert({
    calendarId: process.env.CALENDAR_ID,
    requestBody: {
      summary: `${name}`,
      description: `Bokning av övernattningslokalen av: ${name}, ${email}`,
      hangoutLink: null,
      reminders: {
        overrides: [],
        useDefault: false,
      },
      start: {
        dateTime: startDate,
        timeZone: "Europe/Stockholm",
      },
      end: {
        dateTime: endDate,
        timeZone: "Europe/Stockholm",
      },
      extendedProperties: {
        private: {
          email,
          name,
        },
      },
    },
  });
}

async function deleteEvent(eventId) {
  let auth = await authorize();
  const calendar = google.calendar({ version: "v3", auth: auth });
  return calendar.events.delete({
    calendarId: process.env.CALENDAR_ID,
    eventId: eventId,
  });
}

async function listBookings(email) {
  let auth = await authorize();
  const calendar = google.calendar({ version: "v3", auth: auth });
  return calendar.events.list({
    calendarId: process.env.CALENDAR_ID,
    orderBy: "startTime",
    singleEvents: true,
    privateExtendedProperty: `email=${email}`,
  });
}

async function signup(name, email, password) {
  return admin.auth().createUser({
    email: email,
    emailVerified: false,
    password: password,
    displayName: name,
    disabled: false,
  });
}

async function sendMail(user) {
  let client = await authorize();
  client.subject = "david.forslof@kaptenenbrf.org";
  const gmail = google.gmail({ version: "v1", auth: client });
  let mail = await createEmail(user);
  return gmail.users.messages.send({
    userId: "david.forslof@kaptenenbrf.org",
    resource: {
      raw: mail,
    },
  });
}

sendMail({
  displayName: "David",
  email: "forslof.d@gmail.com",
});

export const listEvents = listEvents;
export const listBookings = listBookings;
export const createEvent = createEvent;
export const deleteEvent = deleteEvent;
export const signup = signup;
export const sendMail = sendMail;
