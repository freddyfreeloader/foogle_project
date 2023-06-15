# Foogle - Google Contacts Studies: Dialogs

The dialogs of google contacts built with WebComponents and Lit.

### [Confirmation Dialog:][confirmationDialog]

![Confirmation Dialog][image confirmationDialog]

### [Input Dialog:][inputDialog]

![Input Dialog][image inputDialog]

### [Radio Button Dialog:][radioButtonDialog]

![Radio Button Dialog][image radioButtonDialog]

## Main Components:

#### [dialogButton.js][dialogButton]:

- the main cancel/apply button

#### [modalBackground.js][modalBackground]:

- the grey background under the dialog, makes the dialog modal

#### [dialogContainer.js][dialogContainer]:

- adjust the appearance of the dialog,
- provides slots for heading, main content, buttons

#### [dialogBaseMixin.js][dialogBaseMixin]:

- composes dialogButtons, modalBackground and dialogContainer,
- provides a default implementation for dialogContainer slots
- provides default implementations for saving and closing

#### [focusManagerMixin.js][focusManagerMixin]:

- handles focus events, so focus is trapped inside of the dialog

### Input Dialog:

#### [validatedInput.js][validatedInput]:

- creates an input field with validation message

### Radio Button Dialog:

#### [radioButton.js][radioButton]:

- the radio button

#### [selectionIndicator.js][selectionIndicator]:

- highlights radioButton when mouseclicked/focused

#### [radioButtonLabel.js][radioButtonLabel]:

- wraps radioButton, selectionIndicator and display text

#### [radioButtonController.js][radioButtonController]:

- controls the selection of the radio buttons


[StoryBook][storybooklink]
[StoryBook2][storybooklink2]


[storybooklink]: https://www.chromatic.com/library?appId=648b5c69455089f4504e5e64
[storybooklink2]: https://648b5c69455089f4504e5e64-zcoqlbqoec.chromatic.com/?path=/docs/description--docs
[confirmationDialog]: /src/dialogs/confirmationDialog
[inputDialog]: /src/dialogs/inputDialog
[radioButtonDialog]: /src/dialogs/radioButtonDialog
[dialogButton]: /src/dialogs/components/dialogButton
[modalBackground]: /src/dialogs/components/modalBackground
[dialogContainer]: /src/dialogs/components/dialogContainer
[dialogBaseMixin]: /src/dialogs/components/mixins/dialogBaseMixin
[focusManagerMixin]: /src/dialogs/components/mixins/focusManagerMixin
[validatedInput]: /src/dialogs/components/validatedInput
[radioButton]: /src/dialogs/components/radioButton
[selectionIndicator]: /src/dialogs/components/selectionIndicator
[radioButtonLabel]: /src/dialogs/components/radioButtonLabel
[radioButtonController]: /src/dialogs/components/radioButtonController

[image confirmationDialog]: /images/confirmationDialog.png
[image inputDialog]: /images/inputDialog.png
[image radioButtonDialog]: /images/radioButtonDialog.png
