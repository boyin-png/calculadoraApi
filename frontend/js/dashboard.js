const API_BASE_URL = ""; // O pon aquí la URL de tu backend en Render
const authToken = localStorage.getItem('authToken');
if (!authToken) {
    window.location.href = 'login.html';
}

// Variables globales
let hero = null;
let mascotas = [];

// Inicialización
window.addEventListener('DOMContentLoaded', async () => {
    await cargarHeroe();
    await cargarMascotas();
    configurarEventos();
    document.getElementById('loading-screen').classList.add('hidden');
});

// --- CARGA DE DATOS ---
async function cargarHeroe() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/heroes`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (response.ok) {
            hero = await response.json();
            actualizarInfoHeroe();
        }
    } catch (err) {
        console.error('Error cargando héroe:', err);
    }
}

async function cargarMascotas() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/pets`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (response.ok) {
            mascotas = await response.json();
            mostrarMascotas();
            actualizarEstadisticas();
        }
    } catch (err) {
        console.error('Error cargando mascotas:', err);
        mostrarMascotasVacias();
    }
}

function actualizarInfoHeroe() {
    if (hero) {
        document.getElementById('hero-name-display').textContent = hero.name || 'Héroe';
        document.getElementById('hero-power-display').textContent = hero.power || 'Poder desconocido';
    }
}

function mostrarMascotas() {
    const petsGrid = document.getElementById('pets-grid');
    petsGrid.innerHTML = '';

    if (mascotas.length === 0) {
        mostrarMascotasVacias();
        return;
    }

    mascotas.forEach((mascota, index) => {
        const petCard = document.createElement('div');
        petCard.className = 'pet-card';
        petCard.innerHTML = `
            <div class="pet-card-image">
                ${getAnimalEmoji(mascota.animal)}
            </div>
            <h3>${mascota.name}</h3>
            <p>${mascota.animal} • ${mascota.superpower}</p>
            <div class="pet-status">
                <div class="status-indicator">
                    <span>❤️</span>
                    <span id="health-${index}">100%</span>
                </div>
                <div class="status-indicator">
                    <span>😊</span>
                    <span id="happiness-${index}">100%</span>
                </div>
                <div class="status-indicator">
                    <span>🍎</span>
                    <span id="hunger-${index}">0%</span>
                </div>
            </div>
        `;
        
        petCard.addEventListener('click', () => jugarConMascota(mascota._id));
        
        // Agregar botón de gestión (clic derecho o mantener presionado)
        petCard.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            abrirGestionMascota(mascota, index);
        });
        
        petsGrid.appendChild(petCard);
        
        // Cargar estado de cada mascota
        cargarEstadoMascota(mascota._id, index);
    });
}

function mostrarMascotasVacias() {
    const petsGrid = document.getElementById('pets-grid');
    petsGrid.innerHTML = `
        <div class="empty-pets">
            <div class="empty-pets-icon">🐾</div>
            <h3>No tienes mascotas aún</h3>
            <p>¡Crea tu primera mascota para empezar a jugar!</p>
        </div>
    `;
}

async function cargarEstadoMascota(petId, index) {
    try {
        // Primero seleccionar la mascota
        await fetch(`${API_BASE_URL}/api/game/select/${petId}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        // Luego obtener su estado
        const response = await fetch(`${API_BASE_URL}/api/game/status`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (response.ok) {
            const estado = await response.json();
            const health = estado.health || 100;
            const happiness = estado.happiness || 100;
            const hunger = estado.hunger || 0;
            const isDead = estado.hp <= 0;
            
            const healthElement = document.getElementById(`health-${index}`);
            const happinessElement = document.getElementById(`happiness-${index}`);
            const hungerElement = document.getElementById(`hunger-${index}`);
            const petCard = document.querySelector(`.pet-card:nth-child(${index + 1})`);
            
            if (healthElement) healthElement.textContent = `${health}%`;
            if (happinessElement) happinessElement.textContent = `${happiness}%`;
            if (hungerElement) hungerElement.textContent = `${hunger}%`;
            
            // Marcar visualmente si está muerta
            if (petCard) {
                if (isDead) {
                    petCard.style.opacity = '0.6';
                    petCard.style.filter = 'grayscale(100%)';
                    petCard.title = 'Esta mascota está muerta. Ve al juego para revivirla.';
                } else {
                    petCard.style.opacity = '1';
                    petCard.style.filter = 'none';
                    petCard.title = 'Clic para jugar con esta mascota';
                }
            }
        }
    } catch (err) {
        console.error('Error cargando estado de mascota:', err);
    }
}

function getAnimalEmoji(animal) {
    const emojis = {
        'Perro': '🐕',
        'Gato': '🐱',
        'Hámster': '🐹',
        'Conejo': '🐰',
        'Pájaro': '🐦',
        'Pez': '🐠'
    };
    return emojis[animal] || '🐾';
}

function actualizarEstadisticas() {
    document.getElementById('total-pets').textContent = mascotas.length;
    // Estas estadísticas pueden venir del backend en el futuro
    document.getElementById('total-games').textContent = mascotas.length * 5; // Ejemplo
    document.getElementById('total-score').textContent = mascotas.length * 250; // Ejemplo
}

async function jugarConMascota(petId) {
    try {
        // Seleccionar la mascota en el backend
        await fetch(`${API_BASE_URL}/api/game/select/${petId}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        // Ir al juego
        window.location.href = 'index.html';
    } catch (err) {
        mostrarMensaje('Error al seleccionar mascota', 'error');
    }
}

// --- CONFIGURACIÓN DE EVENTOS ---
function configurarEventos() {
    // Botones del header
    document.getElementById('settings-btn').addEventListener('click', abrirConfiguracionHeroe);
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = 'login.html';
    });
    
    // Botón crear nueva mascota
    document.getElementById('create-new-pet-btn').addEventListener('click', () => {
        window.location.href = 'create-pet.html';
    });
    
    // Modales
    configurarModales();
}

