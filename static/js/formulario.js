// Variables globales
let currentStep = 1;
const totalSteps = 5;

// Ir al siguiente paso
function nextStep() {
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
        document.getElementById('summaryDeseo').textContent = document.getElementById('deseo').value.substring(0, 100) + '...' || '-';
    }
}

// Validar campos del paso
function validateStep(step) {
    const fields = {
        1: ['nombre', 'email', 'pais', 'celular'],
        2: [],
        3: ['deseo'],
        4: ['historia'],
        5: []
    };

    const fieldsToCheck = fields[step] || [];

    for (let fieldId of fieldsToCheck) {
        const field = document.getElementById(fieldId);
        const label = field.previousElementSibling?.textContent || fieldId;
        
        // Validar que no esté vacío
        if (!field.value.trim()) {
            field.classList.add('error');
            showNotification(`⚠️ Por favor completa: ${label}`, 'error');
            return false;
        }

        // Validación especial para email
        if (fieldId === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value.trim())) {
                field.classList.add('error');
                showNotification('⚠️ Por favor ingresa un email válido', 'error');
                return false;
            }
        }

        // Validación especial para celular (al menos 7 dígitos)
        if (fieldId === 'celular') {
            const phoneRegex = /\d{7,}/;
            if (!phoneRegex.test(field.value.replace(/\s/g, ''))) {
                field.classList.add('error');
                showNotification('⚠️ Por favor ingresa un número de celular válido (mínimo 7 dígitos)', 'error');
                return false;
            }
        }

        // Validación de longitud mínima para deseo (mínimo 10 caracteres)
        if (fieldId === 'deseo' && field.value.trim().length < 10) {
            field.classList.add('error');
            showNotification('⚠️ Por favor describe tu deseo con más detalle (mínimo 10 caracteres)', 'error');
            return false;
        }

        // Validación de longitud mínima para historia (mínimo 20 caracteres)
        if (fieldId === 'historia' && field.value.trim().length < 20) {
            field.classList.add('error');
            showNotification('⚠️ Por favor cuéntanos tu historia con más detalle (mínimo 20 caracteres)', 'error');
            return false;
        }
    }

    return true;
}

// Preview de imagen
function previewImage() {
    const file = document.getElementById('foto').files[0];
    const preview = document.getElementById('imagePreview');

    if (file) {
        // Validar tamaño (2 MB máximo)
        if (file.size > 2 * 1024 * 1024) {
            showNotification('❌ La imagen debe ser menor a 2 MB', 'error');
            document.getElementById('foto').value = '';
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

// Compatibilidad - ya no necesario con FormSubmit.co
function copiarEmail() {
    showNotification('Tu formulario será enviado directamente', 'info');
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

// Ya no es necesario generar email manualmente - FormSubmit.co lo maneja
function generarEmail() {
    return '';
}

// Manejar envío del formulario con FormSubmit.co
document.getElementById('wishForm').addEventListener('submit', function(e) {
    if (!validateStep(totalSteps)) {
        e.preventDefault();
        return;
    }

    // No prevenir el evento - dejar que FormSubmit.co lo maneje
    // e.preventDefault();

    // Mostrar sección de preview
    document.getElementById('emailPreview').style.display = 'block';

    // Scroll a la sección de email
    setTimeout(() => {
        document.getElementById('emailPreview').scrollIntoView({ behavior: 'smooth' });
    }, 300);

    // Guardar datos en localStorage
    localStorage.setItem('wishFormData', JSON.stringify({
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        pais: document.getElementById('pais').value
    }));

    showNotification('📬 Enviando tu deseo...', 'info');
    // FormSubmit.co manejará el envío automáticamente
}, false);

// Eliminar clase error cuando el usuario empieza a escribir
document.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('focus', function() {
        this.classList.remove('error');
    });
});

// Inicializar
updateProgress();
