import {LitElement, html, css, nothing} from 'lit';
import {classMap} from 'lit/directives/class-map.js';
import {styleMap} from 'lit/directives/style-map.js';
/**
 * The container for dialogs.
 * 
 * Creates a centered dialog box with slots for heading, content and footer.
 * Calling slideOut() returns Promise "slided out!" and removes element.
 * 
 * Set origin for slide in translation:
 * 
 *     dialog.appearance = "top" | "bottom" | "right" | "left"  or
 *     dialog.startPoint = {x: left, y: top}
 * 
 * Disable scale up transition:
 * 
 *     dialog.noscale = true
 *      
 * @customElement my-dialog-container
 * @prop appearance
 * @prop startPoint
 * @prop noscale
 * @slot heading
 * @slot content
 * @slot footer
 * @cssprop {Transistion} --dialog-container-slide-in-transition transform .225s cubic-bezier(0, 0, 0.2, 1), translate 0.225s cubic-bezier(0, 0, 0.2, 1)
 * @cssprop {Transistion} --dialog-container-slide-out-transition all 500ms cubic-bezier(0.4, 0, 0.2, 1))
 */
export class DialogContainer extends LitElement {
  static styles = [
    css`
      .container {
        
        position: absolute;
        inset: 0;
        flex-direction: column;
        align-items: center;

        display: flex;
        -webkit-box-align: center;
        -webkit-box-orient: vertical;
        padding: 0 5%;
        
        overflow: hidden;

        pointer-events: none;
      }

      .center-vertically-box {
        flex-grow: 1;
        display: block;
        height: 3em;
      }

      .dialog {
        position: relative;
        flex-direction: column;

        align-items: stretch;
        -webkit-box-align: stretch;
        -webkit-box-orient: vertical;

        display: flex;

        transform: scale(0);
        transition: var(
          --dialog-container-slide-out-transition,
          all 500ms cubic-bezier(0.4, 0, 0.2, 1)
        );

        overflow: hidden;

        outline: 1px solid transparent;
        box-shadow: 0 12px 15px 0 rgb(0 0 0 / 24%);
        border-radius: 10px;

        background-color: #fff;
        pointer-events: auto;
      }

      .popup {
        translate: 0 100vh;
      }
      .popdown {
        translate: 0 -100vh;
      }
      .leftin {
        translate: -100vw 0;
      }
      .rightin {
        translate: 100vw 0;
      }
      .noscale {
        transform: scale(1);
      }

      .slide-in {
        transform: scale(1);
        /* to overwrite inline styles */
        translate: 0 0 !important;
        transition: var(
          --dialog-container-slide-in-transition,
          transform 0.225s cubic-bezier(0, 0, 0.2, 1),
          translate 0.225s cubic-bezier(0, 0, 0.2, 1)
        );
      }

      .dialog-size {
        flex-shrink: 1;
        min-width: 360px;
        max-width: 500px;
        max-height: 100%;
      }

      .heading-container {
        display: flex;
        flex-shrink: 0;
        padding: 16px 24px 16px;

        font: 500 20px Roboto, RobotoDraft, Helvetica, Arial, sans-serif;
      }

      .content-container {
        position: relative;
        flex-grow: 2;
        flex-shrink: 2;

        display: block;
        overflow-y: auto;

        padding: 0 24px;

        font: 400 14px/20px Roboto, RobotoDraft, Helvetica, Arial, sans-serif;
      }

      .footer-container {
        flex-shrink: 0;
        justify-content: flex-end;
        -webkit-box-pack: end;

        display: flex;
        padding: 24px 24px 16px 24px;
      }
    `,
  ];
  static properties = {
    /** Dialog should not scale up */
    noscale: {type: Boolean},
    /** 
     * Origin of slide in transition:
     * 
     * "left", "right", "top", "bottom"
     */
    appearance: {type: String},
    /** 
     * Object with dialogs starting point.
     * 
     *     {x: "left", y: "top"}
     */
    startPoint: {},
  };

  constructor() {
    super();
    this.appearance = 'center';
    this.noscale = false;
    this.startPoint = null;
  }

  render() {
    const classes = {
      dialog: true,
      'dialog-size': true,
      popup: this.appearance === 'bottom',
      popdown: this.appearance === 'top',
      leftin: this.appearance === 'left',
      rightin: this.appearance === 'right',
      noscale: this.noscale,
    };

    let startStyle;
    if (this.startPoint) {
      startStyle = {
        translate: `calc(-50vw + ${this.startPoint.x}px) calc(-50vh + ${this.startPoint.y}px)`,
      };
    }

    return html`
      <div id="dialog" class="container">
        <div class="center-vertically-box"></div>
        <div
          class="${classMap(classes)}"
          style=${startStyle ? styleMap(startStyle) : nothing}
          role="dialog"
        >
          <div class="heading-container">
            <slot name="heading"></slot>
          </div>
          <span class="content-container">
            <slot name="content"></slot>
          </span>
          <div class="footer-container">
            <slot name="footer"></slot>
          </div>
        </div>
        <div class="center-vertically-box"></div>
      </div>
    `;
  }
  get _dialog() {
    return this.renderRoot.querySelector('.dialog');
  }

  firstUpdated() {
    this._setClasses();
  }

  _setClasses() {
    setTimeout(() => {
      this._dialog.classList.add('slide-in');
    });
  }

  _slideOut = () => {
    this._dialog.classList.remove('slide-in');
  };

  /**
   * Slides out the dialog.
   * @return {Promise<"slided out!">}
   */
  slideOut = async () => {
    return await new Promise((resolve) => {
      this._dialog.ontransitionend = (event) => {
        if (event.composedPath()[0] === this._dialog) {
          return resolve('slided out!');
        }
      };
      this._slideOut();
    });
  };
}

customElements.define('my-dialog-container', DialogContainer);
