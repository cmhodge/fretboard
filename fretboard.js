
debug = document.getElementById("debug")
document.addEventListener("click", handle_click);

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var rect = canvas.getBoundingClientRect(); //need this because canvas coordinates != client coords
// debug2.textContent = "rect =" + rect.left + " " + rect.top
var staff_note = new Note(4, 'c', 0, 50);
var guitar_note = new Note(4, 'c', 0, 60);
var black = '#000000', red = '#ff0000', green = '#00ff00';

function reset(){
    randomnote(staff_note);
    var accidentals = ['flat', 'natural', 'sharp'];
    test_acc = accidentals[staff_note.accidental + 1]
    var testnote = document.getElementById('testnote');
    var the_text = "Note is " +  staff_note.pitch + ' ' 
    + test_acc + ' in octave ' + staff_note.octave + ' abs value ' + staff_note.abs_note;
    testnote.textContent = the_text;
    staff.drawStaff();
    staff.drawNote(staff_note);

    // debug2.textContent = "testing button"  
}
function printMousePos(event) { //this was just for testing
    x = event.clientX-rect.left;
    y = event.clientY-rect.top;
    if ( x > 19 && x < 71 && y >39 && y < 91) {
        debug.textContent = "you clicked in the square";
    }
    else {
    debug.textContent =
      "clientX: " + event.clientX +
      " - clientY: " + event.clientY;
    }
}
 
function handle_click(event) { 
    // get fret, string position (if any)
    // calculate note
    // check if note == test note
    // draw fretboard (to erase previous circles if applicable)
    // draw cirle (red or green)
    fretboard.find_position(event);
    guitar_note.abs_note = fretboard.note_from_fret();
    if (guitar_note.abs_note == staff_note.abs_note) {
        color = green;
        console.log("yeah!");
        }
    else {color = red;}
    fretboard.draw_fretboard();
    fretboard.draw_circle(color);
    console.log('note is ' + guitar_note.abs_note);
  
}
function get_absolute(note) {
// returns integer  value of note """
//middle c is 60 in midi notation, so I should try to make
// this match in case I can make this work with midi to play
// the note (but then I'll have to transpose down an octave too)
     scale = {'c':1, 'd':3, 'e':5, 'f':6, 'g':8, 'a':10, 'b':12};
     fudgefactor = 11; // to make middle c = 60
     sum = note.octave*12 + scale[note.pitch] + note.accidental + fudgefactor;
     return sum;
}
function randomnote(note) {
    note.octave = choose([3,4,5,6]);
    if (note.octave <= 4) {note.octave = choose([3,4,5,6]);} //skew towards higher octaves
    if (note.octave == 3) {
        note.pitch = choose(['a', 'b', 'e', 'f', 'g']);
        if (note.pitch != 'e') {
            note.accidental = choose([-1,0,1]);}
        }
    else if (note.octave == 6) {
        note.pitch = choose(['c', 'd', 'e']);
        if (note.pitch == 'e'){note.accidental = choose([-1,0]);} // no e sharp
        }
    else {
        note.pitch = choose(['a', 'b', 'c', 'd', 'e', 'f', 'g']);
        note.accidental = choose([-1,0,1]);
    }


    note.abs_note = get_absolute(note);
    // return new Note(octave, pitch, accidental);
    // note.octave = choose(octaves);
    // note.pitch = choose(pitches);
    // note.accidental = choose(accidentals);


}
function choose(choices) {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
  }
