// Configuração padrão
const defaultConfig = {
    logo_text: 'SUA LOGO AQUI',
    hero_title: 'Estilo, Navalha e Tradição.',
    hero_subtitle: 'O seu melhor visual em um ambiente feito para homens. Agende em segundos.',
    cta_button: 'GARANTIR MEU HORÁRIO',
    services_title: 'Nossos Serviços',
    booking_title: 'Escolha Seu Horário',
    whatsapp_button: 'FALAR COM O BARBEIRO NO WHATSAPP',
    footer_text: 'Tradição e estilo desde 1985. Onde o homem encontra seu melhor visual.'
};

// Estado do calendário
let currentDate = new Date();
let selectedDate = null;
let selectedTime = null;
const monthNames = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthLabel = document.getElementById('month-label');
    if (monthLabel) monthLabel.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const grid = document.getElementById('calendar-grid');
    if (!grid) return;
    grid.innerHTML = '';

    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        grid.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('div');
        cell.className = 'cal-day';
        cell.textContent = day;
        const cellDate = new Date(year, month, day);
        cellDate.setHours(0, 0, 0, 0);

        // Domingos desabilitados (fechado)
        if (cellDate < today || cellDate.getDay() === 0) {
            cell.classList.add('disabled');
        } else {
            cell.addEventListener('click', () => selectDate(cellDate, cell));
        }

        if (cellDate.getTime() === today.getTime()) {
            cell.classList.add('today');
        }

        if (selectedDate && cellDate.getTime() === selectedDate.getTime()) {
            cell.classList.add('selected');
        }

        grid.appendChild(cell);
    }
}

function selectDate(date, el) {
    selectedDate = date;
    document.querySelectorAll('.cal-day').forEach(d => d.classList.remove('selected'));
    el.classList.add('selected');
    const formatted = date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });
    const summaryDate = document.getElementById('summary-date');
    if (summaryDate) summaryDate.textContent = formatted.toUpperCase();
}

const prevMonthBtn = document.getElementById('prev-month');
if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
}

const nextMonthBtn = document.getElementById('next-month');
if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
}

// Intervalos de tempo
document.querySelectorAll('.time-slot').forEach(slot => {
    slot.addEventListener('click', () => {
        document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
        selectedTime = slot.dataset.time;
        const summaryTime = document.getElementById('summary-time');
        if (summaryTime) summaryTime.textContent = selectedTime;
    });
});

// Confirmar reserva
const confirmBtn = document.getElementById('confirm-booking');
if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
        const toast = document.getElementById('booking-toast');
        if (!toast) return;

        if (!selectedDate || !selectedTime) {
            toast.textContent = '⚠ SELECIONE UMA DATA E HORÁRIO';
            toast.style.background = 'rgba(200, 60, 60, 0.15)';
            toast.style.borderColor = '#c83c3c';
            toast.style.color = '#ff8080';
            toast.classList.remove('hidden');
            setTimeout(() => toast.classList.add('hidden'), 3000);
            return;
        }

        toast.textContent = '✓ AGENDAMENTO CONFIRMADO! AGUARDE O CONTATO.';
        toast.style.background = 'rgba(160,82,45,0.2)';
        toast.style.borderColor = 'var(--leather)';
        toast.style.color = 'var(--leather-bright)';
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 4000);
    });
}

// Função de botões do WhatsApp
function buildWhatsAppLink() {
    let msg = 'Olá! Gostaria de agendar um horário na barbearia.';
    if (selectedDate && selectedTime) {
        const d = selectedDate.toLocaleDateString('pt-BR');
        msg = `Olá! Gostaria de confirmar meu agendamento para ${d} às ${selectedTime}.`;
    }
    return `https://wa.me/5569992892060?text=${encodeURIComponent(msg)}`;
}

['whatsapp-btn', 'whatsapp-float'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(buildWhatsAppLink(), '_blank', 'noopener,noreferrer');
        });
    }
});

// Revelação por rolagem
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

(function() {
    const modal = document.getElementById('impulso-modal-container');
    const closeBtn = document.getElementById('impulso-close-x');

    // 1. Função para fechar
    function hideModal() {
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
        }
    }

    // 2. Evento de Clique no Botão de Fechar
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            hideModal();
        });
    }

    // 3. Lógica de Scroll (50%)
    window.addEventListener('scroll', function() {
        if (!sessionStorage.getItem('impulso_popup_done')) {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            let docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            let scrollPercent = (scrollTop / docHeight) * 100;

            if (scrollPercent >= 50) {
                if (modal) {
                    modal.classList.add('active');
                    sessionStorage.setItem('impulso_popup_done', 'true');
                }
            }
        }
    });
})();

// Inicialização
renderCalendar();
lucide.createIcons();

