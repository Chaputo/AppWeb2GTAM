import e from 'cors';
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
    if(!verifyToken){
        return false;
    }
    const decode = await jwt.verify(token, SECRET);
    return decode;
}