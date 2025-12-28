/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Alloy Document Types and Categories
 */

// Identity document types
export const IDENTITY_DOCUMENT_TYPES = {
  PASSPORT: 'passport',
  DRIVERS_LICENSE: 'drivers_license',
  NATIONAL_ID: 'national_id',
  STATE_ID: 'state_id',
  RESIDENCE_PERMIT: 'residence_permit',
  VISA: 'visa',
  MILITARY_ID: 'military_id',
  TRIBAL_ID: 'tribal_id',
} as const;

export type IdentityDocumentType = (typeof IDENTITY_DOCUMENT_TYPES)[keyof typeof IDENTITY_DOCUMENT_TYPES];

// Proof of address document types
export const ADDRESS_DOCUMENT_TYPES = {
  UTILITY_BILL: 'utility_bill',
  BANK_STATEMENT: 'bank_statement',
  TAX_DOCUMENT: 'tax_document',
  GOVERNMENT_LETTER: 'government_letter',
  LEASE_AGREEMENT: 'lease_agreement',
  MORTGAGE_STATEMENT: 'mortgage_statement',
  INSURANCE_DOCUMENT: 'insurance_document',
} as const;

export type AddressDocumentType = (typeof ADDRESS_DOCUMENT_TYPES)[keyof typeof ADDRESS_DOCUMENT_TYPES];

// Business document types
export const BUSINESS_DOCUMENT_TYPES = {
  ARTICLES_OF_INCORPORATION: 'articles_of_incorporation',
  CERTIFICATE_OF_FORMATION: 'certificate_of_formation',
  OPERATING_AGREEMENT: 'operating_agreement',
  BYLAWS: 'bylaws',
  EIN_LETTER: 'ein_letter',
  BUSINESS_LICENSE: 'business_license',
  CERTIFICATE_OF_GOOD_STANDING: 'certificate_of_good_standing',
  ANNUAL_REPORT: 'annual_report',
  BANK_STATEMENT_BUSINESS: 'bank_statement_business',
  TAX_RETURN: 'tax_return',
} as const;

export type BusinessDocumentType = (typeof BUSINESS_DOCUMENT_TYPES)[keyof typeof BUSINESS_DOCUMENT_TYPES];

// Financial document types
export const FINANCIAL_DOCUMENT_TYPES = {
  PAY_STUB: 'pay_stub',
  W2: 'w2',
  TAX_RETURN_PERSONAL: 'tax_return_personal',
  BANK_STATEMENT_PERSONAL: 'bank_statement_personal',
  INVESTMENT_STATEMENT: 'investment_statement',
  SOCIAL_SECURITY_STATEMENT: 'social_security_statement',
} as const;

export type FinancialDocumentType = (typeof FINANCIAL_DOCUMENT_TYPES)[keyof typeof FINANCIAL_DOCUMENT_TYPES];

// Document verification statuses
export const DOCUMENT_VERIFICATION_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  VERIFIED: 'verified',
  FAILED: 'failed',
  EXPIRED: 'expired',
  REJECTED: 'rejected',
} as const;

export type DocumentVerificationStatus = (typeof DOCUMENT_VERIFICATION_STATUSES)[keyof typeof DOCUMENT_VERIFICATION_STATUSES];

// Document categories
export const DOCUMENT_CATEGORIES = {
  IDENTITY: 'identity',
  ADDRESS: 'address',
  BUSINESS: 'business',
  FINANCIAL: 'financial',
  OTHER: 'other',
} as const;

export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[keyof typeof DOCUMENT_CATEGORIES];

// n8n dropdown options
export const IDENTITY_DOCUMENT_OPTIONS = [
  { name: 'Passport', value: 'passport' },
  { name: "Driver's License", value: 'drivers_license' },
  { name: 'National ID', value: 'national_id' },
  { name: 'State ID', value: 'state_id' },
  { name: 'Residence Permit', value: 'residence_permit' },
  { name: 'Visa', value: 'visa' },
  { name: 'Military ID', value: 'military_id' },
  { name: 'Tribal ID', value: 'tribal_id' },
];

export const ADDRESS_DOCUMENT_OPTIONS = [
  { name: 'Utility Bill', value: 'utility_bill' },
  { name: 'Bank Statement', value: 'bank_statement' },
  { name: 'Tax Document', value: 'tax_document' },
  { name: 'Government Letter', value: 'government_letter' },
  { name: 'Lease Agreement', value: 'lease_agreement' },
  { name: 'Mortgage Statement', value: 'mortgage_statement' },
  { name: 'Insurance Document', value: 'insurance_document' },
];

export const BUSINESS_DOCUMENT_OPTIONS = [
  { name: 'Articles of Incorporation', value: 'articles_of_incorporation' },
  { name: 'Certificate of Formation', value: 'certificate_of_formation' },
  { name: 'Operating Agreement', value: 'operating_agreement' },
  { name: 'Bylaws', value: 'bylaws' },
  { name: 'EIN Letter', value: 'ein_letter' },
  { name: 'Business License', value: 'business_license' },
  { name: 'Certificate of Good Standing', value: 'certificate_of_good_standing' },
  { name: 'Annual Report', value: 'annual_report' },
  { name: 'Business Bank Statement', value: 'bank_statement_business' },
  { name: 'Tax Return', value: 'tax_return' },
];

export const DOCUMENT_CATEGORY_OPTIONS = [
  { name: 'Identity', value: 'identity' },
  { name: 'Address', value: 'address' },
  { name: 'Business', value: 'business' },
  { name: 'Financial', value: 'financial' },
  { name: 'Other', value: 'other' },
];

export const DOCUMENT_STATUS_OPTIONS = [
  { name: 'Pending', value: 'pending' },
  { name: 'Processing', value: 'processing' },
  { name: 'Verified', value: 'verified' },
  { name: 'Failed', value: 'failed' },
  { name: 'Expired', value: 'expired' },
  { name: 'Rejected', value: 'rejected' },
];
