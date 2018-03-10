// @flow

export function kebabify(prop: string): string {
  const upperToHyphen = (
    match: string,
    offset: number,
    string: string
  ): string => {
    const addDash = offset && string.charAt(offset - 1) !== '-';

    return (addDash ? '-' : '') + match.toLowerCase();
  };

  return prop.replace(/[A-Z]/g, upperToHyphen);
}

export const isPlainObject = (arg: any) =>
  Object.prototype.toString.call(arg) === '[object Object]';
