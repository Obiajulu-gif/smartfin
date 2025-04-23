import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

// This is a proxy route that redirects requests from /api/contacts to /api/mongodb-contacts
// It helps maintain backward compatibility with existing client code

export async function GET(req) {
  try {
    // Get the URL and its search parameters
    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);
    const userId = params.get('userId');

    // Create a new URL for the mongodb-contacts endpoint
    const newUrl = new URL('/api/mongodb-contacts', url.origin);
    // Add the original search parameters
    if (userId) {
      newUrl.searchParams.append('userId', userId);
    }

    // Fetch from the mongodb-contacts endpoint
    const response = await fetch(newUrl, {
      method: 'GET',
      headers: req.headers
    });

    // Get the response data
    const data = await response.json();

    // Return the data with the appropriate status
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in contacts proxy route:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch contacts',
        message: error.message 
      }, 
      { status: 500 }
    );
  }
}

// Similarly handle POST, PUT, DELETE methods
export async function POST(req) {
  try {
    const newUrl = new URL('/api/mongodb-contacts', new URL(req.url).origin);
    const response = await fetch(newUrl, {
      method: 'POST',
      headers: req.headers,
      body: JSON.stringify(await req.json())
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in contacts proxy route (POST):', error);
    return NextResponse.json(
      { 
        error: 'Failed to create contact',
        message: error.message 
      }, 
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const newUrl = new URL('/api/mongodb-contacts', new URL(req.url).origin);
    const response = await fetch(newUrl, {
      method: 'PUT',
      headers: req.headers,
      body: JSON.stringify(await req.json())
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in contacts proxy route (PUT):', error);
    return NextResponse.json(
      { 
        error: 'Failed to update contact',
        message: error.message 
      }, 
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const newUrl = new URL('/api/mongodb-contacts', url.origin);
    // Copy all search parameters
    url.searchParams.forEach((value, key) => {
      newUrl.searchParams.append(key, value);
    });
    
    const response = await fetch(newUrl, {
      method: 'DELETE',
      headers: req.headers
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in contacts proxy route (DELETE):', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete contact',
        message: error.message 
      }, 
      { status: 500 }
    );
  }
} 