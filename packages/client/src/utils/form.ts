export const isValid = ({
  firstName,
  lastName,
  email,
  password,
}: Record<string, string>) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const firstValid = firstName == null || firstName.length > 3;
  const lastValid = lastName == null || lastName.length > 3;

  return (
    emailRegex.test(email) &&
    email.length <= 254 &&
    password.length > 3 &&
    firstValid &&
    lastValid
  );
};
