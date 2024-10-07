document.addEventListener('DOMContentLoaded', async () => {
    const itemTableBody = document.getElementById('itemTableBody');
    
    // Fetch items from the server
    const response = await fetch('/api/items');
    const items = await response.json();
    console.log(items);
    console.log(items.numberInStock);

    // Function to render items in the table
    const renderItems = (items) => {
        itemTableBody.innerHTML = ''; // Clear the table body
        items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td>${item.numberinstock !== undefined ? item.numberinstock : 'N/A'}</td>
                <td>${item.category}</td>
                <td>${item.sku}</td>
                <td>
                    <button onclick="editItem(${item.id})">Edit</button>
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

// Edit Item function
function editItem(id) {
    // Redirect to edit page or implement editing functionality
    alert(`Edit item with ID: ${id}`);
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
