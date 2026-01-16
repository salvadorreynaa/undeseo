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
        if (!field.value.trim()) {
            field.classList.add('error');
            showNotification(`⚠️ Por favor completa: ${field.previousElementSibling.textContent}`, 'error');
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

// Copiar email al portapapeles
function copiarEmail() {
    const emailContent = document.getElementById('emailContent');
    emailContent.select();
    document.execCommand('copy');
    showNotification('✅ Email copiado al portapapeles', 'success');
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

// Generar contenido del email
function generarEmail() {
    const formData = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        pais: document.getElementById('pais').value,
        celular: document.getElementById('celular').value,
        instagram: document.getElementById('instagram').value || 'No proporcionó',
        tiktok: document.getElementById('tiktok').value || 'No proporcionó',
        linkedin: document.getElementById('linkedin').value || 'No proporcionó',
        otro: document.getElementById('otro').value || 'No proporcionó',
        deseo: document.getElementById('deseo').value,
        historia: document.getElementById('historia').value
    };

    const emailBody = `Hola UnDeseo,

Me gustaría ser parte de UnDeseo compartiendo mi deseo con la comunidad.

=== DATOS PERSONALES ===
Nombre: ${formData.nombre}
Email: ${formData.email}
País/Ciudad: ${formData.pais}
Celular: ${formData.celular}

=== REDES SOCIALES ===
Instagram: ${formData.instagram}
TikTok: ${formData.tiktok}
LinkedIn: ${formData.linkedin}
Otra Red: ${formData.otro}

=== MI DESEO ===
${formData.deseo}

=== MI HISTORIA ===
${formData.historia}

---
Enviado desde UnDeseo.site
`;

    return emailBody;
}

// Manejar envío del formulario
document.getElementById('wishForm').addEventListener('submit', function(e) {
    e.preventDefault();

    if (!validateStep(totalSteps)) {
        return;
    }

    // Generar el email
    const emailContent = generarEmail();

    // Mostrar el email en textarea
    document.getElementById('emailContent').value = emailContent;

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

    showNotification('📋 Email preparado - cópialo y envía a enviar@undeseo.site', 'info');
});

// Eliminar clase error cuando el usuario empieza a escribir
document.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('focus', function() {
        this.classList.remove('error');
    });
});

// Inicializar
updateProgress();
