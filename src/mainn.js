var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var productList = document.getElementById("productList");
var cartOverlay = document.getElementById("cartOverlay");
var cartItems = document.getElementById("cartItems");
var cartCount = document.querySelector(".cart-count");
var cartTotalElements = document.querySelectorAll(".cart-total");
var closeCartBtn = document.getElementById("closeCartBtn");
var cart = [];
// Fetch products from the server and display them
fetchProducts();
// Function to fetch and display the product list
function fetchProducts() {
    fetch("http://localhost:3000/products")
        .then(function (response) { return response.json(); })
        .then(function (data) {
        // Clear the product list
        productList.innerHTML = "";
        // Iterate over the products and create product cards
        data.forEach(function (product) {
            var productCard = document.createElement("div");
            productCard.classList.add("product-card");
            var image = document.createElement("img");
            image.src = product.image;
            image.alt = product.name;
            productCard.appendChild(image);
            var name = document.createElement("h3");
            name.textContent = product.name;
            productCard.appendChild(name);
            var description = document.createElement("p");
            description.textContent = product.description;
            productCard.appendChild(description);
            var price = document.createElement("p");
            price.textContent = "$".concat(product.price.toFixed(2));
            price.classList.add("price");
            productCard.appendChild(price);
            var category = document.createElement("p");
            category.textContent = "Category: ".concat(product.category);
            productCard.appendChild(category);
            var addToCartButton = document.createElement("button");
            addToCartButton.textContent = "Add to Cart";
            addToCartButton.addEventListener("click", function () { return addToCart(product); });
            productCard.appendChild(addToCartButton);
            productList.appendChild(productCard);
        });
    })
        .catch(function (error) { return console.error("Error fetching products:", error); });
}
// Function to add a product to the cart
function addToCart(product) {
    var existingCartItem = cart.find(function (item) { return item.id === product.id; });
    if (existingCartItem) {
        existingCartItem.quantity++;
    }
    else {
        cart.push(__assign(__assign({}, product), { quantity: 1 }));
    }
    updateCartUI();
}
// Function to update the cart UI
function updateCartUI() {
    cartItems.innerHTML = "";
    var totalPrice = 0;
    cart.forEach(function (item) {
        var cartItemElement = document.createElement("li");
        cartItemElement.textContent = "".concat(item.name, " (").concat(item.quantity, ") - $").concat((item.price * item.quantity).toFixed(2));
        cartItems.appendChild(cartItemElement);
        totalPrice += item.price * item.quantity;
    });
    cartCount.textContent = cart.length.toString();
    cartTotalElements.forEach(function (element) {
        element.textContent = "$".concat(totalPrice.toFixed(2));
    });
}
// Event listener for opening the cart
var cartLink = document.querySelector("nav ul li:nth-child(2) a");
if (cartLink) {
    cartLink.addEventListener("click", function () {
        cartOverlay.style.display = "flex";
    });
}
// Event listener for closing the cart
closeCartBtn.addEventListener("click", function () {
    cartOverlay.style.display = "none";
});
// Add event listener for window load
window.addEventListener("load", function () {
    var cartLink = document.querySelector("nav ul li:nth-child(2) a");
    if (cartLink) {
        cartLink.addEventListener("click", function () {
            cartOverlay.style.display = "flex";
        });
    }
});
