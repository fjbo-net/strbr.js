# strbr.js

A JavaScript Animation Frame controller that makes easy to queue, execute, manage and remove different functions for effects or animation to the window.requestAnimationFrame() method. Just like HTML 5 Canvas renderings.

## I don't get it

Using event handlers like Obj.addEventListener('whateverEvent', awesomeness); $(...).on('whateverEvent', awesomeness), intervals or timeouts are not as cool as they used to be. Just because of performance, nothing personal. Instead, it is highly recommended to use the window.requestAnimationFrame() method to let the browser execute your effects/animations whenever it is more convenient (and avoid executing your callback like 300 different times per event).

Because the ultimate goal is a better-performing web and make life easier, strbr.js lets you spice-up your projects without a lot of struggle to keep things on the loop. strbr.js is an object that contains and manages your functions to avoid redundancy and unnecessary function execution.

## Ahh, I see

Pretty glad you do! Your users will appreciate it.

If you want to learn more about the requestAnimationFrame() method, check out Mozilla's documentation: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame

# Features

* Object-oriented
* API-style model
* Single instance
* Event Filtering

# How to use it

Using strbr.js is easy: Include. Queue. Manage.

## Include

Add `<script src="strbr.js"></script>` to your document's <head> tag like:

```html
<!doctype html>
<html>
	<head>
		<title>Page Title Here</title>
		<!-- strbr.js -->
		<script src="strbr.js"></script>
		<!-- Your Cool script -->
		<script src="awesome.js"></script>
	</head>
	<body>
	</body>
	<!-- even more awesome stuff -->
	<script src="super-awesome.js"></script>
</html>
```

 *NOTE:* Must be included before any script that strbr.js is a dependency of.

## Queue

To add functions to the strbr object just use `strbr.add('id', function, 'event');`. The add method accepts the following parameters:
* **id** - string - (required) A string containing the function unique identifier. It can be the function name, a nickname, a lame 'function#'. It's all up to you.
* **function** - function - (required) Function to be executed. Can be an anonymous function or the function object.
* **event** - string - (optional) Name of the event that should trigger your function. It only executes when that event has been detected. Supported values: 'scroll', 'resize'.

## Manage

Sometimes you just get enough of something. Strbr.js allows you to remove functions from the execution queue or pause execution of "Event Queues" or functions individually.

### Removing

To remove functions from the strbr object just use `strbr.remove(id, event);`. The remove method accepts the following parameters.
* **id** - string - (required) A string containing the function unique identifier. It can be the function name, a nickname, a lame 'function#'. It's all up to you.
* **event** - string - (optional) Name of the event that should trigger your function. It only executes when that event has been detected. Supported values: 'scroll', 'resize'.
