import React from  "react";
import { useCookieState } from "./useCookieState";
import { describe, it, expect,beforeEach} from "vitest";
import { render } from "vitest-browser-react";
import Cookies from "js-cookie";

const TEST_COOKIE_NAME ="TEST-COOKIE-NAME";

function TestComponent() {
	const [value, setValue, deleteValue] = useCookieState(
		TEST_COOKIE_NAME,
		"i-am-default-value",
		{
			polyfillPollRateMs:5
		}
	);

    return <div>
		<p>{value}</p>
		<button type="button" onClick={() => setValue("the-new-value")}>Update</button>
		<button type="button" onClick={() => deleteValue()}>Delete</button>
    </div>
}



describe(useCookieState, () => {


	beforeEach(() => {

		// We use the js-cookies polyfill to access the cookies, so that it'll work for non-supported browsers
		Cookies.remove(TEST_COOKIE_NAME);
		
	});
	it("Will show existing cookies", async () => {
		const screen = render(<TestComponent/>); 
		await expect.element(screen.getByText("i-am-default-value")).toBeVisible();
	});

	it("Will update cookies via the updating function", async () => {
		const screen = render(<TestComponent/>); 
		await expect.element(screen.getByText("i-am-default-value")).toBeVisible();

		await screen.getByRole('button', { name: 'Update' }).click()
		await expect.element(screen.getByText("the-new-value")).toBeVisible();

		expect(Cookies.get(TEST_COOKIE_NAME)).toEqual("the-new-value")

	});

	it("Will delete cookies via the deleting function", async () => {
		const screen = render(<TestComponent/>); 
		await expect.element(screen.getByText("i-am-default-value")).toBeVisible();

		await screen.getByRole('button', { name: 'Update' }).click()
		await expect.element(screen.getByText("the-new-value")).toBeVisible();
		expect(Cookies.get(TEST_COOKIE_NAME)).toEqual("the-new-value")

		await screen.getByRole('button', { name: 'Delete' }).click()
		await expect.element(screen.getByText("i-am-default-value")).toBeVisible();

		expect(Cookies.get(TEST_COOKIE_NAME)).toEqual(undefined)
	});

	it("Will respond to externally triggered cookie change events", async() => {
		const screen = render(<TestComponent/>); 
		await expect.element(screen.getByText("i-am-default-value")).toBeVisible();

		Cookies.set(TEST_COOKIE_NAME, "hello-world");
		await expect.element(screen.getByText("hello-world")).toBeVisible();


	});
});
