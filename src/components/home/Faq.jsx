import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaSearch, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

// ============================================================
// DATA — easy to update without touching the component
// ============================================================
const faqCategories = [
  {
    id: "general",
    label: "General",
    icon: "🎓",
    faqs: [
      {
        question: "What is Presloaded Academy?",
        answer:
          "Presloaded Academy is a tech and creative education platform that provides hands-on training in in-demand tech skills. We offer structured courses, mentorship, and real-world projects designed to help beginners and intermediates launch or grow their tech careers.",
      },
      {
        question: "Who are the courses designed for?",
        answer:
          "Our courses are designed for absolute beginners, career switchers, and professionals looking to upskill. Whether you have zero tech background or some experience, we have a learning path tailored for you.",
      },
      {
        question: "Do I need any prior experience to enroll?",
        answer:
          "No prior experience is required for most of our beginner courses. Each course page clearly states the prerequisites so you can pick the right starting point.",
      },
      {
        question: "Is Presloaded Academy accredited?",
        answer:
          "We are an industry-recognized training institution. Our certificates are respected by employers and tech companies across Nigeria and beyond. We also partner with leading tech companies for internship and placement opportunities.",
      },
    ],
  },
  {
    id: "courses",
    label: "Courses",
    icon: "📚",
    faqs: [
      {
        question: "What courses do you offer?",
        answer:
          "We offer courses in Web Development (Frontend & Backend), UI/UX Design, Data Analysis, Cybersecurity, Digital Marketing, and more. Visit our Courses page for the full catalog with detailed outlines.",
      },
      {
        question: "Are the courses live or pre-recorded?",
        answer:
          "We offer both formats. Our cohort-based programs are live (with recorded replays), while some self-paced courses are fully pre-recorded so you can learn at your own speed.",
      },
      {
        question: "How long does each course take to complete?",
        answer:
          "Course durations vary. Short courses run 4–6 weeks, while our full professional programs run 3–6 months. Each course page clearly shows the estimated duration and weekly time commitment.",
      },
      {
        question: "Will I get a certificate after completing a course?",
        answer:
          "Yes! You will receive a verifiable digital certificate upon successful completion of any course. Our certificates can be shared on LinkedIn and added to your CV.",
      },
      {
        question: "Can I access course materials after completion?",
        answer:
          "Yes. You get lifetime access to all course materials you have purchased, including any future updates to the curriculum at no extra cost.",
      },
    ],
  },
  {
    id: "payment",
    label: "Payment",
    icon: "💳",
    faqs: [
      {
        question: "How much do the courses cost?",
        answer:
          "Course prices vary depending on the program. We have options ranging from affordable short courses to premium mentorship programs. Visit our Courses page for current pricing. We also run seasonal discounts.",
      },
      {
        question: "Do you offer installment payment plans?",
        answer:
          "Yes! We offer flexible payment plans so the cost of learning does not become a barrier. You can pay in installments and still get full access to your enrolled course. Contact us to set up a plan.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept bank transfers, card payments (Visa, Mastercard), and mobile money. All payments are processed securely through our payment gateway.",
      },
      {
        question: "Is there a refund policy?",
        answer:
          "Yes. We offer a 7-day refund policy for most courses if you are not satisfied. Refund requests must be submitted within 7 days of purchase and before completing more than 20% of the course content.",
      },
      {
        question: "Do you offer scholarships or discounts?",
        answer:
          "Yes! We periodically offer scholarships for exceptional but underprivileged students, and we run group/corporate discounts. Follow us on social media and join our community to stay updated on opportunities.",
      },
    ],
  },
  {
    id: "mentorship",
    label: "Mentorship",
    icon: "🤝",
    faqs: [
      {
        question: "Do you offer 1-on-1 mentorship?",
        answer:
          "Yes! Our premium mentorship program pairs you with an experienced industry professional who guides you through your learning journey, reviews your projects, and helps you navigate your career path.",
      },
      {
        question: "How do I apply for mentorship?",
        answer:
          "You can apply for mentorship through our Mentorship page. After submitting your application, our team will review it and match you with the most suitable mentor based on your goals and chosen track.",
      },
      {
        question: "How often will I meet my mentor?",
        answer:
          "Mentorship sessions are scheduled weekly or bi-weekly depending on your program. Sessions are conducted via video call and you also get access to your mentor via a dedicated chat channel between sessions.",
      },
    ],
  },
  {
    id: "career",
    label: "Career Support",
    icon: "🚀",
    faqs: [
      {
        question: "Do you help with job placement after graduation?",
        answer:
          "Yes! We have a dedicated career support team that helps you with CV reviews, portfolio building, interview preparation, and connecting you with hiring partners. Our job placement rate is over 90% for active graduates.",
      },
      {
        question: "Will I build real projects during the course?",
        answer:
          "Absolutely. Every course includes hands-on projects that simulate real-world work. By the time you graduate, you will have a portfolio of projects you can show to employers.",
      },
      {
        question: "Do you have an alumni community?",
        answer:
          "Yes! All graduates gain access to our private alumni network — a community of professionals across different companies and countries who share job opportunities, collaborate on projects, and support each other.",
      },
    ],
  },
];

