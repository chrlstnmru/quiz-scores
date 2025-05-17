<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { EditScoreForm } from '$lib/validators/score';
	import { Button } from './ui/button';

	type Props = {
		data: EditScoreForm & {
			createdAt: Date;
		};
		onEditScore: (scoreData: EditScoreForm) => void;
		onDeleteScore: (scoreData: EditScoreForm) => void;
	};

	let { data, onEditScore, onDeleteScore }: Props = $props();

	function handleEditScore() {
		onEditScore(data);
	}

	function handleDeleteScore() {
		onDeleteScore(data);
	}
</script>

<Card.Root>
	<Card.Content class="flex items-start justify-between">
		<div class="text-sm">
			<p data-field="Name">{data.name}</p>
			<p data-field="Score">{data.score}</p>
			<p data-field="Date">{new Date(data.createdAt).toLocaleDateString()}</p>
			<p data-field="Code">{data.accessCode}</p>
		</div>

		<div class="flex flex-col gap-2">
			<Button variant="secondary" size="sm" onclick={handleEditScore}>Edit Score</Button>
			<Button variant="destructive" size="sm" onclick={handleDeleteScore}>Delete Score</Button>
		</div>
	</Card.Content>
</Card.Root>

<style lang="postcss">
	[data-field] {
		@apply grid grid-cols-[6ch_1fr];

		&::before {
			content: attr(data-field) ': ';
			@apply font-medium;
		}
	}
</style>
