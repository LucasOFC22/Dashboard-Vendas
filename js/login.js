document.addEventListener("DOMContentLoaded", function () {
  const firebaseConfig = {
    apiKey: "AIzaSyAhsgy-3hgII6JVv91m6HBkOatM84br7TI",
    authDomain: "dashboard-de-vendas-a9c6a.firebaseapp.com",
    projectId: "dashboard-de-vendas-a9c6a",
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const loginButton = document.getElementById("login-button");
  const loginContainer = document.getElementById("login-container");
  const logoutButton = document.getElementById("logout-button");
  const container = document.getElementById("container");
  const valueInput = document.getElementById("value-name");

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
  


  loginButton.addEventListener("click", () => {
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (username && password) {
      const usersRef = db.collection("login");
      usersRef
        .where("username", "==", username)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.docs.length === 1) {
            const userDoc = querySnapshot.docs[0];
            const storedPassword = userDoc.data().password;

            if (password === storedPassword) {
              mostrarNotificacao("Login bem-sucedido!", "login");
              logoutButton.style.display = "block";
              container.style.display = "block";
              loginContainer.style.display = "none";
              const itemsRef = db.collection("estoque");
              

              function closeModal() {
                document.getElementById("modal").style.display = "none";
              }

              document.getElementById("atualizar-lista-estoque").addEventListener("click", function () {
                mostrarNotificacao("Lista de Estoque atualizada com sucesso!", "atualizar-lista");
                displayStock()

              })

              document.getElementById("open-edit-modal-button").addEventListener("click", function () {
                openEditModal();
                fillProductSelector();
                document.getElementById("product-name").value = "";
                document.getElementById("value-name").value = "";
                document.getElementById("product-quantity").value = "";
                document.getElementById("product-value").value = "";
              });
            
              document.getElementById("add-product-button").addEventListener("click", function () {
                const newProductName = document.getElementById("product-name").value;
                const newProductValue = parseFloat(valueInput.value);
          
                if (newProductName && !isNaN(newProductValue)) {
                  addProduct(newProductName, 0, newProductValue);
                  closeModal();
                } else {
                  mostrarNotificacao("Preencha corretamente o nome e o valor do produto.", "preencha-corretamente");
                }
              });
            
              document.getElementById("remove-button").addEventListener("click", function () {
                const selectedProduct = document.getElementById("product-select").value;
                if (selectedProduct) {
                  removeProduct(selectedProduct);
                  closeModal();
                }
              });
            
              document.getElementById("save-button").addEventListener("click", function () {
                const selectedProduct = document.getElementById("product-select").value;
                const newProductQuantity = parseInt(document.getElementById("product-quantity").value, 10);
            
                if (selectedProduct) {
                  updateProduct(selectedProduct, newProductQuantity);
                }
              });
            
              function openEditModal() {
                document.getElementById("modal").style.display = "block";
            
                // Adicionar ouvinte de evento para fechar o modal ao clicar fora do conteúdo
                const modal = document.getElementById("modal");
                modal.addEventListener("click", function (event) {
                  if (event.target === modal) {
                    closeModal();
                  }
                });
              }
            
              function fillProductSelector() {
                const productSelect = document.getElementById("product-select");
                productSelect.innerHTML = '<option value="">Selecione um produto</option>';
              
                itemsRef.get()
                  .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                      const item = doc.data();
                      const option = document.createElement("option");
                      option.value = item.name;
                      option.textContent = item.name;
                      productSelect.appendChild(option);
                    });
              
                    // Evento que é acionado quando o usuário seleciona um produto
                    productSelect.addEventListener("change", function () {
                      const selectedProduct = productSelect.value;
              
                      if (selectedProduct) {
                        const productRef = itemsRef.doc(selectedProduct);
                        productRef.get().then((doc) => {
                          if (doc.exists) {
                            const productData = doc.data();
              
                            // Preencher os campos do modal com os valores recuperados
                            document.getElementById("product-quantity").value = productData.quantity || 0;
                            document.getElementById("product-value").value = productData.value || 0;
                          } else {
                            console.error("Documento não encontrado na base de dados.");
                          }
                        });
                      } else {
                        // Limpar os campos se nenhum produto estiver selecionado
                        document.getElementById("product-quantity").value = "";
                        document.getElementById("product-value").value = "";
                      }
                    });
                  })
                  .catch(function (error) {
                    console.error("Erro ao preencher o seletor de produtos: ", error);
                  });
              }
            
              function updateProduct(productName, newQuantity) {
    const valueProdut = document.getElementById("product-value").value
                itemsRef.doc(productName).update({
                  quantity: newQuantity,
                  value: valueProdut
                })
                  .then(function () {
                    mostrarNotificacao("Produto atualizado com sucesso!", "Produto-Atualizado");
                    displayStock();
                    closeModal();
                  })
                  .catch(function (error) {
                    console.error("Erro ao atualizar o produto: ", error);
                  });
              }
            
              function addProduct(productName, quantity, value) {
                itemsRef.doc(productName).set({
                  name: productName,
                  quantity: quantity,
                  value: value,
                  sales: 0
                })
                  .then(function () {
                    mostrarNotificacao("Produto adicionado com sucesso!", "Produto-Adicionado");
                    displayStock();
                    closeModal();
                  })
                  .catch(function (error) {
                    console.error("Erro ao adicionar o produto: ", error);
                  });
              }
            
              function removeProduct(productName) {
                itemsRef.doc(productName).delete()
                  .then(function () {
                    mostrarNotificacao("Produto removido com sucesso!", "Produto-Removido");
                    displayStock();
                    closeModal();
                  })
                  .catch(function (error) {
                    console.error("Erro ao remover o produto: ", error);
                  });
              }
            
              // Função para exibir a lista de produtos no estoque
              function displayStock() {
                const stockList = document.getElementById("stock-list");
                stockList.innerHTML = "";
            
                itemsRef.get()
                  .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                      const item = doc.data();
                      const li = document.createElement("li");
                      li.textContent = `${item.name} - Estoque: ${item.quantity} Valor: ${item.value}`;
                      stockList.appendChild(li);
                    });
                  })
                  .catch(function (error) {
                    console.error("Erro ao recuperar itens do estoque: ", error);
                  });
              }

              function exibirNotificacoesNoRelatorio(relatorio) {
                const relatorioMensal = document.getElementById("relatorio-mensal");
              
                // Limpa as notificações anteriores
                relatorioMensal.innerHTML = '';
              
                // Verifica se relatorio é uma matriz e não está indefinido
                if (Array.isArray(relatorio) && relatorio.length > 0) {
                  // Exibe cada notificação no container
                  relatorio.forEach((notificacao) => {
                    const notificacaoElement = document.createElement('div');
                    notificacaoElement.classList.add('notification-item');
                    if (notificacao.tipo === 'Estoque Baixo') {
                      notificacaoElement.classList.add('notificacao-estoque-baixo');
                    }
                    if (notificacao.tipo === 'Produto Vendendo') {
                      notificacaoElement.classList.add('notificacao-produto-vendendo');
                    }
                    notificacaoElement.textContent = `[${notificacao.tipo}] ${notificacao.mensagem}`;
                    relatorioMensal.appendChild(notificacaoElement);
                  });
                }
              }
              
              function gerarRelatorioMensal(estoqueProdutos) {
                const relatorio = [];
              
                // Adicione lógica para verificar produtos com estoque igual ou abaixo de 5 e vendendo bem
                estoqueProdutos.forEach((produto) => {
                  if (produto.quantity <= 5) {
                    const notificacao = {
                      tipo: 'Estoque Baixo',
                      mensagem: `O estoque do produto ${produto.name} está baixo. Apenas ${produto.quantity} unidades disponíveis.`,
                    };
                    relatorio.push(notificacao);
                  }
              
                  if (produto.sales >= 20) {
                    const notificacaoVendas = {
                      tipo: 'Produto Vendendo',
                      mensagem: `O produto ${produto.name}, já vendeu ${produto.sales} unidades, está vendendo muito. Recomendo repor o estoque!`,
                    };
                    relatorio.push(notificacaoVendas);
                  }
                });
              
                // Exibe as notificações
                exibirNotificacoesNoRelatorio(relatorio);
              }
              
              document.getElementById("gerar-relatorio-mensal").addEventListener("click", function () {
                document.getElementById("relatorio").style.display = "block";
              
                itemsRef.get()
                  .then(function (querySnapshot) {
                    const estoqueProdutos = [];
                    querySnapshot.forEach(function (doc) {
                      const produto = doc.data();
                      estoqueProdutos.push(produto);
                    });
              
                    // Chama a função gerarRelatorioMensal agora que ela está definida
                    gerarRelatorioMensal(estoqueProdutos);
                  })
                  .catch(function (error) {
                    console.error("Erro ao obter produtos do estoque: ", error);
                  });
              });

              displayStock();
            } else {
              mostrarNotificacao("Senha incorreta. Tente novamente.", "Login-password-incorreta");
            }
          } else {
            mostrarNotificacao("Nome de usuário não encontrado.", "Login-usuario-nao-encontrado");
          }
        })
        .catch((error) => {
          console.error("Erro ao buscar usuário: ", error);
        });
    } else {
      mostrarNotificacao("Preencha o nome de usuário e senha.", "preencha");
    }
  });
  logoutButton.addEventListener("click", () => {
    mostrarNotificacao("Logout bem-sucedido!");
    logoutButton.style.display = "none";
    container.style.display = "none";
    loginContainer.style.display = "block";
  })
});
