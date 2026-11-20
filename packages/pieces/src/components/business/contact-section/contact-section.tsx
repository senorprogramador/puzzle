import { ContactDetails, Heading, Text } from "@puzzle-ui/ui";
import type { ElementType } from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../../marketing/shared";
import { validateContentIds } from "../../content/shared";
import type { BusinessContactItem } from "../shared.types";
import type {
  ContactSectionProps,
  ContactSectionVariant,
} from "./contact-section.types";

import "../shared.css";
import "./contact-section.css";

const ContactSection = <C extends ElementType = "section">({
  variant = "split",
  address,
  phone,
  email,
  openingHours,
  details = [],
  departments = [],
  formSlot,
  mapSlot,
  mapLabel = "Map",
  successSlot,
  children,
  className,
  ...sectionProps
}: ContactSectionProps<C>) => {
  const contactItems: BusinessContactItem[] = [
    ...(address ? [{ id: "address", label: "Address", value: address }] : []),
    ...(phone
      ? [{ id: "phone", label: "Phone", value: phone, href: `tel:${phone}` }]
      : []),
    ...(email
      ? [{ id: "email", label: "Email", value: email, href: `mailto:${email}` }]
      : []),
    ...(openingHours
      ? [{ id: "hours", label: "Opening hours", value: openingHours }]
      : []),
    ...details,
  ];

  validateContentIds(contactItems, "Contact detail");
  validateContentIds(departments, "Contact department");
  for (const department of departments) {
    validateContentIds(department.contacts, "Department contact");
  }

  const nativeProps = sectionProps as MarketingSectionBaseProps<C>;

  return (
    <MarketingSection<C>
      {...nativeProps}
      className={`puzzle-contact-section ${className ?? ""}`.trim()}
      family="contact"
      variant={variant satisfies ContactSectionVariant}
    >
      <div className="puzzle-contact-section__content">
        <ContactDetails
          items={contactItems}
          className="puzzle-contact-section__details"
        />

        {departments.length ? (
          <div className="puzzle-contact-section__departments">
            {departments.map((department) => (
              <section
                className="puzzle-contact-section__department"
                key={department.id}
              >
                <Heading level="headline3" as="h3">{department.name}</Heading>
                {department.contacts.map((contact) => {
                  const personDetails: BusinessContactItem[] = [
                    ...(contact.email
                      ? [
                          {
                            id: `${contact.id}-email`,
                            label: "Email",
                            value: contact.email,
                            href: `mailto:${contact.email}`,
                          },
                        ]
                      : []),
                    ...(contact.phone
                      ? [
                          {
                            id: `${contact.id}-phone`,
                            label: "Phone",
                            value: contact.phone,
                            href: `tel:${contact.phone}`,
                          },
                        ]
                      : []),
                  ];

                  return (
                    <article
                      className="puzzle-contact-section__person"
                      key={contact.id}
                    >
                      <Heading level="headline4" as="h4">{contact.name}</Heading>
                      {contact.role ? <Text as="p">{contact.role}</Text> : null}
                      <ContactDetails items={personDetails} />
                    </article>
                  );
                })}
              </section>
            ))}
          </div>
        ) : null}

        {mapSlot ? (
          <div
            className="puzzle-contact-section__map"
            role="region"
            aria-label={mapLabel}
          >
            {mapSlot}
          </div>
        ) : null}

        {formSlot ? (
          <div className="puzzle-contact-section__form">{formSlot}</div>
        ) : null}

        {successSlot ? (
          <div className="puzzle-contact-section__success" aria-live="polite">
            {successSlot}
          </div>
        ) : null}
      </div>
      {children}
    </MarketingSection>
  );
};

export { ContactSection };
