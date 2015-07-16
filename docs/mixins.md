# Mixins

In this example, we'll build a simplistic React app showing a list of colors to see how you would integrate **Baobab** with React by using mixins.

### Creating the app's state

Let's create a **Baobab** tree to store our colors' list:

```js
/* state.js */
var Baobab = require('baobab');

module.exports = new Baobab({
  colors: ['yellow', 'blue', 'orange']
});
```

### Rooting our top-level component

Now that the tree is created, we should bind our React app to it by "rooting" our top-level component.

Under the hood, this component will simply propagate the tree to its descendants through context so that "branched" component may use data from the tree.

```jsx
/* main.jsx */
var React = require('react'),
    mixins = require('baobab-react/mixins'),
    tree = require('./state.js'),

    // We will write this component later
    List = require('./list.jsx');

// Creating our top-level component
var App = React.createClass({

  // Let's bind the component to the tree through
  // the `root` mixin
  mixins: [mixins.root],

  render: function() {
    return (
      <div>
        <List />
      </div>
    );
  }
});

// Rendering the app and giving the tree to the
// Application component through props
React.render(<Application tree={tree} />, document.querySelector('#mount'));
```

### Branching our list

Now that we have "rooted" our top-level `Application` component, let's create the component displaying our colors' list and branch it to the tree's data.

```jsx
/* list.jsx */
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

    // Our colors are now lying within the component's state
    var colors = this.state.colors;

    function renderItem(color) {
      return <li>{color}</li>;
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

And the list component will automatically update and we'll render the following:

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

### Dynamically set the list's path with props

### Final note

Atomic flux
Probably pass as props to the list
Dumb / Clever
