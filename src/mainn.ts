interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

const productList = document.getElementById("productList") as HTMLDivElement;
const cartOverlay = document.getElementById("cartOverlay") as HTMLDivElement;
const cartItems = document.getElementById("cartItems") as HTMLElement;
const cartCount = document.querySelector(".cart-count") as HTMLSpanElement;
const cartTotalElements = document.querySelectorAll(".cart-total");
const closeCartBtn = document.getElementById(
  "closeCartBtn"
) as HTMLButtonElement;

let cart: CartItem[] = [];

// Fetch products from the server and display them
fetchProducts();

// Function to fetch and display the product list
function fetchProducts() {
  fetch("http://localhost:3000/products")
    .then((response) => response.json())
    .then((data) => {
      // Clear the product list
      productList.innerHTML = "";

      // Iterate over the products and create product cards
      data.forEach((product: Product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name;
        productCard.appendChild(image);

        const name = document.createElement("h3");
        name.textContent = product.name;
        productCard.appendChild(name);

        const description = document.createElement("p");
        description.textContent = product.description;
        productCard.appendChild(description);

        const price = document.createElement("p");
        price.textContent = `$${product.price.toFixed(2)}`;
        price.classList.add("price");
        productCard.appendChild(price);

        const category = document.createElement("p");
        category.textContent = `Category: ${product.category}`;
        productCard.appendChild(category);

        const addToCartButton = document.createElement("button");
        addToCartButton.textContent = "Add to Cart";
        addToCartButton.addEventListener("click", () => addToCart(product));
        productCard.appendChild(addToCartButton);

        productList.appendChild(productCard);
      });
    })
    .catch((error) => console.error("Error fetching products:", error));
}

// Function to add a product to the cart
function addToCart(product: Product) {
  const existingCartItem = cart.find((item) => item.id === product.id);

  if (existingCartItem) {
    existingCartItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();
}

// Function to remove a product from the cart
function removeFromCart(id: string) {
  cart = cart.filter((item) => item.id !== id);
  updateCartUI();
}

// Function to update the cart UI
function updateCartUI() {
  cartItems.innerHTML = "";
  let totalPrice = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("li");
    cartItemElement.classList.add("cart-item");

    const itemDetails = document.createElement("span");
    itemDetails.textContent = `${item.name} (${item.quantity}) - Ksh${(
      item.price * item.quantity
    ).toFixed(2)}`;
    cartItemElement.appendChild(itemDetails);

    cartItems.appendChild(cartItemElement);

    totalPrice += item.price * item.quantity;
  });

  cartCount.textContent = cart.length.toString();
  cartTotalElements.forEach((element) => {
    element.textContent = `Ksh${totalPrice.toFixed(2)}`;
  });
}

// Event listener for opening the cart
const cartLink = document.querySelector("nav ul li:nth-child(2) a");

if (cartLink) {
  cartLink.addEventListener("click", () => {
    cartOverlay.style.display = "flex";
  });
}

// Event listener for closing the cart
closeCartBtn.addEventListener("click", () => {
  cartOverlay.style.display = "none";
});

// Add event listener for window load
window.addEventListener("load", () => {
  const cartLink = document.querySelector("nav ul li:nth-child(2) a");

  if (cartLink) {
    cartLink.addEventListener("click", () => {
      cartOverlay.style.display = "flex";
    });
  }
});
