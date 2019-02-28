const fs = require('fs')
const isFileValid = (filename) => {
    return new Promise((resolve, reject) => {
        fs.lstat(filename, (err, stats) => {
            if (err || !stats.isFile()) {
                reject(err)
            }
            else {
                resolve()
            }
        })
    })
    const stats = await 
    return stats.isFile()
}

module.exports = {
    isFileValid
}