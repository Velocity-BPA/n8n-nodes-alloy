/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Alloy API Endpoints Configuration
 */

export const ALLOY_ENVIRONMENTS = {
  production: 'https://api.alloy.com',
  sandbox: 'https://sandbox.alloy.com',
} as const;

export const API_VERSION = 'v1';

export const ENDPOINTS = {
  // Entity endpoints
  entities: '/v1/entities',
  entity: (entityToken: string) => `/v1/entities/${entityToken}`,
  entityByExternalId: (externalId: string) => `/v1/entities/external/${externalId}`,
  entityEvaluations: (entityToken: string) => `/v1/entities/${entityToken}/evaluations`,
  entityDocuments: (entityToken: string) => `/v1/entities/${entityToken}/documents`,
  entityEvents: (entityToken: string) => `/v1/entities/${entityToken}/events`,
  entityArchive: (entityToken: string) => `/v1/entities/${entityToken}/archive`,
  entityRestore: (entityToken: string) => `/v1/entities/${entityToken}/restore`,
  entityMerge: '/v1/entities/merge',
  entityRiskScore: (entityToken: string) => `/v1/entities/${entityToken}/risk-score`,

  // Evaluation endpoints
  evaluations: '/v1/evaluations',
  evaluation: (evaluationToken: string) => `/v1/evaluations/${evaluationToken}`,
  evaluationStatus: (evaluationToken: string) => `/v1/evaluations/${evaluationToken}/status`,
  evaluationResult: (evaluationToken: string) => `/v1/evaluations/${evaluationToken}/result`,
  evaluationOutcome: (evaluationToken: string) => `/v1/evaluations/${evaluationToken}/outcome`,
  evaluationRetry: (evaluationToken: string) => `/v1/evaluations/${evaluationToken}/retry`,
  evaluationEvents: (evaluationToken: string) => `/v1/evaluations/${evaluationToken}/events`,
  evaluationData: (evaluationToken: string) => `/v1/evaluations/${evaluationToken}/data`,
  evaluationActions: (evaluationToken: string) => `/v1/evaluations/${evaluationToken}/required-actions`,
  evaluationReview: (evaluationToken: string) => `/v1/evaluations/${evaluationToken}/review`,

  // Journey endpoints
  journeys: '/v1/journeys',
  journey: (journeyToken: string) => `/v1/journeys/${journeyToken}`,
  journeySteps: (journeyToken: string) => `/v1/journeys/${journeyToken}/steps`,
  journeyVersion: (journeyToken: string, version: string) => `/v1/journeys/${journeyToken}/versions/${version}`,
  journeyConfig: (journeyToken: string) => `/v1/journeys/${journeyToken}/config`,
  journeyStart: (journeyToken: string) => `/v1/journeys/${journeyToken}/start`,
  journeyStatus: (applicationToken: string) => `/v1/journey-applications/${applicationToken}/status`,
  journeyOutcome: (applicationToken: string) => `/v1/journey-applications/${applicationToken}/outcome`,

  // Application endpoints
  applications: '/v1/applications',
  application: (applicationToken: string) => `/v1/applications/${applicationToken}`,
  applicationSubmit: (applicationToken: string) => `/v1/applications/${applicationToken}/submit`,
  applicationStatus: (applicationToken: string) => `/v1/applications/${applicationToken}/status`,
  applicationDecision: (applicationToken: string) => `/v1/applications/${applicationToken}/decision`,
  applicationDocuments: (applicationToken: string) => `/v1/applications/${applicationToken}/documents`,
  applicationEvents: (applicationToken: string) => `/v1/applications/${applicationToken}/events`,
  applicationArchive: (applicationToken: string) => `/v1/applications/${applicationToken}/archive`,
  applicationByExternalId: (externalId: string) => `/v1/applications/external/${externalId}`,

  // Document endpoints
  documents: '/v1/documents',
  document: (documentToken: string) => `/v1/documents/${documentToken}`,
  documentStatus: (documentToken: string) => `/v1/documents/${documentToken}/status`,
  documentVerification: (documentToken: string) => `/v1/documents/${documentToken}/verification`,
  documentData: (documentToken: string) => `/v1/documents/${documentToken}/data`,
  documentFields: (documentToken: string) => `/v1/documents/${documentToken}/fields`,
  documentVerify: (documentToken: string) => `/v1/documents/${documentToken}/verify`,
  documentImage: (documentToken: string) => `/v1/documents/${documentToken}/image`,

  // Identity endpoints
  identity: '/v1/identity',
  identityVerify: '/v1/identity/verify',
  identityVerification: (verificationToken: string) => `/v1/identity/${verificationToken}`,
  identityMatch: (verificationToken: string) => `/v1/identity/${verificationToken}/match`,
  identityData: (verificationToken: string) => `/v1/identity/${verificationToken}/data`,
  identityWatchlist: (verificationToken: string) => `/v1/identity/${verificationToken}/watchlist`,
  identityKyc: (verificationToken: string) => `/v1/identity/${verificationToken}/kyc`,
  identityScore: (verificationToken: string) => `/v1/identity/${verificationToken}/score`,
  identityAttributes: (verificationToken: string) => `/v1/identity/${verificationToken}/attributes`,
  identityHistory: (verificationToken: string) => `/v1/identity/${verificationToken}/history`,
  identityReverify: (verificationToken: string) => `/v1/identity/${verificationToken}/reverify`,

  // Business endpoints
  business: '/v1/business',
  businessVerify: '/v1/business/verify',
  businessVerification: (verificationToken: string) => `/v1/business/${verificationToken}`,
  businessData: (verificationToken: string) => `/v1/business/${verificationToken}/data`,
  businessOwners: (verificationToken: string) => `/v1/business/${verificationToken}/owners`,
  businessDocuments: (verificationToken: string) => `/v1/business/${verificationToken}/documents`,
  businessWatchlist: (verificationToken: string) => `/v1/business/${verificationToken}/watchlist`,
  businessKyb: (verificationToken: string) => `/v1/business/${verificationToken}/kyb`,
  businessScore: (verificationToken: string) => `/v1/business/${verificationToken}/score`,
  businessRegistration: (verificationToken: string) => `/v1/business/${verificationToken}/registration`,
  businessAddress: (verificationToken: string) => `/v1/business/${verificationToken}/address`,

  // Watchlist endpoints
  watchlist: '/v1/watchlist',
  watchlistScreen: '/v1/watchlist/screen',
  watchlistIndividual: '/v1/watchlist/individual',
  watchlistBusiness: '/v1/watchlist/business',
  watchlistHits: (screeningToken: string) => `/v1/watchlist/${screeningToken}/hits`,
  watchlistHitDetails: (screeningToken: string, hitId: string) => `/v1/watchlist/${screeningToken}/hits/${hitId}`,
  watchlistDismiss: (screeningToken: string, hitId: string) => `/v1/watchlist/${screeningToken}/hits/${hitId}/dismiss`,
  watchlistConfirm: (screeningToken: string, hitId: string) => `/v1/watchlist/${screeningToken}/hits/${hitId}/confirm`,
  watchlistHistory: (entityToken: string) => `/v1/watchlist/history/${entityToken}`,
  watchlistMonitoring: (entityToken: string) => `/v1/watchlist/monitoring/${entityToken}`,
  watchlistSources: '/v1/watchlist/sources',

  // Risk endpoints
  risk: '/v1/risk',
  riskAssessment: (entityToken: string) => `/v1/risk/${entityToken}/assessment`,
  riskScore: (entityToken: string) => `/v1/risk/${entityToken}/score`,
  riskFactors: (entityToken: string) => `/v1/risk/${entityToken}/factors`,
  riskLevel: (entityToken: string) => `/v1/risk/${entityToken}/level`,
  riskHistory: (entityToken: string) => `/v1/risk/${entityToken}/history`,
  riskRules: '/v1/risk/rules',
  riskSignals: (entityToken: string) => `/v1/risk/${entityToken}/signals`,
  riskCalculate: '/v1/risk/calculate',
  riskThreshold: '/v1/risk/threshold',

  // Decision endpoints
  decisions: '/v1/decisions',
  decision: (decisionToken: string) => `/v1/decisions/${decisionToken}`,
  decisionRules: (decisionToken: string) => `/v1/decisions/${decisionToken}/rules`,
  decisionFactors: (decisionToken: string) => `/v1/decisions/${decisionToken}/factors`,
  decisionOverride: (decisionToken: string) => `/v1/decisions/${decisionToken}/override`,
  decisionHistory: (entityToken: string) => `/v1/decisions/history/${entityToken}`,
  decisionPending: '/v1/decisions/pending',
  decisionApprove: (decisionToken: string) => `/v1/decisions/${decisionToken}/approve`,
  decisionDeny: (decisionToken: string) => `/v1/decisions/${decisionToken}/deny`,
  decisionEscalate: (decisionToken: string) => `/v1/decisions/${decisionToken}/escalate`,
  decisionAudit: (decisionToken: string) => `/v1/decisions/${decisionToken}/audit`,

  // Review endpoints
  reviews: '/v1/reviews',
  reviewQueue: '/v1/reviews/queue',
  review: (reviewToken: string) => `/v1/reviews/${reviewToken}`,
  reviewAssign: (reviewToken: string) => `/v1/reviews/${reviewToken}/assign`,
  reviewComplete: (reviewToken: string) => `/v1/reviews/${reviewToken}/complete`,
  reviewHistory: '/v1/reviews/history',
  reviewPending: '/v1/reviews/pending',
  reviewStats: '/v1/reviews/stats',
  reviewNotes: (reviewToken: string) => `/v1/reviews/${reviewToken}/notes`,
  reviewEscalate: (reviewToken: string) => `/v1/reviews/${reviewToken}/escalate`,

  // Case endpoints
  cases: '/v1/cases',
  case: (caseToken: string) => `/v1/cases/${caseToken}`,
  caseClose: (caseToken: string) => `/v1/cases/${caseToken}/close`,
  casesByEntity: (entityToken: string) => `/v1/cases/entity/${entityToken}`,
  caseAssign: (caseToken: string) => `/v1/cases/${caseToken}/assign`,
  caseHistory: (caseToken: string) => `/v1/cases/${caseToken}/history`,
  caseNotes: (caseToken: string) => `/v1/cases/${caseToken}/notes`,
  caseDocuments: (caseToken: string) => `/v1/cases/${caseToken}/documents`,
  caseLinkEntity: (caseToken: string) => `/v1/cases/${caseToken}/entities`,
  caseStatus: (caseToken: string) => `/v1/cases/${caseToken}/status`,

  // Workflow endpoints
  workflows: '/v1/workflows',
  workflow: (workflowToken: string) => `/v1/workflows/${workflowToken}`,
  workflowSteps: (workflowToken: string) => `/v1/workflows/${workflowToken}/steps`,
  workflowOutcome: (workflowToken: string) => `/v1/workflows/${workflowToken}/outcome`,
  workflowVersion: (workflowToken: string, version: string) => `/v1/workflows/${workflowToken}/versions/${version}`,
  workflowExecute: (workflowToken: string) => `/v1/workflows/${workflowToken}/execute`,
  workflowStatus: (executionToken: string) => `/v1/workflows/executions/${executionToken}/status`,
  workflowConfig: (workflowToken: string) => `/v1/workflows/${workflowToken}/config`,

  // Rule endpoints
  rules: '/v1/rules',
  rule: (ruleId: string) => `/v1/rules/${ruleId}`,
  ruleConditions: (ruleId: string) => `/v1/rules/${ruleId}/conditions`,
  ruleActions: (ruleId: string) => `/v1/rules/${ruleId}/actions`,
  ruleTest: (ruleId: string) => `/v1/rules/${ruleId}/test`,
  rulePerformance: (ruleId: string) => `/v1/rules/${ruleId}/performance`,
  rulesActive: '/v1/rules/active',
  ruleHistory: (ruleId: string) => `/v1/rules/${ruleId}/history`,

  // Tag endpoints
  tags: '/v1/tags',
  tag: (tagId: string) => `/v1/tags/${tagId}`,
  tagsByEntity: (entityToken: string) => `/v1/entities/${entityToken}/tags`,
  tagSearch: '/v1/tags/search',
  tagStats: '/v1/tags/stats',

  // Event endpoints
  events: '/v1/events',
  event: (eventId: string) => `/v1/events/${eventId}`,
  eventsByEntity: (entityToken: string) => `/v1/events/entity/${entityToken}`,
  eventsByType: '/v1/events/type',
  eventsSearch: '/v1/events/search',
  eventsTimeline: (entityToken: string) => `/v1/events/timeline/${entityToken}`,
  eventsExport: '/v1/events/export',
  eventTypes: '/v1/events/types',

  // Webhook endpoints
  webhooks: '/v1/webhooks',
  webhook: (webhookId: string) => `/v1/webhooks/${webhookId}`,
  webhookTest: (webhookId: string) => `/v1/webhooks/${webhookId}/test`,
  webhookEvents: (webhookId: string) => `/v1/webhooks/${webhookId}/events`,
  webhookDeliveries: (webhookId: string) => `/v1/webhooks/${webhookId}/deliveries`,
  webhookRetry: (webhookId: string, deliveryId: string) => `/v1/webhooks/${webhookId}/deliveries/${deliveryId}/retry`,

  // Report endpoints
  reports: '/v1/reports',
  report: (reportId: string) => `/v1/reports/${reportId}`,
  reportStatus: (reportId: string) => `/v1/reports/${reportId}/status`,
  reportDownload: (reportId: string) => `/v1/reports/${reportId}/download`,
  reportSchedule: '/v1/reports/schedule',
  reportTemplates: '/v1/reports/templates',
  reportCompliance: '/v1/reports/compliance',
  reportRisk: '/v1/reports/risk',
  reportVolume: '/v1/reports/volume',

  // Audit endpoints
  audit: '/v1/audit',
  auditEvents: '/v1/audit/events',
  auditByEntity: (entityToken: string) => `/v1/audit/entity/${entityToken}`,
  auditByUser: (userId: string) => `/v1/audit/user/${userId}`,
  auditSearch: '/v1/audit/search',
  auditExport: '/v1/audit/export',
  auditCompliance: '/v1/audit/compliance',
  auditAccess: '/v1/audit/access',

  // Integration endpoints
  integrations: '/v1/integrations',
  integrationStatus: (integrationId: string) => `/v1/integrations/${integrationId}/status`,
  integrationTest: (integrationId: string) => `/v1/integrations/${integrationId}/test`,
  integrationConfig: (integrationId: string) => `/v1/integrations/${integrationId}/config`,
  providers: '/v1/providers',
  providerStatus: (providerId: string) => `/v1/providers/${providerId}/status`,
  dataSources: '/v1/data-sources',

  // Analytics endpoints
  analytics: '/v1/analytics',
  analyticsDashboard: '/v1/analytics/dashboard',
  analyticsApplications: '/v1/analytics/applications',
  analyticsApprovalRate: '/v1/analytics/approval-rate',
  analyticsRejectionRate: '/v1/analytics/rejection-rate',
  analyticsReviewTime: '/v1/analytics/review-time',
  analyticsFunnel: '/v1/analytics/funnel',
  analyticsVolume: '/v1/analytics/volume',
  analyticsRiskDistribution: '/v1/analytics/risk-distribution',
  analyticsExport: '/v1/analytics/export',

  // User endpoints
  users: '/v1/users',
  user: (userId: string) => `/v1/users/${userId}`,
  userPermissions: (userId: string) => `/v1/users/${userId}/permissions`,
  userRole: (userId: string) => `/v1/users/${userId}/role`,
  userActivity: (userId: string) => `/v1/users/${userId}/activity`,

  // Utility endpoints
  validateApiKey: '/v1/validate',
  apiStatus: '/v1/status',
  rateLimits: '/v1/rate-limits',
  countries: '/v1/parameters/countries',
  documentTypes: '/v1/parameters/document-types',
  documentRequirements: '/v1/parameters/document-requirements',
  testConnection: '/v1/ping',
  sdkVersion: '/v1/version',
} as const;

export type EndpointKey = keyof typeof ENDPOINTS;
