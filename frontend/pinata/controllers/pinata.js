require('dotenv').config();

const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

const pinFileToIPFS = (req, res, files) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    const file = files.file;
    const f = fs.createReadStream(file.path);

    let data = new FormData();
    data.append('file', f);

    return axios.post(url,
        data,
        {
            maxContentLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                'pinata_api_key': PINATA_API_KEY,
                'pinata_secret_api_key': PINATA_SECRET_API_KEY
            }
        }
    ).then(function (response) {
        console.log("pinFileToIPFS success", response.data.IpfsHash);
        res.status(200).send(response.data.IpfsHash);
    }).catch(function (error) {
        console.log("pinFileToIPFS error", error, error.message);
        res.status(500).json({error: error.message});
    });
};

const pinJSONToIPFS = (req, res) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    const JSONBody = req.body;

    return axios
        .post(
            url,
            JSONBody,
            {
                headers: {
                    'pinata_api_key': PINATA_API_KEY,
                    'pinata_secret_api_key': PINATA_SECRET_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        ).then(function (response) {
            console.log("pinJSONToIPFS success", response.data.IpfsHash);
            res.status(200).send(response.data.IpfsHash);
        })
        .catch(function (error) {
            console.log("pinJSONToIPFS fail", error.message);
            res.status(500).json({error: error.message});
        });
};

const removePinFromIPFS = (req, res) => {
    const {hash} = req.params;
    const url = `https://api.pinata.cloud/pinning/unpin/${hash}`;

    return axios
        .delete(
            url,
            {
                headers: {
                    'pinata_api_key': PINATA_API_KEY,
                    'pinata_secret_api_key': PINATA_SECRET_API_KEY
                }
            }
        ).then(function (response) {
            console.log("removePinFromIPFS success", hash);
            res.status(200).send(hash);
        })
        .catch(function (error) {
            console.log(error.message);
            res.status(500).json({error: error.message});
        });
};

module.exports = {
    pinFileToIPFS,
    pinJSONToIPFS,
    removePinFromIPFS,
};