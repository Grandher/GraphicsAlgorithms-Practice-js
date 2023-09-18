$(function () {
    //Класс для хранения цвета во всех четырёх моделях
    class CM {
        constructor(type, c1, c2, c3, c4) {
            switch (type) {
                case 'rgb':
                    this.rgb = [c1, c2, c3];
                    break;
                case 'hsv':
                    this.hsv = [c1, c2, c3];
                    this.rgb = this.hsv2rgb(c1, c2, c3);
                    break;
                case 'hsl':
                    this.hsl = [c1, c2, c3];
                    this.hsv = this.hsl2hsv(c1, c2, c3);
                    this.rgb = this.hsv2rgb(this.hsv[0], this.hsv[1], this.hsv[2]);
                    break;
                case 'cmyk':
                    this.cmyk = [c1, c2, c3, c4];
                    this.rgb = this.cmyk2rgb(c1, c2, c3, c4);
                    break;
                case 'xyz':
                    this.xyz = [c1, c2, c3];
                    this.rgb = this.xyz2rgb(c1, c2, c3);
                    break;
                case 'lab':
                    this.lab = [c1, c2, c3];
                    this.xyz = this.lab2xyz(c1, c2, c3);
                    this.rgb = this.xyz2rgb(this.xyz[0], this.xyz[1], this.xyz[2]);
                    break;
                case 'hex':
                    this.hex = c1;
                    this.rgb = this.hex2rgb(c1);
                    break;
                default:
                    type = "error";
                    break;
            }
            if (type != "error") {
                this.hsv = this.rgb2hsv(this.rgb[0], this.rgb[1], this.rgb[2]);
                this.hsl = this.rgb2hsl(this.rgb[0], this.rgb[1], this.rgb[2]);
                this.cmyk = this.rgb2cmyk(this.rgb[0], this.rgb[1], this.rgb[2]);
                this.hex = this.rgb2hex(this.rgb[0], this.rgb[1], this.rgb[2]);
                this.xyz = this.rgb2xyz(this.rgb[0], this.rgb[1], this.rgb[2]);
                this.lab = this.xyz2lab(this.xyz[0], this.xyz[1], this.xyz[2]);
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
        rgb2hsl(r, g, b) { // RGB --> HSL
            r /= 255;
            g /= 255;
            b /= 255;
            let c_max = Math.max(r, g, b);
            let c_min = Math.min(r, g, b);
            let delta = c_max - c_min;
            let h, s, l;

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

            l = (c_max + c_min) / 2;
            s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

            return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
        }
        hsl2hsv(h, s, l) { // HSL --> HSV
            h /= 360;
            s /= 100;
            l /= 100;
        
            let v = l + s * Math.min(l, 1 - l);
            let sv = v === 0 ? 0 : 2 * (1 - l / v);
            return [Math.round(h * 360), Math.round(sv * 100), Math.round(v * 100)];
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
        rgb2xyz(r, g, b) { // RGB --> XYZ
            r /= 255;
            g /= 255;
            b /= 255;
            let x, y, z;

            const rGamma = r <= 0.04045 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
            const gGamma = g <= 0.04045 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
            const bGamma = b <= 0.04045 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

            x = (rGamma * 41.24064 + gGamma * 35.75573 + bGamma * 18.05696);
            y = (rGamma * 21.26729 + gGamma * 71.51522 + bGamma * 7.21750);
            z = (rGamma * 1.93339 + gGamma * 11.91920 + bGamma * 95.03041);

            return [Math.round(x), Math.round(y), Math.round(z)];
        }
        xyz2rgb(x, y, z) { // XYZ --> RGB
            x /= 100;
            y /= 100;
            z /= 100;
            let r, g, b;

            r = x * 3.2406 + y * -1.5372 + z * -0.4986;
            g = x * -0.9689 + y * 1.8758 + z * 0.0415;
            b = x * 0.0557 + y * -0.2040 + z * 1.0570;

            r = r <= 0.0031308 ? r * 12.92 : 1.055 * Math.pow(r, 1 / 2.4) - 0.055;
            g = g <= 0.0031308 ? g * 12.92 : 1.055 * Math.pow(g, 1 / 2.4) - 0.055;
            b = b <= 0.0031308 ? b * 12.92 : 1.055 * Math.pow(b, 1 / 2.4) - 0.055;

            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        }
        xyz2lab(x, y, z) { // XYZ --> LAB
            x /= 100;
            y /= 100;
            z /= 100;

            const epsilon = 0.008856;
            const kappa = 903.3;
            const fy = y > epsilon ? Math.pow(y, 1 / 3) : (kappa * y + 16) / 116;
            const fx = x > epsilon ? Math.pow(x, 1 / 3) : (kappa * x + 16) / 116;
            const fz = z > epsilon ? Math.pow(z, 1 / 3) : (kappa * z + 16) / 116;
            const l = 116 * fy - 16;
            const a = (fx - fy) * 500;
            const b = (fy - fz) * 200;

            return [Math.round(l), Math.round(a), Math.round(b)];
        }
        lab2xyz(l, a, b) { // LAB -- > XYZ
            const epsilon = 0.008856;
            const kappa = 903.3;
            const fy = (l + 16) / 116;
            const y = fy > epsilon ? Math.pow(fy, 3) : l / kappa;

            const fx = a / 500 + fy;
            const x = fx > epsilon ? Math.pow(fx, 3) : (116 * fx - 16) / kappa;

            const fz = fy - b / 200;
            const z = fz > epsilon ? Math.pow(fz, 3) : (116 * fz - 16) / kappa;

            return [Math.round(x * 100), Math.round(y * 100), Math.round(z * 100)];
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
        let hsl = `${COLOR.hsl[0]}, ${COLOR.hsl[1]}%, ${COLOR.hsl[2]}%`;
        $("#hsl").val(hsl);
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
    function hslUpdate() {
        let i = 0;
        $(".subcont input[model='hsl']").each(function () {
            $(this).val(COLOR.hsl[i++]);
        })
    }
    function cmykUpdate() {
        let i = 0;
        $(".subcont input[model='cmyk']").each(function () {
            $(this).val(COLOR.cmyk[i++]);
        })
    }
    function xyzUpdate() {
        let i = 0;
        $(".subcont input[model='xyz']").each(function () {
            $(this).val(COLOR.xyz[i++]);
        })
    }
    function labUpdate() {
        let i = 0;
        $(".subcont input[model='lab']").each(function () {
            $(this).val(COLOR.lab[i++]);
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
                        hslUpdate();
                        cmykUpdate();
                        xyzUpdate();
                        labUpdate();
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
                        hslUpdate();
                        cmykUpdate();
                        xyzUpdate();
                        labUpdate();
                    }
                    break;
                case "hsl":
                    if (!$(this).val() || parseInt($(this).val()) < 0 ||
                        ($(this).attr("max") == "360" && parseInt($(this).val()) > 360) ||
                        ($(this).attr("max") == "100" && parseInt($(this).val()) > 100)) {
                        colorError();
                    } else {
                        let hsl = [];
                        $(".subcont input[model='hsl']").each(function () {
                            hsl.push(parseInt($(this).val()));
                        })
                        COLOR = new CM('hsl', hsl[0], hsl[1], hsl[2]);
                        colorUpdate();
                        rgbUpdate();
                        hsvUpdate();
                        cmykUpdate();
                        xyzUpdate();
                        labUpdate();
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
                        hslUpdate();
                        xyzUpdate();
                        labUpdate();
                    }
                    break;
                case "xyz":
                    if (!$(this).val() || parseInt($(this).val()) < 0 || parseInt($(this).val()) > 100) {
                        colorError();
                    } else {
                        let xyz = [];
                        $(".subcont input[model='xyz']").each(function () {
                            xyz.push(parseInt($(this).val()));
                        })
                        COLOR = new CM('xyz', xyz[0], xyz[1], xyz[2]);
                        colorUpdate();
                        rgbUpdate();
                        hsvUpdate();
                        hslUpdate();
                        cmykUpdate();
                        labUpdate();
                    }
                    break;
                case "lab":
                    if (!$(this).val() || ($(this).attr("min") == "-128" && parseInt($(this).val()) < -128) ||
                        ($(this).attr("min") == "0" && parseInt($(this).val()) < 0) ||
                        ($(this).attr("max") == "128" && parseInt($(this).val()) > 128) ||
                        ($(this).attr("max") == "100" && parseInt($(this).val()) > 100)
                    ) {
                        colorError();
                    } else {
                        let lab = [];
                        $(".subcont input[model='lab']").each(function () {
                            lab.push(parseInt($(this).val()));
                        })
                        COLOR = new CM('lab', lab[0], lab[1], lab[2]);
                        colorUpdate();
                        rgbUpdate();
                        hsvUpdate();
                        hslUpdate();
                        cmykUpdate();
                        xyzUpdate();
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
                case "hsl":
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

                case "xyz":
                    if (c1 < 0 || c2 < 0 || c3 < 0 || c1 > 100 || c2 > 100 || c3 > 100) {
                        colorError();
                        error = true;
                    }
                    break;

                case "lab":
                    if (c1 < 0 || c2 < -128 || c3 < -128 || c1 > 100 || c2 > 128 || c3 > 128) {
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
                hslUpdate();
                cmykUpdate();
                xyzUpdate();
                labUpdate();
            }

        }
    });

})