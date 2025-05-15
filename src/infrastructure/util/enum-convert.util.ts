export function convertStringToEnum<T extends Record<string, string>>(
  enumType: T,
  value: string
): T[keyof T] | null {
  return value in enumType ? enumType[value as keyof T] : null;
}