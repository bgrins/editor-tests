import Quill from "quill";
// Currently loading this as a link in header instead
// import styles from "quill/dist/quill.snow.css?inline";

export default function (element, value) {
  var quill = new Quill(`#${element.id}`, {
    theme: "snow",
  });
  quill.setText(value);

  return {
    editor: quill,
    setValue: (value) => quill.setText(value),
  };
}
