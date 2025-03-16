document.addEventListener("DOMContentLoaded", () => {
    fetchArtworks(); // Load artworks when the page loads
});

// Fetch and display artworks
async function fetchArtworks() {
    try {
        const response = await fetch("http://localhost:5000/get-artworks");
        const artworks = await response.json();

        const tableBody = document.getElementById("artworkTableBody");
        tableBody.innerHTML = "";

        artworks.forEach((art) => {
            const row = `
                <tr>
                    <td>${art.name}</td>
                    <td><img src="${art.imageUrl}" width="80"></td>
                    <td>${art.category}</td>
                    <td>
                        <button class="btn btn-warning" onclick="editArtwork('${art._id}', '${art.name}', '${art.imageUrl}', '${art.category}')">Edit</button>
                        <button class="btn btn-danger" onclick="deleteArtwork('${art._id}')">Delete</button>
                    </td>
                </tr>`;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("❌ Error loading artworks:", error);
    }
}

// Save artwork (Add/Edit)
async function saveArtwork() {
    const name = document.getElementById("title").value.trim();
    const imageUrl = document.getElementById("image_url").value.trim();
    const category = document.getElementById("category").value.trim();
    const id = document.getElementById("artworkId").value; // Hidden input for ID
    const productId = document.getElementById("productId").value.trim(); // Get productId from input

    if (!name || !imageUrl || !category || !productId) {
        alert("⚠️ All fields are required!");
        return;
    }

    // Create artwork data with the productId provided by the user
    const artworkData = { name, productId: productId, category, imageUrl };

    const method = id ? "PUT" : "POST"; // PUT for update, POST for new artwork
    const url = id ? `http://localhost:5000/update-artwork/${id}` : "http://localhost:5000/add-artwork";

    try {
        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(artworkData),
        });

        if (response.ok) {
            alert("✅ Artwork saved successfully!");
            document.getElementById("title").value = "";
            document.getElementById("image_url").value = "";
            document.getElementById("category").value = "";
            document.getElementById("productId").value = ""; // Clear productId input field
            document.getElementById("artworkId").value = ""; // Clear hidden input
            fetchArtworks(); // Refresh artwork list
            new bootstrap.Modal(document.getElementById("addModal")).hide(); // Hide modal
        } else {
            alert("❌ Failed to save artwork.");
        }
    } catch (error) {
        console.error("❌ Error:", error);
        alert("⚠️ Something went wrong!");
    }
}



// Edit artwork (Fill modal fields)
function editArtwork(id, name, imageUrl, category, productId) {
    document.getElementById("artworkId").value = id;
    document.getElementById("title").value = name;
    document.getElementById("image_url").value = imageUrl;
    document.getElementById("category").value = category;
    document.getElementById("productId").value = productId; // Set the productId in the input field

    new bootstrap.Modal(document.getElementById("addModal")).show(); // Show modal
}

// Delete artwork
async function deleteArtwork(id) {
    if (confirm("🗑️ Are you sure you want to delete this artwork?")) {
        try {
            const response = await fetch(`http://localhost:5000/delete-artwork/${id}`, { method: "DELETE" });

            if (response.ok) {
                alert("✅ Artwork deleted successfully!");
                fetchArtworks(); // Refresh artwork list
            } else {
                alert("❌ Failed to delete artwork.");
            }
        } catch (error) {
            console.error("❌ Error deleting artwork:", error);
            alert("⚠️ Something went wrong!");
        }
    }
}
