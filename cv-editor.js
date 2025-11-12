// cv-editor.js - Editor en tiempo real CORREGIDO

class CVEditor {
    constructor() {
        this.cvData = {
            personal: {
                name: '',
                title: '',
                location: ''
            },
            summary: '',
            experience: [],
            skills: [],
            education: [],
            template: 'modern'
        };
        
        this.init();
    }

    init() {
        this.initializeEventListeners();
        this.loadFromLocalStorage();
        this.updatePreview();
        this.setupAutoSave();
    }

    initializeEventListeners() {
        // Información Personal
        const inputName = document.getElementById('inputName');
        const inputTitle = document.getElementById('inputTitle');
        const inputLocation = document.getElementById('inputLocation');
        const inputSummary = document.getElementById('inputSummary');

        if (inputName) {
            inputName.addEventListener('input', (e) => {
                this.cvData.personal.name = e.target.value;
                this.updatePreview();
            });
        }

        if (inputTitle) {
            inputTitle.addEventListener('input', (e) => {
                this.cvData.personal.title = e.target.value;
                this.updatePreview();
            });
        }

        if (inputLocation) {
            inputLocation.addEventListener('input', (e) => {
                this.cvData.personal.location = e.target.value;
                this.updatePreview();
            });
        }

        // Resumen
        if (inputSummary) {
            inputSummary.addEventListener('input', (e) => {
                this.cvData.summary = e.target.value;
                this.updatePreview();
            });
        }

        // Skills
        const addSkillBtn = document.getElementById('addSkill');
        const inputSkill = document.getElementById('inputSkill');

        if (addSkillBtn) {
            addSkillBtn.addEventListener('click', () => {
                this.addSkill();
            });
        }

        if (inputSkill) {
            inputSkill.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addSkill();
                }
            });
        }

        // Experiencia
        const addExperienceBtn = document.getElementById('addExperience');
        if (addExperienceBtn) {
            addExperienceBtn.addEventListener('click', () => {
                this.addExperience();
            });
        }

        // Educación
        const addEducationBtn = document.getElementById('addEducation');
        if (addEducationBtn) {
            addEducationBtn.addEventListener('click', () => {
                this.addEducation();
            });
        }

        // Plantillas
        document.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const template = e.currentTarget.dataset.template;
                this.changeTemplate(template);
                
                document.querySelectorAll('.template-card').forEach(c => {
                    c.classList.remove('active');
                });
                e.currentTarget.classList.add('active');
            });
        });

        // Guardar
        const saveBtn = document.getElementById('saveCV');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveToLocalStorage();
                if (window.cvApp) {
                    window.cvApp.showNotification('CV guardado correctamente', 'success');
                }
            });
        }
    }

    addSkill() {
        const skillInput = document.getElementById('inputSkill');
        if (!skillInput) return;
        
        const skill = skillInput.value.trim();
        
        if (skill && !this.cvData.skills.includes(skill)) {
            this.cvData.skills.push(skill);
            this.updateSkillsList();
            skillInput.value = '';
            this.updatePreview();
            
            if (window.cvAnalyzer) {
                window.cvAnalyzer.analyzeSkills(this.cvData.skills);
            }
        }
    }

    removeSkill(skill) {
        this.cvData.skills = this.cvData.skills.filter(s => s !== skill);
        this.updateSkillsList();
        this.updatePreview();
    }

    updateSkillsList() {
        const skillsList = document.getElementById('skillsList');
        if (!skillsList) return;

        skillsList.innerHTML = '';

        this.cvData.skills.forEach(skill => {
            const skillElement = document.createElement('span');
            skillElement.className = 'skill-tag';
            skillElement.innerHTML = `
                ${skill}
                <button class="remove-skill" onclick="window.cvEditor.removeSkill('${skill.replace(/'/g, "\\'")}')">
                    <i class="fas fa-times"></i>
                </button>
            `;
            skillsList.appendChild(skillElement);
        });
    }

    addExperience() {
        const experience = {
            id: Date.now() + Math.random(),
            position: '',
            company: '',
            period: '',
            description: ''
        };
        
        this.cvData.experience.push(experience);
        this.updateExperienceList();
        this.updatePreview();
    }

    updateExperienceField(id, field, value) {
        const experience = this.cvData.experience.find(exp => exp.id === id);
        if (experience) {
            experience[field] = value;
            this.updatePreview();
        }
    }

    removeExperience(id) {
        this.cvData.experience = this.cvData.experience.filter(exp => exp.id !== id);
        this.updateExperienceList();
        this.updatePreview();
    }

    updateExperienceList() {
        const experienceList = document.getElementById('experienceList');
        if (!experienceList) return;

        experienceList.innerHTML = '';

        this.cvData.experience.forEach((exp) => {
            const expElement = document.createElement('div');
            expElement.className = 'form-section experience-item';
            expElement.innerHTML = `
                <div class="form-group">
                    <label>Puesto</label>
                    <input type="text" 
                           value="${exp.position || ''}" 
                           placeholder="Ej: Desarrollador Full Stack"
                           oninput="window.cvEditor.updateExperienceField(${exp.id}, 'position', this.value)">
                </div>
                <div class="form-group">
                    <label>Empresa</label>
                    <input type="text" 
                           value="${exp.company || ''}" 
                           placeholder="Ej: Tech Company"
                           oninput="window.cvEditor.updateExperienceField(${exp.id}, 'company', this.value)">
                </div>
                <div class="form-group">
                    <label>Periodo</label>
                    <input type="text" 
                           value="${exp.period || ''}" 
                           placeholder="Ej: 2020 - 2023"
                           oninput="window.cvEditor.updateExperienceField(${exp.id}, 'period', this.value)">
                </div>
                <div class="form-group">
                    <label>Descripción</label>
                    <textarea placeholder="Describe tus responsabilidades y logros..."
                              oninput="window.cvEditor.updateExperienceField(${exp.id}, 'description', this.value)">${exp.description || ''}</textarea>
                </div>
                <button type="button" class="btn btn-add-small" onclick="window.cvEditor.removeExperience(${exp.id})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            `;
            experienceList.appendChild(expElement);
        });
    }

    addEducation() {
        const education = {
            id: Date.now() + Math.random(),
            degree: '',
            institution: '',
            period: ''
        };
        
        this.cvData.education.push(education);
        this.updateEducationList();
        this.updatePreview();
    }

    updateEducationField(id, field, value) {
        const education = this.cvData.education.find(edu => edu.id === id);
        if (education) {
            education[field] = value;
            this.updatePreview();
        }
    }

    removeEducation(id) {
        this.cvData.education = this.cvData.education.filter(edu => edu.id !== id);
        this.updateEducationList();
        this.updatePreview();
    }

    updateEducationList() {
        const educationList = document.getElementById('educationList');
        if (!educationList) return;

        educationList.innerHTML = '';

        this.cvData.education.forEach((edu) => {
            const eduElement = document.createElement('div');
            eduElement.className = 'form-section education-item';
            eduElement.innerHTML = `
                <div class="form-group">
                    <label>Título/Carrera</label>
                    <input type="text" 
                           value="${edu.degree || ''}" 
                           placeholder="Ej: Licenciatura en Informática"
                           oninput="window.cvEditor.updateEducationField(${edu.id}, 'degree', this.value)">
                </div>
                <div class="form-group">
                    <label>Institución</label>
                    <input type="text" 
                           value="${edu.institution || ''}" 
                           placeholder="Ej: Universidad Nacional"
                           oninput="window.cvEditor.updateEducationField(${edu.id}, 'institution', this.value)">
                </div>
                <div class="form-group">
                    <label>Periodo</label>
                    <input type="text" 
                           value="${edu.period || ''}" 
                           placeholder="Ej: 2016 - 2020"
                           oninput="window.cvEditor.updateEducationField(${edu.id}, 'period', this.value)">
                </div>
                <button type="button" class="btn btn-add-small" onclick="window.cvEditor.removeEducation(${edu.id})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            `;
            educationList.appendChild(eduElement);
        });
    }

    changeTemplate(template) {
        this.cvData.template = template;
        
        const cvPreview = document.getElementById('cvPreview');
        if (cvPreview) {
            cvPreview.className = 'cv-preview ' + template + '-template';
        }
        
        this.updatePreview();
    }

    updatePreview() {
        // Información Personal - CON VALIDACIÓN SEGURA
        const previewName = document.getElementById('previewName');
        const previewTitle = document.getElementById('previewTitle');
        const previewLocation = document.getElementById('previewLocation');
        const previewSummary = document.getElementById('previewSummary');
        const previewExperience = document.getElementById('previewExperience');
        const previewSkills = document.getElementById('previewSkills');
        const previewEducation = document.getElementById('previewEducation');

        if (previewName) {
            previewName.textContent = this.cvData.personal.name || 'Tu Nombre Completo';
        }
        if (previewTitle) {
            previewTitle.textContent = this.cvData.personal.title || 'Título Profesional';
        }
        if (previewLocation) {
            previewLocation.textContent = this.cvData.personal.location || 'Ciudad, País';
        }
        if (previewSummary) {
            previewSummary.textContent = this.cvData.summary || 'Aquí aparecerá tu resumen profesional...';
        }

        // Experiencia
        if (previewExperience) {
            previewExperience.innerHTML = '';

            if (this.cvData.experience.length === 0) {
                previewExperience.innerHTML = '<div class="experience-item"><p>Agrega tu experiencia laboral</p></div>';
            } else {
                this.cvData.experience.forEach(exp => {
                    const expElement = document.createElement('div');
                    expElement.className = 'experience-item';
                    expElement.innerHTML = `
                        <h4>${exp.position || 'Puesto'}</h4>
                        <div class="company">${exp.company || 'Empresa'}</div>
                        <div class="period">${exp.period || 'Periodo'}</div>
                        <p>${exp.description || 'Descripción de responsabilidades y logros'}</p>
                    `;
                    previewExperience.appendChild(expElement);
                });
            }
        }

        // Habilidades
        if (previewSkills) {
            previewSkills.innerHTML = '';

            if (this.cvData.skills.length === 0) {
                previewSkills.innerHTML = '<span class="skill-tag">Tus habilidades aparecerán aquí</span>';
            } else {
                this.cvData.skills.forEach(skill => {
                    const skillElement = document.createElement('span');
                    skillElement.className = 'skill-tag';
                    skillElement.textContent = skill;
                    previewSkills.appendChild(skillElement);
                });
            }
        }

        // Educación
        if (previewEducation) {
            previewEducation.innerHTML = '';

            if (this.cvData.education.length === 0) {
                previewEducation.innerHTML = '<div class="education-item"><p>Agrega tu formación académica</p></div>';
            } else {
                this.cvData.education.forEach(edu => {
                    const eduElement = document.createElement('div');
                    eduElement.className = 'education-item';
                    eduElement.innerHTML = `
                        <h4>${edu.degree || 'Título'}</h4>
                        <div class="institution">${edu.institution || 'Institución'}</div>
                        <div class="period">${edu.period || 'Periodo'}</div>
                    `;
                    previewEducation.appendChild(eduElement);
                });
            }
        }

        // Análisis IA automático
        if (window.cvAnalyzer) {
            window.cvAnalyzer.analyzeCV(this.cvData);
        }

        // Auto-guardar
        this.saveToLocalStorage();
    }

    setupAutoSave() {
        setInterval(() => {
            this.saveToLocalStorage();
        }, 30000);
    }

    saveToLocalStorage() {
        try {
            localStorage.setItem('cvData', JSON.stringify(this.cvData));
        } catch (error) {
            console.error('Error guardando en localStorage:', error);
        }
    }

    loadFromLocalStorage() {
        try {
            const savedData = localStorage.getItem('cvData');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.cvData = { ...this.cvData, ...data };
                
                // Actualizar inputs
                const inputName = document.getElementById('inputName');
                const inputTitle = document.getElementById('inputTitle');
                const inputLocation = document.getElementById('inputLocation');
                const inputSummary = document.getElementById('inputSummary');

                if (inputName) inputName.value = this.cvData.personal.name || '';
                if (inputTitle) inputTitle.value = this.cvData.personal.title || '';
                if (inputLocation) inputLocation.value = this.cvData.personal.location || '';
                if (inputSummary) inputSummary.value = this.cvData.summary || '';
                
                // Actualizar listas
                this.updateSkillsList();
                this.updateExperienceList();
                this.updateEducationList();
                
                // Actualizar plantilla activa
                document.querySelectorAll('.template-card').forEach(card => {
                    card.classList.remove('active');
                    if (card.dataset.template === this.cvData.template) {
                        card.classList.add('active');
                    }
                });
            }
        } catch (e) {
            console.log('Error cargando datos guardados:', e);
        }
    }

    loadData(data) {
        this.cvData = { ...this.cvData, ...data };
        this.updatePreview();
    }

    getCVData() {
        return this.cvData;
    }
}

// Inicializar editor
document.addEventListener('DOMContentLoaded', () => {
    window.cvEditor = new CVEditor();
});