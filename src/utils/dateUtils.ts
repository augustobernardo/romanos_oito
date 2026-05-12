export const calculateAge = (birthday: string): number => {
  if (!birthday) return 0;
  const today = new Date();
  const birthDate = new Date(birthday + "T00:00:00");
  if (isNaN(birthDate.getTime())) return 0;
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const calculateAgeAtReferenceDate = (
  birthDate: string,
  referenceDate: string,
): number => {
  if (!birthDate || !referenceDate) return 0;
  const birth = new Date(birthDate + "T00:00:00");
  const reference = new Date(referenceDate + "T00:00:00");
  if (isNaN(birth.getTime()) || isNaN(reference.getTime())) return 0;
  let age = reference.getFullYear() - birth.getFullYear();
  const monthDiff = reference.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && reference.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};
