const util = require('./util.js')

const NUL = 0x00
const EOT = 0x04
const ENQ = 0x05
const DLE = 0x10
const DC4 = 0x14
const CAN = 0x18
const ESC = 0x1b
const FS = 0x1c
const GS = 0x1d
const TAB = 0x09
const CR = 0x0d
const LF = 0x0a
const CRLF = [ CR, LF ]

module.exports = {

  // Control characters
  ctl: {
    NUL,
    EOT,
    ENQ,
    DLE,
    DC4,
    CAN,
    ESC,
    FS,
    GS
  },

  // Feed control sequences
  feed: {
    HT: [ TAB ], // Horizontal tab
    CR: [ CR ], // Carriage return
    LF: [ LF ], // Print and line feed
    CRLF: [ CRLF ],
    /**
     * @method CTL_SET_HT
     * @param tabPositions {Array} an array of tab position pairs
     * where the even elements are line numbers and odd elements are
     * column numbers identifying the column to indent to.
     * @example `CTL_SET_HT([0x00, 0x05, 0x01, 0x05])` will set the
     * indentation on line 0 to 6 and the indentation on line 1 to 6.
     */
    SET_HT: (tabPositions) => {
      const htPrefix = [ ESC, 0x44 ]
      if (!util.evenElementsAreAscending(tabPositions)) {
        throw new Error('Tab positions must be supplied in ascending order')
      }
      if (!util.oddElementsAreLT32(tabPositions)) {
        throw new Error('Cannot indent more than 32 columns')
      }

      const first32Pairs = util.first64(tabPositions)
      return htPrefix.concat(first32Pairs).concat([ NUL ])
    },
    CLEAR_HT: [ ESC, 0x44, NUL ],
    VT: [ ESC, 0x4a, 0xff ] // IDEA: should this be settable? (0xff)
  },

  // Printer hardware
  printer: {
    INIT: [ ESC, 0x40 ], // Clear data in buffer and reset modes
    SELECT: [ ESC, 0x3d, 0x01 ], // Printer select
    RESET: [ ESC, 0x3f, LF, NUL ], // TODO: Not documented...
    ENABLE_BUTTONS: [ ESC, 0x63, 0x35, NUL ],
    DISABLE_BUTTONS: [ ESC, 0x63, 0x35, 0x01 ]
  },

  // Cash Drawer
  cashdrawer: {
    KICK_2: [ ESC, 0x70, NUL ], // Sends a pulse to pin 2 []
    KICK_5: [ ESC, 0x70, 0x01 ] // Sends a pulse to pin 5 []
  },

  // Paper
  paper: {
    CUT: [ GS, 0x56, 0x01 ], // cut paper
    FEED_CUT: [ GS, 0x56, 0x42, 0x01 ] // Feed paper one line, then cut
  },

  // Text
  text: {
    NORMAL: [ ESC, 0x21, NUL ], // Normal text

    // Text orientation
    orientation: {
      FLIP_ON: [ ESC, 0x7b, 0x01 ], // flip output 180 degrees
      FLIP_OFF: [ ESC, 0x7b, NUL ], // don't flip output
      ROTATE_90_ON: [ ESC, 0x56, 0x01 ], // rotate output 90 degrees
      ROTATE_90_OFF: [ ESC, 0x56, NUL ] // don't rotate output
    },

    // Text alignment
    alignment: {
      LEFT: [ ESC, 0x61, NUL ], // Left justification
      CENTER: [ ESC, 0x61, 0x01 ], // Centering
      RIGHT: [ ESC, 0x61, 0x02 ], // Right justification
      SET_POSITION: (position = 0) => {
        return [ ESC, 0x24, position, NUL ]
      }
    },

    // Font
    font: {
      FONT_A: [ ESC, 0x4d, NUL ], // font type A
      FONT_B: [ ESC, 0x4d, 0x01 ], // font type B
      BOLD_ON: [ ESC, 0x45, 0x01 ], // bold font on
      BOLD_OFF: [ ESC, 0x45, NUL ], // bold font off
      DBL_STRIKE_ON: [ ESC, 0x47, 0x01 ], // double strike on
      DBL_STRIKE_OFF: [ ESC, 0x47, NUL ], // double strike off
      UNDERLINE_ON: [ ESC, 0x2d, 0x01 ], // single underline on
      DBL_UNDERLINE_ON: [ ESC, 0x2d, 0x02 ], // double underline on
      UNDERLINE_OFF: [ ESC, 0x2d, NUL ], // underline off
      INVERT_ON: [ GS, 0x42, 0x01 ], // invert text colour
      INVERT_OFF: [ GS, 0x42, NUL ] // don't invert text colour
    },

    // Text size
    size: {
      DBL_HEIGHT: [ ESC, 0x21, 0x10 ], // set character size to double height
      DBL_WIDTH: [ ESC, 0x21, 0x20 ], // set character size to double width
      QUAD: [ ESC, 0x21, 0x30 ], // set character size to double height & width
      /**
       * @method
       * @summary sets height / width to custom value
       * @param height {Number} 0-7. The height multiplier
       * @param width {Number} 0-7. The width multiplier
       * @example `SET_CUSTOM( 3, 3 )` will set the characters
       * to triple height and triple width
       */
      SET_CUSTOM: (height, width) => {
        const widths = [ NUL, 0x10, 0x20, 0x30, 0x40, 0x50, 0x60, 0x70 ]
        const heights = [ NUL, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07 ]

        const selectedWidth = widths[ width ] || NUL
        const selectedHeight = heights[ height ] || NUL

        return [ GS, 0x21, (selectedWidth + selectedHeight) ]
      }
    },

    // Text spacing
    spacing: {
      DEFAULT_LINE: [ ESC, 0x32 ], // Set line spacing to 4.23mm
      /**
       * @method SET_LINE
       * @param count {Number} The spacing value. Must be between 0 and 255
       * @example `SET_LINE( 109 )` will set the line spacing to 109 vertical
       * spacing units
       */
      SET_LINE: (count = 0) => {
        if (typeof count !== 'number') {
          throw new Error('Count must be of type "number"')
        } else if (!util.withinRange(count, 0, 255)) {
          throw new Error('Count must be between 0 and 255')
        }

        return [ ESC, 0x33, count ]
      },
      /**
       * @method SET_CHARACTER
       * @param count {Number} The spacing value. Must be between 0 and 255
       * @example `SET_CHARACTER( 175 )` will set the character spacing to
       * 175 horizontal units
       */
      SET_CHARACTER: (count = 0) => {
        if (typeof count !== 'number') {
          throw new Error('Count must be of type "number"')
        } else if (!util.withinRange(count, 0, 255)) {
          throw new Error('Count must be between 0 and 255')
        }

        return [ ESC, 0x20, count ]
      },
      /**
       * @method SET_LEFT_MARGIN
       * @param count {Number} The spacing value. Must be between 0 and 255
       * @example `SET_LEFT_MARGIN( 202 )` will set the left margin to
       * 202 horizontal units
       */
      SET_LEFT_MARGIN: (count = 0) => {
        if (typeof count !== 'number') {
          throw new Error('Count must be of type "number"')
        } else if (!util.withinRange(count, 0, 255)) {
          throw new Error('Count must be between 0 and 255')
        }

        return [ GS, 0x4c, count, NUL ]
      },
      /**
       * @method SET_PRINTABLE_WIDTH
       * @param count {Number} The spacing value. Must be between 0 and 255
       * @example `SET_PRINTABLE_WIDTH( 99 )` will set the printable width to
       * 99 horizontal units
       */
      SET_PRINTABLE_WIDTH: (count = 0) => {
        if (typeof count !== 'number') {
          throw new Error('Count must be of type "number"')
        } else if (!util.withinRange(count, 0, 255)) {
          throw new Error('Count must be between 0 and 255')
        }

        return [ GS, 0x57, count, NUL ]
      }
    }
  },

  // Barcode format
  // TODO
  // barcode: {
  //   TXT_OFF: [ GS, 0x48, NUL ], // HRI barcode chars OFF
  //   TXT_ABV: [ GS, 0x48, 0x01 ], // HRI barcode chars above
  //   TXT_BLW: [ GS, 0x48, 0x02 ], // HRI barcode chars below
  //   TXT_BTH: [ GS, 0x48, 0x03 ], // HRI barcode chars both above and below
  //   FONT_A: [ GS, 0x66, NUL ], // Font type A for HRI barcode chars
  //   FONT_B: [ GS, 0x66, 0x01 ], // Font type B for HRI barcode chars
  //   HEIGHT: [ GS, 0x68, 0x64 ], // Barcode Height [1-255]
  //   WIDTH: [ GS, 0x77, 0x03 ], // Barcode Width  [2-6]
  //   UPC_A: [ GS, 0x6b, NUL, NUL ], // Barcode type UPC-A
  //   UPC_E: [ GS, 0x6b, 0x01, NUL ], // Barcode type UPC-E
  //   EAN13: [ GS, 0x6b, 0x02, NUL ], // Barcode type EAN13
  //   EAN8: [ GS, 0x6b, 0x03, NUL ], // Barcode type EAN8
  //   CODE39: [ GS, 0x6b, 0x04, NUL ], // Barcode type CODE39
  //   ITF: [ GS, 0x6b, 0x05, NUL ], // Barcode type ITF
  // },

  // Image format
  image: {
    PRINT_NV: [ FS, 0x70, NUL, NUL ], // Print stored image 0 at 200x200dpi
    PRINT_NV_DBL_WIDTH: [ FS, 0x70, NUL, 0x01 ], // Print stored image 0 at 200dpi width, 100dpi height
    PRINT_NV_DBL_HEIGHT: [ FS, 0x70, NUL, 0x02 ], // Print stored image 0 at 100dpi width, 200dpi height
    PRINT_NV_QUAD: [ FS, 0x70, NUL, 0x03 ], // Print stored image 0 at 100dpi width, 100dpi height
    /**
     * @method PRINT_OTHER_NV
     * @param imageNumber {Number} The slot number of the image to print
     * @param mode {Number} The resolution mode to print the image with. Can be:
     * 0x00 (normal print mode - 200x200dpi),
     * 0x01 (double width mode - 100x200dpi),
     * 0x02 (double height mode - 200x100dpi),
     * 0x03 (quad mode - 100x100dpi)
     * @example `PRINT_OTHER_NV( 0x01, 0x03 )` will print the
     * second stored image in quad mode
     */
    PRINT_OTHER_NV: (imageNumber = 0, mode = 0) => {
      if (typeof imageNumber !== 'number') {
        throw new Error('Image number must be of type "number"')
      } else if (typeof mode !== 'number') {
        throw new Error('Mode must be of type "number"')
      } else if (!util.withinRange(imageNumber, 0, 255)) {
        throw new Error('Image number must be between 0 and 255')
      } else if (!util.withinRange(mode, 0, 3)) {
        throw new Error('Mode must be between 0 and 3')
      }

      const nvPrefix = [ FS, 0x70 ]
      return nvPrefix.concat([ imageNumber, mode ])
    },

    STORE_BIT_IMAGE: (width, height, data) => {
      // TODO: Ensure this works. I _think_ that data will be an array
      // whose length is == width*height. Each element will have a numeric
      // value between 0 and 255.
      return [ GS, 0x2a, width, height ].concat(data)
    },

    PRINT_BIT_IMAGE: [ GS, 0x2f, NUL ]

    // S_BIT_8S: [ ESC, 0x2a, NUL, ]
    // S_RASTER_N: [ GS, 0x76, 0x30, NUL ], // Set raster image normal size
    // S_RASTER_2W: [ GS, 0x76, 0x30, 0x01 ], // Set raster image double width
    // S_RASTER_2H: [ GS, 0x76, 0x30, 0x02 ], // Set raster image double height
    // S_RASTER_Q: [ GS, 0x76, 0x30, 0x03 ], // Set raster image quadruple
  }

}
