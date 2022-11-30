/***** store images with ID in an array *****/
class User {
    constructor(id, url) {
        this.id = id;
        this.url = url;
    }

    preload() {
        this.img = loadImage(this.url);
    }
}

/***** assign ID to images and store them in an array *****/
let members = [];
let users = new Map();
users.set('A', new User('A', 'imgs/img0.png'));
users.set('B', new User('B', 'imgs/img1.png'));
users.set('C', new User('C', 'imgs/img2.png'));
users.set('D', new User('D', 'imgs/img3.png'));
users.set('E', new User('E', 'imgs/img4.png'));
const ids = new Array(...users.keys());

/***** pair two IDs together and sort in alphabetical sequences *****/
const multipliers = {};
for (fromId of ids) {
    for (toId of ids) {
        if (fromId !== toId) {
            const pair = [fromId, toId];
            pair.sort();
            multipliers[pair.join('_')] = 0;
        }
    }
}

/***** assign differnet attraction values to different pairs *****/
multipliers['A_B'] = 1;
// multipliers['B_C'] = 2;
// multipliers['C_D'] = 3;
// multipliers['D_E'] = 4;
// multipliers['A_E'] = 5;

let cvs;
let bgclr;

let popupDiv;
let text;
let btn1;
let btn2;

/***** preload images *****/
function preload() {
    for (const user of users.values()) {
        user.preload();
    }
}

function setup() {
    // cvs = createCanvas(windowWidth, windowHeight);
    cvs = createCanvas(800, 600);
    bgclr = color(250);

    // members.push(new Member(null, null, width / 2, height / 2, 50));

    const entries = new Array(...users.entries());
    for (let i = 0; i < entries.length; i++) {
        let x = 80 + 100 * i;
        let y = random(50, height - 50);
        let r = 40;
        const [id, user] = entries[i];
        const m = new Member(id, user.img, x, y, r);
        members.push(m);
    }

    //---- TO-BE-FIXED: show popup window ----//
    popupWindow();
}

function draw() {
    background(bgclr);

    for (let i = 0; i < members.length; i++) {
        let m = members[i];
        if (!m.img) {
            continue;
        }

        /***** STATE 1 - default — no interaction among team members: members move freely, collide *****/
        // let hasCollided = false;
        for (let j = 0; j < members.length; j++) {
            if (i != j) {
                let other = members[j];
                m.checkCollision(other);

                /***** STATE 2 — note sent: sender & receiver attract to each other *****/
                /***** sudo attraction between members[0] and members[1] *****/
                //---- TO-BE-ADDED: MQTT & websocket listener ----//
                // if (!hasCollided && m.checkCollision(other)) {
                // hasCollided = true;

                let hasAttracted = false;
                m.attract(other);
                if (hasAttracted) {
                    m.applyRestitution(-0.01);
                }
                // }
            }
        }

        m.update();
        m.display();
        m.checkEdges();

        /***** mouse hover: glowing effect *****/
        if (m.hovered(mouseX, mouseY)) {
            //???----- TO-BE-FIXED: add blur to the background, highlight the receiver avatar -----//
            cvs.style('filter', blur);

            m.changeGlow(color(0, 0, 0, 150), 15);

            //???---- TO-BE-FIXED: show popup window ----//
            // if (mouseIsPressed) {
            // m.popupWindow();
            // }
        } else {
            m.changeGlow(0, 0);
        }
    }
}

//???---- TO-BE-FIXED: show popup window when mouse click on one member ----//
/***** create a modal box *****/
function popupWindow() {
    popupDiv = createDiv();
    popupDiv.id('popupDiv');
    popupDiv.position(300, 700);

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
    //---- TO-BE-ADDED: MQTT & webSocket listener ----//
    bgclr = color(100, 230, 180);
}

/***** close popup window if "No" *****/
function hideDiv() {
    bgclr = color(200);
    popupDiv.hide();
}

// BELOW CURRENTLY UNAVAILABLE
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
        if (m.hovered(mouseX, mouseY)) {
            members.splice(i, 1);
        }
    }
}
