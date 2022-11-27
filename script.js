let cvs;
let bgclr;

let members = [];
let m;
let mImgs = [];

let popupDiv;
let text;
let btn1;
let btn2;

/***** preload image to array *****/
function preload() {
    for (let i = 0; i < 2; i++) {
        mImgs[i] = loadImage('imgs/img' + i + '.png');
    }
}

function setup() {
    cvs = createCanvas(windowWidth, windowHeight);
    bgclr = color(200);

    for (let i = 0; i < 5; i++) {
        let x = 40 + 100 * i;
        let y = random(height);
        let r = 40;
        m = new Member(x, y, r);
        members.push(m);
    }

    // popupWindow();
}

function draw() {
    background(bgclr);

    for (let i = 0; i < members.length; i++) {
        m = members[i];
        // console.log(members.length);
        m.update();
        m.checkEdge();
        m.display();

        /***** mouse hover: glowing effect *****/
        if (m.hovered(mouseX, mouseY)) {
            m.changeGlow(color(0, 0, 0, 150), 15);

            /***** show popup window: NEED TO FIX *****/
            // if (mouseIsPressed) {
            // m.popupWindow();
            // }
        } else {
            m.changeGlow(0, 0);
        }

        /***** add attraction-collision behavior between sender and receiver: sender approaches to receiver — bounce — and collide *****/
        for (let j = 0; j < members.length; j++) {
            if (i != j) {
                let other = members[j];
                m.checkCollisiion(other);
            }
        }
        // m.attract()
    }
}

function popupWindow() {
    //***** create a modal box
    popupDiv = createDiv();
    popupDiv.id('popupDiv');
    popupDiv.position(500, 500);

    text = createP('Want to send a note?');
    text.parent(popupDiv);

    btn1 = createButton('Yes');
    btn1.class('btn');
    btn1.id('btn1');
    btn1.parent(popupDiv);
    btn1.mousePressed(sendNote);

    btn2 = createButton('No ');
    btn2.class('btn');
    btn2.id('btn2');
    btn2.parent(popupDiv);
    btn2.mousePressed(hideDiv);
}

/***** send note pic if "Yes", currently changes bgclr as a place holder *****/
function sendNote() {
    //***** add MQTT & webSocket listener
    bgclr = color(100, 230, 180);
}

/***** close popup window if "No" *****/
function hideDiv() {
    bgclr = color(200);
    popupDiv.hide();
}


/***** add a member to the screen *****/
function keyPressed() {
    m = new Member(random(width), random(height), 40);
    if (keyCode === UP_ARROW) {
        members.push(m);
    }
}

/***** remove a member from the screen *****/
function doubleClicked() {
    for (let i = members.length - 1; i >= 0; i--) {
        m = members[i];
        if (m.contains(mouseX, mouseY)) {
            members.splice(i, 1);
        }
    }
}


class Member {
    constructor(x, y, mass) {
        this.pos = createVector(x, y);
        this.vel = p5.Vector.random2D();
        this.acc = createVector();
        // this.mass = mass;
        this.dia = mass * 1;

        this.r = random(100);
        this.g = random(255);
        this.b = random(255);
        this.mImg = random(mImgs);
        this.blurriness = 0;
        this.glowColor = 0;
    }

    hovered(px, py) {
        let d = dist(px, py, this.pos.x, this.pos.y)
        if (d < this.r) {
            console.log('note sent, members interacted!');
            return true;
        } else {
            return false;
        }
    }

    // popupWindow() {
    //     //create a modal box
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

    applyForce(force) {
        var f = createVector();
        f = force.copy();
        f.div(this.mass);
        this.acc.add(f);
    }

    attract() {
        //
    }

    checkCollisiion(other) {
        let vector = p5.Vector.sub(other.pos, this.pos);
        let distanceSq = vector.magSq();

        if (distanceSq < (this.dia + other.dia) * (this.dia + other.dia)) {
            vector.mult(-0.003);
            this.applyForce(vector);
        }
    }

    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    checkEdge() {
        if (this.pos.x < 50 || this.pos.x > width - 50) {
            this.vel.x *= -1;
        }
        if (this.pos.y < 50 || this.pos.y > height - 50) {
            this.vel.y *= -1;
        }
    }

    display() {
        drawingContext.shadowBlur = this.blurriness;
        drawingContext.shadowColor = this.glowColor;

        stroke(this.r, this.g, this.b, 100)
        fill(this.r, this.g, this.b, 100);
        ellipse(this.pos.x, this.pos.y, this.dia, this.dia);

        image(this.mImg, this.pos.x, this.pos.y, this.dia * 2, this.dia * 2);
    }
}
