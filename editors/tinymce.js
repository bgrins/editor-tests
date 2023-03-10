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

  // https://www.tiny.cloud/blog/how-to-get-content-and-set-content-in-tinymce/
  // If this is set before the promise resolves there's no initial content.
  promise.then((_) => tinymce.activeEditor.setContent(value));

  return {
    editor: tinymce.activeEditor,
    setValue(value) {
      tinymce.activeEditor.setContent(value);
    },
    format(on) {
      // There's a bug if the editor hasn't been initialized yet, but in practice
      // it's alright as long as the editor isn't chosen before that, since format
      // will be called when it's chosen.
      if (tinymce.activeEditor.selection) {
        tinymce.activeEditor.selection.select(
          tinymce.activeEditor.getBody(),
          true
        );
        // Bold is only a toggle, so let's use something that we can be sure is
        // always in the requested state.
        document.execCommand("foreColor", false, on ? "red" : null);
        tinymce.activeEditor.selection.collapse();
      }
    },
  };
}
