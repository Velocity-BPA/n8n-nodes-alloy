/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject, NodeOperationError } from 'n8n-workflow';
import { AxiosInstance } from 'axios';
import { ENDPOINTS } from '../../constants/endpoints';
import { alloyApiGet, alloyApiPost } from '../../transport/alloyClient';

export async function executeJourneyOperation(
  context: IExecuteFunctions,
  client: AxiosInstance,
  operation: string,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];

  switch (operation) {
    case 'get': {
      const journeyToken = context.getNodeParameter('journeyToken', itemIndex) as string;
      const result = await alloyApiGet(client, ENDPOINTS.journey(journeyToken));
      returnData.push({ json: result });
      break;
    }
    case 'getAll': {
      const result = await alloyApiGet(client, ENDPOINTS.journeys);
      const journeys = result.journeys || result.data || result;
      if (Array.isArray(journeys)) {
        returnData.push(...journeys.map((item: IDataObject) => ({ json: item })));
      } else {
        returnData.push({ json: result });
      }
      break;
    }
    case 'getSteps': {
      const journeyToken = context.getNodeParameter('journeyToken', itemIndex) as string;
      const result = await alloyApiGet(client, ENDPOINTS.journeySteps(journeyToken));
      returnData.push({ json: result });
      break;
    }
    case 'getVersion': {
      const journeyToken = context.getNodeParameter('journeyToken', itemIndex) as string;
      const version = context.getNodeParameter('version', itemIndex) as string;
      const result = await alloyApiGet(client, ENDPOINTS.journeyVersion(journeyToken, version));
      returnData.push({ json: result });
      break;
    }
    case 'getConfig': {
      const journeyToken = context.getNodeParameter('journeyToken', itemIndex) as string;
      const result = await alloyApiGet(client, ENDPOINTS.journeyConfig(journeyToken));
      returnData.push({ json: result });
      break;
    }
    case 'start': {
      const journeyToken = context.getNodeParameter('journeyToken', itemIndex) as string;
      const entityData = context.getNodeParameter('entityData', itemIndex, {}) as IDataObject;
      const result = await alloyApiPost(client, ENDPOINTS.journeyStart(journeyToken), entityData);
      returnData.push({ json: result });
      break;
    }
    case 'getStatus': {
      const applicationToken = context.getNodeParameter('applicationToken', itemIndex) as string;
      const result = await alloyApiGet(client, ENDPOINTS.journeyStatus(applicationToken));
      returnData.push({ json: result });
      break;
    }
    case 'getOutcome': {
      const applicationToken = context.getNodeParameter('applicationToken', itemIndex) as string;
      const result = await alloyApiGet(client, ENDPOINTS.journeyOutcome(applicationToken));
      returnData.push({ json: result });
      break;
    }
    default:
      throw new NodeOperationError(context.getNode(), `Unknown journey operation: ${operation}`);
  }
  return returnData;
}

export const journeyOperations = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options' as const,
    noDataExpression: true,
    displayOptions: { show: { resource: ['journey'] } },
    options: [
      { name: 'Get', value: 'get', description: 'Get a journey', action: 'Get journey' },
      { name: 'Get All', value: 'getAll', description: 'Get all journeys', action: 'Get all journeys' },
      { name: 'Get Config', value: 'getConfig', description: 'Get journey config', action: 'Get journey config' },
      { name: 'Get Outcome', value: 'getOutcome', description: 'Get journey outcome', action: 'Get journey outcome' },
      { name: 'Get Status', value: 'getStatus', description: 'Get journey status', action: 'Get journey status' },
      { name: 'Get Steps', value: 'getSteps', description: 'Get journey steps', action: 'Get journey steps' },
      { name: 'Get Version', value: 'getVersion', description: 'Get journey version', action: 'Get journey version' },
      { name: 'Start', value: 'start', description: 'Start a journey', action: 'Start journey' },
    ],
    default: 'get',
  },
];

export const journeyFields = [
  {
    displayName: 'Journey Token',
    name: 'journeyToken',
    type: 'string' as const,
    required: true,
    displayOptions: { show: { resource: ['journey'], operation: ['get', 'getSteps', 'getVersion', 'getConfig', 'start'] } },
    default: '',
    description: 'The unique token of the journey',
  },
  {
    displayName: 'Application Token',
    name: 'applicationToken',
    type: 'string' as const,
    required: true,
    displayOptions: { show: { resource: ['journey'], operation: ['getStatus', 'getOutcome'] } },
    default: '',
    description: 'The application token from starting the journey',
  },
  {
    displayName: 'Version',
    name: 'version',
    type: 'string' as const,
    required: true,
    displayOptions: { show: { resource: ['journey'], operation: ['getVersion'] } },
    default: 'latest',
    description: 'The journey version',
  },
  {
    displayName: 'Entity Data',
    name: 'entityData',
    type: 'json' as const,
    displayOptions: { show: { resource: ['journey'], operation: ['start'] } },
    default: '{}',
    description: 'Entity data to start the journey with',
  },
];
