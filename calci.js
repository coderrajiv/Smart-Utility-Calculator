/* =============================================================
   Smart Utility Calculator - Main Application
   All logic is organised by feature category.
   ============================================================= */

// ===== DATA =====
const NAV_ITEMS = [
    { id: 'dashboard', icon: 'fa-gauge-high', label: 'Dashboard', badge: null },
    { id: 'basic', icon: 'fa-calculator', label: 'Basic Calculator', badge: null },
    { id: 'scientific', icon: 'fa-flask', label: 'Scientific', badge: null },
    { id: 'finance', icon: 'fa-coins', label: 'Finance', badge: null },
    { id: 'student', icon: 'fa-graduation-cap', label: 'Student Tools', badge: null },
    { id: 'health', icon: 'fa-heart-pulse', label: 'Health Tools', badge: null },
    { id: 'travel', icon: 'fa-plane', label: 'Travel Tools', badge: null },
    { id: 'converter', icon: 'fa-arrows-rotate', label: 'Unit Converter', badge: null },
    { id: 'date', icon: 'fa-calendar-days', label: 'Date Tools', badge: null },
    { id: 'utility', icon: 'fa-screwdriver-wrench', label: 'Utility Tools', badge: null },
    { id: 'fun', icon: 'fa-wand-magic-sparkles', label: 'Fun & Entertainment', badge: '✨' }
];

// Zodiac data
const zodiacSigns = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const zodiacData = {
    Aries: { symbol: '♈', element: 'Fire', traits: 'Courageous, energetic, confident.' },
    Taurus: { symbol: '♉', element: 'Earth', traits: 'Patient, reliable, loving.' },
    Gemini: { symbol: '♊', element: 'Air', traits: 'Adaptable, curious, witty.' },
    Cancer: { symbol: '♋', element: 'Water', traits: 'Intuitive, emotional, nurturing.' },
    Leo: { symbol: '♌', element: 'Fire', traits: 'Creative, passionate, generous.' },
    Virgo: { symbol: '♍', element: 'Earth', traits: 'Practical, analytical, kind.' },
    Libra: { symbol: '♎', element: 'Air', traits: 'Diplomatic, social, fair.' },
    Scorpio: { symbol: '♏', element: 'Water', traits: 'Determined, powerful, mysterious.' },
    Sagittarius: { symbol: '♐', element: 'Fire', traits: 'Adventurous, optimistic, free-spirited.' },
    Capricorn: { symbol: '♑', element: 'Earth', traits: 'Disciplined, ambitious, patient.' },
    Aquarius: { symbol: '♒', element: 'Air', traits: 'Innovative, humanitarian, independent.' },
    Pisces: { symbol: '♓', element: 'Water', traits: 'Compassionate, artistic, intuitive.' }
};

// Quiz questions (for personality quiz)
const quizQuestions = [
    { q: 'You find a wallet on the street. What do you do?', options: ['Return it immediately', 'Keep it', 'Hand to police', 'Ignore it'] },
    { q: 'What\'s your ideal weekend?', options: ['Adventure outdoors', 'Relaxing at home', 'Socializing with friends', 'Working on a project'] },
    { q: 'How do you handle stress?', options: ['Exercise', 'Meditation', 'Talking to someone', 'Distraction'] },
    { q: 'Which color resonates with you?', options: ['Blue', 'Red', 'Green', 'Yellow'] },
    { q: 'What drives you most?', options: ['Passion', 'Money', 'Recognition', 'Helping others'] }
];

// Death prediction questions (entertainment only)
const deathQuestions = [
    { q: 'What is your favorite time of day?', options: ['Dawn', 'Morning', 'Afternoon', 'Dusk', 'Night'] },
    { q: 'Which element speaks to you?', options: ['Fire', 'Water', 'Earth', 'Air', 'Spirit'] },
    { q: 'What is your life motto?', options: ['Carpe diem', 'Live and let live', 'Be the change', 'Go with the flow', 'Never give up'] },
    { q: 'Where do you feel most alive?', options: ['Mountains', 'Ocean', 'Forest', 'City', 'Desert'] },
    { q: 'What do you value most?', options: ['Love', 'Freedom', 'Wisdom', 'Courage', 'Joy'] }
];

const fortunes = [
    'A beautiful surprise awaits you today.',
    'Your kindness will come back to you tenfold.',
    'An unexpected opportunity is on the horizon.',
    'The stars align in your favor this week.',
    'Trust your intuition — it is guiding you well.',
    'A new friendship will brighten your days.',
    'You are stronger than you realize.',
    'Adventure is calling — answer it with an open heart.',
    'Patience will lead you to a breakthrough.',
    'Your creativity is your superpower — use it.'
];

// ===== STATE =====
let currentPage = 'dashboard';
let theme = 'dark';
let history = JSON.parse(localStorage.getItem('calcHistory')) || [];
let memory = 0;
let notes = localStorage.getItem('userNotes') || '';
let stopwatchInterval = null;
let stopwatchTime = 0;
let stopwatchRunning = false;
let timerInterval = null;
let timerRemaining = 0;
let timerRunning = false;

// ===== DOM HELPERS =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const sidebar = $('#sidebar');
const overlay = $('#sidebarOverlay');
const menuToggle = $('#menuToggle');
const sidebarNav = $('#sidebarNav');
const pageContent = $('#pageContent');
const themeToggle = $('#themeToggle');
const toast = $('#toast');
const toastMsg = $('#toastMsg');

// ===== TOAST =====
function showToast(msg, icon = 'fa-check-circle') {
    toastMsg.textContent = msg;
    toast.querySelector('i').className = `fas ${icon}`;
    toast.classList.add('show');
    clearTimeout(toast._hide);
    toast._hide = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ===== THEME =====
function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeToggle.innerHTML = `<i class="fas ${theme === 'dark' ? 'fa-moon' : 'fa-sun'}"></i>`;
}
function loadTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) theme = saved;
    document.documentElement.setAttribute('data-theme', theme);
    themeToggle.innerHTML = `<i class="fas ${theme === 'dark' ? 'fa-moon' : 'fa-sun'}"></i>`;
}

// ===== SIDEBAR =====
function renderSidebar() {
    sidebarNav.innerHTML = NAV_ITEMS.map(item => `
        <button class="nav-item ${item.id === currentPage ? 'active' : ''}" data-page="${item.id}">
            <i class="fas ${item.icon}"></i>
            <span>${item.label}</span>
            ${item.badge ? `<span class="badge">${item.badge}</span>` : ''}
        </button>
    `).join('');
    sidebarNav.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.dataset.page;
            navigateTo(page);
            if (window.innerWidth <= 768) closeSidebar();
        });
    });
}
function openSidebar() { sidebar.classList.add('open'); overlay.classList.add('active'); }
function closeSidebar() { sidebar.classList.remove('open'); overlay.classList.remove('active'); }
menuToggle.addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
});
overlay.addEventListener('click', closeSidebar);

// ===== NAVIGATION =====
function navigateTo(pageId) {
    currentPage = pageId;
    sidebarNav.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.page === pageId);
    });
    renderPage(pageId);
    if (window.innerWidth <= 768) closeSidebar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== PAGE RENDERER =====
function renderPage(pageId) {
    const pages = {
        dashboard: renderDashboard,
        basic: renderBasic,
        scientific: renderScientific,
        finance: renderFinance,
        student: renderStudent,
        health: renderHealth,
        travel: renderTravel,
        converter: renderConverter,
        date: renderDate,
        utility: renderUtility,
        fun: renderFun,
    };
    const fn = pages[pageId] || renderDashboard;
    pageContent.innerHTML = fn();
    bindPageEvents(pageId);
    updateHistoryBadge();
}

