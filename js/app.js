const firebaseConfig = {
    apiKey: "AIzaSyAhsgy-3hgII6JVv91m6HBkOatM84br7TI",
    authDomain: "dashboard-de-vendas-a9c6a.firebaseapp.com",
    projectId: "dashboard-de-vendas-a9c6a",
  };
  
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const addSaleForm = document.getElementById("add-sale-form");
  const searchCustomerInput = document.getElementById("search-customer");
  const searchButton = document.getElementById("search-button");
  const salesList = document.getElementById("sales-list");
  const modal = document.getElementById("myModal");
  
  addSaleForm.addEventListener("submit", function (e) {
    e.preventDefault();
    adicionarVenda();
  });
  
  
  searchButton.addEventListener("click", function () {
    const customerName = searchCustomerInput.value.trim(); // Remova espaços em branco
    pesquisarVendasPorCliente(customerName);
  });

  searchCustomerInput.addEventListener("input", function () {
    const customerName = searchCustomerInput.value.trim(); // Remova espaços em branco
    if (customerName === "") {
      atualizarListaDeVendas(); // Quando o campo está vazio, exiba a lista completa
    }
  });

  function mostrarNotificacao() {
    const notification = document.querySelector('.notification');
    notification.style.right = '10px';
  
    const closeButton = document.createElement('span');
    closeButton.innerHTML = '&times;'; // Adicione o ícone "X" para fechar
    closeButton.className = 'close-button';
    notification.appendChild(closeButton);
  
    closeButton.addEventListener('click', () => {
      notification.style.right = '-300px';
      closeButton.style.display = 'none'; // Oculta o botão de fechar após fechar a notificação
    });
  
    setTimeout(function () {
      notification.style.right = '-300px';
      closeButton.style.display = 'none'; // Oculta o botão de fechar após fechar a notificação automaticamente
    }, 3000);
  }
  
  
  function adicionarVenda() {
    const cliente = document.getElementById("cliente").value;   
    const produto = document.getElementById("produto").value;
    const valor = parseFloat(document.getElementById("valor").value);
    const endereco = document.getElementById("endereco").value;
    const date = document.getElementById("calendar").value;
    const situacao = document.getElementById("situacao").value;
    const vendedor = document.getElementById("vendedor").value;

    // No momento em que você adiciona uma venda bem-sucedida
    const incrementarVendas = () => {
        // Crie uma referência ao documento "total"
        const totalDocRef = db.collection("total").doc("total");
    
        db.runTransaction((transaction) => {
            // Tente buscar o documento "total"
            return transaction.get(totalDocRef).then((totalDoc) => {
                if (!totalDoc.exists) {
                    // Se o documento não existir, crie-o com "Vendas" igual a 1
                    transaction.set(totalDocRef, { Vendas: 1 });
                } else {
                    // Caso contrário, incremente o valor atual de "Vendas"
                    const vendasAnteriores = totalDoc.data().Vendas || 0;
                    transaction.update(totalDocRef, { Vendas: vendasAnteriores + 1 });
                }
            });
        }).then(() => {
            console.log("Vendas incrementadas com sucesso.");
        }).catch((error) => {
            console.error("Erro ao incrementar as vendas: ", error);
        });
    };
    
    // Chame a função para incrementar as vendas
    incrementarVendas();
    

  
    db.collection("vendas")
      .add({
        Cliente: cliente,
        Produto: produto,
        Valor: valor,
        Endereco: endereco,
        Date: date,
        Situacao: situacao,
        Vendedor: vendedor,
      })
      .then(function () {
        console.log("Venda adicionada com sucesso.");
        mostrarNotificacao();
        addSaleForm.reset();
        atualizarListaDeVendas();
      })
      .catch(function (error) {
        console.error("Erro ao adicionar venda: ", error);
      });
  }
  
  function atualizarListaDeVendas() {
    salesList.innerHTML = "";
  
    db.collection("vendas")
      .orderBy("Date", "desc")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const venda = doc.data();
          const itemLista = document.createElement("li");
          itemLista.innerHTML = `
            <p><strong>Cliente:</strong> ${venda.Cliente}</p>
            <p><strong>Produto:</strong> ${venda.Produto}</p>
            <p><strong>Valor:</strong> R$ ${venda.Valor.toFixed(2)}</p>
            <p><strong>Endereço:</strong> ${venda.Endereco}</p>
            <p><strong>Data:</strong> ${venda.Date}</p>
            <p><strong>Situacão:</strong> ${venda.Situacao}</p>
            <p><strong>Vendedor:</strong> ${venda.Vendedor}</p>
            <button class="edit-button" data-docid="${doc.id}">🔑 Editar</button>
            <button class="generate-receipt-button" data-docid="${doc.id}">Gerar Recibo</button>`;
          salesList.appendChild(itemLista);
        });
      })
      .catch((error) => {
        console.error("Erro ao recuperar vendas: ", error);
      });
  }
  
  function pesquisarVendasPorCliente(cliente) {
    salesList.innerHTML = "";
  
    db.collection("vendas")
      .where("Cliente", "==", cliente)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const venda = doc.data();
          const itemLista = document.createElement("li");
          itemLista.innerHTML = `
            <p><strong>Cliente:</strong> ${venda.Cliente}</p>
            <p><strong>Produto:</strong> ${venda.Produto}</p>
            <p><strong>Valor:</strong> R$ ${venda.Valor.toFixed(2)}</p>
            <p><strong>Endereço:</strong> ${venda.Endereco}</p>
            <p><strong>Data:</strong> ${venda.Date}</p>
            <p><strong>Situacão:</strong> ${venda.Situacao}</p>
            <p><strong>Vendedor:</strong> ${venda.Vendedor}</p>
            <button class="edit-button" data-docid="${doc.id}">🔑 Editar</button>
            <button class="generate-receipt-button" data-docid="${doc.id}">Gerar Recibo</button>`
          salesList.appendChild(itemLista);
        });
  
        if (querySnapshot.empty) {
          const noResultsMessage = document.createElement("li");
          noResultsMessage.textContent = "Nenhum resultado encontrado";
          salesList.appendChild(noResultsMessage);
        }
      })
      .catch((error) => {
        console.error("Erro ao pesquisar vendas: ", error);
      });
  }
  
  
  atualizarListaDeVendas();

  // EDIT SITUACAO

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('edit-button')) {
        const docId = event.target.getAttribute('data-docid');
        abrirModalDeEdicao(docId);
    }
});

