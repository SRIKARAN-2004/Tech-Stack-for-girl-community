// ===============================
// Tech For Girls - script.js (final with base64 upload)
// ===============================

let shareCount = 0;
const shareBtn = document.getElementById("whatsappShareBtn");
const shareCountDisplay = document.getElementById("shareCount");
const submitBtn = document.getElementById("submitBtn");
const form = document.getElementById("registrationForm");
const statusMsg = document.getElementById("statusMessage");

// ✅ Step 5: Prevent multiple submissions using localStorage
window.onload = () => {
  if (localStorage.getItem("submitted") === "true") {
    disableForm();
    statusMsg.textContent = "🎉 You have already submitted.";
  }
};

// ✅ WhatsApp share button logic with counter
shareBtn.addEventListener("click", () => {
  shareCount++;
  if (shareCount >= 5) {
    shareCountDisplay.textContent = "Sharing complete. Please continue.";
    submitBtn.disabled = false;
    shareBtn.disabled = true;
  } else {
    shareCountDisplay.textContent = `Click count: ${shareCount}/5`;
  }

  // Open WhatsApp with prewritten message
  let message = "Hey Buddy, Join Tech For Girls Community";
  let url = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
});

// ✅ Step 4 & Step 6: Form submission logic + Google Sheets integration with base64 file upload
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (shareCount < 5) {
    alert("Please complete sharing before submission.");
    return;
  }

  // Collect form data
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const college = document.getElementById("college").value;
  const screenshot = document.getElementById("screenshot").files[0];

  // Validate file selected
  if (!screenshot) {
    alert("Please upload your screenshot before submitting.");
    return;
  }

  const reader = new FileReader();
  reader.onloadend = function() {
    const base64String = reader.result.split(",")[1]; // Remove data mime prefix

    const data = {
      name: name,
      phone: phone,
      email: email,
      college: college,
      filename: screenshot.name,
      filetype: screenshot.type,
      filedata: base64String
    };

    // ✅ Using your Apps Script URL
    fetch("https://script.google.com/macros/s/AKfycbwox66NOzt1Sjx2tjxKrf0FYgl8DShbNCtSeHGF5fhnZRbU8plBf40ZM_IfxDXmd-0jWw/exec", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res => res.text())
    .then(response => {
      console.log("Submission response:", response);
      statusMsg.textContent = "🎉 Your submission has been recorded. Thanks for being part of Tech for Girls!";
      disableForm();
      localStorage.setItem("submitted", "true");
    })
    .catch(err => {
      console.error(err);
      alert("Error submitting form. Please try again.");
    });
  };

  reader.readAsDataURL(screenshot);
});

// ✅ Disable form inputs and buttons after submission
function disableForm() {
  document.querySelectorAll("input, button").forEach(el => el.disabled = true);
}
