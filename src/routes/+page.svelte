<script>
  import Tabla from '$lib/components/Table.svelte';
  import { onMount } from 'svelte';

  let irisData = /** @type {any[]} */ ([]);

  onMount(async () => {
    const res = await fetch('./data/iris.json'); // colocar punto correcto al dataset
    irisData = await res.json();
  });
</script>

<main>
  <h1>Análisis de Dataset Iris 🌿</h1>

  {#if irisData.length > 0}
    <section>
      <h2>Datos Crudos</h2>
      <Tabla datos={irisData} />
    </section>
  {:else}
    <p>Cargando datos... ⌛</p>
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