[![Build Status](https://travis-ci.org/Yomguithereal/baobab-react.svg)](https://travis-ci.org/Yomguithereal/baobab-react)

# baobab-react

This repository holds [baobab](https://github.com/Yomguithereal/baobab)'s [React](https://facebook.github.io/react/) integration.

It aims at implementing a handful of popular React patterns so that anyone remain free to choose the one he wants rather than being imposed one by the library.

Current implemented patterns being:

* [Mixins](#mixins)
* [Higher Order Components](#higher-order-components)
* [Decorators](#decorators)

## Installation

You can install `baobab-react` through npm:

```
npm install baobab-react

# Or for the latest dev version
npm install git+https://github.com/Yomguithereal/baobab-react.git
```

Then require the desired pattern and only this one will be loaded (meaning that you browserify/webpack bundle, for instance, won't load unnecessary files and end up bloated).

*Example*

```js
var mixins = require('baobab-react/mixins');
```

## On root & branches

In order to keep component definitions detaches from any particular instance of Baobab, tI divided each time the mixins, higher order components etc. into two:

* The **Root** aims at passing a baobab tree through the context so that child component (branches) may use it. Typically, you'll need to make a root of your app's top level component.
* The **Branches** get their data from the tree they received from the root.

This is necessary so that isomorphism can remain a friendly stroll in the park.

## Patterns

### Mixins

```js
var mixins = require('baobab-react/mixins');
```

#### Root

With mixins, you need to pass your tree through props.

```js
var React = require('react'),
    Baobab = require('baobab'),
    mixin = require('baobab-react/mixins').root;

var tree = new Baobab({
  name: 'John',
  surname: 'Talbot'
});

var Application = React.createClass({
  mixins: [mixin],
  render: function() {
    return (
      <div>
        <OtheComponent />
      </div>
    );
  }
});

React.render(<Application tree={tree} />, mountNode);
```

#### Branch

*Binding a component to cursors*

```js
var React = require('react'),
    mixin = require('baobab-react/mixins').branch;

var MyComponent = React.createClass({
  mixins: [mixin],
  cursors: {
    name: ['name'],
    surname: ['surname']
  },
  render: function() {

    // Cursor data is passed through state
    return (
      <span>
        Hello {this.state.name} {this.state.surname}
      </span>
    );
  }
});
```

*Using props to define cursor path*

```js
var React = require('react'),
    mixin = require('baobab-react/mixins').branch;

var MyComponent = React.createClass({
  mixins: [mixin],
  cursors: function() {
    return {
      name: [this.props.namePath],
      surname: ['surname']
    };
  },
  render: function() {

    // Cursor data is passed through state
    return (
      <span>
        Hello {this.state.name} {this.state.surname}
      </span>
    );
  }
});
```

*Accessing the tree or the cursors from the component*

```js
var React = require('react'),
    mixin = require('baobab-react/mixins').branch;

var MyComponent = React.createClass({
  mixins: [mixin],
  cursors: {
    name: ['name'],
    surname: ['surname']
  },
  handleClick: function() {

    // Tree available through the context
    this.context.tree.emit('customEvent');

    // I am not saying this is what you should do but
    // anyway, if you need to access cursors:
    this.cursors.name.set('Jack');
  },
  render: function() {

    // Cursor data is passed through state
    return (
      <span onClick={this.handleClick}>
        Hello {this.state.name} {this.state.surname}
      </span>
    );
  }
});
```

### Higher Order Components

#### Root

```js
import React, {Component} from 'react';
import Baobab from 'baobab';
import {root} from 'baobab-react/higher-order';

var tree = new Baobab({
  name: 'John',
  surname: 'Talbot'
});

class Application extends Component {
  render() {
    return (
      <div>
        <OtheComponent />
      </div>
    );
  }
}

var ComposedComponent = root(Application, tree);

React.render(<ComposedComponent />, mountNode);
```

#### Branch

*Bind a component to cursors*

```js
import React, {Component} from 'react';
import {branch} from 'baobab-react/higher-order';

class MyComponent extends Component {
  render() {

    // Cursor data is passed through props
    return (
      <span>
        Hello {this.props.name} {this.props.surname}
      </span>
    );
  }
}

export default branch(MyComponent, {
  cursors: {
    name: ['name'],
    surname: ['surname']
  }
});
```

*Using props to define cursor path*

```js
import React, {Component} from 'react';
import {branch} from 'baobab-react/higher-order';

class MyComponent extends Component {
  render() {

    // Cursor data is passed through props
    return (
      <span>
        Hello {this.props.name} {this.props.surname}
      </span>
    );
  }
}

export default branch(MyComponent, {
  cursors: function() {
    return {
      name: this.props.namePath,
      surname: ['surname']
    };
  }
});
```

*Access the tree or the cursors from the component*

You can access the tree or the cursors from the context. However, you'll have to define `contextTypes` for your component if you want to be able to do so.

Some handy prop types wait for you in `baobab-react/prop-types` if you need them.

```js
import React, {Component} from 'react';
import {branch} from 'baobab-react/higher-order';
import PropTypes from 'baobab-react/prop-types';

class MyComponent extends Component {
  static contextTypes = {
    tree: PropTypes.baobab,
    cursors: PropTypes.cursor
  }

  handleClick() {

    // Tree available through the context
    this.context.tree.emit('customEvent');

    // I am not saying this is what you should do but
    // anyway, if you need to access cursors:
    this.context.cursors.name.set('Jack');
  }

  render() {

    // Cursor data is passed through props
    return (
      <span onClick={this.handleClick}>
        Hello {this.props.name} {this.props.surname}
      </span>
    );
  }
}

export default branch(MyComponent, {
  cursors: {
    name: ['name'],
    surname: ['surname']
  }
});
```

### Decorators

**Warning**: decorators are a work-in-progress [proposition](https://github.com/wycats/javascript-decorators) for ES7 (they are pretty well handed by [Babel](https://babeljs.io/)). You have been warned!

#### Root

```js
import React, {Component} from 'react';
import Baobab from 'baobab';
import {root} from 'baobab-react/decorators';

var tree = new Baobab({
  name: 'John',
  surname: 'Talbot'
});

@root(tree)
class Application extends Component {
  render() {
    return (
      <div>
        <OtheComponent />
      </div>
    );
  }
}

React.render(<Application />, mountNode);
```

#### Branch

*Bind a component to cursors*

```js
import React, {Component} from 'react';
import {branch} from 'baobab-react/decorators';

@branch({
  cursors: {
    name: ['name'],
    surname: ['surname']
  }
})
class MyComponent extends Component {
  render() {

    // Cursor data is passed through props
    return (
      <span>
        Hello {this.props.name} {this.props.surname}
      </span>
    );
  }
}
```

*Using props to define cursor path*

```js
import React, {Component} from 'react';
import {branch} from 'baobab-react/decorators';

@branch({
  cursors: function() {
    return {
      name: this.props.namePath,
      surname: ['surname']
    };
  }
})
class MyComponent extends Component {
  render() {

    // Cursor data is passed through props
    return (
      <span>
        Hello {this.props.name} {this.props.surname}
      </span>
    );
  }
}
```

*Access the tree or the cursors from the component*

You can access the tree or the cursors from the context. However, you'll have to define `contextTypes` for your component if you want to be able to do so.

Some handy prop types wait for you in `baobab-react/prop-types` if you need them.

```js
import React, {Component} from 'react';
import {branch} from 'baobab-react/decorators';
import PropTypes from 'baobab-react/prop-types';

@branch({
  cursors: {
    name: ['name'],
    surname: ['surname']
  }
})
class MyComponent extends Component {
  static contextTypes = {
    tree: PropTypes.baobab,
    cursors: PropTypes.cursor
  }

  handleClick() {

    // Tree available through the context
    this.context.tree.emit('customEvent');

    // I am not saying this is what you should do but
    // anyway, if you need to access cursors:
    this.context.cursors.name.set('Jack');
  }

  render() {

    // Cursor data is passed through props
    return (
      <span onClick={this.handleClick}>
        Hello {this.props.name} {this.props.surname}
      </span>
    );
  }
}
```

## Contribution

Contributions are obviously welcome.

Be sure to add unit tests if relevant and pass them all before submitting your pull request.

Don't forget, also, to build the files before committing.

```bash
# Installing the dev environment
git clone git@github.com:Yomguithereal/baobab-react.git
cd baobab-react
npm install

# Running the tests
npm test

# Linting, building
npm run lint
npm run dist
```

## License
MIT
