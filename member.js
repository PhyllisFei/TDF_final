class Member {
    constructor(id, img, x, y, mass) {
        this.pos = createVector(x, y);
        this.vel = p5.Vector.random2D();
        this.acc = createVector(0, 0);
        this.mass = mass;
        this.dia = mass * 1;
        this.hasAttracted;

        this.id = id;
        this.img = img;
        this.blurriness = 0;
        this.glowColor = 0;
    }

    applyForce(force) {
        let f = p5.Vector.div(force, this.mass).copy();
        this.acc.add(f);
    }

    /***** STATE 1 - default: no interaction among team members *****/
    checkCollision(other) {
        let vector = p5.Vector.sub(other.pos, this.pos);
        let distanceSq = vector.magSq();

        if (distanceSq < (this.dia + other.dia) * (this.dia + other.dia)) {
            console.log(this.id + ' and ' + other.id + ' collided');

            //when value >0: members bounce back and forth with each other
            other.applyForce(vector.mult(0.05)); //0.05
            //when value <0: members are attracted to each other
            // other.applyForce(vector.mult(-0.05));

            //decrease speed when C,D,E collide with pair A_B
            other.applyRestitution(1 - 0.001);

            //prevent others' spd from reducing to 0
            let spd = other.vel.mag();
            // console.log(spd);
            if (spd <= 0.5) {
                other.vel.mult(1.1);
            }
        }
    }

    /***** STATE 2 — note sent: sender & receiver attract to each other *****/
    //??? TO-BE-FIXED: identify who is sending and who is receving, need to bind
    attract(other) {
        const pair = [this.id, other.id];
        pair.sort();
        const multiplier = multipliers[pair.join('_')];

        let f = p5.Vector.sub(this.pos, other.pos);
        let distanceSq = f.magSq();
        let G = 2;
        let strength = multiplier * G * (this.mass * other.mass) / distanceSq;
        f.setMag(strength);

        /***** increase attraction force when one pair is too far away *****/
        if (distanceSq > (this.dia + other.dia) * (this.dia + other.dia)) {
            f.mult(10);
            // other.applyRestitution(1 - 0.001);
            // console.log('getting closer');
        } else {
            /***** add collision force to push each other away a little bit after attraction: bouncing weird *****/
            //????? gradually reduce bouncing: need to fix calculation
            let value = -1; //10
            // value *= .9;
            // console.log(value);
            f.mult(value);
            // other.applyRestitution(1 - 0.001);
            // console.log('bouncing just a bit');
            this.applyRestitution(1 - 0.03);
            if (multiplier) {
                this.hasAttracted = true;
            }
        }
        other.applyForce(f);
        // other.applyForce(f.mult(1.5));

        return this.hasAttracted;
    }

    applyRestitution(value) {
        this.vel.mult(value);
    }

    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    display() {
        drawingContext.shadowBlur = this.blurriness;
        drawingContext.shadowColor = this.glowColor;

        image(this.img, this.pos.x, this.pos.y, this.dia * 2, this.dia * 2);
    }

    checkEdges() {
        let exceededEdge = false;
        if (this.pos.x < 0 || this.pos.x > width - (this.dia * 2)) {
            this.vel.x *= -1;
            exceededEdge = true;
        }
        if (this.pos.y < 0 || this.pos.y > height - (this.dia * 2)) {
            this.vel.y *= -1;
            exceededEdge = true;
        }
        if (exceededEdge) {
        } else {
            this.vel = createVector(constrain(this.vel.x, -2, 2), constrain(this.vel.y, -2, 2));
        }
    }

    // comment out later
    hovered(px, py) {
        let d = dist(px, py, this.pos.x, this.pos.y);
        // console.log(d);
        if (d < this.dia * 2) {
            console.log('note sent, members interacted!');
            return true;
        } else {
            return false;
        }
    }

    changeGlow(clr, blur) {
        this.blurriness = blur;
        this.glowColor = clr;
    }
}
