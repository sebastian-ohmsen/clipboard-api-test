//@ts-check

import Browser from './helper/browser';
import StateIndicator from './helper/stateIndicators';

/**
 * Handler for actions to write to or read from the local clipboard.
 * 
 * @param {HTMLDivElement} copyIndicator 
 *      Button to initiate copy command
 * @param {HTMLDivElement} pasteIndicator
 *      Button that initates the paste command
 * @param {HTMLTextAreaElement} ioElement
 *      Element to display the clipboard content or select text that should be
 *      transfered to the clipboard 
 */
function ClipboardHandler(copyIndicator, pasteIndicator, ioElement) {

    let browser = new Browser();
    let copyState = new StateIndicator(copyIndicator);
    let pasteState = new StateIndicator(pasteIndicator);

    /**
     * Appends the given text value to the ioElement
     * 
     * @param {String} value
     *      The text to append to the IOElement 
     */
    function appendToIo(value) {
        if (ioElement) {
            ioElement.value += `\n${value}`;
        }
    };

    if (browser.isBlink) {

        // @ts-ignore - non standard / experimental 
        navigator.permissions.query({ name: 'clipboard-read' })
            .then(result => {
                appendToIo(`clipboard-read: ${result.state}`);
                if (result.state === 'granted') {
                    pasteState.setActive();
                }
                else if (result.state === 'prompt') {
                    navigator.clipboard.readText()
                        .then(() => {
                            pasteState.setActive();;
                            appendToIo('clipboard-read: granted');

                        })
                        .catch(reason => {
                            pasteState.setInactive();
                            appendToIo(reason);
                        });
                }
                else {
                    pasteState.setInactive();
                }

            })
            .catch(reason => {
                appendToIo(reason);
                pasteState.setInactive();
            });

        // @ts-ignore - non standard / experimental
        navigator.permissions.query({ name: 'clipboard-write' })
            .then(result => {
                appendToIo(`clipboard-write: ${result.state}`);
                if (result.state === 'granted') {
                    copyState.setActive();    
                }
                else if (result.state === 'prompt') {
                    navigator.clipboard.writeText('')
                        .then(() => {
                            copyState.setActive();
                        })
                        .catch(reason => {
                            copyState.setInactive();
                            appendToIo(reason);
                        });
                }
                else {
                    copyState.setInactive();
                }

            })
            .catch(reason => {
                copyState.setInactive();
                appendToIo(reason);
            });
    }

    if (browser.isGecko) {
        console.log('disable buttons');
        pasteState.setInactive();
        appendToIo('Paste is disabled for Gecko browsers');
    }

    let copySelectedText = () => {
        if (ioElement && ioElement.selectionStart) {
            let start = ioElement.selectionStart;
            let end = ioElement.selectionEnd;
            navigator.clipboard
                .writeText(ioElement.value.substring(start, end));
        }
    };

    let pasteClipboardContent = () => {
        if (ioElement) {
            navigator.clipboard.readText()
                .then(result => {
                    appendToIo(result);
                })
                .catch(reason => {
                    appendToIo(reason);
                });
        }
    };

    /**
     * Handler for key-down events
     * 
     * @param {KeyboardEvent} event 
     *      Incoming keyboard event
     */
    this.keyDownHandler = (event) => {
        console.log('incoming keydown event');
        console.log(event);

        if (event.altKey && event.ctrlKey && event.shiftKey) {
            switch (event.key.toLocaleLowerCase()) {
                case 'c':
                    copySelectedText();
                    event.stopPropagation();
                    event.preventDefault();
                    break;
                case 'v':
                    if (!browser.isGecko) {
                        pasteClipboardContent();
                    }
                    event.stopPropagation();
                    event.preventDefault();
                    break;
            }
        }
    };
}

export default ClipboardHandler;