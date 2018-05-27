import shell from 'shelljs'
import {MODULES_NAME} from '../env'
import {closeService} from '../utils'
import fs from 'fs'

export default function (stack) {
  try {
    if (!fs.existsSync(`${process.cwd()}/${MODULES_NAME}`)) throw Error('Modules directory is not exist !')
    if (fs.existsSync(`${process.cwd()}/${MODULES_NAME}/defaultCore`)) return
    shell.mkdir(`${process.cwd()}/${MODULES_NAME}/defaultCore`)
    fs.writeFile(`${process.cwd()}/${MODULES_NAME}/defaultCore/App.js`, App[`${stack}Txt`], (err) => {
      if (err) throw Error('Failed to create default core module')
      console.log('Succeded building default core module')
    })
  } catch (e) {
    closeService('Failed to create default core module')
  }
}

const App = {
  reactTxt:
`import React from 'react'
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
}
