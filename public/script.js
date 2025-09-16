// public/script.js

const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const messageDiv = document.getElementById('message');

const showMessage = (msg, isError = false) => {
    messageDiv.textContent = msg;
    messageDiv.className = `message ${isError ? 'error' : 'success'}`;
};

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('regUser').value;
    const password = document.getElementById('regPass').value;

    const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (res.ok) {
        showMessage(data.message, false);
        // Limpa os inputs do formulário de registro
        registerForm.reset();
    } else {
        showMessage(data.message, true);
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPass').value;

    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (res.ok) { // res.ok verifica status 200-299
        // Redireciona para a página de sucesso, passando o nome do usuário como parâmetro
        window.location.href = `success.html?user=${data.username}`;
    } else {
        showMessage(data.message, true);
    }
});

const changePasswordForm = document.getElementById('changePasswordForm');

changePasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('changePassUser').value;
    const currentPassword = document.getElementById('currentPass').value;
    const newPassword = document.getElementById('newPass').value;

    const res = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, currentPassword, newPassword })
    });

    const data = await res.json();
    if (res.ok) {
        showMessage(data.message, false);
        changePasswordForm.reset();
    } else {
        showMessage(data.message, true);
    }
});

// Captura elementos do modal
const deleteAccountBtn = document.getElementById('deleteAccountBtn');
const deleteModal = document.getElementById('deleteModal');
const closeBtn = document.querySelector('.close-btn');
const deleteAccountForm = document.getElementById('deleteAccountForm');

// Mostra o modal quando o botão de "Deletar Conta" é clicado
deleteAccountBtn.addEventListener('click', () => {
    deleteModal.style.display = 'flex';
});

// Esconde o modal quando o botão de fechar é clicado
closeBtn.addEventListener('click', () => {
    deleteModal.style.display = 'none';
});

// Esconde o modal ao clicar fora dele
window.addEventListener('click', (event) => {
    if (event.target === deleteModal) {
        deleteModal.style.display = 'none';
    }
});

// Adiciona a lógica para o formulário de exclusão dentro do modal
deleteAccountForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('deleteUser').value;
    const password = document.getElementById('deletePass').value;

    const res = await fetch('/api/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (res.ok) {
        showMessage(data.message, false);
        deleteAccountForm.reset();
        deleteModal.style.display = 'none';
        // Opcional: Redirecionar para a página de login ou para a página inicial
        // window.location.href = 'index.html'; 
    } else {
        showMessage(data.message, true);
    }
});