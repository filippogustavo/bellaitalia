// Configurações do Firebase
var firebaseConfig = {
    apiKey: "AIzaSyATEZhA-C4g9Tqij7uH7VjxPEJHkDUs1zw",
    authDomain: "pizzariabellaitalia-caded.firebaseapp.com",
    projectId: "pizzariabellaitalia-caded",
    storageBucket: "pizzariabellaitalia-caded.appspot.com",
    messagingSenderId: "275657079834",
    appId: "1:275657079834:web:77fd5079d3c32f0521a5a3"
};
// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

// Carregar produtos sem autenticação
function carregarProdutosSemAutent() {
    var listaProdutos = document.getElementById('lista-produtos');
    listaProdutos.innerHTML = ''; // Limpa a lista

    db.collection("produtos").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var li = document.createElement('li');
            li.classList.add('produto-item');
            li.innerHTML = `
                <div class="produto-detalhes">
                    <strong>${doc.data().nome}</strong><br>
                    Descrição: ${doc.data().descricao}<br>
                    Preço: R$ ${doc.data().preco}
                </div>
                <div class="produto-imagem">
                    <img src="${doc.data().imagem}" alt="${doc.data().nome}">
                </div>
            `;
            listaProdutos.appendChild(li);
        });
    }).catch((error) => {
        console.error("Erro ao carregar produtos: ", error);
    });
}

// Chama a função para carregar os produtos
carregarProdutosSemAutent();