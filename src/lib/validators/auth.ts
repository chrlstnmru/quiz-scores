import { z } from 'zod';

const passwordSchema = z
	.string()
	.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
	.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
	.regex(/[0-9]/, 'Password must contain at least one number')
	.regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
	.min(8, 'Password must be at least 8 characters long');

export const adminLoginFormSchema = z.object({
	username: z.string().nonempty('Username is required'),
	password: z.string().nonempty('Password is required')
});
export type AdminLoginForm = z.infer<typeof adminLoginFormSchema>;

export const adminSetupFormSchema = z
	.object({
		username: z
			.string()
			.nonempty('Username is required')
			.regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
		password: passwordSchema,
		passwordConfirm: z.string().nonempty('Password confirmation is required')
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: 'Passwords must match',
		path: ['passwordConfirm']
	});
export type AdminSetupForm = z.infer<typeof adminSetupFormSchema>;
