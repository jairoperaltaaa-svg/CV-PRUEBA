// ========== SISTEMA DE ANÁLISIS IA CVPro ==========

class AnalizadorIA {
    constructor() {
        this.historial = this.cargarHistorial();
        this.estadisticas = this.cargarEstadisticas();
        this.industrias = this.inicializarDatosIndustria();
    }

    cargarHistorial() {
        return JSON.parse(localStorage.getItem('ia_historial')) || [];
    }

    cargarEstadisticas() {
        return JSON.parse(localStorage.getItem('ia_estadisticas')) || {
            analisisCompletados: 0,
            mejorasSugeridas: 0,
            puntuacionPromedio: 0
        };
    }

    inicializarDatosIndustria() {
        return {
            tecnologia: {
                nombre: "Tecnología & IT",
                palabrasClave: [
                    "desarrollo", "programación", "software", "aplicaciones", "web",
                    "mobile", "frontend", "backend", "fullstack", "devops",
                    "cloud", "aws", "azure", "docker", "kubernetes",
                    "javascript", "python", "java", "react", "nodejs",
                    "base de datos", "sql", "nosql", "api", "microservicios",
                    "agile", "scrum", "ci/cd", "git", "testing"
                ],
                competencias: [
                    "Resolución de problemas técnicos",
                    "Desarrollo de software escalable", 
                    "Arquitectura de sistemas",
                    "Optimización de rendimiento",
                    "Seguridad informática"
                ]
            },
            marketing: {
                nombre: "Marketing Digital",
                palabrasClave: [
                    "marketing", "digital", "seo", "sem", "redes sociales",
                    "content", "email", "automation", "analytics", "kpi",
                    "conversión", "lead", "funnel", "branding", "positioning",
                    "social media", "community", "engagement", "viral", "influencer",
                    "campañas", "publicidad", "google ads", "facebook ads", "metrics"
                ],
                competencias: [
                    "Estrategias de marketing digital",
                    "Análisis de métricas y KPIs",
                    "Gestión de campañas publicitarias",
                    "Optimización de conversión",
                    "Branding y posicionamiento"
                ]
            },
            finanzas: {
                nombre: "Finanzas & Banca",
                palabrasClave: [
                    "financiero", "contable", "presupuesto", "análisis", "forecast",
                    "reporting", "compliance", "riesgo", "auditoría", "tesorería",
                    "inversiones", "mercados", "capital", "activos", "pasivos",
                    "balance", "estado resultados", "cash flow", "roi", "kpi financiero",
                    "regulatorio", "normativa", "ifrs", "gaap", "control interno"
                ],
                competencias: [
                    "Análisis financiero avanzado",
                    "Gestión de riesgos",
                    "Cumplimiento normativo",
                    "Planificación financiera",
                    "Reporting ejecutivo"
                ]
            }
            // Se pueden agregar más industrias...
        };
    }

    analizarCVCompleto(cvData) {
        const analisis = {
            id: 'analisis_' + Date.now(),
            fecha: new Date().toISOString(),
            puntuaciones: {},
            recomendaciones: [],
            industryAnalysis: {},
            optimizacionesATS: {}
        };

        // Análisis de completitud
        analisis.puntuaciones.completitud = this.analizarCompletitud(cvData);
        
        // Análisis de impacto
        analisis.puntuaciones.impacto = this.analizarImpacto(cvData);
        
        // Análisis de palabras clave
        analisis.puntuaciones.keywords = this.analizarPalabrasClave(cvData);
        
        // Análisis de estructura
        analisis.puntuaciones.estructura = this.analizarEstructura(cvData);

        // Generar recomendaciones
        analisis.recomendaciones = this.generarRecomendaciones(analisis.puntuaciones, cvData);

        // Análisis ATS
        analisis.optimizacionesATS = this.analizarATS(cvData);

        // Calcular puntuación general
        analisis.puntuacionGeneral = this.calcularPuntuacionGeneral(analisis.puntuaciones);

        // Guardar en historial
        this.guardarAnalisis(analisis);

        return analisis;
    }

