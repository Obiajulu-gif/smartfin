/**
 * Schema definition for user model
 * This represents the structure of the users collection in MongoDB
 */

// User schema for MongoDB
const userSchema = {
  user_id: String,              // Unique identifier for the user (could be from Firebase or any auth provider)
  email: String,                // User's email address
  display_name: String,         // User's display name
  first_name: String,           // User's first name
  last_name: String,            // User's last name
  profile_image: String,        // URL to user's profile image
  phone_number: String,         // User's phone number
  address: {                    // User's address information
    street: String,             // Street address
    city: String,               // City
    state: String,              // State/Province
    postal_code: String,        // Postal/ZIP code
    country: String             // Country
  },
  preferences: {                // User preferences
    currency: String,           // Preferred currency (e.g., 'USD', 'EUR')
    language: String,           // Preferred language
    theme: String,              // UI theme preference (e.g., 'light', 'dark')
    notifications: {            // Notification preferences
      email: Boolean,           // Email notifications enabled
      push: Boolean,            // Push notifications enabled
      sms: Boolean              // SMS notifications enabled
    }
  },
  financial_profile: {          // Financial profile information
    income_sources: [           // Income sources
      {
        name: String,           // Name of income source
        amount: Number,         // Amount
        frequency: String,      // Frequency (e.g., 'monthly', 'bi-weekly')
        category: String        // Category of income
      }
    ],
    financial_goals: [          // Financial goals
      {
        title: String,          // Goal title
        target_amount: Number,  // Target amount
        current_amount: Number, // Current saved amount
        target_date: Date,      // Target completion date
        priority: Number        // Priority level (1-5)
      }
    ],
    credit_score: Number        // User's credit score
  },
  created_at: Date,             // When the user account was created
  updated_at: Date,             // When the user profile was last updated
  last_login: Date,             // When the user last logged in
  account_status: String,       // Status of the account (e.g., 'active', 'suspended')
  verification_status: String,  // Verification status (e.g., 'verified', 'pending')
  metadata: {                   // Additional metadata
    signup_source: String,      // Where the user signed up (e.g., 'web', 'mobile', 'referral')
    user_agent: String,         // User agent information from signup
    ip_address: String          // IP address from signup
  }
};

export default userSchema; 