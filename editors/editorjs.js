import EditorJS from "@editorjs/editorjs";
export default function (element, value) {
  let lastValue = value;
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
      lastValue = value;
      // https://github.com/codex-team/editor.js/issues/781
      editor.render({
        blocks: value.split("\n").map((value) => {
          return {
            type: "paragraph",
            data: {
              text: value
            },
          };
        }),
      });
    },
    format(on) {
      // This is pretty different from other editors since each block is treated differently.
      // It'd be nice to come up with a better solution here, like bolding all of the existing blocks, but
      // I'm not sure yet how to do that.
      let value = on ? lastValue.toUpperCase() : lastValue;
      editor.render({
        blocks: value.split("\n").map((value) => {
          return {
            type: "paragraph",
            data: {
              text: value
            },
          };
        }),
      });
      
    },
  };
}
