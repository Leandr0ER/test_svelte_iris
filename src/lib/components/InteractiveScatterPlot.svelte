<script>
  export let datos = /** @type {any[]} */ ([]);

  // Variables disponibles para los ejes
  const opciones = [
    { id: "sepalLength", label: "Sepal Length (cm)" },
    { id: "sepalWidth", label: "Sepal Width (cm)" },
    { id: "petalLength", label: "Petal Length (cm)" },
    { id: "petalWidth", label: "Petal Width (cm)" }
  ];

  // Estado reactivo para los ejes seleccionados
  let xKey = "petalLength";
  let yKey = "petalWidth";

  // Configuración del SVG
  const width = 800;
  const height = 640;
  // aumentar margin.right para dar espacio interior y evitar recortes
  const margin = { top: 30, right: 30, bottom: 60, left: 70 };

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

  // Ticks / grid
  const ticksCount = 5;
  $: xTicks = (() => {
    if (!isFinite(minX) || !isFinite(maxX)) return [];
    const ticks = [];
    for (let i = 0; i <= ticksCount; i++) {
      const v = minX + (i / ticksCount) * (maxX - minX || 0);
      const x = escalar(v, minX, maxX, width - margin.left - margin.right) + margin.left;
      ticks.push({ value: +v.toFixed(2), x });
    }
    return ticks;
  })();

  $: yTicks = (() => {
    if (!isFinite(minY) || !isFinite(maxY)) return [];
    const ticks = [];
    for (let i = 0; i <= ticksCount; i++) {
      const v = minY + (i / ticksCount) * (maxY - minY || 0);
      const y = height - margin.bottom - escalar(v, minY, maxY, height - margin.top - margin.bottom);
      ticks.push({ value: +v.toFixed(2), y });
    }
    return ticks;
  })();

  // Añadir estado para hover/tooltip y referencia al wrapper (con JSDoc para evitar implicit any)
  /** @type {number|null} */
  let hover = null;
  /** @type {{visible:boolean,x:number,y:number,data:any|null}} */
  let tooltip = { visible: false, x: 0, y: 0, data: null };
  /** @type {HTMLElement|null} */
  let wrapperEl = null;

  // Lógica reactiva ($:) que se recalcula cuando cambian xKey, yKey o los datos
  $: puntos = datos.map((d, i) => ({
    id: i,
    x: escalar(d[xKey], minX, maxX, width - margin.left - margin.right) + margin.left,
    y: height - margin.bottom - escalar(d[yKey], minY, maxY, height - margin.top - margin.bottom),
    especie: d.species,
    data: d
  }));

  // Leyenda
  const legendItems = [
    { key: 'setosa', label: 'Setosa', class: 'setosa' },
    { key: 'versicolor', label: 'Versicolor', class: 'versicolor' },
    { key: 'virginica', label: 'Virginica', class: 'virginica' }
  ];
  const legendWidth = 120;
  const legendItemHeight = 22;
  // La posición ahora la controla el layout externo (flex), ya no dentro del SVG.
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

  <!-- bind wrapper ref para posicionar tooltip relativo -->
  <div class="plot-wrapper" bind:this={wrapperEl}>
    <svg {width} {height}>
      <!-- grid vertical (x) -->
      {#each xTicks as t}
        <line x1={t.x} x2={t.x} y1={margin.top} y2={height - margin.bottom} stroke="#eee" />
      {/each}

      <!-- grid horizontal (y) -->
      {#each yTicks as t}
        <line x1={margin.left} x2={width - margin.right} y1={t.y} y2={t.y} stroke="#eee" />
      {/each}

      <line x1={margin.left} y1={height - margin.bottom} x2={width - margin.right} y2={height - margin.bottom} stroke="#333" />
      <line x1={margin.left} y1={margin.top} x2={margin.left} y2={height - margin.bottom} stroke="#333" />

      <!-- X ticks + labels -->
      {#each xTicks as t}
        <line x1={t.x} x2={t.x} y1={height - margin.bottom} y2={height - margin.bottom + 6} stroke="#333" />
        <text x={t.x} y={height - margin.bottom + 20} text-anchor="middle" class="tick-label">{t.value}</text>
      {/each}

      <!-- Y ticks + labels -->
      {#each yTicks as t}
        <line x1={margin.left - 6} x2={margin.left} y1={t.y} y2={t.y} stroke="#333" />
        <text x={margin.left - 10} y={t.y + 4} text-anchor="end" class="tick-label">{t.value}</text>
      {/each}

      <!-- Etiquetas de los ejes -->
      <text
        x={width / 2}
        y={height - margin.bottom + 45}
        text-anchor="middle"
        class="axis-label"
      >
        {xLabel}
      </text>

      <text
        x={margin.left - 45}
        y={height / 2}
        text-anchor="middle"
        transform={`rotate(-90 ${margin.left - 45} ${height / 2})`}
        class="axis-label"
      >
        {yLabel}
      </text>

      {#each puntos as p}
        <circle 
          cx={p.x} 
          cy={p.y} 
          r={hover === p.id ? 8 : 5}
          class={p.especie + (hover === p.id ? ' hovered' : '')}
          role="button"
          tabindex="0"
          aria-label={`species: ${p.especie}, ${xKey}: ${p.data[xKey]}, ${yKey}: ${p.data[yKey]}`}
          on:mouseover={(e) => {
            hover = p.id;
            const rect = wrapperEl?.getBoundingClientRect() ?? { left: 0, top: 0 };
            tooltip.visible = true;
            tooltip.x = e.clientX - rect.left + 12;
            tooltip.y = e.clientY - rect.top + 12;
            tooltip.data = p.data;
          }}
          on:mousemove={(e) => {
            const rect = wrapperEl?.getBoundingClientRect() ?? { left: 0, top: 0 };
            tooltip.x = e.clientX - rect.left + 12;
            tooltip.y = e.clientY - rect.top + 12;
          }}
          on:mouseout={() => {
            hover = null;
            tooltip.visible = false;
            tooltip.data = null;
          }}
          on:focus={() => {
            hover = p.id;
            tooltip.visible = true;
            // usar coordenadas del punto para posicionar cuando se enfoca por teclado
            tooltip.x = p.x + 12;
            tooltip.y = p.y + 12;
            tooltip.data = p.data;
          }}
          on:blur={() => {
            hover = null;
            tooltip.visible = false;
            tooltip.data = null;
          }}
          on:keydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              // mostrar/alternar tooltip al activar con teclado
              hover = p.id;
              tooltip.visible = true;
              tooltip.x = p.x + 12;
              tooltip.y = p.y + 12;
              tooltip.data = p.data;
            }
          }}
        />
      {/each}
    </svg>

    <!-- Leyenda fuera del SVG -->
    <div class="legend-container" style="height: {height}px; width: {legendWidth}px;">
      <div class="legend-box">
        {#each legendItems as item}
          <div class="legend-item">
            <span class="legend-swatch {item.class}" aria-hidden="true"></span>
            <span class="legend-label">{item.label}</span>
          </div>
        {/each}
      </div>
    </div>

    <!-- Tooltip absoluto dentro del wrapper -->
    {#if tooltip.visible && tooltip.data}
      <div class="tooltip" style="left:{tooltip.x}px; top:{tooltip.y}px;">
        {#each Object.entries(tooltip.data) as [k, v]}
          <div class="tooltip-row"><span class="key">{k}</span>: <span class="val">{v}</span></div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  /* Import Montserrat */
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');

  /* Aplicar Montserrat en todo el componente / página */
  :global(*) {
    font-family: 'Montserrat', system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  }

  .contenedor { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
  .controles { display: flex; gap: 2rem; background: #f0f0f0; padding: 10px; border-radius: 8px; }
  .plot-wrapper { display: flex; align-items: center; gap: 12px; position: relative; }
  svg { background: white; border: 1px solid #ddd; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: visible; }

  circle { transition: all 0.3s ease; opacity: 0.7; }
  .setosa { fill: #ff3e00; }
  .versicolor { fill: #40b3ff; }
  .virginica { fill: #676778; }
  .axis-label { font-size: 14px; fill: #333; pointer-events: none; }
  .tick-label { font-size: 12px; fill: #333; pointer-events: none; }

  /* Leyenda */
  .legend-container { display: flex; align-items: center; justify-content: center; }
  .legend-box { background: rgba(255,255,255,0.9); border: 1px solid #e0e0e0; padding: 8px 12px; border-radius: 8px; }
  .legend-item { display: flex; align-items: center; gap: 8px; padding: 4px 0; }
  .legend-swatch { width: 12px; height: 12px; border-radius: 50%; display: inline-block; box-shadow: 0 0 0 1px rgba(0,0,0,0.03) inset; }

  /* Swatches con los mismos colores que los círculos SVG */
  .legend-swatch.setosa { background-color: #ff3e00; }
  .legend-swatch.versicolor { background-color: #40b3ff; }
  .legend-swatch.virginica { background-color: #676778; }
  .legend-swatch { border: 1px solid rgba(0,0,0,0.06); }

  .legend-label { font-size: 12px; color: #333; }

  /* Resalte del círculo al hacer hover */
  circle.hovered { stroke: rgba(0,0,0,0.35); stroke-width: 1.6; opacity: 1; }

  /* Tooltip */
  .tooltip {
    position: absolute;
    pointer-events: none;
    background: rgba(255,255,255,0.98);
    border: 1px solid #ddd;
    padding: 8px 10px;
    border-radius: 6px;
    box-shadow: 0 6px 18px rgba(0,0,0,0.12);
    font-size: 12px;
    color: #111;
    z-index: 50;
    white-space: nowrap;
  }
  .tooltip-row { line-height: 1.2; }
  .tooltip .key { font-weight: 600; margin-right: 6px; color: #333; }
  .tooltip .val { color: #111; }
</style>