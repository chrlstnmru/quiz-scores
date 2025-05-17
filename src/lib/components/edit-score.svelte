<script lang="ts">
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import Dices from '@lucide/svelte/icons/dices';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import { editScoreFormSchema, type EditScoreForm } from '$lib/validators/score';
	import { Input } from './ui/input';

	type Props = {
		open: boolean;
		data: SuperValidated<EditScoreForm>;
		scoreData: EditScoreForm | null;
	};

	let { open = $bindable(false), data, scoreData = $bindable(null) }: Props = $props();

	const form = superForm<EditScoreForm>(data, {
		multipleSubmits: 'prevent',
		validators: zodClient(editScoreFormSchema),
		delayMs: 200,
		onUpdated: ({ form }) => {
			if (form.valid) {
				open = false;
			}
		}
	});
	const { form: formData, enhance, delayed, submitting } = form;

	function generatePasscode() {
		const accessCode = Math.random().toString(36).slice(2, 8).toUpperCase();
		$formData.accessCode = accessCode;
	}

	function onOpenChange(isOpen: boolean) {
		if (!isOpen) {
			if ($submitting) {
				open = true;
				return;
			}

			const timeout = setTimeout(() => {
				form.reset();
				scoreData = null;
				clearTimeout(timeout);
			}, 300);
		}
	}

	$effect(() => {
		if (scoreData) {
			formData.set(scoreData);
		}
	});
</script>

<Dialog.Root bind:open {onOpenChange}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Edit Score</Dialog.Title>
			<Dialog.Description>Edit a existing score.</Dialog.Description>
		</Dialog.Header>

		<form id="edit-score" class="space-y-2" method="post" action="?/editScore" use:enhance>
			<input type="hidden" name="id" bind:value={$formData.id} />

			<div class="flex items-start gap-3">
				<Form.Field class="w-full" {form} name="name">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Name</Form.Label>
							<Input {...props} bind:value={$formData.name} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field class="w-full max-w-32" {form} name="score">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Score</Form.Label>
							<Input {...props} type="number" bind:value={$formData.score} min={0} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div class="flex items-start gap-3">
				<Form.Field {form} class="w-full" name="accessCode">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Access Code</Form.Label>
							<Input {...props} class="uppercase" bind:value={$formData.accessCode} maxlength={6} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Button class="mb-2 mt-auto" onclick={generatePasscode} variant="secondary">
					<Dices />
					Generate
				</Button>
			</div>
		</form>

		<Dialog.Footer>
			<Dialog.Close disabled={$delayed}>
				{#snippet child({ props })}
					<Button {...props} variant="ghost">Cancel</Button>
				{/snippet}
			</Dialog.Close>
			<Form.Button form="edit-score" disabled={$delayed}>
				{#if $delayed}
					<LoaderCircle class="animate-spin" />
				{/if}
				Save Changes
			</Form.Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
