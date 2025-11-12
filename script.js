// ========== SISTEMA ORIGINAL DEL CVPro ==========

// Variables globales
let temaActual = 'claro';
let templateActual = 'template-1';

// Cambiar tema claro/oscuro
function cambiarTema(tema) {
    temaActual = tema;
    document.body.classList.toggle('dark-mode', tema === 'oscuro');
    
    // Actualizar botones activos
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.includes(tema === 'claro' ? 'Claro' : 'Oscuro'));
    });
    
    actualizarVistaPrevia();
    guardarConfiguracion();
}

// Cambiar template
function cambiarTemplate(template) {
    templateActual = template;
    const preview = document.getElementById('cv-preview');
    
    // Remover todas las clases de template
    preview.classList.remove('template-1', 'template-2', 'template-3');
    // Agregar la clase del template actual
    preview.classList.add(template);
    
    // Actualizar botones activos
    document.querySelectorAll('.template-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    actualizarVistaPrevia();
    guardarConfiguracion();
}

// Actualizar vista previa en tiempo real
function actualizarVistaPrevia() {
    const nombre = document.getElementById('nombre').value || 'Tu Nombre';
    const titulo = document.getElementById('titulo').value || 'Tu Título Profesional';
    const email = document.getElementById('email').value || 'email@ejemplo.com';
    const telefono = document.getElementById('telefono').value || '+1 234 567 890';
    const resumen = document.getElementById('resumen').value || 'Tu resumen profesional aparecerá aquí...';
    const habilidades = document.getElementById('habilidades').value || 'Tus habilidades aparecerán aquí...';
    const idiomas = document.getElementById('idiomas').value || '';
    const certificaciones = document.getElementById('certificaciones').value || '';
    
    const preview = document.getElementById('cv-preview');
    
    // Actualizar header
    const cvHeader = preview.querySelector('.cv-header') || crearSeccion('cv-header');
    cvHeader.innerHTML = `
        <div class="cv-name">${nombre}</div>
        <div class="cv-title">${titulo}</div>
        <div class="cv-contacto">${email} | ${telefono}</div>
    `;
    
    // Actualizar secciones
    actualizarSeccion(preview, 'Resumen', resumen);
    actualizarSeccion(preview, 'Experiencia', generarExperienciaHTML());
    actualizarSeccion(preview, 'Educación', generarEducacionHTML());
    actualizarSeccion(preview, 'Habilidades', habilidades.split(',').map(h => h.trim()).filter(h => h).join(', '));
    
    // Nuevas secciones
    if (idiomas) {
        actualizarSeccion(preview, 'Idiomas', idiomas);
    }
    if (certificaciones) {
        actualizarSeccion(preview, 'Certificaciones', certificaciones);
    }
    
    // Actualizar mini preview
    actualizarMiniPreview(nombre, titulo);
    
    guardarDatosCV();
}

function actualizarSeccion(preview, titulo, contenido) {
    let seccion = preview.querySelector(`.cv-section:nth-child(${getSeccionIndex(titulo)})`);
    if (!seccion) {
        seccion = crearSeccion('cv-section');
        preview.appendChild(seccion);
    }
    
    seccion.innerHTML = `
        <div class="section-title">${titulo}</div>
        <div class="section-content">${contenido}</div>
    `;
}

function getSeccionIndex(titulo) {
    const secciones = ['Resumen', 'Experiencia', 'Educación', 'Habilidades', 'Idiomas', 'Certificaciones'];
    return secciones.indexOf(titulo) + 1;
}

function crearSeccion(clase) {
    const div = document.createElement('div');
    div.className = clase;
    return div;
}

// Generar HTML para experiencias
function generarExperienciaHTML() {
    const experiencias = JSON.parse(localStorage.getItem('experiencias')) || [];
    if (experiencias.length === 0) return '<p>Tu experiencia laboral aparecerá aquí...</p>';
    
    return experiencias.map(exp => `
        <div class="experiencia-item">
            <div class="exp-header">
                <strong>${exp.puesto}</strong> - ${exp.empresa}
                <span class="exp-fecha">${exp.fechaInicio} - ${exp.fechaFin}</span>
            </div>
            <div class="exp-descripcion">${exp.descripcion}</div>
        </div>
    `).join('');
}

// Generar HTML para educación
function generarEducacionHTML() {
    const educacion = JSON.parse(localStorage.getItem('educacion')) || [];
    if (educacion.length === 0) return '<p>Tu educación aparecerá aquí...</p>';
    
    return educacion.map(edu => `
        <div class="educacion-item">
            <div class="edu-header">
                <strong>${edu.titulo}</strong> - ${edu.institucion}
                <span class="edu-fecha">${edu.fecha}</span>
            </div>
        </div>
    `).join('');
}

// Actualizar mini preview
function actualizarMiniPreview(nombre, titulo) {
    const miniPreview = document.getElementById('mini-preview');
    const miniName = miniPreview.querySelector('.mini-name');
    const miniTitle = miniPreview.querySelector('.mini-title');
    
    miniName.textContent = nombre || 'Vista Previa';
    miniTitle.textContent = titulo || 'Click para ver';
}

// Scroll a vista previa
function scrollToPreview() {
    document.querySelector('.preview-panel').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Sistema de experiencias dinámicas
function agregarExperiencia() {
    const container = document.getElementById('experiencias-container');
    const index = container.children.length;
    
    const experienciaHTML = `
        <div class="experiencia-item" data-index="${index}">
            <div class="form-group">
                <label>Puesto</label>
                <input type="text" placeholder="Ej: Desarrollador Frontend" oninput="actualizarExperiencia(${index})">
            </div>
            <div class="form-group">
                <label>Empresa</label>
                <input type="text" placeholder="Ej: Google Inc." oninput="actualizarExperiencia(${index})">
            </div>
            <div class="form-group">
                <label>Fecha Inicio - Fecha Fin</label>
                <input type="text" placeholder="Ej: Ene 2020 - Dic 2023" oninput="actualizarExperiencia(${index})">
            </div>
            <div class="form-group">
                <label>Descripción</label>
                <textarea placeholder="Describe tus responsabilidades y logros..." oninput="actualizarExperiencia(${index})"></textarea>
            </div>
            <button type="button" class="remove-btn" onclick="eliminarExperiencia(${index})">🗑️ Eliminar</button>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', experienciaHTML);
    guardarExperiencias();
}

function actualizarExperiencia(index) {
    guardarExperiencias();
    actualizarVistaPrevia();
}

function eliminarExperiencia(index) {
    const item = document.querySelector(`.experiencia-item[data-index="${index}"]`);
    if (item) item.remove();
    
    // Reindexar items restantes
    const items = document.querySelectorAll('.experiencia-item');
    items.forEach((item, i) => {
        item.setAttribute('data-index', i);
    });
    
    guardarExperiencias();
    actualizarVistaPrevia();
}

function guardarExperiencias() {
    const experiencias = [];
    const items = document.querySelectorAll('.experiencia-item');
    
    items.forEach(item => {
        const inputs = item.querySelectorAll('input, textarea');
        experiencias.push({
            puesto: inputs[0].value,
            empresa: inputs[1].value,
            fechaInicio: inputs[2].value,
            descripcion: inputs[3].value
        });
    });
    
    localStorage.setItem('experiencias', JSON.stringify(experiencias));
}

// Sistema de educación dinámica
function agregarEducacion() {
    const container = document.getElementById('educacion-container');
    const index = container.children.length;
    
    const educacionHTML = `
        <div class="educacion-item" data-index="${index}">
            <div class="form-group">
                <label>Título</label>
                <input type="text" placeholder="Ej: Licenciatura en Informática" oninput="actualizarEducacion(${index})">
            </div>
            <div class="form-group">
                <label>Institución</label>
                <input type="text" placeholder="Ej: Universidad Nacional" oninput="actualizarEducacion(${index})">
            </div>
            <div class="form-group">
                <label>Fecha</label>
                <input type="text" placeholder="Ej: 2016 - 2020" oninput="actualizarEducacion(${index})">
            </div>
            <button type="button" class="remove-btn" onclick="eliminarEducacion(${index})">🗑️ Eliminar</button>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', educacionHTML);
    guardarEducacion();
}

function actualizarEducacion(index) {
    guardarEducacion();
    actualizarVistaPrevia();
}

function eliminarEducacion(index) {
    const item = document.querySelector(`.educacion-item[data-index="${index}"]`);
    if (item) item.remove();
    
    // Reindexar items restantes
    const items = document.querySelectorAll('.educacion-item');
    items.forEach((item, i) => {
        item.setAttribute('data-index', i);
    });
    
    guardarEducacion();
    actualizarVistaPrevia();
}

function guardarEducacion() {
    const educacion = [];
    const items = document.querySelectorAll('.educacion-item');
    
    items.forEach(item => {
        const inputs = item.querySelectorAll('input');
        educacion.push({
            titulo: inputs[0].value,
            institucion: inputs[1].value,
            fecha: inputs[2].value
        });
    });
    
    localStorage.setItem('educacion', JSON.stringify(educacion));
}

// Guardar datos del CV
function guardarDatosCV() {
    const datos = {
        nombre: document.getElementById('nombre').value,
        titulo: document.getElementById('titulo').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        resumen: document.getElementById('resumen').value,
        habilidades: document.getElementById('habilidades').value,
        idiomas: document.getElementById('idiomas').value,
        certificaciones: document.getElementById('certificaciones').value
    };
    
    localStorage.setItem('cvData', JSON.stringify(datos));
}

// Guardar configuración
function guardarConfiguracion() {
    const config = {
        tema: temaActual,
        template: templateActual
    };
    
    localStorage.setItem('cvConfig', JSON.stringify(config));
}

// Cargar datos guardados
function cargarDatosGuardados() {
    // Cargar configuración
    const config = JSON.parse(localStorage.getItem('cvConfig'));
    if (config) {
        temaActual = config.tema;
        templateActual = config.template;
        cambiarTema(temaActual);
        cambiarTemplate(templateActual);
    }
    
    // Cargar datos del CV
    const datos = JSON.parse(localStorage.getItem('cvData'));
    if (datos) {
        document.getElementById('nombre').value = datos.nombre || '';
        document.getElementById('titulo').value = datos.titulo || '';
        document.getElementById('email').value = datos.email || '';
        document.getElementById('telefono').value = datos.telefono || '';
        document.getElementById('resumen').value = datos.resumen || '';
        document.getElementById('habilidades').value = datos.habilidades || '';
        document.getElementById('idiomas').value = datos.idiomas || '';
        document.getElementById('certificaciones').value = datos.certificaciones || '';
    }
    
    // Cargar experiencias
    const experiencias = JSON.parse(localStorage.getItem('experiencias')) || [];
    experiencias.forEach((exp, index) => {
        agregarExperiencia();
        const item = document.querySelector(`.experiencia-item[data-index="${index}"]`);
        const inputs = item.querySelectorAll('input, textarea');
        inputs[0].value = exp.puesto || '';
        inputs[1].value = exp.empresa || '';
        inputs[2].value = exp.fechaInicio || '';
        inputs[3].value = exp.descripcion || '';
    });
    
    // Cargar educación
    const educacion = JSON.parse(localStorage.getItem('educacion')) || [];
    educacion.forEach((edu, index) => {
        agregarEducacion();
        const item = document.querySelector(`.educacion-item[data-index="${index}"]`);
        const inputs = item.querySelectorAll('input');
        inputs[0].value = edu.titulo || '';
        inputs[1].value = edu.institucion || '';
        inputs[2].value = edu.fecha || '';
    });
}

// Guardar CV
function guardarCV() {
    guardarDatosCV();
    guardarConfiguracion();
    guardarExperiencias();
    guardarEducacion();
    
    // Mostrar mensaje de éxito
    mostrarNotificacion('✅ CV guardado correctamente');
}

// ========== SISTEMA DE EXPORTACIÓN PDF REAL ==========

async function exportarPDF() {
    try {
        const cvPreview = document.getElementById('cv-preview');
        
        // Mostrar loading
        const originalText = event.target.textContent;
        event.target.textContent = '⏳ Generando PDF...';
        event.target.disabled = true;

        // Crear canvas del CV
        const canvas = await html2canvas(cvPreview, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: getComputedStyle(cvPreview).backgroundColor
        });

        // Crear PDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 10;

        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        
        // Agregar marca de agua premium
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text('Generado con CVPro - cvpro.com', 10, pdfHeight - 10);

        // Descargar PDF
        pdf.save('CV_Profesional.pdf');
        
        // Restaurar botón
        event.target.textContent = originalText;
        event.target.disabled = false;
        
        mostrarNotificacion('📄 PDF generado y descargado correctamente');
        
    } catch (error) {
        console.error('Error generando PDF:', error);
        event.target.textContent = '📄 Exportar PDF Premium';
        event.target.disabled = false;
        mostrarNotificacion('❌ Error al generar PDF', 'error');
    }
}

// ========== SISTEMA DE COMPARTIR CV ==========

function compartirCV() {
    // Generar ID único para el CV
    const cvId = generarIdUnico();
    const cvData = {
        id: cvId,
        datos: JSON.parse(localStorage.getItem('cvData') || '{}'),
        experiencias: JSON.parse(localStorage.getItem('experiencias') || '[]'),
        educacion: JSON.parse(localStorage.getItem('educacion') || '[]'),
        config: JSON.parse(localStorage.getItem('cvConfig') || '{}'),
        timestamp: Date.now(),
        expira: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 días
    };
    
    // Guardar en localStorage con ID único
    localStorage.setItem(`cv_share_${cvId}`, JSON.stringify(cvData));
    
    // Generar URL
    const shareURL = `${window.location.origin}${window.location.pathname}?shared_cv=${cvId}`;
    
    // Mostrar panel de share
    const sharePanel = document.getElementById('share-panel');
    const urlInput = document.getElementById('share-url-input');
    urlInput.value = shareURL;
    sharePanel.classList.add('active');
}

function generarIdUnico() {
    return 'cv_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
}

function copiarURL() {
    const urlInput = document.getElementById('share-url-input');
    urlInput.select();
    document.execCommand('copy');
    mostrarNotificacion('📋 URL copiada al portapapeles');
}

function cerrarSharePanel() {
    document.getElementById('share-panel').classList.remove('active');
}

// Cargar CV compartido
function cargarCVCompartido() {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedCVId = urlParams.get('shared_cv');
    
    if (sharedCVId) {
        const cvData = JSON.parse(localStorage.getItem(`cv_share_${sharedCVId}`) || '{}');
        
        if (cvData && cvData.timestamp && Date.now() < cvData.expira) {
            if (confirm('¿Quieres cargar el CV compartido?')) {
                // Cargar datos del CV compartido
                if (cvData.datos) {
                    Object.keys(cvData.datos).forEach(key => {
                        const element = document.getElementById(key);
                        if (element) element.value = cvData.datos[key] || '';
                    });
                }
                
                // Cargar configuración
                if (cvData.config) {
                    cambiarTema(cvData.config.tema || 'claro');
                    cambiarTemplate(cvData.config.template || 'template-1');
                }
                
                actualizarVistaPrevia();
                mostrarNotificacion('✅ CV compartido cargado correctamente');
            }
        } else {
            mostrarNotificacion('❌ El enlace ha expirado o no es válido', 'error');
        }
    }
}

// ========== SISTEMA DE BACKUP ==========

function descargarCVJSON() {
    const cvData = {
        datos: JSON.parse(localStorage.getItem('cvData') || '{}'),
        experiencias: JSON.parse(localStorage.getItem('experiencias') || '[]'),
        educacion: JSON.parse(localStorage.getItem('educacion') || '[]'),
        config: JSON.parse(localStorage.getItem('cvConfig') || '{}'),
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(cvData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `cv_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    mostrarNotificacion('💾 Backup descargado correctamente');
}

function cargarBackup(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const cvData = JSON.parse(e.target.result);
            
            // Cargar datos
            if (cvData.datos) {
                localStorage.setItem('cvData', JSON.stringify(cvData.datos));
            }
            if (cvData.experiencias) {
                localStorage.setItem('experiencias', JSON.stringify(cvData.experiencias));
            }
            if (cvData.educacion) {
                localStorage.setItem('educacion', JSON.stringify(cvData.educacion));
            }
            if (cvData.config) {
                localStorage.setItem('cvConfig', JSON.stringify(cvData.config));
            }
            
            // Recargar página
            location.reload();
            
        } catch (error) {
            mostrarNotificacion('❌ Error al cargar el backup', 'error');
        }
    };
    reader.readAsText(file);
}

// ========== NOTIFICACIONES ==========

function mostrarNotificacion(mensaje, tipo = 'success') {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.textContent = mensaje;
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${tipo === 'error' ? '#EF4444' : '#10B981'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notificacion);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notificacion.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.parentNode.removeChild(notificacion);
            }
        }, 300);
    }, 3000);
}

// ========== SISTEMA DE SCORING DE CV ==========

class CVScorer {
    constructor() {
        this.scores = {
            completitud: 0,
            palabrasClave: 0,
            estructura: 0,
            experiencia: 0,
            educacion: 0,
            habilidades: 0
        };
        this.totalScore = 0;
    }

    // Analizar completitud de campos obligatorios
    analizarCompletitud() {
        const camposObligatorios = [
            'nombre', 'titulo', 'email', 'telefono',
            'resumen', 'experiencia', 'educacion', 'habilidades'
        ];
        
        let completos = 0;
        camposObligatorios.forEach(campo => {
            if (this.obtenerValorCampo(campo)) completos++;
        });

        this.scores.completitud = Math.round((completos / camposObligatorios.length) * 30);
        return this.scores.completitud;
    }

    // Analizar palabras clave por industria
    analizarPalabrasClave() {
        const palabrasClave = [
            'liderazgo', 'gestión', 'coordinación', 'desarrollo',
            'implementación', 'optimización', 'análisis', 'estrategia',
            'innovación', 'resultados', 'eficiencia', 'automatización',
            'colaboración', 'comunicación', 'resolución'
        ];
        
        const textoCV = this.obtenerTextoCompletoCV();
        let encontradas = 0;

        palabrasClave.forEach(palabra => {
            if (textoCV.toLowerCase().includes(palabra.toLowerCase())) {
                encontradas++;
            }
        });

        this.scores.palabrasClave = Math.min(25, (encontradas / palabrasClave.length) * 25);
        return this.scores.palabrasClave;
    }

    // Analizar estructura y formato
    analizarEstructura() {
        let puntos = 0;
        
        // Verificar longitud del resumen
        const resumen = this.obtenerValorCampo('resumen') || '';
        if (resumen.length >= 50 && resumen.length <= 200) puntos += 5;
        
        // Verificar experiencias tienen descripción
        const experiencias = JSON.parse(localStorage.getItem('experiencias')) || [];
        if (experiencias.length > 0) {
            const conDescripcion = experiencias.filter(exp => exp.descripcion && exp.descripcion.length > 20);
            puntos += (conDescripcion.length / experiencias.length) * 10;
        }
        
        // Verificar educación
        const educacion = JSON.parse(localStorage.getItem('educacion')) || [];
        if (educacion.length > 0) puntos += 5;
        
        // Verificar habilidades
        const habilidades = this.obtenerValorCampo('habilidades') || '';
        if (habilidades.length > 10) puntos += 5;

        this.scores.estructura = Math.min(25, puntos);
        return this.scores.estructura;
    }

    // Analizar experiencia laboral
    analizarExperiencia() {
        const experiencias = JSON.parse(localStorage.getItem('experiencias')) || [];
        let puntos = 0;

        if (experiencias.length >= 2) puntos += 8;
        else if (experiencias.length >= 1) puntos += 5;

        // Verificar duración y descripciones
        experiencias.forEach(exp => {
            if (exp.descripcion && exp.descripcion.length > 50) puntos += 2;
        });

        this.scores.experiencia = Math.min(10, puntos);
        return this.scores.experiencia;
    }

    // Analizar educación
    analizarEducacion() {
        const educacion = JSON.parse(localStorage.getItem('educacion')) || [];
        let puntos = 0;

        if (educacion.length >= 1) puntos += 5;
        if (educacion.length >= 2) puntos += 3;
        if (educacion.length >= 3) puntos += 2;

        this.scores.educacion = Math.min(10, puntos);
        return this.scores.educacion;
    }

    // Obtener valor de campo del CV
    obtenerValorCampo(campo) {
        const element = document.getElementById(campo);
        if (element) return element.value || element.textContent || '';
        return '';
    }

    // Obtener todo el texto del CV
    obtenerTextoCompletoCV() {
        let texto = '';
        const campos = ['nombre', 'titulo', 'resumen', 'habilidades'];
        
        campos.forEach(campo => {
            texto += ' ' + (this.obtenerValorCampo(campo) || '');
        });

        // Agregar experiencias y educación
        const experiencias = JSON.parse(localStorage.getItem('experiencias')) || [];
        const educacion = JSON.parse(localStorage.getItem('educacion')) || [];

        experiencias.forEach(exp => {
            texto += ' ' + (exp.descripcion || '');
        });

        educacion.forEach(edu => {
            texto += ' ' + (edu.institucion || '') + ' ' + (edu.titulo || '');
        });

        return texto.toLowerCase();
    }

    // Calcular score total
    calcularScoreTotal() {
        this.analizarCompletitud();
        this.analizarPalabrasClave();
        this.analizarEstructura();
        this.analizarExperiencia();
        this.analizarEducacion();

        this.totalScore = Object.values(this.scores).reduce((a, b) => a + b, 0);
        return this.totalScore;
    }

    // Generar feedback detallado
    generarFeedback() {
        const feedback = [];
        const total = this.totalScore;

        // Feedback general
        if (total >= 90) feedback.push("🎉 ¡Excelente! Tu CV es de alta calidad");
        else if (total >= 70) feedback.push("✅ Buen CV, pero puede mejorar");
        else if (total >= 50) feedback.push("⚠️ CV regular, necesita mejoras");
        else feedback.push("❌ CV necesita trabajo significativo");

        // Feedback específico por categoría
        if (this.scores.completitud < 20) {
            feedback.push("• Completa más campos obligatorios");
        }
        if (this.scores.palabrasClave < 15) {
            feedback.push("• Agrega más palabras clave profesionales");
        }
        if (this.scores.estructura < 15) {
            feedback.push("• Mejora la estructura y formato");
        }
        if (this.scores.experiencia < 5) {
            feedback.push("• Agrega más experiencia laboral con descripciones detalladas");
        }

        return feedback;
    }

    // Obtener nivel del CV
    obtenerNivel() {
        const score = this.totalScore;
        if (score >= 90) return { nivel: "PROFESIONAL", color: "#10B981" };
        if (score >= 75) return { nivel: "AVANZADO", color: "#3B82F6" };
        if (score >= 60) return { nivel: "INTERMEDIO", color: "#F59E0B" };
        return { nivel: "BÁSICO", color: "#EF4444" };
    }
}

// ========== INTERFAZ DE SCORING ==========

function inicializarSistemaScoring() {
    // Crear botón de scoring en la interfaz si no existe
    if (!document.getElementById('btn-analizar-cv')) {
        const botonScoring = document.createElement('button');
        botonScoring.id = 'btn-analizar-cv';
        botonScoring.innerHTML = '📊 Analizar Mi CV';
        botonScoring.className = 'btn-scoring';
        botonScoring.onclick = mostrarPanelScoring;

        // Agregar botón al panel de controles
        const panelControles = document.querySelector('.controls');
        if (panelControles) {
            panelControles.appendChild(botonScoring);
        }
    }
}

function mostrarPanelScoring() {
    const scorer = new CVScorer();
    const scoreTotal = scorer.calcularScoreTotal();
    const feedback = scorer.generarFeedback();
    const nivel = scorer.obtenerNivel();
    
    const panelHTML = `
        <div class="panel-scoring">
            <h2>📊 Análisis de tu CV</h2>
            
            <div class="score-display">
                <div class="score-circle" style="--score-percent: ${scoreTotal}%">
                    <span>${scoreTotal}</span>
                </div>
                <h3 style="color: ${nivel.color}">Nivel: ${nivel.nivel}</h3>
            </div>
            
            <div class="score-breakdown">
                <div class="score-category">
                    <span>Completitud:</span>
                    <span>${scorer.scores.completitud}/30</span>
                </div>
                <div class="score-category">
                    <span>Palabras Clave:</span>
                    <span>${scorer.scores.palabrasClave}/25</span>
                </div>
                <div class="score-category">
                    <span>Estructura:</span>
                    <span>${scorer.scores.estructura}/25</span>
                </div>
                <div class="score-category">
                    <span>Experiencia:</span>
                    <span>${scorer.scores.experiencia}/10</span>
                </div>
                <div class="score-category">
                    <span>Educación:</span>
                    <span>${scorer.scores.educacion}/10</span>
                </div>
            </div>
            
            <div class="feedback-list">
                <h4>💡 Recomendaciones:</h4>
                ${feedback.map(item => `<p>${item}</p>`).join('')}
            </div>
            
            <button class="cerrar-panel" onclick="cerrarPanelScoring()">Cerrar</button>
        </div>
    `;
    
    // Remover panel existente si hay uno
    const panelExistente = document.querySelector('.panel-scoring');
    if (panelExistente) panelExistente.remove();
    
    document.body.insertAdjacentHTML('beforeend', panelHTML);
}

function cerrarPanelScoring() {
    const panel = document.querySelector('.panel-scoring');
    if (panel) panel.remove();
}

// Inicializar sistema cuando cargue la página
document.addEventListener('DOMContentLoaded', function() {
    cargarCVCompartido();
    setTimeout(inicializarSistemaScoring, 1000);
});

// Agregar estilos CSS para animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .notificacion {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-weight: 500;
    }
`;
document.head.appendChild(style);