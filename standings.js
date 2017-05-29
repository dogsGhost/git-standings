const path = require('path')
const exec = require('child_process').exec
const naturalSort = require('javascript-natural-sort')
const curDir = process.cwd()
const {
  formatDate,
  getDirectories,
  titleCase,
  truthy,
  write,
} = require('./utils')

const root = path.join(curDir, '..')
// the name of the folder this project lives in
const thisDir = curDir.split('/').pop()

// default options
let options = {
  // restrict rankings to contributors with emails from a specific domain
  domain: '',
  // how many contributors from high -> low to return
  // zero returns all
  limit: 0,
  // how far back in the git log to look
  time: '14 days',
}

// store all directories that are tracked with git and return shortlog results
let projects = []
// store results of shortlog queries
const shortlogEntries = []
// windows support
const tty = process.platform === 'win32' ? 'CON' : '/dev/tty'

/**
 * get shortlog results from git projects
 * @param {Array} dir
 * @param {Function} cb
 */
const getShortlog = (dir, cb) => {
  const cwd = path.join(root, dir)
  console.log(`checking ${dir}`)
  exec(`git shortlog -sne --since="${options.time}" < ${tty}`, { cwd }, (err, stdout) => {
    if (!err) {
      shortlogEntries.push(stdout)
      console.log(`adding ${dir}`)
      if (stdout) projects.push(dir)
    } else {
      console.log('error', err)
      shortlogEntries.push('')
    }
    if (shortlogEntries.length === gitDirs.length) {
      cb(shortlogEntries)
    }
  })
}

/**
 *
 * @param {Array} arr
 * @return {Map}
 */
const getResultsMap = arr => {
  const gitMap = new Map()

  arr.forEach(string => {
    // extract commit count from string
    const number = Number(string.split('\t')[0]) || 0
    // build regexp
    const exp = new RegExp(`<(.*?)(?=@${options.domain})`)
    //get email address in string
    let email = string.match(exp) || []

    // check if there was a match
    if (email[1]) {
      email = email[1]
      // if not already key create it
      if (!gitMap.has(email)) {
        gitMap.set(email, 0)
      }
      // if it is push number
      gitMap.set(email, gitMap.get(email) + number)
    }
  })

  return gitMap
}

/**
 * combine all short logs
 * @param {Array} arr
 */
const handleShortlogs = arr => {
  const filterArr = truthy(arr.join('').split('\n'))
  const gitMap = getResultsMap(filterArr)
  let sortable = []

  for (let [key, value] of gitMap.entries()) {
    sortable.push(`${value} ${key}`)
  }
  sortable.sort(naturalSort).reverse()

  let rankings = sortable.map((string, index) => {
    const limit = options.limit
    const split = string.split(' ')
    if ((limit && index < limit) || !limit) {
      return {
        count: split[0],
        name: split[1],
      }
    }
  })
  rankings = truthy(rankings)
  // format and sort project names
  projects = projects.map(project => titleCase(project)).sort()
  write(JSON.stringify({
    rankings,
    projects,
    time: options.time,
    limit: options.limit,
    lastUpdated: formatDate(new Date()),
  }))
}

// get all directories at same level as this project
// keep the directory if it includes a git directory and is not this project
const gitDirs = getDirectories(root).filter(dir => {
  return getDirectories(path.join(root, dir)).includes('.git') && dir !== thisDir
})

/**
 *
 * @param {Object} opts
 */
const getStandings = opts => {
  if (opts) {
    if (!Array.isArray(opts) && typeof opts === 'object') {
      if (
        (opts.domain && typeof opts.domain !== 'string') ||
        (opts.limit && typeof opts.limit !== 'number') ||
        (opts.time && typeof opts.time !== 'string')
      ) {
        throw Error('invalid type on options property')
      } else {
        Object.assign(options, opts)
        options.limit = Number(options.limit)
      }
    } else {
      throw Error('invalid options value')
    }
  }

  // for each git directory
  // get the shortlog
  gitDirs.forEach(dir => getShortlog(dir, handleShortlogs))
}

module.exports = getStandings
