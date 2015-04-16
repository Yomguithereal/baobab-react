[![Build Status](https://travis-ci.org/Yomguithereal/baobab-react.svg)](https://travis-ci.org/Yomguithereal/baobab-react)

# React integration for Baobab

This repository currently serves as a WIP draft for [baobab](https://github.com/Yomguithereal/baobab)'s [React](https://facebook.github.io/react/) integration.

## Principles

### On the different strategies

I propose here three different integration strategies so that anyone remains free to use the one which is best suited to his/her style.

Each of the strategies can be independently required and will only load the necessary code to do so.

The strategies are currently the following:

* **Mixins**
* **Higher Order Components**
* **Wrapper Components**

### On root and branches

So that components remain detached from any baobab particular instance, I divided the mixins, wrapper etc. in two. This makes isomorphsism and other things really easier.

* The **Root** aims at passing a baobab tree through the context so that child component (branches) may use it.
* The **Branches** aims at getting their data from the tree they received from the root.

## Strategies

### Mixins

#### Root

```jsx
var React = require('react'),
    Baobab = require('baobab'),
    mixin = require('baobab-react/mixins').root;

var Application = React.createClass({
  mixins: [mixin],
  render: function() {
    return (
      <div>
        <OtherComponents />
      </div>
    );
  }
});

var tree = new Baobab({
  name: 'John',
  surname: 'Talbot'
});

// Passing the tree as prop
React.render(<Application tree={tree} />, mountNode);
```

#### Branch

```jsx
var React = require('react'),
    mixin = require('baobab-react/mixins').branch;

var Component = React.createClass({
  mixins: [mixin],
  cursors: {
    name: ['name'],
    surname: ['surname']
  },
  render: function() {

    // Data is mapped to component's state
    return (
      <span>
        Hello {this.state.name} {this.state.surname}!
      </span>
    );
  }
});
```

### Higher Order Components

#### Root

```jsx
import React from 'react';
import Baobab from 'baobab';
import {Root} from 'baobab-react/higher-order';

class RootComponent extends React.Component{
  render() {
    return (
      <div>
        <OtherComponents />
      </div>
    );
  }
}

var tree = new Baobab({
  name: 'John',
  surname: 'Talbot'
});

var Application = Root(RootComponent, tree);
```

#### Branch

```jsx
import React from 'react';
import {Branch} from 'baobab-react/higher-order';

class BranchComponent extends React.Component{
  render() {

    // Data is mapped to component's state
    return (
      <span>
        Hello {this.state.name} {this.state.surname}!
      </span>
    );
  }
}

var Component = Branch(BranchComponent, {
  cursors: {
    name: ['name'],
    surname: ['surname']
  }
})
```

### Wrapper Components

#### Root

```jsx
import React = from 'react';
import Baobab from 'baobab';
import {Root} from 'baobab-react/wrapper';

var tree = new Baobab({
  name: 'John',
  surname: 'Talbot'
});

class Application extends React.Component {
  render() {
    return (
      <Root tree={tree}>
        <OtherComponent />
      </Root>
    );
  }
}
```

#### Branch

```jsx
import React from 'react';
import {Branch} from 'baobab-react/wrapper';

class Hello extends React.Component {
  render() {
    return (
      <span>
        Hello {this.props.name} {this.props.surname}!
      </span>
    );
  }
}

class Component extends React.Component {
  render() {
    var mapping = {
      name: ['name'],
      surname: ['surname']
    };

    return (
      <Branch cursors={mapping}>
        <Hello />
      </Branch>
    );
  }
}
```

## Interrogations

* Should cursors' data passed as state or props?
* The function polymorphism of the cursor mapping should work on `this.props` or work on `props` passed as argument?
* The tree is accessible through context as well as the cursors (but in HOC and wrappers, the user will have to explictly define contextPropTypes and this is tedious).
