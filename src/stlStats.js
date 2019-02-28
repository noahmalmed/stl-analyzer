const { mergeWith } = require('ramda')
/**
 * stlStats
 * 
 * All functions in this file expect an stl json of 
 * the following formate:
 * {
 *  name: 'name',
 *  triangles[
 *      {
 *          normal: { i, j, k},
 *          vertices: [
 *              {x, y, z}
 *              ...
 *          ]
 *      },
 *      ...
 *  ]
 * }
 */

const numberOfTriangles = (stl) => {
    return stl.triangles.length
}

/**
 * Calculate the surface area of all of the triangles using 
 * Heron's Formula: https://www.mathwarehouse.com/geometry/triangles/area/herons-formula-triangle-area.php
 * @param {stl json object} stl 
 */
const surfaceArea = (stl) => {
    let surfaceArea = 0
    stl.triangles.forEach(triangle => {
        const { vertices } = triangle
        const side1 = sideLength(vertices[0], vertices[1])
        const side2 = sideLength(vertices[1], vertices[2])
        const side3 = sideLength(vertices[2], vertices[0])
        const semiPerim = (side1 + side2 + side3)/2
        const area = Math.sqrt(semiPerim * (semiPerim - side1) * (semiPerim - side2) * (semiPerim - side3))
        surfaceArea += area
    })
    return surfaceArea
}

const sideLength = ({ x: x1, y: y1, z: z1 }, { x: x2, y: y2, z: z2}) => {
    const distance = Math.sqrt(Math.pow(x2 -x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 -z1, 2))
    return Math.abs(distance)
}

const boundingBox = (stl) => {
    let minBoundaries = { x: Number.MAX_VALUE, y: Number.MAX_VALUE, z: Number.MAX_VALUE }
    let maxBoundaries = { x: 0, y: 0, z: 0 }
    stl.triangles.forEach(triangle => {
        const { vertices } = triangle
        vertices.forEach(vertex => {
            minBoundaries = mergeWith((lVal, rVal) => Math.min(lVal, rVal), minBoundaries, vertex)
            maxBoundaries = mergeWith((lVal, rVal) => Math.max(lVal, rVal), maxBoundaries, vertex)
        })
    })

    return [{
            x: minBoundaries.x,
            y: minBoundaries.y,
            z: minBoundaries.z,
        }, {
            x: minBoundaries.x,
            y: minBoundaries.y,
            z: maxBoundaries.z
        }, {
            x: minBoundaries.x,
            y: maxBoundaries.y,
            z: minBoundaries.z
        }, {
            x: maxBoundaries.x,
            y: minBoundaries.y,
            z: minBoundaries.z
        }, {
            x: maxBoundaries.x,
            y: maxBoundaries.y,
            z: maxBoundaries.z
        }, {
            x: maxBoundaries.x,
            y: maxBoundaries.y,
            z: minBoundaries.z
        }, {
            x: maxBoundaries.x,
            y: minBoundaries.y,
            z: maxBoundaries.z
        }, {
            x: minBoundaries.x,
            y: maxBoundaries.y,
            z: maxBoundaries.z
        }
    ]
}

module.exports = {
    numberOfTriangles,
    surfaceArea,
    boundingBox
}