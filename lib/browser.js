import { UAParser } from 'ua-parser-js'; 
    
/**
 * Analyzes the UserAgent string of the browser in order to calculate the 
 * browser engine.
 * 
 * @class
 */
function Browser() {
    let parser = new UAParser(navigator.userAgent);

    /**
     * Calculates if the browser engine is Gecko (e.g. Firefox)
     * True if the engine is Gecko, false otherwise
     * @type {Boolean}
     */
    this.isGecko = parser.getEngine().name.toLowerCase().indexOf('gecko') >= 0;

    /**
     * Calculates if the browser engine is WebKit (e.g. Safari)
     * True if the engine is WebKit, false otherwise
     * @type {Boolean}      
     */
    this.isWebKit = parser.getEngine().name.toLowerCase().indexOf('webkit') >= 0;

    /**
     * Calculates if the browser engine is blink (Chrome, Chromium etc.)
     * True if the engine is Blink, false otherwise.
     * @type {Boolean}
     */
    this.isBlink = parser.getEngine().name.toLowerCase().indexOf('blink') >= 0;

    /**
     * Name of the browser engine
     * @type {Sring}
     */
    this.engine = parser.getEngine().name;
}

export default Browser;