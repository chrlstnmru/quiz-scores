import { ENCRYPTION_KEY } from '$env/static/private';
import { hash, verify } from '@node-rs/argon2';
import * as crypto from 'crypto';

export async function hashPassword(password: string): Promise<string> {
	return await hash(password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});
}

export async function verifyPasswordHash(hash: string, password: string): Promise<boolean> {
	return await verify(hash, password);
}

export function encryptAccessCode(accessCode: string) {
	const key = Buffer.from(ENCRYPTION_KEY, 'hex');
	const iv = crypto.randomBytes(16);

	const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
	let encrypted = cipher.update(accessCode, 'utf8', 'hex');
	encrypted += cipher.final('hex');

	return {
		iv: iv.toString('hex'),
		encryptedData: encrypted
	};
}

export function decryptAccessCode(encryptedData: string, ivHex: string) {
	const key = Buffer.from(ENCRYPTION_KEY, 'hex');
	const iv = Buffer.from(ivHex, 'hex');

	const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
	let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
	decrypted += decipher.final('utf8');

	return decrypted;
}
