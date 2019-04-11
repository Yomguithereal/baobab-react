# Hooks

In this example, we'll build a simplistic React app showing a list of colors to see how one could integrate **Baobab** with React by using hooks.

### Summary

* [Hooks](#hooks)
* [Summary](#summary)
* [Creating the app's state](#creating-the-apps-state)
* [Rooting our top-level component](#rooting-our-top-level-component)
* [Branching our list](#branching-our-list)
* [Actions](#actions)
* [Dynamically set the list's path using props](#dynamically-set-the-lists-path-using-props)
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

Under the hood, this component will simply propagate the tree to its descendants using React's [Context](https://reactjs.org/docs/context.html) so that "branched" component may subscribe to updates of parts of the tree afterwards.

*main.jsx*

```jsx
import React, {Component} from 'react';
import {render} from 'react-dom';
import {useRoot} from 'baobab-react/hooks';
import tree from './state';

// We will write this component later
import List from './list.jsx';

// Creating our top-level component
const App = function({store}) {
  // useRoot takes the baobab tree and provides a component bound to the tree
  const Root = useRoot(store);
  return (
    <Root>
      <List />
    <Root>
  );
}

// Rendering the app
render(<App store={tree} />, document.querySelector('#mount'));
```

### Branching our list

Now that we have "rooted" our top-level `App` component, let's create the component displaying our colors' list and branch it to the tree's data.

*list.jsx*

```jsx
import React, {Component} from 'react';
import {useBranch} from 'baobab-react/hooks';

const List = function() {
  // branch by mapping the desired data to cursors
  const {colors} = useBranch({
    colors: ['colors']
  });

  function renderItem(color) {
    return <li key={color}>{color}</li>;
  }

  return <ul>{colors.map(renderItem)}</ul>;
}

export default List;
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
import React, {useState} from 'react';
import {useBranch} from 'baobab-react/hooks';
import * as actions from './actions';

const List = function() {
  const [inputColor, setColor] = useState(null);
  // Subscribing to the relevant data in the tree
  const {colors, dispatch} = useBranch({
    colors: ['colors']
  });

  // Adding a color on click
  const handleClick = () => {
    // A dispatcher is available through `props.dispatch`
    dispatch(
      actions.addColor,
      inputColor
    );

    // Resetting the input
    setColor(null);
  };

  return (
    <div>
      <ul>{colors.map(renderItem)}</ul>
      <input type="text"
             value={this.state.inputColor}
             onUpdate={e => setColor(e.target.value)} />
      <button type="button" onClick={() => this.handleClick}>Add</button>
    </div>
  );
};

export default List;
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
import {useBranch} from 'baobab-react/hooks';

const List = function(props) {
  // Using a function so that your cursors' path can use the component's props etc.
  const {colors} = useBranch({
    colors: [props.alternative ? 'alternativeColors' : 'colors']
  });

  function renderItem(color) {
    return <li key={color}>{color}</li>;
  }

  return <ul>{colors.map(renderItem)}</ul>;
}

export default List;
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
import {useBranch} from 'baobab-react/hooks';
import List from './list.jsx';

class ListWrapper extends Component {
  const {colors} = useBranch({
    colors: ['colors']
  });
  return <List items={this.props.colors} />;
}

export default ListWrapper;
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