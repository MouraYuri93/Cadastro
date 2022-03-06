/* Máscaras ER */
function mascara(o, f) {
    v_obj = o
    v_fun = f
    setTimeout("execmascara()", 1)
}

function execmascara() {
    v_obj.value = v_fun(v_obj.value)
}

function mtel(v) {
    v = v.replace(/\D/g, ""); //Remove tudo o que não é dígito
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
    v = v.replace(/(\d)(\d{4})$/, "$1-$2"); //Coloca hífen entre o quarto e o quinto dígitos
    return v;
}

function id(el) {
    return document.getElementById(el);
}
window.onload = function() {
    id('telefone').onkeyup = function() {
        mascara(this, mtel);
    }
}

const customConsole = (w) => {
    const pushToConsole = (payload, type) => {
        w.parent.postMessage({
            console: {
                payload: stringify(payload),
                type: type
            }
        }, "*")
    }

    w.onerror = (message, url, line, column) => {
        // the line needs to correspond with the editor panel
        // unfortunately this number needs to be altered every time this view is changed
        line = line - 70
        if (line < 0) {
            pushToConsole(message, "error")
        } else {
            pushToConsole(`[${line}:${column}] ${message}`, "error")
        }
    }

    let console = (function(systemConsole) {
        return {
            log: function() {
                let args = Array.from(arguments)
                pushToConsole(args, "log")
                systemConsole.log.apply(this, args)
            },
            info: function() {
                let args = Array.from(arguments)
                pushToConsole(args, "info")
                systemConsole.info.apply(this, args)
            },
            warn: function() {
                let args = Array.from(arguments)
                pushToConsole(args, "warn")
                systemConsole.warn.apply(this, args)
            },
            error: function() {
                let args = Array.from(arguments)
                pushToConsole(args, "error")
                systemConsole.error.apply(this, args)
            },
            system: function(arg) {
                pushToConsole(arg, "system")
            },
            clear: function() {
                systemConsole.clear.apply(this, {})
            },
            time: function() {
                let args = Array.from(arguments)
                systemConsole.time.apply(this, args)
            },
            assert: function(assertion, label) {
                if (!assertion) {
                    pushToConsole(label, "log")
                }

                let args = Array.from(arguments)
                systemConsole.assert.apply(this, args)
            }
        }
    }(window.console))

    window.console = {...window.console,
        ...console
    }

    console.system("Running fiddle")
}

if (window.parent) {
    customConsole(window)
}
$("#cpfcnpj").keydown(function() {
    try {
        $("#cpfcnpj").unmask();
    } catch (e) {}

    var tamanho = $("#cpfcnpj").val().length;

    if (tamanho < 11) {
        $("#cpfcnpj").mask("999.999.999-99");
    } else {
        $("#cpfcnpj").mask("99.999.999/9999-99");
    }

    // ajustando foco
    var elem = this;
    setTimeout(function() {
        // mudo a posição do seletor
        elem.selectionStart = elem.selectionEnd = 10000;
    }, 0);
    // reaplico o valor para mudar o foco
    var currentValue = $(this).val();
    $(this).val('');
    $(this).val(currentValue);
});
// tell the embed parent frame the height of the content
if (window.parent && window.parent.parent) {
    window.parent.parent.postMessage(["resultsFrame", {
        height: document.body.getBoundingClientRect().height,
        slug: "z5qmwn1d"
    }], "*")
}

// always overwrite window.name, in case users try to set it manually
window.name = "result"

let allLines = []

window.addEventListener("message", (message) => {
    if (message.data.console) {
        let insert = document.querySelector("#insert")
        allLines.push(message.data.console.payload)
        insert.innerHTML = allLines.join(";\r")

        let result = eval.call(null, message.data.console.payload)
        if (result !== undefined) {
            console.log(result)
        }
    }
})