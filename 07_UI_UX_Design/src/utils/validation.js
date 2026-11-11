// Indian mobile numbers: 10 digits, starting with 6, 7, 8 or 9
const PHONE_PATTERN = /^[6-9]\d{9}$/;

export function validateRegistration(values) {
  const errors = {};
  const name = values.fullName.trim();

  if (!name) {
    errors.fullName = "Please enter your full name.";
  } else if (name.length < 3) {
    errors.fullName = "Name must have at least 3 letters.";
  } else if (/\d/.test(name)) {
    errors.fullName = "Name should not contain numbers.";
  }

  if (!values.phone.trim()) {
    errors.phone = "Please enter your mobile number.";
  } else if (!PHONE_PATTERN.test(values.phone.trim())) {
    errors.phone =
      "Enter a valid 10-digit mobile number (it should start with 6, 7, 8 or 9).";
  }

  if (!values.village.trim()) {
    errors.village = "Please enter your village name.";
  }

  if (!values.district) {
    errors.district = "Please select your district.";
  }

  if (!String(values.landAcres).trim()) {
    errors.landAcres = "Please enter your land size in acres.";
  } else {
    const land = Number(values.landAcres);
    if (Number.isNaN(land) || land <= 0) {
      errors.landAcres = "Land size must be a number greater than 0.";
    } else if (land > 500) {
      errors.landAcres = "Please check the land size. It looks too large.";
    }
  }

  if (!values.mainCrop) {
    errors.mainCrop = "Please select your main crop.";
  }

  if (!values.agree) {
    errors.agree = "Please tick the box to continue.";
  }

  return errors;
}

export function validateLogin(values) {
  const errors = {};

  if (!values.phone.trim()) {
    errors.phone = "Please enter your mobile number.";
  } else if (!PHONE_PATTERN.test(values.phone.trim())) {
    errors.phone = "Enter a valid 10-digit mobile number.";
  }

  if (!values.pin.trim()) {
    errors.pin = "Please enter the demo PIN.";
  } else if (!/^\d{4}$/.test(values.pin.trim())) {
    errors.pin = "The PIN must be exactly 4 digits.";
  }

  return errors;
}

export function validateApplication(values, storage) {
  const errors = {};

  if (!values.crop) {
    errors.crop = "Please select the crop you want to store.";
  }

  const quantityText = String(values.quantityQuintals).trim();
  if (!quantityText) {
    errors.quantityQuintals = "Please enter the quantity in quintals.";
  } else {
    const quantity = Number(quantityText);
    if (Number.isNaN(quantity) || !Number.isInteger(quantity) || quantity <= 0) {
      errors.quantityQuintals = "Enter a whole number greater than 0.";
    } else if (storage && quantity > storage.availableQuintals) {
      errors.quantityQuintals = `This sample storage shows only ${storage.availableQuintals} quintals free. Please enter a smaller amount.`;
    }
  }

  if (!values.durationMonths) {
    errors.durationMonths = "Please select how many months you need.";
  } else {
    const months = Number(values.durationMonths);
    if (!Number.isInteger(months) || months < 1 || months > 12) {
      errors.durationMonths = "Choose between 1 and 12 months.";
    }
  }

  if (!values.confirm) {
    errors.confirm = "Please tick the box to confirm you understand this is a demo.";
  }

  return errors;
}