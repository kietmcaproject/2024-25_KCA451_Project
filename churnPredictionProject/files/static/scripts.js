// Ensure the script runs after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Declare variables at the top to avoid redeclaration issues
  const savedTheme = localStorage.getItem("theme") || "light";
  let timerInterval; // Use let since this will be reassigned
  const otpModal = document.getElementById("otpModal");

  // Hide the feedback spinner on page load
  const feedbackSpinner = document.getElementById("feedbackSpinner");
  if (feedbackSpinner) {
    feedbackSpinner.style.display = "none";
  } else {
    console.log(
      "feedbackSpinner element not found - likely on a page without the feedback form."
    );
  }

  // Dark Mode Toggle Functionality
  const themeIcon = document.getElementById("themeIcon");

  // Apply the saved theme if themeIcon exists
  if (themeIcon) {
    document.documentElement.setAttribute("data-theme", savedTheme);
    themeIcon.className = savedTheme === "dark" ? "fas fa-sun" : "fas fa-moon";

    themeIcon.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      themeIcon.className = newTheme === "dark" ? "fas fa-sun" : "fas fa-moon";

      // Update Chart.js chart colors for the new theme
      const chart = Chart.getChart("probChart");
      if (chart) {
        chart.options.scales.x.ticks.color = getComputedStyle(
          document.documentElement
        )
          .getPropertyValue("--chart-label-color")
          .trim();
        chart.options.scales.y.ticks.color = getComputedStyle(
          document.documentElement
        )
          .getPropertyValue("--chart-label-color")
          .trim();
        chart.options.plugins.legend.labels.color = getComputedStyle(
          document.documentElement
        )
          .getPropertyValue("--chart-label-color")
          .trim();
        chart.options.plugins.title.color = getComputedStyle(
          document.documentElement
        )
          .getPropertyValue("--chart-label-color")
          .trim();
        chart.update();
      }
    });
  } else {
    console.error("themeIcon element not found. Theme toggle will not work.");
  }

  // Chatbot Functionality
  const chatbotWindow = document.getElementById("chatbotWindow");
  const chatbotMessages = document.getElementById("chatbotMessages");
  const chatbotQuestions = document.getElementById("chatbotQuestions");

  const answers = {
    1: "The Random Forest model has the highest accuracy at 85%.",
    2: "We use nine models in the app.",
    3: "The app uses the following models for churn prediction:\n- Logistic Regression\n- Decision Tree\n- Random Forest (Information Gain)\n- Random Forest (Entropy)\n- SVM\n- KNN\n- Bernoulli Naive Bayes\n- Gaussian Naive Bayes\n- XGBoost",
    4: "Churn prediction helps businesses identify customers likely to leave, enabling proactive retention strategies.",
    5: "It helps businesses save costs and improve customer satisfaction by retaining customers.",
    6: "By improving customer service, offering personalized experiences, and addressing feedback promptly.",
    7: "Proactive engagement, loyalty programs, and targeted marketing campaigns.",
  };

  function toggleChatbot() {
    if (!chatbotWindow) {
      console.error("chatbotWindow element not found.");
      return;
    }
    if (chatbotWindow.style.display === "block") {
      chatbotWindow.style.display = "none";
    } else {
      chatbotWindow.style.display = "block";
      // Check if the chatbot messages area is empty or has only the welcome message
      const hasOnlyWelcomeMessage =
        chatbotMessages.children.length === 0 ||
        (chatbotMessages.children.length === 1 &&
          chatbotMessages.children[0].querySelector(".chatbot-text")
            .textContent ===
            "Hi! I'm your Churn Prediction assistant. What would you like to know? Select a question below!");
      if (hasOnlyWelcomeMessage) {
        chatbotMessages.innerHTML = ""; // Clear any existing content
        setTimeout(() => {
          addBotMessage(
            "Hi! I'm your Churn Prediction assistant. What would you like to know? Select a question below!"
          );
        }, 300); // Small delay for better UX
      }
    }
  }

  function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  function scrollToBottom() {
    if (!chatbotMessages) return;
    chatbotMessages.scrollTo({
      top: chatbotMessages.scrollHeight,
      behavior: "smooth", // Smooth scrolling for better UX
    });
  }

  function addBotMessage(message) {
    if (!chatbotMessages) {
      console.error("chatbotMessages element not found.");
      return;
    }
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("chatbot-message", "bot-message");
    const timeSpan = document.createElement("span");
    timeSpan.classList.add("chatbot-timestamp");
    timeSpan.textContent = getCurrentTime();
    messageDiv.appendChild(timeSpan);
    const textSpan = document.createElement("span");
    textSpan.classList.add("chatbot-text");
    messageDiv.appendChild(textSpan);
    chatbotMessages.appendChild(messageDiv);
    typeMessage(textSpan, message, () => {
      scrollToBottom(); // Scroll to bottom after typing animation completes
    });
  }

  function addUserMessage(message) {
    if (!chatbotMessages) {
      console.error("chatbotMessages element not found.");
      return;
    }
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("chatbot-message", "user-message");
    const timeSpan = document.createElement("span");
    timeSpan.classList.add("chatbot-timestamp");
    timeSpan.textContent = getCurrentTime();
    messageDiv.appendChild(timeSpan);
    const textSpan = document.createElement("span");
    textSpan.classList.add("chatbot-text");
    textSpan.textContent = message;
    messageDiv.appendChild(textSpan);
    chatbotMessages.appendChild(messageDiv);
    scrollToBottom(); // Scroll to bottom immediately after adding user message
  }

  function typeMessage(element, message, callback) {
    let index = 0;
    element.textContent = "";
    const typingSpeed = 50; // Milliseconds per character
    const typingInterval = setInterval(() => {
      if (index < message.length) {
        element.textContent += message.charAt(index);
        index++;
        scrollToBottom(); // Scroll during typing to keep the latest text in view
      } else {
        clearInterval(typingInterval);
        if (callback) callback(); // Call the callback after typing is complete
      }
    }, typingSpeed);
  }

  function handleQuestion(questionNumber) {
    const questionElement = document.querySelector(
      `.chatbot-question:nth-child(${questionNumber})`
    );
    if (!questionElement) {
      console.error(`Chatbot question ${questionNumber} not found.`);
      return;
    }
    const questionText = questionElement.textContent;
    addUserMessage(questionText);
    setTimeout(() => {
      addBotMessage(answers[questionNumber]);
    }, 500);
  }

  function clearChat() {
    if (!chatbotMessages) {
      console.error("chatbotMessages element not found.");
      return;
    }
    chatbotMessages.innerHTML = "";
    setTimeout(() => {
      addBotMessage(
        "Hi! I'm your Churn Prediction assistant. What would you like to know? Select a question below!"
      );
    }, 300); // Small delay for better UX
  }

  // OTP JavaScript
  function startOtpTimer() {
    let timeLeft = 120;
    const timerDisplay = document.getElementById("otpTimer");
    const resendBtn = document.getElementById("resendOtpBtn");

    if (!timerDisplay || !resendBtn) {
      console.error("otpTimer or resendOtpBtn element not found.");
      return;
    }

    timerInterval = setInterval(() => {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      timerDisplay.textContent = `${minutes}:${
        seconds < 10 ? "0" : ""
      }${seconds}`;

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timerDisplay.textContent = "Expired";
        resendBtn.disabled = false;
      }
      timeLeft--;
    }, 1000);
  }

  function resetModal() {
    const emailForm = document.getElementById("emailForm");
    const otpForm = document.getElementById("otpForm");
    const emailInput = document.getElementById("emailInput");
    const otpInput = document.getElementById("otpInput");
    const otpMessage = document.getElementById("otpMessage");
    const otpTimer = document.getElementById("otpTimer");
    const resendBtn = document.getElementById("resendOtpBtn");

    if (
      !emailForm ||
      !otpForm ||
      !emailInput ||
      !otpInput ||
      !otpMessage ||
      !otpTimer ||
      !resendBtn
    ) {
      console.error("One or more OTP modal elements not found.");
      return;
    }

    emailForm.style.display = "block";
    otpForm.style.display = "none";
    emailInput.value = "";
    otpInput.value = "";
    otpMessage.innerHTML = "";
    otpTimer.textContent = "2:00";
    clearInterval(timerInterval);
    resendBtn.disabled = true;
  }

  function resendOtp() {
    const emailInput = document.getElementById("emailInput");
    const messageDiv = document.getElementById("otpMessage");
    const spinner = document.getElementById("loadingSpinner");

    if (!emailInput || !messageDiv || !spinner) {
      console.error(
        "emailInput, otpMessage, or loadingSpinner element not found."
      );
      return;
    }

    const email = emailInput.value;
    spinner.style.display = "block";
    messageDiv.innerHTML = "";

    fetch("/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        email: email,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        spinner.style.display = "none";
        if (data.success) {
          messageDiv.innerHTML =
            '<div class="alert alert-info">New OTP sent to your email. Please check your inbox.</div>';
          clearInterval(timerInterval);
          startOtpTimer();
          document.getElementById("resendOtpBtn").disabled = true;
        } else {
          messageDiv.innerHTML = `<div class="alert alert-danger">${data.message}</div>`;
          document.getElementById("resendOtpBtn").disabled = false;
        }
      })
      .catch((error) => {
        spinner.style.display = "none";
        messageDiv.innerHTML =
          '<div class="alert alert-danger">An error occurred. Please try again.</div>';
        document.getElementById("resendOtpBtn").disabled = false;
      });
  }

  const emailSubmitForm = document.getElementById("emailSubmitForm");
  if (emailSubmitForm) {
    emailSubmitForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const emailInput = document.getElementById("emailInput");
      const messageDiv = document.getElementById("otpMessage");
      const spinner = document.getElementById("loadingSpinner");

      if (!emailInput || !messageDiv || !spinner) {
        console.error(
          "emailInput, otpMessage, or loadingSpinner element not found."
        );
        return;
      }

      const email = emailInput.value;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        messageDiv.innerHTML =
          '<div class="alert alert-danger">Please enter a valid email address.</div>';
        return;
      }

      spinner.style.display = "block";
      messageDiv.innerHTML = "";

      fetch("/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email: email,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          spinner.style.display = "none";
          if (data.success) {
            document.getElementById("emailForm").style.display = "none";
            document.getElementById("otpForm").style.display = "block";
            messageDiv.innerHTML =
              '<div class="alert alert-info">OTP sent to your email. Please check your inbox.</div>';
            startOtpTimer();
          } else {
            messageDiv.innerHTML = `<div class="alert alert-danger">${data.message}</div>`;
          }
        })
        .catch((error) => {
          spinner.style.display = "none";
          messageDiv.innerHTML =
            '<div class="alert alert-danger">An error occurred. Please try again.</div>';
        });
    });
  } else {
    console.error("emailSubmitForm element not found.");
  }

  const otpSubmitForm = document.getElementById("otpSubmitForm");
  if (otpSubmitForm) {
    otpSubmitForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const otpInput = document.getElementById("otpInput");
      const messageDiv = document.getElementById("otpMessage");
      const spinner = document.getElementById("loadingSpinner");

      if (!otpInput || !messageDiv || !spinner) {
        console.error(
          "otpInput, otpMessage, or loadingSpinner element not found."
        );
        return;
      }

      const otp = otpInput.value;
      spinner.style.display = "block";
      messageDiv.innerHTML = "";

      fetch("/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          otp: otp,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          spinner.style.display = "none";
          if (data.success) {
            messageDiv.innerHTML =
              '<div class="alert alert-success">OTP verified! Redirecting...</div>';
            setTimeout(() => {
              window.location.href = data.redirect;
            }, 1000);
          } else {
            messageDiv.innerHTML = `<div class="alert alert-danger">${data.message}</div>`;
            if (data.message.includes("expired")) {
              document.getElementById("resendOtpBtn").disabled = false;
            }
          }
        })
        .catch((error) => {
          spinner.style.display = "none";
          messageDiv.innerHTML =
            '<div class="alert alert-danger">An error occurred. Please try again.</div>';
        });
    });
  } else {
    console.error("otpSubmitForm element not found.");
  }

  if (otpModal) {
    otpModal.addEventListener("hidden.bs.modal", function () {
      resetModal();
    });
  } else {
    console.error("otpModal element not found.");
  }

  // Chart.js for Probability Visualization (if probText exists)
  const probText = document.getElementById("probText");
  const probChartCanvas = document.getElementById("probChart");

  if (probText && probChartCanvas) {
    const probTextContent = probText.textContent.trim();
    console.log("probText content:", probTextContent); // Debug the content

    const probMatch = probTextContent.match(
      /Churn: (\d+\.\d+)% \| Probability of No Churn: (\d+\.\d+)/
    );

    if (probMatch) {
      const churnProb = parseFloat(probMatch[1]);
      const noChurnProb = parseFloat(probMatch[2]);

      if (isNaN(churnProb) || isNaN(noChurnProb)) {
        console.error("Parsed probabilities are invalid:", {
          churnProb,
          noChurnProb,
        });
        return;
      }

      try {
        const ctx = probChartCanvas.getContext("2d");
        if (!ctx) {
          console.error("Failed to get 2D context for probChart canvas.");
          return;
        }

        new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Probability"], // Single label for the y-axis
            datasets: [
              {
                label: "Churn", // Label for Churn dataset
                data: [churnProb], // Only Churn probability
                backgroundColor: "#ff6384", // Red for Churn
                borderColor: "#ff6384",
                borderWidth: 1,
              },
              {
                label: "No Churn", // Label for No Churn dataset
                data: [noChurnProb], // Only No Churn probability
                backgroundColor: "#36a2eb", // Blue for No Churn
                borderColor: "#36a2eb",
                borderWidth: 1,
              },
            ],
          },
          options: {
            indexAxis: "y",
            scales: {
              x: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  color: getComputedStyle(document.documentElement)
                    .getPropertyValue("--chart-label-color")
                    .trim(),
                },
              },
              y: {
                ticks: {
                  color: getComputedStyle(document.documentElement)
                    .getPropertyValue("--chart-label-color")
                    .trim(),
                },
              },
            },
            plugins: {
              legend: {
                labels: {
                  color: getComputedStyle(document.documentElement)
                    .getPropertyValue("--chart-label-color")
                    .trim(),
                },
              },
              title: {
                display: true,
                text: "Churn Prediction Probabilities",
                color: getComputedStyle(document.documentElement)
                  .getPropertyValue("--chart-label-color")
                  .trim(),
              },
            },
          },
        });
        console.log("Chart rendered successfully with probabilities:", {
          churnProb,
          noChurnProb,
        });
      } catch (error) {
        console.error("Error rendering Chart.js chart:", error);
      }
    } else {
      console.error(
        "probText format does not match expected pattern. Expected format: 'Churn: XX.XX% | Probability of No Churn: YY.YY%'. Actual content:",
        probTextContent
      );
    }
  } else {
    console.log(
      "probText or probChart element not found - likely on a page without prediction results or chart canvas is missing."
    );
  }

  // Feedback Form Submission
  const feedbackForm = document.getElementById("feedbackForm");
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const nameInput = document.getElementById("feedbackName");
      const emailInput = document.getElementById("feedbackEmail");
      const feedbackInput = document.getElementById("feedbackMessage");
      const spinner = document.getElementById("feedbackSpinner");

      if (!nameInput || !emailInput || !feedbackInput || !spinner) {
        console.error("One or more feedback form elements not found.");
        return;
      }

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const feedback = feedbackInput.value.trim();

      // Client-side validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!name || !email || !feedback) {
        showToast("Please provide your name, email, and feedback.", "danger");
        return;
      }
      if (!emailRegex.test(email)) {
        showToast("Please provide a valid email address.", "danger");
        return;
      }

      spinner.style.display = "block";

      // Send feedback via AJAX
      fetch("/submit-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          name: name,
          email: email,
          feedback: feedback,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          spinner.style.display = "none";
          if (data.success) {
            showToast(data.message, "success");
            // Reset the form
            feedbackForm.reset();
          } else {
            showToast(data.message, "danger");
          }
        })
        .catch((error) => {
          spinner.style.display = "none";
          showToast("An error occurred. Please try again.", "danger");
        });
    });
  } else {
    console.log(
      "feedbackForm element not found - likely on a page without the feedback form."
    );
  }

  // Function to show Bootstrap toast notification
  function showToast(message, type) {
    const toastElement = document.getElementById("feedbackToast");
    const toastBody = document.getElementById("feedbackToastBody");

    if (!toastElement || !toastBody) {
      console.error("Toast elements not found.");
      return;
    }

    // Set the message
    toastBody.textContent = message;

    // Update toast styling based on type (success or danger)
    toastElement.classList.remove("bg-success", "bg-danger", "text-white");
    if (type === "success") {
      toastElement.classList.add("bg-success", "text-white");
    } else if (type === "danger") {
      toastElement.classList.add("bg-danger", "text-white");
    }

    // Initialize and show the toast
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
  }

  // Expose functions to the global scope for HTML event handlers
  window.toggleChatbot = toggleChatbot;
  window.handleQuestion = handleQuestion;
  window.clearChat = clearChat;
  window.resendOtp = resendOtp;
});
