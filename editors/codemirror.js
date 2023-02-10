import { EditorView, basicSetup } from "codemirror";

// https://codemirror.net/examples/bundle/
// TODO this is complaining about trying to importScripts http://localhost:5173/worker-javascript.js
import { javascript } from "@codemirror/lang-javascript";

export const displayName = "CodeMirror";
export default function (element, value) {
  let view = new EditorView({
    extensions: [basicSetup, EditorView.lineWrapping, javascript()],
    parent: element,
    doc: value,
    wordWrapColumn: 80,
    // mode: "javascript",
  });

  return {
    editor: view,
    setValue: (value) =>
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: value },
      }),
  };
}