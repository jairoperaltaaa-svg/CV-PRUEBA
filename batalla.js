// ========== SISTEMA MODO BATALLA CVPro ==========

class ModoBatalla {
    constructor() {
        this.batallaActual = null;
        this.miUsuario = this.obtenerUsuario();
        this.ranking = [];
        this.cvsDisponibles = [];
        this.inicializarDatos();
    }

    inicializarDatos() {
        // Cargar datos existentes o inicializar
        this.cargarBatallas();
        this.cargarRanking();
        this.cargarCVsDisponibles();
    }

    obtenerUsuario() {
        let usuario = localStorage.getItem('batalla_usuario');
        if (!usuario) {
            usuario = {
                id: 'user_' + Math.random().toString(36).substr(2, 9),
                nombre: 'Usuario Anónimo',
                puntuacion: 0,
                votosEmitidos: 0,
                batallasGanadas: 0,
                rachaActual: 0,
                fechaRegistro: new Date().toISOString()
            };
            localStorage.setItem('batalla_usuario', JSON.stringify(usuario));
        } else {
            usuario = JSON.parse(usuario);
        }
        return usuario;
    }

    cargarBatallas() {
        this.batallas = JSON.parse(localStorage.getItem('batallas')) || [];
    }

    cargarRanking() {
        this.ranking = JSON.parse(localStorage.getItem('batalla_ranking')) || [];
    }

    cargarCVsDisponibles() {
        // CVs de ejemplo para demostración
        this.cvsDisponibles = JSON.parse(localStorage.getItem('cvs_batalla')) || this.generarCVsEjemplo();
    }

    generarCVsEjemplo() {
        return [
            {
                id: 'cv_001',
                nombre: 'Ana García López',
                titulo: 'Desarrolladora Full Stack Senior',
                resumen: 'Más de 8 años de experiencia en desarrollo web. Especializada en React, Node.js y arquitecturas cloud.',
                experiencia: [
                    {
                        puesto: 'Senior Full Stack Developer',
                        empresa: 'Tech Solutions Inc.',
                        fecha: '2020 - Presente',
                        descripcion: 'Lideré el desarrollo de aplicaciones web escalables'
                    }
                ],
                educacion: [
                    {
                        titulo: 'Ingeniería en Sistemas',
                        institucion: 'Universidad Nacional',
                        fecha: '2012 - 2016'
                    }
                ],
                habilidades: 'JavaScript, React, Node.js, Python, AWS, Docker',
                score: 85
            },
            {
                id: 'cv_002', 
                nombre: 'Carlos Rodríguez',
                titulo: 'Data Scientist',
                resumen: 'Científico de datos con experiencia en machine learning y análisis de big data.',
                experiencia: [
                    {
                        puesto: 'Data Scientist',
                        empresa: 'Data Corp',
                        fecha: '2019 - Presente',
                        descripcion: 'Desarrollo de modelos predictivos y análisis de datos'
                    }
                ],
                educacion: [
                    {
                        titulo: 'Maestría en Ciencia de Datos',
                        institucion: 'Universidad Tecnológica',
                        fecha: '2017 - 2019'
                    }
                ],
                habilidades: 'Python, R, SQL, Machine Learning, TensorFlow',
                score: 78
            },
            {
                id: 'cv_003',
                nombre: 'María Fernández',
                titulo: 'Product Manager',
                resumen: 'Gestión de productos digitales con enfoque en experiencia de usuario y métricas.',
                experiencia: [
                    {
                        puesto: 'Product Manager',
                        empresa: 'StartupXYZ',
                        fecha: '2018 - Presente',
                        descripcion: 'Coordinación de equipos de desarrollo y diseño'
                    }
                ],
                educacion: [
                    {
                        titulo: 'MBA',
                        institucion: 'Escuela de Negocios',
                        fecha: '2016 - 2018'
                    }
                ],
                habilidades: 'Product Management, Agile, UX, Analytics, Leadership',
                score: 82
            },
            {
                id: 'cv_004',
                nombre: 'David Chen',
                titulo: 'DevOps Engineer',
                resumen: 'Ingeniero DevOps especializado en CI/CD, cloud infrastructure y automatización.',
                experiencia: [
                    {
                        puesto: 'DevOps Engineer',
                        empresa: 'CloudTech',
                        fecha: '2019 - Presente',
                        descripcion: 'Implementación de pipelines CI/CD y infraestructura cloud'
                    }
                ],
                educacion: [
                    {
                        titulo: 'Ingeniería en Computación',
                        institucion: 'Instituto Tecnológico',
                        fecha: '2014 - 2018'
                    }
                ],
                habilidades: 'AWS, Docker, Kubernetes, Jenkins, Terraform, Python',
                score: 88
            }
        ];
    }

