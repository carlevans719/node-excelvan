const luminanceMap = {
  red: [],
  green: [],
  blue: []
}

for (let i = 0; i < 256; i++) {
  luminanceMap.red[ i ] = i * 0.299
  luminanceMap.green[ i ] = i * 0.587
  luminanceMap.blue[ i ] = i * 0.114
}

const pixelsToByte = (pixels) => {
  let value = 0

  for (let i = 0; i < 8; i++) {
    if (i < pixels.length) {
      value += pixels[ i ] << (7 - i)
    }
  }

  return value
}

module.exports = {
  first64: (arr) => {
    // TODO: add debug output here - if longer than 64,
    // let user know that array will be truncated
    let newArr = []
    for (var i = 0; i < arr.length && i < 64; i++) {
      newArr.push(arr[ i ])
    }
    return newArr
  },

  evenElementsAreAscending: (arr) => {
    let lastVal
    for (var i = 0; i < arr.length; i += 2) {
      if (typeof lastVal !== 'undefined' && arr[ i ] < lastVal) {
        return false
      }

      lastVal = arr[ i ]
    }

    return true
  },

  oddElementsAreLT32: (arr) => {
    for (var i = 1; i < arr.length; i += 2) {
      if (arr[ i ] > 32) return false
    }

    return true
  },

  withinRange: (val, min, max) => {
    return val >= min && val <= max
  },

  luminanceMap,

  ditherPixels: (pixels, width, contrast = 127) => {
    const pixelCount = pixels.length
    const processedPixels = []

    for (let i = 0; i < pixelCount; i += 4) {
      pixels[ i ] = Math.floor(luminanceMap.red[ pixels[ i ] ] + luminanceMap.green[ pixels[ i + 1 ] ] + luminanceMap.blue[ pixels[ i + 2 ] ])
    }

    for (let j = 0; j < pixelCount; j += 4) {
      const newPixel = pixels[ j ] < contrast ? 0 : 255
      const error = Math.floor((pixels[ j ] - newPixel) / 8)
      processedPixels.push(newPixel)

      if ((j + 4) < pixelCount) {
        pixels[ j + 4 ] += error
      }

      if ((j + 8) < pixelCount) {
        pixels[ j + 8 ] += error
      }

      if ((j + 4 * width - 4) < pixelCount) {
        pixels[ j + 4 * width - 4 ] += error
      }

      if ((j + 4 * width) < pixelCount) {
        pixels[ j + 4 * width ] += error
      }

      if ((j + 4 * width + 4) < pixelCount) {
        pixels[ j + 4 * width + 4 ] += error
      }

      if ((j + 8 * width) < pixelCount) {
        pixels[ j + 8 * width ] += error
      }
    }

    return processedPixels
  },

  pixelsToEscPos: (height, width, pixels, scale = 0) => {
    console.log('Processing ' + pixels.length + ' pixels...')

    const HEADER = [ 0x1d, 0x76, 0x30, scale ]
    const bytesNeeded = Math.ceil(width / 8) // 8 pixels per byte ( 1 bit / pixel )
    const widthBuffer = Buffer.from([ (bytesNeeded * 2) % 256, Math.floor((bytesNeeded * 2) / 256) ]) // xL, xH
    const heightBuffer = Buffer.from([ height % 256, Math.floor(height / 256) ]) // yL, yH

    const pixelsCopy = pixels.slice(0) // Avoid side-effects XXX: memory issue?
    const pixelBytes = []

    // let rowCount = 0;
    while (pixelsCopy.length) {
      // let colCount = 0;
      for (let j = width; j > 0; j -= 8) {
        pixelBytes.push(pixelsToByte(pixelsCopy.splice(0, Math.min(j, 8))))
        // colCount++;
      }
      // rowCount++;
      // console.log( "Added " + colCount + " columns", pixelsCopy.length );
    }
    // console.log( "Added " + rowCount + " rows" );

    return Buffer.concat([
      Buffer.from(HEADER),
      widthBuffer,
      heightBuffer,
      Buffer.from(pixelBytes)
    ])
  },

  pixelsToByte
}
