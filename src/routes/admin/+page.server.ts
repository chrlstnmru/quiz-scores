import { adminLoginFormSchema } from '$lib/validators/auth';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const loginForm = await superValidate(zod(adminLoginFormSchema));
	return { loginForm };
};
