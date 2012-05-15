/* Ajax Construction Kit  */
/* Validation Toolkit Functions  */
/*
04/21/2011*/
function validateNonEmpty(inputControl, helpControl) {
  // See if the input value contains any text
  return validateRegEx(/.+/,
    inputControl.value, helpControl,
    "Please enter a value.");
}
function validateAge(inputControl, helpControl){
          if (!validateInteger(inputControl, helpControl))
              return false;
          if (inputControl.value < 1 || inputControl.value > 120){
              if (helpControl != null)
                  helpControl.innerHTML = "Please enter an age in the range 1-120.";
              return false;
          }
          else {
              if (helpControl != null)
                  helpControl.innerHTML = "";
              return true;
          }
      }
function validateInteger(inputControl, helpControl) {
  // First see if the input value contains data
  if (!validateNonEmpty(inputControl, helpControl))
    return false;

  // Then see if the input value is an integer
  return validateRegEx(/^[-]?\d*$/,
    inputControl.value, helpControl,
    "Please enter an integer.");
}

function validateNumber(inputControl, helpControl) {
  // First see if the input value contains data
  if (!validateNonEmpty(inputControl, helpControl))
    return false;

  // Then see if the input value is a number
  return validateRegEx(/^[-]?\d*\.?\d*$/,
    inputControl.value, helpControl,
    "Please enter a number.");
}

function validateZipCode(inputControl, helpControl) {
  // First see if the input value contains data
  if (!validateNonEmpty(inputControl, helpControl))
    return false;

  // Then see if the input value is a ZIP code
  return validateRegEx(/^\d{5}$/,
    inputControl.value, helpControl,
    "Please enter a 5-digit ZIP code.");
}

function validatePhone(inputControl, helpControl) {
  // First see if the input value contains data
  if (!validateNonEmpty(inputControl, helpControl))
    return false;

  // Then see if the input value is a phone number
  return validateRegEx(/^\d{3}-\d{3}-\d{4}$/,
    inputControl.value, helpControl,
    "Please enter a phone number (for example, 123-456-7890).");
}

function validateEmail(inputControl, helpControl) {
  // First see if the input value contains data
  if (!validateNonEmpty(inputControl, helpControl))
    return false;

  // Then see if the input value is an email address
  return validateRegEx(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    inputControl.value, helpControl,
    "Please enter an email address (for example, john@doe.com).");
}

function validateDate(inputControl, helpControl) {
  // First see if the input value contains data
  if (!validateNonEmpty(inputControl, helpControl))
    return false;

  // Then see if the input value is a date
  return validateRegEx(/^(0[1-9]|1[012]|[1-9])[- /.](0[1-9]|[12][0-9]|3[01]|[1-9])[- /.](19|20)\d\d$/,
    inputControl.value, helpControl,
    "Please enter a date from between 01-01-1900 and 12-31-2099. Format: mm-dd-yyyy");
}

function validateRegEx(regex, input, helpControl, helpMessage) {
  if (!regex.test(input)) {
    if (helpControl != null)
      helpControl.innerHTML = helpMessage;
    return false;
  }
  else {
    if (helpControl != null)
      helpControl.innerHTML = "";
    return true;
  }
}
