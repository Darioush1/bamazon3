var mysql = require('mysql');
var inquirer = require('inquirer');


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
    console.log("connected as id " + connection.threadId);
    selection();

});
var input1 = process.argv[2];
var input2 = process.argv[3];
var input3 = process.argv[4];
var input4 = process.argv[5];
var input5 = process.argv[6];




function selection() {

    inquirer.prompt({
        'type': 'input',
         'message': 'Hello Dan Jurgens! Would you like to view products for sale, low inventory or add inventor or new products?',

    })
    // if (input1 == 'add' && input2 == null) {
    //     console.log('To add new merch please insert it in as so; "node bamazonManager add productName(onewordplease) department(word) price(number) stockQuantity(number)')
    // } else if (input1 == 'add' && input2 !== null ) {
    //     console.log('here1')
    //     addMore();
    // } else {
    //     console.log("Hello Dan Jurgens! Would you like to view:");
    // }
};

function addMore() {
    console.log('To add new merch please insert it in as so; "node bamazonManager productName(onewordplease) department(word) price(number) stockQuantity(number)');
    console.log('here2');
    connection.query(
        'INSERT INTO products Set ?',

        {
            product_name: input2,
            department: input3,
            price: input4,
            stock_quantity: input5
        },
        function(err, response) {
            if (err) {
                throw err;
            }
            console.log(response);
        }
    )
};