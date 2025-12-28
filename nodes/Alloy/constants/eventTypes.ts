/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Alloy Event Types and Webhook Events
 */

// Entity events
export const ENTITY_EVENTS = {
  ENTITY_CREATED: 'entity.created',
  ENTITY_UPDATED: 'entity.updated',
  ENTITY_ARCHIVED: 'entity.archived',
  ENTITY_RESTORED: 'entity.restored',
  ENTITY_MERGED: 'entity.merged',
  ENTITY_RISK_CHANGED: 'entity.risk_changed',
} as const;

// Evaluation events
export const EVALUATION_EVENTS = {
  EVALUATION_STARTED: 'evaluation.started',
  EVALUATION_COMPLETED: 'evaluation.completed',
  EVALUATION_APPROVED: 'evaluation.approved',
  EVALUATION_DENIED: 'evaluation.denied',
  EVALUATION_PENDING_REVIEW: 'evaluation.pending_review',
  EVALUATION_FAILED: 'evaluation.failed',
  EVALUATION_MANUAL_REVIEW_REQUIRED: 'evaluation.manual_review_required',
} as const;

// Application events
export const APPLICATION_EVENTS = {
  APPLICATION_CREATED: 'application.created',
  APPLICATION_SUBMITTED: 'application.submitted',
  APPLICATION_APPROVED: 'application.approved',
  APPLICATION_DENIED: 'application.denied',
  APPLICATION_PENDING: 'application.pending',
  APPLICATION_UPDATED: 'application.updated',
  APPLICATION_ARCHIVED: 'application.archived',
} as const;

// Document events
export const DOCUMENT_EVENTS = {
  DOCUMENT_UPLOADED: 'document.uploaded',
  DOCUMENT_VERIFIED: 'document.verified',
  DOCUMENT_FAILED: 'document.failed',
  DOCUMENT_EXPIRED: 'document.expired',
  DOCUMENT_REJECTED: 'document.rejected',
} as const;

// Identity events
export const IDENTITY_EVENTS = {
  IDENTITY_VERIFIED: 'identity.verified',
  IDENTITY_FAILED: 'identity.failed',
  IDENTITY_PENDING: 'identity.pending',
  WATCHLIST_HIT_DETECTED: 'identity.watchlist_hit',
  WATCHLIST_CLEARED: 'identity.watchlist_cleared',
} as const;

// Business events
export const BUSINESS_EVENTS = {
  BUSINESS_VERIFIED: 'business.verified',
  BUSINESS_FAILED: 'business.failed',
  KYB_COMPLETED: 'business.kyb_completed',
  BUSINESS_UPDATED: 'business.updated',
} as const;

// Review events
export const REVIEW_EVENTS = {
  REVIEW_ASSIGNED: 'review.assigned',
  REVIEW_COMPLETED: 'review.completed',
  REVIEW_ESCALATED: 'review.escalated',
  REVIEW_TIMEOUT: 'review.timeout',
} as const;

// Case events
export const CASE_EVENTS = {
  CASE_CREATED: 'case.created',
  CASE_UPDATED: 'case.updated',
  CASE_CLOSED: 'case.closed',
  CASE_ESCALATED: 'case.escalated',
  CASE_ASSIGNED: 'case.assigned',
} as const;

// Risk events
export const RISK_EVENTS = {
  RISK_SCORE_CHANGED: 'risk.score_changed',
  HIGH_RISK_DETECTED: 'risk.high_detected',
  RISK_ALERT: 'risk.alert',
  RISK_THRESHOLD_EXCEEDED: 'risk.threshold_exceeded',
} as const;

// Decision events
export const DECISION_EVENTS = {
  DECISION_MADE: 'decision.made',
  DECISION_OVERRIDDEN: 'decision.overridden',
  DECISION_ESCALATED: 'decision.escalated',
} as const;

// Watchlist events
export const WATCHLIST_EVENTS = {
  NEW_WATCHLIST_HIT: 'watchlist.new_hit',
  HIT_CONFIRMED: 'watchlist.hit_confirmed',
  HIT_DISMISSED: 'watchlist.hit_dismissed',
  ONGOING_MONITORING_ALERT: 'watchlist.monitoring_alert',
} as const;

// Webhook events
export const WEBHOOK_EVENTS = {
  WEBHOOK_CREATED: 'webhook.created',
  WEBHOOK_UPDATED: 'webhook.updated',
  WEBHOOK_DELETED: 'webhook.deleted',
  WEBHOOK_DELIVERY_SUCCESS: 'webhook.delivery.success',
  WEBHOOK_DELIVERY_FAILED: 'webhook.delivery.failed',
} as const;

// All events combined
export const ALL_EVENTS = {
  ...ENTITY_EVENTS,
  ...EVALUATION_EVENTS,
  ...APPLICATION_EVENTS,
  ...DOCUMENT_EVENTS,
  ...IDENTITY_EVENTS,
  ...BUSINESS_EVENTS,
  ...REVIEW_EVENTS,
  ...CASE_EVENTS,
  ...RISK_EVENTS,
  ...DECISION_EVENTS,
  ...WATCHLIST_EVENTS,
  ...WEBHOOK_EVENTS,
} as const;

export type EventType = (typeof ALL_EVENTS)[keyof typeof ALL_EVENTS];

