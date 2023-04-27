const hbase = require('hbase');
const fs = require('fs');
const { parse } = require("csv-parse");

const client = hbase({ host: '127.0.0.1', port: 8080 });
const table = client.table('weather');

let count = 0;

let addRecord = () => { 
    fs.createReadStream("./weatherHistory.csv")
    .pipe(
        parse({
            delimiter: ",",
            columns: true,
            ltrim: true,
        })
    )
    .on("data", function (data) {
        let row = table.row();
        let thisRow = [
            { key: `${count}`, column: 'date:date', $: data.FormattedDate },
            { key: `${count}`, column: 'summaries:summary', $: data.Summary },
            { key: `${count}`, column: 'summaries:daily_summary', $: data.DailySummary },
            { key: `${count}`, column: 'weather:precip', $: data.PrecipType },
            { key: `${count}`, column: 'weather:temp', $: data.Temperature },
            { key: `${count}`, column: 'weather:humidity', $: data.Humidity },
            { key: `${count}`, column: 'weather:apparent_temp', $: data.ApparentTemperature },
            { key: `${count}`, column: 'weather:wind_speed', $: data.WindSpeed },
            { key: `${count}`, column: 'weather:visibility', $: data.Visibility },
        ]
        row.put(thisRow, (err, suc) => {
            console.log(err + suc);
        })
        count++;
    })
    .on("error", function (error) {
        console.log(error.message);
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

let add = () => {
    
    let rows = [];
    let row = table.row();
    for (let i = 0; i < 12000; i++) {
        let now = Date.now() + i;
        let thisRow = [
            { key: `${now}`, column: 'date:date', $: `${now}` },
            { key: `${now}`, column: 'summaries:summary', $: `${now}` },
            { key: `${now}`, column: 'summaries:daily_summary', $: `${now}` },
            { key: `${now}`, column: 'weather:precip', $: `${now}` },
        ]
        rows = rows.concat(thisRow);
    }
    let start = Date.now();
    row.put(rows, (err, res) => {
        console.log(res);
        console.log(Date.now() - start);
    })
}

testConn();





