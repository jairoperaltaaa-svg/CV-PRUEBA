// cv-analyzer.js - Asistente IA para análisis del CV

class CVAnalyzer {
    constructor() {
        this.analysisResults = {
            completeness: 0,
            suggestions: [],
            warnings: [],
            strengths: []
        };
        this.init();
    }

    init() {
        this.initializeTips();
        this.showInitialAnalysis();
    }

    analyzeCV(cvData) {
        if (!cvData) return;
        
        this.analysisResults = {
            completeness: 0,
            suggestions: [],
            warnings: [],
            strengths: []
        };

        this.analyzeCompleteness(cvData);
        this.analyzeContentQuality(cvData);
        this.analyzeSkills(cvData.skills);
        this.analyzeExperience(cvData.experience);
        this.analyzeProfessionalism(cvData);

        this.updateAnalysisDisplay();
    }

    analyzeCompleteness(cvData) {
        let completedSections = 0;
        const totalSections = 5;

        // Información personal
        if (cvData.personal && cvData.personal.name && cvData.personal.title && cvData.personal.location) {
            completedSections++;
            this.analysisResults.strengths.push("✅ Información personal completa");
        } else {
            this.analysisResults.warnings.push("⚠️ Falta información personal básica");
        }

        // Resumen
        if (cvData.summary && cvData.summary.length > 50) {
            completedSections++;
            this.analysisResults.strengths.push("✅ Resumen profesional bien desarrollado");
        } else if (cvData.summary) {
            this.analysisResults.suggestions.push("💡 Mejora tu resumen profesional con más detalles");
        } else {
            this.analysisResults.warnings.push("⚠️ Agrega un resumen profesional");
        }

        // Experiencia
        if (cvData.experience && cvData.experience.length > 0) {
            completedSections++;
            this.analysisResults.strengths.push(`✅ ${cvData.experience.length} experiencias laborales agregadas`);
        } else {
            this.analysisResults.warnings.push("⚠️ Agrega tu experiencia laboral");
        }

        // Habilidades
        if (cvData.skills && cvData.skills.length >= 3) {
            completedSections++;
            this.analysisResults.strengths.push(`✅ ${cvData.skills.length} habilidades técnicas listadas`);
        } else if (cvData.skills && cvData.skills.length > 0) {
            this.analysisResults.suggestions.push("💡 Agrega más habilidades técnicas relevantes");
        } else {
            this.analysisResults.warnings.push("⚠️ Agrega tus habilidades técnicas");
        }

        // Educación
        if (cvData.education && cvData.education.length > 0) {
            completedSections++;
            this.analysisResults.strengths.push("✅ Formación académica incluida");
        } else {
            this.analysisResults.suggestions.push("💡 Considera agregar tu formación académica");
        }

        this.analysisResults.completeness = Math.round((completedSections / totalSections) * 100);
    }

    analyzeContentQuality(cvData) {
        // Análisis del resumen
        if (cvData.summary) {
            const summaryLength = cvData.summary.length;
            if (summaryLength < 100) {
                this.analysisResults.suggestions.push("💡 Tu resumen es muy corto. Intenta expandirlo a 100-200 palabras");
            } else if (summaryLength > 300) {
                this.analysisResults.suggestions.push("💡 Tu resumen es muy largo. Considera reducirlo para mayor impacto");
            }

            // Verificar palabras clave
            const keywords = ['desarroll', 'experiencia', 'tecnolog', 'proyecto', 'habilidad'];
            const hasKeywords = keywords.some(keyword => 
                cvData.summary.toLowerCase().includes(keyword)
            );
            
            if (!hasKeywords) {
                this.analysisResults.suggestions.push("💡 Incluye palabras clave técnicas en tu resumen");
            }
        }

        // Análisis de títulos
        if (cvData.personal && cvData.personal.title) {
            const title = cvData.personal.title.toLowerCase();
            if (title.includes('senior') || title.includes('lead') || title.includes('principal')) {
                this.analysisResults.strengths.push("🎯 Título profesional bien posicionado");
            }
        }
    }

