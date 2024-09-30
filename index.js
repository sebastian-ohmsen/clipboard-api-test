import './index.scss';
import ClipboardHandler from './clipboardHandler';

document.addEventListener('DOMContentLoaded', ()=> {
    let ioElement = document.getElementById('clipboardContent');
    let copyBtn = document.getElementById('copyStateBulb');
    let pasteBtn = document.getElementById('pasteStateBulb');
    
    let clipboardHandler = new ClipboardHandler(copyBtn, pasteBtn, ioElement);
    document.addEventListener('keydown', clipboardHandler.keyDownHandler);
});