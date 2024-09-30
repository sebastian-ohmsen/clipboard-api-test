//@ts-check

const CssClasses = Object.freeze({
    state: 'cb_state',
    active: 'cb_state-active',
    inactive: 'cb_state-inactive',
    unknown: 'cb_state-unknown'
});

/**
 * Indicator that uses a HTMLDivElement to show different states by adding 
 * the approprite CSS classes.
 * 
 * @param {HTMLDivElement} element 
 *      Element used as indicator
 */
function StateIndicator(element) {
    if (!element) {
        throw new Error('Element is required');
    }

    if (!element.classList.contains(CssClasses.state)) {
        element.classList.add(CssClasses.state);
    }

    let clearAllInciators = () => {
        for (let cssClass in CssClasses) {
            if (element.classList.contains(CssClasses[cssClass])) {
                element.classList.remove(CssClasses[cssClass]);
            }
            element.classList.add(CssClasses.state);
        }
    };

    this.setActive = () => {
        clearAllInciators();
        element.classList.add(CssClasses.active);
    };

    this.setInactive = () => {
        clearAllInciators();
        element.classList.add(CssClasses.inactive);
    };

    this.setToUnknown = () => {
        clearAllInciators();
        element.classList.add(CssClasses.unknown);
    };
}

export default StateIndicator;