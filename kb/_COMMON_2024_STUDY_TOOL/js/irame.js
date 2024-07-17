/**
 * copyright 2024, (c)케이브레인컴퍼니 All rights reserved
 */
(function (win) {
    win.kbc_iframe = {
        _name: "kbc_iframe",
        zoom: 1,
        
        async iframe_init() {
            const p = kbc_iframe;
            const iframe_wrap = document.querySelector('iframe.content_frm');

            p.resizer = new p.Resize_obs_class();
            p.resizer.add_dom(document.body, iframe_wrap);
            p.resizer.resize();

        },//ok
        
        Resize_obs_class: class Resize_obs_class {
            constructor() {
                this.resize_observer = new ResizeObserver(this.resize.bind(this));

                this.check_dom = null;
                this.change_dom = null;
                this.init_w = 1280;
                this.init_h = 720;
            }

            add_dom(dom, node_dom) {
                this.resize_observer.observe(dom);
                this.check_dom = dom;
                this.change_dom = node_dom;
            }

            resize() {
                let clw = this.check_dom.clientWidth;
                let clh = this.check_dom.clientHeight;

                let hzoom = clw / this.init_w;
                let vzoom = clh / this.init_h;

                let zoom = 1;
                kbc_iframe.zoom = zoom = (hzoom > vzoom) ? vzoom : hzoom;
                this.change_dom.style.transform = 'scale(' + zoom + ') translate(-50%, -50%)';
                this.change_dom.style.transformOrigin = "left top";
            }
        },//ok
    };
})(window);
