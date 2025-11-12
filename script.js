// script.js - Sistema principal con partículas MUY VISIBLES

class CVCreator {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.initializeParticles();
        this.initializeEventListeners();
        this.loadSavedData();
    }

    // SISTEMA DE PARTÍCULAS MUY VISIBLES
    initializeParticles() {
        this.canvas = document.getElementById('particlesCanvas');
        if (!this.canvas) {
            console.log('Canvas no encontrado');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        this.createParticles();
        this.animateParticles();
        
        // Seguimiento del mouse
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
        });
    }

    resizeCanvas() {
        if (!this.canvas) return;
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createParticles();
    }

    createParticles() {
        this.particles = [];
        // MÁS PARTÍCULAS - MÁS GRANDES - MÁS VISIBLES
        const particleCount = window.innerWidth < 768 ? 100 : 200;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 5 + 3, // Más grandes
                speedX: (Math.random() - 0.5) * 2,
                speedY: (Math.random() - 0.5) * 2,
                color: this.getParticleColor(),
                originalColor: this.getParticleColor()
            });
        }
    }

    getParticleColor() {
        const colorsLight = [
            'rgba(59, 130, 246, 0.8)',    // Azul brillante
            'rgba(139, 92, 246, 0.8)',    // Violeta
            'rgba(239, 68, 68, 0.8)',     // Rojo
            'rgba(16, 185, 129, 0.8)',    // Verde
            'rgba(245, 158, 11, 0.8)'     // Naranja
        ];
        
        const colorsDark = [
            'rgba(96, 165, 250, 0.9)',    // Azul neón
            'rgba(167, 139, 250, 0.9)',   // Violeta neón
            'rgba(248, 113, 113, 0.9)',   // Rojo neón
            'rgba(52, 211, 153, 0.9)',    // Verde neón
            'rgba(251, 191, 36, 0.9)'     // Amarillo neón
        ];
        
        const colors = this.currentTheme === 'dark' ? colorsDark : colorsLight;
        return colors[Math.floor(Math.random() * colors.length)];
    }

    animateParticles() {
        if (!this.canvas || !this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Actualizar posición
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Rebote en bordes
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.speedX *= -1;
                particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.speedY *= -1;
                particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            }
            
            // Interacción con mouse - MÁS FUERTE
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 200) {
                const force = 0.03;
                const angle = Math.atan2(dy, dx);
                
                particle.speedX += Math.cos(angle) * force;
                particle.speedY += Math.sin(angle) * force;
                
                // Limitar velocidad
                const speed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
                const maxSpeed = 4;
                if (speed > maxSpeed) {
                    particle.speedX = (particle.speedX / speed) * maxSpeed;
                    particle.speedY = (particle.speedY / speed) * maxSpeed;
                }
                
                // Cambiar color cerca del mouse
                particle.color = this.currentTheme === 'dark' 
                    ? 'rgba(255, 255, 255, 0.9)'
                    : 'rgba(0, 0, 0, 0.8)';
            } else {
                particle.color = particle.originalColor;
            }
            
            // Dibujar partícula
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
            
            // Sombras para más visibilidad
            this.ctx.shadowColor = particle.color;
            this.ctx.shadowBlur = 15;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
            
            // Conectar partículas cercanas
            this.particles.forEach(otherParticle => {
                if (particle === otherParticle) return;
                
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    this.ctx.beginPath();
                    const opacity = 0.4 * (1 - distance/150);
                    this.ctx.strokeStyle = this.currentTheme === 'dark' 
                        ? `rgba(255, 255, 255, ${opacity})`
                        : `rgba(0, 0, 0, ${opacity})`;
                    this.ctx.lineWidth = 2;
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(() => this.animateParticles());
    }

    // Sistema de Temas
    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateThemeButton();
        this.updateParticlesColor();
        this.updateFooterColors();
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    updateThemeButton() {
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) {
            const icon = themeBtn.querySelector('i');
            icon.className = this.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    updateParticlesColor() {
        this.particles.forEach(particle => {
            particle.originalColor = this.getParticleColor();
            particle.color = particle.originalColor;
        });
    }

    updateFooterColors() {
        // Los colores se manejan mediante CSS variables
        console.log('Tema actualizado:', this.currentTheme);
    }

    // Cargar datos guardados
    loadSavedData() {
        const savedData = localStorage.getItem('cvData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                if (window.cvEditor) {
                    setTimeout(() => {
                        window.cvEditor.loadData(data);
                    }, 100);
                }
            } catch (e) {
                console.log('No hay datos previos guardados');
            }
        }
    }

    // Event Listeners principales
    initializeEventListeners() {
        // Toggle de tema
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => this.toggleTheme());
        }

        // Toggle panel IA
        const toggleAI = document.getElementById('toggleAI');
        const closeAI = document.getElementById('closeAI');
        const aiPanel = document.getElementById('aiPanel');

        if (toggleAI && aiPanel) {
            toggleAI.addEventListener('click', () => {
                aiPanel.classList.toggle('active');
            });
        }

        if (closeAI && aiPanel) {
            closeAI.addEventListener('click', () => {
                aiPanel.classList.remove('active');
            });
        }

        // Selector de colores del footer - PARA EL NOMBRE JAIRO
        const colorOptions = document.querySelectorAll('.color-option');
        colorOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const color = e.target.dataset.color;
                this.changeFooterColor(color);
                
                // Actualizar estado activo
                colorOptions.forEach(opt => opt.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Efecto de scroll en header
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if (!header) return;
            
            if (window.scrollY > 10) {
                header.style.background = this.currentTheme === 'light' 
                    ? 'rgba(255, 255, 255, 0.98)' 
                    : 'rgba(15, 23, 42, 0.98)';
            } else {
                header.style.background = this.currentTheme === 'light' 
                    ? 'rgba(255, 255, 255, 0.95)' 
                    : 'rgba(15, 23, 42, 0.95)';
            }
        });
    }

    changeFooterColor(color) {
        const root = document.documentElement;
        const colors = {
            blue: { heart: '#ef4444', name: '#3b82f6' },
            purple: { heart: '#ef4444', name: '#8b5cf6' },
            green: { heart: '#ef4444', name: '#10b981' },
            red: { heart: '#ef4444', name: '#ef4444' },
            orange: { heart: '#ef4444', name: '#f59e0b' }
        };

        if (colors[color]) {
            root.style.setProperty('--footer-heart', colors[color].heart);
            root.style.setProperty('--footer-name', colors[color].name);
            
            this.showNotification(`Color cambiado a ${color}`, 'success');
        }
    }

    // Notificaciones
    showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Estilos para la notificación
        Object.assign(notification.style, {
            position: 'fixed',
            top: '90px',
            right: '20px',
            padding: '1rem 1.5rem',
            background: type === 'success' ? '#10b981' : 
                       type === 'error' ? '#ef4444' : 
                       type === 'warning' ? '#f59e0b' : '#3b82f6',
            color: 'white',
            borderRadius: '8px',
            zIndex: '10000',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            transform: 'translateX(400px)',
            transition: 'transform 0.3s ease',
            fontSize: '0.9rem',
            fontWeight: '500'
        });

        document.body.appendChild(notification);

        // Animación de entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto-remover después de 4 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.cvApp = new CVCreator();
    console.log('CV Creator Pro inicializado');
});