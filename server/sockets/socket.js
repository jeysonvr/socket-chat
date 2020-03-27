const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (usuario, callback) => {

        if (!usuario.nombre || !usuario.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            });
        }

        client.join( usuario.sala );

        let userList = usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala);
        client.broadcast.to( usuario.sala ).emit('entrarChat', usuarios.getPersonasPorSala(usuario.sala));

        client.broadcast.to( usuario.sala ).emit('crearMensaje', {
            usuario: 'Administrador',
            mensaje: `${ usuario.nombre } se ha unido al chat`
        });
    });

    client.on('crearMensaje', (data) => {

        let usuario = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(usuario.nombre, data.mensaje);

        client.broadcast.to(usuario.data).emit('crearMensaje', mensaje);

    });

    client.on('mensajePrivado', (data) => {

        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(persona.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));

    });

    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);

        client.broadcast.to( personaBorrada.sala ).emit('crearMensaje', crearMensaje('Administrador', `${ personaBorrada.nombre } salio`));
        client.broadcast.to( personaBorrada.sala ).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala));
    });

});