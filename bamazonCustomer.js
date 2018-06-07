
// setting npms and constructor 
var inquirer = require('inquirer');
var mysql = require('mysql');
var product = require('./product.js');

// create connection to mySQL
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "khuynh",

    // Your password
    password: "x140y150",
    database: "bamazon_db"
});


// inquirer prompts

// main shopping function
function shop() {
    inquirer.prompt([
        {
            type: "list",
            name: "name",
            message: "What item would you like to buy?",
            choices: ["Potion", "SuperPotion", "HyperPotion", "Sword", "Dagger", "YoloHammer", "Boots", "Nikes", "Adidas", "GoldenSpatula"]
        }
    ]).then(function (product) {

        var item = product.name;

        // function to check database for item and quantity
        checkProductExists(item);


    })
};

var SQLcmd = 'SELECT * FROM products';

var chosenItem = "";

// function to check if product exists
function checkProductExists(item) {
    connection.query(SQLcmd, function (err, response) {
        // console.log(response)
        // checks database for item
        for (i = 0; i < response.length; i++) {
            if (item === response[i].product_name) {

                // stores item into product constructor
                chosenItem = new product(response[i]);
                break;
            }
        }
        console.log(`We have ${chosenItem.stock} ${chosenItem.name}(s) in stock!`)
        checkProductQuantity();
    });
    connection.end();
}


function checkProductQuantity() {
    inquirer.prompt([
        {
            type: "input",
            name: "quantity",
            message: "How many do you want to buy?"

        }
    ]).then(function (item) {
        var amount = item.quantity;
        if (amount <= chosenItem.stock) {
            console.log(`You just bought ${amount} ${chosenItem.name}(s)`)
            // transaction(chosenItem.name);
        }
        else {
            console.log(`Sorry we only have ${chosenItem.stock} left!`)
            checkProductQuantity()
        }


    });

};


var SQLbuyCMD = `UPDATE products SET ? WHERE ?;`;

function transaction(chosenItem) {
    connection.query(SQLbuyCMD,
        // checks database for item
        [
            {
                stock_quantity: - amount
            },
            {
                product_name: `${chosenItem.name}`
            }
        ],

        function (err, response) {
            console.log(response.affectedRows);


        });


    connection.end();
}



shop();











