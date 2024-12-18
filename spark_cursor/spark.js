$(function () {
    sparkFn();
});


function sparkFn() {
    // const sparkColor = ['#ff758c', '#89f7fe', '#ff9a9e', '#b7f8db', '#005aa7', '#a8c0ff', '#dd1818', '#40e0d0'];

    function generateRandomColors(num) {
        //make an array
        var arr = []
        //add num random colors to arr
        for (var i = 0; i < num; i++) {
            //get random color and push into arr
            arr.push(randomColor())
        }
        //return that array
        let colorArr = arr.join('');
        return colorArr;
    }

    function randomColor() {
        //pick a 'red' from 0 - 255
        var r = Math.floor(Math.random() * 256);
        //pick a 'green' from 0 - 255
        var g = Math.floor(Math.random() * 256);
        //pick a 'blue' from 0 - 255
        var b = Math.floor(Math.random() * 256)
        return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    }

    class ClickSpark extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: "open" });
            this.strokeNum = 8;
            this.colorNum = 0;
        }

        connectedCallback() {
            this.shadowRoot.innerHTML = this.createSpark();
            this.svg = this.shadowRoot.querySelector("svg");
            this._parent = this.parentNode;
            this._parent.addEventListener("click", this);
        }

        disconnectedCallback() {
            this._parent.removeEventListener("click", this);
            delete this._parent;
        }

        handleEvent(e) {
            this.resetColor();
            this.setSparkPosition(e);
            this.animateSpark();
        }

        animateSpark() {
            let sparks = [...this.svg.children];
            let size = parseInt(sparks[0].getAttribute("y1"));
            let offset = size / 2 + "px";

            this.svg.style.setProperty("stroke", generateRandomColors(1))

            let keyframes = (i) => {
                let deg = `calc(${i} * (360deg / ${sparks.length}))`;

                return [
                    {
                        strokeDashoffset: size * 3,
                        transform: `rotate(${deg}) translateY(${offset})`
                    },
                    {
                        strokeDashoffset: size,
                        transform: `rotate(${deg}) translateY(0)`
                    }
                ];
            };

            let options = {
                duration: 660,
                easing: "cubic-bezier(0.25, 1, 0.5, 1)",
                fill: "forwards"
            };

            sparks.forEach((spark, i) => spark.animate(keyframes(i), options));
        }

        setSparkPosition(e) {
            this.style.left = e.pageX - this.clientWidth / 2 + "px";
            this.style.top = e.pageY - this.clientHeight / 2 + "px";
        }

        resetColor() {
            this.colorNum = Math.floor(Math.random() * 8);
        }

        createSpark() {
            return `
                <style>
                    :host {
                        position: absolute;
                        pointer-events: none;
                        z-index: 999;
                    }
                </style>
                <svg width="25" height="25" viewBox="0 0 100 100" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" transform="rotate(-20)">
                    ${Array.from({ length: 8 }, (_) => `<line x1="50" y1="30" x2="50" y2="4" stroke-dasharray="30" stroke-dashoffset="30" style="transform-origin: center" />`).join("")}
                </svg>
            `;
        }
        // stroke="${sparkColor[this.colorNum]}" -> random colors
        // stroke="var(--click-spark-color, currentcolor)"
    }

    customElements.define("click-spark", ClickSpark);

    const spark = document.createElement("click-spark");
    document.body.appendChild(spark);
}