// ============================================================
// SUB-COMPONENTS
// ============================================================

// Single FAQ accordion item
const FAQItem = ({ faq, index, isOpen, onToggle }) => {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div
      className={`
        border rounded-2xl overflow-hidden transition-all duration-300
        ${
          isOpen
            ? "border-primary-400/50 bg-white/10 shadow-lg shadow-primary-900/20"
            : "border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20"
        }
      `}
    >
      {/* Question Row */}
      <button
        onClick={() => onToggle(index)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span
          className={`
            font-semibold text-base md:text-lg leading-snug transition-colors duration-200
            ${isOpen ? "text-white" : "text-primary-100 group-hover:text-white"}
          `}
        >
          {faq.question}
        </span>

        {/* Animated chevron */}
        <span
          className={`
            flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300
            ${
              isOpen
                ? "bg-primary-400/30 rotate-180 text-primary-300"
                : "bg-white/10 text-primary-200 group-hover:bg-white/20"
            }
          `}
        >
          <FaChevronDown size={13} />
        </span>
      </button>

      {/* Answer — animated height */}
      <div
        style={{ height: `${height}px` }}
        className="overflow-hidden transition-all duration-400 ease-in-out"
      >
        <div ref={contentRef} className="px-6 pb-6">
          <div className="h-px bg-white/10 mb-4" />
          <p className="text-primary-200 leading-relaxed text-sm md:text-base">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
};

// Category Tab Button
const CategoryTab = ({ category, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold
      whitespace-nowrap transition-all duration-300
      ${
        isActive
          ? "bg-primary-400 text-white shadow-lg shadow-primary-400/30 scale-105"
          : "bg-white/10 text-primary-200 hover:bg-white/20 hover:text-white border border-white/10"
      }
    `}
  >
    <span>{category.icon}</span>
    {category.label}
  </button>
);

// ============================================================
// MAIN FAQ PAGE
// ============================================================
const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState("general");
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const glow1Ref = useRef(null);
  const glow2Ref = useRef(null);

  // Same parallax as your Hero
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      if (glow1Ref.current) {
        glow1Ref.current.style.transform = `translateY(${scrolled * 0.4}px)`;
      }
      if (glow2Ref.current) {
        glow2Ref.current.style.transform = `translateY(-${scrolled * 0.25}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Search logic — search across ALL categories
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const results = [];
    faqCategories.forEach((cat) => {
      cat.faqs.forEach((faq) => {
        if (
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query)
        ) {
          results.push({ ...faq, categoryLabel: cat.label, categoryIcon: cat.icon });
        }
      });
    });
    setSearchResults(results);
    setOpenIndex(null);
  }, [searchQuery]);

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const handleCategoryChange = (id) => {
    setActiveCategory(id);
    setOpenIndex(null);
    setSearchQuery("");
    setIsSearching(false);
  };

  const currentFaqs = isSearching
    ? searchResults
    : faqCategories.find((c) => c.id === activeCategory)?.faqs || [];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden">
      
      {/* Parallax Glows — matches your Hero */}
      <div
        ref={glow1Ref}
        className="absolute top-[-200px] right-[-200px] w-[500px] h-[500px] bg-primary-400/25 blur-[120px] rounded-full pointer-events-none"
      />
      <div
        ref={glow2Ref}
        className="absolute bottom-[-150px] left-[-150px] w-[400px] h-[400px] bg-accent-500/25 blur-[120px] rounded-full pointer-events-none"
      />

      {/* Orbit Particles — matches your Hero */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="orbit-particle" style={{ top: "15%", left: "8%" }} />
        <div className="orbit-particle" style={{ top: "55%", right: "12%" }} />
        <div className="orbit-particle" style={{ bottom: "25%", left: "18%" }} />
      </div>

      <div className="container-custom relative z-10 py-24 md:py-32">

        {/* ======== PAGE HEADER ======== */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm mb-6 border border-white/20">
            💡 Got Questions? We Have Answers
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Frequently Asked
            <span className="block bg-gradient-to-r from-primary-300 to-accent-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h1>

          <p className="text-lg text-primary-100 leading-relaxed">
            Everything you need to know about Presloaded Academy — courses,
            payments, mentorship, and career support.
          </p>
        </div>

        {/* ======== SEARCH BAR ======== */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative group">
            <FaSearch
              className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-300 group-focus-within:text-primary-200 transition-colors"
              size={16}
            />
            <input
              type="text"
              placeholder="Search any question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full bg-white/10 backdrop-blur border border-white/20 
                rounded-2xl pl-12 pr-12 py-4 text-white placeholder-primary-300
                focus:outline-none focus:border-primary-400/60 focus:bg-white/15
                transition-all duration-300 text-sm md:text-base
              "
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-primary-300 hover:text-white transition-colors"
                aria-label="Clear search"
              >
                <FaTimes size={14} />
              </button>
            )}
          </div>

          {/* Search status */}
          {isSearching && (
            <p className="text-sm text-primary-300 mt-3 text-center">
              {searchResults.length > 0
                ? `Found ${searchResults.length} result${searchResults.length !== 1 ? "s" : ""} for "${searchQuery}"`
                : `No results found for "${searchQuery}"`}
            </p>
          )}
        </div>

        {/* ======== CATEGORY TABS ======== */}
        {!isSearching && (
          <div className="flex gap-3 overflow-x-auto pb-2 mb-10 scrollbar-hide justify-center flex-wrap">
            {faqCategories.map((cat) => (
              <CategoryTab
                key={cat.id}
                category={cat}
                isActive={activeCategory === cat.id}
                onClick={() => handleCategoryChange(cat.id)}
              />
            ))}
          </div>
        )}

        {/* ======== FAQ LIST ======== */}
        <div className="max-w-3xl mx-auto">
          {currentFaqs.length > 0 ? (
            <div className="flex flex-col gap-4">
              {/* Category label when searching */}
              {isSearching &&
                currentFaqs.map((faq, index) => (
                  <div key={index}>
                    {/* Show category badge above first item of each category */}
                    {(index === 0 ||
                      faq.categoryLabel !== currentFaqs[index - 1].categoryLabel) && (
                      <div className="flex items-center gap-2 mb-3 mt-4">
                        <span className="text-lg">{faq.categoryIcon}</span>
                        <span className="text-xs font-semibold uppercase tracking-widest text-primary-300">
                          {faq.categoryLabel}
                        </span>
                        <div className="flex-1 h-px bg-white/10" />
                      </div>
                    )}
                    <FAQItem
                      faq={faq}
                      index={index}
                      isOpen={openIndex === index}
                      onToggle={handleToggle}
                    />
                  </div>
                ))}

              {/* Normal category view */}
              {!isSearching &&
                currentFaqs.map((faq, index) => (
                  <FAQItem
                    key={index}
                    faq={faq}
                    index={index}
                    isOpen={openIndex === index}
                    onToggle={handleToggle}
                  />
                ))}
            </div>
          ) : (
            /* Empty state */
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No results found
              </h3>
              <p className="text-primary-300 mb-6">
                We couldn&apos;t find anything matching &quot;{searchQuery}&quot;.
                Try a different keyword.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        {/* ======== FAQ COUNT SUMMARY ======== */}
        {!isSearching && (
          <div className="text-center mt-8">
            <p className="text-primary-300 text-sm">
              Showing{" "}
              <span className="text-white font-semibold">{currentFaqs.length}</span>{" "}
              questions in{" "}
              <span className="text-primary-300 font-semibold">
                {faqCategories.find((c) => c.id === activeCategory)?.label}
              </span>
            </p>
          </div>
        )}

        {/* ======== STILL HAVE QUESTIONS CTA ======== */}
        <div className="mt-20 max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 text-center shadow-2xl">
            <div className="text-5xl mb-4">💬</div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Still have questions?
            </h2>
            <p className="text-primary-200 mb-8 leading-relaxed">
              Can&apos;t find the answer you&apos;re looking for? Our team is
              available to help you with any questions about our courses,
              payments, or enrollment.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/contact"
                className="group flex items-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold shadow-lg hover:scale-105 transition-all duration-300"
              >
                Contact Us
              </Link>
              <a
                href="https://t.me/your-telegram-link"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-4 rounded-xl border border-white/30 hover:bg-white/10 transition-all duration-300 hover:scale-105 font-semibold"
              >
                💬 Join Whatsapp Channel
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;