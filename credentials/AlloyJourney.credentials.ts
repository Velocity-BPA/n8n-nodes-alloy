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
 * Alloy Journey Credentials
 *
 * Used for Journey-specific API operations
 * Journeys are pre-configured verification workflows
 */
export class AlloyJourney implements ICredentialType {
  name = 'alloyJourney';
  displayName = 'Alloy Journey';
  documentationUrl = 'https://docs.alloy.com/api/journeys/';

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
      ],
      default: 'sandbox',
      description: 'The Alloy environment to connect to',
    },
    {
      displayName: 'Journey API Key',
      name: 'journeyApiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'Your Alloy Journey API key',
    },
    {
      displayName: 'Journey ID',
      name: 'journeyId',
      type: 'string',
      default: '',
      required: true,
      description: 'The unique identifier for your journey',
    },
    {
      displayName: 'Version',
      name: 'version',
      type: 'string',
      default: 'latest',
      description: 'The journey version to use (e.g., "1", "2", or "latest")',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials.journeyApiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL:
        '={{$credentials.environment === "production" ? "https://api.alloy.com" : "https://sandbox.alloy.com"}}',
      url: '/v1/journeys/{{$credentials.journeyId}}',
      method: 'GET',
    },
  };
}
