
// constructor for when user types in a letter
function Product(character) {
    this.id = character.item_id;
    this.name = character.product_name;
    this.department_name = character.department_name;
    this.price = character.price;
    this.stock = character.stock_quantity;

    // this.check = function (guess) {
    //     if (guess === this.letter) {
    //         this.guess = true;
    //     }
    // }

}

module.exports = Product;
