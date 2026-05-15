/** @typedef {{ file: string, path: string, title: string, description: string, keywords: string, ogImage: string, type?: string }} PageMeta */

export const SITE = {
  name: 'Parama Group',
  legalName: 'Parama Industries (Pvt) Ltd',
  url: 'https://parama.lk',
  locale: 'en_LK',
  email: 'info.paramaind@gmail.com',
  phone: '+94718393764',
  phoneDisplay: '+94 71 839 3764',
  whatsapp: '94718393764',
  address: {
    street: 'Panapitiya, Waskaduwa',
    locality: 'Kalutara',
    region: 'Western Province',
    country: 'LK',
    postalCode: '12580',
  },
  geo: { lat: 6.6489, lng: 79.9526 },
  hours: 'Mo-Su 08:00-18:00',
  defaultOgImage: '/images/logo/logo.png',
  keywords:
    'PVC Pipes Sri Lanka, Plastic Recycling Sri Lanka, Green House Sri Lanka, Industrial Machinery Sri Lanka, Weighbridge Sri Lanka',
  /** Replace with your Google Analytics 4 measurement ID */
  gaMeasurementId: 'G-XXXXXXXXXX',
  /** Replace with Google Search Console verification content value */
  googleSiteVerification: 'YOUR_GOOGLE_SITE_VERIFICATION_CODE',
};

/** @type {PageMeta[]} */
export const PAGES = [
  {
    file: 'index.html',
    path: '/',
    title: 'Parama Group Sri Lanka | PVC Pipes, Recycling & Industrial Solutions',
    description:
      'Parama Group Sri Lanka delivers PVC pipes, plastic recycling, greenhouse solutions, industrial machinery, and weighbridge services. Trusted for 20+ years across Sri Lanka.',
    keywords: SITE.keywords,
    ogImage: '/images/machinery/facility/hero.png',
  },
  {
    file: 'about.html',
    path: '/about',
    title: 'About Parama Group | Industrial Leaders in Sri Lanka',
    description:
      'Learn about Parama Group—20+ years of PVC manufacturing, plastic recycling, and sustainable industrial solutions serving businesses across Sri Lanka.',
    keywords: 'about Parama Group, industrial company Sri Lanka, PVC manufacturer Sri Lanka',
    ogImage: '/images/direct.png',
  },
  {
    file: 'contact.html',
    path: '/contact',
    title: 'Contact Parama Group Sri Lanka | Get a Quote',
    description:
      'Contact Parama Group in Kalutara, Sri Lanka. Call, WhatsApp, or email for PVC pipes, recycling, machinery, and weighbridge services. Open Mon–Sun 8 AM–6 PM.',
    keywords: 'contact Parama Sri Lanka, PVC pipes quote, industrial services Kalutara',
    ogImage: '/images/logo/logo.png',
  },
  {
    file: 'machinery.html',
    path: '/machinery',
    title: 'Industrial Machinery Sri Lanka | Parama Group',
    description:
      'Industrial machinery in Sri Lanka: shredders, PVC crushers, pipe extrusion lines, laser printers, and blades. Supply, installation, and support from Parama Group.',
    keywords: 'Industrial Machinery Sri Lanka, PVC machinery, shredder machine, crusher machine',
    ogImage: '/images/machinery/shredder/hero.png',
  },
  {
    file: 'plastic-recycale.html',
    path: '/plastic-recycling',
    title: 'Plastic Recycling Sri Lanka | Parama Group',
    description:
      'Professional plastic recycling services in Sri Lanka. Collection, processing, and sustainable waste solutions for factories and businesses. Contact Parama Group.',
    keywords: 'Plastic Recycling Sri Lanka, plastic waste management, recycling plant Sri Lanka',
    ogImage: '/images/recycled-plastic.jpg',
  },
  {
    file: 'weighbridge.html',
    path: '/weighbridge',
    title: 'Weighbridge Sri Lanka | Parama Group',
    description:
      'Accurate weighbridge services and solutions in Sri Lanka for logistics, agriculture, and industrial operations. Reliable weighing from Parama Group.',
    keywords: 'Weighbridge Sri Lanka, truck weighing, industrial weighing Sri Lanka',
    ogImage: '/images/bridge-yelow.png',
  },
  {
    file: 'product-pvc.html',
    path: '/pvc-pipes',
    title: 'PVC Pipes Sri Lanka | Parama PVC Irrigation Pipes',
    description:
      'Premium PVC pipes in Sri Lanka for irrigation, plumbing, and construction. Durable, ISO-quality irrigation pipes from Parama Group manufacturing.',
    keywords: 'PVC Pipes Sri Lanka, PVC irrigation pipes, plumbing pipes Sri Lanka',
    ogImage: '/images/PVC Pipes.png',
  },
  {
    file: 'product-conduit.html',
    path: '/electrical-conduit',
    title: 'Electrical Conduit Pipes Sri Lanka | Parama Group',
    description:
      'Electrical conduit pipes manufactured in Sri Lanka for safe cable protection in residential and commercial projects. Quality from Parama Group.',
    keywords: 'electrical conduit Sri Lanka, PVC conduit pipes',
    ogImage: '/images/Conduit Pipes.png',
  },
  {
    file: 'product-alkathene.html',
    path: '/alkathene-hose',
    title: 'Alkathene Hose Sri Lanka | Parama Group',
    description:
      'Durable Alkathene hoses for water supply and irrigation in Sri Lanka. Flexible, UV-resistant hoses from Parama manufacturing.',
    keywords: 'Alkathene hose Sri Lanka, water hose manufacturer',
    ogImage: '/images/Alkathene Pipe.png',
  },
  {
    file: 'product-Garden Hose.html',
    path: '/garden-hose',
    title: 'Garden Hose Sri Lanka | Parama Group',
    description:
      'Premium garden hoses and watering accessories in Sri Lanka for homes, nurseries, and commercial landscaping. Parama Group quality.',
    keywords: 'Garden Hose Sri Lanka, watering hose, greenhouse Sri Lanka',
    ogImage: '/images/garden-hose.png',
  },
  {
    file: 'plastic-pallets.html',
    path: '/plastic-pallets',
    title: 'Plastic Pallets Sri Lanka | Parama Group',
    description:
      'Heavy-duty plastic pallets for warehousing and logistics in Sri Lanka. Hygienic, reusable pallets from Parama Group.',
    keywords: 'plastic pallets Sri Lanka, industrial pallets',
    ogImage: '/images/logo/recycale.png',
  },
  {
    file: 'gallery/gallery.html',
    path: '/gallery',
    title: 'Gallery | Parama Group Sri Lanka Events & Operations',
    description:
      'Explore Parama Group corporate events, factory operations, exhibitions, and milestones across Sri Lanka.',
    keywords: 'Parama gallery, corporate events Sri Lanka, industrial photos',
    ogImage: '/images/gallery/event-gallery-001.jpg',
  },
];

export function absoluteUrl(path) {
  if (path.startsWith('http')) return path;
  return `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`;
}

export function pageByFile(file) {
  const page = PAGES.find((p) => p.file === file);
  if (!page) throw new Error(`No SEO config for ${file}`);
  return page;
}
