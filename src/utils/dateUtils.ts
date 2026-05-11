export const calculateAge = (birthday: string): number => {
  if (!birthday) return 0;
  const today = new Date();
  const birthDate = new Date(birthday);
  if (isNaN(birthDate.getTime())) return 0;
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};
