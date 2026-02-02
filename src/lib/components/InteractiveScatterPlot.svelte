<script>
  export let datos = /** @type {any[]} */ ([]);

  // Variables disponibles para los ejes
  const opciones = [
    { id: "sepalLength", label: "Sepal Length" },
    { id: "sepalWidth", label: "Sepal Width" },
    { id: "petalLength", label: "Petal Length" },
    { id: "petalWidth", label: "Petal Width" }
  ];

  // Estado reactivo para los ejes seleccionados
  let xKey = "petalLength";
  let yKey = "petalWidth";

  // Configuración del SVG
  const width = 500;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 50, left: 50 };

  // Función para escalar valores (Normalización simple a píxeles)
  /**
   * Escala un valor numérico dentro de un rango de salida en píxeles.
   * @param {number} valor - Valor a escalar.
   * @param {number} min - Valor mínimo del rango de entrada.
   * @param {number} max - Valor máximo del rango de entrada.
   * @param {number} rangoSalida - Rango de salida (p. ej. ancho/alto en px).
   * @returns {number} - Valor escalado dentro de `rangoSalida`.
   */
  function escalar(valor, min, max, rangoSalida) {
    // Validaciones para evitar NaN/Infinity cuando los datos están vacíos
    // o cuando todos los valores son iguales (max === min).
    if (!isFinite(min) || !isFinite(max) || rangoSalida === 0 || typeof valor !== 'number') {
      return 0;
    }
    if (max === min) {
      // Si no hay rango, devolver el punto medio del rango de salida.
      return rangoSalida / 2;
    }
    return ((valor - min) / (max - min)) * rangoSalida;
  }

  // Lógica reactiva ($:) que se recalcula cuando cambian xKey, yKey o los datos
  $: minX = Math.min(...datos.map(d => d[xKey]));
  $: maxX = Math.max(...datos.map(d => d[xKey]));
  $: minY = Math.min(...datos.map(d => d[yKey]));
  $: maxY = Math.max(...datos.map(d => d[yKey]));

  // Etiquetas reactivas para los ejes (se actualizan con los selects)
  $: xLabel = (opciones.find(o => o.id === xKey) || {}).label || xKey;
  $: yLabel = (opciones.find(o => o.id === yKey) || {}).label || yKey;

  $: puntos = datos.map(d => ({
    x: escalar(d[xKey], minX, maxX, width - margin.left - margin.right) + margin.left,
    y: height - margin.bottom - escalar(d[yKey], minY, maxY, height - margin.top - margin.bottom),
    especie: d.species
  }));
</script>

<div class="contenedor">
  <div class="controles">
    <label>
      Axis X:
      <select bind:value={xKey}>
        {#each opciones as opt}
          <option value={opt.id}>{opt.label}</option>
        {/each}
      </select>
    </label>

    <label>
      Axis Y:
      <select bind:value={yKey}>
        {#each opciones as opt}
          <option value={opt.id}>{opt.label}</option>
        {/each}
      </select>
    </label>
  </div>

  <svg {width} {height}>
    <line x1={margin.left} y1={height - margin.bottom} x2={width - margin.right} y2={height - margin.bottom} stroke="#333" />
    <line x1={margin.left} y1={margin.top} x2={margin.left} y2={height - margin.bottom} stroke="#333" />

    <!-- Etiquetas de los ejes -->
    <text
      x={width / 2}
      y={height - margin.bottom + 35}
      text-anchor="middle"
      class="axis-label"
    >
      {xLabel}
    </text>

    <text
      x={margin.left - 35}
      y={height / 2}
      text-anchor="middle"
      transform={`rotate(-90 ${margin.left - 35} ${height / 2})`}
      class="axis-label"
    >
      {yLabel}
    </text>

    {#each puntos as p}
      <circle 
        cx={p.x} 
        cy={p.y} 
        r="5" 
        class={p.especie}
      />
    {/each}
  </svg>
</div>

<style>
  .contenedor { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
  .controles { display: flex; gap: 2rem; background: #f0f0f0; padding: 10px; border-radius: 8px; }
  svg { background: white; border: 1px solid #ddd; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
  
  circle { transition: all 0.3s ease; opacity: 0.7; }
  .setosa { fill: #ff3e00; }
  .versicolor { fill: #40b3ff; }
  .virginica { fill: #676778; }
  .axis-label { font-size: 14px; fill: #333; pointer-events: none; }
</style>