/**
 * Baobab-React Higher Order Component Test Suite
 * ===============================================
 *
 */
import assert from 'assert';
import React, {Component} from 'react';
import Baobab from 'baobab';
import {Root, Branch} from '../../src/wrapper.js';
import PropTypes from '../../src/utils/prop-types.js';

describe('Wrapper', function() {

  it('should fail if passing a wrong tree to the root wrapper', function() {

    assert.throws(function() {
      var group = (
        <Root tree={{hello: 'world'}}>
          <div />
        </Root>
      );

      React.render(group, document.mount);
    }, /Baobab/);
  });

  it('the tree should be propagated through context.', function() {
    var tree = new Baobab({name: 'John'}, {asynchronous: false});

    class Child extends Component {
      static contextTypes = {
        tree: PropTypes.baobab
      }

      render() {
        return <span id="test">Hello {this.context.tree.get('name')}</span>;
      }
    }

    var group = (
      <Root tree={tree}>
        <Child />
      </Root>
    );

    React.render(group, document.mount);

    assert.selectorText('#test', 'Hello John');
  });

  // it('the should be propagated to nested components.', function() {
  //   var tree = new Baobab({name: 'John'}, {asynchronous: false});

  //   class Child extends Component {
  //     static contextTypes = {
  //       tree: PropTypes.baobab
  //     }

  //     render() {
  //       return <span id="test">Hello {this.context.tree.get('name')}</span>;
  //     }
  //   }

  //   var group = (
  //     <Root tree={tree}>
  //       <div>
  //         <Child />
  //       </div>
  //     </Root>
  //   );

  //   React.render(group, document.mount);

  //   assert.selectorText('#test', 'Hello John');
  // });
});
