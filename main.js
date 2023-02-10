import "./style.css";
import tiptap from "./editors/tiptap.js";
import codemirror from "./editors/codemirror.js";
import monaco from "./editors/monaco.js";
import ace from "./editors/ace.js";
import quill from "./editors/quill.js";
import editorjs from "./editors/editorjs.js";
import tinymce from "./editors/tinymce.js";
import bigtext from "./textbig.js";
import smalltext from "./textsmall.js";
import bigcode from "./codebig.js";
import smallcode from "./codesmall.js";

let container = document.querySelector("#editors");

const EDITORS = {
  Monaco: {
    ctor: monaco,
    type: "code",
  },
  CodeMirror: {
    ctor: codemirror,
    type: "code",
  },
  Ace: {
    ctor: ace,
    type: "code",
  },
  TipTap: {
    ctor: tiptap,
    type: "text",
  },
  Quill: {
    ctor: quill,
    disabled: true,
    type: "text",
  },
  EditorJS: {
    ctor: editorjs,
    type: "text",
  },
  TinyMCE: {
    ctor: tinymce,
    type: "text",
  },
};

const currentText = () =>
  document.querySelector(`[name="text"]:checked`)?.value === "large"
    ? bigtext
    : smalltext;
const currentCode = () =>
  document.querySelector(`[name="text"]:checked`)?.value === "large"
    ? bigcode
    : smallcode;
const currentSelectedEditor = () =>
  EDITORS[document.querySelector(`[name="editor"]:checked`)?.value];
const currentSize = () =>
  document.querySelector(`[name="size"]:checked`)?.value || 100;
const textOptions = () => [...document.querySelectorAll(`[name="text"]`)];
const sizeOptions = () => [...document.querySelectorAll(`[name="size"]`)];
const editorOptions = () => [...document.querySelectorAll(`[name="editor"]`)];

let running = false;
document.querySelector("#run").addEventListener("click", async (e) => {
  if (running) {
    console.log("Already running, returning");
    return;
  }
  running = true;
  console.time("Automated run");
  let permutations = [];
  for (let editor of editorOptions()) {
    for (let textSize of textOptions()) {
      for (let size of sizeOptions()) {
        permutations.push([editor, textSize, size]);
      }
    }
  }
  for (let [editor, textSize, size] of permutations) {
    performance.mark(
      `${editor.value} - ${size.value}% viewport - ${textSize.value} text`
    );
    console.time(
      `${editor.value} - ${size.value}% viewport - ${textSize.value} text`
    );
    // Not actually clicking the option radios because we don't want it to auto
    // populate the text with the current value (which may require duplicating
    // work like showing the large text first before switching to small).
    size.checked = true;
    textSize.checked = true;

    // Now that we've set the options, we can actually click the editor radio
    editor.click();
    await new Promise((resolve) => requestAnimationFrame(resolve));
    console.timeEnd(
      `${editor.value} - ${size.value}% viewport - ${textSize.value} text`
    );
  }
  console.timeEnd("Automated run");
  running = false;
});

const radioContainer = document.querySelector("#editor-options");

function showActiveEditor() {
  let ed = currentSelectedEditor();
  let container = ed.container;
  document
    .querySelectorAll("#editors > div.active")
    .forEach((el) => el.classList.remove("active"));
  container.classList.add("active");
}

function resize(el, percent = currentSize()) {
  el.style.height = `${el.parentElement.offsetHeight * (percent * 0.01)}px`;
  el.style.width = `${el.parentElement.offsetWidth * (percent * 0.01)}px`;
}

function createControls(displayName) {
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
  return el;
}

for (let id in EDITORS) {
  let ed = EDITORS[id];
  if (ed.disabled) {
    continue;
  }
  ed.id = id;
  ed.container = createControls(id);
  ed.resize = resize.bind(null, ed.container);

  if (!ed.editor) {
    let el = document.querySelector(`#editor-${id}`);
    ed.editor = ed.ctor(el, ed.type == "code" ? currentCode() : currentText());
  }
}

window.addEventListener("resize", () => {
  currentSelectedEditor()?.resize();
});

document.addEventListener("change", (e) => {
  let ed = currentSelectedEditor();
  if (e.target.name === "size") {
    ed.resize();
  }
  if (e.target.name === "text") {
    ed.editor.setValue(ed.type == "code" ? currentCode() : currentText());
  }
  if (e.target.name === "editor") {
    showActiveEditor();

    ed.resize();
    ed.editor.setValue(ed.type == "code" ? currentCode() : currentText());
  }
});

if (!currentSelectedEditor()) {
  document.querySelector(`[name="editor"]`).click();
}
