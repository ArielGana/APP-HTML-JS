window.addEventListener('beforeunload', function(event) {
    // Verifica si la URL contiene "?accion=asis"
    if (window.location.search.includes('?accion=asis')) {
        // Elimina "?accion=asis" de la URL sin recargar la página
        var newUrl = window.location.href.replace('?accion=asis', '');
        history.replaceState(null, '', newUrl);
    }
});

// Funciones de redirección
function irMusica() {
    window.location.href = 'index.html?accion=musica';
}

function irMapa() {
    window.location.href = 'index.html?accion=mapa';
}

function irAsis() {
    window.location.href = 'user.html?accion=asis';
}

// Verificación de sesión y redireccionamiento usando jQuery
$(document).ready(function () {
    // Realizar una solicitud AJAX para verificar la sesión
    $.getJSON('https://bodaivancarolina.000webhostapp.com/files/verificar_sesion.php', function (data) {
        if (data.authenticated) {
            // Usuario autenticado, mostrar enlace de cerrar sesión y ocultar enlace de inicio de sesión
            $('#login-link').hide();
            $('#logout-link').show();

            // Redireccionar al hacer clic en el enlace de usuario
            $('#user-link').click(function () {
                // Aquí puedes redirigir a la página de perfil del usuario
                window.location.href = 'user.html'; // Cambia a la página de perfil del usuario
            });

            // Mostrar contenido autenticado
            $('#contenido-autenticado').show();
            $('#nombre-usuario').text(data.username);
            document.getElementById("agradecimiento").innerText = "Querido " + data.nombre + ", Gracias por tener la intención de querer aportar con un generoso obsequio para celebrar el día más especial de mi vida. Tu amabilidad y la atención que has puesto en elegir un presente para nuestra boda han añadido un toque aún más especial a este momento inolvidable. Estamos verdaderamente agradecidos por tu generosidad y por ser parte de este capítulo tan importante de nuestras vidas. Tu gesto no solo es algo material, sino un reflejo de tu cariño y aprecio, y lo apreciamos enormemente. Gracias por ser parte de nuestra celebración y por compartir este día tan especial con nosotros." +
                "\n\n\nCon gratitud" + "\n\nFamilia Gana Ramos";

        } else {
            // Usuario no autenticado, mostrar enlace de inicio de sesión y ocultar enlace de cerrar sesión
            $('#login-link').show();
            $('#logout-link').hide();

            // Redireccionar al hacer clic en el enlace de usuario
            $('#user-link').click(function () {
                // Aquí puedes redirigir a la página de inicio de sesión
                window.location.href = 'ingreso.html'; // Redirige a la página de inicio de sesión
            });

            // Mostrar contenido no autenticado
            $('#contenido-no-autenticado').show();
        }
    });

    // Otra verificación de sesión y manipulación de datos del usuario usando jQuery
    $.getJSON('https://bodaivancarolina.000webhostapp.com/files/verificar_sesion.php', function (data) {
        if (data.authenticated) {
            $('#login-link').hide();
            $('#logout-link').show();
            $('#user-link').attr('href', 'user.html'); // Cambiar el enlace al perfil del usuario
            $('#contenido-autenticado').show();
            cargarDatosUsuario(data.username); // Pasar el correo electrónico del usuario a la función
            $('#contenido-no-autenticado').hide();
        } else {
            $('#login-link').show();
            $('#logout-link').hide();
            $('#user-link').attr('href', 'ingreso.html'); // Cambiar el enlace al inicio de sesión
            $('#contenido-no-autenticado').show();
            $('#contenido-autenticado').hide();
        }
    });

    function cargarDatosUsuario(usuario) {
        $.getJSON('https://bodaivancarolina.000webhostapp.com/files/get_user.php?correo=' + usuario, function (data) {
            mostrarDatosUsuario(data);
        });
    }

    function mostrarDatosUsuario(data) {
        $('#rut').val(data.rut);
        $('#nombre').val(data.nombre);
        $('#telefono').val(data.telefono);
        $('#correo').val(data.correo);
        // No se debe mostrar la contraseña en un campo de texto, por motivos de seguridad
        // Opcionalmente, podrías mostrar un mensaje indicando que la contraseña está configurada
        if (data.confirmacion === "si") {
            $('#confirmacion-si').prop('checked', true);
        } else if (data.confirmacion === "no") {
            $('#confirmacion-no').prop('checked', true);
        }
        $('#regalo').val(data.regalo);
    }

    $('#editar').click(function () {
        $('input, textarea').prop('disabled', false);
        $('#editar').hide();
        $('#guardar').show();
    });

    $('#guardar').click(function () {
        // Realizar acciones para guardar los cambios
        // Aquí puedes realizar una solicitud AJAX para guardar los cambios en el servidor si es necesario
        $('input, textarea').prop('disabled', true);
        $('#guardar').hide();
        $('#editar').show();
    });
});

