const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

module.exports = (req, res, next) => {
    const authHeader = req.headers.autorizacao;

    if (!authHeader)
        return res.status(401).send({ error: 'Token de autenticação não informado' });

    const parts = authHeader.split(' ');

    if (!parts.length === 2)
        return res.status(401).send({ error: 'Erro no token de autenticação' });

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme))
        return res.status(401).send({ error: 'Token mal formado' });

    jwt.verify(token, authConfig.segredo, (err, decoded) => {
        if (err)
            return res.status(401).send({ error: 'Token inválido ou expirado' });

        req.userId = decoded.id;

        next();
    });
}