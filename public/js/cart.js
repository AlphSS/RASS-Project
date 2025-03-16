window.onload = loadCart;

async function loadCart() {
  try {
    const response = await fetch("/cart/get-cart");
    const cartItems = await response.json();

    const container = document.getElementById("cartContainer");
    container.innerHTML = "";

    if (cartItems.products.length === 0) {
      document.querySelector(".empty-cart").style.display = "block";
    } else {
      document.querySelector(".empty-cart").style.display = "none";
    }
    

    cartItems.products.forEach((cartItem) => {
      const card = `
          <div class="col-md-4 mb-4">
            <div class="card">
              <img src="${cartItem.imgUrl}" class="card-img-top" />
              <div class="card-body">
                <h5>${cartItem.title}</h5>
                <p>${cartItem.category}</p>
                <button onclick="deleteCart('${cartItem.productId}')" class="btn btn-danger">Delete</button>
              </div>
            </div>
          </div>
        `;
      container.innerHTML += card;
    });
  } catch (error) {
    console.log("Failed to load cart items", error);
  }
}

async function deleteCart(productId) {
  const res = await fetch(`/cart/delete-cart/${productId}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (data.success) {
    alert(data.message);
    loadCart();
  } else {
    alert("Failed to delete product");
  }
}
