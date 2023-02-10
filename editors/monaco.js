// https://github.com/microsoft/monaco-editor/blob/5eff5433471a75199899479bc11d37a94079e8c7/docs/integrate-esm.md#using-vite
// https://github.com/vitejs/vite/discussions/1791#discussioncomment-4297826
// import loader from '@monaco-editor/loader'

// loader.config({ paths: { vs: 'https://unpkg.com/monaco-editor@0.33.0/min/vs' } }) // or local
// let monaco = await loader.init()

import * as monaco from 'monaco-editor';

// self.MonacoEnvironment = {
//   globalAPI: true,
//   getWorker: function (workerId, label) {
//     const getWorkerModule = (moduleUrl, label) => {
//       return new Worker(self.MonacoEnvironment.getWorkerUrl(moduleUrl), {
//         name: label,
//         type: 'module'
//       });
//     };

//     switch (label) {
//       case 'json':
//         return getWorkerModule('/monaco-editor/esm/vs/language/json/json.worker?worker', label);
//       case 'css':
//       case 'scss':
//       case 'less':
//         return getWorkerModule('/monaco-editor/esm/vs/language/css/css.worker?worker', label);
//       case 'html':
//       case 'handlebars':
//       case 'razor':
//         return getWorkerModule('/monaco-editor/esm/vs/language/html/html.worker?worker', label);
//       case 'typescript':
//       case 'javascript':
//         return getWorkerModule('/monaco-editor/esm/vs/language/typescript/ts.worker?worker', label);
//       default:
//         return getWorkerModule('/monaco-editor/esm/vs/editor/editor.worker?worker', label);
//     }
//   }
// };




// import * as monaco from 'monaco-editor'
// import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
// import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
// import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
// import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
// import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
// import styles from './Editor.module.css';

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
    value: "function hello() {\n\talert('Hello world!');\n}",
    language: 'javascript'
  });

  // let editor = monaco.editor.create(element, {
  //   value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
  //   language: 'javascript'
  // });
  return {
    editor,
    setValue(value) {
      editor.setValue(value);
    }
  }
}