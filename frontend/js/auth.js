document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = ''; // URL vacía para que funcione en local y en Render

    // --- LÓGICA PARA MOSTRAR/OCULTAR FORMULARIO DE LOGIN ---
    const showLoginBtn = document.getElementById('show-login-btn');
    const backToWelcomeBtn = document.getElementById('back-to-welcome');
    const welcomeBox = document.getElementById('welcome-box');
    const loginFormContainer = document.getElementById('login-form-container');

    if (showLoginBtn && loginFormContainer && welcomeBox) {
        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            welcomeBox.classList.add('hidden');
            loginFormContainer.classList.remove('hidden');
        });
    }

    if (backToWelcomeBtn && loginFormContainer && welcomeBox) {
        backToWelcomeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginFormContainer.classList.add('hidden');
            welcomeBox.classList.remove('hidden');
        });
    }

    // --- LÓGICA PARA LOGIN.HTML ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('error-message');
            const submitButton = loginForm.querySelector('.submit-btn');
            
            errorMessage.textContent = '';
            submitButton.disabled = true;
            submitButton.textContent = 'Entrando...';

            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Error de autenticación.');
                }
                
                // Guardamos el token y vamos al dashboard
                localStorage.setItem('authToken', data.token); 
                window.location.href = 'dashboard.html';

            } catch (error) {
                errorMessage.textContent = error.message;
                submitButton.disabled = false;
                submitButton.textContent = 'Entrar';
            }
        });
    }

    // --- LÓGICA PARA REGISTER.HTML ---
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const heroName = document.getElementById('heroName').value;
            const errorMessage = document.getElementById('error-message');
            const submitButton = registerForm.querySelector('.submit-btn');

            errorMessage.textContent = '';
            submitButton.disabled = true;
            submitButton.textContent = 'Creando...';

            try {
                // 1. Registrar usuario
                const regResponse = await fetch(`${API_BASE_URL}/api/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const regData = await regResponse.json();
                if (!regResponse.ok) throw new Error(`Registro fallido: ${regData.message}`);
                
                // Usamos 'authToken' como clave consistente
                const authToken = regData.token;
                localStorage.setItem('authToken', authToken);

                // 2. Crear Héroe
                const heroData = { name: heroName, power: 'Amor por las mascotas', age: 25, city: 'Pet-polis' };
                const heroResponse = await fetch(`${API_BASE_URL}/api/heroes`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify(heroData)
                });
                if (!heroResponse.ok) throw new Error(`Creación de héroe fallida: ${(await heroResponse.json()).message}`);
                
                // Al registrarse, vamos al dashboard
                window.location.href = 'dashboard.html';

            } catch (error) {
                errorMessage.textContent = error.message;
                submitButton.disabled = false;
                submitButton.textContent = 'Crear Cuenta y Entrar';
            }
        });
    }
});