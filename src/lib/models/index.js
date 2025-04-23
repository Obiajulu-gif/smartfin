/**
 * Central export file for all MongoDB schemas
 * This file exports all schema definitions from a single location to make imports easier
 */

import conversationSchema from './conversationSchema';
import userSchema from './userSchema';
import transactionSchema from './transactionSchema';
import expenseSchema from './expenseSchema';
import contactSchema from './contactSchema';
import productSchema from './productSchema';

// Export all schemas
export {
  conversationSchema,
  userSchema,
  transactionSchema,
  expenseSchema,
  contactSchema,
  productSchema
};

/**
 * Helper function to create a new document based on a schema
 * @param {Object} schema - The schema definition to use as a template
 * @param {Object} data - The data to populate the document with
 * @returns {Object} - A new document with default values for missing fields
 */
export function createDocument(schema, data = {}) {
  // Initialize the document
  const document = {};
  
  // Helper function to process schema recursively
  const processSchema = (schemaSection, dataSection, target) => {
    // Process each field in the schema
    for (const key in schemaSection) {
      // Skip if this is a special property like comments
      if (key.startsWith('_')) continue;
      
      const schemaValue = schemaSection[key];
      const dataValue = dataSection?.[key];
      
      // Handle arrays
      if (Array.isArray(schemaValue)) {
        // If schema defines an array of objects with a structure
        if (schemaValue.length > 0 && typeof schemaValue[0] === 'object') {
          target[key] = Array.isArray(dataValue) 
            ? dataValue.map(item => {
                const newItem = {};
                processSchema(schemaValue[0], item, newItem);
                return newItem;
              })
            : [];
        } 
        // If schema defines a simple array (e.g., [String])
        else {
          target[key] = Array.isArray(dataValue) ? dataValue : [];
        }
      }
      // Handle objects (nested schema)
      else if (typeof schemaValue === 'object' && schemaValue !== null) {
        target[key] = {};
        processSchema(schemaValue, dataValue || {}, target[key]);
      }
      // Handle primitive types
      else {
        // Use the provided data value if exists, otherwise use null
        target[key] = dataValue !== undefined ? dataValue : null;
        
        // Set default dates for timestamp fields if they're null
        if ((key.includes('date') || key.includes('_at')) && target[key] === null) {
          target[key] = new Date();
        }
      }
    }
  };
  
  // Process the schema with the provided data
  processSchema(schema, data, document);
  
  return document;
}

/**
 * Get schema by collection name
 * @param {String} collectionName - The name of the collection
 * @returns {Object|null} - The schema definition or null if not found
 */
export function getSchemaByCollection(collectionName) {
  const collectionMap = {
    'conversations': conversationSchema,
    'users': userSchema,
    'transactions': transactionSchema,
    'expenses': expenseSchema,
    'contacts': contactSchema,
    'financial_products': productSchema
  };
  
  return collectionMap[collectionName] || null;
}

export default {
  conversationSchema,
  userSchema,
  transactionSchema,
  expenseSchema,
  contactSchema,
  productSchema,
  createDocument,
  getSchemaByCollection
}; 