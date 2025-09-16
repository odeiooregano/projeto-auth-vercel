// public/dashboard.js

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('authToken');
    const privateDataMessage = document.getElementById('privateDataMessage');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Se não houver token, redirecione para a página de login
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const res = await fetch('/api/dashboard-data', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (res.ok) {
            privateDataMessage.textContent = data.message;
        } else {
            privateDataMessage.textContent = 'Erro ao carregar dados: ' + data.message;
            // Se o token for inválido, remova-o e force o logout
            localStorage.removeItem('authToken');
            localStorage.removeItem('username');
        }
    } catch (err) {
        privateDataMessage.textContent = 'Erro de conexão com o servidor.';
        console.error(err);
    }

    // Adiciona a lógica para o botão de sair
    logoutBtn.addEventListener('click', () => {
        // Remove o token e o nome de usuário do localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        // Redireciona para a página inicial/de login
        window.location.href = 'index.html';
    });
});