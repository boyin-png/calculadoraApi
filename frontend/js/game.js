const API_BASE_URL = ""; // O pon aquí la URL de tu backend en Render
const authToken = localStorage.getItem('authToken');
if (!authToken) {
    window.location.href = 'login.html';
}

// Variables globales
let mascotas = [];
let mascotaActual = 0;
let hero = null;

// Sistema de animaciones
const animationMap = {
    idle: 'p_idle.mp4', // <-- Asegúrate que este nombre es el correcto
    eating_meat: 'p_comiendof.mp4',
    eating_kibble: 'p_comiendoc.mp4',
    eating_fish: 'p_comiendop.mp4',
    sick: 'p_enfermo.mp4',
    walking: 'p_paseando.mp4',
    dead: 'fondohab', // Imagen estática de habitación vacía
};

// --- NUEVA FUNCIÓN PARA PRECARGAR VIDEOS ---
function precargarVideos() {
    console.log('Pre-cargando videos...');
    for (const key in animationMap) {
        if (animationMap[key].endsWith('.mp4')) {
            const video = document.createElement('video');
            video.src = `anim/${animationMap[key]}`;
            video.preload = 'auto';
        }
    }
}

// Inicialización
window.addEventListener('DOMContentLoaded', async () => {
    // LLAMAMOS A LA NUEVA FUNCIÓN AQUÍ
    precargarVideos();
    
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

        await seleccionarMascota(0);
        
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
    
    document.getElementById('pet-name').textContent = mascota.name;
    
    const petImg = document.getElementById('pet-image');
    if (petImg && mascota.animalImage) {
        petImg.src = `images/${mascota.animalImage}`;
        petImg.alt = `${mascota.name} - ${mascota.animal}`;
    }
    
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
            
            const currentAnimation = getAnimationBasedOnStatus(estado);
            playAnimation(currentAnimation);
            
            if (estado.hp <= 0) {
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

function configurarEventos() {
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
    
    document.getElementById('dashboard-btn').addEventListener('click', () => {
        window.location.href = 'dashboard.html';
    });
    document.getElementById('settings-btn').addEventListener('click', abrirConfiguracionHeroe);
    document.getElementById('add-pet-btn').addEventListener('click', () => {
        window.location.href = 'create-pet.html';
    });
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = 'login.html';
    });
    
    document.getElementById('feed-btn').addEventListener('click', abrirModalComida);
    document.getElementById('medicine-btn').addEventListener('click', abrirModalMedicina);
    document.getElementById('walk-btn').addEventListener('click', () => accionMascota('walk', '¡Tu mascota disfrutó el paseo!', 'walking', 6000));
    document.getElementById('accessories-btn').addEventListener('click', abrirModalAccesorios);
    document.getElementById('revive-btn').addEventListener('click', () => accionMascota('revive', '¡Tu mascota ha sido revivida!', 'idle', 2000));
    
    configurarModales();
}

function configurarModales() {
    document.getElementById('close-settings').addEventListener('click', cerrarModal);
    document.getElementById('close-food-modal').addEventListener('click', cerrarModal);
    document.getElementById('close-medicine-modal').addEventListener('click', cerrarModal);
    document.getElementById('close-accessories-modal').addEventListener('click', cerrarModal);
    
    document.getElementById('hero-settings-form').addEventListener('submit', guardarConfiguracionHeroe);
    document.getElementById('delete-hero-btn').addEventListener('click', eliminarHeroe);
    
    document.querySelectorAll('.medicine-item').forEach(item => {
        item.addEventListener('click', () => {
            const treatment = item.dataset.treatment;
            darMedicina(treatment);
        });
    });
}

// --- ACCIONES DE MASCOTA (MODIFICADA) ---
async function accionMascota(endpoint, mensajeExito, animationType, duration) {
    try {
        playTemporaryAnimation(animationType, duration, async () => {
             const response = await fetch(`${API_BASE_URL}/api/game/${endpoint}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Acción fallida');
            }
            
            mostrarMensaje(mensajeExito, 'success');
            // Ya no llamamos a cargarEstadoMascota aquí, porque se hará al final de la animación.
        });

    } catch (err) {
        mostrarMensaje(err.message, 'error');
        await cargarEstadoMascota(); // Recargamos estado si hay un error inicial
    }
}

async function alimentarMascota(foodName) {
    cerrarModal();
    let eatingAnimation = 'eating_kibble';
    if (foodName.toLowerCase().includes('filete')) {
        eatingAnimation = 'eating_meat';
    } else if (foodName.toLowerCase().includes('pescado')) {
        eatingAnimation = 'eating_fish';
    }
    
    playTemporaryAnimation(eatingAnimation, 5000, async () => {
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
            mostrarMensaje(`¡Tu mascota disfrutó ${foodName}!`, 'success');

        } catch(err) {
            mostrarMensaje(err.message, 'error');
        }
    });
}

async function darMedicina(treatment) {
    cerrarModal();
    playTemporaryAnimation('idle', 3000, async () => {
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
             mostrarMensaje(`¡Tu mascota se siente mejor con ${treatment}!`, 'success');
        } catch (err) {
            mostrarMensaje(err.message, 'error');
        }
    });
}

async function equiparAccesorio(accessoryName) {
    cerrarModal();
    playTemporaryAnimation('idle', 2000, async () => {
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
            mostrarMensaje(`¡Tu mascota luce genial con ${accessoryName}!`, 'success');
        } catch (err) {
            mostrarMensaje(err.message, 'error');
        }
    });
}


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

function mostrarMensaje(mensaje, tipo) {
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

// === SISTEMA DE ANIMACIONES (MODIFICADO) ===
function playAnimation(animationType) {
    const video = document.getElementById('pet-animation');
    const fallbackImg = document.getElementById('pet-image');
    const animationFile = animationMap[animationType] || animationMap.idle;
    
    if (animationType === 'dead') {
        video.style.display = 'none';
        fallbackImg.style.display = 'block';
        return;
    }
    
    video.style.display = 'block';
    fallbackImg.style.display = 'none';
    
    const newSrc = `anim/${animationFile}`;
    if (video.currentSrc.endsWith(newSrc)) return;

    video.src = newSrc;
    video.load();
    video.play().catch(err => {
        console.error('Error al reproducir video:', err);
        video.style.display = 'none';
        fallbackImg.style.display = 'block';
    });
}

// --- FUNCIÓN TEMPORAL CORREGIDA ---
function playTemporaryAnimation(animationType, duration = 3000, onActionCallback) {
    playAnimation(animationType);

    if (onActionCallback) {
        onActionCallback();
    }
    
    setTimeout(() => {
        // Al terminar, siempre cargamos el estado, lo que asegura volver a idle si todo está bien.
        cargarEstadoMascota(); 
    }, duration);
}

function getAnimationBasedOnStatus(petStatus) {
    if (!petStatus) return 'idle';
    if (petStatus.hp <= 0) return 'dead';
    if (petStatus.health_status === 'enfermo' && petStatus.health < 30) return 'sick';
    return 'idle';
}