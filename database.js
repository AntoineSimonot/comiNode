var mysql = require('mysql');

var database = mysql.createConnection({
    host: 'mysql-gryphenrn.alwaysdata.net',
    dialect:'mysql',
    user     : 'gryphenrn',
    password : '0208200ASs',
    database : 'gryphenrn_comi'
});

database.connect(function(err) {

});

module.exports = database