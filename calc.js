// Global, everything will need to access this
var workingVal = 0;

// function handleOpKeys

// Encapsulates the let stmts below so the values will persist across consecutive
// calls to handleNumKeys without need of global vars
function createNumKeysClos(){
  //let workingVal = 0;
  let decimalDigit = 1;
  let decimal = false;
  let lastDeletable = null;

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
    var buttonIn = idValueMaps[id];
    console.log(id);
    console.log(buttonIn);
    if(id == "key-clear"){
      workingVal = 0;
      decimal = false;
      decimalDigit = 1;
      lastDeletable = null;
    }
    else if(id == "key-delete"){
      // TODO: USE lastDeletable AND SUBTRACT/SET DECIMAL MODE, CAN BE NUMBER OR .
      // Remember to adjust decimalDigit
      if(workingVal >= 0){
        if(decimal){
          let decimalPart = (workingVal - Math.floor(workingVal)) * Math.pow(10, decimalDigit);
          console.log("last digit" + decimalPart % 10);
        }
        else{
          workingVal = Math.floor(workingVal / 10);
        }
      }
      else{}
      //Check if decimal part has been fully deleted
      if(decimalDigit == 1){}
    }
    else if(id == "key-point"){
      lastDeletable = id;
      decimal = true;
    }
    else if(id == "key-sign"){
      workingVal *= -1;
    }
    else{
      lastDeletable = id;
      if(decimal){
        workingVal += buttonIn * Math.pow(10, -1 * decimalDigit);
        decimalDigit++;
      }
      else{
        workingVal *= 10;
        workingVal += buttonIn;
      }
    }
    console.log(workingVal);
  }

  return handleNumKeys;
}

const numKeys = document.querySelectorAll(".numpad > * > .key > button");
const handleNumKeysClosed = createNumKeysClos();
numKeys.forEach((button) => {
  button.addEventListener("click", () => {
    handleNumKeysClosed(button.parentNode.id)
  });
});
