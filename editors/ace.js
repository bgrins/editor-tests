import * as ace from "ace-builds/src-noconflict/ace";
// TODO this is complaining about trying to importScripts http://localhost:5173/worker-javascript.js
import "ace-builds/src-noconflict/mode-javascript";
export default function (element, value) {
  element.style.position = "relative";

  var editor = ace.edit(element.id, {
    value,
  });
  editor.session.setUseWrapMode(true);
  return {
    editor,
    setValue(value) {
      editor.setValue(value);
      editor.selection.setRange(new ace.Range(0, 1, 0, 1));
    },
    format(on) {
      editor.session.setMode(on ? "ace/mode/javascript" : null);
    },
  };
}
