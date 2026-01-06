/**
 * Validações profissionais para produção
 * Email, CNPJ, CPF, etc
 */

/**
 * Validar email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validar CNPJ
 */
export const isValidCNPJ = (cnpj) => {
  // Remove caracteres especiais
  const cleanCNPJ = cnpj.replace(/\D/g, '');

  // Deve ter 14 dígitos
  if (cleanCNPJ.length !== 14) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false;

  // Validação do primeiro dígito verificador
  let firstVerifier = 0;
  const firstMultipliers = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  for (let i = 0; i < 12; i++) {
    firstVerifier += parseInt(cleanCNPJ[i]) * firstMultipliers[i];
  }

  firstVerifier = 11 - (firstVerifier % 11);
  if (firstVerifier >= 10) firstVerifier = 0;

  if (firstVerifier !== parseInt(cleanCNPJ[12])) return false;

  // Validação do segundo dígito verificador
  let secondVerifier = 0;
  const secondMultipliers = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  for (let i = 0; i < 13; i++) {
    secondVerifier += parseInt(cleanCNPJ[i]) * secondMultipliers[i];
  }

  secondVerifier = 11 - (secondVerifier % 11);
  if (secondVerifier >= 10) secondVerifier = 0;

  if (secondVerifier !== parseInt(cleanCNPJ[13])) return false;

  return true;
};

/**
 * Validar CPF
 */
export const isValidCPF = (cpf) => {
  // Remove caracteres especiais
  const cleanCPF = cpf.replace(/\D/g, '');

  // Deve ter 11 dígitos
  if (cleanCPF.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  // Validação do primeiro dígito verificador
  let firstVerifier = 0;
  let multiplier = 10;

  for (let i = 0; i < 9; i++) {
    firstVerifier += parseInt(cleanCPF[i]) * multiplier--;
  }

  firstVerifier = 11 - (firstVerifier % 11);
  if (firstVerifier >= 10) firstVerifier = 0;

  if (firstVerifier !== parseInt(cleanCPF[9])) return false;

  // Validação do segundo dígito verificador
  let secondVerifier = 0;
  multiplier = 11;

  for (let i = 0; i < 10; i++) {
    secondVerifier += parseInt(cleanCPF[i]) * multiplier--;
  }

  secondVerifier = 11 - (secondVerifier % 11);
  if (secondVerifier >= 10) secondVerifier = 0;

  if (secondVerifier !== parseInt(cleanCPF[10])) return false;

  return true;
};

/**
 * Sanitizar string (remove caracteres perigosos)
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>\"']/g, '') // Remove caracteres HTML
    .slice(0, 255); // Limita a 255 caracteres
};

/**
 * Validar comprimento mínimo
 */
export const hasMinLength = (input, minLength = 3) => {
  return sanitizeInput(input).length >= minLength;
};

/**
 * Validar comprimento máximo
 */
export const hasMaxLength = (input, maxLength = 255) => {
  return sanitizeInput(input).length <= maxLength;
};

/**
 * Validar se é número
 */
export const isValidNumber = (value) => {
  return !isNaN(value) && value !== '';
};

/**
 * Validar se é número positivo
 */
export const isPositiveNumber = (value) => {
  return isValidNumber(value) && parseFloat(value) > 0;
};

/**
 * Validar se é data válida
 */
export const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

/**
 * Formatar CNPJ para exibição
 */
export const formatCNPJ = (cnpj) => {
  const clean = cnpj.replace(/\D/g, '');
  return clean.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
};

/**
 * Formatar CPF para exibição
 */
export const formatCPF = (cpf) => {
  const clean = cpf.replace(/\D/g, '');
  return clean.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
};

/**
 * Formatar telefone
 */
export const formatPhone = (phone) => {
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 11) {
    return clean.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  }
  if (clean.length === 10) {
    return clean.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  }
  return phone;
};

/**
 * Formatar moeda brasileira
 */
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Validação completa de formulário
 */
export const validateForm = (data, rules) => {
  const errors = {};

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field];

    // Verificar obrigatório
    if (fieldRules.required && (!value || value.toString().trim() === '')) {
      errors[field] = `${fieldRules.label || field} é obrigatório`;
      continue;
    }

    // Verificar tipo email
    if (fieldRules.type === 'email' && value && !isValidEmail(value)) {
      errors[field] = `${fieldRules.label || field} inválido`;
      continue;
    }

    // Verificar CNPJ
    if (fieldRules.type === 'cnpj' && value && !isValidCNPJ(value)) {
      errors[field] = `${fieldRules.label || field} inválido`;
      continue;
    }

    // Verificar CPF
    if (fieldRules.type === 'cpf' && value && !isValidCPF(value)) {
      errors[field] = `${fieldRules.label || field} inválido`;
      continue;
    }

    // Verificar comprimento mínimo
    if (fieldRules.minLength && !hasMinLength(value, fieldRules.minLength)) {
      errors[field] = `${fieldRules.label || field} deve ter no mínimo ${fieldRules.minLength} caracteres`;
      continue;
    }

    // Verificar comprimento máximo
    if (fieldRules.maxLength && !hasMaxLength(value, fieldRules.maxLength)) {
      errors[field] = `${fieldRules.label || field} deve ter no máximo ${fieldRules.maxLength} caracteres`;
      continue;
    }

    // Verificar tipo número
    if (fieldRules.type === 'number' && value && !isValidNumber(value)) {
      errors[field] = `${fieldRules.label || field} deve ser um número`;
      continue;
    }

    // Verificar número positivo
    if (fieldRules.type === 'positive' && value && !isPositiveNumber(value)) {
      errors[field] = `${fieldRules.label || field} deve ser um número positivo`;
      continue;
    }
  }

  return errors;
};
