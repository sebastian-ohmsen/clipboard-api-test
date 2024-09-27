import './index.scss';
import ClipboardHandler from './clipboardHandler';

document.addEventListener('DOMContentLoaded', ()=> {
    let ioElement = document.getElementById('clipboardContent');
    let copyBtn = document.getElementById('copyBtn');
    let pasteBtn = document.getElementById('pasteBtn');
    
    let clipboardHandler = new ClipboardHandler(copyBtn, pasteBtn, ioElement);
    document.addEventListener('keydown', clipboardHandler.keyDownHandler);
});