<script lang="ts">
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { adminSetupFormSchema, type AdminSetupForm } from '$lib/validators/auth';

	let { data } = $props();

	const form = superForm<AdminSetupForm>(data.setupForm, {
		multipleSubmits: 'prevent',
		validators: zodClient(adminSetupFormSchema),
		delayMs: 200
	});
	const { form: formData, enhance, delayed } = form;
</script>

<svelte:head>
	<title>Admin First-time Setup</title>
</svelte:head>

<main class="flex min-h-dvh flex-col items-center justify-center p-4">
	<form class="w-full max-w-80" method="post" use:enhance>
		<h1 class="mb-2 text-center text-2xl font-semibold">Admin First-time Setup</h1>
		<p class="text-center text-sm text-muted-foreground">
			Complete this form to create the first admin account and secure your application.
		</p>

		<fieldset class="mt-6 space-y-3" disabled={$delayed}>
			<Form.Field {form} name="username">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Username</Form.Label>
						<Input {...props} bind:value={$formData.username} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="password">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Password</Form.Label>
						<Input {...props} bind:value={$formData.password} type="password" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="passwordConfirm">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Confirm Password</Form.Label>
						<Input {...props} bind:value={$formData.passwordConfirm} type="password" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<div class="w-full pt-3">
				<Form.Button class="w-full">
					{#if $delayed}
						<LoaderCircle class="animate-spin" />
					{/if}
					Submit
				</Form.Button>
			</div>
		</fieldset>
	</form>
</main>
