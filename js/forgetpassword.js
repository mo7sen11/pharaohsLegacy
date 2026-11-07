// Add an animate.css floating animation
// Add floating animation class since it's not in animate.css
const floatingAnimation = document.createElement("style");
floatingAnimation.innerHTML = `
    @keyframes floating {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      25% { transform: translateY(-15px) rotate(5deg); }
      75% { transform: translateY(15px) rotate(-5deg); }
    }
    .animate__floating {
      animation-name: floating;
    }
  `;
document.head.appendChild(floatingAnimation);

// Create dust particles with animate.css
createDustParticles();

// Current step tracker
let currentStep = 1;
let email="";
// Get DOM elements
const progressBar = document.getElementById("progress-bar");
const steps = document.querySelectorAll(".step");
const forms = document.querySelectorAll(".form-step");
const successMessage = document.getElementById("success-message");

// Email form elements
const emailInput = document.getElementById("email");
const emailMessage = document.querySelector(".email-message");
const emailInputMessage = document.querySelector(".email-input-message");
const emailNext = document.getElementById("email-next");

// Code form elements
const codeInput = document.getElementById("verification-code");
const codeMessage = document.querySelector(".code-message");
const codeInputMessage = document.querySelector(".code-input-message");
const codePrev = document.getElementById("code-prev");
const codeNext = document.getElementById("code-next");

// Password form elements
const passwordInput = document.getElementById("new-password");
const confirmPasswordInput = document.getElementById("confirm-password");
const passwordMessage = document.querySelector(".password-message");
const passwordInputMessage = document.querySelector(".password-input-message");
const confirmMessage = document.querySelector(".confirm-password-message");
const confirmInputMessage = document.querySelector(
  ".confirm-password-input-message"
);
const passwordPrev = document.getElementById("password-prev");
const submitBtn = document.getElementById("submit-btn");
toastr.options = {
  closeButton: true,
  debug: false,
  newestOnTop: true,
  progressBar: true,
  positionClass: "toast-top-right",
  preventDuplicates: false,
  onclick: null,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "5000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  hideMethod: "slideUp",
  showMethod: "slideDown",
};
//! Create dust particles function
function createDustParticles() {
  const background = document.querySelector(".background");
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement("div");
    particle.classList.add(
      "dust-particle",
      "animate__animated",
      "animate__fadeIn",
      "animate__fadeOut"
    );

    // Random starting position
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;

    // Random animation duration
    const duration = Math.random() * 20 + 10;
    particle.style.animationDuration = `${duration}s`;

    // Random delay
    const delay = Math.random() * 10;
    particle.style.animationDelay = `${delay}s`;

    // Random size
    const size = Math.random() * 3 + 1;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    // Set position
    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;

    // Add floating animation
    particle.classList.add("animate__floating");
    particle.style.animationIterationCount = "infinite";

    background.appendChild(particle);
  }
}

//! Update progress bar
function updateProgress() {
  const percent = ((currentStep - 1) / (steps.length - 1)) * 100;
  progressBar.style.width = `${percent}%`;
}

//! Navigate to step
function goToStep(step) {
  // Update current step
  currentStep = step;

  // Update steps styling
  steps.forEach((stepEl, idx) => {
    if (idx + 1 < currentStep) {
      stepEl.classList.add("completed");
      stepEl.classList.remove("active");
    } else if (idx + 1 === currentStep) {
      stepEl.classList.add("active");
      stepEl.classList.remove("completed");
    } else {
      stepEl.classList.remove("active", "completed");
    }
  });

  // Show current form with animation
  forms.forEach((form, idx) => {
    if (idx + 1 === currentStep) {
      form.classList.add("active");
      form.classList.add("animate__fadeIn");
      form.classList.remove("animate__fadeOut");
    } else {
      form.classList.remove("active");
      form.classList.remove("animate__fadeIn");
      form.classList.add("animate__fadeOut");
    }
  });

  // Update progress bar
  updateProgress();
}

//! Validate email
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
}

//! Validate verification code
function validateCode(code) {
  const codeRegex = /^\d{6}$/;
  return codeRegex.test(code);
}

//! Validate password
function validatePassword(password) {
  return password.length >= 8;
}

//! Validate confirm password
function validateConfirmPassword(password, confirmPassword) {
  return password === confirmPassword;
}

//! Show success message
function showSuccess() {
  forms.forEach((form) => {
    form.classList.remove("active");
  });
  successMessage.style.display = "block";
  successMessage.classList.add("animate__animated", "animate__zoomIn");
}
//! display error message on input
const displayError = function (container, input, inputMessage, message) {
  container.classList.replace("d-none", "d-flex");
  input.classList.add("is-invalid");
  inputMessage.textContent = `${message}`;
};
//! Hide error message on input
const hideError = function (container, input, inputMessage) {
  input.classList.replace("is-invalid", "is-valid");
  container.classList.replace("d-flex", "d-none");
  inputMessage.textContent = "";
};

//!email input validation
emailInput.addEventListener("input", function () {
  if (!validateEmail(emailInput.value)) {
    displayError(
      emailMessage,
      emailInput,
      emailInputMessage,
      "please enter a valid email"
    );
  } else {
    hideError(emailMessage, emailInput, emailInputMessage);
  }
});

