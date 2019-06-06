const Usuario = require('../models/Usuario');

class AuthController {
    async registro(req, res) {
        const {email} = req.body;
        try{
            if(await Usuario.findOne({email}))
                return res.status(400).send({error: 'Email já cadastrado'});

            const usuario = await Usuario.create({
                nome: req.body.nome,
                email: req.body.email,
                senha: req.body.senha
            });
            usuario.senha = undefined;
            res.send(usuario);
        }catch(e){
            res.status(400).send({error: 'Falha no registro'});
        }
    }
}

module.exports = new AuthController();

