import {LitElement} from 'lit';
import { DialogBaseMixin } from '../components/mixins/dialogBaseMixin/dialogBaseMixin';
import { FocusManagerMixin } from '../components/mixins/focusManagerMixin/focusManagerMixin';

/**
 * Creates a modal confirmation dialog.
 * 
 * Implements {@link DialogBaseMixin} and {@link FocusManagerMixin}
 * 
 * See docs of the mixins.
 * 
 * 
 * @customElement my-confirmation-dialog
 **/
export class ConfirmationDialog extends DialogBaseMixin(FocusManagerMixin(LitElement)) {

    constructor() {
        super();
    }

    render() {
        return this.renderDialog();
    }

    firstUpdated(...args) {
        super.firstUpdated(...args);
        this.handleFocus();
    }
}
customElements.define('my-confirmation-dialog', ConfirmationDialog);