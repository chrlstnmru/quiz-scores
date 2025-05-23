import { generateRandomString, type RandomReader } from '@oslojs/crypto/random';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function generateId() {
	const random: RandomReader = {
		read(bytes) {
			crypto.getRandomValues(bytes);
		}
	};

	const alpabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const idLength = 15;

	return generateRandomString(random, alpabet, idLength);
}

// Types for the result object with discriminated union
type Success<T> = {
	data: T;
	error: null;
};

type Failure<E> = {
	data: null;
	error: E;
};

type Result<T, E = Error & { [key: string]: string }> = Success<T> | Failure<E>;

// Main wrapper function
export async function tryCatch<T, E = Error & { [key: string]: string }>(
	promise: Promise<T>
): Promise<Result<T, E>> {
	try {
		const data = await promise;
		return { data, error: null };
	} catch (error) {
		return { data: null, error: error as E };
	}
}
