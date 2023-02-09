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
const CREATED_EDITORS = [];
let container = document.querySelector("#editors");

const currentText = () => document.querySelector("#size").checked ? bigtext : smalltext;
const currentSelectedEditor = () => document.querySelector(`[name="editor"]:checked`)?.value;
const currentSize = () => document.querySelector(`[name="size"]:checked`)?.value || 100;
const sizeOptions = () => [...document.querySelectorAll(`[name="size"]`)];
const editorOptions = () => [...document.querySelectorAll(`[name="editor"]`)];

document.querySelector("#run").addEventListener("click", async (e) => {
  for (let size of sizeOptions()) {
    size.click();
    for (let editor of editorOptions()) {
      // editor.checked = true;
      editor.click();
      for (let i of [1,2]) {
        document.querySelector("#size").click();
        await new Promise((resolve) => requestAnimationFrame(resolve));
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      // showActiveEditor();
      // resizeEditors();
    }
  }

  // for (let i of CODE_EDITORS.concat(TEXT_EDITORS)) {
  //   i.setValue(currentText());
  // }
});


const radioContainer = document.querySelector("#editor-options");
function showActiveEditor() {
  let container = document.querySelector(`#editor-${currentSelectedEditor()}`);
  console.log(container);
  document.querySelectorAll("#editors > div.active").forEach((el) => el.classList.remove("active"));
  container.classList.add("active");
}
function resizeEditors() {
  document.querySelectorAll("#editors > div").forEach((el) => {
    let percent = currentSize();
    el.style.height = `${el.parentElement.offsetHeight * (percent * .01)}px`;
    el.style.width = `${el.parentElement.offsetWidth * (percent * .01)}px`;
  });
}

document.querySelector("#size").addEventListener("change", (e) => {
  for (let i of CREATED_EDITORS) {

    i.setValue(currentText());
  }
});

radioContainer.addEventListener("change", (e) => {
  showActiveEditor();
});


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
  CREATED_EDITORS.push(editor(el, currentText()));
}

for (let [editor, displayName] of CODE_EDITORS) {
  createEditor(editor, displayName, "code");
}
for (let [editor, displayName] of TEXT_EDITORS) {
  createEditor(editor, displayName, "text");
}


resizeEditors();
window.addEventListener("resize", resizeEditors);
document.addEventListener("change", (e) => {
  if (e.target.name === "size") {
    resizeEditors();
  }

})

if (!currentSelectedEditor()) {
  document.querySelector(`[name="editor"]`).checked = true;
}
showActiveEditor();
