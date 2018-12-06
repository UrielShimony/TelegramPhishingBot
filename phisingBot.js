const TelegramBot = require('node-telegram-bot-api');
const TPU = require('./URLvalidate/TextParsingUtills');
const phishTankAPI = require('./URLvalidate/PhishTankAPI');

const botToken = '697343711:AAExX0EAvOly_Q0l4chBfsdNuueaTRw8ysI';
const phishingBot = new TelegramBot(botToken, {polling: true});

const getGithubLink = 'Get Github Link';
const validateUrl = 'Validate URL';
const happySticker='CAADAgADEgADyIsGAAE-gRk5Wrs8NwI';
const saidSticker='CAADAgADIAADyIsGAAGwI-I5pMSEdQI';

phishingBot.on('message', (msg) => {
        msgText = msg.text.toString();

        if (msgText === '/start' || msgText === 'hello') {
            phishingBot.sendMessage(msg.chat.id, 'Hi, What do you want to do??', {
                reply_markup: {
                    keyboard: [[getGithubLink], [validateUrl]]
                }

            });
        }

        else if (msgText === getGithubLink) {
            phishingBot.sendMessage(msg.chat.id, 'this is my github link-\n' +
                'https://github.com/UrielShimony/TelegramPhishingBot');
        }

        else if (TPU.isValidURL(msgText.toLowerCase())) {
            const URL = msgText;
            phishTankAPI.getURLProfile(URL)
                .then(URLprofile => {
                    if(URLprofile.isVerified&&!URLprofile.isValid){
                        phishingBot.sendSticker(msg.chat.id, happySticker);
                        phishingBot.sendMessage(msg.chat.id, "This URL is OK!");
                    }
                    else if(URLprofile.isVerified&&URLprofile.isValid){
                        phishingBot.sendMessage(msg.chat.id, "Be careful this is a PHISHING SCAM!!");
                        phishingBot.sendSticker(msg.chat.id, saidSticker);
                    }
                    else{
                        phishingBot.sendMessage(msg.chat.id, "Unfortunately PhishTank can't decide on this one");

                    }
                })
                .catch(err => {
                    console.log('EROR', err)
                    phishingBot.sendMessage(msg.chat.id, 'Unfortunately there was an error, pleas try again' );
                });
        }

        else if (msgText === validateUrl) {
            phishingBot.sendMessage(msg.chat.id, 'So Paste the link :)' );

        }

        else {
            phishingBot.sendMessage(msg.chat.id, 'your message unsopported by these bot, if you paste a URL' +
                'make sure the url is valid and start with http://.. or https://..');
        }
    }
);