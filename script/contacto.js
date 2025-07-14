document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formularioContacto');

    // Definición de los campos con sus mensajes de error
    const campos = {
        tuNombre: {
            input: document.getElementById('tuNombre'),
            mensajeVacio: 'Por favor, ingresa tu nombre.'
        },
        tuCorreo: {
            input: document.getElementById('tuCorreo'),
            mensajeVacio: 'El correo electrónico es obligatorio.',
            mensajeInvalido: 'Ingresa un correo electrónico válido.'
        },
        asunto: {
            input: document.getElementById('asunto'),
            mensajeVacio: 'Por favor, ingresa un asunto.'
        },
        tuMensaje: {
            input: document.getElementById('tuMensaje'),
            mensajeVacio: 'Por favor, ingresa tu mensaje.'
        }
    };

    // Valida formato de correo electrónico
    const esCorreoValido = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

    // Muestra u oculta mensaje de error en un campo
    const mostrarEstadoCampo = (input, esValido, mensaje = '') => {
        const contenedor = input.parentNode;
        const textoError = contenedor.querySelector('.texto-error');
        contenedor.classList.toggle('error', !esValido);
        textoError.textContent = esValido ? '' : mensaje;
    };

    // Verifica que el campo no esté vacío y que el correo sea válido
    const validarCampo = ({ input, mensajeVacio, mensajeInvalido = '' }) => {
        const valor = input.value.trim();
        if (valor === '') {
            mostrarEstadoCampo(input, false, mensajeVacio);
            return false;
        }
        if (input.id === 'tuCorreo' && !esCorreoValido(valor)) {
            mostrarEstadoCampo(input, false, mensajeInvalido);
            return false;
        }
        mostrarEstadoCampo(input, true);
        return true;
    };

    // Valida campo individual al cambiar su valor
    Object.values(campos).forEach(({ input, mensajeVacio, mensajeInvalido }) => {
        input.addEventListener('change', () => {
            validarCampo({ input, mensajeVacio, mensajeInvalido });
        });
    });

    // Valida el formulario completo y lo envía si es válido
    formulario.addEventListener('submit', (e) => {
        e.preventDefault();

        const esFormularioValido = Object.values(campos).every((campo) =>
            validarCampo(campo)
        );

        if (!esFormularioValido) {
            console.warn('El formulario no es válido.');
            return;
        }

        // Envío del formulario a Formspree
        fetch('https://formspree.io/f/mldnqlgj', {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: new FormData(formulario)
        })
        .then(response => {
            const exito = document.getElementById('mensajeExito');
            const error = document.getElementById('mensajeError');

            if (response.ok) {
                exito.style.display = 'block';
                error.style.display = 'none';
                formulario.reset();
            } else {
                exito.style.display = 'none';
                error.style.display = 'block';
            }
        })
        .catch(() => {
            document.getElementById('mensajeExito').style.display = 'none';
            document.getElementById('mensajeError').style.display = 'block';
        });
    });
});
