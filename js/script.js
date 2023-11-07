const firebaseConfig = {
    apiKey: "AIzaSyAhsgy-3hgII6JVv91m6HBkOatM84br7TI",
    authDomain: "dashboard-de-vendas-a9c6a.firebaseapp.com",
    projectId: "dashboard-de-vendas-a9c6a",
    storageBucket: "dashboard-de-vendas-a9c6a.appspot.com",
    messagingSenderId: "1031844698931",
    appId: "1:1031844698931:web:5f79e7b14f4c4ac399fc46",
    measurementId: "G-B7GSHQ10J5"
  };
  import { initializeApp } from 'firebase/app';
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    const addSaleForm = document.getElementById('add-sale-form');
    const salesList = document.getElementById('sales-list');
    const searchButton = document.getElementById('search-button');
    const searchCustomer = document.getElementById('search-customer');

    const salesCollection = collection(db, 'sales');
    const querySnapshot =  getDocs(salesCollection);
    querySnapshot.forEach((doc) => {
        const sale = doc.data();
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

        // Adicionando a venda ao Firebase Realtime Database
        const newSaleRef = salesRef.push();
        newSaleRef.set(sale);

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

