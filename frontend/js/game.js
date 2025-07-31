const API_BASE_URL = ""; // O pon aquí la URL de tu backend en Render
const authToken = localStorage.getItem('authToken');
if (!authToken) {
    window.location.href = 'login.html';
}

// Variables globales
let mascotas = [];
let mascotaActual = 0;
let hero = null;

// Inicialización
window.addEventListener('DOMContentLoaded', async () => {
    await cargarHeroe();
    await cargarMascotas();
    configurarEventos();
});

// --- CARGA DE DATOS ---
async function cargarHeroe() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/heroes`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (response.ok) {
            hero = await response.json();
            document.getElementById('hero-name').textContent = hero.name || 'Mi Héroe';
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
        if (!response.ok) throw new Error('No se pudo cargar las mascotas');
        
        mascotas = await response.json();
        
        if (mascotas.length === 0) {
            document.getElementById('loading-screen').classList.add('hidden');
            window.location.href = 'create-pet.html';
            return;
        }

        // Seleccionar primera mascota
        await seleccionarMascota(0);
        
        // Configurar selector si hay múltiples mascotas
        if (mascotas.length > 1) {
            document.getElementById('pet-selector').classList.remove('hidden');
            actualizarIndicadorMascota();
        }

        document.getElementById('game-container').classList.remove('hidden');
        document.getElementById('loading-screen').classList.add('hidden');
    } catch (err) {
        alert(err.message);
        document.getElementById('loading-screen').classList.add('hidden');
    }
}

async function seleccionarMascota(index) {
    if (index < 0 || index >= mascotas.length) return;
    
    mascotaActual = index;
    const mascota = mascotas[index];
    
    // Actualizar interfaz
    document.getElementById('pet-name').textContent = mascota.name;
    
    // Seleccionar mascota en el backend
    try {
        await fetch(`${API_BASE_URL}/api/game/select/${mascota._id}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        await cargarEstadoMascota();
    } catch (err) {
        console.error('Error seleccionando mascota:', err);
    }
}

async function cargarEstadoMascota() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/game/status`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (response.ok) {
            const estado = await response.json();
            actualizarBarrasEstado(estado);
            
            // Mostrar botón de revivir si la mascota está muerta
            if (estado.status === 'dead') {
                document.getElementById('revive-btn').classList.remove('hidden');
            } else {
                document.getElementById('revive-btn').classList.add('hidden');
            }
        }
    } catch (err) {
        console.error('Error cargando estado:', err);
    }
}

function actualizarBarrasEstado(estado) {
    const health = estado.health || 100;
    const happiness = estado.happiness || 100;
    const hunger = estado.hunger || 0;
    
    document.getElementById('health-bar').style.width = `${health}%`;
    document.getElementById('happiness-bar').style.width = `${happiness}%`;
    document.getElementById('hunger-bar').style.width = `${hunger}%`;
    
    document.getElementById('health-text').textContent = `${health}%`;
    document.getElementById('happiness-text').textContent = `${happiness}%`;
    document.getElementById('hunger-text').textContent = `${hunger}%`;
    
    // Cambiar color según el estado
    const healthBar = document.getElementById('health-bar');
    if (health < 30) {
        healthBar.style.background = 'linear-gradient(90deg, #f44336, #e57373)';
    } else if (health < 60) {
        healthBar.style.background = 'linear-gradient(90deg, #ff9800, #ffb74d)';
    } else {
        healthBar.style.background = 'linear-gradient(90deg, #4CAF50, #8BC34A)';
    }
}

function actualizarIndicadorMascota() {
    document.getElementById('current-pet-indicator').textContent = 
        `${mascotaActual + 1} / ${mascotas.length}`;
}

// --- CONFIGURACIÓN DE EVENTOS ---
function configurarEventos() {
    // Navegación de mascotas
    document.getElementById('prev-pet').addEventListener('click', () => {
        const newIndex = mascotaActual - 1 < 0 ? mascotas.length - 1 : mascotaActual - 1;
        seleccionarMascota(newIndex);
        actualizarIndicadorMascota();
    });
    
    document.getElementById('next-pet').addEventListener('click', () => {
        const newIndex = (mascotaActual + 1) % mascotas.length;
        seleccionarMascota(newIndex);
        actualizarIndicadorMascota();
    });
    
    // Botones del header
    document.getElementById('settings-btn').addEventListener('click', abrirConfiguracionHeroe);
    document.getElementById('add-pet-btn').addEventListener('click', () => {
        window.location.href = 'create-pet.html';
    });
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = 'login.html';
    });
    
    // Acciones de mascota
    document.getElementById('feed-btn').addEventListener('click', abrirModalComida);
    document.getElementById('medicine-btn').addEventListener('click', abrirModalMedicina);
    document.getElementById('walk-btn').addEventListener('click', () => accionMascota('walk', '¡Tu mascota disfrutó el paseo!'));
    document.getElementById('accessories-btn').addEventListener('click', abrirModalAccesorios);
    document.getElementById('revive-btn').addEventListener('click', () => accionMascota('revive', '¡Tu mascota ha sido revivida!'));
    
    // Modales
    configurarModales();
}

function configurarModales() {
    // Cerrar modales
    document.getElementById('close-settings').addEventListener('click', cerrarModal);
    document.getElementById('close-food-modal').addEventListener('click', cerrarModal);
    document.getElementById('close-medicine-modal').addEventListener('click', cerrarModal);
    document.getElementById('close-accessories-modal').addEventListener('click', cerrarModal);
    
    // Formulario de configuración de héroe
    document.getElementById('hero-settings-form').addEventListener('submit', guardarConfiguracionHeroe);
    document.getElementById('delete-hero-btn').addEventListener('click', eliminarHeroe);
    
    // Medicina
    document.querySelectorAll('.medicine-item').forEach(item => {
        item.addEventListener('click', () => {
            const treatment = item.dataset.treatment;
            darMedicina(treatment);
        });
    });
}

// --- ACCIONES DE MASCOTA ---
async function accionMascota(endpoint, mensajeExito) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/game/${endpoint}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Acción fallida');
        }
        
        await cargarEstadoMascota();
        mostrarMensaje(mensajeExito, 'success');
    } catch (err) {
        mostrarMensaje(err.message, 'error');
    }
}

async function alimentarMascota(foodName) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/game/feed`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ foodName })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'No se pudo alimentar');
        }
        
        await cargarEstadoMascota();
        cerrarModal();
        mostrarMensaje(`¡Tu mascota disfrutó ${foodName}!`, 'success');
    } catch (err) {
        mostrarMensaje(err.message, 'error');
    }
}

