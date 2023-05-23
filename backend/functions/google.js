import { promises as fs } from 'fs';
import { join } from 'path';
import { authenticate } from '@google-cloud/local-auth'
import { google } from 'googleapis'
import { start } from 'repl';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = join(process.cwd(), 'credentials.json');

async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}

async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}

async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}

async function listEvents() {
    const calendar = google.calendar({ version: 'v3', auth: authorize() });
    const res = await calendar.events.list({
        calendarId: process.env.CALENDAR_ID,
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    });
    const events = res.data.items;
    if (!events || events.length === 0) {
        console.log('No upcoming events found.');
        return;
    }
    console.log('Upcoming 10 events:');
    events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
    });
}

async function createEvent(startDate, endDate, name, email) {
    const calendar = google.calendar({ version: 'v3', auth: authorize() });
    // https://developers.google.com/calendar/api/v3/reference/events/insert
    const res = await calendar.events.insert({
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
            },
            attendees: [
                {
                    email: email
                }
            ]
        }
    })
    return res
}

async function deleteEvent(eventId) {
    const calendar = google.calendar({ version: 'v3', auth: authorize() });
    const res = await calendar.events.delete({
        calendarId: process.env.CALENDAR_ID,
        eventId: eventId
    })
    return res
}

export const listEvents = listEvents;
export const createEvent = createEvent;
export const deleteEvent = deleteEvent;

