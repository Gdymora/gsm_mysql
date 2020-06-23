
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "mydbnode"
});
//require('conectmysql');

module.exports = {
    
    selectTelefon: function () {
        connection.connect(function (err) {
            if (err) throw err;
            //Select all customers and return the result object:
            connection.query("SELECT * FROM telefon", function (err, result, fields) {
                if (err) throw err;
                return result;
               /*  for (let value in result) {
                    console.log(result[value].telefon);
                } */
            });
        });

        //connection.end();
    }
}