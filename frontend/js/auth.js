document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://calculadoraapi-loaf.onrender.com';

    // --- LÓGICA PARA LOGIN.HTML ---
    if (document.body.classList.contains('login-page')) {
        const welcomeBox = document.getElementById('welcome-box');
        const loginFormContainer = document.getElementById('login-form-container');
        const loginForm = document.getElementById('login-form');
        const showLoginBtn = document.getElementById('show-login-btn');
        const backToWelcomeBtn = document.getElementById('back-to-welcome');

        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            welcomeBox.classList.add('hidden');
            loginFormContainer.classList.remove('hidden');
        });

        backToWelcomeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginFormContainer.classList.add('hidden');
            welcomeBox.classList.remove('hidden');
        });

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
                if (!response.ok) throw new Error(data.message);
                
                localStorage.setItem('authToken', data.token);
                window.location.href = 'index.html';
            } catch (error) {
                errorMessage.textContent = error.message;
                submitButton.disabled = false;
                submitButton.textContent = 'Entrar';
            }
        });
    }

    // --- LÓGICA PARA REGISTER.HTML ---
    if (document.body.classList.contains('register-page')) {
        const registerForm = document.getElementById('register-form');
        const errorMessage = document.getElementById('error-message');
        const submitButton = registerForm.querySelector('.submit-btn');
        
        const avatarNamePlaceholder = document.getElementById('avatar-name-placeholder');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        const avatarOptions = ["Avatar de Fuego", "Avatar de Planta", "Avatar de Agua"];
        let currentIndex = 0;

        function updateAvatarDisplay() {
            if(avatarNamePlaceholder) avatarNamePlaceholder.textContent = avatarOptions[currentIndex];
        }

        if(prevBtn) prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + avatarOptions.length) % avatarOptions.length;
            updateAvatarDisplay();
        });

        if(nextBtn) nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % avatarOptions.length;
            updateAvatarDisplay();
        });

        updateAvatarDisplay();

        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorMessage.textContent = '';
            submitButton.disabled = true;
            submitButton.textContent = 'Creando...';

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const heroName = document.getElementById('heroName').value;

            try {
                // 1. Registrar usuario
                const regResponse = await fetch(`${API_BASE_URL}/api/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const regData = await regResponse.json();
                if (!regResponse.ok) throw new Error(`Registro: ${regData.message}`);
                
                const authToken = regData.token;
                localStorage.setItem('authToken', authToken);

                // 2. Crear Héroe
                const heroData = { name: heroName, power: 'Amor por las mascotas', age: 25, city: 'Pet-polis' };
                const heroResponse = await fetch(`${API_BASE_URL}/api/heroes`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify(heroData)
                });
                if (!heroResponse.ok) throw new Error(`Héroe: ${(await heroResponse.json()).message}`);
                
                window.location.href = 'index.html';

            } catch (error) {
                errorMessage.textContent = error.message;
                submitButton.disabled = false;
                submitButton.textContent = 'Crear Cuenta y Entrar';
            }
        });
    }
});
