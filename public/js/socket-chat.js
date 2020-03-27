var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala') ) {
    window.location = 'index.html';
    throw new Error('El nombre y la sala son requeridos');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('entrarChat', usuario)
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
socket.emit('enviarMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
});

// Escuchar información
socket.on('enviarMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});

socket.on('entrarChat', (usuariosConectados) => {
    console.log(usuariosConectados);
});

socket.on('crearMensaje', (usuariosConectados) => {
    console.log(usuariosConectados);
});
socket.on('listaPersonas', (usuariosConectados) => {
    console.log(usuariosConectados);
});

socket.on('mensajePrivado', (mensaje) => {
    console.log(mensaje);
});