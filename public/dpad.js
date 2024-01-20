const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const dpadSize = 100;
const dpadX = 50;
const dpadY = 50;
const buttonSize = dpadSize / 3;

export class Dpad {
    #x;
    #y;


    constructor() { }



    draw() {
        // Dibuja los botones (arriba, abajo, izquierda, derecha)
        ctx.fillStyle = 'gray';
        ctx.fillRect(dpadX + buttonSize, dpadY, buttonSize, buttonSize); // Arriba
        ctx.fillRect(dpadX + buttonSize, dpadY + 2 * buttonSize, buttonSize, buttonSize); // Abajo
        ctx.fillRect(dpadX, dpadY + buttonSize, buttonSize, buttonSize); // Izquierda
        ctx.fillRect(dpadX + 2 * buttonSize, dpadY + buttonSize, buttonSize, buttonSize); // Derecha
    }
}