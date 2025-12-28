/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Alloy Validation Utilities
 *
 * Provides validation functions for Alloy-specific data types
 */

/**
 * Validates an email address format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a phone number (basic format)
 */
export function isValidPhone(phone: string): boolean {
  // Remove common formatting characters
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
  // Must be at least 10 digits and start with optional +
  const phoneRegex = /^\+?\d{10,15}$/;
  return phoneRegex.test(cleaned);
}

/**
 * Validates a date string (ISO format)
 */
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

/**
 * Validates a date of birth (must be in the past)
 */
export function isValidDateOfBirth(dateString: string): boolean {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;
  return date < new Date();
}

/**
 * Validates an SSN format (US Social Security Number)
 * Note: This only validates format, not actual validity
 */
export function isValidSSN(ssn: string): boolean {
  // Remove dashes
  const cleaned = ssn.replace(/-/g, '');
  // Must be exactly 9 digits
  const ssnRegex = /^\d{9}$/;
  return ssnRegex.test(cleaned);
}

/**
 * Validates an EIN format (US Employer Identification Number)
 */
export function isValidEIN(ein: string): boolean {
  // Remove dash
  const cleaned = ein.replace(/-/g, '');
  // Must be exactly 9 digits
  const einRegex = /^\d{9}$/;
  return einRegex.test(cleaned);
}

/**
 * Validates a US ZIP code
 */
export function isValidZipCode(zipCode: string): boolean {
  // 5 digits or 5 digits + 4
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode);
}

/**
 * Validates a US state code (2 letter)
 */
export function isValidStateCode(state: string): boolean {
  const validStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
    'DC', 'PR', 'VI', 'GU', 'AS', 'MP',
  ];
  return validStates.includes(state.toUpperCase());
}

/**
 * Validates a country code (ISO 3166-1 alpha-2)
 */
export function isValidCountryCode(countryCode: string): boolean {
  // Basic validation - 2 uppercase letters
  const countryRegex = /^[A-Z]{2}$/;
  return countryRegex.test(countryCode.toUpperCase());
}

/**
 * Validates an Alloy token format
 */
export function isValidAlloyToken(token: string): boolean {
  // Alloy tokens are typically UUIDs or similar format
  const tokenRegex = /^[a-zA-Z0-9_-]{8,64}$/;
  return tokenRegex.test(token);
}

/**
 * Validates required fields in an object
 */
export function validateRequiredFields(
  obj: Record<string, any>,
  requiredFields: string[],
): { valid: boolean; missingFields: string[] } {
  const missingFields: string[] = [];
  
  for (const field of requiredFields) {
    const value = obj[field];
    if (value === undefined || value === null || value === '') {
      missingFields.push(field);
    }
  }
  
  return {
    valid: missingFields.length === 0,
    missingFields,
  };
}

/**
 * Formats a date to ISO string for Alloy API
 */
export function formatDateForApi(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString();
}

/**
 * Validates and formats a name (removes extra spaces, basic cleaning)
 */
export function sanitizeName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}

/**
 * Validates document file type
 */
export function isValidDocumentType(mimeType: string): boolean {
  const validTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'image/tiff',
  ];
  return validTypes.includes(mimeType.toLowerCase());
}

/**
 * Validates file size (max 10MB by default)
 */
export function isValidFileSize(bytes: number, maxMB: number = 10): boolean {
  const maxBytes = maxMB * 1024 * 1024;
  return bytes > 0 && bytes <= maxBytes;
}

/**
 * Validates a risk score (0-100)
 */
export function isValidRiskScore(score: number): boolean {
  return typeof score === 'number' && score >= 0 && score <= 100;
}

/**
 * Parses and validates pagination parameters
 */
export function validatePagination(
  page?: number,
  limit?: number,
): { page: number; limit: number } {
  const validPage = Math.max(1, Math.floor(page || 1));
  const validLimit = Math.min(100, Math.max(1, Math.floor(limit || 25)));
  
  return { page: validPage, limit: validLimit };
}
