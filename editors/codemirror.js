import { EditorView, basicSetup } from "codemirror"

export default function (element, value) {
  let view = new EditorView({
    extensions: [basicSetup, EditorView.lineWrapping],
    parent: element,
    doc: value,
    wordWrapColumn: 80,
  })

  return {
    editor: view,
    setValue: value => view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: value } })
  }
}