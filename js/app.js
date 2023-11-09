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
  const productSelect = document.getElementById("produto");
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

  function mostrarNotificacao(mensagem, tipo) {
    const notification = document.querySelector('.notification');
    notification.style.right = '10px';
  
    // Remover mensagens antigas
    const oldMessages = document.querySelectorAll('.notification-content');
    oldMessages.forEach(oldMessage => oldMessage.remove());
  
    const notificationContent = document.createElement('div');
    notificationContent.className = 'notification-content';
    notificationContent.textContent = mensagem;
    notification.appendChild(notificationContent);
  
    setTimeout(function () {
      notification.style.right = '-300px';
    }, 3000);
  
    // Adicione um controle de tipo de notificação (pode ser uma classe CSS, por exemplo)
    notification.classList.add(tipo);
  }
  
  
  function adicionarVenda() {
    const cliente = document.getElementById("cliente").value;   
    const produto = document.getElementById("produto").value;
    const valor = parseFloat(document.getElementById("valor").value);
    const endereco = document.getElementById("endereco").value;
    const date = document.getElementById("calendar").value;
    const situacao = document.getElementById("situacao").value;
    const vendedor = document.getElementById("vendedor").value;

    if (!produto) {
      mostrarNotificacao("Selecione um produto antes de adicionar a venda.", "Selecione");
      return;
  }
  const estoqueElement = document.getElementById("estoque-produto");
    const estoqueAtual = parseInt(estoqueElement.textContent, 10);
    if (estoqueAtual < 1) {
      mostrarNotificacao("Produto fora de estoque. Não é possível adicionar a venda.", "Produto-fora-de-estoque");
        return;
    }
    const incrementarVendas = () => {
        const totalDocRef = db.collection("total").doc("total");
    
        db.runTransaction((transaction) => {
            return transaction.get(totalDocRef).then((totalDoc) => {
                if (!totalDoc.exists) {
                    transaction.set(totalDocRef, { Vendas: 1 });
                } else {
                    const vendasAnteriores = totalDoc.data().Vendas || 0;
                    transaction.update(totalDocRef, { Vendas: vendasAnteriores + 1 });
                }
            });
        }).then(() => {
          mostrarNotificacao("Vendas incrementadas com sucesso.", "Selecione");
        }).catch((error) => {
            console.error("Erro ao incrementar as vendas: ", error);
        });
    };

    const produtoRef = db.collection("estoque").doc(produto);
    db.runTransaction((transaction) => {
        return transaction.get(produtoRef).then((doc) => {
            const quantidadeAtual = doc.data().quantity;
            if (quantidadeAtual >= 1) {
                transaction.update(produtoRef, { quantity: quantidadeAtual - 1 });
            } else {
              mostrarNotificacao("Produto fora de estoque. Não é possível adicionar a venda.", "Produto-fora-de-estoque");
            }
        });
    }).then(() => {
      mostrarNotificacao("Estoque atualizado com sucesso.", "estoque-atualizado");
        fillProductSelector();
    }).catch((error) => {
        console.error("Erro ao atualizar o estoque: ", error);
    });
    
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
        mostrarNotificacao("Venda adicionada com sucesso.", "venda-adicionada");
        addSaleForm.reset();
        atualizarListaDeVendas();
      })
      .catch(function (error) {
        console.error("Erro ao adicionar venda: ", error);
      });
  }

  function fillProductSelector() {
    productSelect.innerHTML = '<option value="">Selecione um produto</option>';
    db.collection("estoque")
        .where("quantity", ">", 0) // Filtrar produtos com quantidade maior que zero
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const product = doc.data();
                const option = document.createElement("option");
                option.value = product.name;
                option.textContent = product.name;
                productSelect.appendChild(option);

                // Atualize o estoque exibido no elemento de estoque do produto selecionado
                option.addEventListener("click", () => {
                    const estoqueElement = document.getElementById("estoque-produto");
                    estoqueElement.textContent = product.quantity;
                });
            });
        })
        .catch((error) => {
            console.error("Erro ao preencher o seletor de produtos: ", error);
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
            <button class="edit-button" data-docid="${doc.id}">🔑 Editar</button>`;
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
            <button class="edit-button" data-docid="${doc.id}">🔑 Editar</button>`
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
  fillProductSelector();

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
                  mostrarNotificacao("Documento não encontrado.", "nao-encontrado");
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
              mostrarNotificacao("Situação editada com sucesso.", "vendas-editada");
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
