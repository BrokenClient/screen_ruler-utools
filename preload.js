
function show(payload) {
    localStorage.setItem("brokenclient", payload);
    let img = new Image();
    img.src = payload;
    img.onload = () => {
        let win = utools.createBrowserWindow(
            "ruler.html",
            {
                title: "ruler",
                x: null,
                y: null,
                width: img.width,
                height: img.height,
                useContentSize: false,
                skipTaskbar: true,
                frame: false,
                minimizable: false,
                maximizable: false,
                fullscreenable: false,
                alwaysOnTop: true,
            },
            () => {
                // win.webContents.openDevTools();
            }
        );
    };
}

window.exports = {
    "main": {
        mode: "none",
        args: {
            enter: (action) => {
                utools.hideMainWindow();
                utools.screenCapture((base64Str) => {
                    utools.copyImage(base64Str);
                    show(base64Str);
                    utools.outPlugin();
                });
            },
        },
    },
};
