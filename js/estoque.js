document.addEventListener("DOMContentLoaded", function () {
  const firebaseConfig = {
    apiKey: "AIzaSyAhsgy-3hgII6JVv91m6HBkOatM84br7TI",
    authDomain: "dashboard-de-vendas-a9c6a.firebaseapp.com",
    projectId: "dashboard-de-vendas-a9c6a",
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const itemsRef = db.collection("estoque");

  // Defina as ações dos botões
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
  }

  function closeModal() {
    document.getElementById("modal").style.display = "none";
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
        console.log("Produto atualizado com sucesso!");
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
        console.log("Produto adicionado com sucesso!");
        closeModal();
      })
      .catch(function (error) {
        console.error("Erro ao adicionar o produto: ", error);
      });
  }

  function removeProduct(productName) {
    itemsRef.doc(productName).delete()
      .then(function () {
        console.log("Produto removido com sucesso!");
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
});