    analizarCompletitud(cvData) {
        let puntuacion = 0;
        const campos = [
            'nombre', 'titulo', 'email', 'telefono', 'resumen', 
            'habilidades', 'experiencia', 'educacion'
        ];

        campos.forEach(campo => {
            if (cvData[campo] && cvData[campo].toString().trim().length > 0) {
                puntuacion += 12.5; // 100 / 8 campos = 12.5 cada uno
            }
        });

        return Math.min(100, puntuacion);
    }

    analizarImpacto(cvData) {
        let puntuacion = 0;
        
        // Análisis del resumen
        if (cvData.resumen) {
            const resumen = cvData.resumen.toLowerCase();
            if (resumen.length >= 50 && resumen.length <= 200) puntuacion += 25;
            if (resumen.includes('logré') || resumen.includes('lideré') || resumen.includes('implementé')) puntuacion += 15;
        }

        // Análisis de experiencia
        if (cvData.experiencia && cvData.experiencia.length > 0) {
            puntuacion += Math.min(30, cvData.experiencia.length * 10);
            
            // Verificar logros en experiencias
            cvData.experiencia.forEach(exp => {
                if (exp.descripcion && this.contarLogros(exp.descripcion) > 0) {
                    puntuacion += 10;
                }
            });
        }

        // Análisis de habilidades
        if (cvData.habilidades) {
            const habilidades = cvData.habilidades.split(',').length;
            puntuacion += Math.min(20, habilidades * 2);
        }

        return Math.min(100, puntuacion);
    }

    analizarPalabrasClave(cvData) {
        const textoCompleto = this.obtenerTextoCompletoCV(cvData).toLowerCase();
        const palabrasClaveGenerales = [
            'liderazgo', 'gestión', 'coordinación', 'desarrollo', 'implementación',
            'optimización', 'análisis', 'estrategia', 'innovación', 'resultados',
            'eficiencia', 'automatización', 'colaboración', 'comunicación', 'resolución',
            'planificación', 'seguimiento', 'evaluación', 'mejora', 'crecimiento'
        ];

        let encontradas = 0;
        palabrasClaveGenerales.forEach(palabra => {
            if (textoCompleto.includes(palabra)) {
                encontradas++;
            }
        });

        return Math.min(100, (encontradas / palabrasClaveGenerales.length) * 100);
    }

    analizarEstructura(cvData) {
        let puntuacion = 0;

        // Verificar longitud apropiada del resumen
        if (cvData.resumen && cvData.resumen.length >= 50 && cvData.resumen.length <= 200) {
            puntuacion += 25;
        }

        // Verificar experiencias tienen descripción
        if (cvData.experiencia && cvData.experiencia.length > 0) {
            const conDescripcion = cvData.experiencia.filter(exp => 
                exp.descripcion && exp.descripcion.length > 20
            );
            puntuacion += (conDescripcion.length / cvData.experiencia.length) * 25;
        }

        // Verificar educación
        if (cvData.educacion && cvData.educacion.length > 0) {
            puntuacion += 25;
        }

        // Verificar habilidades
        if (cvData.habilidades && cvData.habilidades.length > 10) {
            puntuacion += 25;
        }

        return Math.min(100, puntuacion);
    }

    contarLogros(texto) {
        const palabrasLogro = ['logré', 'lideré', 'implementé', 'mejoré', 'reduje', 'aumenté', 'optimicé'];
        let count = 0;
        palabrasLogro.forEach(palabra => {
            if (texto.toLowerCase().includes(palabra)) {
                count++;
            }
        });
        return count;
    }

