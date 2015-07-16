# Mixins

## Building a simple React app showing a list of colors

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

Now that the tree is created, we should bind our React app to it by "rooting" at top-level component.

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

  // Let bind the component to the tree through
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

### Dynamically set the list's path with props

### Final note

Probably pass as props to the list
Dumb / Clever
