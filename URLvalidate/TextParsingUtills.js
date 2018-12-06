const parseXML = require('xml2js').parseString;

const urlRegex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);

module.exports = {

    isValidURL: function (str) {
        return str.match(urlRegex);
    },

    parseXML2Json: function (XMLString) {
        let jsonString='';
        parseXML(XMLString, {explicitArray: false}, (err, parsedString) => {
            if (err) {
                console.log('there was an error in parsing XML');
                throw err
            }
            else {
                jsonString = parsedString;
            }
        });
        return jsonString
    },
}