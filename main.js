import "./style.css";
import tiptap from "./editors/tiptap.js";
import codemirror from "./editors/codemirror.js";
import monaco from "./editors/monaco.js";
import ace from "./editors/ace.js";
import quill from "./editors/quill.js";
import editorjs from "./editors/editorjs.js";
import bigtext from "./textbig.js";
import smalltext from "./textsmall.js";
import bigcode from "./codebig.js";
import smallcode from "./codesmall.js";

const EDITORS = {
  "Monaco": {
    ctor: monaco,
    type: "code", 
  },
  "CodeMirror": {
    ctor: codemirror,
    type: "code",
  },
  "Ace": {
    ctor: ace,
    type: "code",
  },
  "TipTap": {
    ctor: tiptap,
    type: "text",
  },
  "Quill": {
    ctor: quill,
    type: "text",
  },
  "EditorJS": {
    ctor: editorjs,
    type: "text",
  },
}

const CODE_EDITORS = [
  [monaco, "Monaco"],
  [codemirror, "CodeMirror"],
  [ace, "Ace"],
];
const TEXT_EDITORS = [
  [tiptap, "TipTap"],
  [quill, "Quill"],
  [editorjs, "EditorJS"],
];
let container = document.querySelector("#editors");

const currentText = () =>
  document.querySelector(`[name="text"]:checked`)?.value === "large"
    ? bigtext
    : smalltext;
const currentCode = () =>
  document.querySelector(`[name="text"]:checked`)?.value === "large"
    ? bigcode
    : smallcode;
const currentSelectedEditor = () =>
  document.querySelector(`[name="editor"]:checked`)?.value;
const currentSize = () =>
  document.querySelector(`[name="size"]:checked`)?.value || 100;
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
        console.time(
          `${editor.value} - ${size.value}% size - ${textSize.value} text`
        );
        await new Promise((resolve) => requestAnimationFrame(resolve));
        console.timeEnd(
          `${editor.value} - ${size.value}% size - ${textSize.value} text`
        );
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  }
});

const radioContainer = document.querySelector("#editor-options");
function showActiveEditor() {
  let container = document.querySelector(`#editor-${currentSelectedEditor()}`);
  document
    .querySelectorAll("#editors > div.active")
    .forEach((el) => el.classList.remove("active"));
  container.classList.add("active");
}

function resizeEditors() {
  document.querySelectorAll("#editors > div").forEach((el) => {
    let percent = currentSize();
    el.style.height = `${el.parentElement.offsetHeight * (percent * 0.01)}px`;
    el.style.width = `${el.parentElement.offsetWidth * (percent * 0.01)}px`;
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
}
for (let [editor, displayName] of CODE_EDITORS) {
  createEditor(editor, displayName, "code");
}
for (let [editor, displayName] of TEXT_EDITORS) {
  createEditor(editor, displayName, "text");
}


for (let id in EDITORS) {
  let ed = EDITORS[id];
  if (!ed.editor) {
    let el = document.querySelector(`#editor-${id}`);
    ed.editor = ed.ctor(el, ed.type == "code" ? currentCode() : currentText());
  }
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
    for (let id in EDITORS) {
      let ed = EDITORS[id];
      ed.editor.setValue(ed.type == "code" ? currentCode() : currentText());
    }
  }
});

if (!currentSelectedEditor()) {
  document.querySelector(`[name="editor"]`).checked = true;
}
showActiveEditor();
