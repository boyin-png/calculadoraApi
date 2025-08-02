const API_BASE_URL = ""; // O pon aquí la URL de tu backend en Render
const authToken = localStorage.getItem('authToken');
if (!authToken) {
    window.location.href = 'login.html';
}

// --- VARIABLES GLOBALES ---
let mascotas = [];
let mascotaActual = 0;
let hero = null;
let inactivityTimer; // Timer para el estado "durmiendo"

// --- MAPA DE ANIMACIONES ---
const animationMap = {
    idle: 'p_idle.mp4',
    happy: 'p_feliz.mp4',
    sleeping: 'p_durmiendo.mp4',
    eating_meat: 'p_comiendof.mp4',
    eating_kibble: 'p_comiendoc.mp4',
    eating_fish: 'p_comiendop.mp4',
    sick: 'p_enfermo.mp4',
    walking: 'p_paseando.mp4',
    dead: 'fondohab.jpg', // Un fondo estático para cuando muere
};

// --- INICIALIZACIÓN DEL JUEGO ---
window.addEventListener('DOMContentLoaded', async () => {
    precargarRecursos();
    await cargarHeroe();
    await cargarMascotas();
    configurarEventos();
});

// --- LÓGICA DE ESTADO Y ANIMACIONES ---

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    const video = document.getElementById('pet-animation');
    if (video.currentSrc && video.currentSrc.includes(animationMap.sleeping)) {
        cargarEstadoMascota();
    }
    inactivityTimer = setTimeout(() => {
        playAnimation('sleeping');
    }, 15000); // 15 segundos de inactividad
}

function playAnimation(animationType) {
    const video = document.getElementById('pet-animation');
    const fallbackImg = document.getElementById('pet-image');
    const animationFile = animationMap[animationType] || animationMap.idle;

    if (animationType === 'dead') {
        clearTimeout(inactivityTimer);
        video.style.display = 'none';
        fallbackImg.src = `anim/${animationFile}`;
        fallbackImg.style.display = 'block';
        return;
    }

    video.style.display = 'block';
    fallbackImg.style.display = 'none';

    const newSrc = `anim/${animationFile}`;
    if (video.currentSrc.endsWith(newSrc) && !video.paused) {
        return;
    }

    video.src = newSrc;
    video.loop = ['idle', 'sick', 'sleeping', 'happy'].includes(animationType);
    
    video.play().catch(err => {
        console.error(`Error al reproducir ${animationType}:`, err);
    });
}

function getAnimationBasedOnStatus(petStatus) {
    if (!petStatus) return 'idle';
    if (petStatus.hp <= 0) return 'dead';
    if (petStatus.health_status === 'enfermo' || petStatus.health < 30) return 'sick';
    return 'idle';
}

