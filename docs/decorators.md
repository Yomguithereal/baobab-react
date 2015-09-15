# Decorators

**Warning**: decorators are a work-in-progress [proposition](https://github.com/wycats/javascript-decorators) for ES7/ES2016 (they are pretty well handed by [babel](https://babeljs.io/) still). You have been warned!

In this example, we'll build a simplistic React app showing a list of colors to see how one could integrate **Baobab** with React by using decorators.

### Summary

* [Creating the app's state](#creating-the-apps-state)
* [Rooting our top-level component](#rooting-our-top-level-component)
* [Branching our list](#branching-our-list)
* [Actions](#actions)
* [Dynamically set the list's path using props](#dynamically-set-the-lists-path-using-props)
* [Accessing the tree and cursors](#accessing-the-tree-and-cursors)
* [Clever vs. dumb components](#clever-vs-dumb-components)

### Creating the app's state

Let's create a **Baobab** tree to store our colors' list:

*state.js*

```js
import Baobab from 'baobab';

const tree = new Baobab({
  colors: ['yellow', 'blue', 'orange']
});

export default tree;
```

### Rooting our top-level component

Now that the tree is created, we should bind our React app to it by "rooting" our top-level component.

Under the hood, this component will simply propagate the tree to its descendants using React's context so that "branched" component may subscribe to updates of parts of the tree afterwards.

*main.jsx*

```jsx
import React, {Component} from 'react';
import {render} from 'react-dom';
import {root} from 'baobab-react/decorators';
import tree from './state';

// We will write this component later
import List from './list.jsx';

// Let's bind our top-level component to the tree through the `root` decorator
@root(tree)
class App extends Component {
  render() {
    return <List />;
  }
}

// Rendering the app
render(<App />, document.querySelector('#mount'));
```

### Branching our list

Now that we have "rooted" our top-level `App` component, let's create the component displaying our colors' list and branch it to the tree's data.

*list.jsx*

```jsx
import React, {Component} from 'react';
import {branch} from 'baobab-react/decorators';

// Branching the component by mapping the desired data to cursors
@branch({
  cursors: {
    colors: ['colors']
  }
})
export default class List extends Component {
  render() {

    // Thanks to the branch, our colors will be passed as props to the component
    const colors = this.props.colors;

    function renderItem(color) {
      return <li key={color}>{color}</li>;
    }

    return <ul>{colors.map(renderItem)}</ul>;
  }
}
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
export function addColor(tree, color) {
  tree.push('colors', color);
}
```

Now let's add a simple button so that a user may add colors:

*list.jsx*

```jsx
import React, {Component} from 'react';
import {branch} from 'baobab-react/decorators';
import * as actions from './actions';

// Subscribing to the relevant data and binding actions to the component
@branch({
  cursors: {
    colors: ['colors']
  },
  actions: {
    add: actions.addColor
  }
})
export default class List extends Component {
  constructor(props, context) {
    super(props, context);

    // Initial state
    this.state = {inputColor: null};
  }

  // Controlling the input's value
  updateInput(e) {
    this.setState({inputColor: e.target.value})
  }

  // Adding a color on click
  handleClick() {

    // Actions bound to the tree are available through `props.actions`
    this.props.actions.add(this.state.inputColor);

    // Resetting the input
    this.setState({inputColor: null});
  }

  render() {
    const colors = this.props.colors;

    return (
      <div>
        <ul>{colors.map(renderItem)}</ul>
        <input type="text"
               value={this.state.inputColor}
               onUpdate={e => this.updateInput(e)} />
        <button type="button" onClick={() => this.handleClick}>Add</button>
      </div>
    );
  }
}
```

### Dynamically set the list's path using props

Sometimes, you might find yourself needing cursors paths changing along with your component's props.

For instance, given the following state:

*state.js*

```js
import Baobab from 'baobab';

const tree = new Baobab({
  colors: ['yellow', 'blue', 'orange'],
  alternativeColors: ['purple', 'orange', 'black']
});

export default tree;
```

You might want to have a list rendering either one of the colors' lists.

Fortunately, you can do so by passing a function taking both props and context of the components and returning a valid mapping:

*list.jsx*

```jsx
import React, {Component} from 'react';
import {branch} from 'baobab-react/decorators';

// Using a function so that your cursors' path can use the component's props etc.
@branch({
  cursors(props, context) {
    return {
      colors: [props.alternative ? 'alternativeColors', 'colors']
    };
  }
})
export default class List extends Component {
  render() {
    const colors = this.props.colors;

    function renderItem(color) {
      return <li key={color}>{color}</li>;
    }

    return <ul>{colors.map(renderItem)}</ul>;
  }
}
```

### Accessing the tree and cursors

For convenience, and if you want a quicker way to update your tree, you can always access this one through the context or even access the cursors used by the branched component under the hood:

```js
import React, {Component} from 'react';
import PropTypes from 'baobab-react/prop-types';
import {branch} from 'baobab-react/decorators';

@branch({
  cursors: {
    colors: ['colors']
  }
})
export default class List extends Component {
  render() {

    // Accessing the tree
    this.context.tree.get();

    // Using the underlying cursors
    this.context.cursors.colors.get();
  }
}

// To access the tree and cursors through context,
// React obliges you to define `contextTypes`
List.contextTypes = {
  tree: PropTypes.baobab,
  cursors: PropTypes.cursors
};
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
import React, {Component} from 'react';
import {branch} from 'baobab-react/decorators';
import List from './list.jsx';

@branch({
  cursors: {
    colors: ['colors']
  }
})
export default class ListWrapper extends Component {
  render() {
    return <List items={this.props.colors} />;
  }
}
```

*Dumb component*

This component should stay unaware of the tree so it can remain generic and be used elsewhere easily.

```js
import React, {Component} from 'react';

export default class List extends Component {
  render() {

    function renderItem(value) {
      return <li key={value}>{value}</li>;
    }

    return <ul>{this.props.items.map(renderItem)}</ul>;
  }
}
```
