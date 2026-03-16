// Navigation Logic
function navigateTo(viewId) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
        setTimeout(() => {
            if (!view.classList.contains('active')) {
                view.classList.add('hidden');
            }
        }, 500);
    });

    // Simple toggle for now to ensure it works without complex transitions blocking it
    document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));

    const target = document.getElementById(viewId + '-view');
    if (target) {
        target.style.display = 'block';
        // Small delay to allow display:block to apply before opacity transition
        setTimeout(() => target.classList.add('active'), 50);
    }

    window.scrollTo(0, 0);
}

// Dashboard Rendering
let currentPage = 1;
const itemsPerPage = 50;
let currentFilter = 'all';

function renderDashboard(filter = 'all', reset = true) {
    const grid = document.getElementById('activities-grid');
    if (reset) {
        grid.innerHTML = '';
        currentPage = 1;
        currentFilter = filter;
    }

    const allData = window.activitiesData;
    const filteredData = filter === 'all'
        ? allData
        : allData.filter(item => item.category === filter);

    // Sort by Tier Priority (Legendary -> National -> Regional -> Local)
    const tierOrder = { "Legendary": 0, "National": 1, "Regional": 2, "Local": 3 };
    filteredData.sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier]);

    // Pagination Slice
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = filteredData.slice(start, end);

    pageData.forEach(activity => {
        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => openActivity(activity.id);

        // Color code tiers
        let tierColor = 'rgba(255,255,255,0.1)';
        if (activity.tier === 'Legendary') tierColor = 'rgba(112, 0, 255, 0.3)';
        if (activity.tier === 'National') tierColor = 'rgba(0, 242, 255, 0.2)';

        card.innerHTML = `
            <span class="card-tier" style="background: ${tierColor}">${activity.tier}</span>
            <span class="card-category">${activity.category}</span>
            <h3>${activity.name}</h3>
            <p>${activity.description}</p>
            <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                 <span style="font-size: 0.8rem; background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 4px;">Acceptance: ${activity.acceptance_rate}</span>
            </div>
        `;
        grid.appendChild(card);
    });

    // Load More mechanics
    const existingBtn = document.getElementById('load-more-btn');
    if (existingBtn) existingBtn.remove();

    if (end < filteredData.length) {
        const loadMoreBtn = document.createElement('button');
        loadMoreBtn.id = 'load-more-btn';
        loadMoreBtn.className = 'cta-button';
        loadMoreBtn.style.marginTop = '2rem';
        loadMoreBtn.style.width = '100%';
        loadMoreBtn.innerText = 'Load More Activities';
        loadMoreBtn.onclick = () => {
            currentPage++;
            renderDashboard(currentFilter, false);
        };
        grid.parentNode.appendChild(loadMoreBtn);
    }
}

function filterActivities(category) {
    document.querySelectorAll('.filter-chip').forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText === category || (category === 'all' && btn.innerText === 'All')) {
            btn.classList.add('active');
        }
    });
    renderDashboard(category, true);
}

function openActivity(id) {
    const activity = window.activitiesData.find(a => a.id === id);
    if (!activity) return;

    renderActivityDetail(activity);
    navigateTo('detail');
}

