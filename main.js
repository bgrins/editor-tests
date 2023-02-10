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
const USE_DELAY = new URLSearchParams(window.location.search).has("delay");
const RAF_BETWEEN_STEPS = new URLSearchParams(window.location.search).has(
  "raf"
);
const DEFAULT_EDITOR = new URLSearchParams(window.location.search).get(
  "editor"
);
const ALLOW_QUILL = new URLSearchParams(window.location.search).has("quill");
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
    disabled: !ALLOW_QUILL, // Disabled by default due to MutationEvents
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
const currentFormatting = () =>
  document.querySelector(`[name="style"]:checked`)?.value === "fancy"
    ? true
    : false;
const currentSelectedEditor = () =>
  EDITORS[document.querySelector(`[name="editor"]:checked`)?.value];
const currentSize = () =>
  document.querySelector(`[name="size"]:checked`)?.value || 100;
const textOptions = () => [...document.querySelectorAll(`[name="text"]`)];
const sizeOptions = () => [...document.querySelectorAll(`[name="size"]`)];
const styleOptions = () => [...document.querySelectorAll(`[name="style"]`)];
const editorOptions = () => [...document.querySelectorAll(`[name="editor"]`)];

let running = false;
async function runTests() {
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
        for (let style of styleOptions()) {
          permutations.push([editor, textSize, size, style]);
        }
      }
    }
  }

  // Reset state to make sure we measure setting to new text on each editor
  for (let id in EDITORS) {
    EDITORS[id].editor?.setValue("");
  }

  for (let [editor, textSize, size, style] of permutations) {
    performance.mark(
      `${editor.value} - ${size.value}% viewport - ${textSize.value} text length - ${style.value} formatting`
    );
    console.time(
      `${editor.value} - ${size.value}% viewport - ${textSize.value} text length - ${style.value} formatting`
    );
    // Not actually clicking the option radios because we don't want it to auto
    // populate the text with the current value (which may require duplicating
    // work like showing the large text first before switching to small).
    size.checked = true;
    textSize.checked = true;
    editor.checked = true;
    style.checked = true;
    let ed = currentSelectedEditor();
    showActiveEditor();
    if (RAF_BETWEEN_STEPS) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    ed.resize();
    ed.editor.setValue(ed.type == "code" ? currentCode() : currentText());
    ed.editor.format(currentFormatting());

    await new Promise((resolve) => requestAnimationFrame(resolve));
    console.timeEnd(
      `${editor.value} - ${size.value}% viewport - ${textSize.value} text length - ${style.value} formatting`
    );
    if (USE_DELAY) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  console.timeEnd("Automated run");
  running = false;
}

const radioContainer = document.querySelector("#editor-options");

function showActiveEditor() {
  let ed = currentSelectedEditor();
  let container = ed.container;
  document
    .querySelectorAll("#editors > div.active")
    .forEach((el) => el.classList.remove("active"));
  container.classList.add("active");
}

function resize(el, percent) {
  percent = percent || currentSize();
  el.style.height = `${el.parentElement.offsetHeight * (percent * 0.01)}px`;
  el.style.width = `${el.parentElement.offsetWidth * (percent * 0.01)}px`;
}

function createControls(displayName) {
  let radio = document.createElement("input");
  radio.type = "radio";
  radio.name = "editor";
  radio.value = displayName;
  radio.id = displayName;
  let label = document.createElement("label");
  label.setAttribute("for", displayName);
  label.textContent = displayName;
  radioContainer.append(radio, label);
  return radio;
}

for (let id in EDITORS) {
  let ed = EDITORS[id];
  if (ed.disabled) {
    continue;
  }
  ed.id = id;

  ed.container = document.createElement("div");
  ed.container.id = `editor-${id}`;
  container.append(ed.container);
  ed.input = createControls(id);
  ed.resize = resize.bind(null, ed.container);

  if (!ed.editor) {
    let el = document.querySelector(`#editor-${id}`);
    ed.editor = ed.ctor(el, "");
  }
}

document.querySelector("#run").addEventListener("click", runTests);

window.addEventListener("resize", () => {
  currentSelectedEditor()?.resize();
});

document.addEventListener("change", (e) => {
  let ed = currentSelectedEditor();
  if (!ed) {
    return;
  }
  if (e.target.name === "size") {
    ed.resize();
  }
  if (e.target.name === "style") {
    ed.editor.format(currentFormatting());
  }
  if (e.target.name === "text") {
    ed.editor.setValue(ed.type == "code" ? currentCode() : currentText());
    ed.editor.format(currentFormatting());
  }
  if (e.target.name === "editor") {
    showActiveEditor();

    ed.resize();
    ed.editor.setValue(ed.type == "code" ? currentCode() : currentText());
    ed.editor.format(currentFormatting());
  }
});

// Allow selction like http://localhost:5173/?editor=Ace
EDITORS[DEFAULT_EDITOR]?.input.click();
