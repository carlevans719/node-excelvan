node-excelvan
===========

A nodejs library to interact with the Excelvan (and possibly other) escpos printer over usb.


## Getting started

Install dependencies:
- Windows: Install [Zagig](http://sourceforge.net/projects/libwdi/files/zadig/) then install a driver for the printer
- Linux: Run `sudo apt-get install libudev-dev`

Install the module `npm install --save node-excelvan`

Plug in the printer.
```js
const { Printer, PrintJob } = require( 'node-excelvan' );

let myPrinter = new Printer(); // Optionally pass in the manufacturer & vendor ID(s)
let myPrintJob = new PrintJob();

myPrinter.connect(); // Optionally specify manufacturer and vendor ID(s) here too

myPrintJob.text('hello, printed world!'); // Add some plain text to the output

myPrinter.print(myPrintJob); // Send the job to the printer
```

## Usage

```js
const { Printer, PrintJob } = require( 'node-excelvan' );

let myPrinter = new Printer();
let myPrintJob = new PrintJob();

myPrinter.connect();


// Make a pretty page...
myPrintJob.pad( 1 ); // add some padding
myPrintJob.text( 'This is line 1' ); // add some text

myPrintJob.setTextAlignment( 'center' ); // change the text alignment
myPrintJob.separator(); // draw a horizontal line

myPrintJob.setTextAlignment( 'right' );
myPrintJob.text( 'This is line 2' );

myPrintJob.setTextAlignment( 'center' );
myPrintJob.separator();

myPrintJob.text( 'And line 3' );

myPrintJob.pad( 1 );
myPrintJob.cut(); // slice dat.

// Send the printJob to the printer
myPrinter.print( myPrintJob, function () {
	console.log( "It's finished printing!!" );
} );
```

## PrintJob

### text
 _param: text { String } The text to print_

 __adds plain text to the output__


### newLine
 _param: count { Number } How many new lines to print_

 __prints a newline character__


### pad
 _param: count { Number } How much white-space (in vertical units)_

 __adds vertical white-space__


### setTextFormat
 _param: format { String } The format to set_

 __(coming soon)__ set various aspects of font


### setFont
 _param: font { String } The font to use. Either 'A' or 'B'_

 __choose font A or font B__
 
 
### setBold#
 _param: enabled { Boolean } Whether to turn bold on or off_

 __set bold to true/false__


### setUnderline
 _param: enabled { Boolean } Whether to turn underline on or off_

 __set underline to true/false__


### setTextAlignment
 _param: alignment { String } What to set the text alignment to_

 __sets text alignment to 'left', 'center' or 'right'__


### separator
 __print horizontal line__


### cut
 __cuts paper__



## Printer

### connect
 _param: manufacturerId { String } The usb device's manufacturer ID_
 
 _param: vendorId { String } The usb device's vendor ID_
 
 _param: callback { Function } called on completion_

 __establishes a connection to the printer, taking control from the OS__


### disconnect
 _param: callback { Function } called on completion_

 __returns control of the printer to the OS and closes the connection to it__


### print
 _param: printJob { Object:PrintJob } The job to print_
 
 _param: callback { Function } called on completion_


 __sends the commands in the printJob__



## License
MIT



## Thanks

The [python-escpos][python-escpos] team - for creating the original, Python version

[@StaduimRunner][stadiumrunner] - for their great work creating a nodejs version


[python-escpos]: https://code.google.com/p/python-escpos
[stadiumrunner]: https://github.com/StadiumRunner
