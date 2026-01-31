<script>
  // Recibimos los datos como una propiedad (prop)
  export let datos = /** @type {any[]} */ ([]);

  const columnas = [
    { label: "Sépalo (L)", key: "sepalLength" },
    { label: "Sépalo (A)", key: "sepalWidth" },
    { label: "Pétalo (L)", key: "petalLength" },
    { label: "Pétalo (A)", key: "petalWidth" },
    { label: "Especie", key: "species" }
  ];
</script>

<div class="tabla-scroll">
  <table>
    <thead>
      <tr>
        {#each columnas as col}
          <th>{col.label}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each datos as flor}
        <tr>
          <td>{flor.sepalLength}</td>
          <td>{flor.sepalWidth}</td>
          <td>{flor.petalLength}</td>
          <td>{flor.petalWidth}</td>
          <td class="tag {flor.species}">{flor.species}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .tabla-scroll {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #ccc;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th {
    position: sticky;
    top: 0;
    background: #eee;
    padding: 10px;
  }
  td {
    padding: 8px;
    text-align: center;
    border-bottom: 1px solid #eee;
  }
  .tag {
    font-size: 0.8rem;
    padding: 2px 6px;
    border-radius: 4px;
    text-transform: uppercase;
  }
  .setosa { background: #ffcccc; color: #cc0000; }
  .versicolor { background: #ccccff; color: #0000cc; }
  .virginica { background: #ccffcc; color: #006600; }
</style>