// n8n dropdown options for trigger node
export const ENTITY_EVENT_OPTIONS = [
  { name: 'Entity Created', value: 'entity.created' },
  { name: 'Entity Updated', value: 'entity.updated' },
  { name: 'Entity Archived', value: 'entity.archived' },
  { name: 'Entity Risk Changed', value: 'entity.risk_changed' },
];

export const EVALUATION_EVENT_OPTIONS = [
  { name: 'Evaluation Started', value: 'evaluation.started' },
  { name: 'Evaluation Completed', value: 'evaluation.completed' },
  { name: 'Evaluation Approved', value: 'evaluation.approved' },
  { name: 'Evaluation Denied', value: 'evaluation.denied' },
  { name: 'Evaluation Pending Review', value: 'evaluation.pending_review' },
  { name: 'Evaluation Failed', value: 'evaluation.failed' },
  { name: 'Manual Review Required', value: 'evaluation.manual_review_required' },
];

export const APPLICATION_EVENT_OPTIONS = [
  { name: 'Application Created', value: 'application.created' },
  { name: 'Application Submitted', value: 'application.submitted' },
  { name: 'Application Approved', value: 'application.approved' },
  { name: 'Application Denied', value: 'application.denied' },
  { name: 'Application Pending', value: 'application.pending' },
  { name: 'Application Updated', value: 'application.updated' },
];

export const DOCUMENT_EVENT_OPTIONS = [
  { name: 'Document Uploaded', value: 'document.uploaded' },
  { name: 'Document Verified', value: 'document.verified' },
  { name: 'Document Failed', value: 'document.failed' },
  { name: 'Document Expired', value: 'document.expired' },
];

export const IDENTITY_EVENT_OPTIONS = [
  { name: 'Identity Verified', value: 'identity.verified' },
  { name: 'Identity Failed', value: 'identity.failed' },
  { name: 'Identity Pending', value: 'identity.pending' },
  { name: 'Watchlist Hit Detected', value: 'identity.watchlist_hit' },
  { name: 'Watchlist Cleared', value: 'identity.watchlist_cleared' },
];

export const BUSINESS_EVENT_OPTIONS = [
  { name: 'Business Verified', value: 'business.verified' },
  { name: 'Business Failed', value: 'business.failed' },
  { name: 'KYB Completed', value: 'business.kyb_completed' },
];

export const REVIEW_EVENT_OPTIONS = [
  { name: 'Review Assigned', value: 'review.assigned' },
  { name: 'Review Completed', value: 'review.completed' },
  { name: 'Review Escalated', value: 'review.escalated' },
  { name: 'Review Timeout', value: 'review.timeout' },
];

export const CASE_EVENT_OPTIONS = [
  { name: 'Case Created', value: 'case.created' },
  { name: 'Case Updated', value: 'case.updated' },
  { name: 'Case Closed', value: 'case.closed' },
  { name: 'Case Escalated', value: 'case.escalated' },
];

export const RISK_EVENT_OPTIONS = [
  { name: 'Risk Score Changed', value: 'risk.score_changed' },
  { name: 'High Risk Detected', value: 'risk.high_detected' },
  { name: 'Risk Alert', value: 'risk.alert' },
  { name: 'Risk Threshold Exceeded', value: 'risk.threshold_exceeded' },
];

export const DECISION_EVENT_OPTIONS = [
  { name: 'Decision Made', value: 'decision.made' },
  { name: 'Decision Overridden', value: 'decision.overridden' },
  { name: 'Decision Escalated', value: 'decision.escalated' },
];

export const WATCHLIST_EVENT_OPTIONS = [
  { name: 'New Watchlist Hit', value: 'watchlist.new_hit' },
  { name: 'Hit Confirmed', value: 'watchlist.hit_confirmed' },
  { name: 'Hit Dismissed', value: 'watchlist.hit_dismissed' },
  { name: 'Ongoing Monitoring Alert', value: 'watchlist.monitoring_alert' },
];

// All event options for trigger dropdown
export const ALL_EVENT_OPTIONS = [
  { name: '── Entity Events ──', value: '', disabled: true },
  ...ENTITY_EVENT_OPTIONS,
  { name: '── Evaluation Events ──', value: '', disabled: true },
  ...EVALUATION_EVENT_OPTIONS,
  { name: '── Application Events ──', value: '', disabled: true },
  ...APPLICATION_EVENT_OPTIONS,
  { name: '── Document Events ──', value: '', disabled: true },
  ...DOCUMENT_EVENT_OPTIONS,
  { name: '── Identity Events ──', value: '', disabled: true },
  ...IDENTITY_EVENT_OPTIONS,
  { name: '── Business Events ──', value: '', disabled: true },
  ...BUSINESS_EVENT_OPTIONS,
  { name: '── Review Events ──', value: '', disabled: true },
  ...REVIEW_EVENT_OPTIONS,
  { name: '── Case Events ──', value: '', disabled: true },
  ...CASE_EVENT_OPTIONS,
  { name: '── Risk Events ──', value: '', disabled: true },
  ...RISK_EVENT_OPTIONS,
  { name: '── Decision Events ──', value: '', disabled: true },
  ...DECISION_EVENT_OPTIONS,
  { name: '── Watchlist Events ──', value: '', disabled: true },
  ...WATCHLIST_EVENT_OPTIONS,
];
