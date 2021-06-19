const templateForm = `
<div>
<p>copy form:</p>
<div class="card-body copy">
  <div class="js--server_message" style="display: none;"></div>
  <form class="user js--validate_form" data-send-type="ajax" action="/send" method="get"
        data-place_server_message=".js--server_message" data-id_target="copy_form" novalidate="novalidate">
    <div class="form-group">
      <div class="forms_element"><label><span>Телефон</span><input type="text"
                                                                   class="form-control form-control-user js--phone"
                                                                   name="phone" data-error-required="Обязательное поле"
                                                                   data-valid-required="true"
                                                                   data-error-white-space-only="required"
                                                                   data-valid-white-space-only="true"
                                                                   data-error-minlength="Неверное количество символов"
                                                                   data-valid-minlength="18"></label>
        <div class="forms_element__message"></div>
      </div>
    </div>
    <div class="form-group">
      <div class="forms_element"><label><span>Пароль</span><input type="password" class="form-control form-control-user"
                                                                  name="_password"
                                                                  data-error-required="Обязательное поле"
                                                                  data-valid-required="true"
                                                                  data-error-white-space-only="required"
                                                                  data-valid-white-space-only="true"></label>
        <div class="forms_element__message"></div>
      </div>
    </div>
    <div class="d-flex justify-content-between align-items-baseline">
      <div class="form-group">
        <div class="custom-control custom-checkbox small"><input type="checkbox" class="custom-control-input"
                                                                 name="_remember_me" id="remember_me"><label
            class="custom-control-label" for="remember_me">Запомнить меня</label></div>
      </div>
      <div class="form-group"><label><a class="sb_link" href="#">Забыли пароль?</a></label></div>
    </div>
    <button type="submit" class="btn btn-primary btn-user btn-block position-relative text-lg"><span
        class="preloader js--preloader "><span
          class="preloader__item"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></span></span><span
        class="text-lg">Отправить</span></button>
  </form>
</div>
</div>
`;

export default templateForm;
