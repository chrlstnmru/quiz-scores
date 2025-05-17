<script lang="ts">
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	import * as Form from '$lib/components/ui/form';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	import {
		deleteScoreFormSchema,
		type DeleteScoreForm,
		type EditScoreForm
	} from '$lib/validators/score';

	type Props = {
		open: boolean;
		data: SuperValidated<DeleteScoreForm>;
		scoreData: EditScoreForm | null;
	};

	let { data, open = $bindable(false), scoreData = $bindable(null) }: Props = $props();

	const form = superForm(data, {
		multipleSubmits: 'prevent',
		validators: zodClient(deleteScoreFormSchema),
		delayMs: 200,
		onUpdated: ({ form }) => {
			if (form.valid) {
				open = false;
			}
		}
	});
	const { form: formData, enhance, delayed, submitting, submit } = form;

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

<AlertDialog.Root bind:open {onOpenChange}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete the score for
				<span class="font-medium underline">{scoreData?.name}</span>.
			</AlertDialog.Description>
		</AlertDialog.Header>

		<form id="delete-score" action="?/deleteScore" method="post" use:enhance>
			<input type="hidden" name="id" bind:value={$formData.id} />
		</form>

		<AlertDialog.Footer>
			<AlertDialog.Cancel disabled={$delayed}>Cancel</AlertDialog.Cancel>
			<Form.Button variant="destructive" disabled={$delayed} form="delete-score">
				{#if $delayed}
					<LoaderCircle class="animate-spin" />
				{/if}
				Delete
			</Form.Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
