document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = ''; // URL vacía para que funcione en local y en Render

    // --- FUNCIÓN DE REDIRECCIÓN ---
    // Decide si ir al juego o a crear una mascota
    async function redirigirSegunMascota(token) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/pets`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Si el backend responde con error (ej. 401), asumimos que hay que loguearse
            if (!response.ok) {
                // Si la sesión no es válida, mejor ir a login
                if (response.status === 401 || response.status === 403) {
                   window.location.href = 'login.html';
                   return;
                }
                // Para otros errores, intentamos crear mascota por si acaso
                throw new Error('Error del servidor al verificar mascota.');
            }

            const mascotas = await response.json();
            if (mascotas.length === 0) {
                // Si no hay mascotas, a crearlas!
                window.location.href = 'create-pet.html';
            } else {
                // Si ya hay mascota, al juego!
                window.location.href = 'index.html';
            }
        } catch (error) {
            console.error(error);
            // Si algo falla, es más seguro enviar a crear una mascota que al juego.
            window.location.href = 'create-pet.html';
        }
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
                
                // Usamos 'authToken' como clave consistente
                localStorage.setItem('authToken', data.token); 
                await redirigirSegunMascota(data.token);

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
                
                // Al registrarse, siempre vamos a crear mascota
                window.location.href = 'create-pet.html';

            } catch (error) {
                errorMessage.textContent = error.message;
                submitButton.disabled = false;
                submitButton.textContent = 'Crear Cuenta y Entrar';
            }
        });
    }
});