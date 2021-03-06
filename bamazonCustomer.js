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
    inquirer.prompt([{
        type: "list",
        name: "name",
        message: "What item would you like to buy?",
        choices: ["Potion", "SuperPotion", "HyperPotion", "Sword", "Dagger", "YoloHammer", "Boots", "Nikes", "Adidas", "GoldenSpatula"]
    }]).then(function (product) {

        var item = product.name;

        // function to check database for item and quantity
        checkProductExists(item);


    })
};

var SQLcmd = 'SELECT * FROM products';

var chosenItem = "";
var quantityBought;
var itemID;
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

        if (chosenItem.stock === 0) {
            console.log("====================================");
            console.log(`Sorry we are all out of ${chosenItem.name}s!`)
            console.log(`Please choose something else!`)
            console.log("====================================\n");

            shop();

        } else {
            console.log(`We have ${chosenItem.stock} ${chosenItem.name}(s) in stock!`)
            console.log(`Each ${chosenItem.name} costs $${chosenItem.price}.`)

            checkProductQuantity();
        }

    });
    // connection.end();
}


function checkProductQuantity() {
    inquirer.prompt([{
        type: "input",
        name: "quantity",
        message: "How many do you want to buy?\n"

    }]).then(function (item) {
        quantityBought = item.quantity;

        if (item.quantity == 0) {
            console.log("====================================");
            console.log(`Lets choose another item!`)
            console.log("====================================\n");

            shop();
        } else if (quantityBought <= chosenItem.stock) {
            console.log(`You just bought ${quantityBought} ${chosenItem.name}(s)\n`)

            updateInventory(chosenItem.name);

        } else if (quantityBought > chosenItem.stock) {
            console.log(`Sorry we only have ${chosenItem.stock} left!\n`)
            checkProductQuantity()
        } else {
            shop()
        }


    });

};


var SQLbuyCMD = `UPDATE products SET ? WHERE ?`;

function updateInventory(inventoryItem) {
    console.log('Updating inventory for ' + chosenItem.name + "...");
    // console.log(chosenItem.stock);
    connection.query(SQLbuyCMD,
        // checks database for item
        [{
                stock_quantity: chosenItem.stock - quantityBought
            },
            {
                product_name: chosenItem.name
            }
        ],

        function (err, response) {
            if (err) throw err;

            // update to constructor object
            chosenItem.stock = chosenItem.stock - quantityBought;
            // console.log(chosenItem.name);
            console.log("====================================");
            console.log("====================================\n");



        });

    checkInventory();

    // connection.end();
}

function checkInventory(productID) {

    connection.query(`SELECT * FROM products WHERE item_id = ${chosenItem.id}`, function (err, response) {
        console.log(`Displaying Details for ${chosenItem.name}`)
        console.log("====================================");
        console.log(chosenItem);
        console.log("====================================\n");

    });
    connection.end();
}


shop();