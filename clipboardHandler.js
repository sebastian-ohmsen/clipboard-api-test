//@ts-check

import Browser from './lib/browser';
import StateIndicator from './lib/stateIndicators';

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
                if (result.state === 'granted') {
                    pasteState.setActive();
                }
                else if (result.state === 'prompt') {
                    navigator.clipboard.readText()
                        .then(() => {
                            pasteState.setActive();;

                        })
                        .catch(reason => {
                            pasteState.setInactive();
                            console.error(reason);
                        });
                }
                else {
                    pasteState.setInactive();
                }

            })
            .catch(reason => {
                console.error(reason);
                pasteState.setInactive();
            });

        // @ts-ignore - non standard / experimental
        navigator.permissions.query({ name: 'clipboard-write' })
            .then(result => {
                if (result.state === 'granted') {
                    copyState.setActive();    
                }
                else if (result.state === 'prompt') {
                    navigator.clipboard.writeText('')
                        .then(() => {
                            copyState.setActive();
                        })
                        .catch(reason => {
                            console.error(reason);
                            copyState.setInactive();
                        });
                }
                else {
                    copyState.setInactive();
                }

            })
            .catch(reason => {
                console.error(reason);
                copyState.setInactive();
            });
    }

    if (browser.isGecko) {
        pasteState.setInactive();
        console.log('Paste is disabled for Gecko browsers');
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
                    console.error(reason);
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
        if (event.altKey && event.ctrlKey && event.shiftKey) {
            switch (event.key.toLocaleLowerCase()) {
                case 'c':
                    copySelectedText();
                    event.stopPropagation();
                    event.preventDefault();
                    break;
                case 'v':
                case 'insert':
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