import 'jquery-validation/dist/jquery.validate';

class Validate {
  constructor($form, dispatcher, sender,
    unlockFieldset = false) {
    this.$form = $form;
    this.dispatcher = dispatcher;
    this.sender = sender;
    this.typesRules = [];
    this.wrapperElement = 'forms_element';
    this.messageElement = 'forms_element__message';
    this.classElements = {
      wrapperElement: this.wrapperElement, messageElement: this.messageElement,
    };
    this.unlockFieldset = !unlockFieldset ? this.$form.data('lockClass') : unlockFieldset;
  }

  init() {
    const validateOptions = Object.assign(this.getMainOptions(), this.getFormRulesObject());
    this.validator = this.$form.validate(validateOptions);
    this.enableFieldset();
  }

  sendForm(token = false) {
    if (this.dispatcher) {
      this.dispatcher('validate', 'send', { token, $form: this.$form });
    } else if (this.sender) {
      this.sender(token);
    } else {
      this.$form.submit();
    }
  }

  getMainOptions() {
    const cThis = this;
    const options = {
      errorElement: 'span',
      errorPlacement(error, element) {
        error.appendTo(element.closest(`.${cThis.wrapperElement}`).find(`.${cThis.messageElement}`));
      },
      highlight(element) {
        const $wrapperElement = $(element.closest(`.${cThis.wrapperElement}`));
        $wrapperElement.addClass(`${cThis.wrapperElement}--error`);
        $wrapperElement.removeClass(`${cThis.wrapperElement}--ok`);
      },
      unhighlight(element) {
        const $wrapperElement = $(element.closest(`.${cThis.wrapperElement}`));
        $wrapperElement.removeClass(`${cThis.wrapperElement}--error`);
        $wrapperElement.addClass(`${cThis.wrapperElement}--ok`);
      },
      submitHandler() {
        $(`.${cThis.wrapperElement}--ok`).removeClass(`${cThis.wrapperElement}--ok`);
        $(`.${cThis.wrapperElement}--error`).removeClass(`${cThis.wrapperElement}--error`);
        cThis.$form
          .find('input')
          .not('input[name="password"]')
          .val((i, val) => val.trim());
        cThis.$form.find('textarea').val((i, val) => val.trim());

        const recaptchaKey = $('body').data('recaptcha_key');
        if (recaptchaKey) {
          // eslint-disable-next-line no-undef
          grecaptcha.ready(() => {
            // eslint-disable-next-line no-undef
            grecaptcha.execute(recaptchaKey, { action: 'submit' }).then((token) => {
              cThis.sendForm(token);
            });
          });
        } else {
          cThis.sendForm();
        }
      },
    };
    return options;
  }

  getFormRulesObject() {
    const { $form } = this;
    let { typesRules } = this;
    const $fields = $form.find('input');
    const fieldsMessages = {};
    const fieldsRules = {};
    const customOptions = {};

    function getTypesRules($element) {
      const properties = $element.data();
      const validProperties = [];
      const firstCharToLowerCase = (str) => str.charAt(0).toLowerCase() + str.slice(1);
      Object.keys(properties).forEach((key) => {
        if (key.indexOf('valid') === 0) {
          validProperties.push(firstCharToLowerCase(key.replace('valid', '')));
        }
      });
      return validProperties;
    }

    function getFieldRules($element) {
      const rules = {};

      function setRule(type) {
        let ruleValue = $element.data(`valid-${type}`);
        if (ruleValue) {
          if (type === 'equalTo') {
            // Добавление селектора элемента которому должен соответствовать поле
            ruleValue = $element.closest('form').find(`input[name="${ruleValue}"]`);
          }
          rules[type] = ruleValue;
        }
      }

      typesRules.forEach((item) => setRule(item));
      return rules;
    }

    function getFieldMessageForRules($element) {
      let messagesText;
      const messages = {};

      function setMessage(type) {
        messagesText = $element.data(`error-${type}`);
        if (messagesText) {
          messages[type] = messagesText;
        }
      }

      typesRules.forEach((item) => setMessage(item));
      return messages;
    }

    $fields.each((i, field) => {
      const $field = $(field);
      const name = $field.attr('name');
      typesRules = getTypesRules($field);
      const messages = getFieldMessageForRules($field);
      if (Object.keys(messages).length !== 0) {
        fieldsMessages[name] = messages;
      }
      const rules = getFieldRules($field);
      if (Object.keys(rules).length !== 0) {
        fieldsRules[name] = rules;
      }
    });
    this.typesRules = typesRules;
    customOptions.messages = fieldsMessages;
    customOptions.rules = fieldsRules;
    return customOptions;
  }

  enableFieldset() {
    if (this.unlockFieldset) {
      const $fieldset = this.$form.find(`.${this.unlockFieldset}`);
      if ($fieldset.length) $fieldset.prop('disabled', false);
    }
  }
}

function installPlaginForJquery() {
  (function ($) {
    jQuery.fn.validateForm = function () {
      return this.each(function () {
        const currentValidate = new Validate($(this));
        $(this).data('validate', currentValidate);
        currentValidate.init();
      });
    };
    jQuery.fn.destroyValidateForm = function () {
      function destroyValidate() {
        const $currentForm = $(this);
        const currentValidate = $currentForm.data('validate');
        currentValidate.validator.destroy();
        $currentForm
          .find(`.${currentValidate.wrapperElement}--ok`)
          .removeClass(`${currentValidate.wrapperElement}--ok`);
        $currentForm.find(`.${currentValidate.wrapperElement}--error`)
          .removeClass(`${currentValidate.wrapperElement}--error`);
      }
      return this.each(destroyValidate);
    };
    jQuery.fn.resetForm = function () {
      function resetForm() {
        const $currentForm = $(this);
        const currentValidate = $currentForm.data('validate');
        $currentForm.find(`.${currentValidate.wrapperElement}--ok`).removeClass(`${currentValidate.wrapperElement}--ok`);
        $currentForm.find(`.${currentValidate.wrapperElement}--error`).removeClass(`${currentValidate.wrapperElement}--error`);
        $currentForm.find(`.${currentValidate.messageElement}`).empty();
        $currentForm[0].reset();
      }
      return this.each(resetForm);
    };
  }(jQuery));
}

function addValidateMethods() {
  jQuery.validator.addMethod(
    'whiteSpaceOnly',
    function (value, element) {
      return this.optional(element) || !/^\s+$/.test(value);
    },
    'Only whitespace',
  );
  jQuery.validator.addMethod(
    'onlyUkraine',
    function (value, element) {
      return this.optional(element) || /^[\s0-9а-щА-ЩЬьЮюЯяЇїІіЄєҐґ`',.\-\\/]+$/g.test(value);
    },
    'only ukraine characters',
  );
  jQuery.validator.addMethod(
    'onlyRussian',
    function (value, element) {
      return this.optional(element) || /^[\s0-9а-яА-ЯёЁ`,.\-\\/]+$/g.test(value);
    },
    'only russian characters',
  );
  jQuery.validator.addMethod(
    'onlyEnglish',
    function (value, element) {
      return this.optional(element) || /^[\s0-9a-zA-Z`',.\-\\/]+$/g.test(value);
    },
    'only russian characters',
  );
}

installPlaginForJquery();
addValidateMethods();

export default Validate;
