let members = [];
let m;
let mImgs = [];

//preload image to array
function preload() {
    for (let i = 0; i < 2; i++) {
        mImgs[i] = loadImage('imgs/img' + i + '.png');
    }
}

function setup() {
    createCanvas(600, 400);

    for (let i = 0; i < 5; i++) {
        let x = 40 + 100 * i;
        let y = random(height);
        let r = 40;
        let mImg = random(mImgs);
        m = new Member(x, y, r, mImg);
        // m = new Member(x, y, r);
        members.push(m);
    }
}

function draw() {
    background(255);

    for (m of members) {
        //glowing effect of the note sender with mouse hover: micic the visual effect when a note is sent
        if (m.contains(mouseX, mouseY)) {
            m.changeGlow(color(0, 0, 0, 150), 15);
            //***** add attraction-collision behavior between sender and receiver: sender approaches to receiver — bounce — and collide *****//
            // m.attract()
            // m.collide();
        } else {
            m.changeGlow(0, 0);
        }
        m.move();
        m.bounce();
        m.display();
    }
}


//add a member to the screen
function keyPressed() {
    m = new Member(random(width), random(height), 40);
    if (keyCode === UP_ARROW) {
        members.push(m);
    }
    //   if (keyCode === DOWN_ARROW) {
    //   }
}

//remove a member from the screen
function doubleClicked() {
    for (let i = members.length - 1; i >= 0; i--) {
        m = members[i];
        if (m.contains(mouseX, mouseY)) {
            members.splice(i, 1);
        }
    }
}


class Member {
    constructor(x, y, dia, img) {
        this.x = x;
        this.y = y;
        this.dia = dia;
        this.xSpd = random(-0.15, 0.15);
        this.ySpd = random(-0.15, 0.15);
        this.r = random(100);
        this.g = random(255);
        this.b = random(255);
        this.mImg = img;
        this.blurriness = 0;
        this.glowColor = 0;
    }

    changeGlow(clr, blur) {
        this.blurriness = blur;
        this.glowColor = clr;
    }

    contains(px, py) {
        let d = dist(px, py, this.x, this.y)
        // console.log(d);
        if (d < this.r) {
            console.log('note sent, members interacted!');
            return true;
        } else {
            return false;
        }
    }

    move() {
        this.x += this.xSpd;
        this.y += this.ySpd;
    }

    bounce() {
        if (this.x < 0 || this.x > width) {
            this.xSpd *= -1;
        }
        if (this.y < 0 || this.y > height) {
            this.ySpd *= -1;
        }
    }

    attract() {
        //
    }

    collide() {
        //
    }

    display() {
        drawingContext.shadowBlur = this.blurriness;
        drawingContext.shadowColor = this.glowColor;

        stroke(this.r, this.g, this.b, 100)
        fill(this.r, this.g, this.b, 100);
        ellipse(this.x, this.y, this.dia, this.dia);

        // image( this.mImg, this.x, this.y, this.dia*2, this.dia*2);
        image(this.mImg, this.x, this.y, this.dia * 2, this.dia * 2);
    }
}
