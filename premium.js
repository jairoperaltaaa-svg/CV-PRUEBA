// ========== SISTEMA PREMIUM CVPro ==========

class SistemaPremium {
    constructor() {
        this.planes = {
            basico: {
                nombre: 'Básico',
                precio: 0,
                caracteristicas: [
                    'Constructor de CV básico',
                    '3 plantillas estándar',
                    'Análisis de scoring básico',
                    'Guardado local'
                ]
            },
            profesional: {
                nombre: 'Profesional',
                precio: 9,
                caracteristicas: [
                    'Todas las funciones Básico',
                    '+5 plantillas premium',
                    'Análisis IA completo',
                    'Modo Batalla premium',
                    'Exportación PDF avanzada',
                    'Soporte prioritario'
                ],
                trial: true
            },
            empresa: {
                nombre: 'Empresa',
                precio: 29,
                caracteristicas: [
                    'Todas las funciones Profesional',
                    'Hasta 5 usuarios',
                    'Panel de administración',
                    'Soporte prioritario 24/7',
                    'Análisis de candidatos',
                    'Branding personalizado'
                ]
            }
        };
        
        this.estadoUsuario = this.cargarEstadoUsuario();
    }

    cargarEstadoUsuario() {
        return JSON.parse(localStorage.getItem('premium_status')) || {
            plan: 'basico',
            fechaSuscripcion: null,
            fechaExpiracion: null,
            trialActivo: false,
            caracteristicasActivas: this.obtenerCaracteristicasPorPlan('basico')
        };
    }

    obtenerCaracteristicasPorPlan(plan) {
        const caracteristicas = {
            basico: [
                'cv_constructor_basic',
                'templates_basic',
                'scoring_basic',
                'local_storage'
            ],
            profesional: [
                'cv_constructor_basic',
                'templates_basic',
                'templates_premium',
                'scoring_basic',
                'scoring_advanced',
                'ia_analysis',
                'batalla_premium',
                'pdf_export_advanced',
                'priority_support'
            ],
            empresa: [
                'cv_constructor_basic',
                'templates_basic',
                'templates_premium',
                'scoring_basic',
                'scoring_advanced',
                'ia_analysis',
                'batalla_premium',
                'pdf_export_advanced',
                'priority_support_24_7',
                'multi_user',
                'admin_panel',
                'candidate_analysis',
                'custom_branding'
            ]
        };
        
        return caracteristicas[plan] || caracteristicas.basico;
    }

    verificarAcceso(caracteristica) {
        return this.estadoUsuario.caracteristicasActivas.includes(caracteristica);
    }

    async activarPlan(plan, datosPago = null) {
        try {
            // Simular procesamiento de pago
            if (plan !== 'basico' && datosPago) {
                const exito = await this.procesarPago(plan, datosPago);
                if (!exito) {
                    throw new Error('Error en el procesamiento del pago');
                }
            }

            // Actualizar estado del usuario
            this.estadoUsuario.plan = plan;
            this.estadoUsuario.fechaSuscripcion = new Date().toISOString();
            
            if (plan === 'profesional' && this.planes.profesional.trial) {
                this.estadoUsuario.trialActivo = true;
                const fechaExpiracion = new Date();
                fechaExpiracion.setDate(fechaExpiracion.getDate() + 14);
                this.estadoUsuario.fechaExpiracion = fechaExpiracion.toISOString();
            } else {
                const fechaExpiracion = new Date();
                fechaExpiracion.setMonth(fechaExpiracion.getMonth() + 1);
                this.estadoUsuario.fechaExpiracion = fechaExpiracion.toISOString();
            }

            this.estadoUsuario.caracteristicasActivas = this.obtenerCaracteristicasPorPlan(plan);
            
            // Guardar estado
            this.guardarEstadoUsuario();
            
            // Mostrar confirmación
            this.mostrarConfirmacionActivacion(plan);
            
            return true;
            
        } catch (error) {
            console.error('Error activando plan:', error);
            this.mostrarErrorActivacion(error.message);
            return false;
        }
    }

    async procesarPago(plan, datosPago) {
        // Simular procesamiento de pago
        return new Promise((resolve) => {
            setTimeout(() => {
                // En una implementación real, aquí se conectaría con Stripe, PayPal, etc.
                console.log('Procesando pago para plan:', plan, datosPago);
                resolve(true);
            }, 2000);
        });
    }

    guardarEstadoUsuario() {
        localStorage.setItem('premium_status', JSON.stringify(this.estadoUsuario));
    }

    mostrarConfirmacionActivacion(plan) {
        const mensajes = {
            profesional: '🎉 ¡Plan Profesional activado! Disfruta de tu prueba gratuita de 14 días.',
            empresa: '🏢 ¡Plan Empresa activado! Bienvenido al poder premium para equipos.'
        };
        
        this.mostrarNotificacion(mensajes[plan] || 'Plan activado correctamente');
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }

