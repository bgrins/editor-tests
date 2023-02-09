import "./style.css";
import javascriptLogo from "./javascript.svg";
import { setupCounter } from "./counter.js";
import tiptap from "./editors/tiptap.js";
import codemirror from "./editors/codemirror.js";
import bigtext from "./textbig.js";
import smalltext from "./textsmall.js";


const currentText = () => document.querySelector("#size").checked ? bigtext : smalltext;

let container = document.querySelector("#editors");
let editors = [];
for (let editor of [tiptap, codemirror]) {
  let el = document.createElement("div");
  container.append(el);
  editors.push(editor(el, currentText()));
}

document.querySelector("#size").addEventListener("change", (e) => {
  for (let i of editors) {
    i.setValue(currentText());
  }
});
