# Mixins

In this example, we'll build a simplistic React app showing a list of colors to see how one could integrate **Baobab** with React by using mixins.

### Summary

* [Creating the app's state](#creating-the-apps-state)
* [Rooting our top-level component](#rooting-our-top-level-component)
* [Branching our list](#branching-our-list)
* [Actions](#actions)
* [Dynamically set the list's path using props](#dynamically-set-the-lists-path-using-props)
* [Accessing the tree](#accessing-the-tree)
* [Clever vs. dumb components](#clever-vs-dumb-components)

### Creating the app's state

Let's create a **Baobab** tree to store our colors' list:

*state.js*

```js
var Baobab = require('baobab');

module.exports = new Baobab({
  colors: ['yellow', 'blue', 'orange']
});
```

### Rooting our top-level component

Now that the tree is created, we should bind our React app to it by "rooting" our top-level component.

Under the hood, this component will simply propagate the tree to its descendants using React's context so that "branched" component may subscribe to updates of parts of the tree afterwards.

*main.jsx*

```jsx
var React = require('react'),
    mixins = require('baobab-react/mixins'),
    tree = require('./state.js'),

    // We will write this component later
    List = require('./list.jsx');

// Creating our top-level component
var App = React.createClass({

  // Let's bind the component to the tree through the `root` mixin
  mixins: [mixins.root],

  render: function() {
    return <List />;
  }
});

// Rendering the app and giving the tree to the `App` component through props
React.render(<App tree={tree} />, document.querySelector('#mount'));
```

### Branching our list

Now that we have "rooted" our top-level `App` component, let's create the component displaying our colors' list and branch it to the tree's data.

*list.jsx*

```jsx
var React = require('react'),
    mixins = require('baobab-react/mixins');

var List = React.createClass({

  // Let's branch the component
  mixins: [mixins.branch],

  // Mapping the paths we want to get from the tree.
  // Associated data will be bound to the component's state
  cursors: {
    colors: ['colors']
  },

  render() {

    // Our colors are now available through the component's state
    var colors = this.state.colors;

    function renderItem(color) {
      return <li key={color}>{color}</li>;
    }

    return <ul>{colors.map(renderItem)}</ul>;
  }
});

module.exports = List;
```

Our app would now render something of the kind:

```html
<div>
  <ul>
    <li>yellow</li>
    <li>blue</li>
    <li>orange</li>
  </ul>
</div>
```

But let's add a color to the list:

```js
tree.push('colors', 'purple');
```

And the list component will automatically update and to render the following:

```html
<div>
  <ul>
    <li>yellow</li>
    <li>blue</li>
    <li>orange</li>
    <li>purple</li>
  </ul>
</div>
```

Now you just need to add an action layer on top of that so that app's state can be updated and you've got yourself an atomic Flux!

### Actions

Here is what we are trying to achieve:

```
                                 ┌────────────────────┐
                   ┌──────────── │    Central State   │ ◀───────────┐
                   │             │    (Baobab tree)   │             │
                   │             └────────────────────┘             │
                Renders                                          Updates
                   │                                                │
                   │                                                │
                   ▼                                                │
        ┌────────────────────┐                           ┌────────────────────┐
        │        View        │                           │       Actions      │
        │ (React Components) │  ────────Triggers───────▶ │     (Functions)    │
        └────────────────────┘                           └────────────────────┘
```

For the time being we only have a central state stored by a Baobab tree and a view layer composed of React components.

What remains to be added is a way for the user to trigger actions and update the central state.

To do so `baobab-react` proposes to create simple functions as actions:

*actions.js*

```js
exports.addColor = function(tree, color) {
  tree.push('colors', color);
};
```

Now let's add a simple button so that a user may add colors:

*list.jsx*

```jsx
var React = require('react'),
    mixins = require('baobab-react/mixins'),
    actions = require('./actions.js');

var List = React.createClass({
  mixins: [mixins.branch],

  cursors: {
    colors: ['colors']
  },

  getInitialState: function() {
    return {inputColor: null};
  }

  // Controlling the input's value
  updateInput(e) {
    this.setState({inputColor: e.target.value});
  },

  // Adding a color on click
  handleClick() {

    // Let's dispatch our action
    this.dispatch(actions.addColor, this.state.inputColor);

    // Resetting the input
    this.setState({inputColor: null});
  }

  render() {
    var colors = this.state.colors;

    function renderItem(color) {
      return <li key={color}>{color}</li>;
    }

    return (
      <div>
        <ul>{colors.map(renderItem)}</ul>
        <input type="text"
               value={this.state.inputColor}
               onUpdate={this.updateInput} />
        <button type="button" onClick={this.handleClick}>Add</button>
      </div>
    );
  }
});

module.exports = List;
```

### Dynamically set the list's path using props

Sometimes, you might find yourself needing cursors paths changing along with your component's props.

For instance, given the following state:

*state.js*

```js
var Baobab = require('baobab');

module.exports = new Baobab({
  colors: ['yellow', 'blue', 'orange'],
  alternativeColors: ['purple', 'orange', 'black']
});
```

You might want to have a list rendering either one of the colors' lists.

Fortunately, you can do so by passing a function taking both props and context of the components and returning a valid mapping:

*list.jsx*

```jsx
var React = require('react'),
    mixins = require('baobab-react/mixins');

var List = React.createClass({
  mixins: [mixins.branch],

  // Using a function so that your cursors' path can use the component's props etc.
  cursors: function(props, context) {
    return {
      colors: [props.alternative ? 'alternativeColors' : 'colors']
    };
  },

  render() {
    var colors = this.state.colors;

    function renderItem(color) {
      return <li key={color}>{color}</li>;
    }

    return <ul>{colors.map(renderItem)}</ul>;
  }
});

module.exports = List;
```

### Accessing the tree and cursors

For convenience, and if you want a quicker way to update your tree, you can always access this one through the context:

```js
var React = require('react'),
    mixins = require('baobab-react/mixins');

var List = React.createClass({
  mixins: [mixins.branch],
  cursors: {
    colors: ['colors']
  },
  render: function() {

    // Accessing the tree
    this.context.tree.get();
  }
});
```

### Clever vs. dumb components

Now you know everything to use a Baobab tree efficiently with React.

However, the example app shown above is minimalist and should probably not be organized thusly in a real-life scenario.

Indeed, whenever possible, one should try to separate "clever" components, that know about the tree's existence from "dumb" components, completely oblivious of it.

Knowing when to branch/wrap a component and let some components ignore the existence of the tree is the key to a maintainable and scalable application.

**Example**

*Clever component*

This component does know that a tree provides him with data.

```js
var React = require('react'),
    mixins = require('baobab-react/mixins'),
    List = require('./list.jsx');

var ListWrapper = React.createClass({
  mixins: [mixins.branch],
  cursors: {
    colors: ['colors']
  }
  render: function() {
    return <List items={this.state.colors} />;
  }
});
```

*Dumb component*

This component should stay unaware of the tree so it can remain generic and be used elsewhere easily.

```js
var React = require('react');

var List = React.createClass({
  render() {

    function renderItem(value) {
      return <li key={value}>{value}</li>;
    }

    return <ul>{this.props.items.map(renderItem)}</ul>;
  }
});
```
