var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'newuser',
    password : 'hoanganh.012',
    database : 'weather'
});

let search = () => {
    let start = Date.now();
    connection.query(
        `SELECT DISTINCT w.id, FormattedDate, Temperature, ApparentTemperature, Humidity, WindSpeed, WindBearing, Visibility, LoudCover, Pressure, s.summary, p.precip, d.dailySummary FROM newweatherhistory w
        inner join summary s
        on w.Summary = s.id
        inner join precip p
        on w.Precip = p.id
        inner join dailysummary d
        on w.DailySummary = d.id
        where w.id = 54667;`, 
    (err, res) => {
        console.log(Date.now() - start);
    })
}

let add = () => {
    let query = `INSERT INTO newweatherhistory (FormattedDate, Summary, Precip, DailySummary)
                    VALUES`
    for (let i = 0; i < 12000; i++) {
        let now = Date.now() + i;
        query = query.concat(`('today', ${(now % 3) + 1}, ${(now % 3) + 1}, ${(now % 3) + 1})`);
        if (i == 11999) {
            query = query.concat(';');
        } else {
            query = query.concat(',');
        }
    }
    let start = Date.now();
    connection.query(query, (err, res) => {
        console.log(Date.now() - start);
    })
}

add();
