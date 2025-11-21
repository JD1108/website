const canvas = document.getElementById("ani");
const ctx = canvas.getContext("2d");
ctx.fillStyle="grey";


const lT=200;
const lL=400;
const stepTime=3000;
const startingPos=[100,500];
const stepLength=200;
const stepHeight=100;

const frequency=20; //in Hz

const hip =[250,50];
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
function drawLeg(a) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
function trajectory(t) {
    var x=0;
    var y=0;
    if (t<((3*stepTime)/4)){
        x=startingPos[0]-((4*t/((3*stepTime)))*stepLength);
        y=startingPos[1];
    }else{
        x=(startingPos[0]-stepLength)+(t-((3*stepTime)/4))*((4*stepLength)/stepTime);
        y=startingPos[1]-stepHeight*Math.sin(((t-((3*stepTime)/4))*(Math.PI*4))/stepTime);
    }

    return [x,y];

}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function animateSteps() {
    for (let i = 0; i < 10; i++) {
        for (let t = 0; t < stepTime; t += 1000 / frequency) {
            drawLeg(inverseKinematics(trajectory(t)));
            await sleep(1000 / frequency);
        }
    }
}
animateSteps();