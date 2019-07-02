var request = require('request');
var fs = require('fs');


var content;
// First I want to read the file
fs.readFile('./stats.json', function read(err, data) {
    if (err) {
        throw err;
    }

    content = JSON.parse(data);

});



request({
    headers: {
        'authorization': 'Bearer <API_TOKEN>',
        'Accept': 'application/json'
    },
    uri: 'https://api.clashroyale.com/v1/clans/%239L2CRYY2/warlog',
    method: 'GET'
}, function (err, res, body) {

    lastUpdate = new Date(dateToStandard(content.lastUpdate));
    data = JSON.parse(body);

    //console.log(content.stats.some(player => player.name === "Quintanilha"))

    for (let i = data.items.length - 1; i >= 0; i--) {
        //console.log(new Date(dateToStandard(data.items[i].createdDate)));
        if (new Date(dateToStandard(data.items[i].createdDate)) > lastUpdate) {
            //UPDATE PLAYERS STATS
            for (let j = 0; j < data.items[i].participants.length; j++) {

                //IF PLAYER DOESNT EXIST, ADD HIM
                if (!content.stats.some(player => player.name === String(data.items[i].participants[j].name)))
                    content.stats.push({ "name": data.items[i].participants[j].name, "wins": data.items[i].participants[j].wins });

                //IF PLAYER EXISTS, INCREMENT VICTORIES
                else content.stats.find(player => player.name === String(data.items[i].participants[j].name)).wins += data.items[i].participants[j].wins;
            }

            //UPDATE WARDAY COUNT
            content.numberOfWars++;
            //UPDATE LAST UPDATE
            content.lastUpdate = data.items[i].createdDate;
        }
    }

    sortedContent = sort(content)

    fs.writeFile('stats.json', JSON.stringify(content), (err) => {

        // In case of a error throw err. 
        if (err) throw err;
    })

    //console.log(sortedContent)


});


function dateToStandard(date) {
    return date.slice(0, 4) + "-" + date.slice(4, 6) + "-" + date.slice(6, 11) + ":" + date.slice(11, 13) + ":" + date.slice(13);
}

function sort(data) {

    for (let i = 1; i < data.stats.length; i++) {

        if (data.stats[i].wins > data.stats[0].wins)
            data.stats.unshift(data.stats.splice(i, 1)[0])
        else if (data.stats[i].wins <= data.stats[i - 1].wins) continue
        else {
            // find where element should go
            for (let j = 1; j < i; j++) {
                if (data.stats[i].wins <= data.stats[j - 1].wins && data.stats[i].wins > data.stats[j].wins) {
                    // move element
                    data.stats.splice(j, 0, data.stats.splice(i, 1)[0])
                }
            }
        }
    }
    return data
}

