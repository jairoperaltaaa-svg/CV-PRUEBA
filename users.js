// ========== SISTEMA DE USUARIOS CVPro ==========

class SistemaUsuarios {
    constructor() {
        this.usuario = this.cargarUsuario();
        this.cvsGuardados = this.cargarCVs();
    }

    cargarUsuario() {
        return JSON.parse(localStorage.getItem('cvpro_usuario')) || {
            nombre: 'Usuario CVPro',
            email: 'usuario@email.com',
            profesion: '',
            telefono: '',
            ubicacion: '',
            linkedin: '',
            avatar: 'U',
            configuracion: {
                idioma: 'es',
                tema: 'claro',
                notificaciones: {
                    email: true,
                    batallas: true
                }
            },
            estadisticas: {
                cvsCreados: 0,
                analisisCompletados: 0,
                batallasParticipadas: 0
            },
            premium: {
                plan: 'basico',
                fechaExpiracion: null
            }
        };
    }

    cargarCVs() {
        return JSON.parse(localStorage.getItem('cvpro_cvs_guardados')) || [];
    }

    guardarUsuario() {
        localStorage.setItem('cvpro_usuario', JSON.stringify(this.usuario));
    }

    guardarCVs() {
        localStorage.setItem('cvpro_cvs_guardados', JSON.stringify(this.cvsGuardados));
    }

    actualizarPerfil(datos) {
        Object.assign(this.usuario, datos);
        this.guardarUsuario();
        this.actualizarUI();
    }

    actualizarConfiguracion(config) {
        this.usuario.configuracion = { ...this.usuario.configuracion, ...config };
        this.guardarUsuario();
        
        // Aplicar configuración
        this.aplicarConfiguracion();
    }

    aplicarConfiguracion() {
        const config = this.usuario.configuracion;
        
        // Aplicar tema
        if (config.tema === 'oscuro') {
            document.body.classList.add('dark-mode');
        } else if (config.tema === 'claro') {
            document.body.classList.remove('dark-mode');
        }
    }

    guardarCV(cvData) {
        const cv = {
            id: 'cv_' + Date.now(),
            nombre: cvData.nombre || 'CV Sin Título',
            fechaCreacion: new Date().toISOString(),
            fechaModificacion: new Date().toISOString(),
            datos: cvData,
            puntuacion: new CVScorer().calcularScoreTotal()
        };

        this.cvsGuardados.unshift(cv);
        
        // Mantener máximo 20 CVs
        if (this.cvsGuardados.length > 20) {
            this.cvsGuardados = this.cvsGuardados.slice(0, 20);
        }

        this.guardarCVs();
        this.actualizarEstadisticas('cvsCreados');
        
        return cv;
    }

    eliminarCV(cvId) {
        this.cvsGuardados = this.cvsGuardados.filter(cv => cv.id !== cvId);
        this.guardarCVs();
        this.actualizarUI();
    }

    actualizarEstadisticas(tipo) {
        this.usuario.estadisticas[tipo]++;
        this.guardarUsuario();
    }

    actualizarUI() {
        // Actualizar información del perfil
        document.getElementById('user-name').textContent = this.usuario.nombre;
        document.getElementById('user-email').textContent = this.usuario.email;
        document.getElementById('user-avatar').textContent = this.usuario.avatar;

        // Actualizar estadísticas
        document.getElementById('cv-count').textContent = this.usuario.estadisticas.cvsCreados;
        document.getElementById('analysis-count').textContent = this.usuario.estadisticas.analisisCompletados;
        document.getElementById('battle-count').textContent = this.usuario.estadisticas.batallasParticipadas;

        // Actualizar formulario de perfil
        document.getElementById('edit-nombre').value = this.usuario.nombre;
        document.getElementById('edit-profesion').value = this.usuario.profesion || '';
        document.getElementById('edit-email').value = this.usuario.email;
        document.getElementById('edit-telefono').value = this.usuario.telefono || '';
        document.getElementById('edit-ubicacion').value = this.usuario.ubicacion || '';
        document.getElementById('edit-linkedin').value = this.usuario.linkedin || '';

        // Actualizar configuración
        document.getElementById('setting-idioma').value = this.usuario.configuracion.idioma;
        document.getElementById('setting-tema').value = this.usuario.configuracion.tema;
        document.getElementById('notif-email').checked = this.usuario.configuracion.notificaciones.email;
        document.getElementById('notif-batallas').checked = this.usuario.configuracion.notificaciones.batallas;

        // Actualizar estado premium
        this.actualizarUIPremium();

        // Actualizar lista de CVs
        this.actualizarListaCVs();
    }

