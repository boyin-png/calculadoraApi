const API_BASE_URL = ""; // O pon aquí la URL de tu backend en Render
const authToken = localStorage.getItem('authToken'); // ¡Misma clave!
if (!authToken) {
    window.location.href = 'login.html';
}

async function cargarMascota() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/pets`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (!response.ok) throw new Error('No se pudo cargar la mascota');
        const mascotas = await response.json();
        if (mascotas.length === 0) {
            document.getElementById('loading-screen').classList.add('hidden');
            // Aquí podrías mostrar el formulario de crear mascota si lo deseas
            return;
        }

        const mascota = mascotas[0];
        document.getElementById('pet-name').textContent = mascota.name;
        document.getElementById('pet-animal').textContent = "Animal: " + mascota.animal;
        document.getElementById('pet-superpower').textContent = "Superpoder: " + mascota.superpower;

        await cargarEstadoMascota();

        document.getElementById('game-container').classList.remove('hidden');
        document.getElementById('loading-screen').classList.add('hidden');
    } catch (err) {
        alert(err.message);
        document.getElementById('loading-screen').classList.add('hidden');
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