    analyzeSkills(skills) {
        if (!skills || skills.length === 0) return;

        // Categorizar habilidades
        const frontendSkills = skills.filter(skill => 
            ['javascript', 'react', 'vue', 'angular', 'html', 'css', 'typescript'].some(tech => 
                skill.toLowerCase().includes(tech)
            )
        );

        const backendSkills = skills.filter(skill => 
            ['node', 'python', 'java', 'php', 'ruby', 'sql', 'mongodb'].some(tech => 
                skill.toLowerCase().includes(tech)
            )
        );

        const toolsSkills = skills.filter(skill => 
            ['git', 'docker', 'aws', 'azure', 'jenkins', 'figma'].some(tech => 
                skill.toLowerCase().includes(tech)
            )
        );

        // Análisis de balance
        if (frontendSkills.length > 0) {
            this.analysisResults.strengths.push("⚡ Buenas habilidades de Frontend");
        }

        if (backendSkills.length > 0) {
            this.analysisResults.strengths.push("🔧 Buenas habilidades de Backend");
        }

        if (toolsSkills.length > 0) {
            this.analysisResults.strengths.push("🛠️ Conocimiento de herramientas de desarrollo");
        }

        // Sugerencias basadas en habilidades
        if (frontendSkills.length > 0 && backendSkills.length === 0) {
            this.analysisResults.suggestions.push("💡 Considera aprender alguna tecnología de backend para ser Full Stack");
        }

        if (skills.length < 5) {
            this.analysisResults.suggestions.push("💡 Agrega más habilidades técnicas para destacar");
        }

        // Verificar habilidades específicas demandadas
        const highDemandSkills = ['javascript', 'react', 'python', 'node', 'typescript', 'aws'];
        const hasHighDemand = skills.some(skill => 
            highDemandSkills.some(tech => skill.toLowerCase().includes(tech))
        );

        if (hasHighDemand) {
            this.analysisResults.strengths.push("🔥 Tienes habilidades muy demandadas en el mercado");
        }
    }

    analyzeExperience(experience) {
        if (!experience || experience.length === 0) return;

        // Análisis de descripciones
        experience.forEach((exp, index) => {
            if (exp.description) {
                const desc = exp.description.toLowerCase();
                
                // Verificar verbos de acción
                const actionVerbs = ['desarrollé', 'implementé', 'lideré', 'creé', 'mejoré', 'optimicé'];
                const hasActionVerbs = actionVerbs.some(verb => desc.includes(verb));
                
                if (!hasActionVerbs) {
                    this.analysisResults.suggestions.push(
                        `💡 Usa verbos de acción en la experiencia ${index + 1} (ej: "Desarrollé", "Implementé")`
                    );
                }

                // Verificar métricas
                const hasMetrics = /\d+/.test(exp.description);
                if (!hasMetrics) {
                    this.analysisResults.suggestions.push(
                        `💡 Incluye métricas en la experiencia ${index + 1} (ej: "aumenté un 30%", "reduje tiempos en 2 horas")`
                    );
                }
            } else {
                this.analysisResults.warnings.push(
                    `⚠️ Agrega descripción a la experiencia ${index + 1}`
                );
            }
        });

        if (experience.length >= 3) {
            this.analysisResults.strengths.push("📈 Tienes una buena cantidad de experiencia laboral");
        }
    }

    analyzeProfessionalism(cvData) {
        // Verificar correo profesional (simulado)
        if (cvData.personal && cvData.personal.name) {
            const nameParts = cvData.personal.name.toLowerCase().split(' ');
            if (nameParts.length >= 2) {
                this.analysisResults.strengths.push("👤 Nombre profesional completo");
            }
        }

        // Verificar título profesional
        if (cvData.personal && cvData.personal.title) {
            const title = cvData.personal.title.trim();
            if (title.length > 5) {
                this.analysisResults.strengths.push("🎖️ Título profesional claro y específico");
            }
        }
    }

