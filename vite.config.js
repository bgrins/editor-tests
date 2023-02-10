import { defineConfig } from 'vite';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';
console.log(monacoEditorPlugin);

export default defineConfig({
  base: "./",
  plugins: [monacoEditorPlugin],
})