const fs = require('fs')
const readline = require('readline')

const convertStlFileToJson = (fileName) => {
    const fileStream = fs.createReadStream(fileName);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    })
  
    // Define stl js object
    var triangleIndex = 0
    const stl = {
      name: '',
      triangles: []
    }
  
    // Read all the triangles into a stl object
    rl.on('line', (line) => {
      const analysis = analyzeStlLine(line)
      switch (analysis.type) {
        case LineTypes.opener:
          stl.name = analysis.name
          break
        case LineTypes.triangleDefinitionStart:
          stl.triangles = [ ...stl.triangles, { normal: analysis.normal, vertices: []}]
          break
        case LineTypes.triangleDefinitionEnd:
          triangleIndex = triangleIndex + 1
          break
        case LineTypes.vertex:
          const { vertices } = stl.triangles[triangleIndex]
          stl.triangles[triangleIndex].vertices = [ ...vertices, analysis.vertex]
          break
      }
    })
  
    return new Promise((resolver) => {
      rl.on('close', () => {
        resolver(stl)
      })
    })
  }

const analyzeStlLine = function (line) {
    const splitLine = line.trim().split(' ')
    // console.log(splitLine)
    // Is opening line
    if (splitLine.includes('solid')) {
        return {
            type: LineTypes.opener,
            name: splitLine[1]
        }
    } 
    // Is start of facet 
    else if (splitLine.includes('facet') && splitLine.includes('normal')) {
        return {
            type: LineTypes.triangleDefinitionStart,
            normal: { 
              i: parseFloat(splitLine[2]),
              j: parseFloat(splitLine[3]),
              k: parseFloat(splitLine[4])
            }
        }
    }
    // Is end of facet
    else if(splitLine.includes('endfacet')) {
        return {
            type: LineTypes.triangleDefinitionEnd
        }
    }
    // Is Vertex
    else if(splitLine.includes('vertex')) {
        return {
            type: LineTypes.vertex,
            vertex: {
              x: parseFloat(splitLine[1]),
              y: parseFloat(splitLine[2]),
              z: parseFloat(splitLine[3])
            }
        }
    }
    else {
        return {
            type: LineTypes.nop
        }
    }
}

const LineTypes = {
    opener: 'opener',
    triangleDefinitionStart: 'triangleDefinitionStart',
    triangleDefinitionEnd: 'triangleDefinitionEnd',
    vertex: 'vertex',
    nop: 'nop'
}

module.exports = {
    convertStlFileToJson
}
