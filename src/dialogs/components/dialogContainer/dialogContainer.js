import {LitElement, html, css, nothing} from 'lit';
import {classMap} from 'lit/directives/class-map.js';
import {styleMap} from 'lit/directives/style-map.js';
/**
 * The container for dialogs.
 *
 * Creates a centered dialog box with slots for heading, content and footer.
 * Calling slideOut() returns Promise "slided out!" and removes element.
 *
 * Set origin for slide-in and slide-out translation:
 *
 *     dialog.slideInOrigin = "top" | "bottom" | "right" | "left" | "click"| "center"(default)
 *     dialog.slideOutTarget = "top" | "bottom" | "right" | "left" | "click"| "center"(default)
 *     dialog.clickPoint = {x: clientX, y: clientY}
 *
 * Disable scale transition:
 *
 *     dialog.noScaleIn = true
 *     dialog.noScaleOut = true
 *
 * @customElement my-dialog-container
 * @prop slideInOrigin
 * @prop slideOutTarget
 * @prop clickPoint
 * @prop noScaleIn
 * @prop noScaleOut
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

      .noscale {
        transform: scale(1);
      }

      .slide-in {
        transform: scale(1);
        /* !important to overwrite inline styles */
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
    noScaleIn: {type: Boolean},
    noScaleOut: {type: Boolean},

    /**
     * Origin of slide-in transition:
     *
     * "left"|"right"| "top"|"bottom"|"click"|"center"(default)
     */
    slideInOrigin: {type: String},

    /**
     * Target of slide-out transition:
     *
     * "left"|"right"|"top"|"bottom"|"click"|"center"(default)
     */
    slideOutTarget: {},
    /**
     * Object with dialogs starting point.
     *
     *     {x: "left", y: "top"}
     */
    clickPoint: {},
  };

  constructor() {
    super();
    this.noScaleIn = false;
    this.noScaleOut = false;
    this.clickPoint = {x: 0, y: 0};
    this.slideInOrigin = 'center';
    this.slideOutTarget = 'click';
  }

  getOrigin() {
    let startX = '0';
    let startY = '0';

    switch (this.slideInOrigin) {
      case 'bottom':
        startY = '100vh';
        break;
      case 'top':
        startY = '-100vh';
        break;
      case 'left':
        startX = '-100vw';
        break;
      case 'right':
        startX = '100vw';
        break;
      case 'click':
        startX = `calc(-50vw + ${this.clickPoint.x}px)`;
        startY = `calc(-50vh + ${this.clickPoint.y}px)`;
        break;
      case 'center':
        return;
    }
    return {translate: ` ${startX} ${startY}`};
  }

  render() {
    const classes = {
      dialog: true,
      'dialog-size': true,
      noscale: this.noScaleIn,
    };

    let start = this.getOrigin();

    return html`
      <div id="dialog" class="container">
        <div class="center-vertically-box"></div>
        <div
          class="${classMap(classes)}"
          style=${start ? styleMap(start) : nothing}
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
    this.slideInOrigin = this.slideOutTarget;
    this.noScaleIn = this.noScaleOut;
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
