const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

class UsuarioController {

    async registro(req, res) {
        const { email } = req.body;
        try {
            if (await Usuario.findOne({ email }))
                return res.status(400).send({ error: 'Email já cadastrado' });

            const usuario = await Usuario.create({
                nome: req.body.nome,
                email: req.body.email,
                senha: req.body.senha
            });
            usuario.senha = undefined;
            res.send(usuario);
        } catch (e) {
            res.status(400).send({ error: 'Falha no registro' });
        }
    }

    async autenticar(req, res) {
        const { email, senha } = req.body;

        try {
            const usuario = await Usuario.findOne({ email }).select('+senha');
            if (!usuario)
                return res.status(400).send({ error: 'Usuario não encontrado' });

            if (!await bcrypt.compare(senha, usuario.senha))
                return res.status(400).send({error: 'Senha incorreta'});

            const token = jwt.sign({ id: usuario._id}, authConfig.segredo, {expiresIn: 3600});

            usuario.senha = undefined;
            return res.send({usuario, token});

        }catch(e){
            res.status(400).send({error: 'Falha na autenticação'});
        }
    }

    async getUsuarioById(req, res){
        const id = req.userId;

        try{
            const user = await Usuario.findOne({_id: id});

            res.send({user});
        }catch(e){
            res.status(400).send({error:'Usuário não encontrado'})
        }
    }
}

module.exports = new UsuarioController();