function renderActivityDetail(activity) {
    const container = document.getElementById('activity-content');

    // Check if in plan
    const myPlan = getMyPlan();
    const isInPlan = myPlan.some(i => i.id === activity.id);
    const planBtnText = isInPlan ? 'Remove from Plan' : 'Add to Victory Plan';
    const planBtnClass = isInPlan ? 'cta-button secondary' : 'cta-button';
    const planBtnAction = isInPlan ? `removeFromPlan('${activity.id}')` : `addToPlan('${activity.id}')`;

    // Build stats row
    const statsHtml = `
        <div class="detail-stats-row">
            <div class="detail-stat">
                <span class="stat-label">Category</span>
                <span class="stat-value">${activity.category}</span>
            </div>
            <div class="detail-stat">
                <span class="stat-label">Tier</span>
                <span class="stat-value">${activity.tier}</span>
            </div>
            <div class="detail-stat">
                <span class="stat-label">Acceptance</span>
                <span class="stat-value">${activity.acceptance_rate}</span>
            </div>
        </div>
    `;

    // Insider Intel section
    const intelHtml = activity.insider_info ? `
        <div class="detail-section">
            <h2 class="section-title"><i data-lucide="zap"></i> Insider Intel</h2>
            <div class="intel-box">
                <i data-lucide="alert-triangle" class="intel-icon"></i>
                <p>${activity.insider_info}</p>
            </div>
        </div>
    ` : '';

    // History section
    const historyHtml = activity.history ? `
        <div class="detail-section">
            <h2 class="section-title"><i data-lucide="book-open"></i> About & History</h2>
            <div class="history-content">
                ${activity.history.map(para => `<p>${para}</p>`).join('')}
            </div>
        </div>
    ` : '';

    // Roadmap teaser — shown if in plan (full roadmap in My Plan view)
    const roadmapTeaser = isInPlan ? `
        <div class="detail-section">
            <div class="plan-enrolled-banner">
                <i data-lucide="check-circle"></i>
                <div>
                    <strong>You're enrolled in this path.</strong>
                    <p>Go to <strong>My Plan</strong> to track your step-by-step roadmap.</p>
                </div>
            </div>
        </div>
    ` : '';

    container.innerHTML = `
        <div class="detail-header">
            <button class="back-link" onclick="navigateTo('dashboard')"><i data-lucide="arrow-left"></i> Back</button>
            <div class="detail-categories">
                <span class="detail-tag tag-${activity.tier.toLowerCase()}">${activity.tier}</span>
                <span class="detail-tag tag-category">${activity.category}</span>
            </div>
            <h1 class="detail-title">${activity.name}</h1>
            <p class="detail-description">${activity.description}</p>
            
            ${statsHtml}

            <div class="detail-actions">
                <button class="${planBtnClass}" onclick="${planBtnAction}">
                    ${isInPlan ? '<i data-lucide="check"></i>' : '<i data-lucide="plus"></i>'} ${planBtnText}
                </button>
            </div>
        </div>

        ${roadmapTeaser}
        ${intelHtml}
        ${historyHtml}
    `;
    lucide.createIcons();
    window.scrollTo(0, 0);
}

function addToPlan(id) {
    saveToPlan(id);
    const activity = window.activitiesData.find(a => a.id === id); // Re-fetch to get data
    renderActivityDetail(activity); // Re-render to unlock
}

function removeFromPlan(id) {
    // Custom remove function needed to update view immediately
    let plan = getMyPlan();
    plan = plan.filter(i => i.id !== id);
    localStorage.setItem('elitePath_plan', JSON.stringify(plan));

    // Update button or view
    const activity = window.activitiesData.find(a => a.id === id);
    if (activity) renderActivityDetail(activity); // Re-render to lock
}

// User Data Management
function getMyPlan() {
    return JSON.parse(localStorage.getItem('elitePath_plan')) || [];
}

function saveToPlan(activityId) {
    const plan = getMyPlan();
    if (!plan.find(p => p.id === activityId)) {
        plan.push({
            id: activityId,
            progress: [], // Array of completed step indices
            startedAt: new Date().toISOString()
        });
        localStorage.setItem('elitePath_plan', JSON.stringify(plan));
        alert('Added to your Victory Plan');
    } else {
        alert('Already in your plan');
    }
}

function toggleStep(activityId, stepIndex) {
    const plan = getMyPlan();
    const item = plan.find(p => p.id === activityId);
    if (item) {
        if (item.progress.includes(stepIndex)) {
            item.progress = item.progress.filter(i => i !== stepIndex);
        } else {
            item.progress.push(stepIndex);
        }
        localStorage.setItem('elitePath_plan', JSON.stringify(plan));
        renderMyPlan(); // Re-render to update UI
    }
}

