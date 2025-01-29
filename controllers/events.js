const {response} = require('express');
const Evento = require('../models/Evento');

const getEventos = async(req, res = response) => {

    try{
        const eventos = await Evento.find()
            .populate('user','name');

        return res.status(200).json({
            ok: true,
            eventos
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Póngase en contacto con el administrador'
        });
    }
}

const crearEvento = async(req, res = response) => {

    const evento = new Evento(req.body);
    try{
        evento.user = req.uid;
        const eventoGuardado = await evento.save();
        return res.status(200).json({
            ok: true,
            eventoGuardado
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Póngase en contacto con el administrador'
        });
    }
}

const actualizarEvento = async(req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try{
        
        const evento = await Evento.findById(eventoId);
        if(!evento){
            return res.status(404).json({
                ok: false,
                msg: 'El evento no existe'
            });
        }

        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene permisos para editar el evento'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, {new: true});

        return res.status(200).json({
            ok: true,
            evento: eventoActualizado
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Póngase en contacto con el administrador'
        });
    }
}

const eliminarEvento = async(req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try{

        const evento = await Evento.findById(eventoId);
        if(!evento){
            return res.status(404).json({
                ok: false,
                msg: 'El evento no existe'
            });
        }

        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene permisos para eliminar el evento'
            });
        }

        await Evento.findByIdAndDelete(eventoId);

        return res.status(200).json({
            ok: true,
            msg: 'Evento Eliminado'
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'No se pudo consumir eliminarEvento'
        });
    }
}

module.exports = {crearEvento, actualizarEvento, getEventos, eliminarEvento};