//! Event listeners
emailNext.addEventListener("click", function () {
  if (emailInput.value === "") {
    displayError(
      emailMessage,
      emailInput,
      emailInputMessage,
      "Email is required"
    );
    emailInput.focus();
  } else if (emailInput.value !== "" && validateEmail(emailInput.value)) {
    hideError(emailMessage, emailInput, emailInputMessage);
    emailNext.setAttribute("disabled", "true");
    emailNext.firstElementChild.classList.replace("d-none", "d-block");
    emailNext.lastElementChild.classList.replace("d-block", "d-none");
    fetch("https://pharaohslegacy.cloud/api/password/forgot-password", {
      method: "POST",
      body: JSON.stringify({
        email: emailInput.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        const data = await response.json();
        console.log(response);
        console.log(data);
        if (response.status === 200 && data.message === "successful") {
          email = emailInput.value;
          emailInput.value = "";
          toastr.info("Check your Email");
          goToStep(2);
        } else if (
          response.status === 200 &&
          data.message === "Email not found"
        ) {
          toastr.error(`${data.message}`);
        }
      })
      .catch((error) => {
        toastr.error(error.message || "Something went wrong");
      })
      .finally(() => {
        emailNext.removeAttribute("disabled");
        emailNext.firstElementChild.classList.replace("d-block", "d-none");
        emailNext.lastElementChild.classList.replace("d-none", "d-block");
      });
  }
});

codePrev.addEventListener("click", function () {
  goToStep(1);
});

codeInput.addEventListener("input", function () {
  if (!validateCode(codeInput.value)) {
    displayError(
      codeMessage,
      codeInput,
      codeInputMessage,
      "Please enter a valid verification code"
    );
  } else {
    hideError(codeMessage, codeInput, codeInputMessage);
  }
});

codeNext.addEventListener("click", function () {
  if (codeInput.value === "") {
    displayError(codeMessage, codeInput, codeInputMessage, "Code is required");
    codeInput.focus();
  } else if (codeInput.value !== "" && validateCode(codeInput.value)) {
    hideError(codeMessage, codeInput, codeInputMessage);
    codeNext.setAttribute("disabled", "true");
    codeNext.firstElementChild.classList.replace("d-none", "d-block");
    codeNext.lastElementChild.classList.replace("d-block", "d-none");
    fetch("https://pharaohslegacy.cloud/api/password/verify-reset-code", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        code: codeInput.value
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        const data = await response.json();
        console.log(response);
        console.log(data);
        if (response.status === 200 && data.message === "success") {
          codeInput.value = "";
          goToStep(3);
        } else if (
          response.status === 200 &&
          data.message === "code is not correct"
        ) {
          toastr.error(`${data.message}`);
        }
      })
      .catch((error) => {
        toastr.error(error.message || "Something went wrong");
      })
      .finally(() => {
        codeNext.removeAttribute("disabled");
        codeNext.firstElementChild.classList.replace("d-block", "d-none");
        codeNext.lastElementChild.classList.replace("d-none", "d-block");
      });
  }
});

passwordPrev.addEventListener("click", function () {
  goToStep(2);
});

passwordInput.addEventListener("input", function () {
  if (!validatePassword(passwordInput.value)) {
    displayError(
      passwordMessage,
      passwordInput,
      passwordInputMessage,
      "Password must be at least 8 characters long"
    );
  } else {
    hideError(passwordMessage, passwordInput, passwordInputMessage);
  }
});
confirmPasswordInput.addEventListener("input", function () {
  if (
    !validateConfirmPassword(passwordInput.value, confirmPasswordInput.value)
  ) {
    displayError(
      confirmMessage,
      confirmPasswordInput,
      confirmInputMessage,
      "password does not match"
    );
  } else {
    hideError(confirmMessage, confirmPasswordInput, confirmInputMessage);
  }
});

submitBtn.addEventListener("click", function () {
  if (passwordInput.value === "") {
    displayError(
      passwordMessage,
      passwordInput,
      passwordInputMessage,
      "password is required"
    );
    passwordInput.focus();
  } else if (confirmPasswordInput.value === "") {
    displayError(
      confirmMessage,
      confirmPasswordInput,
      confirmInputMessage,
      "Confirm password is required"
    );
    confirmPasswordInput.focus();
  } else if (
    passwordInput.value !== "" &&
    confirmPasswordInput.value !== "" &&
    validateConfirmPassword(passwordInput.value, confirmPasswordInput.value)
  ) {
    hideError(passwordMessage, passwordInput, passwordInputMessage);
    hideError(confirmMessage, confirmPasswordInput, confirmInputMessage);


    submitBtn.setAttribute("disabled", "true");
    submitBtn.firstElementChild.classList.replace("d-none", "d-block");
    submitBtn.lastElementChild.classList.replace("d-block", "d-none");
    fetch("https://pharaohslegacy.cloud/api/password/reset-password", {
      method: "POST",
      body: JSON.stringify({
  
        email: email,
        password: passwordInput.value,
        password_confirmation: confirmPasswordInput.value
        
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        const data = await response.json();
        console.log(response);
        console.log(data);
        if (response.status === 200 && data.message === "success") {
          passwordInput.value = "";
          confirmPasswordInput.value = "";
          showSuccess();
           setTimeout(() => {
            window.location.replace("auth.html");
          }, 5000);
        } else if (
          response.status === 400 
          
        ) {
          toastr.error(`${data.message}`);
        }
      })
      .catch((error) => {
        toastr.error(error.message || "Something went wrong");
        // console.log(error);
        
      })
      .finally(() => {
        submitBtn.removeAttribute("disabled");
        submitBtn.firstElementChild.classList.replace("d-block", "d-none");
        submitBtn.lastElementChild.classList.replace("d-none", "d-block");
      });
   
  }
});

// Initial setup
updateProgress();