async function runActionSequence({ actionAnimation, postActionAnimation = 'happy', endpoint, body, successMessage }) {
    resetInactivityTimer();
    const video = document.getElementById('pet-animation');
    
    playAnimation(actionAnimation);
    video.loop = false;

    try {
        const response = await fetch(`${API_BASE_URL}/api/game/${endpoint}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'La acción falló');
        }
        
        mostrarMensaje(successMessage, 'success');
        
        video.onended = () => {
            playAnimation(postActionAnimation);
            video.loop = true;
            setTimeout(() => {
                video.onended = null;
                cargarEstadoMascota();
            }, 3000);
        };
    } catch (err) {
        mostrarMensaje(err.message, 'error');
        video.onended = null;
        cargarEstadoMascota();
    }
}

// --- ACCIONES DE MASCOTA ---

function alimentarMascota(foodName) {
    cerrarModal();
    let eatingAnimation = 'eating_kibble';
    if (foodName.toLowerCase().includes('filete')) eatingAnimation = 'eating_meat';
    if (foodName.toLowerCase().includes('pescado')) eatingAnimation = 'eating_fish';

    runActionSequence({
        actionAnimation: eatingAnimation,
        postActionAnimation: 'happy',
        endpoint: 'feed',
        body: { foodName },
        successMessage: `¡A ${mascotas[mascotaActual].name} le encantó!`
    });
}

function accionPasear() {
    runActionSequence({
        actionAnimation: 'walking',
        postActionAnimation: 'happy',
        endpoint: 'walk',
        body: {},
        successMessage: '¡Qué buen paseo!'
    });
}

function revivirMascota() {
    runActionSequence({
        actionAnimation: 'idle',
        postActionAnimation: 'happy',
        endpoint: 'revive',
        body: {},
        successMessage: '¡Tu mascota ha vuelto a la vida!'
    });
}

function darMedicina(treatment) {
    cerrarModal();
     runActionSequence({
        actionAnimation: 'idle',
        postActionAnimation: 'happy',
        endpoint: 'give-medicine',
        body: { treatment },
        successMessage: '¡Tu mascota se siente mejor!'
    });
}

function equiparAccesorio(accessoryName) {
    cerrarModal();
    runActionSequence({
        actionAnimation: 'idle',
        postActionAnimation: 'happy',
        endpoint: 'equip',
        body: { accessoryName },
        successMessage: `¡Tu mascota luce genial con ${accessoryName}!`
    });
}

// --- CARGA DE DATOS Y ESTADO ---

async function cargarEstadoMascota() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/game/status`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (response.ok) {
            const estado = await response.json();
            actualizarBarrasEstado(estado);
            
            const reviveBtn = document.getElementById('revive-btn');
            if (estado.hp <= 0) {
                reviveBtn.classList.remove('hidden');
            } else {
                reviveBtn.classList.add('hidden');
            }
            
            const currentAnimation = getAnimationBasedOnStatus(estado);
            playAnimation(currentAnimation);
            if (estado.hp > 0) {
                resetInactivityTimer();
            }
        }
    } catch (err) {
        console.error('Error cargando estado:', err);
    }
}

async function seleccionarMascota(index) {
    if (index < 0 || index >= mascotas.length) return;
    mascotaActual = index;
    const mascota = mascotas[index];
    document.getElementById('pet-name').textContent = mascota.name;
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

async function cargarMascotas() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/pets`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (!response.ok) throw new Error('No se pudo cargar las mascotas');
        mascotas = await response.json();
        if (mascotas.length === 0) {
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

// --- CONFIGURACIÓN DE EVENTOS ---

function configurarEventos() {
    document.getElementById('feed-btn').addEventListener('click', abrirModalComida);
    document.getElementById('medicine-btn').addEventListener('click', abrirModalMedicina);
    document.getElementById('walk-btn').addEventListener('click', accionPasear);
    document.getElementById('revive-btn').addEventListener('click', revivirMascota);
    document.getElementById('accessories-btn').addEventListener('click', abrirModalAccesorios);

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
    document.getElementById('dashboard-btn').addEventListener('click', () => window.location.href = 'dashboard.html');
    document.getElementById('settings-btn').addEventListener('click', abrirConfiguracionHeroe);
    document.getElementById('add-pet-btn').addEventListener('click', () => window.location.href = 'create-pet.html');
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = 'login.html';
    });
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

// --- FUNCIONES AUXILIARES Y MODALES ---

function precargarRecursos() {
    console.log('Pre-cargando recursos...');
    for (const key in animationMap) {
        if (animationMap[key].endsWith('.mp4')) {
            const video = document.createElement('video');
            video.src = `anim/${animationMap[key]}`;
            video.preload = 'auto';
        } else if (animationMap[key].endsWith('.jpg')) {
             const img = new Image();
             img.src = `anim/${animationMap[key]}`;
        }
    }
}

async function abrirModalComida() {
    resetInactivityTimer();
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
                foodItem.innerHTML = `<span class="item-icon">${food.icon || '🍎'}</span><span class="item-name">${food.name}</span>`;
                foodItem.addEventListener('click', () => alimentarMascota(food.name));
                foodGrid.appendChild(foodItem);
            });
            document.getElementById('food-modal').classList.remove('hidden');
        }
    } catch (err) {
        mostrarMensaje('Error cargando comidas', 'error');
    }
}

async function abrirModalAccesorios() {
    resetInactivityTimer();
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
                accessoryItem.innerHTML = `<span class="item-icon">${accessory.icon || '👑'}</span><span class="item-name">${accessory.name}</span>`;
                accessoryItem.addEventListener('click', () => equiparAccesorio(accessory.name));
                accessoriesGrid.appendChild(accessoryItem);
            });
            document.getElementById('accessories-modal').classList.remove('hidden');
        }
    } catch (err) {
        mostrarMensaje('Error cargando accesorios', 'error');
    }
}

function abrirModalMedicina() {
    resetInactivityTimer();
    document.getElementById('medicine-modal').classList.remove('hidden');
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
        age: parseInt(document.getElementById('hero-age-input').value) || 0,
        city: document.getElementById('hero-city-input').value
    };
    try {
        const response = await fetch(`${API_BASE_URL}/api/heroes/${hero._id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(heroData)
        });
        if (!response.ok) throw new Error('No se pudo actualizar');
        hero = await response.json();
        document.getElementById('hero-name').textContent = hero.name;
        cerrarModal();
        mostrarMensaje('¡Configuración guardada!', 'success');
    } catch (err) {
        mostrarMensaje(err.message, 'error');
    }
}

async function eliminarHeroe() {
    if (!hero || !hero._id) return;
    if (!confirm('¿Estás seguro? Esto eliminará tu avatar y todas tus mascotas.')) return;
    try {
        const response = await fetch(`${API_BASE_URL}/api/heroes/${hero._id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (!response.ok) throw new Error('No se pudo eliminar');
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

function actualizarBarrasEstado(estado) {
    const health = estado.health || 0;
    const happiness = estado.happiness || 0;
    const hunger = estado.hunger || 0;
    
    document.getElementById('health-bar').style.width = `${health}%`;
    document.getElementById('happiness-bar').style.width = `${happiness}%`;
    document.getElementById('hunger-bar').style.width = `${hunger}%`;
    
    document.getElementById('health-text').textContent = `${health}%`;
    document.getElementById('happiness-text').textContent = `${happiness}%`;
    document.getElementById('hunger-text').textContent = `${hunger}%`;
}

function actualizarIndicadorMascota() {
    document.getElementById('current-pet-indicator').textContent = 
        `${mascotaActual + 1} / ${mascotas.length}`;
}

function mostrarMensaje(mensaje, tipo) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.style.backgroundColor = tipo === 'success' ? '#4CAF50' : '#f44336';
    messageDiv.textContent = mensaje;
    document.body.appendChild(messageDiv);
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}