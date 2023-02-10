// https://www.tiny.cloud/docs-4x/advanced/usage-with-module-loaders/
// https://www.tiny.cloud/docs/advanced/usage-with-module-loaders/rollup/rollup_es6_npm/

import tinymce from "tinymce/tinymce";

// https://forum.vite.net/topic/5753/using-tinymcs-wysiwig-editor/3
import "tinymce/models/dom";

import "tinymce/themes/silver/theme";
import "tinymce/icons/default/icons";

// Injecting content style appears to cause side effects with the document, unforunately.
// So just use an empty string instead and we'll use an inline editor.
// import contentUiCss from "tinymce/skins/ui/oxide/content.css?inline";
// import contentCss from "tinymce/skins/content/default/content.css?inline";
// const contentStyle = contentUiCss.toString() + '\n' + contentCss.toString();

export default function (element, value) {
  // TinyMCE puts a sibling element next to the container, but we're relying on the structure
  // of the runner to only have container-per-editor. So put a child underneath and attach
  // to that.
  element.style.overflow = "auto";
  let innerContainer = document.createElement("div");
  innerContainer.id = "tinymce-container";
  element.appendChild(innerContainer);

  let promise = tinymce.init({
    selector: `#tinymce-container`,
    menubar: false,
    inline: true,
    skin: false,
    content_css: false,
    content_style: "",
  });

  console.log(tinymce, tinymce.activeEditor);

  // https://www.tiny.cloud/blog/how-to-get-content-and-set-content-in-tinymce/
  // If this is set before the promise resolves there's no initial content.
  promise.then((_) => tinymce.activeEditor.setContent(value));

  return {
    editor: tinymce.activeEditor,
    setValue(value) {
      tinymce.activeEditor.setContent(value);
    },
  };
}
