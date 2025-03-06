class Network {
    private socket!: WebSocket;

    constructor() { }

    async connect(addr: string): Promise<void> {
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
    }

    async disconnect() {
        this.socket.close();
        console.log("WebSocket closed");
    }

    isConnected() {
        if (this.socket) {
            return this.socket.readyState === this.socket.OPEN;
        }
        return null;
    }

}

class Graphics {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor() {
        this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
        this.ctx = <CanvasRenderingContext2D>this.canvas.getContext("2d");
    }

    getCanvas() { return this.canvas; }
    getContext() { return this.ctx; }
}

class State {
    private activeSquare: [string, number];

    constructor() {
        this.activeSquare = ["", 0];
    }

    getActiveSquare() {
        return this.activeSquare;
    }

    setActiveSquare(square: [string, number]) {
        this.activeSquare = square;
    }

}

class Board {
    private files: Array<string>;
    private ranks: Array<number>;
    private squaresArray!: Array<Square>;

    constructor() {
        this.files = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        this.ranks = [8, 7, 6, 5, 4, 3, 2, 1];
    }

    getFiles() { return this.files; }
    getRanks() { return this.ranks; }
    setSquares(squares: Array<Square>) { this.squaresArray = squares; }
    getSquares() { return this.squaresArray; }

}

class Square {
    private id: string;
    private x: number;
    private y: number;
    private w: number;
    private h: number;

    constructor(id: string, x: number, y: number, w: number, h: number) {
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

    setX(x: number) { this.x = x; }
    setY(y: number) { this.y = y; }
    setWidth(w: number) { this.w = w; }
    setHeight(h: number) { this.h = h; }

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

        if (i % 8 === 0) { rank++; }

        setSquareColours(i, rank);

        ctx.strokeRect(x, y, w, h);
        ctx.fillRect(x, y, w, h);
    }

}

function setSquareColours(i: number, rank: number) {
    const ctx = gfx.getContext();

    if ((i + rank) % 2 !== 0) {
        ctx.strokeStyle = '#1a1a1a';
        ctx.fillStyle = '#f2f2f2';
    } else {
        ctx.strokeStyle = '#f2f2f2';
        ctx.fillStyle = '#1a1a1a';
    }

}

function handleClick(event: Event) {
    const mouseEvent = event as MouseEvent;
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
            const file: string = clickedSquare[0];
            const rank: number = Number(clickedSquare[1]);
            const pair: [string, number] = [file, rank];

            state.setActiveSquare(pair);

            console.log(state.getActiveSquare());

            ctx.fillStyle = "#ccf2ff";
            ctx.fillRect(sx, sy, sw, sh);
        }

    }

}

async function handleConnect(event: Event) {
    event.preventDefault();

    if (net.isConnected()) {
        net.disconnect();
        return;
    }

    const input = document.getElementById('server-addr') as HTMLInputElement;
    const addr = input.value || "ws://localhost:8080";

    console.log(addr);
    try {
        await net.connect(addr);
        console.log("Connected:", net);
    } catch (error) {
        console.error("Connection failed:", error);
    }
}

async function handleSend(event: Event) {

}


const net: Network = new Network();
const gfx = new Graphics();
const state = new State();
const board = new Board();

document.getElementById('connect-btn')?.addEventListener("click", (event: Event) => {

    const connectBtn: HTMLElement | null = event.target as HTMLElement;
    const sendBtn: HTMLElement | null = document.getElementById('send-btn');
    connectBtn?.setAttribute("disabled", "disabled");

    handleConnect(event).then(() => {
        const statusMsg: HTMLElement | null = document.getElementById('server-status') as HTMLElement;

        if (net.isConnected()) {
            connectBtn.innerHTML = "Disconnect";
            statusMsg.innerHTML = "connected";
            statusMsg?.style.setProperty("color", "lightgreen");

            sendBtn?.removeAttribute("disabled");

        } else {
            connectBtn.innerHTML = "Connect";
            statusMsg.innerHTML = "disconnected";
            statusMsg?.style.setProperty("color", "lightcoral");
            sendBtn?.setAttribute("disabled", "disabled");
        }
        connectBtn?.removeAttribute("disabled");

    });
});

document.getElementById('connect-btn')?.addEventListener("click", (event: Event) => { handleSend(event); });

gfx.getCanvas().addEventListener("click", (event: Event) => { handleClick(event); }, false);

initialise();
draw();
