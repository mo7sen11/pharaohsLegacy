const toSignUpBtn = document.getElementById("to-signup-form-btn");
const toLoginBtn = document.getElementById("to-login-form-btn");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("sing-up-btn");
const resetPasswordBtn = document.getElementById("resetPassword");
const loginForm = document.getElementById("login");
const registerForm = document.getElementById("register");

//* login selectors
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[A-Za-z _-]{3,20}$/;

const loginEmailMessage = document.querySelector(".login-email-message");
const loginEmailInputMessage = document.getElementById("l-e-message");
const loginPasswordMessage = document.querySelector(".login-password-message");
const loginPasswordInputMessage = document.getElementById("l-p-message");
let loginEmailInput = document.getElementById("l-email");
let loginPasswordInput = document.getElementById("l-Password");
//* register selectors
const registerNameMessage = document.querySelector(".sign-name-message");
const registerNameInputMessage = document.getElementById("s-name-message");
let registerNameInput = document.getElementById("name");
const registerEmailMessage = document.querySelector(".sign-email-message");
const registerEmailInputMessage = document.getElementById("s-email-message");
let registerEmailInput = document.getElementById("s-email");
const registerPhoneMessage = document.querySelector(".sign-phone-message");
const registerPhoneInputMessage = document.getElementById("s-phone-message");
let registerPhoneInput = document.getElementById("phone");
const registerPasswordMessage = document.querySelector(
  ".sign-password-message"
);
const registerPasswordInputMessage =
  document.getElementById("s-password-message");
let registerPasswordInput = document.getElementById("s-Password");
const registerConfirmPasswordMessage = document.querySelector(
  ".sign-cpassword-message"
);
const registerConfirmPasswordInputMessage = document.getElementById(
  "s-cpassword-message"
);
let registerConfirmPasswordInput = document.getElementById("confirmPassword");

//* toaster

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
//   toastr.success("Login Success");

//* number validation
const iti = window.intlTelInput(registerPhoneInput, {
  initialCountry: "eg",
  countrySearch: true,
  fixDropdownWidth: true,
  separateDialCode: true,
  useFullscreenPopup: false,
  customPlaceholder: (selectedCountryPlaceholder) => selectedCountryPlaceholder,
  loadUtils: () => import("./intlTelInputWithUtils.min.js"),
});

//! to display sign up form
toSignUpBtn.addEventListener("click", () => {
  loginForm.classList.add("animate__flipOutY");
  registerForm.classList.add("animate__flipInY");
  register.classList.remove("d-none");
  loginForm.classList.add("d-none");
  loginForm.classList.remove("animate__fadeInLeftBig");
  loginForm.classList.remove("animate__zoomIn");
  loginForm.classList.remove("animate__delay-1s");
});

//! to display login form
toLoginBtn.addEventListener("click", () => {
  loginForm.classList.remove("animate__flipOutY");
  registerForm.classList.remove("animate__flipInY");
  loginForm.classList.add("animate__flipInY");
  loginForm.classList.remove("d-none");
  register.classList.add("d-none");
});
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