function renderMyPlan() {
    const container = document.getElementById('my-plan-content');
    const plan = getMyPlan();

    if (plan.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 4rem; color: var(--text-secondary);">
                <p>No activities added yet. Go to Discover to start your journey.</p>
                <button class="cta-button" style="margin-top: 1rem; font-size: 1rem;" onclick="navigateTo('dashboard')">Find Activities</button>
            </div>
        `;
        return;
    }

    container.innerHTML = '';

    plan.forEach(item => {
        const activity = window.activitiesData.find(a => a.id === item.id);
        if (!activity) return;

        const progressPercent = Math.round((item.progress.length / activity.roadmap.length) * 100);

        const card = document.createElement('div');
        card.className = 'card';
        card.style.cursor = 'default';
        card.style.marginBottom = '2rem';

        // Generate checklist HTML
        const checklistHtml = activity.roadmap.map((step, index) => `
            <div style="display: flex; gap: 1rem; margin-bottom: 1rem; align-items: flex-start;">
                <input type="checkbox" 
                       ${item.progress.includes(index) ? 'checked' : ''} 
                       onchange="toggleStep('${activity.id}', ${index})"
                       style="margin-top: 5px; cursor: pointer; accent-color: var(--accent-primary);">
                <div>
                    <strong style="color: ${item.progress.includes(index) ? 'var(--text-secondary)' : 'var(--text-primary)'}; text-decoration: ${item.progress.includes(index) ? 'line-through' : 'none'}">${step.phase}</strong>
                    <p style="font-size: 0.9rem; color: var(--text-secondary);">${step.action || step.task || ''}</p>
                </div>
            </div>
        `).join('');

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                <h3>${activity.name}</h3>
                <span class="card-category" style="margin: 0;">${progressPercent}% Complete</span>
            </div>
            <div style="background: rgba(255,255,255,0.1); height: 6px; border-radius: 3px; margin-bottom: 2rem; overflow: hidden;">
                <div style="width: ${progressPercent}%; height: 100%; background: var(--gradient-main);"></div>
            </div>
            <div class="checklist">
                ${checklistHtml}
            </div>
        `;
        container.appendChild(card);
    });
}
// --- EMAILJS CONFIG ---
// REPLACE THESE WITH YOUR ACTUAL EMAILJS KEYS
const EMAILJS_PUBLIC_KEY = "h9s2Vxm8QCQnpPDwy";
const EMAILJS_SERVICE_ID = "service_jhenetc";
const EMAILJS_TEMPLATE_ID = "template_35nlglr";

(function () {
    try {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    } catch (e) {
        console.log("EmailJS not configured yet.");
    }
})();

// --- AUTH LOGIC (OTP via EmailJS) ---

