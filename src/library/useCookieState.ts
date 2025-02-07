"use client";
import { useState, useCallback, useEffect } from "react";
import Cookies from "js-cookie";

// Polyfilled cookieStore wrappers.
async function getCookie(cookieName: string): Promise<string | null> {
	if ("cookieStore" in window) {
		return (await cookieStore.get(cookieName))?.value ?? null;
	}

	return Cookies.get(cookieName) ?? null;
}

async function setCookie(cookieName: string, value: string): Promise<void> {
	if ("cookieStore" in window) {
		return cookieStore.set(cookieName, value);
	}

	Cookies.set(cookieName, value);
}

async function deleteCookie(cookie: string): Promise<void> {
	if ("cookieStore" in window) {
		return cookieStore.delete(cookie);
	}

	Cookies.remove(cookie);
}

export function listenForCookieChange(
	cookieName: string,
	onChange: (newValue: string | null) => void,
	pollingRate = 1000,
): () => void {
	// If the cookieStore is available, we can can use the change event listener
	if ("cookieStore" in window) {
		const changeListener = (event: CookieChangedEvent) => {
			const foundCookie = event.changed.find(
				(cookie) => cookie.name === cookieName,
			);
			if (foundCookie) {
				onChange(foundCookie.value);
				return;
			}

			const deletedCookie = event.deleted.find(
				(cookie) => cookie.name === cookieName,
			);
			if (deletedCookie) {
				onChange(null);
			}
		};

		cookieStore.addEventListener("change", changeListener);

		// We return a clean up function for the effect
		return () => {
			cookieStore.removeEventListener("change", changeListener);
		};
	}

	// If cookieStore is not available, we poll for changes.
	const interval = setInterval(() => {
		const cookie = Cookies.get(cookieName);
		if (cookie) {
			onChange(cookie);
		} else {
			onChange(null);
		}
	}, pollingRate);

	// We still return a clean up function for the effect
	return () => {
		clearInterval(interval);
	};
}

type UseCookieStateOptions = {
	/**
	 *	If cookieStore is not supported then the hook falls back to a polling solution at this timing
	 	@default 1000
	 */
	polyfillPollRateMs?: number;
};

type UseCookieReturn = [
	/**
	 * Value of the cookie - or null if it does not exist
	 */
	string | null,
	/**
	 * Function to update the cookie value
	 */
	(newValue: string) => void, // Function to update the cookie
	/**
	 * Function to delete the cookie
	 */
	() => void, // Function to delete the cookie
];

/**
 *
 * @param name
 * @param defaultValue
 * @param options
 * @returns
 */
export default function useCookieState(
	name: string,
	defaultValue: string | null,
	options?: UseCookieStateOptions,
): UseCookieReturn {
	// For first render, we use the default value
	// This for SSR purposes - SSR will not have cookies and we don't want a hydration error
	// Of course this gives you a flash of the default value
	// It will be up to you to handle this - perhaps you want to display nothing until the cookie is loaded
	const [value, setValue] = useState<string | null>(defaultValue);

	useEffect(() => {
		// The initial value of the cookie on the client, if it exists
		getCookie(name).then((cookie) => {
			setValue(cookie);
		});

		// Any subsequent changes to the cookie will be listened to
		// and set into state
		return listenForCookieChange(
			name,
			(newValue) => {
				setValue(newValue);
			},
			options?.polyfillPollRateMs,
		);
	}, [name, options?.polyfillPollRateMs]);

	// For updates to the cookie we just update the cookie store directly,
	// And allow the event listener to update the state
	const updateCookie = useCallback(
		(newValue: string) => {
			setCookie(name, newValue);
		},
		[name],
	);

	const _deleteCookie = useCallback(() => {
		deleteCookie(name);
	}, [name]);

	return [value, updateCookie, _deleteCookie];
}