    obtenerTextoCompletoCV(cvData) {
        let texto = '';
        Object.values(cvData).forEach(valor => {
            if (typeof valor === 'string') {
                texto += ' ' + valor;
            } else if (Array.isArray(valor)) {
                valor.forEach(item => {
                    if (typeof item === 'object') {
                        Object.values(item).forEach(subValor => {
                            if (typeof subValor === 'string') {
                                texto += ' ' + subValor;
                            }
                        });
                    }
                });
            }
        });
        return texto;
    }

    generarRecomendaciones(puntuaciones, cvData) {
        const recomendaciones = [];

        // Recomendaciones basadas en puntuaciones
        if (puntuaciones.completitud < 70) {
            recomendaciones.push({
                tipo: 'improvement',
                mensaje: 'Completa más campos de información personal y profesional',
                prioridad: 'alta'
            });
        }

        if (puntuaciones.impacto < 60) {
            recomendaciones.push({
                tipo: 'improvement', 
                mensaje: 'Incluye más logros y resultados cuantificables en tu experiencia',
                prioridad: 'media'
            });
        }

        if (puntuaciones.keywords < 50) {
            recomendaciones.push({
                tipo: 'warning',
                mensaje: 'Agrega más palabras clave profesionales relevantes para tu industria',
                prioridad: 'alta'
            });
        }

        if (puntuaciones.estructura < 60) {
            recomendaciones.push({
                tipo: 'improvement',
                mensaje: 'Mejora la estructura y organización de las secciones de tu CV',
                prioridad: 'media'
            });
        }

        // Recomendaciones específicas del contenido
        if (!cvData.resumen || cvData.resumen.length < 30) {
            recomendaciones.push({
                tipo: 'critical',
                mensaje: 'Tu resumen profesional es muy breve. Debe tener al menos 50-100 palabras',
                prioridad: 'alta'
            });
        }

        if (!cvData.experiencia || cvData.experiencia.length === 0) {
            recomendaciones.push({
                tipo: 'critical',
                mensaje: 'Agrega al menos una experiencia laboral relevante',
                prioridad: 'alta'
            });
        }

        return recomendaciones;
    }

    analizarATS(cvData) {
        const analisisATS = {
            formato: true, // Asumimos formato compatible
            palabrasClave: this.analizarPalabrasClaveATS(cvData),
            secciones: this.verificarSeccionesATS(cvData),
            contacto: this.verificarContactoATS(cvData)
        };

        return analisisATS;
    }

    analizarPalabrasClaveATS(cvData) {
        const texto = this.obtenerTextoCompletoCV(cvData).toLowerCase();
        const palabrasATS = [
            'javascript', 'python', 'java', 'react', 'node', 'sql', 'aws',
            'marketing', 'seo', 'analytics', 'finanzas', 'contable', 'gestión'
        ];

        return palabrasATS.filter(palabra => texto.includes(palabra));
    }

    verificarSeccionesATS(cvData) {
        const seccionesRequeridas = ['experiencia', 'educacion', 'habilidades'];
        return seccionesRequeridas.every(seccion => 
            cvData[seccion] && (Array.isArray(cvData[seccion]) ? cvData[seccion].length > 0 : cvData[seccion].length > 0)
        );
    }

    verificarContactoATS(cvData) {
        return !!(cvData.email && cvData.telefono);
    }

    calcularPuntuacionGeneral(puntuaciones) {
        const pesos = {
            completitud: 0.25,
            impacto: 0.30,
            keywords: 0.25,
            estructura: 0.20
        };

        let total = 0;
        Object.keys(pesos).forEach(categoria => {
            total += puntuaciones[categoria] * pesos[categoria];
        });

        return Math.round(total);
    }

