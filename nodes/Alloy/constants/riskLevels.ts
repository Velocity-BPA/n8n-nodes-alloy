/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Alloy Risk Assessment Constants
 */

// Risk levels
export const RISK_LEVELS = {
  VERY_LOW: 'very_low',
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  VERY_HIGH: 'very_high',
  CRITICAL: 'critical',
} as const;

export type RiskLevel = (typeof RISK_LEVELS)[keyof typeof RISK_LEVELS];

// Risk categories
export const RISK_CATEGORIES = {
  IDENTITY: 'identity',
  FRAUD: 'fraud',
  AML: 'aml',
  SANCTIONS: 'sanctions',
  PEP: 'pep',
  ADVERSE_MEDIA: 'adverse_media',
  CREDIT: 'credit',
  BEHAVIORAL: 'behavioral',
  GEOGRAPHIC: 'geographic',
  INDUSTRY: 'industry',
} as const;

export type RiskCategory = (typeof RISK_CATEGORIES)[keyof typeof RISK_CATEGORIES];

// Risk signal types
export const RISK_SIGNALS = {
  WATCHLIST_HIT: 'watchlist_hit',
  DOCUMENT_FRAUD: 'document_fraud',
  IDENTITY_MISMATCH: 'identity_mismatch',
  ADDRESS_VERIFICATION_FAILED: 'address_verification_failed',
  HIGH_RISK_COUNTRY: 'high_risk_country',
  HIGH_RISK_INDUSTRY: 'high_risk_industry',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  VELOCITY_EXCEEDED: 'velocity_exceeded',
  DEVICE_FRAUD: 'device_fraud',
  IP_RISK: 'ip_risk',
  EMAIL_RISK: 'email_risk',
  PHONE_RISK: 'phone_risk',
} as const;

export type RiskSignal = (typeof RISK_SIGNALS)[keyof typeof RISK_SIGNALS];

// Watchlist sources
export const WATCHLIST_SOURCES = {
  OFAC: 'ofac',
  UN_SANCTIONS: 'un_sanctions',
  EU_SANCTIONS: 'eu_sanctions',
  UK_SANCTIONS: 'uk_sanctions',
  PEP: 'pep',
  ADVERSE_MEDIA: 'adverse_media',
  FBI: 'fbi',
  INTERPOL: 'interpol',
  CUSTOM: 'custom',
} as const;

export type WatchlistSource = (typeof WATCHLIST_SOURCES)[keyof typeof WATCHLIST_SOURCES];

// Entity types for risk assessment
export const ENTITY_TYPES = {
  INDIVIDUAL: 'individual',
  BUSINESS: 'business',
  TRUST: 'trust',
  NON_PROFIT: 'non_profit',
  GOVERNMENT: 'government',
} as const;

export type EntityType = (typeof ENTITY_TYPES)[keyof typeof ENTITY_TYPES];

// n8n dropdown options
export const RISK_LEVEL_OPTIONS = [
  { name: 'Very Low', value: 'very_low' },
  { name: 'Low', value: 'low' },
  { name: 'Medium', value: 'medium' },
  { name: 'High', value: 'high' },
  { name: 'Very High', value: 'very_high' },
  { name: 'Critical', value: 'critical' },
];

export const RISK_CATEGORY_OPTIONS = [
  { name: 'Identity', value: 'identity' },
  { name: 'Fraud', value: 'fraud' },
  { name: 'AML', value: 'aml' },
  { name: 'Sanctions', value: 'sanctions' },
  { name: 'PEP', value: 'pep' },
  { name: 'Adverse Media', value: 'adverse_media' },
  { name: 'Credit', value: 'credit' },
  { name: 'Behavioral', value: 'behavioral' },
  { name: 'Geographic', value: 'geographic' },
  { name: 'Industry', value: 'industry' },
];

export const WATCHLIST_SOURCE_OPTIONS = [
  { name: 'OFAC', value: 'ofac' },
  { name: 'UN Sanctions', value: 'un_sanctions' },
  { name: 'EU Sanctions', value: 'eu_sanctions' },
  { name: 'UK Sanctions', value: 'uk_sanctions' },
  { name: 'PEP', value: 'pep' },
  { name: 'Adverse Media', value: 'adverse_media' },
  { name: 'FBI', value: 'fbi' },
  { name: 'Interpol', value: 'interpol' },
  { name: 'Custom', value: 'custom' },
];

export const ENTITY_TYPE_OPTIONS = [
  { name: 'Individual', value: 'individual' },
  { name: 'Business', value: 'business' },
  { name: 'Trust', value: 'trust' },
  { name: 'Non-Profit', value: 'non_profit' },
  { name: 'Government', value: 'government' },
];

// Risk score thresholds (configurable defaults)
export const DEFAULT_RISK_THRESHOLDS = {
  VERY_LOW_MAX: 20,
  LOW_MAX: 40,
  MEDIUM_MAX: 60,
  HIGH_MAX: 80,
  VERY_HIGH_MAX: 90,
  // Above 90 is CRITICAL
} as const;
