/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { AxiosInstance } from 'axios';
import FormData from 'form-data';
import { IBinaryData, IExecuteFunctions } from 'n8n-workflow';
import { ENDPOINTS } from '../constants/endpoints';
import { isValidDocumentType, isValidFileSize } from '../utils/validationUtils';

/**
 * Alloy Document Handler
 *
 * Handles document uploads and verification for Alloy
 */

export interface DocumentUploadOptions {
  entityToken: string;
  documentType: string;
  side?: 'front' | 'back';
  evaluationToken?: string;
  metadata?: Record<string, any>;
}

export interface DocumentUploadResult {
  success: boolean;
  documentToken?: string;
  status?: string;
  error?: string;
}

export interface DocumentVerificationResult {
  documentToken: string;
  status: string;
  verified: boolean;
  extractedFields?: Record<string, any>;
  fraudSignals?: string[];
  confidence?: number;
}

/**
 * Uploads a document to Alloy
 */
export async function uploadDocument(
  client: AxiosInstance,
  context: IExecuteFunctions,
  binaryPropertyName: string,
  options: DocumentUploadOptions,
  itemIndex: number = 0,
): Promise<DocumentUploadResult> {
  // Get binary data
  const binaryData = context.helpers.assertBinaryData(itemIndex, binaryPropertyName);
  const buffer = await context.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);

  // Validate file type
  if (!isValidDocumentType(binaryData.mimeType)) {
    return {
      success: false,
      error: `Invalid document type: ${binaryData.mimeType}. Supported types: jpeg, png, gif, webp, pdf, tiff`,
    };
  }

  // Validate file size (10MB max)
  if (!isValidFileSize(buffer.length)) {
    return {
      success: false,
      error: `File size ${(buffer.length / 1024 / 1024).toFixed(2)}MB exceeds maximum of 10MB`,
    };
  }

  // Create form data
  const formData = new FormData();
  formData.append('file', buffer, {
    filename: binaryData.fileName || 'document',
    contentType: binaryData.mimeType,
  });
  formData.append('entity_token', options.entityToken);
  formData.append('document_type', options.documentType);

  if (options.side) {
    formData.append('side', options.side);
  }

  if (options.evaluationToken) {
    formData.append('evaluation_token', options.evaluationToken);
  }

  if (options.metadata) {
    formData.append('metadata', JSON.stringify(options.metadata));
  }

  try {
    const response = await client.post(ENDPOINTS.documents, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    return {
      success: true,
      documentToken: response.data.document_token,
      status: response.data.status,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to upload document',
    };
  }
}

/**
 * Uploads a document from base64 data
 */
export async function uploadDocumentBase64(
  client: AxiosInstance,
  base64Data: string,
  mimeType: string,
  fileName: string,
  options: DocumentUploadOptions,
): Promise<DocumentUploadResult> {
  // Validate file type
  if (!isValidDocumentType(mimeType)) {
    return {
      success: false,
      error: `Invalid document type: ${mimeType}. Supported types: jpeg, png, gif, webp, pdf, tiff`,
    };
  }

  // Convert base64 to buffer
  const buffer = Buffer.from(base64Data, 'base64');

  // Validate file size
  if (!isValidFileSize(buffer.length)) {
    return {
      success: false,
      error: `File size ${(buffer.length / 1024 / 1024).toFixed(2)}MB exceeds maximum of 10MB`,
    };
  }

  // Create form data
  const formData = new FormData();
  formData.append('file', buffer, {
    filename: fileName,
    contentType: mimeType,
  });
  formData.append('entity_token', options.entityToken);
  formData.append('document_type', options.documentType);

  if (options.side) {
    formData.append('side', options.side);
  }

  if (options.evaluationToken) {
    formData.append('evaluation_token', options.evaluationToken);
  }

  if (options.metadata) {
    formData.append('metadata', JSON.stringify(options.metadata));
  }

  try {
    const response = await client.post(ENDPOINTS.documents, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    return {
      success: true,
      documentToken: response.data.document_token,
      status: response.data.status,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to upload document',
    };
  }
}

/**
 * Gets document verification status
 */
export async function getDocumentVerificationStatus(
  client: AxiosInstance,
  documentToken: string,
): Promise<DocumentVerificationResult> {
  const response = await client.get(ENDPOINTS.documentVerification(documentToken));

  return {
    documentToken,
    status: response.data.status,
    verified: response.data.verified || response.data.status === 'verified',
    extractedFields: response.data.extracted_fields,
    fraudSignals: response.data.fraud_signals,
    confidence: response.data.confidence,
  };
}

/**
 * Gets extracted fields from a document
 */
export async function getDocumentExtractedFields(
  client: AxiosInstance,
  documentToken: string,
): Promise<Record<string, any>> {
  const response = await client.get(ENDPOINTS.documentFields(documentToken));
  return response.data;
}

/**
 * Gets document image (base64)
 */
export async function getDocumentImage(
  client: AxiosInstance,
  documentToken: string,
): Promise<{ mimeType: string; data: string }> {
  const response = await client.get(ENDPOINTS.documentImage(documentToken), {
    responseType: 'arraybuffer',
  });

  const contentType = response.headers['content-type'] || 'image/jpeg';
  const base64 = Buffer.from(response.data).toString('base64');

  return {
    mimeType: contentType,
    data: base64,
  };
}

/**
 * Triggers manual document verification
 */
export async function triggerDocumentVerification(
  client: AxiosInstance,
  documentToken: string,
): Promise<{ success: boolean; status: string }> {
  const response = await client.post(ENDPOINTS.documentVerify(documentToken));

  return {
    success: true,
    status: response.data.status,
  };
}

/**
 * Deletes a document
 */
export async function deleteDocument(
  client: AxiosInstance,
  documentToken: string,
): Promise<{ success: boolean }> {
  await client.delete(ENDPOINTS.document(documentToken));
  return { success: true };
}

/**
 * Gets all documents for an entity
 */
export async function getEntityDocuments(
  client: AxiosInstance,
  entityToken: string,
): Promise<any[]> {
  const response = await client.get(ENDPOINTS.entityDocuments(entityToken));
  return response.data.documents || response.data;
}

/**
 * Updates document metadata
 */
export async function updateDocumentMetadata(
  client: AxiosInstance,
  documentToken: string,
  metadata: Record<string, any>,
): Promise<any> {
  const response = await client.patch(ENDPOINTS.document(documentToken), {
    metadata,
  });
  return response.data;
}

/**
 * Maps common document types to Alloy document type codes
 */
export function mapDocumentType(documentType: string): string {
  const mapping: Record<string, string> = {
    passport: 'passport',
    drivers_license: 'license',
    national_id: 'national_id',
    state_id: 'state_id',
    utility_bill: 'utility_bill',
    bank_statement: 'bank_statement',
    tax_document: 'tax_document',
    selfie: 'selfie',
    proof_of_address: 'proof_of_address',
    articles_of_incorporation: 'articles_of_incorporation',
    ein_letter: 'ein_letter',
    business_license: 'business_license',
  };

  return mapping[documentType] || documentType;
}

/**
 * Validates document requirements for a given entity type
 */
export function getRequiredDocuments(entityType: 'individual' | 'business'): string[] {
  if (entityType === 'individual') {
    return ['identity_document']; // At minimum, need ID
  }
  return ['articles_of_incorporation', 'ein_letter']; // Business documents
}
