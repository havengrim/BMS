export function validatePhilippinePhone(input: string): boolean {
  // Allows: 09123456789 or 9123456789
  const regex = /^(?:09|9)\d{9}$/;
  return regex.test(input);
}
