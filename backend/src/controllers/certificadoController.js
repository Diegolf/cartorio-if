const Certificado = require('../models/Certificado');

class CertificadoController {
    async armazenar(req, res) {

        // TODO verificar os parâmetros

        const certificado = await Certificado.create({
            nome: req.body.nome,
            email: req.body.email,
            titulo: req.body.titulo,
            dataDoCurso: req.body.dataDoCurso,
            duracao: req.body.duracao,
            nomeDoInstrutor: req.body.nomeDoInstrutor
        });

        return res.send(certificado);
    }

    async atualiza(req, res) {
        if (req.params.id) {
            
            await Certificado.updateOne({_id: req.params.id},{assinado:true});
            
            return res.json({ok:true})
        }else{
            return res.json({ok:false});
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

        const certificados = await Certificado.find({assinado:false}).skip(pagina * resultadosPorBusca)
            .limit(resultadosPorBusca).sort({ createdAt: 1 })

        return res.json(certificados);
    }

}

module.exports = new CertificadoController();