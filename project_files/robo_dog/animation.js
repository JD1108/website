const canvas = document.getElementById("ani");
const ctx = canvas.getContext("2d");
ctx.fillStyle="grey";


const lT=154;
const lL=128;
const stepTime=2000;
const startingPos=[20,270];
const stepLength=80;
const stepHeight=20;

const frequency=20; //in Hz

const hips =[[150,25],[200,10],[370,25],[420,10],[250,25]];




function inverseKinematics(pos) {
    const d = Math.sqrt(pos[0]**2 + pos[1]**2);

    const aH =
        Math.atan2(pos[1], pos[0]) +
        Math.acos(
            (lT**2 + d**2 - lL**2) /
            (2 * d * lT)
        );

    const aK = Math.acos((lT**2 + lL**2 - d**2)/(2 * lL * lT));
    return [aH, aK];
}

function trajectory(time, phaseOffset) {
    let phase = ((time / stepTime) + phaseOffset) % 1;

    let x, y;
    function swingX(p, start, end, speed){
            return (start - speed - end) / 2 * Math.cos(Math.pi * p) - speed * p + (start - (start - speed - end) / 2);
    }

    if (phase < 0.75) {
        // Working phase
        x = startingPos[0] - (phase / 0.75) * stepLength;
        y = startingPos[1];
    } else {
        // Lifting phase
        let p = (phase - 0.75) / 0.25;

        let p0 = [startingPos[0]-stepLength, startingPos[1]];
        let p1 = [startingPos[0] - 1.08 * stepLength, startingPos[1] - 0.1 * stepHeight];
        let p2 = [startingPos[0] + 0.25 * stepLength, startingPos[1] -  3* stepHeight];
        let p3 = [startingPos[0]+ 0.08 * stepLength, startingPos[1] - 0.1 * stepHeight];
        let p4 = [startingPos[0], startingPos[1]];

        x =
            (1 - p) ** 4 * p0[0] +
            4 * (1 - p) ** 3 * p * p1[0] +
            6 * (1 - p) ** 2 * p ** 2 * p2[0] +
            4 * (1 - p) * p ** 3 * p3[0] +
            p ** 4 * p4[0];

        y =
            (1 - p) ** 4 * p0[1] +
            4 * (1 - p) ** 3 * p * p1[1] +
            6 * (1 - p) ** 2 * p ** 2 * p2[1] +
            4 * (1 - p) * p ** 3 * p3[1] +
            p ** 4 * p4[1];
       
    }

    return [x, y];
}
function drawLeg(a, hip,top) {
    let xCor=0;
    let yCor=0;
    if(hip[0]<250){
        //rear leg
        if(hip[1]<15){
            //left rear
            xCor=50;
            yCor=0;
            ctx.fillStyle="red"
        }else{
            //right rear
            xCor=0;
            yCor=60;    
            ctx.fillStyle="blue"
        }
    }else{
        //front leg
        if(hip[1]<15){
            //left front
            xCor=50;
            yCor=0;
            ctx.fillStyle="green"
        }else{
            //right front
            xCor=0;
            yCor=60;
            ctx.fillStyle="yellow"
        }
    }
    ctx.strokeStyle="black";
    ctx.beginPath();
    ctx.moveTo(hip[0], hip[1]);
    const kneeX = hip[0]+lT * Math.cos(a[0]);
    const kneeY = hip[1]+lT * Math.sin(a[0]);
    ctx.lineTo(kneeX, kneeY);
    const footX = kneeX + lL * Math.cos(a[0] - (Math.PI - a[1]));
    const footY = kneeY + lL * Math.sin(a[0] - (Math.PI - a[1])); 
    ctx.lineTo(footX, footY);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(footX, footY, 5, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    if(top){
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(footX-xCor, 310+yCor, 5, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle="yellow";
        ctx.strokeRect(150,310,250,60);
    }
    
}
function centerOfMass() {
    ctx.fillStyle="black";
    ctx.beginPath();
    ctx.arc(275, 340, 5, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();


}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function animateStepsFour() {
    for (let i = 0; i < 10; i++) {
        for (let t = 0; t < stepTime; t += 1000 / frequency) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
           // centerOfMass();
            drawLeg(inverseKinematics(trajectory(t,(2/4))), hips[0],1); //RR 2 2
            drawLeg(inverseKinematics(trajectory(t,(0/4))), hips[1],1); //RL 4 0
            drawLeg(inverseKinematics(trajectory(t,(1/4))), hips[2],1); //FR 3 1
            drawLeg(inverseKinematics(trajectory(t,(3/4))), hips[3],1); //FL 1 3
            /*drawLeg(inverseKinematics(trajectory(t,(0/4))), hips[0],1); 
            drawLeg(inverseKinematics(trajectory(t,(0/4))), hips[1],1); 
            drawLeg(inverseKinematics(trajectory(t,(0/4))), hips[2],1); 
            drawLeg(inverseKinematics(trajectory(t,(0/4))), hips[3],1); */
            

            await sleep(1000 / frequency);
        }
    }
}
async function animateStepsOne() {
    for (let i = 0; i < 10; i++) {
        for (let t = 0; t < stepTime; t += 1000 / frequency) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawLeg(inverseKinematics(trajectory(t,0)), hips[4],0); 
            await sleep(1000 / frequency);
        }
    }
}
//animateSteps();