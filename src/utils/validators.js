/**
 * Validator utilities for form validation
 */

export const validators = {
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) || 'Invalid email address';
  },

  required: (value) => {
    return (value && value.trim() !== '') || 'This field is required';
  },

  minLength: (min) => (value) => {
    return (!value || value.length >= min) || `Minimum ${min} characters required`;
  },

  maxLength: (max) => (value) => {
    return (!value || value.length <= max) || `Maximum ${max} characters allowed`;
  },

  phone: (value) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return !value || phoneRegex.test(value) || 'Invalid phone number';
  },

  url: (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return 'Invalid URL';
    }
  },

  number: (value) => {
    return !isNaN(value) && value !== '' || 'Must be a number';
  },

  positive: (value) => {
    return value > 0 || 'Must be a positive number';
  },

  match: (otherValue) => (value) => {
    return value === otherValue || 'Values do not match';
  },
};

export const validate = (value, rules) => {
  if (!Array.isArray(rules)) {
    rules = [rules];
  }

  for (const rule of rules) {
    if (typeof rule === 'function') {
      const result = rule(value);
      if (result !== true) {
        return result;
      }
    }
  }

  return null;
};

export default { validators, validate };
