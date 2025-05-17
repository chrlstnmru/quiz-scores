<script lang="ts">
	import LogOut from '@lucide/svelte/icons/log-out';

	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import CreateScore from '$lib/components/create-score.svelte';
	import ClearScores from '$lib/components/clear-scores.svelte';
	import EditScore from '$lib/components/edit-score.svelte';
	import type { EditScoreForm } from '$lib/validators/score';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import Score from '$lib/components/score.svelte';
	import DeleteScore from '$lib/components/delete-score.svelte';
	import { enhance } from '$app/forms';

	let { data } = $props();

	let activeScoreData: EditScoreForm | null = $state(null);

	let openEditScore = $state(false);
	let openDeleteScore = $state(false);

	let searchTerm = $state('');
	let scoreDataList = $derived.by(() => {
		return data.scores.filter((score) => {
			return (
				score.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				score.accessCode.toLowerCase().includes(searchTerm.toLowerCase())
			);
		});
	});

	function onEditScore(scoreData: EditScoreForm) {
		activeScoreData = scoreData;
		openEditScore = true;
	}

	function onDeleteScore(scoreData: EditScoreForm) {
		activeScoreData = scoreData;
		openDeleteScore = true;
	}
</script>

<svelte:head>
	<title>Admin</title>
</svelte:head>

<main class="flex min-h-dvh flex-col items-center justify-center p-4">
	<div class="w-full max-w-[500px]">
		<div class="mb-6 flex items-center justify-between">
			<form class="flex items-center space-x-2" method="get">
				<Input placeholder="Search..." type="search" bind:value={searchTerm} />
			</form>

			<div>
				<CreateScore data={data.createScoreForm} />
				<ClearScores />
			</div>
		</div>

		<ScrollArea class="h-[500px] w-full rounded-xl border p-4">
			<div class="space-y-3">
				{#each scoreDataList as scoreData (scoreData.id)}
					<Score data={scoreData} {onEditScore} {onDeleteScore} />
				{:else}
					<div
						class="flex h-20 items-center justify-center rounded-lg border bg-muted text-muted-foreground"
					>
						<p class="text-sm">No scores found</p>
					</div>
				{/each}
			</div>
		</ScrollArea>

		<form class="mt-3 w-full" action="?/logout" method="post" use:enhance>
			<Button class="w-full" type="submit" variant="secondary">
				<LogOut />
				Logout
			</Button>
		</form>
	</div>
</main>

<EditScore data={data.editScoreForm} bind:scoreData={activeScoreData} bind:open={openEditScore} />
<DeleteScore
	data={data.deleteScoreForm}
	bind:scoreData={activeScoreData}
	bind:open={openDeleteScore}
/>