// ===== DASHBOARD =====
function renderDashboard() {
    return `
        <div class="page active">
            <div class="page-header">
                <h1>📊 Dashboard</h1>
                <p>Welcome to Smart Utility Calculator — your all-in-one productivity suite.</p>
            </div>
            <div class="card-grid">
                ${NAV_ITEMS.slice(1).map(item => `
                    <div class="card" style="cursor:pointer;" data-nav="${item.id}">
                        <div class="card-title"><i class="fas ${item.icon}"></i> ${item.label}</div>
                        <p style="opacity:0.5;font-size:13px;">Click to open ${item.label}</p>
                        <button class="btn btn-sm mt-8" data-nav="${item.id}">Open →</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ===== BASIC CALCULATOR =====
function renderBasic() {
    return `
        <div class="page active">
            <div class="page-header">
                <h1>🧮 Basic Calculator</h1>
                <p>Perform essential arithmetic operations with memory.</p>
            </div>
            <div class="card" style="max-width:420px;">
                <div class="memory-bar">
                    <button class="mem-btn" data-mem="mc">MC</button>
                    <button class="mem-btn" data-mem="mr">MR</button>
                    <button class="mem-btn" data-mem="mplus">M+</button>
                    <button class="mem-btn" data-mem="mminus">M−</button>
                </div>
                <div class="calc-display" id="basicDisplay">
                    <span class="sub" id="basicSub"></span>
                    <span id="basicResult">0</span>
                </div>
                <div class="calc-grid">
                    ${['C','±','%','÷','7','8','9','×','4','5','6','−','1','2','3','+','0','.','⌫','='].map(label => `
                        <button class="calc-btn ${['÷','×','−','+','='].includes(label) ? 'operator' : ''} ${['C','±','%','⌫'].includes(label) ? 'func' : ''} ${label === '=' ? 'equals' : ''}" data-basic="${label}">${label}</button>
                    `).join('')}
                </div>
                <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
                    <button class="btn btn-sm btn-secondary" id="basicCopy"><i class="fas fa-copy"></i> Copy</button>
                    <button class="btn btn-sm btn-secondary" id="basicClearHist"><i class="fas fa-trash"></i> Clear History</button>
                </div>
                <div class="history-list mt-12" id="basicHistory"></div>
            </div>
        </div>
    `;
}

// ===== SCIENTIFIC CALCULATOR =====
function renderScientific() {
    return `
        <div class="page active">
            <div class="page-header">
                <h1>🔬 Scientific Calculator</h1>
                <p>Advanced functions for complex calculations.</p>
            </div>
            <div class="card" style="max-width:520px;">
                <div class="calc-display" id="sciDisplay">
                    <span class="sub" id="sciSub"></span>
                    <span id="sciResult">0</span>
                </div>
                <div class="calc-grid sci-grid">
                    ${['sin','cos','tan','log','ln','√','x²','x³','xⁿ','!','π','e','1/x','|x|','rand','C','±','%','÷','7','8','9','×','4','5','6','−','1','2','3','+','0','.','⌫','='].map(label => `
                        <button class="calc-btn ${['sin','cos','tan','log','ln','√','x²','x³','xⁿ','!','π','e','1/x','|x|','rand'].includes(label) ? 'func' : ''} ${['÷','×','−','+','='].includes(label) ? 'operator' : ''} ${label === '=' ? 'equals' : ''}" data-sci="${label}">${label}</button>
                    `).join('')}
                </div>
                <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
                    <button class="btn btn-sm btn-secondary" id="sciCopy"><i class="fas fa-copy"></i> Copy</button>
                </div>
            </div>
        </div>
    `;
}

// ===== FINANCE =====
function renderFinance() {
    return `
        <div class="page active">
            <div class="page-header">
                <h1>💰 Finance Tools</h1>
                <p>Interest, EMI, GST, Discount, SIP & more.</p>
            </div>
            <div class="tab-bar">
                ${['si','ci','emi','gst','discount','pnl','sip'].map(id => `<button class="tab ${id === 'si' ? 'active' : ''}" data-tab="finance-${id}">${id.toUpperCase()}</button>`).join('')}
            </div>
            ${['si','ci','emi','gst','discount','pnl','sip'].map(id => `
                <div class="tab-content ${id === 'si' ? 'active' : ''}" id="finance-${id}">
                    ${renderFinanceTab(id)}
                </div>
            `).join('')}
        </div>
    `;
}
function renderFinanceTab(id) {
    const maps = {
        si: `
            <div class="form-row">
                <div class="form-group"><label>Principal (₹)</label><input type="number" id="siPrincipal" value="10000" /></div>
                <div class="form-group"><label>Rate (% p.a.)</label><input type="number" id="siRate" value="5" step="0.1" /></div>
                <div class="form-group"><label>Time (years)</label><input type="number" id="siTime" value="3" step="0.5" /></div>
            </div>
            <button class="btn btn-success" id="calcSI">Calculate</button>
            <div class="result-box" id="siResult"><span class="label">Results</span><div class="value">—</div></div>
        `,
        ci: `
            <div class="form-row">
                <div class="form-group"><label>Principal (₹)</label><input type="number" id="ciPrincipal" value="10000" /></div>
                <div class="form-group"><label>Rate (% p.a.)</label><input type="number" id="ciRate" value="5" step="0.1" /></div>
                <div class="form-group"><label>Time (years)</label><input type="number" id="ciTime" value="3" step="0.5" /></div>
                <div class="form-group"><label>Frequency (per year)</label><select id="ciFreq"><option value="1">Yearly</option><option value="2">Half-yearly</option><option value="4">Quarterly</option><option value="12" selected>Monthly</option></select></div>
            </div>
            <button class="btn btn-success" id="calcCI">Calculate</button>
            <div class="result-box" id="ciResult"><span class="label">Results</span><div class="value">—</div></div>
        `,
        emi: `
            <div class="form-row">
                <div class="form-group"><label>Loan Amount (₹)</label><input type="number" id="emiPrincipal" value="500000" /></div>
                <div class="form-group"><label>Rate (% p.a.)</label><input type="number" id="emiRate" value="8" step="0.1" /></div>
                <div class="form-group"><label>Period (months)</label><input type="number" id="emiPeriod" value="60" /></div>
            </div>
            <button class="btn btn-success" id="calcEMI">Calculate</button>
            <div class="result-box" id="emiResult"><span class="label">Results</span><div class="value">—</div></div>
        `,
        gst: `
            <div class="form-row">
                <div class="form-group"><label>Amount (₹)</label><input type="number" id="gstAmount" value="1000" /></div>
                <div class="form-group"><label>GST Rate (%)</label><input type="number" id="gstRate" value="18" step="0.1" /></div>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
                <button class="btn" id="gstAdd">Add GST</button>
                <button class="btn btn-secondary" id="gstRemove">Remove GST</button>
            </div>
            <div class="result-box" id="gstResult"><span class="label">Results</span><div class="value">—</div></div>
        `,
        discount: `
            <div class="form-row">
                <div class="form-group"><label>Original Price (₹)</label><input type="number" id="discPrice" value="5000" /></div>
                <div class="form-group"><label>Discount (%)</label><input type="number" id="discRate" value="20" step="0.5" /></div>
            </div>
            <button class="btn btn-success" id="calcDisc">Calculate</button>
            <div class="result-box" id="discResult"><span class="label">Results</span><div class="value">—</div></div>
        `,
        pnl: `
            <div class="form-row">
                <div class="form-group"><label>Cost Price (₹)</label><input type="number" id="pnlCost" value="1000" /></div>
                <div class="form-group"><label>Selling Price (₹)</label><input type="number" id="pnlSell" value="1200" /></div>
            </div>
            <button class="btn btn-success" id="calcPNL">Calculate</button>
            <div class="result-box" id="pnlResult"><span class="label">Results</span><div class="value">—</div></div>
        `,
        sip: `
            <div class="form-row">
                <div class="form-group"><label>Monthly Investment (₹)</label><input type="number" id="sipAmount" value="5000" /></div>
                <div class="form-group"><label>Return Rate (% p.a.)</label><input type="number" id="sipRate" value="12" step="0.5" /></div>
                <div class="form-group"><label>Years</label><input type="number" id="sipYears" value="10" /></div>
            </div>
            <button class="btn btn-success" id="calcSIP">Calculate</button>
            <div class="result-box" id="sipResult"><span class="label">Results</span><div class="value">—</div></div>
        `
    };
    return maps[id] || '<p>Tool coming soon.</p>';
}

// ===== STUDENT TOOLS =====
function renderStudent() {
    return `
        <div class="page active">
            <div class="page-header">
                <h1>🎓 Student Tools</h1>
                <p>Percentage, CGPA, Grade, Attendance, Pomodoro, Exam countdown.</p>
            </div>
            <div class="tab-bar">
                ${['pct','cgpa','grade','attend','pomodoro','exam'].map(id => `<button class="tab ${id === 'pct' ? 'active' : ''}" data-tab="stu-${id}">${id.toUpperCase()}</button>`).join('')}
            </div>
            ${['pct','cgpa','grade','attend','pomodoro','exam'].map(id => `
                <div class="tab-content ${id === 'pct' ? 'active' : ''}" id="stu-${id}">
                    ${renderStudentTab(id)}
                </div>
            `).join('')}
        </div>
    `;
}
function renderStudentTab(id) {
    const maps = {
        pct: `
            <div class="form-row">
                <div class="form-group"><label>Marks Obtained</label><input type="number" id="pctObtained" value="85" /></div>
                <div class="form-group"><label>Total Marks</label><input type="number" id="pctTotal" value="100" /></div>
            </div>
            <button class="btn btn-success" id="calcPct">Calculate</button>
            <div class="result-box" id="pctResult"><span class="label">Percentage</span><div class="value">—</div></div>
        `,
        cgpa: `
            <div class="form-group"><label>CGPA</label><input type="number" id="cgpaInput" value="8.5" step="0.1" min="0" max="10" /></div>
            <button class="btn btn-success" id="calcCGPA">Convert to %</button>
            <div class="result-box" id="cgpaResult"><span class="label">Percentage</span><div class="value">—</div></div>
        `,
        grade: `
            <div class="form-group"><label>Marks (%)</label><input type="number" id="gradeInput" value="85" min="0" max="100" /></div>
            <button class="btn btn-success" id="calcGrade">Get Grade</button>
            <div class="result-box" id="gradeResult"><span class="label">Grade</span><div class="value">—</div></div>
        `,
        attend: `
            <div class="form-row">
                <div class="form-group"><label>Classes Attended</label><input type="number" id="attendAtt" value="45" /></div>
                <div class="form-group"><label>Total Classes</label><input type="number" id="attendTotal" value="50" /></div>
            </div>
            <button class="btn btn-success" id="calcAttend">Calculate</button>
            <div class="result-box" id="attendResult"><span class="label">Attendance</span><div class="value">—</div></div>
        `,
        pomodoro: `
            <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
                <div class="form-group" style="flex:1;min-width:120px;"><label>Work (min)</label><input type="number" id="pomoWork" value="25" /></div>
                <div class="form-group" style="flex:1;min-width:120px;"><label>Break (min)</label><input type="number" id="pomoBreak" value="5" /></div>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
                <button class="btn btn-success" id="pomoStart">Start</button>
                <button class="btn btn-secondary" id="pomoStop">Stop</button>
                <button class="btn btn-secondary" id="pomoReset">Reset</button>
            </div>
            <div class="result-box" id="pomoResult"><span class="label">Timer</span><div class="value" id="pomoDisplay">25:00</div></div>
        `,
        exam: `
            <div class="form-group"><label>Exam Date</label><input type="date" id="examDate" /></div>
            <button class="btn btn-success" id="calcExam">Countdown</button>
            <div class="result-box" id="examResult"><span class="label">Days Remaining</span><div class="value">—</div></div>
        `
    };
    return maps[id] || '<p>Tool coming soon.</p>';
}

// ===== HEALTH TOOLS =====
function renderHealth() {
    return `
        <div class="page active">
            <div class="page-header">
                <h1>❤️ Health Tools</h1>
                <p>BMI, Water, Calories, Sleep, Steps.</p>
            </div>
            <div class="tab-bar">
                ${['bmi','water','calories','sleep','steps'].map(id => `<button class="tab ${id === 'bmi' ? 'active' : ''}" data-tab="health-${id}">${id.toUpperCase()}</button>`).join('')}
            </div>
            ${['bmi','water','calories','sleep','steps'].map(id => `
                <div class="tab-content ${id === 'bmi' ? 'active' : ''}" id="health-${id}">
                    ${renderHealthTab(id)}
                </div>
            `).join('')}
        </div>
    `;
}
function renderHealthTab(id) {
    const maps = {
        bmi: `
            <div class="form-row">
                <div class="form-group"><label>Weight (kg)</label><input type="number" id="bmiWeight" value="70" step="0.1" /></div>
                <div class="form-group"><label>Height (cm)</label><input type="number" id="bmiHeight" value="175" step="0.1" /></div>
            </div>
            <button class="btn btn-success" id="calcBMI">Calculate</button>
            <div class="result-box" id="bmiResult"><span class="label">BMI</span><div class="value">—</div></div>
        `,
        water: `
            <div class="form-group"><label>Weight (kg)</label><input type="number" id="waterWeight" value="70" step="0.1" /></div>
            <button class="btn btn-success" id="calcWater">Calculate</button>
            <div class="result-box" id="waterResult"><span class="label">Daily Water Intake (liters)</span><div class="value">—</div></div>
        `,
        calories: `
            <div class="form-row">
                <div class="form-group"><label>Age</label><input type="number" id="calAge" value="30" /></div>
                <div class="form-group"><label>Weight (kg)</label><input type="number" id="calWeight" value="70" step="0.1" /></div>
                <div class="form-group"><label>Height (cm)</label><input type="number" id="calHeight" value="175" step="0.1" /></div>
                <div class="form-group"><label>Gender</label><select id="calGender"><option value="male">Male</option><option value="female">Female</option></select></div>
            </div>
            <button class="btn btn-success" id="calcCalories">Calculate BMR</button>
            <div class="result-box" id="calResult"><span class="label">BMR (kcal/day)</span><div class="value">—</div></div>
        `,
        sleep: `
            <div class="form-group"><label>Wake-up time</label><input type="time" id="sleepWake" value="07:00" /></div>
            <button class="btn btn-success" id="calcSleep">Ideal Bedtimes</button>
            <div class="result-box" id="sleepResult"><span class="label">Recommended bedtimes</span><div class="value">—</div></div>
        `,
        steps: `
            <div class="form-group"><label>Daily Step Goal</label><input type="number" id="stepGoal" value="10000" /></div>
            <div class="form-group"><label>Current Steps</label><input type="number" id="stepCurrent" value="4500" /></div>
            <button class="btn btn-success" id="calcSteps">Check Progress</button>
            <div class="result-box" id="stepResult"><span class="label">Progress</span><div class="value">—</div></div>
        `
    };
    return maps[id] || '<p>Tool coming soon.</p>';
}

// ===== TRAVEL TOOLS =====
function renderTravel() {
    return `
        <div class="page active">
            <div class="page-header">
                <h1>✈️ Travel Tools</h1>
                <p>Speed-Distance-Time, Fuel Cost, Mileage, Trip Splitter.</p>
            </div>
            <div class="tab-bar">
                ${['sdt','fuel','mileage','split'].map(id => `<button class="tab ${id === 'sdt' ? 'active' : ''}" data-tab="travel-${id}">${id.toUpperCase()}</button>`).join('')}
            </div>
            ${['sdt','fuel','mileage','split'].map(id => `
                <div class="tab-content ${id === 'sdt' ? 'active' : ''}" id="travel-${id}">
                    ${renderTravelTab(id)}
                </div>
            `).join('')}
        </div>
    `;
}
function renderTravelTab(id) {
    const maps = {
        sdt: `
            <div class="form-row">
                <div class="form-group"><label>Speed (km/h)</label><input type="number" id="sdtSpeed" value="60" step="0.1" /></div>
                <div class="form-group"><label>Time (hours)</label><input type="number" id="sdtTime" value="2" step="0.1" /></div>
                <div class="form-group"><label>Distance (km)</label><input type="number" id="sdtDist" value="120" step="0.1" /></div>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
                <button class="btn" id="sdtSpeedCalc">Find Speed</button>
                <button class="btn" id="sdtTimeCalc">Find Time</button>
                <button class="btn" id="sdtDistCalc">Find Distance</button>
            </div>
            <div class="result-box" id="sdtResult"><span class="label">Result</span><div class="value">—</div></div>
        `,
        fuel: `
            <div class="form-row">
                <div class="form-group"><label>Distance (km)</label><input type="number" id="fuelDist" value="500" step="0.1" /></div>
                <div class="form-group"><label>Mileage (km/l)</label><input type="number" id="fuelMileage" value="15" step="0.1" /></div>
                <div class="form-group"><label>Fuel Price (₹/l)</label><input type="number" id="fuelPrice" value="95" step="0.1" /></div>
            </div>
            <button class="btn btn-success" id="calcFuel">Calculate</button>
            <div class="result-box" id="fuelResult"><span class="label">Estimated Cost</span><div class="value">—</div></div>
        `,
        mileage: `
            <div class="form-row">
                <div class="form-group"><label>Distance (km)</label><input type="number" id="mileDist" value="300" step="0.1" /></div>
                <div class="form-group"><label>Fuel Used (liters)</label><input type="number" id="mileFuel" value="20" step="0.1" /></div>
            </div>
            <button class="btn btn-success" id="calcMileage">Calculate</button>
            <div class="result-box" id="mileResult"><span class="label">Mileage (km/l)</span><div class="value">—</div></div>
        `,
        split: `
            <div class="form-group"><label>Total Trip Cost (₹)</label><input type="number" id="splitCost" value="5000" step="0.1" /></div>
            <div class="form-group"><label>Number of People</label><input type="number" id="splitPeople" value="4" /></div>
            <button class="btn btn-success" id="calcSplit">Split</button>
            <div class="result-box" id="splitResult"><span class="label">Cost per person</span><div class="value">—</div></div>
        `
    };
    return maps[id] || '<p>Tool coming soon.</p>';
}

// ===== UNIT CONVERTER =====
function renderConverter() {
    const categories = ['Length', 'Weight', 'Temperature', 'Time', 'Speed', 'Area', 'Volume', 'Storage'];
    return `
        <div class="page active">
            <div class="page-header">
                <h1>📐 Unit Converter</h1>
                <p>Convert between various units.</p>
            </div>
            <div class="tab-bar">
                ${categories.map((cat, i) => `<button class="tab ${i === 0 ? 'active' : ''}" data-tab="conv-${cat.toLowerCase()}">${cat}</button>`).join('')}
            </div>
            ${categories.map((cat, i) => `
                <div class="tab-content ${i === 0 ? 'active' : ''}" id="conv-${cat.toLowerCase()}">
                    ${renderConverterTab(cat)}
                </div>
            `).join('')}
        </div>
    `;
}
function renderConverterTab(cat) {
    const units = {
        Length: ['m','km','cm','mm','mile','yard','ft','in'],
        Weight: ['kg','g','mg','lb','oz'],
        Temperature: ['°C','°F','K'],
        Time: ['s','min','h','day','week','month','year'],
        Speed: ['m/s','km/h','mph','knot'],
        Area: ['m²','km²','cm²','ft²','acre','ha'],
        Volume: ['L','mL','m³','gal','qt','pt','cup'],
        Storage: ['B','KB','MB','GB','TB','PB']
    };
    const u = units[cat] || ['—'];
    return `
        <div class="form-row">
            <div class="form-group"><label>Value</label><input type="number" id="convValue" value="1" step="any" /></div>
            <div class="form-group"><label>From</label><select id="convFrom">${u.map(unit => `<option value="${unit}">${unit}</option>`).join('')}</select></div>
            <div class="form-group"><label>To</label><select id="convTo">${u.map(unit => `<option value="${unit}">${unit}</option>`).join('')}</select></div>
        </div>
        <button class="btn btn-success" id="calcConv">Convert</button>
        <div class="result-box" id="convResult"><span class="label">Result</span><div class="value">—</div></div>
    `;
}

// ===== DATE TOOLS =====
function renderDate() {
    return `
        <div class="page active">
            <div class="page-header">
                <h1>📅 Date Tools</h1>
                <p>Age, date difference, countdowns.</p>
            </div>
            <div class="tab-bar">
                ${['age','diff','countdown','birthday'].map(id => `<button class="tab ${id === 'age' ? 'active' : ''}" data-tab="date-${id}">${id.toUpperCase()}</button>`).join('')}
            </div>
            ${['age','diff','countdown','birthday'].map(id => `
                <div class="tab-content ${id === 'age' ? 'active' : ''}" id="date-${id}">
                    ${renderDateTab(id)}
                </div>
            `).join('')}
        </div>
    `;
}
function renderDateTab(id) {
    const maps = {
        age: `
            <div class="form-group"><label>Date of Birth</label><input type="date" id="ageDob" /></div>
            <button class="btn btn-success" id="calcAge">Calculate Age</button>
            <div class="result-box" id="ageResult"><span class="label">Age</span><div class="value">—</div></div>
        `,
        diff: `
            <div class="form-row">
                <div class="form-group"><label>Start Date</label><input type="date" id="diffStart" /></div>
                <div class="form-group"><label>End Date</label><input type="date" id="diffEnd" /></div>
            </div>
            <button class="btn btn-success" id="calcDiff">Calculate Difference</button>
            <div class="result-box" id="diffResult"><span class="label">Days Between</span><div class="value">—</div></div>
        `,
        countdown: `
            <div class="form-group"><label>Target Date</label><input type="date" id="countdownDate" /></div>
            <button class="btn btn-success" id="calcCountdown">Countdown</button>
            <div class="result-box" id="countdownResult"><span class="label">Days Remaining</span><div class="value">—</div></div>
        `,
        birthday: `
            <div class="form-group"><label>Your Birthday</label><input type="date" id="bdayDate" /></div>
            <button class="btn btn-success" id="calcBday">Days Until Birthday</button>
            <div class="result-box" id="bdayResult"><span class="label">Days until next birthday</span><div class="value">—</div></div>
        `
    };
    return maps[id] || '<p>Tool coming soon.</p>';
}

// ===== UTILITY TOOLS =====
function renderUtility() {
    return `
        <div class="page active">
            <div class="page-header">
                <h1>🔧 Utility Tools</h1>
                <p>Password generator, QR, random, notes, stopwatch, timer, world clock.</p>
            </div>
            <div class="tab-bar">
                ${['password','qr','random','notes','stopwatch','timer','clock'].map(id => `<button class="tab ${id === 'password' ? 'active' : ''}" data-tab="util-${id}">${id.toUpperCase()}</button>`).join('')}
            </div>
            ${['password','qr','random','notes','stopwatch','timer','clock'].map(id => `
                <div class="tab-content ${id === 'password' ? 'active' : ''}" id="util-${id}">
                    ${renderUtilityTab(id)}
                </div>
            `).join('')}
        </div>
    `;
}
function renderUtilityTab(id) {
    const maps = {
        password: `
            <div style="margin-bottom:16px;">
                <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
                    <input type="checkbox" id="deterministicMode" /> 
                    <span style="font-weight:500;">Deterministic Mode</span>
                    <span style="font-size:12px;opacity:0.5;">(same keyword = same password)</span>
                </label>
            </div>

            <div id="deterministicInputs" style="display:none; background:rgba(255,255,255,0.04); padding:16px; border-radius:12px; margin-bottom:16px;">
                <div class="form-row">
                    <div class="form-group">
                        <label>Master Keyword <span style="opacity:0.4;">(your secret)</span></label>
                        <input type="password" id="masterKeyword" placeholder="e.g., 1234" />
                    </div>
                    <div class="form-group">
                        <label>Service Name</label>
                        <input type="text" id="serviceName" placeholder="e.g., gmail, facebook" />
                    </div>
                </div>
                <div style="font-size:12px;opacity:0.4;margin-top:4px;">
                    <i class="fas fa-info-circle"></i> The password will always be the same for this keyword + service.
                </div>
            </div>

            <div class="form-group"><label>Length</label><input type="number" id="passLen" value="16" min="4" max="64" /></div>
            <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:12px;">
                <label><input type="checkbox" id="passUpper" checked /> A-Z</label>
                <label><input type="checkbox" id="passLower" checked /> a-z</label>
                <label><input type="checkbox" id="passNum" checked /> 0-9</label>
                <label><input type="checkbox" id="passSym" checked /> !@#</label>
            </div>

            <button class="btn btn-success" id="genPass"><i class="fas fa-sync-alt"></i> Generate Password</button>
            
            <div class="result-box" id="passResult">
                <span class="label">Password</span>
                <div class="value" style="font-size:18px;word-break:break-all;display:flex;flex-direction:column;gap:8px;">
                    <span id="passwordDisplay" style="font-family:monospace;letter-spacing:1px;">—</span>
                    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
                        <button class="btn btn-sm btn-secondary" id="copyPasswordBtn"><i class="fas fa-copy"></i> Copy</button>
                        <span id="strengthIndicator" style="font-size:12px;padding:2px 12px;border-radius:40px;background:rgba(255,255,255,0.06);">Strength</span>
                    </div>
                </div>
            </div>
        `,
        qr: `
            <div class="form-group"><label>Text / URL</label><input type="text" id="qrText" placeholder="Enter text or URL" value="https://example.com" /></div>
            <button class="btn btn-success" id="genQR">Generate QR</button>
            <div class="result-box text-center" id="qrResult"><span class="label">QR Code</span><div id="qrCanvas" style="display:flex;justify-content:center;padding:12px 0;"></div></div>
        `,
        random: `
            <div class="form-row">
                <div class="form-group"><label>Min</label><input type="number" id="randMin" value="1" /></div>
                <div class="form-group"><label>Max</label><input type="number" id="randMax" value="100" /></div>
            </div>
            <button class="btn btn-success" id="genRand">Generate</button>
            <div class="result-box" id="randResult"><span class="label">Random Number</span><div class="value">—</div></div>
        `,
        notes: `
            <div class="form-group"><label>Your Notes (auto-saved)</label></div>
            <textarea class="notes-area" id="notesArea" placeholder="Write your notes here...">${notes}</textarea>
            <div style="margin-top:8px;opacity:0.4;font-size:12px;">Auto-saved to local storage.</div>
        `,
        stopwatch: `
            <div class="stopwatch-display" id="stopwatchDisplay">00:00:00</div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">
                <button class="btn btn-success" id="swStart">Start</button>
                <button class="btn btn-secondary" id="swStop">Stop</button>
                <button class="btn btn-secondary" id="swReset">Reset</button>
            </div>
        `,
        timer: `
            <div class="form-group"><label>Minutes</label><input type="number" id="timerMinutes" value="5" min="1" /></div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
                <button class="btn btn-success" id="timerStart">Start</button>
                <button class="btn btn-secondary" id="timerStop">Stop</button>
                <button class="btn btn-secondary" id="timerReset">Reset</button>
            </div>
            <div class="result-box" id="timerResult"><span class="label">Time Remaining</span><div class="value" id="timerDisplay">05:00</div></div>
        `,
        clock: `
            <div style="text-align:center;padding:20px 0;">
                <div style="font-size:48px;font-weight:300;font-family:'Inter',monospace;letter-spacing:2px;" id="worldClock">—</div>
                <div style="opacity:0.5;margin-top:4px;" id="worldDate">—</div>
                <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">
                    ${['UTC','IST','EST','PST','JST','AEDT'].map(tz => `<button class="btn btn-sm btn-secondary" data-tz="${tz}">${tz}</button>`).join('')}
                </div>
            </div>
        `
    };
    return maps[id] || '<p>Tool coming soon.</p>';
}

// ===== FUN & ENTERTAINMENT (with Death Prediction) =====
function renderFun() {
    return `
        <div class="page active">
            <div class="page-header">
                <h1>✨ Fun & Entertainment</h1>
                <p>Zodiac, lucky numbers, compatibility, personality, fortune, destiny, and more.</p>
            </div>
            <div class="tab-bar">
                ${['zodiac','lucky','compat','quiz','fortune','destiny','death'].map(id => `<button class="tab ${id === 'zodiac' ? 'active' : ''}" data-tab="fun-${id}">${id.toUpperCase()}</button>`).join('')}
            </div>
            ${['zodiac','lucky','compat','quiz','fortune','destiny','death'].map(id => `
                <div class="tab-content ${id === 'zodiac' ? 'active' : ''}" id="fun-${id}">
                    ${renderFunTab(id)}
                </div>
            `).join('')}
        </div>
    `;
}
function renderFunTab(id) {
    const maps = {
        zodiac: `
            <div class="form-group"><label>Date of Birth</label><input type="date" id="zodiacDob" /></div>
            <button class="btn btn-success" id="findZodiac">Find Zodiac</button>
            <div class="result-box" id="zodiacResult"><span class="label">Your Zodiac</span><div class="value">—</div></div>
        `,
        lucky: `
            <button class="btn btn-success" id="genLuckyNum">Generate Lucky Number</button>
            <div class="result-box" id="luckyNumResult"><span class="label">Your Lucky Number</span><div class="value">—</div></div>
            <button class="btn btn-success mt-8" id="genLuckyColor">Generate Lucky Color</button>
            <div class="result-box" id="luckyColorResult"><span class="label">Your Lucky Color</span><div class="value" style="display:flex;align-items:center;gap:12px;">—</div></div>
        `,
        compat: `
            <div class="form-row">
                <div class="form-group"><label>Your Zodiac</label><select id="compatZodiac1">${zodiacSigns.map(s => `<option value="${s}">${s}</option>`).join('')}</select></div>
                <div class="form-group"><label>Partner's Zodiac</label><select id="compatZodiac2">${zodiacSigns.map(s => `<option value="${s}">${s}</option>`).join('')}</select></div>
            </div>
            <button class="btn btn-success" id="checkCompat">Check Compatibility</button>
            <div class="result-box" id="compatResult"><span class="label">Compatibility Score</span><div class="value">—</div></div>
            <div class="entertainment-badge">🎭 For entertainment only</div>
        `,
        quiz: `
            <div id="quizContainer">
                <p class="text-muted">Answer these 5 questions to discover your personality profile.</p>
                ${[1,2,3,4,5].map(q => `
                    <div class="mystic-question">
                        <p><strong>Q${q}:</strong> ${quizQuestions[q-1].q}</p>
                        <div style="display:flex;gap:8px;flex-wrap:wrap;">
                            ${quizQuestions[q-1].options.map((opt, oi) => `
                                <label style="font-size:13px;display:flex;align-items:center;gap:4px;">
                                    <input type="radio" name="quiz-q${q}" value="${oi}" /> ${opt}
                                </label>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
                <button class="btn btn-success" id="runQuiz">Reveal Personality</button>
                <div class="result-box" id="quizResult"><span class="label">Your Profile</span><div class="value">—</div></div>
                <div class="entertainment-badge">🎭 For entertainment only</div>
            </div>
        `,
        fortune: `
            <button class="btn btn-success" id="getFortune">Get Daily Fortune</button>
            <div class="result-box" id="fortuneResult"><span class="label">Your Fortune</span><div class="value" style="font-size:18px;font-weight:400;">—</div></div>
            <div class="entertainment-badge">🎭 For entertainment only</div>
        `,
        destiny: `
            <button class="btn btn-success" id="rollDestiny">Roll Destiny Meter</button>
            <div class="result-box" id="destinyResult">
                <span class="label">Your Destiny Scores</span>
                <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:8px;" id="destinyScores">
                    ${['Luck','Confidence','Creativity','Productivity','Happiness'].map(attr => `
                        <div style="background:rgba(255,255,255,0.04);padding:8px 12px;border-radius:8px;text-align:center;">
                            <div style="font-size:12px;opacity:0.6;">${attr}</div>
                            <div style="font-size:22px;font-weight:700;color:var(--primary);">—</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="entertainment-badge">🎭 For entertainment only</div>
        `,
        death: `
            <div style="background:rgba(239,68,68,0.05);border-radius:12px;padding:16px;border:1px solid rgba(239,68,68,0.1);margin-bottom:16px;">
                <p style="font-size:14px;opacity:0.8;"><i class="fas fa-skull" style="color:var(--error);margin-right:8px;"></i> This is a <strong>mystical entertainment feature</strong>. It does not predict actual events. Please treat it as a fun personality exercise.</p>
            </div>
            <p class="text-muted mb-12">Answer a few questions to receive a whimsical "life path" reading.</p>
            ${deathQuestions.map((dq, idx) => `
                <div class="mystic-question">
                    <p><strong>Q${idx+1}:</strong> ${dq.q}</p>
                    <div style="display:flex;gap:8px;flex-wrap:wrap;">
                        ${dq.options.map((opt, oi) => `
                            <label style="font-size:13px;display:flex;align-items:center;gap:4px;">
                                <input type="radio" name="death-q${idx}" value="${oi}" /> ${opt}
                            </label>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
            <button class="btn btn-danger" id="runDeathPrediction">🔮 Reveal Life Path Reading</button>
            <div class="result-box" id="deathResult">
                <span class="label">Your Mystical Reading</span>
                <div class="value" style="font-size:18px;font-weight:400;line-height:1.6;">—</div>
            </div>
            <div class="death-disclaimer">
                <strong>⚠️ Disclaimer:</strong> This is a fictional, entertainment-only experience. It does not provide medical, psychological, or factual predictions about health or lifespan. Enjoy responsibly.
            </div>
            <div class="entertainment-badge">🎭 For entertainment only</div>
        `
    };
    return maps[id] || '<p>Tool coming soon.</p>';
}

// =============================================================
//  EVENT BINDING (called after each page render)
// =============================================================
function bindPageEvents(pageId) {
    // --- Tab switching (global) ---
    document.querySelectorAll('.tab-bar .tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const parent = this.closest('.page');
            const tabId = this.dataset.tab;
            parent.querySelectorAll('.tab-bar .tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            parent.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
            const target = parent.querySelector(`#${tabId}`);
            if (target) target.classList.add('active');
        });
    });

    // --- Dashboard card navigation ---
    document.querySelectorAll('[data-nav]').forEach(el => {
        el.addEventListener('click', function() {
            const id = this.dataset.nav;
            const navItem = NAV_ITEMS.find(n => n.id === id);
            if (navItem) navigateTo(id);
        });
    });

    // ===== BASIC CALCULATOR =====
    const basicDisplay = document.getElementById('basicResult');
    const basicSub = document.getElementById('basicSub');
    if (basicDisplay) {
        let expr = '';
        let result = '0';
        let memory = 0;

        const updateDisplay = () => {
            basicDisplay.textContent = result;
            basicSub.textContent = expr;
        };

        const evaluate = (exp) => {
            try {
                let sanitized = exp.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
                sanitized = sanitized.replace(/(\d+)%/g, (_, num) => `(${num}/100)`);
                const fn = new Function(`return (${sanitized})`);
                const val = fn();
                if (!isFinite(val)) return 'Error';
                return parseFloat(val.toFixed(10));
            } catch { return 'Error'; }
        };

        document.querySelectorAll('[data-basic]').forEach(btn => {
            btn.addEventListener('click', function() {
                const key = this.dataset.basic;
                if (key === 'C') { expr = ''; result = '0'; updateDisplay(); return; }
                if (key === '⌫') { expr = expr.slice(0, -1); result = expr || '0'; updateDisplay(); return; }
                if (key === '±') {
                    if (result !== '0' && result !== 'Error') {
                        result = String(-parseFloat(result));
                        expr = result;
                        updateDisplay();
                    }
                    return;
                }
                if (key === '%') {
                    if (result !== '0' && result !== 'Error') {
                        result = String(parseFloat(result) / 100);
                        expr = result;
                        updateDisplay();
                    }
                    return;
                }
                if (key === '=') {
                    if (expr) {
                        const val = evaluate(expr);
                        result = String(val);
                        addHistory(expr, result);
                        expr = result;
                        updateDisplay();
                    }
                    return;
                }
                if (['+', '−', '×', '÷'].includes(key)) {
                    const opMap = { '+': '+', '−': '-', '×': '*', '÷': '/' };
                    if (['+', '-', '*', '/'].includes(expr.slice(-1))) {
                        expr = expr.slice(0, -1) + opMap[key];
                    } else if (expr) {
                        expr += opMap[key];
                    } else {
                        expr = '0' + opMap[key];
                    }
                    const preview = evaluate(expr);
                    result = isFinite(preview) ? String(preview) : '0';
                    updateDisplay();
                    return;
                }
                if (key === '.' && expr.split(/[\+\-\*\/]/).pop().includes('.')) return;
                expr += key;
                const preview = evaluate(expr);
                result = isFinite(preview) ? String(preview) : '0';
                updateDisplay();
            });
        });

        // Memory buttons
        document.querySelectorAll('[data-mem]').forEach(btn => {
            btn.addEventListener('click', function() {
                const op = this.dataset.mem;
                const current = parseFloat(result) || 0;
                if (op === 'mc') memory = 0;
                else if (op === 'mr') { result = String(memory); expr = result; updateDisplay(); }
                else if (op === 'mplus') memory += current;
                else if (op === 'mminus') memory -= current;
                showToast(`Memory ${op.toUpperCase()} → ${memory}`);
            });
        });

        // Copy
        const copyBtn = document.getElementById('basicCopy');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                navigator.clipboard?.writeText(result).then(() => showToast('Copied!'));
            });
        }

        // Clear history
        const clearHist = document.getElementById('basicClearHist');
        if (clearHist) {
            clearHist.addEventListener('click', () => { history = []; updateHistoryBadge(); renderHistory(); showToast('History cleared'); });
        }

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (currentPage !== 'basic') return;
            const key = e.key;
            const map = { 'Enter': '=', 'Backspace': '⌫', 'Escape': 'C', '+': '+', '-': '−', '*': '×', '/': '÷', '.': '.', '%': '%' };
            let target = map[key];
            if (!target && /^[0-9]$/.test(key)) target = key;
            if (target) {
                const btn = document.querySelector(`[data-basic="${target}"]`);
                if (btn) { btn.click(); e.preventDefault(); }
            }
        });
    }

    // ===== SCIENTIFIC CALCULATOR =====
    const sciDisplay = document.getElementById('sciResult');
    const sciSub = document.getElementById('sciSub');
    if (sciDisplay) {
        let sciExpr = '';
        let sciResult = '0';

        const updateSci = () => {
            sciDisplay.textContent = sciResult;
            sciSub.textContent = sciExpr;
        };

        const sciEval = (exp) => {
            try {
                let sanitized = exp.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
                sanitized = sanitized.replace(/sin\(/g, 'Math.sin(');
                sanitized = sanitized.replace(/cos\(/g, 'Math.cos(');
                sanitized = sanitized.replace(/tan\(/g, 'Math.tan(');
                sanitized = sanitized.replace(/log\(/g, 'Math.log10(');
                sanitized = sanitized.replace(/ln\(/g, 'Math.log(');
                sanitized = sanitized.replace(/√\(/g, 'Math.sqrt(');
                sanitized = sanitized.replace(/π/g, 'Math.PI');
                sanitized = sanitized.replace(/e(?![xp])/g, 'Math.E');
                sanitized = sanitized.replace(/x²/g, '**2');
                sanitized = sanitized.replace(/x³/g, '**3');
                sanitized = sanitized.replace(/xⁿ/g, '**');
                sanitized = sanitized.replace(/!/g, 'factorial');
                sanitized = sanitized.replace(/\|x\|/g, 'Math.abs');
                sanitized = sanitized.replace(/rand/g, 'Math.random()');
                const fn = new Function('factorial', `return (${sanitized})`);
                const fact = (n) => { if (n < 0) return NaN; if (n <= 1) return 1; let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; };
                const val = fn(fact);
                if (!isFinite(val)) return 'Error';
                return parseFloat(val.toFixed(10));
            } catch { return 'Error'; }
        };

        document.querySelectorAll('[data-sci]').forEach(btn => {
            btn.addEventListener('click', function() {
                const key = this.dataset.sci;
                if (key === 'C') { sciExpr = ''; sciResult = '0'; updateSci(); return; }
                if (key === '⌫') { sciExpr = sciExpr.slice(0, -1); sciResult = sciExpr || '0'; updateSci(); return; }
                if (key === '±') {
                    if (sciResult !== '0' && sciResult !== 'Error') {
                        sciResult = String(-parseFloat(sciResult));
                        sciExpr = sciResult;
                        updateSci();
                    }
                    return;
                }
                if (key === '%') {
                    if (sciResult !== '0' && sciResult !== 'Error') {
                        sciResult = String(parseFloat(sciResult) / 100);
                        sciExpr = sciResult;
                        updateSci();
                    }
                    return;
                }
                if (key === '=') {
                    if (sciExpr) {
                        const val = sciEval(sciExpr);
                        sciResult = String(val);
                        addHistory(sciExpr, sciResult);
                        sciExpr = sciResult;
                        updateSci();
                    }
                    return;
                }
                if (['+', '−', '×', '÷'].includes(key)) {
                    const opMap = { '+': '+', '−': '-', '×': '*', '÷': '/' };
                    if (['+', '-', '*', '/'].includes(sciExpr.slice(-1))) {
                        sciExpr = sciExpr.slice(0, -1) + opMap[key];
                    } else if (sciExpr) {
                        sciExpr += opMap[key];
                    } else {
                        sciExpr = '0' + opMap[key];
                    }
                    const preview = sciEval(sciExpr);
                    sciResult = isFinite(preview) ? String(preview) : '0';
                    updateSci();
                    return;
                }
                if (['sin','cos','tan','log','ln','√','x²','x³','xⁿ','!','π','e','1/x','|x|','rand'].includes(key)) {
                    const map = { 'sin':'sin(', 'cos':'cos(', 'tan':'tan(', 'log':'log(', 'ln':'ln(', '√':'√(', 'x²':'**2', 'x³':'**3', 'xⁿ':'**', '!':'!', 'π':'π', 'e':'e', '1/x':'1/', '|x|':'|x|', 'rand':'rand' };
                    const token = map[key] || key;
                    if (token === 'π' || token === 'e' || token === 'rand') {
                        sciExpr += token;
                    } else if (token === '**' || token === '!') {
                        sciExpr += token;
                    } else {
                        sciExpr += token;
                    }
                    const preview = sciEval(sciExpr);
                    sciResult = isFinite(preview) ? String(preview) : '0';
                    updateSci();
                    return;
                }
                if (key === '.' && sciExpr.split(/[\+\-\*\/\(\)]/).pop().includes('.')) return;
                sciExpr += key;
                const preview = sciEval(sciExpr);
                sciResult = isFinite(preview) ? String(preview) : '0';
                updateSci();
            });
        });

        const sciCopy = document.getElementById('sciCopy');
        if (sciCopy) {
            sciCopy.addEventListener('click', () => {
                navigator.clipboard?.writeText(sciResult).then(() => showToast('Copied!'));
            });
        }
    }

    // ===== FINANCE TOOLS =====
    // Simple Interest
    const siBtn = document.getElementById('calcSI');
    if (siBtn) {
        siBtn.addEventListener('click', () => {
            const p = parseFloat(document.getElementById('siPrincipal').value) || 0;
            const r = parseFloat(document.getElementById('siRate').value) || 0;
            const t = parseFloat(document.getElementById('siTime').value) || 0;
            const si = (p * r * t) / 100;
            const total = p + si;
            document.getElementById('siResult').innerHTML = `<span class="label">Results</span><div class="value">Interest: ₹${si.toFixed(2)}<br/>Total: ₹${total.toFixed(2)}</div>`;
        });
    }
    // Compound Interest
    const ciBtn = document.getElementById('calcCI');
    if (ciBtn) {
        ciBtn.addEventListener('click', () => {
            const p = parseFloat(document.getElementById('ciPrincipal').value) || 0;
            const r = parseFloat(document.getElementById('ciRate').value) || 0;
            const t = parseFloat(document.getElementById('ciTime').value) || 0;
            const f = parseInt(document.getElementById('ciFreq').value) || 1;
            const amt = p * Math.pow(1 + (r / 100) / f, f * t);
            const ci = amt - p;
            document.getElementById('ciResult').innerHTML = `<span class="label">Results</span><div class="value">Interest: ₹${ci.toFixed(2)}<br/>Final: ₹${amt.toFixed(2)}</div>`;
        });
    }
    // EMI
    const emiBtn = document.getElementById('calcEMI');
    if (emiBtn) {
        emiBtn.addEventListener('click', () => {
            const p = parseFloat(document.getElementById('emiPrincipal').value) || 0;
            const r = parseFloat(document.getElementById('emiRate').value) || 0;
            const n = parseInt(document.getElementById('emiPeriod').value) || 1;
            const mr = r / 12 / 100;
            const emi = p * mr * Math.pow(1 + mr, n) / (Math.pow(1 + mr, n) - 1);
            const total = emi * n;
            const interest = total - p;
            document.getElementById('emiResult').innerHTML = `<span class="label">Results</span><div class="value">EMI: ₹${emi.toFixed(2)}<br/>Total Interest: ₹${interest.toFixed(2)}<br/>Total Payment: ₹${total.toFixed(2)}</div>`;
        });
    }
    // GST
    const gstAdd = document.getElementById('gstAdd');
    const gstRemove = document.getElementById('gstRemove');
    if (gstAdd) {
        gstAdd.addEventListener('click', () => {
            const amt = parseFloat(document.getElementById('gstAmount').value) || 0;
            const rate = parseFloat(document.getElementById('gstRate').value) || 0;
            const gst = amt * rate / 100;
            const total = amt + gst;
            document.getElementById('gstResult').innerHTML = `<span class="label">Results</span><div class="value">GST: ₹${gst.toFixed(2)}<br/>Total (incl. GST): ₹${total.toFixed(2)}</div>`;
        });
    }
    if (gstRemove) {
        gstRemove.addEventListener('click', () => {
            const amt = parseFloat(document.getElementById('gstAmount').value) || 0;
            const rate = parseFloat(document.getElementById('gstRate').value) || 0;
            const base = amt / (1 + rate / 100);
            const gst = amt - base;
            document.getElementById('gstResult').innerHTML = `<span class="label">Results</span><div class="value">Base: ₹${base.toFixed(2)}<br/>GST: ₹${gst.toFixed(2)}</div>`;
        });
    }
    // Discount
    const discBtn = document.getElementById('calcDisc');
    if (discBtn) {
        discBtn.addEventListener('click', () => {
            const price = parseFloat(document.getElementById('discPrice').value) || 0;
            const rate = parseFloat(document.getElementById('discRate').value) || 0;
            const saving = price * rate / 100;
            const final = price - saving;
            document.getElementById('discResult').innerHTML = `<span class="label">Results</span><div class="value">Savings: ₹${saving.toFixed(2)}<br/>Final Price: ₹${final.toFixed(2)}</div>`;
        });
    }
    // P&L
    const pnlBtn = document.getElementById('calcPNL');
    if (pnlBtn) {
        pnlBtn.addEventListener('click', () => {
            const cp = parseFloat(document.getElementById('pnlCost').value) || 0;
            const sp = parseFloat(document.getElementById('pnlSell').value) || 0;
            const diff = sp - cp;
            const pct = cp !== 0 ? (diff / cp) * 100 : 0;
            const label = diff >= 0 ? 'Profit' : 'Loss';
            const cls = diff >= 0 ? 'success' : 'danger';
            document.getElementById('pnlResult').innerHTML = `<span class="label">Results</span><div class="value ${cls}">${label}: ₹${diff.toFixed(2)} (${pct.toFixed(2)}%)</div>`;
        });
    }
    // SIP
    const sipBtn = document.getElementById('calcSIP');
    if (sipBtn) {
        sipBtn.addEventListener('click', () => {
            const p = parseFloat(document.getElementById('sipAmount').value) || 0;
            const r = parseFloat(document.getElementById('sipRate').value) || 0;
            const y = parseFloat(document.getElementById('sipYears').value) || 1;
            const n = y * 12;
            const mr = r / 12 / 100;
            const fv = p * ((Math.pow(1 + mr, n) - 1) / mr) * (1 + mr);
            const invested = p * n;
            const returns = fv - invested;
            document.getElementById('sipResult').innerHTML = `<span class="label">Results</span><div class="value">Invested: ₹${invested.toFixed(2)}<br/>Returns: ₹${returns.toFixed(2)}<br/>Maturity: ₹${fv.toFixed(2)}</div>`;
        });
    }

    // ===== STUDENT TOOLS =====
    const pctBtn = document.getElementById('calcPct');
    if (pctBtn) {
        pctBtn.addEventListener('click', () => {
            const o = parseFloat(document.getElementById('pctObtained').value) || 0;
            const t = parseFloat(document.getElementById('pctTotal').value) || 1;
            const pct = (o / t) * 100;
            document.getElementById('pctResult').innerHTML = `<span class="label">Percentage</span><div class="value">${pct.toFixed(2)}%</div>`;
        });
    }
    const cgpaBtn = document.getElementById('calcCGPA');
    if (cgpaBtn) {
        cgpaBtn.addEventListener('click', () => {
            const cgpa = parseFloat(document.getElementById('cgpaInput').value) || 0;
            const pct = cgpa * 9.5;
            document.getElementById('cgpaResult').innerHTML = `<span class="label">Percentage</span><div class="value">${pct.toFixed(2)}%</div>`;
        });
    }
    const gradeBtn = document.getElementById('calcGrade');
    if (gradeBtn) {
        gradeBtn.addEventListener('click', () => {
            const m = parseFloat(document.getElementById('gradeInput').value) || 0;
            let grade = 'F';
            if (m >= 90) grade = 'A+';
            else if (m >= 80) grade = 'A';
            else if (m >= 70) grade = 'B';
            else if (m >= 60) grade = 'C';
            else if (m >= 50) grade = 'D';
            else grade = 'F';
            document.getElementById('gradeResult').innerHTML = `<span class="label">Grade</span><div class="value">${grade}</div>`;
        });
    }
    const attBtn = document.getElementById('calcAttend');
    if (attBtn) {
        attBtn.addEventListener('click', () => {
            const a = parseFloat(document.getElementById('attendAtt').value) || 0;
            const t = parseFloat(document.getElementById('attendTotal').value) || 1;
            const pct = (a / t) * 100;
            const cls = pct >= 75 ? 'success' : 'danger';
            document.getElementById('attendResult').innerHTML = `<span class="label">Attendance</span><div class="value ${cls}">${pct.toFixed(2)}%</div>`;
        });
    }

    // Pomodoro
    let pomoTimer = null, pomoRunning = false, pomoRemaining = 25 * 60, pomoWork = 25, pomoBreak = 5, pomoPhase = 'work';
    const pomoDisplay = document.getElementById('pomoDisplay');
    function updatePomo() { if (!pomoDisplay) return; const m = Math.floor(pomoRemaining / 60); const s = Math.floor(pomoRemaining % 60); pomoDisplay.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`; }
    const pomoStart = document.getElementById('pomoStart');
    if (pomoStart) {
        pomoStart.addEventListener('click', () => {
            if (pomoRunning) return;
            pomoWork = parseInt(document.getElementById('pomoWork').value) || 25;
            pomoBreak = parseInt(document.getElementById('pomoBreak').value) || 5;
            if (pomoRemaining <= 0) { pomoRemaining = pomoWork * 60; pomoPhase = 'work'; }
            pomoRunning = true;
            pomoTimer = setInterval(() => {
                pomoRemaining--;
                updatePomo();
                if (pomoRemaining <= 0) {
                    clearInterval(pomoTimer);
                    pomoRunning = false;
                    if (pomoPhase === 'work') {
                        pomoPhase = 'break';
                        pomoRemaining = pomoBreak * 60;
                        showToast('⏰ Break time!', 'fa-clock');
                        pomoRunning = true;
                        pomoTimer = setInterval(() => {
                            pomoRemaining--;
                            updatePomo();
                            if (pomoRemaining <= 0) {
                                clearInterval(pomoTimer);
                                pomoRunning = false;
                                pomoPhase = 'work';
                                pomoRemaining = pomoWork * 60;
                                updatePomo();
                                showToast('💪 Work time!', 'fa-clock');
                            }
                        }, 1000);
                    } else {
                        pomoPhase = 'work';
                        pomoRemaining = pomoWork * 60;
                        updatePomo();
                        showToast('💪 Work time!', 'fa-clock');
                    }
                }
            }, 1000);
            showToast('Pomodoro started');
        });
    }
    const pomoStop = document.getElementById('pomoStop');
    if (pomoStop) { pomoStop.addEventListener('click', () => { clearInterval(pomoTimer); pomoRunning = false; showToast('Pomodoro stopped'); }); }
    const pomoReset = document.getElementById('pomoReset');
    if (pomoReset) {
        pomoReset.addEventListener('click', () => {
            clearInterval(pomoTimer); pomoRunning = false;
            pomoRemaining = (parseInt(document.getElementById('pomoWork').value) || 25) * 60;
            pomoPhase = 'work'; updatePomo(); showToast('Pomodoro reset');
        });
    }
    const examBtn = document.getElementById('calcExam');
    if (examBtn) {
        examBtn.addEventListener('click', () => {
            const date = document.getElementById('examDate').value;
            if (!date) { showToast('Please select a date', 'fa-exclamation-triangle'); return; }
            const target = new Date(date);
            const now = new Date();
            const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
            document.getElementById('examResult').innerHTML = `<span class="label">Days Remaining</span><div class="value ${diff > 0 ? 'success' : 'danger'}">${diff > 0 ? diff : 'Passed!'}</div>`;
        });
    }

    // ===== HEALTH TOOLS =====
    const bmiBtn = document.getElementById('calcBMI');
    if (bmiBtn) {
        bmiBtn.addEventListener('click', () => {
            const w = parseFloat(document.getElementById('bmiWeight').value) || 0;
            const h = parseFloat(document.getElementById('bmiHeight').value) || 1;
            const bmi = w / ((h / 100) ** 2);
            let cat = 'Normal';
            if (bmi < 18.5) cat = 'Underweight';
            else if (bmi < 25) cat = 'Normal';
            else if (bmi < 30) cat = 'Overweight';
            else cat = 'Obese';
            document.getElementById('bmiResult').innerHTML = `<span class="label">BMI</span><div class="value">${bmi.toFixed(1)} — ${cat}</div>`;
        });
    }
    const waterBtn = document.getElementById('calcWater');
    if (waterBtn) {
        waterBtn.addEventListener('click', () => {
            const w = parseFloat(document.getElementById('waterWeight').value) || 0;
            const liters = w * 0.033;
            document.getElementById('waterResult').innerHTML = `<span class="label">Daily Water Intake (liters)</span><div class="value">${liters.toFixed(2)} L</div>`;
        });
    }
    const calBtn = document.getElementById('calcCalories');
    if (calBtn) {
        calBtn.addEventListener('click', () => {
            const age = parseFloat(document.getElementById('calAge').value) || 30;
            const w = parseFloat(document.getElementById('calWeight').value) || 70;
            const h = parseFloat(document.getElementById('calHeight').value) || 175;
            const gender = document.getElementById('calGender').value;
            let bmr;
            if (gender === 'male') bmr = 10 * w + 6.25 * h - 5 * age + 5;
            else bmr = 10 * w + 6.25 * h - 5 * age - 161;
            document.getElementById('calResult').innerHTML = `<span class="label">BMR (kcal/day)</span><div class="value">${bmr.toFixed(0)} kcal</div>`;
        });
    }
    const sleepBtn = document.getElementById('calcSleep');
    if (sleepBtn) {
        sleepBtn.addEventListener('click', () => {
            const wake = document.getElementById('sleepWake').value;
            if (!wake) { showToast('Please select a wake time'); return; }
            const [h, m] = wake.split(':').map(Number);
            const base = new Date(); base.setHours(h, m, 0, 0);
            const times = [];
            for (let cycles = 5; cycles <= 6; cycles++) {
                const d = new Date(base);
                d.setMinutes(d.getMinutes() - cycles * 90);
                times.push(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            }
            document.getElementById('sleepResult').innerHTML = `<span class="label">Recommended bedtimes</span><div class="value" style="font-size:16px;">${times.join('  •  ')}</div>`;
        });
    }
    const stepBtn = document.getElementById('calcSteps');
    if (stepBtn) {
        stepBtn.addEventListener('click', () => {
            const goal = parseFloat(document.getElementById('stepGoal').value) || 10000;
            const curr = parseFloat(document.getElementById('stepCurrent').value) || 0;
            const pct = Math.min(100, (curr / goal) * 100);
            const remaining = Math.max(0, goal - curr);
            document.getElementById('stepResult').innerHTML = `<span class="label">Progress</span><div class="value">${pct.toFixed(0)}% (${remaining} steps to go)</div>`;
        });
    }

    // ===== TRAVEL TOOLS =====
    const sdtSpeed = document.getElementById('sdtSpeedCalc');
    if (sdtSpeed) {
        sdtSpeed.addEventListener('click', () => {
            const d = parseFloat(document.getElementById('sdtDist').value) || 0;
            const t = parseFloat(document.getElementById('sdtTime').value) || 1;
            const s = d / t;
            document.getElementById('sdtResult').innerHTML = `<span class="label">Speed</span><div class="value">${s.toFixed(2)} km/h</div>`;
        });
    }
    const sdtTime = document.getElementById('sdtTimeCalc');
    if (sdtTime) {
        sdtTime.addEventListener('click', () => {
            const d = parseFloat(document.getElementById('sdtDist').value) || 0;
            const s = parseFloat(document.getElementById('sdtSpeed').value) || 1;
            const t = d / s;
            document.getElementById('sdtResult').innerHTML = `<span class="label">Time</span><div class="value">${t.toFixed(2)} hours</div>`;
        });
    }
    const sdtDist = document.getElementById('sdtDistCalc');
    if (sdtDist) {
        sdtDist.addEventListener('click', () => {
            const s = parseFloat(document.getElementById('sdtSpeed').value) || 0;
            const t = parseFloat(document.getElementById('sdtTime').value) || 0;
            const d = s * t;
            document.getElementById('sdtResult').innerHTML = `<span class="label">Distance</span><div class="value">${d.toFixed(2)} km</div>`;
        });
    }
    const fuelBtn = document.getElementById('calcFuel');
    if (fuelBtn) {
        fuelBtn.addEventListener('click', () => {
            const d = parseFloat(document.getElementById('fuelDist').value) || 0;
            const m = parseFloat(document.getElementById('fuelMileage').value) || 1;
            const p = parseFloat(document.getElementById('fuelPrice').value) || 0;
            const fuel = d / m;
            const cost = fuel * p;
            document.getElementById('fuelResult').innerHTML = `<span class="label">Estimated Cost</span><div class="value">Fuel: ${fuel.toFixed(2)} L<br/>Cost: ₹${cost.toFixed(2)}</div>`;
        });
    }
    const mileBtn = document.getElementById('calcMileage');
    if (mileBtn) {
        mileBtn.addEventListener('click', () => {
            const d = parseFloat(document.getElementById('mileDist').value) || 0;
            const f = parseFloat(document.getElementById('mileFuel').value) || 1;
            const m = d / f;
            document.getElementById('mileResult').innerHTML = `<span class="label">Mileage (km/l)</span><div class="value">${m.toFixed(2)} km/l</div>`;
        });
    }
    const splitBtn = document.getElementById('calcSplit');
    if (splitBtn) {
        splitBtn.addEventListener('click', () => {
            const c = parseFloat(document.getElementById('splitCost').value) || 0;
            const p = parseFloat(document.getElementById('splitPeople').value) || 1;
            const each = c / p;
            document.getElementById('splitResult').innerHTML = `<span class="label">Cost per person</span><div class="value">₹${each.toFixed(2)}</div>`;
        });
    }

    // ===== UNIT CONVERTER =====
    const convBtn = document.getElementById('calcConv');
    if (convBtn) {
        convBtn.addEventListener('click', () => {
            const val = parseFloat(document.getElementById('convValue').value) || 0;
            const from = document.getElementById('convFrom').value;
            const to = document.getElementById('convTo').value;
            const result = convertUnits(val, from, to);
            document.getElementById('convResult').innerHTML = `<span class="label">Result</span><div class="value">${result}</div>`;
        });
    }

    // ===== DATE TOOLS =====
    const ageBtn = document.getElementById('calcAge');
    if (ageBtn) {
        ageBtn.addEventListener('click', () => {
            const dob = document.getElementById('ageDob').value;
            if (!dob) { showToast('Select date of birth'); return; }
            const birth = new Date(dob);
            const now = new Date();
            let years = now.getFullYear() - birth.getFullYear();
            let months = now.getMonth() - birth.getMonth();
            let days = now.getDate() - birth.getDate();
            if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
            if (months < 0) { years--; months += 12; }
            document.getElementById('ageResult').innerHTML = `<span class="label">Age</span><div class="value">${years}y ${months}m ${days}d</div>`;
        });
    }
    const diffBtn = document.getElementById('calcDiff');
    if (diffBtn) {
        diffBtn.addEventListener('click', () => {
            const s = document.getElementById('diffStart').value;
            const e = document.getElementById('diffEnd').value;
            if (!s || !e) { showToast('Select both dates'); return; }
            const d1 = new Date(s), d2 = new Date(e);
            const diff = Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));
            document.getElementById('diffResult').innerHTML = `<span class="label">Days Between</span><div class="value">${diff} days</div>`;
        });
    }
    const cdBtn = document.getElementById('calcCountdown');
    if (cdBtn) {
        cdBtn.addEventListener('click', () => {
            const date = document.getElementById('countdownDate').value;
            if (!date) { showToast('Select a target date'); return; }
            const target = new Date(date);
            const now = new Date();
            const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
            document.getElementById('countdownResult').innerHTML = `<span class="label">Days Remaining</span><div class="value ${diff > 0 ? 'success' : 'danger'}">${diff > 0 ? diff : 'Passed'}</div>`;
        });
    }
    const bdayBtn = document.getElementById('calcBday');
    if (bdayBtn) {
        bdayBtn.addEventListener('click', () => {
            const date = document.getElementById('bdayDate').value;
            if (!date) { showToast('Select your birthday'); return; }
            const bday = new Date(date);
            const now = new Date();
            let next = new Date(now.getFullYear(), bday.getMonth(), bday.getDate());
            if (next < now) next.setFullYear(next.getFullYear() + 1);
            const diff = Math.ceil((next - now) / (1000 * 60 * 60 * 24));
            document.getElementById('bdayResult').innerHTML = `<span class="label">Days until next birthday</span><div class="value">${diff} days</div>`;
        });
    }

    // ===== PASSWORD GENERATOR (Random + Deterministic) =====
    const passBtn = document.getElementById('genPass');
    const passwordDisplay = document.getElementById('passwordDisplay');
    const strengthIndicator = document.getElementById('strengthIndicator');
    const copyPasswordBtn = document.getElementById('copyPasswordBtn');
    const deterministicCheckbox = document.getElementById('deterministicMode');
    const deterministicInputs = document.getElementById('deterministicInputs');

    // Toggle deterministic inputs visibility
    if (deterministicCheckbox) {
        deterministicCheckbox.addEventListener('change', function() {
            deterministicInputs.style.display = this.checked ? 'block' : 'none';
        });
    }

    // ----- Core generation function (Random) -----
    function generateRandomPassword(length, useUpper, useLower, useNum, useSym) {
        const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
        const numChars = '0123456789';
        const symChars = '!@#$%^&*()_+-=<>?';

        let pool = '';
        let required = [];

        if (useUpper) { pool += upperChars; required.push(upperChars[Math.floor(Math.random() * upperChars.length)]); }
        if (useLower) { pool += lowerChars; required.push(lowerChars[Math.floor(Math.random() * lowerChars.length)]); }
        if (useNum) { pool += numChars; required.push(numChars[Math.floor(Math.random() * numChars.length)]); }
        if (useSym) { pool += symChars; required.push(symChars[Math.floor(Math.random() * symChars.length)]); }

        if (!pool) return null;

        let finalLen = Math.max(length, required.length);
        const remaining = finalLen - required.length;
        for (let i = 0; i < remaining; i++) {
            const randomIndex = Math.floor(Math.random() * pool.length);
            required.push(pool[randomIndex]);
        }

        // Shuffle
        for (let i = required.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [required[i], required[j]] = [required[j], required[i]];
        }

        return required.join('');
    }

    // ----- Core generation function (Deterministic / Hash-based) -----
    async function generateDeterministicPassword(master, service, length, useUpper, useLower, useNum, useSym) {
        if (!master || !service) return null;

        const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
        const numChars = '0123456789';
        const symChars = '!@#$%^&*()_+-=<>?';

        let allowedChars = '';
        if (useUpper) allowedChars += upperChars;
        if (useLower) allowedChars += lowerChars;
        if (useNum) allowedChars += numChars;
        if (useSym) allowedChars += symChars;

        if (!allowedChars) return null;

        const encoder = new TextEncoder();
        let fullPassword = '';
        let counter = 0;

        while (fullPassword.length < length) {
            const data = encoder.encode(`${master}|${service}|${counter}`);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const base64 = btoa(String.fromCharCode(...hashArray));
            
            for (const char of base64) {
                if (allowedChars.includes(char)) {
                    fullPassword += char;
                }
            }
            counter++;
            if (counter > 100) break;
        }

        let password = fullPassword.slice(0, length);

        const sets = [];
        if (useUpper) sets.push(upperChars);
        if (useLower) sets.push(lowerChars);
        if (useNum) sets.push(numChars);
        if (useSym) sets.push(symChars);

        let passwordArr = password.split('');
        for (const set of sets) {
            const hasChar = passwordArr.some(char => set.includes(char));
            if (!hasChar) {
                const randomChar = set[Math.floor(Math.random() * set.length)];
                passwordArr[Math.floor(Math.random() * passwordArr.length)] = randomChar;
            }
        }

        for (let i = passwordArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [passwordArr[i], passwordArr[j]] = [passwordArr[j], passwordArr[i]];
        }

        return passwordArr.join('');
    }

    // ----- Update UI function -----
    function updatePasswordDisplay(password) {
        if (!password) {
            passwordDisplay.textContent = '—';
            strengthIndicator.textContent = 'Strength';
            strengthIndicator.style.background = 'rgba(255,255,255,0.06)';
            strengthIndicator.style.color = 'var(--text)';
            return;
        }

        passwordDisplay.textContent = password;
        passwordDisplay.style.transition = 'none';
        passwordDisplay.style.opacity = '0.3';
        setTimeout(() => {
            passwordDisplay.style.opacity = '1';
        }, 10);

        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNum = /[0-9]/.test(password);
        const hasSym = /[^A-Za-z0-9]/.test(password);
        const types = [hasUpper, hasLower, hasNum, hasSym].filter(Boolean).length;
        const strength = password.length >= 16 && types >= 3 ? 'Strong' :
                         password.length >= 10 && types >= 2 ? 'Medium' : 'Weak';
        const color = strength === 'Strong' ? 'var(--accent)' :
                      strength === 'Medium' ? 'var(--warning)' : 'var(--error)';
        strengthIndicator.textContent = strength;
        strengthIndicator.style.background = `rgba(${strength === 'Strong' ? '34,197,94' : strength === 'Medium' ? '245,158,11' : '239,68,68'}, 0.15)`;
        strengthIndicator.style.color = color;
        
        passwordDisplay.dataset.password = password;
    }

    // ----- Main Generate Button -----
    if (passBtn) {
        passBtn.addEventListener('click', async function() {
            const length = parseInt(document.getElementById('passLen').value) || 16;
            const useUpper = document.getElementById('passUpper').checked;
            const useLower = document.getElementById('passLower').checked;
            const useNum = document.getElementById('passNum').checked;
            const useSym = document.getElementById('passSym').checked;
            const isDeterministic = deterministicCheckbox.checked;

            let password = null;

            if (isDeterministic) {
                const master = document.getElementById('masterKeyword').value;
                const service = document.getElementById('serviceName').value;
                if (!master || !service) {
                    showToast('Please enter both Master Keyword and Service Name', 'fa-exclamation-triangle');
                    return;
                }
                password = await generateDeterministicPassword(master, service, length, useUpper, useLower, useNum, useSym);
            } else {
                password = generateRandomPassword(length, useUpper, useLower, useNum, useSym);
            }

            if (password) {
                updatePasswordDisplay(password);
            } else {
                showToast('Select at least one character type', 'fa-exclamation-triangle');
            }
        });
    }

    // ----- Copy Button -----
    if (copyPasswordBtn) {
        copyPasswordBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const pwd = passwordDisplay.textContent;
            if (!pwd || pwd === '—') {
                showToast('Generate a password first', 'fa-exclamation-triangle');
                return;
            }
            navigator.clipboard?.writeText(pwd).then(() => {
                showToast('Password copied!', 'fa-check');
            }).catch(() => {
                const textarea = document.createElement('textarea');
                textarea.value = pwd;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                showToast('Password copied!', 'fa-check');
            });
        });
    }

    // ----- Auto-generate a default password on page load -----
    if (passwordDisplay && passBtn) {
        setTimeout(() => {
            const length = parseInt(document.getElementById('passLen').value) || 16;
            const useUpper = document.getElementById('passUpper').checked;
            const useLower = document.getElementById('passLower').checked;
            const useNum = document.getElementById('passNum').checked;
            const useSym = document.getElementById('passSym').checked;
            const password = generateRandomPassword(length, useUpper, useLower, useNum, useSym);
            if (password) {
                updatePasswordDisplay(password);
            }
        }, 50);
    }

    // ===== QR CODE =====
    const qrBtn = document.getElementById('genQR');
    if (qrBtn) {
        qrBtn.addEventListener('click', () => {
            const text = document.getElementById('qrText').value || 'https://example.com';
            const canvas = document.createElement('canvas');
            canvas.width = 200; canvas.height = 200;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 200, 200);
            const size = 10;
            for (let i = 0; i < 20; i++) {
                for (let j = 0; j < 20; j++) {
                    const hash = (i * 31 + j * 17 + text.length * 7) % 2;
                    if (hash === 0) { ctx.fillStyle = '#1e293b'; ctx.fillRect(i * size, j * size, size, size); }
                }
            }
            ctx.fillStyle = '#1e293b';
            [[0,0],[0,18],[18,0]].forEach(([x,y]) => {
                ctx.fillRect(x*size, y*size, size*6, size*6);
                ctx.fillStyle = '#fff';
                ctx.fillRect(x*size+size, y*size+size, size*4, size*4);
                ctx.fillStyle = '#1e293b';
                ctx.fillRect(x*size+size*2, y*size+size*2, size*2, size*2);
                ctx.fillStyle = '#1e293b';
            });
            document.getElementById('qrCanvas').innerHTML = '';
            document.getElementById('qrCanvas').appendChild(canvas);
            showToast('QR generated (visual)');
        });
    }

    // ===== RANDOM NUMBER =====
    const randBtn = document.getElementById('genRand');
    if (randBtn) {
        randBtn.addEventListener('click', () => {
            const min = parseInt(document.getElementById('randMin').value) || 0;
            const max = parseInt(document.getElementById('randMax').value) || 100;
            const num = Math.floor(Math.random() * (max - min + 1)) + min;
            document.getElementById('randResult').innerHTML = `<span class="label">Random Number</span><div class="value">${num}</div>`;
        });
    }

    // ===== NOTES (auto-save) =====
    const notesArea = document.getElementById('notesArea');
    if (notesArea) {
        notesArea.addEventListener('input', () => { localStorage.setItem('userNotes', notesArea.value); });
    }

    // ===== STOPWATCH =====
    const swDisplay = document.getElementById('stopwatchDisplay');
    function updateStopwatch() {
        if (!swDisplay) return;
        const hrs = Math.floor(stopwatchTime / 3600);
        const mins = Math.floor((stopwatchTime % 3600) / 60);
        const secs = Math.floor(stopwatchTime % 60);
        swDisplay.textContent = `${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
    }
    const swStart = document.getElementById('swStart');
    if (swStart) {
        swStart.addEventListener('click', () => {
            if (stopwatchRunning) return;
            stopwatchRunning = true;
            stopwatchInterval = setInterval(() => { stopwatchTime++; updateStopwatch(); }, 1000);
        });
    }
    const swStop = document.getElementById('swStop');
    if (swStop) { swStop.addEventListener('click', () => { clearInterval(stopwatchInterval); stopwatchRunning = false; }); }
    const swReset = document.getElementById('swReset');
    if (swReset) {
        swReset.addEventListener('click', () => { clearInterval(stopwatchInterval); stopwatchRunning = false; stopwatchTime = 0; updateStopwatch(); });
    }

    // ===== TIMER =====
    const timerDisplay = document.getElementById('timerDisplay');
    function updateTimerDisplay() {
        if (!timerDisplay) return;
        const mins = Math.floor(timerRemaining / 60);
        const secs = Math.floor(timerRemaining % 60);
        timerDisplay.textContent = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
    }
    const timerStart = document.getElementById('timerStart');
    if (timerStart) {
        timerStart.addEventListener('click', () => {
            if (timerRunning) return;
            if (timerRemaining <= 0) {
                const mins = parseInt(document.getElementById('timerMinutes').value) || 5;
                timerRemaining = mins * 60;
            }
            timerRunning = true;
            timerInterval = setInterval(() => {
                timerRemaining--;
                updateTimerDisplay();
                if (timerRemaining <= 0) {
                    clearInterval(timerInterval);
                    timerRunning = false;
                    showToast('⏰ Timer finished!', 'fa-bell');
                }
            }, 1000);
        });
    }
    const timerStop = document.getElementById('timerStop');
    if (timerStop) { timerStop.addEventListener('click', () => { clearInterval(timerInterval); timerRunning = false; }); }
    const timerReset = document.getElementById('timerReset');
    if (timerReset) {
        timerReset.addEventListener('click', () => {
            clearInterval(timerInterval); timerRunning = false;
            const mins = parseInt(document.getElementById('timerMinutes').value) || 5;
            timerRemaining = mins * 60; updateTimerDisplay();
        });
    }

    // ===== WORLD CLOCK =====
    const clockDisplay = document.getElementById('worldClock');
    const clockDate = document.getElementById('worldDate');
    let clockInterval;
    let currentTz = 'UTC';
    function updateClock(tz = 'UTC') {
        const now = new Date();
        const opts = { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
        const dateOpts = { timeZone: tz, year: 'numeric', month: 'short', day: 'numeric' };
        if (clockDisplay) clockDisplay.textContent = now.toLocaleTimeString('en-US', opts);
        if (clockDate) clockDate.textContent = now.toLocaleDateString('en-US', dateOpts);
    }
    function startClock(tz = 'UTC') {
        currentTz = tz;
        clearInterval(clockInterval);
        updateClock(tz);
        clockInterval = setInterval(() => updateClock(tz), 1000);
    }
    document.querySelectorAll('[data-tz]').forEach(btn => {
        btn.addEventListener('click', function() {
            const tzMap = { 'UTC':'UTC', 'IST':'Asia/Kolkata', 'EST':'America/New_York', 'PST':'America/Los_Angeles', 'JST':'Asia/Tokyo', 'AEDT':'Australia/Sydney' };
            const tz = tzMap[this.dataset.tz] || 'UTC';
            startClock(tz);
            showToast(`Timezone: ${this.dataset.tz}`);
        });
    });
    if (clockDisplay) startClock('UTC');

    // ===== FUN & ENTERTAINMENT =====
    // Zodiac
    const zodiacBtn = document.getElementById('findZodiac');
    if (zodiacBtn) {
        zodiacBtn.addEventListener('click', () => {
            const date = document.getElementById('zodiacDob').value;
            if (!date) { showToast('Select date of birth'); return; }
            const d = new Date(date);
            const month = d.getMonth() + 1;
            const day = d.getDate();
            let sign = 'Aries';
            if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) sign = 'Aries';
            else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) sign = 'Taurus';
            else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) sign = 'Gemini';
            else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) sign = 'Cancer';
            else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) sign = 'Leo';
            else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) sign = 'Virgo';
            else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) sign = 'Libra';
            else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) sign = 'Scorpio';
            else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) sign = 'Sagittarius';
            else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) sign = 'Capricorn';
            else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) sign = 'Aquarius';
            else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) sign = 'Pisces';
            const data = zodiacData[sign];
            document.getElementById('zodiacResult').innerHTML = `<span class="label">Your Zodiac</span><div class="value" style="font-size:20px;">${data.symbol} ${sign}<br/><span style="font-size:14px;opacity:0.7;">${data.element} • ${data.traits}</span></div>`;
        });
    }
    // Lucky Number & Color
    const luckyNumBtn = document.getElementById('genLuckyNum');
    if (luckyNumBtn) {
        luckyNumBtn.addEventListener('click', () => {
            const num = Math.floor(Math.random() * 100) + 1;
            document.getElementById('luckyNumResult').innerHTML = `<span class="label">Your Lucky Number</span><div class="value">${num}</div>`;
        });
    }
    const luckyColorBtn = document.getElementById('genLuckyColor');
    if (luckyColorBtn) {
        luckyColorBtn.addEventListener('click', () => {
            const colors = ['#38bdf8','#22c55e','#f59e0b','#ef4444','#8b5cf6','#ec4899','#14b8a6','#f97316'];
            const c = colors[Math.floor(Math.random() * colors.length)];
            const names = ['Sky Blue','Green','Gold','Red','Purple','Pink','Teal','Orange'];
            const name = names[colors.indexOf(c)];
            document.getElementById('luckyColorResult').innerHTML = `<span class="label">Your Lucky Color</span><div class="value" style="display:flex;align-items:center;gap:12px;"><span style="display:inline-block;width:40px;height:40px;border-radius:50%;background:${c};border:2px solid rgba(255,255,255,0.1);"></span> ${name} (${c})</div>`;
        });
    }
    // Compatibility
    const compatBtn = document.getElementById('checkCompat');
    if (compatBtn) {
        compatBtn.addEventListener('click', () => {
            const z1 = document.getElementById('compatZodiac1').value;
            const z2 = document.getElementById('compatZodiac2').value;
            const seed = (z1.length + z2.length) * 7 + z1.charCodeAt(0) + z2.charCodeAt(0);
            const score = 30 + (seed % 60);
            const emojis = ['💔','💕','💖','💞','💗','💓','❤️','🧡'];
            const emoji = emojis[Math.floor(score / 10) % emojis.length];
            document.getElementById('compatResult').innerHTML = `<span class="label">Compatibility Score</span><div class="value">${score}% ${emoji}</div>`;
        });
    }
    // Personality Quiz
    const quizBtn = document.getElementById('runQuiz');
    if (quizBtn) {
        quizBtn.addEventListener('click', () => {
            const profiles = [
                'The Visionary — You see the big picture and inspire others.',
                'The Nurturer — You care deeply and bring comfort to those around you.',
                'The Adventurer — You seek excitement and new experiences.',
                'The Thinker — You analyze deeply and value knowledge.',
                'The Creator — You express beauty and originality in all you do.'
            ];
            let total = 0;
            for (let i = 1; i <= 5; i++) {
                const sel = document.querySelector(`input[name="quiz-q${i}"]:checked`);
                if (sel) total += parseInt(sel.value) + 1;
            }
            const idx = total % profiles.length;
            document.getElementById('quizResult').innerHTML = `<span class="label">Your Profile</span><div class="value" style="font-size:18px;font-weight:400;">${profiles[idx]}</div>`;
        });
    }
    // Fortune
    const fortuneBtn = document.getElementById('getFortune');
    if (fortuneBtn) {
        fortuneBtn.addEventListener('click', () => {
            const msg = fortunes[Math.floor(Math.random() * fortunes.length)];
            document.getElementById('fortuneResult').innerHTML = `<span class="label">Your Fortune</span><div class="value" style="font-size:18px;font-weight:400;">✨ ${msg}</div>`;
        });
    }
    // Destiny
    const destinyBtn = document.getElementById('rollDestiny');
    if (destinyBtn) {
        destinyBtn.addEventListener('click', () => {
            const attrs = ['Luck','Confidence','Creativity','Productivity','Happiness'];
            const container = document.getElementById('destinyScores');
            if (!container) return;
            container.innerHTML = attrs.map(attr => {
                const score = Math.floor(Math.random() * 41) + 60;
                return `<div style="background:rgba(255,255,255,0.04);padding:8px 12px;border-radius:8px;text-align:center;">
                    <div style="font-size:12px;opacity:0.6;">${attr}</div>
                    <div style="font-size:22px;font-weight:700;color:var(--primary);">${score}%</div>
                </div>`;
            }).join('');
        });
    }

    // ===== DEATH PREDICTION (Entertainment) =====
    const deathBtn = document.getElementById('runDeathPrediction');
    if (deathBtn) {
        deathBtn.addEventListener('click', () => {
            const answers = [];
            for (let i = 0; i < deathQuestions.length; i++) {
                const sel = document.querySelector(`input[name="death-q${i}"]:checked`);
                if (sel) answers.push(parseInt(sel.value));
                else answers.push(-1);
            }
            if (answers.some(a => a === -1)) {
                showToast('Please answer all questions', 'fa-exclamation-triangle');
                return;
            }

            const sum = answers.reduce((a, b) => a + b, 0);
            const seed = sum * 7 + answers.join('').length;
            const readings = [
                '🌅 You are a soul of great depth and warmth. Your life path is one of connection and compassion. You will leave a legacy of kindness that echoes through generations.',
                '🌊 Like the ocean, your spirit is vast and mysterious. You are drawn to exploration and truth. Your journey will be marked by moments of profound insight and transformation.',
                '🌿 You are a healer and a nurturer. Your presence brings comfort to those in need. Your life path weaves through the lives of others, leaving them better than you found them.',
                '🔥 There is a fire within you that cannot be extinguished. You are a leader, a pioneer, a force of nature. Your path is one of courage, passion, and unwavering determination.',
                '🌌 You are a dreamer, a stargazer, a seeker of beauty. Your life path is painted with creativity and wonder. You will find meaning in the small moments and joy in the journey.',
                '🌸 You have a gentle strength and a quiet wisdom. Your path is one of balance and harmony. You will be a bridge between worlds, bringing understanding where there is division.',
                '🌄 You are an adventurer at heart, always seeking the next horizon. Your life path is a grand journey of discovery. You will inspire others to embrace their own wanderlust.',
                '🍃 You are a free spirit, untamed and authentic. Your path is one of liberation and self-expression. You will teach others to live boldly and without regret.'
            ];
            const idx = (seed % readings.length + readings.length) % readings.length;
            const reading = readings[idx];
            const baseAge = 70 + (sum % 30);
            const ageVariation = Math.floor(Math.random() * 20) - 10;
            const age = Math.max(50, baseAge + ageVariation);

            document.getElementById('deathResult').innerHTML = `
                <span class="label">Your Mystical Reading</span>
                <div class="value" style="font-size:18px;font-weight:400;line-height:1.8;">
                    ${reading}
                    <br/><br/>
                    <span style="opacity:0.5;font-size:14px;">✨ In this whimsical reading, your spirit suggests a long and vibrant journey — perhaps around <strong>${age}</strong> years of beautiful experiences.</span>
                    <br/>
                    <span style="font-size:12px;opacity:0.3;display:block;margin-top:8px;">🔮 This is a fictional, entertainment-only reading.</span>
                </div>
            `;
            showToast('🔮 Your mystical reading is ready', 'fa-wand-magic-sparkles');
        });
    }
}

