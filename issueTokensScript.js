const { exec } = require("child_process");
const cors = require('cors');
const express = require('express');

// preparo endpoint get
const app = express();
const port = 3001;

// disabilito controlli privacy
app.use(cors());

// prendo data e ora
let dateAndTime = null;
// metto l'endpoint get response
app.get('/', (req, res) => {
    res.send(`Tokens issued on: ${dateAndTime}`);
});
app.listen(port, () => console.log(`Token issue script runnin on port ${port}!`))

// 300000 5 minuti
setInterval(issueTokens, 60000);

function issueTokens() {
    
    // mando comando per il metodo issueTokens nel nostro contratto TokenFarm ogni 5 minuti
    exec(`brownie run scripts/issue_tokens.py --network kovan`, (error, stdout) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });

    // e resetto l'ora
    dateAndTime = new Date().getFullYear() + '-'+ (new Date().getMonth()+1) + '-' + new Date().getDate() + '@' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
}