//! validation on login inputs
//login button validation
loginBtn.addEventListener("click", () => {
  if (loginEmailInput.value === "") {
    displayError(
      loginEmailMessage,
      loginEmailInput,
      loginEmailInputMessage,
      "Email is required"
    );
    loginEmailInput.focus();
  } else if (loginPasswordInput.value === "") {
    displayError(
      loginPasswordMessage,
      loginPasswordInput,
      loginPasswordInputMessage,
      "Password is required"
    );
    loginPasswordInput.focus();
  } else if (
    loginEmailInput.value !== "" &&
    loginPasswordInput.value !== "" &&
    emailRegex.test(loginEmailInput.value) &&
    loginPasswordInput.value.length >= 8
  ) {
    loginBtn.firstElementChild.classList.replace("d-none", "d-block");
    loginBtn.lastElementChild.classList.replace("d-block", "d-none");
    loginBtn.setAttribute("disabled", "true");

    fetch("https://pharaohslegacy.cloud/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: loginEmailInput.value,
        password: loginPasswordInput.value,
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        // console.log(response);
        // console.log(data);
        if (data.message === "successful" && response.status === 200) {
          // console.log( data);
          toastr.success(`${data.message}`);

          iti.destroy();
          sessionStorage.setItem("userData", data.access_token);
          sessionStorage.setItem("isLoggedIn", "true");
          sessionStorage.setItem("userType", "user");
          loginEmailInput.value = "";
          loginPasswordInput.value = "";
          window.location.replace("index.html");
        } else if (
          data.message === "Email or password is incorrect" &&
          response.status === 401
        ) {
          toastr.error(`${data.message}`);
        }
      })

      .catch((error) => {
        console.error(error);
        toastr.error(error.message || "Something went wrong");
      })
      .finally(() => {
        loginBtn.firstElementChild.classList.replace("d-block", "d-none");
        loginBtn.lastElementChild.classList.replace("d-none", "d-block");
        loginBtn.removeAttribute("disabled");
      });
  }
});

// login email input validation
loginEmailInput.addEventListener("input", function () {
  if (!emailRegex.test(loginEmailInput.value)) {
    displayError(
      loginEmailMessage,
      loginEmailInput,
      loginEmailInputMessage,
      "Please enter a valid email address"
    );
  } else {
    hideError(loginEmailMessage, loginEmailInput, loginEmailInputMessage);
  }
});

//  login  password input validation
loginPasswordInput.addEventListener("input", function () {
  if (loginPasswordInput.value.length < 8) {
    displayError(
      loginPasswordMessage,
      loginPasswordInput,
      loginPasswordInputMessage,
      "password must be at least 8 characters"
    );
  } else {
    hideError(
      loginPasswordMessage,
      loginPasswordInput,
      loginPasswordInputMessage
    );
  }
});

//! sign up validation

// sign button validation
signupBtn.addEventListener("click", function () {
  if (registerNameInput.value === "") {
    displayError(
      registerNameMessage,
      registerNameInput,
      registerNameInputMessage,
      "Name is required"
    );
    registerNameInput.focus();
  } else if (registerEmailInput.value === "") {
    displayError(
      registerEmailMessage,
      registerEmailInput,
      registerEmailInputMessage,
      "Email is required"
    );
    registerEmailInput.focus();
  } else if (registerPhoneInput.value === "") {
    displayError(
      registerPhoneMessage,
      registerPhoneInput,
      registerPhoneInputMessage,
      "Phone is required"
    );
    registerPhoneInput.focus();
  } else if (registerPasswordInput.value === "") {
    displayError(
      registerPasswordMessage,
      registerPasswordInput,
      registerPasswordInputMessage,
      "Password is required"
    );
    registerPasswordInput.focus();
  } else if (registerConfirmPasswordInput.value === "") {
    displayError(
      registerConfirmPasswordMessage,
      registerConfirmPasswordInput,
      registerConfirmPasswordInputMessage,
      "Confirm password is required"
    );
    registerConfirmPasswordInput.focus();
  } else if (
    registerNameInput.value !== "" &&
    registerEmailInput.value !== "" &&
    registerPasswordInput.value !== "" &&
    registerConfirmPasswordInput.value !== "" &&
    registerPhoneInput.value !== "" &&
    emailRegex.test(registerEmailInput.value) &&
    nameRegex.test(registerNameInput.value) &&
    registerPasswordInput.value.length >= 8 &&
    registerConfirmPasswordInput.value === registerPasswordInput.value
  ) {
    signupBtn.firstElementChild.classList.replace("d-none", "d-block");
    signupBtn.lastElementChild.classList.replace("d-block", "d-none");
    signupBtn.setAttribute("disabled", "true");

    fetch("https://pharaohslegacy.cloud/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: registerNameInput.value,
        email: registerEmailInput.value,
        phone: registerPhoneInput.value,
        password: registerPasswordInput.value,
        password_confirmation: registerConfirmPasswordInput.value,
        address: iti.getSelectedCountryData().name,
      }),
    })
      .then(async (response) => {
        const data = await response.json();

        if (
          response.status === 201 &&
          data?.[0]?.original?.message === "successful"
        ) {
          registerNameInput.value = "";
          registerEmailInput.value = "";
          registerPasswordInput.value = "";
          registerConfirmPasswordInput.value = "";
          registerPhoneInput.value = "";
          loginForm.classList.remove("animate__flipOutY");
          registerForm.classList.remove("animate__flipInY");
          loginForm.classList.add("animate__flipInY");
          loginForm.classList.remove("d-none");
          register.classList.add("d-none");

          toastr.success(`${data[0].original.message}`);
        } else if (data.message === "faild" && response.status === 400) {
          toastr.error(
            data?.errors?.email?.[0] ||
              data?.errors?.password?.[0] ||
              "Email already exists"
          );
        }
      })
      .catch((error) => {
        toastr.error(error.message || "Something went wrong");
      })
      .finally(() => {
        signupBtn.firstElementChild.classList.replace("d-block", "d-none");
        signupBtn.lastElementChild.classList.replace("d-none", "d-block");
        signupBtn.removeAttribute("disabled");
      });
  }
});