    generarNuevaBatalla() {
        if (this.cvsDisponibles.length < 2) {
            console.error('No hay suficientes CVs para generar batalla');
            return null;
        }

        // Seleccionar 2 CVs aleatorios diferentes
        const indice1 = Math.floor(Math.random() * this.cvsDisponibles.length);
        let indice2;
        do {
            indice2 = Math.floor(Math.random() * this.cvsDisponibles.length);
        } while (indice1 === indice2);

        const cv1 = this.cvsDisponibles[indice1];
        const cv2 = this.cvsDisponibles[indice2];

        const batalla = {
            id: 'batalla_' + Date.now(),
            cv1: cv1,
            cv2: cv2,
            votos: { cv1: 0, cv2: 0 },
            usuariosVotaron: [],
            fechaCreacion: new Date().toISOString(),
            activa: true
        };

        this.batallaActual = batalla;
        return batalla;
    }

    votar(batallaId, cvElegido, usuarioId) {
        const batalla = this.batallaActual;
        
        if (!batalla || batalla.id !== batallaId) {
            console.error('Batalla no encontrada');
            return false;
        }

        if (batalla.usuariosVotaron.includes(usuarioId)) {
            console.error('Usuario ya votó en esta batalla');
            return false;
        }

        // Registrar voto
        batalla.votos[cvElegido]++;
        batalla.usuariosVotaron.push(usuarioId);

        // Actualizar estadísticas del usuario
        this.miUsuario.votosEmitidos++;
        
        // Determinar si ganó la batalla (votó por el CV que tiene más votos)
        const votosCV1 = batalla.votos.cv1;
        const votosCV2 = batalla.votos.cv2;
        
        if ((cvElegido === 'cv1' && votosCV1 > votosCV2) || 
            (cvElegido === 'cv2' && votosCV2 > votosCV1)) {
            this.miUsuario.batallasGanadas++;
            this.miUsuario.rachaActual++;
            this.miUsuario.puntuacion += 10; // 10 puntos por batalla ganada
        } else {
            this.miUsuario.rachaActual = 0;
        }

        // Guardar cambios
        this.guardarDatos();
        
        return true;
    }

    obtenerRanking() {
        // Ordenar usuarios por puntuación
        return this.ranking.sort((a, b) => b.puntuacion - a.puntuacion);
    }

    actualizarRanking() {
        const usuarioExistente = this.ranking.find(u => u.id === this.miUsuario.id);
        
        if (usuarioExistente) {
            Object.assign(usuarioExistente, this.miUsuario);
        } else {
            this.ranking.push({...this.miUsuario});
        }

        // Ordenar ranking
        this.ranking.sort((a, b) => b.puntuacion - a.puntuacion);
        
        this.guardarDatos();
    }

    guardarDatos() {
        localStorage.setItem('batalla_usuario', JSON.stringify(this.miUsuario));
        localStorage.setItem('batalla_ranking', JSON.stringify(this.ranking));
        
        // Guardar batalla actual si existe
        if (this.batallaActual) {
            const batallas = JSON.parse(localStorage.getItem('batallas')) || [];
            const index = batallas.findIndex(b => b.id === this.batallaActual.id);
            
            if (index === -1) {
                batallas.push(this.batallaActual);
            } else {
                batallas[index] = this.batallaActual;
            }
            
            localStorage.setItem('batallas', JSON.stringify(batallas));
        }
    }

    subirCVParaBatalla(cvData) {
        const cvBatalla = {
            id: 'user_cv_' + Date.now(),
            ...cvData,
            score: new CVScorer().calcularScoreTotal(),
            fechaSubida: new Date().toISOString(),
            usuario: this.miUsuario.id
        };

        this.cvsDisponibles.push(cvBatalla);
        localStorage.setItem('cvs_batalla', JSON.stringify(this.cvsDisponibles));
        
        return cvBatalla;
    }

    obtenerEstadisticasUsuario() {
        return {
            votosEmitidos: this.miUsuario.votosEmitidos,
            batallasGanadas: this.miUsuario.batallasGanadas,
            porcentajeVictorias: this.miUsuario.votosEmitidos > 0 ? 
                Math.round((this.miUsuario.batallasGanadas / this.miUsuario.votosEmitidos) * 100) : 0,
            rachaActual: this.miUsuario.rachaActual,
            puntuacionTotal: this.miUsuario.puntuacion
        };
    }
}

