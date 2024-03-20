// TODO: Move tree stuff to its own module, need to actually host for this cant
// access es modules thru file// protocol
// Object constructor
function Node(value){
  this.value = value;
  this.left = null;
  this.right = null;
}
class ExpTree{
  constructor(){
    this.root = null
  }
}

function resolveExpTree(node){
  if(node == null){
    return 0;
  }
  if (node.left == null && node.right == null) {
    return node.value;
  }

  // const left = node.left == null ? 0 : resolveExpTree(node.left);
  // const right = node.right == null ? 0 : resolveExpTree(node.right);
  const left = resolveExpTree(node.left);
  const right = resolveExpTree(node.right);

  switch (node.value) {
    case "key-plus":
      return left + right;
    case "key-minus":
      return left - right;
    case "key-multiply":
      return left * right;
    case "key-divide":
      return left / right;
    default:
      throw new Error('Default, invalid operator: ' + node.value);
  }
}

// import Node from "./modules/tree.mjs";

// Globals
// moved tree to globals until I encapsulate better
var tree = new ExpTree();
var workingVal = 0;
var workingTotal = 0;
var firstZeroFlag = false;
var lastKeyEquals = false;
var resetEntry = false;

// Encapsulates the let stmts below so the values will persist across consecutive
// calls to handleNumKeys without need of more globals
function createNumKeysClos(){
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
    if(resetEntry){
      intDigit = 0;
      decimal = false;
      decimalDigit = 0;
    }
    if(lastKeyEquals == true){
      workingTotal = 0;
      tree.root = null; // Consider adding clear logic to operation keys so I dont have to expose this
    }
    lastKeyEquals = false;
    resetEntry = false;
    console.log(id);
    switch(id){
      // Clear display and all working value data.
      // Need to consider how I will deal with clearing entered operations
      // (e.g. pressing clear after + should cancel the operation).
      case "key-clear":
        workingVal = 0;
        workingTotal = 0;
        decimal = false;
        decimalDigit = 0;
        intDigit = 0;
        firstZeroFlag = false;
        tree.root = null; // Exposing tree.root again, dont like this
        break;
      case "key-one":
      case "key-two":
      case "key-three":
      case "key-four":
      case "key-five":
      case "key-six":
      case "key-seven":
      case "key-eight":
      case "key-nine":
      case "key-zero":
        let buttonIn = idValueMaps[id];
        if(decimal){
          workingVal += workingVal >= 0 ? buttonIn * Math.pow(10, -1 * (decimalDigit + 1))
                                        : -1 * buttonIn * Math.pow(10, -1 * (decimalDigit + 1));
          decimalDigit++;
        }
        else{
          workingVal *= 10;
          workingVal += buttonIn;
          intDigit++;
        }
        break;
      // Delete trailing number, not including extra decimal values from
      // fp rounding errors. Didn't want to convert to string but no convenient
      // way to get last digit of fp number mathematically.
      // NOTE: CANT ALLOW DELETION WHEN NUMBER IS RESULT OF AN EQUALS DISPLAY, consider readOnly flag
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
    }

    // Update display
    // This is intended as temporary, will need to replace
    document.getElementById('display_box').textContent = workingVal.toFixed(decimalDigit);

    console.log("workingVal: " + workingVal);
    console.log("intDigit: " + intDigit);
    console.log("decimalDigit: " + decimalDigit);
  }
  return handleNumKeys;
}

// TODO: wrap these in a closure
// TODO: Go through and straighten out refs to currentNode vs tree.root
console.log(tree);
var currentNode = null;
function handleOpKeys(id){
  lastKeyEquals = false;
  console.log(id);
  // TODO: Consider creating an operation dict like I did for numkeys and wrapping
  // plus/minus and multiply/divide together into fewer cases
  switch(id){
    // NOTE: workingval will always go on the LEFT, right will either be an operator
    // or another value. If right node is an operator of equal priority or =,
    // we can return and display the total, resetting the tree.
    case "key-equals":
      // non fatal
      // BUG: if no operation entered before = pressed then currentNode is null
      if(currentNode == null){

      }

      currentNode.right = new Node(workingVal);
      // bug fix for the key-equals popping up in display
      if(tree.root.value != "key-equals") workingTotal = resolveExpTree(tree.root);
      console.log("Equals: " + workingTotal);
      reset = true;
      tree.root = new Node(id);
      lastKeyEquals = true;
      //tree.root.left = new Node(workingTotal);
      break;
    case "key-plus":
    case "key-minus":
      // Duplicate block as mentioned in the else below, maybe should put at the end
      // and just include a != null guard here
      // Also this direct check to tree.root could be a check to currentNode I think
      if(tree.root == null){
        tree.root = new Node(id);
        tree.root.left = new Node(workingVal);
        currentNode = tree.root;
        console.log(tree.root);
        //currentNode = tree.root.right;
      }
      else if(tree.root.value == "key-equals"){
        tree.root = new Node(id);
        tree.root.left = new Node(workingTotal);
        currentNode = tree.root;
      }
      else{
        // if(currentNode.value == "key-plus" || currentNode.value == "key-minus"){
          currentNode.right = new Node(workingVal);
          console.log(tree.root);
          // if(tree.root.value !=)
          workingTotal = resolveExpTree(tree.root);
          // Duplicate block, could I move after the else?
          tree.root = new Node(id);
          tree.root.left = new Node(workingTotal);
          currentNode = tree.root;
          console.log(tree.root);
      }
      console.log("workingTotal: " + workingTotal)
      break;
    case "key-multiply":
    case "key-divide":
      // Duplicate block as mentioned in the else below, maybe should put at the end
      // and just include a != null guard here
      if(tree.root == null){
        tree.root = new Node(id);
        tree.root.left = new Node(workingVal);
        currentNode = tree.root;
        console.log(tree.root);
        //currentNode = tree.root.right;
      }
      else if(tree.root.value == "key-equals"){
        tree.root = new Node(id);
        tree.root.left = new Node(workingTotal);
        currentNode = tree.root;
      }
      else{
        if(currentNode.value != "key-plus" && currentNode.value != "key-minus"){
          currentNode.right = new Node(workingVal);
          console.log(tree.root);
          workingTotal = resolveExpTree(tree.root);
          // Duplicate block, could I move after the else?
          tree.root = new Node(id);
          tree.root.left = new Node(workingTotal);
          currentNode = tree.root;
          console.log(tree.root);
        }
        else{
          console.log("branched");
          currentNode.right = new Node(id);
          currentNode = currentNode.right;
          currentNode.left = new Node(workingVal);
        }
      }
      break;
    default:

  }
  // Display workingTotal
  // TODO: Implement something to deal with fp rounding errors, use a library
  // or potentially make this a sigfig calculator to circumvent the issue entirely
  if(firstZeroFlag)document.getElementById('display_box').textContent = workingTotal;
  firstZeroFlag = true;
  resetEntry = true;
  workingVal = 0;
}

const numKeys = document.querySelectorAll(".numpad > .numpad__row > button");
const handleNumKeysClosed = createNumKeysClos();
numKeys.forEach((button) => {
  button.addEventListener("click", () => {
    handleNumKeysClosed(button.name)
  });
});

const opKeys = document.querySelectorAll(".opad > button");
opKeys.forEach((button) => {
  button.addEventListener("click", () =>{
    handleOpKeys(button.name);
  });
});
