/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject, NodeOperationError } from 'n8n-workflow';
import { AxiosInstance } from 'axios';
import { ENDPOINTS } from '../constants/endpoints';
import { alloyApiGet, alloyApiPost, alloyApiPut, alloyApiDelete, alloyApiGetPaginated } from '../transport/alloyClient';

/**
 * Entity Resource Operations
 *
 * Entities represent individuals or businesses in Alloy
 */

export async function executeEntityOperation(
  context: IExecuteFunctions,
  client: AxiosInstance,
  operation: string,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];

  switch (operation) {
    case 'create': {
      const entityData = context.getNodeParameter('entityData', itemIndex) as IDataObject;
      const externalId = context.getNodeParameter('externalId', itemIndex, '') as string;
      const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

      const body: IDataObject = {
        ...entityData,
        ...additionalFields,
      };

      if (externalId) {
        body.external_entity_id = externalId;
      }

      const result = await alloyApiPost(client, ENDPOINTS.entities, body);
      returnData.push({ json: result });
      break;
    }

    case 'get': {
      const entityToken = context.getNodeParameter('entityToken', itemIndex) as string;
      const result = await alloyApiGet(client, ENDPOINTS.entity(entityToken));
      returnData.push({ json: result });
      break;
    }

    case 'update': {
      const entityToken = context.getNodeParameter('entityToken', itemIndex) as string;
      const updateData = context.getNodeParameter('updateData', itemIndex) as IDataObject;

      const result = await alloyApiPut(client, ENDPOINTS.entity(entityToken), updateData);
      returnData.push({ json: result });
      break;
    }

    case 'delete': {
      const entityToken = context.getNodeParameter('entityToken', itemIndex) as string;
      await alloyApiDelete(client, ENDPOINTS.entity(entityToken));
      returnData.push({ json: { success: true, entityToken } });
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
          const response = await alloyApiGetPaginated(client, ENDPOINTS.entities, { page, limit: 100 }, filters);
          if (response.data) {
            allResults.push(...response.data);
          }
          hasMore = response.pagination?.hasMore || false;
          page++;
        }

        returnData.push(...allResults.map((item) => ({ json: item })));
      } else {
        const limit = context.getNodeParameter('limit', itemIndex, 25) as number;
        const response = await alloyApiGetPaginated(client, ENDPOINTS.entities, { limit }, filters);
        if (response.data) {
          returnData.push(...response.data.map((item) => ({ json: item })));
        }
      }
      break;
    }

    case 'search': {
      const searchQuery = context.getNodeParameter('searchQuery', itemIndex) as string;
      const searchFields = context.getNodeParameter('searchFields', itemIndex, []) as string[];

      const params: IDataObject = {
        q: searchQuery,
      };

      if (searchFields.length > 0) {
        params.fields = searchFields.join(',');
      }

      const result = await alloyApiGet(client, ENDPOINTS.entities, params);
      const entities = result.entities || result.data || result;

      if (Array.isArray(entities)) {
        returnData.push(...entities.map((item: IDataObject) => ({ json: item })));
      } else {
        returnData.push({ json: result });
      }
      break;
    }

    case 'getByExternalId': {
      const externalId = context.getNodeParameter('externalId', itemIndex) as string;
      const result = await alloyApiGet(client, ENDPOINTS.entityByExternalId(externalId));
      returnData.push({ json: result });
      break;
    }

    case 'getEvaluations': {
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

    case 'getDocuments': {
      const entityToken = context.getNodeParameter('entityToken', itemIndex) as string;
      const result = await alloyApiGet(client, ENDPOINTS.entityDocuments(entityToken));
      const documents = result.documents || result.data || result;

      if (Array.isArray(documents)) {
        returnData.push(...documents.map((item: IDataObject) => ({ json: item })));
      } else {
        returnData.push({ json: result });
      }
      break;
    }

    case 'getEvents': {
      const entityToken = context.getNodeParameter('entityToken', itemIndex) as string;
      const result = await alloyApiGet(client, ENDPOINTS.entityEvents(entityToken));
      const events = result.events || result.data || result;

      if (Array.isArray(events)) {
        returnData.push(...events.map((item: IDataObject) => ({ json: item })));
      } else {
        returnData.push({ json: result });
      }
      break;
    }

    case 'archive': {
      const entityToken = context.getNodeParameter('entityToken', itemIndex) as string;
      const result = await alloyApiPost(client, ENDPOINTS.entityArchive(entityToken));
      returnData.push({ json: result });
      break;
    }

    case 'restore': {
      const entityToken = context.getNodeParameter('entityToken', itemIndex) as string;
      const result = await alloyApiPost(client, ENDPOINTS.entityRestore(entityToken));
      returnData.push({ json: result });
      break;
    }

    case 'merge': {
      const primaryEntityToken = context.getNodeParameter('primaryEntityToken', itemIndex) as string;
      const secondaryEntityToken = context.getNodeParameter('secondaryEntityToken', itemIndex) as string;

      const result = await alloyApiPost(client, ENDPOINTS.entityMerge, {
        primary_entity_token: primaryEntityToken,
        secondary_entity_token: secondaryEntityToken,
      });
      returnData.push({ json: result });
      break;
    }

    case 'getRiskScore': {
      const entityToken = context.getNodeParameter('entityToken', itemIndex) as string;
      const result = await alloyApiGet(client, ENDPOINTS.entityRiskScore(entityToken));
      returnData.push({ json: result });
      break;
    }

    default:
      throw new NodeOperationError(context.getNode(), `Unknown entity operation: ${operation}`);
  }

  return returnData;
}

