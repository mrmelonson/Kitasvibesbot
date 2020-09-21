const { Telegraf } = require('telegraf')
const key = require("./.secret/key.json");
const dict = require("./util/stickerdict.json")

//Dont share this key
const bot = new Telegraf(key.key);


//try /start in the bot's dms
bot.start((ctx) => ctx.reply('Welcome!'));

//When it detects any text
bot.on('message', (ctx) => {
    var stickerEmoji = ctx.message.sticker.emoji;

    if(stickerEmoji in dict) {
        //Leaving start as a master "cancel" command
        if(dict[stickerEmoji] == "start") {
            global.kitaArr = [];
            global.kitaArr.push(dict[stickerEmoji]);
            global.kitaPortal = false;
            return;
        }

        if(dict[stickerEmoji] == "portal_out") {
            if(!global.kitaPortal) {
                return;
            }
            global.kitaPortal = false;
        }

        if(!global.kitaPortal) {

            if(dict[stickerEmoji] == "end" || dict[stickerEmoji] == "end_portal") {
                global.kitaArr.push(dict[stickerEmoji]);
                PrintBuzz(global.kitaArr);
                global.kitaArr = [];
                return;
            }

            if(dict[stickerEmoji] == "portal_in") {
                global.kitaPortal = true;
            }
            global.kitaArr.push(dict[stickerEmoji]);
        }
    }
});

function PrintBuzz(arr) {
    console.log(arr);
}

//Start the bot with a little message
bot.launch().then((o, e) => {
    console.log("Starting bot...");
    global.kitaArr = new Array;
    global.kitaPortal = false;
});

