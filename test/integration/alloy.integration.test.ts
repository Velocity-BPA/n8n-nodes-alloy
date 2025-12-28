/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Integration Tests for n8n-nodes-alloy
 *
 * Note: These tests require valid Alloy API credentials set as environment variables:
 * - ALLOY_API_KEY
 * - ALLOY_API_SECRET
 * - ALLOY_ENVIRONMENT (sandbox/production)
 *
 * Run with: npm test -- --testPathPattern=integration
 */

import { createAlloyClient, alloyApiGet } from '../../nodes/Alloy/transport/alloyClient';
import { ENDPOINTS, ALLOY_ENVIRONMENTS } from '../../nodes/Alloy/constants';

// Skip integration tests if credentials not available
const runIntegrationTests = process.env.ALLOY_API_KEY && process.env.ALLOY_API_SECRET;

(runIntegrationTests ? describe : describe.skip)('Alloy Integration Tests', () => {
  let client: ReturnType<typeof createAlloyClient>;

  beforeAll(() => {
    client = createAlloyClient({
      baseUrl: ALLOY_ENVIRONMENTS[process.env.ALLOY_ENVIRONMENT as keyof typeof ALLOY_ENVIRONMENTS || 'sandbox'],
      apiKey: process.env.ALLOY_API_KEY!,
      apiSecret: process.env.ALLOY_API_SECRET!,
    });
  });

  describe('API Connectivity', () => {
    test('should connect to Alloy API', async () => {
      const response = await alloyApiGet(client, ENDPOINTS.testConnection);
      expect(response).toBeDefined();
    });

    test('should validate API credentials', async () => {
      const response = await alloyApiGet(client, ENDPOINTS.validateApiKey);
      expect(response).toBeDefined();
    });

    test('should get supported countries', async () => {
      const response = await alloyApiGet(client, ENDPOINTS.countries);
      expect(response).toBeDefined();
    });

    test('should get supported document types', async () => {
      const response = await alloyApiGet(client, ENDPOINTS.documentTypes);
      expect(response).toBeDefined();
    });
  });

  describe('Entity Operations', () => {
    let entityToken: string;

    test('should create an entity', async () => {
      const entityData = {
        name_first: 'Test',
        name_last: 'User',
        email_address: 'test@example.com',
        birth_date: '1990-01-01',
      };

      const response = await client.post(ENDPOINTS.entities, entityData);
      expect(response.data.entity_token).toBeDefined();
      entityToken = response.data.entity_token;
    });

    test('should get an entity', async () => {
      if (!entityToken) {
        console.log('Skipping - no entity token');
        return;
      }
      const response = await alloyApiGet(client, ENDPOINTS.entity(entityToken));
      expect(response.entity_token).toBe(entityToken);
    });

    test('should list entities', async () => {
      const response = await alloyApiGet(client, ENDPOINTS.entities);
      expect(Array.isArray(response.entities || response.data || response)).toBe(true);
    });

    afterAll(async () => {
      // Clean up: archive the test entity
      if (entityToken) {
        try {
          await client.post(ENDPOINTS.entityArchive(entityToken));
        } catch {
          // Ignore cleanup errors
        }
      }
    });
  });

  describe('Workflow Operations', () => {
    test('should list workflows', async () => {
      const response = await alloyApiGet(client, ENDPOINTS.workflows);
      expect(response).toBeDefined();
    });
  });

  describe('Rate Limits', () => {
    test('should get rate limit information', async () => {
      const response = await alloyApiGet(client, ENDPOINTS.rateLimits);
      expect(response).toBeDefined();
    });
  });
});
