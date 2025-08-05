export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validateRequired = (value) => {
  return value && value.trim() !== '';
};

export const validatePhone = (phone) => {
  return phone && phone.length >= 10;
};

export const validateFile = (file, maxSizeMB = 5) => {
  if (!file) return false;
  return file.size <= maxSizeMB * 1024 * 1024;
};