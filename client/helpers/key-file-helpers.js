export const download = (keys, fileName) => {
  const element = document.createElement("a");
  const file = new Blob([JSON.stringify(keys)], {
    type: "text/plain;charset=utf-8",
  });
  element.href = URL.createObjectURL(file);
  element.download = `${fileName}.json`;
  document.body.appendChild(element);
  element.click();
};

export const upload = (e, setKeys) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.addEventListener(
    "load",
    () => {
      setKeys(JSON.parse(reader.result));
    },
    false
  );
  if (file) {
    reader.readAsText(file);
  }
};
