/**
 * Schema definition for contact model
 * This represents the structure of the contacts collection in MongoDB
 */

// Contact schema for MongoDB
const contactSchema = {
  user_id: String,               // User ID who owns this contact
  name: String,                  // Contact name
  email: String,                 // Contact email address
  phone: String,                 // Contact phone number
  alternate_phone: String,       // Alternative phone number
  company: String,               // Company name
  type: String,                  // Contact type (e.g., 'client', 'vendor', 'personal')
  notes: String,                 // Additional notes about the contact
  address: {                     // Contact address information
    street: String,              // Street address
    city: String,                // City
    state: String,               // State/Province
    postal_code: String,         // Postal/ZIP code
    country: String              // Country
  },
  website: String,               // Contact website
  social_media: {                // Social media profiles
    linkedin: String,            // LinkedIn profile URL
    twitter: String,             // Twitter profile URL
    facebook: String,            // Facebook profile URL
    instagram: String            // Instagram profile URL
  },
  financial_relationships: [{    // Financial relationships with this contact
    type: String,                // Relationship type (e.g., 'debtor', 'creditor', 'business_partner')
    description: String,         // Description of the relationship
    amount_involved: Number,     // Amount of money involved in the relationship
    currency: String,            // Currency of the financial relationship
    status: String               // Status of the relationship (e.g., 'active', 'settled', 'disputed')
  }],
  tags: [String],                // Array of tags for categorizing the contact
  custom_fields: Object,         // Custom fields that can be defined by the user
  created_at: Date,              // When the contact was created
  updated_at: Date,              // When the contact was last updated
  last_contact_date: Date,       // When the user last interacted with this contact
  contact_frequency: String,     // Preferred contact frequency (e.g., 'weekly', 'monthly')
  metadata: {                    // Additional metadata
    source: String,              // Source of the contact (e.g., 'manual', 'import', 'referral')
    import_batch_id: String,     // Batch ID if part of an import
    visibility: String,          // Visibility setting (e.g., 'private', 'team', 'public')
    favorite: Boolean            // Whether this is a favorite contact
  }
};

export default contactSchema; 