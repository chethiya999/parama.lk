import { cpSync, mkdirSync, rmSync } from "fs";

// Clean and recreate public/
rmSync("public", { recursive: true, force: true });
mkdirSync("public");

const copy = (src, dest) =>
  cpSync(src, dest ?? src, { recursive: true, force: true });

// Root HTML + static files
copy("index.html", "public/index.html");
copy("about.html", "public/about.html");
copy("contact.html", "public/contact.html");
copy("machinery.html", "public/machinery.html");
copy("weighbridge.html", "public/weighbridge.html");
copy("plastic-pallets.html", "public/plastic-pallets.html");
copy("plastic-recycale.html", "public/plastic-recycale.html");
copy("product-alkathene.html", "public/product-alkathene.html");
copy("product-conduit.html", "public/product-conduit.html");
copy("product-pvc.html", "public/product-pvc.html");
copy("product-Garden Hose.html", "public/product-Garden Hose.html");
copy("robots.txt", "public/robots.txt");
copy("sitemap.xml", "public/sitemap.xml");
copy("_headers", "public/_headers");

// Asset directories
copy("css", "public/css");
copy("js", "public/js");
copy("gallery", "public/gallery");
copy("partials", "public/partials");
copy("seo", "public/seo");

console.log("Build complete → public/");
