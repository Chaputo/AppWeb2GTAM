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
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ status: false, message: 'Token requerido' });
    }

    try {
        const decoded = await jwt.verify(token, SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ status: false, message: 'Token inválido' });
    }
};