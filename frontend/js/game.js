document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://calculadoraapi-loaf.onrender.com';
    const authToken = localStorage.getItem('authToken');

    // Elementos de la UI
    const loadingScreen = document.getElementById('loading-screen');
    const petCreationSection = document.getElementById('pet-creation-section');
    const gameContainer = document.getElementById('game-container');
    const createPetForm = document.getElementById('create-pet-form');

    // Si no hay token, no debería estar aquí. Volver a login.
    if (!authToken) {
        window.location.href = 'login.html';
        return;
    }

    const apiFetch = async (endpoint, options = {}) => {
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
        };
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        if (response.status === 204) return null; // No content
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || `Error en ${endpoint}`);
        }
        return data;
    };

    const initializeGame = async () => {
        try {
            const pets = await apiFetch('/api/pets');
            
            // Si el usuario NO tiene mascotas, mostramos la pantalla de creación
            if (!pets || pets.length === 0) {
                loadingScreen.classList.add('hidden');
                petCreationSection.classList.remove('hidden');
            } else {
                // Si tiene mascotas, mostramos la pantalla de juego
                loadingScreen.classList.add('hidden');
                gameContainer.classList.remove('hidden');
                // Aquí iría la lógica para cargar el estado del juego
            }
        } catch (error) {
            console.error(error);
            alert('Hubo un error al cargar tus datos. Por favor, intenta iniciar sesión de nuevo.');
            localStorage.removeItem('authToken');
            window.location.href = 'login.html';
        }
    };

    // Lógica para el formulario de creación de mascota
    if (createPetForm) {
        const petImagePreview = document.getElementById('pet-image-preview');
        const prevBtn = document.getElementById('prev-pet-btn');
        const nextBtn = document.getElementById('next-pet-btn');
        const PET_COLORS = ['pet_blue.png', 'pet_red.png', 'pet_green.png'];
        let currentIndex = 0;

        function updatePetPreview() {
            if(petImagePreview) petImagePreview.src = `images/${PET_COLORS[currentIndex]}`;
        }
        if(prevBtn) prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + PET_COLORS.length) % PET_COLORS.length;
            updatePetPreview();
        });
        if(nextBtn) nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % PET_COLORS.length;
            updatePetPreview();
        });
        updatePetPreview();

        createPetForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const petName = document.getElementById('petName').value;
            const errorMessage = document.getElementById('error-message');
            const submitButton = createPetForm.querySelector('.submit-btn');
            errorMessage.textContent = '';
            submitButton.disabled = true;
            submitButton.textContent = 'Creando...';

            try {
                const petData = { name: petName, animal: 'Compañero Digital', superpower: 'Ser adorable' };
                await apiFetch('/api/pets', {
                    method: 'POST',
                    body: JSON.stringify(petData)
                });
                // Recargamos la página para que ahora detecte que ya hay una mascota
                window.location.reload();
            } catch (error) {
                errorMessage.textContent = error.message;
                submitButton.disabled = false;
                submitButton.textContent = '¡Empezar a Jugar!';
            }
        });
    }
    
    // Lógica para el juego principal (placeholder)
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('authToken');
            window.location.href = 'login.html';
        });
    }

    // Iniciar la aplicación
    initializeGame();
});