/**
 * Entity resource description for n8n
 */
export const entityOperations = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options' as const,
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['entity'],
      },
    },
    options: [
      { name: 'Archive', value: 'archive', description: 'Archive an entity', action: 'Archive an entity' },
      { name: 'Create', value: 'create', description: 'Create a new entity', action: 'Create an entity' },
      { name: 'Delete', value: 'delete', description: 'Delete an entity', action: 'Delete an entity' },
      { name: 'Get', value: 'get', description: 'Get an entity by token', action: 'Get an entity' },
      { name: 'Get by External ID', value: 'getByExternalId', description: 'Get entity by external ID', action: 'Get entity by external ID' },
      { name: 'Get Documents', value: 'getDocuments', description: 'Get documents for an entity', action: 'Get entity documents' },
      { name: 'Get Evaluations', value: 'getEvaluations', description: 'Get evaluations for an entity', action: 'Get entity evaluations' },
      { name: 'Get Events', value: 'getEvents', description: 'Get events for an entity', action: 'Get entity events' },
      { name: 'Get Risk Score', value: 'getRiskScore', description: 'Get risk score for an entity', action: 'Get entity risk score' },
      { name: 'List', value: 'list', description: 'List all entities', action: 'List entities' },
      { name: 'Merge', value: 'merge', description: 'Merge two entities', action: 'Merge entities' },
      { name: 'Restore', value: 'restore', description: 'Restore an archived entity', action: 'Restore an entity' },
      { name: 'Search', value: 'search', description: 'Search entities', action: 'Search entities' },
      { name: 'Update', value: 'update', description: 'Update an entity', action: 'Update an entity' },
    ],
    default: 'get',
  },
];