function configurarModales() {
    // Cerrar modales
    document.getElementById('close-settings').addEventListener('click', cerrarModal);
    document.getElementById('close-pet-manage').addEventListener('click', cerrarModal);
    
    // Formulario de configuración de héroe
    document.getElementById('hero-settings-form').addEventListener('submit', guardarConfiguracionHeroe);
    document.getElementById('delete-hero-btn').addEventListener('click', eliminarHeroe);
    
    // Gestión de mascotas
    document.getElementById('delete-pet-btn').addEventListener('click', eliminarMascotaSeleccionada);
}

function abrirConfiguracionHeroe() {
    if (hero) {
        document.getElementById('hero-name-input').value = hero.name || '';
        document.getElementById('hero-power-input').value = hero.power || '';
        document.getElementById('hero-age-input').value = hero.age || '';
        document.getElementById('hero-city-input').value = hero.city || '';
    }
    document.getElementById('hero-settings-modal').classList.remove('hidden');
}

async function guardarConfiguracionHeroe(e) {
    e.preventDefault();
    
    const heroData = {
        name: document.getElementById('hero-name-input').value,
        power: document.getElementById('hero-power-input').value,
        age: parseInt(document.getElementById('hero-age-input').value),
        city: document.getElementById('hero-city-input').value
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/heroes/${hero._id}`, {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(heroData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'No se pudo actualizar');
        }
        
        hero = await response.json();
        actualizarInfoHeroe();
        cerrarModal();
        mostrarMensaje('¡Configuración guardada!', 'success');
    } catch (err) {
        mostrarMensaje(err.message, 'error');
    }
}

async function eliminarHeroe() {
    if (!hero || !hero._id) {
        mostrarMensaje('Error: No se encontró información del héroe', 'error');
        return;
    }
    
    if (!confirm('¿Estás seguro? Esto eliminará tu avatar y todas tus mascotas.')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/heroes/${hero._id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'No se pudo eliminar');
        }
        
        localStorage.removeItem('authToken');
        window.location.href = 'login.html';
    } catch (err) {
        mostrarMensaje(err.message, 'error');
    }
}

function cerrarModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('hidden');
    });
}

// Variables para gestión de mascotas
let mascotaSeleccionada = null;

function abrirGestionMascota(mascota, index) {
    mascotaSeleccionada = mascota;
    document.getElementById('manage-pet-name').textContent = mascota.name;
    document.getElementById('manage-pet-details').textContent = `${mascota.animal} • ${mascota.superpower}`;
    document.getElementById('pet-manage-modal').classList.remove('hidden');
}

async function eliminarMascotaSeleccionada() {
    if (!mascotaSeleccionada) {
        mostrarMensaje('Error: No hay mascota seleccionada', 'error');
        return;
    }
    
    if (!confirm(`¿Estás seguro de que quieres eliminar a ${mascotaSeleccionada.name}? Esta acción no se puede deshacer.`)) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/pets/${mascotaSeleccionada._id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'No se pudo eliminar la mascota');
        }
        
        cerrarModal();
        mostrarMensaje(`${mascotaSeleccionada.name} ha sido eliminada`, 'success');
        
        // Recargar la lista de mascotas
        await cargarMascotas();
        
        mascotaSeleccionada = null;
    } catch (err) {
        mostrarMensaje(err.message, 'error');
    }
}

function mostrarMensaje(mensaje, tipo) {
    // Crear elemento de mensaje temporal
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        background: ${tipo === 'success' ? '#4CAF50' : '#f44336'};
    `;
    messageDiv.textContent = mensaje;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}