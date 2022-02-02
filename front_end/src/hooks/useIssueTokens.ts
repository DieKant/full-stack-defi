export const useIssueTokens = () => {

    let previousLog = '';
    let log = '';

    const takeIssueTokenTimeLog = () => {
        fetch("http://localhost:3001")
            .then(response => response.text())
            .then(data => log=data);
        if(log !== previousLog) {
            console.log(log)
        }
        previousLog = log
    } 

    setInterval(takeIssueTokenTimeLog, 10000);
}
