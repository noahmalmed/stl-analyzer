const { convertStlFileToJson } = require('./src/stlFileConverter')
const { 
  numberOfTriangles,
  surfaceArea,
  boundingBox
} = require('./src/stlStats')
const { isFileValid } = require('./src/stlFileValidations')

const args = process.argv.slice(2);
const filename = args[0]

isFileValid(filename)
  .then(() => {
    convertStlFileToJson(filename)
    .then(stlObject => {
      console.log(`Number of Triangles: ${numberOfTriangles(stlObject)}`)
      console.log(`Surface Area: ${surfaceArea(stlObject)}`)
      console.log('Bounding Box:')
      console.log(boundingBox(stlObject))
    })
  })
  .catch((err) => {
    console.error('There is an error opening the file')
  })
