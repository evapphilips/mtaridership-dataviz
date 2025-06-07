// Eva Philips
// November 2, 2021
// Description: This visualization takes MTA ridership data from the beginning of the pandemic and maps the ridership of each year since the pandemic began.
// Source: https://new.mta.info/coronavirus/ridership pulled on Nov 22, 2021

// Variables
// data
var rawData;
// var dates;
var subwayRidership;
var busRidership;
var maxSubwayRidership;
var maxBusRidership;
// heading & canvas 
var canvasHeight = window.innerHeight;
var canvasWidth = canvasHeight;
// item
var padding = 5;
var minR;
var maxR; 
var tickLength = 20;
// Colors
var bkgColor = [246, 251, 244];
var color2 = [0, 0, 0];
var color1 = [29, 53, 87];
var lightGray = 200;
var darkGray = 60;


// Preload
function preload(){
    // Load data
    rawData = loadTable('rawData.csv', 'csv', 'header');
}

// Setup
function setup(){
    // Define canvas
    createCanvas(canvasWidth, canvasHeight);
    // background(color1[0], color1[1], color1[2], 60);
    background(bkgColor);
    angleMode(DEGREES);

    // Set max & min radius
    minR = 0;
    maxR = height/4.5;

    // // Pull dates data
    dates = reverse(rawData.getColumn('Date'));

    // Pull RIDERSHIP data <-- This is the number of riders on this services each day
    subwayRidership = reverse(rawData.getColumn('SubwaysTotalEstimatedRidership'));
    busRidership = reverse(rawData.getColumn('BusesTotalEstimatedRidership'));

    // Clean & save data
    for (let i=0; i<rawData.rows.length; i++){

        // Convert subway ridership values from string to nums
        if(parseInt(subwayRidership[i])){
            subwayRidership[i] = parseInt(subwayRidership[i]);
        }else{
            subwayRidership[i] = 0;
        }
        
        // Convert bus ridership values from string to num
        if(parseInt(busRidership[i])){
            busRidership[i] = parseInt(busRidership[i]);
        }else{
            busRidership[i] = 0;
        }
    }

    // Save max ridership data
    maxSubwayRidership = max(subwayRidership);
    maxBusRidership = max(busRidership);

    // Create Ridership Blobs
    // subway
    var subwayBlob = new RidershipBlob(width/3, 3*height/10, subwayRidership, maxSubwayRidership, "SUBWAY");
    subwayBlob.drawGuides(3);
    subwayBlob.drawBlob();
    subwayBlob.drawTitleLabel();
    subwayBlob.drawValueLabel(1);
    subwayBlob.drawValueLabel(3);
    // bus
    var busBlob = new RidershipBlob(2*width/3, 7*height/10, busRidership, maxSubwayRidership/2, "BUS");
    busBlob.drawGuides(1);
    busBlob.drawBlob();
    busBlob.drawTitleLabel();
    busBlob.drawValueLabel(3);

    // Add Title
    textAlign(LEFT, TOP)
    fill(darkGray);
    textFont("Oswald", 84);
    text("MTA", (8*padding), 3*height/4);
    text("Ridership", (8*padding), 3*height/4 + (16*padding));

    // Add Legend
    rectMode(CENTER)
    textAlign(RIGHT, TOP)
    textFont("Oswald", 12);
    fill(color1[0], color1[1], color1[2], 200);
    rect(width-(16*padding)-83, (16*padding)+5, 185, 30);
    fill(bkgColor);
    text("MARCH 1 2020 - FEBRUARY 28, 2021", width-(16*padding), (16*padding));
    fill(color2[0], color2[1], color2[2], 80);
    rect( width-(16*padding)-57, (16*padding)+(8*padding)+5, 132, 30);
    fill(darkGray);
    text("MARCH 1 2021 - PRESENT", width-(16*padding), (16*padding)+(8*padding));

    // Save
    // saveCanvas();

}


// Draw
function draw(){
    

}

// Classes
class RidershipBlob{
    constructor(x, y, data, max, label){
        this.x = x;
        this.y = y;
        this.data = data;
        this.max = max;
        this.label = label;
    }

