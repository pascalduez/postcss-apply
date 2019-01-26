export function kebabify(prop) {
  const upperToHyphen = (match, offset, string) => {
    const addDash = offset && string.charAt(offset - 1) !== '-';

    return (addDash ? '-' : '') + match.toLowerCase();
  };

  return prop.replace(/[A-Z]/g, upperToHyphen);
}

export const isPlainObject = arg =>
  Object.prototype.toString.call(arg) === '[object Object]';
