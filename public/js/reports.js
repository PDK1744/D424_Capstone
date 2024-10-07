document.addEventListener('DOMContentLoaded', () => {
    const stockByCategoryTableBody = document.querySelector('#stockByCategoryTable tbody');
    const lowStockTableBody = document.querySelector('#lowStockTable tbody');

    const getCurrentDateTime = () => {
        const now = new Date();
        return now.toLocaleString();
    }

    // Fetch and render the 'Total Items in Stock by Category' report
    document.getElementById('generateStockByCategoryReport').addEventListener('click', async () => {
        const response = await fetch('/api/items/reports/in-stock-by-category');
        const reportData = await response.json();
        
        // Clear table before rendering
        stockByCategoryTableBody.innerHTML = '';

        // Update Timestamp
        document.getElementById('totalStockReportTimestamp').textContent = `Report generated at: ${getCurrentDateTime()}`;

        // Populate table
        reportData.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${row.category}</td><td>${row.totalstock}</td>`;
            stockByCategoryTableBody.appendChild(tr);
        });
    });

    // Fetch and render the 'Items Low on Stock' report
    document.getElementById('generateLowStockReport').addEventListener('click', async () => {
        const threshold = document.getElementById('stockThreshold').value;
        const response = await fetch('/api/items/reports/low-stock', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ threshold })
        });
        const reportData = await response.json();

        // Clear table before rendering
        lowStockTableBody.innerHTML = '';

        // Update Timestamp
        document.getElementById('lowStockReportTimestamp').textContent = `Report generated at: ${getCurrentDateTime()}`;

        // Populate table
        reportData.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${row.name}</td><td>${row.category}</td><td>${row.numberinstock}</td><td>${row.price}</td>`;
            lowStockTableBody.appendChild(tr);
        });
    });
});
