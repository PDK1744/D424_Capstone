document.addEventListener('DOMContentLoaded', async () => {
    const itemTableBody = document.getElementById('itemTableBody');

    // Fetch items from the server
    const response = await fetch('/api/items');
    const items = await response.json();
    console.log(items);

    // Function to render items in the table
    const renderItems = (items) => {
        itemTableBody.innerHTML = ''; // Clear the table body
        items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-field="name">${item.name}</td>
                <td data-field="price">${item.price}</td>
                <td data-field="numberInStock">${item.numberinstock !== undefined ? item.numberinstock : 'N/A'}</td>
                <td data-field="category">${item.category}</td>
                <td data-field="sku">${item.sku}</td>
                <td>
                    <button onclick="editItem(this)">Edit</button>
                    <button onclick="saveItem(${item.id}, this)">Save</button>
                    <button onclick="deleteItem(${item.id})">Delete</button>
                </td>
            `;
            itemTableBody.appendChild(row);
        });
    };

    renderItems(items);

    // Search functionality
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredItems = items.filter(item =>
            item.name.toLowerCase().includes(searchTerm)
        );
        renderItems(filteredItems);
    });
});

// Activate inline editing
function editItem(button) {
    const row = button.parentElement.parentElement;
    const cells = row.children;

    // Make cells editable
    for (let i = 0; i < cells.length - 1; i++) { // Exclude the last cell (buttons)
        cells[i].contentEditable = true;
        cells[i].style.border = '1px dashed #ccc'; // Optional: Add border to show edit mode
    }

    // Change the "Edit" button to "Cancel"
    button.innerText = 'Cancel';
    button.setAttribute('onclick', 'cancelEdit(this)'); // Change function to cancelEdit
}

// Cancel inline editing
function cancelEdit(button) {
    const row = button.parentElement.parentElement;
    const cells = row.children;

    // Make cells non-editable
    for (let i = 0; i < cells.length - 1; i++) {
        cells[i].contentEditable = false;
        cells[i].style.border = ''; // Remove border
    }

    // Reset to "Edit" button
    button.innerText = 'Edit';
    button.setAttribute('onclick', 'editItem(this)'); // Change function back to editItem
}

// Save edited item
async function saveItem(id, button) {
    const row = button.parentElement.parentElement;
    const name = row.children[0].innerText;
    const price = row.children[1].innerText;
    const numberInStock = row.children[2].innerText;
    const category = row.children[3].innerText;
    const sku = row.children[4].innerText;

    const updatedItem = {
        name,
        price: parseFloat(price),
        numberInStock: parseInt(numberInStock),
        category,
        sku,
    };

    const response = await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
    });

    if (response.ok) {
        alert('Item updated successfully!');
        const itemsResponse = await fetch('/api/items'); // Refresh the item list
        const items = await itemsResponse.json();
        renderItems(items);
    } else {
        alert('Error updating item.');
    }
}

// Delete Item function
async function deleteItem(id) {
    const confirmDelete = confirm('Are you sure you want to delete this item?');
    if (confirmDelete) {
        const response = await fetch(`/api/items/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            alert('Item deleted successfully');
            window.location.reload(); // Refresh the page to see the updated list
        } else {
            alert('Failed to delete item');
        }
    }
}
