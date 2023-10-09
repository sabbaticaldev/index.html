// TODO: make i18n integrate with localStorage to store the current language and alternatives
// Then make every translation available to every component

const i18n = (dict) => {
  return (key) => dict[key];
};

export default i18n;
