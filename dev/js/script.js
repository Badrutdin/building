$(document).ready(function () {
    $('.popup-gallery').magnificPopup({
        delegate: 'a',
        type: 'image',
        tLoading: 'Loading image #%curr%...',
        mainClass: 'mfp-img-mobile',
        gallery: {
            enabled: true,
            navigateByImgClick: true,
            preload: [0, 1]
        },
        image: {
            tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
            titleSrc: function (item) {
                return item.el.attr('title') + '<small>by Marsel Van Oosten</small>';
            }
        }
    });
    $.each($('[data-ajax-form]'), function (l, v) {
        formHandler($(v))
    })
});

class renderResponseMessage {
    constructor(displayContainer, styleParams = {
        default: '',
        success: '',
        error: '',
        warning: '',
        text: ''
    }) {
        this.displayContainer = displayContainer;
        this.styleParams = styleParams;
        this.removeDelay = 3000
    }

    render($message, $messageContainer, messageText) {
        $message.html(messageText);
        $messageContainer.append($message)
        this.displayContainer.append($messageContainer)
        setTimeout(function () {
            $messageContainer.remove()
        }, this.removeDelay)
    }

    renderSuccess(messageText) {
        const $message = $('<div>', {
            class: `${this.styleParams.text}`
        });
        const $messageContainer = $('<div>', {
            class: `${this.styleParams.default} ${this.styleParams.success}`
        })
        this.render($message, $messageContainer, messageText)
    }

    renderError(messageText) {
        const $message = $('<div>', {
            class: `${this.styleParams.text}`
        });
        const $messageContainer = $('<div>', {
            class: `${this.styleParams.default} ${this.styleParams.error}`
        })
        this.render($message, $messageContainer, messageText)
    }

    renderWarning(messageText) {
        const $message = $('<div>', {
            class: `${this.styleParams.text}`
        });
        const $messageContainer = $('<div>', {
            class: `${this.styleParams.default} ${this.styleParams.warning}`
        })
        this.render($message, $messageContainer, messageText)
    }
}

function formHandler($form, parameters = {}) {
    const params = {
        errorMessage: parameters.errorMessage || false,
        successMessage: parameters.successMessage || false,
        beforeRequest: parameters.beforeRequest || function () {
            console.log('before')
        },
        onSuccess: parameters.onSuccess || function () {
            console.log('success')
        },
        onError: parameters.onError || function () {
            console.log('error')
        },
        afterRequest: parameters.afterRequest || function () {
            console.log('after')
        }
    }
    $form.on('submit', function (e) {
        e.preventDefault()
        const $target = $(e.target)
        const data = getFormData(e.target)
        const url = $target.attr('action')
        const method = $target.attr('method')
        const submit = $form.find('[type="submit"]')
        const renderMess = new renderResponseMessage($form.find('.c-form__header'), {
            default: 'c-alert',
            success: 'c-alert_success',
            error: 'c-alert_error',
            warning: 'c-alert_warning',
            text: 'c-title c-title_sm text-center'
        })
        submit.attr('disabled', true)

        function removeDisableSubmit(submit) {
            setTimeout(function () {
                submit.attr('disabled', false)
            }, 3000)
        }

        params.beforeRequest()
        let message;
        $.ajax({
            url,
            method,
            data
        }).done(function () {
            $form.get(0).reset()
            if (params.successMessage) {
                message = params.successMessage
            } else {
                message = 'Форма успешно отправлена'
            }
            renderMess.renderSuccess(message)
            params.onSuccess()
            removeDisableSubmit(submit)
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            if (params.errorMessage) {
                message = params.errorMessage
            } else {
                message = 'Что-то пошло не так, повторите попытку позже'
            }
            renderMess.renderError(message)
            params.onError()
            removeDisableSubmit(submit)
        }).always(function () {
            params.afterRequest()
        })
    })
}

function getFormData(el) {
    let data = {};
    let inputs = el.querySelectorAll('input, select, textarea');
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].name != 'undefined' && inputs[i].name != '' && inputs[i].name) {
            if (['checkbox', 'radio'].indexOf(inputs[i].type) > -1) {
                if (inputs[i].checked) {
                    data[inputs[i].name] = inputs[i].value;
                }
            } else {
                data[inputs[i].name] = inputs[i].value;
            }
        }
    }
    return data;
}