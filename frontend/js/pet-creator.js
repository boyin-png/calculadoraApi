const API_BASE_URL = ""; // O la URL de tu backend
const authToken = localStorage.getItem('authToken');
if (!authToken) {
    window.location.href = 'login.html';
}createPetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.textContent = '';
    submitButton.disabled = true;
    submitButton.textContent = 'Creando...';

    const petName = document.getElementById('petName').value;
    const petAnimal = document.getElementById('petAnimal').value; // <- NUEVO
    const petSuperpower = document.getElementById('petSuperpower').value; // <- NUEVO

    try {
        // Objeto actualizado con los datos del formulario
        const petData = { 
            name: petName, 
            animal: petAnimal, 
            superpower: petSuperpower
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