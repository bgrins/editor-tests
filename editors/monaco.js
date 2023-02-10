import * as monaco from 'monaco-editor'
// import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
// import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
// import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
// import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
// import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
// // import styles from './Editor.module.css';

const basePath = location.origin + location.pathname.replace(/\/?(index\.html)?$/, '') + '/node_modules/monaco-editor/min/';

self.MonacoEnvironment = {
    getWorkerUrl: () => workerUrl
};

const workerUrl = URL.createObjectURL(new Blob([`
    self.MonacoEnvironment = { baseUrl: ${JSON.stringify(basePath)} };
    importScripts(self.MonacoEnvironment.baseUrl + 'vs/base/worker/workerMain.js');
`], { type: 'text/javascript' }));

// self.MonacoEnvironment = {
//   getWorker(_, label) {
//     if (label === 'json') {
//       return new jsonWorker()
//     }
//     if (label === 'css' || label === 'scss' || label === 'less') {
//       return new cssWorker()
//     }
//     if (label === 'html' || label === 'handlebars' || label === 'razor') {
//       return new htmlWorker()
//     }
//     if (label === 'typescript' || label === 'javascript') {
//       return new tsWorker()
//     }
//     return new editorWorker()
//   }
// }

export default function (element, value) {
  let editor = monaco.editor.create(element, {
    value: value,
    language: 'javascript'
  });
  return {
    editor,
    setValue(value) {
      console.log(value, editor.getValue())
      editor.setValue(value);
    }
  }
}