# STL Analyzer
A small command line script that analyzes a given ASCII `.stl` file.

## How to use:
This script is written using `Node.js` and managed by `NPM`.

In order to run the script, first install all of the packages:

`npm install`

Then you may run the script using: 

`npm run analyze <path/to/.stl/file>`

***Note: This script was built to run with v11.4.0 of node**

## Code Explanation 
The code is essentially split up into two modules: 

 - `stlFileConverter`
 - `stlStats`

These modules both represent two abstracted areas of code and as long as their interfaces remain the same, their implementations should remain abstracted from each other.

### stlFileConverter
This module handles converting the `.stl` file into a javascript format so the rest of the code can do calculations on it.

### stlStats
This module houses all of that functions that run analysis on the converted `.stl` file.

## Areas for improvement
### Parallelization
Both the conversion of the file `.stl` and the analysis of the converted file contain parallelizable tasks. That is, repeating tasks that don't affect one another. 

As an example, given the following simple `.stl`:

```
solid simple
  facet normal 0 0 0
      outer loop
          vertex 0 0 0
          vertex 1 0 0
          vertex 1 1 1
      endloop
  endfacet
  facet normal 0 0 0
      outer loop
          vertex 0 0 0
          vertex 0 1 1
          vertex 1 1 1
      endloop
  endfacet
endsolid simple
```
Theoretically two seperate threads could convert each facet and then join the two converted objects together. This most likely would cause a slowdown for an `.stl` this small. However with an`.stl` with millions of facets, parallelization could speed things up.

Similarly, we could find speed up while calculating the surface area of the `.stl`. The code right now iterates through each triangle and calculates the area and sums all those areas up. We could split this set of triangles into `n` sets and have `n` threads run the same code over the triangles. On a large enough set, this could potentially give us some performance improvements.

## Analysis
This tool will compile the following statistics: 

 - Number of triangles
 - Total surface Area
 - Bounding square