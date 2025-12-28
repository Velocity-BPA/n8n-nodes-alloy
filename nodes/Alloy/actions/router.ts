/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject, NodeOperationError } from 'n8n-workflow';
import { AxiosInstance } from 'axios';
import { ENDPOINTS } from '../constants/endpoints';
import { alloyApiGet, alloyApiPost, alloyApiPut, alloyApiPatch, alloyApiDelete, alloyApiGetPaginated } from '../transport/alloyClient';
import { uploadDocument } from '../transport/documentHandler';

/**
 * Router for all resource operations
 */
export async function executeResourceOperation(
  context: IExecuteFunctions,
  client: AxiosInstance,
  resource: string,
  operation: string,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];

  // Helper function for standard CRUD operations
  const handleStandardOperation = async (
    endpoint: string,
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    body?: IDataObject,
    params?: IDataObject,
  ) => {
    let result;
    switch (method) {
      case 'get':
        result = await alloyApiGet(client, endpoint, params);
        break;
      case 'post':
        result = await alloyApiPost(client, endpoint, body);
        break;
      case 'put':
        result = await alloyApiPut(client, endpoint, body);
        break;
      case 'patch':
        result = await alloyApiPatch(client, endpoint, body);
        break;
      case 'delete':
        result = await alloyApiDelete(client, endpoint);
        break;
    }
    return result;
  };

  // Helper to get common parameters
  const getToken = (name: string) => context.getNodeParameter(name, itemIndex) as string;
  const getOptionalData = (name: string) => context.getNodeParameter(name, itemIndex, {}) as IDataObject;
  const getBoolean = (name: string) => context.getNodeParameter(name, itemIndex, false) as boolean;
  const getNumber = (name: string, def: number) => context.getNodeParameter(name, itemIndex, def) as number;

  switch (resource) {
    // ==================== DOCUMENT ====================
    case 'document': {
      switch (operation) {
        case 'upload': {
          const entityToken = getToken('entityToken');
          const documentType = context.getNodeParameter('documentType', itemIndex) as string;
          const binaryProperty = context.getNodeParameter('binaryProperty', itemIndex, 'data') as string;
          const side = context.getNodeParameter('side', itemIndex, '') as string;
          
          const result = await uploadDocument(client, context, binaryProperty, {
            entityToken,
            documentType,
            side: side as 'front' | 'back' | undefined,
          }, itemIndex);
          returnData.push({ json: result });
          break;
        }
        case 'get': {
          const documentToken = getToken('documentToken');
          const result = await handleStandardOperation(ENDPOINTS.document(documentToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'list': {
          const result = await handleStandardOperation(ENDPOINTS.documents, 'get');
          const docs = result.documents || result.data || result;
          if (Array.isArray(docs)) returnData.push(...docs.map((d: IDataObject) => ({ json: d })));
          else returnData.push({ json: result });
          break;
        }
        case 'delete': {
          const documentToken = getToken('documentToken');
          await handleStandardOperation(ENDPOINTS.document(documentToken), 'delete');
          returnData.push({ json: { success: true, documentToken } });
          break;
        }
        case 'getByEntity': {
          const entityToken = getToken('entityToken');
          const result = await handleStandardOperation(ENDPOINTS.entityDocuments(entityToken), 'get');
          const docs = result.documents || result.data || result;
          if (Array.isArray(docs)) returnData.push(...docs.map((d: IDataObject) => ({ json: d })));
          else returnData.push({ json: result });
          break;
        }
        case 'getStatus': {
          const documentToken = getToken('documentToken');
          const result = await handleStandardOperation(ENDPOINTS.documentStatus(documentToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getVerification': {
          const documentToken = getToken('documentToken');
          const result = await handleStandardOperation(ENDPOINTS.documentVerification(documentToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getData': {
          const documentToken = getToken('documentToken');
          const result = await handleStandardOperation(ENDPOINTS.documentData(documentToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getExtractedFields': {
          const documentToken = getToken('documentToken');
          const result = await handleStandardOperation(ENDPOINTS.documentFields(documentToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'verify': {
          const documentToken = getToken('documentToken');
          const result = await handleStandardOperation(ENDPOINTS.documentVerify(documentToken), 'post');
          returnData.push({ json: result });
          break;
        }
        case 'update': {
          const documentToken = getToken('documentToken');
          const updateData = getOptionalData('updateData');
          const result = await handleStandardOperation(ENDPOINTS.document(documentToken), 'patch', updateData);
          returnData.push({ json: result });
          break;
        }
        default:
          throw new NodeOperationError(context.getNode(), `Unknown document operation: ${operation}`);
      }
      break;
    }

    // ==================== IDENTITY ====================
    case 'identity': {
      switch (operation) {
        case 'verify': {
          const entityData = getOptionalData('entityData');
          const result = await handleStandardOperation(ENDPOINTS.identityVerify, 'post', entityData);
          returnData.push({ json: result });
          break;
        }
        case 'getVerification': {
          const verificationToken = getToken('verificationToken');
          const result = await handleStandardOperation(ENDPOINTS.identityVerification(verificationToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getMatch': {
          const verificationToken = getToken('verificationToken');
          const result = await handleStandardOperation(ENDPOINTS.identityMatch(verificationToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getData': {
          const verificationToken = getToken('verificationToken');
          const result = await handleStandardOperation(ENDPOINTS.identityData(verificationToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getWatchlistResults': {
          const verificationToken = getToken('verificationToken');
          const result = await handleStandardOperation(ENDPOINTS.identityWatchlist(verificationToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getKycResult': {
          const verificationToken = getToken('verificationToken');
          const result = await handleStandardOperation(ENDPOINTS.identityKyc(verificationToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getScore': {
          const verificationToken = getToken('verificationToken');
          const result = await handleStandardOperation(ENDPOINTS.identityScore(verificationToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getAttributes': {
          const verificationToken = getToken('verificationToken');
          const result = await handleStandardOperation(ENDPOINTS.identityAttributes(verificationToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getHistory': {
          const verificationToken = getToken('verificationToken');
          const result = await handleStandardOperation(ENDPOINTS.identityHistory(verificationToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'reverify': {
          const verificationToken = getToken('verificationToken');
          const result = await handleStandardOperation(ENDPOINTS.identityReverify(verificationToken), 'post');
          returnData.push({ json: result });
          break;
        }
        default:
          throw new NodeOperationError(context.getNode(), `Unknown identity operation: ${operation}`);
      }
      break;
    }

    // ==================== BUSINESS ====================
    case 'business': {
      switch (operation) {
        case 'verify': {
          const businessData = getOptionalData('businessData');
          const result = await handleStandardOperation(ENDPOINTS.businessVerify, 'post', businessData);
          returnData.push({ json: result });
          break;
        }
        case 'getVerification': {
          const verificationToken = getToken('verificationToken');
          const result = await handleStandardOperation(ENDPOINTS.businessVerification(verificationToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getData': {
          const verificationToken = getToken('verificationToken');
          const result = await handleStandardOperation(ENDPOINTS.businessData(verificationToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getOwners': {
          const verificationToken = getToken('verificationToken');
          const result = await handleStandardOperation(ENDPOINTS.businessOwners(verificationToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getDocuments': {
          const verificationToken = getToken('verificationToken');
          const result = await handleStandardOperation(ENDPOINTS.businessDocuments(verificationToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getWatchlist': {
          const verificationToken = getToken('verificationToken');
          const result = await handleStandardOperation(ENDPOINTS.businessWatchlist(verificationToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getKybResult': {
          const verificationToken = getToken('verificationToken');
          const result = await handleStandardOperation(ENDPOINTS.businessKyb(verificationToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getScore': {
          const verificationToken = getToken('verificationToken');
          const result = await handleStandardOperation(ENDPOINTS.businessScore(verificationToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getRegistration': {
          const verificationToken = getToken('verificationToken');
          const result = await handleStandardOperation(ENDPOINTS.businessRegistration(verificationToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getAddress': {
          const verificationToken = getToken('verificationToken');
          const result = await handleStandardOperation(ENDPOINTS.businessAddress(verificationToken), 'get');
          returnData.push({ json: result });
          break;
        }
        default:
          throw new NodeOperationError(context.getNode(), `Unknown business operation: ${operation}`);
      }
      break;
    }

    // ==================== WATCHLIST ====================
    case 'watchlist': {
      switch (operation) {
        case 'screenEntity': {
          const entityToken = getToken('entityToken');
          const result = await handleStandardOperation(ENDPOINTS.watchlistScreen, 'post', { entity_token: entityToken });
          returnData.push({ json: result });
          break;
        }
        case 'screenIndividual': {
          const individualData = getOptionalData('individualData');
          const result = await handleStandardOperation(ENDPOINTS.watchlistIndividual, 'post', individualData);
          returnData.push({ json: result });
          break;
        }
        case 'screenBusiness': {
          const businessData = getOptionalData('businessData');
          const result = await handleStandardOperation(ENDPOINTS.watchlistBusiness, 'post', businessData);
          returnData.push({ json: result });
          break;
        }
        case 'getHits': {
          const screeningToken = getToken('screeningToken');
          const result = await handleStandardOperation(ENDPOINTS.watchlistHits(screeningToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getHitDetails': {
          const screeningToken = getToken('screeningToken');
          const hitId = getToken('hitId');
          const result = await handleStandardOperation(ENDPOINTS.watchlistHitDetails(screeningToken, hitId), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'dismissHit': {
          const screeningToken = getToken('screeningToken');
          const hitId = getToken('hitId');
          const reason = context.getNodeParameter('reason', itemIndex, '') as string;
          const result = await handleStandardOperation(ENDPOINTS.watchlistDismiss(screeningToken, hitId), 'post', { reason });
          returnData.push({ json: result });
          break;
        }
        case 'confirmHit': {
          const screeningToken = getToken('screeningToken');
          const hitId = getToken('hitId');
          const result = await handleStandardOperation(ENDPOINTS.watchlistConfirm(screeningToken, hitId), 'post');
          returnData.push({ json: result });
          break;
        }
        case 'getHistory': {
          const entityToken = getToken('entityToken');
          const result = await handleStandardOperation(ENDPOINTS.watchlistHistory(entityToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getMonitoring': {
          const entityToken = getToken('entityToken');
          const result = await handleStandardOperation(ENDPOINTS.watchlistMonitoring(entityToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'enableMonitoring': {
          const entityToken = getToken('entityToken');
          const result = await handleStandardOperation(ENDPOINTS.watchlistMonitoring(entityToken), 'post', { enabled: true });
          returnData.push({ json: result });
          break;
        }
        case 'disableMonitoring': {
          const entityToken = getToken('entityToken');
          const result = await handleStandardOperation(ENDPOINTS.watchlistMonitoring(entityToken), 'post', { enabled: false });
          returnData.push({ json: result });
          break;
        }
        case 'getSources': {
          const result = await handleStandardOperation(ENDPOINTS.watchlistSources, 'get');
          returnData.push({ json: result });
          break;
        }
        default:
          throw new NodeOperationError(context.getNode(), `Unknown watchlist operation: ${operation}`);
      }
      break;
    }

    // ==================== RISK ====================
    case 'risk': {
      switch (operation) {
        case 'getAssessment': {
          const entityToken = getToken('entityToken');
          const result = await handleStandardOperation(ENDPOINTS.riskAssessment(entityToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getScore': {
          const entityToken = getToken('entityToken');
          const result = await handleStandardOperation(ENDPOINTS.riskScore(entityToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getFactors': {
          const entityToken = getToken('entityToken');
          const result = await handleStandardOperation(ENDPOINTS.riskFactors(entityToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getLevel': {
          const entityToken = getToken('entityToken');
          const result = await handleStandardOperation(ENDPOINTS.riskLevel(entityToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'updateScore': {
          const entityToken = getToken('entityToken');
          const scoreData = getOptionalData('scoreData');
          const result = await handleStandardOperation(ENDPOINTS.riskScore(entityToken), 'put', scoreData);
          returnData.push({ json: result });
          break;
        }
        case 'getHistory': {
          const entityToken = getToken('entityToken');
          const result = await handleStandardOperation(ENDPOINTS.riskHistory(entityToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getRules': {
          const result = await handleStandardOperation(ENDPOINTS.riskRules, 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getSignals': {
          const entityToken = getToken('entityToken');
          const result = await handleStandardOperation(ENDPOINTS.riskSignals(entityToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'calculate': {
          const calculationData = getOptionalData('calculationData');
          const result = await handleStandardOperation(ENDPOINTS.riskCalculate, 'post', calculationData);
          returnData.push({ json: result });
          break;
        }
        case 'getThreshold': {
          const result = await handleStandardOperation(ENDPOINTS.riskThreshold, 'get');
          returnData.push({ json: result });
          break;
        }
        default:
          throw new NodeOperationError(context.getNode(), `Unknown risk operation: ${operation}`);
      }
      break;
    }

    // ==================== DECISION ====================
    case 'decision': {
      switch (operation) {
        case 'get': {
          const decisionToken = getToken('decisionToken');
          const result = await handleStandardOperation(ENDPOINTS.decision(decisionToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getRules': {
          const decisionToken = getToken('decisionToken');
          const result = await handleStandardOperation(ENDPOINTS.decisionRules(decisionToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getFactors': {
          const decisionToken = getToken('decisionToken');
          const result = await handleStandardOperation(ENDPOINTS.decisionFactors(decisionToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'override': {
          const decisionToken = getToken('decisionToken');
          const overrideData = getOptionalData('overrideData');
          const result = await handleStandardOperation(ENDPOINTS.decisionOverride(decisionToken), 'post', overrideData);
          returnData.push({ json: result });
          break;
        }
        case 'getHistory': {
          const entityToken = getToken('entityToken');
          const result = await handleStandardOperation(ENDPOINTS.decisionHistory(entityToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getPending': {
          const result = await handleStandardOperation(ENDPOINTS.decisionPending, 'get');
          returnData.push({ json: result });
          break;
        }
        case 'approve': {
          const decisionToken = getToken('decisionToken');
          const reason = context.getNodeParameter('reason', itemIndex, '') as string;
          const result = await handleStandardOperation(ENDPOINTS.decisionApprove(decisionToken), 'post', { reason });
          returnData.push({ json: result });
          break;
        }
        case 'deny': {
          const decisionToken = getToken('decisionToken');
          const reason = context.getNodeParameter('reason', itemIndex, '') as string;
          const result = await handleStandardOperation(ENDPOINTS.decisionDeny(decisionToken), 'post', { reason });
          returnData.push({ json: result });
          break;
        }
        case 'escalate': {
          const decisionToken = getToken('decisionToken');
          const reason = context.getNodeParameter('reason', itemIndex, '') as string;
          const result = await handleStandardOperation(ENDPOINTS.decisionEscalate(decisionToken), 'post', { reason });
          returnData.push({ json: result });
          break;
        }
        case 'getAudit': {
          const decisionToken = getToken('decisionToken');
          const result = await handleStandardOperation(ENDPOINTS.decisionAudit(decisionToken), 'get');
          returnData.push({ json: result });
          break;
        }
        default:
          throw new NodeOperationError(context.getNode(), `Unknown decision operation: ${operation}`);
      }
      break;
    }

    // ==================== REVIEW ====================
    case 'review': {
      switch (operation) {
        case 'getQueue': {
          const result = await handleStandardOperation(ENDPOINTS.reviewQueue, 'get');
          returnData.push({ json: result });
          break;
        }
        case 'get': {
          const reviewToken = getToken('reviewToken');
          const result = await handleStandardOperation(ENDPOINTS.review(reviewToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'assign': {
          const reviewToken = getToken('reviewToken');
          const userId = context.getNodeParameter('userId', itemIndex) as string;
          const result = await handleStandardOperation(ENDPOINTS.reviewAssign(reviewToken), 'post', { user_id: userId });
          returnData.push({ json: result });
          break;
        }
        case 'complete': {
          const reviewToken = getToken('reviewToken');
          const decision = context.getNodeParameter('decision', itemIndex) as string;
          const reason = context.getNodeParameter('reason', itemIndex, '') as string;
          const result = await handleStandardOperation(ENDPOINTS.reviewComplete(reviewToken), 'post', { decision, reason });
          returnData.push({ json: result });
          break;
        }
        case 'getHistory': {
          const result = await handleStandardOperation(ENDPOINTS.reviewHistory, 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getPending': {
          const result = await handleStandardOperation(ENDPOINTS.reviewPending, 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getStats': {
          const result = await handleStandardOperation(ENDPOINTS.reviewStats, 'get');
          returnData.push({ json: result });
          break;
        }
        case 'addNote': {
          const reviewToken = getToken('reviewToken');
          const note = context.getNodeParameter('note', itemIndex) as string;
          const result = await handleStandardOperation(ENDPOINTS.reviewNotes(reviewToken), 'post', { note });
          returnData.push({ json: result });
          break;
        }
        case 'getNotes': {
          const reviewToken = getToken('reviewToken');
          const result = await handleStandardOperation(ENDPOINTS.reviewNotes(reviewToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'escalate': {
          const reviewToken = getToken('reviewToken');
          const reason = context.getNodeParameter('reason', itemIndex, '') as string;
          const result = await handleStandardOperation(ENDPOINTS.reviewEscalate(reviewToken), 'post', { reason });
          returnData.push({ json: result });
          break;
        }
        default:
          throw new NodeOperationError(context.getNode(), `Unknown review operation: ${operation}`);
      }
      break;
    }

    // ==================== CASE ====================
    case 'case': {
      switch (operation) {
        case 'create': {
          const caseData = getOptionalData('caseData');
          const result = await handleStandardOperation(ENDPOINTS.cases, 'post', caseData);
          returnData.push({ json: result });
          break;
        }
        case 'get': {
          const caseToken = getToken('caseToken');
          const result = await handleStandardOperation(ENDPOINTS.case(caseToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'update': {
          const caseToken = getToken('caseToken');
          const updateData = getOptionalData('updateData');
          const result = await handleStandardOperation(ENDPOINTS.case(caseToken), 'put', updateData);
          returnData.push({ json: result });
          break;
        }
        case 'close': {
          const caseToken = getToken('caseToken');
          const resolution = context.getNodeParameter('resolution', itemIndex, '') as string;
          const result = await handleStandardOperation(ENDPOINTS.caseClose(caseToken), 'post', { resolution });
          returnData.push({ json: result });
          break;
        }
        case 'list': {
          const returnAll = getBoolean('returnAll');
          const filters = getOptionalData('filters');
          if (returnAll) {
            const allResults: IDataObject[] = [];
            let page = 1;
            let hasMore = true;
            while (hasMore) {
              const response = await alloyApiGetPaginated(client, ENDPOINTS.cases, { page, limit: 100 }, filters);
              if (response.data) allResults.push(...response.data);
              hasMore = response.pagination?.hasMore || false;
              page++;
            }
            returnData.push(...allResults.map((item) => ({ json: item })));
          } else {
            const limit = getNumber('limit', 25);
            const response = await alloyApiGetPaginated(client, ENDPOINTS.cases, { limit }, filters);
            if (response.data) returnData.push(...response.data.map((item) => ({ json: item })));
          }
          break;
        }
        case 'getByEntity': {
          const entityToken = getToken('entityToken');
          const result = await handleStandardOperation(ENDPOINTS.casesByEntity(entityToken), 'get');
          const cases = result.cases || result.data || result;
          if (Array.isArray(cases)) returnData.push(...cases.map((c: IDataObject) => ({ json: c })));
          else returnData.push({ json: result });
          break;
        }
        case 'assign': {
          const caseToken = getToken('caseToken');
          const userId = context.getNodeParameter('userId', itemIndex) as string;
          const result = await handleStandardOperation(ENDPOINTS.caseAssign(caseToken), 'post', { user_id: userId });
          returnData.push({ json: result });
          break;
        }
        case 'getHistory': {
          const caseToken = getToken('caseToken');
          const result = await handleStandardOperation(ENDPOINTS.caseHistory(caseToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'addNote': {
          const caseToken = getToken('caseToken');
          const note = context.getNodeParameter('note', itemIndex) as string;
          const result = await handleStandardOperation(ENDPOINTS.caseNotes(caseToken), 'post', { note });
          returnData.push({ json: result });
          break;
        }
        case 'getNotes': {
          const caseToken = getToken('caseToken');
          const result = await handleStandardOperation(ENDPOINTS.caseNotes(caseToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getDocuments': {
          const caseToken = getToken('caseToken');
          const result = await handleStandardOperation(ENDPOINTS.caseDocuments(caseToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'linkEntity': {
          const caseToken = getToken('caseToken');
          const entityToken = getToken('entityToken');
          const result = await handleStandardOperation(ENDPOINTS.caseLinkEntity(caseToken), 'post', { entity_token: entityToken });
          returnData.push({ json: result });
          break;
        }
        case 'getStatus': {
          const caseToken = getToken('caseToken');
          const result = await handleStandardOperation(ENDPOINTS.caseStatus(caseToken), 'get');
          returnData.push({ json: result });
          break;
        }
        default:
          throw new NodeOperationError(context.getNode(), `Unknown case operation: ${operation}`);
      }
      break;
    }

    // ==================== WORKFLOW ====================
    case 'workflow': {
      switch (operation) {
        case 'getAll': {
          const result = await handleStandardOperation(ENDPOINTS.workflows, 'get');
          returnData.push({ json: result });
          break;
        }
        case 'get': {
          const workflowToken = getToken('workflowToken');
          const result = await handleStandardOperation(ENDPOINTS.workflow(workflowToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getSteps': {
          const workflowToken = getToken('workflowToken');
          const result = await handleStandardOperation(ENDPOINTS.workflowSteps(workflowToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getOutcome': {
          const workflowToken = getToken('workflowToken');
          const result = await handleStandardOperation(ENDPOINTS.workflowOutcome(workflowToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getVersion': {
          const workflowToken = getToken('workflowToken');
          const version = context.getNodeParameter('version', itemIndex) as string;
          const result = await handleStandardOperation(ENDPOINTS.workflowVersion(workflowToken, version), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'execute': {
          const workflowToken = getToken('workflowToken');
          const executionData = getOptionalData('executionData');
          const result = await handleStandardOperation(ENDPOINTS.workflowExecute(workflowToken), 'post', executionData);
          returnData.push({ json: result });
          break;
        }
        case 'getStatus': {
          const executionToken = getToken('executionToken');
          const result = await handleStandardOperation(ENDPOINTS.workflowStatus(executionToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getConfig': {
          const workflowToken = getToken('workflowToken');
          const result = await handleStandardOperation(ENDPOINTS.workflowConfig(workflowToken), 'get');
          returnData.push({ json: result });
          break;
        }
        default:
          throw new NodeOperationError(context.getNode(), `Unknown workflow operation: ${operation}`);
      }
      break;
    }

    // ==================== RULE ====================
    case 'rule': {
      switch (operation) {
        case 'getAll': {
          const result = await handleStandardOperation(ENDPOINTS.rules, 'get');
          returnData.push({ json: result });
          break;
        }
        case 'get': {
          const ruleId = getToken('ruleId');
          const result = await handleStandardOperation(ENDPOINTS.rule(ruleId), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getConditions': {
          const ruleId = getToken('ruleId');
          const result = await handleStandardOperation(ENDPOINTS.ruleConditions(ruleId), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getActions': {
          const ruleId = getToken('ruleId');
          const result = await handleStandardOperation(ENDPOINTS.ruleActions(ruleId), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'test': {
          const ruleId = getToken('ruleId');
          const testData = getOptionalData('testData');
          const result = await handleStandardOperation(ENDPOINTS.ruleTest(ruleId), 'post', testData);
          returnData.push({ json: result });
          break;
        }
        case 'getPerformance': {
          const ruleId = getToken('ruleId');
          const result = await handleStandardOperation(ENDPOINTS.rulePerformance(ruleId), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getActive': {
          const result = await handleStandardOperation(ENDPOINTS.rulesActive, 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getHistory': {
          const ruleId = getToken('ruleId');
          const result = await handleStandardOperation(ENDPOINTS.ruleHistory(ruleId), 'get');
          returnData.push({ json: result });
          break;
        }
        default:
          throw new NodeOperationError(context.getNode(), `Unknown rule operation: ${operation}`);
      }
      break;
    }

    // ==================== TAG ====================
    case 'tag': {
      switch (operation) {
        case 'add': {
          const entityToken = getToken('entityToken');
          const tagName = context.getNodeParameter('tagName', itemIndex) as string;
          const result = await handleStandardOperation(ENDPOINTS.tagsByEntity(entityToken), 'post', { tag: tagName });
          returnData.push({ json: result });
          break;
        }
        case 'remove': {
          const entityToken = getToken('entityToken');
          const tagName = context.getNodeParameter('tagName', itemIndex) as string;
          const result = await handleStandardOperation(`${ENDPOINTS.tagsByEntity(entityToken)}/${tagName}`, 'delete');
          returnData.push({ json: result });
          break;
        }
        case 'getAll': {
          const result = await handleStandardOperation(ENDPOINTS.tags, 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getByEntity': {
          const entityToken = getToken('entityToken');
          const result = await handleStandardOperation(ENDPOINTS.tagsByEntity(entityToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'create': {
          const tagData = getOptionalData('tagData');
          const result = await handleStandardOperation(ENDPOINTS.tags, 'post', tagData);
          returnData.push({ json: result });
          break;
        }
        case 'delete': {
          const tagId = getToken('tagId');
          await handleStandardOperation(ENDPOINTS.tag(tagId), 'delete');
          returnData.push({ json: { success: true, tagId } });
          break;
        }
        case 'search': {
          const query = context.getNodeParameter('query', itemIndex) as string;
          const result = await handleStandardOperation(ENDPOINTS.tagSearch, 'get', undefined, { q: query });
          returnData.push({ json: result });
          break;
        }
        case 'getStats': {
          const result = await handleStandardOperation(ENDPOINTS.tagStats, 'get');
          returnData.push({ json: result });
          break;
        }
        default:
          throw new NodeOperationError(context.getNode(), `Unknown tag operation: ${operation}`);
      }
      break;
    }

    // ==================== EVENT ====================
    case 'event': {
      switch (operation) {
        case 'getAll': {
          const result = await handleStandardOperation(ENDPOINTS.events, 'get');
          returnData.push({ json: result });
          break;
        }
        case 'get': {
          const eventId = getToken('eventId');
          const result = await handleStandardOperation(ENDPOINTS.event(eventId), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getByEntity': {
          const entityToken = getToken('entityToken');
          const result = await handleStandardOperation(ENDPOINTS.eventsByEntity(entityToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getByType': {
          const eventType = context.getNodeParameter('eventType', itemIndex) as string;
          const result = await handleStandardOperation(ENDPOINTS.eventsByType, 'get', undefined, { type: eventType });
          returnData.push({ json: result });
          break;
        }
        case 'search': {
          const query = context.getNodeParameter('query', itemIndex) as string;
          const result = await handleStandardOperation(ENDPOINTS.eventsSearch, 'get', undefined, { q: query });
          returnData.push({ json: result });
          break;
        }
        case 'getTimeline': {
          const entityToken = getToken('entityToken');
          const result = await handleStandardOperation(ENDPOINTS.eventsTimeline(entityToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'export': {
          const exportParams = getOptionalData('exportParams');
          const result = await handleStandardOperation(ENDPOINTS.eventsExport, 'post', exportParams);
          returnData.push({ json: result });
          break;
        }
        case 'getTypes': {
          const result = await handleStandardOperation(ENDPOINTS.eventTypes, 'get');
          returnData.push({ json: result });
          break;
        }
        default:
          throw new NodeOperationError(context.getNode(), `Unknown event operation: ${operation}`);
      }
      break;
    }

    // ==================== WEBHOOK ====================
    case 'webhook': {
      switch (operation) {
        case 'create': {
          const webhookData = getOptionalData('webhookData');
          const result = await handleStandardOperation(ENDPOINTS.webhooks, 'post', webhookData);
          returnData.push({ json: result });
          break;
        }
        case 'get': {
          const webhookId = getToken('webhookId');
          const result = await handleStandardOperation(ENDPOINTS.webhook(webhookId), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'update': {
          const webhookId = getToken('webhookId');
          const updateData = getOptionalData('updateData');
          const result = await handleStandardOperation(ENDPOINTS.webhook(webhookId), 'put', updateData);
          returnData.push({ json: result });
          break;
        }
        case 'delete': {
          const webhookId = getToken('webhookId');
          await handleStandardOperation(ENDPOINTS.webhook(webhookId), 'delete');
          returnData.push({ json: { success: true, webhookId } });
          break;
        }
        case 'list': {
          const result = await handleStandardOperation(ENDPOINTS.webhooks, 'get');
          returnData.push({ json: result });
          break;
        }
        case 'test': {
          const webhookId = getToken('webhookId');
          const result = await handleStandardOperation(ENDPOINTS.webhookTest(webhookId), 'post');
          returnData.push({ json: result });
          break;
        }
        case 'getEvents': {
          const webhookId = getToken('webhookId');
          const result = await handleStandardOperation(ENDPOINTS.webhookEvents(webhookId), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getDeliveries': {
          const webhookId = getToken('webhookId');
          const result = await handleStandardOperation(ENDPOINTS.webhookDeliveries(webhookId), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'retry': {
          const webhookId = getToken('webhookId');
          const deliveryId = getToken('deliveryId');
          const result = await handleStandardOperation(ENDPOINTS.webhookRetry(webhookId, deliveryId), 'post');
          returnData.push({ json: result });
          break;
        }
        default:
          throw new NodeOperationError(context.getNode(), `Unknown webhook operation: ${operation}`);
      }
      break;
    }

    // ==================== REPORT ====================
    case 'report': {
      switch (operation) {
        case 'generate': {
          const reportData = getOptionalData('reportData');
          const result = await handleStandardOperation(ENDPOINTS.reports, 'post', reportData);
          returnData.push({ json: result });
          break;
        }
        case 'get': {
          const reportId = getToken('reportId');
          const result = await handleStandardOperation(ENDPOINTS.report(reportId), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'list': {
          const result = await handleStandardOperation(ENDPOINTS.reports, 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getStatus': {
          const reportId = getToken('reportId');
          const result = await handleStandardOperation(ENDPOINTS.reportStatus(reportId), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'download': {
          const reportId = getToken('reportId');
          const result = await handleStandardOperation(ENDPOINTS.reportDownload(reportId), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'schedule': {
          const scheduleData = getOptionalData('scheduleData');
          const result = await handleStandardOperation(ENDPOINTS.reportSchedule, 'post', scheduleData);
          returnData.push({ json: result });
          break;
        }
        case 'getTemplates': {
          const result = await handleStandardOperation(ENDPOINTS.reportTemplates, 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getCompliance': {
          const result = await handleStandardOperation(ENDPOINTS.reportCompliance, 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getRisk': {
          const result = await handleStandardOperation(ENDPOINTS.reportRisk, 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getVolume': {
          const result = await handleStandardOperation(ENDPOINTS.reportVolume, 'get');
          returnData.push({ json: result });
          break;
        }
        default:
          throw new NodeOperationError(context.getNode(), `Unknown report operation: ${operation}`);
      }
      break;
    }

    // ==================== AUDIT ====================
    case 'audit': {
      switch (operation) {
        case 'getLog': {
          const result = await handleStandardOperation(ENDPOINTS.audit, 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getEvents': {
          const result = await handleStandardOperation(ENDPOINTS.auditEvents, 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getByEntity': {
          const entityToken = getToken('entityToken');
          const result = await handleStandardOperation(ENDPOINTS.auditByEntity(entityToken), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getByUser': {
          const userId = getToken('userId');
          const result = await handleStandardOperation(ENDPOINTS.auditByUser(userId), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'search': {
          const query = context.getNodeParameter('query', itemIndex) as string;
          const result = await handleStandardOperation(ENDPOINTS.auditSearch, 'get', undefined, { q: query });
          returnData.push({ json: result });
          break;
        }
        case 'export': {
          const exportParams = getOptionalData('exportParams');
          const result = await handleStandardOperation(ENDPOINTS.auditExport, 'post', exportParams);
          returnData.push({ json: result });
          break;
        }
        case 'getCompliance': {
          const result = await handleStandardOperation(ENDPOINTS.auditCompliance, 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getAccess': {
          const result = await handleStandardOperation(ENDPOINTS.auditAccess, 'get');
          returnData.push({ json: result });
          break;
        }
        default:
          throw new NodeOperationError(context.getNode(), `Unknown audit operation: ${operation}`);
      }
      break;
    }

    // ==================== INTEGRATION ====================
    case 'integration': {
      switch (operation) {
        case 'getAll': {
          const result = await handleStandardOperation(ENDPOINTS.integrations, 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getStatus': {
          const integrationId = getToken('integrationId');
          const result = await handleStandardOperation(ENDPOINTS.integrationStatus(integrationId), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'test': {
          const integrationId = getToken('integrationId');
          const result = await handleStandardOperation(ENDPOINTS.integrationTest(integrationId), 'post');
          returnData.push({ json: result });
          break;
        }
        case 'getConfig': {
          const integrationId = getToken('integrationId');
          const result = await handleStandardOperation(ENDPOINTS.integrationConfig(integrationId), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getProviders': {
          const result = await handleStandardOperation(ENDPOINTS.providers, 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getProviderStatus': {
          const providerId = getToken('providerId');
          const result = await handleStandardOperation(ENDPOINTS.providerStatus(providerId), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getDataSources': {
          const result = await handleStandardOperation(ENDPOINTS.dataSources, 'get');
          returnData.push({ json: result });
          break;
        }
        default:
          throw new NodeOperationError(context.getNode(), `Unknown integration operation: ${operation}`);
      }
      break;
    }

    // ==================== ANALYTICS ====================
    case 'analytics': {
      switch (operation) {
        case 'getDashboard': {
          const result = await handleStandardOperation(ENDPOINTS.analyticsDashboard, 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getApplicationStats': {
          const result = await handleStandardOperation(ENDPOINTS.analyticsApplications, 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getApprovalRate': {
          const result = await handleStandardOperation(ENDPOINTS.analyticsApprovalRate, 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getRejectionRate': {
          const result = await handleStandardOperation(ENDPOINTS.analyticsRejectionRate, 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getReviewTime': {
          const result = await handleStandardOperation(ENDPOINTS.analyticsReviewTime, 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getFunnel': {
          const result = await handleStandardOperation(ENDPOINTS.analyticsFunnel, 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getVolume': {
          const result = await handleStandardOperation(ENDPOINTS.analyticsVolume, 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getRiskDistribution': {
          const result = await handleStandardOperation(ENDPOINTS.analyticsRiskDistribution, 'get');
          returnData.push({ json: result });
          break;
        }
        case 'export': {
          const exportParams = getOptionalData('exportParams');
          const result = await handleStandardOperation(ENDPOINTS.analyticsExport, 'post', exportParams);
          returnData.push({ json: result });
          break;
        }
        default:
          throw new NodeOperationError(context.getNode(), `Unknown analytics operation: ${operation}`);
      }
      break;
    }

    // ==================== USER ====================
    case 'user': {
      switch (operation) {
        case 'getAll': {
          const result = await handleStandardOperation(ENDPOINTS.users, 'get');
          returnData.push({ json: result });
          break;
        }
        case 'get': {
          const userId = getToken('userId');
          const result = await handleStandardOperation(ENDPOINTS.user(userId), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'create': {
          const userData = getOptionalData('userData');
          const result = await handleStandardOperation(ENDPOINTS.users, 'post', userData);
          returnData.push({ json: result });
          break;
        }
        case 'update': {
          const userId = getToken('userId');
          const updateData = getOptionalData('updateData');
          const result = await handleStandardOperation(ENDPOINTS.user(userId), 'put', updateData);
          returnData.push({ json: result });
          break;
        }
        case 'delete': {
          const userId = getToken('userId');
          await handleStandardOperation(ENDPOINTS.user(userId), 'delete');
          returnData.push({ json: { success: true, userId } });
          break;
        }
        case 'getPermissions': {
          const userId = getToken('userId');
          const result = await handleStandardOperation(ENDPOINTS.userPermissions(userId), 'get');
          returnData.push({ json: result });
          break;
        }
        case 'updateRole': {
          const userId = getToken('userId');
          const role = context.getNodeParameter('role', itemIndex) as string;
          const result = await handleStandardOperation(ENDPOINTS.userRole(userId), 'put', { role });
          returnData.push({ json: result });
          break;
        }
        case 'getActivity': {
          const userId = getToken('userId');
          const result = await handleStandardOperation(ENDPOINTS.userActivity(userId), 'get');
          returnData.push({ json: result });
          break;
        }
        default:
          throw new NodeOperationError(context.getNode(), `Unknown user operation: ${operation}`);
      }
      break;
    }

    // ==================== UTILITY ====================
    case 'utility': {
      switch (operation) {
        case 'validateApiKey': {
          const result = await handleStandardOperation(ENDPOINTS.validateApiKey, 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getApiStatus': {
          const result = await handleStandardOperation(ENDPOINTS.apiStatus, 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getRateLimits': {
          const result = await handleStandardOperation(ENDPOINTS.rateLimits, 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getSupportedCountries': {
          const result = await handleStandardOperation(ENDPOINTS.countries, 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getSupportedDocuments': {
          const result = await handleStandardOperation(ENDPOINTS.documentTypes, 'get');
          returnData.push({ json: result });
          break;
        }
        case 'getDocumentRequirements': {
          const result = await handleStandardOperation(ENDPOINTS.documentRequirements, 'get');
          returnData.push({ json: result });
          break;
        }
        case 'testConnection': {
          const result = await handleStandardOperation(ENDPOINTS.testConnection, 'get');
          returnData.push({ json: { success: true, ...result } });
          break;
        }
        case 'getSdkVersion': {
          const result = await handleStandardOperation(ENDPOINTS.sdkVersion, 'get');
          returnData.push({ json: result });
          break;
        }
        default:
          throw new NodeOperationError(context.getNode(), `Unknown utility operation: ${operation}`);
      }
      break;
    }

    default:
      throw new NodeOperationError(context.getNode(), `Unknown resource: ${resource}`);
  }

  return returnData;
}