async function darMedicina(treatment) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/game/give-medicine`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ treatment })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'No se pudo dar medicina');
        }
        
        await cargarEstadoMascota();
        cerrarModal();
        mostrarMensaje(`¡Tu mascota se siente mejor con ${treatment}!`, 'success');
    } catch (err) {
        mostrarMensaje(err.message, 'error');
    }
}

async function equiparAccesorio(accessoryName) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/game/equip`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ accessoryName })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'No se pudo equipar');
        }
        
        await cargarEstadoMascota();
        cerrarModal();
        mostrarMensaje(`¡Tu mascota luce genial con ${accessoryName}!`, 'success');
    } catch (err) {
        mostrarMensaje(err.message, 'error');
    }
}

// --- MODALES ---
async function abrirModalComida() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/game/foods`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (response.ok) {
            const foods = await response.json();
            const foodGrid = document.getElementById('food-grid');
            foodGrid.innerHTML = '';
            
            foods.forEach(food => {
                const foodItem = document.createElement('div');
                foodItem.className = 'food-item';
                foodItem.innerHTML = `
                    <span class="item-icon">${food.icon || '🍎'}</span>
                    <span class="item-name">${food.name}</span>
                `;
                foodItem.addEventListener('click', () => alimentarMascota(food.name));
                foodGrid.appendChild(foodItem);
            });
            
            document.getElementById('food-modal').classList.remove('hidden');
        }
    } catch (err) {
        mostrarMensaje('Error cargando comidas', 'error');
    }
}

function abrirModalMedicina() {
    document.getElementById('medicine-modal').classList.remove('hidden');
}

async function abrirModalAccesorios() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/game/accessories`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (response.ok) {
            const accessories = await response.json();
            const accessoriesGrid = document.getElementById('accessories-grid');
            accessoriesGrid.innerHTML = '';
            
            accessories.forEach(accessory => {
                const accessoryItem = document.createElement('div');
                accessoryItem.className = 'accessory-item';
                accessoryItem.innerHTML = `
                    <span class="item-icon">${accessory.icon || '👑'}</span>
                    <span class="item-name">${accessory.name}</span>
                `;
                accessoryItem.addEventListener('click', () => equiparAccesorio(accessory.name));
                accessoriesGrid.appendChild(accessoryItem);
            });
            
            document.getElementById('accessories-modal').classList.remove('hidden');
        }
    } catch (err) {
        mostrarMensaje('Error cargando accesorios', 'error');
    }
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
        document.getElementById('hero-name').textContent = hero.name;
        cerrarModal();
        mostrarMensaje('¡Configuración guardada!', 'success');
    } catch (err) {
        mostrarMensaje(err.message, 'error');
    }
}

async function eliminarHeroe() {
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