import { db } from '$lib/server/db';
import { createScore, deleteScore, editScore, getAllScores } from '$lib/server/score';
import { tryCatch } from '$lib/utils';
import {
	createScoreFormSchema,
	deleteScoreFormSchema,
	editScoreFormSchema
} from '$lib/validators/score';
import { fail, message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const [createScoreForm, editScoreForm, deleteScoreForm] = await Promise.all([
		superValidate(zod(createScoreFormSchema)),
		superValidate(zod(editScoreFormSchema)),
		superValidate(zod(deleteScoreFormSchema))
	]);

	return {
		createScoreForm,
		editScoreForm,
		deleteScoreForm,
		scores: await getAllScores()
	};
};

export const actions = {
	createScore: async (event) => {
		const createScoreForm = await superValidate(event, zod(createScoreFormSchema));
		if (!createScoreForm.valid) {
			return fail(400, { createScoreForm });
		}

		const { data: _, error } = await tryCatch(createScore(createScoreForm.data));
		if (error) {
			console.error(error);

			if (error.code) {
				if (error.code === '23505') {
					return setError(createScoreForm, 'name', 'Name already exists');
				}
			}

			return message(createScoreForm, { type: 'error', text: error.message });
		}

		return { createScoreForm };
	},
	editScore: async (event) => {
		const editScoreForm = await superValidate(event, zod(editScoreFormSchema));
		if (!editScoreForm.valid) {
			console.log(editScoreForm.data);
			return fail(400, { editScoreForm });
		}

		const { data: _, error } = await tryCatch(editScore(editScoreForm.data));
		if (error) {
			console.error(error);
			return message(editScoreForm, { type: 'error', text: error.message });
		}

		return { editScoreForm };
	},
	deleteScore: async (event) => {
		const deleteScoreForm = await superValidate(event, zod(deleteScoreFormSchema));
		if (!deleteScoreForm.valid) {
			return fail(400, { deleteScoreForm });
		}

		const { data: _, error } = await tryCatch(deleteScore(deleteScoreForm.data.id));
		if (error) {
			console.error(error);
			return message(deleteScoreForm, { type: 'error', text: error.message });
		}

		return { deleteScoreForm };
	},
	clearScores: async () => {
		await db.execute('TRUNCATE TABLE scores');
	}
};
