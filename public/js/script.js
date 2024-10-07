// Function to fetch all items and display them
const fetchItems = async () => {
    try {
        const response = await fetch('/api/items');
        const items = await response.json();

        // Clear the item list display area
        const itemList = document.getElementById('itemList');
        itemList.innerHTML = '';

        // Loop through items and display them
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('item');
            itemElement.innerHTML = `
                <h3>${item.name}</h3>
                <p>Price: $${item.price}</p>
                <p>Stock: ${item.numberInStock}</p>
                <p>Category: ${item.category}</p>
                <p>SKU: ${item.sku}</p>
                <button onclick="deleteItem('${item.id}')">Delete</button>
            `;
            itemList.appendChild(itemElement);
        });
    } catch (error) {
        console.error('Error fetching items:', error);
    }
};

// Function to handle form submission (Add new item)
document.getElementById('itemForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form submission

    // Collect form data
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const numberInStock = document.getElementById('numberInStock').value;
    const category = document.getElementById('category').value;
    const sku = document.getElementById('sku').value;

    // Client-side validation
    if (!name || !price || !numberInStock || !category || !sku) {
        alert('All fields are required.');
        return;
    }

    if (isNaN(price) || price <= 0) {
        alert('Price must be a valid positive number.');
        return;
    }

    if (isNaN(numberInStock) || numberInStock < 0) {
        alert('Stock must be a number greater than or equal to 0.');
        return;
    }

    // Create new item object
    const newItem = { name, price, numberInStock, category, sku };

    try {
        // Send POST request to server
        const response = await fetch('/api/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newItem),
        });

        if (response.ok) {
            alert('Item added successfully!');
            // Clear form
            document.getElementById('itemForm').reset();
            // Refresh the item list
            fetchItems();
        } else {
            const errorResponse = await response.json();
            alert(`Error: ${errorResponse.message}`);
        }
    } catch (error) {
        console.error('Error adding item:', error);
        alert('Error adding item.');
    }
});

// Function to delete an item by ID
const deleteItem = async (itemId) => {
    if (confirm('Are you sure you want to delete this item?')) {
        try {
            const response = await fetch(`/api/items/${itemId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Item deleted successfully!');
                // Refresh the item list
                fetchItems();
            } else {
                const errorResponse = await response.json();
                alert(`Error: ${errorResponse.message}`);
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Error deleting item.');
        }
    }
};

// Fetch items on page load
document.addEventListener('DOMContentLoaded', fetchItems);
