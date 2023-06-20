import {css} from 'lit';

export const dialogButtonStyles = [
  css`
    /* ==========================================================================
    Dialog Button
   ========================================================================== */

    /**
     * Button layout with hover, activ and focus states.
     *
     * Example HTML:
     *
     * <div class="button">
     *     <div class="highlight"></div>
     *     <div class="focused"></div>
     *     <span class="text">Button Text</span>
     * </div>
     */
    .button {
      position: relative;

      display: inline-flex;
      align-items: center;
      vertical-align: baseline;
      justify-content: center;

      overflow: visible;

      outline: none;
      border: none;
      border-radius: 4px;
      box-sizing: border-box;
      min-width: 64px;
      height: 36px;
      padding: 0 18px;

      -webkit-user-select: none;
      -webkit-appearance: none;

      background: transparent;

      font-size: 0.875rem;
      line-height: inherit;
      font-family: 'Google Sans', Roboto, Arial, sans-serif;
      font-weight: 500;
      -webkit-font-smoothing: antialiased;
      text-transform: none;
      text-decoration: none;
      letter-spacing: 0.0107142857em;
      color: #1a73e8;
    }

    .button:hover {
      cursor: pointer;
    }

    .button:active {
      outline: none;
    }

    .button:hover,
    .button:focus,
    .button:active {
      color: #174ea6;
    }

    /* Hover, focus and active state
   ========================================================================== */

    /**
     * Parent class for ::before and ::after classes,
     * clips their background. 
     */
    .highlight {
      position: absolute;
      z-index: 0;
      inset: 0;

      overflow: hidden;

      border-radius: 4px;
      box-sizing: content-box;
      width: 100%;
      height: 100%;
    }

    /**
     * Adds opacity for :hover and :focus, 
     *
     * size is twice a big, so you can use background gradients, scale transitions, etc.
     */
    .highlight::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;

      opacity: 0;

      border-radius: 4px;
      width: 200%;
      height: 200%;

      background-color: #1a73e8;
      pointer-events: none;
      opacity: 0;
    }

    /**
     * Adds ink spread  for :active
     */
    .highlight::after {
      content: '';
      position: absolute;

      transform-origin: var(--inkspread, center);
      opacity: 0;
      transform: scaleX(0);
      transition: var(
        --dialog-button-click-release-transition,
        all 150ms linear
      );
      width: 100%;
      height: 100%;

      background-color: #1a73e8;
      pointer-events: none;
      z-index: 0;
    }

    .button:active:hover .highlight::after {
      transition: all
        var(--dialog-button-click-and-focus-in-transition-duration, 175ms)
        linear;
      transform: scaleX(1);
      opacity: 0.12;
    }

    .highlight::before {
      transition: var(
        --dialog-button-hover-in-out-transition,
        opacity 15ms linear,
        background-color 15ms linear
      );
      z-index: 1;
    }

    .button:hover .highlight::before {
      opacity: 0.04;
    }

    .button:focus .highlight::before {
      transition: all
        var(--dialog-button-click-and-focus-in-transition-duration, 175ms)
        linear;
      opacity: 0.24;
    }

    /* Focus borders
   ========================================================================== */

    /**  The inner focus border */
    .focused {
      position: absolute;
      top: 50%;
      left: 50%;

      display: none;
      transform: translate(-50%, -50%);

      border: 2px solid transparent;
      border-radius: 6px;
      box-sizing: content-box;

      width: calc(100% + 4px);
      height: calc(100% + 4px);

      pointer-events: none;
    }

    /** The outer focus border */
    .focused::after {
      content: '';

      position: absolute;
      top: 50%;
      left: 50%;

      display: none;
      transform: translate(-50%, -50%);

      border: 2px solid transparent;
      border-radius: 8px;
      width: calc(100% + 4px);
      height: calc(100% + 4px);
    }

    .button:focus .focused {
      display: inline-block;
      border-color: #185abc;
    }

    .button:focus .focused::after {
      display: inline-block;
      border-color: #e8f0fe;
    }
  `,
];
