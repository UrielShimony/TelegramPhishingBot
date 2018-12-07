const TelegramBot = require('node-telegram-bot-api');
const TPU = require('./URLvalidate/TextParsingUtills');
const phishTankAPI = require('./URLvalidate/PhishTankAPI');

const botToken = '697343711:AAExX0EAvOly_Q0l4chBfsdNuueaTRw8ysI';
const phishingBot = new TelegramBot(botToken, {polling: true});

const getGithubLink = 'Get Github Link';
const validateUrl = 'Validate URL';
const stickers = {
    happySticker: 'CAADAgADEgADyIsGAAE-gRk5Wrs8NwI',
    angrySticker: 'CAADAgADIAADyIsGAAGwI-I5pMSEdQI'
};

const defaultMsg = 'your message unsopported by these bot, if you paste a URL' +
    'make sure the url is valid and start with http://.. or https://..'

function sendMessage(msg, chatID, args) {
    console.log("Send Message- " + msg);
    phishingBot.sendMessage(chatID, msg, args);
}

function sendSticker(sticker, chatID) {
    console.log('send sticker ', sticker);
    phishingBot.sendSticker(chatID, stickers[sticker])

}

phishingBot.on('message', (msg) => {
    const chatID = msg.chat.id;
    if (msg.text) {
        const msgText = msg.text.toString();
        console.log('Incoming message :', msgText);

        if (msgText === '/start' || msgText === '/hello') {
            const msgToSend = 'Hi, What do you want to do??';
            sendMessage(msgToSend, chatID, {
                reply_markup: {
                    keyboard: [[getGithubLink], [validateUrl]]
                }
            })
        }

        else if (msgText === getGithubLink) {
            const msgToSend = 'this is my github link-\n' +
                'https://github.com/UrielShimony/TelegramPhishingBot';
            sendMessage(msgToSend, chatID)
        }

        else if (msgText === validateUrl) {
            const msgToSend = 'So Paste the link :)';
            sendMessage(msgToSend, chatID);
        }

        else if (TPU.isValidURL(msgText.toLowerCase())) {
            console.log('URL is valid.');
            const URL = msgText;
            phishTankAPI.getURLProfile(URL)
                .then(URLprofile => {
                    console.log('Phistank Profile Result- ', URLprofile);
                    if (URLprofile.isVerified && !URLprofile.isValid) {
                        const msgToSend = 'This URL is OK!';
                        sendSticker('happySticker', chatID);
                        sendMessage(msgToSend, chatID);
                    }
                    else if (URLprofile.isVerified && URLprofile.isValid) {
                        const msgToSend = 'Be careful this is a PHISHING SCAM!!';
                        sendSticker('angrySticker', chatID);
                        sendMessage(msgToSend, chatID);
                    }
                    else {
                        const msgToSend = "Unfortunately PhishTank can't decide on this one";
                        sendMessage(msgToSend, chatID);
                    }
                })
                .catch(err => {
                    console.log('EROR', err);
                    const msgToSend = 'Unfortunately there was an error, pleas try again';
                    sendMessage(msgToSend, chatID);
                });
        } else {
            //Default Case:
            console.log('The income Text is not valid URL');
            sendMessage(defaultMsg, chatID)
        }
    } else {
        // Sticker/Image  Case:
        sendMessage(defaultMsg, chatID)
    }
});


// Handle deployment issues
var http = require('http');
const port = process.env.PORT;
http.createServer(function (req, res) {
    //(must listen to some port)
    res.send(200);
}).listen(port);

phishingBot.on('polling_error', (error) => {
    if (error.code === 'ETELEGRAM') {
        //More then one instance is up or  server ip had changed.
    } else {
        console.log('ERROR', error.code);
    }
});
