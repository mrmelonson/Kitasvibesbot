const { Telegraf } = require('telegraf')
const key = require("./.secret/key.json");
const dict = require("./util/stickerdict.json")
const Buttplug = require("buttplug");
const ButtplugWebsocket = require("buttplug-node-websockets");


//Dont share this key
const bot = new Telegraf(key.key);

const connector = new ButtplugWebsocket.ButtplugNodeWebsocketClientConnector("ws://localhost:12345/buttplug", false);
var client = new Buttplug.ButtplugClient("Test");

client.Connect(connector).then((o,e) => {
        console.log("Connected to intiface");
        client.StartScanning().then((o,e) => {
            console.log("Scanning");
    });
});

client.addListener("deviceadded", async (device) => {

    //try /start in the bot's dms
    bot.start((ctx) => ctx.reply('Welcome!'));

    console.log(`Found device - ${device.Name}`);

    //When it detects any text
    bot.on('message', (ctx) => {
        //Get emoji associated to the sticker
        var stickerEmoji = ctx.message.sticker.emoji;

        //Find if the emoji is in the dictionary
        if(stickerEmoji in dict) {
            //Leaving start as a master "cancel" command
            //Clear then start a new array
            if(dict[stickerEmoji] == "start") {
                global.kitaArr = [];
                global.kitaArr.push(dict[stickerEmoji]);
                global.kitaPortal = false;
                return;
            }

            //If kitaportal is true, dont accept any other inputs except for portal out
            if(dict[stickerEmoji] == "portal_out") {
                if(!global.kitaPortal) {
                    return;
                }
                global.kitaPortal = false;
            }

            //condition for portal
            if(!global.kitaPortal) {

                //End and send array
                if(dict[stickerEmoji] == "end" || dict[stickerEmoji] == "end_box") {
                    global.kitaArr.push(dict[stickerEmoji]);
                    PrintBuzz(global.kitaArr);
                    ctx.reply(global.kitaArr);
                    global.kitaArr = [];
                    return;
                }

                //Looking for a portal in
                if(dict[stickerEmoji] == "portal_in") {
                    global.kitaPortal = true;
                }
                //generic add emoji to array
                global.kitaArr.push(dict[stickerEmoji]);
            }
        }
    });

    //Stub printing command
    //replace with buzzzing
    function PrintBuzz(arr) {
        console.log(arr);
    }

    //Start the bot with a little message
    bot.launch().then((o, e) => {
        console.log("Starting bot...");

        //init globals
        global.kitaArr = new Array;
        global.kitaPortal = false;
    });

});

