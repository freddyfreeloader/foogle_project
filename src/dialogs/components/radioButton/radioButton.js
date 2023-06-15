import {css, html, LitElement} from 'lit';

/**
 * ## Radio button
 *
 * Renders a radio button, unchecked with grey color, checked with blue dot.
 * 
 * Default visible size: width/height: 16px + 2* border-width: 2px = 20px
 * 
 * properties:
 * 
 * >checked = false
 *
 * stylable with:
 *
 * - CSS custom properties:
 *   - --radio-button-inner-dot-transition: transform ease 0.28s
 *   - --radio-button-color-unchecked: rgba(0, 0, 0, 0.54)
 *   - --radio-button-color-checked: #1a73e8
 * 
 * - ::part CSS pseudo-element: (style with CSS prop *width/height* and *border-width*)
 *   - my-radio-button::part(ring)
 *   - my-radio-button::part(dot)
 *
 * @customElement my-radio-button
 * @attr checked
 * @prop checked
 * @cssprop {Transition} --radio-button-inner-dot-transition
 * @cssprop {Color} --radio-button-color-unchecked
 * @cssprop {Color} --radio-button-color-checked
 * @csspart ring styles for the outer ring
 * @csspart dot styles for the inner dot
 * @extends LitElement
 */
export class RadioButton extends LitElement {
  static styles = [
    css`
      /*t5nRo*/

      .ring {
        position: absolute;
        top: 0;
        left: 0;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: solid 2px rgba(0, 0, 0, 0.54);
      }

      /*wEIpqb*/

      .dot {
        position: absolute;
        top: 50%;
        left: 50%;
        border-radius: 50%;
        border: 5px solid rgba(0, 0, 0, 0.54);
        transition: var(
          --radio-button-inner-dot-transition,
          transform ease 0.28s
        );
        transform: translateX(-50%) translateY(-50%) scale(0);
      }

      .colored .dot {
        transform: translateX(-50%) translateY(-50%) scale(1);
      }
      /*N2RpBe*/
      .ring,
      .dot {
        border-color: var(--radio-button-color-unchecked, rgba(0, 0, 0, 0.54));
      }

      .colored .ring,
      .colored .dot {
        border-color: var(--radio-button-color-checked, #1a73e8);
      }
    `,
  ];

  static properties = {
    checked: {type: Boolean, reflect: true},
  };

  constructor() {
    super();
    this.checked = false;
  }

  render() {
    return html`
      <div class="ring-container ${this.checked ? 'colored' : ''}">
        <div class="ring" part="ring">
          <div class="dot" part="dot"></div>
        </div>
      </div>
    `;
  }
}

customElements.define('my-radio-button', RadioButton);
