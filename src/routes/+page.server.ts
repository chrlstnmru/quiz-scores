import { getScore } from '$lib/server/score';
import { tryCatch } from '$lib/utils';
import { accessCodeFormSchema } from '$lib/validators/score';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
	return {
		accessCodeForm: await superValidate(zod(accessCodeFormSchema))
	};
};

export const actions = {
	default: async (event) => {
		const accessCodeForm = await superValidate(event, zod(accessCodeFormSchema));
		if (!accessCodeForm.valid) {
			return { accessCodeForm };
		}

		const { name, accessCode } = accessCodeForm.data;
		const { data, error } = await tryCatch(getScore(name, accessCode));
		if (error) {
			console.error(error);
			return message(accessCodeForm, { type: 'error', text: 'Score not found' }, { status: 500 });
		}

		return message(accessCodeForm, {
			type: 'success',
			text: 'Score fetched successfully',
			data: data
		});
	}
};
