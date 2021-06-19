class HandlerAnswer {
  constructor($form, dispatcher, classElements) {
    this.$form = $form;
    this.dispatcher = dispatcher;
    this.directive = {};
    this.formParameters = {};
    this.classElements = classElements;
    this.typeMessage = {
      error: 'alert-danger',
      ok: 'alert-success',
    };
  }

  success(parameters) {
    this.parsFormParameters();
    this.parsResponse(parameters.rsp);
    this.followDirective();
  }

  parsResponse(rsp) {
    this.directive = {};
    this.directive.status = rsp.status;
    this.directive.redirect = rsp.url;
    this.directive.pastTemplate = rsp.template;
    this.directive.error = rsp.error;
    this.directive.errors = rsp.errors;
  }

  parsFormParameters() {
    this.formParameters.additionalButton = this.$form.data('buttonId');
    // TODO протестировать вместе с datePicker
    this.formParameters.datepicker = { id: this.$form.data('id_datepicker'), action: 'destroy' };
    this.formParameters.messageSuccess = this.$form.data('id_message_success');
    this.formParameters.targetTemplate = this.$form.data('id_target');
    this.formParameters.serverMessage = this.$form.data('place_server_message');
  }

  followDirective() {
    this.showServerMessage(false); // очистка
    if (this.formParameters.additionalButton) $(`#${this.formParameters.additionalButton}`).hide();
    if (this.directive.redirect) document.location.assign(this.directive.redirect);
    if (this.directive.pastTemplate) {
      this.pastTemplate();
      if (this.formParameters.datepicker.id) {
        $(`#${this.$form.data('id_datepicker')}`).data('datepicker').destroy();
      }
    }
    if (this.directive.status === 'ok' && this.formParameters.messageSuccess) {
      $(`#${this.formParameters.messageSuccess}`).removeClass('d-none');
    }
    if (this.directive.status === 'error') {
      if (this.directive.errors) this.showMessageByNameField();
      if (this.directive.error) {
        this.showServerMessage(
          this.directive.error, this.typeMessage[this.directive.status],
        );
      }
    }
  }

  showMessageByNameField() {
    if (this.classElements) {
      $(`.${this.classElements.messageElement}`).empty();
      Object.keys(this.directive.errors).forEach((nameFiled) => {
        const message = `<span class="error error--server">${this.directive.errors[nameFiled]}</span>`;
        this.$form
          .find(`input[name="${nameFiled}"]`)
          .closest(`.${this.classElements.wrapperElement}`)
          .find(`.${this.classElements.messageElement}`)
          .append(message);
      });
    }
  }

  showServerMessage(message, type = 'alert-success') {
    const $wrapper = $(this.formParameters.serverMessage);
    if (this.classElements) $(`.${this.classElements.messageElement}`).empty();
    $wrapper.empty();
    if (message) {
      $wrapper.append(message);
      $wrapper.removeClass('alert-danger');
      $wrapper.removeClass('alert-success');
      $wrapper.addClass(type);
      $wrapper.show();
    } else {
      $wrapper.hide();
    }
  }

  pastTemplate() {
    const idTarget = this.formParameters.targetTemplate;
    const $template = $(this.directive.pastTemplate);
    const $target = $(`#${idTarget}`);
    if ($target) {
      const promise = $target
        .empty()
        .prepend($template)
        .promise();
      promise.done(() => {
        if (this.dispatcher) {
          this.dispatcher('handlerAnswer', 'pastTemplate', { template: $template });
        }
      });
    }
  }
}

export default HandlerAnswer;
