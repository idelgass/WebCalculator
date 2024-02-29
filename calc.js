// Global, everything will need to access this
var workingVal = 0;

// Encapsulates the let stmts below so the values will persist across consecutive
// calls to handleNumKeys without need of global vars
function createNumKeysClos(){
  let workingVal = 0;
  let decimalDigit = 0;
  let intDigit = 0;
  let decimal = false;

  const idValueMaps = {
    "key-one": 1,
    "key-two": 2,
    "key-three": 3,
    "key-four": 4,
    "key-five": 5,
    "key-six": 6,
    "key-seven": 7,
    "key-eight": 8,
    "key-nine": 9,
    "key-zero": 0,
  };

  function handleNumKeys(id){
    console.log(id);
    switch(id){
      // Clear display and all working value data.
      // Need to consider how I will deal with clearing entered operations
      // (e.g. pressing clear after + should cancel the operation).
      case "key-clear":
        workingVal = 0;
        decimal = false;
        decimalDigit = 0;
        intDigit = 0;
        break;
      // Delete trailing number, not including extra decimal values from
      // fp rounding errors. Didn't want to convert to string but no convenient
      // way to get last digit of fp number mathematically.
      case "key-delete":
        let numString = workingVal.toString();

        // Need to handle decimal numbers separately to avoid deleting trivial
        // rounding error artifacts
        if(decimal){
          numString = numString.slice(0, intDigit + decimalDigit);
          decimalDigit--;
          //Return to int entry if last decimal digit is deleted
          if(decimalDigit == 0){
            decimal = false;
          }
        }
        else{
          numString = numString.slice(0, -1);
          intDigit--;
        }

        //If number is fully deleted need to manually set to 0 to avoid NaN
        if(numString.length == 0) {
          workingVal = 0;
          intDigit = 0; // Dont want this to go negative on repeated presses
          decimalDigit = 0; // Unnecessary but keeping for propriety
        }
        else workingVal = parseFloat(numString);
        break;
      // Need to add a guard to make sure key is only pressed once
      // like if(decimal)
      case "key-point":
        decimal = true;
        break;
      case "key-sign":
        workingVal *= -1;
        break;
      // Shouldn't rlly be default case so errors can be caught, but stringing
      // together cases 1-9 would be ugly
      default:
        let buttonIn = idValueMaps[id];
        if(decimal){
          workingVal += buttonIn * Math.pow(10, -1 * (decimalDigit + 1));
          decimalDigit++;
        }
        else{
          workingVal *= 10;
          workingVal += buttonIn;
          intDigit++;
        }
        break;
    }
    
    // Update display
    // This is intended as temporary, will need to replace
    document.getElementById('display_box').textContent = workingVal;

    console.log("workingVal: " + workingVal);
    console.log("intDigit: " + intDigit);
    console.log("decimalDigit: " + decimalDigit);
  }
  return handleNumKeys;
}

function handleOpKeys(){

}

const numKeys = document.querySelectorAll(".numpad > * > .key > button");
const handleNumKeysClosed = createNumKeysClos();
numKeys.forEach((button) => {
  button.addEventListener("click", () => {
    handleNumKeysClosed(button.parentNode.id)
  });
});
