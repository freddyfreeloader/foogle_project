import {
  findInteractiveElements,
  findElements,
} from '../../../../utils/shadowDomUtils/findElements/findElementsInShadowDOM';

/**
 * Manages keyboard focus handling for WebComponents.
 *
 * Component must provide "focus borders" with class "js-focus-border" and tabindex=0, so FocusManagerMixin can detect focusable elements between the borders and can trap the focus.
 *
 *
 * By default, FocusManager
 * - sets focus to the first focus border, so keyboard "Tab" events will be detected by the eventListener of the element, then
 * - listen to the first "Tab" event, then
 * - does a deep search with awaiting all updates of nested components, then
 * - collect all focusable and enabled elements, then
 * - sets the focus on the first focusable element after the first focus border
 *
 * The next "Tab" events will be handled by the browser focus management, usually following the HTML structure.
 *
 * If focus is on the last focusable element and "Tab" is pressed, FocusManger starts searching for the first focusable element again and focus this element.
 *
 * Shift-Tab works same way reverse.
 *
 * Optional parameters:
 *
 * - firstToFocus: The element that should receive the focus firstly, default to the first focusable element
 * - autoFocus: Immediately focus the first element without waiting for the first "Tab" event, default false
 *
 * Usage:
 *
 *     class MyWebElement extends FocusManagerMixin(LitElement) {
 *
 *     // .. //
 *
 *       firstUpdated() {
 *         //optional settings
 *         handleFocus(?firstElementThatShouldBeFocused, shouldImmediatelyFocusTheFirstElement = false)
 *       }
 *
 *       render() {return html`
 *         <div class="js-focus-border" tabindex=0></div>
 *           <focusableElement></focusableElement>
 *           <focusableElement></focusableElement>
 *         <div class="js-focus-border" tabindex=0></div>
 *         <notFocused></notFocused>
 *        `};
 *     }
 *
 * **Accessibility concerns**
 *
 * The focus will be trapped between the provided borders, so user can't (without mouse) escape, so you must provide an "exit strategy", e.g. a close button.
 *
 * @mixin
 */
export const FocusManagerMixin = (superClass) =>
  class extends superClass {
    constructor() {
      super();
    }

    connectedCallback() {
      super.connectedCallback();
      setTimeout(() =>
        this.validatePreconditions().then(() => {
          this._focusFirstBorder();
          document.body.addEventListener('keydown', this._trapFocus);
        })
      );
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      document.body.removeEventListener('keydown', this._trapFocus);
    }

    _focusFirstBorder() {
      this._getBorders().then((result) =>
        result[0].focus({preventScroll: true})
      );
    }

    _isTabPressed = (event) => event.key === 'Tab' || event.keyCode === 9;

    _getFirstAndLastFocusableElement = async () => {
      const allElementsWithTabindex = await findInteractiveElements(this.shadowRoot);
      const enabledElements = allElementsWithTabindex.filter((e) => !e.disabled);

      const [borderStart, borderEnd] = await this._getBorders();

      const indexStart = enabledElements.indexOf(borderStart) + 1;
      const indexEnd = enabledElements.indexOf(borderEnd) - 1;

      const first = enabledElements[indexStart];
      const last = enabledElements[indexEnd];

      return {first, last};
    };

    /**
     * Forwards the focus onto the first(Tab)/last(shiftTab) focusable element, if the focus receives the border.
     * @param {Event} e
     */
    _trapFocus = async (e) => {
      if (this._isTabPressed(e)) {
        const {first, last} = await this._getFirstAndLastFocusableElement();
        const [firstBorder, lastBorder] = await this._getBorders();

        const matchesFocus = (node) => node.matches(':focus');

        if (e.shiftKey) {
          if(matchesFocus(firstBorder)) {
            last.focus();

          }
          setTimeout(() => {
            if (matchesFocus(firstBorder)) {
              last.focus();
            }
          });
        } else {
          setTimeout(() => {
            if (matchesFocus(lastBorder)) {
              first.focus();
            }
          });
        }
      }
    };

    /**
     * Sets focus either to firstToFocus (if provided) or to the first element of focusable elements.
     */
    _focusFirstElement = async (firstToFocus) => {
      if (!firstToFocus) {
        const {first} = await this._getFirstAndLastFocusableElement();
        firstToFocus = first;
      }
      firstToFocus.focus();
    };

    _getBorders = async () =>
      await findElements(this.shadowRoot, (e) =>
        e.classList.contains('js-focus-border')
      );

    async validatePreconditions() {
      if ((await this._getBorders()).length !== 2) {
        console.error('Cannot find focus borders! You must provide a focusable element (tabindex=0) before and after your focus context with class="js-focus-border". Unable to manage focus.');
      }
    }

    /**
     * Inits the optional focus management settings.
     *
     * @param {HTMLElement} firstToFocus the element that will be focused firstly, default is the first focusable element
     * @param {Boolean} autoFocus if true, firstToFocus-element or first focusable element gets focus, defaults to false
     */
    handleFocus = (firstToFocus, autoFocus = false) => {
      setTimeout(async () => {
        const root = this.shadowRoot;

        //start focus management immediatly ...
        if (autoFocus) {
          await this._focusFirstElement(firstToFocus);
        }
        // ... or wait for the first tab keyboard event
        else {
          await new Promise((resolve) => {
            const resolveByTab = (e) => {
              if (this._isTabPressed(e)) {
                e.stopPropagation();
                e.preventDefault();
                root.removeEventListener('keydown', resolveByTab);
                resolve();
              }
            };
            root.addEventListener('keydown', resolveByTab);
          });
          await this._focusFirstElement(firstToFocus);
        }
      });
    };
  };
