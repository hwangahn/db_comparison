let express = require('express');
let path = require('path');
let mysql = require('mysql');
const hbase = require('hbase');
const util = require('util');
const mysqlQuery = require('./mysql');
const hbaseQuery = require('./hbase');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'newuser',
    password : 'hoanganh.012',
    database : 'weather'
});

const client = hbase({ host: '127.0.0.1', port: 8080 });
const table = client.table('weather');

let app = express();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/select', async (req, res) => {
    let day = Math.floor(Math.random() * 90000);
    let row = table.row(`${day}`);
    let mysqlGet = util.promisify(connection.query.bind(connection));
    let hbaseGet = util.promisify(row.get.bind(row));

    let start = Date.now();
    let benchmarkMysql = await mysqlGet(`select w.id, date, s.summary, d.dailysummary, p.precip from weather w
    inner join summary s
    on w.summary = s.id
    inner join dailysummary d
    on w.dailysummary = d.id
    inner join precip p
    on w.precip = p.id
    where w.id = ${day}
    order by w.id; `);
    console.log(benchmarkMysql);
    let mysqlTime = Date.now() - start;

    start = Date.now();
    let benchmarkHbase = await hbaseGet('summary');
    console.log(benchmarkHbase);
    let hbaseTime = Date.now() - start;

    res.send({msg: "ok", hbaseTime: hbaseTime, mysqlTime: mysqlTime, record: benchmarkMysql[0]});
})

app.get('/insert', async (req, res) => {
    let row = table.row();
    let mysqlInsert = util.promisify(connection.query.bind(connection));
    let hbaseInsert = util.promisify(row.put.bind(row));

    let mysql_3000 = mysqlQuery(3000);
    let mysql_6000 = mysqlQuery(6000);
    let mysql_12000 = mysqlQuery(12000);
    let mysql_15000 = mysqlQuery(15000);

    let hbase_3000 = hbaseQuery(3000);
    let hbase_6000 = hbaseQuery(6000);
    let hbase_12000 = hbaseQuery(12000);
    let hbase_15000 = hbaseQuery(15000);

    let start = Date.now();
    let mysqlInsert_3000 = await mysqlInsert(mysql_3000);
    console.log(mysqlInsert_3000);
    let mysqlInsert_3000_time = Date.now() - start;

    start = Date.now();
    let mysqlInsert_6000 = await mysqlInsert(mysql_6000);
    console.log(mysqlInsert_6000);
    let mysqlInsert_6000_time = Date.now() - start;
    
    start = Date.now();
    let mysqlInsert_12000 = await mysqlInsert(mysql_12000);
    console.log(mysqlInsert_12000);
    let mysqlInsert_12000_time = Date.now() - start;
    
    start = Date.now();
    let mysqlInsert_15000 = await mysqlInsert(mysql_15000);
    console.log(mysqlInsert_15000);
    let mysqlInsert_15000_time = Date.now() - start;
    
    start = Date.now();
    let hbaseInsert_3000 = await hbaseInsert(hbase_3000);
    console.log(hbaseInsert_3000);
    let hbaseInsert_3000_time = Date.now() - start;
    
    start = Date.now();
    let hbaseInsert_6000 = await hbaseInsert(hbase_6000);
    console.log(hbaseInsert_6000);
    let hbaseInsert_6000_time = Date.now() - start;
    
    start = Date.now();
    let hbaseInsert_12000 = await hbaseInsert(hbase_12000);
    console.log(hbaseInsert_12000);
    let hbaseInsert_12000_time = Date.now() - start;
    
    start = Date.now();
    let hbaseInsert_15000 = await hbaseInsert(hbase_15000);
    console.log(hbaseInsert_15000);
    let hbaseInsert_15000_time = Date.now() - start;

    res.send({msg: "ok", 
        mysqlInsert_3000_time: mysqlInsert_3000_time, mysqlInsert_6000_time: mysqlInsert_6000_time, mysqlInsert_12000_time: mysqlInsert_12000_time, mysqlInsert_15000_time: mysqlInsert_15000_time,
        hbaseInsert_3000_time: hbaseInsert_3000_time, hbaseInsert_6000_time: hbaseInsert_6000_time, hbaseInsert_12000_time: hbaseInsert_12000_time, hbaseInsert_15000_time: hbaseInsert_15000_time
    });
    
})

app.listen(3000, () => {
    console.log(`listening to port 3000`);
});