// Script para manipular campos de usuario en el DOM
document.addEventListener("DOMContentLoaded", function () {
    const editarButton = document.getElementById("editar");
    const guardarButton = document.getElementById("guardar");
    const editableFields = document.querySelectorAll(".user-field input[type='text'], .user-field input[type='email'], .user-field input[type='password']");

    editarButton.addEventListener("click", function () {
        editableFields.forEach(function (field) {
            if (field.id !== "rut") {
                field.removeAttribute("disabled");
            }
        });

        editarButton.style.display = "none";
        guardarButton.style.display = "block";
    });

    guardarButton.addEventListener("click", function () {
        const formData = new FormData();

        formData.append("rut", document.getElementById("rut").value);
        formData.append("nombre", document.getElementById("nombre").value);
        formData.append("contrasena", document.getElementById("contrasena").value);
        formData.append("telefono", document.getElementById("telefono").value);
        formData.append("correo", document.getElementById("correo").value);
        formData.append("confirmacion", document.querySelector(".user-field input[type='radio']:checked").value);

        fetch("https://bodaivancarolina.000webhostapp.com/files/edit_user.php", {
            method: "POST",
            body: formData
        })
            .then(response => response.text())
            .then(data => {
                mostrarMensaje(data);
                console.log(data); // Puedes hacer algo con la respuesta del servidor aquí
            })
            .catch(error => {
                console.error("Error al enviar la solicitud:", error);
            });
    });

    function mostrarMensaje(mensaje) {
        const mensajeBox = document.createElement("div");
        mensajeBox.classList.add("mensaje-box");
        mensajeBox.textContent = mensaje;

        document.body.appendChild(mensajeBox);

        // Elimina el mensaje después de unos segundos
        setTimeout(function () {
            mensajeBox.remove();
        }, 5000); // Cambia 5000 por el tiempo en milisegundos que deseas que el mensaje se muestre
    }
});

// Script para cambiar el color de fondo intermitentemente
function irAsis() {
    var elementoAsis = document.getElementById('asistencia');

    if (elementoAsis) {
        var intermitente = true;

        var intervalo = setInterval(function () {
            // Cambiar color a rojo
            if (intermitente) {
                elementoAsis.style.backgroundColor = '#FF7B7B';
            } else {
                elementoAsis.style.backgroundColor = '#ffffff'; // Color original
            }

            intermitente = !intermitente; // Alternar entre rojo y blanco
        }, 500); // Cambia cada 500 milisegundos (0.5 segundos)

        setTimeout(function () {
            // Restaurar color original después de 3 segundos
            clearInterval(intervalo);
            elementoAsis.style.backgroundColor = '#ffffff'; // Color original
        }, 3000);
    }
}

// Script para ejecutar la función irAsis() según los parámetros de la URL
document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const accion = params.get('accion');

    if (accion === 'asis') {
        irAsis(); // Puedes ajustar el tiempo según tus necesidades
    }
});