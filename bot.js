var Discord = require('discord.io');
var request = require('request');
var logger = require('winston');
var auth = require('./auth.json');
var fs = require('fs');
var up = require('./updateContent');
var checkWar = require('./checkWar');

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
                up.updateContent();
                fs.readFile('./stats.json', function read(err, data) {
                    if (err) {
                        throw err;
                    }

                    text = fullStats(data)

                    bot.sendMessage({
                        to: channelID,
                        message: text
                    });

                });
                break;

            case 'guerraatual':

                checkWar.checkWar();
                fs.readFile('./checkCurrentWar.txt', function read(err, data) {
                    if (err) {
                        throw err;
                    }

                    bot.sendMessage({
                        to: channelID,
                        message: data
                    });
                });
                break;

            default:

                fs.readFile('./stats.json', function read(err, data) {
                    if (err) {
                        throw err;
                    }

                    info = JSON.parse(data);

                    for (let i = 0; i < info.stats.length; i++) {
                        str = info.stats[i].name.split(" ");
                        str = str.join("");

                        if (str == cmd) {

                            bot.sendMessage({
                                to: channelID,
                                message: "Total de guerras desde " + info.firstDate + ": **" + info.numberOfWars + "**\n__**" + info.stats[i].name + "**__ ganhou " + info.stats[i].wins + " de " + info.stats[i].warsPlayed + " wars jogadas"
                            });


                        }
                    }


                });



        }
    }
});

function fullStats(data) {

    info = JSON.parse(data);
    text = "Inicio da contagem: " + info.firstDate + "\nNúmero total de wars contadas: " + info.numberOfWars + "\n-----------Vitórias-----------\n";

    for (let i = 0; i < info.stats.length; i++) {

        text += info.stats[i].name;
        text += " | Ganhou: ";
        text += info.stats[i].wins.toString();
        text += " em ";
        text += info.stats[i].warsPlayed.toString();
        text += " (" + parseInt(info.stats[i].wins / info.stats[i].warsPlayed * 100) + "%) \n";
    }
    return text

}


