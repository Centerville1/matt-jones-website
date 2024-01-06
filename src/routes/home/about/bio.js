import bioJSON from "./bios.json";

/**
 * @param {string} startString
 * @param {string} endString
 */
function calcDiff(startString, endString) {
  // console.log("finding diff");
  // console.log(startString);
  // console.log(endString);
  let longLength = startString.length >= endString.length ? startString.length : endString.length;
  let diffs = [];
  for (let i = 0; i < longLength; i++) {
    if (i > endString.length - 1) {
      diffs.push({"index": i, "character": ' '});
    }
    else {
      if (startString[i] !== endString[i]) {
        diffs.push({"index": i, "character": endString[i]});
      }
    }
  }
  // console.log(diffs);
  return diffs;
}

/**
 * @param {number} spaceCount
 */
function generateWhitespace(spaceCount) {
  let string = "";
  for (let i = 0; i < spaceCount; i++)
    string += " ";
  return string;
}

/**
 * @param {string} startString
 * @param {string} endString
 * @param {number} steps
 */
export function stringTransformSteps(startString, endString, steps) {
  // console.log("diff:", calcDiff(startString, endString));
  let diff = calcDiff(startString, endString);
  let changesPerStep = diff.length / steps;
  // console.log(diff, changesPerStep, startString.length);

  let stepFrames = [];
  let changeCount = 0, prevChangeCount = 0, changesCompleted = 0;
  for (let i = 0; i < steps; i++) {
    changeCount = prevChangeCount + changesPerStep;
    let numChanges = Math.round(changeCount - changesCompleted);

    // console.log("in steps loop", i, changeCount, numChanges);
    // console.log("num changes", numChanges);
    for (let j = 0; j < numChanges; j++) {
      let changeIndex = Math.round(Math.random() * (diff.length - 1));
      // console.log("in changes loop", j, changeIndex, diff);
      let change = diff.splice(changeIndex, 1)[0];
      // console.log("change to apply: ", change);
      if (change.index >= startString.length) {
        startString = startString + generateWhitespace(change.index - startString.length) + change.character;
      }
      else {
        startString = startString.substring(0, change.index) + change.character + startString.substring(change.index + 1);
      }
    }
    // console.log(startString);
    stepFrames.push(startString);
    changesCompleted += numChanges;
    prevChangeCount = changeCount;
  }
  stepFrames[steps] = endString;
  // console.log(stepFrames);
  return stepFrames;
}

export let bios = bioJSON;
