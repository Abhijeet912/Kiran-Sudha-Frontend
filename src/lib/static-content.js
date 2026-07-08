/**
 * Static page content — policies & FAQs.
 * Plain JS so the team can edit copy without touching components.
 * NOTE: review legally before launch; placeholders marked with [ ].
 */

export const SUPPORT_EMAIL = "support@kiransudha.in";

export const POLICIES = {
  returns: {
    title: "Return & Exchange Policy",
    intro:
      "We want every Kiran Sudha piece to feel like it was made for you. If something isn't right, here's how we'll fix it.",
    sections: [
      {
        heading: "The 7-day window",
        body: "You can request a return or exchange within 7 days of delivery, right from the My Orders page. Choose the item, tell us the reason, and pick a refund or a different size.",
      },
      {
        heading: "What can be returned",
        body: "Items must be unworn, unwashed and unaltered, with all tags intact. Pieces marked as final sale, or items with signs of use, can't be accepted — handloom deserves care on both sides.",
      },
      {
        heading: "Exchanges",
        body: "Size didn't fit? Request an exchange and pick your new size (XS–XXL, subject to stock). We'll ship the replacement once the original piece is picked up and checked.",
      },
      {
        heading: "Refunds",
        body: "For prepaid orders, refunds go back to the original payment method within 5–7 business days of the returned item passing quality check. COD refunds are processed to your bank account.",
      },
      {
        heading: "Damaged or wrong items",
        body: `If a piece arrives damaged, defective, or isn't what you ordered, raise a return within 48 hours of delivery and we'll prioritise it. Photos help us fix things faster — write to ${SUPPORT_EMAIL}.`,
      },
    ],
  },
  shipping: {
    title: "Shipping Policy",
    intro:
      "Every order travels from our artisans' hands to your doorstep. Here's how that journey works.",
    sections: [
      {
        heading: "Serviceability",
        body: "Enter your pincode on any product page (or in the navigation bar) to check whether we deliver to your area, the estimated delivery time, and whether Cash on Delivery is available.",
      },
      {
        heading: "Delivery timelines",
        body: "Orders are typically dispatched within 1–2 business days. Delivery estimates are shown per pincode — usually 2–7 days. You'll see the estimated delivery date on your order once it ships.",
      },
      {
        heading: "Shipping charges",
        body: "Delivery charges (if any) are shown transparently in your bill at checkout. Orders above the free-delivery threshold ship free — the cart will tell you.",
      },
      {
        heading: "Tracking",
        body: "Follow your order's journey — Placed, Confirmed, Shipped, Delivered — from the My Orders page. We'll also notify you at each step.",
      },
      {
        heading: "Cash on Delivery",
        body: "COD is available for most serviceable pincodes. Availability is confirmed at checkout for your delivery address.",
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    intro:
      "Your trust matters as much as your custom. This is what we collect, why, and how we protect it.",
    sections: [
      {
        heading: "What we collect",
        body: "Your name, email, phone number, delivery addresses, order history, and the products you view or save — the essentials needed to run your account and deliver your orders.",
      },
      {
        heading: "How we use it",
        body: "To process orders, arrange delivery, handle returns, send order updates, and improve what we show you (like recently-viewed pieces). We don't sell your personal data.",
      },
      {
        heading: "Payments",
        body: "Online payments are processed securely by Razorpay. We never see or store your card, UPI or netbanking credentials — only payment confirmation.",
      },
      {
        heading: "Cookies & storage",
        body: "We use browser storage to keep you signed in, remember your pincode, and hold your cart session. Clearing it simply signs you out.",
      },
      {
        heading: "Your choices",
        body: `You can update your details and addresses anytime from My Profile. To request account deletion or a copy of your data, write to ${SUPPORT_EMAIL}.`,
      },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    intro:
      "The short, honest version of the rules that govern shopping with Kiran Sudha.",
    sections: [
      {
        heading: "Using the site",
        body: "By creating an account or placing an order you confirm the details you provide are accurate and that you're authorised to use the chosen payment method.",
      },
      {
        heading: "Pricing & availability",
        body: "All prices are in Indian Rupees and inclusive of taxes unless stated. Offers, coupons and sale prices are valid for their stated period and may be withdrawn. Rarely, an item may become unavailable after ordering — we'll refund you in full.",
      },
      {
        heading: "Orders & cancellation",
        body: "You can cancel an order any time before it ships, from the My Orders page. Once shipped, the return & exchange policy applies instead.",
      },
      {
        heading: "Intellectual property",
        body: "All content on this site — imagery, text, the Kiran Sudha name and mark — belongs to Kiran Sudha. The legacy art forms belong to India; we honour their origin in every listing.",
      },
      {
        heading: "Governing law",
        body: "These terms are governed by the laws of India. Disputes fall under the jurisdiction of the courts of [city to be confirmed].",
      },
    ],
  },
};

export const FAQS = [
  {
    q: "How do I find fashion from a specific state?",
    a: "Use “Browse by State” in the navigation, or explore art forms — like Chikankari or Bandhani — from the home page. Every product also shows its origin on the product page.",
  },
  {
    q: "Do I need to select a size before adding to cart?",
    a: "Yes — sizes run XS to XXL and each piece lists what's available. The size guide on the product page can help you choose.",
  },
  {
    q: "How do I check delivery to my pincode?",
    a: "Tap the pincode button in the navigation bar or use the Delivery box on any product page. You'll see serviceability, estimated delivery days, and COD availability.",
  },
  {
    q: "What payment methods do you accept?",
    a: "UPI, cards and netbanking via Razorpay, plus Cash on Delivery where available for your pincode.",
  },
  {
    q: "My payment failed — was I charged?",
    a: "No. If a payment doesn't complete, the order stays as Pending Payment and nothing is captured. You can retry from checkout or the order page.",
  },
  {
    q: "Can I cancel my order?",
    a: "Yes — any time before it ships, from My Orders. Prepaid amounts are refunded to the original payment method.",
  },
  {
    q: "How do returns and exchanges work?",
    a: "Within 7 days of delivery, open the order and choose Return / Exchange on the item. Pick a refund or a new size, tell us why, and track the request status right there.",
  },
  {
    q: "Are your products genuinely handcrafted?",
    a: "Yes. We work with artisans practising their state's legacy art forms. The Fashion Vault tells the story behind each craft.",
  },
];
