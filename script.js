/***** assign a unique id to this front end *****/
let deviceID = 'userA';
let msgSent = false;

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

/***** assign differnet attraction forces to different pairs *****/
function assignForces() {
    multipliers['D_E'] = 1;
    // multipliers['B_C'] = 2;
    // multipliers['C_D'] = 3;
    // multipliers['D_E'] = 4;
    // multipliers['A_E'] = 5;
}

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

    const entries = new Array(...users.entries());
    for (let i = 0; i < entries.length; i++) {
        let x = 80 + 100 * i;
        let y = random(50, height - 50);
        let r = 40;
        const [id, user] = entries[i];
        const m = new Member(id, user.img, x, y, r);
        members.push(m);
    }

    //---- TO-BE-FIXED: click each member to show popup window ----//
    popup();

}

function draw() {
    background(bgclr);

    for (let i = 0; i < members.length; i++) {
        let m = members[i];

        /***** STATE 1 - default — no interaction among team members: move freely, collide *****/
        for (let j = 0; j < members.length; j++) {
            if (i != j) {
                let other = members[j];
                m.checkCollision(other);

                /***** STATE 2 — note sent: sender & receiver attract to each other, both glow *****/
                //---- TO-BE-ADDED: MQTT & websocket listener ----//

                // attract if button clicked && message sent
                // if (msgSent) {
                if (m.attract(other)) {
                    m.changeGlow(color(0, 0, 0, 150), 15);
                } else {
                    m.changeGlow(0, 0);
                }
                // }
            }
        }

        m.update();
        m.display();
        m.checkEdges();

        if (msgSent) {
            assignForces();
        }
    }
}

//???---- TO-BE-FIXED: show popup window when mouse click on one member ----//
// function mousePressed() {
//     popup();
// }

/***** create a modal box *****/
function popup() {
    popupDiv = createDiv();
    popupDiv.id('popupDiv');
    popupDiv.position(260, 200);

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

/***** send pic to broker if "Yes" *****/
function sendNote() {
    // bgclr = color(100, 230, 180);
    onConnected();
    popupDiv.hide();
    msgSent = true;
    console.log('sent');
    console.log(msgSent);
}

/***** close popup window if "No" *****/
function hideDiv() {
    // bgclr = color(250);
    popupDiv.hide();
}

// BELOW CURRENTLY UNAVAILABLE
// /***** add a member to the screen *****/
// function keyPressed() {
//     m = new Member(random(width), random(height), 40);
//     if (keyCode === UP_ARROW) {
//         members.push(m);
//     }
// }

// /***** remove a member from the screen *****/
// function doubleClicked() {
//     for (let i = members.length - 1; i >= 0; i--) {
//         m = members[i];
//         if (m.hovered(mouseX, mouseY)) {
//             members.splice(i, 1);
//         }
//     }
// }

// function applyGlow(){
/***** mouse hover: glowing effect *****/
        // if (m.hovered(mouseX, mouseY)) {
        // console.log('yes')
        //???----- TO-BE-FIXED: add blur to the background, highlight the receiver avatar -----//
        // cvs.style('filter', blur);

        // m.changeGlow(color(0, 0, 0, 150), 15);

        //???---- TO-BE-FIXED: show popup window ----//
        // if (mouseIsPressed) {
        // m.popup();
        // }
        // } else {
        // m.changeGlow(0, 0);
        // }
// }

// let socket;
// let imageArray = [];
// let receivedImgs;

// function socketSetup() {
    //Setup socket - connect to localhost, and same post
    //as the one specified in the server.js
    //The packet name (ServerToClient) need also to be
    //the same as specific in the server.js
    //When a message is received, the socketEvents function will run
    // socket = io('http://localhost:3000'); //run locally
    // socket = io();
    // socket.on('ServerToClient', socketEvents);
// }

// function socketEvents(data) {
//     //receive image data and pass it to the global variable array
//     imageArray.push(data.receivedImgs);
// }