// Função do SDK de elementos
function updateContent(config) {
    const navLogo = document.getElementById('nav-logo');
    if (navLogo) navLogo.textContent = config.logo_text || defaultConfig.logo_text;
    
    const footerLogo = document.getElementById('footer-logo');
    if (footerLogo) footerLogo.textContent = config.logo_text || defaultConfig.logo_text;

    const title = config.hero_title || defaultConfig.hero_title;
    // Dividir título para estilização
    const parts = title.split(/\s+e\s+/i);
    const heroTitleEl = document.getElementById('hero-title');
    if (heroTitleEl) {
        if (parts.length === 2) {
            heroTitleEl.innerHTML = `${parts[0].toUpperCase()}<br><span style="color: var(--leather-bright);">E ${parts[1].toUpperCase()}</span>`;
        } else {
            heroTitleEl.textContent = title.toUpperCase();
        }
    }

    const heroSubtitleEl = document.getElementById('hero-subtitle');
    if (heroSubtitleEl) heroSubtitleEl.textContent = config.hero_subtitle || defaultConfig.hero_subtitle;
    
    const ctaTextEl = document.getElementById('cta-text');
    if (ctaTextEl) ctaTextEl.textContent = config.cta_button || defaultConfig.cta_button;

    const servTitle = config.services_title || defaultConfig.services_title;
    const servParts = servTitle.split(' ');
    const servicesTitleEl = document.getElementById('services-title');
    if (servicesTitleEl) {
        if (servParts.length >= 2) {
            const last = servParts.pop();
            servicesTitleEl.innerHTML = `${servParts.join(' ').toUpperCase()} <span style="color: var(--leather-bright);">${last.toUpperCase()}</span>`;
        } else {
            servicesTitleEl.textContent = servTitle.toUpperCase();
        }
    }

    const bookTitle = config.booking_title || defaultConfig.booking_title;
    const bookParts = bookTitle.split(' ');
    const bookingTitleEl = document.getElementById('booking-title');
    if (bookingTitleEl) {
        if (bookParts.length >= 2) {
            const first = bookParts.shift();
            bookingTitleEl.innerHTML = `${first.toUpperCase()} <span style="color: var(--leather-bright);">${bookParts.join(' ').toUpperCase()}</span>`;
        } else {
            bookingTitleEl.textContent = bookTitle.toUpperCase();
        }
    }

    const whatsTextEl = document.getElementById('whatsapp-text');
    if (whatsTextEl) whatsTextEl.textContent = config.whatsapp_button || defaultConfig.whatsapp_button;
    
    const footerTextEl = document.getElementById('footer-text');
    if (footerTextEl) footerTextEl.textContent = config.footer_text || defaultConfig.footer_text;
}

if (window.elementSdk) {
    window.elementSdk.init({
        defaultConfig: defaultConfig,
        onConfigChange: async (config) => {
            updateContent(config);
        },
        mapToCapabilities: () => ({
            recolorables: [],
            borderables: [],
            fontEditable: undefined,
            fontSizeable: undefined
        }),
        mapToEditPanelValues: (config) => new Map([
            ['logo_text', config.logo_text || defaultConfig.logo_text],
            ['hero_title', config.hero_title || defaultConfig.hero_title],
            ['hero_subtitle', config.hero_subtitle || defaultConfig.hero_subtitle],
            ['cta_button', config.cta_button || defaultConfig.cta_button],
            ['services_title', config.services_title || defaultConfig.services_title],
            ['booking_title', config.booking_title || defaultConfig.booking_title],
            ['whatsapp_button', config.whatsapp_button || defaultConfig.whatsapp_button],
            ['footer_text', config.footer_text || defaultConfig.footer_text]
        ])
    });
}



// Cloudflare Challenge helper
(function() {
    function c() {
        var b = a.contentDocument || a.contentWindow.document;
        if (b) {
            var d = b.createElement('script');
            d.innerHTML = "window.__CF$cv$params={r:'9f374606d7a5e2b5',t:'MTc3NzM5MTk2MC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
            b.getElementsByTagName('head')[0].appendChild(d)
        }
    }
    if (document.body) {
        var a = document.createElement('iframe');
        a.height = 1;
        a.width = 1;
        a.style.position = 'absolute';
        a.style.top = 0;
        a.style.left = 0;
        a.style.border = 'none';
        a.style.visibility = 'hidden';
        document.body.appendChild(a);
        if ('loading' !== document.readyState) c();
        else if (window.addEventListener) document.addEventListener('DOMContentLoaded', c);
        else {
            var e = document.onreadystatechange || function() {};
            document.onreadystatechange = function(b) {
                e(b);
                'loading' !== document.readyState && (document.onreadystatechange = e, c())
            }
        }
    }

    
})();