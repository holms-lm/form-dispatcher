import templateForm from './template_test';

let count = 0;
let error = false;
function ajaxTest(parameters) {
  parameters.beforeSend();
  if (count === 0) error = false;
  count += 1;
  if (count > 4) {
    count = 0;
    error = true;
  }
  if (!error) {
    setTimeout(() => {
      switch (count) {
        case 1:
          parameters.success({
            status: 'error',
            errors: { phone: 'required', _password: 'wrong' },
          });
          break;
        case 2:
          parameters.success({ status: 'error', error: 'Опа! Ошибочка с сервера' });
          break;
        case 3:
          parameters
            .success({ status: 'ok' });
          break;
        case 4:
          parameters
            .success({ status: 'ok', template: templateForm });
          break;
        default:
          break;
      }
      parameters.complete();
    }, 2000);
  } else {
    // parameters.error({ status: 401 });
    parameters.error({ status: 500, error: '500 - Error ajax!' });
  }
}

export default ajaxTest;
