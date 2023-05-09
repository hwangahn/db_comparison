const hbase = require('hbase');
const fs = require('fs');
const { parse } = require("csv-parse");

const client = hbase({ host: '127.0.0.1', port: 8080 });
const table = client.table('weather');

let count = 0;

let addRecord = () => { 
    let rows = [];
    let count = 1;
    fs.createReadStream("./newweatherhistory.csv")
    .pipe(
        parse({
            delimiter: ",",
            columns: true,
            ltrim: true,
        })
    )
    .on("data", function (data) {
        let thisRow = [
            { key: `${count}`, column: 'date:date', $: `${data.FormattedDate}` },
            { key: `${count}`, column: 'summary:summary', $: `${data.Summary}` },
            { key: `${count}`, column: 'summary:daily_summary', $: `${data.DailySummary}` },
            { key: `${count}`, column: 'summary:precip', $: `${data.PrecipType}` },  
        ];
        rows = rows.concat(thisRow);
        count++;
    })
    .on("error", function (error) {
        console.log(error.message);
    })
    .on('close', () => {
        let row = table.row();
        row.put(rows, (err, res) => {
            console.log(err);
        })
    });
}

let testConn = () => {
    let start = Date.now();
    client.connection.get('http://localhost:8080/', (error, data, response) => {
        if (error) {
            console.log(error);
        } else {
            console.log(Date.now() - start);
        }
    })  
}

let hbaseQuery = (amount) => {
    let rows = [];
    for (let i = 0; i < amount; i++) {
        let now = Date.now();
        let thisRow = [
            { key: `${now}`, column: 'date:date', $: `${now}` },
            { key: `${now}`, column: 'summary:summary', $: `${now}` },
            { key: `${now}`, column: 'summary:daily_summary', $: `${now}` },
            { key: `${now}`, column: 'summary:precip', $: `${now}` },
        ]
        rows = rows.concat(thisRow);
        while (Date.now() == now){};
    }
    return rows;
}

module.exports = hbaseQuery;




