// cv-templates.js - Sistema de plantillas y modelos

class CVTemplates {
    constructor() {
        this.templates = {
            modern: {
                name: "Moderno",
                description: "Diseño limpio y contemporáneo",
                styles: {
                    primaryColor: "#3b82f6",
                    secondaryColor: "#1e40af",
                    fontFamily: "'Inter', sans-serif"
                }
            },
            professional: {
                name: "Profesional",
                description: "Estilo corporativo y formal", 
                styles: {
                    primaryColor: "#1e293b",
                    secondaryColor: "#475569",
                    fontFamily: "'Georgia', serif"
                }
            },
            creative: {
                name: "Creativo", 
                description: "Diseño innovador y visual",
                styles: {
                    primaryColor: "#8b5cf6",
                    secondaryColor: "#7c3aed", 
                    fontFamily: "'Poppins', sans-serif"
                }
            },
            minimal: {
                name: "Minimalista",
                description: "Diseño simple y elegante",
                styles: {
                    primaryColor: "#64748b",
                    secondaryColor: "#475569",
                    fontFamily: "'Helvetica Neue', sans-serif"
                }
            }
        };
        
        this.init();
    }

    init() {
        this.applyTemplate('modern');
    }

    applyTemplate(templateName) {
        if (!this.templates[templateName]) {
            console.error(`Plantilla ${templateName} no encontrada`);
            return;
        }

        const template = this.templates[templateName];
        const root = document.documentElement;
        
        // Aplicar variables CSS
        root.style.setProperty('--primary-color', template.styles.primaryColor);
        root.style.setProperty('--secondary-color', template.styles.secondaryColor);
        
        // Aplicar a vista previa
        this.updatePreviewStyles(templateName);
    }

    updatePreviewStyles(templateName) {
        const cvPreview = document.getElementById('cvPreview');
        if (!cvPreview) return;

        // Remover todas las clases de plantilla
        cvPreview.className = 'cv-preview ' + templateName + '-template';
    }

    getTemplateStyles(templateName) {
        return this.templates[templateName]?.styles || this.templates.modern.styles;
    }

    getAllTemplates() {
        return this.templates;
    }
}

// Inicializar sistema de plantillas
document.addEventListener('DOMContentLoaded', () => {
    window.cvTemplates = new CVTemplates();
});