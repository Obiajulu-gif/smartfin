/**
 * MongoDB Utility Functions
 * This file contains utility functions for working with MongoDB collections and documents
 */

import { connectToDatabase, getCollection } from './mongodb';
import { ObjectId } from 'mongodb';
import { getSchemaByCollection, createDocument } from './models';

/**
 * Create a new document in a MongoDB collection with schema validation
 * @param {string} collectionName - The name of the collection
 * @param {Object} data - The data to insert
 * @returns {Promise<Object>} - The inserted document with ID
 */
export async function createDocumentInCollection(collectionName, data) {
  try {
    // Get the collection
    const collection = await getCollection(collectionName);
    
    // Get the schema for this collection
    const schema = getSchemaByCollection(collectionName);
    
    if (!schema) {
      throw new Error(`No schema defined for collection: ${collectionName}`);
    }
    
    // Create a document based on the schema and provided data
    const document = createDocument(schema, data);
    
    // Set created_at and updated_at fields
    document.created_at = new Date();
    document.updated_at = new Date();
    
    // Insert the document
    const result = await collection.insertOne(document);
    
    // Return the inserted document with its ID
    return {
      ...document,
      _id: result.insertedId
    };
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Update a document in a MongoDB collection with schema validation
 * @param {string} collectionName - The name of the collection
 * @param {string} id - The document ID
 * @param {Object} data - The data to update
 * @param {string} userId - Optional user ID for ownership validation
 * @returns {Promise<Object>} - The updated document
 */
export async function updateDocumentInCollection(collectionName, id, data, userId = null) {
  try {
    // Get the collection
    const collection = await getCollection(collectionName);
    
    // Convert string ID to ObjectId
    const objectId = new ObjectId(id);
    
    // Build query
    const query = { _id: objectId };
    if (userId) {
      query.user_id = userId;
    }
    
    // Find the existing document
    const existingDocument = await collection.findOne(query);
    
    if (!existingDocument) {
      throw new Error(`Document not found or access denied`);
    }
    
    // Prepare update operation
    const updateData = { ...data };
    
    // Always update the updated_at field
    updateData.updated_at = new Date();
    
    // Update the document
    await collection.updateOne(
      { _id: objectId },
      { $set: updateData }
    );
    
    // Return the updated document
    return await collection.findOne({ _id: objectId });
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Delete a document from a MongoDB collection
 * @param {string} collectionName - The name of the collection
 * @param {string} id - The document ID
 * @param {string} userId - Optional user ID for ownership validation
 * @returns {Promise<boolean>} - True if document was deleted
 */
export async function deleteDocumentFromCollection(collectionName, id, userId = null) {
  try {
    // Get the collection
    const collection = await getCollection(collectionName);
    
    // Convert string ID to ObjectId
    const objectId = new ObjectId(id);
    
    // Build query
    const query = { _id: objectId };
    if (userId) {
      query.user_id = userId;
    }
    
    // Check if the document exists and user has access
    const document = await collection.findOne(query);
    
    if (!document) {
      throw new Error(`Document not found or access denied`);
    }
    
    // Delete the document
    const result = await collection.deleteOne({ _id: objectId });
    
    return result.deletedCount === 1;
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Find documents in a MongoDB collection with pagination
 * @param {string} collectionName - The name of the collection
 * @param {Object} query - MongoDB query object
 * @param {Object} options - Options for sorting, pagination, etc.
 * @param {number} options.page - Page number (1-based)
 * @param {number} options.limit - Number of documents per page
 * @param {Object} options.sort - Sort object (e.g., { createdAt: -1 })
 * @returns {Promise<Object>} - Object with documents and pagination info
 */
export async function findDocumentsInCollection(collectionName, query = {}, options = {}) {
  try {
    // Get the collection
    const collection = await getCollection(collectionName);
    
    // Set default options
    const page = options.page || 1;
    const limit = options.limit || 20;
    const sort = options.sort || { created_at: -1 };
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Get total count
    const total = await collection.countDocuments(query);
    
    // Get documents with pagination
    const documents = await collection
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    // Return documents with pagination info
    return {
      documents,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    };
  } catch (error) {
    console.error(`Error finding documents in ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Find a single document by ID
 * @param {string} collectionName - The name of the collection
 * @param {string} id - The document ID
 * @param {string} userId - Optional user ID for ownership validation
 * @returns {Promise<Object|null>} - The document or null if not found
 */
export async function findDocumentById(collectionName, id, userId = null) {
  try {
    // Get the collection
    const collection = await getCollection(collectionName);
    
    // Convert string ID to ObjectId
    const objectId = new ObjectId(id);
    
    // Build query
    const query = { _id: objectId };
    if (userId) {
      query.user_id = userId;
    }
    
    // Find the document
    return await collection.findOne(query);
  } catch (error) {
    console.error(`Error finding document by ID in ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Aggregate documents in a collection
 * @param {string} collectionName - The name of the collection
 * @param {Array} pipeline - MongoDB aggregation pipeline
 * @returns {Promise<Array>} - Array of aggregated results
 */
export async function aggregateDocuments(collectionName, pipeline) {
  try {
    // Get the collection
    const collection = await getCollection(collectionName);
    
    // Run the aggregation
    return await collection.aggregate(pipeline).toArray();
  } catch (error) {
    console.error(`Error aggregating documents in ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Check if a document exists
 * @param {string} collectionName - The name of the collection
 * @param {Object} query - MongoDB query object
 * @returns {Promise<boolean>} - True if document exists
 */
export async function documentExists(collectionName, query) {
  try {
    // Get the collection
    const collection = await getCollection(collectionName);
    
    // Check if document exists
    const count = await collection.countDocuments(query, { limit: 1 });
    
    return count > 0;
  } catch (error) {
    console.error(`Error checking if document exists in ${collectionName}:`, error);
    throw error;
  }
}

export default {
  createDocumentInCollection,
  updateDocumentInCollection,
  deleteDocumentFromCollection,
  findDocumentsInCollection,
  findDocumentById,
  aggregateDocuments,
  documentExists
}; 