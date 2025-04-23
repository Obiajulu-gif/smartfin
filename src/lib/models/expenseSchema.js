/**
 * Schema definition for expense model
 * This represents the structure of the expenses collection in MongoDB
 */

// Expense schema for MongoDB
const expenseSchema = {
  user_id: String,               // User ID who owns this expense
  amount: Number,                // Expense amount
  category: String,              // Expense category (e.g., 'groceries', 'rent', 'utilities')
  subcategory: String,           // Optional subcategory for more detailed categorization
  description: String,           // Expense description/note
  date: Date,                    // Date of the expense
  created_at: Date,              // When the expense was recorded in the system
  updated_at: Date,              // When the expense was last updated
  payment_method: String,        // Payment method used (e.g., 'credit_card', 'cash', 'bank_transfer')
  account_id: String,            // ID of the account used for the expense
  account_name: String,          // Name of the account (e.g., 'Chase Checking', 'Capital One Credit Card')
  currency: String,              // Currency of the expense (e.g., 'USD', 'EUR')
  status: String,                // Status of the expense (e.g., 'completed', 'pending', 'reimbursed')
  is_tax_deductible: Boolean,    // Whether this expense is tax-deductible
  merchant: {                    // Merchant information
    name: String,                // Merchant name
    location: String,            // Merchant location
    category: String,            // Merchant category
    website: String,             // Merchant website
    notes: String                // Notes about the merchant
  },
  location: {                    // Location information
    address: String,             // Address
    city: String,                // City
    state: String,               // State/Province
    country: String,             // Country
    coordinates: {               // Geographical coordinates
      latitude: Number,          // Latitude
      longitude: Number          // Longitude
    }
  },
  tags: [String],                // Array of tags for the expense
  attachments: [{                // Array of attachments (e.g., receipts)
    name: String,                // Attachment name
    url: String,                 // URL to the attachment
    mime_type: String,           // MIME type of the attachment
    size: Number,                // Size of the attachment in bytes
    upload_date: Date            // When the attachment was uploaded
  }],
  split: [{                      // Information for split expenses
    user_id: String,             // User ID for the split portion
    amount: Number,              // Amount for this user
    percentage: Number,          // Percentage of the total
    status: String,              // Status of this split (e.g., 'paid', 'pending')
    notes: String                // Notes about this split
  }],
  recurring: {                   // Information for recurring expenses
    is_recurring: Boolean,       // Whether this is a recurring expense
    frequency: String,           // Frequency of recurrence (e.g., 'monthly', 'weekly')
    start_date: Date,            // Start date of the recurring expense
    end_date: Date,              // End date of the recurring expense (null if ongoing)
    interval: Number,            // Interval value (e.g., 1 for monthly, 2 for bi-monthly)
    day_of_month: Number,        // Day of month for monthly expenses
    day_of_week: Number          // Day of week for weekly expenses (0 = Sunday, 6 = Saturday)
  },
  budget: {                      // Budget information related to this expense
    budget_id: String,           // ID of the associated budget
    budget_category: String,     // Budget category this expense falls under
    is_over_budget: Boolean      // Whether this expense causes the budget to be exceeded
  },
  reimbursement: {               // Reimbursement information
    is_reimbursable: Boolean,    // Whether this expense is reimbursable
    reimbursed_by: String,       // Entity that will reimburse (e.g., 'employer', 'client')
    reimbursement_status: String, // Status of reimbursement (e.g., 'pending', 'approved', 'paid')
    reimbursement_date: Date,    // Date of reimbursement
    reimbursement_amount: Number, // Amount reimbursed (might be different from expense amount)
    reimbursement_notes: String  // Notes about the reimbursement
  },
  metadata: {                    // Additional metadata
    source: String,              // Source of the expense (e.g., 'manual', 'import', 'recurring')
    external_id: String,         // ID from external system (if imported)
    import_batch_id: String      // Batch ID if part of an import
  }
};

export default expenseSchema; 