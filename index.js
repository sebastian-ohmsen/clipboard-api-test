import './index.scss';
import ClipboardHandler from './clipboardHandler';

document.addEventListener('DOMContentLoaded', ()=> {
    let ioElement = document.getElementById('clipboardContent');
    let copyBtn = document.getElementById('copyStateBulb');
    let pasteBtn = document.getElementById('pasteStateBulb');
    
    ioElement.addEventListener('copy', event => {
        event.preventDefault();
        event.stopPropagation();
    });

    ioElement.addEventListener('paste', event => {
        event.preventDefault();
        event.stopPropagation();
    });

    ioElement.addEventListener('cut', event => {
        event.preventDefault();
        event.stopPropagation();
    });

    let clipboardHandler = new ClipboardHandler(copyBtn, pasteBtn, ioElement);
    document.addEventListener('keydown', clipboardHandler.keyDownHandler);
});