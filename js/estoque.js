const firebaseConfig = {
    apiKey: "AIzaSyAhsgy-3hgII6JVv91m6HBkOatM84br7TI",
    authDomain: "dashboard-de-vendas-a9c6a.firebaseapp.com",
    projectId: "dashboard-de-vendas-a9c6a",
};
  
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
const itemsRef = db.collection("estoque"); // Declare itemsRef no escopo global

var modal = document.getElementById("modal");
var itemName = document.getElementById("product-name");
var itemQuantity = document.getElementById("product-quantity");

// Formulário para adicionar um novo item ao estoque
var addItemForm = document.getElementById("add-item-form");
addItemForm.addEventListener("submit", function (e) {
  e.preventDefault();

  itemsRef.add({
    name: itemName,
    quantity: itemQuantity
  })
  .then(function() {
    console.log("Item adicionado ao estoque com sucesso!");
  })
  .catch(function(error) {
    console.error("Erro ao adicionar item: ", error);
  });

  // Limpe o formulário
  addItemForm.reset();
});

// Função para exibir itens do estoque
function displayStock() {
  var stockList = document.getElementById("stock-list");
  stockList.innerHTML = ""; // Limpe a lista para evitar duplicatas

  // Consulta todos os itens no Firestore
  itemsRef.get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      var item = doc.data();
      var li = document.createElement("li");
      li.textContent = item.name + " - Quantidade: " + item.quantity;
      stockList.appendChild(li);
    });
  })
  .catch(function(error) {
    console.error("Erro ao recuperar itens do estoque: ", error);
  });
}

// Exiba os itens iniciais do estoque
displayStock();
