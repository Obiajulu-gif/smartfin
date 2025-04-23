import { NextResponse } from 'next/server';

/**
 * This is a proxy route that redirects requests from /api/products to /api/mongodb-products
 * It helps maintain backward compatibility with existing client code
 */

// Proxy GET requests
export async function GET(req) {
  try {
    // Get the URL and its search parameters
    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);
    const userId = params.get('userId');

    // Create a new URL for the mongodb-products endpoint
    const newUrl = new URL('/api/mongodb-products', url.origin);
    
    // Add the original search parameters
    if (userId) {
      newUrl.searchParams.append('userId', userId);
    }
    
    console.log('Proxying GET request from /api/products to:', newUrl.toString());

    // Fetch from the mongodb-products endpoint
    const response = await fetch(newUrl, {
      method: 'GET',
      headers: req.headers
    });

    // Get the response data
    const data = await response.json();

    // Return the data with the appropriate status
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in products proxy route (GET):', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch products',
        message: error.message 
      }, 
      { status: 500 }
    );
  }
}

// Proxy POST requests
export async function POST(req) {
  try {
    const newUrl = new URL('/api/mongodb-products', new URL(req.url).origin);
    
    // Clone the request body
    const body = await req.json();
    console.log('Proxying POST request to mongodb-products with body:', JSON.stringify(body));
    
    // Forward the request
    const response = await fetch(newUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...Object.fromEntries(req.headers)
      },
      body: JSON.stringify(body)
    });
    
    // Get and return the response
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in products proxy route (POST):', error);
    return NextResponse.json(
      { 
        error: 'Failed to create product',
        message: error.message 
      }, 
      { status: 500 }
    );
  }
}

// Proxy PUT requests
export async function PUT(req) {
  try {
    const newUrl = new URL('/api/mongodb-products', new URL(req.url).origin);
    
    // Clone the request body
    const body = await req.json();
    console.log('Proxying PUT request to mongodb-products with body:', JSON.stringify(body));
    
    // Forward the request
    const response = await fetch(newUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...Object.fromEntries(req.headers)
      },
      body: JSON.stringify(body)
    });
    
    // Get and return the response
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in products proxy route (PUT):', error);
    return NextResponse.json(
      { 
        error: 'Failed to update product',
        message: error.message 
      }, 
      { status: 500 }
    );
  }
}

// Proxy DELETE requests
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const newUrl = new URL('/api/mongodb-products', url.origin);
    
    // Copy all search parameters
    url.searchParams.forEach((value, key) => {
      newUrl.searchParams.append(key, value);
    });
    
    console.log('Proxying DELETE request to:', newUrl.toString());
    
    // Forward the request
    const response = await fetch(newUrl, {
      method: 'DELETE',
      headers: req.headers
    });
    
    // Get and return the response
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in products proxy route (DELETE):', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete product',
        message: error.message 
      }, 
      { status: 500 }
    );
  }
} 