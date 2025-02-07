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

For both real browser and JSDOM-based testing, you can interact with browser cookies directly.  Suggest using [js-cookie](https://www.npmjs.com/package/js-cookie/v/2.2.1) as some browsers do not support the more convenient CookieStore API. 


```jsx
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

test('Is responsive to cookie changes', async () => {
  render(<TestComponent />);
  const textElement = screen.getByText('i-am-default-value');
  expect(textElement).toBeInTheDocument();
  Cookies.set(TEST_COOKIE_NAME, "foo-bar");
  expect(await screen.findByText("foo-bar")).toBeInTheDocument();
});
```

