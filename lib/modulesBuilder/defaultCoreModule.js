'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (stack) {
  try {
    if (!_fs2.default.existsSync(`${process.cwd()}/${_env.MODULES_NAME}`)) throw Error('Modules directory is not exist !');
    if (_fs2.default.existsSync(`${process.cwd()}/${_env.MODULES_NAME}/defaultCore`)) return;
    _shelljs2.default.mkdir(`${process.cwd()}/${_env.MODULES_NAME}/defaultCore`);
    _fs2.default.writeFile(`${process.cwd()}/${_env.MODULES_NAME}/defaultCore/App.js`, App[`${stack}Txt`], err => {
      if (err) throw Error('Failed to create default core module');
      console.log('Succeded building default core module');
    });
  } catch (e) {
    (0, _utils.closeService)('Failed to create default core module');
  }
};

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _env = require('../env');

var _utils = require('../utils');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const App = {
  reactTxt: `import React from 'react'
import PropTypes from 'prop-types'

const App = (props) => (
  <main className='viewport'>
    <h1 style={{marginTop: '1rem', textAlign: 'center', fontSize: '3rem'}}>Hello Jerrycan user</h1>
    {props.children ? props.children : null}
  </main>
)

App.propTypes = {
  children: PropTypes.node
}

export default App
`
};