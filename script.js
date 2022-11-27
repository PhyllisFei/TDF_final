let cvs;
let bgclr;

let members = [];
let m;
let mImgs = [];

let popupDiv;
let text;
let btn1;
let btn2;

//preload image to array
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

    popupWindow();
}

function draw() {
    background(bgclr);

    for (m of members) {
        // for (let i = 0; i < members.length; i++) {
        console.log(members.length);
        //mouse hover: glowing effect
        if (m.contains(mouseX, mouseY)) {
            m.changeGlow(color(0, 0, 0, 150), 15);

            //show popup window
            if (mouseIsPressed) {
                // m.popupWindow();
            }
        } else {
            m.changeGlow(0, 0);
        }

        //***** add attraction-collision behavior between sender and receiver: sender approaches to receiver — bounce — and collide *****//
        // m.attract()
        // m.collide();

        m.update();
        m.bounce();
        m.display();
    }
}

function popupWindow() {
    //create a modal box
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

//send note pic if "Yes", currently changes bgclr as a place holder
function sendNote() {
    //add MQTT & webSocket listener
    bgclr = color(100, 230, 180);
}

//close popup window if "No"
function hideDiv() {
    bgclr = color(200);
    popupDiv.hide();
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
    constructor(x, y, dia) {
        // this.x = x;
        // this.y = y;
        // this.dia = dia;
        // this.xSpd = random(-0.15, 0.15);
        // this.ySpd = random(-0.15, 0.15);
        this.r = random(100);
        this.g = random(255);
        this.b = random(255);
        this.mImg = random(mImgs);
        this.blurriness = 0;
        this.glowColor = 0;

        this.pos = createVector(x, y);
        // this.vel = p5.Vector.random2D();
        this.vel = createVector();
        this.acc = createVector();
        // this.mass = m;
        this.dia = dia;
    }

    contains(px, py) {
        // let d = dist(px, py, this.x, this.y)
        let d = dist(px, py, this.pos.x, this.pos.y)
        // console.log(d);
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
            vector.mult(-0.5);
            this.applyForce(vector);
        }
    }

    applyRestitution(amount) {
        let value = 1.0 + amount;
        this.vel.mult(value);
    }

    update() {
        // this.x += this.xSpd;
        // this.y += this.ySpd;

        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    bounce() {
        if (this.x < 0 || this.x > width) {
            this.xSpd *= -1;
        }
        if (this.y < 0 || this.y > height) {
            this.ySpd *= -1;
        }
    }



    display() {
        drawingContext.shadowBlur = this.blurriness;
        drawingContext.shadowColor = this.glowColor;

        stroke(this.r, this.g, this.b, 100)
        fill(this.r, this.g, this.b, 100);
        ellipse(this.pos.x, this.pos.y, this.dia, this.dia);

        // image(this.mImg, this.x, this.y, this.dia*2, this.dia*2);
        image(this.mImg, this.pos.x, this.pos.y, this.dia * 2, this.dia * 2);
    }
}