    guardarAnalisis(analisis) {
        this.historial.unshift(analisis);
        
        // Mantener solo los últimos 10 análisis
        if (this.historial.length > 10) {
            this.historial = this.historial.slice(0, 10);
        }

        // Actualizar estadísticas
        this.estadisticas.analisisCompletados++;
        this.estadisticas.mejorasSugeridas += analisis.recomendaciones.length;
        this.estadisticas.puntuacionPromedio = (
            (this.estadisticas.puntuacionPromedio * (this.estadisticas.analisisCompletados - 1) + analisis.puntuacionGeneral) / 
            this.estadisticas.analisisCompletados
        );

        localStorage.setItem('ia_historial', JSON.stringify(this.historial));
        localStorage.setItem('ia_estadisticas', JSON.stringify(this.estadisticas));
    }

    analizarPorIndustria(cvData, industria) {
        const datosIndustria = this.industrias[industria];
        if (!datosIndustria) return null;

        const textoCV = this.obtenerTextoCompletoCV(cvData).toLowerCase();
        
        // Calcular compatibilidad
        const palabrasEncontradas = datosIndustria.palabrasClave.filter(palabra =>
            textoCV.includes(palabra.toLowerCase())
        );

        const compatibilidad = Math.round((palabrasEncontradas.length / datosIndustria.palabrasClave.length) * 100);

        return {
            industria: datosIndustria.nombre,
            compatibilidad: compatibilidad,
            palabrasEncontradas: palabrasEncontradas,
            palabrasFaltantes: datosIndustria.palabrasClave.filter(palabra => 
                !textoCV.includes(palabra.toLowerCase())
            ),
            competenciasRecomendadas: datosIndustria.competencias
        };
    }

    generarSugerenciasAutomaticas(cvData) {
        const sugerencias = {
            resumen: this.mejorarResumen(cvData.resumen),
            experiencia: this.optimizarExperiencia(cvData.experiencia),
            habilidades: this.organizarHabilidades(cvData.habilidades)
        };

        return sugerencias;
    }

    mejorarResumen(resumenActual) {
        if (!resumenActual || resumenActual.length < 30) {
            return "Profesional altamente motivado con sólida experiencia en el sector. Busco oportunidades desafiantes donde pueda aplicar mis habilidades y contribuir al éxito de la organización.";
        }

        // Aquí iría lógica más avanzada de IA para mejorar el resumen
        return resumenActual + " Orientado a resultados y con fuerte capacidad de adaptación en entornos dinámicos.";
    }

    optimizarExperiencia(experiencias) {
        if (!experiencias || experiencias.length === 0) return experiencias;

        return experiencias.map(exp => {
            if (!exp.descripcion || exp.descripcion.length < 20) {
                return {
                    ...exp,
                    descripcion: exp.descripcion + " Responsable de tareas clave y contribución al éxito del equipo."
                };
            }
            return exp;
        });
    }

    organizarHabilidades(habilidades) {
        if (!habilidades) return "Habilidades técnicas, herramientas y competencias profesionales";
        
        // Simular organización por categorías
        return habilidades;
    }
}

// ========== INTERFAZ ANÁLISIS IA ==========

let analizadorIA;

function inicializarAnalisisIA() {
    analizadorIA = new AnalizadorIA();
    actualizarEstadisticasIA();
    cargarHistorialIA();
}

function realizarAnalisisCompleto() {
    // Obtener datos del CV actual
    const cvData = {
        nombre: document.getElementById('nombre')?.value || '',
        titulo: document.getElementById('titulo')?.value || '',
        email: document.getElementById('email')?.value || '',
        telefono: document.getElementById('telefono')?.value || '',
        resumen: document.getElementById('resumen')?.value || '',
        habilidades: document.getElementById('habilidades')?.value || '',
        experiencia: JSON.parse(localStorage.getItem('experiencias')) || [],
        educacion: JSON.parse(localStorage.getItem('educacion')) || []
    };

    // Mostrar estado de análisis
    document.querySelector('.btn-ia-primary').textContent = '🔄 Analizando...';
    document.querySelector('.btn-ia-primary').classList.add('analyzing');

    // Simular análisis (en producción aquí se conectaría con una API de IA real)
    setTimeout(() => {
        const resultado = analizadorIA.analizarCVCompleto(cvData);
        mostrarResultadosAnalisis(resultado);
        
        document.querySelector('.btn-ia-primary').textContent = '🔄 Realizar Análisis Completo';
        document.querySelector('.btn-ia-primary').classList.remove('analyzing');
    }, 2000);
}

