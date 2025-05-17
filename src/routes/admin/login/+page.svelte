<script lang="ts">
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms';
	import LoaderCicle from '@lucide/svelte/icons/loader-circle';

	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { adminLoginFormSchema, type AdminLoginForm } from '$lib/validators/auth';

	let { data } = $props();

	const form = superForm<AdminLoginForm>(data.loginForm, {
		multipleSubmits: 'prevent',
		validators: zodClient(adminLoginFormSchema),
		delayMs: 200
	});
	const { form: formData, enhance, delayed } = form;
</script>

<svelte:head>
	<title>Admin Login</title>
</svelte:head>

<main class="flex min-h-dvh flex-col items-center justify-center p-4">
	<form class="w-full max-w-80" method="post" use:enhance>
		<h1 class="mb-2 text-center text-2xl font-semibold">Admin Login</h1>
		<p class="text-center text-sm text-muted-foreground">
			Sign in to your admin account to access the dashboard.
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

			<div class="w-full pt-3">
				<Form.Button class="w-full">
					{#if $delayed}
						<LoaderCicle class="animate-spin" />
					{/if}
					Login
				</Form.Button>
			</div>
		</fieldset>
	</form>
</main>
