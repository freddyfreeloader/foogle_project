import {css, html, LitElement} from 'lit';

/**
 * Builds a circle around an item, triggered by host class "mousedown" (static circle) or host class "focused" (circle will pulse).  
 * Color defaults to grey rgba(0, 0, 0, 0.2), change color with CSS background-color.  
 * Size depends on parents size.  
 * Parent element must be positioned.  
 * 
 * Usage:  
 * 
 *     <parentElement (positioned, sized)>
 *         <my-selection-indicator class="mousedown focused"></my-selection-indicator>
 *         <elementToSelect></elementToSelect>
 *     </parentElement>
 * 
 * Customize styles:  
 * 
 *     <style>
 *     my-selection-indicator {
 *       background-color: myOwnColor;
 *     }
 * 
 *     my-selection-indicator.mousedown {
 *       animation: mySpreadAnimation 0.3s;
 *       animation-fill-mode: forwards;
 *       opacity: 1;
 *     }
 *     \@keyframes mySpreadAnimation {
 *       0% {
 *         transform: scale(1.5);
 *         opacity: 0;
 *       }
 *       100% {
 *         transform: scale(2.5);
 *         opacity: 1;
 *       }
 *      }
 *     my-selection-indicator.focused {
 *       animation: myPulseAnimation 0.7s infinite alternate;
 *       opacity: 1;
 *     }
 *     \@keyframes myPulseAnimation {
 *       0% {
 *         transform: scale(1.5);
 *         opacity: 0;
 *       }
 *       100% {
 *         transform: scale(2.5);
 *         opacity: 1;
 *       }
 *      }
 *      </style>
 * 
 * @customElement my-selection-indicator
 * @extends LitElement
 */
export class SelectionIndicator extends LitElement {
  static styles = [
    css`
      :host {
        position: absolute;
        z-index: -1;
        left: 0;
        
        border-radius: 50%;
        width: 100%;
        height: 100%;
        
        background-color: rgba(0, 0, 0, 0.2);
        opacity: 0;
        pointer-events: none;
      }

      :host(.mousedown),
      :host(.qs41qe) {
        animation: quantumWizRadialInkSpread 0.3s;
        animation-fill-mode: forwards;
        opacity: 1;
      }

      :host(.focused),
      :host(.u3bW4e) {
        animation: quantumWizRadialInkFocusPulse 0.7s infinite alternate;
        opacity: 1;
      }
    
      @keyframes quantumWizRadialInkSpread {
        0% {
          transform: scale(1.5);
          opacity: 0;
        }
        100% {
          transform: scale(2.5);
          opacity: 1;
        }
      }

      @keyframes quantumWizRadialInkFocusPulse {
        0% {
          transform: scale(2);
          opacity: 0;
        }
        100% {
          transform: scale(2.5);
          opacity: 1;
        }
      }
    `,
  ];

  render() {
    return html``;
  }
}

customElements.define('my-selection-indicator', SelectionIndicator);
