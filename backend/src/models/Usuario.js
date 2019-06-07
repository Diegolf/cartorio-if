const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Usuario = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    senha: {
        type: String,
        required: true,
        select: false,
    },
    certificados: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Certificado'
    }]
}, {
    timestamps: true // Cria os campos createdAt e updatedAt
});

Usuario.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.senha, 10);
    this.senha = hash;
    next();
})

module.exports = mongoose.model('Usuario', Usuario);