import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key'; // Use environment variable

export const generateToken = (payload: object) => {
	const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
	return token;
};

export const verifyToken = (token: string) => {
	try {
		const decoded = jwt.verify(token, SECRET_KEY);
		return decoded;
	} catch (error) {
		return null; // or throw an error
	}
};
