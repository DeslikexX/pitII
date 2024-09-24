let cart = [];

// Redirecionamentos
document.querySelector('.nav-left a').addEventListener('click', () => window.location.href = 'index.html');
document.querySelector('.nav-right a[href="carrinho.html"]').addEventListener('click', () => window.location.href = 'carrinho.html');
document.querySelector('.nav-right a[href="menu.html"]').addEventListener('click', () => window.location.href = 'menu.html');

// Função para manipular a quantidade no cardápio
function updateQuantity(button) {
    const quantityElement = button.parentNode.querySelector('span.quantity');
    let quantity = parseInt(quantityElement.textContent);
    
    if (button.dataset.action === 'increase') {
        quantity += 1;
    } else if (button.dataset.action === 'decrease' && quantity > 1) {
        quantity -= 1;
    }
    
    quantityElement.textContent = quantity;
}

// Manipula as quantidades no cardápio
document.querySelectorAll('.quantity-controls button').forEach((button) => {
    button.addEventListener('click', () => updateQuantity(button));
});

// Adicionar ao carrinho
document.querySelectorAll('.add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
        const product = {
            name: button.closest('.menu-item').dataset.product,
            price: parseFloat(button.closest('.menu-item').dataset.price),
            quantity: parseInt(button.closest('.menu-item').querySelector('.quantity').textContent)
        };

        const productInCart = cart.find(item => item.name === product.name);
        if (productInCart) {
            productInCart.quantity += product.quantity;
        } else {
            cart.push(product);
        }

        alert(`${product.name} foi adicionado ao carrinho!`);
        updateCart(); // Atualiza o carrinho após adicionar um item
    });
});

// Atualiza o carrinho na página
function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total').querySelector('h2');

    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="https://images.mrcook.app/recipe-image/01904098-64b1-740f-98b4-a14ae8c5025d" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>R$ <span class="item-price">${item.price.toFixed(2)}</span></p>
            <div class="quantity-controls">
                <button class="quantity-btn" data-action="decrease" data-index="${index}">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" data-action="increase" data-index="${index}">+</button>
            </div>
            <button class="remove-item" data-index="${index}">Remover</button>
        `;
        cartItemsContainer.appendChild(cartItem);
        total += item.price * item.quantity;
    });

    cartTotal.innerText = `Total: R$${total.toFixed(2)}`;
    initializeCartButtons(); // Re-inicializa os eventos dos botões após atualizar o carrinho
}

// Adiciona eventos aos botões de quantidade e remover
function initializeCartButtons() {
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', function () {
            const index = this.getAttribute('data-index');
            const action = this.getAttribute('data-action');

            if (action === 'increase') {
                cart[index].quantity += 1;
            } else if (action === 'decrease' && cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            }

            localStorage.setItem('cartItems', JSON.stringify(cart));
            updateCart();
        });
    });

    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function () {
            const index = this.getAttribute('data-index');
            cart.splice(index, 1);
            localStorage.setItem('cartItems', JSON.stringify(cart));
            updateCart();
        });
    });
}

// Salvar no localStorage e carregar ao abrir o carrinho
document.addEventListener('DOMContentLoaded', function () {
    const storedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    cart = storedCart;
    updateCart();

    // Finalizar pedido
    document.getElementById('finalize-order').addEventListener('click', function () {
        document.querySelector('.finalize-modal').style.display = 'flex'; // Exibir modal de finalização
    });

    // Fechar modal
    document.querySelector('.close-modal').addEventListener('click', function () {
        document.querySelector('.finalize-modal').style.display = 'none';
    });

    // Lógica para confirmar o pedido
    document.getElementById('confirm-order').addEventListener('click', function() {
        if (cart.length > 0) {
            const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2);
            alert("Seu pedido foi confirmado!\nTotal: R$" + total);
            
            // Salvar o pedido no localStorage
            const lastOrders = JSON.parse(localStorage.getItem('lastOrders')) || [];
            lastOrders.push({ data: new Date().toLocaleString(), itens: cart, total: total });
            localStorage.setItem('lastOrders', JSON.stringify(lastOrders));

            cart = []; 
            localStorage.setItem('cartItems', JSON.stringify(cart));
            updateCart();
            document.querySelector('.finalize-modal').style.display = 'none';
        } else {
            alert("Seu carrinho está vazio!");
        }
    });
});

// Atualiza o carrinho no localStorage antes de sair da página
window.addEventListener('beforeunload', function() {
    localStorage.setItem('cartItems', JSON.stringify(cart));
});

// Função para fechar a modal ao clicar fora do conteúdo
window.addEventListener('click', function(event) {
    const finalizeModal = document.querySelector('.finalize-modal');
    if (event.target === finalizeModal) {
        finalizeModal.style.display = 'none'; // Esconde a modal se clicar fora
    }
});

// Controle de login e registro
document.getElementById("registerLink").addEventListener("click", function(event) {
    event.preventDefault();
    document.getElementById("loginForm").style.display = "none"; 
    document.getElementById("registerForm").style.display = "block"; 
});

document.getElementById("loginLink").addEventListener("click", function(event) {
    event.preventDefault(); 
    document.getElementById("registerForm").style.display = "none"; 
    document.getElementById("loginForm").style.display = "block"; 
});

// Variáveis para armazenar informações do usuário
let userInfo = {
    nome: '',
    rua: '',
    numero: '',
    email: ''
};

// Função para atualizar a barra de navegação após login
function updateNavAfterLogin() {
    const profileLink = document.getElementById('profileLink');
    profileLink.textContent = 'Perfil';
    profileLink.onclick = displayUserInfo; 
}

// Função para exibir as informações do usuário
function displayUserInfo() {
    alert(`Nome: ${userInfo.nome}\nRua: ${userInfo.rua}\nNúmero: ${userInfo.numero}\nEmail: ${userInfo.email}`);
}

// Função unificada para verificar status do login
function checkLoginStatus() {
    const loggedUser = localStorage.getItem('loggedUser');
    const profileLink = document.getElementById('profileLink');

    if (loggedUser) {
        profileLink.textContent = 'Perfil';
        profileLink.onclick = displayUserInfo; 
    } else {
        profileLink.textContent = 'LOGIN';
        profileLink.href = 'login.html';
    }
}

// Verifica o login ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus(); 

    // Simulação de login
    document.getElementById('loginForm').onsubmit = function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const storedUser = localStorage.getItem(email);
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            if (userData.senha === password) {
                alert('Login realizado com sucesso!');
                localStorage.setItem('loggedUser', email);  
                window.location.href = 'menu.html';  
            } else {
                alert('Senha incorreta.');
            }
        } else {
            alert('Usuário não encontrado.');
        }
    };
});

// Evento para verificar últimos pedidos
document.getElementById('check-orders').addEventListener('click', function() {
    const lastOrders = JSON.parse(localStorage.getItem('lastOrders')) || [];
    const ordersList = lastOrders.map(order => `Data: ${order.data}\nItens: ${order.itens.map(item => `${item.name} (R$${item.price.toFixed(2)} x ${item.quantity})`).join(', ')}\nTotal: R$${order.total}`).join('\n\n');
    
    if (ordersList.length > 0) {
        alert(`Últimos Pedidos:\n\n${ordersList}`);
    } else {
        alert('Você ainda não fez nenhum pedido.');
    }
});
