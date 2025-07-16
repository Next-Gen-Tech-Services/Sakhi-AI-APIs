function validateEmail(email) {
  const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (emailPattern.test(email)) {
    return true;
  } else {
    return false;
  }
}

function validateIndianMobileNumber(number) {
  // Remove any non-digit characters
  const cleanNumber = number.toString();

  // Check if the number starts with +91 (Indian country code)
  if (cleanNumber.length === 10) {
    // Validate the remaining digits
    return /^[6-9]\d{9}$/.test(cleanNumber);
  }

  return false;
}

module.exports = { validateEmail, validateIndianMobileNumber };
