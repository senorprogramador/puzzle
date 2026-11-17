/*
 * This file is generated. Do not edit manually.
 * Schema.org version: 30.1
 * Source SHA-256: 0a4b8c4c910fc831ec8695196510973390906a5ee34dc6b862dfec4d21a12f74
 */

import type { SchemaDefinition } from "../../types";

export const generatedSchemaDefinitions5: readonly SchemaDefinition[] =
[
  {
    "name": "Person",
    "type": "https://schema.org/Person",
    "source": "generated",
    "description": "A person (alive, dead, undead, or fictional).",
    "parentTypes": [
      "https://schema.org/Thing"
    ],
    "properties": [
      {
        "name": "additionalName",
        "type": "https://schema.org/Text",
        "description": "An additional name for a Person, can be used for a middle name.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Person"
        ]
      },
      {
        "name": "address",
        "type": [
          "https://schema.org/PostalAddress",
          "https://schema.org/Text"
        ],
        "description": "Physical address of the item.",
        "expectedTypes": [
          "https://schema.org/PostalAddress",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/PostalAddress",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/GeoCoordinates",
          "https://schema.org/GeoShape",
          "https://schema.org/Organization",
          "https://schema.org/Person",
          "https://schema.org/Place"
        ]
      },
      {
        "name": "affiliation",
        "type": "https://schema.org/Organization",
        "description": "An organization that this person is affiliated with. For example, a school/university, a club, or a team.",
        "expectedTypes": [
          "https://schema.org/Organization"
        ],
        "rangeTypes": [
          "https://schema.org/Organization"
        ],
        "domainTypes": [
          "https://schema.org/Person"
        ]
      },
      {
        "name": "agentInteractionStatistic",
        "type": "https://schema.org/InteractionCounter",
        "description": "The number of completed interactions for this entity, in a particular role (the 'agent'), in a particular action (indicated in the statistic), and in a particular context (i.e. interactionService).",
        "expectedTypes": [
          "https://schema.org/InteractionCounter"
        ],
        "rangeTypes": [
          "https://schema.org/InteractionCounter"
        ],
        "domainTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ]
      },
      {
        "name": "alumniOf",
        "type": [
          "https://schema.org/EducationalOrganization",
          "https://schema.org/Organization"
        ],
        "description": "An organization that the person is an alumni of.",
        "expectedTypes": [
          "https://schema.org/EducationalOrganization",
          "https://schema.org/Organization"
        ],
        "rangeTypes": [
          "https://schema.org/EducationalOrganization",
          "https://schema.org/Organization"
        ],
        "domainTypes": [
          "https://schema.org/Person"
        ],
        "inverseOf": "https://schema.org/alumni"
      },
      {
        "name": "award",
        "type": "https://schema.org/Text",
        "description": "An award won by or for this item.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Organization",
          "https://schema.org/Person",
          "https://schema.org/Product",
          "https://schema.org/Service"
        ]
      },
      {
        "name": "awards",
        "type": "https://schema.org/Text",
        "description": "Awards won by or for this item.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Organization",
          "https://schema.org/Person",
          "https://schema.org/Product"
        ],
        "supersededBy": "https://schema.org/award"
      },
      {
        "name": "birthDate",
        "type": "https://schema.org/Date",
        "description": "Date of birth.",
        "expectedTypes": [
          "https://schema.org/Date"
        ],
        "rangeTypes": [
          "https://schema.org/Date"
        ],
        "domainTypes": [
          "https://schema.org/Person"
        ]
      },
      {
        "name": "birthPlace",
        "type": "https://schema.org/Place",
        "description": "The place where the person was born.",
        "expectedTypes": [
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/Person"
        ]
      },
      {
        "name": "brand",
        "type": [
          "https://schema.org/Brand",
          "https://schema.org/Organization"
        ],
        "description": "The brand(s) associated with a product or service, or the brand(s) maintained by an organization or business person.",
        "expectedTypes": [
          "https://schema.org/Brand",
          "https://schema.org/Organization"
        ],
        "rangeTypes": [
          "https://schema.org/Brand",
          "https://schema.org/Organization"
        ],
        "domainTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person",
          "https://schema.org/Product",
          "https://schema.org/Service"
        ]
      },
      {
        "name": "callSign",
        "type": "https://schema.org/Text",
        "description": "A [callsign](https://en.wikipedia.org/wiki/Call_sign), as used in broadcasting and radio communications to identify people, radio and TV stations, or vehicles.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/BroadcastService",
          "https://schema.org/Person",
          "https://schema.org/Vehicle"
        ]
      },
      {
        "name": "children",
        "type": "https://schema.org/Person",
        "description": "A child of the person.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Person"
        ]
      },
      {
        "name": "colleague",
        "type": [
          "https://schema.org/Person",
          "https://schema.org/URL"
        ],
        "description": "A colleague of the person.",
        "expectedTypes": [
          "https://schema.org/Person",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Person",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Person"
        ]
      },
      {
        "name": "colleagues",
        "type": "https://schema.org/Person",
        "description": "A colleague of the person.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Person"
        ],
        "supersededBy": "https://schema.org/colleague"
      },
      {
        "name": "contactPoint",
        "type": "https://schema.org/ContactPoint",
        "description": "A contact point for a person or organization.",
        "expectedTypes": [
          "https://schema.org/ContactPoint"
        ],
        "rangeTypes": [
          "https://schema.org/ContactPoint"
        ],
        "domainTypes": [
          "https://schema.org/HealthInsurancePlan",
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ]
      },
      {
        "name": "contactPoints",
        "type": "https://schema.org/ContactPoint",
        "description": "A contact point for a person or organization.",
        "expectedTypes": [
          "https://schema.org/ContactPoint"
        ],
        "rangeTypes": [
          "https://schema.org/ContactPoint"
        ],
        "domainTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "supersededBy": "https://schema.org/contactPoint"
      },
      {
        "name": "deathDate",
        "type": "https://schema.org/Date",
        "description": "Date of death.",
        "expectedTypes": [
          "https://schema.org/Date"
        ],
        "rangeTypes": [
          "https://schema.org/Date"
        ],
        "domainTypes": [
          "https://schema.org/Person"
        ]
      },
      {
        "name": "deathPlace",
        "type": "https://schema.org/Place",
        "description": "The place where the person died.",
        "expectedTypes": [
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/Person"
        ]
      },
      {
        "name": "duns",
        "type": "https://schema.org/Text",
        "description": "The Dun & Bradstreet DUNS number for identifying an organization or business person.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ]
      },
      {
        "name": "email",
        "type": "https://schema.org/Text",
        "description": "Email address.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/ContactPoint",
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ]
      },
      {
        "name": "familyName",
        "type": "https://schema.org/Text",
        "description": "Family name. In the U.S., the last name of a Person.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Person"
        ]
      },
      {
        "name": "faxNumber",
        "type": "https://schema.org/Text",
        "description": "The fax number.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/ContactPoint",
          "https://schema.org/Organization",
          "https://schema.org/Person",
          "https://schema.org/Place"
        ]
      },
      {
        "name": "follows",
        "type": "https://schema.org/Person",
        "description": "The most generic uni-directional social relation.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Person"
        ]
      },
      {
        "name": "funder",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "A person or organization that supports (sponsors) something through some kind of financial contribution.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Event",
          "https://schema.org/Grant",
          "https://schema.org/MonetaryGrant",
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ]
      },
      {
        "name": "funding",
        "type": "https://schema.org/Grant",
        "description": "A [[Grant]] that directly or indirectly provide funding or sponsorship for this item. See also [[ownershipFundingInfo]].",
        "expectedTypes": [
          "https://schema.org/Grant"
        ],
        "rangeTypes": [
          "https://schema.org/Grant"
        ],
        "domainTypes": [
          "https://schema.org/BioChemEntity",
          "https://schema.org/CreativeWork",
          "https://schema.org/Event",
          "https://schema.org/MedicalEntity",
          "https://schema.org/Organization",
          "https://schema.org/Person",
          "https://schema.org/Product"
        ],
        "inverseOf": "https://schema.org/fundedItem"
      },
      {
        "name": "gender",
        "type": [
          "https://schema.org/GenderType",
          "https://schema.org/Text"
        ],
        "description": "Gender of something, typically a [[Person]], but possibly also fictional characters, animals, etc. While https://schema.org/Male and https://schema.org/Female may be used, text strings are also acceptable for people who are not a binary gender. The [[gender]] property can also be used in an extended sense to cover e.g. the gender of sports teams. As with the gender of individuals, we do not try to enumerate all possibilities. A mixed-gender [[SportsTeam]] can be indicated with a text value of \"Mixed\".",
        "expectedTypes": [
          "https://schema.org/GenderType",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/GenderType",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Person",
          "https://schema.org/SportsTeam"
        ]
      },
      {
        "name": "givenName",
        "type": "https://schema.org/Text",
        "description": "Given name. In the U.S., the first name of a Person.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Person"
        ]
      },
      {
        "name": "globalLocationNumber",
        "type": "https://schema.org/Text",
        "description": "The [Global Location Number](http://www.gs1.org/gln) (GLN, sometimes also referred to as International Location Number or ILN) of the respective organization, person, or place. The GLN is a 13-digit number used to identify parties and physical locations.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person",
          "https://schema.org/Place"
        ]
      },
      {
        "name": "hasCertification",
        "type": "https://schema.org/Certification",
        "description": "Certification information about a product, organization, service, place, or person.",
        "expectedTypes": [
          "https://schema.org/Certification"
        ],
        "rangeTypes": [
          "https://schema.org/Certification"
        ],
        "domainTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person",
          "https://schema.org/Place",
          "https://schema.org/Product",
          "https://schema.org/Service"
        ]
      },
      {
        "name": "hasCredential",
        "type": "https://schema.org/Credential",
        "description": "A credential awarded to the Person or Organization.",
        "expectedTypes": [
          "https://schema.org/Credential"
        ],
        "rangeTypes": [
          "https://schema.org/Credential"
        ],
        "domainTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ]
      },
      {
        "name": "hasOccupation",
        "type": "https://schema.org/Occupation",
        "description": "The Person's occupation. For past professions, use Role for expressing dates.",
        "expectedTypes": [
          "https://schema.org/Occupation"
        ],
        "rangeTypes": [
          "https://schema.org/Occupation"
        ],
        "domainTypes": [
          "https://schema.org/Person"
        ]
      },
      {
        "name": "hasOfferCatalog",
        "type": "https://schema.org/OfferCatalog",
        "description": "Indicates an OfferCatalog listing for this Organization, Person, or Service.",
        "expectedTypes": [
          "https://schema.org/OfferCatalog"
        ],
        "rangeTypes": [
          "https://schema.org/OfferCatalog"
        ],
        "domainTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person",
          "https://schema.org/Service"
        ]
      },
      {
        "name": "hasPOS",
        "type": "https://schema.org/Place",
        "description": "Points-of-Sales operated by the organization or person.",
        "expectedTypes": [
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ]
      },
      {
        "name": "height",
        "type": [
          "https://schema.org/Distance",
          "https://schema.org/QuantitativeValue"
        ],
        "description": "The height of the item.",
        "expectedTypes": [
          "https://schema.org/Distance",
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/Distance",
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/MediaObject",
          "https://schema.org/OfferShippingDetails",
          "https://schema.org/Person",
          "https://schema.org/Product",
          "https://schema.org/ShippingConditions",
          "https://schema.org/VisualArtwork"
        ]
      },
      {
        "name": "homeLocation",
        "type": [
          "https://schema.org/ContactPoint",
          "https://schema.org/Place"
        ],
        "description": "A contact location for a person's residence.",
        "expectedTypes": [
          "https://schema.org/ContactPoint",
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/ContactPoint",
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/Person"
        ]
      },
      {
        "name": "honorificPrefix",
        "type": "https://schema.org/Text",
        "description": "An honorific prefix preceding a Person's name such as Dr/Mrs/Mr.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Person"
        ]
      },
      {
        "name": "honorificSuffix",
        "type": "https://schema.org/Text",
        "description": "An honorific suffix following a Person's name such as M.D./PhD/MSCSW.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Person"
        ]
      },
      {
        "name": "interactionStatistic",
        "type": "https://schema.org/InteractionCounter",
        "description": "The number of interactions for the CreativeWork using the WebSite or SoftwareApplication. The most specific child type of InteractionCounter should be used.",
        "expectedTypes": [
          "https://schema.org/InteractionCounter"
        ],
        "rangeTypes": [
          "https://schema.org/InteractionCounter"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ]
      },
      {
        "name": "isicV4",
        "type": "https://schema.org/Text",
        "description": "The International Standard of Industrial Classification of All Economic Activities (ISIC), Revision 4 code for a particular organization, business person, or place.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person",
          "https://schema.org/Place"
        ]
      },
      {
        "name": "jobTitle",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text"
        ],
        "description": "The job title of the person (for example, Financial Manager).",
        "expectedTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Person"
        ]
      },
      {
        "name": "knows",
        "type": "https://schema.org/Person",
        "description": "The most generic bi-directional social/work relation.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Person"
        ]
      },
      {
        "name": "knowsAbout",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/Thing",
          "https://schema.org/URL"
        ],
        "description": "Of a [[Person]], and less typically of an [[Organization]], to indicate a topic that is known about - suggesting possible expertise but not implying it. We do not distinguish skill levels here, or relate this to educational content, events, objectives or [[JobPosting]] descriptions.",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/Thing",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/Thing",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ]
      },
      {
        "name": "knowsLanguage",
        "type": [
          "https://schema.org/Language",
          "https://schema.org/Text"
        ],
        "description": "Of a [[Person]], and less typically of an [[Organization]], to indicate a known language. We do not distinguish skill levels or reading/writing/speaking/signing here. Use language codes from the [IETF BCP 47 standard](http://tools.ietf.org/html/bcp47).",
        "expectedTypes": [
          "https://schema.org/Language",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Language",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ]
      },
      {
        "name": "lifeEvent",
        "type": "https://schema.org/Event",
        "description": "A life event like baptism, communions, Bar Mitzvahs, Aqiqah, Namakarana, Miyamairi, burial, ....",
        "expectedTypes": [
          "https://schema.org/Event"
        ],
        "rangeTypes": [
          "https://schema.org/Event"
        ],
        "domainTypes": [
          "https://schema.org/Person"
        ]
      },
      {
        "name": "makesOffer",
        "type": "https://schema.org/Offer",
        "description": "A pointer to products or services offered by the organization or person.",
        "expectedTypes": [
          "https://schema.org/Offer"
        ],
        "rangeTypes": [
          "https://schema.org/Offer"
        ],
        "domainTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "inverseOf": "https://schema.org/offeredBy"
      },
      {
        "name": "memberOf",
        "type": [
          "https://schema.org/MemberProgramTier",
          "https://schema.org/Organization",
          "https://schema.org/ProgramMembership"
        ],
        "description": "An Organization (or ProgramMembership) to which this Person or Organization belongs.",
        "expectedTypes": [
          "https://schema.org/MemberProgramTier",
          "https://schema.org/Organization",
          "https://schema.org/ProgramMembership"
        ],
        "rangeTypes": [
          "https://schema.org/MemberProgramTier",
          "https://schema.org/Organization",
          "https://schema.org/ProgramMembership"
        ],
        "domainTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "inverseOf": "https://schema.org/member"
      },
      {
        "name": "naics",
        "type": "https://schema.org/Text",
        "description": "The North American Industry Classification System (NAICS) code for a particular organization or business person.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ]
      },
      {
        "name": "nationality",
        "type": "https://schema.org/Country",
        "description": "Nationality of the person.",
        "expectedTypes": [
          "https://schema.org/Country"
        ],
        "rangeTypes": [
          "https://schema.org/Country"
        ],
        "domainTypes": [
          "https://schema.org/Person"
        ]
      },
      {
        "name": "netWorth",
        "type": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/PriceSpecification"
        ],
        "description": "The total financial value of the person as calculated by subtracting the total value of liabilities from the total value of assets.",
        "expectedTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/PriceSpecification"
        ],
        "rangeTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/PriceSpecification"
        ],
        "domainTypes": [
          "https://schema.org/Person"
        ]
      },
      {
        "name": "owns",
        "type": "https://schema.org/Thing",
        "description": "Things owned by the organization or person.",
        "expectedTypes": [
          "https://schema.org/Thing"
        ],
        "rangeTypes": [
          "https://schema.org/Thing"
        ],
        "domainTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "inverseOf": "https://schema.org/owner"
      },
      {
        "name": "parent",
        "type": "https://schema.org/Person",
        "description": "A parent of this person.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Person"
        ]
      },
      {
        "name": "parents",
        "type": "https://schema.org/Person",
        "description": "A parents of the person.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Person"
        ],
        "supersededBy": "https://schema.org/parent"
      },
      {
        "name": "performerIn",
        "type": "https://schema.org/Event",
        "description": "Event that this person is a performer or participant in.",
        "expectedTypes": [
          "https://schema.org/Event"
        ],
        "rangeTypes": [
          "https://schema.org/Event"
        ],
        "domainTypes": [
          "https://schema.org/Person"
        ]
      },
      {
        "name": "pronouns",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/StructuredValue",
          "https://schema.org/Text"
        ],
        "description": "A short string listing or describing pronouns for a person. Typically the person concerned is the best authority as pronouns are a critical part of personal identity and expression. Publishers and consumers of this information are reminded to treat this data responsibly, take country-specific laws related to gender expression into account, and be wary of out-of-date data and drawing unwarranted inferences about the person being described.\n\nIn English, formulations such as \"they/them\", \"she/her\", and \"he/him\" are commonly used online and can also be used here. We do not intend to enumerate all possible micro-syntaxes in all languages. More structured and well-defined external values for pronouns can be referenced using the [[StructuredValue]] or [[DefinedTerm]] values.\n",
        "expectedTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/StructuredValue",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/StructuredValue",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Person"
        ]
      },
      {
        "name": "publishingPrinciples",
        "type": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "description": "The publishingPrinciples property indicates (typically via [[URL]]) a document describing the editorial principles of an [[Organization]] (or individual, e.g. a [[Person]] writing a blog) that relate to their activities as a publisher, e.g. ethics or diversity policies. When applied to a [[CreativeWork]] (e.g. [[NewsArticle]]) the principles are those of the party primarily responsible for the creation of the [[CreativeWork]].\n\nWhile such policies are most typically expressed in natural language, sometimes related information (e.g. indicating a [[funder]]) can be expressed using schema.org terminology.\n",
        "expectedTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ]
      },
      {
        "name": "relatedTo",
        "type": "https://schema.org/Person",
        "description": "The most generic familial relation.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Person"
        ]
      },
      {
        "name": "seeks",
        "type": "https://schema.org/Demand",
        "description": "A pointer to products or services sought by the organization or person (demand).",
        "expectedTypes": [
          "https://schema.org/Demand"
        ],
        "rangeTypes": [
          "https://schema.org/Demand"
        ],
        "domainTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ]
      },
      {
        "name": "sibling",
        "type": "https://schema.org/Person",
        "description": "A sibling of the person.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Person"
        ]
      },
      {
        "name": "siblings",
        "type": "https://schema.org/Person",
        "description": "A sibling of the person.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Person"
        ],
        "supersededBy": "https://schema.org/sibling"
      },
      {
        "name": "skills",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text"
        ],
        "description": "A statement of knowledge, skill, ability, task or any other assertion expressing a competency that is either claimed by a person, an organization or desired or required to fulfill a role or to work in an occupation.",
        "expectedTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/JobPosting",
          "https://schema.org/Occupation",
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ]
      },
      {
        "name": "sponsor",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "A person or organization that supports a thing through a pledge, promise, or financial contribution. E.g. a sponsor of a Medical Study or a corporate sponsor of an event.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Event",
          "https://schema.org/Grant",
          "https://schema.org/MedicalStudy",
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ]
      },
      {
        "name": "spouse",
        "type": "https://schema.org/Person",
        "description": "The person's spouse.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Person"
        ]
      },
      {
        "name": "taxID",
        "type": "https://schema.org/Text",
        "description": "The Tax / Fiscal ID of the organization or person, e.g. the TIN in the US or the CIF/NIF in Spain.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ]
      },
      {
        "name": "telephone",
        "type": "https://schema.org/Text",
        "description": "The telephone number.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/ContactPoint",
          "https://schema.org/Organization",
          "https://schema.org/Person",
          "https://schema.org/Place"
        ]
      },
      {
        "name": "vatID",
        "type": "https://schema.org/Text",
        "description": "The value-added Tax ID of the organization or person with national prefix (for example IT123456789). Can also be described as [[iso6523Code]] with proper prefix.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ]
      },
      {
        "name": "weight",
        "type": [
          "https://schema.org/Mass",
          "https://schema.org/QuantitativeValue"
        ],
        "description": "The weight of the product or person.",
        "expectedTypes": [
          "https://schema.org/Mass",
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/Mass",
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/OfferShippingDetails",
          "https://schema.org/Person",
          "https://schema.org/Product",
          "https://schema.org/ShippingConditions",
          "https://schema.org/VisualArtwork"
        ]
      },
      {
        "name": "workLocation",
        "type": [
          "https://schema.org/ContactPoint",
          "https://schema.org/Place"
        ],
        "description": "A contact location for a person's place of work.",
        "expectedTypes": [
          "https://schema.org/ContactPoint",
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/ContactPoint",
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/Person"
        ]
      },
      {
        "name": "worksFor",
        "type": "https://schema.org/Organization",
        "description": "Organizations that the person works for.",
        "expectedTypes": [
          "https://schema.org/Organization"
        ],
        "rangeTypes": [
          "https://schema.org/Organization"
        ],
        "domainTypes": [
          "https://schema.org/Person"
        ]
      }
    ]
  },
  {
    "name": "PetStore",
    "type": "https://schema.org/PetStore",
    "source": "generated",
    "description": "A pet store.",
    "parentTypes": [
      "https://schema.org/Store"
    ]
  },
  {
    "name": "Pharmacy",
    "type": "https://schema.org/Pharmacy",
    "source": "generated",
    "description": "A pharmacy or drugstore.",
    "parentTypes": [
      "https://schema.org/MedicalBusiness",
      "https://schema.org/MedicalOrganization"
    ]
  },
  {
    "name": "Photograph",
    "type": "https://schema.org/Photograph",
    "source": "generated",
    "description": "A photograph.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ]
  },
  {
    "name": "PhotographAction",
    "type": "https://schema.org/PhotographAction",
    "source": "generated",
    "description": "The act of capturing still images of objects using a camera.",
    "parentTypes": [
      "https://schema.org/CreateAction"
    ]
  },
  {
    "name": "PhysicalActivity",
    "type": "https://schema.org/PhysicalActivity",
    "source": "generated",
    "description": "Any bodily activity that enhances or maintains physical fitness and overall health and wellness. Includes activity that is part of daily living and routine, structured exercise, and exercise prescribed as part of a medical treatment or recovery plan.",
    "parentTypes": [
      "https://schema.org/LifestyleModification"
    ],
    "properties": [
      {
        "name": "associatedAnatomy",
        "type": [
          "https://schema.org/AnatomicalStructure",
          "https://schema.org/AnatomicalSystem",
          "https://schema.org/SuperficialAnatomy"
        ],
        "description": "The anatomy of the underlying organ system or structures associated with this entity.",
        "expectedTypes": [
          "https://schema.org/AnatomicalStructure",
          "https://schema.org/AnatomicalSystem",
          "https://schema.org/SuperficialAnatomy"
        ],
        "rangeTypes": [
          "https://schema.org/AnatomicalStructure",
          "https://schema.org/AnatomicalSystem",
          "https://schema.org/SuperficialAnatomy"
        ],
        "domainTypes": [
          "https://schema.org/MedicalCondition",
          "https://schema.org/PhysicalActivity"
        ]
      },
      {
        "name": "category",
        "type": [
          "https://schema.org/CategoryCode",
          "https://schema.org/PhysicalActivityCategory",
          "https://schema.org/Text",
          "https://schema.org/Thing",
          "https://schema.org/URL"
        ],
        "description": "A category for the item. Greater signs or slashes can be used to informally indicate a category hierarchy.",
        "expectedTypes": [
          "https://schema.org/CategoryCode",
          "https://schema.org/PhysicalActivityCategory",
          "https://schema.org/Text",
          "https://schema.org/Thing",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/CategoryCode",
          "https://schema.org/PhysicalActivityCategory",
          "https://schema.org/Text",
          "https://schema.org/Thing",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/ActionAccessSpecification",
          "https://schema.org/Guide",
          "https://schema.org/Invoice",
          "https://schema.org/Offer",
          "https://schema.org/PhysicalActivity",
          "https://schema.org/Product",
          "https://schema.org/Recommendation",
          "https://schema.org/Service",
          "https://schema.org/SpecialAnnouncement"
        ]
      },
      {
        "name": "epidemiology",
        "type": "https://schema.org/Text",
        "description": "The characteristics of associated patients, such as age, gender, race etc.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MedicalCondition",
          "https://schema.org/PhysicalActivity"
        ]
      },
      {
        "name": "pathophysiology",
        "type": "https://schema.org/Text",
        "description": "Changes in the normal mechanical, physical, and biochemical functions that are associated with this activity or condition.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MedicalCondition",
          "https://schema.org/PhysicalActivity"
        ]
      }
    ]
  },
  {
    "name": "PhysicalActivityCategory",
    "type": "https://schema.org/PhysicalActivityCategory",
    "source": "generated",
    "description": "Categories of physical activity, organized by physiologic classification.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "AerobicActivity",
        "type": "https://schema.org/AerobicActivity",
        "description": "Physical activity of relatively low intensity that depends primarily on the aerobic energy-generating process; during activity, the aerobic metabolism uses oxygen to adequately meet energy demands during exercise."
      },
      {
        "name": "AnaerobicActivity",
        "type": "https://schema.org/AnaerobicActivity",
        "description": "Physical activity that is of high-intensity which utilizes the anaerobic metabolism of the body."
      },
      {
        "name": "Balance",
        "type": "https://schema.org/Balance",
        "description": "Physical activity that is engaged to help maintain posture and balance."
      },
      {
        "name": "Flexibility",
        "type": "https://schema.org/Flexibility",
        "description": "Physical activity that is engaged in to improve joint and muscle flexibility."
      },
      {
        "name": "LeisureTimeActivity",
        "type": "https://schema.org/LeisureTimeActivity",
        "description": "Any physical activity engaged in for recreational purposes. Examples may include ballroom dancing, roller skating, canoeing, fishing, etc."
      },
      {
        "name": "OccupationalActivity",
        "type": "https://schema.org/OccupationalActivity",
        "description": "Any physical activity engaged in for job-related purposes. Examples may include waiting tables, maid service, carrying a mailbag, picking fruits or vegetables, construction work, etc."
      },
      {
        "name": "StrengthTraining",
        "type": "https://schema.org/StrengthTraining",
        "description": "Physical activity that is engaged in to improve muscle and bone strength. Also referred to as resistance training."
      }
    ]
  },
  {
    "name": "PhysicalExam",
    "type": "https://schema.org/PhysicalExam",
    "source": "generated",
    "description": "A type of physical examination of a patient performed by a physician. ",
    "parentTypes": [
      "https://schema.org/MedicalEnumeration",
      "https://schema.org/MedicalProcedure"
    ],
    "enumerationValues": [
      {
        "name": "Abdomen",
        "type": "https://schema.org/Abdomen",
        "description": "Abdomen clinical examination."
      },
      {
        "name": "Appearance",
        "type": "https://schema.org/Appearance",
        "description": "Appearance assessment with clinical examination."
      },
      {
        "name": "CardiovascularExam",
        "type": "https://schema.org/CardiovascularExam",
        "description": "Cardiovascular system assessment with clinical examination."
      },
      {
        "name": "Ear",
        "type": "https://schema.org/Ear",
        "description": "Ear function assessment with clinical examination."
      },
      {
        "name": "Eye",
        "type": "https://schema.org/Eye",
        "description": "Eye or ophthalmological function assessment with clinical examination."
      },
      {
        "name": "Genitourinary",
        "type": "https://schema.org/Genitourinary",
        "description": "Genitourinary system function assessment with clinical examination."
      },
      {
        "name": "Head",
        "type": "https://schema.org/Head",
        "description": "Head assessment with clinical examination."
      },
      {
        "name": "Lung",
        "type": "https://schema.org/Lung",
        "description": "Lung and respiratory system clinical examination."
      },
      {
        "name": "MusculoskeletalExam",
        "type": "https://schema.org/MusculoskeletalExam",
        "description": "Musculoskeletal system clinical examination."
      },
      {
        "name": "Neck",
        "type": "https://schema.org/Neck",
        "description": "Neck assessment with clinical examination."
      },
      {
        "name": "Neuro",
        "type": "https://schema.org/Neuro",
        "description": "Neurological system clinical examination."
      },
      {
        "name": "Nose",
        "type": "https://schema.org/Nose",
        "description": "Nose function assessment with clinical examination."
      },
      {
        "name": "Skin",
        "type": "https://schema.org/Skin",
        "description": "Skin assessment with clinical examination."
      },
      {
        "name": "Throat",
        "type": "https://schema.org/Throat",
        "description": "Throat assessment with  clinical examination."
      }
    ]
  },
  {
    "name": "PhysicalTherapy",
    "type": "https://schema.org/PhysicalTherapy",
    "source": "generated",
    "description": "A process of progressive physical care and rehabilitation aimed at improving a health condition.",
    "parentTypes": [
      "https://schema.org/MedicalTherapy"
    ]
  },
  {
    "name": "Physician",
    "type": "https://schema.org/Physician",
    "source": "generated",
    "description": "An individual physician or a physician's office considered as a [[MedicalOrganization]].",
    "parentTypes": [
      "https://schema.org/MedicalBusiness",
      "https://schema.org/MedicalOrganization"
    ],
    "properties": [
      {
        "name": "availableService",
        "type": [
          "https://schema.org/MedicalProcedure",
          "https://schema.org/MedicalTest",
          "https://schema.org/MedicalTherapy"
        ],
        "description": "A medical service available from this provider.",
        "expectedTypes": [
          "https://schema.org/MedicalProcedure",
          "https://schema.org/MedicalTest",
          "https://schema.org/MedicalTherapy"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalProcedure",
          "https://schema.org/MedicalTest",
          "https://schema.org/MedicalTherapy"
        ],
        "domainTypes": [
          "https://schema.org/Hospital",
          "https://schema.org/MedicalClinic",
          "https://schema.org/Physician"
        ]
      },
      {
        "name": "hospitalAffiliation",
        "type": "https://schema.org/Hospital",
        "description": "A hospital with which the physician or office is affiliated.",
        "expectedTypes": [
          "https://schema.org/Hospital"
        ],
        "rangeTypes": [
          "https://schema.org/Hospital"
        ],
        "domainTypes": [
          "https://schema.org/Physician"
        ]
      },
      {
        "name": "medicalSpecialty",
        "type": "https://schema.org/MedicalSpecialty",
        "description": "A medical specialty of the provider.",
        "expectedTypes": [
          "https://schema.org/MedicalSpecialty"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalSpecialty"
        ],
        "domainTypes": [
          "https://schema.org/Hospital",
          "https://schema.org/MedicalClinic",
          "https://schema.org/MedicalOrganization",
          "https://schema.org/Physician"
        ]
      },
      {
        "name": "occupationalCategory",
        "type": [
          "https://schema.org/CategoryCode",
          "https://schema.org/Text"
        ],
        "description": "A category describing the job, preferably using a term from a taxonomy such as [BLS O*NET-SOC](http://www.onetcenter.org/taxonomy.html), [ISCO-08](https://www.ilo.org/public/english/bureau/stat/isco/isco08/) or similar, with the property repeated for each applicable value. Ideally the taxonomy should be identified, and both the textual label and formal code for the category should be provided.\\n\nNote: for historical reasons, any textual label and formal code provided as a literal may be assumed to be from O*NET-SOC.",
        "expectedTypes": [
          "https://schema.org/CategoryCode",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/CategoryCode",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/EducationalOccupationalProgram",
          "https://schema.org/JobPosting",
          "https://schema.org/Occupation",
          "https://schema.org/Physician",
          "https://schema.org/WorkBasedProgram"
        ]
      },
      {
        "name": "usNPI",
        "type": "https://schema.org/Text",
        "description": "A <a href=\"https://en.wikipedia.org/wiki/National_Provider_Identifier\">National Provider Identifier</a> (NPI) \n    is a unique 10-digit identification number issued to health care providers in the United States by the Centers for Medicare and Medicaid Services.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Physician"
        ]
      }
    ]
  },
  {
    "name": "PhysiciansOffice",
    "type": "https://schema.org/PhysiciansOffice",
    "source": "generated",
    "description": "A doctor's office or clinic.",
    "parentTypes": [
      "https://schema.org/Physician"
    ]
  },
  {
    "name": "Place",
    "type": "https://schema.org/Place",
    "source": "generated",
    "description": "Entities that have a somewhat fixed, physical extension.",
    "parentTypes": [
      "https://schema.org/Thing"
    ],
    "properties": [
      {
        "name": "additionalProperty",
        "type": "https://schema.org/PropertyValue",
        "description": "A property-value pair representing an additional characteristic of the entity, e.g. a product feature or another characteristic for which there is no matching property in schema.org.\\n\\nNote: Publishers should be aware that applications designed to use specific schema.org properties (e.g. https://schema.org/width, https://schema.org/color, https://schema.org/gtin13, ...) will typically expect such data to be provided using those properties, rather than using the generic property/value mechanism.\n",
        "expectedTypes": [
          "https://schema.org/PropertyValue"
        ],
        "rangeTypes": [
          "https://schema.org/PropertyValue"
        ],
        "domainTypes": [
          "https://schema.org/MerchantReturnPolicy",
          "https://schema.org/Offer",
          "https://schema.org/Place",
          "https://schema.org/Product",
          "https://schema.org/QualitativeValue",
          "https://schema.org/QuantitativeValue"
        ]
      },
      {
        "name": "address",
        "type": [
          "https://schema.org/PostalAddress",
          "https://schema.org/Text"
        ],
        "description": "Physical address of the item.",
        "expectedTypes": [
          "https://schema.org/PostalAddress",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/PostalAddress",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/GeoCoordinates",
          "https://schema.org/GeoShape",
          "https://schema.org/Organization",
          "https://schema.org/Person",
          "https://schema.org/Place"
        ]
      },
      {
        "name": "aggregateRating",
        "type": "https://schema.org/AggregateRating",
        "description": "The overall rating, based on a collection of reviews or ratings, of the item.",
        "expectedTypes": [
          "https://schema.org/AggregateRating"
        ],
        "rangeTypes": [
          "https://schema.org/AggregateRating"
        ],
        "domainTypes": [
          "https://schema.org/Brand",
          "https://schema.org/CreativeWork",
          "https://schema.org/Event",
          "https://schema.org/Offer",
          "https://schema.org/Organization",
          "https://schema.org/Place",
          "https://schema.org/Product",
          "https://schema.org/Service"
        ]
      },
      {
        "name": "amenityFeature",
        "type": "https://schema.org/LocationFeatureSpecification",
        "description": "An amenity feature (e.g. a characteristic or service) of the Accommodation. This generic property does not make a statement about whether the feature is included in an offer for the main accommodation or available at extra costs.",
        "expectedTypes": [
          "https://schema.org/LocationFeatureSpecification"
        ],
        "rangeTypes": [
          "https://schema.org/LocationFeatureSpecification"
        ],
        "domainTypes": [
          "https://schema.org/Accommodation",
          "https://schema.org/FloorPlan",
          "https://schema.org/LodgingBusiness",
          "https://schema.org/Place"
        ]
      },
      {
        "name": "branchCode",
        "type": "https://schema.org/Text",
        "description": "A short textual code (also called \"store code\") that uniquely identifies a place of business. The code is typically assigned by the parentOrganization and used in structured URLs.\\n\\nFor example, in the URL http://www.starbucks.co.uk/store-locator/etc/detail/3047 the code \"3047\" is a branchCode for a particular branch.\n      ",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Place"
        ]
      },
      {
        "name": "containedIn",
        "type": "https://schema.org/Place",
        "description": "The basic containment relation between a place and one that contains it.",
        "expectedTypes": [
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/Place"
        ],
        "supersededBy": "https://schema.org/containedInPlace"
      },
      {
        "name": "containedInPlace",
        "type": "https://schema.org/Place",
        "description": "The basic containment relation between a place and one that contains it.",
        "expectedTypes": [
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/Place"
        ],
        "inverseOf": "https://schema.org/containsPlace"
      },
      {
        "name": "containsPlace",
        "type": "https://schema.org/Place",
        "description": "The basic containment relation between a place and another that it contains.",
        "expectedTypes": [
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/Place"
        ],
        "inverseOf": "https://schema.org/containedInPlace"
      },
      {
        "name": "event",
        "type": "https://schema.org/Event",
        "description": "Upcoming or past event associated with this place, organization, or action.",
        "expectedTypes": [
          "https://schema.org/Event"
        ],
        "rangeTypes": [
          "https://schema.org/Event"
        ],
        "domainTypes": [
          "https://schema.org/InformAction",
          "https://schema.org/InviteAction",
          "https://schema.org/JoinAction",
          "https://schema.org/LeaveAction",
          "https://schema.org/Organization",
          "https://schema.org/Place",
          "https://schema.org/PlayAction"
        ]
      },
      {
        "name": "events",
        "type": "https://schema.org/Event",
        "description": "Upcoming or past events associated with this place or organization.",
        "expectedTypes": [
          "https://schema.org/Event"
        ],
        "rangeTypes": [
          "https://schema.org/Event"
        ],
        "domainTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Place"
        ],
        "supersededBy": "https://schema.org/event"
      },
      {
        "name": "faxNumber",
        "type": "https://schema.org/Text",
        "description": "The fax number.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/ContactPoint",
          "https://schema.org/Organization",
          "https://schema.org/Person",
          "https://schema.org/Place"
        ]
      },
      {
        "name": "geo",
        "type": [
          "https://schema.org/GeoCoordinates",
          "https://schema.org/GeoShape"
        ],
        "description": "The geo coordinates of the place.",
        "expectedTypes": [
          "https://schema.org/GeoCoordinates",
          "https://schema.org/GeoShape"
        ],
        "rangeTypes": [
          "https://schema.org/GeoCoordinates",
          "https://schema.org/GeoShape"
        ],
        "domainTypes": [
          "https://schema.org/Place"
        ]
      },
      {
        "name": "geoContains",
        "type": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ],
        "description": "Represents a relationship between two geometries (or the places they represent), relating a containing geometry to a contained geometry. \"a contains b iff no points of b lie in the exterior of a, and at least one point of the interior of b lies in the interior of a\". As defined in [DE-9IM](https://en.wikipedia.org/wiki/DE-9IM).",
        "expectedTypes": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ]
      },
      {
        "name": "geoCoveredBy",
        "type": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ],
        "description": "Represents a relationship between two geometries (or the places they represent), relating a geometry to another that covers it. As defined in [DE-9IM](https://en.wikipedia.org/wiki/DE-9IM).",
        "expectedTypes": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ]
      },
      {
        "name": "geoCovers",
        "type": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ],
        "description": "Represents a relationship between two geometries (or the places they represent), relating a covering geometry to a covered geometry. \"Every point of b is a point of (the interior or boundary of) a\". As defined in [DE-9IM](https://en.wikipedia.org/wiki/DE-9IM).",
        "expectedTypes": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ]
      },
      {
        "name": "geoCrosses",
        "type": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ],
        "description": "Represents a relationship between two geometries (or the places they represent), relating a geometry to another that crosses it: \"a crosses b: they have some but not all interior points in common, and the dimension of the intersection is less than that of at least one of them\". As defined in [DE-9IM](https://en.wikipedia.org/wiki/DE-9IM).",
        "expectedTypes": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ]
      },
      {
        "name": "geoDisjoint",
        "type": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ],
        "description": "Represents spatial relations in which two geometries (or the places they represent) are topologically disjoint: \"they have no point in common. They form a set of disconnected geometries.\" (A symmetric relationship, as defined in [DE-9IM](https://en.wikipedia.org/wiki/DE-9IM).)",
        "expectedTypes": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ]
      },
      {
        "name": "geoEquals",
        "type": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ],
        "description": "Represents spatial relations in which two geometries (or the places they represent) are topologically equal, as defined in [DE-9IM](https://en.wikipedia.org/wiki/DE-9IM). \"Two geometries are topologically equal if their interiors intersect and no part of the interior or boundary of one geometry intersects the exterior of the other\" (a symmetric relationship).",
        "expectedTypes": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ]
      },
      {
        "name": "geoIntersects",
        "type": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ],
        "description": "Represents spatial relations in which two geometries (or the places they represent) have at least one point in common. As defined in [DE-9IM](https://en.wikipedia.org/wiki/DE-9IM).",
        "expectedTypes": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ]
      },
      {
        "name": "geoOverlaps",
        "type": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ],
        "description": "Represents a relationship between two geometries (or the places they represent), relating a geometry to another that geospatially overlaps it, i.e. they have some but not all points in common. As defined in [DE-9IM](https://en.wikipedia.org/wiki/DE-9IM).",
        "expectedTypes": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ]
      },
      {
        "name": "geoTouches",
        "type": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ],
        "description": "Represents spatial relations in which two geometries (or the places they represent) touch: \"they have at least one boundary point in common, but no interior points.\" (A symmetric relationship, as defined in [DE-9IM](https://en.wikipedia.org/wiki/DE-9IM).)",
        "expectedTypes": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ]
      },
      {
        "name": "geoWithin",
        "type": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ],
        "description": "Represents a relationship between two geometries (or the places they represent), relating a geometry to one that contains it, i.e. it is inside (i.e. within) its interior. As defined in [DE-9IM](https://en.wikipedia.org/wiki/DE-9IM).",
        "expectedTypes": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/GeospatialGeometry",
          "https://schema.org/Place"
        ]
      },
      {
        "name": "globalLocationNumber",
        "type": "https://schema.org/Text",
        "description": "The [Global Location Number](http://www.gs1.org/gln) (GLN, sometimes also referred to as International Location Number or ILN) of the respective organization, person, or place. The GLN is a 13-digit number used to identify parties and physical locations.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person",
          "https://schema.org/Place"
        ]
      },
      {
        "name": "hasCertification",
        "type": "https://schema.org/Certification",
        "description": "Certification information about a product, organization, service, place, or person.",
        "expectedTypes": [
          "https://schema.org/Certification"
        ],
        "rangeTypes": [
          "https://schema.org/Certification"
        ],
        "domainTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person",
          "https://schema.org/Place",
          "https://schema.org/Product",
          "https://schema.org/Service"
        ]
      },
      {
        "name": "hasDriveThroughService",
        "type": "https://schema.org/Boolean",
        "description": "Indicates whether some facility (e.g. [[FoodEstablishment]], [[CovidTestingFacility]]) offers a service that can be used by driving through in a car. In the case of [[CovidTestingFacility]] such facilities could potentially help with social distancing from other potentially-infected users.",
        "expectedTypes": [
          "https://schema.org/Boolean"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean"
        ],
        "domainTypes": [
          "https://schema.org/Place"
        ]
      },
      {
        "name": "hasGS1DigitalLink",
        "type": "https://schema.org/URL",
        "description": "The <a href=\"https://www.gs1.org/standards/gs1-digital-link\">GS1 digital link</a> associated with the object. This URL should conform to the particular requirements of digital links. The link should only contain the Application Identifiers (AIs) that are relevant for the entity being annotated, for instance a [[Product]] or an [[Organization]], and for the correct granularity. In particular, for products:<ul><li>A Digital Link that contains a serial number (AI <code>21</code>) should only be present on instances of [[IndividualProduct]]</li><li>A Digital Link that contains a lot number (AI <code>10</code>) should be annotated as [[SomeProducts]] if only products from that lot are sold, or [[IndividualProduct]] if there is only a specific product.</li><li>A Digital Link that contains a global model number (AI <code>8013</code>) should be attached to a [[Product]] or a [[ProductModel]].</li></ul> Other item types should be adapted similarly.",
        "expectedTypes": [
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Offer",
          "https://schema.org/Organization",
          "https://schema.org/Place",
          "https://schema.org/Product"
        ]
      },
      {
        "name": "hasMap",
        "type": [
          "https://schema.org/Map",
          "https://schema.org/URL"
        ],
        "description": "A URL to a map of the place.",
        "expectedTypes": [
          "https://schema.org/Map",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Map",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Place"
        ]
      },
      {
        "name": "isAccessibleForFree",
        "type": "https://schema.org/Boolean",
        "description": "A flag to signal that the item, event, or place is accessible for free.",
        "expectedTypes": [
          "https://schema.org/Boolean"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Event",
          "https://schema.org/Place"
        ]
      },
      {
        "name": "isicV4",
        "type": "https://schema.org/Text",
        "description": "The International Standard of Industrial Classification of All Economic Activities (ISIC), Revision 4 code for a particular organization, business person, or place.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person",
          "https://schema.org/Place"
        ]
      },
      {
        "name": "keywords",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "Keywords or tags used to describe some item. Multiple textual entries in a keywords list are typically delimited by commas, or by repeating the property.",
        "expectedTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Event",
          "https://schema.org/Organization",
          "https://schema.org/Place",
          "https://schema.org/Product"
        ]
      },
      {
        "name": "latitude",
        "type": [
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "description": "The latitude of a location. For example ```37.42242``` ([WGS 84](https://en.wikipedia.org/wiki/World_Geodetic_System)).",
        "expectedTypes": [
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/GeoCoordinates",
          "https://schema.org/Place"
        ]
      },
      {
        "name": "logo",
        "type": [
          "https://schema.org/ImageObject",
          "https://schema.org/URL"
        ],
        "description": "An associated logo.",
        "expectedTypes": [
          "https://schema.org/ImageObject",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/ImageObject",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Brand",
          "https://schema.org/Certification",
          "https://schema.org/Organization",
          "https://schema.org/Place",
          "https://schema.org/Product",
          "https://schema.org/Service"
        ]
      },
      {
        "name": "longitude",
        "type": [
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "description": "The longitude of a location. For example ```-122.08585``` ([WGS 84](https://en.wikipedia.org/wiki/World_Geodetic_System)).",
        "expectedTypes": [
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/GeoCoordinates",
          "https://schema.org/Place"
        ]
      },
      {
        "name": "map",
        "type": "https://schema.org/URL",
        "description": "A URL to a map of the place.",
        "expectedTypes": [
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Place"
        ],
        "supersededBy": "https://schema.org/hasMap"
      },
      {
        "name": "maps",
        "type": "https://schema.org/URL",
        "description": "A URL to a map of the place.",
        "expectedTypes": [
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Place"
        ],
        "supersededBy": "https://schema.org/hasMap"
      },
      {
        "name": "maximumAttendeeCapacity",
        "type": "https://schema.org/Integer",
        "description": "The total number of individuals that may attend an event or venue.",
        "expectedTypes": [
          "https://schema.org/Integer"
        ],
        "rangeTypes": [
          "https://schema.org/Integer"
        ],
        "domainTypes": [
          "https://schema.org/Event",
          "https://schema.org/Place"
        ]
      },
      {
        "name": "openingHoursSpecification",
        "type": "https://schema.org/OpeningHoursSpecification",
        "description": "The opening hours of a certain place.",
        "expectedTypes": [
          "https://schema.org/OpeningHoursSpecification"
        ],
        "rangeTypes": [
          "https://schema.org/OpeningHoursSpecification"
        ],
        "domainTypes": [
          "https://schema.org/Place"
        ]
      },
      {
        "name": "photo",
        "type": [
          "https://schema.org/ImageObject",
          "https://schema.org/Photograph"
        ],
        "description": "A photograph of this place.",
        "expectedTypes": [
          "https://schema.org/ImageObject",
          "https://schema.org/Photograph"
        ],
        "rangeTypes": [
          "https://schema.org/ImageObject",
          "https://schema.org/Photograph"
        ],
        "domainTypes": [
          "https://schema.org/Place"
        ]
      },
      {
        "name": "photos",
        "type": [
          "https://schema.org/ImageObject",
          "https://schema.org/Photograph"
        ],
        "description": "Photographs of this place.",
        "expectedTypes": [
          "https://schema.org/ImageObject",
          "https://schema.org/Photograph"
        ],
        "rangeTypes": [
          "https://schema.org/ImageObject",
          "https://schema.org/Photograph"
        ],
        "domainTypes": [
          "https://schema.org/Place"
        ],
        "supersededBy": "https://schema.org/photo"
      },
      {
        "name": "publicAccess",
        "type": "https://schema.org/Boolean",
        "description": "A flag to signal that the [[Place]] is open to public visitors.  If this property is omitted there is no assumed default boolean value.",
        "expectedTypes": [
          "https://schema.org/Boolean"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean"
        ],
        "domainTypes": [
          "https://schema.org/Place"
        ]
      },
      {
        "name": "review",
        "type": "https://schema.org/Review",
        "description": "A review of the item.",
        "expectedTypes": [
          "https://schema.org/Review"
        ],
        "rangeTypes": [
          "https://schema.org/Review"
        ],
        "domainTypes": [
          "https://schema.org/Brand",
          "https://schema.org/CreativeWork",
          "https://schema.org/Event",
          "https://schema.org/Offer",
          "https://schema.org/Organization",
          "https://schema.org/Place",
          "https://schema.org/Product",
          "https://schema.org/Service"
        ]
      },
      {
        "name": "reviews",
        "type": "https://schema.org/Review",
        "description": "Review of the item.",
        "expectedTypes": [
          "https://schema.org/Review"
        ],
        "rangeTypes": [
          "https://schema.org/Review"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Offer",
          "https://schema.org/Organization",
          "https://schema.org/Place",
          "https://schema.org/Product"
        ],
        "supersededBy": "https://schema.org/review"
      },
      {
        "name": "slogan",
        "type": "https://schema.org/Text",
        "description": "A slogan or motto associated with the item.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Brand",
          "https://schema.org/Organization",
          "https://schema.org/Place",
          "https://schema.org/Product",
          "https://schema.org/Service"
        ]
      },
      {
        "name": "smokingAllowed",
        "type": "https://schema.org/Boolean",
        "description": "Indicates whether it is allowed to smoke in the place, e.g. in the restaurant, hotel or hotel room.",
        "expectedTypes": [
          "https://schema.org/Boolean"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean"
        ],
        "domainTypes": [
          "https://schema.org/Place"
        ]
      },
      {
        "name": "specialOpeningHoursSpecification",
        "type": "https://schema.org/OpeningHoursSpecification",
        "description": "The special opening hours of a certain place.\\n\\nUse this to explicitly override general opening hours brought in scope by [[openingHoursSpecification]] or [[openingHours]].\n      ",
        "expectedTypes": [
          "https://schema.org/OpeningHoursSpecification"
        ],
        "rangeTypes": [
          "https://schema.org/OpeningHoursSpecification"
        ],
        "domainTypes": [
          "https://schema.org/Place"
        ]
      },
      {
        "name": "telephone",
        "type": "https://schema.org/Text",
        "description": "The telephone number.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/ContactPoint",
          "https://schema.org/Organization",
          "https://schema.org/Person",
          "https://schema.org/Place"
        ]
      },
      {
        "name": "tourBookingPage",
        "type": "https://schema.org/URL",
        "description": "A page providing information on how to book a tour of some [[Place]], such as an [[Accommodation]] or [[ApartmentComplex]] in a real estate setting, as well as other kinds of tours as appropriate.",
        "expectedTypes": [
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Accommodation",
          "https://schema.org/ApartmentComplex",
          "https://schema.org/Place"
        ]
      }
    ]
  },
  {
    "name": "PlaceOfWorship",
    "type": "https://schema.org/PlaceOfWorship",
    "source": "generated",
    "description": "Place of worship, such as a church, synagogue, or mosque.",
    "parentTypes": [
      "https://schema.org/CivicStructure"
    ]
  },
  {
    "name": "PlanAction",
    "type": "https://schema.org/PlanAction",
    "source": "generated",
    "description": "The act of planning the execution of an event/task/action/reservation/plan to a future date.",
    "parentTypes": [
      "https://schema.org/OrganizeAction"
    ],
    "properties": [
      {
        "name": "scheduledTime",
        "type": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "description": "The time the object is scheduled to.",
        "expectedTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/PlanAction"
        ]
      }
    ]
  },
  {
    "name": "Play",
    "type": "https://schema.org/Play",
    "source": "generated",
    "description": "A play is a form of literature, usually consisting of dialogue between characters, intended for theatrical performance rather than just reading. Note: A performance of a Play would be a [[TheaterEvent]] or [[BroadcastEvent]] - the *Play* being the [[workPerformed]].",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ]
  },
  {
    "name": "PlayAction",
    "type": "https://schema.org/PlayAction",
    "source": "generated",
    "description": "The act of playing/exercising/training/performing for enjoyment, leisure, recreation, competition or exercise.\\n\\nRelated actions:\\n\\n* [[ListenAction]]: Unlike ListenAction (which is under ConsumeAction), PlayAction refers to performing for an audience or at an event, rather than consuming music.\\n* [[WatchAction]]: Unlike WatchAction (which is under ConsumeAction), PlayAction refers to showing/displaying for an audience or at an event, rather than consuming visual content.",
    "parentTypes": [
      "https://schema.org/Action"
    ],
    "properties": [
      {
        "name": "audience",
        "type": "https://schema.org/Audience",
        "description": "An intended audience, i.e. a group for whom something was created.",
        "expectedTypes": [
          "https://schema.org/Audience"
        ],
        "rangeTypes": [
          "https://schema.org/Audience"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Event",
          "https://schema.org/LodgingBusiness",
          "https://schema.org/PlayAction",
          "https://schema.org/Product",
          "https://schema.org/Service"
        ]
      },
      {
        "name": "event",
        "type": "https://schema.org/Event",
        "description": "Upcoming or past event associated with this place, organization, or action.",
        "expectedTypes": [
          "https://schema.org/Event"
        ],
        "rangeTypes": [
          "https://schema.org/Event"
        ],
        "domainTypes": [
          "https://schema.org/InformAction",
          "https://schema.org/InviteAction",
          "https://schema.org/JoinAction",
          "https://schema.org/LeaveAction",
          "https://schema.org/Organization",
          "https://schema.org/Place",
          "https://schema.org/PlayAction"
        ]
      }
    ]
  },
  {
    "name": "PlayGameAction",
    "type": "https://schema.org/PlayGameAction",
    "source": "generated",
    "description": "The act of playing a video game.",
    "parentTypes": [
      "https://schema.org/ConsumeAction"
    ],
    "properties": [
      {
        "name": "gameAvailabilityType",
        "type": [
          "https://schema.org/GameAvailabilityEnumeration",
          "https://schema.org/Text"
        ],
        "description": "Indicates the availability type of the game content associated with this action, such as whether it is a full version or a demo.",
        "expectedTypes": [
          "https://schema.org/GameAvailabilityEnumeration",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/GameAvailabilityEnumeration",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/PlayGameAction"
        ]
      }
    ]
  },
  {
    "name": "Playground",
    "type": "https://schema.org/Playground",
    "source": "generated",
    "description": "A playground.",
    "parentTypes": [
      "https://schema.org/CivicStructure"
    ]
  },
  {
    "name": "Plumber",
    "type": "https://schema.org/Plumber",
    "source": "generated",
    "description": "A plumbing service.",
    "parentTypes": [
      "https://schema.org/HomeAndConstructionBusiness"
    ]
  },
  {
    "name": "PodcastEpisode",
    "type": "https://schema.org/PodcastEpisode",
    "source": "generated",
    "description": "A single episode of a podcast series.",
    "parentTypes": [
      "https://schema.org/Episode"
    ]
  },
  {
    "name": "PodcastSeason",
    "type": "https://schema.org/PodcastSeason",
    "source": "generated",
    "description": "A single season of a podcast. Many podcasts do not break down into separate seasons. In that case, PodcastSeries should be used.",
    "parentTypes": [
      "https://schema.org/CreativeWorkSeason"
    ]
  },
  {
    "name": "PodcastSeries",
    "type": "https://schema.org/PodcastSeries",
    "source": "generated",
    "description": "A podcast is an episodic series of digital audio or video files which a user can download and listen to.",
    "parentTypes": [
      "https://schema.org/CreativeWorkSeries"
    ],
    "properties": [
      {
        "name": "actor",
        "type": [
          "https://schema.org/PerformingGroup",
          "https://schema.org/Person"
        ],
        "description": "An actor (individual or a group), e.g. in TV, radio, movie, video games etc., or in an event. Actors can be associated with individual items or with a series, episode, clip.",
        "expectedTypes": [
          "https://schema.org/PerformingGroup",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/PerformingGroup",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Clip",
          "https://schema.org/CreativeWorkSeason",
          "https://schema.org/Episode",
          "https://schema.org/Event",
          "https://schema.org/Movie",
          "https://schema.org/MovieSeries",
          "https://schema.org/PodcastSeries",
          "https://schema.org/RadioSeries",
          "https://schema.org/TVSeries",
          "https://schema.org/VideoGame",
          "https://schema.org/VideoGameSeries",
          "https://schema.org/VideoObject"
        ]
      },
      {
        "name": "webFeed",
        "type": [
          "https://schema.org/DataFeed",
          "https://schema.org/URL"
        ],
        "description": "The URL for a feed, e.g. associated with a podcast series, blog, or series of date-stamped updates. This is usually RSS or Atom.",
        "expectedTypes": [
          "https://schema.org/DataFeed",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/DataFeed",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/PodcastSeries",
          "https://schema.org/SpecialAnnouncement"
        ]
      }
    ]
  },
  {
    "name": "PoliceStation",
    "type": "https://schema.org/PoliceStation",
    "source": "generated",
    "description": "A police station.",
    "parentTypes": [
      "https://schema.org/CivicStructure",
      "https://schema.org/EmergencyService"
    ]
  },
  {
    "name": "PoliticalParty",
    "type": "https://schema.org/PoliticalParty",
    "source": "generated",
    "description": "Organization: Political Party.",
    "parentTypes": [
      "https://schema.org/Organization"
    ]
  },
  {
    "name": "Pond",
    "type": "https://schema.org/Pond",
    "source": "generated",
    "description": "A pond.",
    "parentTypes": [
      "https://schema.org/BodyOfWater"
    ]
  },
  {
    "name": "PostalAddress",
    "type": "https://spec.edmcouncil.org/fibo/ontology/FND/Places/Addresses/PostalAddress",
    "source": "generated"
  },
  {
    "name": "PostalAddress",
    "type": "https://ref.gs1.org/voc/PostalAddress",
    "source": "generated"
  },
  {
    "name": "PostalAddress",
    "type": "https://schema.org/PostalAddress",
    "source": "generated",
    "description": "The mailing address.",
    "parentTypes": [
      "https://schema.org/ContactPoint"
    ],
    "properties": [
      {
        "name": "addressCountry",
        "type": [
          "https://schema.org/Country",
          "https://schema.org/Text"
        ],
        "description": "The country. Recommended to be in 2-letter [ISO 3166-1 alpha-2](http://en.wikipedia.org/wiki/ISO_3166-1) format, for example \"US\". For backward compatibility, a 3-letter [ISO 3166-1 alpha-3](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) country code such as \"SGP\" or a full country name such as \"Singapore\" can also be used.",
        "expectedTypes": [
          "https://schema.org/Country",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Country",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/DefinedRegion",
          "https://schema.org/GeoCoordinates",
          "https://schema.org/GeoShape",
          "https://schema.org/PostalAddress"
        ]
      },
      {
        "name": "addressLocality",
        "type": "https://schema.org/Text",
        "description": "The locality in which the street address is, and which is in the region. For example, Mountain View.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/PostalAddress"
        ]
      },
      {
        "name": "addressRegion",
        "type": [
          "https://schema.org/AdministrativeArea",
          "https://schema.org/Text"
        ],
        "description": "The region in which the locality is, and which is in the country. For example, California or another appropriate first-level [Administrative division](https://en.wikipedia.org/wiki/List_of_administrative_divisions_by_country) such as the Province in Italy or Region in Germany.",
        "expectedTypes": [
          "https://schema.org/AdministrativeArea",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/AdministrativeArea",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/DefinedRegion",
          "https://schema.org/PostalAddress"
        ]
      },
      {
        "name": "extendedAddress",
        "type": "https://schema.org/Text",
        "description": "An address extension such as an apartment number, C/O or alternative name.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/PostalAddress"
        ]
      },
      {
        "name": "postalCode",
        "type": "https://schema.org/Text",
        "description": "The postal code. For example, 94043.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/DefinedRegion",
          "https://schema.org/GeoCoordinates",
          "https://schema.org/GeoShape",
          "https://schema.org/PostalAddress"
        ]
      },
      {
        "name": "postOfficeBoxNumber",
        "type": "https://schema.org/Text",
        "description": "The post office box number for PO box addresses.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/PostalAddress"
        ]
      },
      {
        "name": "streetAddress",
        "type": "https://schema.org/Text",
        "description": "The street address. For example, 1600 Amphitheatre Pkwy.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/PostalAddress"
        ]
      }
    ]
  },
  {
    "name": "PostalCodeRangeSpecification",
    "type": "https://schema.org/PostalCodeRangeSpecification",
    "source": "generated",
    "description": "Indicates a range of postal codes, usually defined as the set of valid codes between [[postalCodeBegin]] and [[postalCodeEnd]], inclusively.",
    "parentTypes": [
      "https://schema.org/StructuredValue"
    ],
    "properties": [
      {
        "name": "postalCodeBegin",
        "type": "https://schema.org/Text",
        "description": "First postal code in a range (included).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/PostalCodeRangeSpecification"
        ]
      },
      {
        "name": "postalCodeEnd",
        "type": "https://schema.org/Text",
        "description": "Last postal code in the range (included). Needs to be after [[postalCodeBegin]].",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/PostalCodeRangeSpecification"
        ]
      }
    ]
  },
  {
    "name": "Poster",
    "type": "https://schema.org/Poster",
    "source": "generated",
    "description": "A large, usually printed placard, bill, or announcement, often illustrated, that is posted to advertise or publicize something.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ]
  },
  {
    "name": "PostOffice",
    "type": "https://schema.org/PostOffice",
    "source": "generated",
    "description": "A post office.",
    "parentTypes": [
      "https://schema.org/GovernmentOffice"
    ]
  },
  {
    "name": "PreOrderAction",
    "type": "https://schema.org/PreOrderAction",
    "source": "generated",
    "description": "An agent orders a (not yet released) object/product/service to be delivered/sent.",
    "parentTypes": [
      "https://schema.org/TradeAction"
    ]
  },
  {
    "name": "PrependAction",
    "type": "https://schema.org/PrependAction",
    "source": "generated",
    "description": "The act of inserting at the beginning if an ordered collection.",
    "parentTypes": [
      "https://schema.org/InsertAction"
    ]
  },
  {
    "name": "Preschool",
    "type": "https://schema.org/Preschool",
    "source": "generated",
    "description": "A preschool.",
    "parentTypes": [
      "https://schema.org/EducationalOrganization"
    ]
  },
  {
    "name": "PresentationDigitalDocument",
    "type": "https://schema.org/PresentationDigitalDocument",
    "source": "generated",
    "description": "A file containing slides or used for a presentation.",
    "parentTypes": [
      "https://schema.org/DigitalDocument"
    ]
  },
  {
    "name": "PreventionIndication",
    "type": "https://schema.org/PreventionIndication",
    "source": "generated",
    "description": "An indication for preventing an underlying condition, symptom, etc.",
    "parentTypes": [
      "https://schema.org/MedicalIndication"
    ]
  },
  {
    "name": "Price",
    "type": "https://spec.edmcouncil.org/fibo/ontology/FND/ProductsAndServices/ProductsAndServices/Price",
    "source": "generated"
  },
  {
    "name": "PriceComponentTypeEnumeration",
    "type": "https://schema.org/PriceComponentTypeEnumeration",
    "source": "generated",
    "description": "Enumerates different price components that together make up the total price for an offered product.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "ActivationFee",
        "type": "https://schema.org/ActivationFee",
        "description": "Represents the activation fee part of the total price for an offered product, for example a cellphone contract."
      },
      {
        "name": "CleaningFee",
        "type": "https://schema.org/CleaningFee",
        "description": "Represents the cleaning fee part of the total price for an offered product, for example a vacation rental."
      },
      {
        "name": "DistanceFee",
        "type": "https://schema.org/DistanceFee",
        "description": "Represents the distance fee (e.g., price per km or mile) part of the total price for an offered product, for example a car rental."
      },
      {
        "name": "Downpayment",
        "type": "https://schema.org/Downpayment",
        "description": "Represents the downpayment (up-front payment) price component of the total price for an offered product that has additional installment payments."
      },
      {
        "name": "Installment",
        "type": "https://schema.org/Installment",
        "description": "Represents the installment pricing component of the total price for an offered product."
      },
      {
        "name": "Subscription",
        "type": "https://schema.org/Subscription",
        "description": "Represents the subscription pricing component of the total price for an offered product."
      }
    ]
  },
  {
    "name": "PriceSpecification",
    "type": "https://schema.org/PriceSpecification",
    "source": "generated",
    "description": "A structured value representing a price or price range. Typically, only the subclasses of this type are used for markup. It is recommended to use [[MonetaryAmount]] to describe independent amounts of money such as a salary, credit card limits, etc.",
    "parentTypes": [
      "https://schema.org/StructuredValue"
    ],
    "properties": [
      {
        "name": "eligibleQuantity",
        "type": "https://schema.org/QuantitativeValue",
        "description": "The interval and unit of measurement of ordering quantities for which the offer or price specification is valid. This allows e.g. specifying that a certain freight charge is valid only for a certain quantity.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/Demand",
          "https://schema.org/Offer",
          "https://schema.org/PriceSpecification"
        ]
      },
      {
        "name": "eligibleTransactionVolume",
        "type": "https://schema.org/PriceSpecification",
        "description": "The transaction volume, in a monetary unit, for which the offer or price specification is valid, e.g. for indicating a minimal purchasing volume, to express free shipping above a certain order volume, or to limit the acceptance of credit cards to purchases to a certain minimal amount.",
        "expectedTypes": [
          "https://schema.org/PriceSpecification"
        ],
        "rangeTypes": [
          "https://schema.org/PriceSpecification"
        ],
        "domainTypes": [
          "https://schema.org/Demand",
          "https://schema.org/Offer",
          "https://schema.org/PriceSpecification"
        ]
      },
      {
        "name": "maxPrice",
        "type": "https://schema.org/Number",
        "description": "The highest price if the price is a range.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/PriceSpecification"
        ]
      },
      {
        "name": "membershipPointsEarned",
        "type": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "description": "The number of membership points earned by the member. If necessary, the unitText can be used to express the units the points are issued in. (E.g. stars, miles, etc.)",
        "expectedTypes": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/MemberProgramTier",
          "https://schema.org/PriceSpecification",
          "https://schema.org/ProgramMembership"
        ]
      },
      {
        "name": "minPrice",
        "type": "https://schema.org/Number",
        "description": "The lowest price if the price is a range.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/PriceSpecification"
        ]
      },
      {
        "name": "price",
        "type": [
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "description": "The offer price of a product, or of a price component when attached to PriceSpecification and its subtypes.\\n\\nUsage guidelines:\\n\\n* Use the [[priceCurrency]] property (with standard formats: [ISO 4217 currency format](http://en.wikipedia.org/wiki/ISO_4217), e.g. \"USD\"; [Ticker symbol](https://en.wikipedia.org/wiki/List_of_cryptocurrencies) for cryptocurrencies, e.g. \"BTC\"; well known names for [Local Exchange Trading Systems](https://en.wikipedia.org/wiki/Local_exchange_trading_system) (LETS) and other currency types, e.g. \"Ithaca HOUR\") instead of including [ambiguous symbols](http://en.wikipedia.org/wiki/Dollar_sign#Currencies_that_use_the_dollar_or_peso_sign) such as '$' in the value.\\n* Use '.' (Unicode 'FULL STOP' (U+002E)) rather than ',' to indicate a decimal point. Avoid using these symbols as a readability separator.\\n* Note that both [RDFa](http://www.w3.org/TR/xhtml-rdfa-primer/#using-the-content-attribute) and Microdata syntax allow the use of a \"content=\" attribute for publishing simple machine-readable values alongside more human-friendly formatting.\\n* Use values from 0123456789 (Unicode 'DIGIT ZERO' (U+0030) to 'DIGIT NINE' (U+0039)) rather than superficially similar Unicode symbols.\n      ",
        "expectedTypes": [
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/DonateAction",
          "https://schema.org/Offer",
          "https://schema.org/PriceSpecification",
          "https://schema.org/TradeAction"
        ]
      },
      {
        "name": "priceCurrency",
        "type": "https://schema.org/Text",
        "description": "The currency of the price, or a price component when attached to [[PriceSpecification]] and its subtypes.\\n\\nUse standard formats: [ISO 4217 currency format](http://en.wikipedia.org/wiki/ISO_4217), e.g. \"USD\"; [Ticker symbol](https://en.wikipedia.org/wiki/List_of_cryptocurrencies) for cryptocurrencies, e.g. \"BTC\"; well known names for [Local Exchange Trading Systems](https://en.wikipedia.org/wiki/Local_exchange_trading_system) (LETS) and other currency types, e.g. \"Ithaca HOUR\".",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/DonateAction",
          "https://schema.org/Offer",
          "https://schema.org/PriceSpecification",
          "https://schema.org/Reservation",
          "https://schema.org/Ticket",
          "https://schema.org/TradeAction"
        ]
      },
      {
        "name": "validForMemberTier",
        "type": "https://schema.org/MemberProgramTier",
        "description": "The membership program tier(s) an Offer (or a PriceSpecification, OfferShippingDetails, or MerchantReturnPolicy under an Offer) is valid for.",
        "expectedTypes": [
          "https://schema.org/MemberProgramTier"
        ],
        "rangeTypes": [
          "https://schema.org/MemberProgramTier"
        ],
        "domainTypes": [
          "https://schema.org/MerchantReturnPolicy",
          "https://schema.org/Offer",
          "https://schema.org/OfferShippingDetails",
          "https://schema.org/PriceSpecification",
          "https://schema.org/ShippingService"
        ]
      },
      {
        "name": "validFrom",
        "type": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "description": "The date when the item becomes valid.",
        "expectedTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/Certification",
          "https://schema.org/Demand",
          "https://schema.org/FinancialIncentive",
          "https://schema.org/LocationFeatureSpecification",
          "https://schema.org/MonetaryAmount",
          "https://schema.org/Offer",
          "https://schema.org/OpeningHoursSpecification",
          "https://schema.org/Permit",
          "https://schema.org/PriceSpecification"
        ]
      },
      {
        "name": "validThrough",
        "type": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "description": "The date after when the item is not valid. For example the end of an offer, salary period, or a period of opening hours.",
        "expectedTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/Demand",
          "https://schema.org/FinancialIncentive",
          "https://schema.org/JobPosting",
          "https://schema.org/LocationFeatureSpecification",
          "https://schema.org/MonetaryAmount",
          "https://schema.org/Offer",
          "https://schema.org/OpeningHoursSpecification",
          "https://schema.org/PriceSpecification"
        ]
      },
      {
        "name": "valueAddedTaxIncluded",
        "type": "https://schema.org/Boolean",
        "description": "Specifies whether the applicable value-added tax (VAT) is included in the price specification or not.",
        "expectedTypes": [
          "https://schema.org/Boolean"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean"
        ],
        "domainTypes": [
          "https://schema.org/PriceSpecification"
        ]
      }
    ]
  },
  {
    "name": "PriceTypeEnumeration",
    "type": "https://schema.org/PriceTypeEnumeration",
    "source": "generated",
    "description": "Enumerates different price types, for example list price, invoice price, and sale price.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "InvoicePrice",
        "type": "https://schema.org/InvoicePrice",
        "description": "Represents the invoice price of an offered product."
      },
      {
        "name": "ListPrice",
        "type": "https://schema.org/ListPrice",
        "description": "Represents the list price of an offered product. Typically the same as the [MSRP](https://schema.org/MSRP)."
      },
      {
        "name": "MaximumRetailPrice",
        "type": "https://schema.org/MaximumRetailPrice",
        "description": "The maximum retail price (MRP) of a product sold in India."
      },
      {
        "name": "MinimumAdvertisedPrice",
        "type": "https://schema.org/MinimumAdvertisedPrice",
        "description": "Represents the minimum advertised price (\"MAP\") (as dictated by the manufacturer) of an offered product."
      },
      {
        "name": "MSRP",
        "type": "https://schema.org/MSRP",
        "description": "Represents the manufacturer suggested retail price (\"MSRP\") of an offered product."
      },
      {
        "name": "RegularPrice",
        "type": "https://schema.org/RegularPrice",
        "description": "Represents the regular price of an offered product. This is usually the advertised price before a temporary sale. Once the sale period ends the advertised price will go back to the regular price."
      },
      {
        "name": "SalePrice",
        "type": "https://schema.org/SalePrice",
        "description": "Represents a sale price (usually active for a limited period) of an offered product."
      },
      {
        "name": "SRP",
        "type": "https://schema.org/SRP",
        "description": "Represents the suggested retail price (\"SRP\") of an offered product."
      },
      {
        "name": "StrikethroughPrice",
        "type": "https://schema.org/StrikethroughPrice",
        "description": "Represents the strikethrough price (the previous advertised price) of an offered product."
      }
    ]
  },
  {
    "name": "Product",
    "type": "https://spec.edmcouncil.org/fibo/ontology/FND/ProductsAndServices/ProductsAndServices/Product",
    "source": "generated"
  },
  {
    "name": "Product",
    "type": "https://schema.org/Product",
    "source": "generated",
    "description": "Any offered product or service. For example: a pair of shoes; a concert ticket; the rental of a car; a haircut; or an episode of a TV show streamed online.",
    "parentTypes": [
      "https://schema.org/Thing"
    ],
    "properties": [
      {
        "name": "additionalProperty",
        "type": "https://schema.org/PropertyValue",
        "description": "A property-value pair representing an additional characteristic of the entity, e.g. a product feature or another characteristic for which there is no matching property in schema.org.\\n\\nNote: Publishers should be aware that applications designed to use specific schema.org properties (e.g. https://schema.org/width, https://schema.org/color, https://schema.org/gtin13, ...) will typically expect such data to be provided using those properties, rather than using the generic property/value mechanism.\n",
        "expectedTypes": [
          "https://schema.org/PropertyValue"
        ],
        "rangeTypes": [
          "https://schema.org/PropertyValue"
        ],
        "domainTypes": [
          "https://schema.org/MerchantReturnPolicy",
          "https://schema.org/Offer",
          "https://schema.org/Place",
          "https://schema.org/Product",
          "https://schema.org/QualitativeValue",
          "https://schema.org/QuantitativeValue"
        ]
      },
      {
        "name": "aggregateRating",
        "type": "https://schema.org/AggregateRating",
        "description": "The overall rating, based on a collection of reviews or ratings, of the item.",
        "expectedTypes": [
          "https://schema.org/AggregateRating"
        ],
        "rangeTypes": [
          "https://schema.org/AggregateRating"
        ],
        "domainTypes": [
          "https://schema.org/Brand",
          "https://schema.org/CreativeWork",
          "https://schema.org/Event",
          "https://schema.org/Offer",
          "https://schema.org/Organization",
          "https://schema.org/Place",
          "https://schema.org/Product",
          "https://schema.org/Service"
        ]
      },
      {
        "name": "asin",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "An Amazon Standard Identification Number (ASIN) is a 10-character alphanumeric unique identifier assigned by Amazon.com and its partners for product identification within the Amazon organization (summary from [Wikipedia](https://en.wikipedia.org/wiki/Amazon_Standard_Identification_Number)'s article).\n\nNote also that this is a definition for how to include ASINs in Schema.org data, and not a definition of ASINs in general - see documentation from Amazon for authoritative details.\nASINs are most commonly encoded as text strings, but the [asin] property supports URL/URI as potential values too.",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Demand",
          "https://schema.org/Offer",
          "https://schema.org/Product"
        ]
      },
      {
        "name": "audience",
        "type": "https://schema.org/Audience",
        "description": "An intended audience, i.e. a group for whom something was created.",
        "expectedTypes": [
          "https://schema.org/Audience"
        ],
        "rangeTypes": [
          "https://schema.org/Audience"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Event",
          "https://schema.org/LodgingBusiness",
          "https://schema.org/PlayAction",
          "https://schema.org/Product",
          "https://schema.org/Service"
        ]
      },
      {
        "name": "authorizedRepresentative",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "An organization or person officially appointed to act on behalf of the manufacturer in a specific region or context.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Product"
        ]
      },
      {
        "name": "award",
        "type": "https://schema.org/Text",
        "description": "An award won by or for this item.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Organization",
          "https://schema.org/Person",
          "https://schema.org/Product",
          "https://schema.org/Service"
        ]
      },
      {
        "name": "awards",
        "type": "https://schema.org/Text",
        "description": "Awards won by or for this item.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Organization",
          "https://schema.org/Person",
          "https://schema.org/Product"
        ],
        "supersededBy": "https://schema.org/award"
      },
      {
        "name": "brand",
        "type": [
          "https://schema.org/Brand",
          "https://schema.org/Organization"
        ],
        "description": "The brand(s) associated with a product or service, or the brand(s) maintained by an organization or business person.",
        "expectedTypes": [
          "https://schema.org/Brand",
          "https://schema.org/Organization"
        ],
        "rangeTypes": [
          "https://schema.org/Brand",
          "https://schema.org/Organization"
        ],
        "domainTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person",
          "https://schema.org/Product",
          "https://schema.org/Service"
        ]
      },
      {
        "name": "category",
        "type": [
          "https://schema.org/CategoryCode",
          "https://schema.org/PhysicalActivityCategory",
          "https://schema.org/Text",
          "https://schema.org/Thing",
          "https://schema.org/URL"
        ],
        "description": "A category for the item. Greater signs or slashes can be used to informally indicate a category hierarchy.",
        "expectedTypes": [
          "https://schema.org/CategoryCode",
          "https://schema.org/PhysicalActivityCategory",
          "https://schema.org/Text",
          "https://schema.org/Thing",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/CategoryCode",
          "https://schema.org/PhysicalActivityCategory",
          "https://schema.org/Text",
          "https://schema.org/Thing",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/ActionAccessSpecification",
          "https://schema.org/Guide",
          "https://schema.org/Invoice",
          "https://schema.org/Offer",
          "https://schema.org/PhysicalActivity",
          "https://schema.org/Product",
          "https://schema.org/Recommendation",
          "https://schema.org/Service",
          "https://schema.org/SpecialAnnouncement"
        ]
      },
      {
        "name": "color",
        "type": "https://schema.org/Text",
        "description": "The color of the product.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Product"
        ]
      },
      {
        "name": "colorSwatch",
        "type": [
          "https://schema.org/ImageObject",
          "https://schema.org/URL"
        ],
        "description": "A color swatch image, visualizing the color of a [[Product]]. Should match the textual description specified in the [[color]] property. This can be a URL or a fully described ImageObject.",
        "expectedTypes": [
          "https://schema.org/ImageObject",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/ImageObject",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Product"
        ]
      },
      {
        "name": "consumerNotice",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/TextObject",
          "https://schema.org/URL",
          "https://schema.org/WebContent"
        ],
        "description": "A consumer notice, such as a safety warning or mandatory information, related to the product.",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/TextObject",
          "https://schema.org/URL",
          "https://schema.org/WebContent"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/TextObject",
          "https://schema.org/URL",
          "https://schema.org/WebContent"
        ],
        "domainTypes": [
          "https://schema.org/Product"
        ]
      },
      {
        "name": "countryOfAssembly",
        "type": "https://schema.org/Text",
        "description": "The place where the product was assembled.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Product"
        ]
      },
      {
        "name": "countryOfLastProcessing",
        "type": "https://schema.org/Text",
        "description": "The place where the item (typically [[Product]]) was last processed and tested before importation.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Product"
        ]
      },
      {
        "name": "countryOfOrigin",
        "type": "https://schema.org/Country",
        "description": "The country of origin of something, including products as well as creative  works such as movie and TV content.\n\nIn the case of TV and movie, this would be the country of the principle offices of the production company or individual responsible for the movie. For other kinds of [[CreativeWork]] it is difficult to provide fully general guidance, and properties such as [[contentLocation]] and [[locationCreated]] may be more applicable.\n\nIn the case of products, the country of origin of the product. The exact interpretation of this may vary by context and product type, and cannot be fully enumerated here.",
        "expectedTypes": [
          "https://schema.org/Country"
        ],
        "rangeTypes": [
          "https://schema.org/Country"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Movie",
          "https://schema.org/Product",
          "https://schema.org/TVEpisode",
          "https://schema.org/TVSeason",
          "https://schema.org/TVSeries"
        ]
      },
      {
        "name": "depth",
        "type": [
          "https://schema.org/Distance",
          "https://schema.org/QuantitativeValue"
        ],
        "description": "The depth of the item.",
        "expectedTypes": [
          "https://schema.org/Distance",
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/Distance",
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/OfferShippingDetails",
          "https://schema.org/Product",
          "https://schema.org/ShippingConditions",
          "https://schema.org/VisualArtwork"
        ]
      },
      {
        "name": "displayLocation",
        "type": "https://schema.org/Place",
        "description": "The location at which an item can be viewed or experienced in-person.",
        "expectedTypes": [
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Product"
        ]
      },
      {
        "name": "funding",
        "type": "https://schema.org/Grant",
        "description": "A [[Grant]] that directly or indirectly provide funding or sponsorship for this item. See also [[ownershipFundingInfo]].",
        "expectedTypes": [
          "https://schema.org/Grant"
        ],
        "rangeTypes": [
          "https://schema.org/Grant"
        ],
        "domainTypes": [
          "https://schema.org/BioChemEntity",
          "https://schema.org/CreativeWork",
          "https://schema.org/Event",
          "https://schema.org/MedicalEntity",
          "https://schema.org/Organization",
          "https://schema.org/Person",
          "https://schema.org/Product"
        ],
        "inverseOf": "https://schema.org/fundedItem"
      },
      {
        "name": "gtin",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "A Global Trade Item Number ([GTIN](https://www.gs1.org/standards/id-keys/gtin)). GTINs identify trade items, including products and services, using numeric identification codes.\n\nA correct [[gtin]] value should be a valid GTIN, which means that it should be an all-numeric string of either 8, 12, 13 or 14 digits, or a \"GS1 Digital Link\" URL based on such a string. The numeric component should also have a [valid GS1 check digit](https://www.gs1.org/services/check-digit-calculator) and meet the other rules for valid GTINs. See also [GS1's GTIN Summary](http://www.gs1.org/barcodes/technical/idkeys/gtin) and [Wikipedia](https://en.wikipedia.org/wiki/Global_Trade_Item_Number) for more details. Left-padding of the gtin values is not required or encouraged. The [[gtin]] property generalizes the earlier [[gtin8]], [[gtin12]], [[gtin13]], and [[gtin14]] properties.\n\nThe GS1 [digital link specifications](https://www.gs1.org/standards/Digital-Link/) expresses GTINs as URLs (URIs, IRIs, etc.).\nDigital Links should be populated into the [[hasGS1DigitalLink]] attribute.\n\nNote also that this is a definition for how to include GTINs in Schema.org data, and not a definition of GTINs in general - see the GS1 documentation for authoritative details.",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Demand",
          "https://schema.org/Offer",
          "https://schema.org/Product"
        ]
      },
      {
        "name": "gtin12",
        "type": "https://schema.org/Text",
        "description": "The GTIN-12 code of the product, or the product to which the offer refers. The GTIN-12 is the 12-digit GS1 Identification Key composed of a U.P.C. Company Prefix, Item Reference, and Check Digit used to identify trade items. See [GS1 GTIN Summary](http://www.gs1.org/barcodes/technical/idkeys/gtin) for more details.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Demand",
          "https://schema.org/Offer",
          "https://schema.org/Product"
        ]
      },
      {
        "name": "gtin13",
        "type": "https://schema.org/Text",
        "description": "The GTIN-13 code of the product, or the product to which the offer refers. This is equivalent to 13-digit ISBN codes and EAN UCC-13. Former 12-digit UPC codes can be converted into a GTIN-13 code by simply adding a preceding zero. See [GS1 GTIN Summary](http://www.gs1.org/barcodes/technical/idkeys/gtin) for more details.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Demand",
          "https://schema.org/Offer",
          "https://schema.org/Product"
        ]
      },
      {
        "name": "gtin14",
        "type": "https://schema.org/Text",
        "description": "The GTIN-14 code of the product, or the product to which the offer refers. See [GS1 GTIN Summary](http://www.gs1.org/barcodes/technical/idkeys/gtin) for more details.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Demand",
          "https://schema.org/Offer",
          "https://schema.org/Product"
        ]
      },
      {
        "name": "gtin8",
        "type": "https://schema.org/Text",
        "description": "The GTIN-8 code of the product, or the product to which the offer refers. This code is also known as EAN/UCC-8 or 8-digit EAN. See [GS1 GTIN Summary](http://www.gs1.org/barcodes/technical/idkeys/gtin) for more details.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Demand",
          "https://schema.org/Offer",
          "https://schema.org/Product"
        ]
      },
      {
        "name": "hasAdultConsideration",
        "type": "https://schema.org/AdultOrientedEnumeration",
        "description": "Used to tag an item to be intended or suitable for consumption or use by adults only.",
        "expectedTypes": [
          "https://schema.org/AdultOrientedEnumeration"
        ],
        "rangeTypes": [
          "https://schema.org/AdultOrientedEnumeration"
        ],
        "domainTypes": [
          "https://schema.org/Offer",
          "https://schema.org/Product"
        ]
      },
      {
        "name": "hasCertification",
        "type": "https://schema.org/Certification",
        "description": "Certification information about a product, organization, service, place, or person.",
        "expectedTypes": [
          "https://schema.org/Certification"
        ],
        "rangeTypes": [
          "https://schema.org/Certification"
        ],
        "domainTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person",
          "https://schema.org/Place",
          "https://schema.org/Product",
          "https://schema.org/Service"
        ]
      },
      {
        "name": "hasDigitalProductPassport",
        "type": [
          "https://schema.org/DigitalProductPassport",
          "https://schema.org/URL"
        ],
        "description": "A link to a Digital Product Passport (DPP) or a digital record detailing the lifecycle, sustainability, and compliance data for this product or offer. This may be a direct URL, a GS1 Digital Link URI, or a nested DigitalProductPassport object. Note: This property is aligned with the IANA 'dpp' link relation and the GS1 Web Vocabulary 'dpp' link type.",
        "expectedTypes": [
          "https://schema.org/DigitalProductPassport",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/DigitalProductPassport",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Offer",
          "https://schema.org/Product"
        ]
      },
      {
        "name": "hasEnergyConsumptionDetails",
        "type": "https://schema.org/EnergyConsumptionDetails",
        "description": "Defines the energy efficiency Category (also known as \"class\" or \"rating\") for a product according to an international energy efficiency standard.",
        "expectedTypes": [
          "https://schema.org/EnergyConsumptionDetails"
        ],
        "rangeTypes": [
          "https://schema.org/EnergyConsumptionDetails"
        ],
        "domainTypes": [
          "https://schema.org/Product"
        ]
      },
      {
        "name": "hasGS1DigitalLink",
        "type": "https://schema.org/URL",
        "description": "The <a href=\"https://www.gs1.org/standards/gs1-digital-link\">GS1 digital link</a> associated with the object. This URL should conform to the particular requirements of digital links. The link should only contain the Application Identifiers (AIs) that are relevant for the entity being annotated, for instance a [[Product]] or an [[Organization]], and for the correct granularity. In particular, for products:<ul><li>A Digital Link that contains a serial number (AI <code>21</code>) should only be present on instances of [[IndividualProduct]]</li><li>A Digital Link that contains a lot number (AI <code>10</code>) should be annotated as [[SomeProducts]] if only products from that lot are sold, or [[IndividualProduct]] if there is only a specific product.</li><li>A Digital Link that contains a global model number (AI <code>8013</code>) should be attached to a [[Product]] or a [[ProductModel]].</li></ul> Other item types should be adapted similarly.",
        "expectedTypes": [
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Offer",
          "https://schema.org/Organization",
          "https://schema.org/Place",
          "https://schema.org/Product"
        ]
      },
      {
        "name": "hasMeasurement",
        "type": "https://schema.org/QuantitativeValue",
        "description": "A measurement of an item, For example, the inseam of pants, the wheel size of a bicycle, the gauge of a screw, or the carbon footprint measured for certification by an authority. Usually an exact measurement, but can also be a range of measurements for adjustable products, for example belts and ski bindings.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/Certification",
          "https://schema.org/Offer",
          "https://schema.org/Product",
          "https://schema.org/SizeSpecification"
        ]
      },
      {
        "name": "hasMerchantReturnPolicy",
        "type": "https://schema.org/MerchantReturnPolicy",
        "description": "Specifies a MerchantReturnPolicy that may be applicable.",
        "expectedTypes": [
          "https://schema.org/MerchantReturnPolicy"
        ],
        "rangeTypes": [
          "https://schema.org/MerchantReturnPolicy"
        ],
        "domainTypes": [
          "https://schema.org/Offer",
          "https://schema.org/Organization",
          "https://schema.org/Product"
        ]
      },
      {
        "name": "hasProductReturnPolicy",
        "type": "https://schema.org/ProductReturnPolicy",
        "description": "Indicates a ProductReturnPolicy that may be applicable.",
        "expectedTypes": [
          "https://schema.org/ProductReturnPolicy"
        ],
        "rangeTypes": [
          "https://schema.org/ProductReturnPolicy"
        ],
        "domainTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Product"
        ],
        "supersededBy": "https://schema.org/hasMerchantReturnPolicy"
      },
      {
        "name": "height",
        "type": [
          "https://schema.org/Distance",
          "https://schema.org/QuantitativeValue"
        ],
        "description": "The height of the item.",
        "expectedTypes": [
          "https://schema.org/Distance",
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/Distance",
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/MediaObject",
          "https://schema.org/OfferShippingDetails",
          "https://schema.org/Person",
          "https://schema.org/Product",
          "https://schema.org/ShippingConditions",
          "https://schema.org/VisualArtwork"
        ]
      },
      {
        "name": "importer",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "An organization or person who imports the product into a specific market or region.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Product"
        ]
      },
      {
        "name": "inProductGroupWithID",
        "type": "https://schema.org/Text",
        "description": "Indicates the [[productGroupID]] for a [[ProductGroup]] that this product [[isVariantOf]]. ",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Product"
        ]
      },
      {
        "name": "isAccessoryOrSparePartFor",
        "type": "https://schema.org/Product",
        "description": "A pointer to another product (or multiple products) for which this product is an accessory or spare part.",
        "expectedTypes": [
          "https://schema.org/Product"
        ],
        "rangeTypes": [
          "https://schema.org/Product"
        ],
        "domainTypes": [
          "https://schema.org/Product"
        ]
      },
      {
        "name": "isConsumableFor",
        "type": "https://schema.org/Product",
        "description": "A pointer to another product (or multiple products) for which this product is a consumable.",
        "expectedTypes": [
          "https://schema.org/Product"
        ],
        "rangeTypes": [
          "https://schema.org/Product"
        ],
        "domainTypes": [
          "https://schema.org/Product"
        ]
      },
      {
        "name": "isFamilyFriendly",
        "type": "https://schema.org/Boolean",
        "description": "Indicates whether this content is family friendly.",
        "expectedTypes": [
          "https://schema.org/Boolean"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Offer",
          "https://schema.org/Product"
        ]
      },
      {
        "name": "isOftenBoughtWith",
        "type": "https://schema.org/Product",
        "description": "Indicates a product that is often bought with the described product.",
        "expectedTypes": [
          "https://schema.org/Product"
        ],
        "rangeTypes": [
          "https://schema.org/Product"
        ],
        "domainTypes": [
          "https://schema.org/Product"
        ]
      },
      {
        "name": "isRelatedTo",
        "type": [
          "https://schema.org/Product",
          "https://schema.org/Service"
        ],
        "description": "A pointer to another, somehow related product (or multiple products).",
        "expectedTypes": [
          "https://schema.org/Product",
          "https://schema.org/Service"
        ],
        "rangeTypes": [
          "https://schema.org/Product",
          "https://schema.org/Service"
        ],
        "domainTypes": [
          "https://schema.org/Product",
          "https://schema.org/Service"
        ]
      },
      {
        "name": "isSimilarTo",
        "type": [
          "https://schema.org/Product",
          "https://schema.org/Service"
        ],
        "description": "A pointer to another, functionally similar product (or multiple products).",
        "expectedTypes": [
          "https://schema.org/Product",
          "https://schema.org/Service"
        ],
        "rangeTypes": [
          "https://schema.org/Product",
          "https://schema.org/Service"
        ],
        "domainTypes": [
          "https://schema.org/Product",
          "https://schema.org/Service"
        ]
      },
      {
        "name": "isVariantOf",
        "type": [
          "https://schema.org/ProductGroup",
          "https://schema.org/ProductModel"
        ],
        "description": "Indicates the kind of product that this is a variant of. In the case of [[ProductModel]], this is a pointer (from a ProductModel) to a base product from which this product is a variant. It is safe to infer that the variant inherits all product features from the base model, unless defined locally. This is not transitive. In the case of a [[ProductGroup]], the group description also serves as a template, representing a set of Products that vary on explicitly defined, specific dimensions only (so it defines both a set of variants, as well as which values distinguish amongst those variants). When used with [[ProductGroup]], this property can apply to any [[Product]] included in the group.",
        "expectedTypes": [
          "https://schema.org/ProductGroup",
          "https://schema.org/ProductModel"
        ],
        "rangeTypes": [
          "https://schema.org/ProductGroup",
          "https://schema.org/ProductModel"
        ],
        "domainTypes": [
          "https://schema.org/Product",
          "https://schema.org/ProductModel"
        ],
        "inverseOf": "https://schema.org/hasVariant"
      },
      {
        "name": "itemCondition",
        "type": "https://schema.org/OfferItemCondition",
        "description": "A predefined value from OfferItemCondition specifying the condition of the product or service, or the products or services included in the offer. Also used for product return policies to specify the condition of products accepted for returns.",
        "expectedTypes": [
          "https://schema.org/OfferItemCondition"
        ],
        "rangeTypes": [
          "https://schema.org/OfferItemCondition"
        ],
        "domainTypes": [
          "https://schema.org/Demand",
          "https://schema.org/MerchantReturnPolicy",
          "https://schema.org/Offer",
          "https://schema.org/Product"
        ]
      },
      {
        "name": "keywords",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "Keywords or tags used to describe some item. Multiple textual entries in a keywords list are typically delimited by commas, or by repeating the property.",
        "expectedTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Event",
          "https://schema.org/Organization",
          "https://schema.org/Place",
          "https://schema.org/Product"
        ]
      },
      {
        "name": "logo",
        "type": [
          "https://schema.org/ImageObject",
          "https://schema.org/URL"
        ],
        "description": "An associated logo.",
        "expectedTypes": [
          "https://schema.org/ImageObject",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/ImageObject",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Brand",
          "https://schema.org/Certification",
          "https://schema.org/Organization",
          "https://schema.org/Place",
          "https://schema.org/Product",
          "https://schema.org/Service"
        ]
      },
      {
        "name": "manufacturer",
        "type": "https://schema.org/Organization",
        "description": "The manufacturer of the product.",
        "expectedTypes": [
          "https://schema.org/Organization"
        ],
        "rangeTypes": [
          "https://schema.org/Organization"
        ],
        "domainTypes": [
          "https://schema.org/Product"
        ]
      },
      {
        "name": "material",
        "type": [
          "https://schema.org/Product",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "A material that something is made from, e.g. leather, wool, cotton, paper.",
        "expectedTypes": [
          "https://schema.org/Product",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Product",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Product"
        ]
      },
      {
        "name": "mobileUrl",
        "type": "https://schema.org/Text",
        "description": "The [[mobileUrl]] property is provided for specific situations in which data consumers need to determine whether one of several provided URLs is a dedicated 'mobile site'.\n\nTo discourage over-use, and reflecting intial usecases, the property is expected only on [[Product]] and [[Offer]], rather than [[Thing]]. The general trend in web technology is towards [responsive design](https://en.wikipedia.org/wiki/Responsive_web_design) in which content can be flexibly adapted to a wide range of browsing environments. Pages and sites referenced with the long-established [[url]] property should ideally also be usable on a wide variety of devices, including mobile phones. In most cases, it would be pointless and counter productive to attempt to update all [[url]] markup to use [[mobileUrl]] for more mobile-oriented pages. The property is intended for the case when items (primarily [[Product]] and [[Offer]]) have extra URLs hosted on an additional \"mobile site\" alongside the main one. It should not be taken as an endorsement of this publication style.\n    ",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Offer",
          "https://schema.org/Product"
        ]
      },
      {
        "name": "model",
        "type": [
          "https://schema.org/ProductModel",
          "https://schema.org/Text"
        ],
        "description": "The model of the product. Use with the URL of a ProductModel or a textual representation of the model identifier. The URL of the ProductModel can be from an external source. It is recommended to additionally provide strong product identifiers via the gtin8/gtin13/gtin14 and mpn properties.",
        "expectedTypes": [
          "https://schema.org/ProductModel",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/ProductModel",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Product"
        ]
      },
      {
        "name": "mpn",
        "type": "https://schema.org/Text",
        "description": "The Manufacturer Part Number (MPN) of the product, or the product to which the offer refers.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Demand",
          "https://schema.org/Offer",
          "https://schema.org/Product"
        ]
      },
      {
        "name": "negativeNotes",
        "type": [
          "https://schema.org/ItemList",
          "https://schema.org/ListItem",
          "https://schema.org/Text",
          "https://schema.org/WebContent"
        ],
        "description": "Provides negative considerations regarding something, most typically in pro/con lists for reviews (alongside [[positiveNotes]]). For symmetry \n\nIn the case of a [[Review]], the property describes the [[itemReviewed]] from the perspective of the review; in the case of a [[Product]], the product itself is being described. Since product descriptions \ntend to emphasise positive claims, it may be relatively unusual to find [[negativeNotes]] used in this way. Nevertheless for the sake of symmetry, [[negativeNotes]] can be used on [[Product]].\n\nThe property values can be expressed either as unstructured text (repeated as necessary), or if ordered, as a list (in which case the most negative is at the beginning of the list).",
        "expectedTypes": [
          "https://schema.org/ItemList",
          "https://schema.org/ListItem",
          "https://schema.org/Text",
          "https://schema.org/WebContent"
        ],
        "rangeTypes": [
          "https://schema.org/ItemList",
          "https://schema.org/ListItem",
          "https://schema.org/Text",
          "https://schema.org/WebContent"
        ],
        "domainTypes": [
          "https://schema.org/Product",
          "https://schema.org/Review"
        ]
      },
      {
        "name": "nsn",
        "type": "https://schema.org/Text",
        "description": "Indicates the [NATO stock number](https://en.wikipedia.org/wiki/NATO_Stock_Number) (nsn) of a [[Product]]. ",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Product"
        ]
      },
      {
        "name": "offers",
        "type": [
          "https://schema.org/Demand",
          "https://schema.org/Offer"
        ],
        "description": "An offer to provide this item&#x2014;for example, an offer to sell a product, rent the DVD of a movie, perform a service, or give away tickets to an event. Use [[businessFunction]] to indicate the kind of transaction offered, i.e. sell, lease, etc. This property can also be used to describe a [[Demand]]. While this property is listed as expected on a number of common types, it can be used in others. In that case, using a second type, such as Product or a subtype of Product, can clarify the nature of the offer.\n      ",
        "expectedTypes": [
          "https://schema.org/Demand",
          "https://schema.org/Offer"
        ],
        "rangeTypes": [
          "https://schema.org/Demand",
          "https://schema.org/Offer"
        ],
        "domainTypes": [
          "https://schema.org/AggregateOffer",
          "https://schema.org/CreativeWork",
          "https://schema.org/EducationalOccupationalProgram",
          "https://schema.org/Event",
          "https://schema.org/MenuItem",
          "https://schema.org/Product",
          "https://schema.org/Service",
          "https://schema.org/Trip"
        ],
        "inverseOf": "https://schema.org/itemOffered"
      },
      {
        "name": "pattern",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text"
        ],
        "description": "A pattern that something has, for example 'polka dot', 'striped', 'Canadian flag'. Values are typically expressed as text, although links to controlled value schemes are also supported.",
        "expectedTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Product"
        ]
      },
      {
        "name": "positiveNotes",
        "type": [
          "https://schema.org/ItemList",
          "https://schema.org/ListItem",
          "https://schema.org/Text",
          "https://schema.org/WebContent"
        ],
        "description": "Provides positive considerations regarding something, for example product highlights or (alongside [[negativeNotes]]) pro/con lists for reviews.\n\nIn the case of a [[Review]], the property describes the [[itemReviewed]] from the perspective of the review; in the case of a [[Product]], the product itself is being described.\n\nThe property values can be expressed either as unstructured text (repeated as necessary), or if ordered, as a list (in which case the most positive is at the beginning of the list).",
        "expectedTypes": [
          "https://schema.org/ItemList",
          "https://schema.org/ListItem",
          "https://schema.org/Text",
          "https://schema.org/WebContent"
        ],
        "rangeTypes": [
          "https://schema.org/ItemList",
          "https://schema.org/ListItem",
          "https://schema.org/Text",
          "https://schema.org/WebContent"
        ],
        "domainTypes": [
          "https://schema.org/Product",
          "https://schema.org/Review"
        ]
      },
      {
        "name": "productID",
        "type": "https://schema.org/Text",
        "description": "The product identifier, such as ISBN. For example: ``` meta itemprop=\"productID\" content=\"isbn:123-456-789\" ```.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Product"
        ]
      },
      {
        "name": "productionDate",
        "type": "https://schema.org/Date",
        "description": "The date of production of the item, e.g. vehicle.",
        "expectedTypes": [
          "https://schema.org/Date"
        ],
        "rangeTypes": [
          "https://schema.org/Date"
        ],
        "domainTypes": [
          "https://schema.org/Product",
          "https://schema.org/Vehicle"
        ]
      },
      {
        "name": "purchaseDate",
        "type": "https://schema.org/Date",
        "description": "The date the item, e.g. vehicle, was purchased by the current owner.",
        "expectedTypes": [
          "https://schema.org/Date"
        ],
        "rangeTypes": [
          "https://schema.org/Date"
        ],
        "domainTypes": [
          "https://schema.org/Product",
          "https://schema.org/Vehicle"
        ]
      },
      {
        "name": "recycledContentPercentage",
        "type": "https://schema.org/Number",
        "description": "The percentage of recycled material in the product.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/Product"
        ]
      },
      {
        "name": "releaseDate",
        "type": "https://schema.org/Date",
        "description": "The release date of a product or product model. This can be used to distinguish the exact variant of a product.",
        "expectedTypes": [
          "https://schema.org/Date"
        ],
        "rangeTypes": [
          "https://schema.org/Date"
        ],
        "domainTypes": [
          "https://schema.org/Product"
        ]
      },
      {
        "name": "review",
        "type": "https://schema.org/Review",
        "description": "A review of the item.",
        "expectedTypes": [
          "https://schema.org/Review"
        ],
        "rangeTypes": [
          "https://schema.org/Review"
        ],
        "domainTypes": [
          "https://schema.org/Brand",
          "https://schema.org/CreativeWork",
          "https://schema.org/Event",
          "https://schema.org/Offer",
          "https://schema.org/Organization",
          "https://schema.org/Place",
          "https://schema.org/Product",
          "https://schema.org/Service"
        ]
      },
      {
        "name": "reviews",
        "type": "https://schema.org/Review",
        "description": "Review of the item.",
        "expectedTypes": [
          "https://schema.org/Review"
        ],
        "rangeTypes": [
          "https://schema.org/Review"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Offer",
          "https://schema.org/Organization",
          "https://schema.org/Place",
          "https://schema.org/Product"
        ],
        "supersededBy": "https://schema.org/review"
      },
      {
        "name": "size",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/QuantitativeValue",
          "https://schema.org/SizeSpecification",
          "https://schema.org/Text"
        ],
        "description": "A standardized size of a product or creative work, specified either through a simple textual string (for example 'XL', '32Wx34L'), a  QuantitativeValue with a unitCode, or a comprehensive and structured [[SizeSpecification]]; in other cases, the [[width]], [[height]], [[depth]] and [[weight]] properties may be more applicable. ",
        "expectedTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/QuantitativeValue",
          "https://schema.org/SizeSpecification",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/QuantitativeValue",
          "https://schema.org/SizeSpecification",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Product"
        ]
      },
      {
        "name": "sku",
        "type": "https://schema.org/Text",
        "description": "The Stock Keeping Unit (SKU), i.e. a merchant-specific identifier for a product or service, or the product to which the offer refers.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Demand",
          "https://schema.org/Offer",
          "https://schema.org/Product"
        ]
      },
      {
        "name": "slogan",
        "type": "https://schema.org/Text",
        "description": "A slogan or motto associated with the item.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Brand",
          "https://schema.org/Organization",
          "https://schema.org/Place",
          "https://schema.org/Product",
          "https://schema.org/Service"
        ]
      },
      {
        "name": "specification",
        "type": "https://schema.org/PropertyValue",
        "description": "A specification of the product, often grouped by a section header/name. This is a cleaner alternative to additionalProperty for strict retail product specifications.",
        "expectedTypes": [
          "https://schema.org/PropertyValue"
        ],
        "rangeTypes": [
          "https://schema.org/PropertyValue"
        ],
        "domainTypes": [
          "https://schema.org/Product"
        ]
      },
      {
        "name": "substanceOfConcern",
        "type": [
          "https://schema.org/ChemicalSubstance",
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "A substance of concern (SoC) contained within the product, typically based on regulatory lists like REACH or RoHS.",
        "expectedTypes": [
          "https://schema.org/ChemicalSubstance",
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/ChemicalSubstance",
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Product"
        ]
      },
      {
        "name": "weight",
        "type": [
          "https://schema.org/Mass",
          "https://schema.org/QuantitativeValue"
        ],
        "description": "The weight of the product or person.",
        "expectedTypes": [
          "https://schema.org/Mass",
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/Mass",
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/OfferShippingDetails",
          "https://schema.org/Person",
          "https://schema.org/Product",
          "https://schema.org/ShippingConditions",
          "https://schema.org/VisualArtwork"
        ]
      },
      {
        "name": "width",
        "type": [
          "https://schema.org/Distance",
          "https://schema.org/QuantitativeValue"
        ],
        "description": "The width of the item.",
        "expectedTypes": [
          "https://schema.org/Distance",
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/Distance",
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/MediaObject",
          "https://schema.org/OfferShippingDetails",
          "https://schema.org/Product",
          "https://schema.org/ShippingConditions",
          "https://schema.org/VisualArtwork"
        ]
      }
    ]
  },
  {
    "name": "ProductCollection",
    "type": "https://schema.org/ProductCollection",
    "source": "generated",
    "description": "A set of products (either [[ProductGroup]]s or specific variants) that are listed together e.g. in an [[Offer]].",
    "parentTypes": [
      "https://schema.org/Collection",
      "https://schema.org/Product"
    ],
    "properties": [
      {
        "name": "includesObject",
        "type": "https://schema.org/TypeAndQuantityNode",
        "description": "This links to a node or nodes indicating the exact quantity of the products included in  an [[Offer]] or [[ProductCollection]].",
        "expectedTypes": [
          "https://schema.org/TypeAndQuantityNode"
        ],
        "rangeTypes": [
          "https://schema.org/TypeAndQuantityNode"
        ],
        "domainTypes": [
          "https://schema.org/Demand",
          "https://schema.org/Offer",
          "https://schema.org/ProductCollection"
        ]
      }
    ]
  },
  {
    "name": "ProductGroup",
    "type": "https://schema.org/ProductGroup",
    "source": "generated",
    "description": "A ProductGroup represents a group of [[Product]]s that vary only in certain well-described ways, such as by [[size]], [[color]], [[material]] etc.\n\nWhile a ProductGroup itself is not directly offered for sale, the various varying products that it represents can be. The ProductGroup serves as a prototype or template, standing in for all of the products who have an [[isVariantOf]] relationship to it. As such, properties (including additional types) can be applied to the ProductGroup to represent characteristics shared by each of the (possibly very many) variants. Properties that reference a ProductGroup are not included in this mechanism; neither are the following specific properties [[variesBy]], [[hasVariant]], [[url]]. ",
    "parentTypes": [
      "https://schema.org/Product",
      "https://www.omg.org/spec/Commons/Classifiers/Classifier",
      "https://www.omg.org/spec/Commons/Collections/Collection"
    ],
    "properties": [
      {
        "name": "hasVariant",
        "type": "https://schema.org/Product",
        "description": "Indicates a [[Product]] that is a member of this [[ProductGroup]] (or [[ProductModel]]).",
        "expectedTypes": [
          "https://schema.org/Product"
        ],
        "rangeTypes": [
          "https://schema.org/Product"
        ],
        "domainTypes": [
          "https://schema.org/ProductGroup"
        ],
        "inverseOf": "https://schema.org/isVariantOf"
      },
      {
        "name": "productGroupID",
        "type": "https://schema.org/Text",
        "description": "Indicates a textual identifier for a ProductGroup.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/ProductGroup"
        ]
      },
      {
        "name": "variesBy",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/PropertyValue",
          "https://schema.org/Text"
        ],
        "description": "Indicates the property or properties by which the variants in a [[ProductGroup]] vary, e.g. their size, color etc. Schema.org properties can be referenced by their short name e.g. \"color\"; terms defined elsewhere can be referenced with their URIs. Variant properties can be provided using [[PropertyValue]] instead of plain [[Text]], to allow specification of the values available for a variant property.",
        "expectedTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/PropertyValue",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/PropertyValue",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/ProductGroup"
        ]
      }
    ]
  },
  {
    "name": "ProductModel",
    "type": "https://schema.org/ProductModel",
    "source": "generated",
    "description": "A datasheet or vendor specification of a product (in the sense of a prototypical description).",
    "parentTypes": [
      "https://schema.org/Product"
    ],
    "properties": [
      {
        "name": "isVariantOf",
        "type": [
          "https://schema.org/ProductGroup",
          "https://schema.org/ProductModel"
        ],
        "description": "Indicates the kind of product that this is a variant of. In the case of [[ProductModel]], this is a pointer (from a ProductModel) to a base product from which this product is a variant. It is safe to infer that the variant inherits all product features from the base model, unless defined locally. This is not transitive. In the case of a [[ProductGroup]], the group description also serves as a template, representing a set of Products that vary on explicitly defined, specific dimensions only (so it defines both a set of variants, as well as which values distinguish amongst those variants). When used with [[ProductGroup]], this property can apply to any [[Product]] included in the group.",
        "expectedTypes": [
          "https://schema.org/ProductGroup",
          "https://schema.org/ProductModel"
        ],
        "rangeTypes": [
          "https://schema.org/ProductGroup",
          "https://schema.org/ProductModel"
        ],
        "domainTypes": [
          "https://schema.org/Product",
          "https://schema.org/ProductModel"
        ],
        "inverseOf": "https://schema.org/hasVariant"
      },
      {
        "name": "predecessorOf",
        "type": "https://schema.org/ProductModel",
        "description": "A pointer from a previous, often discontinued variant of the product to its newer variant.",
        "expectedTypes": [
          "https://schema.org/ProductModel"
        ],
        "rangeTypes": [
          "https://schema.org/ProductModel"
        ],
        "domainTypes": [
          "https://schema.org/ProductModel"
        ]
      },
      {
        "name": "successorOf",
        "type": "https://schema.org/ProductModel",
        "description": "A pointer from a newer variant of a product  to its previous, often discontinued predecessor.",
        "expectedTypes": [
          "https://schema.org/ProductModel"
        ],
        "rangeTypes": [
          "https://schema.org/ProductModel"
        ],
        "domainTypes": [
          "https://schema.org/ProductModel"
        ]
      }
    ]
  },
  {
    "name": "ProductReturnEnumeration",
    "type": "https://schema.org/ProductReturnEnumeration",
    "source": "generated",
    "description": "ProductReturnEnumeration enumerates several kinds of product return policy. Note that this structure may not capture all aspects of the policy.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "ProductReturnFiniteReturnWindow",
        "type": "https://schema.org/ProductReturnFiniteReturnWindow",
        "description": "ProductReturnFiniteReturnWindow: there is a finite window for product returns."
      },
      {
        "name": "ProductReturnNotPermitted",
        "type": "https://schema.org/ProductReturnNotPermitted",
        "description": "ProductReturnNotPermitted: product returns are not permitted."
      },
      {
        "name": "ProductReturnUnlimitedWindow",
        "type": "https://schema.org/ProductReturnUnlimitedWindow",
        "description": "ProductReturnUnlimitedWindow: there is an unlimited window for product returns."
      },
      {
        "name": "ProductReturnUnspecified",
        "type": "https://schema.org/ProductReturnUnspecified",
        "description": "ProductReturnUnspecified: a product return policy is not specified here."
      }
    ]
  },
  {
    "name": "ProductReturnPolicy",
    "type": "https://schema.org/ProductReturnPolicy",
    "source": "generated",
    "description": "A ProductReturnPolicy provides information about product return policies associated with an [[Organization]] or [[Product]].",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "productReturnDays",
        "type": "https://schema.org/Integer",
        "description": "The productReturnDays property indicates the number of days (from purchase) within which relevant product return policy is applicable.",
        "expectedTypes": [
          "https://schema.org/Integer"
        ],
        "rangeTypes": [
          "https://schema.org/Integer"
        ],
        "domainTypes": [
          "https://schema.org/ProductReturnPolicy"
        ],
        "supersededBy": "https://schema.org/merchantReturnDays"
      },
      {
        "name": "productReturnLink",
        "type": "https://schema.org/URL",
        "description": "Indicates a Web page or service by URL, for product return.",
        "expectedTypes": [
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/ProductReturnPolicy"
        ],
        "supersededBy": "https://schema.org/merchantReturnLink"
      }
    ]
  },
  {
    "name": "ProfessionalService",
    "type": "https://schema.org/ProfessionalService",
    "source": "generated",
    "description": "Original definition: \"provider of professional services.\"\\n\\nThe general [[ProfessionalService]] type for local businesses was deprecated due to confusion with [[Service]]. For reference, the types that it included were: [[Dentist]],\n        [[AccountingService]], [[Attorney]], [[Notary]], as well as types for several kinds of [[HomeAndConstructionBusiness]]: [[Electrician]], [[GeneralContractor]],\n        [[HousePainter]], [[Locksmith]], [[Plumber]], [[RoofingContractor]]. [[LegalService]] was introduced as a more inclusive supertype of [[Attorney]].",
    "parentTypes": [
      "https://schema.org/LocalBusiness"
    ]
  },
  {
    "name": "ProfilePage",
    "type": "https://schema.org/ProfilePage",
    "source": "generated",
    "description": "Web page type: Profile page.",
    "parentTypes": [
      "https://schema.org/WebPage"
    ]
  },
  {
    "name": "ProgramMembership",
    "type": "https://schema.org/ProgramMembership",
    "source": "generated",
    "description": "Used to describe membership in a loyalty programs (e.g. \"StarAliance\"), traveler clubs (e.g. \"AAA\"), purchase clubs (\"Safeway Club\"), etc.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "hostingOrganization",
        "type": "https://schema.org/Organization",
        "description": "The Organization (airline, travelers' club, retailer, etc.) the membership is made with or which offers the  MemberProgram.",
        "expectedTypes": [
          "https://schema.org/Organization"
        ],
        "rangeTypes": [
          "https://schema.org/Organization"
        ],
        "domainTypes": [
          "https://schema.org/MemberProgram",
          "https://schema.org/ProgramMembership"
        ]
      },
      {
        "name": "member",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "A member of an Organization or a ProgramMembership. Organizations can be members of organizations; ProgramMembership is typically for individuals.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Organization",
          "https://schema.org/ProgramMembership"
        ],
        "inverseOf": "https://schema.org/memberOf"
      },
      {
        "name": "members",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "A member of this organization.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Organization",
          "https://schema.org/ProgramMembership"
        ],
        "supersededBy": "https://schema.org/member"
      },
      {
        "name": "membershipNumber",
        "type": "https://schema.org/Text",
        "description": "A unique identifier for the membership.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/ProgramMembership"
        ]
      },
      {
        "name": "membershipPointsEarned",
        "type": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "description": "The number of membership points earned by the member. If necessary, the unitText can be used to express the units the points are issued in. (E.g. stars, miles, etc.)",
        "expectedTypes": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/MemberProgramTier",
          "https://schema.org/PriceSpecification",
          "https://schema.org/ProgramMembership"
        ]
      },
      {
        "name": "program",
        "type": "https://schema.org/MemberProgram",
        "description": "The [MemberProgram](https://schema.org/MemberProgram) associated with a [ProgramMembership](https://schema.org/ProgramMembership).",
        "expectedTypes": [
          "https://schema.org/MemberProgram"
        ],
        "rangeTypes": [
          "https://schema.org/MemberProgram"
        ],
        "domainTypes": [
          "https://schema.org/ProgramMembership"
        ]
      },
      {
        "name": "programName",
        "type": "https://schema.org/Text",
        "description": "The program providing the membership. It is preferable to use [:program](https://schema.org/program) instead.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/ProgramMembership"
        ]
      }
    ]
  },
  {
    "name": "Project",
    "type": "https://schema.org/Project",
    "source": "generated",
    "description": "An enterprise (potentially individual but typically collaborative), planned to achieve a particular aim.\nUse properties from [[Organization]], [[subOrganization]]/[[parentOrganization]] to indicate project sub-structures. \n   ",
    "parentTypes": [
      "https://schema.org/Organization"
    ]
  },
  {
    "name": "PronounceableText",
    "type": "https://schema.org/PronounceableText",
    "source": "generated",
    "description": "Data type: PronounceableText.",
    "parentTypes": [
      "https://schema.org/Text"
    ],
    "properties": [
      {
        "name": "inLanguage",
        "type": [
          "https://schema.org/Language",
          "https://schema.org/Text"
        ],
        "description": "The language of the content or performance or used in an action. Please use one of the language codes from the [IETF BCP 47 standard](http://tools.ietf.org/html/bcp47). See also [[availableLanguage]].",
        "expectedTypes": [
          "https://schema.org/Language",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Language",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/BroadcastService",
          "https://schema.org/CommunicateAction",
          "https://schema.org/CreativeWork",
          "https://schema.org/Event",
          "https://schema.org/LinkRole",
          "https://schema.org/PronounceableText",
          "https://schema.org/WriteAction"
        ]
      },
      {
        "name": "phoneticText",
        "type": "https://schema.org/Text",
        "description": "Representation of a text [[textValue]] using the specified [[speechToTextMarkup]]. For example the city name of Houston in IPA: /ˈhjuːstən/.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/PronounceableText"
        ]
      },
      {
        "name": "speechToTextMarkup",
        "type": "https://schema.org/Text",
        "description": "Form of markup used. eg. [SSML](https://www.w3.org/TR/speech-synthesis11) or [IPA](https://www.wikidata.org/wiki/Property:P898).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/PronounceableText"
        ]
      },
      {
        "name": "textValue",
        "type": "https://schema.org/Text",
        "description": "Text value being annotated.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/PronounceableText"
        ]
      }
    ]
  },
  {
    "name": "Property",
    "type": "https://schema.org/Property",
    "source": "generated",
    "description": "A property, used to indicate attributes and relationships of some Thing; equivalent to rdf:Property.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "domainIncludes",
        "type": "https://schema.org/Class",
        "description": "Relates a property to a class that is (one of) the type(s) the property is expected to be used on.",
        "expectedTypes": [
          "https://schema.org/Class"
        ],
        "rangeTypes": [
          "https://schema.org/Class"
        ],
        "domainTypes": [
          "https://schema.org/Property"
        ]
      },
      {
        "name": "inverseOf",
        "type": "https://schema.org/Property",
        "description": "Relates a property to a property that is its inverse. Inverse properties relate the same pairs of items to each other, but in reversed direction. For example, the 'alumni' and 'alumniOf' properties are inverseOf each other. Some properties don't have explicit inverses; in these situations RDFa and JSON-LD syntax for reverse properties can be used.",
        "expectedTypes": [
          "https://schema.org/Property"
        ],
        "rangeTypes": [
          "https://schema.org/Property"
        ],
        "domainTypes": [
          "https://schema.org/Property"
        ]
      },
      {
        "name": "rangeIncludes",
        "type": "https://schema.org/Class",
        "description": "Relates a property to a class that constitutes (one of) the expected type(s) for values of the property.",
        "expectedTypes": [
          "https://schema.org/Class"
        ],
        "rangeTypes": [
          "https://schema.org/Class"
        ],
        "domainTypes": [
          "https://schema.org/Property"
        ]
      },
      {
        "name": "supersededBy",
        "type": [
          "https://schema.org/Class",
          "https://schema.org/Enumeration",
          "https://schema.org/Property"
        ],
        "description": "Relates a term (i.e. a property, class or enumeration) to one that supersedes it.",
        "expectedTypes": [
          "https://schema.org/Class",
          "https://schema.org/Enumeration",
          "https://schema.org/Property"
        ],
        "rangeTypes": [
          "https://schema.org/Class",
          "https://schema.org/Enumeration",
          "https://schema.org/Property"
        ],
        "domainTypes": [
          "https://schema.org/Class",
          "https://schema.org/Enumeration",
          "https://schema.org/Property"
        ]
      }
    ]
  },
  {
    "name": "PropertyValue",
    "type": "https://schema.org/PropertyValue",
    "source": "generated",
    "description": "A property-value pair, e.g. representing a feature of a product or place. Use the 'name' property for the name of the property. If there is an additional human-readable version of the value, put that into the 'description' property.\\n\\n Always use specific schema.org properties when a) they exist and b) you can populate them. Using PropertyValue as a substitute will typically not trigger the same effect as using the original, specific property.\n    ",
    "parentTypes": [
      "https://schema.org/StructuredValue"
    ],
    "properties": [
      {
        "name": "maxValue",
        "type": "https://schema.org/Number",
        "description": "The upper value of some characteristic or property.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/PropertyValue",
          "https://schema.org/PropertyValueSpecification",
          "https://schema.org/QuantitativeValue"
        ]
      },
      {
        "name": "measurementMethod",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/MeasurementMethodEnum",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "A subproperty of [[measurementTechnique]] that can be used for specifying specific methods, in particular via [[MeasurementMethodEnum]].",
        "expectedTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/MeasurementMethodEnum",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/MeasurementMethodEnum",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/DataCatalog",
          "https://schema.org/DataDownload",
          "https://schema.org/Dataset",
          "https://schema.org/Observation",
          "https://schema.org/PropertyValue",
          "https://schema.org/StatisticalVariable"
        ]
      },
      {
        "name": "measurementTechnique",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/MeasurementMethodEnum",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "A technique, method or technology used in an [[Observation]], [[StatisticalVariable]] or [[Dataset]] (or [[DataDownload]], [[DataCatalog]]), corresponding to the method used for measuring the corresponding variable(s) (for datasets, described using [[variableMeasured]]; for [[Observation]], a [[StatisticalVariable]]). Often but not necessarily each [[variableMeasured]] will have an explicit representation as (or mapping to) an property such as those defined in Schema.org, or other RDF vocabularies and \"knowledge graphs\". In that case the subproperty of [[variableMeasured]] called [[measuredProperty]] is applicable.\n    \nThe [[measurementTechnique]] property helps when extra clarification is needed about how a [[measuredProperty]] was measured. This is oriented towards scientific and scholarly dataset publication but may have broader applicability; it is not intended as a full representation of measurement, but can often serve as a high level summary for dataset discovery. \n\nFor example, if [[variableMeasured]] is: molecule concentration, [[measurementTechnique]] could be: \"mass spectrometry\" or \"nmr spectroscopy\" or \"colorimetry\" or \"immunofluorescence\". If the [[variableMeasured]] is \"depression rating\", the [[measurementTechnique]] could be \"Zung Scale\" or \"HAM-D\" or \"Beck Depression Inventory\". \n\nIf there are several [[variableMeasured]] properties recorded for some given data object, use a [[PropertyValue]] for each [[variableMeasured]] and attach the corresponding [[measurementTechnique]]. The value can also be from an enumeration, organized as a [[MeasurementMethodEnum]].",
        "expectedTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/MeasurementMethodEnum",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/MeasurementMethodEnum",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/DataCatalog",
          "https://schema.org/DataDownload",
          "https://schema.org/Dataset",
          "https://schema.org/Observation",
          "https://schema.org/PropertyValue",
          "https://schema.org/StatisticalVariable"
        ]
      },
      {
        "name": "minValue",
        "type": "https://schema.org/Number",
        "description": "The lower value of some characteristic or property.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/PropertyValue",
          "https://schema.org/PropertyValueSpecification",
          "https://schema.org/QuantitativeValue"
        ]
      },
      {
        "name": "propertyID",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "A commonly used identifier for the characteristic represented by the property, e.g. a manufacturer or a standard code for a property. propertyID can be\n(1) a prefixed string, mainly meant to be used with standards for product properties; (2) a site-specific, non-prefixed string (e.g. the primary key of the property or the vendor-specific ID of the property), or (3)\na URL indicating the type of the property, either pointing to an external vocabulary, or a Web resource that describes the property (e.g. a glossary entry).\nStandards bodies should promote a standard prefix for the identifiers of properties from their standards.",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/PropertyValue"
        ]
      },
      {
        "name": "unitCode",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "The unit of measurement given using the UN/CEFACT Common Code (3 characters) or a URL. Other codes than the UN/CEFACT Common Code may be used with a prefix followed by a colon.",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/PropertyValue",
          "https://schema.org/QuantitativeValue",
          "https://schema.org/TypeAndQuantityNode",
          "https://schema.org/UnitPriceSpecification"
        ]
      },
      {
        "name": "unitText",
        "type": "https://schema.org/Text",
        "description": "A string or text indicating the unit of measurement. Useful if you cannot provide a standard unit code for\n<a href='unitCode'>unitCode</a>.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/PropertyValue",
          "https://schema.org/QuantitativeValue",
          "https://schema.org/TypeAndQuantityNode",
          "https://schema.org/UnitPriceSpecification"
        ]
      },
      {
        "name": "value",
        "type": [
          "https://schema.org/Boolean",
          "https://schema.org/Number",
          "https://schema.org/QualitativeValue",
          "https://schema.org/StructuredValue",
          "https://schema.org/Text"
        ],
        "description": "The value of a [[QuantitativeValue]] (including [[Observation]]) or property value node.\\n\\n* For [[QuantitativeValue]] and [[MonetaryAmount]], the recommended type for values is 'Number'.\\n* For [[PropertyValue]], it can be 'Text', 'Number', 'Boolean', 'StructuredValue' or 'QualitativeValue'.\\n* Use values from 0123456789 (Unicode 'DIGIT ZERO' (U+0030) to 'DIGIT NINE' (U+0039)) rather than superficially similar Unicode symbols.\\n* Use '.' (Unicode 'FULL STOP' (U+002E)) rather than ',' to indicate a decimal point. Avoid using these symbols as a readability separator.",
        "expectedTypes": [
          "https://schema.org/Boolean",
          "https://schema.org/Number",
          "https://schema.org/QualitativeValue",
          "https://schema.org/StructuredValue",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean",
          "https://schema.org/Number",
          "https://schema.org/QualitativeValue",
          "https://schema.org/StructuredValue",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/PropertyValue",
          "https://schema.org/QuantitativeValue"
        ]
      },
      {
        "name": "valueGroup",
        "type": "https://schema.org/Text",
        "description": "A header or section name for grouping related property values.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/PropertyValue"
        ]
      },
      {
        "name": "valueReference",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Enumeration",
          "https://schema.org/MeasurementTypeEnumeration",
          "https://schema.org/PropertyValue",
          "https://schema.org/QualitativeValue",
          "https://schema.org/QuantitativeValue",
          "https://schema.org/StructuredValue",
          "https://schema.org/Text"
        ],
        "description": "A secondary value that provides additional information on the original value, e.g. a reference temperature or a type of measurement.",
        "expectedTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Enumeration",
          "https://schema.org/MeasurementTypeEnumeration",
          "https://schema.org/PropertyValue",
          "https://schema.org/QualitativeValue",
          "https://schema.org/QuantitativeValue",
          "https://schema.org/StructuredValue",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Enumeration",
          "https://schema.org/MeasurementTypeEnumeration",
          "https://schema.org/PropertyValue",
          "https://schema.org/QualitativeValue",
          "https://schema.org/QuantitativeValue",
          "https://schema.org/StructuredValue",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/PropertyValue",
          "https://schema.org/QualitativeValue",
          "https://schema.org/QuantitativeValue"
        ]
      }
    ]
  },
  {
    "name": "PropertyValueSpecification",
    "type": "https://schema.org/PropertyValueSpecification",
    "source": "generated",
    "description": "A Property value specification.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "defaultValue",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/Thing"
        ],
        "description": "The default value of the input.  For properties that expect a literal, the default is a literal value, for properties that expect an object, it's an ID reference to one of the current values.",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/Thing"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/Thing"
        ],
        "domainTypes": [
          "https://schema.org/PropertyValueSpecification"
        ]
      },
      {
        "name": "maxValue",
        "type": "https://schema.org/Number",
        "description": "The upper value of some characteristic or property.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/PropertyValue",
          "https://schema.org/PropertyValueSpecification",
          "https://schema.org/QuantitativeValue"
        ]
      },
      {
        "name": "minValue",
        "type": "https://schema.org/Number",
        "description": "The lower value of some characteristic or property.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/PropertyValue",
          "https://schema.org/PropertyValueSpecification",
          "https://schema.org/QuantitativeValue"
        ]
      },
      {
        "name": "multipleValues",
        "type": "https://schema.org/Boolean",
        "description": "Whether multiple values are allowed for the property.  Default is false.",
        "expectedTypes": [
          "https://schema.org/Boolean"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean"
        ],
        "domainTypes": [
          "https://schema.org/PropertyValueSpecification"
        ]
      },
      {
        "name": "readonlyValue",
        "type": "https://schema.org/Boolean",
        "description": "Whether or not a property is mutable.  Default is false. Specifying this for a property that also has a value makes it act similar to a \"hidden\" input in an HTML form.",
        "expectedTypes": [
          "https://schema.org/Boolean"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean"
        ],
        "domainTypes": [
          "https://schema.org/PropertyValueSpecification"
        ]
      },
      {
        "name": "stepValue",
        "type": "https://schema.org/Number",
        "description": "The stepValue attribute indicates the granularity that is expected (and required) of the value in a PropertyValueSpecification.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/PropertyValueSpecification"
        ]
      },
      {
        "name": "valueMaxLength",
        "type": "https://schema.org/Number",
        "description": "Specifies the allowed range for number of characters in a literal value.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/PropertyValueSpecification"
        ]
      },
      {
        "name": "valueMinLength",
        "type": "https://schema.org/Number",
        "description": "Specifies the minimum allowed range for number of characters in a literal value.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/PropertyValueSpecification"
        ]
      },
      {
        "name": "valueName",
        "type": "https://schema.org/Text",
        "description": "Indicates the name of the PropertyValueSpecification to be used in URL templates and form encoding in a manner analogous to HTML's input@name.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/PropertyValueSpecification"
        ]
      },
      {
        "name": "valuePattern",
        "type": "https://schema.org/Text",
        "description": "Specifies a regular expression for testing literal values according to the HTML spec.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/PropertyValueSpecification"
        ]
      },
      {
        "name": "valueRequired",
        "type": "https://schema.org/Boolean",
        "description": "Whether the property must be filled in to complete the action.  Default is false.",
        "expectedTypes": [
          "https://schema.org/Boolean"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean"
        ],
        "domainTypes": [
          "https://schema.org/PropertyValueSpecification"
        ]
      }
    ]
  },
  {
    "name": "Protein",
    "type": "https://schema.org/Protein",
    "source": "generated",
    "description": "Protein is here used in its widest possible definition, as classes of amino acid based molecules. Amyloid-beta Protein in human (UniProt P05067), eukaryota (e.g. an OrthoDB group) or even a single molecule that one can point to are all of type :Protein. A protein can thus be a subclass of another protein, e.g. :Protein as a UniProt record can have multiple isoforms inside it which would also be :Protein. They can be imagined, synthetic, hypothetical or naturally occurring.",
    "parentTypes": [
      "https://schema.org/BioChemEntity"
    ],
    "properties": [
      {
        "name": "hasBioPolymerSequence",
        "type": "https://schema.org/Text",
        "description": "A symbolic representation of a BioChemEntity. For example, a nucleotide sequence of a Gene or an amino acid sequence of a Protein.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Gene",
          "https://schema.org/Protein"
        ]
      }
    ]
  },
  {
    "name": "PsychologicalTreatment",
    "type": "https://schema.org/PsychologicalTreatment",
    "source": "generated",
    "description": "A process of care relying upon counseling, dialogue and communication  aimed at improving a mental health condition without use of drugs.",
    "parentTypes": [
      "https://schema.org/TherapeuticProcedure"
    ]
  },
  {
    "name": "PublicationEvent",
    "type": "https://schema.org/PublicationEvent",
    "source": "generated",
    "description": "A PublicationEvent corresponds indifferently to the event of publication for a CreativeWork of any type, e.g. a broadcast event, an on-demand event, a book/journal publication via a variety of delivery media.",
    "parentTypes": [
      "https://schema.org/Event"
    ],
    "properties": [
      {
        "name": "free",
        "type": "https://schema.org/Boolean",
        "description": "A flag to signal that the item, event, or place is accessible for free.",
        "expectedTypes": [
          "https://schema.org/Boolean"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean"
        ],
        "domainTypes": [
          "https://schema.org/PublicationEvent"
        ],
        "supersededBy": "https://schema.org/isAccessibleForFree"
      },
      {
        "name": "publishedBy",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "An agent associated with the publication event.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/PublicationEvent"
        ]
      },
      {
        "name": "publishedOn",
        "type": "https://schema.org/BroadcastService",
        "description": "A broadcast service associated with the publication event.",
        "expectedTypes": [
          "https://schema.org/BroadcastService"
        ],
        "rangeTypes": [
          "https://schema.org/BroadcastService"
        ],
        "domainTypes": [
          "https://schema.org/PublicationEvent"
        ]
      }
    ]
  },
  {
    "name": "PublicationIssue",
    "type": "https://schema.org/PublicationIssue",
    "source": "generated",
    "description": "A part of a successively published publication such as a periodical or publication volume, often numbered, usually containing a grouping of works such as articles.\\n\\nSee also [blog post](https://blog-schema.org/2014/09/02/schema-org-support-for-bibliographic-relationships-and-periodicals/).",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ],
    "properties": [
      {
        "name": "issueNumber",
        "type": [
          "https://schema.org/Integer",
          "https://schema.org/Text"
        ],
        "description": "Identifies the issue of publication; for example, \"iii\" or \"2\".",
        "expectedTypes": [
          "https://schema.org/Integer",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Integer",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/PublicationIssue"
        ]
      },
      {
        "name": "pageEnd",
        "type": [
          "https://schema.org/Integer",
          "https://schema.org/Text"
        ],
        "description": "The page on which the work ends; for example \"138\" or \"xvi\".",
        "expectedTypes": [
          "https://schema.org/Integer",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Integer",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Article",
          "https://schema.org/Chapter",
          "https://schema.org/PublicationIssue",
          "https://schema.org/PublicationVolume"
        ]
      },
      {
        "name": "pageStart",
        "type": [
          "https://schema.org/Integer",
          "https://schema.org/Text"
        ],
        "description": "The page on which the work starts; for example \"135\" or \"xiii\".",
        "expectedTypes": [
          "https://schema.org/Integer",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Integer",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Article",
          "https://schema.org/Chapter",
          "https://schema.org/PublicationIssue",
          "https://schema.org/PublicationVolume"
        ]
      },
      {
        "name": "pagination",
        "type": "https://schema.org/Text",
        "description": "Any description of pages that is not separated into pageStart and pageEnd; for example, \"1-6, 9, 55\" or \"10-12, 46-49\".",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Article",
          "https://schema.org/Chapter",
          "https://schema.org/PublicationIssue",
          "https://schema.org/PublicationVolume"
        ]
      }
    ]
  },
  {
    "name": "PublicationVolume",
    "type": "https://schema.org/PublicationVolume",
    "source": "generated",
    "description": "A part of a successively published publication such as a periodical or multi-volume work, often numbered. It may represent a time span, such as a year.\\n\\nSee also [blog post](https://blog-schema.org/2014/09/02/schema-org-support-for-bibliographic-relationships-and-periodicals/).",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ],
    "properties": [
      {
        "name": "pageEnd",
        "type": [
          "https://schema.org/Integer",
          "https://schema.org/Text"
        ],
        "description": "The page on which the work ends; for example \"138\" or \"xvi\".",
        "expectedTypes": [
          "https://schema.org/Integer",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Integer",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Article",
          "https://schema.org/Chapter",
          "https://schema.org/PublicationIssue",
          "https://schema.org/PublicationVolume"
        ]
      },
      {
        "name": "pageStart",
        "type": [
          "https://schema.org/Integer",
          "https://schema.org/Text"
        ],
        "description": "The page on which the work starts; for example \"135\" or \"xiii\".",
        "expectedTypes": [
          "https://schema.org/Integer",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Integer",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Article",
          "https://schema.org/Chapter",
          "https://schema.org/PublicationIssue",
          "https://schema.org/PublicationVolume"
        ]
      },
      {
        "name": "pagination",
        "type": "https://schema.org/Text",
        "description": "Any description of pages that is not separated into pageStart and pageEnd; for example, \"1-6, 9, 55\" or \"10-12, 46-49\".",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Article",
          "https://schema.org/Chapter",
          "https://schema.org/PublicationIssue",
          "https://schema.org/PublicationVolume"
        ]
      },
      {
        "name": "volumeNumber",
        "type": [
          "https://schema.org/Integer",
          "https://schema.org/Text"
        ],
        "description": "Identifies the volume of publication or multi-part work; for example, \"iii\" or \"2\".",
        "expectedTypes": [
          "https://schema.org/Integer",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Integer",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/PublicationVolume"
        ]
      }
    ]
  },
  {
    "name": "PublicSwimmingPool",
    "type": "https://schema.org/PublicSwimmingPool",
    "source": "generated",
    "description": "A public swimming pool.",
    "parentTypes": [
      "https://schema.org/SportsActivityLocation"
    ]
  },
  {
    "name": "PublicToilet",
    "type": "https://schema.org/PublicToilet",
    "source": "generated",
    "description": "A public toilet is a room or small building containing one or more toilets (and possibly also urinals) which is available for use by the general public, or by customers or employees of certain businesses.",
    "parentTypes": [
      "https://schema.org/CivicStructure"
    ]
  },
  {
    "name": "PurchaseType",
    "type": "https://schema.org/PurchaseType",
    "source": "generated",
    "description": "Enumerates a purchase type for an item.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "PurchaseTypeLease",
        "type": "https://schema.org/PurchaseTypeLease",
        "description": "This is a lease of an item."
      },
      {
        "name": "PurchaseTypeNewPurchase",
        "type": "https://schema.org/PurchaseTypeNewPurchase",
        "description": "This is a purchase of a new item."
      },
      {
        "name": "PurchaseTypeTradeIn",
        "type": "https://schema.org/PurchaseTypeTradeIn",
        "description": "This is a trade-in for an item."
      },
      {
        "name": "PurchaseTypeUsedPurchase",
        "type": "https://schema.org/PurchaseTypeUsedPurchase",
        "description": "This is a purchase of a used item."
      }
    ]
  },
  {
    "name": "QAPage",
    "type": "https://schema.org/QAPage",
    "source": "generated",
    "description": "A QAPage is a WebPage focussed on a specific Question and its Answer(s), e.g. in a question answering site or documenting Frequently Asked Questions (FAQs).",
    "parentTypes": [
      "https://schema.org/WebPage"
    ]
  },
  {
    "name": "QualitativeValue",
    "type": "https://schema.org/QualitativeValue",
    "source": "generated",
    "description": "A predefined value for a product characteristic, e.g. the power cord plug type 'US' or the garment sizes 'S', 'M', 'L', and 'XL'.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "properties": [
      {
        "name": "additionalProperty",
        "type": "https://schema.org/PropertyValue",
        "description": "A property-value pair representing an additional characteristic of the entity, e.g. a product feature or another characteristic for which there is no matching property in schema.org.\\n\\nNote: Publishers should be aware that applications designed to use specific schema.org properties (e.g. https://schema.org/width, https://schema.org/color, https://schema.org/gtin13, ...) will typically expect such data to be provided using those properties, rather than using the generic property/value mechanism.\n",
        "expectedTypes": [
          "https://schema.org/PropertyValue"
        ],
        "rangeTypes": [
          "https://schema.org/PropertyValue"
        ],
        "domainTypes": [
          "https://schema.org/MerchantReturnPolicy",
          "https://schema.org/Offer",
          "https://schema.org/Place",
          "https://schema.org/Product",
          "https://schema.org/QualitativeValue",
          "https://schema.org/QuantitativeValue"
        ]
      },
      {
        "name": "equal",
        "type": "https://schema.org/QualitativeValue",
        "description": "This ordering relation for qualitative values indicates that the subject is equal to the object.",
        "expectedTypes": [
          "https://schema.org/QualitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QualitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/QualitativeValue"
        ]
      },
      {
        "name": "greater",
        "type": "https://schema.org/QualitativeValue",
        "description": "This ordering relation for qualitative values indicates that the subject is greater than the object.",
        "expectedTypes": [
          "https://schema.org/QualitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QualitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/QualitativeValue"
        ]
      },
      {
        "name": "greaterOrEqual",
        "type": "https://schema.org/QualitativeValue",
        "description": "This ordering relation for qualitative values indicates that the subject is greater than or equal to the object.",
        "expectedTypes": [
          "https://schema.org/QualitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QualitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/QualitativeValue"
        ]
      },
      {
        "name": "lesser",
        "type": "https://schema.org/QualitativeValue",
        "description": "This ordering relation for qualitative values indicates that the subject is lesser than the object.",
        "expectedTypes": [
          "https://schema.org/QualitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QualitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/QualitativeValue"
        ]
      },
      {
        "name": "lesserOrEqual",
        "type": "https://schema.org/QualitativeValue",
        "description": "This ordering relation for qualitative values indicates that the subject is lesser than or equal to the object.",
        "expectedTypes": [
          "https://schema.org/QualitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QualitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/QualitativeValue"
        ]
      },
      {
        "name": "nonEqual",
        "type": "https://schema.org/QualitativeValue",
        "description": "This ordering relation for qualitative values indicates that the subject is not equal to the object.",
        "expectedTypes": [
          "https://schema.org/QualitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QualitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/QualitativeValue"
        ]
      },
      {
        "name": "valueReference",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Enumeration",
          "https://schema.org/MeasurementTypeEnumeration",
          "https://schema.org/PropertyValue",
          "https://schema.org/QualitativeValue",
          "https://schema.org/QuantitativeValue",
          "https://schema.org/StructuredValue",
          "https://schema.org/Text"
        ],
        "description": "A secondary value that provides additional information on the original value, e.g. a reference temperature or a type of measurement.",
        "expectedTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Enumeration",
          "https://schema.org/MeasurementTypeEnumeration",
          "https://schema.org/PropertyValue",
          "https://schema.org/QualitativeValue",
          "https://schema.org/QuantitativeValue",
          "https://schema.org/StructuredValue",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Enumeration",
          "https://schema.org/MeasurementTypeEnumeration",
          "https://schema.org/PropertyValue",
          "https://schema.org/QualitativeValue",
          "https://schema.org/QuantitativeValue",
          "https://schema.org/StructuredValue",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/PropertyValue",
          "https://schema.org/QualitativeValue",
          "https://schema.org/QuantitativeValue"
        ]
      }
    ]
  },
  {
    "name": "QuantitativeValue",
    "type": "https://schema.org/QuantitativeValue",
    "source": "generated",
    "description": " A point value or interval for product characteristics and other purposes.",
    "parentTypes": [
      "https://schema.org/StructuredValue"
    ],
    "properties": [
      {
        "name": "additionalProperty",
        "type": "https://schema.org/PropertyValue",
        "description": "A property-value pair representing an additional characteristic of the entity, e.g. a product feature or another characteristic for which there is no matching property in schema.org.\\n\\nNote: Publishers should be aware that applications designed to use specific schema.org properties (e.g. https://schema.org/width, https://schema.org/color, https://schema.org/gtin13, ...) will typically expect such data to be provided using those properties, rather than using the generic property/value mechanism.\n",
        "expectedTypes": [
          "https://schema.org/PropertyValue"
        ],
        "rangeTypes": [
          "https://schema.org/PropertyValue"
        ],
        "domainTypes": [
          "https://schema.org/MerchantReturnPolicy",
          "https://schema.org/Offer",
          "https://schema.org/Place",
          "https://schema.org/Product",
          "https://schema.org/QualitativeValue",
          "https://schema.org/QuantitativeValue"
        ]
      },
      {
        "name": "maxValue",
        "type": "https://schema.org/Number",
        "description": "The upper value of some characteristic or property.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/PropertyValue",
          "https://schema.org/PropertyValueSpecification",
          "https://schema.org/QuantitativeValue"
        ]
      },
      {
        "name": "minValue",
        "type": "https://schema.org/Number",
        "description": "The lower value of some characteristic or property.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/PropertyValue",
          "https://schema.org/PropertyValueSpecification",
          "https://schema.org/QuantitativeValue"
        ]
      },
      {
        "name": "unitCode",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "The unit of measurement given using the UN/CEFACT Common Code (3 characters) or a URL. Other codes than the UN/CEFACT Common Code may be used with a prefix followed by a colon.",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/PropertyValue",
          "https://schema.org/QuantitativeValue",
          "https://schema.org/TypeAndQuantityNode",
          "https://schema.org/UnitPriceSpecification"
        ]
      },
      {
        "name": "unitText",
        "type": "https://schema.org/Text",
        "description": "A string or text indicating the unit of measurement. Useful if you cannot provide a standard unit code for\n<a href='unitCode'>unitCode</a>.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/PropertyValue",
          "https://schema.org/QuantitativeValue",
          "https://schema.org/TypeAndQuantityNode",
          "https://schema.org/UnitPriceSpecification"
        ]
      },
      {
        "name": "value",
        "type": [
          "https://schema.org/Boolean",
          "https://schema.org/Number",
          "https://schema.org/QualitativeValue",
          "https://schema.org/StructuredValue",
          "https://schema.org/Text"
        ],
        "description": "The value of a [[QuantitativeValue]] (including [[Observation]]) or property value node.\\n\\n* For [[QuantitativeValue]] and [[MonetaryAmount]], the recommended type for values is 'Number'.\\n* For [[PropertyValue]], it can be 'Text', 'Number', 'Boolean', 'StructuredValue' or 'QualitativeValue'.\\n* Use values from 0123456789 (Unicode 'DIGIT ZERO' (U+0030) to 'DIGIT NINE' (U+0039)) rather than superficially similar Unicode symbols.\\n* Use '.' (Unicode 'FULL STOP' (U+002E)) rather than ',' to indicate a decimal point. Avoid using these symbols as a readability separator.",
        "expectedTypes": [
          "https://schema.org/Boolean",
          "https://schema.org/Number",
          "https://schema.org/QualitativeValue",
          "https://schema.org/StructuredValue",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean",
          "https://schema.org/Number",
          "https://schema.org/QualitativeValue",
          "https://schema.org/StructuredValue",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/PropertyValue",
          "https://schema.org/QuantitativeValue"
        ]
      },
      {
        "name": "valueReference",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Enumeration",
          "https://schema.org/MeasurementTypeEnumeration",
          "https://schema.org/PropertyValue",
          "https://schema.org/QualitativeValue",
          "https://schema.org/QuantitativeValue",
          "https://schema.org/StructuredValue",
          "https://schema.org/Text"
        ],
        "description": "A secondary value that provides additional information on the original value, e.g. a reference temperature or a type of measurement.",
        "expectedTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Enumeration",
          "https://schema.org/MeasurementTypeEnumeration",
          "https://schema.org/PropertyValue",
          "https://schema.org/QualitativeValue",
          "https://schema.org/QuantitativeValue",
          "https://schema.org/StructuredValue",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Enumeration",
          "https://schema.org/MeasurementTypeEnumeration",
          "https://schema.org/PropertyValue",
          "https://schema.org/QualitativeValue",
          "https://schema.org/QuantitativeValue",
          "https://schema.org/StructuredValue",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/PropertyValue",
          "https://schema.org/QualitativeValue",
          "https://schema.org/QuantitativeValue"
        ]
      }
    ]
  },
  {
    "name": "QuantitativeValueDistribution",
    "type": "https://schema.org/QuantitativeValueDistribution",
    "source": "generated",
    "description": "A statistical distribution of values.",
    "parentTypes": [
      "https://schema.org/StructuredValue"
    ],
    "properties": [
      {
        "name": "duration",
        "type": [
          "https://schema.org/Duration",
          "https://schema.org/QuantitativeValue"
        ],
        "description": "The duration of the item (movie, audio recording, event, etc.) in [ISO 8601 duration format](http://en.wikipedia.org/wiki/ISO_8601).",
        "expectedTypes": [
          "https://schema.org/Duration",
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/Duration",
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/Audiobook",
          "https://schema.org/Episode",
          "https://schema.org/Event",
          "https://schema.org/MediaObject",
          "https://schema.org/Movie",
          "https://schema.org/MusicRecording",
          "https://schema.org/MusicRelease",
          "https://schema.org/QuantitativeValueDistribution",
          "https://schema.org/Schedule",
          "https://schema.org/ServicePeriod"
        ]
      },
      {
        "name": "median",
        "type": "https://schema.org/Number",
        "description": "The median value.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/QuantitativeValueDistribution"
        ]
      },
      {
        "name": "percentile10",
        "type": "https://schema.org/Number",
        "description": "The 10th percentile value.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/QuantitativeValueDistribution"
        ]
      },
      {
        "name": "percentile25",
        "type": "https://schema.org/Number",
        "description": "The 25th percentile value.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/QuantitativeValueDistribution"
        ]
      },
      {
        "name": "percentile75",
        "type": "https://schema.org/Number",
        "description": "The 75th percentile value.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/QuantitativeValueDistribution"
        ]
      },
      {
        "name": "percentile90",
        "type": "https://schema.org/Number",
        "description": "The 90th percentile value.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/QuantitativeValueDistribution"
        ]
      }
    ]
  },
  {
    "name": "Quantity",
    "type": "https://schema.org/Quantity",
    "source": "generated",
    "description": "Quantities such as distance, time, mass, weight, etc. Particular instances of say Mass are strings like '3 kg' or '4 milligrams'."
  },
  {
    "name": "Question",
    "type": "https://schema.org/Question",
    "source": "generated",
    "description": "A specific question - e.g. from a user seeking answers online, or collected in a Frequently Asked Questions (FAQ) document.",
    "parentTypes": [
      "https://schema.org/Comment"
    ],
    "properties": [
      {
        "name": "acceptedAnswer",
        "type": [
          "https://schema.org/Answer",
          "https://schema.org/ItemList"
        ],
        "description": "The answer(s) that has been accepted as best, typically on a Question/Answer site. Sites vary in their selection mechanisms, e.g. drawing on community opinion and/or the view of the Question author.",
        "expectedTypes": [
          "https://schema.org/Answer",
          "https://schema.org/ItemList"
        ],
        "rangeTypes": [
          "https://schema.org/Answer",
          "https://schema.org/ItemList"
        ],
        "domainTypes": [
          "https://schema.org/Question"
        ]
      },
      {
        "name": "answerCount",
        "type": "https://schema.org/Integer",
        "description": "The number of answers this question has received.",
        "expectedTypes": [
          "https://schema.org/Integer"
        ],
        "rangeTypes": [
          "https://schema.org/Integer"
        ],
        "domainTypes": [
          "https://schema.org/Question"
        ]
      },
      {
        "name": "eduQuestionType",
        "type": "https://schema.org/Text",
        "description": "For questions that are part of learning resources (e.g. Quiz), eduQuestionType indicates the format of question being given. Example: \"Multiple choice\", \"Open ended\", \"Flashcard\".",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Question",
          "https://schema.org/SolveMathAction"
        ]
      },
      {
        "name": "parentItem",
        "type": [
          "https://schema.org/Comment",
          "https://schema.org/CreativeWork"
        ],
        "description": "The parent of a question, answer or item in general. Typically used for Q/A discussion threads e.g. a chain of comments with the first comment being an [[Article]] or other [[CreativeWork]]. See also [[comment]] which points from something to a comment about it.",
        "expectedTypes": [
          "https://schema.org/Comment",
          "https://schema.org/CreativeWork"
        ],
        "rangeTypes": [
          "https://schema.org/Comment",
          "https://schema.org/CreativeWork"
        ],
        "domainTypes": [
          "https://schema.org/Answer",
          "https://schema.org/Comment",
          "https://schema.org/Question"
        ]
      },
      {
        "name": "suggestedAnswer",
        "type": [
          "https://schema.org/Answer",
          "https://schema.org/ItemList"
        ],
        "description": "An answer (possibly one of several, possibly incorrect) to a Question, e.g. on a Question/Answer site.",
        "expectedTypes": [
          "https://schema.org/Answer",
          "https://schema.org/ItemList"
        ],
        "rangeTypes": [
          "https://schema.org/Answer",
          "https://schema.org/ItemList"
        ],
        "domainTypes": [
          "https://schema.org/Question"
        ]
      }
    ]
  },
  {
    "name": "Quiz",
    "type": "https://schema.org/Quiz",
    "source": "generated",
    "description": "Quiz: A test of knowledge, skills and abilities.",
    "parentTypes": [
      "https://schema.org/LearningResource"
    ]
  },
  {
    "name": "Quotation",
    "type": "https://schema.org/Quotation",
    "source": "generated",
    "description": "A quotation. Often but not necessarily from some written work, attributable to a real world author and - if associated with a fictional character - to any fictional Person. Use [[isBasedOn]] to link to source/origin. The [[recordedIn]] property can be used to reference a Quotation from an [[Event]].",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ],
    "properties": [
      {
        "name": "spokenByCharacter",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "The (e.g. fictional) character, Person or Organization to whom the quotation is attributed within the containing CreativeWork.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Quotation"
        ]
      }
    ]
  },
  {
    "name": "QuoteAction",
    "type": "https://schema.org/QuoteAction",
    "source": "generated",
    "description": "An agent quotes/estimates/appraises an object/product/service with a price at a location/store.",
    "parentTypes": [
      "https://schema.org/TradeAction"
    ]
  },
  {
    "name": "RadiationTherapy",
    "type": "https://schema.org/RadiationTherapy",
    "source": "generated",
    "description": "A process of care using radiation aimed at improving a health condition.",
    "parentTypes": [
      "https://schema.org/MedicalTherapy"
    ]
  },
  {
    "name": "RadioBroadcastService",
    "type": "https://schema.org/RadioBroadcastService",
    "source": "generated",
    "description": "A delivery service through which radio content is provided via broadcast over the air or online.",
    "parentTypes": [
      "https://schema.org/BroadcastService"
    ]
  },
  {
    "name": "RadioChannel",
    "type": "https://schema.org/RadioChannel",
    "source": "generated",
    "description": "A unique instance of a radio BroadcastService on a CableOrSatelliteService lineup.",
    "parentTypes": [
      "https://schema.org/BroadcastChannel"
    ]
  },
  {
    "name": "RadioClip",
    "type": "https://schema.org/RadioClip",
    "source": "generated",
    "description": "A short radio program or a segment/part of a radio program.",
    "parentTypes": [
      "https://schema.org/Clip"
    ]
  },
  {
    "name": "RadioEpisode",
    "type": "https://schema.org/RadioEpisode",
    "source": "generated",
    "description": "A radio episode which can be part of a series or season.",
    "parentTypes": [
      "https://schema.org/Episode"
    ]
  },
  {
    "name": "RadioSeason",
    "type": "https://schema.org/RadioSeason",
    "source": "generated",
    "description": "Season dedicated to radio broadcast and associated online delivery.",
    "parentTypes": [
      "https://schema.org/CreativeWorkSeason"
    ]
  },
  {
    "name": "RadioSeries",
    "type": "https://schema.org/RadioSeries",
    "source": "generated",
    "description": "CreativeWorkSeries dedicated to radio broadcast and associated online delivery.",
    "parentTypes": [
      "https://schema.org/CreativeWorkSeries"
    ],
    "properties": [
      {
        "name": "actor",
        "type": [
          "https://schema.org/PerformingGroup",
          "https://schema.org/Person"
        ],
        "description": "An actor (individual or a group), e.g. in TV, radio, movie, video games etc., or in an event. Actors can be associated with individual items or with a series, episode, clip.",
        "expectedTypes": [
          "https://schema.org/PerformingGroup",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/PerformingGroup",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Clip",
          "https://schema.org/CreativeWorkSeason",
          "https://schema.org/Episode",
          "https://schema.org/Event",
          "https://schema.org/Movie",
          "https://schema.org/MovieSeries",
          "https://schema.org/PodcastSeries",
          "https://schema.org/RadioSeries",
          "https://schema.org/TVSeries",
          "https://schema.org/VideoGame",
          "https://schema.org/VideoGameSeries",
          "https://schema.org/VideoObject"
        ]
      },
      {
        "name": "actors",
        "type": "https://schema.org/Person",
        "description": "An actor, e.g. in TV, radio, movie, video games etc. Actors can be associated with individual items or with a series, episode, clip.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Clip",
          "https://schema.org/Episode",
          "https://schema.org/Movie",
          "https://schema.org/MovieSeries",
          "https://schema.org/RadioSeries",
          "https://schema.org/TVSeries",
          "https://schema.org/VideoGame",
          "https://schema.org/VideoGameSeries",
          "https://schema.org/VideoObject"
        ],
        "supersededBy": "https://schema.org/actor"
      },
      {
        "name": "containsSeason",
        "type": "https://schema.org/CreativeWorkSeason",
        "description": "A season that is part of the media series.",
        "expectedTypes": [
          "https://schema.org/CreativeWorkSeason"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWorkSeason"
        ],
        "domainTypes": [
          "https://schema.org/RadioSeries",
          "https://schema.org/TVSeries",
          "https://schema.org/VideoGameSeries"
        ]
      },
      {
        "name": "director",
        "type": "https://schema.org/Person",
        "description": "A director of e.g. TV, radio, movie, video gaming etc. content, or of an event. Directors can be associated with individual items or with a series, episode, clip.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Clip",
          "https://schema.org/CreativeWorkSeason",
          "https://schema.org/Episode",
          "https://schema.org/Event",
          "https://schema.org/Movie",
          "https://schema.org/MovieSeries",
          "https://schema.org/RadioSeries",
          "https://schema.org/TVSeries",
          "https://schema.org/VideoGame",
          "https://schema.org/VideoGameSeries",
          "https://schema.org/VideoObject"
        ]
      },
      {
        "name": "directors",
        "type": "https://schema.org/Person",
        "description": "A director of e.g. TV, radio, movie, video games etc. content. Directors can be associated with individual items or with a series, episode, clip.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Clip",
          "https://schema.org/Episode",
          "https://schema.org/Movie",
          "https://schema.org/MovieSeries",
          "https://schema.org/RadioSeries",
          "https://schema.org/TVSeries",
          "https://schema.org/VideoGame",
          "https://schema.org/VideoGameSeries",
          "https://schema.org/VideoObject"
        ],
        "supersededBy": "https://schema.org/director"
      },
      {
        "name": "episode",
        "type": "https://schema.org/Episode",
        "description": "An episode of a TV, radio or game media within a series or season.",
        "expectedTypes": [
          "https://schema.org/Episode"
        ],
        "rangeTypes": [
          "https://schema.org/Episode"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWorkSeason",
          "https://schema.org/RadioSeries",
          "https://schema.org/TVSeries",
          "https://schema.org/VideoGameSeries"
        ]
      },
      {
        "name": "episodes",
        "type": "https://schema.org/Episode",
        "description": "An episode of a TV/radio series or season.",
        "expectedTypes": [
          "https://schema.org/Episode"
        ],
        "rangeTypes": [
          "https://schema.org/Episode"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWorkSeason",
          "https://schema.org/RadioSeries",
          "https://schema.org/TVSeries",
          "https://schema.org/VideoGameSeries"
        ],
        "supersededBy": "https://schema.org/episode"
      },
      {
        "name": "musicBy",
        "type": [
          "https://schema.org/MusicGroup",
          "https://schema.org/Person"
        ],
        "description": "The composer of the soundtrack.",
        "expectedTypes": [
          "https://schema.org/MusicGroup",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/MusicGroup",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Clip",
          "https://schema.org/Episode",
          "https://schema.org/Movie",
          "https://schema.org/MovieSeries",
          "https://schema.org/RadioSeries",
          "https://schema.org/TVSeries",
          "https://schema.org/VideoGame",
          "https://schema.org/VideoGameSeries",
          "https://schema.org/VideoObject"
        ]
      },
      {
        "name": "numberOfEpisodes",
        "type": "https://schema.org/Integer",
        "description": "The number of episodes in this season or series.",
        "expectedTypes": [
          "https://schema.org/Integer"
        ],
        "rangeTypes": [
          "https://schema.org/Integer"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWorkSeason",
          "https://schema.org/RadioSeries",
          "https://schema.org/TVSeries",
          "https://schema.org/VideoGameSeries"
        ]
      },
      {
        "name": "numberOfSeasons",
        "type": "https://schema.org/Integer",
        "description": "The number of seasons in this series.",
        "expectedTypes": [
          "https://schema.org/Integer"
        ],
        "rangeTypes": [
          "https://schema.org/Integer"
        ],
        "domainTypes": [
          "https://schema.org/RadioSeries",
          "https://schema.org/TVSeries",
          "https://schema.org/VideoGameSeries"
        ]
      },
      {
        "name": "productionCompany",
        "type": "https://schema.org/Organization",
        "description": "The production company or studio responsible for the item, e.g. series, video game, episode etc.",
        "expectedTypes": [
          "https://schema.org/Organization"
        ],
        "rangeTypes": [
          "https://schema.org/Organization"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWorkSeason",
          "https://schema.org/Episode",
          "https://schema.org/MediaObject",
          "https://schema.org/Movie",
          "https://schema.org/MovieSeries",
          "https://schema.org/RadioSeries",
          "https://schema.org/TVSeries",
          "https://schema.org/VideoGameSeries"
        ]
      },
      {
        "name": "season",
        "type": [
          "https://schema.org/CreativeWorkSeason",
          "https://schema.org/URL"
        ],
        "description": "A season in a media series.",
        "expectedTypes": [
          "https://schema.org/CreativeWorkSeason",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWorkSeason",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/RadioSeries",
          "https://schema.org/TVSeries",
          "https://schema.org/VideoGameSeries"
        ],
        "supersededBy": "https://schema.org/containsSeason"
      },
      {
        "name": "seasons",
        "type": "https://schema.org/CreativeWorkSeason",
        "description": "A season in a media series.",
        "expectedTypes": [
          "https://schema.org/CreativeWorkSeason"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWorkSeason"
        ],
        "domainTypes": [
          "https://schema.org/RadioSeries",
          "https://schema.org/TVSeries",
          "https://schema.org/VideoGameSeries"
        ],
        "supersededBy": "https://schema.org/season"
      },
      {
        "name": "trailer",
        "type": "https://schema.org/VideoObject",
        "description": "The trailer of a movie or TV/radio series, season, episode, etc.",
        "expectedTypes": [
          "https://schema.org/VideoObject"
        ],
        "rangeTypes": [
          "https://schema.org/VideoObject"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWorkSeason",
          "https://schema.org/Episode",
          "https://schema.org/Movie",
          "https://schema.org/MovieSeries",
          "https://schema.org/RadioSeries",
          "https://schema.org/TVSeries",
          "https://schema.org/VideoGame",
          "https://schema.org/VideoGameSeries"
        ]
      }
    ]
  },
  {
    "name": "RadioStation",
    "type": "https://schema.org/RadioStation",
    "source": "generated",
    "description": "A radio station.",
    "parentTypes": [
      "https://schema.org/LocalBusiness"
    ]
  },
  {
    "name": "Rating",
    "type": "https://schema.org/Rating",
    "source": "generated",
    "description": "A rating is an evaluation on a numeric scale, such as 1 to 5 stars.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "author",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "The author of this content or rating. Please note that author is special in that HTML 5 provides a special mechanism for indicating authorship via the rel tag. That is equivalent to this and may be used interchangeably.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Rating"
        ]
      },
      {
        "name": "bestRating",
        "type": [
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "description": "The highest value allowed in this rating system.",
        "expectedTypes": [
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Rating"
        ]
      },
      {
        "name": "ratingExplanation",
        "type": "https://schema.org/Text",
        "description": "A short explanation (e.g. one to two sentences) providing background context and other information that led to the conclusion expressed in the rating. This is particularly applicable to ratings associated with \"fact check\" markup using [[ClaimReview]].",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Rating"
        ]
      },
      {
        "name": "ratingValue",
        "type": [
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "description": "The rating for the content.\\n\\nUsage guidelines:\\n\\n* Use values from 0123456789 (Unicode 'DIGIT ZERO' (U+0030) to 'DIGIT NINE' (U+0039)) rather than superficially similar Unicode symbols.\\n* Use '.' (Unicode 'FULL STOP' (U+002E)) rather than ',' to indicate a decimal point. Avoid using these symbols as a readability separator.",
        "expectedTypes": [
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Rating"
        ]
      },
      {
        "name": "reviewAspect",
        "type": [
          "https://schema.org/StructuredValue",
          "https://schema.org/Text"
        ],
        "description": "This Review or Rating is relevant to this part or facet of the itemReviewed.",
        "expectedTypes": [
          "https://schema.org/StructuredValue",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/StructuredValue",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Guide",
          "https://schema.org/Rating",
          "https://schema.org/Review"
        ]
      },
      {
        "name": "worstRating",
        "type": [
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "description": "The lowest value allowed in this rating system.",
        "expectedTypes": [
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Rating"
        ]
      }
    ]
  },
  {
    "name": "ReactAction",
    "type": "https://schema.org/ReactAction",
    "source": "generated",
    "description": "The act of responding instinctively and emotionally to an object, expressing a sentiment.",
    "parentTypes": [
      "https://schema.org/AssessAction"
    ]
  },
  {
    "name": "ReadAction",
    "type": "https://schema.org/ReadAction",
    "source": "generated",
    "description": "The act of consuming written content.",
    "parentTypes": [
      "https://schema.org/ConsumeAction"
    ]
  },
  {
    "name": "RealEstateAgent",
    "type": "https://schema.org/RealEstateAgent",
    "source": "generated",
    "description": "A real-estate agent.",
    "parentTypes": [
      "https://schema.org/LocalBusiness"
    ]
  },
  {
    "name": "RealEstateListing",
    "type": "https://schema.org/RealEstateListing",
    "source": "generated",
    "description": "A [[RealEstateListing]] is a listing that describes one or more real-estate [[Offer]]s (whose [[businessFunction]] is typically to lease out, or to sell).\n  The [[RealEstateListing]] type itself represents the overall listing, as manifested in some [[WebPage]].\n  ",
    "parentTypes": [
      "https://schema.org/WebPage"
    ],
    "properties": [
      {
        "name": "datePosted",
        "type": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "description": "Publication date of an online listing.",
        "expectedTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/CDCPMDRecord",
          "https://schema.org/JobPosting",
          "https://schema.org/RealEstateListing",
          "https://schema.org/SpecialAnnouncement"
        ]
      },
      {
        "name": "leaseLength",
        "type": [
          "https://schema.org/Duration",
          "https://schema.org/QuantitativeValue"
        ],
        "description": "Length of the lease for some [[Accommodation]], either particular to some [[Offer]] or in some cases intrinsic to the property.",
        "expectedTypes": [
          "https://schema.org/Duration",
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/Duration",
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/Accommodation",
          "https://schema.org/Offer",
          "https://schema.org/RealEstateListing"
        ]
      }
    ]
  },
  {
    "name": "ReceiveAction",
    "type": "https://schema.org/ReceiveAction",
    "source": "generated",
    "description": "The act of physically/electronically taking delivery of an object that has been transferred from an origin to a destination. Reciprocal of SendAction.\\n\\nRelated actions:\\n\\n* [[SendAction]]: The reciprocal of ReceiveAction.\\n* [[TakeAction]]: Unlike TakeAction, ReceiveAction does not imply that the ownership has been transferred (e.g. I can receive a package, but it does not mean the package is now mine).",
    "parentTypes": [
      "https://schema.org/TransferAction"
    ],
    "properties": [
      {
        "name": "deliveryMethod",
        "type": "https://schema.org/DeliveryMethod",
        "description": "A sub property of instrument. The method of delivery.",
        "expectedTypes": [
          "https://schema.org/DeliveryMethod"
        ],
        "rangeTypes": [
          "https://schema.org/DeliveryMethod"
        ],
        "domainTypes": [
          "https://schema.org/OrderAction",
          "https://schema.org/ReceiveAction",
          "https://schema.org/SendAction",
          "https://schema.org/TrackAction"
        ]
      },
      {
        "name": "sender",
        "type": [
          "https://schema.org/Audience",
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "A sub property of participant. The participant who is at the sending end of the action.",
        "expectedTypes": [
          "https://schema.org/Audience",
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Audience",
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Message",
          "https://schema.org/ReceiveAction"
        ]
      }
    ]
  },
  {
    "name": "Recipe",
    "type": "https://schema.org/Recipe",
    "source": "generated",
    "description": "A recipe. For dietary restrictions covered by the recipe, a few common restrictions are enumerated via [[suitableForDiet]]. The [[keywords]] property can also be used to add more detail.",
    "parentTypes": [
      "https://schema.org/HowTo"
    ],
    "properties": [
      {
        "name": "cookingMethod",
        "type": "https://schema.org/Text",
        "description": "The method of cooking, such as Frying, Steaming, ...",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Recipe"
        ]
      },
      {
        "name": "cookTime",
        "type": "https://schema.org/Duration",
        "description": "The time it takes to actually cook the dish, in [ISO 8601 duration format](http://en.wikipedia.org/wiki/ISO_8601).",
        "expectedTypes": [
          "https://schema.org/Duration"
        ],
        "rangeTypes": [
          "https://schema.org/Duration"
        ],
        "domainTypes": [
          "https://schema.org/Recipe"
        ]
      },
      {
        "name": "ingredients",
        "type": "https://schema.org/Text",
        "description": "A single ingredient used in the recipe, e.g. sugar, flour or garlic.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Recipe"
        ],
        "supersededBy": "https://schema.org/recipeIngredient"
      },
      {
        "name": "nutrition",
        "type": "https://schema.org/NutritionInformation",
        "description": "Nutrition information about the recipe or menu item.",
        "expectedTypes": [
          "https://schema.org/NutritionInformation"
        ],
        "rangeTypes": [
          "https://schema.org/NutritionInformation"
        ],
        "domainTypes": [
          "https://schema.org/MenuItem",
          "https://schema.org/Recipe"
        ]
      },
      {
        "name": "recipeCategory",
        "type": "https://schema.org/Text",
        "description": "The category of the recipe—for example, appetizer, entree, etc.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Recipe"
        ]
      },
      {
        "name": "recipeCuisine",
        "type": "https://schema.org/Text",
        "description": "The cuisine of the recipe (for example, French or Ethiopian).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Recipe"
        ]
      },
      {
        "name": "recipeIngredient",
        "type": [
          "https://schema.org/ItemList",
          "https://schema.org/PropertyValue",
          "https://schema.org/Text"
        ],
        "description": "An ingredient or ordered list of ingredients and potentially quantities used in the recipe, e.g. 1 cup of sugar, flour or garlic.  The ingredients can be represented as free text or more structured values.",
        "expectedTypes": [
          "https://schema.org/ItemList",
          "https://schema.org/PropertyValue",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/ItemList",
          "https://schema.org/PropertyValue",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Recipe"
        ]
      },
      {
        "name": "recipeInstructions",
        "type": [
          "https://schema.org/CreativeWork",
          "https://schema.org/ItemList",
          "https://schema.org/Text"
        ],
        "description": "A step in making the recipe, in the form of a single item (document, video, etc.) or an ordered list with HowToStep and/or HowToSection items.",
        "expectedTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/ItemList",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/ItemList",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Recipe"
        ]
      },
      {
        "name": "recipeYield",
        "type": [
          "https://schema.org/QuantitativeValue",
          "https://schema.org/Text"
        ],
        "description": "The quantity produced by the recipe (for example, number of people served, number of servings, etc).",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Recipe"
        ]
      },
      {
        "name": "suitableForDiet",
        "type": [
          "https://schema.org/Diet",
          "https://schema.org/RestrictedDiet"
        ],
        "description": "Indicates a dietary restriction or guideline for which this recipe or menu item is suitable, e.g. diabetic, halal etc.",
        "expectedTypes": [
          "https://schema.org/Diet",
          "https://schema.org/RestrictedDiet"
        ],
        "rangeTypes": [
          "https://schema.org/Diet",
          "https://schema.org/RestrictedDiet"
        ],
        "domainTypes": [
          "https://schema.org/MenuItem",
          "https://schema.org/Recipe"
        ]
      }
    ]
  },
  {
    "name": "Recommendation",
    "type": "https://schema.org/Recommendation",
    "source": "generated",
    "description": "[[Recommendation]] is a type of [[Review]] that suggests or proposes something as the best option or best course of action. Recommendations may be for products or services, or other concrete things, as in the case of a ranked list or product guide. A [[Guide]] may list multiple recommendations for different categories. For example, in a [[Guide]] about which TVs to buy, the author may have several [[Recommendation]]s.",
    "parentTypes": [
      "https://schema.org/Review"
    ],
    "properties": [
      {
        "name": "category",
        "type": [
          "https://schema.org/CategoryCode",
          "https://schema.org/PhysicalActivityCategory",
          "https://schema.org/Text",
          "https://schema.org/Thing",
          "https://schema.org/URL"
        ],
        "description": "A category for the item. Greater signs or slashes can be used to informally indicate a category hierarchy.",
        "expectedTypes": [
          "https://schema.org/CategoryCode",
          "https://schema.org/PhysicalActivityCategory",
          "https://schema.org/Text",
          "https://schema.org/Thing",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/CategoryCode",
          "https://schema.org/PhysicalActivityCategory",
          "https://schema.org/Text",
          "https://schema.org/Thing",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/ActionAccessSpecification",
          "https://schema.org/Guide",
          "https://schema.org/Invoice",
          "https://schema.org/Offer",
          "https://schema.org/PhysicalActivity",
          "https://schema.org/Product",
          "https://schema.org/Recommendation",
          "https://schema.org/Service",
          "https://schema.org/SpecialAnnouncement"
        ]
      }
    ]
  },
  {
    "name": "RecommendedDoseSchedule",
    "type": "https://schema.org/RecommendedDoseSchedule",
    "source": "generated",
    "description": "A recommended dosing schedule for a drug or supplement as prescribed or recommended by an authority or by the drug/supplement's manufacturer. Capture the recommending authority in the recognizingAuthority property of MedicalEntity.",
    "parentTypes": [
      "https://schema.org/DoseSchedule"
    ]
  },
  {
    "name": "RecyclingCenter",
    "type": "https://schema.org/RecyclingCenter",
    "source": "generated",
    "description": "A recycling center.",
    "parentTypes": [
      "https://schema.org/LocalBusiness"
    ]
  },
  {
    "name": "RefundTypeEnumeration",
    "type": "https://schema.org/RefundTypeEnumeration",
    "source": "generated",
    "description": "Enumerates several kinds of product return refund types.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "ExchangeRefund",
        "type": "https://schema.org/ExchangeRefund",
        "description": "Specifies that a refund can be done as an exchange for the same product."
      },
      {
        "name": "FullRefund",
        "type": "https://schema.org/FullRefund",
        "description": "Specifies that a refund can be done in the full amount the customer paid for the product."
      },
      {
        "name": "StoreCreditRefund",
        "type": "https://schema.org/StoreCreditRefund",
        "description": "Specifies that the customer receives a store credit as refund when returning a product."
      }
    ]
  },
  {
    "name": "RegisterAction",
    "type": "https://schema.org/RegisterAction",
    "source": "generated",
    "description": "The act of registering to be a user of a service, product or web page.\\n\\nRelated actions:\\n\\n* [[JoinAction]]: Unlike JoinAction, RegisterAction implies you are registering to be a user of a service, *not* a group/team of people.\\n* [[FollowAction]]: Unlike FollowAction, RegisterAction doesn't imply that the agent is expecting to poll for updates from the object.\\n* [[SubscribeAction]]: Unlike SubscribeAction, RegisterAction doesn't imply that the agent is expecting updates from the object.",
    "parentTypes": [
      "https://schema.org/InteractAction"
    ]
  },
  {
    "name": "RejectAction",
    "type": "https://schema.org/RejectAction",
    "source": "generated",
    "description": "The act of rejecting to/adopting an object.\\n\\nRelated actions:\\n\\n* [[AcceptAction]]: The antonym of RejectAction.",
    "parentTypes": [
      "https://schema.org/AllocateAction"
    ]
  },
  {
    "name": "RentAction",
    "type": "https://schema.org/RentAction",
    "source": "generated",
    "description": "The act of giving money in return for temporary use, but not ownership, of an object such as a vehicle or property. For example, an agent rents a property from a landlord in exchange for a periodic payment.",
    "parentTypes": [
      "https://schema.org/TradeAction"
    ],
    "properties": [
      {
        "name": "landlord",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "A sub property of participant. The owner of the real estate property.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/RentAction"
        ]
      },
      {
        "name": "realEstateAgent",
        "type": "https://schema.org/RealEstateAgent",
        "description": "A sub property of participant. The real estate agent involved in the action.",
        "expectedTypes": [
          "https://schema.org/RealEstateAgent"
        ],
        "rangeTypes": [
          "https://schema.org/RealEstateAgent"
        ],
        "domainTypes": [
          "https://schema.org/RentAction"
        ]
      }
    ]
  },
  {
    "name": "RentalCarReservation",
    "type": "https://schema.org/RentalCarReservation",
    "source": "generated",
    "description": "A reservation for a rental car.\\n\\nNote: This type is for information about actual reservations, e.g. in confirmation emails or HTML pages with individual confirmations of reservations.",
    "parentTypes": [
      "https://schema.org/Reservation"
    ],
    "properties": [
      {
        "name": "dropoffLocation",
        "type": "https://schema.org/Place",
        "description": "Where a rental car can be dropped off.",
        "expectedTypes": [
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/RentalCarReservation"
        ]
      },
      {
        "name": "dropoffTime",
        "type": "https://schema.org/DateTime",
        "description": "When a rental car can be dropped off.",
        "expectedTypes": [
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/RentalCarReservation"
        ]
      },
      {
        "name": "pickupLocation",
        "type": "https://schema.org/Place",
        "description": "Where a taxi will pick up a passenger or a rental car can be picked up.",
        "expectedTypes": [
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/RentalCarReservation",
          "https://schema.org/TaxiReservation"
        ]
      },
      {
        "name": "pickupTime",
        "type": "https://schema.org/DateTime",
        "description": "When a taxi will pick up a passenger or a rental car can be picked up.",
        "expectedTypes": [
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/RentalCarReservation",
          "https://schema.org/TaxiReservation"
        ]
      }
    ]
  },
  {
    "name": "RepaymentSpecification",
    "type": "https://schema.org/RepaymentSpecification",
    "source": "generated",
    "description": "A structured value representing repayment.",
    "parentTypes": [
      "https://schema.org/StructuredValue"
    ],
    "properties": [
      {
        "name": "downPayment",
        "type": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/Number"
        ],
        "description": "a type of payment made in cash during the onset of the purchase of an expensive good/service. The payment typically represents only a percentage of the full purchase price.",
        "expectedTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/RepaymentSpecification"
        ]
      },
      {
        "name": "earlyPrepaymentPenalty",
        "type": "https://schema.org/MonetaryAmount",
        "description": "The amount to be paid as a penalty in the event of early payment of the loan.",
        "expectedTypes": [
          "https://schema.org/MonetaryAmount"
        ],
        "rangeTypes": [
          "https://schema.org/MonetaryAmount"
        ],
        "domainTypes": [
          "https://schema.org/RepaymentSpecification"
        ]
      },
      {
        "name": "loanPaymentAmount",
        "type": "https://schema.org/MonetaryAmount",
        "description": "The amount of money to pay in a single payment.",
        "expectedTypes": [
          "https://schema.org/MonetaryAmount"
        ],
        "rangeTypes": [
          "https://schema.org/MonetaryAmount"
        ],
        "domainTypes": [
          "https://schema.org/RepaymentSpecification"
        ]
      },
      {
        "name": "loanPaymentFrequency",
        "type": "https://schema.org/Number",
        "description": "Frequency of payments due, i.e. number of months between payments. This is defined as a frequency, i.e. the reciprocal of a period of time.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/RepaymentSpecification"
        ]
      },
      {
        "name": "numberOfLoanPayments",
        "type": "https://schema.org/Number",
        "description": "The number of payments contractually required at origination to repay the loan. For monthly paying loans this is the number of months from the contractual first payment date to the maturity date.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/RepaymentSpecification"
        ]
      }
    ]
  },
  {
    "name": "ReplaceAction",
    "type": "https://schema.org/ReplaceAction",
    "source": "generated",
    "description": "The act of editing a recipient by replacing an old object with a new object.",
    "parentTypes": [
      "https://schema.org/UpdateAction"
    ],
    "properties": [
      {
        "name": "replacee",
        "type": "https://schema.org/Thing",
        "description": "A sub property of object. The object that is being replaced.",
        "expectedTypes": [
          "https://schema.org/Thing"
        ],
        "rangeTypes": [
          "https://schema.org/Thing"
        ],
        "domainTypes": [
          "https://schema.org/ReplaceAction"
        ]
      },
      {
        "name": "replacer",
        "type": "https://schema.org/Thing",
        "description": "A sub property of object. The object that replaces.",
        "expectedTypes": [
          "https://schema.org/Thing"
        ],
        "rangeTypes": [
          "https://schema.org/Thing"
        ],
        "domainTypes": [
          "https://schema.org/ReplaceAction"
        ]
      }
    ]
  },
  {
    "name": "ReplyAction",
    "type": "https://schema.org/ReplyAction",
    "source": "generated",
    "description": "The act of responding to a question/message asked/sent by the object. Related to [[AskAction]].\\n\\nRelated actions:\\n\\n* [[AskAction]]: Appears generally as an origin of a ReplyAction.",
    "parentTypes": [
      "https://schema.org/CommunicateAction"
    ],
    "properties": [
      {
        "name": "resultComment",
        "type": "https://schema.org/Comment",
        "description": "A sub property of result. The Comment created or sent as a result of this action.",
        "expectedTypes": [
          "https://schema.org/Comment"
        ],
        "rangeTypes": [
          "https://schema.org/Comment"
        ],
        "domainTypes": [
          "https://schema.org/CommentAction",
          "https://schema.org/ReplyAction"
        ]
      }
    ]
  },
  {
    "name": "Report",
    "type": "https://schema.org/Report",
    "source": "generated",
    "description": "A Report generated by governmental or non-governmental organization.",
    "parentTypes": [
      "https://schema.org/Article"
    ],
    "properties": [
      {
        "name": "reportNumber",
        "type": "https://schema.org/Text",
        "description": "The number or other unique designator assigned to a Report by the publishing organization.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Report"
        ]
      }
    ]
  },
  {
    "name": "ReportageNewsArticle",
    "type": "https://schema.org/ReportageNewsArticle",
    "source": "generated",
    "description": "The [[ReportageNewsArticle]] type is a subtype of [[NewsArticle]] representing\n news articles which are the result of journalistic news reporting conventions.\n\nIn practice many news publishers produce a wide variety of article types, many of which might be considered a [[NewsArticle]] but not a [[ReportageNewsArticle]]. For example, opinion pieces, reviews, analysis, sponsored or satirical articles, or articles that combine several of these elements.\n\nThe [[ReportageNewsArticle]] type is based on a stricter ideal for \"news\" as a work of journalism, with articles based on factual information either observed or verified by the author, or reported and verified from knowledgeable sources.  This often includes perspectives from multiple viewpoints on a particular issue (distinguishing news reports from public relations or propaganda).  News reports in the [[ReportageNewsArticle]] sense de-emphasize the opinion of the author, with commentary and value judgements typically expressed elsewhere.\n\nA [[ReportageNewsArticle]] which goes deeper into analysis can also be marked with an additional type of [[AnalysisNewsArticle]].\n",
    "parentTypes": [
      "https://schema.org/NewsArticle"
    ]
  },
  {
    "name": "ReportedDoseSchedule",
    "type": "https://schema.org/ReportedDoseSchedule",
    "source": "generated",
    "description": "A patient-reported or observed dosing schedule for a drug or supplement.",
    "parentTypes": [
      "https://schema.org/DoseSchedule"
    ]
  },
  {
    "name": "RequestForQuotation",
    "type": "http://unece.org/vocab#RequestForQuotation",
    "source": "generated"
  },
  {
    "name": "Researcher",
    "type": "https://schema.org/Researcher",
    "source": "generated",
    "description": "Researchers.",
    "parentTypes": [
      "https://schema.org/Audience"
    ]
  }
] satisfies readonly SchemaDefinition[];
