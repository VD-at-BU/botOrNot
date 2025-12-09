// server/public/js/contact.js

// Helper to get element by id
const byId = id => document.getElementById(id);

// Helper to show / clear error messages inside a row
const setError = (rowContainer, errorMessage) => {
  rowContainer.classList.toggle("invalid", Boolean(errorMessage));
  rowContainer.querySelector(".error").textContent = errorMessage || "";
};

// Basic validation helpers
const hasTwoSymbols = str => /^[A-Za-z]{2,}$/.test((str || "").trim());
const isEmailValid = str => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((str || "").trim());

// Cache form and controls
const form = byId("submitForm");
const fields = {
  firstName: byId("firstName"),
  lastName: byId("lastName"),
  email: byId("email"),
  subscriptionPackage: byId("subscriptionPackage"),
  subscribe: byId("subscribe")
};

// Cache row containers for error display
const rows = {
  firstName: byId("row-firstName"),
  lastName: byId("row-lastName"),
  email: byId("row-email"),
  subscriptionPackage: byId("row-subscriptionPackage"),
  subscribe: byId("row-subscribe")
};

// Field validation
const validateField = (name, value) => {
  switch (name) {
    case "firstName":
      return hasTwoSymbols(value)
        ? ""
        : "Please enter a minimum of 2 alphabetic characters";
    case "lastName":
      return hasTwoSymbols(value)
        ? ""
        : "Please enter a minimum of 2 alphabetic characters";
    case "email":
      // Email is optional, but validated if provided
      return value.trim() === "" || isEmailValid(value)
        ? ""
        : "Please enter a valid email address (or leave blank)";
    case "subscriptionPackage":
      return value
        ? ""
        : "Please select your interest level";
    case "subscribe":
      return value
        ? ""
        : "Please confirm this is a genuine inquiry";
    default:
      return "";
  }
};

// Validate the entire form
const validateAll = () => {
  const entries = [
    ["firstName", fields.firstName.value],
    ["lastName", fields.lastName.value],
    ["email", fields.email.value],
    ["subscriptionPackage", fields.subscriptionPackage.value],
    ["subscribe", fields.subscribe.checked]
  ];

  const errors = entries
    .map(([name, val]) => [name, validateField(name, val)])
    .filter(([_, msg]) => msg);

  entries.forEach(([name]) => {
    const msg = (errors.find(([n]) => n === name) || [, ""])[1];
    setError(rows[name], msg);
  });

  return errors.length === 0;
};

// Real-time feedback while typing
["firstName", "lastName", "email"].forEach(name => {
  fields[name].addEventListener("input", () => {
    const msg = validateField(name, fields[name].value);
    setError(rows[name], msg);
  });
});

fields.subscriptionPackage.addEventListener("change", () => {
  const msg = validateField("subscriptionPackage", fields.subscriptionPackage.value);
  setError(rows.subscriptionPackage, msg);
});

fields.subscribe.addEventListener("change", () => {
  const msg = validateField("subscribe", fields.subscribe.checked);
  setError(rows.subscribe, msg);
});

// Submission handler
form.addEventListener("submit", e => {
  e.preventDefault();
  if (!validateAll()) return;

  const fname = fields.firstName.value.trim();
  const lname = fields.lastName.value.trim();
  const eml = fields.email.value.trim() || "(no email provided)";
  const interest = fields.subscriptionPackage.value;

  const summary =
    `Thank you, ${fname} ${lname}!\n` +
    `We'll follow up at ${eml}.\n` +
    `Interest level: ${interest}.`;

  const result = byId("submissionResult");
  result.textContent = summary;
  result.classList.remove("is-hidden");
  result.focus();

  // Update the contact section title so user sees a confirmation
  byId("contact-title").textContent = "Thank you for your message";

  // Hide the form and note
  byId("formNote").classList.add("is-hidden");
  form.classList.add("is-hidden");
});

// Reset handler
byId("resetButton").addEventListener("click", () => {
  form.reset();
  Object.values(rows).forEach(r => setError(r, ""));
  const result = byId("submissionResult");
  result.classList.add("is-hidden");
  result.textContent = "";

  // Restore title/note and show form again
  byId("contact-title").textContent = "Contact";
  byId("formNote").classList.remove("is-hidden");
  form.classList.remove("is-hidden");
  fields.firstName.focus();
});
