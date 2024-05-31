// Define the Product interface
const productForm = document.querySelector("form");
const productList = document.getElementById("productList");
const updateForm = document.querySelector(".update-form");
const updateNameInput = document.getElementById("updateName");
const updateDescriptionInput = document.getElementById("updateDescription");
const updatePriceInput = document.getElementById("updatePrice");
const updateCategoryInput = document.getElementById("updateCategory");
const updateImageInput = document.getElementById("updateImage");
const addProductBtn = document.getElementById("addProductBtn");
const updateProductBtn = document.getElementById("updateProductBtn");
const cancelUpdateBtn = document.getElementById("cancelUpdateBtn");

let currentProductId = null;

// Fetch products from the server and display them
fetchProducts();

// Add event listener for form submission
productForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const price = parseFloat(document.getElementById("price").value);
  const category = document.getElementById("category").value;
  const image = document.getElementById("image").value;

  // Create a new product object
  const newProduct = {
    id: Date.now(), // Using timestamp as a temporary ID
    name,
    description,
    price,
    category,
    image,
  };

  // Send a POST request to the server to create a new product
  fetch("http://localhost:3000/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newProduct),
  })
    .then((response) => response.json())
    .then((data) => {
      // Clear the form inputs
      productForm.reset();

      // Fetch and display the updated product list
      fetchProducts();
    })
    .catch((error) => console.error("Error creating product:", error));
});

// Function to fetch and display the product list
function fetchProducts() {
  fetch("http://localhost:3000/products")
    .then((response) => response.json())
    .then((data) => {
      // Clear the product list
      productList.innerHTML = "";

      // Iterate over the products and create product cards
      data.forEach((product) => {
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

        // Create buttons for Update and Delete
        const updateButton = document.createElement("button");
        updateButton.textContent = "Update";
        updateButton.addEventListener("click", () => showUpdateForm(product));
        productCard.appendChild(updateButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteProduct(product.id));
        productCard.appendChild(deleteButton);

        productList.appendChild(productCard);
      });
    })
    .catch((error) => console.error("Error fetching products:", error));
}

// Function to show the update form
function showUpdateForm(product) {
  updateNameInput.value = product.name;
  updateDescriptionInput.value = product.description;
  updatePriceInput.value = product.price;
  updateCategoryInput.value = product.category;
  updateImageInput.value = product.image;
  currentProductId = product.id;
  updateForm.style.display = "block";
}

// Function to update a product
function updateProduct() {
  const updatedProduct = {
    id: currentProductId,
    name: updateNameInput.value,
    description: updateDescriptionInput.value,
    price: parseFloat(updatePriceInput.value),
    category: updateCategoryInput.value,
    image: updateImageInput.value,
  };

  fetch(`http://localhost:3000/products/${currentProductId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedProduct),
  })
    .then(() => {
      // Clear the update form inputs
      updateNameInput.value = "";
      updateDescriptionInput.value = "";
      updatePriceInput.value = "";
      updateCategoryInput.value = "";
      updateImageInput.value = "";
      currentProductId = null;
      updateForm.style.display = "none";

      // Fetch and display the updated product list
      fetchProducts();
    })
    .catch((error) => console.error("Error updating product:", error));
}

// Function to delete a product
function deleteProduct(id) {
  fetch(`http://localhost:3000/products/${id}`, {
    method: "DELETE",
  })
    .then(() => {
      // Fetch and display the updated product list
      fetchProducts();
    })
    .catch((error) => console.error("Error deleting product:", error));
}

// Add event listeners for update and cancel buttons
updateProductBtn.addEventListener("click", updateProduct);
cancelUpdateBtn.addEventListener("click", () => {
  updateNameInput.value = "";
  updateDescriptionInput.value = "";
  updatePriceInput.value = "";
  updateCategoryInput.value = "";
  updateImageInput.value = "";
  currentProductId = null;
  updateForm.style.display = "none";
});
