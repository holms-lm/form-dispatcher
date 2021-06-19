// import toast from '../../../components/toast';
import ajaxTest from '../ajax_test';

class SendForm {
  constructor($form, dispatcher) {
    this.$form = $form;
    this.dispatcher = dispatcher;
    this.disabledElements = $form.find(':input:disabled').removeAttr('disabled');
    this.$button = this.$form.find('button[type="submit"]');
    if (this.$button.length === 0 && this.$form.data('buttonId')) {
      this.$button = $(`#${this.$form.data('buttonId')}`);
    }
    this.$buttonPreloader = this.$button.find('.js--preloader');
  }

  send(parameters = {}) {
    const gRecaptchaResponse = parameters.token;
    const cThis = this;
    let dataForm = this.$form.serializeArray();
    dataForm = SendForm.replacePhone(dataForm, '+38'); // TODO Вынести в параметры
    if (this.$form.attr('action') === '') {
      console.log('Send form to empty url:', this.$form.attr('action'));
    } else if (this.$form.data('sendType') === 'ajax') {
      // TODO не забыть поменять на ajax
      ajaxTest({
        url: this.$form.attr('action'),
        type: this.$form.attr('method'),
        data: gRecaptchaResponse
          ? `${$.param(dataForm)}&gRecaptchaResponse=${gRecaptchaResponse}`
          : dataForm,
        beforeSend() {
          cThis.prepareFormBeforeSend();
          if (cThis.dispatcher) cThis.dispatcher('sendForm', 'beforeSend');
        },
        success(rsp) {
          if (cThis.dispatcher) cThis.dispatcher('sendForm', 'success', { rsp });
        },
        complete() {
          cThis.prepareFormAfterSend();
          if (cThis.dispatcher) cThis.dispatcher('sendForm', 'complete');
        },
        error(rsp) {
          cThis.codeResponseHandler(rsp);
          if (cThis.dispatcher) cThis.dispatcher('sendForm', 'error', { rsp });
        },
      });
    } else {
      this.$form[0].submit();
    }
  }

  prepareFormBeforeSend() {
    // toast.hideMessage();
    this.disabledElements.attr('disabled', 'disabled');
    this.$button.prop('disabled', true);
    this.$buttonPreloader.addClass('d-block');
    $(`#${this.$form.data('id_message_success')}`).addClass('d-none');
  }

  prepareFormAfterSend() {
    this.$button.prop('disabled', false);
    this.$buttonPreloader.removeClass('d-block');
    if (this.$form.data('buttonId')) {
      $(`#${this.$form.data('buttonId')}`)
        .find('.js--preloader')
        .removeClass('d-block');
    }
  }

  codeResponseHandler(rsp) {
    if (rsp.status === 401) {
      document.location.assign('/');
    }
    if (rsp.status === 500) {
      console.log({ server_message: rsp.error });
      // toast.showMessage(rsp.responseJSON.error);
    }
    this.prepareFormAfterSend();
  }

  static replacePhone(data, beforeClear = '') {
    const regExp = /[+. ()-]*/g;
    const phoneNames = ['phone', '_phone'];
    const newData = data.map((item) => {
      const field = item;
      if (phoneNames.includes(field.name)) {
        field.value = field.value.replace(beforeClear, '').replace(regExp, '');
      }
      return field;
    });
    return newData;
  }
}

export default SendForm;
