document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://calculadoraapi-loaf.onrender.com';
    const authToken = localStorage.getItem('authToken');

    // Si no hay token, no debería estar en esta página. Redirigir a login.
    if (!authToken) {
        window.location.href = 'login.html';
        return;
    }

    const createPetForm = document.getElementById('create-pet-form');
    const errorMessage = document.getElementById('error-message');
    const submitButton = createPetForm.querySelector('.submit-btn');
    
    // Elementos del selector visual
    const petImagePreview = document.getElementById('pet-image-preview');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    const PET_COLORS = ['pet_blue.png', 'pet_red.png', 'pet_green.png'];
    let currentIndex = 0;

    function updatePetPreview() {
        petImagePreview.src = `images/${PET_COLORS[currentIndex]}`;
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + PET_COLORS.length) % PET_COLORS.length;
        updatePetPreview();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % PET_COLORS.length;
        updatePetPreview();
    });

    createPetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = '';
        submitButton.disabled = true;
        submitButton.textContent = 'Creando...';

        const petName = document.getElementById('petName').value;

        try {
            const petData = { 
                name: petName, 
                animal: 'Compañero Digital', 
                superpower: 'Ser adorable',
                // Podríamos guardar el color si la API lo soporta
                // color: PET_COLORS[currentIndex] 
            };
            
            const response = await fetch(`${API_BASE_URL}/api/pets`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(petData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'No se pudo crear la mascota.');
            }

            // Si todo sale bien, finalmente vamos al juego
            window.location.href = 'index.html';

        } catch (error) {
            errorMessage.textContent = error.message;
            submitButton.disabled = false;
            submitButton.textContent = '¡Empezar a Jugar!';
        }
    });

    // Inicializar la vista previa
    updatePetPreview();
});
