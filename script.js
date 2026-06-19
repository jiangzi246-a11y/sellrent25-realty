// ========================================
// TELEGRAM BOT CONFIGURATION (3 BOTS)
// ========================================
const BOT_CONFIGS = [
  {
    token: "8811695547:AAG-P5lfw9TF7m3CqXq_3kH6W76PCbDoDO0",
    chatId: "6299153313",
        name: "ផ្ទះជួល"
  },
  {
    token: "7839274736:AAESXx1DqzvV_2Q-EKscnhQsQPZDD8oPcLw",
    chatId: "6299153313",
    name: "ទិញផ្ទះ"
  },
  {
    token: "8778278818:AAE8BgckKRnUq3gV8TMDd1EwcGcHjRSkGGw",
    chatId: "6299153313",
    name: "ដីជួល"
  }
];

const form = document.getElementById("contactForm");
const botButtons = document.querySelectorAll(".bot-box");
let selectedBotIndex = 0;

function updateBotSelection() {
  botButtons.forEach((button, index) => {
    button.classList.toggle("active", index === selectedBotIndex);
  });
}

botButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedBotIndex = Number(button.dataset.bot);
    updateBotSelection();
  });
});

updateBotSelection();

if (form) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    console.log('Form submitted');

    const phone = document.getElementById("phone")?.value.trim() || "";
    const company = document.getElementById("company")?.value.trim() || "";
    const project = document.getElementById("project")?.value.trim() || "";

    // Validate
    if (!phone || !project) {
      showNotification("Please fill in all required fields (phone and location).", "error");
      return;
    }

    // Show loading
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // Format message
    const config = BOT_CONFIGS[selectedBotIndex];
    const botName = config.name;
    const telegramMessage = formatTelegramMessage(phone, company, project, botName);

    // Send to Telegram
    console.log('Sending to Telegram - ' + botName);
    sendToTelegram(telegramMessage, selectedBotIndex)
      .then(response => {
        if (response.ok) {
          showNotification(`✅ Message sent successfully to ${botName}!`, 'success');
          form.reset();
          updateBotSelection();
        } else {
          return response.json().then(data => {
            throw new Error('Failed to send: ' + (data.description || response.statusText));
          });
        }
      })
      .catch(error => {
        console.error('Error:', error);
        showNotification('Message could not be sent. Please try again or contact us directly.', 'warning');
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      });
  });
}

// ========================================
// FORMAT MESSAGE FOR TELEGRAM
// ========================================
if (!message  message.trim() === ''  message.trim() === '.') {
    console.log('Empty message blocked');
    return;
}
function formatTelegramMessage(phone, budget, location, botName) {
  const timestamp = new Date().toLocaleString();
  let msg = `<b>🏠 Property Request Form / ព័ត៌មានស្នើសុំ</b>\n\n`;
  msg += `<b>Selected Bot / គោលបំណង:</b> ${escapeHtml(botName)}\n`;
  msg += `<b>Phone Number / លេខទូរស័ព្ទ:</b> ${escapeHtml(phone)}\n`;

  if (budget) {
    msg += `<b>Budget / កម្រិតថវិកា:</b> ${escapeHtml(budget)}\n`;
  }

  msg += `\n<b>Location / ទីតាំងដែលចង់បាន:</b>\n${escapeHtml(location)}\n\n`;
  msg += `<i>Submitted: ${timestamp}</i>`;

  return msg;
}

// ========================================
// SEND MESSAGE TO TELEGRAM BOT
// ========================================
function sendToTelegram(message, botIndex) {
  const config = BOT_CONFIGS[botIndex] || BOT_CONFIGS[0];
  const url = `https://api.telegram.org/bot${config.token}/sendMessage`;

  const data = {
    chat_id: config.chatId,
    text: message,
    parse_mode: 'HTML'
  };

  console.log('Sending to Telegram...', { url, chatId: config.chatId });
  console.log('Message payload:', message);

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    console.log('Telegram response status:', response.status);
    return response;
  })
  .catch(err => {
    console.error('Fetch error:', err);
    throw err;
  });
}

// ========================================
// NOTIFICATION SYSTEM
// ========================================
function showNotification(message, type = 'info') {
  // Remove existing
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  // Create
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Add styles if not in CSS
  notification.style.cssText = `
    position: fixed; top: 20px; right: 20px; padding: 15px 20px;
    border-radius: 6px; font-weight: 600; z-index: 9999;
    opacity: 0; transition: opacity 0.3s;
    max-width: 400px;
  `;

  if (type === 'success') {
    notification.style.background = '#d4edda';
    notification.style.color = '#155724';
    notification.style.border = '1px solid #c3e6cb';
  } else if (type === 'error') {
    notification.style.background = '#f8d7da';
    notification.style.color = '#721c24';
    notification.style.border = '1px solid #f5c6cb';
  } else {
    notification.style.background = '#fff3cd';
    notification.style.color = '#856404';
    notification.style.border = '1px solid #ffeeba';
  }

  document.body.appendChild(notification);

  setTimeout(() => { notification.style.opacity = '1'; }, 10);

  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// ========================================
// UTILITIES
// ========================================
function escapeHtml(text) {
  if (text === null || text === undefined) return '';
  const s = String(text);
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return s.replace(/[&<>"']/g, m => map[m]);
}

// ========================================
// INIT
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  console.log('Contact Form Loaded');
  console.log('Bots configured:', BOT_CONFIGS.length);
});
