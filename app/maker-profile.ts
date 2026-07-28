/*
 * PERSONALIZE THIS FILE FIRST
 *
 * Every deployed No Dark Nights website belongs to its maker. Change the
 * profile and light listings below without editing the Lights page components.
 *
 * Learner copies publish no contact method by default. An adult site manager
 * may set MAKER_CONTACT_HREF and MAKER_CONTACT_LABEL in the hosting
 * environment later. Never ask a learner for a full name, personal email,
 * phone number, address, school, social account, contact link, or a parent's
 * email.
 */

export const makerProfile = {
  studioName: "No Dark Nights",
  makerName: "The No Dark Nights maker",
  introduction:
    "I make custom lithophane night lights from meaningful photographs and illustrations. Many are made as gifts simply to put a smile on someone’s face.",
  contactHref: "",
  contactLabel: "Contact the maker",
};

export function getMakerProfile() {
  return {
    ...makerProfile,
    contactHref: process.env.MAKER_CONTACT_HREF?.trim() ?? "",
    contactLabel:
      process.env.MAKER_CONTACT_LABEL?.trim() || makerProfile.contactLabel,
  };
}

export function isValidContactHref(contactHref: string) {
  const href = contactHref.trim();

  if (/^mailto:[^@\s]+@[^@\s]+\.[^@\s]+(?:\?.*)?$/i.test(href)) {
    return true;
  }

  try {
    const url = new URL(href);
    return url.protocol === "https:" && Boolean(url.hostname);
  } catch {
    return false;
  }
}

export function getMailtoAddress(contactHref: string) {
  if (!contactHref.toLowerCase().startsWith("mailto:")) {
    return null;
  }

  const address = contactHref.slice("mailto:".length).split("?")[0]?.trim();
  return address || null;
}

export const lightListings = [
  {
    id: "favorite-photo",
    image: "/gallery/our-moment.jpg",
    alt: "Example glowing lithophane night light made from a photograph",
    title: "A favorite photograph",
    description:
      "A custom light shaped around one meaningful portrait or family moment.",
  },
  {
    id: "pet-portrait",
    image: "/gallery/amber-light.jpg",
    alt: "Example amber lithophane night light showing a puppy",
    title: "A pet portrait",
    description: "Turn a clear pet photograph into a softly glowing keepsake.",
  },
  {
    id: "illustrated-light",
    image: "/gallery/owl-light.jpg",
    alt: "Example glowing lithophane night light showing an owl illustration",
    title: "An illustration",
    description:
      "Artwork with a strong subject and good contrast can become a playful light.",
  },
];