export const entityFields = [
  // Entity Token (for get, update, delete, etc.)
  {
    displayName: 'Entity Token',
    name: 'entityToken',
    type: 'string' as const,
    required: true,
    displayOptions: {
      show: {
        resource: ['entity'],
        operation: ['get', 'update', 'delete', 'getEvaluations', 'getDocuments', 'getEvents', 'archive', 'restore', 'getRiskScore'],
      },
    },
    default: '',
    description: 'The unique token of the entity',
  },
  // External ID
  {
    displayName: 'External ID',
    name: 'externalId',
    type: 'string' as const,
    required: true,
    displayOptions: {
      show: {
        resource: ['entity'],
        operation: ['getByExternalId'],
      },
    },
    default: '',
    description: 'Your external identifier for the entity',
  },
  // Optional External ID for create
  {
    displayName: 'External ID',
    name: 'externalId',
    type: 'string' as const,
    displayOptions: {
      show: {
        resource: ['entity'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Optional external identifier for the entity',
  },
  // Entity Data for create
  {
    displayName: 'Entity Data',
    name: 'entityData',
    type: 'fixedCollection' as const,
    typeOptions: {
      multipleValues: false,
    },
    displayOptions: {
      show: {
        resource: ['entity'],
        operation: ['create'],
      },
    },
    default: {},
    options: [
      {
        name: 'individual',
        displayName: 'Individual',
        values: [
          { displayName: 'First Name', name: 'name_first', type: 'string' as const, default: '', required: true },
          { displayName: 'Last Name', name: 'name_last', type: 'string' as const, default: '', required: true },
          { displayName: 'Middle Name', name: 'name_middle', type: 'string' as const, default: '' },
          { displayName: 'Email', name: 'email_address', type: 'string' as const, default: '' },
          { displayName: 'Phone', name: 'phone_number', type: 'string' as const, default: '' },
          { displayName: 'Date of Birth', name: 'birth_date', type: 'string' as const, default: '', description: 'Format: YYYY-MM-DD' },
          { displayName: 'SSN', name: 'ssn', type: 'string' as const, default: '', description: 'Social Security Number (9 digits)' },
          { displayName: 'Address Line 1', name: 'address_line_1', type: 'string' as const, default: '' },
          { displayName: 'Address Line 2', name: 'address_line_2', type: 'string' as const, default: '' },
          { displayName: 'City', name: 'address_city', type: 'string' as const, default: '' },
          { displayName: 'State', name: 'address_state', type: 'string' as const, default: '' },
          { displayName: 'Postal Code', name: 'address_postal_code', type: 'string' as const, default: '' },
          { displayName: 'Country Code', name: 'address_country_code', type: 'string' as const, default: 'US' },
        ],
      },
    ],
    description: 'Data for the entity to create',
  },
  // Update Data
  {
    displayName: 'Update Data',
    name: 'updateData',
    type: 'json' as const,
    displayOptions: {
      show: {
        resource: ['entity'],
        operation: ['update'],
      },
    },
    default: '{}',
    description: 'JSON object with fields to update',
  },
  // Additional Fields for create
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection' as const,
    placeholder: 'Add Field',
    displayOptions: {
      show: {
        resource: ['entity'],
        operation: ['create'],
      },
    },
    default: {},
    options: [
      { displayName: 'Metadata', name: 'metadata', type: 'json' as const, default: '{}' },
      { displayName: 'Tags', name: 'tags', type: 'string' as const, default: '', description: 'Comma-separated list of tags' },
    ],
  },
  // Return All for list
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean' as const,
    displayOptions: {
      show: {
        resource: ['entity'],
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
        resource: ['entity'],
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
        resource: ['entity'],
        operation: ['list'],
      },
    },
    default: {},
    options: [
      { displayName: 'Status', name: 'status', type: 'string' as const, default: '' },
      { displayName: 'Created After', name: 'created_after', type: 'string' as const, default: '' },
      { displayName: 'Created Before', name: 'created_before', type: 'string' as const, default: '' },
    ],
  },
  // Search Query
  {
    displayName: 'Search Query',
    name: 'searchQuery',
    type: 'string' as const,
    required: true,
    displayOptions: {
      show: {
        resource: ['entity'],
        operation: ['search'],
      },
    },
    default: '',
    description: 'Search query string',
  },
  // Search Fields
  {
    displayName: 'Search Fields',
    name: 'searchFields',
    type: 'multiOptions' as const,
    displayOptions: {
      show: {
        resource: ['entity'],
        operation: ['search'],
      },
    },
    options: [
      { name: 'Name', value: 'name' },
      { name: 'Email', value: 'email' },
      { name: 'Phone', value: 'phone' },
      { name: 'SSN', value: 'ssn' },
      { name: 'External ID', value: 'external_id' },
    ],
    default: [],
    description: 'Fields to search in',
  },
  // Merge fields
  {
    displayName: 'Primary Entity Token',
    name: 'primaryEntityToken',
    type: 'string' as const,
    required: true,
    displayOptions: {
      show: {
        resource: ['entity'],
        operation: ['merge'],
      },
    },
    default: '',
    description: 'The entity token to keep as the primary entity',
  },
  {
    displayName: 'Secondary Entity Token',
    name: 'secondaryEntityToken',
    type: 'string' as const,
    required: true,
    displayOptions: {
      show: {
        resource: ['entity'],
        operation: ['merge'],
      },
    },
    default: '',
    description: 'The entity token to merge into the primary',
  },
];
