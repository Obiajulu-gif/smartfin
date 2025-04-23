import { ObjectId } from 'mongodb';
import { connectToDatabase, getCollection } from '../../../lib/mongodb';
import { prisma } from '../../../lib/prisma';

// GET - Fetch contacts using direct MongoDB connection
export async function GET(req) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User not authenticated' }), { status: 401 });
    }

    console.log('Fetching contacts for userId:', userId);

    try {
      // Get the contacts collection
      const contactsCollection = await getCollection('Contact');
      
      // Check connection with a simple ping
      await connectToDatabase();
      
      // Query MongoDB directly
      const contacts = await contactsCollection
        .find({ userId })
        .sort({ name: 1 })
        .toArray();

      console.log(`Found ${contacts.length} contacts for user ${userId}`);

      // Transform MongoDB ObjectId to string ID for easier client-side handling
      const transformedContacts = contacts.map(contact => ({
        ...contact,
        id: contact._id.toString(), // Add a string ID field
        createdAt: contact.createdAt ? contact.createdAt.toISOString() : null,
        updatedAt: contact.updatedAt ? contact.updatedAt.toISOString() : null
      }));

      return new Response(JSON.stringify(transformedContacts), { 
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
    console.error('Error fetching contacts:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch contacts',
      message: error.message || 'Unknown error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST - Add a contact using direct MongoDB connection
export async function POST(req) {
  try {
    // Get the data from the frontend
    const data = await req.json();
    
    // Log the received data for debugging
    console.log('Received contact data:', data);
    
    // Assign the json data to these values
    const { userId, name, email, phone, company, type, notes, createdAt } = data;
    
    // Validation
    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
    }
    if (!name) {
      return new Response(JSON.stringify({ error: 'Name is required' }), { status: 400 });
    }
    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
    }
    if (!phone) {
      return new Response(JSON.stringify({ error: 'Phone is required' }), { status: 400 });
    }

    // Get the contacts collection
    const contactsCollection = await getCollection('Contact');
    
    // Create a new contact document with all fields
    const contact = {
      userId,
      name,
      email,
      phone,
      company: company || '',
      type: type || 'client', // Default to 'client' if not specified
      notes: notes || '',
      createdAt: createdAt ? new Date(createdAt) : new Date(),
      updatedAt: new Date()
    };
    
    // Log the document to be inserted
    console.log('Inserting contact into MongoDB:', contact);
    
    // Insert the document
    const result = await contactsCollection.insertOne(contact);
    console.log('MongoDB insertion result:', result);
    
    // Return the new contact with its generated ID
    return new Response(JSON.stringify({
      ...contact,
      _id: result.insertedId
    }), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error adding contact:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to add contact',
      message: error.message || 'Unknown error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// PUT - Update a contact using direct MongoDB connection
export async function PUT(req) {
  try {
    const data = await req.json();
    console.log('Updating contact with data:', data);
    
    const { userId, id, name, email, phone, company, type, notes } = data;
    
    if (!userId || !id) {
      return new Response(JSON.stringify({ error: 'User ID and contact ID are required' }), { status: 400 });
    }

    // Convert string ID to ObjectId
    const objectId = new ObjectId(id);
    
    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (company !== undefined) updateData.company = company;
    if (type !== undefined) updateData.type = type;
    if (notes !== undefined) updateData.notes = notes;
    
    // Add update timestamp
    updateData.updatedAt = new Date();
    
    console.log('Update data:', updateData);
    
    // Get the contacts collection
    const contactsCollection = await getCollection('Contact');
    
    // Update the contact
    const result = await contactsCollection.updateOne(
      { _id: objectId, userId }, 
      { $set: updateData }
    );
    
    console.log('Update result:', result);
    
    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: 'Contact not found or user not authorized' }), { status: 404 });
    }
    
    return new Response(JSON.stringify({
      message: 'Contact updated successfully',
      modifiedCount: result.modifiedCount
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to update contact',
      message: error.message || 'Unknown error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// DELETE - Delete a contact using direct MongoDB connection
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const userId = url.searchParams.get('userId');

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing contact id' }), { status: 400 });
    }
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
    }

    // Get the contacts collection
    const contactsCollection = await getCollection('Contact');
    
    // Convert string ID to ObjectId
    const objectId = new ObjectId(id);
    
    // Find the contact first to verify ownership
    const contact = await contactsCollection.findOne({ 
      _id: objectId 
    });

    if (!contact) {
      return new Response(JSON.stringify({ error: 'Contact not found' }), { status: 404 });
    }
    
    if (contact.userId !== userId) {
      return new Response(JSON.stringify({ error: 'User not authorized to delete this contact' }), { status: 403 });
    }

    // Delete the contact
    await contactsCollection.deleteOne({ _id: objectId });

    return new Response(JSON.stringify({ 
      message: 'Contact deleted successfully' 
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to delete contact',
      message: error.message || 'Unknown error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}