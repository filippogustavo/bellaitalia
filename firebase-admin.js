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
var auth = firebase.auth();
var storage = firebase.storage();

// Autenticação do Usuário
auth.onAuthStateChanged((user) => {
    if (user) {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('produto-form').style.display = 'block';
        document.getElementById('lista-produtos-existente').style.display = 'block';
        carregarProdutos(); // Carrega produtos após login
    } else {
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('produto-form').style.display = 'none';
        document.getElementById('lista-produtos-existente').style.display = 'none';
    }
});

document.getElementById('login-button').addEventListener('click', function () {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            location.reload(); // Recarega a Página
            carregarProdutos(); // Carrega produtos após login
        })
        .catch((error) => {
            document.getElementById('login-error').textContent = "Erro de login: " + error.message;
        });
});

document.getElementById('logout-button').addEventListener('click', function () {
    auth.signOut(); // Desloga do Firedase
    location.reload(); // Recarega a Página
});

// Adicionar produto com upload de imagem
document.getElementById('adicionar-button').addEventListener('click', function () {
    var nome = document.getElementById('nome').value;
    var descricao = document.getElementById('descricao').value;
    var preco = document.getElementById('preco').value;
    var imagem = document.getElementById('imagem').files[0];

    if (imagem) {
        var storageRef = storage.ref('imagens/' + imagem.name);
        storageRef.put(imagem).then((snapshot) => {
            snapshot.ref.getDownloadURL().then((url) => {
                db.collection("produtos").add({
                    imagem: url,
                    nome: nome,
                    descricao: descricao,
                    preco: preco
                }).then(() => {
                    alert('Produto adicionado com sucesso!');
                    //document.getElementById('produto-form').reset();
                    carregarProdutos(); // Recarregar lista de produtos
                    location.reload(); // Recarega a Página 
                }).catch((error) => {
                    console.error("Erro ao adicionar produto: ", error);
                });
            });
        });
    }
});

// Carregar produtos existentes
function carregarProdutos() {
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
                        <div class="produto-botoes">
                            <button class="btnEditar" onclick="editarProduto('${doc.id}', '${doc.data().nome}', '${doc.data().descricao}', '${doc.data().preco}', '${doc.data().imagem}')">Editar</button>
                            <button class="btnExcluir" onclick="excluirProduto('${doc.id}')">Excluir</button>
                        </div>    
                    `;
            listaProdutos.appendChild(li);
        });
    });
}

// Excluir produto
function excluirProduto(id) {
    if (confirm("Deseja excluir este produto?")) {
        db.collection("produtos").doc(id).delete().then(() => {
            alert('Produto excluído com sucesso!');
            carregarProdutos(); // Recarrega a lista após exclusão
            location.reload(); // Recarega a Página
        }).catch((error) => {
            console.error("Erro ao excluir produto: ", error);
        });
    }
}

// Editar produto
function editarProduto(id, nome, descricao, preco, imagem) {
    document.getElementById('nome').value = nome;
    document.getElementById('descricao').value = descricao;
    document.getElementById('preco').value = preco;

    // Atualizar o texto do botão para "Salvar Alterações"
    document.getElementById('adicionar-button').textContent = 'Salvar Alterações';

    // Scroll até o formulário
    document.getElementById('produto-form').scrollIntoView({ behavior: 'smooth' });

    // Define a função para salvar as alterações
    document.getElementById('adicionar-button').onclick = function () {
        var novoNome = document.getElementById('nome').value;
        var novaDescricao = document.getElementById('descricao').value;
        var novoPreco = document.getElementById('preco').value;
        var novaImagem = document.getElementById('imagem').files[0];

        if (novaImagem) {
            var storageRef = storage.ref('imagens/' + novaImagem.name);
            storageRef.put(novaImagem).then((snapshot) => {
                snapshot.ref.getDownloadURL().then((url) => {
                    db.collection("produtos").doc(id).update({
                        imagem: url,
                        nome: novoNome,
                        descricao: novaDescricao,
                        preco: novoPreco
                    }).then(() => {
                        alert('Produto atualizado com sucesso!');
                        carregarProdutos(); // Recarrega a lista
                        location.reload(); // Recarega a Página
                    }).catch((error) => {
                        console.error("Erro ao atualizar produto: ", error);
                    });
                });
            });
        } else {
            db.collection("produtos").doc(id).update({
                nome: novoNome,
                descricao: novaDescricao,
                preco: novoPreco
            }).then(() => {
                alert('Produto atualizado com sucesso!');
                carregarProdutos(); // Recarrega a lista
                location.reload(); // Recarega a Página
            }).catch((error) => {
                console.error("Erro ao atualizar produto: ", error);
            });
        }
    };
}
