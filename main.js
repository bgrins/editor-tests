import "./style.css";
import tiptap from "./editors/tiptap.js";
import codemirror from "./editors/codemirror.js";
import monaco from "./editors/monaco.js";
import ace from "./editors/ace.js";
import quill from "./editors/quill.js";
import editorjs from "./editors/editorjs.js";
import bigtext from "./textbig.js";
import smalltext from "./textsmall.js";

console.log(ace);
const CODE_EDITORS = [[codemirror, "CodeMirror"], [monaco, "Monaco"], [ace, "Ace"]];
const TEXT_EDITORS = [[tiptap, "TipTap"], [quill, "Quill"], [editorjs, "EditorJS"]];
const CREATED_EDITORS = [];
let container = document.querySelector("#editors");

const currentText = () => document.querySelector(`[name="text"]:checked`)?.value === "large" ? bigtext : smalltext;
const currentSelectedEditor = () => document.querySelector(`[name="editor"]:checked`)?.value;
const currentSize = () => document.querySelector(`[name="size"]:checked`)?.value || 100;
const textOptions = () => [...document.querySelectorAll(`[name="text"]`)];
const sizeOptions = () => [...document.querySelectorAll(`[name="size"]`)];
const editorOptions = () => [...document.querySelectorAll(`[name="editor"]`)];

document.querySelector("#run").addEventListener("click", async (e) => {
  for (let editor of editorOptions()) {
    // editor.checked = true;
    performance.mark(`Editor - ${editor.value}`);
    editor.click();
    for (let size of sizeOptions()) {
      performance.mark(`Size - ${size.value}%`);
      size.click();
      for (let textSize of textOptions()) {
        performance.mark(`Text Size - ${textSize.value}%`);
        textSize.click();
        // for (let pos of [1000,0]) {
        //   container.scroll({
        //     top: pos,
        //     left: 0,
        //     behavior: 'smooth'
        //   });
        // }
        await new Promise((resolve) => requestAnimationFrame(resolve));
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  }
});


const radioContainer = document.querySelector("#editor-options");
function showActiveEditor() {
  let container = document.querySelector(`#editor-${currentSelectedEditor()}`);
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
  CREATED_EDITORS.push([editor(el, currentText()), displayName]);
}

for (let [editor, displayName] of CODE_EDITORS) {
  createEditor(editor, displayName, "code");
}
for (let [editor, displayName] of TEXT_EDITORS) {
  createEditor(editor, displayName, "text");
}


resizeEditors();
window.addEventListener("resize", resizeEditors);
radioContainer.addEventListener("change", (e) => {
  showActiveEditor();
});

document.addEventListener("change", (e) => {
  if (e.target.name === "size") {
    resizeEditors();
  }
  if (e.target.name === "editor") {
    showActiveEditor();
  }
  if (e.target.name === "text") {
    for (let [editor, displayName] of CREATED_EDITORS) {
      if (displayName == currentSelectedEditor()) {
        editor.setValue(currentText());
      }
    }
  }

})

if (!currentSelectedEditor()) {
  document.querySelector(`[name="editor"]`).checked = true;
}
showActiveEditor();
