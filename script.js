// Configuración de partículas ORIGINAL
particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff']
        },
        shape: {
            type: 'circle',
            stroke: {
                width: 0,
                color: '#000000'
            }
        },
        opacity: {
            value: 0.5,
            random: true,
            anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: true,
                speed: 2,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.2,
            width: 1
        },
        move: {
            enable: true,
            speed: 1,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'repulse'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 400,
                line_linked: {
                    opacity: 1
                }
            },
            bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity: 8,
                speed: 3
            },
            repulse: {
                distance: 100,
                duration: 0.4
            },
            push: {
                particles_nb: 4
            },
            remove: {
                particles_nb: 2
            }
        }
    },
    retina_detect: true
});

// Efecto de cambio de color gradual del fondo ORIGINAL
let hue = 0;
function updateBackground() {
    hue = (hue + 0.5) % 360;
    const gradient = `linear-gradient(135deg, hsl(${hue}, 70%, 60%) 0%, hsl(${hue + 60}, 70%, 50%) 100%)`;
    document.getElementById('particles-js').style.background = gradient;
}

setInterval(updateBackground, 100);

// Efectos de scroll suave ORIGINAL
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Función para scroll al constructor
function scrollToConstructor() {
    document.getElementById('constructor').scrollIntoView({
        behavior: 'smooth'
    });
}

// Efecto parallax en las tarjetas ORIGINAL
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.card-3d');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateY = (x - centerX) / 25;
        const rotateX = (centerY - y) / 25;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
});

// Sistema de Constructor de CV (SIMPLIFICADO)
class CVConstructor {
    constructor() {
        this.currentTemplate = 'profesional';
        this.cvData = {
            personal: {
                name: '',
                profession: '',
                email: '',
                phone: ''
            },
            experience: []
        };
        this.init();
    }

    init() {
        this.bindEvents();
        this.updatePreview();
    }

    bindEvents() {
        // Selector de plantillas
        document.querySelectorAll('.template-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectTemplate(e.currentTarget.dataset.template);
            });
        });

        // Campos de información personal
        document.getElementById('fullName').addEventListener('input', (e) => {
            this.cvData.personal.name = e.target.value;
            this.updatePreview();
        });
        document.getElementById('profession').addEventListener('input', (e) => {
            this.cvData.personal.profession = e.target.value;
            this.updatePreview();
        });

        // Botones agregar
        document.querySelectorAll('.add-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.addDynamicItem(section);
            });
        });

        // Botones de acción
        document.getElementById('saveTemplate').addEventListener('click', () => this.saveTemplate());
        document.getElementById('newTemplate').addEventListener('click', () => this.newTemplate());
        document.getElementById('exportPdf').addEventListener('click', () => this.exportPDF());
    }

    selectTemplate(template) {
        this.currentTemplate = template;
        document.querySelectorAll('.template-option').forEach(opt => opt.classList.remove('active'));
        document.querySelector(`[data-template="${template}"]`).classList.add('active');
        this.updatePreview();
    }

    addDynamicItem(section) {
        const container = document.getElementById(`${section}-container`);
        const itemId = Date.now();
        
        const itemHTML = `
            <div class="dynamic-item" data-id="${itemId}">
                <input type="text" placeholder="Puesto de trabajo" oninput="cvBuilder.updateExperience(${itemId}, 'position', this.value)">
                <input type="text" placeholder="Empresa" oninput="cvBuilder.updateExperience(${itemId}, 'company', this.value)">
                <input type="text" placeholder="Fecha" oninput="cvBuilder.updateExperience(${itemId}, 'date', this.value)">
                <button type="button" class="remove-btn" onclick="cvBuilder.removeExperience(${itemId})">✕ Eliminar</button>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', itemHTML);
        this.cvData.experience.push({ id: itemId, position: '', company: '', date: '' });
        this.updatePreview();
    }

    updateExperience(id, field, value) {
        const exp = this.cvData.experience.find(item => item.id === id);
        if (exp) {
            exp[field] = value;
            this.updatePreview();
        }
    }

    removeExperience(id) {
        this.cvData.experience = this.cvData.experience.filter(item => item.id !== id);
        document.querySelector(`[data-id="${id}"]`).remove();
        this.updatePreview();
    }

    updatePreview() {
        const preview = document.getElementById('cvPreview');
        preview.innerHTML = `
            <div class="cv-header">
                <h2>${this.cvData.personal.name || 'Tu Nombre'}</h2>
                <p>${this.cvData.personal.profession || 'Tu Profesión'}</p>
            </div>
            <div class="cv-section">
                <h3>Experiencia</h3>
                ${this.cvData.experience.length > 0 ? 
                    this.cvData.experience.map(exp => `
                        <div class="exp-item">
                            <strong>${exp.position}</strong> at ${exp.company} 
                            <em>${exp.date}</em>
                        </div>
                    `).join('') : 
                    '<p>Agrega tu experiencia laboral</p>'
                }
            </div>
        `;

        // Actualizar mini preview
        this.updateMiniPreview();
    }

    updateMiniPreview() {
        const miniPreview = document.getElementById('miniPreview');
        miniPreview.innerHTML = `
            <div style="font-size: 8px; line-height: 1.2;">
                <strong>${this.cvData.personal.name || 'Nombre'}</strong><br>
                <em>${this.cvData.personal.profession || 'Profesión'}</em>
            </div>
        `;
    }

    saveTemplate() {
        localStorage.setItem('cvTemplate', JSON.stringify(this.cvData));
        alert('✅ Plantilla guardada!');
    }

    newTemplate() {
        if (confirm('¿Crear nueva plantilla?')) {
            this.cvData = {
                personal: { name: '', profession: '', email: '', phone: '' },
                experience: []
            };
            document.getElementById('experience-container').innerHTML = '';
            document.getElementById('fullName').value = '';
            document.getElementById('profession').value = '';
            this.updatePreview();
        }
    }

    exportPDF() {
        alert('📄 Exportando PDF...');
    }
}

// Sistema de Modo Nocturno (SIMPLIFICADO)
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        document.getElementById('themeBtn').addEventListener('click', () => this.toggleTheme());
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme(theme) {
        document.body.className = `${theme}-mode`;
        document.getElementById('themeBtn').textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

// Inicializar cuando cargue la página
document.addEventListener('DOMContentLoaded', function() {
    window.cvBuilder = new CVConstructor();
    window.themeManager = new ThemeManager();
});