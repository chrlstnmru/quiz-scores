import { createAdmin } from '$lib/server/user.js';
import { tryCatch } from '$lib/utils.js';
import { adminSetupFormSchema } from '$lib/validators/auth';
import { redirect } from '@sveltejs/kit';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const setupForm = await superValidate(zod(adminSetupFormSchema));
	return { setupForm };
};

export const actions = {
	default: async (event) => {
		const setupForm = await superValidate(event, zod(adminSetupFormSchema));
		if (!setupForm.valid) {
			return fail(400, { setupForm });
		}

		const { username, password } = setupForm.data;

		const { data: _, error } = await tryCatch(createAdmin(username, password));
		if (error) {
			return message(setupForm, { type: 'error', text: error.message }, { status: 500 });
		}

		return redirect(303, '/admin/login');
	}
};