// ========== INTERFAZ MODO BATALLA ==========

let modoBatalla;

function inicializarModoBatalla() {
    modoBatalla = new ModoBatalla();
    cargarInterfazBatalla();
    actualizarEstadisticas();
    cargarRanking();
}

function cargarInterfazBatalla() {
    const batalla = modoBatalla.generarNuevaBatalla();
    
    if (!batalla) {
        document.getElementById('batalla-arena').innerHTML = `
            <div class="no-batallas">
                <h3>😴 No hay batallas disponibles</h3>
                <p>Sube tu CV para participar en las batallas</p>
            </div>
        `;
        return;
    }

    // Actualizar CV 1
    document.getElementById('cv1-id').textContent = batalla.cv1.id.substr(-3);
    document.getElementById('cv1-score').textContent = `Score: ${batalla.cv1.score}`;
    document.getElementById('cv1-content').innerHTML = generarMiniCV(batalla.cv1);

    // Actualizar CV 2
    document.getElementById('cv2-id').textContent = batalla.cv2.id.substr(-3);
    document.getElementById('cv2-score').textContent = `Score: ${batalla.cv2.score}`;
    document.getElementById('cv2-content').innerHTML = generarMiniCV(batalla.cv2);

    // Actualizar contadores
    document.getElementById('total-batallas').textContent = modoBatalla.batallas.length;
}

function generarMiniCV(cv) {
    return `
        <div class="cv-mini">
            <div class="mini-name">${cv.nombre}</div>
            <div class="mini-title">${cv.titulo}</div>
            
            <div class="mini-section">
                <div class="section-title">Resumen</div>
                <div class="section-content">${cv.resumen.substring(0, 150)}...</div>
            </div>
            
            <div class="mini-section">
                <div class="section-title">Experiencia</div>
                <div class="section-content">
                    ${cv.experiencia.map(exp => 
                        `<strong>${exp.puesto}</strong> - ${exp.empresa}<br>`
                    ).join('')}
                </div>
            </div>
            
            <div class="mini-section">
                <div class="section-title">Habilidades</div>
                <div class="section-content">${cv.habilidades}</div>
            </div>
        </div>
    `;
}

function votar(cvNumero) {
    const cvElegido = cvNumero === 1 ? 'cv1' : 'cv2';
    const batallaId = modoBatalla.batallaActual.id;
    const usuarioId = modoBatalla.miUsuario.id;

    const exito = modoBatalla.votar(batallaId, cvElegido, usuarioId);
    
    if (exito) {
        // Animación de voto
        const card = document.getElementById(`cv-card-${cvNumero}`);
        card.classList.add('voting');
        
        setTimeout(() => {
            card.classList.remove('voting');
            mostrarResultadoVotacion();
        }, 500);
    } else {
        alert('Ya has votado en esta batalla');
    }
}

function mostrarResultadoVotacion() {
    const batalla = modoBatalla.batallaActual;
    const votosCV1 = batalla.votos.cv1;
    const votosCV2 = batalla.votos.cv2;
    
    let mensaje = '';
    let titulo = '';
    
    if (votosCV1 > votosCV2) {
        titulo = '🏆 CV #1 Gana la Batalla!';
        mensaje = `
            <div style="text-align: center;">
                <h3>${batalla.cv1.nombre}</h3>
                <p>${batalla.cv1.titulo}</p>
                <div style="margin: 20px 0;">
                    <strong>Votos:</strong> ${votosCV1} vs ${votosCV2}
                </div>
                <p>¡Tu voto contribuyó a esta victoria!</p>
            </div>
        `;
    } else if (votosCV2 > votosCV1) {
        titulo = '🏆 CV #2 Gana la Batalla!';
        mensaje = `
            <div style="text-align: center;">
                <h3>${batalla.cv2.nombre}</h3>
                <p>${batalla.cv2.titulo}</p>
                <div style="margin: 20px 0;">
                    <strong>Votos:</strong> ${votosCV2} vs ${votosCV1}
                </div>
                <p>¡Tu voto contribuyó a esta victoria!</p>
            </div>
        `;
    } else {
        titulo = '⚔️ Empate!';
        mensaje = `
            <div style="text-align: center;">
                <p>La batalla terminó en empate: ${votosCV1} - ${votosCV2}</p>
                <p>¡Fue una batalla muy reñida!</p>
            </div>
        `;
    }

    document.getElementById('modal-titulo').textContent = titulo;
    document.getElementById('modal-contenido').innerHTML = mensaje;
    document.getElementById('resultado-modal').style.display = 'block';
}

