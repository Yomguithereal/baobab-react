[![Build Status](https://travis-ci.org/Yomguithereal/baobab-react.svg)](https://travis-ci.org/Yomguithereal/baobab-react)

# React integration for Baobab

This repository currently serves as a WIP draft for [baobab](https://github.com/Yomguithereal/baobab)'s [React](https://facebook.github.io/react/) integration.

## Principles

*On the different strategies*

I propose here three different integrations strategies so that anyone remains free to use the one which is best suited to his/her style.

They can be required independently and will only load the necessary code to do so.

The strategies are currently the following:

* **Mixins**
* **Higher Order Components**
* **Wrapper Components**

*On root and branches*

So that components remain detached from any baobab particular instance, I divided the mixins, wrapper etc. in two every time. This makes isomorphsism and other things really easier.

* The *Root* aims at passing a baobab tree through the context so that child component (branches) may use it.
* The *Branches* aims at getting their data from the tree they received from the root.

## Strategies

### Mixins

*Root*

The tree should be passed as prop.

```jsx
var React = require('react'),
    Baobab = require('baobab'),
	  mixin = require('baobab-react/mixins').root;

var Application = React.createClass({
	mixins: [mixin],
	render: function() {
		return (
			<div>
				<OtherComponent />
			</div>
		);
	}
});

var tree = new Baobab();

React.render(<Application tree={tree} />, mountNode);
```

### Higher Order Components

### Wrapper Components

## Interrogations

* Passing props as arguments?