// =============================================================
//  UNIT CONVERTER HELPERS
// =============================================================
function convertUnits(value, from, to) {
    const conversions = {
        'm':1,'km':1000,'cm':0.01,'mm':0.001,'mile':1609.34,'yard':0.9144,'ft':0.3048,'in':0.0254,
        'kg':1,'g':0.001,'mg':0.000001,'lb':0.453592,'oz':0.0283495,
        's':1,'min':60,'h':3600,'day':86400,'week':604800,'month':2629800,'year':31557600,
        'm/s':1,'km/h':0.277778,'mph':0.44704,'knot':0.514444,
        'm²':1,'km²':1e6,'cm²':0.0001,'ft²':0.092903,'acre':4046.86,'ha':10000,
        'L':1,'mL':0.001,'m³':1000,'gal':3.78541,'qt':0.946353,'pt':0.473176,'cup':0.236588,
        'B':1,'KB':1024,'MB':1048576,'GB':1073741824,'TB':1099511627776,'PB':1125899906842624
    };
    // Temperature special
    if (from === '°C' && to === '°F') return (value * 9 / 5 + 32).toFixed(2) + ' °F';
    if (from === '°F' && to === '°C') return ((value - 32) * 5 / 9).toFixed(2) + ' °C';
    if (from === '°C' && to === 'K') return (value + 273.15).toFixed(2) + ' K';
    if (from === 'K' && to === '°C') return (value - 273.15).toFixed(2) + ' °C';
    if (from === '°F' && to === 'K') return ((value - 32) * 5 / 9 + 273.15).toFixed(2) + ' K';
    if (from === 'K' && to === '°F') return ((value - 273.15) * 9 / 5 + 32).toFixed(2) + ' °F';

    const base = conversions[from];
    const target = conversions[to];
    if (base && target) {
        const result = (value * base) / target;
        return `${result.toFixed(6)} ${to}`;
    }
    return 'Conversion not available';
}

