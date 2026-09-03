/**
 * classNames utility - Conditional class name concatenation
 */
export function classNames(...classes) {
  return classes
    .filter(Boolean)
    .join(' ');
}

export default classNames;
