const Certificado = require('../models/Certificado');

class CertificadoController {
    async armazenar(req, res) {
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

    async certificados(req, res) {
        const resultadosPorBusca = 8;

        let pagina = 0;
        try {
            pagina = parseInt(req.query.page); // req.body.page?
        } catch (e) { }

        const certificados = await Certificado.find({}).skip(pagina * resultadosPorBusca)
            .limit(resultadosPorBusca).sort({ createdAt: -1 })

        return res.json(certificados);
    }

}

module.exports = new CertificadoController();