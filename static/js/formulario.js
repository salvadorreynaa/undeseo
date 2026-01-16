// Variables globales
let currentStep = 1;
const totalSteps = 5;

// Inicializar EmailJS
emailjs.init("Aoxo-KSDrkcZ61mNf");

// Ir al siguiente paso
function nextStep() {
    // Validar paso actual
    if (validateStep(currentStep)) {
        if (currentStep < totalSteps) {
            document.getElementById(`step${currentStep}`).classList.remove('active');
            currentStep++;
            document.getElementById(`step${currentStep}`).classList.add('active');
            updateProgress();
            updateSummary();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
}

// Ir al paso anterior
function prevStep() {
    if (currentStep > 1) {
        document.getElementById(`step${currentStep}`).classList.remove('active');
        currentStep--;
        document.getElementById(`step${currentStep}`).classList.add('active');
        updateProgress();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Actualizar barra de progreso
function updateProgress() {
    const progress = (currentStep / totalSteps) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('stepNumber').textContent = currentStep;
}

// Actualizar resumen
function updateSummary() {
    if (currentStep === totalSteps) {
        document.getElementById('summaryNombre').textContent = document.getElementById('nombre').value || '-';
        document.getElementById('summaryPais').textContent = document.getElementById('pais').value || '-';
        document.getElementById('summaryDeseo').textContent = document.getElementById('deseo').value || '-';
    }
}

// Validar campos del paso
function validateStep(step) {
    const fields = {
        1: ['nombre', 'pais', 'celular'],
        2: [],  // Opcional
        3: ['deseo'],
        4: ['historia'],
        5: []   // Foto es opcional
    };

    const fieldsToValidate = fields[step] || [];
    
    for (let fieldId of fieldsToValidate) {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            field.classList.add('error');
            showNotification(`Por favor completa el campo "${field.previousElementSibling.textContent}"`, 'error');
            return false;
        } else {
            field.classList.remove('error');
        }
    }
    return true;
}

// Preview de imagen
function previewImage() {
    const file = document.getElementById('foto').files[0];
    const preview = document.getElementById('imagePreview');
    
    if (file) {
        // Validar tamaño
        if (file.size > 2 * 1024 * 1024) {
            showNotification('La foto debe pesar menos de 2 MB', 'error');
            document.getElementById('foto').value = '';
            preview.innerHTML = '';
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `
                <div class="preview-image">
                    <img src="${e.target.result}" alt="Preview">
                    <button type="button" class="btn-remove-image" onclick="removeImage()">✕</button>
                </div>
            `;
        };
        reader.readAsDataURL(file);
    }
}

// Remover imagen
function removeImage() {
    document.getElementById('foto').value = '';
    document.getElementById('imagePreview').innerHTML = '';
}

// Mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Manejar envío del formulario
document.getElementById('wishForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!validateStep(totalSteps)) {
        return;
    }
    
    // Recopilar datos
    const formData = {
        nombre: document.getElementById('nombre').value,
        pais: document.getElementById('pais').value,
        celular: document.getElementById('celular').value,
        instagram: document.getElementById('instagram').value || 'No proporcionó',
        tiktok: document.getElementById('tiktok').value || 'No proporcionó',
        linkedin: document.getElementById('linkedin').value || 'No proporcionó',
        otro: document.getElementById('otro').value || 'No proporcionó',
        deseo: document.getElementById('deseo').value,
        historia: document.getElementById('historia').value,
        foto: document.getElementById('foto').value ? 'Sí - Adjuntada' : 'No'
    };
    
    // Mostrar indicador de carga
    showNotification('📤 Enviando tu deseo...', 'info');
    const submitBtn = document.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    try {
        // Enviar con EmailJS
        const response = await emailjs.send(
            'service_4qstdcm',
            'template_h81e4jg',
            {
                to_email: 'enviar@undeseo.site',
                nombre: formData.nombre,
                pais: formData.pais,
                celular: formData.celular,
                instagram: formData.instagram,
                tiktok: formData.tiktok,
                linkedin: formData.linkedin,
                otro: formData.otro,
                deseo: formData.deseo,
                historia: formData.historia,
                foto: formData.foto
            }
        );
        
        // Éxito
        showNotification('✅ ¡Deseo enviado correctamente!', 'success');
        
        // Limpiar localStorage
        localStorage.removeItem('wishFormData');
        
        // Resetear formulario después de 2 segundos
        setTimeout(() => {
            document.getElementById('wishForm').reset();
            currentStep = 1;
            document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
            document.getElementById('step1').classList.add('active');
            updateProgress();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            document.getElementById('imagePreview').innerHTML = '';
            
            showNotification('📝 Formulario listo para un nuevo deseo', 'info');
        }, 2000);
        
    } catch (error) {
        console.error('Error al enviar:', error);
        showNotification('❌ Error al enviar. Intenta de nuevo.', 'error');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// Eliminar clase error cuando el usuario empieza a escribir
document.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('focus', function() {
        this.classList.remove('error');
    });
});

// Inicializar
updateProgress();
