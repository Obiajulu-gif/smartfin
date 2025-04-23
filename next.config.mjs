// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		OPENAI_API_KEY: process.env.OPENAI_API_KEY,
		NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
		NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
		NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
		NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
		NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
		NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
		NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
	},
	experimental: {
		// serverActions is now enabled by default, removing this option
	},
	webpack: (config, { isServer }) => {
		if (!isServer) {
			// Don't resolve these modules on the client side
			config.resolve.fallback = {
				"mongodb-client-encryption": false,
				"aws4": false,
				fs: false,
				net: false,
				tls: false,
				child_process: false,
				'fs/promises': false,
			};
		}
		return config;
	}
};

export default nextConfig;
