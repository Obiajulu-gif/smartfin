/**
 * Schema definition for financial product model
 * This represents the structure of the financial_products collection in MongoDB
 */

// Financial product schema for MongoDB
const productSchema = {
  product_id: String,            // Unique identifier for the product
  name: String,                  // Product name
  type: String,                  // Product type (e.g., 'credit_card', 'loan', 'savings_account', 'investment')
  provider: String,              // Financial institution/provider name
  description: String,           // Product description
  features: [String],            // Array of product features
  benefits: [String],            // Array of product benefits
  eligibility: {                 // Eligibility criteria
    min_age: Number,             // Minimum age requirement
    residency: String,           // Residency requirement
    min_income: Number,          // Minimum income requirement
    credit_score: {              // Credit score requirements
      min: Number,               // Minimum credit score
      recommended: Number        // Recommended credit score
    },
    additional_requirements: [String] // Additional eligibility requirements
  },
  terms: {                       // Product terms
    interest_rate: {             // Interest rate information
      type: String,              // Rate type (e.g., 'fixed', 'variable')
      value: Number,             // Current interest rate value
      apr: Number,               // Annual Percentage Rate
      compounding: String        // Compounding frequency (e.g., 'daily', 'monthly')
    },
    fees: [{                     // Array of associated fees
      name: String,              // Fee name
      amount: Number,            // Fee amount
      frequency: String,         // Fee frequency (e.g., 'one-time', 'annual', 'monthly')
      description: String        // Fee description
    }],
    term_length: {               // Term length information
      value: Number,             // Term length value
      unit: String               // Unit of time (e.g., 'months', 'years')
    },
    min_deposit: Number,         // Minimum deposit requirement
    early_termination_fee: Number, // Early termination fee
    grace_period: Number         // Grace period in days
  },
  limits: {                      // Product limits
    min_amount: Number,          // Minimum amount
    max_amount: Number,          // Maximum amount
    daily_limit: Number,         // Daily transaction limit
    monthly_limit: Number        // Monthly transaction limit
  },
  application: {                 // Application information
    process: String,             // Application process description
    required_documents: [String], // Required documents for application
    approval_time: String,       // Estimated approval time
    online_application: Boolean  // Whether online application is available
  },
  ratings: {                     // Product ratings
    average: Number,             // Average rating (1-5)
    count: Number,               // Number of ratings
    reviews: [{                  // Array of reviews
      user_id: String,           // User ID who left the review
      rating: Number,            // Rating value (1-5)
      comment: String,           // Review comment
      date: Date                 // Date of the review
    }]
  },
  metadata: {                    // Additional metadata
    created_at: Date,            // When the product was added to the system
    updated_at: Date,            // When the product was last updated
    status: String,              // Product status (e.g., 'active', 'discontinued')
    popularity_score: Number,    // Popularity score based on user interest
    recommended_for: [String],   // User profiles this product is recommended for
    category_tags: [String]      // Category tags for the product
  },
  links: {                       // External links
    website: String,             // Product website URL
    application_url: String,     // Direct application URL
    terms_url: String,           // Terms and conditions URL
    brochure_url: String         // Product brochure URL
  },
  support: {                     // Support information
    phone: String,               // Support phone number
    email: String,               // Support email
    chat_available: Boolean,     // Whether live chat support is available
    hours: String                // Support hours
  }
};

export default productSchema; 