// name input validation
registerNameInput.addEventListener("input", function () {
  if (!nameRegex.test(registerNameInput.value)) {
    displayError(
      registerNameMessage,
      registerNameInput,
      registerNameInputMessage,
      "name must be between 3->20 characters"
    );
  } else {
    hideError(registerNameMessage, registerNameInput, registerNameInputMessage);
  }
});
//phone input validation
registerPhoneInput.addEventListener("input", function () {
  if (!iti.isValidNumber()) {
    displayError(
      registerPhoneMessage,
      registerPhoneInput,
      registerPhoneInputMessage,
      "Please enter a valid Phone number"
    );
  } else {
    hideError(
      registerPhoneMessage,
      registerPhoneInput,
      registerPhoneInputMessage
    );
  }
});

//email input validation
registerEmailInput.addEventListener("input", function () {
  if (!emailRegex.test(registerEmailInput.value)) {
    displayError(
      registerEmailMessage,
      registerEmailInput,
      registerEmailInputMessage,
      "Please enter a valid email address"
    );
  } else {
    hideError(
      registerEmailMessage,
      registerEmailInput,
      registerEmailInputMessage
    );
  }
});

//register password input
registerPasswordInput.addEventListener("input", function () {
  if (registerPasswordInput.value.length < 8) {
    displayError(
      registerPasswordMessage,
      registerPasswordInput,
      registerPasswordInputMessage,
      "password must be at least 8 characters"
    );
  } else {
    hideError(
      registerPasswordMessage,
      registerPasswordInput,
      registerPasswordInputMessage
    );
  }
});

//confirm password input
registerConfirmPasswordInput.addEventListener("input", function () {
  if (registerConfirmPasswordInput.value !== registerPasswordInput.value) {
    displayError(
      registerConfirmPasswordMessage,
      registerConfirmPasswordInput,
      registerConfirmPasswordInputMessage,
      "password doesn't match confirm password "
    );
  } else {
    hideError(
      registerConfirmPasswordMessage,
      registerConfirmPasswordInput,
      registerConfirmPasswordInputMessage
    );
  }
});

//! google button

document.querySelector(".google-signin-btn").addEventListener("click", () => {
  const popup = window.open(
    "https://pharaohslegacy.cloud/auth/google",
    "googleLoginPopup",
    "width=500,height=600"
  );

  window.addEventListener("message", (event) => {
    if (event.origin === "https://pharaohslegacy.cloud") {
      const token = event.data.Token;
      sessionStorage.setItem("userData", token);
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("userType", "user");
      window.location.replace("index.html");
    }
  });
});
