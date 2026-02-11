// =====================================================
// LANDING PAGE CONTENT - Edit this file to update text
// After editing: git add . && git commit -m "Update copy" && git push
// =====================================================

const LANDING_CONTENT = {
  
  // --- META ---
  meta: {
    title: "Supercharge Your Network - Discover Who Knows What",
    description: "Stop wondering who in your network has the expertise you need. Instantly search your contacts by skills, experience, and knowledge."
  },

  // --- NAVIGATION ---
  nav: {
    logo: "I Wish I Knew Someone Who..",
    ctaButton: "Launch App"
  },

  // --- HERO SECTION ---
  hero: {
    headline: "Find the Expert Hidden in Your Network",
    subheadline: "You already know someone who can help. You just don't know who. Search your contacts by expertise, not just name.",
    primaryCta: "Get Started Free",
    secondaryCta: "See How It Works"
  },

  // --- FEATURES SECTION ---
  features: {
    sectionTitle: "Why You'll Love It",
    items: [
      {
        icon: "Upload",
        title: "Import in Seconds",
        description: "Upload your LinkedIn connections CSV or connect Gmail. Your contacts are analyzed instantly."
      },
      {
        icon: "Sparkles",
        title: "AI-Powered Profiles",
        description: "Each contact gets an auto-generated expertise profile based on their job history and communications."
      },
      {
        icon: "Search",
        title: "Search by Skill",
        description: "Need someone who knows HIPAA compliance? Payment fraud? React performance? Just ask."
      },
      {
        icon: "Zap",
        title: "Instant Answers",
        description: "Stop scrolling through hundreds of contacts. Get ranked results showing who knows what you need."
      }
    ]
  },

  // --- HOW IT WORKS SECTION ---
  howItWorks: {
    sectionTitle: "How It Works",
    steps: [
      {
        number: "1",
        title: "Connect Your Contacts",
        description: "Import a LinkedIn CSV export or connect your Gmail account to pull in your professional network."
      },
      {
        number: "2",
        title: "Let AI Do the Work",
        description: "Our AI analyzes job titles, companies, and email history to build expertise profiles for each contact."
      },
      {
        number: "3",
        title: "Search & Discover",
        description: "Type any skill or topic. Get instant results showing which contacts have relevant experience."
      }
    ]
  },

  // --- BOTTOM CTA SECTION ---
  bottomCta: {
    headline: "Ready to Supercharge Your Network?",
    subheadline: "Find out who you already know that can help.",
    buttonText: "Launch IWIKSW..."
  },

  // --- FOOTER ---
  footer: {
    copyright: "© 2025 I Wish I Knew Somomeone Who. All rights reserved.",
    links: [
      // Add links here if needed, e.g.:
      // { text: "Privacy", url: "/privacy" },
      // { text: "Terms", url: "/terms" }
    ]
  }

};

// =====================================================
// ADDING NEW SECTIONS:
// 
// 1. Add your content object above (inside LANDING_CONTENT)
// 2. In index.html, find the <!-- SECTIONS --> comment
// 3. Add a new <section> that reads from your content
// 
// Example - Adding a testimonials section:
//
// testimonials: {
//   sectionTitle: "What People Say",
//   items: [
//     { quote: "Amazing tool!", author: "Jane D.", role: "VP Sales" },
//     { quote: "Saved me hours.", author: "Mike R.", role: "Recruiter" }
//   ]
// }
//
// Then add the HTML section in index.html to render it.
// =====================================================
