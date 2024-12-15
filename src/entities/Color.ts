const colors = new Map([
    ['green', [203, 240, 120]],
    ['yellow', [248, 243, 152]],
    ['orange', [241, 185, 99]],
    ['magenta', [228, 97, 97]],
    ['red', [244, 97, 97]],
    ['blue', [97, 97, 244]],
    ['cyan', [97, 244, 244]],
    ['purple', [244, 97, 244]],
    ['black', [0, 0, 0]],
    ['white', [255, 255, 255]],
    ['salmon', [250, 128, 114]],
    ['olive', [128, 128, 0]],
    ['navy', [0, 0, 128]],
    ['teal', [0, 128, 128]],
    ['maroon', [128, 0, 0]],
    ['fuchsia', [255, 0, 255]],
    ['aqua', [0, 255, 255]],
    ['olive', [128, 128, 0]],
    ['saddlebrown', [139, 69, 19]],
    ['sienna', [160, 82, 45]],
    ['olivedrab', [107, 142, 35]],
    ['darkgreen', [0, 100, 0]],
    ['darkblue', [0, 0, 139]],
    ['darkred', [139, 0, 0]],
    ['darkviolet', [148, 0, 211]],
    ['darkmagenta', [139, 0, 139]],
    ['electricBlue', [0, 191, 255]],
    ['electricCyan', [0, 255, 255]],
]);


export default class Color {
    colorName: string | undefined;
    alpha: number = 1;
    rgb: string;
    constructor(colorName: string, alpha: number = Math.random()) {

        this.alpha = (alpha < 0 || alpha > 1) ? 1 : alpha;
        this.colorName = colorName;

        if (colorName === 'random') {
            this.rgb = this.generateRandomRGBColor();
        } else {
            const color = colors.get(this.colorName);
            if (color) {
                this.rgb = `rgb(${color[0]}, ${color[1]}, ${color[2]}, ${this.alpha})`;
            } else {
                this.rgb = this.generateRandomRGBColor();
            }
        }
    }

    generateRandomRGBColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b}, ${this.alpha})`;
    }
}