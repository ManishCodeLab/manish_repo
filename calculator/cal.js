let resetScreen = false;
let operatorPressed = false;

function updateScreen(value) {
    let currentScreen = document.cal.screen.value;

    if (resetScreen) {
        document.cal.screen.value = value;
        resetScreen = false;
    } else {
        if (currentScreen === "0") {
            if (value === "0") return;
            if (value !== ".") document.cal.screen.value = value;
            else document.cal.screen.value += value;
        } else {
            if (value === "." && currentScreen.includes(".")) return;
            document.cal.screen.value += value;
        }
    }
}

function clearScreen() {
    document.cal.screen.value = "0";
    resetScreen = false;
    operatorPressed = false;
}

function evaluateExpression() {
    try {
        let currentScreen = document.cal.screen.value;

        currentScreen = currentScreen.replace(/^0+(?=\d)/, '');
        currentScreen = currentScreen.replace(/^00+/, '0');

        if (/[\+\-\*\/\.]$/.test(currentScreen)) {
            currentScreen = currentScreen.slice(0, -1);
        }

        let result = eval(currentScreen);

        if (result === undefined || isNaN(result)) {
            document.cal.screen.value = "Error";
        } else {
            document.cal.screen.value = parseFloat(result);
        }
        resetScreen = true;
        operatorPressed = false;
    } catch (error) {
        document.cal.screen.value = "Error";
        resetScreen = true;
    }
}

function addOperator(operator) {
    let currentScreen = document.cal.screen.value;

    if (/[\+\-\*\/]$/.test(currentScreen.slice(-1))) {
        document.cal.screen.value = currentScreen.slice(0, -1) + operator;
    } else {
        document.cal.screen.value += operator;
    }
    resetScreen = false;
    operatorPressed = true;
}
if ('WebSocket' in window) {
    (function () {
        function refreshCSS() {
            var sheets = [].slice.call(document.getElementsByTagName("link"));
            var head = document.getElementsByTagName("head")[0];
            for (var i = 0; i < sheets.length; ++i) {
                var elem = sheets[i];
                var parent = elem.parentElement || head;
                parent.removeChild(elem);
                var rel = elem.rel;
                if (elem.href && typeof rel != "string" || rel.length == 0 || rel.toLowerCase() == "stylesheet") {
                    var url = elem.href.replace(/(&|\?)_cacheOverride=\d+/, '');
                    elem.href = url + (url.indexOf('?') >= 0 ? '&' : '?') + '_cacheOverride=' + (new Date().valueOf());
                }
                parent.appendChild(elem);
            }
        }
        var protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
        var address = protocol + window.location.host + window.location.pathname + '/ws';
        var socket = new WebSocket(address);
        socket.onmessage = function (msg) {
            if (msg.data == 'reload') window.location.reload();
            else if (msg.data == 'refreshcss') refreshCSS();
        };
        if (sessionStorage && !sessionStorage.getItem('IsThisFirstTime_Log_From_LiveServer')) {
            console.log('Live reload enabled.');
            sessionStorage.setItem('IsThisFirstTime_Log_From_LiveServer', true);
        }
    })();
}
else {
    console.error('Upgrade your browser. This Browser is NOT supported WebSocket for Live-Reloading.');
}