    mostrarErrorActivacion(mensaje) {
        this.mostrarNotificacion('❌ ' + (mensaje || 'Error al activar el plan'), 'error');
    }

    mostrarNotificacion(mensaje, tipo = 'success') {
        // Implementación simple de notificación
        alert(mensaje);
    }

    obtenerInfoPlan() {
        const plan = this.estadoUsuario.plan;
        const info = {
            ...this.planes[plan],
            fechaExpiracion: this.estadoUsuario.fechaExpiracion,
            trialActivo: this.estadoUsuario.trialActivo,
            diasRestantes: this.calcularDiasRestantes()
        };
        
        return info;
    }

    calcularDiasRestantes() {
        if (!this.estadoUsuario.fechaExpiracion) return null;
        
        const ahora = new Date();
        const expiracion = new Date(this.estadoUsuario.fechaExpiracion);
        const diferencia = expiracion - ahora;
        
        return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    }

    verificarExpiracion() {
        if (this.estadoUsuario.plan === 'basico') return;
        
        const diasRestantes = this.calcularDiasRestantes();
        
        if (diasRestantes <= 0) {
            // Plan expirado, revertir a básico
            this.revertirABasico();
        } else if (diasRestantes <= 3) {
            // Mostrar advertencia de expiración próxima
            this.mostrarAdvertenciaExpiracion(diasRestantes);
        }
    }

    revertirABasico() {
        this.estadoUsuario.plan = 'basico';
        this.estadoUsuario.fechaSuscripcion = null;
        this.estadoUsuario.fechaExpiracion = null;
        this.estadoUsuario.trialActivo = false;
        this.estadoUsuario.caracteristicasActivas = this.obtenerCaracteristicasPorPlan('basico');
        
        this.guardarEstadoUsuario();
        this.mostrarNotificacion('Tu plan premium ha expirado. Se ha revertido al plan básico.');
    }

    mostrarAdvertenciaExpiracion(dias) {
        const mensaje = `⚠️ Tu plan premium expira en ${dias} día${dias > 1 ? 's' : ''}. Renueva para mantener todas las funciones.`;
        this.mostrarNotificacion(mensaje, 'warning');
    }
}

// ========== INTERFAZ PREMIUM ==========

let sistemaPremium;

function inicializarSistemaPremium() {
    sistemaPremium = new SistemaPremium();
}

function verificarEstadoPremium() {
    if (!sistemaPremium) inicializarSistemaPremium();
    
    sistemaPremium.verificarExpiracion();
    actualizarUIEstadoPremium();
}

