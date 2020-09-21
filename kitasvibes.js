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
    if(stickerEmoji == "🆙") {
        global.kitaArr = [];
        global.kitaArr.push(dict[stickerEmoji]);
        return;
    }

    if(stickerEmoji == "⬇️" || stickerEmoji == "🥡") {
        global.kitaArr.push(dict[stickerEmoji]);
        PrintBuzz(global.kitaArr);
        global.kitaArr = [];
        return;
    }

    if(stickerEmoji in dict) {
        global.kitaArr.push(dict[stickerEmoji]);
    }

});

function PrintBuzz(arr) {
    console.log(arr);
}

//Start the bot with a little message
bot.launch().then((o, e) => {
    console.log("Starting bot...");
    global.kitaArr = new Array;
});

