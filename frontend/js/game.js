createPetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const petName = document.getElementById('petName').value;
    const petAnimal = document.getElementById('petAnimal').value; // <- NUEVO
    const petSuperpower = document.getElementById('petSuperpower').value; // <- NUEVO
    const errorMessage = document.getElementById('error-message');
    const submitButton = createPetForm.querySelector('.submit-btn');
    errorMessage.textContent = '';
    submitButton.disabled = true;
    submitButton.textContent = 'Creando...';

    try {
        // Objeto actualizado con los datos del formulario
        const petData = { 
            name: petName, 
            animal: petAnimal, 
            superpower: petSuperpower 
        };

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