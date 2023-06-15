import {css, html, LitElement} from 'lit';

/**
 * Creates a modal background as a wrapper for dialogs or menus.  
 * It fades in by default, changeable with property "nofadein".  
 * The parent document cannot be scrolled or clicked. 
 * Background color will be removed by fadeOut() or CustomEvent('close'), but window is still modal,  
 * so you can await for example other elements transitions before you allow user to interact with the document.  
 * 
 * Listen to "close" event to remove background color.
 * 
 * 
 *     <body>
 *         <my-app></my-app>
 *         <my-modal-background>
 *              <my-dialog></my-dialog>
 *         </my-modal-background>
 *     </body>
 *
 * @customElement my-modal-background
 * @attr {Boolean] nofadein
 * @prop {Boolean] nofadein
 * @prop {Function} fadeOut
 * @cssprop {Transition background-color 500ms cubic-bezier(0.4, 0, 0.2, 1))} --modal-background-transition
 * @cssprop {background-color rgba(0, 0, 0, .6)} --modal-background-color
 * @slot {unnamed}
 */
export class ModalBackground extends LitElement {
  static properties = {
    /** 
     * If background color should fade in or be immediately colored
     */
    nofadein: {type: Boolean, reflect: true},
  };

  static styles = [
    css`
      .modal {
        position: absolute;
        inset: 0;
        z-index: 1;
        
        transition: background-color 500ms cubic-bezier(0.4, 0, 0.2, 1);
        transition: var(
          --modal-background-transition,
          background-color 500ms cubic-bezier(0.4, 0, 0.2, 1)
        );
        -webkit-transition: var(
          --modal-background-transition,
          background-color 500ms cubic-bezier(0.4, 0, 0.2, 1)
        );
      }

      .grey-background {
        background-color: var(--modal-background-color, rgba(0, 0, 0, 0.6));
        -webkit-background-color: var(
          --modal-background-color,
          rgba(0, 0, 0, 0.6)
        );
      }
    `,
  ];

  constructor() {
    super();
    this.nofadein = false;
    this.addEventListener('click', (e) => e.stopPropagation());
  }

  get _modal() {
    return this.renderRoot.querySelector('.modal');
  }

  render() {
    return html` <div
      class="modal ${this.nofadein  ? 'grey-background' : ''}"
      aria-hidden="true"
    >
      <slot></slot>
    </div>`;
  }

  async firstUpdated(...args) {
    super.firstUpdated(...args);
    this._preventWindowScrolling();
    if (!this.nofadein) {
      setTimeout(() => this._addBackground());
    }
    this.shadowRoot.host.addEventListener('close', this.fadeOut);
  }

  _preventWindowScrolling() {
      document.body.style.overflow = 'hidden';
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.body.style.overflow = '';
  }

  _addBackground() {
    this._modal.classList.add('grey-background');
  }

  _removeBackground() {
    this._modal.classList.remove('grey-background');
  }

  /**
   * Trigger the component to fade out. Promise resolves to "fadeOut" when transitionend-event is handled
   * @returns {Promise<"fadeOut">}
   */
  fadeOut = async () => {
    return await new Promise((resolve) => {
      this._modal.ontransitionend = (event) => {
        if (event.composedPath()[0] === this._modal) {
          return resolve('fadedOut');
        }
      };
      this._removeBackground();
    });
  };
}

customElements.define('my-modal-background', ModalBackground);
