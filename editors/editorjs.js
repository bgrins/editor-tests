import EditorJS from "@editorjs/editorjs";
export default function (element, value) {
  const editor = new EditorJS({
    /**
     * Id of Element that should contain Editor instance
     */
    holder: element.id,
    data: {
      blocks: value.split("\n").map((value) => {
        return {
          type: "paragraph",
          data: {
            text: value,
          },
        };
      }),
    },
  });

  return {
    editor,
    setValue: (value) => {
      // https://github.com/codex-team/editor.js/issues/781
      editor.render({
        blocks: value.split("\n").map((value) => {
          return {
            type: "paragraph",
            data: {
              text: value,
            },
          };
        }),
      });
    },
    format(on) {},
  };
}
