var Discord = require('discord.io');
var request = require('request');
var logger = require('winston');
var auth = require('./auth.json');
var fs = require('fs');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    var content;
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch (cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
                break;
            // Just add any case commands if you want to..
            case 'globalstats':
                // First I want to read the file
                fs.readFile('./stats.json', function read(err, data) {
                    if (err) {
                        throw err;
                    }

                    bot.sendMessage({
                        to: channelID,
                        message: fullStats(data)
                    });

                });

        }
    }
});

function fullStats(data) {
    info = JSON.parse(data);
    text = "Inicio da contagem: " + info.firstDate + "\nNúmero total de wars contadas: " + info.numberOfWars + "\n-----------Vitórias-----------\n";

    for (let i = 0; i < info.stats.length; i++) {
        text += info.stats[i].name;
        text += " --> "
        text += info.stats[i].wins.toString();
        text += "   (" + (info.stats[i].wins / info.numberOfWars * 100) + "%) \n";
    }

    return text

}