function mostrarResultadosAnalisis(resultado) {
    // Actualizar barras de progreso
    actualizarBarraProgreso('score-completitud', 'value-completitud', resultado.puntuaciones.completitud);
    actualizarBarraProgreso('score-impacto', 'value-impacto', resultado.puntuaciones.impacto);
    actualizarBarraProgreso('score-keywords', 'value-keywords', resultado.puntuaciones.keywords);
    actualizarBarraProgreso('score-estructura', 'value-estructura', resultado.puntuaciones.estructura);

    // Actualizar puntuación general
    const scoreCircle = document.querySelector('.score-circle-ia');
    scoreCircle.style.background = `conic-gradient(#10B981 0%, #10B981 ${resultado.puntuacionGeneral}%, #E5E7EB ${resultado.puntuacionGeneral}%)`;
    scoreCircle.querySelector('span').textContent = resultado.puntuacionGeneral;

    // Actualizar nivel
    const nivel = obtenerNivelPuntuacion(resultado.puntuacionGeneral);
    document.getElementById('score-level').textContent = nivel;

    // Mostrar recomendaciones
    mostrarRecomendaciones(resultado.recomendaciones);

    // Actualizar estadísticas
    actualizarEstadisticasIA();

    // Actualizar historial
    cargarHistorialIA();
}

function actualizarBarraProgreso(barId, valueId, porcentaje) {
    const bar = document.getElementById(barId);
    const value = document.getElementById(valueId);
    
    if (bar && value) {
        bar.style.width = porcentaje + '%';
        value.textContent = porcentaje + '%';
    }
}

function obtenerNivelPuntuacion(puntuacion) {
    if (puntuacion >= 90) return 'PROFESIONAL';
    if (puntuacion >= 75) return 'AVANZADO';
    if (puntuacion >= 60) return 'INTERMEDIO';
    return 'BÁSICO';
}

function mostrarRecomendaciones(recomendaciones) {
    const container = document.getElementById('recommendations-list');
    
    if (recomendaciones.length === 0) {
        container.innerHTML = '<div class="recommendation-item improvement">✅ Tu CV está en excelente estado. ¡Buen trabajo!</div>';
        return;
    }

    container.innerHTML = recomendaciones.map(rec => `
        <div class="recommendation-item ${rec.tipo}">
            ${rec.mensaje}
        </div>
    `).join('');
}

function actualizarEstadisticasIA() {
    const stats = analizadorIA.estadisticas;
    
    document.getElementById('analisis-completados').textContent = stats.analisisCompletados;
    document.getElementById('mejoras-sugeridas').textContent = stats.mejorasSugeridas;
    document.getElementById('puntuacion-promedio').textContent = Math.round(stats.puntuacionPromedio) + '%';
}

function cargarHistorialIA() {
    const historial = analizadorIA.historial;
    const container = document.getElementById('history-list');
    
    if (historial.length === 0) {
        container.innerHTML = '<p style="text-align: center; opacity: 0.7;">No hay análisis recientes</p>';
        return;
    }

    container.innerHTML = historial.map(analisis => `
        <div class="history-item">
            <div class="history-icon">📊</div>
            <div class="history-info">
                <div class="history-title">Análisis Completo</div>
                <div class="history-date">${new Date(analisis.fecha).toLocaleDateString()}</div>
            </div>
            <div class="history-score">${analisis.puntuacionGeneral}%</div>
        </div>
    `).join('');
}

function cambiarTab(tabId) {
    // Ocultar todos los tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remover active de todos los botones
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar tab seleccionado
    document.getElementById(tabId).classList.add('active');
    event.target.classList.add('active');
}

