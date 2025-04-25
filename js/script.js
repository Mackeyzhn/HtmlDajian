// DOM元素加载完成后执行
document.addEventListener("DOMContentLoaded", function () {
  // 移动端菜单切换
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navMenu = document.querySelector(".nav-menu");

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", function () {
      this.classList.toggle("active");
      navMenu.classList.toggle("active");
    });
  }

  // 平滑滚动
  const navLinks = document.querySelectorAll(
    ".nav-menu a, .hero-buttons a, .footer-links a"
  );
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId.startsWith("#") && targetId !== "#") {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          // 关闭移动菜单
          if (mobileMenuBtn && mobileMenuBtn.classList.contains("active")) {
            mobileMenuBtn.classList.remove("active");
            navMenu.classList.remove("active");
          }

          // 平滑滚动到目标位置
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: "smooth",
          });
        }
      }
    });
  });

  // 导航菜单高亮当前区域
  const sections = document.querySelectorAll("section[id]");
  const navItems = document.querySelectorAll(".nav-menu a");

  function highlightNavigation() {
    const scrollY = window.scrollY;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navItems.forEach((item) => {
          item.classList.remove("active");
          if (item.getAttribute("href") === `#${sectionId}`) {
            item.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", highlightNavigation);

  // FAQ手风琴效果
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    question.addEventListener("click", () => {
      // 关闭其他开启的项目
      const currentlyActive = document.querySelector(".faq-item.active");
      if (currentlyActive && currentlyActive !== item) {
        currentlyActive.classList.remove("active");
      }

      // 切换当前项目状态
      item.classList.toggle("active");
    });
  });

  // 导航栏滚动效果
  const header = document.querySelector(".header");
  let lastScrollY = 0;

  function handleHeaderScroll() {
    const scrollY = window.scrollY;

    // 向下滚动且不在顶部时缩小导航
    if (scrollY > lastScrollY && scrollY > 50) {
      header.classList.add("header-compact");
    } else {
      header.classList.remove("header-compact");
    }

    lastScrollY = scrollY;
  }

  window.addEventListener("scroll", handleHeaderScroll);

  // 添加滚动动画效果
  const animateElements = document.querySelectorAll(
    ".hero-content, .hero-image, .query-card, .result-card, .step-card, .testimonial-card"
  );

  const observerOptions = {
    root: null, // 使用视口作为根元素
    rootMargin: "0px",
    threshold: 0.1, // 当10%的目标可见时触发
  };

  const animateOnScroll = new IntersectionObserver(function (
    entries,
    observer
  ) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
        observer.unobserve(entry.target); // 动画只触发一次
      }
    });
  },
  observerOptions);

  animateElements.forEach((element) => {
    element.classList.add("animate-element");
    animateOnScroll.observe(element);
  });
});
