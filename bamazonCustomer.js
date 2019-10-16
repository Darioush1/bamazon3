var mysql = require('mysql');
var inquirer = require('inquirer');
var userAsk = '';
var stock = 0;
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'RIPsonics9596',
    database: 'bamazon_db'
});

//start up function that occuers on connection with sequal
connection.connect(function (err) {
    if (err) {
        throw err
    };
    console.log("connected as id " + connection.threadId);
    getProducts();
    selection()

});

//function that gets all items from the products table and itemizes them in node
function getProducts() {
    connection.query("SELECT * FROM products", function (err, response) {
        if (err) {
            throw err
        };
        for (var i = 0; i < response.length; i++) {
            console.log(response[i].product_name + ' ID - ' + response[i].item_id)
        }
    });
};

//prompt for user to make selection
function selection() {

    inquirer.prompt({
        type: 'input',
        message: 'Welcome to the Watch Tower! What would you like to buy? (please select by ID)',
        name: 'idNum',

    }).then(function (answer) {
        var choice = answer.idNum;
        checkStock(choice);
    })

};

//once user has picked their item with the id number this funtion will find the item, grab the amount of stock and prompt the user as to how much they would like to buy
function checkStock(userChoice) {
    connection.query('SELECT stock_quantity From products Where ? ',
        {
            'item_id': userChoice,
        },

        //key function that asks the user how much they would like of that particular item
        function (err, stockNum) {
            if (err) {
                throw err;
            }

            stock = stockNum[0].stock_quantity;
            inquirer.prompt({
                type: 'input',
                message: 'How many would you like to buy?',
                name: 'userWant',
            }).then(function (answer) {
                userAsk = answer.userWant;
                howMany(userChoice);
            });

        }
    );
}

//presents user with how much available stock there is so they can adjsut their request, note this uses the same connection query as checkStock() function. is there a way to compress this? ask the ta's
function buyLess(userChoice) {
    connection.query('SELECT stock_quantity From products Where ? ',
        {
            'item_id': userChoice,
        },

        function (err, stockNum) {
            if (err) {
                throw err;
            }

            //stock = stockNum[0].stock_quantity;
            console.log('Sorry we only have ' + stock + ' left.')
            inquirer.prompt({
                type: 'input',
                message: 'How many would you like to buy?',
                name: 'userWant',
            }).then(function (answer) {
                userAsk = answer.userWant;
                console.log('user wanted this ' + clw)
                console.log('userChoice', userChoice)
                howMany(userChoice);
            });
        })
}


//if else statement that presents user with different options depending on their ask and if they 
function howMany(userChoice) {
    if (userAsk > stock) {
        tooMuchAsk();
    } else if (stock == 0) {
        keepLooking();
    } else {
        showPrice(userChoice)
        // connection.end();
    }
};

function showPrice(userChoice) {
    connection.query('SELECT price From products Where ?',
        {
            'item_id': userChoice
        },
        function (err, stockNum) {
            if (err) {
                throw err;
            }
            var totalPrice = stockNum[0].price * userAsk;
            inquirer.prompt({
                type: 'input',
                message: 'Your total is $' + totalPrice + ', would you like proceed to check out? (yes or no)',
                name: 'total'
            }).then(
                function (answer) {
                    switch (answer.total) {
                        case 'yes':
                            buyStock(userChoice);
                            break;
                        case 'no':
                            getProducts();
                            selection();
                            break;
                        default:
                            getProducts();
                            selection();
                            break;
                    }
                })

        }
    )
}


function buyStock(choice) {
    var stockUpdate = stock - parseInt(userAsk);
    var query = connection.query(
        'UPDATE products SET ? Where ?',
        [
            {
                stock_quantity: stockUpdate
            },
            {
                item_id: choice
            }
        ],
        function (err) {
            if (err) {
                throw err
            };
            console.log('stock is now ' + stockUpdate);
            keepLooking();
        }
    )
};

function keepLooking() {
    console.log('list called')
    inquirer.prompt({
        type: 'input',
        message: 'would you like to keep looking (yes or no)?',
        name: 'item_id',

    }).then(
        function (reply) {
            //var choice = answer.item_id;
            switch (reply.item_id) {
                case 'yes':
                    getProducts();
                    break;
                case 'no':
                    console.log('Thank you have a great day!');
                    connection.end;
                    break;
               

            }
        })
};



function tooMuchAsk() {
    inquirer.prompt({
        type: 'input',
        message: 'Sorry we don\'t have enough. Would you like to buy less or look at the list again? (please type less or list)',
        name: 'pick',
    }).then(
        function (res) {
            switch (res.pick) {
                case 'less':
                    buyLess();
                    break;
                case 'list':
                    keepLooking();
                    break;
                default:
                    console.log('please try again');
                    tooMuchAsk()
            }
        }

    )
};