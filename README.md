[![Build Status](https://travis-ci.org/Yomguithereal/baobab-react.svg)](https://travis-ci.org/Yomguithereal/baobab-react)

# baobab-react

This repository is home to [baobab](https://github.com/Yomguithereal/baobab)'s [React](https://facebook.github.io/react/) integration (from v1.0.0 and onwards).

It aims at implementing a handful of popular React patterns so that you're free to choose the one you want rather than being imposed one by the library.

Currently implemented patterns being: mixins, higher order components, ES7 decorators and wrapper components.

## Summary

* [Installation](#installation)
* [On root & branches](#on-root--branches)
* [Patterns](#patterns)
  * [Mixins](#mixins)
  * [Higher Order Components](#higher-order-components)
  * [Decorators](#decorators)
  * [Wrapper Components](#wrapper-components)
* [General usage](#general-usage)
  * [Cursors mapping](#cursors-mapping)
  * [Facets mapping](#facets-mapping)
  * [Common pitfalls](#common-pitfalls)
* [Contribution](#contribution)
* [License](#license)

## Installation

You can install `baobab-react` through npm:

```
npm install baobab-react
```

Then require the desired pattern and only this one will be loaded (this means that your browserify/webpack bundle, for instance, won't load unnecessary files and end up bloated).

*Example*

```js
var mixins = require('baobab-react/mixins');
```

## On root & branches

In order to keep component definitions detached from any particular instance of Baobab, I divided the mixins, higher order components etc. into two:

* The **Root** aims at passing a baobab tree through context so that child component (branches) may use it. Typically, your app's top-level component will probably be a root.
* The **Branches**, bound to cursors, get their data from the tree given by the root.

This is necessary so that isomorphism can remain an enjoyable stroll in the park (you UI would remain a pure function).

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
        <OtherComponent />
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

```js
import {root, branch} from 'baobab-react/higher-order';
```

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
        <OtherComponent />
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
    cursors: PropTypes.cursors
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

**Warning**: decorators are a work-in-progress [proposition](https://github.com/wycats/javascript-decorators) for ES7 (they are pretty well handed by [babel](https://babeljs.io/) still). You have been warned!

```js
import {root, branch} from 'baobab-react/decorators';
```

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
        <OtherComponent />
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
    cursors: PropTypes.cursors
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

### Wrapper Components

```js
import {Root, Branch} from 'baobab-react/wrappers';
```

#### Root

```js
import React, {Component} from 'react';
import Baobab from 'baobab';
import {Root} from 'baobab-react/wrappers';

var tree = new Baobab({
  name: 'John',
  surname: 'Talbot'
});

class Application extends Component {
  render() {
    return (
      <div>
        <OtherComponent />
      </div>
    );
  }
}

React.render(
  (
    <Root tree={tree}>
      <Application />
    </Root>
  ),
  mountNode
);
```

#### Branch

*Bind a component to cursors*

```js
import React, {Component} from 'react';
import {Branch} from 'baobab-react/wrappers';

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

class SuperiorComponent extends Component {
  render() {
    return (
      <Branch cursors={{
        name: ['name'],
        surname: ['surname']
      }}>
        <MyComponent />
      </Branch>
    );
  }
}
```

*Access the tree or the cursors from the component*

```js
import React, {Component} from 'react';
import {Branch} from 'baobab-react/wrappers';
import PropTypes from 'baobab-react/prop-types';

class MyComponent extends Component {
  static contextTypes = {
    tree: PropTypes.tree,
    cursors: PropTypes.cursors
  };

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

class SuperiorComponent extends Component {
  render() {
    return (
      <Branch cursors={{
        name: ['name'],
        surname: ['surname']
      }}>
        <MyComponent />
      </Branch>
    );
  }
}
```

## General usage

### Cursors mapping

Each of the pattern described above can receive a `cursors` mapping that will associate a key of your state/props to the value of the given cursor.

Considering the following tree:

```js
var tree = new Baobab({
  user: {
    name: 'John'
  },
  palette: {
    colors: ['blue', 'yellow']
  }
});
```

Those mappings can be defined likewise:

**Using paths**

```js
var mapping = {
  cursors: {
    name: ['user', 'name'],
    color: ['palette', 'colors', 1]
  }
};
```

**Using cursors**

```js
var cursor = tree.select('user', 'name');

var mapping = {
  cursors: {
    name: cursor,
    color: ['palette', 'colors', 1]
  }
};
```

**Using a function**

This is very useful when what you need is to build the bound cursors' path from the component's props.

```js
var mapping = function(props, context) {
  return {
    name: props.namePath,
    color: props.colorCursor
  };
};
```

### Facets mapping

Know that you can also bind facets to components if needed.

Considering the following tree:

```js
var tree = new Baobab(
  {
    user: {
      name: 'John',
      surname: 'Talbot'
    },
    fruit: 'banana'
  },
  {
    facets: {
      fullname: {
        cursors: {
          user: ['user']
        },
        get: function(data) {
          return `${data.name} ${data.surname}`;
        }
      }
    }
  }
);
```

**Binding facets**

```js
var mappings = {
  facets: {
    fullname: 'fullname'
  }
};
```

**Binding both cursors and facets**

Note that in case of overlapping keys, cursors will win over facets.

```js
// In this case, 'name' will resolve to the cursor's value.
var mappings = {
  cursors: {
    name: ['user', 'name'],
    surname: ['user', 'surname']
  },
  facets: {
    name: 'fullname'
  }
};
```

### Common pitfalls

**Controlled input state**

If you need to store a react controlled input's state into a baobab tree, remember you have to commit changes synchronously through the `tree.commit` method or else you'll observe nasty cursor jumps in some cases.

```js
var Input = React.createClass({
  mixins: [mixins.branch],
  cursor: ['inputValue'],
  onChange: function(e) {
    var newValue = e.target.value;

    // If one edits the tree normally, i.e. asynchronously, the cursor will hop
    this.cursor.edit(newValue);

    // One has to commit synchronously the update for the input to work correctly
    this.cursor.edit(newValue);
    this.tree.commit();
  },
  render: function() {
    return <input onChange={this.onChange} value={this.state.inputValue} />;
  }
});
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

# Linting
npm run lint

# Building a independent version
npm run build

# or per pattern
npm run build-mixins
npm run build-higher-order
npm run build wrappers
npm run build-decorators
```

## License
MIT
