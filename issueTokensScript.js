const { exec } = require("child_process");
const express = require('express');
const res = require("express/lib/response");
var cors = require('cors')

// creo endpoint api
const app = express();
const port = 3001;

// disattivo i controlli di privacy
app.use(cors())

// creo cosa 
app.get('/', (req, res) => {

    // prendo data e ora
    let dateAndTime = new Date().getFullYear() + '-'+ (new Date().getMonth()+1) + '-' + new Date().getDate() + '@' + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();

    res.send(
        "Token issuing started at: " + dateAndTime
    );
    
    // mando comando per il metodo issueTokens nel nostro contratto TokenFarm ogni 5 minuti
    // brownie run .\scripts\issue_tokens.py --network kovan
    exec("mkdir CartellaDiTestLollolollolol", (error, stdout) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });

});
app.listen(port, () => console.log(`Issue token script running on port: ${port}!`))



