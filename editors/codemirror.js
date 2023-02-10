import { EditorView, basicSetup } from "codemirror";
import { StateEffect } from "@codemirror/state";
// https://codemirror.net/examples/bundle/
import { javascript } from "@codemirror/lang-javascript";

let extensions = [basicSetup, EditorView.lineWrapping];
let lang = javascript();

export default function (element, value) {
  let view = new EditorView({
    extensions: [
      basicSetup,
      EditorView.lineWrapping,
    ],
    parent: element,
    doc: value,
    wordWrapColumn: 80,
  });

  return {
    editor: view,
    setValue: (value) =>
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: value },
      }),
    format(on) {
      if (on && extensions.length == 2) {
        extensions.push(lang);
      } else if (!on && extensions.length == 3) {
        extensions.pop();
      }
      // https://codemirror.net/examples/config/
      // https://discuss.codemirror.net/t/cm6-dynamically-switching-syntax-theme-w-reconfigure/2858/6
      view.dispatch({
        effects: StateEffect.reconfigure.of(extensions),
      });
    },
  };
}
