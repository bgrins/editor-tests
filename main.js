import "./style.css";
import tiptap from "./editors/tiptap.js";
import codemirror from "./editors/codemirror.js";
import monaco from "./editors/monaco.js";
import ace from "./editors/ace.js";
import bigtext from "./textbig.js";
import smalltext from "./textsmall.js";

console.log(ace);
const CODE_EDITORS = [[codemirror, "CodeMirror"], /*monaco,*/[ace, "Ace"]];
const TEXT_EDITORS = [[tiptap, "TipTap"]];

const currentText = () => document.querySelector("#size").checked ? bigtext : smalltext;
const currentSelectedEditor = () => document.querySelector(`[name="editor"]:checked`)?.value;
const radioContainer = document.querySelector("#editor-options");
function showActiveEditor() {
  let container = document.querySelector(`#editor-${currentSelectedEditor()}`);
  console.log(container);
  document.querySelectorAll("#editors > div.active").forEach((el) => el.classList.remove("active"));
  container.classList.add("active");
}

document.querySelector("#size").addEventListener("change", (e) => {
  for (let i of editors) {
    i.setValue(currentText());
  }
});

radioContainer.addEventListener("change", (e) => {
  showActiveEditor();
});
let container = document.querySelector("#editors");
let editors = [];

function createEditor(editor, displayName) {
  let el = document.createElement("div");
  el.id = `editor-${displayName}`;
  let radio = document.createElement("input");
  radio.type = "radio";
  radio.name = "editor";
  radio.value = displayName;
  radio.id = displayName;
  let label = document.createElement("label");
  label.setAttribute("for", displayName);
  label.textContent = displayName;
  radioContainer.append(radio, label);
  container.append(el);
  editors.push(editor(el, currentText()));
}

for (let [editor, displayName] of CODE_EDITORS) {
  createEditor(editor, displayName, "code");
}
for (let [editor, displayName] of TEXT_EDITORS) {
  createEditor(editor, displayName, "text");
}

if (!currentSelectedEditor()) {
  document.querySelector(`[name="editor"]`).checked = true;
}

showActiveEditor();
