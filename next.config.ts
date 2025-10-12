import type { NextConfig } from "next";
const nextConfig: NextConfig = {
	images: {
		unoptimized: true
	},

	experimental: {
		optimizePackageImports: [
			'@fortawesome/fontawesome-svg-core',
			'@fortawesome/free-brands-svg-icons',
			'@fortawesome/free-regular-svg-icons',
			'@fortawesome/free-solid-svg-icons',
			'@fortawesome/react-fontawesome'
		],
	},
	/* config options here */
};

export default nextConfig