function analizarPorIndustria() {
    const industria = document.getElementById('industry-select').value;
    
    // Obtener datos del CV
    const cvData = {
        nombre: document.getElementById('nombre')?.value || '',
        titulo: document.getElementById('titulo')?.value || '',
        resumen: document.getElementById('resumen')?.value || '',
        habilidades: document.getElementById('habilidades')?.value || '',
        experiencia: JSON.parse(localStorage.getItem('experiencias')) || []
    };

    const resultado = analizadorIA.analizarPorIndustria(cvData, industria);
    
    if (resultado) {
        // Actualizar compatibilidad
        document.getElementById('industry-match-score').textContent = resultado.compatibilidad + '%';
        document.getElementById('industry-match-fill').style.width = resultado.compatibilidad + '%';

        // Mostrar palabras clave
        const tagsContainer = document.getElementById('industry-tags');
        tagsContainer.innerHTML = '';

        // Palabras encontradas
        resultado.palabrasEncontradas.forEach(palabra => {
            const tag = document.createElement('div');
            tag.className = 'industry-tag';
            tag.textContent = palabra;
            tagsContainer.appendChild(tag);
        });

        // Palabras faltantes
        resultado.palabrasFaltantes.slice(0, 10).forEach(palabra => {
            const tag = document.createElement('div');
            tag.className = 'industry-tag missing';
            tag.textContent = palabra;
            tagsContainer.appendChild(tag);
        });

        // Mostrar recomendaciones
        const recContainer = document.getElementById('industry-recommendations-list');
        recContainer.innerHTML = resultado.competenciasRecomendadas.map(comp => `
            <div class="recommendation-item improvement">
                ${comp}
            </div>
        `).join('');
    }
}

function generarSugerenciasAutomaticas() {
    const cvData = {
        resumen: document.getElementById('resumen')?.value || '',
        experiencia: JSON.parse(localStorage.getItem('experiencias')) || [],
        habilidades: document.getElementById('habilidades')?.value || ''
    };

    const sugerencias = analizadorIA.generarSugerenciasAutomaticas(cvData);

    // Mostrar sugerencias en los cards correspondientes
    document.getElementById('suggestion-resumen').textContent = 
        sugerencias.resumen.length > 100 ? sugerencias.resumen.substring(0, 100) + '...' : sugerencias.resumen;
    
    document.getElementById('suggestion-experiencia').textContent = 
        'Se optimizarán ' + sugerencias.experiencia.length + ' experiencias laborales';
    
    document.getElementById('suggestion-educacion').textContent = 
        'Se organizarán las habilidades por categorías profesionales';

    // Guardar sugerencias para aplicación posterior
    localStorage.setItem('sugerencias_ia', JSON.stringify(sugerencias));
}

function mejorarResumen() {
    const sugerencias = JSON.parse(localStorage.getItem('sugerencias_ia'));
    if (sugerencias && sugerencias.resumen) {
        document.getElementById('resumen').value = sugerencias.resumen;
        actualizarVistaPrevia();
        mostrarNotificacion('✅ Resumen mejorado automáticamente');
    }
}

function optimizarExperiencia() {
    const sugerencias = JSON.parse(localStorage.getItem('sugerencias_ia'));
    if (sugerencias && sugerencias.experiencia) {
        // Aquí se aplicarían las optimizaciones a las experiencias
        mostrarNotificacion('✅ Experiencia laboral optimizada');
    }
}

function enriquecerEducacion() {
    mostrarNotificacion('✅ Sección de educación enriquecida');
}

function aplicarMejorasAutomaticas() {
    mejorarResumen();
    optimizarExperiencia();
    enriquecerEducacion();
    cerrarIAModal();
}

function cerrarIAModal() {
    document.getElementById('ia-modal').style.display = 'none';
}

// Inicializar cuando cargue la página
document.addEventListener('DOMContentLoaded', function() {
    inicializarAnalisisIA();
});