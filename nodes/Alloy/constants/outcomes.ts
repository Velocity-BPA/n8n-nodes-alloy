/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Alloy Outcome Types and Decision Constants
 */

// Evaluation outcome types
export const OUTCOMES = {
  APPROVED: 'approved',
  DENIED: 'denied',
  MANUAL_REVIEW: 'manual_review',
  PENDING: 'pending',
  ERROR: 'error',
} as const;

export type OutcomeType = (typeof OUTCOMES)[keyof typeof OUTCOMES];

// Decision types
export const DECISION_TYPES = {
  AUTO_APPROVED: 'auto_approved',
  AUTO_DENIED: 'auto_denied',
  MANUAL_APPROVED: 'manual_approved',
  MANUAL_DENIED: 'manual_denied',
  ESCALATED: 'escalated',
  OVERRIDDEN: 'overridden',
} as const;

export type DecisionType = (typeof DECISION_TYPES)[keyof typeof DECISION_TYPES];

// Review statuses
export const REVIEW_STATUSES = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ESCALATED: 'escalated',
  EXPIRED: 'expired',
} as const;

export type ReviewStatus = (typeof REVIEW_STATUSES)[keyof typeof REVIEW_STATUSES];

// Case statuses
export const CASE_STATUSES = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
  ESCALATED: 'escalated',
} as const;

export type CaseStatus = (typeof CASE_STATUSES)[keyof typeof CASE_STATUSES];

// Verification statuses
export const VERIFICATION_STATUSES = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
} as const;

export type VerificationStatus = (typeof VERIFICATION_STATUSES)[keyof typeof VERIFICATION_STATUSES];

// Application statuses
export const APPLICATION_STATUSES = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  PENDING: 'pending',
  APPROVED: 'approved',
  DENIED: 'denied',
  ARCHIVED: 'archived',
} as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[keyof typeof APPLICATION_STATUSES];

// n8n dropdown options
export const OUTCOME_OPTIONS = [
  { name: 'Approved', value: 'approved' },
  { name: 'Denied', value: 'denied' },
  { name: 'Manual Review', value: 'manual_review' },
  { name: 'Pending', value: 'pending' },
  { name: 'Error', value: 'error' },
];

export const DECISION_TYPE_OPTIONS = [
  { name: 'Auto Approved', value: 'auto_approved' },
  { name: 'Auto Denied', value: 'auto_denied' },
  { name: 'Manual Approved', value: 'manual_approved' },
  { name: 'Manual Denied', value: 'manual_denied' },
  { name: 'Escalated', value: 'escalated' },
  { name: 'Overridden', value: 'overridden' },
];

export const REVIEW_STATUS_OPTIONS = [
  { name: 'Pending', value: 'pending' },
  { name: 'Assigned', value: 'assigned' },
  { name: 'In Progress', value: 'in_progress' },
  { name: 'Completed', value: 'completed' },
  { name: 'Escalated', value: 'escalated' },
  { name: 'Expired', value: 'expired' },
];

export const CASE_STATUS_OPTIONS = [
  { name: 'Open', value: 'open' },
  { name: 'In Progress', value: 'in_progress' },
  { name: 'Pending', value: 'pending' },
  { name: 'Resolved', value: 'resolved' },
  { name: 'Closed', value: 'closed' },
  { name: 'Escalated', value: 'escalated' },
];
