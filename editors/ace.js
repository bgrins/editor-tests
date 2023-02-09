import * as ace from 'ace-builds/src-noconflict/ace';

// console.log(ace);

export const displayName = "Ace";
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
    }
  }
}