class Task {
    id: number;
    name: string;
    x: number;
    y: number;
    grabbed: boolean;
    grabOffsetX: number;
    grabOffsetY: number;

    constructor(id: number, name: string, x: number, y: number) {
        this.id = id;
        this.name = name;
        this.x = x;
        this.y = y;
        this.grabbed = false
        this.grabOffsetX = 0;
        this.grabOffsetY = 0;
    }
}

export default Task;
