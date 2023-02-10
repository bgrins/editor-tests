import * as ace from "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-javascript";
export default function (element, value) {
  element.style.position = "relative";

  var editor = ace.edit(element.id, {
    value,
    mode: "ace/mode/javascript",
  });
  editor.session.setUseWrapMode(true);
  return {
    editor,
    setValue(value) {
      editor.setValue(value);
      editor.selection.setRange(new ace.Range(0, 1, 0, 1));
    },
  };
}
