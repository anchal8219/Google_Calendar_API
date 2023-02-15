import dotenv from "dotenv";

dotenv.config({});

import express from 'express';
import axios from 'axios';
import {google} from 'googleapis';
import dayjs from 'dayjs'


// const {google} = require('googleapis');
const calendar = google.calendar({
  version: 'v3',
  auth: process.env.API_KEY,// specify your API key here
});

const app = express();

const PORT = process.env.NODE_ENV || 8000;

const oauth2Client =  new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL

)

// generate a url that asks permissions for Blogger and Google Calendar scopes
const scopes = [
    'https://www.googleapis.com/auth/calendar'
];

const token = "";







app.get('/google',(req,res)=>{
    //this url could be used for logging the user
    const url = oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',
    
        // If you only need one scope you can pass it as a string
        scope: scopes
    });
    res.redirect(url);
});

app.get('/google/redirect', async (req,res)=>{
    // console.log(req.query)

    const code = req.query.code;

    // This will provide an object with the access_token and refresh_token.
    // Save these somewhere safe so they can be used at a later time.
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens);

    // oauth2Client.on('tokens', (tokens) => {
    //     if (tokens.refresh_token) {
    //       // store the refresh_token in my database!
    //       console.log(tokens.refresh_token);
    //     }
    //     console.log(tokens.access_token);
    //   });
    //   oauth2Client.setCredentials({
    //     refresh_token: `STORED_REFRESH_TOKEN`
    //   });
    res.send({
        msg: 'You have succeesfully logged in',
    });
});

app.get("/schedule_event", async (req,res)=>{
    console.log(oauth2Client.credentials.access_token);
    await calendar.events.insert({
        calendarId: "primary",
        auth: oauth2Client,
        requestBody: {
        summary: 'This is a test event' ,
        description :"some",
        start: {
            dateTime: dayjs(new Date()).add(1, 'day').toISOString(),
            timeZone: "Asia/Kolkata",
        },
        end: {
            dateTime: dayjs(new Date()).add(1, 'day').add(1, 'hour').toISOString(),
            timeZone: "Asia/Kolkata",
        }
    },
    })

    res.send({
        msg: "Done",
    });
});



app.listen(PORT, ()=>{
    console.log('server started on port ', PORT)
})