    actualizarUIPremium() {
        const premiumStatus = document.getElementById('premium-status');
        const currentPlanName = document.getElementById('current-plan-name');
        const currentPlanStatus = document.getElementById('current-plan-status');

        if (this.usuario.premium.plan === 'basico') {
            premiumStatus.innerHTML = `
                <h4>Estado Premium</h4>
                <div class="status-basic">Plan Básico</div>
                <button class="upgrade-btn" onclick="irAPremium()">
                    🚀 Mejorar Plan
                </button>
            `;
            currentPlanName.textContent = 'Básico';
            currentPlanStatus.textContent = 'Gratuito';
        } else {
            premiumStatus.innerHTML = `
                <h4>Estado Premium</h4>
                <div class="status-premium">💎 ${this.usuario.premium.plan.toUpperCase()}</div>
                <div class="premium-date">Válido hasta: ${new Date(this.usuario.premium.fechaExpiracion).toLocaleDateString()}</div>
            `;
            currentPlanName.textContent = this.usuario.premium.plan;
            currentPlanStatus.textContent = 'Activo';
        }
    }

    actualizarListaCVs() {
        const grid = document.getElementById('cvs-grid');
        
        if (this.cvsGuardados.length === 0) {
            grid.innerHTML = `
                <div class="no-cvs">
                    <h3>📝 Aún no tienes CVs guardados</h3>
                    <p>Crea tu primer CV y aparecerá aquí</p>
                    <button class="new-cv-btn" onclick="crearNuevoCV()">
                        ➕ Crear Mi Primer CV
                    </button>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.cvsGuardados.map(cv => `
            <div class="cv-card" data-cv-id="${cv.id}">
                <div class="cv-header">
                    <h4>${cv.nombre}</h4>
                    <div class="cv-score">${cv.puntuacion}%</div>
                </div>
                <div class="cv-info">
                    <div class="cv-date">
                        📅 ${new Date(cv.fechaModificacion).toLocaleDateString()}
                    </div>
                    <div class="cv-stats">
                        <span class="stat">✏️ ${cv.datos.experiencia?.length || 0} exp.</span>
                        <span class="stat">🎓 ${cv.datos.educacion?.length || 0} edu.</span>
                    </div>
                </div>
                <div class="cv-actions">
                    <button class="action-btn primary" onclick="cargarCV('${cv.id}')">
                        📄 Abrir
                    </button>
                    <button class="action-btn" onclick="duplicarCV('${cv.id}')">
                        📋 Duplicar
                    </button>
                    <button class="action-btn danger" onclick="eliminarCV('${cv.id}')">
                        🗑️ Eliminar
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// ========== INTERFAZ USUARIOS ==========

let sistemaUsuarios;

function cargarDatosUsuario() {
    sistemaUsuarios = new SistemaUsuarios();
    sistemaUsuarios.actualizarUI();
    sistemaUsuarios.aplicarConfiguracion();
}

function mostrarSeccion(seccion) {
    // Ocultar todas las secciones
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remover active de todos los botones
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar sección seleccionada
    document.getElementById(`seccion-${seccion}`).classList.add('active');
    event.target.classList.add('active');
}

function guardarPerfil() {
    const datos = {
        nombre: document.getElementById('edit-nombre').value,
        profesion: document.getElementById('edit-profesion').value,
        email: document.getElementById('edit-email').value,
        telefono: document.getElementById('edit-telefono').value,
        ubicacion: document.getElementById('edit-ubicacion').value,
        linkedin: document.getElementById('edit-linkedin').value
    };

    sistemaUsuarios.actualizarPerfil(datos);
    mostrarNotificacion('✅ Perfil actualizado correctamente');
}

function guardarConfiguracion() {
    const config = {
        idioma: document.getElementById('setting-idioma').value,
        tema: document.getElementById('setting-tema').value,
        notificaciones: {
            email: document.getElementById('notif-email').checked,
            batallas: document.getElementById('notif-batallas').checked
        }
    };

    sistemaUsuarios.actualizarConfiguracion(config);
    mostrarNotificacion('✅ Configuración guardada');
}

function cambiarAvatar() {
    const avatares = ['👤', '😊', '🚀', '💼', '🎓', '⚡', '🌟', '💎'];
    const avatarActual = sistemaUsuarios.usuario.avatar;
    const indexActual = avatares.indexOf(avatarActual);
    const nuevoAvatar = avatares[(indexActual + 1) % avatares.length];
    
    sistemaUsuarios.actualizarPerfil({ avatar: nuevoAvatar });
    mostrarNotificacion('✅ Avatar actualizado');
}

function crearNuevoCV() {
    // Redirigir al constructor con CV vacío
    localStorage.removeItem('cvData');
    localStorage.removeItem('experiencias');
    localStorage.removeItem('educacion');
    window.location.href = 'index.html';
}

function cargarCV(cvId) {
    const cv = sistemaUsuarios.cvsGuardados.find(c => c.id === cvId);
    if (cv) {
        // Cargar datos del CV seleccionado
        localStorage.setItem('cvData', JSON.stringify(cv.datos.datos || {}));
        localStorage.setItem('experiencias', JSON.stringify(cv.datos.experiencias || []));
        localStorage.setItem('educacion', JSON.stringify(cv.datos.educacion || []));
        
        // Redirigir al constructor
        window.location.href = 'index.html';
    }
}

function duplicarCV(cvId) {
    const cvOriginal = sistemaUsuarios.cvsGuardados.find(c => c.id === cvId);
    if (cvOriginal) {
        const cvDuplicado = {
            ...cvOriginal,
            id: 'cv_' + Date.now(),
            nombre: `${cvOriginal.nombre} (Copia)`,
            fechaCreacion: new Date().toISOString(),
            fechaModificacion: new Date().toISOString()
        };

        sistemaUsuarios.cvsGuardados.unshift(cvDuplicado);
        sistemaUsuarios.guardarCVs();
        sistemaUsuarios.actualizarUI();
        mostrarNotificacion('✅ CV duplicado correctamente');
    }
}

function eliminarCV(cvId) {
    if (confirm('¿Estás seguro de que quieres eliminar este CV? Esta acción no se puede deshacer.')) {
        sistemaUsuarios.eliminarCV(cvId);
        mostrarNotificacion('✅ CV eliminado');
    }
}

function cambiarContrasena() {
    // En una implementación real, esto conectaría con un backend
    mostrarNotificacion('📧 Se ha enviado un enlace para cambiar tu contraseña a tu email');
}

function eliminarCuenta() {
    if (confirm('¿ESTÁS ABSOLUTAMENTE SEGURO? Esta acción eliminará permanentemente tu cuenta y todos tus datos. No se puede deshacer.')) {
        if (confirm('ÚLTIMA OPORTUNIDAD: ¿Realmente quieres eliminar tu cuenta?')) {
            // Eliminar todos los datos del usuario
            localStorage.removeItem('cvpro_usuario');
            localStorage.removeItem('cvpro_cvs_guardados');
            localStorage.removeItem('cvData');
            localStorage.removeItem('experiencias');
            localStorage.removeItem('educacion');
            localStorage.removeItem('cvConfig');
            
            mostrarNotificacion('👋 Tu cuenta ha sido eliminada. ¡Esperamos verte de nuevo!');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    }
}

function irAPremium() {
    window.location.href = 'premium.html';
}

function mostrarNotificacion(mensaje) {
    // Implementación simple de notificación
    alert(mensaje);
}

// CSS adicional para users
const usersCSS = `
.users-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    color: white;
}

.profile-section {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 30px;
    margin-bottom: 30px;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.profile-header {
    display: flex;
    align-items: center;
    gap: 30px;
}

.profile-avatar {
    position: relative;
}

.avatar-placeholder {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea, #764ba2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2em;
    font-weight: bold;
    color: white;
}

.edit-avatar-btn {
    position: absolute;
    bottom: 5px;
    right: 5px;
    background: #FFD700;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    cursor: pointer;
}

.profile-stats {
    display: flex;
    gap: 30px;
    margin-top: 15px;
}

.profile-stat {
    text-align: center;
}

.stat-number {
    display: block;
    font-size: 1.5em;
    font-weight: bold;
    color: #FFD700;
}

.users-content {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 30px;
}

.users-sidebar {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.sidebar-nav {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-item {
    width: 100%;
    padding: 15px;
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    text-align: left;
    cursor: pointer;
    border-radius: 8px;
    margin-bottom: 8px;
    transition: all 0.3s ease;
}

.nav-item:hover, .nav-item.active {
    background: rgba(255, 255, 255, 0.1);
    color: white;
}

.sidebar-premium {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.premium-status h4 {
    margin-bottom: 15px;
    color: #FFD700;
}

.status-basic, .status-premium {
    padding: 8px 15px;
    border-radius: 20px;
    text-align: center;
    font-weight: 600;
    margin-bottom: 15px;
}

.status-basic {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);
}

.status-premium {
    background: linear-gradient(135deg, #FFD700, #FFA500);
    color: #333;
}

.upgrade-btn {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
}

.users-main {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 30px;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.content-section {
    display: none;
}

.content-section.active {
    display: block;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.save-btn {
    padding: 15px 30px;
    background: linear-gradient(135deg, #10B981, #059669);
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    margin-top: 20px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.new-cv-btn {
    padding: 12px 20px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
}

.cvs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}

.cv-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
}

.cv-card:hover {
    transform: translateY(-3px);
    background: rgba(255, 255, 255, 0.1);
}

.cv-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 15px;
}

.cv-score {
    background: #10B981;
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8em;
    font-weight: 600;
}

.cv-actions {
    display: flex;
    gap: 8px;
    margin-top: 15px;
}

.action-btn {
    flex: 1;
    padding: 8px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.8em;
    transition: all 0.3s ease;
}

.action-btn.primary {
    background: #667eea;
    color: white;
}

.action-btn.danger {
    background: #EF4444;
    color: white;
}

.settings-grid {
    display: grid;
    gap: 25px;
    margin-bottom: 30px;
}

.setting-group h4 {
    margin-bottom: 15px;
    color: #FFD700;
}

.setting-group select {
    width: 100%;
    padding: 12px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: white;
}

.switch {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
}

.security-actions {
    display: grid;
    gap: 25px;
}

.security-item {
    background: rgba(255, 255, 255, 0.05);
    padding: 20px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.security-btn, .delete-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    margin-top: 10px;
}

.security-btn {
    background: #667eea;
    color: white;
}

.delete-btn {
    background: #EF4444;
    color: white;
}

.verified-badge {
    background: #10B981;
    color: white;
    padding: 6px 12px;
    border-radius: 12px;
    font-size: 0.8em;
    font-weight: 600;
    display: inline-block;
    margin-top: 10px;
}

.upgrade-btn-large {
    padding: 15px 30px;
    background: linear-gradient(135deg, #FFD700, #FFA500);
    color: #333;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: bold;
    font-size: 1.1em;
    margin-top: 20px;
}

@media (max-width: 768px) {
    .users-content {
        grid-template-columns: 1fr;
    }
    .form-row {
        grid-template-columns: 1fr;
    }
    .profile-header {
        flex-direction: column;
        text-align: center;
    }
    .profile-stats {
        justify-content: center;
    }
}
`;

// Agregar CSS al documento
const style = document.createElement('style');
style.textContent = usersCSS;
document.head.appendChild(style);