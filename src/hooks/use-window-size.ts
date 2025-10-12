import { useCallback, useEffect, useState } from "react";

/**
 * Custom React hook to track the current dimensions of the window.
 *
 * It uses a debounce-like mechanism (via requestAnimationFrame) to ensure smooth
 * performance and prevent excessive state updates during rapid resizing.
 *
 * @returns {{width: number | undefined, height: number | undefined}} The current window size.
 */
export default function useWindowSize(): { width: number | undefined; height: number | undefined; isMobile: boolean} {
	// Initialize state with undefined so server-side rendering doesn't throw errors
	// (window object is only available client-side).
	const [windowSize, setWindowSize] = useState<{width: undefined|number; height: undefined|number; isMobile: boolean}>({
		width: undefined,
		height: undefined,
		isMobile: true,
	});

	// This function is memoized using useCallback
	const handleResize = useCallback(() => {
		// Use requestAnimationFrame to defer the state update to the browser's
		// next repaint cycle, improving performance during continuous resizing.
		let rAF;

		// Clear any pending frame before setting a new one
		if (rAF) {
			cancelAnimationFrame(rAF);
		}

		// noinspection JSUnusedAssignment
		rAF = requestAnimationFrame(() => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
				isMobile: window.innerWidth <= 1100
			});
		});
	}, []);

	useEffect(() => {
		// Only proceed if 'window' is defined (client-side environment)
		// if (typeof window === 'undefined') {
		// 	return;
		// }

		// Set initial size immediately on mount
		handleResize();

		// Add event listener
		window.addEventListener('resize', handleResize);

		// Cleanup function: Remove event listener on component unmount
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [handleResize]); // Re-run effect if handleResize changes (which it won't due to useCallback)

	return windowSize;
}