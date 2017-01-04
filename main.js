// const { Printer, PrintJob } = require( './escpos.js' );
// let myPrinter = new Printer();
// let myPrintJob = new PrintJob();
//
// myPrinter.connect();
//
//
// const { PDFImage } = require( 'pdf-image' );
// const pdfImage = new PDFImage( '/home/' );
// pdfImage.numberOfPages().then( numberOfPages => {
// 	for ( let i = 0; i <= numberOfPages; i++ ) {
// 		pdfImage.convertPage( i ).then( function ( imagePath ) {
// 			myPrintJob.printImage( imagePath, { dither: false, scale: 3 }, ( err, res ) => {
// 				myPrinter.print( res._queue );
// 			} );
// 		} );
// 	}
// } )
//
//
// const buildPixelArray = () => {
// 	let toPrint = [];
//
// 	// row 1
// 	for ( let z = 0; z < 125; z++ ) {
// 		for ( let a = 0; a < 500; a++ ) {
// 			toPrint.push( 0x00 );
// 		}
// 	}
//
// 	// row 2
// 	for ( let y = 0; y < 125; y++ ) {
// 		for ( let b = 0; b < 100; b++ ) {
// 			toPrint.push( 0x00 );
// 		}
// 		for ( let c = 0; c < 150; c++ ) {
// 			toPrint.push( 0xFF );
// 		}
// 		for ( let d = 0; d < 250; d++ ) {
// 			toPrint.push( 0x00 );
// 		}
// 	}
//
// 	// row 3
// 	for ( let x = 0; x < 125; x++ ) {
// 		for ( let e = 0; e < 100; e++ ) {
// 			toPrint.push( 0x00 );
// 		}
// 		for ( let f = 0; f < 75; f++ ) {
// 			toPrint.push( 0xFF );
// 		}
// 		for ( let g = 0; g < 125; g++ ) {
// 			toPrint.push( 0x00 );
// 		}
// 		for ( let h = 0; h < 100; h++ ) {
// 			toPrint.push( 0x00 );
// 		}
// 		for ( let j = 0; j < 100; j++ ) {
// 			toPrint.push( 0x00 );
// 		}
// 	}
//
// 	// row 4
// 	for ( let w = 0; w < 125; w++ ) {
// 		for ( let k = 0; k < 100; k++ ) {
// 			toPrint.push( 0x00 );
// 		}
// 		for ( let l = 0; l < 150; l++ ) {
// 			toPrint.push( 0xFF );
// 		}
// 		for ( let m = 0; m < 250; m++ ) {
// 			toPrint.push( 0x00 );
// 		}
// 	}
//
// 	// row 5
// 	for ( let v = 0; v < 125; v++ ) {
// 		for ( let n = 0; n < 500; n++ ) {
// 			toPrint.push( 0x00 );
// 		}
// 	}
//
// 	return toPrint;
// };
//
// myPrinter.print( [ pixelsToEscPos( 650, 500, buildPixelArray() ) ] );
