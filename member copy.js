class Member {
    constructor(id, img, x, y, mass) {
        this.pos = createVector(x, y);
        this.vel = p5.Vector.random2D();
        this.acc = createVector(0, 0);
        this.f = createVector(0, 0);
        // this.f = createVector();
        this.mass = mass;
        this.dia = mass * 1;

        this.r = random(100);
        this.g = random(255);
        this.b = random(255);
        this.id = id;
        this.img = img;
        this.blurriness = 0;
        this.glowColor = 0;
    }

    hovered(px, py) {
        let d = dist(px, py, this.pos.x, this.pos.y)
        if (d < this.r) {
            // console.log('note sent, members interacted!');
            return true;
        } else {
            return false;
        }
    }

    // popupWindow() {
    /***** create a modal box *****/
    //     popupDiv = createDiv();
    //     popupDiv.id('popupDiv');
    //     popupDiv.position(this.pos.x, this.pos.y);

    //     text = createP('Want to send a note?');
    //     text.parent(popupDiv);

    //     btn1 = createButton('Yes');
    //     btn1.class('btn');
    //     btn1.id('btn1');
    //     btn1.parent(popupDiv);
    //     btn1.mousePressed(sendNote);

    //     btn2 = createButton('No ');
    //     btn2.class('btn');
    //     btn2.id('btn2');
    //     btn2.parent(popupDiv);
    //     btn2.mousePressed(hideDiv);
    // }

    changeGlow(clr, blur) {
        this.blurriness = blur;
        this.glowColor = clr;
    }

    //????????????????????????????????????
    /*
    applyForce(force) {
        let f = createVector(0, 0);
        f = force.copy();
        f.div(this.mass);
        this.acc.add(f);
    }
    */
    //????????????????????????????????????

    /***** STATE 1 - default: no interaction among team members *****/
    checkCollision(other) {
        let force = p5.Vector.sub(other.pos, this.pos);
        let distanceSq = force.magSq();
        // other.applyForce(force);

        if (distanceSq <= (this.dia + other.dia) * (this.dia + other.dia)) {
            console.log(this.id + ' and ' + other.id + ' collided');
            // force.mult(-0.003);
            // this.applyForce(force);
            // this.f.mult(-1);
            // console.log(this.f);
            return true;
        }
        return false;
    }

    /***** STATE 2 — note sent: sender & receiver attract to each other *****/
    //??? TO-BE-FIXED: identify who is sending and who is receving, need to bind
    //sudo: members[0], members[1]
    attract(other) {
        const pair = [this.id, other.id];
        pair.sort();
        const multiplier = multipliers[pair.join('_')];
        let f = p5.Vector.sub(this.pos, other.pos);
        let distanceSq = f.magSq();
        let G = -1.5;
        let strength = multiplier * G * (this.mass * other.mass) / distanceSq;
        f.setMag(strength);
        // this.f.add(f);

        //????????????????????????????????????
        /*
        if (distanceSq > (this.rad * this.rad)) {
            // pull to each other
            f.mult(0.1); //0.015
            this.applyForce(f);
        } else {
            // push back, shaky effect
            f.mult(-1.35);
            this.applyForce(f);
        }*/
        //????????????????????????????????
    }

    update() {
        this.acc = this.f.div(this.mass).copy();
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        // this.f = createVector(0, 0);
        this.acc.mult(0);
    }

    display() {
        drawingContext.shadowBlur = this.blurriness;
        drawingContext.shadowColor = this.glowColor;

        // stroke(this.r, this.g, this.b, 100)
        // fill(this.r, this.g, this.b, 100);
        // ellipse(this.pos.x, this.pos.y, this.dia * 2, this.dia * 2);

        image(this.img, this.pos.x - 30, this.pos.y - 30, this.dia * 2, this.dia * 2);
    }

    checkEdges() {
        let exceededEdge = false;
        if (this.pos.x < this.dia || this.pos.x > width - this.dia) {
            this.vel.x *= -1;
            exceededEdge = true;
        }
        if (this.pos.y < this.dia || this.pos.y > height - this.dia) {
            this.vel.y *= -1;
            exceededEdge = true;
        }
        if (exceededEdge) {
        } else {
            this.vel = createVector(constrain(this.vel.x, -2, 2), constrain(this.vel.y, -2, 2));
        }
    }
}