function actualizarUIEstadoPremium() {
    const estado = sistemaPremium.estadoUsuario;
    const elementosPremium = document.querySelectorAll('[data-premium]');
    
    elementosPremium.forEach(elemento => {
        const caracteristica = elemento.getAttribute('data-premium');
        const tieneAcceso = sistemaPremium.verificarAcceso(caracteristica);
        
        if (!tieneAcceso) {
            elemento.style.opacity = '0.6';
            elemento.style.pointerEvents = 'none';
            elemento.title = 'Función premium - Actualiza tu plan para acceder';
        }
    });
    
    // Actualizar badges de estado premium
    const premiumBadges = document.querySelectorAll('.premium-badge, .premium-indicator');
    premiumBadges.forEach(badge => {
        if (estado.plan !== 'basico') {
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    });
}

function seleccionarPlan(plan) {
    if (plan === 'basico') {
        mostrarNotificacion('Ya estás en el plan básico');
        return;
    }
    
    if (plan === 'empresa') {
        // Redirigir a contacto para planes empresariales
        window.location.href = 'mailto:empresas@cvpro.com?subject=Solicitud Plan Empresa';
        return;
    }
    
    // Mostrar modal de suscripción para plan profesional
    mostrarModalSuscripcion(plan);
}

function mostrarModalSuscripcion(plan) {
    const modal = document.getElementById('subscription-modal');
    const planInfo = sistemaPremium.planes[plan];
    
    // Actualizar contenido del modal
    document.getElementById('modal-plan-title').textContent = `Activar Plan ${planInfo.nombre}`;
    document.getElementById('modal-plan-description').textContent = 
        plan === 'profesional' ? 'Comienza tu prueba gratuita de 14 días' : 'Activar suscripción mensual';
    
    // Mostrar modal
    modal.style.display = 'block';
}

function cerrarModalSuscripcion() {
    document.getElementById('subscription-modal').style.display = 'none';
}

function procesarSuscripcion() {
    const plan = 'profesional'; // Por defecto para el modal actual
    
    // Validar formulario
    const email = document.getElementById('user-email').value;
    const cardNumber = document.getElementById('card-number').value;
    const cardExpiry = document.getElementById('card-expiry').value;
    const cardCVC = document.getElementById('card-cvc').value;
    const userName = document.getElementById('user-name').value;
    
    if (!email || !cardNumber || !cardExpiry || !cardCVC || !userName) {
        mostrarNotificacion('Por favor, completa todos los campos requeridos', 'error');
        return;
    }
    
    // Simular datos de pago
    const datosPago = {
        email: email,
        cardNumber: cardNumber.replace(/\s/g, ''),
        cardExpiry: cardExpiry,
        cardCVC: cardCVC,
        userName: userName
    };
    
    // Mostrar estado de procesamiento
    const boton = document.querySelector('.subscribe-btn');
    const textoOriginal = boton.textContent;
    boton.textContent = '⏳ Procesando...';
    boton.disabled = true;
    
    // Activar plan
    sistemaPremium.activarPlan(plan, datosPago).then(exito => {
        if (exito) {
            cerrarModalSuscripcion();
        } else {
            boton.textContent = textoOriginal;
            boton.disabled = false;
        }
    });
}

function toggleFAQ(element) {
    const faqItem = element.parentElement;
    faqItem.classList.toggle('active');
}

function scrollToPlans() {
    document.querySelector('.plans-section').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Funciones de utilidad para características premium
function verificarCaracteristicaPremium(caracteristica) {
    if (!sistemaPremium) inicializarSistemaPremium();
    return sistemaPremium.verificarAcceso(caracteristica);
}

function mostrarModalPremium(caracteristica) {
    const modalHTML = `
        <div class="modal">
            <div class="modal-content premium-feature-modal">
                <span class="close-modal" onclick="cerrarModalPremium()">&times;</span>
                <div class="premium-modal-header">
                    <div class="premium-icon">💎</div>
                    <h2>Función Premium</h2>
                </div>
                <div class="premium-modal-content">
                    <p>Esta característica está disponible exclusivamente para usuarios premium.</p>
                    <p>Desbloquea todo el potencial de CVPro con nuestro plan Profesional.</p>
                    
                    <div class="premium-benefits">
                        <div class="benefit-item">
                            <span class="benefit-icon">🎨</span>
                            <span>+5 plantillas premium</span>
                        </div>
                        <div class="benefit-item">
                            <span class="benefit-icon">🤖</span>
                            <span>Análisis IA completo</span>
                        </div>
                        <div class="benefit-item">
                            <span class="benefit-icon">⚔️</span>
                            <span>Modo Batalla ilimitado</span>
                        </div>
                    </div>
                </div>
                <div class="premium-modal-actions">
                    <button class="btn-premium-primary" onclick="irAPremium()">
                        💎 Ver Planes Premium
                    </button>
                    <button class="btn-premium-secondary" onclick="cerrarModalPremium()">
                        Quizás más tarde
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Remover modal existente
    const modalExistente = document.querySelector('.premium-feature-modal');
    if (modalExistente) modalExistente.remove();
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function cerrarModalPremium() {
    const modal = document.querySelector('.premium-feature-modal');
    if (modal) modal.parentElement.remove();
}

function irAPremium() {
    window.location.href = 'premium.html';
}

// Inicializar cuando cargue la página
document.addEventListener('DOMContentLoaded', function() {
    inicializarSistemaPremium();
    verificarEstadoPremium();
});

// Manejar clics en elementos premium
document.addEventListener('click', function(e) {
    const elemento = e.target.closest('[data-premium]');
    if (elemento) {
        const caracteristica = elemento.getAttribute('data-premium');
        if (!verificarCaracteristicaPremium(caracteristica)) {
            e.preventDefault();
            e.stopPropagation();
            mostrarModalPremium(caracteristica);
        }
    }
});

// CSS adicional para modal premium
const premiumModalCSS = `
.premium-feature-modal {
    background: linear-gradient(135deg, #2D3748 0%, #4A5568 100%);
    max-width: 500px;
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 15px;
}

.premium-modal-header {
    text-align: center;
    padding: 30px 30px 20px;
}

.premium-icon {
    font-size: 4em;
    margin-bottom: 15px;
}

.premium-modal-header h2 {
    margin-bottom: 10px;
    color: #FFD700;
}

.premium-modal-content {
    padding: 0 30px 20px;
    text-align: center;
}

.premium-modal-content p {
    margin-bottom: 15px;
    opacity: 0.9;
    line-height: 1.5;
}

.premium-benefits {
    margin: 25px 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.benefit-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 15px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
}

.benefit-icon {
    font-size: 1.2em;
}

.premium-modal-actions {
    padding: 20px 30px 30px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.btn-premium-primary, .btn-premium-secondary {
    padding: 15px;
    border: none;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-premium-primary {
    background: linear-gradient(135deg, #FFD700, #FFA500);
    color: #333;
}

.btn-premium-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 215, 0, 0.3);
}

.btn-premium-secondary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-premium-secondary:hover {
    background: rgba(255, 255, 255, 0.2);
}
`;

// Agregar CSS al documento
const style = document.createElement('style');
style.textContent = premiumModalCSS;
document.head.appendChild(style);