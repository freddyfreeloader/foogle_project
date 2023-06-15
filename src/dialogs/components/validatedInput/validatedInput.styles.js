import {css} from 'lit';
export const validatedInputStyles = [
  css`
    .box {
      display: inline-block;
      outline: none;
      padding-bottom: 4px;
      width: 200px;

      -webkit-tap-highlight-color: transparent;
      -webkit-user-select: none;
    }

    .box--inline {
      display: inline;
    }

    .content {
      position: relative;
      vertical-align: top;
      height: 40px;
    }

    .content-flex {
      position: relative;
      top: 14px;
      display: flex;
    }

    .input-container {
      position: relative;
      display: flex;
      flex-grow: 1;
      flex-shrink: 1;
      min-width: 0%;
    }

    .underline {
      position: absolute;
      left: 0;
      bottom: -2px;
      margin: 0;

      width: 100%;
      height: 1px;
      padding: 0;

      background-color: var(--validated-input-underline-color-default, rgba(0, 0, 0, 0.12));
    }

    .underline--blue {
      transform: scaleX(0);
      height: 2px;

      background-color: var(--validated-input-underline-color-select, #4285f4);
    }

    .underline--blue:not(.red-line) {
      animation: removeUnderline 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      animation-duration: var(--validated-input-animation-duration-blur, 300ms);
    }

    .grow-and-show:not(.red-line) {
      transform: scaleX(1);
      animation: addUnderline 500ms cubic-bezier(0.4, 0, 0.2, 1);
      animation-duration: var(--validated-input-animation-duration-grow, 500ms);
    }

    @keyframes removeUnderline {
      0% {
        transform: scaleX(1);
        opacity: 1;
      }
      100% {
        transform: scaleX(1);
        opacity: 0;
      }
    }

    @keyframes addUnderline {
      0% {
        transform: scaleX(0);
      }
      100% {
        transform: scaleX(1);
      }
    }

    .input-element {
      z-index: 0;
      flex-grow: 1;
      flex-shrink: 1;

      display: block;
      margin: 0;
      outline: none;
      border: none;
      min-width: 0%;
      height: 24px;
      padding: 0;

      background-color: transparent;
      font: 400 16px Roboto, RobotoDraft, Helvetica, Arial, sans-serif;
      line-height: 24px;
    }

    .validation-text {
      -webkit-box-flex: 1;
      flex: 1 1 auto;

      min-height: 16px;
      padding-top: 8px;

      font: 400 12px Roboto, RobotoDraft, Helvetica, Arial, sans-serif;
      -webkit-tap-highlight-color: transparent;
      color:var(--validated-input-text-color-error, #d50000);
    }

    .red-line {
      transform: scaleX(1);
      height: 2px;
      background-color:var(--validated-input-underline-color-error, #d50000);
    }
  `,
];
