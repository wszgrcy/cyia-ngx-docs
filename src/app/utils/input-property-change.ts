export function inputPropertyChange(change, index: string) {
  return change && Number.isInteger(Number.parseInt(index, 10));
}
