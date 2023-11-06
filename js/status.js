document.addEventListener('DOMContentLoaded', () => {
    const totalSalesElement = document.getElementById('total-sales');
    const totalCustomersElement = document.getElementById('total-customers');
    const totalProfitElement = document.getElementById('total-profit');
    const salesData = JSON.parse(localStorage.getItem('sales')) || [];

    // Calcular o número de vendas por cliente
    const salesByCustomer = {};
    salesData.forEach((sale) => {
        const customer = sale.customer;
        if (!salesByCustomer[customer]) {
            salesByCustomer[customer] = 0;
        }
        salesByCustomer[customer]++;
    });

    // Atualizar as informações na página de status
    totalSalesElement.textContent = salesData.length;
    totalCustomersElement.textContent = Object.keys(salesByCustomer).length;

    // Calcular o lucro total
    const totalProfit = salesData.reduce((acc, sale) => {
        const saleValue = parseFloat(sale.value);
        const productValue = saleValue - 20; // Valor original do produto
        const profit = saleValue - productValue; // Lucro
        return acc + profit;
    }, 0);
    totalProfitElement.textContent = `R$${totalProfit.toFixed(2)}`;

    // Calcular o total de vendas por vendedor
    const salesBySalesperson = {};
            salesData.forEach((sale) => {
                const salesperson = sale.salesperson;
                if (!salesBySalesperson[salesperson]) {
                    salesBySalesperson[salesperson] = 0;
                }
                salesBySalesperson[salesperson]++;
            });

            const salespersons = Object.keys(salesBySalesperson);
            const totalSales = Object.values(salesBySalesperson);

            const ctx = document.getElementById('salesChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: salespersons,
                    datasets: [
                        {
                            label: 'Total de Vendas',
                            data: totalSales,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
        });
    console.log(totalSales);
});
