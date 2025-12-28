/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { verifyWebhookSignature, generateWebhookSignature } from '../../nodes/Alloy/utils/signatureUtils';
import { isValidEmail, isValidPhone, isValidSSN, isValidEIN, validateRequiredFields } from '../../nodes/Alloy/utils/validationUtils';
import { determineEntityType, formatFullName, maskSensitiveData } from '../../nodes/Alloy/utils/entityUtils';
import { OUTCOMES, RISK_LEVELS, ENTITY_TYPES } from '../../nodes/Alloy/constants';

describe('Alloy Node Unit Tests', () => {
  describe('Signature Utilities', () => {
    const secret = 'test-webhook-secret-12345678901234567890';
    const payload = JSON.stringify({ event_type: 'evaluation.completed', data: {} });

    test('should generate valid signature', () => {
      const signature = generateWebhookSignature(payload, secret);
      expect(signature).toBeDefined();
      expect(signature.length).toBe(64); // SHA256 hex
    });

    test('should verify valid signature', () => {
      const signature = generateWebhookSignature(payload, secret);
      const isValid = verifyWebhookSignature(payload, signature, secret);
      expect(isValid).toBe(true);
    });

    test('should reject invalid signature', () => {
      const isValid = verifyWebhookSignature(payload, 'invalid-signature', secret);
      expect(isValid).toBe(false);
    });

    test('should reject tampered payload', () => {
      const signature = generateWebhookSignature(payload, secret);
      const tamperedPayload = JSON.stringify({ event_type: 'tampered', data: {} });
      const isValid = verifyWebhookSignature(tamperedPayload, signature, secret);
      expect(isValid).toBe(false);
    });

    test('should verify signature with timestamp', () => {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const signature = generateWebhookSignature(payload, secret, timestamp);
      const isValid = verifyWebhookSignature(payload, signature, secret, timestamp);
      expect(isValid).toBe(true);
    });
  });

  describe('Validation Utilities', () => {
    test('should validate email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
    });

    test('should validate phone numbers', () => {
      expect(isValidPhone('1234567890')).toBe(true);
      expect(isValidPhone('+11234567890')).toBe(true);
      expect(isValidPhone('(123) 456-7890')).toBe(true);
      expect(isValidPhone('123')).toBe(false);
    });

    test('should validate SSN format', () => {
      expect(isValidSSN('123456789')).toBe(true);
      expect(isValidSSN('123-45-6789')).toBe(true);
      expect(isValidSSN('12345678')).toBe(false);
      expect(isValidSSN('1234567890')).toBe(false);
    });

    test('should validate EIN format', () => {
      expect(isValidEIN('123456789')).toBe(true);
      expect(isValidEIN('12-3456789')).toBe(true);
      expect(isValidEIN('12345678')).toBe(false);
    });

    test('should validate required fields', () => {
      const obj = { name: 'John', email: 'john@example.com', phone: '' };
      const result = validateRequiredFields(obj, ['name', 'email', 'phone']);
      expect(result.valid).toBe(false);
      expect(result.missingFields).toContain('phone');
    });
  });

  describe('Entity Utilities', () => {
    test('should determine entity type from data', () => {
      expect(determineEntityType({ name_first: 'John', name_last: 'Doe' })).toBe(ENTITY_TYPES.INDIVIDUAL);
      expect(determineEntityType({ business_name: 'Acme Inc' })).toBe(ENTITY_TYPES.BUSINESS);
      expect(determineEntityType({ business_ein: '123456789' })).toBe(ENTITY_TYPES.BUSINESS);
    });

    test('should format full name', () => {
      expect(formatFullName({ name_first: 'John', name_last: 'Doe' })).toBe('John Doe');
      expect(formatFullName({ name_first: 'John', name_middle: 'M', name_last: 'Doe' })).toBe('John M Doe');
      expect(formatFullName({ name_first: 'John', name_last: 'Doe', name_suffix: 'Jr' })).toBe('John Doe Jr');
    });

    test('should mask sensitive data', () => {
      const data = { name: 'John', ssn: '123456789', email: 'john@example.com' };
      const masked = maskSensitiveData(data);
      expect(masked.name).toBe('John');
      expect(masked.ssn).toBe('***6789');
      expect(masked.email).toBe('john@example.com');
    });
  });

  describe('Constants', () => {
    test('should have all outcome types', () => {
      expect(OUTCOMES.APPROVED).toBe('approved');
      expect(OUTCOMES.DENIED).toBe('denied');
      expect(OUTCOMES.MANUAL_REVIEW).toBe('manual_review');
      expect(OUTCOMES.PENDING).toBe('pending');
      expect(OUTCOMES.ERROR).toBe('error');
    });

    test('should have all risk levels', () => {
      expect(RISK_LEVELS.VERY_LOW).toBe('very_low');
      expect(RISK_LEVELS.LOW).toBe('low');
      expect(RISK_LEVELS.MEDIUM).toBe('medium');
      expect(RISK_LEVELS.HIGH).toBe('high');
      expect(RISK_LEVELS.VERY_HIGH).toBe('very_high');
      expect(RISK_LEVELS.CRITICAL).toBe('critical');
    });

    test('should have entity types', () => {
      expect(ENTITY_TYPES.INDIVIDUAL).toBe('individual');
      expect(ENTITY_TYPES.BUSINESS).toBe('business');
    });
  });
});
