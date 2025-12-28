/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import * as crypto from 'crypto';

/**
 * Alloy Webhook Signature Utilities
 *
 * Handles webhook signature verification for secure event processing
 */

/**
 * Alloy signature header name
 */
export const ALLOY_SIGNATURE_HEADER = 'x-alloy-signature';
export const ALLOY_TIMESTAMP_HEADER = 'x-alloy-timestamp';

/**
 * Verifies an Alloy webhook signature
 *
 * @param payload - The raw request body
 * @param signature - The signature from the header
 * @param secret - The webhook secret
 * @param timestamp - Optional timestamp for replay attack prevention
 * @returns True if signature is valid
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string,
  timestamp?: string,
): boolean {
  try {
    if (!payload || !signature || !secret) {
      return false;
    }

    // If timestamp provided, check for replay attacks (5 minute window)
    if (timestamp) {
      const webhookTime = parseInt(timestamp, 10);
      const currentTime = Math.floor(Date.now() / 1000);
      const timeDiff = Math.abs(currentTime - webhookTime);
      
      // Reject if timestamp is more than 5 minutes old
      if (timeDiff > 300) {
        return false;
      }
    }

    // Create the expected signature
    const payloadString = typeof payload === 'string' ? payload : payload.toString('utf8');
    const signaturePayload = timestamp ? `${timestamp}.${payloadString}` : payloadString;
    
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(signaturePayload)
      .digest('hex');

    // Compare signatures using timing-safe comparison
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (sigBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(sigBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

/**
 * Generates a webhook signature for testing
 *
 * @param payload - The payload to sign
 * @param secret - The webhook secret
 * @param timestamp - Optional timestamp
 * @returns The generated signature
 */
export function generateWebhookSignature(
  payload: string | Buffer,
  secret: string,
  timestamp?: string,
): string {
  const payloadString = typeof payload === 'string' ? payload : payload.toString('utf8');
  const signaturePayload = timestamp ? `${timestamp}.${payloadString}` : payloadString;
  
  return crypto
    .createHmac('sha256', secret)
    .update(signaturePayload)
    .digest('hex');
}

/**
 * Extracts signature and timestamp from webhook headers
 *
 * @param headers - The request headers
 * @returns Object containing signature and timestamp
 */
export function extractSignatureFromHeaders(
  headers: Record<string, string | string[] | undefined>,
): { signature: string | null; timestamp: string | null } {
  const getHeader = (name: string): string | null => {
    const value = headers[name] || headers[name.toLowerCase()];
    if (Array.isArray(value)) {
      return value[0] || null;
    }
    return value || null;
  };

  return {
    signature: getHeader(ALLOY_SIGNATURE_HEADER),
    timestamp: getHeader(ALLOY_TIMESTAMP_HEADER),
  };
}

/**
 * Creates a secure random token
 *
 * @param length - The length of the token in bytes (default: 32)
 * @returns A hex-encoded random token
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Hashes sensitive data for logging (PII protection)
 *
 * @param data - The data to hash
 * @returns A truncated hash for logging
 */
export function hashForLogging(data: string): string {
  const hash = crypto.createHash('sha256').update(data).digest('hex');
  return `${hash.substring(0, 8)}...`;
}

/**
 * Validates that a webhook secret meets minimum security requirements
 *
 * @param secret - The secret to validate
 * @returns True if secret meets requirements
 */
export function isValidWebhookSecret(secret: string): boolean {
  // Must be at least 32 characters
  if (secret.length < 32) {
    return false;
  }
  
  // Should contain mixed characters (basic entropy check)
  const hasLower = /[a-z]/.test(secret);
  const hasUpper = /[A-Z]/.test(secret);
  const hasNumber = /[0-9]/.test(secret);
  
  return hasLower && hasUpper && hasNumber;
}
