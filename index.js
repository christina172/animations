const arr = [];
for (let i = 0; i < 50000; i++) {
    arr.push(Math.floor(Math.random() * 50000) + 1);
};
const arrTimeout = [];
for (let i = 0; i < 50000; i++) {
    arrTimeout.push(Math.floor(Math.random() * 50000) + 1);
};

// using macrotasks setTimeout() to run bubblesort in parallel with animations
console.time('Sorting an array with setTimeout() took');
function bubbleSort(arr, sorted) {
    let swapped;
    do {
        swapped = false;
        for (let i = 0; i < arr.length - 1 - sorted; i++) {
            if (arr[i] > arr[i + 1]) {
                let temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
                swapped = true;
            }
        }
        sorted++;
    } while (sorted % 100 != 0);
    if (swapped == false) {
        console.timeEnd('Sorting an array with setTimeout() took');
        console.log("Array sorted using setTimeout()", arr);
        return arr;
    } else {
        setTimeout(()=>{
            bubbleSort(arr, sorted)
        })
    }
};
bubbleSort(arrTimeout, 0);

// setting up a worker for the bubble sort execution
function worker_function() {
    function bubbleSort(arr) {
    
        let swapped;
        let length = arr.length - 1;
        do {
            swapped = false;
            for (let i = 0; i < length; i++) {
                if (arr[i] > arr[i + 1]) {
                    let temp = arr[i];
                    arr[i] = arr[i + 1];
                    arr[i + 1] = temp;
                    swapped = true;
                }
            }
            length--;
        } while (swapped);
    
        return arr;
    };
    self.onmessage = function(e) {
        console.log('Worker: Message received from main script');
        
        const result = bubbleSort(e.data);
        console.log('Worker: Posting message back to main script');
        postMessage(result);
    };
}

if (window.Worker) {
    const myWorker = new Worker(URL.createObjectURL(new Blob(["("+worker_function.toString()+")()"], {type: 'text/javascript'})));
    myWorker.postMessage(arr);
    console.log('Message posted to worker');
    console.time('Worker sorted the array in');
    myWorker.onmessage = function(e) {
        let result = e.data;
        console.log('Message received from worker');
        console.timeEnd('Worker sorted the array in');
        console.log('Array sorted with web worker', result);
    }
  } else {
    console.log('Your browser doesn\'t support web workers.');
}

// Method 1 (Using CSS transition property)
const square_1 = document.querySelector(".square.transition");

function startTransition() {
    square_1.classList.add("start");
};

function transition() {
    square_1.classList.toggle("start");
};

window.addEventListener("load", startTransition);
square_1.addEventListener("transitionend", transition);

// Method 3 (Using setTimeout)
const square_3 = document.querySelector(".square.timeout");
let count = 0;
function go(){
    count = count + 2.5;
    square_3.style.transform = `translate(${count}px)`;
    if (count == 150) {
        setTimeout(goBack, 16);
    } else {
        setTimeout(go, 16);
    }
};
function goBack() {
    count = count - 2.5;
    square_3.style.transform = `translate(${count}px)`;
    if (count == 0) {
        setTimeout(go, 16);
    } else {
        setTimeout(goBack, 16);
    }
}
go();

// Method 4a (Using requestAnimationFrame with timestamp for equal speed on different screens)
const square_4_t = document.querySelector(".square.request.timestamp");

let start;
let previousTimeStamp;
let done = false;

let startB;
let previousTimeStampB;
let doneB = false;

function step(timeStamp) {
  if (!start) {
    start = timeStamp;
  };
  const elapsed = timeStamp - start;

  if (previousTimeStamp !== timeStamp) {
    // Math.min() is used here to make sure the element stops at exactly 150px
    const count = Math.min(0.15 * elapsed, 150);
    square_4_t.style.transform = `translateX(${count}px)`;
    if (count === 150) done = true;
  }
  previousTimeStamp = timeStamp;
  if (!done) {
    window.requestAnimationFrame(step);
  } else {
    startB = 0;
    previousTimeStampB = 0;
    doneB = false;
    window.requestAnimationFrame(back);
  }
}

function back(timeStamp) {
    if (!startB) {
        startB = timeStamp;
    }
    const elapsed = timeStamp - startB;
    
    if (previousTimeStampB !== timeStamp) {
        // Math.min() is used here to make sure the element stops at exactly 150px
        const count = Math.min(0.15 * elapsed, 150);
        square_4_t.style.transform = `translateX(${150-count}px)`;
        if (count == 150) doneB = true;
    };
    previousTimeStampB = timeStamp;
    if (!doneB) {
        window.requestAnimationFrame(back);
    } else {
        start = 0;
        previousTimeStamp = 0;
        done = false;
        window.requestAnimationFrame(step);
    }
}

window.requestAnimationFrame(step);

// Method 4b (Using requestAnimationFrame without timestamp)
const square_4 = document.querySelector(".square.request.simple");

let xpos = 0;
let number = 0;

function forwards() {
    xpos = xpos + 2.5;
    square_4.style.transform = `translateX(${xpos}px)`;
    if (xpos == 150) {
        requestAnimationFrame(backwards);
    } else {
        requestAnimationFrame(forwards);
    }
};

function backwards() {
    xpos = xpos - 2.5;
    square_4.style.transform = `translateX(${xpos}px)`;
    if (xpos == 0) {
        requestAnimationFrame(forwards);
    } else {
        requestAnimationFrame(backwards);
    }
}

window.requestAnimationFrame(forwards);