const Certificado = require('../models/Certificado');

class CertificadoController{
    async armazenar(req, res){
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

    async certificados(req, res){

        const certificados = await Certificado.find({}).skip(req.query.from ? parseInt(req.query.from) : 0)
            .limit(10).sort({createdAt: -1})

        return res.json(certificados);
    }

}

module.exports = new CertificadoController();