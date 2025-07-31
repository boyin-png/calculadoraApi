document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://calculadoraapi-loaf.onrender.com';

    // --- LÓGICA PARA LOGIN.HTML ---
    if (document.body.classList.contains('login-page')) {
        const welcomeBox = document.getElementById('welcome-box');
        const loginForm = document.getElementById('login-form');
        const showLoginBtn = document.getElementById('show-login-btn');
        const backToWelcomeBtn = document.getElementById('back-to-welcome');

        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            welcomeBox.classList.add('hidden');
            loginForm.classList.remove('hidden');
        });

        backToWelcomeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.classList.add('hidden');
            welcomeBox.classList.remove('hidden');
        });

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('error-message');
            errorMessage.textContent = '';

            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message);
                
                localStorage.setItem('authToken', data.token);
                window.location.href = 'index.html';
            } catch (error) {
                errorMessage.textContent = error.message;
            }
        });
    }

    // --- LÓGICA PARA REGISTER.HTML ---
    if (document.body.classList.contains('register-page')) {
        const registerForm = document.getElementById('register-form');
        const errorMessage = document.getElementById('error-message');
        
        const charImage = document.getElementById('char-image');
        const avatarNamePlaceholder = document.getElementById('avatar-name-placeholder');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        const avatarOptions = ["Avatar de Fuego", "Avatar de Planta", "Avatar de Agua"];
        let currentIndex = 0;

        function updateAvatarDisplay() {
            avatarNamePlaceholder.textContent = avatarOptions[currentIndex];
        }

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + avatarOptions.length) % avatarOptions.length;
            updateAvatarDisplay();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % avatarOptions.length;
            updateAvatarDisplay();
        });

        updateAvatarDisplay();

        // Aquí iría la lógica de envío del formulario de registro a la API
        // que construiremos en el siguiente paso.
    }
});
