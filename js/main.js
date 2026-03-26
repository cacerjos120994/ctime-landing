/** CTIME Landing Page - Main JavaScript (Vanilla, no frameworks) */
(function() {
  'use strict';

  // =============================================
  // 1. PRELOADER
  // =============================================
  window.addEventListener('load', function() {
    setTimeout(function() {
      document.body.classList.add('loaded');
      var preloader = document.getElementById('preloader');
      if (preloader) {
        setTimeout(function() {
          preloader.parentNode.removeChild(preloader);
        }, 700);
      }
    }, 100);
  });

  // =============================================
  // 2. CUSTOM CURSOR
  // =============================================
  (function() {
    var dot = document.getElementById('cursorDot');
    var follower = document.getElementById('cursorFollower');
    if (!dot || !follower) return;
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

    var posDot = { x: -100, y: -100 };
    var posFollower = { x: -100, y: -100 };
    var rafId = null;

    document.addEventListener('mousemove', function(e) {
      posDot.x = e.clientX;
      posDot.y = e.clientY;
      if (!rafId) requestAnimationFrame(updateCursor);
    });

    function updateCursor() {
      posFollower.x += (posDot.x - posFollower.x) * 0.12;
      posFollower.y += (posDot.y - posFollower.y) * 0.12;
      dot.style.left = posDot.x + 'px';
      dot.style.top = posDot.y + 'px';
      follower.style.left = posFollower.x + 'px';
      follower.style.top = posFollower.y + 'px';
      rafId = null;
    }

    // Hover effect on interactive elements
    var interactiveSelector = 'a, button, .filter-btn, .card-btn, .hamburger, .nav-link, .dot';
    document.addEventListener('mouseover', function(e) {
      if (e.target.closest(interactiveSelector)) {
        document.body.classList.add('cursor-hover');
      }
    });
    document.addEventListener('mouseout', function(e) {
      if (e.target.closest(interactiveSelector)) {
        document.body.classList.remove('cursor-hover');
      }
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', function() {
      dot.style.opacity = '0';
      follower.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function() {
      dot.style.opacity = '1';
      follower.style.opacity = '0.5';
    });
  })();

  // =============================================
  // 3. NAVBAR SCROLL EFFECT
  // =============================================
  (function() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;
    var ticking = false;

    function updateNavbar() {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      ticking = false;
    }

    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    }, { passive: true });
    updateNavbar();
  })();

  // =============================================
  // 4. HAMBURGER TOGGLE
  // =============================================
  (function() {
    var hamburger = document.getElementById('hamburger');
    var mobileMenu = document.getElementById('mobileMenu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
  })();

  // =============================================
  // 5. MOBILE MENU LINKS
  // =============================================
  (function() {
    var mobileLinks = document.querySelectorAll('.mobile-link');
    var mobileMenu = document.getElementById('mobileMenu');
    var hamburger = document.getElementById('hamburger');
    mobileLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });
  })();

  // =============================================
  // 6. SMOOTH SCROLL
  // =============================================
  (function() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        var targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  })();

  // =============================================
  // 7. INTERSECTION OBSERVER - REVEAL ITEMS
  // =============================================
  (function() {
    var revealElements = document.querySelectorAll('.reveal-item, .reveal-gallery, .reveal-text, .reveal-image, .reveal-stat, .about-text, .about-image, .gallery-item');
    if (!revealElements.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = 0;
          // Apply staggered delay for siblings
          var parent = el.parentElement;
          if (parent) {
            var siblings = Array.from(parent.querySelectorAll('.reveal-item, .reveal-gallery, .reveal-stat'));
            var idx = siblings.indexOf(el);
            if (idx > 0) delay = idx * 100;
          }
          setTimeout(function() {
            el.classList.add('revealed');
          }, delay);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(function(el) {
      observer.observe(el);
    });
  })();

  // =============================================
  // 8. COUNT-UP ANIMATION
  // =============================================
  (function() {
    var statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-count'), 10);
          if (isNaN(target)) target = 0;
          var suffix = el.nextElementSibling && el.nextElementSibling.classList.contains('stat-suffix') ? el.nextElementSibling.textContent : '';
          var duration = 2000;
          var start = null;

          function animate(timestamp) {
            if (!start) start = timestamp;
            var progress = Math.min((timestamp - start) / duration, 1);
            // Ease out cubic
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(eased * target);
            el.textContent = current;
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              el.textContent = target;
            }
          }
          requestAnimationFrame(animate);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(function(el) { observer.observe(el); });
  })();

  // =============================================
  // 9. PRODUCT FILTER
  // =============================================
  (function() {
    var filterBtns = document.querySelectorAll('.filter-btn');
    var productCards = document.querySelectorAll('.product-card');
    var countSpan = document.getElementById('productCount');
    if (!filterBtns.length || !productCards.length) return;

    filterBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var filter = this.getAttribute('data-filter');
        // Update active button
        filterBtns.forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');
        // Filter cards with fade animation
        var visibleCount = 0;
        productCards.forEach(function(card) {
          var brand = card.getAttribute('data-brand');
          var shouldShow = (filter === 'all' || brand === filter);
          if (shouldShow) {
            card.classList.remove('hidden', 'fade-out');
            visibleCount++;
          } else {
            card.classList.add('fade-out');
            setTimeout(function() { card.classList.add('hidden'); }, 300);
          }
        });
        // Update count text
        if (countSpan) {
          var brands = { all: 'relojes', seiko: 'Seiko Mod', citizen: 'Citizen', tissot: 'Tissot' };
          var brandText = brands[filter] || filter;
          countSpan.textContent = 'Mostrando ' + visibleCount + ' ' + brandText;
        }
      });
    });
  })();

  // =============================================
  // 10. TESTIMONIAL CAROUSEL
  // =============================================
  (function() {
    var carousel = document.getElementById('testimonialCarousel');
    var track = document.getElementById('testimonialTrack');
    var dots = document.querySelectorAll('#testimonialDots .dot');
    if (!carousel || !track || !dots.length) return;

    var slides = track.querySelectorAll('.testimonial-slide');
    var currentIndex = 0;
    var autoplayInterval = null;
    var autoplayDelay = 5000;

    function goToSlide(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      slides.forEach(function(slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function(dot, i) {
        dot.classList.toggle('active', i === index);
      });
      currentIndex = index;
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayInterval = setInterval(function() {
        goToSlide(currentIndex + 1);
      }, autoplayDelay);
    }

    function stopAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
    }

    // Dot click handlers
    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        var idx = parseInt(this.getAttribute('data-index'), 10);
        goToSlide(idx);
        startAutoplay();
      });
    });

    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    startAutoplay();
  })();

  // =============================================
  // 11. FEATURED PRODUCT 3D TILT
  // =============================================
  (function() {
    var wrapper = document.getElementById('featuredImageWrapper');
    if (!wrapper) return;

    wrapper.addEventListener('mousemove', function(e) {
      var rect = wrapper.getBoundingClientRect();
      var centerX = rect.left + rect.width / 2;
      var centerY = rect.top + rect.height / 2;
      var percentX = (e.clientX - centerX) / (rect.width / 2);
      var percentY = (e.clientY - centerY) / (rect.height / 2);
      var maxRotate = 8;
      var rotateY = percentX * maxRotate;
      var rotateX = -percentY * maxRotate;
      wrapper.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02, 1.02, 1.02)';
    });

    wrapper.addEventListener('mouseleave', function() {
      wrapper.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  })();

  // =============================================
  // 12. PARALLAX ON HERO IMAGE
  // =============================================
  (function() {
    var heroWrapper = document.getElementById('heroImageWrapper');
    if (!heroWrapper) return;
    var ticking = false;

    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          var scrollY = window.scrollY;
          var opacity = Math.max(0, 1 - scrollY / 600);
          heroWrapper.style.opacity = opacity;
          heroWrapper.style.transform = 'translateY(' + (scrollY * 0.15) + 'px)';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  })();

  // =============================================
  // 13. NAVBAR ACTIVE LINK (scroll spy)
  // =============================================
  (function() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length || !navLinks.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, { threshold: 0.3, rootMargin: '-100px 0px -50% 0px' });

    sections.forEach(function(section) { observer.observe(section); });
  })();

  // =============================================
  // HERO ENTRANCE - Trigger reveal on load
  // =============================================
  (function() {
    var heroItems = document.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-text, .hero-cta');
    function triggerHeroReveal() {
      heroItems.forEach(function(el, i) {
        setTimeout(function() {
          el.classList.add('revealed');
        }, 300 + i * 150);
      });
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', triggerHeroReveal);
    } else {
      setTimeout(triggerHeroReveal, 100);
    }
  })();

})();
