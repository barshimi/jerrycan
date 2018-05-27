/**
 * [description]
 * @param  {[type]} constantsArr [description]
 * @return {[type]}              [description]
 */
export function constantsCreator () {
  return Promise.all([fetchCoreJsonFile()])
    .then(res => {
      if (!res[0].length) return {}
      return res[0].reduce((constObj, constant) => {
        constObj[constant] = constant
        return constObj
      }, {})
    })
}

function fetchCoreJsonFile () {
  return new Promise((resolve, reject) => {
    try {
      import('../../../../coreJson/jcConstants.json').then(res => {
        resolve(res.default ? res.default : res)
      })
    } catch (e) {
      reject(e)
    }
  })
}