function cerrarModal() {
    document.getElementById('resultado-modal').style.display = 'none';
}

function siguienteBatalla() {
    cerrarModal();
    setTimeout(() => {
        cargarInterfazBatalla();
        actualizarEstadisticas();
    }, 300);
}

function actualizarEstadisticas() {
    const stats = modoBatalla.obtenerEstadisticasUsuario();
    
    document.getElementById('mi-puntuacion').textContent = stats.puntuacionTotal;
    document.getElementById('stats-votos-emitidos').textContent = stats.votosEmitidos;
    document.getElementById('stats-batallas-ganadas').textContent = stats.batallasGanadas;
    document.getElementById('stats-porcentaje-victorias').textContent = stats.porcentajeVictorias + '%';
    document.getElementById('stats-racha-actual').textContent = stats.rachaActual;

    // Actualizar ranking personal
    const miPosicion = modoBatalla.ranking.findIndex(u => u.id === modoBatalla.miUsuario.id) + 1;
    document.getElementById('mi-ranking').textContent = miPosicion > 0 ? `#${miPosicion}` : '-';
}

function cargarRanking() {
    const ranking = modoBatalla.obtenerRanking();
    const rankingList = document.getElementById('ranking-list');
    
    if (ranking.length === 0) {
        rankingList.innerHTML = '<p style="text-align: center; opacity: 0.7;">No hay datos de ranking aún</p>';
        return;
    }

    rankingList.innerHTML = ranking.slice(0, 10).map((usuario, index) => `
        <div class="ranking-item ${usuario.id === modoBatalla.miUsuario.id ? 'me' : ''}">
            <div class="ranking-pos">${index + 1}</div>
            <div class="ranking-info">
                <div class="ranking-name">${usuario.nombre}</div>
                <div class="ranking-stats">
                    ${usuario.batallasGanadas} victorias • ${usuario.votosEmitidos} votos
                </div>
            </div>
            <div class="ranking-score">${usuario.puntuacion}</div>
        </div>
    `).join('');
}

function filtrarRanking(tipo) {
    // Actualizar botones activos
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // En una implementación real, aquí se filtraría el ranking por período
    cargarRanking();
}

function subirCVParaBatalla() {
    // Cargar CV actual del localStorage
    const cvData = {
        nombre: document.getElementById('nombre')?.value || 'Mi CV',
        titulo: document.getElementById('titulo')?.value || 'Mi Título',
        resumen: document.getElementById('resumen')?.value || 'Mi resumen profesional',
        experiencia: JSON.parse(localStorage.getItem('experiencias')) || [],
        educacion: JSON.parse(localStorage.getItem('educacion')) || [],
        habilidades: document.getElementById('habilidades')?.value || 'Mis habilidades'
    };

    const cvSubido = modoBatalla.subirCVParaBatalla(cvData);
    
    document.getElementById('upload-status').innerHTML = `
        <div style="color: #10B981; text-align: center;">
            ✅ CV subido exitosamente para batallas<br>
            <small>ID: ${cvSubido.id} • Score: ${cvSubido.score}</small>
        </div>
    `;

    // Recargar batalla actual si es necesario
    setTimeout(() => {
        cargarInterfazBatalla();
    }, 1000);
}

function reportarBatalla() {
    alert('🚩 Batalla reportada. Revisaremos el contenido.');
}

function compartirBatalla() {
    const batallaUrl = window.location.href;
    navigator.clipboard.writeText(batallaUrl).then(() => {
        alert('📋 Enlace de batalla copiado al portapapeles');
    });
}

// Manejar subida de archivo CV
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('cv-upload');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const cvData = JSON.parse(e.target.result);
                        const cvSubido = modoBatalla.subirCVParaBatalla(cvData);
                        
                        document.getElementById('upload-status').innerHTML = `
                            <div style="color: #10B981; text-align: center;">
                                ✅ CV cargado desde archivo<br>
                                <small>ID: ${cvSubido.id} • Score: ${cvSubido.score}</small>
                            </div>
                        `;
                    } catch (error) {
                        document.getElementById('upload-status').innerHTML = `
                            <div style="color: #EF4444; text-align: center;">
                                ❌ Error al cargar el archivo
                            </div>
                        `;
                    }
                };
                reader.readAsText(file);
            }
        });
    }
});