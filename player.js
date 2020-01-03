const pieces = 'ILJOTSZ';

class Player {
    constructor(arena) {
        this.arena = arena;
        this.score = 0;
        this.pos = {
            x: 0,
            y: 0
        };
        this.matrix = null;
    }

    createPiece(type) {
        switch (type) {
            case 'T':
                return [
                    [0, 0, 0],
                    [1, 1, 1],
                    [0, 1, 0]
                ];
            case 'O':
                return [
                    [2, 2],
                    [2, 2]
                ];
            case 'L':
                return [
                    [0, 3, 0],
                    [0, 3, 0],
                    [0, 3, 3]
                ];
            case 'J':
                return [
                    [0, 4, 0],
                    [0, 4, 0],
                    [4, 4, 0]
                ];
            case 'I':
                return [
                    [0, 5, 0, 0],
                    [0, 5, 0, 0],
                    [0, 5, 0, 0],
                    [0, 5, 0, 0]
                ];
            case 'S':
                return [
                    [0, 6, 6],
                    [6, 6, 0],
                    [0, 0, 0]
                ];
            case 'Z':
                return [
                    [7, 7, 0],
                    [0, 7, 7],
                    [0, 0, 0]
                ];
        }
    }

    drop() {
        this.pos.y++;

        if (this.arena.collide(this)) {
            this.pos.y--; // can't place them, move them back up
            this.arena.merge(this);
            this.reset();
            this.arena.sweep(this);
        }
    }

    move(dir) {
        this.pos.x += dir;

        if (this.arena.collide(this)) {
            this.pos.x -= dir;
        }
    }

    // Matrix rotation = Transpose + Reverse
    pieceRotate(matrix, dir) {

        // Transpose Step
        for (let y = 0; y < matrix.length; ++y) {
            for (let x = 0; x < y; ++x) {
                // Swap (tubble switch)
                [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
            }
        }

        // Reverse Step
        if (dir > 0) {
            // if direciton is positive
            matrix.forEach(row => {
                row.reverse()
            });
        } else {
            // if direciton is negative
            matrix.reverse();
        }

    }

    reset() {
        this.matrix = this.createPiece(pieces[pieces.length * Math.random() | 0]);
        this.pos.y = 0;
        this.pos.x = (this.arena.matrix[0].length / 2 | 0) - (this.matrix.length / 2 | 0);

        // game over condition - can't place any more blocks
        if (this.arena.collide(this)) {
            this.arena.matrix.forEach(row => row.fill(0));
            this.score = 0;
        }
    }

    rotate(dir) {
        const pos = this.pos.x;
        let offset = 1;
        this.pieceRotate(this.matrix, dir);

        while (this.arena.collide(this)) {
            this.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));

            if (offset > this.matrix[0].length) {
                this.pieceRotate(this.matrix, -dir)
                this.pos.x = pos;
                return;
            }
        }
    }
}
