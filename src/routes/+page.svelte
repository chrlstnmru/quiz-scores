<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import * as Alert from '$lib/components/ui/alert';
	import { Input } from '$lib/components/ui/input';
	import { accessCodeFormSchema, type AccessCodeForm } from '$lib/validators/score';
	import { fade } from 'svelte/transition';

	let { data } = $props();

	const form = superForm<AccessCodeForm>(data.accessCodeForm, {
		multipleSubmits: 'prevent',
		validators: zodClient(accessCodeFormSchema),
		delayMs: 200
	});
	const { form: formData, enhance, delayed, message } = form;

	$effect(() => {
		if ($message) {
			setTimeout(() => {
				message.set(null);
			}, 5000);
		}
	});
</script>

<svelte:head>
	<title>Quiz Score Lookup</title>
</svelte:head>

<main class="flex min-h-dvh items-center justify-center">
	<Card.Root class="w-full max-w-[400px]">
		<Card.Header>
			<Card.Title>Quiz Score Lookup</Card.Title>
			<Card.Description>Enter your access code to view your score.</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if $message}
				<div out:fade={{ duration: 300 }} class="mb-4">
					{#if $message.type === 'success'}
						<Alert.Root variant="info">
							<Alert.Title>Hi! {$message.data.name}</Alert.Title>
							<Alert.Description>
								Your quiz score is <span class="font-semibold">{$message.data.score}</span>
							</Alert.Description>
						</Alert.Root>
					{:else if $message.type === 'error'}
						<Alert.Root variant="destructive">
							<Alert.Title>Oops!</Alert.Title>
							<Alert.Description>{$message.text}</Alert.Description>
						</Alert.Root>
					{/if}
				</div>
			{/if}

			<form method="post" use:enhance>
				<fieldset class="flex items-start gap-3">
					<Form.Field {form} class="w-full" name="name">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Name</Form.Label>
								<Input {...props} bind:value={$formData.name} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} class="w-full max-w-[150px]" name="accessCode">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Access Code</Form.Label>
								<Input
									{...props}
									class="uppercase"
									bind:value={$formData.accessCode}
									maxlength={6}
									minlength={6}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</fieldset>

				<Form.Button class="mt-4 w-full" disabled={$delayed}>
					{#if $delayed}
						<LoaderCircle class="animate-spin" />
					{/if}
					Search
				</Form.Button>
			</form>
		</Card.Content>
	</Card.Root>
</main>
