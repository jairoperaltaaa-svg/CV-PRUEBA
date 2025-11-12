// cv-save.js - Sistema de guardado y exportación

class CVSave {
    constructor() {
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
            
            // Crear enlace de descarga
            const link = document.createElement('a');
            link.href = '#';
            link.download = `CV-${this.getFormattedDate()}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            if (window.cvApp) {
                window.cvApp.showNotification('✅ PDF descargado correctamente', 'success');
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
            
            // Crear enlace de descarga
            const link = document.createElement('a');
            link.href = '#';
            link.download = `CV-${this.getFormattedDate()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            if (window.cvApp) {
                window.cvApp.showNotification('✅ Imagen descargada correctamente', 'success');
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
                return true;
            } catch (error) {
                console.error('Error guardando en localStorage:', error);
                return false;
            }
        }
        return false;
    }

    getFormattedDate() {
        const now = new Date();
        return now.toISOString().split('T')[0];
    }

    // Método para resetear CV
    resetCV() {
        if (confirm('¿Estás seguro de que quieres resetear tu CV? Se perderán todos los datos.')) {
            localStorage.removeItem('cvData');
            
            if (window.cvEditor) {
                window.location.reload();
            }
        }
    }
}

// Inicializar sistema de guardado
document.addEventListener('DOMContentLoaded', () => {
    window.cvSave = new CVSave();
});