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

              document.getElementById("open-edit-modal-button").addEventListener("click", function () {
                openEditModal();
                fillProductSelector();
              });
            
              document.getElementById("add-product-button").addEventListener("click", function () {
                const newProductName = document.getElementById("product-name").value;
                if (newProductName) {
                  addProduct(newProductName, 0); // Define o estoque inicial como 0
                  closeModal();
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
                  })
                  .catch(function (error) {
                    console.error("Erro ao preencher o seletor de produtos: ", error);
                  });
              }
            
              function updateProduct(productName, newQuantity) {
                itemsRef.doc(productName).update({
                  quantity: newQuantity
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
            
              function addProduct(productName, quantity) {
                itemsRef.doc(productName).set({
                  name: productName,
                  quantity: quantity
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
                      li.textContent = `${item.name} - Estoque: ${item.quantity}`;
                      stockList.appendChild(li);
                    });
                  })
                  .catch(function (error) {
                    console.error("Erro ao recuperar itens do estoque: ", error);
                  });
              }
            
              // Chame a função para exibir o estoque quando a página carregar
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
