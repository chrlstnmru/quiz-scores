import { generateId } from '$lib/utils';
import type { CreateScoreForm, EditScoreForm } from '$lib/validators/score';
import { eq, getTableColumns, sql } from 'drizzle-orm';
import { db } from './db';
import { scoreTable } from './db/schema';
import { decryptAccessCode, encryptAccessCode } from './password';

export async function createScore({ accessCode, name, score }: CreateScoreForm) {
	const { encryptedData, iv } = encryptAccessCode(accessCode);

	const [scoreData] = await db
		.insert(scoreTable)
		.values({
			id: generateId(),
			name,
			accessCode: encryptedData,
			iv,
			score
		})
		.returning();

	if (!scoreData) {
		throw new Error('Failed to create score');
	}

	return scoreData;
}

export async function editScore({ id, accessCode, name, score }: EditScoreForm) {
	const { encryptedData, iv } = encryptAccessCode(accessCode);

	const [scoreData] = await db
		.update(scoreTable)
		.set({
			name,
			accessCode: encryptedData,
			iv,
			score
		})
		.where(eq(scoreTable.id, id))
		.returning();
	if (!scoreData) {
		throw new Error('Failed to update score');
	}

	return scoreData;
}

export async function deleteScore(id: string) {
	const [scoreData] = await db.delete(scoreTable).where(eq(scoreTable.id, id)).returning();
	if (!scoreData) {
		throw new Error('Failed to delete score');
	}
	return scoreData;
}

export async function getAllScores() {
	const scores = await db.query.scoreTable.findMany();
	const decryptedScores = scores.map((score) => {
		const decryptedAccessCode = decryptAccessCode(score.accessCode, score.iv);
		return {
			...score,
			accessCode: decryptedAccessCode
		};
	});

	return decryptedScores;
}

export async function getScoreByAccessCode(accessCode: string) {
	const encryptedAccessCode = encryptAccessCode(accessCode).encryptedData;
	const [score] = await db.query.scoreTable.findMany({
		where: eq(scoreTable.accessCode, encryptedAccessCode),
		columns: {
			accessCode: false,
			iv: false
		}
	});

	if (!score) {
		throw new Error('Score not found');
	}

	return score;
}
