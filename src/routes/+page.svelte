<script>
  import Tabla from '$lib/components/Table.svelte';
  import ScatterPlot from '$lib/components/ScatterPlot.svelte';
  import InteractiveScatterPlot from '$lib/components/InteractiveScatterPlot.svelte';
  import { onMount } from 'svelte';

  let irisData = /** @type {any[]} */ ([]);

  onMount(async () => {
    // Leer desde la carpeta `static/data` usando ruta absoluta
    const res = await fetch('./data/iris.json');
    irisData = await res.json();
  });
</script>

<main>
  <h1>Iris Dataset Analysis</h1>

  {#if irisData.length > 0}
    <section>
      <h2>Scatter Plot</h2>
      <InteractiveScatterPlot datos={irisData} />
    </section>
  {:else}
    <div class="loading">
      <p>Loading dataset... ⌛</p>
    </div>
  {/if}
</main>

<style>
  main {
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
    font-family: sans-serif;
  }
</style>