export const buttonStyles = (args) => `* {
    --radio-button-color-checked: ${args.colorChecked};
    --radio-button-color-unchecked: ${args.colorUnchecked};
    --radio-button-inner-dot-transition: transform ease ${args.dotTransition}ms;
  }

  .decorator {
    position: relative;
    width: 30px;
    height: 30px;
  }
  
  my-radio-button::part(ring) {
    width: ${args.buttonsize}px;
    height: ${args.buttonsize}px;
    border-width: ${(args.buttonsize/8)}px;
  }

  my-radio-button::part(dot) {
    border-width: ${(args.buttonsize + 4) /4}px;
  }
  `;
