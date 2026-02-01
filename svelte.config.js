import adapter from '@sveltejs/adapter-auto';

const dev = process.argv.includes('dev');

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({ fallback: '404.html' }),
    paths: {
      // Reemplaza 'nombre-de-tu-repo' exactamente por como se llama en GitHub
      base: dev ? '' : '/test_svelte_iris',
    }
  }
};

export default config;
