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

async function cargarMascota() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/pets`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (!response.ok) throw new Error('No se pudo cargar la mascota');
        const mascotas = await response.json();
        if (mascotas.length === 0) return; // No hay mascota

        const mascota = mascotas[0]; // Si solo hay una
        document.getElementById('pet-name').textContent = mascota.name;
        document.getElementById('pet-animal').textContent = mascota.animal;
        document.getElementById('pet-superpower').textContent = mascota.superpower;
        // Cambia la imagen según el animal si tienes varias imágenes
        // document.getElementById('pet-image').src = `images/pet_${mascota.animal.toLowerCase()}.png`;

        document.getElementById('pet-card').classList.remove('hidden');
    } catch (err) {
        alert(err.message);
    }
}

// Llama a la función cuando cargue el juego
window.addEventListener('DOMContentLoaded', cargarMascota);


async function cargarMascota() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/pets`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (!response.ok) throw new Error('No se pudo cargar la mascota');
        const mascotas = await response.json();
        if (mascotas.length === 0) return;

        const mascota = mascotas[0];
        document.getElementById('pet-name').textContent = mascota.name;
        document.getElementById('pet-animal').textContent = "Animal: " + mascota.animal;
        document.getElementById('pet-superpower').textContent = "Superpoder: " + mascota.superpower;
        // Si tienes imágenes diferentes por animal:
        // document.getElementById('pet-image').src = `images/pet_${mascota.animal.toLowerCase()}.png`;

        // Cargar estado de la mascota
        await cargarEstadoMascota();

        document.getElementById('game-container').classList.remove('hidden');
    } catch (err) {
        alert(err.message);
    }
}

async function cargarEstadoMascota() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/game/status`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (!response.ok) throw new Error('No se pudo cargar el estado');
        const estado = await response.json();
        document.getElementById('pet-status').textContent = `Estado: ${estado.status || 'Feliz'}`;
    } catch (err) {
        document.getElementById('pet-status').textContent = 'Estado: desconocido';
    }
}

async function accionMascota(endpoint, mensajeExito) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/game/${endpoint}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (!response.ok) throw new Error('Acción fallida');
        await cargarEstadoMascota();
        alert(mensajeExito);
    } catch (err) {
        alert(err.message);
    }
}

document.getElementById('feed-btn').addEventListener('click', () => accionMascota('feed', '¡Mascota alimentada!'));
document.getElementById('heal-btn').addEventListener('click', () => accionMascota('heal', '¡Mascota curada!'));
document.getElementById('walk-btn').addEventListener('click', () => accionMascota('walk', '¡Mascota paseada!'));
document.getElementById('revive-btn').addEventListener('click', () => accionMascota('revive', '¡Mascota revivida!'));

window.addEventListener('DOMContentLoaded', cargarMascota);