import { z } from 'zod';

export const editScoreFormSchema = z.object({
	id: z.string().nonempty('Score ID is required'),
	name: z.string().nonempty('Name is required'),
	score: z.coerce.number().min(0, 'Invalid score'),
	accessCode: z
		.string()
		.toUpperCase()
		.length(6, 'Passcode must be 6 characters long')
		.regex(/^[A-Z0-9]+$/, 'Passcode must be alphanumeric')
});
export type EditScoreForm = z.infer<typeof editScoreFormSchema>;

export const createScoreFormSchema = editScoreFormSchema.omit({
	id: true
});
export type CreateScoreForm = z.infer<typeof createScoreFormSchema>;

export const deleteScoreFormSchema = z.object({
	id: z.string().nonempty('Score ID is required')
});
export type DeleteScoreForm = z.infer<typeof deleteScoreFormSchema>;

export const accessCodeFormSchema = z.object({
	name: z.string().nonempty('Name is required'),
	accessCode: z.string().nonempty('Access code is required').toUpperCase()
});
export type AccessCodeForm = z.infer<typeof accessCodeFormSchema>;
