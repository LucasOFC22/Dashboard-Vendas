// Inicialize o Firebase (se já não estiver inicializado)
const firebaseConfig = {
    apiKey: "AIzaSyAhsgy-3hgII6JVv91m6HBkOatM84br7TI",
    authDomain: "dashboard-de-vendas-a9c6a.firebaseapp.com",
    projectId: "dashboard-de-vendas-a9c6a",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Crie um conjunto para rastrear clientes únicos
const uniqueCustomers = new Set();

// Acesse a coleção "vendas" e conte clientes únicos
db.collection("vendas")
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const venda = doc.data();
            const cliente = venda.Cliente;
            uniqueCustomers.add(cliente);
        });

        // Agora, uniqueCustomers contém os clientes únicos
        const totalUniqueCustomers = uniqueCustomers.size;
        // Atualize a quantidade de clientes únicos na página
        document.getElementById("total-customers").textContent = totalUniqueCustomers;
    })
    .catch((error) => {
        console.error("Erro ao acessar a coleção de vendas: ", error);
    });

// Acesse a coleção "total" para obter o total de vendas
db.collection("total")
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const total = doc.data();
            const totalVendas = total.Vendas;
            // Atualize o elemento na página com o total de vendas
            document.getElementById("total-vendas").textContent = totalVendas;
        });
    })
    .catch((error) => {
        console.error("Erro ao acessar a coleção 'total': ", error);
    });
    let lucroTotal = 0; // Variável para acompanhar o lucro total

// Função para calcular o valor original do produto e o lucro
function calcularLucro(valorVenda) {
    const valorProduto = valorVenda - 20;
    const lucro = valorVenda - valorProduto;
    return lucro;
}

// Acesse a coleção "vendas" no Firestore
db.collection("vendas")
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const venda = doc.data();
            const valorVenda = venda.Valor;

            // Calcule o lucro para esta venda e adicione ao lucro total
            const lucro = calcularLucro(valorVenda);
            lucroTotal += lucro;
        });

        // Exiba o lucro total na página
        document.getElementById("lucro-total").textContent = `R$${lucroTotal.toFixed(2)}`;
    })
    .catch((error) => {
        console.error("Erro ao acessar a coleção de vendas: ", error);
    });

    const vendasCollection = db.collection("vendas");

// Crie um objeto para rastrear as vendas por vendedor
const vendasPorVendedor = {};

// Consulta as vendas no Firestore e rastreia as vendas por vendedor
vendasCollection.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        const venda = doc.data();
        const vendedor = venda.Vendedor;
        
        if (vendasPorVendedor[vendedor]) {
            vendasPorVendedor[vendedor]++;
        } else {
            vendasPorVendedor[vendedor] = 1;
        }
    });

    // Converta os dados em um formato adequado para o Chart.js
    const labels = Object.keys(vendasPorVendedor);
    const data = Object.values(vendasPorVendedor);

    // Crie um gráfico de barras
    const ctx = document.getElementById("vendasPorVendedorChart").getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Quantidade de Vendas",
                data: data,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            }],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
});
