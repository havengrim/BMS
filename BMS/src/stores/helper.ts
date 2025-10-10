export const formatBirthdate = (birthdate: string) => {
  const date = new Date(birthdate);
  const day = date.getDate();
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}
