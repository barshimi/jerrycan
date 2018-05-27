
export default (rcFile) => {
  return Object.keys(rcFile).every(key => rcMandatoryKeys.includes(key))
}

const rcMandatoryKeys = [
  'module',
  'route',
  'global_types',
  'globalCycle',
  'middlewares'
]