var staff = {
    height: 50, // this and all other dimensions should be eyeballed
    length: 300,
    offset_x: 50,
    offset_y: 50,
    drawStaff: function(){
        space = this.height/5;
        x1 = this.offset_x;
        x2 = this.offset_x + this.length;
        y = this.offset_y;
        ctx.fillStyle = "#ffffff";// draw white box to erase any previous notes
        ctx.fillRect(this.offset_x, this.offset_y-100, this.length, this.height+150);
        ctx.strokeStyle = "#000000";
        for (i=0; i < 5; i++) {
            y = this.offset_y + i*space;
            ctx.moveTo(x1, y);
            ctx.lineTo(x2, y);
            ctx.strokeStyle = "#000000";
            ctx.stroke();
        }
    },
    //*****************************************************
    drawNote: function(note){
     //find position and ledger lines
     if (note.octave == 3) { // # The low notes!
            if (note.pitch == "e" || note.pitch == "f") {
                ledger_lines = -3 }
            else if (note.pitch == "g" || note.pitch == "a"){
                ledger_lines = -2 }
            else { ledger_lines = -1 }
            pitches = ['e', 'f', 'g', 'a', 'b'];
            position = pitches.indexOf(note.pitch)+1;}
            
    else if (note.octave == 4) {
            if (note.pitch == "c") {
                ledger_lines = -1}
            else {ledger_lines = 0}
            pitches = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
            position = pitches.indexOf(note.pitch) + 6;
            }
    else if (note.octave == 5) { //: # need to handle a and b only
            if (note.pitch == "a" || note.pitch == "b") {
                ledger_lines = 1; }
            else {ledger_lines = 0}
            pitches = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
            position = pitches.indexOf(note.pitch) + 13;
            }
    else   {// # by neccesity this is octave 6
            if (note.pitch == "c" || note.pitch == "d") {
                ledger_lines = 2; }
            else  { //# need to modify this if I allow notes above 12th fret
                ledger_lines = 3}
            pitches = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
            position = pitches.indexOf(note.pitch) + 20;
            }
    space = staff.height/5;
    ll_length = 20; //ledger line length
    ll_offset = this.offset_x + 190;
    if (ledger_lines != 0){
        if (ledger_lines > 0) {
            ll_y = this.offset_y - space;
            for (l = 1; l <= ledger_lines; l++) {
                ctx.moveTo(ll_offset, ll_y);
                ctx.lineTo(ll_offset + ll_length, ll_y);
                ctx.strokeStyle = "#000000";
                ctx.stroke();
                ll_y -= space;
            }
        }
        else {
            ll_y = this.offset_y + this.height //+ space;
            ledger_lines = Math.abs(ledger_lines);
            for (l = 1; l <= ledger_lines; l++) {
                ctx.moveTo(ll_offset, ll_y);
                ctx.lineTo(ll_offset + ll_length, ll_y);
                ctx.strokeStyle = "#000000";
                ctx.stroke();
                ll_y += space;
            }
        } 
        
    }
    y = this.offset_y - (position - 16)*(staff.height/10); // 16 is to work with our numbering convention
    x = this.offset_x + 200;
    ctx.beginPath();
    ctx.arc(x, y,4,0,2*Math.PI);
    ctx.fillStyle='#100000';
    ctx.fill();
    console.log('ledger lines is: ' + ledger_lines + 'and position is ' + position)
    // accidentals
    if (note.accidental != 0) {
        ctx.font = "16px Arial";
        accidental_x = x - 20;
        accidental_y = y + 5;
        if (note.accidental == -1) {
            ctx.fillText("b",accidental_x, accidental_y);
            }
        else {ctx.fillText("#",accidental_x, accidental_y);}
    }

    }

    //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
}
function Note(octave, pitch, accidental, absolute = 60) {
    this.octave = octave;
    this.pitch = pitch;
    this.accidental = accidental; // 0 is natural, 1 is sharp, -1 is flat, etc 
    this.abs_note = absolute; //middle c is 60

}
var fretboard = {
    width: 100,
    length: 500,
    top_fret: 12,
    offset_x: 60,
    offset_y: 140,
    position: [0, 0], //string, fret. String = zero means not a valid position. Fret 0 is open string

    draw_fretboard: function(){
        the_frets = this.frets
        nutwidth = this.length / 50;
        fretwidth = this.length / 100;
        dot_y = this.offset_y + this.width + 5;
        ctx.fillStyle = "#663300";// background
        ctx.fillRect(this.offset_x, this.offset_y, this.length, this.width);
        // debug.textContent = 'before for loop, i is: the_frets[1] = ' + the_frets[1];
        ctx.fillStyle = "#ffcc66";// nut
        ctx.fillRect(this.offset_x-(nutwidth/2), this.offset_y, nutwidth, this.width);
         for (i=2; i < 14; i++) { // need to check that we get correct number
            x1 = the_frets[i];
            ctx.fillStyle = "#669999";
            ctx.fillRect(this.offset_x + x1, this.offset_y, fretwidth, this.width);
            if (i == 5 || i == 7) { //draw dots
                ctx.beginPath();
                ctx.arc(this.offset_x+((the_frets[i] + the_frets[i+1])/2)+fretwidth/2, dot_y,3,0,2*Math.PI);
                ctx.stroke(); 
            }
        }
        x1 = this.offset_x;
        x2 = this.length* 1.2;  //for some unknown reason the strings are not drawn long enough without this
        for (s=1; s < 7; s++) {   //draw strings
            y = this.offset_y + ((2*s-1)/12) * this.width;
            ctx.moveTo(x1, y);
            ctx.lineTo(x2, y);
            ctx.stroke();
        }   
            
        //debug.textContent = text;
       },

    draw_circle: function(color='#100000'){
        if (this.position[0] != 0) { // test for valid string value
            string = this.position[0];
            fret = this.position[1];
            circle_x = (this.frets[fret] + this.frets[fret+1])/2 + this.offset_x + 2;
            circle_y = ((2*string - 1)/12)*this.width + this.offset_y;
            ctx.beginPath();
            ctx.arc(circle_x, circle_y,8,0,2*Math.PI);
            ctx.fillStyle=color;
            ctx.fill();
        }

    },

    find_position: function(event){
        x = event.clientX-rect.left-fretboard.offset_x; //normalize x and y
        y = event.clientY-rect.top-fretboard.offset_y;
        ymin = 0;
        ymax = fretboard.width;
        xmin = -40;
        xmax = fretboard.length;
        the_text = "";
        //circle_x = 0;
        ///circle_y = 0;
        if ((y < ymin || y > ymax) || (x < xmin || x > xmax)) {
            debug.textContent = " out of range" //test. Eventually, make this pass
        }
        else {
            debug.textContent = " hi"
            for (i=0; i<=this.top_fret; i++) {
                if (x > this.frets[i] && x < this.frets[i+1]) {
                    this.position[1] = i;
                    the_text += " you clicked on fret: " + i;
                    //circle_x = (this.frets[i] + this.frets[i+1])/2 + this.offset_x; 
                    break;
                }
              }
            for (s=1; s < 7; s++) {   //check strings
                y_upper = ((s-1)/6) * this.width;
                y_lower = ((s)/6) * this.width;
                if (y > y_upper && y < y_lower) {
                    this.position[0] = s;
                    the_text += " and string " + s;
                    //circle_y = (y_upper + y_lower)/2 + this.offset_y;
                }
            }
            // the_text += 'abs note value: ' + guitar_note.abs_note;
            debug.textContent = the_text;
            // ctx.beginPath();
            // ctx.arc(circle_x, circle_y,8,0,2*Math.PI);
            // ctx.stroke(); 
        }
    },
    note_from_fret: function(){
        open_strings = [76,71,67,62,57,52]; // abs pitch of open strings, middle c = 60 scheme
        abs_note = open_strings[this.position[0]-1] + this.position[1];
        return abs_note; 
       }
    }

fretboard.frets = calculateFrets(fretboard.length, fretboard.top_fret);

function calculateFrets(length, top_fret){  // these are defined in relative coordinates
    string_length = length * 1.9;
    fret_array = []; // unlike Python impementation, can't use tuples in array
    fret_array.push(-40);
    fret_array.push(0); // open strings
    fret_begin = 0;
    for (i=0; i <= top_fret; i++) {
        fretsize = string_length / 17.8;
        fret_end = fret_begin + fretsize;
        fret_array[i+2] = fret_end;
        string_length = string_length - fretsize;
        fret_begin = fret_end;
    }
    return fret_array;
  }



staff.drawStaff()
//draw_fretboard(fretboard.frets())
fretboard.draw_fretboard()

// debug.textContent = fretboard.frets()
debug2.textContent = fretboard.frets