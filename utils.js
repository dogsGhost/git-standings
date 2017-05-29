const fs = require('fs')
const path = require('path')

module.exports = {
  /**
   * get the names of all directories at a given path
   * @param {String} srcpath
   * @return {Array}
   */
  getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(file => {
      return fs.lstatSync(path.join(srcpath, file)).isDirectory()
    })
  },

  /**
   * remove falsey values
   * @param {Array} arr
   * @return {Array}
   */
  truthy(arr) {
    return arr.filter(i => i)
  },

  /**
   * create or overwrite a file with data
   * @param {String} data
   * @param {String} filename
   */
  write(data, filename) {
    filename = typeof filename === 'string' ? filename : 'data.json'
    fs.writeFile(filename, data, err => {
      const output = err || 'data written'
      console.log(output)
    })
  },

  /**
   * change string from kebab-case to Title Case
   * @param {String} string
   * @return {String}
   */
  titleCase(string) {
    let split = string.split('-')
    split = split.map(val => val.charAt(0).toUpperCase() + val.slice(1))
    return split.join(' ')
  },

  /**
   * get a pretty print version of a date
   * @param {Date} date
   * @return {String}
   */
  formatDate(date) {
    const monthName = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ][date.getMonth()]
    return `${monthName} ${date.getDate()}, ${date.getFullYear()}`
  }
}