    drawGuides(numGuides){
        // set style
        stroke(lightGray)
        strokeWeight(.5);
        // draw grid circles
        push();
        translate(this.x, this.y);
        if(numGuides>1){
            fill(240, 80);
            ellipse(0, 0, 2*maxR, 2*maxR);
            fill(180, 80);
            ellipse(0, 0, 6*maxR/4, 6*maxR/4);
            fill(140, 80);
            ellipse(0, 0, maxR, maxR)
        }else{
            fill(140, 80);
            ellipse(0, 0, 2*maxR, 2*maxR);
            // ellipse(0, 0, 2*maxR+2, 2*maxR+2);
            // ellipse(0, 0, 2*maxR+4, 2*maxR+4);
            

        }
        
        
        pop();

        // Create tick marks
        push();
        // set style
        stroke(darkGray);
        strokeWeight(.5);
        noFill();
        translate(this.x, this.y);
        // draw lines
        line(maxR + padding, 0, maxR + padding + tickLength, 0);
        line(0, maxR + padding, 0, maxR + padding + tickLength);
        line(-maxR - padding, 0, -maxR - padding - tickLength, 0);
        line(0, -maxR -padding, 0, -maxR - padding - tickLength);
        // set style
        fill(darkGray);
        noStroke();
        textFont("Oswald", 8);
        // draw labels
        textAlign(LEFT, CENTER);
        text("MAR 1", maxR + (2*padding) + tickLength, 0);
        textAlign(CENTER, TOP);
        text("MAY 30", 0, maxR + (2*padding) + tickLength);
        textAlign(RIGHT, CENTER);
        text("AUG 28", -maxR - (2*padding) - tickLength, 0);
        textAlign(CENTER, BASELINE);
        text("NOV 26", 0, -maxR - (2*padding) - tickLength);
        pop();

    }

    drawBlob(){
        // March 2020-Feb 2021
        // set style
        fill(color1[0], color1[1], color1[2], 150);
        noStroke();
        // draw curved lines
        push();
        translate(this.x, this.y);
        beginShape();
        let j = 0;
        for(let l=0; l<360; l=l+(360/364)){
            var ridership = map(this.data[j], 0, this.max, minR, maxR);
            var r = ridership;
            var x = r * cos(l);
            var y = r * sin(l);
            curveVertex(x, y);
            j++
        }
        endShape();
        pop();

        // March 2021-current
        // set style
        fill(color2[0], color2[1], color2[2], 80);
        noStroke();
        // draws curved lines
        push();
        translate(this.x, this.y);
        beginShape();
        let m = 365;
        for(let l=0; l<360; l=l+(360/365)){
            var ridership;
            // check is there is data for this day
            if(subwayRidership[m]){
                ridership = map(this.data[m], 0, this.max, minR, maxR);
            }else{
                ridership = 0;
            }
            var r = ridership;
            var x = r * cos(l);
            var y = r * sin(l);
            curveVertex(x, y);
            m++
        }
        endShape();
        pop();  
    }

    drawTitleLabel(){
        // set style
        fill(bkgColor);
        // fill(150);
        noStroke();
        textAlign(CENTER, CENTER);
        textFont("Oswald", 14);
        // draw
        push();
        translate(this.x, this.y);
        // text(this.label, 0, -7*maxR/8);
        text(this.label, 0, 0);
        pop();
    }

    drawValueLabel(numGuide){
        // set style
        rectMode(CENTER)
        textAlign(CENTER, CENTER);
        textFont("Oswald", 12);
        noStroke();

        push();
        translate(this.x, this.y)
        rotate(45);
        if(numGuide == 1){
            fill(bkgColor[0], bkgColor[1], bkgColor[2], 200)
            rect(0, -maxR/2, 50, 20)
            fill(darkGray);
            text((round((this.max/2)/100)*100), 0, -maxR/2);
        }
        if(numGuide == 2){
            fill(bkgColor[0], bkgColor[1], bkgColor[2], 150)
            rect(0, -6*maxR/4, 50, 20)
            fill(darkGray);
            text((round((6*this.max/4)/100)*100), 0, -6*maxR/4);
            
        }
        if(numGuide == 3){
            fill(bkgColor[0], bkgColor[1], bkgColor[2], 150)
            rect(0, -maxR, 50, 20)
            fill(darkGray);
            text((round((this.max)/100)*100), 0, -maxR);
        }
        pop();

    }
}


