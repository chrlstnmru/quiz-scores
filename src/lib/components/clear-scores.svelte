<script lang="ts">
	import { enhance } from '$app/forms';

	import ListRestart from '@lucide/svelte/icons/list-restart';

	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button, buttonVariants } from './ui/button';

	let open = $state(false);
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				class="aspect-square"
				variant="outline"
				size="icon"
				title="Clear all scores"
			>
				<ListRestart />
			</Button>
		{/snippet}
	</AlertDialog.Trigger>

	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Clear all scores</AlertDialog.Title>
			<AlertDialog.Description>
				This action will clear all scores. Are you sure you want to proceed?
			</AlertDialog.Description>
		</AlertDialog.Header>

		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<form method="post" use:enhance>
				<AlertDialog.Action
					class={buttonVariants({ variant: 'destructive' })}
					type="submit"
					formmethod="post"
					formaction="?/clearScores"
					onclick={() => {
						open = false;
					}}
				>
					{#snippet child({ props })}
						<Button {...props}>Clear all scores</Button>
					{/snippet}
				</AlertDialog.Action>
			</form>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
