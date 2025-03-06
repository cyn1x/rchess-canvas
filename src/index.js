"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b;
class Network {
    constructor() { }
    connect(addr) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.socket = new WebSocket(addr);
                this.socket.addEventListener("open", (event) => {
                    console.debug("Connected to server");
                    resolve();
                });
                this.socket.addEventListener("error", (event) => {
                    console.error("WebSocket error", event);
                    reject(new Error("Failed to connect"));
                });
                this.socket.addEventListener("close", (event) => {
                    console.debug("WebSocket closed", event);
                });
                this.socket.addEventListener("message", (event) => {
                    console.log("Message from server:", event.data);
                });
            });
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.socket.close();
            console.log("WebSocket closed");
        });
    }
    isConnected() {
        if (this.socket) {
            return this.socket.readyState === this.socket.OPEN;
        }
        return null;
    }
}
class Graphics {
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
    }
    getCanvas() { return this.canvas; }
    getContext() { return this.ctx; }
}
class State {
    constructor() {
        this.activeSquare = ["", 0];
    }
    getActiveSquare() {
        return this.activeSquare;
    }
    setActiveSquare(square) {
        this.activeSquare = square;
    }
}
class Board {
    constructor() {
        this.files = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        this.ranks = [8, 7, 6, 5, 4, 3, 2, 1];
    }
    getFiles() { return this.files; }
    getRanks() { return this.ranks; }
    setSquares(squares) { this.squaresArray = squares; }
    getSquares() { return this.squaresArray; }
}
class Square {
    constructor(id, x, y, w, h) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    getId() { return this.id; }
    getX() { return this.x; }
    getY() { return this.y; }
    getWidth() { return this.w; }
    getHeight() { return this.h; }
    setX(x) { this.x = x; }
    setY(y) { this.y = y; }
    setWidth(w) { this.w = w; }
    setHeight(h) { this.h = h; }
}
function initialise() {
    const files = board.getFiles();
    const ranks = board.getRanks();
    const sw = gfx.getCanvas().width / 8; // square width
    const sh = gfx.getCanvas().width / 8; // square height
    const squaresArray = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            squaresArray[i + j * 8] = new Square(files[i] + ranks[j], i * sw, j * sh, sw, sh);
        }
    }
    board.setSquares(squaresArray);
}
function draw() {
    const ctx = gfx.getContext();
    const squaresArray = board.getSquares();
    let rank = 0;
    for (let i = 0; i < squaresArray.length; i++) {
        const x = squaresArray[i].getX();
        const y = squaresArray[i].getY();
        const w = squaresArray[i].getWidth();
        const h = squaresArray[i].getHeight();
        if (i % 8 === 0) {
            rank++;
        }
        setSquareColours(i, rank);
        ctx.strokeRect(x, y, w, h);
        ctx.fillRect(x, y, w, h);
    }
}
function setSquareColours(i, rank) {
    const ctx = gfx.getContext();
    if ((i + rank) % 2 !== 0) {
        ctx.strokeStyle = '#1a1a1a';
        ctx.fillStyle = '#f2f2f2';
    }
    else {
        ctx.strokeStyle = '#f2f2f2';
        ctx.fillStyle = '#1a1a1a';
    }
}
function handleClick(event) {
    const mouseEvent = event;
    const cx = mouseEvent.offsetX;
    const cy = mouseEvent.offsetY;
    const ctx = gfx.getContext();
    const squaresArray = board.getSquares();
    for (let i = 0; i < squaresArray.length; i++) {
        const sx = squaresArray[i].getX();
        const sy = squaresArray[i].getY();
        const sw = squaresArray[i].getWidth();
        const sh = squaresArray[i].getHeight();
        if (cx >= sx && cx <= sx + sw && cy >= sy && cy <= sy + sh) {
            const activeSquare = state.getActiveSquare();
            if (activeSquare) {
                // setSquareColours(activeSquare);
            }
            const clickedSquare = squaresArray[i].getId();
            const file = clickedSquare[0];
            const rank = Number(clickedSquare[1]);
            const pair = [file, rank];
            state.setActiveSquare(pair);
            console.log(state.getActiveSquare());
            ctx.fillStyle = "#ccf2ff";
            ctx.fillRect(sx, sy, sw, sh);
        }
    }
}
function handleConnect(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        if (net.isConnected()) {
            net.disconnect();
            return;
        }
        const input = document.getElementById('server-addr');
        const addr = input.value || "ws://localhost:8080";
        console.log(addr);
        try {
            yield net.connect(addr);
            console.log("Connected:", net);
        }
        catch (error) {
            console.error("Connection failed:", error);
        }
    });
}
function handleSend(event) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
const net = new Network();
const gfx = new Graphics();
const state = new State();
const board = new Board();
(_a = document.getElementById('connect-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (event) => {
    const connectBtn = event.target;
    const sendBtn = document.getElementById('send-btn');
    connectBtn === null || connectBtn === void 0 ? void 0 : connectBtn.setAttribute("disabled", "disabled");
    handleConnect(event).then(() => {
        const statusMsg = document.getElementById('server-status');
        if (net.isConnected()) {
            connectBtn.innerHTML = "Disconnect";
            statusMsg.innerHTML = "connected";
            statusMsg === null || statusMsg === void 0 ? void 0 : statusMsg.style.setProperty("color", "lightgreen");
            sendBtn === null || sendBtn === void 0 ? void 0 : sendBtn.removeAttribute("disabled");
        }
        else {
            connectBtn.innerHTML = "Connect";
            statusMsg.innerHTML = "disconnected";
            statusMsg === null || statusMsg === void 0 ? void 0 : statusMsg.style.setProperty("color", "lightcoral");
            sendBtn === null || sendBtn === void 0 ? void 0 : sendBtn.setAttribute("disabled", "disabled");
        }
        connectBtn === null || connectBtn === void 0 ? void 0 : connectBtn.removeAttribute("disabled");
    });
});
(_b = document.getElementById('connect-btn')) === null || _b === void 0 ? void 0 : _b.addEventListener("click", (event) => { handleSend(event); });
gfx.getCanvas().addEventListener("click", (event) => { handleClick(event); }, false);
initialise();
draw();
