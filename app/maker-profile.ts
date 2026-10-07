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

export const lightListings: Array<{
  id: string;
  image: string;
  alt: string;
  title: string;
  description: string;
}> = [];
