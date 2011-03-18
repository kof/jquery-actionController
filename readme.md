## About

Idea is to separate css classes/ids and event handlers, because ids and classes are used for styling in css and using it in javascript code too cause to tripple dependency between css, html and javascript.
This becomes to be hard to maintain, especially if you let designers to do css.
To resolve it actionController uses "data-action" html attribute (it can be configured to any other).

## API

It is a jquery plugin:

	$('selector').actionController(options);

Default options:

	{
        controller: undefined,
        events: "click", // jquerys space separated events list
        context: "element", // object || "element"
        actionAttr: "data-action",
        paramsAttr: "data-params",
        actionPrefix: "",
        defaultAction: "action", // name of the default action property in contorller
        disabled: false     
    }

`controller` is an object, where property name contains action name and event name camelcased, e.g.: "myActionClick".

### Handler arguments
 - first argument is jquery event object
 - all other arguments are strings from "data-params" attribute (can be configured)
   - data-params are comma separated list: data-params="param1, param2 ..."

### default action
Default action can be used to prevent execution of other handlers. Default action property name contains defaultAction from options + event name, e.g.: "actionClick".

Example
	<div id="#container">
		<button data-action="myAction" type="button">my action</button>	
		<button data-action="myAction2" data-params="fui, boo" type="button">my action 2</button>	
		<input data-action="age" type="text"/>	
	</div>
	
	
	var actions = {
		actionClick: function() {
			alert('any button clicked and I can prevent other handlers');
		},
		
		myActionClick: function(e) {
			alert('my action button clicked');
		},
		
		myAction2Click: function(e, param1, param2) {
			alert('my action 2 button clicked and param1 is:'  + param1 + 'param2 is: ' + param2);
		},

		ageKeypress: function(e) {
			alert('key pressed on input');
		}	
	};
	
	$('#container').actionController({
		controller: actions,
		events: 'click keypress'
	});
	
### $('selector').actionController('disable');

Disable actionController event handlers.

### $('selector').actionController('enable');

Enable actionController event handlers.
	
### $('selector').actionController('destroy');

Destroy actionController event handlers.