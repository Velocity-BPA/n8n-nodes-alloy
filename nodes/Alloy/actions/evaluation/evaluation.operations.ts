/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject, NodeOperationError } from 'n8n-workflow';
import { AxiosInstance } from 'axios';
import { ENDPOINTS } from '../constants/endpoints';
import { alloyApiGet, alloyApiPost, alloyApiGetPaginated } from '../transport/alloyClient';

/**
 * Evaluation Resource Operations
 *
 * Evaluations are verification processes run against entities
 */

export async function executeEvaluationOperation(
  context: IExecuteFunctions,
  client: AxiosInstance,
  operation: string,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];

  switch (operation) {
    case 'run': {
      const entityToken = context.getNodeParameter('entityToken', itemIndex) as string;
      const workflowToken = context.getNodeParameter('workflowToken', itemIndex, '') as string;
      const evaluationData = context.getNodeParameter('evaluationData', itemIndex, {}) as IDataObject;

      const body: IDataObject = {
        entity_token: entityToken,
        ...evaluationData,
      };

      if (workflowToken) {
        body.workflow_token = workflowToken;
      }

      const result = await alloyApiPost(client, ENDPOINTS.evaluations, body);
      returnData.push({ json: result });
      break;
    }

    case 'get': {
      const evaluationToken = context.getNodeParameter('evaluationToken', itemIndex) as string;
      const result = await alloyApiGet(client, ENDPOINTS.evaluation(evaluationToken));
      returnData.push({ json: result });
      break;
    }

    case 'getStatus': {
      const evaluationToken = context.getNodeParameter('evaluationToken', itemIndex) as string;
      const result = await alloyApiGet(client, ENDPOINTS.evaluationStatus(evaluationToken));
      returnData.push({ json: result });
      break;
    }

    case 'getResult': {
      const evaluationToken = context.getNodeParameter('evaluationToken', itemIndex) as string;
      const result = await alloyApiGet(client, ENDPOINTS.evaluationResult(evaluationToken));
      returnData.push({ json: result });
      break;
    }

    case 'getOutcome': {
      const evaluationToken = context.getNodeParameter('evaluationToken', itemIndex) as string;
      const result = await alloyApiGet(client, ENDPOINTS.evaluationOutcome(evaluationToken));
      returnData.push({ json: result });
      break;
    }

    case 'list': {
      const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
      const filters = context.getNodeParameter('filters', itemIndex, {}) as IDataObject;

      if (returnAll) {
        const allResults: IDataObject[] = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
          const response = await alloyApiGetPaginated(client, ENDPOINTS.evaluations, { page, limit: 100 }, filters);
          if (response.data) {
            allResults.push(...response.data);
          }
          hasMore = response.pagination?.hasMore || false;
          page++;
        }

        returnData.push(...allResults.map((item) => ({ json: item })));
      } else {
        const limit = context.getNodeParameter('limit', itemIndex, 25) as number;
        const response = await alloyApiGetPaginated(client, ENDPOINTS.evaluations, { limit }, filters);
        if (response.data) {
          returnData.push(...response.data.map((item) => ({ json: item })));
        }
      }
      break;
    }

    case 'getByEntity': {
      const entityToken = context.getNodeParameter('entityToken', itemIndex) as string;
      const result = await alloyApiGet(client, ENDPOINTS.entityEvaluations(entityToken));
      const evaluations = result.evaluations || result.data || result;

      if (Array.isArray(evaluations)) {
        returnData.push(...evaluations.map((item: IDataObject) => ({ json: item })));
      } else {
        returnData.push({ json: result });
      }
      break;
    }

    case 'retry': {
      const evaluationToken = context.getNodeParameter('evaluationToken', itemIndex) as string;
      const result = await alloyApiPost(client, ENDPOINTS.evaluationRetry(evaluationToken));
      returnData.push({ json: result });
      break;
    }

    case 'getEvents': {
      const evaluationToken = context.getNodeParameter('evaluationToken', itemIndex) as string;
      const result = await alloyApiGet(client, ENDPOINTS.evaluationEvents(evaluationToken));
      const events = result.events || result.data || result;

      if (Array.isArray(events)) {
        returnData.push(...events.map((item: IDataObject) => ({ json: item })));
      } else {
        returnData.push({ json: result });
      }
      break;
    }

    case 'getData': {
      const evaluationToken = context.getNodeParameter('evaluationToken', itemIndex) as string;
      const result = await alloyApiGet(client, ENDPOINTS.evaluationData(evaluationToken));
      returnData.push({ json: result });
      break;
    }

    case 'getRequiredActions': {
      const evaluationToken = context.getNodeParameter('evaluationToken', itemIndex) as string;
      const result = await alloyApiGet(client, ENDPOINTS.evaluationActions(evaluationToken));
      returnData.push({ json: result });
      break;
    }

    case 'completeManualReview': {
      const evaluationToken = context.getNodeParameter('evaluationToken', itemIndex) as string;
      const decision = context.getNodeParameter('decision', itemIndex) as string;
      const reason = context.getNodeParameter('reason', itemIndex, '') as string;

      const body: IDataObject = {
        decision,
      };

      if (reason) {
        body.reason = reason;
      }

      const result = await alloyApiPost(client, ENDPOINTS.evaluationReview(evaluationToken), body);
      returnData.push({ json: result });
      break;
    }

    default:
      throw new NodeOperationError(context.getNode(), `Unknown evaluation operation: ${operation}`);
  }

  return returnData;
}

