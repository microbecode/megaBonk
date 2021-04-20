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
    'http://localhost:8888',
    'http://localhost:3000'
];

const corsOptions = {
    origin: function (origin, callback) {
        console.log('origin', origin, !origin)
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

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
    console.log('REQUEST', req)
    const form = formidable({multiples: false});
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.log(err);
            next(err);
            res.status(500).json({error: error});
            return;
        }
        console.log('found files', files)
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