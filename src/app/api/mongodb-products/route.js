import { connectToDatabase, getCollection } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Fetch products using direct MongoDB connection
export async function GET(req) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User not authenticated' }), { status: 401 });
    }

    console.log('Fetching products for userId:', userId);

    try {
      // Get the products collection
      const productsCollection = await getCollection('Product');
      
      // Check connection with a simple ping
      await connectToDatabase();
      
      // Query MongoDB directly
      const products = await productsCollection
        .find({ userId })
        .sort({ name: 1 })
        .toArray();

      console.log(`Found ${products.length} products for user ${userId}`);
      
      // Transform MongoDB ObjectId to string ID for easier client-side handling
      const transformedProducts = products.map(product => ({
        ...product,
        id: product._id.toString(), // Add a string ID field
        createdAt: product.createdAt ? product.createdAt.toISOString() : null,
        updatedAt: product.updatedAt ? product.updatedAt.toISOString() : null
      }));

      return new Response(JSON.stringify(transformedProducts), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (dbError) {
      console.error('MongoDB connection error:', dbError);
      return new Response(JSON.stringify({ 
        error: 'Database connection error', 
        message: dbError.message 
      }), { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch products',
      message: error.message || 'Unknown error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST - Add a product using direct MongoDB connection
export async function POST(req) {
  try {
    // Get the data from the frontend
    const data = await req.json();
    
    console.log('Received product data:', JSON.stringify(data));
    
    // Assign the json data to these values
    const { userId, name, description, price, category, sku } = data;
    
    // Validation
    if (!userId) {
      console.log('Validation failed: Missing userId');
      return new Response(JSON.stringify({ error: 'User ID is required' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    if (!name) {
      console.log('Validation failed: Missing product name');
      return new Response(JSON.stringify({ error: 'Product name is required' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    if (!price) {
      console.log('Validation failed: Missing price');
      return new Response(JSON.stringify({ error: 'Price is required' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Parse price to ensure it's a number
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      console.log('Validation failed: Invalid price format', price);
      return new Response(JSON.stringify({ error: 'Price must be a valid number' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Explicitly connect to the database first
    console.log('Attempting to connect to MongoDB...');
    let client, db;
    try {
      const connection = await connectToDatabase();
      client = connection.client;
      db = connection.db;
      console.log('MongoDB connection established successfully');
    } catch (dbConnError) {
      console.error('MongoDB connection error:', dbConnError);
      return new Response(JSON.stringify({ 
        error: 'Database connection failed', 
        details: dbConnError.message 
      }), { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get the products collection
    let productsCollection;
    try {
      productsCollection = await getCollection('Product');
      console.log('Got products collection');
    } catch (collectionError) {
      console.error('Failed to get collection:', collectionError);
      return new Response(JSON.stringify({ 
        error: 'Could not access products collection', 
        details: collectionError.message
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Create a new product document
    const product = {
      userId,
      name,
      description: description || '',
      price: parsedPrice,
      category: category || 'Other',
      sku: sku || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('Attempting to insert product:', JSON.stringify(product));
    
    // Insert the document
    let result;
    try {
      result = await productsCollection.insertOne(product);
      console.log('Product inserted successfully, ID:', result.insertedId);
    } catch (insertError) {
      console.error('Failed to insert product:', insertError);
      return new Response(JSON.stringify({ 
        error: 'Database operation failed', 
        details: insertError.message
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Return the new product with its generated ID
    return new Response(JSON.stringify({
      ...product,
      _id: result.insertedId
    }), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error adding product:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to add product',
      message: error.message || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// PUT - Update a product using direct MongoDB connection
export async function PUT(req) {
  try {
    const data = await req.json();
    const { userId, id, name, description, price, category, sku } = data;
    
    if (!userId || !id) {
      return new Response(JSON.stringify({ error: 'User ID and product ID are required' }), { status: 400 });
    }

    // Convert string ID to ObjectId
    const objectId = new ObjectId(id);
    
    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (category) updateData.category = category;
    if (sku !== undefined) updateData.sku = sku;
    
    if (price) {
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice)) {
        return new Response(JSON.stringify({ error: 'Price must be a valid number' }), { status: 400 });
      }
      updateData.price = parsedPrice;
    }
    
    // Add update timestamp
    updateData.updatedAt = new Date();
    
    // Get the products collection
    const productsCollection = await getCollection('Product');
    
    // Update the product
    const result = await productsCollection.updateOne(
      { _id: objectId, userId }, 
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: 'Product not found or user not authorized' }), { status: 404 });
    }
    
    return new Response(JSON.stringify({
      message: 'Product updated successfully',
      modifiedCount: result.modifiedCount
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to update product',
      message: error.message || 'Unknown error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// DELETE - Delete a product using direct MongoDB connection
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const userId = url.searchParams.get('userId');

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing product id' }), { status: 400 });
    }
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
    }

    // Get the products collection
    const productsCollection = await getCollection('Product');
    
    // Convert string ID to ObjectId
    const objectId = new ObjectId(id);
    
    // Find the product first to verify ownership
    const product = await productsCollection.findOne({ 
      _id: objectId 
    });

    if (!product) {
      return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
    }
    
    if (product.userId !== userId) {
      return new Response(JSON.stringify({ error: 'User not authorized to delete this product' }), { status: 403 });
    }

    // Delete the product
    await productsCollection.deleteOne({ _id: objectId });

    return new Response(JSON.stringify({ 
      message: 'Product deleted successfully' 
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to delete product',
      message: error.message || 'Unknown error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}