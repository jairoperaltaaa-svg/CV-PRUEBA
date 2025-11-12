// cv-save.js - Sistema de guardado y exportación

class CVSave {
    constructor() {
        this.exportFormats = {
            pdf: 'application/pdf',
            png: 'image/png',
            json: 'application/json'
        };
        this.init();
    }

    init() {
        this.initializeExportEvents();
        this.setupAutoSave();
    }

    initializeExportEvents() {
        // Exportar a PDF
        const exportPDF = document.getElementById('exportPDF');
        if (exportPDF) {
            exportPDF.addEventListener('click', () => {
                this.exportToPDF();
            });
        }

        // Exportar a Imagen
        const exportImage = document.getElementById('exportImage');
        if (exportImage) {
            exportImage.addEventListener('click', () => {
                this.exportToImage();
            });
        }

        // Guardar CV
        const saveCV = document.getElementById('saveCV');
        if (saveCV) {
            saveCV.addEventListener('click', () => {
                this.saveToLocalStorage();
            });
        }
    }

    setupAutoSave() {
        // Auto-guardar cada 2 minutos
        setInterval(() => {
            this.saveToLocalStorage();
        }, 120000);
    }

    async exportToPDF() {
        if (window.cvApp) {
            window.cvApp.showNotification('🔄 Generando PDF...', 'info');
        }

        try {
            // Simular generación de PDF
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Crear enlace de descarga simulado
            const link = document.createElement('a');
            link.href = '#'; // En una implementación real, aquí iría el PDF
            link.download = `CV-${this.getFormattedDate()}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            if (window.cvApp) {
                window.cvApp.showNotification('✅ PDF generado correctamente', 'success');
            }
        } catch (error) {
            console.error('Error generando PDF:', error);
            if (window.cvApp) {
                window.cvApp.showNotification('❌ Error al generar PDF', 'error');
            }
        }
    }

    async exportToImage() {
        if (window.cvApp) {
            window.cvApp.showNotification('🔄 Generando imagen...', 'info');
        }

        try {
            // Simular generación de imagen
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Crear enlace de descarga simulado
            const link = document.createElement('a');
            link.href = '#'; // En una implementación real, aquí iría la imagen
            link.download = `CV-${this.getFormattedDate()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            if (window.cvApp) {
                window.cvApp.showNotification('✅ Imagen generada correctamente', 'success');
            }
        } catch (error) {
            console.error('Error generando imagen:', error);
            if (window.cvApp) {
                window.cvApp.showNotification('❌ Error al generar imagen', 'error');
            }
        }
    }

    saveToLocalStorage() {
        if (window.cvEditor) {
            const cvData = window.cvEditor.getCVData();
            try {
                localStorage.setItem('cvData', JSON.stringify(cvData));
                console.log('CV guardado en localStorage');
                return true;
            } catch (error) {
                console.error('Error guardando en localStorage:', error);
                return false;
            }
        }
        return false;
    }

    loadFromLocalStorage() {
        try {
            const savedData = localStorage.getItem('cvData');
            if (savedData) {
                return JSON.parse(savedData);
            }
        } catch (error) {
            console.error('Error cargando desde localStorage:', error);
        }
        return null;
    }

    exportToJSON() {
        if (window.cvEditor) {
            const cvData = window.cvEditor.getCVData();
            const dataStr = JSON.stringify(cvData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `CV-backup-${this.getFormattedDate()}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            if (window.cvApp) {
                window.cvApp.showNotification('✅ Backup JSON generado', 'success');
            }
        }
    }

    importFromJSON(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const cvData = JSON.parse(e.target.result);
                    
                    if (window.cvEditor) {
                        window.cvEditor.loadData(cvData);
                        window.cvEditor.updatePreview();
                    }
                    
                    resolve(cvData);
                    
                    if (window.cvApp) {
                        window.cvApp.showNotification('✅ CV importado correctamente', 'success');
                    }
                } catch (error) {
                    reject(error);
                    if (window.cvApp) {
                        window.cvApp.showNotification('❌ Error importando CV', 'error');
                    }
                }
            };
            
            reader.onerror = () => reject(new Error('Error leyendo archivo'));
            reader.readAsText(file);
        });
    }

    getFormattedDate() {
        const now = new Date();
        return now.toISOString().split('T')[0];
    }

    // Método para generar HTML del CV (útil para previsualización avanzada)
    generateCVHTML(cvData) {
        if (!cvData) return '';
        
        const { personal, summary, experience, skills, education } = cvData;
        
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>CV - ${personal.name}</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .section { margin-bottom: 25px; }
                    .section h2 { color: #3b82f6; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; }
                    .skills { display: flex; flex-wrap: wrap; gap: 10px; }
                    .skill-tag { background: #3b82f6; color: white; padding: 5px 10px; border-radius: 15px; font-size: 0.9em; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>${personal.name || 'Nombre'}</h1>
                    <h2>${personal.title || 'Título Profesional'}</h2>
                    <p>${personal.location || 'Ubicación'}</p>
                </div>
                
                ${summary ? `<div class="section">
                    <h2>Resumen</h2>
                    <p>${summary}</p>
                </div>` : ''}
                
                ${experience.length > 0 ? `<div class="section">
                    <h2>Experiencia Laboral</h2>
                    ${experience.map(exp => `
                        <div style="margin-bottom: 15px;">
                            <h3>${exp.position || 'Puesto'}</h3>
                            <p><strong>${exp.company || 'Empresa'}</strong> | ${exp.period || 'Periodo'}</p>
                            <p>${exp.description || 'Descripción'}</p>
                        </div>
                    `).join('')}
                </div>` : ''}
                
                ${skills.length > 0 ? `<div class="section">
                    <h2>Habilidades</h2>
                    <div class="skills">
                        ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>` : ''}
                
                ${education.length > 0 ? `<div class="section">
                    <h2>Educación</h2>
                    ${education.map(edu => `
                        <div style="margin-bottom: 15px;">
                            <h3>${edu.degree || 'Título'}</h3>
                            <p><strong>${edu.institution || 'Institución'}</strong> | ${edu.period || 'Periodo'}</p>
                        </div>
                    `).join('')}
                </div>` : ''}
            </body>
            </html>
        `;
    }

    // Método para resetear CV
    resetCV() {
        if (confirm('¿Estás seguro de que quieres resetear tu CV? Se perderán todos los datos.')) {
            localStorage.removeItem('cvData');
            
            if (window.cvEditor) {
                window.cvEditor.cvData = {
                    personal: { name: '', title: '', location: '' },
                    summary: '',
                    experience: [],
                    skills: [],
                    education: [],
                    template: 'modern'
                };
                window.cvEditor.updatePreview();
                window.cvEditor.updateSkillsList();
                window.cvEditor.updateExperienceList();
                window.cvEditor.updateEducationList();
            }
            
            if (window.cvApp) {
                window.cvApp.showNotification('🔄 CV reseteado correctamente', 'success');
            }
            
            if (window.cvAnalyzer) {
                window.cvAnalyzer.showInitialAnalysis();
            }
        }
    }

    // Método para duplicar CV
    duplicateCV() {
        if (window.cvEditor) {
            const currentData = window.cvEditor.getCVData();
            const duplicatedData = JSON.parse(JSON.stringify(currentData));
            
            // Modificar ligeramente para evitar conflicto
            duplicatedData.personal.name = `${duplicatedData.personal.name} (Copia)`;
            
            this.exportToJSON(duplicatedData);
        }
    }
}

// Inicializar sistema de guardado
document.addEventListener('DOMContentLoaded', () => {
    window.cvSave = new CVSave();
});

// Función global para resetear CV (útil para debugging)
window.resetCV = function() {
    if (window.cvSave) {
        window.cvSave.resetCV();
    }
};