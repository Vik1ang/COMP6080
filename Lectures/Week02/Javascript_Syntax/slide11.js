let value = 10;

let strValue = value.toString();
// or: let strValue = value + '';

let numValue = parseInt(strValue, 10);
// or: let numValue = parseFloat(strValue);
// or: let numValue = +strValue;

let bigIntValue = BigInt(numValue);
// or: let bigIntValue = BigInt(strValue);

let numValue = Number(bigIntValue);
// or: let numValue = parseInt(bigIntValue, 10);
