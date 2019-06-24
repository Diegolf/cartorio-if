const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UsuarioController {

    async registro(req, res) {
        const { email, nome, senha } = req.body;
        try {
            if (await Usuario.findOne({ email }))
                return res.status(400).send({ error: 'Email já cadastrado.', cod: 1 });

            const usuario = await Usuario.create({
                nome, email, senha
            });
            usuario.senha = undefined;
            res.send(usuario);
        } catch (e) {
            res.status(400).send({ error: 'Falha no registro.', cod: 2 });
        }
    }

    async autenticar(req, res) {
        const { email, senha } = req.body;

        try {
            const usuario = await Usuario.findOne({ email }).select('+senha');
            if (!usuario)
                return res.status(400).send({ error: 'Usuario não encontrado.', cod: 1 });

            const valido = await bcrypt.compare(senha, usuario.senha);
            if (!valido)
                return res.status(400).send({ error: 'Senha incorreta.', cod: 2 });

            const token = jwt.sign({ id: usuario._id }, process.env.SERVER_HASH, { expiresIn: 3600 });

            usuario.senha = undefined;
            return res.send({ usuario, token });

        } catch (e) {
            res.status(400).send({ error: 'Falha na autenticação.', cod: 3 });
        }
    }

    async getUsuarioById(req, res) {
        const id = req.userId;

        try {
            const user = await Usuario.findOne({ _id: id }).populate({
                path: 'certificados',
                options: { sort: { createdAt: -1 } }
            });

            res.send({ user });
        } catch (e) {
            res.status(400).send({ error: 'Usuário não encontrado' });
        }
    }
}

module.exports = new UsuarioController();