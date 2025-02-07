# @blacksheepcode/use-cookie-state


A `useState` like hook to use the values of cookies. 

This hook is responsive to any changes made to the cookie outside of the React context (eg. as a result of new server response). 

The hook uses the [CookieStore API](https://developer.mozilla.org/en-US/docs/Web/API/CookieStore) and includes a polling fallback for browsers that do not support it. 

## Usage 

**Basic usage**

```js
const [value, setValue, deleteValue] = useCookieState("the-cookie-name", "default-value"); 
```


**Configuring the polling fallback rate**

The default rate is 250ms - you can change this with the option parameter.

```
const [value, setValue, deleteValue] = useCookieState("the-cookie-name", "default-value", {
    polyfillPollRateMs:50
}); 

```


## Testing 

For real browser testing, you can interact with browser cookies directly.  Suggest using [js-cookie](https://www.npmjs.com/package/js-cookie/v/2.2.1) as some browsers do not support the more convenient CookieStore API. 


```jsx
		const screen = render(<TestComponent/>); 
		await expect.element(screen.getByText("i-am-default-value")).toBeVisible();

		await screen.getByRole('button', { name: 'Update' }).click()
		await expect.element(screen.getByText("the-new-value")).toBeVisible();
		expect(Cookies.get(TEST_COOKIE_NAME)).toEqual("the-new-value") // 👈 Assertions on cookie state

		Cookies.set(TEST_COOKIE_NAME, "hello-world"); // 👈 Changing cookie state
		await expect.element(screen.getByText("hello-world")).toBeVisible(); // 👈 Assertions on page state based on cookie state
```

