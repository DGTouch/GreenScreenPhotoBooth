
                var hue = 127;
                var saturation = 127;
                var luminance = 127;
                var sensitivity = 127;

                window.addEventListener('load', function () {

                    var canvas = $("canvas");
                    var video = $("video");
                    var ctx = canvas.getContext("2d");


                    var gum = window.navigator.getUserMedia ||
                    window.navigator.webkitGetUserMedia ||
                    window.navigator.mozGetUserMedia;

                    if (gum) {
                        gum.call(window.navigator, { video:true, audio:false },
                                 gotUserMedia,
                                 userMediaFailed);
                    } else {
                        console.log('Web camera streaming not supported');
                        alert('Web camera streaming not supported by your browser. Try Chrome or Opera');
                    }

                    function gotUserMedia(stream) {
                        var url = window.URL || window.webkitURL;
                        video.src = window.mozGetUserMedia ? stream : url.createObjectURL(stream);
                        video.play();
                    }

                    function userMediaFailed(err) {
                        console.log("Could not getUserMedia: " + err)
                    }


                    function frameLoop() {

                        ctx.drawImage(video, 0, 0);
                        var image = ctx.getImageData(0, 0, 640, 480);
                        var data = image.data;
                        var len = data.length;

//get HSL values from sliders --> calibrate
for (var i = 0, j = 0; j < len; i++, j += 4) {
// Convert from RGB to HSL...
var hsl = rgb2hsl(data[j], data[j + 1], data[j + 2]);
var h = hsl[0], s = hsl[1], l = hsl[2];

//get slider data

if (isBounded(h, hue, sensitivity) && isBounded(s, saturation, sensitivity) && isBounded(l, luminance, sensitivity)) {
    data[j + 3] = 0;
}
}

ctx.putImageData(image, 0,0)
reqAnimFrame(frameLoop);
// Rendering bug in Chrome? Unless we do this
// the source <video> is not displayed until clicked..
// video.style.display="inline-block";
}

reqAnimFrame(frameLoop);
});


function isBounded(a, b, max_delta) {
    delta = Math.abs(a - b);
    if (delta <= max_delta) return true;
}

function rgb2hsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;

    var min = Math.min(r, g, b);
    var max = Math.max(r, g, b);
    var delta = max - min;
    var h, s, l;

    if (max == min) {
        h = 0;
    } else if (r == max) {
        h = (g - b) / delta;
    } else if (g == max) {
        h = 2 + (b - r) / delta;
    } else if (b == max) {
        h = 4 + (r - g) / delta;
    }

    h = Math.min(h * 60, 360);

    if (h < 0) {
        h += 360;
    }

    l = (min + max) / 2;

    if (max == min) {
        s = 0;
    } else if (l <= 0.5) {
        s = delta / (max + min);
    } else {
        s = delta / (2 - max - min);
    }

    return [h, s * 100, l * 100];
}

function updateVideo(){
    hue = Number(document.getElementById("hue").value);
    console.log('hue ' + hue);

    saturation = Number(document.getElementById("saturation").value);
    console.log('saturation ' + saturation);

    luminance = Number(document.getElementById("luminance").value);
    console.log('luminance ' + luminance);

    sensitivity = Number(document.getElementById("sensitivity").value);
    console.log('sensitivity ' + sensitivity);
}
