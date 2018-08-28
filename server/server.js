require('dotenv').config();
const axios = require('axios')
const express = require('express'),
    session = require('express-session');

const app = express();

let { SERVER_PORT, SECRET, REACT_APP_DOMAIN, REACT_APP_CLIENT_ID, CLIENT_SECRET } = process.env

app.use(express.json());
app.use(
    session({
        secret: SECRET,
        resave: false,
        saveUninitialized: true
    })
);

//ENDPOINTS
app.get('/auth/callback', async (req, res) => {
    const payload = {
        client_id: REACT_APP_CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: req.query.code,
        grant_type: `authorization_code`,
        redirect_uri: `http://${req.headers.host}/auth/callback`
    };
    let resWithToken = await axios.post(
        `https://${REACT_APP_DOMAIN}/oauth/token`,
        payload
    );
    let resWithUserData = await axios.get(`https://${REACT_APP_DOMAIN}/userinfo?access_token=${resWithToken.data.access_token
        }`
    );

    req.session.user = resWithUserData.data;
    res.redirect('/');
})

app.get("/api/user-data", (req, res)=>{
    if(req.session.user) {
res.status(200).send(req.session.user)
    }else {
        res.status(401).send('nice try sucka')
    }
})


app.get('/logout',(req, res)=>{
    req.session.destroy();
    res.redirect('http://localhost:3000/')
})

//LISTEN ON A PORT
app.listen(SERVER_PORT, () => {
    console.log(`Listening on port: ${SERVER_PORT}`)
})