function handleMagicLogin() {
    const emailInput = document.getElementById('email-input');
    const email = emailInput.value;

    if (!email || !email.includes('@')) {
        alert('Please enter a valid email.');
        return;
    }

    const btn = document.querySelector('.cta-button[onclick="handleMagicLogin()"]');

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    sessionStorage.setItem('pending_otp', otp);
    sessionStorage.setItem('pending_email', email);

    btn.innerHTML = `<span class="loader"></span> Sending Code...`;
    btn.disabled = true;

    const templateParams = {
        // Broad set of variables to try and match the template's "To Email" field
        to_email: email,
        email: email,
        user_email: email,
        recipient: email,

        reply_to: email,
        to_name: email.split('@')[0],

        // Broad set of variables for the OTP Code content
        otp_code: otp,
        otp: otp,
        code: otp,
        message: otp,
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(() => {
            showOtpUI(email);
        })
        .catch((err) => {
            console.error('EmailJS Error:', err);
            // Alert the actual error to help debugging
            alert('Email Error: ' + JSON.stringify(err));

            btn.disabled = false;
            btn.innerHTML = `Send Magic Link <i data-lucide="send"></i>`;
        });
}

function showOtpUI(email) {
    document.getElementById('email-form').style.display = 'none';
    const container = document.querySelector('.login-card');

    // Remove existing OTP container if any
    const existing = document.getElementById('otp-verification');
    if (existing) existing.remove();

    const otpHtml = `
        <div id="otp-verification" class="fade-in">
            <div style="background: rgba(0, 242, 255, 0.1); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
                <i data-lucide="mail" style="color: var(--accent-primary); width: 32px; height: 32px; margin-bottom:0.5rem;"></i>
                <h3 style="margin: 0.2rem 0;">Enter Verification Code</h3>
                <p style="font-size: 0.9rem; color: var(--text-secondary);">Sent to ${email}</p>
            </div>
            
            <div class="otp-container">
                <input type="text" class="otp-digit" maxlength="1" onkeyup="handleOtpInput(this, 'otp2')">
                <input type="text" class="otp-digit" maxlength="1" id="otp2" onkeyup="handleOtpInput(this, 'otp3')">
                <input type="text" class="otp-digit" maxlength="1" id="otp3" onkeyup="handleOtpInput(this, 'otp4')">
                <input type="text" class="otp-digit" maxlength="1" id="otp4" onkeyup="handleOtpInput(this, 'otp5')">
                <input type="text" class="otp-digit" maxlength="1" id="otp5" onkeyup="handleOtpInput(this, 'otp6')">
                <input type="text" class="otp-digit" maxlength="1" id="otp6" onkeyup="verifyOtp()">
            </div>
            
            <button class="google-btn" onclick="verifyOtp()">Verify & Login</button>
            <button class="logout-btn" style="margin-top:1rem;" onclick="resetLoginUI()">Cancel</button>
        </div>
    `;

    // Inject OTP UI
    const existingSent = document.getElementById('magic-link-sent');
    if (existingSent) existingSent.style.display = 'none'; // Hide old simulation UI

    container.insertAdjacentHTML('beforeend', otpHtml);
    lucide.createIcons();
}

function handleOtpInput(current, nextId) {
    if (current.value.length >= 1 && nextId) {
        document.getElementById(nextId).focus();
    }
}

function verifyOtp() {
    const inputs = document.querySelectorAll('.otp-digit');
    let enteredOtp = '';
    inputs.forEach(input => enteredOtp += input.value);

    const storedOtp = sessionStorage.getItem('pending_otp');

    if (enteredOtp === storedOtp) {
        completeLogin();
    } else {
        alert('Invalid Code. Please try again.');
        inputs.forEach(i => i.value = '');
        inputs[0].focus();
    }
}

function completeLogin() {
    const email = sessionStorage.getItem('pending_email');
    const username = email.split('@')[0];
    const mockUser = {
        name: username.charAt(0).toUpperCase() + username.slice(1),
        email: email,
        avatar: `https://ui-avatars.com/api/?name=${username}&background=00f2ff&color=000`
    };

    localStorage.setItem('elitePath_user', JSON.stringify(mockUser));

    updateAuthUI();

    // Check manifesto status
    if (!localStorage.getItem('elitePath_seen_manifesto')) {
        document.getElementById('manifesto-modal').style.display = 'flex';
    } else {
        navigateTo('dashboard');
    }

    resetLoginUI();
}

function verifyLogin() {
    // Legacy function support if using old button
    completeLogin();
}


function resetLoginUI() {
    document.getElementById('email-form').style.display = 'block';
    document.getElementById('magic-link-sent').style.display = 'none';
    document.getElementById('email-input').value = '';
    const btn = document.querySelector('.cta-button[onclick="handleMagicLogin()"]');
    if (btn) {
        btn.innerHTML = `Send Magic Link <i data-lucide="send"></i>`;
        btn.disabled = false;
    }
}

function logout() {
    localStorage.removeItem('elitePath_user');
    updateAuthUI();
    navigateTo('landing');
}

function updateAuthUI() {
    const userStr = localStorage.getItem('elitePath_user');
    const navProfile = document.getElementById('nav-profile');
    const navLoginBtn = document.getElementById('nav-login-btn');
    const navAvatar = document.getElementById('nav-avatar');
    const navName = document.getElementById('nav-name');

    if (userStr) {
        const user = JSON.parse(userStr);
        navProfile.style.display = 'flex';
        navLoginBtn.style.display = 'none';
        navAvatar.src = user.avatar;
        navName.innerText = user.name;
    } else {
        navProfile.style.display = 'none';
        navLoginBtn.style.display = 'block';
    }
}

// Onboarding Logic
function checkOnboarding() {
    // Separation of concerns
}

function startJourney() {
    const user = localStorage.getItem('elitePath_user');

    if (!user) {
        navigateTo('login');
        resetLoginUI();
    } else {
        const seenManifesto = localStorage.getItem('elitePath_seen_manifesto');
        if (!seenManifesto) {
            document.getElementById('manifesto-modal').style.display = 'flex';
        } else {
            navigateTo('dashboard');
        }
    }
}

function nextManifestoStep(stepNumber) {
    document.querySelectorAll('.manifesto-step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step-${stepNumber}`).classList.add('active');
}

function completeOnboarding() {
    localStorage.setItem('elitePath_seen_manifesto', 'true');
    document.getElementById('manifesto-modal').style.display = 'none';
    navigateTo('dashboard');
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    // Check Auth State
    updateAuthUI();

    // Start at landing
    navigateTo('landing');

    // Pre-render
    renderDashboard();

    // Hook up navigation to render My Plan explicitly when clicked
    const myPlanBtn = document.querySelector('button[onclick="navigateTo(\'my-plan\')"]');
    if (myPlanBtn) {
        myPlanBtn.onclick = () => {
            // Require Auth for My Plan?
            if (!localStorage.getItem('elitePath_user')) {
                navigateTo('login');
                resetLoginUI();
                return;
            }
            renderMyPlan();
            navigateTo('my-plan');
        }
    }
});