document.getElementById("confirm-edit-button").addEventListener("click", function () {
    const docId = document.getElementById("edit-form").getAttribute('data-docid');
    const novaSituacao = document.getElementById("AtualizacaoSituacao").value;
    editarSituacaoVenda(docId, novaSituacao);
    fecharModalDeEdicao();
});

function abrirModalDeEdicao(docId) {
    if (docId) {
        const modal = document.getElementById("edit-form");
        modal.setAttribute('data-docid', docId);
        const situacaoSelect = document.getElementById("AtualizacaoSituacao");

        db.collection("vendas")
            .doc(docId)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    const venda = doc.data();
                    situacaoSelect.value = venda.Situacao;
                    
                    modal.style.display = "block";
                } else {
                    console.log("Documento não encontrado.");
                }
            })
            .catch((error) => {
                console.error("Erro ao buscar detalhes da venda: ", error);
            });
    }
}

function editarSituacaoVenda(docId, novaSituacao) {
    if (docId) {
        db.collection("vendas")
            .doc(docId)
            .update({ Situacao: novaSituacao })
            .then(function () {
                console.log("Venda editada com sucesso.");
                fecharModalDeEdicao();
                atualizarListaDeVendas();
            })
            .catch(function (error) {
                console.error("Erro ao editar a venda: ", error);
            });
    }
}

function fecharModalDeEdicao() {
    const modal = document.getElementById("edit-form");
    modal.style.display = "none";
}

//gerar recibo

document.getElementById("generate-pdf-button").addEventListener("click", function () {
  // Defina o conteúdo do PDF usando a biblioteca pdfmake
  var docDefinition = {
    content: [
      { text: 'Exemplo de PDF', style: 'header' },
      'Este é um exemplo de PDF gerado no navegador.',
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
      },
    },
  };

  // Gere o PDF
  pdfMake.createPdf(docDefinition).download('exemplo.pdf');
});
