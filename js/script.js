document.addEventListener('DOMContentLoaded', () => {
    const addSaleForm = document.getElementById('add-sale-form');
    const salesList = document.getElementById('sales-list');
    const searchButton = document.getElementById('search-button');
    const searchCustomer = document.getElementById('search-customer');

    // Carregando as vendas do armazenamento local
    const savedSales = JSON.parse(localStorage.getItem('sales')) || [];
    savedSales.forEach((sale) => {
        appendSaleToDOM(sale);
    });

    addSaleForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const customer = document.getElementById('customer').value;
        const product = document.getElementById('product').value;
        const value = document.getElementById('value').value;
        const address = document.getElementById('address').value;
        const date = document.getElementById('calendar').value;
        const salesperson = document.getElementById('salesperson').value;

        // Criando um objeto para representar a venda
        const sale = {
            customer,
            product,
            value,
            address,
            date,
            salesperson,
        };

        // Adicionando a venda à lista de vendas e ao armazenamento local
        appendSaleToDOM(sale);
        savedSales.push(sale);
        localStorage.setItem('sales', JSON.stringify(savedSales));

        addSaleForm.reset();
    });

    searchButton.addEventListener('click', () => {
        const searchTerm = searchCustomer.value;
        filterSalesByCustomer(searchTerm);
    });

    function appendSaleToDOM(sale) {
        const saleItem = document.createElement('li');
        saleItem.classList.add('sale-item');

        saleItem.innerHTML = `
            <p><strong>Cliente:</strong> <span class="customer-name">${sale.customer}</span></p>
            <p><strong>Produto:</strong> ${sale.product}</p>
            <p><strong>Valor:</strong> R$${sale.value}</p>
            <p><strong>Endereço:</strong> ${sale.address}</p>
            <p><strong>Data:</strong> ${sale.date}</p>
            <p><strong>Vendedor:</strong> ${sale.salesperson}</p>
        `;

        salesList.appendChild(saleItem);
    }

    function filterSalesByCustomer(customerName) {
        const saleItems = document.querySelectorAll('.sale-item');
        saleItems.forEach((saleItem) => {
            const customerElement = saleItem.querySelector('.customer-name');
            const customer = customerElement.textContent;
            if (customer.toLowerCase().includes(customerName.toLowerCase())) {
                saleItem.style.display = 'block';
            } else {
                saleItem.style.display = 'none';
            }
        });
    }
});
