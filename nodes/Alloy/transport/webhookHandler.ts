/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IWebhookFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
  verifyWebhookSignature,
  extractSignatureFromHeaders,
  ALLOY_SIGNATURE_HEADER,
  ALLOY_TIMESTAMP_HEADER,
} from '../utils/signatureUtils';

/**
 * Alloy Webhook Handler
 *
 * Processes incoming webhook events from Alloy
 */

export interface AlloyWebhookPayload {
  event_type: string;
  event_id: string;
  timestamp: string;
  data: IDataObject;
  entity_token?: string;
  evaluation_token?: string;
  application_token?: string;
}

export interface WebhookValidationResult {
  isValid: boolean;
  error?: string;
  payload?: AlloyWebhookPayload;
}

/**
 * Validates and parses an incoming Alloy webhook
 */
export function validateAlloyWebhook(
  context: IWebhookFunctions,
  webhookSecret?: string,
): WebhookValidationResult {
  const req = context.getRequestObject();
  const body = context.getBodyData();

  // If webhook secret is configured, verify signature
  if (webhookSecret) {
    const headers = req.headers as Record<string, string | string[] | undefined>;
    const { signature, timestamp } = extractSignatureFromHeaders(headers);

    if (!signature) {
      return {
        isValid: false,
        error: `Missing webhook signature header: ${ALLOY_SIGNATURE_HEADER}`,
      };
    }

    const rawBody = JSON.stringify(body);
    const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret, timestamp || undefined);

    if (!isValid) {
      return {
        isValid: false,
        error: 'Invalid webhook signature',
      };
    }
  }

  // Parse and validate the payload structure
  const payload = body as AlloyWebhookPayload;

  if (!payload.event_type) {
    return {
      isValid: false,
      error: 'Missing event_type in webhook payload',
    };
  }

  return {
    isValid: true,
    payload,
  };
}

/**
 * Converts an Alloy webhook payload to n8n execution data
 */
export function webhookPayloadToExecutionData(payload: AlloyWebhookPayload): INodeExecutionData[] {
  return [
    {
      json: {
        eventType: payload.event_type,
        eventId: payload.event_id,
        timestamp: payload.timestamp,
        entityToken: payload.entity_token,
        evaluationToken: payload.evaluation_token,
        applicationToken: payload.application_token,
        data: payload.data,
      },
    },
  ];
}

/**
 * Filters webhook events by type
 */
export function filterWebhookByEventType(
  payload: AlloyWebhookPayload,
  allowedEvents: string[],
): boolean {
  if (allowedEvents.length === 0) {
    return true; // No filter, accept all
  }
  return allowedEvents.includes(payload.event_type);
}

/**
 * Extracts entity information from webhook payload
 */
export function extractEntityFromWebhook(payload: AlloyWebhookPayload): IDataObject | null {
  if (payload.entity_token) {
    return {
      entityToken: payload.entity_token,
      ...(payload.data.entity || {}),
    };
  }
  return null;
}

/**
 * Extracts evaluation information from webhook payload
 */
export function extractEvaluationFromWebhook(payload: AlloyWebhookPayload): IDataObject | null {
  if (payload.evaluation_token) {
    return {
      evaluationToken: payload.evaluation_token,
      ...(payload.data.evaluation || {}),
    };
  }
  return null;
}

/**
 * Extracts application information from webhook payload
 */
export function extractApplicationFromWebhook(payload: AlloyWebhookPayload): IDataObject | null {
  if (payload.application_token) {
    return {
      applicationToken: payload.application_token,
      ...(payload.data.application || {}),
    };
  }
  return null;
}

/**
 * Gets the outcome from evaluation events
 */
export function getOutcomeFromWebhook(payload: AlloyWebhookPayload): string | null {
  const outcomeEvents = [
    'evaluation.approved',
    'evaluation.denied',
    'evaluation.pending_review',
    'evaluation.manual_review_required',
  ];

  if (outcomeEvents.includes(payload.event_type)) {
    // Extract outcome from event type
    const eventParts = payload.event_type.split('.');
    if (eventParts.length > 1) {
      return eventParts[1];
    }
  }

  // Check data for outcome field
  if (payload.data.outcome) {
    return payload.data.outcome as string;
  }

  return null;
}

/**
 * Determines if the webhook indicates a successful verification
 */
export function isSuccessfulVerification(payload: AlloyWebhookPayload): boolean {
  const successEvents = [
    'evaluation.approved',
    'identity.verified',
    'business.verified',
    'document.verified',
  ];
  return successEvents.includes(payload.event_type);
}

/**
 * Determines if the webhook indicates a failed verification
 */
export function isFailedVerification(payload: AlloyWebhookPayload): boolean {
  const failureEvents = [
    'evaluation.denied',
    'identity.failed',
    'business.failed',
    'document.failed',
  ];
  return failureEvents.includes(payload.event_type);
}

/**
 * Determines if the webhook requires manual review
 */
export function requiresManualReview(payload: AlloyWebhookPayload): boolean {
  const reviewEvents = [
    'evaluation.pending_review',
    'evaluation.manual_review_required',
    'review.assigned',
  ];
  return reviewEvents.includes(payload.event_type);
}

/**
 * Gets risk information from webhook payload
 */
export function getRiskInfoFromWebhook(payload: AlloyWebhookPayload): IDataObject | null {
  const riskEvents = [
    'risk.score_changed',
    'risk.high_detected',
    'risk.alert',
    'risk.threshold_exceeded',
    'entity.risk_changed',
  ];

  if (riskEvents.includes(payload.event_type)) {
    return {
      eventType: payload.event_type,
      riskScore: payload.data.risk_score,
      riskLevel: payload.data.risk_level,
      previousScore: payload.data.previous_score,
      riskFactors: payload.data.risk_factors,
    };
  }

  return null;
}

/**
 * Gets watchlist hit information from webhook payload
 */
export function getWatchlistHitFromWebhook(payload: AlloyWebhookPayload): IDataObject | null {
  const watchlistEvents = [
    'watchlist.new_hit',
    'watchlist.hit_confirmed',
    'watchlist.hit_dismissed',
    'watchlist.monitoring_alert',
    'identity.watchlist_hit',
  ];

  if (watchlistEvents.includes(payload.event_type)) {
    return {
      eventType: payload.event_type,
      hitId: payload.data.hit_id,
      source: payload.data.source,
      matchType: payload.data.match_type,
      matchScore: payload.data.match_score,
      listName: payload.data.list_name,
      details: payload.data.hit_details,
    };
  }

  return null;
}