// =============================================================
//  HISTORY
// =============================================================
function addHistory(expr, result) {
    history.push({ expr, result, time: new Date().toLocaleTimeString() });
    if (history.length > 50) history.shift();
    localStorage.setItem('calcHistory', JSON.stringify(history));
    updateHistoryBadge();
}
function renderHistory() {
    const container = document.getElementById('basicHistory');
    if (!container) return;
    if (history.length === 0) {
        container.innerHTML = '<div class="text-muted" style="padding:8px 0;">No history yet.</div>';
        return;
    }
    container.innerHTML = history.slice().reverse().map(h =>
        `<div class="history-item"><span class="expr">${h.expr} =</span><span class="result">${h.result}</span></div>`
    ).join('');
}
function updateHistoryBadge() {
    const container = document.getElementById('basicHistory');
    if (container) renderHistory();
}

// =============================================================
//  SEARCH
// =============================================================
const searchInput = document.getElementById('globalSearch');
if (searchInput) {
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        if (!query) return;
        const matched = NAV_ITEMS.find(item =>
            item.label.toLowerCase().includes(query) ||
            item.id.toLowerCase().includes(query)
        );
        if (matched) {
            navigateTo(matched.id);
            showToast(`🔍 Found: ${matched.label}`);
            this.value = '';
        }
    });
}

// =============================================================
//  HISTORY TOGGLE (navigate to basic)
// =============================================================
document.getElementById('historyToggle')?.addEventListener('click', () => {
    navigateTo('basic');
    showToast('📜 History');
});

// =============================================================
//  INIT
// =============================================================
loadTheme();
renderSidebar();
navigateTo('dashboard');
console.log('🚀 Smart Utility Calculator loaded.');
console.log('✨ Death Prediction feature is for entertainment only.');