const canvas = document.getElementById("ani");
const ctx = canvas.getContext("2d");
ctx.fillStyle="grey";


const lT=154;
const lL=128;
const stepTime=4000;
const startingPos=[20,270];
const stepLength=80;
const stepHeight=20;

const frequency=20; //in Hz

const hips =[[150,25],[200,10],[400,25],[450,10],[250,25]];
//var footPos=[hip[0]+startingPos[0],hip[1]+startingPos[1]];




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
function drawLeg(a, hip) {
    ctx.beginPath();
    ctx.moveTo(hip[0], hip[1]);
    const kneeX = hip[0]+lT * Math.cos(a[0]);
    const kneeY = hip[1]+lT * Math.sin(a[0]);
    ctx.lineTo(kneeX, kneeY);
    const footX = kneeX + lL * Math.cos(a[0] - (Math.PI - a[1]));
    const footY = kneeY + lL * Math.sin(a[0] - (Math.PI - a[1])); 
    ctx.lineTo(footX, footY);
    ctx.stroke();
}
function trajectory(time, phaseOffset) {
    let phase = ((time / stepTime) + phaseOffset) % 1;

    let x, y;

    if (phase < 0.75) {
        // Working phase
        x = startingPos[0] - (phase / 0.75) * stepLength;
        y = startingPos[1];
    } else {
        // Lifting phase
        let p = (phase - 0.75) / 0.25;  
        p0 = startingPos[1];
        p1 = startingPos[1] - 0.4 * stepHeight;
        p2 = startingPos[1] - stepHeight;
        p3 = startingPos[1]-   0.3 * stepHeight;
        p4 = startingPos[1];

        x = startingPos[0]-0.75*stepLength+ stepLength * (0.5 - 0.5 * Math.cos(Math.PI * p));
        y = (1 - p) ** 4 * p0 +4 * (1 - p) ** 3 * p * p1 +6 * (1 - p) ** 2 * p ** 2 * p2 +4 * (1 - p) * p ** 3 * p3 + p** 4 * p4;
       
    }

    return [x, y];
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function animateStepsFour() {
    for (let i = 0; i < 10; i++) {
        for (let t = 0; t < stepTime; t += 1000 / frequency) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            drawLeg(inverseKinematics(trajectory(t,(1/4))), hips[0]); //RR
            drawLeg(inverseKinematics(trajectory(t,(3/4))), hips[1]); //RL
            drawLeg(inverseKinematics(trajectory(t,(2/4))), hips[2]); //FR
            drawLeg(inverseKinematics(trajectory(t,0)), hips[3]); //FL
            await sleep(1000 / frequency);
        }
    }
}
async function animateStepsOne() {
    for (let i = 0; i < 10; i++) {
        for (let t = 0; t < stepTime; t += 1000 / frequency) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawLeg(inverseKinematics(trajectory(t,0)), hips[4]); 
            await sleep(1000 / frequency);
        }
    }
}
//animateSteps();