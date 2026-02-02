<script>
  export let datos = /** @type {any[]} */ ([]);
  
  const width = 500;
  const height = 300;
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };

  // Escalas simples (Mapeo manual de valores a píxeles)
  // Basado en que el largo del pétalo va de ~1 a ~7
  $: puntos = datos.map(d => ({
    x: (d.petalLength * 60) + margin.left, 
    y: height - (d.petalWidth * 100) - margin.bottom,
    especie: d.species
  }));
</script>

<div class="chart-container">
  <svg {width} {height}>
    <line x1={margin.left} y1={height - margin.bottom} x2={width} y2={height - margin.bottom} stroke="black" />
    <line x1={margin.left} y1={0} x2={margin.left} y2={height - margin.bottom} stroke="black" />

    {#each puntos as p}
      <circle 
        cx={p.x} 
        cy={p.y} 
        r="4" 
        class={p.especie} 
      />
    {/each}
  </svg>
</div>

<style>
  svg { background: #f9f9f9; border-radius: 8px; }
  .setosa { fill: #cc0000; opacity: 0.7; }
  .versicolor { fill: #0000cc; opacity: 0.7; }
  .virginica { fill: #006600; opacity: 0.7; }
</style>