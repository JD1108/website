const canvas = document.getElementById("ani");
const ctx = canvas.getContext("2d");
ctx.fillStyle="grey";


const lT=100;
const lL=200;
const stepTime=3000;
const startingPos=[50,250];
const stepLength=100;
const stepHeight=50;

const frequency=20; //in Hz

const hips =[[150,50],[200,30],[400,50],[450,30],[250,50]];
var footPos=[hip[0]+startingPos[0],hip[1]+startingPos[1]];




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
    const footY = kneeY + lL * Math.sin(a[0] - (Math.PI - a[1])); //-aK+(np.pi+aH)
    ctx.lineTo(footX, footY);
    ctx.stroke();
}
function trajectory(time, phaseOffset) {
    // Normierte Zeit 0…1
    let phase = ((time / stepTime) + phaseOffset) % 1;

    let x, y;

    if (phase < 0.75) {
        // Stützphase (Fuß am Boden)
        x = startingPos[0] - (phase / 0.75) * stepLength;
        y = startingPos[1];
    } else {
        // Schwungphase (Fuß hebt ab & schwingt nach vorne)
        let p = (phase - 0.75) / 0.25;  // neu normiert: 0…1
        x = (startingPos[0] - stepLength) + p * stepLength;
        y = startingPos[1] - stepHeight * Math.sin(p * Math.PI);
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