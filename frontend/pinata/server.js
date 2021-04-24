require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const formidable = require('formidable');

const pinataController = require('./controllers/pinata');
const endpoints = require('./controllers/endpoints');

const app = express();

const whitelist = [
    'https://bonktoken.com',
    'https://megabonk.com',
    'https://megabonktest.netlify.app'
];

/*
const corsOptions3 = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}; */

var corsOptions = function (req, callback) {    
    var corsOptions;
    const origin = req.header('Origin');
    // Allow if in whitelist or if this server itself is running in localhost
    if (whitelist.indexOf(origin) !== -1 || req.get('host').indexOf('localhost') > -1) {
      corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    } else {
      callback(new Error('Not allowed by CORS'));
      return;
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
  }

app.use(helmet());
app.use(cors());
// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.raw());

app.get('/', (req, res) => {
    res.send("API is accessible via /api endpoint")
});

app.get('/api', (req, res) => {
    res.send(endpoints)
});

app.post('/api/pinFile', cors(corsOptions), (req, res, next) => {
    const form = formidable({multiples: false});
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.log(err);
            next(err);
            res.status(500).json({error: error});
            return;
        }
        pinataController.pinFileToIPFS(req, res, files);
    });
});

app.post('/api/pinJSON', cors(corsOptions), (req, res) => {
    pinataController.pinJSONToIPFS(req, res);
});

app.delete('/api/unpin/:hash', cors(corsOptions), (req, res) => {
    pinataController.removePinFromIPFS(req, res);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});