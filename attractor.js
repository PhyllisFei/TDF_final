class Attractor {
    constructor(x, y, mass) {
        this.pos = createVector(x, y);
        this.mass = mass;
        // this.r = sqrt(this.mass) * 5;
        this.r = 10;
    }

    attract(member) {
        let f = p5.Vector.sub(this.pos, member.pos);
        let distanceSq = constrain(f.magSq(), 2, 1);
        let G = 5;
        let strength = multiplier * G * (this.mass * member.mass) / distanceSq;
        f.setMag(strength);
        member.applyForce(f);
    }

    show() {
        noStroke();
        fill(255, 0, 100);
        ellipse(this.pos.x, this.pos.y, this.r * 2);
    }
}
