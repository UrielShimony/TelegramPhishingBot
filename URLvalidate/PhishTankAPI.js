const axios = require('axios');
const TPU = require('./TextParsingUtills');

const BASE_PHISHTANK_URL = 'http://checkurl.phishtank.com/checkurl/index.php?';

module.exports = {
    getURLProfile: function (url) {
        const body = {
            params: {
                url: url,
            }
        };
        return axios.get(BASE_PHISHTANK_URL, body)
            .then(function (response) {
                const jsonData = TPU.parseXML2Json(response.data);

                const preciousData = jsonData.response.results.url0;

                const url = preciousData.url;
                const inDB = preciousData.in_database.localeCompare('true')===0;
                const isVerified =inDB? preciousData.verified.localeCompare('true')===0:undefined;
                const isValid = inDB&&isVerified? preciousData.valid.localeCompare('true')===0:undefined;

                return( {
                    url: url,
                    inDB: inDB,
                    isValid: isValid,
                    isVerified: isVerified
                });

            })
            .catch(err => {
                throw err;
            });
    }

};