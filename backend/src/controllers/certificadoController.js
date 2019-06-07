const Certificado = require('../models/Certificado');
const Usuario = require('../models/Usuario');

class CertificadoController {
    async armazenar(req, res) {

        const userId = req.userId;
        const { nome, email, titulo, dataDoCurso, duracao, nomeDoInstrutor } = req.body;

        if ( !nome || !email || !titulo || !dataDoCurso || !duracao || !nomeDoInstrutor )
            return res.status(400).send({
                error: 'Nome, email, título, data do curso, duração e/ou nome do instrutor não informado(s).'
            });

        let usuario = {};
        try {
            usuario = await Usuario.findById(userId).select('+senha');
        }catch(e){
            return res.status(400).send({error:'Usuário não encontrado ou inválido'});
        }

        try {
            const certificado = await Certificado.create({
                nome, email, titulo, dataDoCurso, duracao, nomeDoInstrutor
            });
    
            usuario.certificados.push(certificado);
            await usuario.save();
            
            return res.send(certificado);            
        }catch(e){
            return res.status(400).send({error:'Erro ao adicionar certificado'});
        }
        
    }

    async atualiza(req, res) {
        if (req.params.id) {

            await Certificado.updateOne({ _id: req.params.id }, { assinado: true });

            return res.json({ ok: true })
        } else {
            return res.json({ ok: false });
        }
    }

    // req.query = barra de endereços ;; body = dados do corpo da requisição ;; params :variavel
    async certificados(req, res) {
        const resultadosPorBusca = 8;

        let pagina = 0;
        try {
            const parametro = parseInt(req.query.page);
            pagina = parametro ? parametro : 0;
        } catch (e) { }

        const certificados = await Certificado.find({ assinado: false }).skip(pagina * resultadosPorBusca)
            .limit(resultadosPorBusca).sort({ createdAt: 1 })

        return res.json(certificados);
    }

}

module.exports = new CertificadoController();