$(function () {
    //Класс для хранения цвета во всех четырёх моделях
    class CM {
        constructor(type, c1, c2, c3, c4) {
            if (type == 'rgb') {
                this.rgb = [c1, c2, c3];
                this.hsv = this.rgb2hsv(c1, c2, c3);
                this.cmyk = this.rgb2cmyk(c1, c2, c3);
                this.hex = this.rgb2hex(c1, c2, c3);
            } else if (type == 'hsv') {
                this.hsv = [c1, c2, c3];
                this.rgb = this.hsv2rgb(c1, c2, c3);
                this.cmyk = this.rgb2cmyk(this.rgb[0], this.rgb[1], this.rgb[2]);
                this.hex = this.rgb2hex(this.rgb[0], this.rgb[1], this.rgb[2]);
            } else if (type == 'cmyk') {
                this.cmyk = [c1, c2, c3, c4];
                this.rgb = this.cmyk2rgb(c1, c2, c3, c4);
                this.hsv = this.rgb2hsv(this.rgb[0], this.rgb[1], this.rgb[2]);
                this.hex = this.rgb2hex(this.rgb[0], this.rgb[1], this.rgb[2]);
            } else if (type == 'hex') {
                this.hex = c1;
                this.rgb = this.hex2rgb(c1);
                this.cmyk = this.rgb2cmyk(this.rgb[0], this.rgb[1], this.rgb[2]);
                this.hsv = this.rgb2hsv(this.rgb[0], this.rgb[1], this.rgb[2]);
            }
        }
        rgb2hsv(r, g, b) { // RGB --> HSV
            r /= 255;
            g /= 255;
            b /= 255;
            let c_max = Math.max(r, g, b);
            let c_min = Math.min(r, g, b);
            let delta = c_max - c_min;

            let v = c_max * 100;
            let s = c_max == 0 ? 0 : (1 - (c_min / c_max)) * 100;
            let h;

            if (c_max == c_min) {
                h = 0;
            } else if (c_max == r && g >= b) {
                h = 60 * ((g - b) / delta);
            } else if (c_max == r && g < b) {
                h = 60 * ((g - b) / delta) + 360;
            } else if (c_max == g) {
                h = 60 * ((b - r) / delta) + 120;
            } else if (c_max == b) {
                h = 60 * ((r - g) / delta) + 240
            }

            return [Math.round(h), Math.round(s), Math.round(v)];
        }
        hsv2rgb(h, s, v) { // HSV --> RGB
            s /= 100;
            v /= 100;
            if (s == 0) {
                return [v, v, v];
            } else {
                let r, g, b;
                h = h == 360 ? 0 : h / 60;
                let i = Math.trunc(h);
                let c = h - i;

                let X = v * (1 - s);
                let Y = v * (1 - s * c);
                let Z = v * (1 - s * (1 - c));
                switch (i) {
                    case 0: r = v; g = Z; b = X; break;
                    case 1: r = Y; g = v; b = X; break;
                    case 2: r = X; g = v; b = Z; break;
                    case 3: r = X; g = Y; b = v; break;
                    case 4: r = Z; g = X; b = v; break;
                    case 5: r = v; g = X; b = Y; break;
                }
                return [Math.round(r * 255),
                Math.round(g * 255),
                Math.round(b * 255)];
            }
        }
        rgb2cmyk(r, g, b) { // RGB --> CMYK
            r /= 255;
            g /= 255;
            b /= 255;
            let k = 1 - Math.max(r, g, b);
            let c = (1 - r - k) / (1 - k) * 100;
            let m = (1 - g - k) / (1 - k) * 100;
            let y = (1 - b - k) / (1 - k) * 100;

            return [Math.round(c), Math.round(m), Math.round(y), Math.round(k * 100)];
        }
        cmyk2rgb(c, m, y, k) { // CMYK --> RGB
            let r = Math.round(255 * (1 - c / 100) * (1 - k / 100));
            let g = Math.round(255 * (1 - m / 100) * (1 - k / 100));
            let b = Math.round(255 * (1 - y / 100) * (1 - k / 100));
            return [r, g, b];
        }
        rgb2hex(r, g, b) { // RGB --> HEX
            var hr = r.toString(16);
            var hg = g.toString(16);
            var hb = b.toString(16);
            hr = hr.length == 1 ? "0" + hr : hr;
            hg = hg.length == 1 ? "0" + hg : hg;
            hb = hb.length == 1 ? "0" + hb : hb;
            return hr + hg + hb;
        }
        hex2rgb(hex) { // HEX --> RGB
            var bigint = parseInt(hex, 16);
            var r = (bigint >> 16) & 255;
            var g = (bigint >> 8) & 255;
            var b = bigint & 255;
            return [r, g, b];
        }
    }

    let COLOR = new CM('rgb', 0, 0, 0);

    $("#ccm_canvas").css("background-color", `#${COLOR.hex}`);

    function colorUpdate() {
        let rgb = `rgb(${COLOR.rgb[0]}, ${COLOR.rgb[1]}, ${COLOR.rgb[2]});`
        $("#rgb").val(rgb);
        let hsv = `${COLOR.hsv[0]}, ${COLOR.hsv[1]}%, ${COLOR.hsv[2]}%`;
        $("#hsv").val(hsv);
        let cmyk = `${COLOR.cmyk[0]}, ${COLOR.cmyk[1]}, ${COLOR.cmyk[2]}, ${COLOR.cmyk[3]}`
        $("#cmyk").val(cmyk);
        let hex = `#${COLOR.hex}`;
        $("#hex").val(hex);

        $("#ccm_canvas").css("background-image", "inherit");
        $("#ccm_canvas").css("background-color", hex);
        if ((765 - COLOR.rgb[0] - COLOR.rgb[1] - COLOR.rgb[2]) < 16) {
            $("#ccm_canvas").css("outline", "#000 solid 1px");
        } else {
            $("#ccm_canvas").css("outline", "inherit");
        }
    }
    function colorError() {
        $("#ccm_canvas").css("background-image", 'url("../img/ccm.png")');
        $("#ccm_canvas").css("background-color", "inherit");
    }
    function rgbUpdate() {
        let i = 0;
        $(".subcont input[model='rgb']").each(function () {
            $(this).val(COLOR.rgb[i++]);
        })
    }
    function hsvUpdate() {
        let i = 0;
        $(".subcont input[model='hsv']").each(function () {
            $(this).val(COLOR.hsv[i++]);
        })
    }
    function cmykUpdate() {
        let i = 0;
        $(".subcont input[model='cmyk']").each(function () {
            $(this).val(COLOR.cmyk[i++]);
        })
    }

    $('input').on('input', function () {

        if ($(this).parent().hasClass("subcont")) {

            switch ($(this).attr("model")) {
                case "rgb":
                    if (!$(this).val() || parseInt($(this).val()) < 0 || parseInt($(this).val()) > 255) {
                        colorError();
                    } else {
                        let rgb = [];
                        $(".subcont input[model='rgb']").each(function () {
                            rgb.push(parseInt($(this).val()));
                        })
                        COLOR = new CM('rgb', rgb[0], rgb[1], rgb[2]);
                        colorUpdate();
                        hsvUpdate();
                        cmykUpdate();
                    }
                    break;
                case "hsv":
                    if (!$(this).val() || parseInt($(this).val()) < 0 ||
                        ($(this).attr("max") == "360" && parseInt($(this).val()) > 360) ||
                        ($(this).attr("max") == "100" && parseInt($(this).val()) > 100)) {
                        colorError();
                    } else {
                        let hsv = [];
                        $(".subcont input[model='hsv']").each(function () {
                            hsv.push(parseInt($(this).val()));
                        })
                        COLOR = new CM('hsv', hsv[0], hsv[1], hsv[2]);
                        colorUpdate();
                        rgbUpdate();
                        cmykUpdate();
                    }
                    break;
                case "cmyk":
                    if (!$(this).val() || parseInt($(this).val()) < 0 || parseInt($(this).val()) > 100) {
                        colorError();
                    } else {
                        let cmyk = [];
                        $(".subcont input[model='cmyk']").each(function () {
                            cmyk.push(parseInt($(this).val()));
                        })
                        COLOR = new CM('cmyk', cmyk[0], cmyk[1], cmyk[2], cmyk[3]);
                        colorUpdate();
                        rgbUpdate();
                        hsvUpdate();
                    }
                    break;
            }

        } else {
            let text = $(this).val().replace(/[^\d\,]/g, '');
            let arc = text.split(',');

            let c1 = parseInt(arc[0]);
            let c2 = parseInt(arc[1]);
            let c3 = parseInt(arc[2]);
            let c4 = parseInt(arc[3]);

            let type = $(this).attr('id');
            let error = false;
            switch (type) {
                case "hex":
                    COLOR = new CM(type, arc[0]);
                    break;

                case "rgb":
                    if (c1 < 0 || c2 < 0 || c3 < 0 || c1 > 255 || c2 > 255 || c3 > 255) {
                        colorError();
                        error = true;
                    }
                    break;

                case "hsv":
                    if (c1 < 0 || c2 < 0 || c3 < 0 || c1 > 360 || c2 > 100 || c3 > 100) {
                        colorError();
                        error = true;
                    }
                    break;

                case "cmyk":
                    if (c1 < 0 || c2 < 0 || c3 < 0 || c4 < 0 ||
                        c1 > 100 || c2 > 100 || c3 > 100 || c4 > 100) {
                        colorError();
                        error = true;
                    }
                    break;
            }
            if (!error) {
                COLOR = new CM(type, c1, c2, c3, c4);
                colorUpdate();
                rgbUpdate();
                hsvUpdate();
                cmykUpdate();
            }

        }
    });

})