    updateAnalysisDisplay() {
        const feedbackContainer = document.getElementById('aiFeedback');
        const suggestionsContainer = document.getElementById('aiSuggestions');

        if (!feedbackContainer || !suggestionsContainer) return;

        // Actualizar feedback principal
        feedbackContainer.innerHTML = '';

        // Mostrar porcentaje de completitud
        const completenessItem = document.createElement('div');
        completenessItem.className = `feedback-item ${
            this.analysisResults.completeness >= 80 ? 'positive' : 
            this.analysisResults.completeness >= 50 ? 'warning' : 'negative'
        }`;
        completenessItem.innerHTML = `
            <i class="fas fa-${this.analysisResults.completeness >= 80 ? 'check-circle' : 
                            this.analysisResults.completeness >= 50 ? 'exclamation-circle' : 'times-circle'}"></i>
            <span>Completitud del CV: <strong>${this.analysisResults.completeness}%</strong></span>
        `;
        feedbackContainer.appendChild(completenessItem);

        // Mostrar fortalezas
        this.analysisResults.strengths.forEach(strength => {
            const item = document.createElement('div');
            item.className = 'feedback-item positive';
            item.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <span>${strength}</span>
            `;
            feedbackContainer.appendChild(item);
        });

        // Mostrar advertencias
        this.analysisResults.warnings.forEach(warning => {
            const item = document.createElement('div');
            item.className = 'feedback-item warning';
            item.innerHTML = `
                <i class="fas fa-exclamation-circle"></i>
                <span>${warning}</span>
            `;
            feedbackContainer.appendChild(item);
        });

        // Actualizar sugerencias
        suggestionsContainer.innerHTML = '';

        this.analysisResults.suggestions.forEach(suggestion => {
            const suggestionElement = document.createElement('div');
            suggestionElement.className = 'suggestion';
            
            const parts = suggestion.split('💡');
            if (parts.length > 1) {
                suggestionElement.innerHTML = `
                    <strong>💡 ${parts[1].trim()}</strong>
                    <p>${parts.slice(2).join(' ').trim() || 'Mejora sugerida para tu CV'}</p>
                `;
            } else {
                suggestionElement.innerHTML = `
                    <strong>💡 Mejora sugerida</strong>
                    <p>${suggestion}</p>
                `;
            }
            suggestionsContainer.appendChild(suggestionElement);
        });

        // Si no hay sugerencias, mostrar mensaje positivo
        if (this.analysisResults.suggestions.length === 0 && this.analysisResults.completeness > 80) {
            const congratulations = document.createElement('div');
            congratulations.className = 'suggestion';
            congratulations.innerHTML = `
                <strong>🎉 ¡Excelente trabajo!</strong>
                <p>Tu CV está muy completo y profesional. ¡Sigue así!</p>
            `;
            suggestionsContainer.appendChild(congratulations);
        }
    }

    showInitialAnalysis() {
        const initialAnalysis = {
            completeness: 0,
            suggestions: [
                "💡 Completa tu información personal para comenzar",
                "💡 Agrega tu experiencia laboral más relevante",
                "💡 Incluye tus habilidades técnicas principales"
            ],
            warnings: [
                "⚠️ Tu CV está vacío. Comienza agregando tu información"
            ],
            strengths: []
        };

        this.analysisResults = initialAnalysis;
        this.updateAnalysisDisplay();
    }

    initializeTips() {
        // Los tips ya están en el HTML
        console.log("Sistema de tips IA inicializado");
    }

    // Análisis específico de habilidades
    analyzeSkills(skills) {
        if (!skills) return;
        
        if (skills.length > 0) {
            this.analysisResults.strengths.push(`✅ ${skills.length} habilidades técnicas agregadas`);
            
            if (skills.length >= 8) {
                this.analysisResults.strengths.push("📚 Amplio conjunto de habilidades técnicas");
            } else if (skills.length < 5) {
                this.analysisResults.suggestions.push("💡 Agrega más habilidades técnicas para destacar");
            }
        }
    }

    // Generar reporte completo
    generateReport() {
        return {
            score: this.analysisResults.completeness,
            summary: `Tu CV tiene un ${this.analysisResults.completeness}% de completitud`,
            strengths: this.analysisResults.strengths,
            improvements: [...this.analysisResults.warnings, ...this.analysisResults.suggestions],
            timestamp: new Date().toISOString()
        };
    }
}

// Inicializar analizador IA
document.addEventListener('DOMContentLoaded', () => {
    window.cvAnalyzer = new CVAnalyzer();
});