/**
 * Evaluation resource description for n8n
 */
export const evaluationOperations = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options' as const,
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['evaluation'],
      },
    },
    options: [
      { name: 'Complete Manual Review', value: 'completeManualReview', description: 'Complete a manual review', action: 'Complete manual review' },
      { name: 'Get', value: 'get', description: 'Get an evaluation', action: 'Get an evaluation' },
      { name: 'Get Data', value: 'getData', description: 'Get evaluation data', action: 'Get evaluation data' },
      { name: 'Get Events', value: 'getEvents', description: 'Get evaluation events', action: 'Get evaluation events' },
      { name: 'Get Outcome', value: 'getOutcome', description: 'Get evaluation outcome', action: 'Get evaluation outcome' },
      { name: 'Get Required Actions', value: 'getRequiredActions', description: 'Get required actions', action: 'Get required actions' },
      { name: 'Get Result', value: 'getResult', description: 'Get evaluation result', action: 'Get evaluation result' },
      { name: 'Get Status', value: 'getStatus', description: 'Get evaluation status', action: 'Get evaluation status' },
      { name: 'Get by Entity', value: 'getByEntity', description: 'Get evaluations by entity', action: 'Get evaluations by entity' },
      { name: 'List', value: 'list', description: 'List evaluations', action: 'List evaluations' },
      { name: 'Retry', value: 'retry', description: 'Retry an evaluation', action: 'Retry evaluation' },
      { name: 'Run', value: 'run', description: 'Run a new evaluation', action: 'Run evaluation' },
    ],
    default: 'run',
  },
];

export const evaluationFields = [
  // Evaluation Token
  {
    displayName: 'Evaluation Token',
    name: 'evaluationToken',
    type: 'string' as const,
    required: true,
    displayOptions: {
      show: {
        resource: ['evaluation'],
        operation: ['get', 'getStatus', 'getResult', 'getOutcome', 'retry', 'getEvents', 'getData', 'getRequiredActions', 'completeManualReview'],
      },
    },
    default: '',
    description: 'The unique token of the evaluation',
  },
  // Entity Token for run and getByEntity
  {
    displayName: 'Entity Token',
    name: 'entityToken',
    type: 'string' as const,
    required: true,
    displayOptions: {
      show: {
        resource: ['evaluation'],
        operation: ['run', 'getByEntity'],
      },
    },
    default: '',
    description: 'The entity token to run evaluation for',
  },
  // Workflow Token for run
  {
    displayName: 'Workflow Token',
    name: 'workflowToken',
    type: 'string' as const,
    displayOptions: {
      show: {
        resource: ['evaluation'],
        operation: ['run'],
      },
    },
    default: '',
    description: 'Optional workflow token (uses default if not specified)',
  },
  // Evaluation Data for run
  {
    displayName: 'Evaluation Data',
    name: 'evaluationData',
    type: 'json' as const,
    displayOptions: {
      show: {
        resource: ['evaluation'],
        operation: ['run'],
      },
    },
    default: '{}',
    description: 'Additional data to include in the evaluation',
  },
  // Decision for manual review
  {
    displayName: 'Decision',
    name: 'decision',
    type: 'options' as const,
    required: true,
    displayOptions: {
      show: {
        resource: ['evaluation'],
        operation: ['completeManualReview'],
      },
    },
    options: [
      { name: 'Approve', value: 'approved' },
      { name: 'Deny', value: 'denied' },
    ],
    default: 'approved',
    description: 'The manual review decision',
  },
  // Reason for manual review
  {
    displayName: 'Reason',
    name: 'reason',
    type: 'string' as const,
    displayOptions: {
      show: {
        resource: ['evaluation'],
        operation: ['completeManualReview'],
      },
    },
    default: '',
    description: 'Optional reason for the decision',
  },
  // Return All for list
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean' as const,
    displayOptions: {
      show: {
        resource: ['evaluation'],
        operation: ['list'],
      },
    },
    default: false,
    description: 'Whether to return all results or only up to a given limit',
  },
  // Limit
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number' as const,
    displayOptions: {
      show: {
        resource: ['evaluation'],
        operation: ['list'],
        returnAll: [false],
      },
    },
    typeOptions: {
      minValue: 1,
      maxValue: 100,
    },
    default: 25,
    description: 'Max number of results to return',
  },
  // Filters for list
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection' as const,
    placeholder: 'Add Filter',
    displayOptions: {
      show: {
        resource: ['evaluation'],
        operation: ['list'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Outcome',
        name: 'outcome',
        type: 'options' as const,
        options: [
          { name: 'Approved', value: 'approved' },
          { name: 'Denied', value: 'denied' },
          { name: 'Manual Review', value: 'manual_review' },
          { name: 'Pending', value: 'pending' },
        ],
        default: '',
      },
      { displayName: 'Entity Token', name: 'entity_token', type: 'string' as const, default: '' },
      { displayName: 'Created After', name: 'created_after', type: 'string' as const, default: '' },
      { displayName: 'Created Before', name: 'created_before', type: 'string' as const, default: '' },
    ],
  },
];
