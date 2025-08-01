document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = '';
    const authToken = localStorage.getItem('authToken'); // Leemos con la clave correcta

    // Si no hay token, no debería estar en esta página
    if (!authToken) {
        window.location.href = 'login.html';
        return;
    }

    // === SELECCIÓN DE ANIMALES ===
    let selectedAnimal = 'Perro'; // Por defecto el primer animal
    
    // Configurar selección de animales
    const animalOptions = document.querySelectorAll('.animal-option');
    if (animalOptions.length > 0) {
        // Seleccionar el primer animal por defecto
        animalOptions[0].classList.add('selected');
        document.getElementById('petAnimal').value = selectedAnimal;
        
        // Manejar clics en animales
        animalOptions.forEach((option) => {
            option.addEventListener('click', () => {
                // Remover selección anterior
                animalOptions.forEach(opt => opt.classList.remove('selected'));
                // Agregar selección actual
                option.classList.add('selected');
                selectedAnimal = option.dataset.animal;
                document.getElementById('petAnimal').value = selectedAnimal;
            });
        });
    }

    const createPetForm = document.getElementById('create-pet-form');
    const errorMessage = document.getElementById('error-message');
    const submitButton = createPetForm.querySelector('button[type="submit"]');

    createPetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = '';
        submitButton.disabled = true;
        submitButton.textContent = 'Creando...';

        const petName = document.getElementById('petName').value;
        const petAnimal = document.getElementById('petAnimal').value;
        const petSuperpower = document.getElementById('petSuperpower').value;

        try {
            // Mapear animal a imagen
            const animalImageMap = {
                'Perro': 'perro.jpg',
                'Gato': 'gato.jpg',
                'Hámster': 'hamster.jpg'
            };
            
            const petData = { 
                name: petName, 
                animal: petAnimal, 
                superpower: petSuperpower,
                animalImage: animalImageMap[petAnimal] || 'covig.png'
            };
            
            const response = await fetch(`${API_BASE_URL}/api/pets`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${authToken}`, // Usamos el token
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(petData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'No se pudo crear la mascota.');
            }

            // Si todo sale bien, volvemos al dashboard
            window.location.href = 'dashboard.html';

        } catch (error) {
            errorMessage.textContent = error.message;
            submitButton.disabled = false;
            submitButton.textContent = '¡Empezar a Jugar!';
        }
    });
});