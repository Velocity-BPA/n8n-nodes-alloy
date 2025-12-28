/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Alloy Entity Utilities
 *
 * Helper functions for working with Alloy entities
 */

import { ENTITY_TYPES, EntityType } from '../constants/riskLevels';

/**
 * Entity data structure for individuals
 */
export interface IndividualEntityData {
  name_first: string;
  name_last: string;
  name_middle?: string;
  name_suffix?: string;
  email_address?: string;
  phone_number?: string;
  birth_date?: string;
  ssn?: string;
  document_ssn?: string;
  address_line_1?: string;
  address_line_2?: string;
  address_city?: string;
  address_state?: string;
  address_postal_code?: string;
  address_country_code?: string;
  [key: string]: any;
}

/**
 * Entity data structure for businesses
 */
export interface BusinessEntityData {
  business_name: string;
  business_ein?: string;
  business_type?: string;
  business_phone?: string;
  business_email?: string;
  business_website?: string;
  business_address_line_1?: string;
  business_address_line_2?: string;
  business_address_city?: string;
  business_address_state?: string;
  business_address_postal_code?: string;
  business_address_country_code?: string;
  formation_date?: string;
  formation_state?: string;
  [key: string]: any;
}

/**
 * Combined entity data type
 */
export type EntityData = IndividualEntityData | BusinessEntityData;

/**
 * Determines the entity type based on the data provided
 */
export function determineEntityType(data: Record<string, any>): EntityType {
  if (data.business_name || data.business_ein) {
    return ENTITY_TYPES.BUSINESS;
  }
  return ENTITY_TYPES.INDIVIDUAL;
}

/**
 * Formats an individual's full name
 */
export function formatFullName(data: IndividualEntityData): string {
  const parts: string[] = [];
  
  if (data.name_first) parts.push(data.name_first);
  if (data.name_middle) parts.push(data.name_middle);
  if (data.name_last) parts.push(data.name_last);
  if (data.name_suffix) parts.push(data.name_suffix);
  
  return parts.join(' ').trim();
}

/**
 * Formats an address into a single string
 */
export function formatAddress(data: {
  address_line_1?: string;
  address_line_2?: string;
  address_city?: string;
  address_state?: string;
  address_postal_code?: string;
  address_country_code?: string;
}): string {
  const lines: string[] = [];
  
  if (data.address_line_1) lines.push(data.address_line_1);
  if (data.address_line_2) lines.push(data.address_line_2);
  
  const cityStateZip: string[] = [];
  if (data.address_city) cityStateZip.push(data.address_city);
  if (data.address_state) cityStateZip.push(data.address_state);
  if (data.address_postal_code) cityStateZip.push(data.address_postal_code);
  
  if (cityStateZip.length > 0) {
    lines.push(cityStateZip.join(', '));
  }
  
  if (data.address_country_code) lines.push(data.address_country_code);
  
  return lines.join('\n');
}

/**
 * Masks sensitive data for logging
 */
export function maskSensitiveData(data: Record<string, any>): Record<string, any> {
  const sensitiveFields = [
    'ssn',
    'document_ssn',
    'birth_date',
    'business_ein',
    'account_number',
    'routing_number',
  ];
  
  const masked = { ...data };
  
  for (const field of sensitiveFields) {
    if (masked[field]) {
      const value = String(masked[field]);
      if (value.length > 4) {
        masked[field] = `***${value.slice(-4)}`;
      } else {
        masked[field] = '****';
      }
    }
  }
  
  return masked;
}

/**
 * Extracts required fields for KYC verification
 */
export function extractKYCFields(data: IndividualEntityData): Record<string, any> {
  return {
    name_first: data.name_first,
    name_last: data.name_last,
    birth_date: data.birth_date,
    ssn: data.ssn || data.document_ssn,
    address_line_1: data.address_line_1,
    address_city: data.address_city,
    address_state: data.address_state,
    address_postal_code: data.address_postal_code,
    address_country_code: data.address_country_code || 'US',
  };
}

/**
 * Extracts required fields for KYB verification
 */
export function extractKYBFields(data: BusinessEntityData): Record<string, any> {
  return {
    business_name: data.business_name,
    business_ein: data.business_ein,
    business_address_line_1: data.business_address_line_1,
    business_address_city: data.business_address_city,
    business_address_state: data.business_address_state,
    business_address_postal_code: data.business_address_postal_code,
    business_address_country_code: data.business_address_country_code || 'US',
    formation_date: data.formation_date,
    formation_state: data.formation_state,
  };
}

/**
 * Validates entity data has minimum required fields
 */
export function validateEntityData(
  data: Record<string, any>,
  entityType: EntityType,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (entityType === ENTITY_TYPES.INDIVIDUAL) {
    if (!data.name_first) errors.push('First name is required');
    if (!data.name_last) errors.push('Last name is required');
  } else if (entityType === ENTITY_TYPES.BUSINESS) {
    if (!data.business_name) errors.push('Business name is required');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Merges entity data, preferring non-null values from the update
 */
export function mergeEntityData<T extends Record<string, any>>(
  existing: T,
  update: Partial<T>,
): T {
  const merged = { ...existing };
  
  for (const [key, value] of Object.entries(update)) {
    if (value !== null && value !== undefined && value !== '') {
      merged[key as keyof T] = value as T[keyof T];
    }
  }
  
  return merged;
}

/**
 * Calculates age from birth date
 */
export function calculateAge(birthDate: string): number | null {
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return null;
  
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Checks if an individual is of legal age (18+)
 */
export function isLegalAge(birthDate: string, minimumAge: number = 18): boolean {
  const age = calculateAge(birthDate);
  return age !== null && age >= minimumAge;
}

/**
 * Generates a deterministic external ID from entity data
 */
export function generateExternalId(data: Record<string, any>, prefix: string = 'EXT'): string {
  const crypto = require('crypto');
  const key = JSON.stringify(data);
  const hash = crypto.createHash('sha256').update(key).digest('hex').substring(0, 16);
  return `${prefix}_${hash}`;
}
