const mongoose = require('mongoose');

const Certificado = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    titulo: {
        type: String,
        required: true
    },
    dataDoCurso: {
        type: Date,
        required: true
    },
    duracao: {
        type: Number,
        required: true
    },
    nomeDoInstrutor: {
        type: String,
        required: true
    },
    assinado: {
        type: Boolean,
        default: false
    },
    chave: {
        type: String
    }
}, {
        timestamps: true, // Cria os campos createdAt e updatedAt
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }
);

module.exports = mongoose.model('Certificado', Certificado);