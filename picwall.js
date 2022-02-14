function initCanvas(el) {
    // Load font example
    const font1 = new FontFace("badscriptregular", 'url("BadScriptRegular.ttf")');
    // const font2 = new FontFace("sample2", 'url("sample2.ttf")');
    const fontLoad = Promise.all([
        font1.load().then(font => document.fonts.add(font)),
        // font2.load().then(font => document.fonts.add(font))
    ]);

    var over = false, overlast = false;

    var camera = {
        x: 0,
        y: -10,
        z       : 10000,
        zEye: -101,
        visible: true,

        zoom: function (z) {

            var z0 = this.zEye - z;
            if (z0 > 0) z0 = -0.1;
            z0 = this.zEye / z0;
            this.visible = (z > this.zEye * 0.9);
            return z0;

        },

        ease: function (pointer) {
            var xm = (canvas.centerX - pointer.offsetX) * (250 / canvas.centerX);
            var ym = (canvas.centerY - pointer.offsetY) * (110 / canvas.centerY);

            this.x += (xm - this.x) / 20;
            this.y += (pointer.offsetZ - this.y) / 20;
            this.z += (ym - this.z) / 20;
        }
    };

    const TextLight = function (title, text, x, y, z) {
        this.x = x * 100;
        this.y = y * 100;
        this.z = z * 100;

        this.text = document.createElement('canvas');
        const ict = this.text.getContext('2d');
        this.text.width = 1500;
        this.text.height = 400;

        ict.textAlign = 'center';
        const lgColor = ict.createLinearGradient(0, 0, 1500, 400);
        lgColor.addColorStop(0, "#FF0000");
        lgColor.addColorStop(1, "#00FF00");
        ict.fillStyle = lgColor;
        ict.textAlign = 'center';

        ict.font = '140px badscriptregular';
        ict.fillText(title, 750, 140);
        ict.font = '48px badscriptregular';
        ict.fillText(text, 750, 220);

        fontLoad.then(() => {
            ict.clearRect(0, 0, this.text.width, this.text.height);

            ict.font = '140px badscriptregular';
            ict.fillText(title, 750, 140);
            ict.font = '48px badscriptregular';
            ict.fillText(text, 750, 220);
        });
    };
    TextLight.prototype.anim = function () {
        const z1 = camera.zoom(camera.y + this.z - 5);
        let x = (camera.x + this.x - 500) * z1;
        let y = (camera.z + this.y + 35) * z1;

        ctx.drawImage(this.text,

            canvas.centerX + x,
            canvas.centerY + y,
            1500 * z1,
            400 * z1
        );
    };


    var Wall = function (x, y, z) {

        this.x = x;
        this.y = y;
        this.z = z;

    };
    Wall.prototype.anim = function () {

        ctx.beginPath();
        ctx.fillStyle = '#fff';

        for (var i = 0; i < 4; i++) {

            var z0 = camera.zoom(camera.y + this.z[i] * 100);
            ctx.lineTo(
                canvas.centerX + (camera.x + this.x[i] * 100) * z0,
                canvas.centerY + (camera.z + this.y[i] * 100) * z0
            );

        }

        ctx.fill();
    };


    var Pict = function (img, title, text, x, y, z, w, h, id) {
        this.imgname = img;
        this.id = id;
        this.x = x * 100;
        this.y = y * 100;
        this.z = z * 100;
        this.w = w * 100;
        this.h = h * 100;

        this.imgLoaded = false;
        this.fontLoaded = false;

        this.img = document.createElement('canvas');
        this.img.width = 1000;
        this.img.height = 1000;
        this.text = document.createElement('canvas');
        this.text.width = 1000;
        this.text.height = 300;

        this.srcimg = new Image();
        this.srcimg.src = img;

        // 绘制加载前的东西
        // 绘制空图片
        const imageCtx = this.img.getContext('2d');
        imageCtx.fillStyle = 'rgba(0,0,0,0.3)';
        imageCtx.fillRect(0, 0, 1000, 1000);
        imageCtx.textAlign = 'center';
        imageCtx.font = 'bold 130px';
        imageCtx.fillText("Loading...", 500, 500);

        const textCtx = this.text.getContext('2d');
        textCtx.textAlign = 'center';
        textCtx.fillStyle = '#ddd';
        textCtx.font = 'bold 140px gjmmd';
        textCtx.fillText(title, 500, 120);
        textCtx.font = '72px gjmmd';
        textCtx.fillText(text, 500, 200);

        this.srcimg.onload = function () {
            imageCtx.clearRect(0, 0, this.img.width, this.img.height);

            imageCtx.fillRect(0, 0, 1000, 1000);
            imageCtx.drawImage(this.srcimg, 100, 100, 800, 800);

            this.imgLoaded = true;
        }.bind(this);

        fontLoad.then(() => {
            textCtx.clearRect(0, 0, this.text.width, this.text.height);

            textCtx.font = 'bold 140px gjmmd';
            textCtx.fillText(title, 500, 120);
            textCtx.font = '72px gjmmd';
            textCtx.fillText(text, 500, 200);

            this.fontLoaded = true;
        });
    };
    Pict.prototype.isPointerInside = function (x, y, z0) {
        return pointer.x > canvas.centerX + x &&
            pointer.y > canvas.centerY + y &&
            pointer.x < canvas.centerX + x + this.w * z0 &&
            pointer.y < canvas.centerY + y + this.h * z0;
    }
    Pict.prototype.anim = function () {

        var z0 = camera.zoom(camera.y + this.z);

        if (camera.visible) {

            var x = (camera.x + this.x) * z0,
                y = (camera.z + this.y) * z0;

            if (this.isPointerInside(x, y, z0)) {
                over = this;
            }

            ctx.drawImage(this.img,
                canvas.centerX + x,
                canvas.centerY + y,
                this.w * z0,
                this.h * z0
            );
            if (z0 > 0.3) {

                var z1 = camera.zoom(camera.y + this.z - 5); // Text is in front of image
                x = (camera.x + this.x + (this.w - 100) * 0.5) * z1;
                y = (camera.z + this.y + this.h - 30) * z1;

                ctx.drawImage(this.text,

                    canvas.centerX + x,
                    canvas.centerY + y,
                    100 * z1,
                    30 * z1
                );

            }

        }

    };

    var anim = function () {

        over = false;

        for (
            var i = 0, that;
            (that = objects[i++]);
            that.anim()
        ) ;

        if (over !== overlast) {

            overlast = over;
            canvas.elem.style.cursor = over ? 'pointer' : 'default';

        }

        // // Debug, last touch point
        // ctx.fillStyle = 'red';
        // ctx.fillRect(pointer.x, pointer.y, 5, 5);

    }


    // main loop

    var run = function () {

        requestAnimFrame(run);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        camera.ease(pointer);
        anim();
    }

    var canvas = {

        // elem: document.createElement('canvas'),
        elem: el,

        resize: function () {

            this.left = 0;
            this.top = 0;
            this.width = this.elem.width = this.elem.offsetWidth;
            this.height = this.elem.height = this.elem.offsetHeight;
            this.centerX = this.width / 2;
            this.centerY = this.height / 2;

        },
        init: function () {

            var ctx = this.elem.getContext('2d');
            // document.body.appendChild(this.elem);
            window.addEventListener('resize', this.resize.bind(this), false);
            this.resize();
            return ctx;

        }

    };

    var ctx = canvas.init();
    var requestAnimFrame = window.__requestAnimationFrame || requestAnimationFrame;

    var pointer = (function (canvas) {

        var scaling = false, oldDist = null;

        var pointer = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            z: 10,
            canvas: canvas,
            touchMode: false,

            // maybe I should make these be local variable
            isTouchStarted: false,
            isTouchMoved: false,
            oldTouchPointX: null,
            oldTouchPointY: null,
            offsetX: canvas.width / 2,
            // offsetY: canvas.height / 2,
            offsetY: -115,
            offsetZ: 10,
        };

        var distance = function (dx, dy) {
            return Math.sqrt(dx * dx + dy * dy);
        };

        [
            [window, 'mousemove,touchmove', function (e) {

                this.touchMode = e.targetTouches;
                e.preventDefault();
                if (scaling && this.touchMode) {
                    this.isTouchMoved = true;
                    var x0 = this.touchMode[0].clientX,
                        x1 = this.touchMode[1].clientX,
                        y0 = this.touchMode[0].clientY,
                        y1 = this.touchMode[1].clientY;
                    let midX = (x0 + x1) / 2;
                    let midY = (y0 + y1) / 2;
                    var d = distance(x0 - x1, y0 - y1);
                    let s = (oldDist - d) * 0.1;
                    oldDist = d;
                    this.offsetZ += s;
                    if (this.offsetZ < -160) {
                        this.offsetZ = -160;
                    }

                    let dx = midX - this.oldTouchPointX;
                    let dy = midY - this.oldTouchPointY;
                    pointer.offsetX += dx;
                    pointer.offsetY += dy;
                    this.oldTouchPointX = midX;
                    this.oldTouchPointY = midY;

                    return;
                }

                let touchPoint = this.touchMode ? this.touchMode[0] : e;
                this.x = touchPoint.clientX - this.canvas.left;
                this.y = touchPoint.clientY - this.canvas.top;
                if (this.isTouchStarted) {
                    let dx = touchPoint.clientX - this.oldTouchPointX;
                    let dy = touchPoint.clientY - this.oldTouchPointY;
                    this.oldTouchPointX = touchPoint.clientX;
                    this.oldTouchPointY = touchPoint.clientY;
                    pointer.offsetX -= dx;
                    pointer.offsetY -= dy;
                    this.isTouchMoved = true;
                    // add a bound to avoid camera goes too far
                    if (pointer.offsetX < 0) {
                        pointer.offsetX = 0;
                    } else if (pointer.offsetX > canvas.width) {
                        pointer.offsetX = canvas.width;
                    }
                }

            }],
            [canvas.elem, 'mousedown,touchstart', function (e) {
                this.touchMode = e.targetTouches;
                e.preventDefault();
                if (this.touchMode && e.touches.length === 2) {
                    scaling = true;
                    // 获取触摸中心和触摸距离
                    var x0 = this.touchMode[0].clientX,
                        x1 = this.touchMode[1].clientX,
                        y0 = this.touchMode[0].clientY,
                        y1 = this.touchMode[1].clientY;
                    this.oldTouchPointX = (x0 + x1) / 2;
                    this.oldTouchPointY = (y0 + y1) / 2;
                    oldDist = distance(x0 - x1, y0 - y1);
                } else {
                    this.isTouchStarted = true;
                    var pointer = this.touchMode ? this.touchMode[0] : e;
                    this.oldTouchPointX = pointer.clientX;
                    this.oldTouchPointY = pointer.clientY;
                    this.x = pointer.clientX - this.canvas.left;
                    this.y = pointer.clientY - this.canvas.top;
                    anim();
                }

            }],
            [canvas.elem, 'mouseup,touchend', function (e) {
                e.preventDefault();
                let remainingTouches = 0;

                if (!e.targetTouches) {
                    // 说明是鼠标抬起
                } else {
                    // 触摸抬起
                    remainingTouches = e.targetTouches.length;
                    scaling = remainingTouches >= 2;

                    // 从2降到1时，记住新的触摸点
                    if (remainingTouches === 1) {
                        this.oldTouchPointX = e.targetTouches[0].clientX;
                        this.oldTouchPointY = e.targetTouches[0].clientY;
                        oldDist = null;
                    }
                }

                if (!this.isTouchMoved) {
                    // Main Click Event
                    if (over) {
                        console.log(over);

                        // get the new 'center'
                        let newOffsetX = canvas.centerX + (over.x + over.w / 2) * canvas.centerX / 250,
                            newOffsetY = canvas.centerY + (over.y + over.h / 2) * canvas.centerY / 110,
                            newOffsetZ = -80 - over.z;

                        // function moveTo(x, y, z) {
                        //     let newOffsetX = canvas.centerX + (over.x + over.w / 2) * canvas.centerX / 250,
                        //         newOffsetY = canvas.centerY + (over.y + over.h / 2) * canvas.centerY / 110,
                        //         newOffsetZ = -80 - over.z;
                        //     return [newOffsetX, newOffsetY, newOffsetZ];
                        // }

                        if (Math.abs(this.offsetX - newOffsetX) < 10
                            && Math.abs(this.offsetY - newOffsetY) < 10
                            && Math.abs(this.offsetZ - newOffsetZ < 10)) {

                            console.log(`Picture ${over.id} Clicked again`);
                            // TODO: add your own callback
                        } else {
                            this.offsetX = newOffsetX;
                            this.offsetY = newOffsetY;
                            this.offsetZ = newOffsetZ;

                            console.log(`Move to picture ${over.id}`)
                        }

                    } else {
                        if (this.offsetY < -20000) {
                            this.offsetY = 0;
                            return;
                        }

                        // Find the prev picture, and move the camera to it.
                        let i = -1;
                        for (i = 0; i < pics.length; i++) {
                            const p = pics[i];
                            if (this.offsetZ < -70 - p.z) {
                                break;
                            }
                        }
                        if (++i < pics.length) {
                            let p = pics[i];
                            this.offsetX = canvas.centerX + (p.x + p.w / 2) * canvas.centerX / 250;
                            this.offsetY = canvas.centerY + (p.y + p.h / 2) * canvas.centerY / 110;
                            this.offsetZ = -80 - p.z;
                        } else {
                            this.offsetX = canvas.centerX;
                            this.offsetY = -115;
                            this.offsetZ = 10;
                        }
                    }
                }

                if (remainingTouches === 0) {
                    this.isTouchStarted = false;
                    this.oldTouchPointX = null;
                    this.oldTouchPointY = null;
                    this.isTouchMoved = false;
                }
            }]
        ].forEach(function (e) {
            for (var i = 0, events = e[1].split(','); i < events.length; i++) {
                e[0].addEventListener(events[i], e[2].bind(pointer), false);
            }
        }.bind(pointer));

        window.addEventListener('wheel', function (e) {
            var s = e.deltaY > 0 ? -10 : 10;
            this.offsetZ += s;
            if (this.offsetZ < -160) this.z = -160;
        }.bind(pointer), false);

        return pointer;

    }(canvas));

    // walls
    var objects = [];

    const walls = [
        new Wall(
            [-2.5, -2.5, -2.5, -2.5],
            [-1, -1, 1, 1],
            [-1, 1, 1, -1]
        ),
        new Wall(
            [-2.5, 2.5, 2.5, -2.5],
            [-1, -1, 1, 1],
            [1, 1, 1, 1]
        ),
        new Wall(
            [2.5, 2.5, 2.5, 2.5],
            [-1, -1, 1, 1],
            // [1, -.5, -.5, 1]
            [1, -1, -1, 1]
        ),
        new Wall(
            [2.5, 2.7, 2.7, 2.5],
            [-1, -1, 1, 1],
            // [-.5, -.5, -.5, -.5]
            [-1, -1, -1, -1]
        ),
        new Wall(
            [-2.5, -2.7, -2.7, -2.5],
            [-1, -1, 1, 1],
            [-1, -1, -1, -1]
        ),
        new Wall(
            [-2.5, -2.5, -2.7, -2.7],
            [-1, -1, -1, -1],
            [1, -1, -1, 1]
        ),
        new Wall(
            [2.5, 2.5, 2.7, 2.7],
            [-1, -1, -1, -1],
            [1, -1, -1, 1]
        ),
    ];

    const picturesConfig = [
        {
            path: '1.jpg',
            title: 'he knew',
            description: 'No explanation needed',
            id: 1,
            xyzwh: [-1, -.8, .8, 2, 1.4],
        },
        {
            path: '2.jpg',
            title: 'New life',
            description: 'Here you come!',
            id: 2,
            xyzwh: [-2, -0.7, .4, 2, 1.4],
        },
        {
            path: '3.jpg',
            title: 'Inside',
            description: "I'm now trapped, without hope of escape",
            id: 3,
            xyzwh: [0.5, -.6, .2, 2, 1.4],
        },
        {
            path: '4.jpg',
            title: 'Of course',
            description: "2 fingers can move ↑↓, too",
            id: 4,
            xyzwh: [-1.5, -0.8, 0, 1.5, 2],
        },
        {
            path: '5.jpg',
            title: 'Click blank',
            description: "to go back",
            id: 5,
            xyzwh: [.5, -1, -.4, 1.5, 2],
        },
        {
            path: '6.jpg',
            title: 'Click again',
            description: "to trigger another event",
            id: 6,
            xyzwh: [-2, -1, -.8, 1.5, 2],
        },
    ];
    const pics = picturesConfig.map(p => new Pict(p.path, p.title, p.description, ...p.xyzwh, p.id));

    walls.forEach(w => objects.push(w));
    objects.push(new TextLight(
        "This is a title", "   Author: xixiaxixi",
        -2.5, -5, 1
    ));
    pics.forEach(p => objects.push(p));

    run();


    // These are just for debug

    // 调试 暴露objects
    window.objects = objects;
    // 调试 暴露pointer
    window.pointer = pointer;
    // 调试 暴露camera
    window.camera = camera;
    // 调试 暴露canvas
    window.canvas = canvas;

    return {
        objects, pointer, camera, canvas, ctx, Pict, Wall
    }
}
