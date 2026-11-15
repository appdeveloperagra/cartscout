export const contactEmail =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "golfcartsrentals@gmail.com";
export const contactPhone = "+27839435908";
export const contactPhoneDisplay = "+27 83 943 5908";
export const contactPhoneHref = `tel:${contactPhone}`;
export const whatsappHref = `https://wa.me/${contactPhone.slice(1)}`;
