// WebComponents
export const DIALOG_CONTAINER = 'my-dialog-container';
export const MODAL_BACKGROUND = 'my-modal-background';
export const DIALOG_BUTTON = 'my-dialog-button';
export const RADIO_BUTTON = 'my-radio-button';
export const RADIO_BUTTON_CONTROLLER = 'my-radio-button-controller';
export const RADIO_BUTTON_LABEL = 'my-radio-button-label';
export const SELECTION_INDICATOR = 'my-selection-indicator';
export const VALIDATED_INPUT = 'my-validated-input';
export const CONFIRMATION_DIALOG = 'my-confirmation-dialog';
export const INPUT_DIALOG = 'my-input-dialog';
export const RADIOBUTTON_DIALOG = 'my-radio-button-dialog';

//DialogBaseMixin
export const CANCEL_BUTTON_CLASS = '.js-cancel-button';
export const APPLY_BUTTON_CLASS = '.js-apply-button';
export const CONTENT_CLASS = '.content';
export const FOCUS_BORDER_CLASS = '.js-focus-border';
export const HEADING_TEXT_CLASS = '.heading-text';
export const DIALOG_CONTAINER_CLASS = '.js-dialog-container';

//RadioButton
export const RING_CLASS = '.ring';
export const DOT_CLASS = '.dot';
export const RADIO_BUTTON_UNCHECKED_COLOR = 'rgba(0, 0, 0, 0.54)';
export const RADIO_BUTTON_CHECKED_COLOR = 'rgb(26, 115, 232)';

//RadioButtonLabel
export const RADIO_BUTTON_LABEL_WRAPPER_CLASS = '.radio-button-wrapper';
export const RADIO_BUTTON_LABEL_BUTTON_SIZE = '20px';

// SelectionIndicator
export const SELECTION_INDICATOR_COLOR_UNCHECKED = 'rgba(62, 80, 180, 0.2)';
export const SELECTION_INDICATOR_COLOR_CHECKED = 'rgba(0, 0, 0, 0.2)';

// ValidatedInput
export const VALIDATED_INPUT_TEXT_CLASS = '.validation-text';

//FocusManagerMixin
export const ERROR_FOCUS_MANAGER = 'Cannot find focus borders! You must provide a focusable element (tabindex=0) before and after your focus context with class="js-focus-border". Unable to manage focus.';

// RadioButtonController
export const ERROR_RADIO_BUTTON_CONTROLLER = 'RadioButtonDialog wants to preselect an option, but option cannot be found! You must provide a valid id of the option array, e.g.option[2].id for preselected property.';

// ModalBackground
export const MODAL_BACKGROUND_MAIN_CLASS = '.modal';
export const DEFAULT_BACKGROUND_COLOR = 'rgba(0, 0, 0, 0.6)';

// DialogButton
export const BUTTON_CLASS = '.button';


// Promise resolve texts
export const RESOLVE_TEXT_SLIDE_OUT = 'slided out!';
export const RESOLVE_TEXT_FADE_OUT = 'fadedOut';
export const RESOLVE_TEXT_ISCLOSED = 'isClosed';
export const RESOLVE_TEXT_CLOSE_DIALOG_FAIL = 'not valid event for close';

// Custom Event Types
export const EVENT_DIALOG_CLOSED = 'dialogClosed';
export const EVENT_INPUT_CONFIRMED = 'inputConfirmed';
export const EVENT_RADIODIALOG_CLOSED_WITH_APPLY = 'radioDialogClosedWithApply';