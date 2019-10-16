var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'RIPsonics9596',
    database: 'bamazon_db'
});

connection.connect(function (err) {
    if (err) {
        throw err
    };
    test()


});


function test(answer) {
    console.log("tooMuchAsk Function inside the THEN")
    var choice = answer.pick;
    switch (choice) {
        case less:
            console.log('less was the choice')
            break;
        case list:
            console.log('they picked list yo!')
            break;
        default:
            console.log('please try again')
    }
};