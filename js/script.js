import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAhsgy-3hgII6JVv91m6HBkOatM84br7TI",
    authDomain: "dashboard-de-vendas-a9c6a.firebaseapp.com",
    projectId: "dashboard-de-vendas-a9c6a",
    storageBucket: "dashboard-de-vendas-a9c6a.appspot.com",
    messagingSenderId: "1031844698931",
    appId: "1:1031844698931:web:5f79e7b14f4c4ac399fc46",
    measurementId: "G-B7GSHQ10J5"
};

import { getFirestore, collection, addDoc, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js';

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Elementos do formulário
const addSaleForm = document.getElementById('add-sale-form');
const salesList = document.getElementById('sales-list');
const searchButton = document.getElementById('search-button');
const searchCustomer = document.getElementById('search-customer');

// Adiciona uma venda ao Firestore
addSaleForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const customer = document.getElementById('customer').value;
    const product = document.getElementById('product').value;
    const value = document.getElementById('value').value;
    const address = document.getElementById('address').value;
    const date = document.getElementById('calendar').value;
    const salesperson = document.getElementById('salesperson').value;

    // Objeto para representar a venda
    const sale = {
        customer,
        product,
        value,
        address,
        date,
        salesperson,
    };

    try {
        // Adiciona a venda ao Firestore
        await addDoc(collection(db, 'sales'), sale);
        console.log('Venda adicionada com sucesso');

        // Limpa o formulário
        addSaleForm.reset();
    } catch (error) {
        console.error('Erro ao adicionar a venda: ', error);
    }
});

// Filtra as vendas por cliente
searchButton.addEventListener('click', () => {
    const searchTerm = searchCustomer.value;
    filterSalesByCustomer(searchTerm);
});

// Lista todas as vendas do Firestore
async function listSales() {
    const querySnapshot = await getDocs(collection(db, 'sales'));

    querySnapshot.forEach((doc) => {
        const sale = doc.data();
        appendSaleToDOM(sale);
    });
}

// Filtra as vendas pelo nome do cliente
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

// Adiciona uma venda à lista
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

// Lista todas as vendas ao carregar a página
listSales();
