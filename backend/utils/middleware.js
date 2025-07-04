import jwt from 'jsonwebtoken';
const SECRET = "gYVYnoPSRPXfhGQe73MjxpPWtknSAw8DAloNkocz5hV4Plnso5Tdi5AXXQV5LZ4a"

export const verifyToken = async (token) =>{
    console.log(token)
    if (!token) {
        return false
    }

    try {
        const decode = await jwt.verify(token, SECRET);
        console.log(decode)
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const decodeToken = async (token) => {
    const isValid = await verifyToken(token);
    if (!isValid) {
        return false;
    }
    const decode = await jwt.verify(token, SECRET);
    return decode;
};

export const verificarTokenMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).json({ status: false, message: 'Token requerido' });
    }

    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).json({ status: false, message: 'Formato de token inválido. Use: Bearer <token>' });
    }
    const token = tokenParts[1];

    try {
        const decoded = await jwt.verify(token, SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ status: false, message: 'Token inválido' });
    }
};