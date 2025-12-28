/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

/**
 * Alloy API Credentials
 *
 * Supports multiple environments:
 * - Production: api.alloy.com
 * - Sandbox: sandbox.alloy.com
 * - Custom: User-defined endpoint
 */
export class AlloyApi implements ICredentialType {
  name = 'alloyApi';
  displayName = 'Alloy API';
  documentationUrl = 'https://docs.alloy.com/api/';

  properties: INodeProperties[] = [
    {
      displayName: 'Environment',
      name: 'environment',
      type: 'options',
      options: [
        {
          name: 'Production',
          value: 'production',
        },
        {
          name: 'Sandbox',
          value: 'sandbox',
        },
        {
          name: 'Custom',
          value: 'custom',
        },
      ],
      default: 'sandbox',
      description: 'The Alloy environment to connect to',
    },
    {
      displayName: 'Custom Endpoint',
      name: 'customEndpoint',
      type: 'string',
      default: '',
      placeholder: 'https://custom.alloy.com',
      description: 'Custom API endpoint URL',
      displayOptions: {
        show: {
          environment: ['custom'],
        },
      },
    },
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'Your Alloy API key',
    },
    {
      displayName: 'API Secret',
      name: 'apiSecret',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'Your Alloy API secret',
    },
    {
      displayName: 'Workflow Token',
      name: 'workflowToken',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      description: 'The workflow token for running evaluations',
    },
    {
      displayName: 'Webhook Secret',
      name: 'webhookSecret',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      description: 'Secret for verifying webhook signatures (optional)',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      auth: {
        username: '={{$credentials.apiKey}}',
        password: '={{$credentials.apiSecret}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL:
        '={{$credentials.environment === "production" ? "https://api.alloy.com" : $credentials.environment === "sandbox" ? "https://sandbox.alloy.com" : $credentials.customEndpoint}}',
      url: '/v1/parameters',
      method: 'GET',
    },
  };
}
