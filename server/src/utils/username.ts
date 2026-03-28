export const isValidUsername = (username: string): boolean => {
  const regex = /^[a-zA-Z0-9_]+$/;
  return regex.test(username);
};

export const normalizeUsername = (username: string): string => {
  return username.trim().toLowerCase();
};

export const isReservedUsername = (username: string): boolean => {
  const reserved = ["admin", "support", "system", "chat"];
  return reserved.includes(username.toLowerCase());
};