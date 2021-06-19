import Validate from './classes/validate';
import SendForm from './classes/send_form';
import HandlerAnswer from './classes/handler_answer';

class FormDispatcher {
  constructor($form, parameters = {}) {
    this.$form = $form;
    this.formSelector = parameters.formSelector;
    this.formSelectorDefault = '.js--validate';
  }

  init() {
    this.validate = new Validate(this.$form, this.notify.bind(this));
    this.validate.init();
    this.sendForm = new SendForm(this.$form, this.notify.bind(this));
    this.handlerAnswer = new HandlerAnswer(
      this.$form, this.notify.bind(this), this.validate.classElements,
    );
  }

  notify(sender, event, parameters = {}) {
    switch (sender) {
      case 'validate':
        switch (event) {
          case 'send':
            this.sendForm.send(parameters);
            break;
          default:
            break;
        }
        break;
      case 'sendForm':
        switch (event) {
          case 'success':
            this.handlerAnswer.success(parameters);
            break;
          default:
            break;
        }
        break;
      case 'handlerAnswer':
        switch (event) {
          case 'pastTemplate':
            this.reInit(parameters);
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  }

  reInit(parameters) {
    const formSelector = this.formSelector ? this.formSelector : this.formSelectorDefault;
    const $form = $(parameters.template).find(formSelector);
    if ($form) (new FormDispatcher($form).init());
  }
}

export default FormDispatcher;
