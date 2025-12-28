/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IHookFunctions,
  IWebhookFunctions,
  INodeType,
  INodeTypeDescription,
  IWebhookResponseData,
  NodeConnectionType,
} from 'n8n-workflow';

import { validateAlloyWebhook, webhookPayloadToExecutionData } from './transport/webhookHandler';
import {
  ENTITY_EVENT_OPTIONS,
  EVALUATION_EVENT_OPTIONS,
  APPLICATION_EVENT_OPTIONS,
  DOCUMENT_EVENT_OPTIONS,
  IDENTITY_EVENT_OPTIONS,
  BUSINESS_EVENT_OPTIONS,
  REVIEW_EVENT_OPTIONS,
  CASE_EVENT_OPTIONS,
  RISK_EVENT_OPTIONS,
  DECISION_EVENT_OPTIONS,
  WATCHLIST_EVENT_OPTIONS,
} from './constants/eventTypes';

/**
 * Alloy Trigger Node
 *
 * Receives webhook events from Alloy for real-time event monitoring
 */
export class AlloyTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Alloy Trigger',
    name: 'alloyTrigger',
    icon: 'file:alloy.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["events"].length}} event(s)',
    description: 'Trigger workflows on Alloy events (KYC, KYB, document verification, watchlist hits)',
    defaults: {
      name: 'Alloy Trigger',
    },
    inputs: [],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'alloyApi',
        required: true,
      },
    ],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: 'webhook',
      },
    ],
    properties: [
      {
        displayName: 'Events',
        name: 'events',
        type: 'multiOptions',
        required: true,
        options: [
          { name: '── Entity Events ──', value: '_entity_header', disabled: true },
          ...ENTITY_EVENT_OPTIONS,
          { name: '── Evaluation Events ──', value: '_evaluation_header', disabled: true },
          ...EVALUATION_EVENT_OPTIONS,
          { name: '── Application Events ──', value: '_application_header', disabled: true },
          ...APPLICATION_EVENT_OPTIONS,
          { name: '── Document Events ──', value: '_document_header', disabled: true },
          ...DOCUMENT_EVENT_OPTIONS,
          { name: '── Identity Events ──', value: '_identity_header', disabled: true },
          ...IDENTITY_EVENT_OPTIONS,
          { name: '── Business Events ──', value: '_business_header', disabled: true },
          ...BUSINESS_EVENT_OPTIONS,
          { name: '── Review Events ──', value: '_review_header', disabled: true },
          ...REVIEW_EVENT_OPTIONS,
          { name: '── Case Events ──', value: '_case_header', disabled: true },
          ...CASE_EVENT_OPTIONS,
          { name: '── Risk Events ──', value: '_risk_header', disabled: true },
          ...RISK_EVENT_OPTIONS,
          { name: '── Decision Events ──', value: '_decision_header', disabled: true },
          ...DECISION_EVENT_OPTIONS,
          { name: '── Watchlist Events ──', value: '_watchlist_header', disabled: true },
          ...WATCHLIST_EVENT_OPTIONS,
        ],
        default: [],
        description: 'The events to listen for',
      },
      {
        displayName: 'Verify Signature',
        name: 'verifySignature',
        type: 'boolean',
        default: true,
        description: 'Whether to verify webhook signatures using the webhook secret',
      },
      {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        options: [
          {
            displayName: 'Include Raw Payload',
            name: 'includeRawPayload',
            type: 'boolean',
            default: false,
            description: 'Whether to include the raw webhook payload in the output',
          },
          {
            displayName: 'Respond Immediately',
            name: 'respondImmediately',
            type: 'boolean',
            default: true,
            description: 'Whether to respond to the webhook immediately (recommended)',
          },
        ],
      },
    ],
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        // Webhooks are managed externally in Alloy dashboard
        // This just confirms the webhook URL is set up
        return true;
      },
      async create(this: IHookFunctions): Promise<boolean> {
        // Display webhook URL for manual configuration in Alloy
        const webhookUrl = this.getNodeWebhookUrl('default');
        console.log(`Alloy webhook URL: ${webhookUrl}`);
        return true;
      },
      async delete(this: IHookFunctions): Promise<boolean> {
        // Webhooks are managed externally
        return true;
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const req = this.getRequestObject();
    const events = this.getNodeParameter('events', []) as string[];
    const verifySignature = this.getNodeParameter('verifySignature', true) as boolean;
    const options = this.getNodeParameter('options', {}) as {
      includeRawPayload?: boolean;
      respondImmediately?: boolean;
    };

    // Get webhook secret from credentials if signature verification is enabled
    let webhookSecret: string | undefined;
    if (verifySignature) {
      try {
        const credentials = await this.getCredentials('alloyApi');
        webhookSecret = credentials.webhookSecret as string;
      } catch {
        // If credentials can't be loaded, skip verification
      }
    }

    // Validate the webhook
    const validation = validateAlloyWebhook(this, webhookSecret);

    if (!validation.isValid) {
      return {
        webhookResponse: {
          status: 400,
          body: { error: validation.error },
        },
      };
    }

    const payload = validation.payload!;

    // Filter by selected events (if any are selected)
    if (events.length > 0 && !events.includes(payload.event_type)) {
      // Event not in filter list, acknowledge but don't process
      return {
        webhookResponse: {
          status: 200,
          body: { received: true, processed: false, reason: 'Event type not in filter' },
        },
      };
    }

    // Convert to n8n execution data
    const executionData = webhookPayloadToExecutionData(payload);

    // Add raw payload if requested
    if (options.includeRawPayload) {
      executionData[0].json.rawPayload = this.getBodyData();
    }

    return {
      workflowData: [executionData],
      webhookResponse: {
        status: 200,
        body: { received: true, processed: true },
      },
    };
  }
}
