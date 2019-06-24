const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.autorizacao;

    if (!authHeader)
        return res.status(401).send({ error: 'Token de autenticação não informado', cod: 1 });

    const parts = authHeader.split(' ');

    if (!parts.length === 2)
        return res.status(401).send({ error: 'Erro no token de autenticação', cod: 2 });

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme))
        return res.status(401).send({ error: 'Token mal formado', cod: 3 });

    jwt.verify(token, process.env.SERVER_HASH, (err, decoded) => {
        if (err)
            return res.status(401).send({ error: 'Token inválido ou expirado', cod: 4 });

        req.userId = decoded.id;

        next();
    });
}