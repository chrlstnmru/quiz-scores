<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import * as Alert from '$lib/components/ui/alert';
	import { Input } from '$lib/components/ui/input';
	import { accessCodeFormSchema, type AccessCodeForm } from '$lib/validators/score';

	let { data } = $props();

	const form = superForm<AccessCodeForm>(data.accessCodeForm, {
		multipleSubmits: 'prevent',
		validators: zodClient(accessCodeFormSchema),
		delayMs: 200
	});
	const { form: formData, enhance, delayed, message } = form;
</script>

<main class="flex min-h-dvh items-center justify-center">
	<Card.Root class="w-full max-w-[400px]">
		<Card.Header>
			<Card.Title>Quiz Score Lookup</Card.Title>
			<Card.Description>Enter your access code to view your score.</Card.Description>
		</Card.Header>
		<Card.Content>
			<form method="post" use:enhance>
				<Form.Field {form} name="accessCode">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Access Code</Form.Label>
							<div class="flex items-center gap-2">
								<Input
									{...props}
									class="uppercase"
									bind:value={$formData.accessCode}
									maxlength={6}
									minlength={6}
								/>
								<Form.Button disabled={$delayed}>
									{#if $delayed}
										<LoaderCircle class="animate-spin" />
									{/if}
									Search
								</Form.Button>
							</div>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</form>

			{#if $message && $message.type === 'success'}
				<Alert.Root variant="info">
					<Alert.Title>Hi! {$message.data.name}</Alert.Title>
					<Alert.Description>
						Your quiz score is <span class="font-semibold">{$message.data.score}</span>
					</Alert.Description>
				</Alert.Root>
			{:else if $message && $message.type === 'error'}
				<Alert.Root variant="destructive">
					<Alert.Title>Oops!</Alert.Title>
					<Alert.Description>{$message.text}</Alert.Description>
				</Alert.Root>
			{/if}
		</Card.Content>
	</Card.Root>
</main>
