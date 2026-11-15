
console.log("BENSAOULA JS WORKING");

// حركة الدائرة التفاعلية
const orb = document.querySelector(".orb");

document.addEventListener("pointermove", (event) => {
  if (!orb) return;

  const x = (event.clientX / window.innerWidth - 0.5) * 30;
  const y = (event.clientY / window.innerHeight - 0.5) * 30;

  orb.style.transform = `translate(${x}px, ${y}px)`;
});

// ظهور الأقسام عند التمرير
const sections = document.querySelectorAll("section");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  sections.forEach((section) => {
    section.classList.add("reveal");
    observer.observe(section);
  });
} else {
  sections.forEach(section => section.classList.add("visible"));
}

// القائمة المتنقلة
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active");
    menuToggle.classList.toggle("active");

    const isOpen = nav.classList.contains("active");
    menuToggle.setAttribute("aria-expanded", isOpen);
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
      menuToggle.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ===============================
// ARABIC / FRENCH LANGUAGE SYSTEM
// ===============================

document.addEventListener("DOMContentLoaded", () => {

  const button = document.querySelector(".language-toggle");

  if (!button) return;

  const translations = {

    ar: {
      nav: ["الرئيسية", "من أنا", "خدماتي", "أعمالي", "تواصل معي"],
      welcome: "مرحباً بك في عالمي الإبداعي",
      heroTitle: "مصمم إبداعي وفنان ثلاثي الأبعاد",
      description: "أحوّل الأفكار إلى تصاميم بصرية استثنائية، وأصنع هويات إبداعية تترك أثراً.",
      discover: "اكتشف أعمالي <span>←</span>",
      story: "اكتشف قصتي",
      aboutTitle: "من أنا<span>؟</span>",
      aboutText: "أنا محمد بن سولة، شغوف بعالم التصميم والإبداع البصري. أعمل على تحويل الأفكار إلى أعمال فنية تجمع بين الجمال والابتكار والاحترافية.",
      stats: ["الفن ثلاثي الأبعاد", "هوية إبداعية", "أفكار بلا حدود"],
      servicesTitle: "ماذا أقدم<span>؟</span>",
      servicesDescription: "حلول إبداعية تساعدك على إبراز مشروعك.",
      serviceTitles: ["التصميم الغرافيكي", "الإعلانات الاحترافية", "الفن ثلاثي الأبعاد"],
      serviceTexts: [
        "تصاميم عصرية تجمع بين الإبداع والوضوح.",
        "منشورات إعلانية تلفت الانتباه وتبرز منتجاتك.",
        "أعمال بصرية بتفاصيل ولمسات فنية مميزة."
      ],
      order: "اطلب الخدمة ←",
      worksTitle: "أعمالي الإبداعية<span>.</span>",
      worksDescription: "مساحة لعرض أفكاري ومشاريعي الفنية.",
      contactTitle: "لنعمل معاً<span>.</span>",
      contactText: "لديك فكرة أو مشروع إبداعي؟ دعنا نحول فكرتك إلى واقع.",
      contactButton: "تواصل معي عبر واتساب <span>←</span>",
      footer: "© 2026 BENSAOULA MOHAMED. جميع الحقوق محفوظة.",
      floating: "واتساب",
      menu: "فتح القائمة",
      meta: "BENSAOULA MOHAMED - مصمم إبداعي وفنان ثلاثي الأبعاد",
      whatsapp: [
        "مرحباً، أريد طلب خدمة التصميم الغرافيكي",
        "مرحباً، أريد طلب تصميم إعلان احترافي",
        "مرحباً، أريد طلب تصميم ثلاثي الأبعاد",
        "مرحباً، أريد الاستفسار عن خدمات التصميم وإنجاز مشروع إبداعي",
        "مرحباً، أريد الاستفسار عن خدمات التصميم"
      ]
    },

    fr: {
      nav: ["Accueil", "À propos", "Services", "Portfolio", "Contact"],
      welcome: "Bienvenue dans mon univers créatif",
      heroTitle: "Designer créatif et artiste 3D",
      description: "Je transforme les idées en créations visuelles exceptionnelles et je crée des identités créatives qui marquent les esprits.",
      discover: "Découvrir mes projets <span>→</span>",
      story: "Découvrir mon histoire",
      aboutTitle: "Qui suis-je<span> ?</span>",
      aboutText: "Je suis Mohamed Bensaoula, passionné par le design et la création visuelle. Je transforme les idées en œuvres artistiques alliant beauté, innovation et professionnalisme.",
      stats: ["Art tridimensionnel", "Identité créative", "Des idées sans limites"],
      servicesTitle: "Mes services<span> ?</span>",
      servicesDescription: "Des solutions créatives pour valoriser votre projet.",
      serviceTitles: ["Design graphique", "Publicité professionnelle", "Art tridimensionnel"],
      serviceTexts: [
        "Des designs modernes alliant créativité et clarté.",
        "Des publications publicitaires qui attirent l'attention et valorisent vos produits.",
        "Des créations visuelles aux détails et finitions artistiques remarquables."
      ],
      order: "Commander le service →",
      worksTitle: "Mes créations<span>.</span>",
      worksDescription: "Un espace dédié à mes idées et projets artistiques.",
      contactTitle: "Travaillons ensemble<span>.</span>",
      contactText: "Vous avez une idée ou un projet créatif ? Transformons votre idée en réalité.",
      contactButton: "Me contacter sur WhatsApp <span>→</span>",
      footer: "© 2026 BENSAOULA MOHAMED. Tous droits réservés.",
      floating: "WhatsApp",
      menu: "Ouvrir le menu",
      meta: "BENSAOULA MOHAMED - Designer créatif et artiste 3D",
      whatsapp: [
        "Bonjour, je souhaite commander un service de design graphique",
        "Bonjour, je souhaite commander une publicité professionnelle",
        "Bonjour, je souhaite commander un design 3D",
        "Bonjour, je souhaite me renseigner sur vos services de design et réaliser un projet créatif",
        "Bonjour, je souhaite me renseigner sur vos services de design"
      ]
    }
  };

  function setLanguage(lang) {

    const t = translations[lang];

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.body.dir = lang === "ar" ? "rtl" : "ltr";

    button.textContent = lang === "ar" ? "FR" : "AR";
    const navLinks = document.querySelectorAll(".nav > a");
    navLinks.forEach((link, i) => {
      if (t.nav[i]) link.textContent = t.nav[i];
    });

    document.querySelector(".menu-toggle")
      ?.setAttribute("aria-label", t.menu);

    const welcome = document.querySelector(".welcome");
    if (welcome) {
      welcome.innerHTML =
        '<span class="status-dot"></span>' + t.welcome;
    }

    document.querySelector(".hero-content h2").textContent = t.heroTitle;
    document.querySelector(".description").textContent = t.description;

    document.querySelector(".hero-buttons .primary").innerHTML = t.discover;
    document.querySelector(".hero-buttons .secondary").textContent = t.story;

    document.querySelector(".about h2").innerHTML = t.aboutTitle;
    document.querySelector(".about > p").textContent = t.aboutText;

    document.querySelectorAll(".about-stats div span")
      .forEach((el, i) => el.textContent = t.stats[i]);

    document.querySelector(".services h2").innerHTML = t.servicesTitle;
    document.querySelector(".services .section-description").textContent =
      t.servicesDescription;

    document.querySelectorAll(".service-card h3")
      .forEach((el, i) => el.textContent = t.serviceTitles[i]);

    document.querySelectorAll(".service-card p")
      .forEach((el, i) => el.textContent = t.serviceTexts[i]);

    document.querySelectorAll(".service-order")
      .forEach(el => el.textContent = t.order);

    document.querySelector(".works h2").innerHTML = t.worksTitle;
    document.querySelector(".works .section-description").textContent =
      t.worksDescription;

    document.querySelector(".contact h2").innerHTML = t.contactTitle;
    document.querySelector(".contact p").textContent = t.contactText;
    document.querySelector(".contact .button").innerHTML = t.contactButton;

    document.querySelector("footer p").textContent = t.footer;

    const floating = document.querySelector(".floating-whatsapp span:last-child");
    if (floating) floating.textContent = t.floating;

    document.querySelector(".scroll-indicator").innerHTML =
      "<span></span>" + (lang === "ar" ? "مرر لاستكشاف الموقع" : "SCROLL TO EXPLORE");

    document.querySelector('meta[name="description"]')
      .setAttribute("content", t.meta);

    document.title = "BENSAOULA MOHAMED | Creative Studio";

    const whatsappLinks = [
      ...document.querySelectorAll(".service-order"),
      document.querySelector(".contact .button"),
      document.querySelector(".floating-whatsapp")
    ];

    whatsappLinks.forEach((link, i) => {
      if (!link) return;
      link.href = "https://wa.me/213674391765?text=" +
        encodeURIComponent(t.whatsapp[i]);
    });

    localStorage.setItem("bensaoula-language", lang);
  }

  button.addEventListener("click", () => {
    const current = document.documentElement.lang;
    setLanguage(current === "ar" ? "fr" : "ar");
  });

  const savedLanguage =
    localStorage.getItem("bensaoula-language") || "ar";

  setLanguage(savedLanguage);

});
