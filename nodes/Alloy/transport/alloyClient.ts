/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { IExecuteFunctions, ILoadOptionsFunctions, ICredentialDataDecryptedObject } from 'n8n-workflow';
import { ALLOY_ENVIRONMENTS } from '../constants/endpoints';

/**
 * Alloy API Client
 *
 * Handles all HTTP communication with the Alloy API
 */

// License notice - logged once per node load
let licenseNoticeLogged = false;

function logLicenseNotice(): void {
  if (!licenseNoticeLogged) {
    console.warn(`[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`);
    licenseNoticeLogged = true;
  }
}

export interface AlloyApiConfig {
  baseUrl: string;
  apiKey: string;
  apiSecret: string;
  workflowToken?: string;
  webhookSecret?: string;
}

export interface AlloyApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * Creates an Alloy API client instance
 */
export function createAlloyClient(config: AlloyApiConfig): AxiosInstance {
  logLicenseNotice();

  const client = axios.create({
    baseURL: config.baseUrl,
    auth: {
      username: config.apiKey,
      password: config.apiSecret,
    },
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'n8n-nodes-alloy/1.0.0',
    },
    timeout: 30000,
  });

  // Request interceptor for logging and token injection
  client.interceptors.request.use(
    (requestConfig) => {
      return requestConfig;
    },
    (error) => Promise.reject(error),
  );

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        const { status, data } = error.response;
        const errorMessage = data?.error?.message || data?.message || 'Unknown error';
        const errorCode = data?.error?.code || `HTTP_${status}`;

        const enhancedError = new Error(`Alloy API Error [${errorCode}]: ${errorMessage}`);
        (enhancedError as any).statusCode = status;
        (enhancedError as any).errorCode = errorCode;
        (enhancedError as any).response = data;

        return Promise.reject(enhancedError);
      }

      if (error.code === 'ECONNABORTED') {
        return Promise.reject(new Error('Request timeout - Alloy API did not respond in time'));
      }

      return Promise.reject(error);
    },
  );

  return client;
}

/**
 * Gets the base URL for the Alloy API based on credentials
 */
export function getBaseUrl(credentials: ICredentialDataDecryptedObject): string {
  const environment = credentials.environment as string;

  if (environment === 'custom') {
    return credentials.customEndpoint as string;
  }

  return ALLOY_ENVIRONMENTS[environment as keyof typeof ALLOY_ENVIRONMENTS] || ALLOY_ENVIRONMENTS.sandbox;
}

/**
 * Creates an Alloy client from n8n credentials
 */
export async function createClientFromCredentials(
  context: IExecuteFunctions | ILoadOptionsFunctions,
  credentialType: string = 'alloyApi',
): Promise<AxiosInstance> {
  const credentials = await context.getCredentials(credentialType);

  const config: AlloyApiConfig = {
    baseUrl: getBaseUrl(credentials),
    apiKey: credentials.apiKey as string,
    apiSecret: credentials.apiSecret as string,
    workflowToken: credentials.workflowToken as string | undefined,
    webhookSecret: credentials.webhookSecret as string | undefined,
  };

  return createAlloyClient(config);
}

/**
 * Makes a GET request to the Alloy API
 */
export async function alloyApiGet<T = any>(
  client: AxiosInstance,
  endpoint: string,
  params?: Record<string, any>,
): Promise<T> {
  const response: AxiosResponse<T> = await client.get(endpoint, { params });
  return response.data;
}

/**
 * Makes a POST request to the Alloy API
 */
export async function alloyApiPost<T = any>(
  client: AxiosInstance,
  endpoint: string,
  data?: Record<string, any>,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response: AxiosResponse<T> = await client.post(endpoint, data, config);
  return response.data;
}

/**
 * Makes a PUT request to the Alloy API
 */
export async function alloyApiPut<T = any>(
  client: AxiosInstance,
  endpoint: string,
  data?: Record<string, any>,
): Promise<T> {
  const response: AxiosResponse<T> = await client.put(endpoint, data);
  return response.data;
}

/**
 * Makes a PATCH request to the Alloy API
 */
export async function alloyApiPatch<T = any>(
  client: AxiosInstance,
  endpoint: string,
  data?: Record<string, any>,
): Promise<T> {
  const response: AxiosResponse<T> = await client.patch(endpoint, data);
  return response.data;
}

/**
 * Makes a DELETE request to the Alloy API
 */
export async function alloyApiDelete<T = any>(
  client: AxiosInstance,
  endpoint: string,
): Promise<T> {
  const response: AxiosResponse<T> = await client.delete(endpoint);
  return response.data;
}

/**
 * Makes a paginated GET request
 */
export async function alloyApiGetPaginated<T = any>(
  client: AxiosInstance,
  endpoint: string,
  pagination: PaginationParams,
  additionalParams?: Record<string, any>,
): Promise<AlloyApiResponse<T[]>> {
  const params = {
    page: pagination.page || 1,
    limit: pagination.limit || 25,
    sort: pagination.sort,
    order: pagination.order,
    ...additionalParams,
  };

  const response = await client.get(endpoint, { params });

  return {
    success: true,
    data: response.data.data || response.data,
    pagination: {
      page: response.data.page || params.page,
      limit: response.data.limit || params.limit,
      total: response.data.total || 0,
      hasMore: response.data.has_more || false,
    },
  };
}

/**
 * Handles rate limiting with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000,
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Check if it's a rate limit error (429)
      if (error.statusCode === 429 && attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      // For other errors, don't retry
      throw error;
    }
  }

  throw lastError;
}
