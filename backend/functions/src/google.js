import { promises as fs } from 'fs';
import { join } from 'path';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
import * as admin from 'firebase-admin'

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const CREDENTIALS_PATH = join(process.cwd(), "dev_creds.json");

async function authorize() {
    const auth = new google.auth.GoogleAuth({
        scopes: SCOPES,
        keyFile: CREDENTIALS_PATH
    });
    const authClient = await auth.getClient();
    google.options({ auth: authClient });
}

async function listEvents() {
    await authorize();
    const calendar = google.calendar({ version: 'v3' });
    const res = await calendar.events.list({
        calendarId: process.env.CALENDAR_ID,
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    });
    const events = res.data.items;
    if (!events || events.length === 0) {
        return;
    }
    events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
    });
}

async function createEvent(startDate, endDate, name, email) {
    await authorize();
    const calendar = google.calendar({ version: 'v3' });
    return await calendar.events.insert({
        calendarId: process.env.CALENDAR_ID,
        requestBody: {
            summary: `${name}`,
            description: `Bokning av övernattningslokalen av: ${email}`,
            hangoutLink: null,
            reminders: {
                overrides: [],
                useDefault: false
            },
            start: {
                dateTime: startDate,
                timeZone: "Europe/Stockholm"
            },
            end: {
                dateTime: endDate,
                timeZone: "Europe/Stockholm"
            }
        }
    })
}

async function deleteEvent(eventId) {
    await authorize();
    const calendar = google.calendar({ version: 'v3' });
    const res = await calendar.events.delete({
        calendarId: process.env.CALENDAR_ID,
        eventId: eventId
    })
    return res
}

async function signup(name, email, password) {
    return admin.auth().createUser({
        email: email,
        emailVerified: false,
        password: password,
        displayName: name,
        disabled: false,
    })
}

export const listEvents = listEvents;
export const createEvent = createEvent;
export const deleteEvent = deleteEvent;
export const signup = signup;


