var request = require('request');

var fs = require('fs');

module.exports = {
    checkWar: function () {
        var text = "";
        request({
            headers: {
                'authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImUwYTNkOTA3LTE1YzQtNGRhNy04ZTlhLTIxMWNhNGZjZDNlMiIsImlhdCI6MTU2MzE3ODE1Miwic3ViIjoiZGV2ZWxvcGVyLzQyZWYxNzcxLTBhOGQtMmM2NS0yNmMxLTY0MzVlYzc1Njk4MCIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIyMDcuMTgwLjIyOS4yNCIsIjc5LjE2OS4xNjMuNjciLCI3Ny41NC4xMjQuMTQ4Il0sInR5cGUiOiJjbGllbnQifV19.Cv8JZlJfDHiIJPSEA4-8K0aosJhIfU38JNBZJqHw1F3f3ImU3PqFANHpDVOK5UQqfjnkr7LqN3ssDkVx7ZUFjA',
                'Accept': 'application/json'
            },
            uri: 'https://api.clashroyale.com/v1/clans/%239L2CRYY2/currentwar',
            method: 'GET'
        }, function (err, res, body) {

            data = JSON.parse(body);

            doneAndWon = []
            doneAndLost = []
            notDone = []

            for (let i = 0; i < data.participants.length; i++) {
                if (data.participants[i].battlesPlayed == data.participants[i].numberOfBattles && data.participants[i].wins > 0)
                    doneAndWon.push(data.participants[i].name)

                else if (data.participants[i].battlesPlayed == data.participants[i].numberOfBattles && data.participants[i].wins == 0)
                    doneAndLost.push(data.participants[i].name)

                else notDone.push(data.participants[i].name)

            }

            text += "**Malta que já fez guerra de hoje e**\n__**GANHOU**__ :smiley::\n"
            text += doneAndWon.join(", ")
            text += "\n__**PERDEU**__ :disappointed::\n"
            text += doneAndLost.join(", ")
            text += "\n\n**Malta que ainda __NÃO__ fez guerra de hoje :rage: :**\n"
            text += notDone.join(", ")

            fs.writeFile('checkCurrentWar.txt', text, (err) => {

                // In case of a error throw err. 
                if (err) throw err;
            })

        });
    }
}
