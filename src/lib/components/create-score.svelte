<script lang="ts">
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';

	import Plus from '@lucide/svelte/icons/plus';
	import Dices from '@lucide/svelte/icons/dices';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import { Button } from '$lib/components/ui/button';
	import { createScoreFormSchema, type CreateScoreForm } from '$lib/validators/score';
	import { Input } from './ui/input';
	import { invalidate } from '$app/navigation';

	type Props = {
		data: SuperValidated<CreateScoreForm>;
	};

	let { data }: Props = $props();

	let open = $state(false);

	const form = superForm<CreateScoreForm>(data, {
		multipleSubmits: 'prevent',
		validators: zodClient(createScoreFormSchema),
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
				clearTimeout(timeout);
			}, 300);
		}
	}

	$inspect(open);
</script>

<Dialog.Root bind:open {onOpenChange}>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Button {...props} class="aspect-square" size="icon" title="Create Score">
				<Plus />
			</Button>
		{/snippet}
	</Dialog.Trigger>

	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Create Score</Dialog.Title>
			<Dialog.Description>Create a new score.</Dialog.Description>
		</Dialog.Header>

		<form id="create-score" class="space-y-2" method="post" action="?/createScore" use:enhance>
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

			<Form.Field {form} class="w-full" name="accessCode">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Access Code</Form.Label>
						<div class="flex items-start gap-3">
							<Input {...props} class="uppercase" bind:value={$formData.accessCode} maxlength={6} />
							<Button class="mb-2 mt-auto" onclick={generatePasscode} variant="secondary">
								<Dices />
								Generate
							</Button>
						</div>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</form>

		<Dialog.Footer>
			<Dialog.Close disabled={$delayed}>
				{#snippet child({ props })}
					<Button {...props} variant="ghost">Cancel</Button>
				{/snippet}
			</Dialog.Close>
			<Form.Button form="create-score" disabled={$delayed}>
				{#if $delayed}
					<LoaderCircle class="animate-spin" />
				{/if}
				Create
			</Form.Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
