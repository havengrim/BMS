
export function validatePhilippinePhone(input: string): boolean {

  // 09123456789 or +639123456789 or 9123456789
  const regex = /^(?:\+639|09|9)\d{9}$/;
  return regex.test(input);
}
