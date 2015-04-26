[![Build Status](https://travis-ci.org/Yomguithereal/baobab-react.svg)](https://travis-ci.org/Yomguithereal/baobab-react)

# baobab-react

This repository is home to [baobab](https://github.com/Yomguithereal/baobab)'s [React](https://facebook.github.io/react/) integration (from v1.0.0 and onwards).

It aims at implementing a handful of popular React patterns so that anyone remain free to choose the one he wants rather than being imposed one by the library.

Currently implemented patterns being: mixins, higher order components, ES7 decorators and wrapper components.

Please go to main [baobab](https://github.com/Yomguithereal/baobab) repo for more information on using Baobab.

## Summary

* [Installation](#installation)
* [The concept](#the-concept)
* [Patterns](#patterns)
  * [Mixins](#mixins)
  * [Higher Order Components](#higher-order-components)
  * [Decorators](#decorators)
  * [Wrapper Components](#wrapper-components)
* [Contribution](#contribution)
* [License](#license)

## Installation

You can install `baobab-react` through npm:

```
# The module is not yet published on npm but will be soon
# for the time being, you can install from git
npm install git+https://github.com/Yomguithereal/baobab-react.git
```

Then require the desired pattern and only this one will be loaded (this means that your browserify/webpack bundle, for instance, won't load unnecessary files and end up bloated).

*Example*

```js
var mixins = require('baobab-react/mixins');
```

## The concept
All the patterns share two concepts, a **root** and **branch**. 

* The **root** aims at passing a baobab tree through context so that child component (branches) may use it. Typically, your app's top-level component is the root
* A **branch** bind to cursors and/or facets to get their data from the tree passed down by the **root**

The background fo using these two concepts is two fold. First of all none of your components will be depending on the Baobab tree instance of your application. This decoupling makes it easier to load the components on the server side. Second any tree can be passed down through your top component, rendering the UI in different states. This makes it easier for you to create new instances of trees on the server and pass down the components to render the UI.

## Patterns
All of these patterns are introduced with the use of the following tree, using both cursors and facets:

*tree.js*
```js
import Baobab from 'baobab';

let tree = new Baobab({
  user: {
    name: 'john'
  },
  projects: {},
  projectsRowsIds: []
}, {
  facets: {
    projectsRows: {
      cursors: {
        ids: ['projectsTableRows']
        projects: ['projects']
      },
      get(state) {
        return state.ids.map(function (id) {
          return state.projects[id];
      });
    }
  }
});

export default tree;
```

You should choose one of these patterns for your application. There are not really any mentionable performance differences, it is just a matter of taste and compatability with your environment.

### Mixins

*App.js*
```js
import React from 'react';
import Projects from './Projects.js';
import {root} from 'baobab-react/mixins';

let App = React.createClass({
  mixins: [root],
  render() {
    return (
      <Projects/>
    );
  }
});

export default App;
```

*Projects.js*
```js
import React from 'react';
import {branch} from 'baobab-react/mixins';

let Projects = React.createClass({
  mixins: [branch],
  cursors: {
    user: ['user']
  },
  facets: {
    projects: 'projectsRows'
  },
  renderProject(project) {
    return (
      <li key={project.id}>{project.title}</li>
    );
  },
  render() {
    return (
      <div>
        <h1>Showing projects for {this.state.user.name}</h1>
        <ul>
          {this.state.projects.map(this.renderProject)}
        </ul>
      </div>
    );
  }
});

export default Projects;
```

*main.js*
```js
import React from 'react';
import App from './App.js';
import tree from './tree.js';

React.render(<App tree={tree}/>, document.body);
```

### Higher Order Components

*App.js*
```js
import {Component} from 'react';
import Projects from './Projects.js';
import tree from './tree.js';
import {root} from 'baobab-react/higher-order';

class App extends Component {
  render() {
    return (
      <Projects/>
    );
  }  
}

export default root(App, tree);
```

*Projects.js*
```js
import React from 'react';
import {branch} from 'baobab-react/higher-order';

class Projects extends Component {
  renderProject(project) {
    return (
      <li key={project.id}>{project.title}</li>
    );
  }
  render() {
    return (
      <div>
        <h1>Showing projects for {this.state.user.name}</h1>
        <ul>
          {this.state.projects.map(this.renderProject)}
        </ul>
      </div>
    );
  }
}

export default branch(Projects, {
  cursors: {
    user: ['user']
  },
  facets: {
    projects: 'projectsRows'
  }
});
```

*main.js*
```js
import React from 'react';
import App from './App.js';

React.render(<App/>, document.body);
```

### Decorators

**Warning**: decorators are a work-in-progress [proposition](https://github.com/wycats/javascript-decorators) for ES7 (they are pretty well handed by [babel](https://babeljs.io/) still). You have been warned!

*App.js*
```js
import {Component} from 'react';
import Projects from './Projects.js';
import tree from './tree.js';
import {root} from 'baobab-react/decorators';

@root(tree)
class App extends Component {
  render() {
    return (
      <Projects/>
    );
  }  
}

export default App;
```

*Projects.js*
```js
import React from 'react';
import {branch} from 'baobab-react/decorators';

@branch({
  cursors: {
    user: ['user']
  },
  facets: {
    projects: 'projectsRows'
  }  
})
class Projects extends Component {
  renderProject(project) {
    return (
      <li key={project.id}>{project.title}</li>
    );
  }
  render() {
    return (
      <div>
        <h1>Showing projects for {this.state.user.name}</h1>
        <ul>
          {this.state.projects.map(this.renderProject)}
        </ul>
      </div>
    );
  }
}

export default Projects;
```

*main.js*
```js
import React from 'react';
import App from './App.js';

React.render(<App/>, document.body);
```

### Wrapper Components

*App.js*
```js
import {Component} from 'react';
import Projects from './Projects.js';
import tree from './tree.js';
import {Root} from 'baobab-react/wrappers';

class App extends Component {
  render() {
    return (
      <Root tree={tree}>
        <Projects/>
      </Root>
    );
  }  
}

export default App;
```

*Projects.js*
```js
import React from 'react';
import {Branch} from 'baobab-react/wrappers';

let cursors = {
  user: ['user']
};

let facets = {
  projects: 'projectsRows'  
};

class ProjectsWrapper extends Component {
  render() {
    return (
      <Branch cursors={cursors} facets={facets}>
        <Projects/>
      </Branch>
    );
  }
}

class Projects extends Component {
  renderProject(project) {
    return (
      <li key={project.id}>{project.title}</li>
    );
  }
  render() {
    return (
      <div>
        <h1>Showing projects for {this.state.user.name}</h1>
        <ul>
          {this.state.projects.map(this.renderProject)}
        </ul>
      </div>
    );
  }
}

export default ProjectsWrapper;
```

*main.js*
```js
import React from 'react';
import App from './App.js';

React.render(<App/>, document.body);
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
