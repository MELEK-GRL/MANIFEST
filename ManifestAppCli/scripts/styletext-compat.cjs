const util = require('util');

const original = util.styleText.bind(util);

util.styleText = function styleText(format, text, options) {
  if (Array.isArray(format)) {
    return format.reduce(
      (value, name) => original(name, value, options),
      text,
    );
  }
  return original(format, text, options);
};
