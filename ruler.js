function reverse_color(colors, idx) {
    colors[idx + 0] = 255 - colors[idx + 0];
    colors[idx + 1] = 255 - colors[idx + 1];
    colors[idx + 2] = 255 - colors[idx + 2];
    // imgdata[idx + 3] = 255 - imgdata[idx + 3];
}

function same_color(color1, color2, fix) {
    for (let i = 0; i < color1.length; i++) {
        if (Math.abs(color1[i] - color2[i]) > fix) {
            return false;
        }
    }
    return true;
}

function subImageData(oriimgdata, x, y, width, height) {
    let tarray = [];
    for (let yy = 0; yy < height; yy++) {
        let idx = oriimgdata.width * 4 * (y + yy) + x * 4;
        tarray.push(...oriimgdata.data.slice(idx, idx + width * 4));
    }
    return new ImageData(new Uint8ClampedArray(tarray), width, height);
}

function mod_x(x, y, fix) {
    var ret = [];
    var linedata = subImageData(imagedata, 0, y, can.width, 1);
    let i = 0;
    for (i = (x - 1) * 4; i > 0; i -= 4) {
        //left
        let now_color = [
            linedata.data[i + 0],
            linedata.data[i + 1],
            linedata.data[i + 2],
            // linedata.data[i + 3],
        ];
        if (same_color(rgba, now_color, fix)) {
            reverse_color(linedata.data, i);
        } else {
            break;
        }
    }
    ret[0] = i / 4;

    for (i = (x + 1) * 4; i < linedata.data.length; i += 4) {
        //right
        let now_color = [
            linedata.data[i + 0],
            linedata.data[i + 1],
            linedata.data[i + 2],
            // linedata.data[i + 3],
        ];
        if (same_color(rgba, now_color, fix)) {
            reverse_color(linedata.data, i);
        } else {
            break;
        }
    }
    ret[1] = i / 4;
    ctx.putImageData(linedata, 0, y);
    return ret;
}

function mod_y(x, y, fix) {
    var ret = [];
    var linedata = subImageData(imagedata, x, 0, 1, imagedata.height);
    let i = 0;
    for (i = (y - 1) * 4; i > 0; i -= 4) {
        //top
        let now_color = [
            linedata.data[i + 0],
            linedata.data[i + 1],
            linedata.data[i + 2],
            // linedata.data[i + 3],
        ];
        if (same_color(rgba, now_color, fix)) {
            reverse_color(linedata.data, i);
        } else {
            break;
        }
    }
    ret[0] = i / 4;
    for (i = (y + 1) * 4; i < linedata.data.length; i += 4) {
        //bottom
        let now_color = [
            linedata.data[i + 0],
            linedata.data[i + 1],
            linedata.data[i + 2],
            // linedata.data[i + 3],
        ];
        if (same_color(rgba, now_color, fix)) {
            reverse_color(linedata.data, i);
        } else {
            break;
        }
    }
    ret[1] = i / 4;
    ctx.putImageData(linedata, x, 0);
    return ret;
}

function restore_region(x, y) {
    let xregion = subImageData(imagedata, 0, y, imagedata.width, 1);
    let yregion = subImageData(imagedata, x, 0, 1, imagedata.height);
    ctx.putImageData(xregion, 0, y);
    ctx.putImageData(yregion, x, 0);
}



var input_x = document.getElementById("mod_x");
var input_y = document.getElementById("mod_y");
var a_width = document.getElementById("width");
var a_height = document.getElementById("height");
var input_fix = document.getElementById("fix");
var div = document.getElementById("maindiv");
var can = document.getElementById("can");
can.width = document.documentElement.clientWidth;
can.height = document.documentElement.clientHeight;
var ctx = can.getContext("2d");
var div_down = false;
var offset_pos = [0, 0];
var imagedata;
var rgba;
var lastpos = [0, 0];
var act_mod = [true, true];
var fix = 0;

let img = new Image();
img.src = localStorage["brokenclient"];
// img.src = "back.png";
img.onload = () => {
    ctx.drawImage(img, 0, 0);
    imagedata = ctx.getImageData(0, 0, can.width, can.height);
};

can.onmousemove = (e) => {
    restore_region(lastpos[0], lastpos[1]);
    let idx = imagedata.width * 4 * e.pageY + e.pageX * 4;
    rgba = [
        imagedata.data[idx + 0],
        imagedata.data[idx + 1],
        imagedata.data[idx + 2],
        // imagedata.data[idx + 3],
    ];
    let t;
    if (act_mod[0]) {
        t = mod_x(e.pageX, e.pageY, fix);
        a_width.text = t[1] - t[0];
    }
    if (act_mod[1]) {
        t = mod_y(e.pageX, e.pageY, fix);
        a_height.text = t[1] - t[0];
    }
    lastpos = [e.pageX, e.pageY];
};

div.onmousedown = (e) => {
    div_down = true;
    let left = parseInt(div.style.left || 10);
    let top = parseInt(div.style.top || 10);
    offset_pos = [e.pageX - left, e.pageY - top];
};
div.onmousemove = (e) => {
    if (div_down) {
        div.style.left = e.pageX - offset_pos[0] + "px";
        div.style.top = e.pageY - offset_pos[1] + "px";
    }
};
div.onmouseup = (e) => {
    div_down = false;
};

input_x.onchange = (e) => {
    a_width.text = 0;
    act_mod[0] = input_x.checked;
};
input_y.onchange = (e) => {
    a_height.text = 0;
    act_mod[1] = input_y.checked;
};

input_fix.oninput = (e) => {
    let n = parseInt(input_fix.value);
    fix = Math.min(255, n);
    fix = Math.max(0, fix);
};
// numble input 不支持选区
// input_fix.onfocus=(e)=>{
//     input_fix.setSelectionRange(0,input_fix.value.length)
// }
can.onmousedown = (e) => {
    window.utools.copyText(a_width.text + "," + a_height.text);
    window.utools.showNotification("长宽已复制");
    window.close();
};
can.onmouseenter = (e) => {
    document.body.style.cursor = "none";
};
can.onmouseleave = (e) => {
    document.body.style.cursor = "unset";
};
