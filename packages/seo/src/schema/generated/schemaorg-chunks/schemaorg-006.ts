/*
 * This file is generated. Do not edit manually.
 * Schema.org version: 30.1
 * Source SHA-256: 0a4b8c4c910fc831ec8695196510973390906a5ee34dc6b862dfec4d21a12f74
 */

import type { SchemaDefinition } from "../../types";

export const generatedSchemaDefinitions6: readonly SchemaDefinition[] =
[
  {
    "name": "ResearchOrganization",
    "type": "https://schema.org/ResearchOrganization",
    "source": "generated",
    "description": "A Research Organization (e.g. scientific institute, research company).",
    "parentTypes": [
      "https://schema.org/Organization"
    ]
  },
  {
    "name": "ResearchProject",
    "type": "https://schema.org/ResearchProject",
    "source": "generated",
    "description": "A Research project.",
    "parentTypes": [
      "https://schema.org/Project"
    ]
  },
  {
    "name": "Reservation",
    "type": "https://schema.org/Reservation",
    "source": "generated",
    "description": "Describes a reservation for travel, dining or an event. Some reservations require tickets. \\n\\nNote: This type is for information about actual reservations, e.g. in confirmation emails or HTML pages with individual confirmations of reservations. For offers of tickets, restaurant reservations, flights, or rental cars, use [[Offer]].",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "bookingAgent",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "'bookingAgent' is an out-dated term indicating a 'broker' that serves as a booking agent.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Reservation"
        ],
        "supersededBy": "https://schema.org/broker"
      },
      {
        "name": "bookingTime",
        "type": "https://schema.org/DateTime",
        "description": "The date and time the reservation was booked.",
        "expectedTypes": [
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/Reservation"
        ]
      },
      {
        "name": "broker",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "An entity that arranges for an exchange between a buyer and a seller.  In most cases a broker never acquires or releases ownership of a product or service involved in an exchange.  If it is not clear whether an entity is a broker, seller, or buyer, the latter two terms are preferred.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Invoice",
          "https://schema.org/Order",
          "https://schema.org/Reservation",
          "https://schema.org/Service"
        ]
      },
      {
        "name": "modifiedTime",
        "type": "https://schema.org/DateTime",
        "description": "The date and time the reservation was modified.",
        "expectedTypes": [
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/Reservation"
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
        "name": "programMembershipUsed",
        "type": "https://schema.org/ProgramMembership",
        "description": "Any membership in a frequent flyer, hotel loyalty program, etc. being applied to the reservation.",
        "expectedTypes": [
          "https://schema.org/ProgramMembership"
        ],
        "rangeTypes": [
          "https://schema.org/ProgramMembership"
        ],
        "domainTypes": [
          "https://schema.org/Reservation"
        ]
      },
      {
        "name": "provider",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "The service provider, service operator, or service performer; the goods producer. Another party (a seller) may offer those services or goods on behalf of the provider. A provider may also serve as the seller.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Action",
          "https://schema.org/CreativeWork",
          "https://schema.org/EducationalOccupationalProgram",
          "https://schema.org/FinancialIncentive",
          "https://schema.org/Invoice",
          "https://schema.org/OfferShippingDetails",
          "https://schema.org/ParcelDelivery",
          "https://schema.org/Reservation",
          "https://schema.org/Service",
          "https://schema.org/Trip"
        ]
      },
      {
        "name": "reservationFor",
        "type": "https://schema.org/Thing",
        "description": "The thing -- flight, event, restaurant, etc. being reserved.",
        "expectedTypes": [
          "https://schema.org/Thing"
        ],
        "rangeTypes": [
          "https://schema.org/Thing"
        ],
        "domainTypes": [
          "https://schema.org/Reservation"
        ]
      },
      {
        "name": "reservationId",
        "type": "https://schema.org/Text",
        "description": "A unique identifier for the reservation.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Reservation"
        ]
      },
      {
        "name": "reservationStatus",
        "type": "https://schema.org/ReservationStatusType",
        "description": "The current status of the reservation.",
        "expectedTypes": [
          "https://schema.org/ReservationStatusType"
        ],
        "rangeTypes": [
          "https://schema.org/ReservationStatusType"
        ],
        "domainTypes": [
          "https://schema.org/Reservation"
        ]
      },
      {
        "name": "reservedTicket",
        "type": "https://schema.org/Ticket",
        "description": "A ticket associated with the reservation.",
        "expectedTypes": [
          "https://schema.org/Ticket"
        ],
        "rangeTypes": [
          "https://schema.org/Ticket"
        ],
        "domainTypes": [
          "https://schema.org/Reservation"
        ]
      },
      {
        "name": "totalPrice",
        "type": [
          "https://schema.org/Number",
          "https://schema.org/PriceSpecification",
          "https://schema.org/Text"
        ],
        "description": "The total price for the reservation or ticket, including applicable taxes, shipping, etc.\\n\\nUsage guidelines:\\n\\n* Use values from 0123456789 (Unicode 'DIGIT ZERO' (U+0030) to 'DIGIT NINE' (U+0039)) rather than superficially similar Unicode symbols.\\n* Use '.' (Unicode 'FULL STOP' (U+002E)) rather than ',' to indicate a decimal point. Avoid using these symbols as a readability separator.",
        "expectedTypes": [
          "https://schema.org/Number",
          "https://schema.org/PriceSpecification",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Number",
          "https://schema.org/PriceSpecification",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Reservation",
          "https://schema.org/Ticket"
        ]
      },
      {
        "name": "underName",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "The person or organization the reservation or ticket is for.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Reservation",
          "https://schema.org/Ticket"
        ]
      }
    ]
  },
  {
    "name": "ReservationPackage",
    "type": "https://schema.org/ReservationPackage",
    "source": "generated",
    "description": "A group of multiple reservations with common values for all sub-reservations.",
    "parentTypes": [
      "https://schema.org/Reservation"
    ],
    "properties": [
      {
        "name": "subReservation",
        "type": "https://schema.org/Reservation",
        "description": "The individual reservations included in the package. Typically a repeated property.",
        "expectedTypes": [
          "https://schema.org/Reservation"
        ],
        "rangeTypes": [
          "https://schema.org/Reservation"
        ],
        "domainTypes": [
          "https://schema.org/ReservationPackage"
        ]
      }
    ]
  },
  {
    "name": "ReservationStatusType",
    "type": "https://schema.org/ReservationStatusType",
    "source": "generated",
    "description": "Enumerated status values for Reservation.",
    "parentTypes": [
      "https://schema.org/StatusEnumeration"
    ],
    "enumerationValues": [
      {
        "name": "ReservationCancelled",
        "type": "https://schema.org/ReservationCancelled",
        "description": "The status for a previously confirmed reservation that is now cancelled."
      },
      {
        "name": "ReservationConfirmed",
        "type": "https://schema.org/ReservationConfirmed",
        "description": "The status of a confirmed reservation."
      },
      {
        "name": "ReservationHold",
        "type": "https://schema.org/ReservationHold",
        "description": "The status of a reservation on hold pending an update like credit card number or flight changes."
      },
      {
        "name": "ReservationPending",
        "type": "https://schema.org/ReservationPending",
        "description": "The status of a reservation when a request has been sent, but not confirmed."
      }
    ]
  },
  {
    "name": "ReserveAction",
    "type": "https://schema.org/ReserveAction",
    "source": "generated",
    "description": "Reserving a concrete object.\\n\\nRelated actions:\\n\\n* [[ScheduleAction]]: Unlike ScheduleAction, ReserveAction reserves concrete objects (e.g. a table, a hotel) towards a time slot / spatial allocation.",
    "parentTypes": [
      "https://schema.org/PlanAction"
    ]
  },
  {
    "name": "Reservoir",
    "type": "https://schema.org/Reservoir",
    "source": "generated",
    "description": "A reservoir of water, typically an artificially created lake, like the Lake Kariba reservoir.",
    "parentTypes": [
      "https://schema.org/BodyOfWater"
    ]
  },
  {
    "name": "ResetPasswordAction",
    "type": "https://schema.org/ResetPasswordAction",
    "source": "generated",
    "description": "The action of resetting the password of a device or application.",
    "parentTypes": [
      "https://schema.org/ControlAction"
    ]
  },
  {
    "name": "Residence",
    "type": "https://schema.org/Residence",
    "source": "generated",
    "description": "The place where a person lives.",
    "parentTypes": [
      "https://schema.org/Place"
    ],
    "properties": [
      {
        "name": "accommodationFloorPlan",
        "type": "https://schema.org/FloorPlan",
        "description": "A floorplan of some [[Accommodation]].",
        "expectedTypes": [
          "https://schema.org/FloorPlan"
        ],
        "rangeTypes": [
          "https://schema.org/FloorPlan"
        ],
        "domainTypes": [
          "https://schema.org/Accommodation",
          "https://schema.org/Residence"
        ]
      },
      {
        "name": "floorLevel",
        "type": "https://schema.org/Text",
        "description": "The floor level for an [[Accommodation]] in a multi-storey building. Since counting\n  systems [vary internationally](https://en.wikipedia.org/wiki/Storey#Consecutive_number_floor_designations), the local system should be used where possible.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Accommodation",
          "https://schema.org/LocalBusiness",
          "https://schema.org/Residence"
        ]
      }
    ]
  },
  {
    "name": "Resort",
    "type": "https://schema.org/Resort",
    "source": "generated",
    "description": "A resort is a place used for relaxation or recreation, attracting visitors for holidays or vacations. Resorts are places, towns or sometimes commercial establishments operated by a single company (source: Wikipedia, the free encyclopedia, see <a href=\"http://en.wikipedia.org/wiki/Resort\">http://en.wikipedia.org/wiki/Resort</a>).\n<br /><br />\nSee also the <a href=\"/docs/hotels.html\">dedicated document on the use of schema.org for marking up hotels and other forms of accommodations</a>.\n    ",
    "parentTypes": [
      "https://schema.org/LodgingBusiness"
    ]
  },
  {
    "name": "Restaurant",
    "type": "https://schema.org/Restaurant",
    "source": "generated",
    "description": "A restaurant.",
    "parentTypes": [
      "https://schema.org/FoodEstablishment"
    ]
  },
  {
    "name": "RestrictedDiet",
    "type": "https://schema.org/RestrictedDiet",
    "source": "generated",
    "description": "A diet restricted to certain foods or preparations for cultural, religious, health or lifestyle reasons. ",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "DiabeticDiet",
        "type": "https://schema.org/DiabeticDiet",
        "description": "A diet appropriate for people with diabetes."
      },
      {
        "name": "GlutenFreeDiet",
        "type": "https://schema.org/GlutenFreeDiet",
        "description": "A diet exclusive of gluten."
      },
      {
        "name": "HalalDiet",
        "type": "https://schema.org/HalalDiet",
        "description": "A diet conforming to Islamic dietary practices."
      },
      {
        "name": "HinduDiet",
        "type": "https://schema.org/HinduDiet",
        "description": "A diet conforming to Hindu dietary practices, in particular, beef-free."
      },
      {
        "name": "KosherDiet",
        "type": "https://schema.org/KosherDiet",
        "description": "A diet conforming to Jewish dietary practices."
      },
      {
        "name": "LowCalorieDiet",
        "type": "https://schema.org/LowCalorieDiet",
        "description": "A diet focused on reduced calorie intake."
      },
      {
        "name": "LowFatDiet",
        "type": "https://schema.org/LowFatDiet",
        "description": "A diet focused on reduced fat and cholesterol intake."
      },
      {
        "name": "LowLactoseDiet",
        "type": "https://schema.org/LowLactoseDiet",
        "description": "A diet appropriate for people with lactose intolerance."
      },
      {
        "name": "LowSaltDiet",
        "type": "https://schema.org/LowSaltDiet",
        "description": "A diet focused on reduced sodium intake."
      },
      {
        "name": "VeganDiet",
        "type": "https://schema.org/VeganDiet",
        "description": "A diet exclusive of all animal products."
      },
      {
        "name": "VegetarianDiet",
        "type": "https://schema.org/VegetarianDiet",
        "description": "A diet exclusive of animal meat."
      }
    ]
  },
  {
    "name": "Result",
    "type": "http://sarif.info/Result",
    "source": "generated"
  },
  {
    "name": "ResumeAction",
    "type": "https://schema.org/ResumeAction",
    "source": "generated",
    "description": "The act of resuming a device or application which was formerly paused (e.g. resume music playback or resume a timer).",
    "parentTypes": [
      "https://schema.org/ControlAction"
    ]
  },
  {
    "name": "ReturnAction",
    "type": "https://schema.org/ReturnAction",
    "source": "generated",
    "description": "The act of returning to the origin that which was previously received (concrete objects) or taken (ownership).",
    "parentTypes": [
      "https://schema.org/TransferAction"
    ],
    "properties": [
      {
        "name": "recipient",
        "type": [
          "https://schema.org/Audience",
          "https://schema.org/ContactPoint",
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "A sub property of participant. The participant who is at the receiving end of the action.",
        "expectedTypes": [
          "https://schema.org/Audience",
          "https://schema.org/ContactPoint",
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Audience",
          "https://schema.org/ContactPoint",
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/AuthorizeAction",
          "https://schema.org/CommunicateAction",
          "https://schema.org/DonateAction",
          "https://schema.org/GiveAction",
          "https://schema.org/Message",
          "https://schema.org/PayAction",
          "https://schema.org/ReturnAction",
          "https://schema.org/SendAction",
          "https://schema.org/TipAction"
        ]
      }
    ]
  },
  {
    "name": "ReturnFeesEnumeration",
    "type": "https://schema.org/ReturnFeesEnumeration",
    "source": "generated",
    "description": "Enumerates several kinds of policies for product return fees.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "FreeReturn",
        "type": "https://schema.org/FreeReturn",
        "description": "Specifies that product returns are free of charge for the customer."
      },
      {
        "name": "OriginalShippingFees",
        "type": "https://schema.org/OriginalShippingFees",
        "description": "Specifies that the customer must pay the original shipping costs when returning a product."
      },
      {
        "name": "RestockingFees",
        "type": "https://schema.org/RestockingFees",
        "description": "Specifies that the customer must pay a restocking fee when returning a product."
      },
      {
        "name": "ReturnFeesCustomerResponsibility",
        "type": "https://schema.org/ReturnFeesCustomerResponsibility",
        "description": "Specifies that product returns must be paid for, and are the responsibility of, the customer."
      },
      {
        "name": "ReturnShippingFees",
        "type": "https://schema.org/ReturnShippingFees",
        "description": "Specifies that the customer must pay the return shipping costs when returning a product."
      }
    ]
  },
  {
    "name": "ReturnLabelSourceEnumeration",
    "type": "https://schema.org/ReturnLabelSourceEnumeration",
    "source": "generated",
    "description": "Enumerates several types of return labels for product returns.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "ReturnLabelCustomerResponsibility",
        "type": "https://schema.org/ReturnLabelCustomerResponsibility",
        "description": "Indicated that creating a return label is the responsibility of the customer."
      },
      {
        "name": "ReturnLabelDownloadAndPrint",
        "type": "https://schema.org/ReturnLabelDownloadAndPrint",
        "description": "Indicated that a return label must be downloaded and printed by the customer."
      },
      {
        "name": "ReturnLabelInBox",
        "type": "https://schema.org/ReturnLabelInBox",
        "description": "Specifies that a return label will be provided by the seller in the shipping box."
      }
    ]
  },
  {
    "name": "ReturnMethodEnumeration",
    "type": "https://schema.org/ReturnMethodEnumeration",
    "source": "generated",
    "description": "Enumerates several types of product return methods.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "KeepProduct",
        "type": "https://schema.org/KeepProduct",
        "description": "Specifies that the consumer can keep the product, even when receiving a refund or store credit."
      },
      {
        "name": "ReturnAtKiosk",
        "type": "https://schema.org/ReturnAtKiosk",
        "description": "Specifies that product returns must be made at a kiosk."
      },
      {
        "name": "ReturnByMail",
        "type": "https://schema.org/ReturnByMail",
        "description": "Specifies that product returns must be done by mail."
      },
      {
        "name": "ReturnInStore",
        "type": "https://schema.org/ReturnInStore",
        "description": "Specifies that product returns must be made in a store."
      }
    ]
  },
  {
    "name": "Review",
    "type": "https://schema.org/Review",
    "source": "generated",
    "description": "A review of an item - for example, of a restaurant, movie, or store.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ],
    "properties": [
      {
        "name": "associatedClaimReview",
        "type": "https://schema.org/Review",
        "description": "An associated [[ClaimReview]], related by specific common content, topic or claim. The expectation is that this property would be most typically used in cases where a single activity is conducting both claim reviews and media reviews, in which case [[relatedMediaReview]] would commonly be used on a [[ClaimReview]], while [[associatedClaimReview]] would be used on [[MediaReview]].",
        "expectedTypes": [
          "https://schema.org/Review"
        ],
        "rangeTypes": [
          "https://schema.org/Review"
        ],
        "domainTypes": [
          "https://schema.org/Review"
        ]
      },
      {
        "name": "associatedMediaReview",
        "type": "https://schema.org/Review",
        "description": "An associated [[MediaReview]], related by specific common content, topic or claim. The expectation is that this property would be most typically used in cases where a single activity is conducting both claim reviews and media reviews, in which case [[relatedMediaReview]] would commonly be used on a [[ClaimReview]], while [[associatedClaimReview]] would be used on [[MediaReview]].",
        "expectedTypes": [
          "https://schema.org/Review"
        ],
        "rangeTypes": [
          "https://schema.org/Review"
        ],
        "domainTypes": [
          "https://schema.org/Review"
        ]
      },
      {
        "name": "associatedReview",
        "type": "https://schema.org/Review",
        "description": "An associated [[Review]].",
        "expectedTypes": [
          "https://schema.org/Review"
        ],
        "rangeTypes": [
          "https://schema.org/Review"
        ],
        "domainTypes": [
          "https://schema.org/Review"
        ]
      },
      {
        "name": "itemReviewed",
        "type": "https://schema.org/Thing",
        "description": "The item that is being reviewed/rated.",
        "expectedTypes": [
          "https://schema.org/Thing"
        ],
        "rangeTypes": [
          "https://schema.org/Thing"
        ],
        "domainTypes": [
          "https://schema.org/AggregateRating",
          "https://schema.org/Review"
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
        "name": "reviewBody",
        "type": "https://schema.org/Text",
        "description": "The actual body of the review.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Review"
        ]
      },
      {
        "name": "reviewRating",
        "type": "https://schema.org/Rating",
        "description": "The rating given in this review. Note that reviews can themselves be rated. The ```reviewRating``` applies to rating given by the review. The [[aggregateRating]] property applies to the review itself, as a creative work.",
        "expectedTypes": [
          "https://schema.org/Rating"
        ],
        "rangeTypes": [
          "https://schema.org/Rating"
        ],
        "domainTypes": [
          "https://schema.org/Review"
        ]
      }
    ]
  },
  {
    "name": "ReviewAction",
    "type": "https://schema.org/ReviewAction",
    "source": "generated",
    "description": "The act of producing a balanced opinion about the object for an audience. An agent reviews an object with participants resulting in a review.",
    "parentTypes": [
      "https://schema.org/AssessAction"
    ],
    "properties": [
      {
        "name": "resultReview",
        "type": "https://schema.org/Review",
        "description": "A sub property of result. The review that resulted in the performing of the action.",
        "expectedTypes": [
          "https://schema.org/Review"
        ],
        "rangeTypes": [
          "https://schema.org/Review"
        ],
        "domainTypes": [
          "https://schema.org/ReviewAction"
        ]
      }
    ]
  },
  {
    "name": "ReviewNewsArticle",
    "type": "https://schema.org/ReviewNewsArticle",
    "source": "generated",
    "description": "A [[NewsArticle]] and [[CriticReview]] providing a professional critic's assessment of a service, product, performance, or artistic or literary work.",
    "parentTypes": [
      "https://schema.org/CriticReview",
      "https://schema.org/NewsArticle"
    ]
  },
  {
    "name": "RiverBodyOfWater",
    "type": "https://schema.org/RiverBodyOfWater",
    "source": "generated",
    "description": "A river (for example, the broad majestic Shannon).",
    "parentTypes": [
      "https://schema.org/BodyOfWater"
    ]
  },
  {
    "name": "Role",
    "type": "https://schema.org/Role",
    "source": "generated",
    "description": "Represents additional information about a relationship or property. For example a Role can be used to say that a 'member' role linking some SportsTeam to a player occurred during a particular time period. Or that a Person's 'actor' role in a Movie was for some particular characterName. Such properties can be attached to a Role entity, which is then associated with the main entities using ordinary properties like 'member' or 'actor'.\\n\\nSee also [blog post](https://blog.schema.org/2014/06/16/introducing-role/).",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "endDate",
        "type": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "description": "The end date and time of the item (in [ISO 8601 date format](http://en.wikipedia.org/wiki/ISO_8601)).",
        "expectedTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWorkSeason",
          "https://schema.org/CreativeWorkSeries",
          "https://schema.org/DatedMoneySpecification",
          "https://schema.org/EducationalOccupationalProgram",
          "https://schema.org/Event",
          "https://schema.org/MerchantReturnPolicySeasonalOverride",
          "https://schema.org/Role",
          "https://schema.org/Schedule"
        ]
      },
      {
        "name": "namedPosition",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "A position played, performed or filled by a person or organization, as part of an organization. For example, an athlete in a SportsTeam might play in the position named 'Quarterback'.",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Role"
        ],
        "supersededBy": "https://schema.org/roleName"
      },
      {
        "name": "roleName",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "A role played, performed or filled by a person or organization. For example, the team of creators for a comic book might fill the roles named 'inker', 'penciller', and 'letterer'; or an athlete in a SportsTeam might play in the position named 'Quarterback'.",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Role"
        ]
      },
      {
        "name": "startDate",
        "type": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "description": "The start date and time of the item (in [ISO 8601 date format](http://en.wikipedia.org/wiki/ISO_8601)).",
        "expectedTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWorkSeason",
          "https://schema.org/CreativeWorkSeries",
          "https://schema.org/DatedMoneySpecification",
          "https://schema.org/EducationalOccupationalProgram",
          "https://schema.org/Event",
          "https://schema.org/MerchantReturnPolicySeasonalOverride",
          "https://schema.org/Role",
          "https://schema.org/Schedule"
        ]
      }
    ]
  },
  {
    "name": "RoofingContractor",
    "type": "https://schema.org/RoofingContractor",
    "source": "generated",
    "description": "A roofing contractor.",
    "parentTypes": [
      "https://schema.org/HomeAndConstructionBusiness"
    ]
  },
  {
    "name": "Room",
    "type": "https://schema.org/Room",
    "source": "generated",
    "description": "A room is a distinguishable space within a structure, usually separated from other spaces by interior walls (source: Wikipedia, the free encyclopedia, see <a href=\"http://en.wikipedia.org/wiki/Room\">http://en.wikipedia.org/wiki/Room</a>).\n<br /><br />\nSee also the <a href=\"/docs/hotels.html\">dedicated document on the use of schema.org for marking up hotels and other forms of accommodations</a>.\n",
    "parentTypes": [
      "https://schema.org/Accommodation"
    ]
  },
  {
    "name": "RsvpAction",
    "type": "https://schema.org/RsvpAction",
    "source": "generated",
    "description": "The act of notifying an event organizer as to whether you expect to attend the event.",
    "parentTypes": [
      "https://schema.org/InformAction"
    ],
    "properties": [
      {
        "name": "additionalNumberOfGuests",
        "type": "https://schema.org/Number",
        "description": "If responding yes, the number of guests who will attend in addition to the invitee.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/RsvpAction"
        ]
      },
      {
        "name": "comment",
        "type": "https://schema.org/Comment",
        "description": "Comments, typically from users.",
        "expectedTypes": [
          "https://schema.org/Comment"
        ],
        "rangeTypes": [
          "https://schema.org/Comment"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/RsvpAction"
        ]
      },
      {
        "name": "rsvpResponse",
        "type": "https://schema.org/RsvpResponseType",
        "description": "The response (yes, no, maybe) to the RSVP.",
        "expectedTypes": [
          "https://schema.org/RsvpResponseType"
        ],
        "rangeTypes": [
          "https://schema.org/RsvpResponseType"
        ],
        "domainTypes": [
          "https://schema.org/RsvpAction"
        ]
      }
    ]
  },
  {
    "name": "RsvpResponseType",
    "type": "https://schema.org/RsvpResponseType",
    "source": "generated",
    "description": "RsvpResponseType is an enumeration type whose instances represent responding to an RSVP request.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "RsvpResponseMaybe",
        "type": "https://schema.org/RsvpResponseMaybe",
        "description": "The invitee may or may not attend."
      },
      {
        "name": "RsvpResponseNo",
        "type": "https://schema.org/RsvpResponseNo",
        "description": "The invitee will not attend."
      },
      {
        "name": "RsvpResponseYes",
        "type": "https://schema.org/RsvpResponseYes",
        "description": "The invitee will attend."
      }
    ]
  },
  {
    "name": "RuntimePlatform",
    "type": "https://schema.org/RuntimePlatform",
    "source": "generated",
    "description": "Specialized software environment that provides the essential infrastructure, libraries, and services required to execute a program.",
    "parentTypes": [
      "https://schema.org/SoftwareApplication"
    ]
  },
  {
    "name": "RVPark",
    "type": "https://schema.org/RVPark",
    "source": "generated",
    "description": "A place offering space for \"Recreational Vehicles\", Caravans, mobile homes and the like.",
    "parentTypes": [
      "https://schema.org/CivicStructure"
    ]
  },
  {
    "name": "SaleEvent",
    "type": "https://schema.org/SaleEvent",
    "source": "generated",
    "description": "Event type: Sales event.",
    "parentTypes": [
      "https://schema.org/Event"
    ]
  },
  {
    "name": "SatiricalArticle",
    "type": "https://schema.org/SatiricalArticle",
    "source": "generated",
    "description": "An [[Article]] whose content is primarily [[satirical]](https://en.wikipedia.org/wiki/Satire) in nature, i.e. unlikely to be literally true. A satirical article is sometimes but not necessarily also a [[NewsArticle]]. [[ScholarlyArticle]]s are also sometimes satirized.",
    "parentTypes": [
      "https://schema.org/Article"
    ]
  },
  {
    "name": "Schedule",
    "type": "https://schema.org/Schedule",
    "source": "generated",
    "description": "A schedule defines a repeating time period used to describe a regularly occurring [[Event]]. At a minimum a schedule will specify [[repeatFrequency]] which describes the interval between occurrences of the event. Additional information can be provided to specify the schedule more precisely.\n      This includes identifying the day(s) of the week or month when the recurring event will take place, in addition to its start and end time. Schedules may also\n      have start and end dates to indicate when they are active, e.g. to define a limited calendar of events.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "byDay",
        "type": [
          "https://schema.org/DayOfWeek",
          "https://schema.org/Text"
        ],
        "description": "Defines the day(s) of the week on which a recurring [[Event]] takes place. May be specified using either [[DayOfWeek]], or alternatively [[Text]] conforming to iCal's syntax for byDay recurrence rules.",
        "expectedTypes": [
          "https://schema.org/DayOfWeek",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/DayOfWeek",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Schedule"
        ]
      },
      {
        "name": "byMonth",
        "type": "https://schema.org/Integer",
        "description": "Defines the month(s) of the year on which a recurring [[Event]] takes place. Specified as an [[Integer]] between 1-12. January is 1.",
        "expectedTypes": [
          "https://schema.org/Integer"
        ],
        "rangeTypes": [
          "https://schema.org/Integer"
        ],
        "domainTypes": [
          "https://schema.org/Schedule"
        ]
      },
      {
        "name": "byMonthDay",
        "type": "https://schema.org/Integer",
        "description": "Defines the day(s) of the month on which a recurring [[Event]] takes place. Specified as an [[Integer]] between 1-31.",
        "expectedTypes": [
          "https://schema.org/Integer"
        ],
        "rangeTypes": [
          "https://schema.org/Integer"
        ],
        "domainTypes": [
          "https://schema.org/Schedule"
        ]
      },
      {
        "name": "byMonthWeek",
        "type": "https://schema.org/Integer",
        "description": "Defines the week(s) of the month on which a recurring Event takes place. Specified as an Integer between 1-5. For clarity, byMonthWeek is best used in conjunction with byDay to indicate concepts like the first and third Mondays of a month.",
        "expectedTypes": [
          "https://schema.org/Integer"
        ],
        "rangeTypes": [
          "https://schema.org/Integer"
        ],
        "domainTypes": [
          "https://schema.org/Schedule"
        ]
      },
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
        "name": "endDate",
        "type": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "description": "The end date and time of the item (in [ISO 8601 date format](http://en.wikipedia.org/wiki/ISO_8601)).",
        "expectedTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWorkSeason",
          "https://schema.org/CreativeWorkSeries",
          "https://schema.org/DatedMoneySpecification",
          "https://schema.org/EducationalOccupationalProgram",
          "https://schema.org/Event",
          "https://schema.org/MerchantReturnPolicySeasonalOverride",
          "https://schema.org/Role",
          "https://schema.org/Schedule"
        ]
      },
      {
        "name": "endTime",
        "type": [
          "https://schema.org/DateTime",
          "https://schema.org/Time"
        ],
        "description": "The endTime of something. For a reserved event or service (e.g. FoodEstablishmentReservation), the time that it is expected to end. For actions that span a period of time, when the action was performed. E.g. John wrote a book from January to *December*. For media, including audio and video, it's the time offset of the end of a clip within a larger file.\\n\\nNote that Event uses startDate/endDate instead of startTime/endTime, even when describing dates with times. This situation may be clarified in future revisions.",
        "expectedTypes": [
          "https://schema.org/DateTime",
          "https://schema.org/Time"
        ],
        "rangeTypes": [
          "https://schema.org/DateTime",
          "https://schema.org/Time"
        ],
        "domainTypes": [
          "https://schema.org/Action",
          "https://schema.org/FoodEstablishmentReservation",
          "https://schema.org/InteractionCounter",
          "https://schema.org/MediaObject",
          "https://schema.org/Schedule"
        ]
      },
      {
        "name": "exceptDate",
        "type": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "description": "Defines a [[Date]] or [[DateTime]] during which a scheduled [[Event]] will not take place. The property allows exceptions to\n      a [[Schedule]] to be specified. If an exception is specified as a [[DateTime]] then only the event that would have started at that specific date and time\n      should be excluded from the schedule. If an exception is specified as a [[Date]] then any event that is scheduled for that 24 hour period should be\n      excluded from the schedule. This allows a whole day to be excluded from the schedule without having to itemise every scheduled event.",
        "expectedTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/Schedule"
        ]
      },
      {
        "name": "repeatCount",
        "type": "https://schema.org/Integer",
        "description": "Defines the number of times a recurring [[Event]] will take place.",
        "expectedTypes": [
          "https://schema.org/Integer"
        ],
        "rangeTypes": [
          "https://schema.org/Integer"
        ],
        "domainTypes": [
          "https://schema.org/Schedule"
        ]
      },
      {
        "name": "repeatFrequency",
        "type": [
          "https://schema.org/Duration",
          "https://schema.org/Text"
        ],
        "description": "Defines the frequency at which [[Event]]s will occur according to a schedule [[Schedule]]. The intervals between\n      events should be defined as a [[Duration]] of time.",
        "expectedTypes": [
          "https://schema.org/Duration",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Duration",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Schedule"
        ]
      },
      {
        "name": "scheduleTimezone",
        "type": "https://schema.org/Text",
        "description": "Indicates the timezone for which the time(s) indicated in the [[Schedule]] are given. The value provided should be among those listed in the IANA Time Zone Database.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Schedule"
        ]
      },
      {
        "name": "startDate",
        "type": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "description": "The start date and time of the item (in [ISO 8601 date format](http://en.wikipedia.org/wiki/ISO_8601)).",
        "expectedTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWorkSeason",
          "https://schema.org/CreativeWorkSeries",
          "https://schema.org/DatedMoneySpecification",
          "https://schema.org/EducationalOccupationalProgram",
          "https://schema.org/Event",
          "https://schema.org/MerchantReturnPolicySeasonalOverride",
          "https://schema.org/Role",
          "https://schema.org/Schedule"
        ]
      },
      {
        "name": "startTime",
        "type": [
          "https://schema.org/DateTime",
          "https://schema.org/Time"
        ],
        "description": "The startTime of something. For a reserved event or service (e.g. FoodEstablishmentReservation), the time that it is expected to start. For actions that span a period of time, when the action was performed. E.g. John wrote a book from *January* to December. For media, including audio and video, it's the time offset of the start of a clip within a larger file.\\n\\nNote that Event uses startDate/endDate instead of startTime/endTime, even when describing dates with times. This situation may be clarified in future revisions.",
        "expectedTypes": [
          "https://schema.org/DateTime",
          "https://schema.org/Time"
        ],
        "rangeTypes": [
          "https://schema.org/DateTime",
          "https://schema.org/Time"
        ],
        "domainTypes": [
          "https://schema.org/Action",
          "https://schema.org/FoodEstablishmentReservation",
          "https://schema.org/InteractionCounter",
          "https://schema.org/MediaObject",
          "https://schema.org/Schedule"
        ]
      }
    ]
  },
  {
    "name": "ScheduleAction",
    "type": "https://schema.org/ScheduleAction",
    "source": "generated",
    "description": "Scheduling future actions, events, or tasks.\\n\\nRelated actions:\\n\\n* [[ReserveAction]]: Unlike ReserveAction, ScheduleAction allocates future actions (e.g. an event, a task, etc) towards a time slot / spatial allocation.",
    "parentTypes": [
      "https://schema.org/PlanAction"
    ]
  },
  {
    "name": "ScholarlyArticle",
    "type": "https://schema.org/ScholarlyArticle",
    "source": "generated",
    "description": "A scholarly article.",
    "parentTypes": [
      "https://schema.org/Article"
    ]
  },
  {
    "name": "School",
    "type": "https://schema.org/School",
    "source": "generated",
    "description": "A school.",
    "parentTypes": [
      "https://schema.org/EducationalOrganization"
    ]
  },
  {
    "name": "SchoolDistrict",
    "type": "https://schema.org/SchoolDistrict",
    "source": "generated",
    "description": "A School District is an administrative area for the administration of schools.",
    "parentTypes": [
      "https://schema.org/AdministrativeArea"
    ]
  },
  {
    "name": "ScreeningEvent",
    "type": "https://schema.org/ScreeningEvent",
    "source": "generated",
    "description": "A screening of a movie or other video.",
    "parentTypes": [
      "https://schema.org/Event"
    ],
    "properties": [
      {
        "name": "subtitleLanguage",
        "type": [
          "https://schema.org/Language",
          "https://schema.org/Text"
        ],
        "description": "Languages in which subtitles/captions are available, in [IETF BCP 47 standard format](http://tools.ietf.org/html/bcp47).",
        "expectedTypes": [
          "https://schema.org/Language",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Language",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/BroadcastEvent",
          "https://schema.org/Movie",
          "https://schema.org/ScreeningEvent",
          "https://schema.org/TVEpisode"
        ]
      },
      {
        "name": "videoFormat",
        "type": "https://schema.org/Text",
        "description": "The type of screening or video broadcast used (e.g. IMAX, 3D, SD, HD, etc.).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/BroadcastEvent",
          "https://schema.org/BroadcastService",
          "https://schema.org/ScreeningEvent"
        ]
      },
      {
        "name": "workPresented",
        "type": "https://schema.org/Movie",
        "description": "The movie presented during this event.",
        "expectedTypes": [
          "https://schema.org/Movie"
        ],
        "rangeTypes": [
          "https://schema.org/Movie"
        ],
        "domainTypes": [
          "https://schema.org/ScreeningEvent"
        ]
      }
    ]
  },
  {
    "name": "Sculpture",
    "type": "https://schema.org/Sculpture",
    "source": "generated",
    "description": "A piece of sculpture.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ]
  },
  {
    "name": "SeaBodyOfWater",
    "type": "https://schema.org/SeaBodyOfWater",
    "source": "generated",
    "description": "A sea (for example, the Caspian sea).",
    "parentTypes": [
      "https://schema.org/BodyOfWater"
    ]
  },
  {
    "name": "SearchAction",
    "type": "https://schema.org/SearchAction",
    "source": "generated",
    "description": "The act of searching for an object.\\n\\nRelated actions:\\n\\n* [[FindAction]]: SearchAction generally leads to a FindAction, but not necessarily.",
    "parentTypes": [
      "https://schema.org/Action"
    ],
    "properties": [
      {
        "name": "query",
        "type": "https://schema.org/Text",
        "description": "A sub property of instrument. The query used on this action.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/SearchAction"
        ]
      }
    ]
  },
  {
    "name": "SearchRescueOrganization",
    "type": "https://schema.org/SearchRescueOrganization",
    "source": "generated",
    "description": "A Search and Rescue organization of some kind.",
    "parentTypes": [
      "https://schema.org/Organization"
    ]
  },
  {
    "name": "SearchResultsPage",
    "type": "https://schema.org/SearchResultsPage",
    "source": "generated",
    "description": "Web page type: Search results page.",
    "parentTypes": [
      "https://schema.org/WebPage"
    ]
  },
  {
    "name": "Season",
    "type": "https://schema.org/Season",
    "source": "generated",
    "description": "A media season, e.g. TV, radio, video game etc.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ]
  },
  {
    "name": "Seat",
    "type": "https://schema.org/Seat",
    "source": "generated",
    "description": "Used to describe a seat, such as a reserved seat in an event reservation.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "seatingType",
        "type": [
          "https://schema.org/QualitativeValue",
          "https://schema.org/Text"
        ],
        "description": "The type/class of the seat.",
        "expectedTypes": [
          "https://schema.org/QualitativeValue",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/QualitativeValue",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Seat"
        ]
      },
      {
        "name": "seatNumber",
        "type": "https://schema.org/Text",
        "description": "The location of the reserved seat (e.g., 27).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Seat"
        ]
      },
      {
        "name": "seatRow",
        "type": "https://schema.org/Text",
        "description": "The row location of the reserved seat (e.g., B).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Seat"
        ]
      },
      {
        "name": "seatSection",
        "type": "https://schema.org/Text",
        "description": "The section location of the reserved seat (e.g. Orchestra).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Seat"
        ]
      }
    ]
  },
  {
    "name": "SeekToAction",
    "type": "https://schema.org/SeekToAction",
    "source": "generated",
    "description": "This is the [[Action]] of navigating to a specific [[startOffset]] timestamp within a [[VideoObject]], typically represented with a URL template structure.",
    "parentTypes": [
      "https://schema.org/Action"
    ],
    "properties": [
      {
        "name": "startOffset",
        "type": [
          "https://schema.org/HyperTocEntry",
          "https://schema.org/Number"
        ],
        "description": "The start time of the clip expressed as the number of seconds from the beginning of the work.",
        "expectedTypes": [
          "https://schema.org/HyperTocEntry",
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/HyperTocEntry",
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/Clip",
          "https://schema.org/SeekToAction"
        ]
      }
    ]
  },
  {
    "name": "SelfStorage",
    "type": "https://schema.org/SelfStorage",
    "source": "generated",
    "description": "A self-storage facility.",
    "parentTypes": [
      "https://schema.org/LocalBusiness"
    ]
  },
  {
    "name": "SellAction",
    "type": "https://schema.org/SellAction",
    "source": "generated",
    "description": "The act of taking money from a buyer in exchange for goods or services rendered. An agent sells an object, product, or service to a buyer for a price. Reciprocal of BuyAction.",
    "parentTypes": [
      "https://schema.org/TradeAction"
    ],
    "properties": [
      {
        "name": "buyer",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "A sub property of participant. The participant/person/organization that bought the object.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/SellAction"
        ]
      },
      {
        "name": "warrantyPromise",
        "type": "https://schema.org/WarrantyPromise",
        "description": "The warranty promise(s) included in the offer.",
        "expectedTypes": [
          "https://schema.org/WarrantyPromise"
        ],
        "rangeTypes": [
          "https://schema.org/WarrantyPromise"
        ],
        "domainTypes": [
          "https://schema.org/BuyAction",
          "https://schema.org/SellAction"
        ],
        "supersededBy": "https://schema.org/warranty"
      }
    ]
  },
  {
    "name": "SendAction",
    "type": "https://schema.org/SendAction",
    "source": "generated",
    "description": "The act of physically/electronically dispatching an object for transfer from an origin to a destination. Related actions:\\n\\n* [[ReceiveAction]]: The reciprocal of SendAction.\\n* [[GiveAction]]: Unlike GiveAction, SendAction does not imply the transfer of ownership (e.g. I can send you my laptop, but I'm not necessarily giving it to you).",
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
        "name": "recipient",
        "type": [
          "https://schema.org/Audience",
          "https://schema.org/ContactPoint",
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "A sub property of participant. The participant who is at the receiving end of the action.",
        "expectedTypes": [
          "https://schema.org/Audience",
          "https://schema.org/ContactPoint",
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Audience",
          "https://schema.org/ContactPoint",
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/AuthorizeAction",
          "https://schema.org/CommunicateAction",
          "https://schema.org/DonateAction",
          "https://schema.org/GiveAction",
          "https://schema.org/Message",
          "https://schema.org/PayAction",
          "https://schema.org/ReturnAction",
          "https://schema.org/SendAction",
          "https://schema.org/TipAction"
        ]
      }
    ]
  },
  {
    "name": "SequentialArt",
    "type": "https://schema.org/SequentialArt",
    "source": "generated",
    "description": "An art forms that use images deployed in a specific order for the purpose of graphic storytelling (i.e., narration of graphic stories) or conveying information. Examples of SequentialArt are Franco-Belgian Bande Dessinée, Comics in the USA and 漫画 (Manga) in Japan.",
    "parentTypes": [
      "https://schema.org/Book",
      "https://schema.org/VisualArtwork"
    ]
  },
  {
    "name": "Series",
    "type": "https://schema.org/Series",
    "source": "generated",
    "description": "A Series in schema.org is a group of related items, typically but not necessarily of the same kind. See also [[CreativeWorkSeries]], [[EventSeries]].",
    "parentTypes": [
      "https://schema.org/Intangible"
    ]
  },
  {
    "name": "Service",
    "type": "https://schema.org/Service",
    "source": "generated",
    "description": "A service provided by an organization, e.g. delivery service, print services, etc.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
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
        "name": "areaServed",
        "type": [
          "https://schema.org/AdministrativeArea",
          "https://schema.org/GeoShape",
          "https://schema.org/Place",
          "https://schema.org/Text"
        ],
        "description": "The geographic area where a service or offered item is provided.",
        "expectedTypes": [
          "https://schema.org/AdministrativeArea",
          "https://schema.org/GeoShape",
          "https://schema.org/Place",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/AdministrativeArea",
          "https://schema.org/GeoShape",
          "https://schema.org/Place",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/ContactPoint",
          "https://schema.org/DeliveryChargeSpecification",
          "https://schema.org/Demand",
          "https://schema.org/FinancialIncentive",
          "https://schema.org/Offer",
          "https://schema.org/Organization",
          "https://schema.org/Service"
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
        "name": "availableChannel",
        "type": "https://schema.org/ServiceChannel",
        "description": "A means of accessing the service (e.g. a phone bank, a web site, a location, etc.).",
        "expectedTypes": [
          "https://schema.org/ServiceChannel"
        ],
        "rangeTypes": [
          "https://schema.org/ServiceChannel"
        ],
        "domainTypes": [
          "https://schema.org/Service"
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
        "name": "broker",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "An entity that arranges for an exchange between a buyer and a seller.  In most cases a broker never acquires or releases ownership of a product or service involved in an exchange.  If it is not clear whether an entity is a broker, seller, or buyer, the latter two terms are preferred.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Invoice",
          "https://schema.org/Order",
          "https://schema.org/Reservation",
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
        "name": "hoursAvailable",
        "type": "https://schema.org/OpeningHoursSpecification",
        "description": "The hours during which this service or contact is available.",
        "expectedTypes": [
          "https://schema.org/OpeningHoursSpecification"
        ],
        "rangeTypes": [
          "https://schema.org/OpeningHoursSpecification"
        ],
        "domainTypes": [
          "https://schema.org/ContactPoint",
          "https://schema.org/LocationFeatureSpecification",
          "https://schema.org/Service"
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
        "name": "produces",
        "type": "https://schema.org/Thing",
        "description": "The tangible thing generated by the service, e.g. a passport, permit, etc.",
        "expectedTypes": [
          "https://schema.org/Thing"
        ],
        "rangeTypes": [
          "https://schema.org/Thing"
        ],
        "domainTypes": [
          "https://schema.org/Service"
        ],
        "supersededBy": "https://schema.org/serviceOutput"
      },
      {
        "name": "provider",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "The service provider, service operator, or service performer; the goods producer. Another party (a seller) may offer those services or goods on behalf of the provider. A provider may also serve as the seller.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Action",
          "https://schema.org/CreativeWork",
          "https://schema.org/EducationalOccupationalProgram",
          "https://schema.org/FinancialIncentive",
          "https://schema.org/Invoice",
          "https://schema.org/OfferShippingDetails",
          "https://schema.org/ParcelDelivery",
          "https://schema.org/Reservation",
          "https://schema.org/Service",
          "https://schema.org/Trip"
        ]
      },
      {
        "name": "providerMobility",
        "type": "https://schema.org/Text",
        "description": "Indicates the mobility of a provided service (e.g. 'static', 'dynamic').",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Service"
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
        "name": "serviceArea",
        "type": [
          "https://schema.org/AdministrativeArea",
          "https://schema.org/GeoShape",
          "https://schema.org/Place"
        ],
        "description": "The geographic area where the service is provided.",
        "expectedTypes": [
          "https://schema.org/AdministrativeArea",
          "https://schema.org/GeoShape",
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/AdministrativeArea",
          "https://schema.org/GeoShape",
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/ContactPoint",
          "https://schema.org/Organization",
          "https://schema.org/Service"
        ],
        "supersededBy": "https://schema.org/areaServed"
      },
      {
        "name": "serviceAudience",
        "type": "https://schema.org/Audience",
        "description": "The audience eligible for this service.",
        "expectedTypes": [
          "https://schema.org/Audience"
        ],
        "rangeTypes": [
          "https://schema.org/Audience"
        ],
        "domainTypes": [
          "https://schema.org/Service"
        ],
        "supersededBy": "https://schema.org/audience"
      },
      {
        "name": "serviceOutput",
        "type": "https://schema.org/Thing",
        "description": "The tangible thing generated by the service, e.g. a passport, permit, etc.",
        "expectedTypes": [
          "https://schema.org/Thing"
        ],
        "rangeTypes": [
          "https://schema.org/Thing"
        ],
        "domainTypes": [
          "https://schema.org/Service"
        ]
      },
      {
        "name": "serviceType",
        "type": [
          "https://schema.org/GovernmentBenefitsType",
          "https://schema.org/Text"
        ],
        "description": "The type of service being offered, e.g. veterans' benefits, emergency relief, etc.",
        "expectedTypes": [
          "https://schema.org/GovernmentBenefitsType",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/GovernmentBenefitsType",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Service"
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
        "name": "termsOfService",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "Human-readable terms of service documentation.",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Service"
        ]
      }
    ]
  },
  {
    "name": "ServiceChannel",
    "type": "https://schema.org/ServiceChannel",
    "source": "generated",
    "description": "A means for accessing a service, e.g. a government office location, web site, or phone number.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "availableLanguage",
        "type": [
          "https://schema.org/Language",
          "https://schema.org/Text"
        ],
        "description": "A language someone may use with or at the item, service or place. Please use one of the language codes from the [IETF BCP 47 standard](http://tools.ietf.org/html/bcp47). See also [[inLanguage]].",
        "expectedTypes": [
          "https://schema.org/Language",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Language",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/ContactPoint",
          "https://schema.org/Course",
          "https://schema.org/LodgingBusiness",
          "https://schema.org/ServiceChannel",
          "https://schema.org/TouristAttraction"
        ]
      },
      {
        "name": "processingTime",
        "type": "https://schema.org/Duration",
        "description": "Estimated processing time for the service using this channel.",
        "expectedTypes": [
          "https://schema.org/Duration"
        ],
        "rangeTypes": [
          "https://schema.org/Duration"
        ],
        "domainTypes": [
          "https://schema.org/ServiceChannel"
        ]
      },
      {
        "name": "providesService",
        "type": "https://schema.org/Service",
        "description": "The service provided by this channel.",
        "expectedTypes": [
          "https://schema.org/Service"
        ],
        "rangeTypes": [
          "https://schema.org/Service"
        ],
        "domainTypes": [
          "https://schema.org/ServiceChannel"
        ]
      },
      {
        "name": "serviceLocation",
        "type": "https://schema.org/Place",
        "description": "The location (e.g. civic structure, local business, etc.) where a person can go to access the service.",
        "expectedTypes": [
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/ServiceChannel"
        ]
      },
      {
        "name": "servicePhone",
        "type": "https://schema.org/ContactPoint",
        "description": "The phone number to use to access the service.",
        "expectedTypes": [
          "https://schema.org/ContactPoint"
        ],
        "rangeTypes": [
          "https://schema.org/ContactPoint"
        ],
        "domainTypes": [
          "https://schema.org/ServiceChannel"
        ]
      },
      {
        "name": "servicePostalAddress",
        "type": "https://schema.org/PostalAddress",
        "description": "The address for accessing the service by mail.",
        "expectedTypes": [
          "https://schema.org/PostalAddress"
        ],
        "rangeTypes": [
          "https://schema.org/PostalAddress"
        ],
        "domainTypes": [
          "https://schema.org/ServiceChannel"
        ]
      },
      {
        "name": "serviceSmsNumber",
        "type": "https://schema.org/ContactPoint",
        "description": "The number to access the service by text message.",
        "expectedTypes": [
          "https://schema.org/ContactPoint"
        ],
        "rangeTypes": [
          "https://schema.org/ContactPoint"
        ],
        "domainTypes": [
          "https://schema.org/ServiceChannel"
        ]
      },
      {
        "name": "serviceUrl",
        "type": "https://schema.org/URL",
        "description": "The website to access the service.",
        "expectedTypes": [
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/ServiceChannel"
        ]
      }
    ]
  },
  {
    "name": "ServicePeriod",
    "type": "https://schema.org/ServicePeriod",
    "source": "generated",
    "description": "ServicePeriod represents a duration with some constraints about cutoff time and business days. This is used e.g. in shipping for handling times or transit time.",
    "parentTypes": [
      "https://schema.org/StructuredValue"
    ],
    "properties": [
      {
        "name": "businessDays",
        "type": [
          "https://schema.org/DayOfWeek",
          "https://schema.org/OpeningHoursSpecification"
        ],
        "description": "Days of the week when the merchant typically operates, indicated via opening hours markup.",
        "expectedTypes": [
          "https://schema.org/DayOfWeek",
          "https://schema.org/OpeningHoursSpecification"
        ],
        "rangeTypes": [
          "https://schema.org/DayOfWeek",
          "https://schema.org/OpeningHoursSpecification"
        ],
        "domainTypes": [
          "https://schema.org/ServicePeriod",
          "https://schema.org/ShippingDeliveryTime"
        ]
      },
      {
        "name": "cutoffTime",
        "type": "https://schema.org/Time",
        "description": "Order cutoff time allows merchants to describe the time after which they will no longer process orders received on that day. For orders processed after cutoff time, one day gets added to the delivery time estimate. This property is expected to be most typically used via the [[ShippingRateSettings]] publication pattern. The time is indicated using the ISO-8601 Time format, e.g. \"23:30:00-05:00\" would represent 6:30 pm Eastern Standard Time (EST) which is 5 hours behind Coordinated Universal Time (UTC).",
        "expectedTypes": [
          "https://schema.org/Time"
        ],
        "rangeTypes": [
          "https://schema.org/Time"
        ],
        "domainTypes": [
          "https://schema.org/ServicePeriod",
          "https://schema.org/ShippingDeliveryTime"
        ]
      },
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
      }
    ]
  },
  {
    "name": "ShareAction",
    "type": "https://schema.org/ShareAction",
    "source": "generated",
    "description": "The act of distributing content to people for their amusement or edification.",
    "parentTypes": [
      "https://schema.org/CommunicateAction"
    ]
  },
  {
    "name": "SheetMusic",
    "type": "https://schema.org/SheetMusic",
    "source": "generated",
    "description": "Printed music, as opposed to performed or recorded music.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ]
  },
  {
    "name": "ShippingConditions",
    "type": "https://schema.org/ShippingConditions",
    "source": "generated",
    "description": "ShippingConditions represent a set of constraints and information about the conditions of shipping a product. Such conditions may apply to only a subset of the products being shipped, depending on aspects of the product like weight, size, price, destination, and others. All the specified conditions must be met for this ShippingConditions to apply.",
    "parentTypes": [
      "https://schema.org/StructuredValue"
    ],
    "properties": [
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
        "name": "doesNotShip",
        "type": "https://schema.org/Boolean",
        "description": "Indicates when shipping to a particular [[shippingDestination]] is not available.",
        "expectedTypes": [
          "https://schema.org/Boolean"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean"
        ],
        "domainTypes": [
          "https://schema.org/OfferShippingDetails",
          "https://schema.org/ShippingConditions",
          "https://schema.org/ShippingRateSettings"
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
        "name": "numItems",
        "type": "https://schema.org/QuantitativeValue",
        "description": "Limits the number of items being shipped for which these conditions apply.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/ShippingConditions"
        ]
      },
      {
        "name": "orderValue",
        "type": "https://schema.org/MonetaryAmount",
        "description": "Minimum and maximum order value for which these shipping conditions are valid.",
        "expectedTypes": [
          "https://schema.org/MonetaryAmount"
        ],
        "rangeTypes": [
          "https://schema.org/MonetaryAmount"
        ],
        "domainTypes": [
          "https://schema.org/ShippingConditions"
        ]
      },
      {
        "name": "seasonalOverride",
        "type": "https://schema.org/OpeningHoursSpecification",
        "description": "Limited period during which these shipping conditions apply.",
        "expectedTypes": [
          "https://schema.org/OpeningHoursSpecification"
        ],
        "rangeTypes": [
          "https://schema.org/OpeningHoursSpecification"
        ],
        "domainTypes": [
          "https://schema.org/ShippingConditions"
        ]
      },
      {
        "name": "shippingDestination",
        "type": "https://schema.org/DefinedRegion",
        "description": "indicates (possibly multiple) shipping destinations. These can be defined in several ways, e.g. postalCode ranges.",
        "expectedTypes": [
          "https://schema.org/DefinedRegion"
        ],
        "rangeTypes": [
          "https://schema.org/DefinedRegion"
        ],
        "domainTypes": [
          "https://schema.org/DeliveryTimeSettings",
          "https://schema.org/OfferShippingDetails",
          "https://schema.org/ShippingConditions",
          "https://schema.org/ShippingRateSettings"
        ]
      },
      {
        "name": "shippingOrigin",
        "type": "https://schema.org/DefinedRegion",
        "description": "Indicates the origin of a shipment, i.e. where it should be coming from.",
        "expectedTypes": [
          "https://schema.org/DefinedRegion"
        ],
        "rangeTypes": [
          "https://schema.org/DefinedRegion"
        ],
        "domainTypes": [
          "https://schema.org/OfferShippingDetails",
          "https://schema.org/ShippingConditions"
        ]
      },
      {
        "name": "shippingRate",
        "type": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/ShippingRateSettings"
        ],
        "description": "The shipping rate is the cost of shipping to the specified destination. Typically, the maxValue and currency values (of the [[MonetaryAmount]]) are most appropriate.",
        "expectedTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/ShippingRateSettings"
        ],
        "rangeTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/ShippingRateSettings"
        ],
        "domainTypes": [
          "https://schema.org/OfferShippingDetails",
          "https://schema.org/ShippingConditions",
          "https://schema.org/ShippingRateSettings"
        ]
      },
      {
        "name": "transitTime",
        "type": [
          "https://schema.org/QuantitativeValue",
          "https://schema.org/ServicePeriod"
        ],
        "description": "The typical delay the order has been sent for delivery and the goods reach the final customer.\n\n  In the context of [[ShippingDeliveryTime]], use the [[QuantitativeValue]]. Typical properties: minValue, maxValue, unitCode (d for DAY).\n\n  In the context of [[ShippingConditions]], use the [[ServicePeriod]]. It has a duration (as a [[QuantitativeValue]]) and also business days and a cut-off time.\n",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue",
          "https://schema.org/ServicePeriod"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue",
          "https://schema.org/ServicePeriod"
        ],
        "domainTypes": [
          "https://schema.org/ShippingConditions",
          "https://schema.org/ShippingDeliveryTime"
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
    "name": "ShippingDeliveryTime",
    "type": "https://schema.org/ShippingDeliveryTime",
    "source": "generated",
    "description": "ShippingDeliveryTime provides various pieces of information about delivery times for shipping.",
    "parentTypes": [
      "https://schema.org/StructuredValue"
    ],
    "properties": [
      {
        "name": "businessDays",
        "type": [
          "https://schema.org/DayOfWeek",
          "https://schema.org/OpeningHoursSpecification"
        ],
        "description": "Days of the week when the merchant typically operates, indicated via opening hours markup.",
        "expectedTypes": [
          "https://schema.org/DayOfWeek",
          "https://schema.org/OpeningHoursSpecification"
        ],
        "rangeTypes": [
          "https://schema.org/DayOfWeek",
          "https://schema.org/OpeningHoursSpecification"
        ],
        "domainTypes": [
          "https://schema.org/ServicePeriod",
          "https://schema.org/ShippingDeliveryTime"
        ]
      },
      {
        "name": "cutoffTime",
        "type": "https://schema.org/Time",
        "description": "Order cutoff time allows merchants to describe the time after which they will no longer process orders received on that day. For orders processed after cutoff time, one day gets added to the delivery time estimate. This property is expected to be most typically used via the [[ShippingRateSettings]] publication pattern. The time is indicated using the ISO-8601 Time format, e.g. \"23:30:00-05:00\" would represent 6:30 pm Eastern Standard Time (EST) which is 5 hours behind Coordinated Universal Time (UTC).",
        "expectedTypes": [
          "https://schema.org/Time"
        ],
        "rangeTypes": [
          "https://schema.org/Time"
        ],
        "domainTypes": [
          "https://schema.org/ServicePeriod",
          "https://schema.org/ShippingDeliveryTime"
        ]
      },
      {
        "name": "handlingTime",
        "type": [
          "https://schema.org/QuantitativeValue",
          "https://schema.org/ServicePeriod"
        ],
        "description": "The typical delay between the receipt of the order and the goods either leaving the warehouse or being prepared for pickup, in case the delivery method is on site pickup.\n\nIn the context of [[ShippingDeliveryTime]], Typical properties: minValue, maxValue, unitCode (d for DAY).  This is by common convention assumed to mean business days (if a unitCode is used, coded as \"d\"), i.e. only counting days when the business normally operates.\n\nIn the context of [[ShippingService]], use the [[ServicePeriod]] format, that contains the same information in a structured form, with cut-off time, business days and duration.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue",
          "https://schema.org/ServicePeriod"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue",
          "https://schema.org/ServicePeriod"
        ],
        "domainTypes": [
          "https://schema.org/ShippingDeliveryTime",
          "https://schema.org/ShippingService"
        ]
      },
      {
        "name": "transitTime",
        "type": [
          "https://schema.org/QuantitativeValue",
          "https://schema.org/ServicePeriod"
        ],
        "description": "The typical delay the order has been sent for delivery and the goods reach the final customer.\n\n  In the context of [[ShippingDeliveryTime]], use the [[QuantitativeValue]]. Typical properties: minValue, maxValue, unitCode (d for DAY).\n\n  In the context of [[ShippingConditions]], use the [[ServicePeriod]]. It has a duration (as a [[QuantitativeValue]]) and also business days and a cut-off time.\n",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue",
          "https://schema.org/ServicePeriod"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue",
          "https://schema.org/ServicePeriod"
        ],
        "domainTypes": [
          "https://schema.org/ShippingConditions",
          "https://schema.org/ShippingDeliveryTime"
        ]
      }
    ]
  },
  {
    "name": "ShippingRateSettings",
    "type": "https://schema.org/ShippingRateSettings",
    "source": "generated",
    "description": "A ShippingRateSettings represents re-usable pieces of shipping information. It is designed for publication on an URL that may be referenced via the [[shippingSettingsLink]] property of an [[OfferShippingDetails]]. Several occurrences can be published, distinguished and matched (i.e. identified/referenced) by their different values for [[shippingLabel]].",
    "parentTypes": [
      "https://schema.org/StructuredValue"
    ],
    "properties": [
      {
        "name": "doesNotShip",
        "type": "https://schema.org/Boolean",
        "description": "Indicates when shipping to a particular [[shippingDestination]] is not available.",
        "expectedTypes": [
          "https://schema.org/Boolean"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean"
        ],
        "domainTypes": [
          "https://schema.org/OfferShippingDetails",
          "https://schema.org/ShippingConditions",
          "https://schema.org/ShippingRateSettings"
        ]
      },
      {
        "name": "freeShippingThreshold",
        "type": [
          "https://schema.org/DeliveryChargeSpecification",
          "https://schema.org/MonetaryAmount"
        ],
        "description": "A monetary value above (or at) which the shipping rate becomes free. Intended to be used via an [[OfferShippingDetails]] with [[shippingSettingsLink]] matching this [[ShippingRateSettings]].",
        "expectedTypes": [
          "https://schema.org/DeliveryChargeSpecification",
          "https://schema.org/MonetaryAmount"
        ],
        "rangeTypes": [
          "https://schema.org/DeliveryChargeSpecification",
          "https://schema.org/MonetaryAmount"
        ],
        "domainTypes": [
          "https://schema.org/ShippingRateSettings"
        ]
      },
      {
        "name": "isUnlabelledFallback",
        "type": "https://schema.org/Boolean",
        "description": "This can be marked 'true' to indicate that some published [[DeliveryTimeSettings]] or [[ShippingRateSettings]] are intended to apply to all [[OfferShippingDetails]] published by the same merchant, when referenced by a [[shippingSettingsLink]] in those settings. It is not meaningful to use a 'true' value for this property alongside a transitTimeLabel (for [[DeliveryTimeSettings]]) or shippingLabel (for [[ShippingRateSettings]]), since this property is for use with unlabelled settings.",
        "expectedTypes": [
          "https://schema.org/Boolean"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean"
        ],
        "domainTypes": [
          "https://schema.org/DeliveryTimeSettings",
          "https://schema.org/ShippingRateSettings"
        ]
      },
      {
        "name": "minimumOrderValue",
        "type": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/Number",
          "https://schema.org/PriceSpecification"
        ],
        "description": "The minimum order value required for this shipping rate to apply.",
        "expectedTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/Number",
          "https://schema.org/PriceSpecification"
        ],
        "rangeTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/Number",
          "https://schema.org/PriceSpecification"
        ],
        "domainTypes": [
          "https://schema.org/ShippingRateSettings"
        ]
      },
      {
        "name": "orderPercentage",
        "type": "https://schema.org/Number",
        "description": "Value representing the fraction of the value of the order that is charged as shipping cost. Example: 0.10 would mean shipping rate is 10% of the total order value.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/ShippingRateSettings"
        ]
      },
      {
        "name": "shippingDestination",
        "type": "https://schema.org/DefinedRegion",
        "description": "indicates (possibly multiple) shipping destinations. These can be defined in several ways, e.g. postalCode ranges.",
        "expectedTypes": [
          "https://schema.org/DefinedRegion"
        ],
        "rangeTypes": [
          "https://schema.org/DefinedRegion"
        ],
        "domainTypes": [
          "https://schema.org/DeliveryTimeSettings",
          "https://schema.org/OfferShippingDetails",
          "https://schema.org/ShippingConditions",
          "https://schema.org/ShippingRateSettings"
        ]
      },
      {
        "name": "shippingLabel",
        "type": "https://schema.org/Text",
        "description": "Label to match an [[OfferShippingDetails]] with a [[ShippingRateSettings]] (within the context of a [[shippingSettingsLink]] cross-reference).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/OfferShippingDetails",
          "https://schema.org/ShippingRateSettings"
        ]
      },
      {
        "name": "shippingRate",
        "type": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/ShippingRateSettings"
        ],
        "description": "The shipping rate is the cost of shipping to the specified destination. Typically, the maxValue and currency values (of the [[MonetaryAmount]]) are most appropriate.",
        "expectedTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/ShippingRateSettings"
        ],
        "rangeTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/ShippingRateSettings"
        ],
        "domainTypes": [
          "https://schema.org/OfferShippingDetails",
          "https://schema.org/ShippingConditions",
          "https://schema.org/ShippingRateSettings"
        ]
      },
      {
        "name": "weightPercentage",
        "type": "https://schema.org/Number",
        "description": "Value representing the fraction of the weight that is used to compute the shipping price. Example: 0.10 and a shipping weight of 15kg would add $1.5 to the order price, where the $ is the currency of the order.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/ShippingRateSettings"
        ]
      }
    ]
  },
  {
    "name": "ShippingService",
    "type": "https://schema.org/ShippingService",
    "source": "generated",
    "description": "ShippingService represents the criteria used to determine if and how an offer could be shipped to a customer.",
    "parentTypes": [
      "https://schema.org/StructuredValue"
    ],
    "properties": [
      {
        "name": "fulfillmentType",
        "type": "https://schema.org/FulfillmentTypeEnumeration",
        "description": "Type of fulfillment applicable to the [[ShippingService]].",
        "expectedTypes": [
          "https://schema.org/FulfillmentTypeEnumeration"
        ],
        "rangeTypes": [
          "https://schema.org/FulfillmentTypeEnumeration"
        ],
        "domainTypes": [
          "https://schema.org/ShippingService"
        ]
      },
      {
        "name": "handlingTime",
        "type": [
          "https://schema.org/QuantitativeValue",
          "https://schema.org/ServicePeriod"
        ],
        "description": "The typical delay between the receipt of the order and the goods either leaving the warehouse or being prepared for pickup, in case the delivery method is on site pickup.\n\nIn the context of [[ShippingDeliveryTime]], Typical properties: minValue, maxValue, unitCode (d for DAY).  This is by common convention assumed to mean business days (if a unitCode is used, coded as \"d\"), i.e. only counting days when the business normally operates.\n\nIn the context of [[ShippingService]], use the [[ServicePeriod]] format, that contains the same information in a structured form, with cut-off time, business days and duration.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue",
          "https://schema.org/ServicePeriod"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue",
          "https://schema.org/ServicePeriod"
        ],
        "domainTypes": [
          "https://schema.org/ShippingDeliveryTime",
          "https://schema.org/ShippingService"
        ]
      },
      {
        "name": "shippingConditions",
        "type": "https://schema.org/ShippingConditions",
        "description": "The conditions (constraints, price) applicable to the [[ShippingService]].",
        "expectedTypes": [
          "https://schema.org/ShippingConditions"
        ],
        "rangeTypes": [
          "https://schema.org/ShippingConditions"
        ],
        "domainTypes": [
          "https://schema.org/ShippingService"
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
      }
    ]
  },
  {
    "name": "ShoeStore",
    "type": "https://schema.org/ShoeStore",
    "source": "generated",
    "description": "A shoe store.",
    "parentTypes": [
      "https://schema.org/Store"
    ]
  },
  {
    "name": "ShoppingCenter",
    "type": "https://schema.org/ShoppingCenter",
    "source": "generated",
    "description": "A shopping center or mall.",
    "parentTypes": [
      "https://schema.org/LocalBusiness"
    ]
  },
  {
    "name": "ShortStory",
    "type": "https://schema.org/ShortStory",
    "source": "generated",
    "description": "Short story or tale. A brief work of literature, usually written in narrative prose.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ]
  },
  {
    "name": "SingleFamilyResidence",
    "type": "https://schema.org/SingleFamilyResidence",
    "source": "generated",
    "description": "Residence type: Single-family home.",
    "parentTypes": [
      "https://schema.org/House"
    ],
    "properties": [
      {
        "name": "numberOfRooms",
        "type": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "description": "The number of rooms (excluding bathrooms and closets) of the accommodation or lodging business.\nTypical unit code(s): ROM for room or C62 for no unit. The type of room can be put in the unitText property of the QuantitativeValue.",
        "expectedTypes": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/Accommodation",
          "https://schema.org/Apartment",
          "https://schema.org/FloorPlan",
          "https://schema.org/House",
          "https://schema.org/LodgingBusiness",
          "https://schema.org/SingleFamilyResidence",
          "https://schema.org/Suite"
        ]
      },
      {
        "name": "occupancy",
        "type": "https://schema.org/QuantitativeValue",
        "description": "The allowed total occupancy for the accommodation in persons (including infants etc). For individual accommodations, this is not necessarily the legal maximum but defines the permitted usage as per the contractual agreement (e.g. a double room used by a single person).\nTypical unit code(s): C62 for person.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/Accommodation",
          "https://schema.org/Apartment",
          "https://schema.org/HotelRoom",
          "https://schema.org/SingleFamilyResidence",
          "https://schema.org/Suite"
        ]
      }
    ]
  },
  {
    "name": "SiteNavigationElement",
    "type": "https://schema.org/SiteNavigationElement",
    "source": "generated",
    "description": "A navigation element of the page.",
    "parentTypes": [
      "https://schema.org/WebPageElement"
    ]
  },
  {
    "name": "SizeGroupEnumeration",
    "type": "https://schema.org/SizeGroupEnumeration",
    "source": "generated",
    "description": "Enumerates common size groups for various product categories.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ]
  },
  {
    "name": "SizeSpecification",
    "type": "https://schema.org/SizeSpecification",
    "source": "generated",
    "description": "Size related properties of a product, typically a size code ([[name]]) and optionally a [[sizeSystem]], [[sizeGroup]], and product measurements ([[hasMeasurement]]). In addition, the intended audience can be defined through [[suggestedAge]], [[suggestedGender]], and suggested body measurements ([[suggestedMeasurement]]).",
    "parentTypes": [
      "https://schema.org/QualitativeValue"
    ],
    "properties": [
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
        "name": "sizeGroup",
        "type": [
          "https://schema.org/SizeGroupEnumeration",
          "https://schema.org/Text"
        ],
        "description": "The size group (also known as \"size type\") for a product's size. Size groups are common in the fashion industry to define size segments and suggested audiences for wearable products. Multiple values can be combined, for example \"men's big and tall\", \"petite maternity\" or \"regular\".",
        "expectedTypes": [
          "https://schema.org/SizeGroupEnumeration",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/SizeGroupEnumeration",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/SizeSpecification"
        ]
      },
      {
        "name": "sizeSystem",
        "type": [
          "https://schema.org/SizeSystemEnumeration",
          "https://schema.org/Text"
        ],
        "description": "The size system used to identify a product's size. Typically either a standard (for example, \"GS1\" or \"ISO-EN13402\"), country code (for example \"US\" or \"JP\"), or a measuring system (for example \"Metric\" or \"Imperial\").",
        "expectedTypes": [
          "https://schema.org/SizeSystemEnumeration",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/SizeSystemEnumeration",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/SizeSpecification"
        ]
      },
      {
        "name": "suggestedAge",
        "type": "https://schema.org/QuantitativeValue",
        "description": "The age or age range for the intended audience or person, for example 3-12 months for infants, 1-5 years for toddlers.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/PeopleAudience",
          "https://schema.org/SizeSpecification"
        ]
      },
      {
        "name": "suggestedGender",
        "type": [
          "https://schema.org/GenderType",
          "https://schema.org/Text"
        ],
        "description": "The suggested gender of the intended person or audience, for example \"male\", \"female\", or \"unisex\".",
        "expectedTypes": [
          "https://schema.org/GenderType",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/GenderType",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/PeopleAudience",
          "https://schema.org/SizeSpecification"
        ]
      },
      {
        "name": "suggestedMeasurement",
        "type": "https://schema.org/QuantitativeValue",
        "description": "A suggested range of body measurements for the intended audience or person, for example inseam between 32 and 34 inches or height between 170 and 190 cm. Typically found on a size chart for wearable products.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/PeopleAudience",
          "https://schema.org/SizeSpecification"
        ]
      }
    ]
  },
  {
    "name": "SizeSystemEnumeration",
    "type": "https://schema.org/SizeSystemEnumeration",
    "source": "generated",
    "description": "Enumerates common size systems for different categories of products, for example \"EN-13402\" or \"UK\" for wearables or \"Imperial\" for screws.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "SizeSystemImperial",
        "type": "https://schema.org/SizeSystemImperial",
        "description": "Imperial size system."
      },
      {
        "name": "SizeSystemMetric",
        "type": "https://schema.org/SizeSystemMetric",
        "description": "Metric size system."
      }
    ]
  },
  {
    "name": "SkiResort",
    "type": "https://schema.org/SkiResort",
    "source": "generated",
    "description": "A ski resort.",
    "parentTypes": [
      "https://schema.org/Resort",
      "https://schema.org/SportsActivityLocation"
    ]
  },
  {
    "name": "SocialEvent",
    "type": "https://schema.org/SocialEvent",
    "source": "generated",
    "description": "Event type: Social event.",
    "parentTypes": [
      "https://schema.org/Event"
    ]
  },
  {
    "name": "SocialMediaPosting",
    "type": "https://schema.org/SocialMediaPosting",
    "source": "generated",
    "description": "A post to a social media platform, including blog posts, tweets, Facebook posts, etc.",
    "parentTypes": [
      "https://schema.org/Article"
    ],
    "properties": [
      {
        "name": "sharedContent",
        "type": "https://schema.org/CreativeWork",
        "description": "A CreativeWork such as an image, video, or audio clip shared as part of this posting.",
        "expectedTypes": [
          "https://schema.org/CreativeWork"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork"
        ],
        "domainTypes": [
          "https://schema.org/Comment",
          "https://schema.org/SocialMediaPosting"
        ]
      }
    ]
  },
  {
    "name": "SoftwareApplication",
    "type": "https://schema.org/SoftwareApplication",
    "source": "generated",
    "description": "A software application.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ],
    "properties": [
      {
        "name": "applicationCategory",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "Type of software application, e.g. 'Game, Multimedia'.",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/SoftwareApplication"
        ]
      },
      {
        "name": "applicationSubCategory",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "Subcategory of the application, e.g. 'Arcade Game'.",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/SoftwareApplication"
        ]
      },
      {
        "name": "applicationSuite",
        "type": "https://schema.org/Text",
        "description": "The name of the application suite to which the application belongs (e.g. Excel belongs to Office).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/SoftwareApplication"
        ]
      },
      {
        "name": "availableOnDevice",
        "type": "https://schema.org/Text",
        "description": "Device required to run the application. Used in cases where a specific make/model is required to run the application.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/SoftwareApplication"
        ]
      },
      {
        "name": "countriesNotSupported",
        "type": "https://schema.org/Text",
        "description": "Countries for which the application is not supported. You can also provide the two-letter ISO 3166-1 alpha-2 country code.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/SoftwareApplication"
        ]
      },
      {
        "name": "countriesSupported",
        "type": "https://schema.org/Text",
        "description": "Countries for which the application is supported. You can also provide the two-letter ISO 3166-1 alpha-2 country code.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/SoftwareApplication"
        ]
      },
      {
        "name": "device",
        "type": "https://schema.org/Text",
        "description": "Device required to run the application. Used in cases where a specific make/model is required to run the application.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/SoftwareApplication"
        ],
        "supersededBy": "https://schema.org/availableOnDevice"
      },
      {
        "name": "downloadUrl",
        "type": "https://schema.org/URL",
        "description": "If the file can be downloaded, URL to download the binary.",
        "expectedTypes": [
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/SoftwareApplication"
        ]
      },
      {
        "name": "featureList",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "Features or modules provided by this application (and possibly required by other applications).",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/SoftwareApplication"
        ]
      },
      {
        "name": "fileSize",
        "type": "https://schema.org/Text",
        "description": "Size of the application / package (e.g. 18MB). In the absence of a unit (MB, KB etc.), KB will be assumed.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/SoftwareApplication"
        ]
      },
      {
        "name": "installUrl",
        "type": "https://schema.org/URL",
        "description": "URL at which the app may be installed, if different from the URL of the item.",
        "expectedTypes": [
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/SoftwareApplication"
        ]
      },
      {
        "name": "memoryRequirements",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "Minimum memory requirements.",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/SoftwareApplication"
        ]
      },
      {
        "name": "operatingSystem",
        "type": [
          "https://schema.org/OperatingSystem",
          "https://schema.org/Text"
        ],
        "description": "Operating systems supported (Windows 7, OS X 10.6, Android 1.6).",
        "expectedTypes": [
          "https://schema.org/OperatingSystem",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/OperatingSystem",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/SoftwareApplication"
        ]
      },
      {
        "name": "permissions",
        "type": "https://schema.org/Text",
        "description": "Permission(s) required to run the app (for example, a mobile app may require full internet access or may run only on wifi).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/SoftwareApplication"
        ]
      },
      {
        "name": "processorRequirements",
        "type": "https://schema.org/Text",
        "description": "Processor architecture required to run the application (e.g. IA64).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/SoftwareApplication"
        ]
      },
      {
        "name": "releaseNotes",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "Description of what changed in this version.",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/SoftwareApplication"
        ]
      },
      {
        "name": "requirements",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "Component dependency requirements for application. This includes runtime environments and shared libraries that are not included in the application distribution package, but required to run the application (examples: DirectX, Java or .NET runtime).",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/SoftwareApplication"
        ],
        "supersededBy": "https://schema.org/softwareRequirements"
      },
      {
        "name": "runtimePlatform",
        "type": [
          "https://schema.org/RuntimePlatform",
          "https://schema.org/Text"
        ],
        "description": "Runtime platform or script interpreter dependencies (example: Java v1, Python 2.3, .NET Framework 3.0).",
        "expectedTypes": [
          "https://schema.org/RuntimePlatform",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/RuntimePlatform",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/SoftwareApplication",
          "https://schema.org/SoftwareSourceCode"
        ]
      },
      {
        "name": "screenshot",
        "type": [
          "https://schema.org/ImageObject",
          "https://schema.org/URL"
        ],
        "description": "A link to a screenshot image of the app.",
        "expectedTypes": [
          "https://schema.org/ImageObject",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/ImageObject",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/SoftwareApplication"
        ]
      },
      {
        "name": "softwareAddOn",
        "type": "https://schema.org/SoftwareApplication",
        "description": "Additional content for a software application.",
        "expectedTypes": [
          "https://schema.org/SoftwareApplication"
        ],
        "rangeTypes": [
          "https://schema.org/SoftwareApplication"
        ],
        "domainTypes": [
          "https://schema.org/SoftwareApplication"
        ]
      },
      {
        "name": "softwareHelp",
        "type": "https://schema.org/CreativeWork",
        "description": "Software application help.",
        "expectedTypes": [
          "https://schema.org/CreativeWork"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork"
        ],
        "domainTypes": [
          "https://schema.org/SoftwareApplication"
        ]
      },
      {
        "name": "softwareRequirements",
        "type": [
          "https://schema.org/SoftwareApplication",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "Component dependency requirements for application. This includes runtime environments and shared libraries that are not included in the application distribution package, but required to run the application (examples: DirectX, Java or .NET runtime).",
        "expectedTypes": [
          "https://schema.org/SoftwareApplication",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/SoftwareApplication",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/SoftwareApplication"
        ]
      },
      {
        "name": "softwareVersion",
        "type": "https://schema.org/Text",
        "description": "Version of the software instance.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/SoftwareApplication"
        ]
      },
      {
        "name": "storageRequirements",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "Storage requirements (free space required).",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/SoftwareApplication"
        ]
      },
      {
        "name": "supportingData",
        "type": "https://schema.org/DataFeed",
        "description": "Supporting data for a SoftwareApplication.",
        "expectedTypes": [
          "https://schema.org/DataFeed"
        ],
        "rangeTypes": [
          "https://schema.org/DataFeed"
        ],
        "domainTypes": [
          "https://schema.org/SoftwareApplication"
        ]
      }
    ]
  },
  {
    "name": "SoftwareSourceCode",
    "type": "https://schema.org/SoftwareSourceCode",
    "source": "generated",
    "description": "Computer programming source code. Example: Full (compile ready) solutions, code snippet samples, scripts, templates.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ],
    "properties": [
      {
        "name": "codeRepository",
        "type": "https://schema.org/URL",
        "description": "Link to the repository where the un-compiled, human readable code and related code is located (SVN, GitHub, CodePlex).",
        "expectedTypes": [
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/SoftwareSourceCode"
        ]
      },
      {
        "name": "codeSampleType",
        "type": "https://schema.org/Text",
        "description": "What type of code sample: full (compile ready) solution, code snippet, inline code, scripts, template.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/SoftwareSourceCode"
        ]
      },
      {
        "name": "programmingLanguage",
        "type": [
          "https://schema.org/ComputerLanguage",
          "https://schema.org/Text"
        ],
        "description": "The computer programming language.",
        "expectedTypes": [
          "https://schema.org/ComputerLanguage",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/ComputerLanguage",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/SoftwareSourceCode"
        ]
      },
      {
        "name": "runtime",
        "type": "https://schema.org/Text",
        "description": "Runtime platform or script interpreter dependencies (example: Java v1, Python 2.3, .NET Framework 3.0).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/SoftwareSourceCode"
        ],
        "supersededBy": "https://schema.org/runtimePlatform"
      },
      {
        "name": "runtimePlatform",
        "type": [
          "https://schema.org/RuntimePlatform",
          "https://schema.org/Text"
        ],
        "description": "Runtime platform or script interpreter dependencies (example: Java v1, Python 2.3, .NET Framework 3.0).",
        "expectedTypes": [
          "https://schema.org/RuntimePlatform",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/RuntimePlatform",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/SoftwareApplication",
          "https://schema.org/SoftwareSourceCode"
        ]
      },
      {
        "name": "sampleType",
        "type": "https://schema.org/Text",
        "description": "What type of code sample: full (compile ready) solution, code snippet, inline code, scripts, template.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/SoftwareSourceCode"
        ],
        "supersededBy": "https://schema.org/codeSampleType"
      },
      {
        "name": "targetProduct",
        "type": "https://schema.org/SoftwareApplication",
        "description": "Target Operating System / Product to which the code applies.  If applies to several versions, just the product name can be used.",
        "expectedTypes": [
          "https://schema.org/SoftwareApplication"
        ],
        "rangeTypes": [
          "https://schema.org/SoftwareApplication"
        ],
        "domainTypes": [
          "https://schema.org/SoftwareSourceCode"
        ]
      }
    ]
  },
  {
    "name": "SolveMathAction",
    "type": "https://schema.org/SolveMathAction",
    "source": "generated",
    "description": "The action that takes in a math expression and directs users to a page potentially capable of solving/simplifying that expression.",
    "parentTypes": [
      "https://schema.org/Action"
    ],
    "properties": [
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
      }
    ]
  },
  {
    "name": "SomeProducts",
    "type": "https://schema.org/SomeProducts",
    "source": "generated",
    "description": "A placeholder for multiple similar products of the same kind.",
    "parentTypes": [
      "https://schema.org/Product"
    ],
    "properties": [
      {
        "name": "inventoryLevel",
        "type": "https://schema.org/QuantitativeValue",
        "description": "The current approximate inventory level for the item or items.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/Demand",
          "https://schema.org/Offer",
          "https://schema.org/SomeProducts"
        ]
      }
    ]
  },
  {
    "name": "SpeakableSpecification",
    "type": "https://schema.org/SpeakableSpecification",
    "source": "generated",
    "description": "A SpeakableSpecification indicates (typically via [[xpath]] or [[cssSelector]]) sections of a document that are highlighted as particularly [[speakable]]. Instances of this type are expected to be used primarily as values of the [[speakable]] property.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "cssSelector",
        "type": "https://schema.org/CssSelectorType",
        "description": "A CSS selector, e.g. of a [[SpeakableSpecification]] or [[WebPageElement]]. In the latter case, multiple matches within a page can constitute a single conceptual \"Web page element\".",
        "expectedTypes": [
          "https://schema.org/CssSelectorType"
        ],
        "rangeTypes": [
          "https://schema.org/CssSelectorType"
        ],
        "domainTypes": [
          "https://schema.org/SpeakableSpecification",
          "https://schema.org/WebPageElement"
        ]
      },
      {
        "name": "xpath",
        "type": "https://schema.org/XPathType",
        "description": "An XPath, e.g. of a [[SpeakableSpecification]] or [[WebPageElement]]. In the latter case, multiple matches within a page can constitute a single conceptual \"Web page element\".",
        "expectedTypes": [
          "https://schema.org/XPathType"
        ],
        "rangeTypes": [
          "https://schema.org/XPathType"
        ],
        "domainTypes": [
          "https://schema.org/SpeakableSpecification",
          "https://schema.org/WebPageElement"
        ]
      }
    ]
  },
  {
    "name": "SpecialAnnouncement",
    "type": "https://schema.org/SpecialAnnouncement",
    "source": "generated",
    "description": "A SpecialAnnouncement combines a simple date-stamped textual information update\n      with contextualized Web links and other structured data.  It represents an information update made by a\n      locally-oriented organization, for example schools, pharmacies, healthcare providers,  community groups, police,\n      local government.\n\nFor work in progress guidelines on Coronavirus-related markup see [this doc](https://docs.google.com/document/d/14ikaGCKxo50rRM7nvKSlbUpjyIk2WMQd3IkB1lItlrM/edit#).\n\nThe motivating scenario for SpecialAnnouncement is the [Coronavirus pandemic](https://en.wikipedia.org/wiki/2019%E2%80%9320_coronavirus_pandemic), and the initial vocabulary is oriented to this urgent situation. Schema.org\nexpect to improve the markup iteratively as it is deployed and as feedback emerges from use. In addition to our\nusual [Github entry](https://github.com/schemaorg/schemaorg/issues/2490), feedback comments can also be provided in [this document](https://docs.google.com/document/d/1fpdFFxk8s87CWwACs53SGkYv3aafSxz_DTtOQxMrBJQ/edit#).\n\n\nWhile this schema is designed to communicate urgent crisis-related information, it is not the same as an emergency warning technology like [CAP](https://en.wikipedia.org/wiki/Common_Alerting_Protocol), although there may be overlaps. The intent is to cover\nthe kinds of everyday practical information being posted to existing websites during an emergency situation.\n\nSeveral kinds of information can be provided:\n\nWe encourage the provision of \"name\", \"text\", \"datePosted\", \"expires\" (if appropriate), \"category\" and\n\"url\" as a simple baseline. It is important to provide a value for \"category\" where possible, most ideally as a well known\nURL from Wikipedia or Wikidata. In the case of the 2019-2020 Coronavirus pandemic, this should be \"https://en.wikipedia.org/w/index.php?title=2019-20\\_coronavirus\\_pandemic\" or \"https://www.wikidata.org/wiki/Q81068910\".\n\nFor many of the possible properties, values can either be simple links or an inline description, depending on whether a summary is available. For a link, provide just the URL of the appropriate page as the property's value. For an inline description, use a [[WebContent]] type, and provide the url as a property of that, alongside at least a simple \"[[text]]\" summary of the page. It is\nunlikely that a single SpecialAnnouncement will need all of the possible properties simultaneously.\n\nWe expect that in many cases the page referenced might contain more specialized structured data, e.g. contact info, [[openingHours]], [[Event]], [[FAQPage]] etc. By linking to those pages from a [[SpecialAnnouncement]] you can help make it clearer that the events are related to the situation (e.g. Coronavirus) indicated by the [[category]] property of the [[SpecialAnnouncement]].\n\nMany [[SpecialAnnouncement]]s will relate to particular regions and to identifiable local organizations. Use [[spatialCoverage]] for the region, and [[announcementLocation]] to indicate specific [[LocalBusiness]]es and [[CivicStructure]]s. If the announcement affects both a particular region and a specific location (for example, a library closure that serves an entire region), use both [[spatialCoverage]] and [[announcementLocation]].\n\nThe [[about]] property can be used to indicate entities that are the focus of the announcement. We now recommend using [[about]] only\nfor representing non-location entities (e.g. a [[Course]] or a [[RadioStation]]). For places, use [[announcementLocation]] and [[spatialCoverage]]. Consumers of this markup should be aware that the initial design encouraged the use of [[about]] for locations too.\n\nThe basic content of [[SpecialAnnouncement]] is similar to that of an [RSS](https://en.wikipedia.org/wiki/RSS) or [Atom](https://en.wikipedia.org/wiki/Atom_(Web_standard)) feed. For publishers without such feeds, basic feed-like information can be shared by posting\n[[SpecialAnnouncement]] updates in a page, e.g. using JSON-LD. For sites with Atom/RSS functionality, you can point to a feed\nwith the [[webFeed]] property. This can be a simple URL, or an inline [[DataFeed]] object, with [[encodingFormat]] providing\nmedia type information, e.g. \"application/rss+xml\" or \"application/atom+xml\".\n",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ],
    "properties": [
      {
        "name": "announcementLocation",
        "type": [
          "https://schema.org/CivicStructure",
          "https://schema.org/LocalBusiness"
        ],
        "description": "Indicates a specific [[CivicStructure]] or [[LocalBusiness]] associated with the SpecialAnnouncement. For example, a specific testing facility or business with special opening hours. For a larger geographic region like a quarantine of an entire region, use [[spatialCoverage]].",
        "expectedTypes": [
          "https://schema.org/CivicStructure",
          "https://schema.org/LocalBusiness"
        ],
        "rangeTypes": [
          "https://schema.org/CivicStructure",
          "https://schema.org/LocalBusiness"
        ],
        "domainTypes": [
          "https://schema.org/SpecialAnnouncement"
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
        "name": "diseasePreventionInfo",
        "type": [
          "https://schema.org/URL",
          "https://schema.org/WebContent"
        ],
        "description": "Information about disease prevention.",
        "expectedTypes": [
          "https://schema.org/URL",
          "https://schema.org/WebContent"
        ],
        "rangeTypes": [
          "https://schema.org/URL",
          "https://schema.org/WebContent"
        ],
        "domainTypes": [
          "https://schema.org/SpecialAnnouncement"
        ]
      },
      {
        "name": "diseaseSpreadStatistics",
        "type": [
          "https://schema.org/Dataset",
          "https://schema.org/Observation",
          "https://schema.org/URL",
          "https://schema.org/WebContent"
        ],
        "description": "Statistical information about the spread of a disease, either as [[WebContent]], or\n  described directly as a [[Dataset]], or the specific [[Observation]]s in the dataset. When a [[WebContent]] URL is\n  provided, the page indicated might also contain more such markup.",
        "expectedTypes": [
          "https://schema.org/Dataset",
          "https://schema.org/Observation",
          "https://schema.org/URL",
          "https://schema.org/WebContent"
        ],
        "rangeTypes": [
          "https://schema.org/Dataset",
          "https://schema.org/Observation",
          "https://schema.org/URL",
          "https://schema.org/WebContent"
        ],
        "domainTypes": [
          "https://schema.org/SpecialAnnouncement"
        ]
      },
      {
        "name": "gettingTestedInfo",
        "type": [
          "https://schema.org/URL",
          "https://schema.org/WebContent"
        ],
        "description": "Information about getting tested (for a [[MedicalCondition]]), e.g. in the context of a pandemic.",
        "expectedTypes": [
          "https://schema.org/URL",
          "https://schema.org/WebContent"
        ],
        "rangeTypes": [
          "https://schema.org/URL",
          "https://schema.org/WebContent"
        ],
        "domainTypes": [
          "https://schema.org/SpecialAnnouncement"
        ]
      },
      {
        "name": "governmentBenefitsInfo",
        "type": "https://schema.org/GovernmentService",
        "description": "governmentBenefitsInfo provides information about government benefits associated with a SpecialAnnouncement.",
        "expectedTypes": [
          "https://schema.org/GovernmentService"
        ],
        "rangeTypes": [
          "https://schema.org/GovernmentService"
        ],
        "domainTypes": [
          "https://schema.org/SpecialAnnouncement"
        ]
      },
      {
        "name": "newsUpdatesAndGuidelines",
        "type": [
          "https://schema.org/URL",
          "https://schema.org/WebContent"
        ],
        "description": "Indicates a page with news updates and guidelines. This could often be (but is not required to be) the main page containing [[SpecialAnnouncement]] markup on a site.",
        "expectedTypes": [
          "https://schema.org/URL",
          "https://schema.org/WebContent"
        ],
        "rangeTypes": [
          "https://schema.org/URL",
          "https://schema.org/WebContent"
        ],
        "domainTypes": [
          "https://schema.org/SpecialAnnouncement"
        ]
      },
      {
        "name": "publicTransportClosuresInfo",
        "type": [
          "https://schema.org/URL",
          "https://schema.org/WebContent"
        ],
        "description": "Information about public transport closures.",
        "expectedTypes": [
          "https://schema.org/URL",
          "https://schema.org/WebContent"
        ],
        "rangeTypes": [
          "https://schema.org/URL",
          "https://schema.org/WebContent"
        ],
        "domainTypes": [
          "https://schema.org/SpecialAnnouncement"
        ]
      },
      {
        "name": "quarantineGuidelines",
        "type": [
          "https://schema.org/URL",
          "https://schema.org/WebContent"
        ],
        "description": "Guidelines about quarantine rules, e.g. in the context of a pandemic.",
        "expectedTypes": [
          "https://schema.org/URL",
          "https://schema.org/WebContent"
        ],
        "rangeTypes": [
          "https://schema.org/URL",
          "https://schema.org/WebContent"
        ],
        "domainTypes": [
          "https://schema.org/SpecialAnnouncement"
        ]
      },
      {
        "name": "schoolClosuresInfo",
        "type": [
          "https://schema.org/URL",
          "https://schema.org/WebContent"
        ],
        "description": "Information about school closures.",
        "expectedTypes": [
          "https://schema.org/URL",
          "https://schema.org/WebContent"
        ],
        "rangeTypes": [
          "https://schema.org/URL",
          "https://schema.org/WebContent"
        ],
        "domainTypes": [
          "https://schema.org/SpecialAnnouncement"
        ]
      },
      {
        "name": "travelBans",
        "type": [
          "https://schema.org/URL",
          "https://schema.org/WebContent"
        ],
        "description": "Information about travel bans, e.g. in the context of a pandemic.",
        "expectedTypes": [
          "https://schema.org/URL",
          "https://schema.org/WebContent"
        ],
        "rangeTypes": [
          "https://schema.org/URL",
          "https://schema.org/WebContent"
        ],
        "domainTypes": [
          "https://schema.org/SpecialAnnouncement"
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
    "name": "Specialty",
    "type": "https://schema.org/Specialty",
    "source": "generated",
    "description": "Any branch of a field in which people typically develop specific expertise, usually after significant study, time, and effort.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ]
  },
  {
    "name": "SpecifiedCertificate",
    "type": "http://unece.org/vocab#SpecifiedCertificate",
    "source": "generated"
  },
  {
    "name": "SpecifiedTradeProduct",
    "type": "http://unece.org/vocab#SpecifiedTradeProduct",
    "source": "generated"
  },
  {
    "name": "SportingGoodsStore",
    "type": "https://schema.org/SportingGoodsStore",
    "source": "generated",
    "description": "A sporting goods store.",
    "parentTypes": [
      "https://schema.org/Store"
    ]
  },
  {
    "name": "SportsActivityLocation",
    "type": "https://schema.org/SportsActivityLocation",
    "source": "generated",
    "description": "A sports location, such as a playing field.",
    "parentTypes": [
      "https://schema.org/LocalBusiness"
    ]
  },
  {
    "name": "SportsClub",
    "type": "https://schema.org/SportsClub",
    "source": "generated",
    "description": "A sports club.",
    "parentTypes": [
      "https://schema.org/SportsActivityLocation"
    ]
  },
  {
    "name": "SportsEvent",
    "type": "https://schema.org/SportsEvent",
    "source": "generated",
    "description": "Event type: Sports event.",
    "parentTypes": [
      "https://schema.org/Event"
    ],
    "properties": [
      {
        "name": "awayTeam",
        "type": [
          "https://schema.org/Person",
          "https://schema.org/SportsTeam"
        ],
        "description": "The away team in a sports event.",
        "expectedTypes": [
          "https://schema.org/Person",
          "https://schema.org/SportsTeam"
        ],
        "rangeTypes": [
          "https://schema.org/Person",
          "https://schema.org/SportsTeam"
        ],
        "domainTypes": [
          "https://schema.org/SportsEvent"
        ]
      },
      {
        "name": "competitor",
        "type": [
          "https://schema.org/Person",
          "https://schema.org/SportsTeam"
        ],
        "description": "A competitor in a sports event.",
        "expectedTypes": [
          "https://schema.org/Person",
          "https://schema.org/SportsTeam"
        ],
        "rangeTypes": [
          "https://schema.org/Person",
          "https://schema.org/SportsTeam"
        ],
        "domainTypes": [
          "https://schema.org/SportsEvent"
        ]
      },
      {
        "name": "homeTeam",
        "type": [
          "https://schema.org/Person",
          "https://schema.org/SportsTeam"
        ],
        "description": "The home team in a sports event.",
        "expectedTypes": [
          "https://schema.org/Person",
          "https://schema.org/SportsTeam"
        ],
        "rangeTypes": [
          "https://schema.org/Person",
          "https://schema.org/SportsTeam"
        ],
        "domainTypes": [
          "https://schema.org/SportsEvent"
        ]
      },
      {
        "name": "referee",
        "type": "https://schema.org/Person",
        "description": "An official who watches a game or match closely to enforce the rules and arbitrate on matters arising from the play such as referees, umpires or judges. The name of the effective function can vary according to the sport.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/SportsEvent"
        ]
      },
      {
        "name": "sport",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "A type of sport (e.g. Baseball).",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/SportsEvent",
          "https://schema.org/SportsOrganization"
        ]
      }
    ]
  },
  {
    "name": "SportsOrganization",
    "type": "https://schema.org/SportsOrganization",
    "source": "generated",
    "description": "Represents the collection of all sports organizations, including sports teams, governing bodies, and sports associations.",
    "parentTypes": [
      "https://schema.org/Organization"
    ],
    "properties": [
      {
        "name": "sport",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "A type of sport (e.g. Baseball).",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/SportsEvent",
          "https://schema.org/SportsOrganization"
        ]
      }
    ]
  },
  {
    "name": "SportsTeam",
    "type": "https://schema.org/SportsTeam",
    "source": "generated",
    "description": "Organization: Sports team.",
    "parentTypes": [
      "https://schema.org/SportsOrganization"
    ],
    "properties": [
      {
        "name": "athlete",
        "type": "https://schema.org/Person",
        "description": "A person that acts as performing member of a sports team; a player as opposed to a coach.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/SportsTeam"
        ]
      },
      {
        "name": "coach",
        "type": "https://schema.org/Person",
        "description": "A person that acts in a coaching role for a sports team.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/SportsTeam"
        ]
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
      }
    ]
  },
  {
    "name": "SpreadsheetDigitalDocument",
    "type": "https://schema.org/SpreadsheetDigitalDocument",
    "source": "generated",
    "description": "A spreadsheet file.",
    "parentTypes": [
      "https://schema.org/DigitalDocument"
    ]
  },
  {
    "name": "StadiumOrArena",
    "type": "https://schema.org/StadiumOrArena",
    "source": "generated",
    "description": "A stadium.",
    "parentTypes": [
      "https://schema.org/CivicStructure",
      "https://schema.org/SportsActivityLocation"
    ]
  },
  {
    "name": "State",
    "type": "https://schema.org/State",
    "source": "generated",
    "description": "A state or province of a country.",
    "parentTypes": [
      "https://schema.org/AdministrativeArea"
    ]
  },
  {
    "name": "Statement",
    "type": "https://schema.org/Statement",
    "source": "generated",
    "description": "A statement about something, for example a fun or interesting fact. If known, the main entity this statement is about can be indicated using mainEntity. For more formal claims (e.g. in Fact Checking), consider using [[Claim]] instead. Use the [[text]] property to capture the text of the statement.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ]
  },
  {
    "name": "StatisticalPopulation",
    "type": "https://schema.org/StatisticalPopulation",
    "source": "generated",
    "description": "A StatisticalPopulation is a set of instances of a certain given type that satisfy some set of constraints. The property [[populationType]] is used to specify the type. Any property that can be used on instances of that type can appear on the statistical population. For example, a [[StatisticalPopulation]] representing all [[Person]]s with a [[homeLocation]] of East Podunk California would be described by applying the appropriate [[homeLocation]] and [[populationType]] properties to a [[StatisticalPopulation]] item that stands for that set of people.\nThe properties [[numConstraints]] and [[constraintProperty]] are used to specify which of the populations properties are used to specify the population. Note that the sense of \"population\" used here is the general sense of a statistical\npopulation, and does not imply that the population consists of people. For example, a [[populationType]] of [[Event]] or [[NewsArticle]] could be used. See also [[Observation]], where a [[populationType]] such as [[Person]] or [[Event]] can be indicated directly. In most cases it may be better to use [[StatisticalVariable]] instead of [[StatisticalPopulation]].",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "populationType",
        "type": "https://schema.org/Class",
        "description": "Indicates the populationType common to all members of a [[StatisticalPopulation]] or all cases within the scope of a [[StatisticalVariable]].",
        "expectedTypes": [
          "https://schema.org/Class"
        ],
        "rangeTypes": [
          "https://schema.org/Class"
        ],
        "domainTypes": [
          "https://schema.org/StatisticalPopulation",
          "https://schema.org/StatisticalVariable"
        ]
      }
    ]
  },
  {
    "name": "StatisticalVariable",
    "type": "https://schema.org/StatisticalVariable",
    "source": "generated",
    "description": "[[StatisticalVariable]] represents any type of statistical metric that can be measured at a place and time. The usage pattern for [[StatisticalVariable]] is typically expressed using [[Observation]] with an explicit [[populationType]], which is a type, typically drawn from Schema.org. Each [[StatisticalVariable]] is marked as a [[ConstraintNode]], meaning that some properties (those listed using [[constraintProperty]]) serve in this setting solely to define the statistical variable rather than literally describe a specific person, place or thing. For example, a [[StatisticalVariable]] Median_Height_Person_Female representing the median height of women, could be written as follows: the population type is [[Person]]; the measuredProperty [[height]]; the [[statType]] [[median]]; the [[gender]] [[Female]]. It is important to note that there are many kinds of scientific quantitative observation which are not fully, perfectly or unambiguously described following this pattern, or with solely Schema.org terminology. The approach taken here is designed to allow partial, incremental or minimal description of [[StatisticalVariable]]s, and the use of detailed sets of entity and property IDs from external repositories. The [[measurementMethod]], [[unitCode]] and [[unitText]] properties can also be used to clarify the specific nature and notation of an observed measurement. ",
    "parentTypes": [
      "https://schema.org/ConstraintNode"
    ],
    "properties": [
      {
        "name": "measuredProperty",
        "type": "https://schema.org/Property",
        "description": "The measuredProperty of an [[Observation]], typically via its [[StatisticalVariable]]. There are various kinds of applicable [[Property]]: a schema.org property, a property from other RDF-compatible systems, e.g. W3C RDF Data Cube, Data Commons, Wikidata, or schema.org extensions such as [GS1's](https://www.gs1.org/voc/?show=properties).",
        "expectedTypes": [
          "https://schema.org/Property"
        ],
        "rangeTypes": [
          "https://schema.org/Property"
        ],
        "domainTypes": [
          "https://schema.org/Observation",
          "https://schema.org/StatisticalVariable"
        ]
      },
      {
        "name": "measurementDenominator",
        "type": "https://schema.org/StatisticalVariable",
        "description": "Identifies the denominator variable when an observation represents a ratio or percentage.",
        "expectedTypes": [
          "https://schema.org/StatisticalVariable"
        ],
        "rangeTypes": [
          "https://schema.org/StatisticalVariable"
        ],
        "domainTypes": [
          "https://schema.org/Observation",
          "https://schema.org/StatisticalVariable"
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
        "name": "measurementQualifier",
        "type": "https://schema.org/Enumeration",
        "description": "Provides additional qualification to an observation. For example, a GDP observation measures the Nominal value.",
        "expectedTypes": [
          "https://schema.org/Enumeration"
        ],
        "rangeTypes": [
          "https://schema.org/Enumeration"
        ],
        "domainTypes": [
          "https://schema.org/Observation",
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
        "name": "populationType",
        "type": "https://schema.org/Class",
        "description": "Indicates the populationType common to all members of a [[StatisticalPopulation]] or all cases within the scope of a [[StatisticalVariable]].",
        "expectedTypes": [
          "https://schema.org/Class"
        ],
        "rangeTypes": [
          "https://schema.org/Class"
        ],
        "domainTypes": [
          "https://schema.org/StatisticalPopulation",
          "https://schema.org/StatisticalVariable"
        ]
      },
      {
        "name": "statType",
        "type": [
          "https://schema.org/Property",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "Indicates the kind of statistic represented by a [[StatisticalVariable]], e.g. mean, count etc. The value of statType is a property, either from within Schema.org (e.g. [[median]], [[marginOfError]], [[maxValue]], [[minValue]]) or from other compatible (e.g. RDF) systems such as DataCommons.org or Wikidata.org. ",
        "expectedTypes": [
          "https://schema.org/Property",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Property",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/StatisticalVariable"
        ]
      }
    ]
  },
  {
    "name": "StatusEnumeration",
    "type": "https://schema.org/StatusEnumeration",
    "source": "generated",
    "description": "Lists or enumerations dealing with status types.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ]
  },
  {
    "name": "SteeringPositionValue",
    "type": "https://schema.org/SteeringPositionValue",
    "source": "generated",
    "description": "A value indicating a steering position.",
    "parentTypes": [
      "https://schema.org/QualitativeValue"
    ],
    "enumerationValues": [
      {
        "name": "LeftHandDriving",
        "type": "https://schema.org/LeftHandDriving",
        "description": "The steering position is on the left side of the vehicle (viewed from the main direction of driving)."
      },
      {
        "name": "RightHandDriving",
        "type": "https://schema.org/RightHandDriving",
        "description": "The steering position is on the right side of the vehicle (viewed from the main direction of driving)."
      }
    ]
  },
  {
    "name": "Store",
    "type": "https://schema.org/Store",
    "source": "generated",
    "description": "A retail good store.",
    "parentTypes": [
      "https://schema.org/LocalBusiness"
    ]
  },
  {
    "name": "StructuredValue",
    "type": "https://schema.org/StructuredValue",
    "source": "generated",
    "description": "Structured values are used when the value of a property has a more complex structure than simply being a textual value or a reference to another thing.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ]
  },
  {
    "name": "Subdivision",
    "type": "https://www.omg.org/spec/Commons/GeopoliticalEntities/Subdivision",
    "source": "generated"
  },
  {
    "name": "SubscribeAction",
    "type": "https://schema.org/SubscribeAction",
    "source": "generated",
    "description": "The act of forming a personal connection with someone/something (object) unidirectionally/asymmetrically to get updates pushed to.\\n\\nRelated actions:\\n\\n* [[FollowAction]]: Unlike FollowAction, SubscribeAction implies that the subscriber acts as a passive agent being constantly/actively pushed for updates.\\n* [[RegisterAction]]: Unlike RegisterAction, SubscribeAction implies that the agent is interested in continuing receiving updates from the object.\\n* [[JoinAction]]: Unlike JoinAction, SubscribeAction implies that the agent is interested in continuing receiving updates from the object.",
    "parentTypes": [
      "https://schema.org/InteractAction"
    ]
  },
  {
    "name": "Substance",
    "type": "https://schema.org/Substance",
    "source": "generated",
    "description": "Any matter of defined composition that has discrete existence, whose origin may be biological, mineral or chemical.",
    "parentTypes": [
      "https://schema.org/MedicalEntity"
    ],
    "properties": [
      {
        "name": "activeIngredient",
        "type": "https://schema.org/Text",
        "description": "An active ingredient, typically chemical compounds and/or biologic substances.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/DietarySupplement",
          "https://schema.org/Drug",
          "https://schema.org/DrugStrength",
          "https://schema.org/Substance"
        ]
      },
      {
        "name": "maximumIntake",
        "type": "https://schema.org/MaximumDoseSchedule",
        "description": "Recommended intake of this supplement for a given population as defined by a specific recommending authority.",
        "expectedTypes": [
          "https://schema.org/MaximumDoseSchedule"
        ],
        "rangeTypes": [
          "https://schema.org/MaximumDoseSchedule"
        ],
        "domainTypes": [
          "https://schema.org/DietarySupplement",
          "https://schema.org/Drug",
          "https://schema.org/DrugStrength",
          "https://schema.org/Substance"
        ]
      }
    ]
  },
  {
    "name": "SubwayStation",
    "type": "https://schema.org/SubwayStation",
    "source": "generated",
    "description": "A subway station.",
    "parentTypes": [
      "https://schema.org/CivicStructure"
    ]
  },
  {
    "name": "Suite",
    "type": "https://schema.org/Suite",
    "source": "generated",
    "description": "A suite in a hotel or other public accommodation, denotes a class of luxury accommodations, the key feature of which is multiple rooms (source: Wikipedia, the free encyclopedia, see <a href=\"http://en.wikipedia.org/wiki/Suite_(hotel)\">http://en.wikipedia.org/wiki/Suite_(hotel)</a>).\n<br /><br />\nSee also the <a href=\"/docs/hotels.html\">dedicated document on the use of schema.org for marking up hotels and other forms of accommodations</a>.\n",
    "parentTypes": [
      "https://schema.org/Accommodation"
    ],
    "properties": [
      {
        "name": "bed",
        "type": [
          "https://schema.org/BedDetails",
          "https://schema.org/BedType",
          "https://schema.org/Text"
        ],
        "description": "The type of bed or beds included in the accommodation. For the single case of just one bed of a certain type, you use bed directly with a text.\n      If you want to indicate the quantity of a certain kind of bed, use an instance of BedDetails. For more detailed information, use the amenityFeature property.",
        "expectedTypes": [
          "https://schema.org/BedDetails",
          "https://schema.org/BedType",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/BedDetails",
          "https://schema.org/BedType",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Accommodation",
          "https://schema.org/HotelRoom",
          "https://schema.org/Suite"
        ]
      },
      {
        "name": "numberOfRooms",
        "type": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "description": "The number of rooms (excluding bathrooms and closets) of the accommodation or lodging business.\nTypical unit code(s): ROM for room or C62 for no unit. The type of room can be put in the unitText property of the QuantitativeValue.",
        "expectedTypes": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/Accommodation",
          "https://schema.org/Apartment",
          "https://schema.org/FloorPlan",
          "https://schema.org/House",
          "https://schema.org/LodgingBusiness",
          "https://schema.org/SingleFamilyResidence",
          "https://schema.org/Suite"
        ]
      },
      {
        "name": "occupancy",
        "type": "https://schema.org/QuantitativeValue",
        "description": "The allowed total occupancy for the accommodation in persons (including infants etc). For individual accommodations, this is not necessarily the legal maximum but defines the permitted usage as per the contractual agreement (e.g. a double room used by a single person).\nTypical unit code(s): C62 for person.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/Accommodation",
          "https://schema.org/Apartment",
          "https://schema.org/HotelRoom",
          "https://schema.org/SingleFamilyResidence",
          "https://schema.org/Suite"
        ]
      }
    ]
  },
  {
    "name": "SuperficialAnatomy",
    "type": "https://schema.org/SuperficialAnatomy",
    "source": "generated",
    "description": "Anatomical features that can be observed by sight (without dissection), including the form and proportions of the human body as well as surface landmarks that correspond to deeper subcutaneous structures. Superficial anatomy plays an important role in sports medicine, phlebotomy, and other medical specialties as underlying anatomical structures can be identified through surface palpation. For example, during back surgery, superficial anatomy can be used to palpate and count vertebrae to find the site of incision. Or in phlebotomy, superficial anatomy can be used to locate an underlying vein; for example, the median cubital vein can be located by palpating the borders of the cubital fossa (such as the epicondyles of the humerus) and then looking for the superficial signs of the vein, such as size, prominence, ability to refill after depression, and feel of surrounding tissue support. As another example, in a subluxation (dislocation) of the glenohumeral joint, the bony structure becomes pronounced with the deltoid muscle failing to cover the glenohumeral joint allowing the edges of the scapula to be superficially visible. Here, the superficial anatomy is the visible edges of the scapula, implying the underlying dislocation of the joint (the related anatomical structure).",
    "parentTypes": [
      "https://schema.org/MedicalEntity"
    ],
    "properties": [
      {
        "name": "associatedPathophysiology",
        "type": "https://schema.org/Text",
        "description": "If applicable, a description of the pathophysiology associated with the anatomical system, including potential abnormal changes in the mechanical, physical, and biochemical functions of the system.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/AnatomicalStructure",
          "https://schema.org/AnatomicalSystem",
          "https://schema.org/SuperficialAnatomy"
        ]
      },
      {
        "name": "relatedAnatomy",
        "type": [
          "https://schema.org/AnatomicalStructure",
          "https://schema.org/AnatomicalSystem"
        ],
        "description": "Anatomical systems or structures that relate to the superficial anatomy.",
        "expectedTypes": [
          "https://schema.org/AnatomicalStructure",
          "https://schema.org/AnatomicalSystem"
        ],
        "rangeTypes": [
          "https://schema.org/AnatomicalStructure",
          "https://schema.org/AnatomicalSystem"
        ],
        "domainTypes": [
          "https://schema.org/SuperficialAnatomy"
        ]
      },
      {
        "name": "relatedCondition",
        "type": "https://schema.org/MedicalCondition",
        "description": "A medical condition associated with this anatomy.",
        "expectedTypes": [
          "https://schema.org/MedicalCondition"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalCondition"
        ],
        "domainTypes": [
          "https://schema.org/AnatomicalStructure",
          "https://schema.org/AnatomicalSystem",
          "https://schema.org/SuperficialAnatomy"
        ]
      },
      {
        "name": "relatedTherapy",
        "type": "https://schema.org/MedicalTherapy",
        "description": "A medical therapy related to this anatomy.",
        "expectedTypes": [
          "https://schema.org/MedicalTherapy"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalTherapy"
        ],
        "domainTypes": [
          "https://schema.org/AnatomicalStructure",
          "https://schema.org/AnatomicalSystem",
          "https://schema.org/SuperficialAnatomy"
        ]
      },
      {
        "name": "significance",
        "type": "https://schema.org/Text",
        "description": "The significance associated with the superficial anatomy; as an example, how characteristics of the superficial anatomy can suggest underlying medical conditions or courses of treatment.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/SuperficialAnatomy"
        ]
      }
    ]
  },
  {
    "name": "SurgicalProcedure",
    "type": "https://schema.org/SurgicalProcedure",
    "source": "generated",
    "description": "A medical procedure involving an incision with instruments; performed for diagnose, or therapeutic purposes.",
    "parentTypes": [
      "https://schema.org/MedicalProcedure"
    ]
  },
  {
    "name": "SuspendAction",
    "type": "https://schema.org/SuspendAction",
    "source": "generated",
    "description": "The act of momentarily pausing a device or application (e.g. pause music playback or pause a timer).",
    "parentTypes": [
      "https://schema.org/ControlAction"
    ]
  },
  {
    "name": "Syllabus",
    "type": "https://schema.org/Syllabus",
    "source": "generated",
    "description": "A syllabus that describes the material covered in a course, often with several such sections per [[Course]] so that a distinct [[timeRequired]] can be provided for that section of the [[Course]].",
    "parentTypes": [
      "https://schema.org/LearningResource"
    ]
  },
  {
    "name": "Synagogue",
    "type": "https://schema.org/Synagogue",
    "source": "generated",
    "description": "A synagogue.",
    "parentTypes": [
      "https://schema.org/PlaceOfWorship"
    ]
  },
  {
    "name": "Table",
    "type": "https://schema.org/Table",
    "source": "generated",
    "description": "A table on a Web page.",
    "parentTypes": [
      "https://schema.org/WebPageElement"
    ]
  },
  {
    "name": "TakeAction",
    "type": "https://schema.org/TakeAction",
    "source": "generated",
    "description": "The act of gaining ownership of an object from an origin. Reciprocal of GiveAction.\\n\\nRelated actions:\\n\\n* [[GiveAction]]: The reciprocal of TakeAction.\\n* [[ReceiveAction]]: Unlike ReceiveAction, TakeAction implies that ownership has been transferred.",
    "parentTypes": [
      "https://schema.org/TransferAction"
    ]
  },
  {
    "name": "TattooParlor",
    "type": "https://schema.org/TattooParlor",
    "source": "generated",
    "description": "A tattoo parlor.",
    "parentTypes": [
      "https://schema.org/HealthAndBeautyBusiness"
    ]
  },
  {
    "name": "Taxi",
    "type": "https://schema.org/Taxi",
    "source": "generated",
    "description": "A taxi.",
    "parentTypes": [
      "https://schema.org/Service"
    ]
  },
  {
    "name": "TaxiReservation",
    "type": "https://schema.org/TaxiReservation",
    "source": "generated",
    "description": "A reservation for a taxi.\\n\\nNote: This type is for information about actual reservations, e.g. in confirmation emails or HTML pages with individual confirmations of reservations. For offers of tickets, use [[Offer]].",
    "parentTypes": [
      "https://schema.org/Reservation"
    ],
    "properties": [
      {
        "name": "partySize",
        "type": [
          "https://schema.org/Integer",
          "https://schema.org/QuantitativeValue"
        ],
        "description": "Number of people the reservation should accommodate.",
        "expectedTypes": [
          "https://schema.org/Integer",
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/Integer",
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/FoodEstablishmentReservation",
          "https://schema.org/TaxiReservation"
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
    "name": "TaxiService",
    "type": "https://schema.org/TaxiService",
    "source": "generated",
    "description": "A service for a vehicle for hire with a driver for local travel. Fares are usually calculated based on distance traveled.",
    "parentTypes": [
      "https://schema.org/Service"
    ]
  },
  {
    "name": "TaxiStand",
    "type": "https://schema.org/TaxiStand",
    "source": "generated",
    "description": "A taxi stand.",
    "parentTypes": [
      "https://schema.org/CivicStructure"
    ]
  },
  {
    "name": "Taxon",
    "type": "https://schema.org/Taxon",
    "source": "generated",
    "description": "A set of organisms asserted to represent a natural cohesive biological unit.",
    "parentTypes": [
      "https://schema.org/Thing"
    ],
    "properties": [
      {
        "name": "childTaxon",
        "type": [
          "https://schema.org/Taxon",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "Closest child taxa of the taxon in question.",
        "expectedTypes": [
          "https://schema.org/Taxon",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Taxon",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Taxon"
        ],
        "inverseOf": "https://schema.org/parentTaxon"
      },
      {
        "name": "hasDefinedTerm",
        "type": "https://schema.org/DefinedTerm",
        "description": "A Defined Term contained in this term set.",
        "expectedTypes": [
          "https://schema.org/DefinedTerm"
        ],
        "rangeTypes": [
          "https://schema.org/DefinedTerm"
        ],
        "domainTypes": [
          "https://schema.org/DefinedTermSet",
          "https://schema.org/Taxon"
        ]
      },
      {
        "name": "parentTaxon",
        "type": [
          "https://schema.org/Taxon",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "Closest parent taxon of the taxon in question.",
        "expectedTypes": [
          "https://schema.org/Taxon",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Taxon",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Taxon"
        ],
        "inverseOf": "https://schema.org/childTaxon"
      },
      {
        "name": "taxonRank",
        "type": [
          "https://schema.org/PropertyValue",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "The taxonomic rank of this taxon given preferably as a URI from a controlled vocabulary – typically the ranks from TDWG TaxonRank ontology or equivalent Wikidata URIs.",
        "expectedTypes": [
          "https://schema.org/PropertyValue",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/PropertyValue",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Taxon"
        ]
      }
    ]
  },
  {
    "name": "TechArticle",
    "type": "https://schema.org/TechArticle",
    "source": "generated",
    "description": "A technical article - Example: How-to (task) topics, step-by-step, procedural troubleshooting, specifications, etc.",
    "parentTypes": [
      "https://schema.org/Article"
    ],
    "properties": [
      {
        "name": "dependencies",
        "type": "https://schema.org/Text",
        "description": "Prerequisites needed to fulfill steps in article.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/TechArticle"
        ]
      },
      {
        "name": "proficiencyLevel",
        "type": "https://schema.org/Text",
        "description": "Proficiency needed for this content; expected values: 'Beginner', 'Expert'.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/TechArticle"
        ]
      }
    ]
  },
  {
    "name": "TelevisionChannel",
    "type": "https://schema.org/TelevisionChannel",
    "source": "generated",
    "description": "A unique instance of a television BroadcastService on a CableOrSatelliteService lineup.",
    "parentTypes": [
      "https://schema.org/BroadcastChannel"
    ]
  },
  {
    "name": "TelevisionStation",
    "type": "https://schema.org/TelevisionStation",
    "source": "generated",
    "description": "A television station.",
    "parentTypes": [
      "https://schema.org/LocalBusiness"
    ]
  },
  {
    "name": "TennisComplex",
    "type": "https://schema.org/TennisComplex",
    "source": "generated",
    "description": "A tennis complex.",
    "parentTypes": [
      "https://schema.org/SportsActivityLocation"
    ]
  },
  {
    "name": "Text",
    "type": "http://purl.org/dc/dcmitype/Text",
    "source": "generated"
  },
  {
    "name": "Text",
    "type": "https://schema.org/Text",
    "source": "generated",
    "description": "Data type: Text."
  },
  {
    "name": "TextDigitalDocument",
    "type": "https://schema.org/TextDigitalDocument",
    "source": "generated",
    "description": "A file composed primarily of text.",
    "parentTypes": [
      "https://schema.org/DigitalDocument"
    ]
  },
  {
    "name": "TextObject",
    "type": "https://schema.org/TextObject",
    "source": "generated",
    "description": "A text file. The text can be unformatted or contain markup, html, etc.",
    "parentTypes": [
      "https://schema.org/MediaObject"
    ]
  },
  {
    "name": "TheaterEvent",
    "type": "https://schema.org/TheaterEvent",
    "source": "generated",
    "description": "Event type: Theater performance.",
    "parentTypes": [
      "https://schema.org/Event"
    ]
  },
  {
    "name": "TheaterGroup",
    "type": "https://schema.org/TheaterGroup",
    "source": "generated",
    "description": "A theater group or company, for example, the Royal Shakespeare Company or Druid Theatre.",
    "parentTypes": [
      "https://schema.org/PerformingGroup"
    ]
  },
  {
    "name": "TherapeuticProcedure",
    "type": "https://schema.org/TherapeuticProcedure",
    "source": "generated",
    "description": "A medical procedure intended primarily for therapeutic purposes, aimed at improving a health condition.",
    "parentTypes": [
      "https://schema.org/MedicalProcedure"
    ],
    "properties": [
      {
        "name": "adverseOutcome",
        "type": "https://schema.org/MedicalEntity",
        "description": "A possible complication and/or side effect of this therapy. If it is known that an adverse outcome is serious (resulting in death, disability, or permanent damage; requiring hospitalization; or otherwise life-threatening or requiring immediate medical attention), tag it as a seriousAdverseOutcome instead.",
        "expectedTypes": [
          "https://schema.org/MedicalEntity"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalEntity"
        ],
        "domainTypes": [
          "https://schema.org/MedicalDevice",
          "https://schema.org/TherapeuticProcedure"
        ]
      },
      {
        "name": "doseSchedule",
        "type": "https://schema.org/DoseSchedule",
        "description": "A dosing schedule for the drug for a given population, either observed, recommended, or maximum dose based on the type used.",
        "expectedTypes": [
          "https://schema.org/DoseSchedule"
        ],
        "rangeTypes": [
          "https://schema.org/DoseSchedule"
        ],
        "domainTypes": [
          "https://schema.org/Drug",
          "https://schema.org/TherapeuticProcedure"
        ]
      },
      {
        "name": "drug",
        "type": "https://schema.org/Drug",
        "description": "Specifying a drug or medicine used in a medication procedure.",
        "expectedTypes": [
          "https://schema.org/Drug"
        ],
        "rangeTypes": [
          "https://schema.org/Drug"
        ],
        "domainTypes": [
          "https://schema.org/DrugClass",
          "https://schema.org/MedicalCondition",
          "https://schema.org/Patient",
          "https://schema.org/TherapeuticProcedure"
        ]
      }
    ]
  },
  {
    "name": "Thesis",
    "type": "https://schema.org/Thesis",
    "source": "generated",
    "description": "A thesis or dissertation document submitted in support of candidature for an academic degree or professional qualification.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ],
    "properties": [
      {
        "name": "inSupportOf",
        "type": "https://schema.org/Text",
        "description": "Qualification, candidature, degree, application that Thesis supports.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Thesis"
        ]
      }
    ]
  },
  {
    "name": "Thing",
    "type": "https://schema.org/Thing",
    "source": "generated",
    "description": "The most generic type of item.",
    "properties": [
      {
        "name": "additionalType",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "An additional type for the item, typically used for adding more specific types from external vocabularies in microdata syntax. This is a relationship between something and a class that the thing is in. Typically the value is a URI-identified RDF class, and in this case corresponds to the\n    use of rdf:type in RDF. Text values can be used sparingly, for cases where useful information can be added without their being an appropriate schema to reference. In the case of text values, the class label should follow the schema.org <a href=\"https://schema.org/docs/styleguide.html\">style guide</a>.",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Thing"
        ]
      },
      {
        "name": "alternateName",
        "type": "https://schema.org/Text",
        "description": "An alias for the item.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Thing"
        ]
      },
      {
        "name": "description",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/TextObject"
        ],
        "description": "A description of the item.",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/TextObject"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/TextObject"
        ],
        "domainTypes": [
          "https://schema.org/Thing"
        ]
      },
      {
        "name": "disambiguatingDescription",
        "type": "https://schema.org/Text",
        "description": "A sub property of description. A short description of the item used to disambiguate from other, similar items. Information from other properties (in particular, name) may be necessary for the description to be useful for disambiguation.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Thing"
        ]
      },
      {
        "name": "identifier",
        "type": [
          "https://schema.org/PropertyValue",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "The identifier property represents any kind of identifier for any kind of [[Thing]], such as ISBNs, GTIN codes, UUIDs etc. Schema.org provides dedicated properties for representing many of these, either as textual strings or as URL (URI) links. See [background notes](/docs/datamodel.html#identifierBg) for more details.\n        ",
        "expectedTypes": [
          "https://schema.org/PropertyValue",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/PropertyValue",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Thing"
        ]
      },
      {
        "name": "image",
        "type": [
          "https://schema.org/ImageObject",
          "https://schema.org/URL"
        ],
        "description": "An image of the item. This can be a [[URL]] or a fully described [[ImageObject]].",
        "expectedTypes": [
          "https://schema.org/ImageObject",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/ImageObject",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Thing"
        ]
      },
      {
        "name": "mainEntityOfPage",
        "type": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "description": "Indicates a page (or other CreativeWork) for which this thing is the main entity being described. See [background notes](/docs/datamodel.html#mainEntityBackground) for details.",
        "expectedTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Thing"
        ],
        "inverseOf": "https://schema.org/mainEntity"
      },
      {
        "name": "name",
        "type": "https://schema.org/Text",
        "description": "The name of the item.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Thing"
        ]
      },
      {
        "name": "owner",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "A person or organization who owns this Thing.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Thing"
        ],
        "inverseOf": "https://schema.org/owns"
      },
      {
        "name": "potentialAction",
        "type": "https://schema.org/Action",
        "description": "Indicates a potential Action, which describes an idealized action in which this thing would play an 'object' role.",
        "expectedTypes": [
          "https://schema.org/Action"
        ],
        "rangeTypes": [
          "https://schema.org/Action"
        ],
        "domainTypes": [
          "https://schema.org/Thing"
        ]
      },
      {
        "name": "sameAs",
        "type": "https://schema.org/URL",
        "description": "URL of a reference Web page that unambiguously indicates the item's identity. E.g. the URL of the item's Wikipedia page, Wikidata entry, or official website.",
        "expectedTypes": [
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Thing"
        ]
      },
      {
        "name": "subjectOf",
        "type": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Event"
        ],
        "description": "A CreativeWork or Event about this Thing.",
        "expectedTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Event"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Event"
        ],
        "domainTypes": [
          "https://schema.org/Thing"
        ],
        "inverseOf": "https://schema.org/about"
      },
      {
        "name": "url",
        "type": "https://schema.org/URL",
        "description": "URL of the item.",
        "expectedTypes": [
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Thing"
        ]
      }
    ]
  },
  {
    "name": "Ticket",
    "type": "https://schema.org/Ticket",
    "source": "generated",
    "description": "Used to describe a ticket to an event, a flight, a bus ride, etc.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "dateIssued",
        "type": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "description": "The date the ticket was issued.",
        "expectedTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/Ticket"
        ]
      },
      {
        "name": "issuedBy",
        "type": "https://schema.org/Organization",
        "description": "The organization issuing the item, for example a [[Permit]], [[Ticket]], or [[Certification]].",
        "expectedTypes": [
          "https://schema.org/Organization"
        ],
        "rangeTypes": [
          "https://schema.org/Organization"
        ],
        "domainTypes": [
          "https://schema.org/Certification",
          "https://schema.org/Permit",
          "https://schema.org/Ticket"
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
        "name": "ticketedSeat",
        "type": "https://schema.org/Seat",
        "description": "The seat associated with the ticket.",
        "expectedTypes": [
          "https://schema.org/Seat"
        ],
        "rangeTypes": [
          "https://schema.org/Seat"
        ],
        "domainTypes": [
          "https://schema.org/Ticket"
        ]
      },
      {
        "name": "ticketNumber",
        "type": "https://schema.org/Text",
        "description": "The unique identifier for the ticket.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Ticket"
        ]
      },
      {
        "name": "ticketToken",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "Reference to an asset (e.g., Barcode, QR code image or PDF) usable for entrance.",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Ticket"
        ]
      },
      {
        "name": "totalPrice",
        "type": [
          "https://schema.org/Number",
          "https://schema.org/PriceSpecification",
          "https://schema.org/Text"
        ],
        "description": "The total price for the reservation or ticket, including applicable taxes, shipping, etc.\\n\\nUsage guidelines:\\n\\n* Use values from 0123456789 (Unicode 'DIGIT ZERO' (U+0030) to 'DIGIT NINE' (U+0039)) rather than superficially similar Unicode symbols.\\n* Use '.' (Unicode 'FULL STOP' (U+002E)) rather than ',' to indicate a decimal point. Avoid using these symbols as a readability separator.",
        "expectedTypes": [
          "https://schema.org/Number",
          "https://schema.org/PriceSpecification",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Number",
          "https://schema.org/PriceSpecification",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Reservation",
          "https://schema.org/Ticket"
        ]
      },
      {
        "name": "underName",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "The person or organization the reservation or ticket is for.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Reservation",
          "https://schema.org/Ticket"
        ]
      }
    ]
  },
  {
    "name": "TieAction",
    "type": "https://schema.org/TieAction",
    "source": "generated",
    "description": "The act of reaching a draw in a competitive activity.",
    "parentTypes": [
      "https://schema.org/AchieveAction"
    ]
  },
  {
    "name": "TierBenefitEnumeration",
    "type": "https://schema.org/TierBenefitEnumeration",
    "source": "generated",
    "description": "An enumeration of possible benefits as part of a loyalty (members) program.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "TierBenefitLoyaltyPoints",
        "type": "https://schema.org/TierBenefitLoyaltyPoints",
        "description": "Benefit of the tier is earning of loyalty points."
      },
      {
        "name": "TierBenefitLoyaltyPrice",
        "type": "https://schema.org/TierBenefitLoyaltyPrice",
        "description": "Benefit of the tier is a members-only price."
      },
      {
        "name": "TierBenefitLoyaltyReturns",
        "type": "https://schema.org/TierBenefitLoyaltyReturns",
        "description": "Benefit of the tier is members-only returns, for example free unlimited returns."
      },
      {
        "name": "TierBenefitLoyaltyShipping",
        "type": "https://schema.org/TierBenefitLoyaltyShipping",
        "description": "Benefit of the tier is a members-only shipping price or speed (for example free shipping or 1-day shipping)."
      }
    ]
  },
  {
    "name": "Time",
    "type": "https://schema.org/Time",
    "source": "generated",
    "description": "A point in time recurring on multiple days in the form hh:mm:ss[Z|(+|-)hh:mm] (see [XML schema for details](http://www.w3.org/TR/xmlschema-2/#time))."
  },
  {
    "name": "TipAction",
    "type": "https://schema.org/TipAction",
    "source": "generated",
    "description": "The act of giving money voluntarily to a beneficiary in recognition of services rendered.",
    "parentTypes": [
      "https://schema.org/TradeAction"
    ],
    "properties": [
      {
        "name": "recipient",
        "type": [
          "https://schema.org/Audience",
          "https://schema.org/ContactPoint",
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "A sub property of participant. The participant who is at the receiving end of the action.",
        "expectedTypes": [
          "https://schema.org/Audience",
          "https://schema.org/ContactPoint",
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Audience",
          "https://schema.org/ContactPoint",
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/AuthorizeAction",
          "https://schema.org/CommunicateAction",
          "https://schema.org/DonateAction",
          "https://schema.org/GiveAction",
          "https://schema.org/Message",
          "https://schema.org/PayAction",
          "https://schema.org/ReturnAction",
          "https://schema.org/SendAction",
          "https://schema.org/TipAction"
        ]
      }
    ]
  },
  {
    "name": "TireShop",
    "type": "https://schema.org/TireShop",
    "source": "generated",
    "description": "A tire shop.",
    "parentTypes": [
      "https://schema.org/Store"
    ]
  },
  {
    "name": "TouristAttraction",
    "type": "https://schema.org/TouristAttraction",
    "source": "generated",
    "description": "A tourist attraction.  In principle any Thing can be a [[TouristAttraction]], from a [[Mountain]] and [[LandmarksOrHistoricalBuildings]] to a [[LocalBusiness]].  This Type can be used on its own to describe a general [[TouristAttraction]], or be used as an [[additionalType]] to add tourist attraction properties to any other type.  (See examples below)",
    "parentTypes": [
      "https://schema.org/Place"
    ],
    "properties": [
      {
        "name": "availableLanguage",
        "type": [
          "https://schema.org/Language",
          "https://schema.org/Text"
        ],
        "description": "A language someone may use with or at the item, service or place. Please use one of the language codes from the [IETF BCP 47 standard](http://tools.ietf.org/html/bcp47). See also [[inLanguage]].",
        "expectedTypes": [
          "https://schema.org/Language",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Language",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/ContactPoint",
          "https://schema.org/Course",
          "https://schema.org/LodgingBusiness",
          "https://schema.org/ServiceChannel",
          "https://schema.org/TouristAttraction"
        ]
      },
      {
        "name": "touristType",
        "type": [
          "https://schema.org/Audience",
          "https://schema.org/Text"
        ],
        "description": "Attraction suitable for type(s) of tourist. E.g. children, visitors from a particular country, etc. ",
        "expectedTypes": [
          "https://schema.org/Audience",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Audience",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/TouristAttraction",
          "https://schema.org/TouristDestination",
          "https://schema.org/TouristTrip"
        ]
      }
    ]
  },
  {
    "name": "TouristDestination",
    "type": "https://schema.org/TouristDestination",
    "source": "generated",
    "description": "A tourist destination. In principle any [[Place]] can be a [[TouristDestination]] from a [[City]], Region or [[Country]] to an [[AmusementPark]] or [[Hotel]]. This Type can be used on its own to describe a general [[TouristDestination]], or be used as an [[additionalType]] to add tourist relevant properties to any other [[Place]].  A [[TouristDestination]] is defined as a [[Place]] that contains, or is colocated with, one or more [[TouristAttraction]]s, often linked by a similar theme or interest to a particular [[touristType]]. The [UNWTO](http://www2.unwto.org/) defines Destination (main destination of a tourism trip) as the place visited that is central to the decision to take the trip.\n  (See examples below.)",
    "parentTypes": [
      "https://schema.org/Place"
    ],
    "properties": [
      {
        "name": "includesAttraction",
        "type": "https://schema.org/TouristAttraction",
        "description": "Attraction located at destination.",
        "expectedTypes": [
          "https://schema.org/TouristAttraction"
        ],
        "rangeTypes": [
          "https://schema.org/TouristAttraction"
        ],
        "domainTypes": [
          "https://schema.org/TouristDestination"
        ]
      },
      {
        "name": "touristType",
        "type": [
          "https://schema.org/Audience",
          "https://schema.org/Text"
        ],
        "description": "Attraction suitable for type(s) of tourist. E.g. children, visitors from a particular country, etc. ",
        "expectedTypes": [
          "https://schema.org/Audience",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Audience",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/TouristAttraction",
          "https://schema.org/TouristDestination",
          "https://schema.org/TouristTrip"
        ]
      }
    ]
  },
  {
    "name": "TouristInformationCenter",
    "type": "https://schema.org/TouristInformationCenter",
    "source": "generated",
    "description": "A tourist information center.",
    "parentTypes": [
      "https://schema.org/LocalBusiness"
    ]
  },
  {
    "name": "TouristTrip",
    "type": "https://schema.org/TouristTrip",
    "source": "generated",
    "description": "A tourist trip. A created itinerary of visits to one or more places of interest ([[TouristAttraction]]/[[TouristDestination]]) often linked by a similar theme, geographic area, or interest to a particular [[touristType]]. The [UNWTO](http://www2.unwto.org/) defines tourism trip as the Trip taken by visitors.\n  (See examples below.)",
    "parentTypes": [
      "https://schema.org/Trip"
    ],
    "properties": [
      {
        "name": "touristType",
        "type": [
          "https://schema.org/Audience",
          "https://schema.org/Text"
        ],
        "description": "Attraction suitable for type(s) of tourist. E.g. children, visitors from a particular country, etc. ",
        "expectedTypes": [
          "https://schema.org/Audience",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Audience",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/TouristAttraction",
          "https://schema.org/TouristDestination",
          "https://schema.org/TouristTrip"
        ]
      }
    ]
  },
  {
    "name": "ToyStore",
    "type": "https://schema.org/ToyStore",
    "source": "generated",
    "description": "A toy store.",
    "parentTypes": [
      "https://schema.org/Store"
    ]
  },
  {
    "name": "TrackAction",
    "type": "https://schema.org/TrackAction",
    "source": "generated",
    "description": "An agent tracks an object for updates.\\n\\nRelated actions:\\n\\n* [[FollowAction]]: Unlike FollowAction, TrackAction refers to the interest on the location of innanimates objects.\\n* [[SubscribeAction]]: Unlike SubscribeAction, TrackAction refers to  the interest on the location of innanimate objects.",
    "parentTypes": [
      "https://schema.org/FindAction"
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
      }
    ]
  },
  {
    "name": "TradeAction",
    "type": "https://schema.org/TradeAction",
    "source": "generated",
    "description": "The act of participating in an exchange of goods and services for monetary compensation. An agent trades an object, product or service with a participant in exchange for a one time or periodic payment.",
    "parentTypes": [
      "https://schema.org/Action"
    ],
    "properties": [
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
        "name": "priceSpecification",
        "type": "https://schema.org/PriceSpecification",
        "description": "One or more detailed price specifications, indicating the unit price and delivery or payment charges.",
        "expectedTypes": [
          "https://schema.org/PriceSpecification"
        ],
        "rangeTypes": [
          "https://schema.org/PriceSpecification"
        ],
        "domainTypes": [
          "https://schema.org/Demand",
          "https://schema.org/DonateAction",
          "https://schema.org/Offer",
          "https://schema.org/TradeAction"
        ]
      }
    ]
  },
  {
    "name": "TradeAddress",
    "type": "http://unece.org/vocab#TradeAddress",
    "source": "generated"
  },
  {
    "name": "TradeProduct",
    "type": "http://unece.org/vocab#TradeProduct",
    "source": "generated"
  },
  {
    "name": "TrainReservation",
    "type": "https://schema.org/TrainReservation",
    "source": "generated",
    "description": "A reservation for train travel.\\n\\nNote: This type is for information about actual reservations, e.g. in confirmation emails or HTML pages with individual confirmations of reservations. For offers of tickets, use [[Offer]].",
    "parentTypes": [
      "https://schema.org/Reservation"
    ]
  },
  {
    "name": "TrainStation",
    "type": "https://schema.org/TrainStation",
    "source": "generated",
    "description": "A train station.",
    "parentTypes": [
      "https://schema.org/CivicStructure"
    ]
  },
  {
    "name": "TrainTrip",
    "type": "https://schema.org/TrainTrip",
    "source": "generated",
    "description": "A trip on a commercial train line.",
    "parentTypes": [
      "https://schema.org/Trip"
    ],
    "properties": [
      {
        "name": "arrivalPlatform",
        "type": "https://schema.org/Text",
        "description": "The platform where the train arrives.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/TrainTrip"
        ]
      },
      {
        "name": "arrivalStation",
        "type": "https://schema.org/TrainStation",
        "description": "The station where the train trip ends.",
        "expectedTypes": [
          "https://schema.org/TrainStation"
        ],
        "rangeTypes": [
          "https://schema.org/TrainStation"
        ],
        "domainTypes": [
          "https://schema.org/TrainTrip"
        ]
      },
      {
        "name": "departurePlatform",
        "type": "https://schema.org/Text",
        "description": "The platform from which the train departs.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/TrainTrip"
        ]
      },
      {
        "name": "departureStation",
        "type": "https://schema.org/TrainStation",
        "description": "The station from which the train departs.",
        "expectedTypes": [
          "https://schema.org/TrainStation"
        ],
        "rangeTypes": [
          "https://schema.org/TrainStation"
        ],
        "domainTypes": [
          "https://schema.org/TrainTrip"
        ]
      },
      {
        "name": "trainName",
        "type": "https://schema.org/Text",
        "description": "The name of the train (e.g. The Orient Express).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/TrainTrip"
        ]
      },
      {
        "name": "trainNumber",
        "type": "https://schema.org/Text",
        "description": "The unique identifier for the train.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/TrainTrip"
        ]
      }
    ]
  },
  {
    "name": "TransferAction",
    "type": "https://schema.org/TransferAction",
    "source": "generated",
    "description": "The act of transferring/moving (abstract or concrete) animate or inanimate objects from one place to another.",
    "parentTypes": [
      "https://schema.org/Action"
    ],
    "properties": [
      {
        "name": "fromLocation",
        "type": "https://schema.org/Place",
        "description": "A sub property of location. The original location of the object or the agent before the action.",
        "expectedTypes": [
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/ExerciseAction",
          "https://schema.org/MoveAction",
          "https://schema.org/TransferAction"
        ]
      },
      {
        "name": "toLocation",
        "type": "https://schema.org/Place",
        "description": "A sub property of location. The final location of the object or the agent after the action.",
        "expectedTypes": [
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/ExerciseAction",
          "https://schema.org/InsertAction",
          "https://schema.org/MoveAction",
          "https://schema.org/TransferAction"
        ]
      }
    ]
  },
  {
    "name": "TransportMethod",
    "type": "http://unece.org/vocab#TransportMethod",
    "source": "generated"
  },
  {
    "name": "TravelAction",
    "type": "https://schema.org/TravelAction",
    "source": "generated",
    "description": "The act of traveling from a fromLocation to a destination by a specified mode of transport, optionally with participants.",
    "parentTypes": [
      "https://schema.org/MoveAction"
    ],
    "properties": [
      {
        "name": "distance",
        "type": "https://schema.org/Distance",
        "description": "The distance travelled, e.g. exercising or travelling.",
        "expectedTypes": [
          "https://schema.org/Distance"
        ],
        "rangeTypes": [
          "https://schema.org/Distance"
        ],
        "domainTypes": [
          "https://schema.org/ExerciseAction",
          "https://schema.org/TravelAction"
        ]
      }
    ]
  },
  {
    "name": "TravelAgency",
    "type": "https://schema.org/TravelAgency",
    "source": "generated",
    "description": "A travel agency.",
    "parentTypes": [
      "https://schema.org/LocalBusiness"
    ]
  },
  {
    "name": "TreatmentIndication",
    "type": "https://schema.org/TreatmentIndication",
    "source": "generated",
    "description": "An indication for treating an underlying condition, symptom, etc.",
    "parentTypes": [
      "https://schema.org/MedicalIndication"
    ]
  },
  {
    "name": "Trip",
    "type": "https://schema.org/Trip",
    "source": "generated",
    "description": "A trip or journey. An itinerary of visits to one or more places.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "arrivalTime",
        "type": [
          "https://schema.org/DateTime",
          "https://schema.org/Time"
        ],
        "description": "The expected arrival time.",
        "expectedTypes": [
          "https://schema.org/DateTime",
          "https://schema.org/Time"
        ],
        "rangeTypes": [
          "https://schema.org/DateTime",
          "https://schema.org/Time"
        ],
        "domainTypes": [
          "https://schema.org/Trip"
        ]
      },
      {
        "name": "departureTime",
        "type": [
          "https://schema.org/DateTime",
          "https://schema.org/Time"
        ],
        "description": "The expected departure time.",
        "expectedTypes": [
          "https://schema.org/DateTime",
          "https://schema.org/Time"
        ],
        "rangeTypes": [
          "https://schema.org/DateTime",
          "https://schema.org/Time"
        ],
        "domainTypes": [
          "https://schema.org/Trip"
        ]
      },
      {
        "name": "itinerary",
        "type": [
          "https://schema.org/ItemList",
          "https://schema.org/Place"
        ],
        "description": "Destination(s) ( [[Place]] ) that make up a trip. For a trip where destination order is important use [[ItemList]] to specify that order (see examples).",
        "expectedTypes": [
          "https://schema.org/ItemList",
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/ItemList",
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/Trip"
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
        "name": "partOfTrip",
        "type": "https://schema.org/Trip",
        "description": "Identifies that this [[Trip]] is a subTrip of another Trip.  For example Day 1, Day 2, etc. of a multi-day trip.",
        "expectedTypes": [
          "https://schema.org/Trip"
        ],
        "rangeTypes": [
          "https://schema.org/Trip"
        ],
        "domainTypes": [
          "https://schema.org/Trip"
        ],
        "inverseOf": "https://schema.org/subTrip"
      },
      {
        "name": "provider",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "The service provider, service operator, or service performer; the goods producer. Another party (a seller) may offer those services or goods on behalf of the provider. A provider may also serve as the seller.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Action",
          "https://schema.org/CreativeWork",
          "https://schema.org/EducationalOccupationalProgram",
          "https://schema.org/FinancialIncentive",
          "https://schema.org/Invoice",
          "https://schema.org/OfferShippingDetails",
          "https://schema.org/ParcelDelivery",
          "https://schema.org/Reservation",
          "https://schema.org/Service",
          "https://schema.org/Trip"
        ]
      },
      {
        "name": "subTrip",
        "type": "https://schema.org/Trip",
        "description": "Identifies a [[Trip]] that is a subTrip of this Trip.  For example Day 1, Day 2, etc. of a multi-day trip.",
        "expectedTypes": [
          "https://schema.org/Trip"
        ],
        "rangeTypes": [
          "https://schema.org/Trip"
        ],
        "domainTypes": [
          "https://schema.org/Trip"
        ],
        "inverseOf": "https://schema.org/partOfTrip"
      },
      {
        "name": "tripOrigin",
        "type": "https://schema.org/Place",
        "description": "The location of origin of the trip, prior to any destination(s).",
        "expectedTypes": [
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/Trip"
        ]
      }
    ]
  },
  {
    "name": "TVClip",
    "type": "https://schema.org/TVClip",
    "source": "generated",
    "description": "A short TV program or a segment/part of a TV program.",
    "parentTypes": [
      "https://schema.org/Clip"
    ],
    "properties": [
      {
        "name": "partOfTVSeries",
        "type": "https://schema.org/TVSeries",
        "description": "The TV series to which this episode or season belongs.",
        "expectedTypes": [
          "https://schema.org/TVSeries"
        ],
        "rangeTypes": [
          "https://schema.org/TVSeries"
        ],
        "domainTypes": [
          "https://schema.org/TVClip",
          "https://schema.org/TVEpisode",
          "https://schema.org/TVSeason"
        ],
        "supersededBy": "https://schema.org/partOfSeries"
      }
    ]
  },
  {
    "name": "TVEpisode",
    "type": "https://schema.org/TVEpisode",
    "source": "generated",
    "description": "A TV episode which can be part of a series or season.",
    "parentTypes": [
      "https://schema.org/Episode"
    ],
    "properties": [
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
        "name": "partOfTVSeries",
        "type": "https://schema.org/TVSeries",
        "description": "The TV series to which this episode or season belongs.",
        "expectedTypes": [
          "https://schema.org/TVSeries"
        ],
        "rangeTypes": [
          "https://schema.org/TVSeries"
        ],
        "domainTypes": [
          "https://schema.org/TVClip",
          "https://schema.org/TVEpisode",
          "https://schema.org/TVSeason"
        ],
        "supersededBy": "https://schema.org/partOfSeries"
      },
      {
        "name": "subtitleLanguage",
        "type": [
          "https://schema.org/Language",
          "https://schema.org/Text"
        ],
        "description": "Languages in which subtitles/captions are available, in [IETF BCP 47 standard format](http://tools.ietf.org/html/bcp47).",
        "expectedTypes": [
          "https://schema.org/Language",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Language",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/BroadcastEvent",
          "https://schema.org/Movie",
          "https://schema.org/ScreeningEvent",
          "https://schema.org/TVEpisode"
        ]
      },
      {
        "name": "titleEIDR",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "An [EIDR](https://eidr.org/) (Entertainment Identifier Registry) [[identifier]] representing at the most general/abstract level, a work of film or television.\n\nFor example, the motion picture known as \"Ghostbusters\" has a titleEIDR of  \"10.5240/7EC7-228A-510A-053E-CBB8-J\". This title (or work) may have several variants, which EIDR calls \"edits\". See [[editEIDR]].\n\nSince schema.org types like [[Movie]], [[TVEpisode]], [[TVSeason]], and [[TVSeries]] can be used for both works and their multiple expressions, it is possible to use [[titleEIDR]] alone (for a general description), or alongside [[editEIDR]] for a more edit-specific description.\n",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Movie",
          "https://schema.org/TVEpisode",
          "https://schema.org/TVSeason",
          "https://schema.org/TVSeries"
        ]
      }
    ]
  },
  {
    "name": "TVSeason",
    "type": "https://schema.org/TVSeason",
    "source": "generated",
    "description": "Season dedicated to TV broadcast and associated online delivery.",
    "parentTypes": [
      "https://schema.org/CreativeWork",
      "https://schema.org/CreativeWorkSeason"
    ],
    "properties": [
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
        "name": "partOfTVSeries",
        "type": "https://schema.org/TVSeries",
        "description": "The TV series to which this episode or season belongs.",
        "expectedTypes": [
          "https://schema.org/TVSeries"
        ],
        "rangeTypes": [
          "https://schema.org/TVSeries"
        ],
        "domainTypes": [
          "https://schema.org/TVClip",
          "https://schema.org/TVEpisode",
          "https://schema.org/TVSeason"
        ],
        "supersededBy": "https://schema.org/partOfSeries"
      },
      {
        "name": "titleEIDR",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "An [EIDR](https://eidr.org/) (Entertainment Identifier Registry) [[identifier]] representing at the most general/abstract level, a work of film or television.\n\nFor example, the motion picture known as \"Ghostbusters\" has a titleEIDR of  \"10.5240/7EC7-228A-510A-053E-CBB8-J\". This title (or work) may have several variants, which EIDR calls \"edits\". See [[editEIDR]].\n\nSince schema.org types like [[Movie]], [[TVEpisode]], [[TVSeason]], and [[TVSeries]] can be used for both works and their multiple expressions, it is possible to use [[titleEIDR]] alone (for a general description), or alongside [[editEIDR]] for a more edit-specific description.\n",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Movie",
          "https://schema.org/TVEpisode",
          "https://schema.org/TVSeason",
          "https://schema.org/TVSeries"
        ]
      }
    ]
  },
  {
    "name": "TVSeries",
    "type": "https://schema.org/TVSeries",
    "source": "generated",
    "description": "CreativeWorkSeries dedicated to TV broadcast and associated online delivery.",
    "parentTypes": [
      "https://schema.org/CreativeWork",
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
        "name": "titleEIDR",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "An [EIDR](https://eidr.org/) (Entertainment Identifier Registry) [[identifier]] representing at the most general/abstract level, a work of film or television.\n\nFor example, the motion picture known as \"Ghostbusters\" has a titleEIDR of  \"10.5240/7EC7-228A-510A-053E-CBB8-J\". This title (or work) may have several variants, which EIDR calls \"edits\". See [[editEIDR]].\n\nSince schema.org types like [[Movie]], [[TVEpisode]], [[TVSeason]], and [[TVSeries]] can be used for both works and their multiple expressions, it is possible to use [[titleEIDR]] alone (for a general description), or alongside [[editEIDR]] for a more edit-specific description.\n",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Movie",
          "https://schema.org/TVEpisode",
          "https://schema.org/TVSeason",
          "https://schema.org/TVSeries"
        ]
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
    "name": "TypeAndQuantityNode",
    "type": "https://schema.org/TypeAndQuantityNode",
    "source": "generated",
    "description": "A structured value indicating the quantity, unit of measurement, and business function of goods included in a bundle offer.",
    "parentTypes": [
      "https://schema.org/StructuredValue"
    ],
    "properties": [
      {
        "name": "amountOfThisGood",
        "type": "https://schema.org/Number",
        "description": "The quantity of the goods included in the offer.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/TypeAndQuantityNode"
        ]
      },
      {
        "name": "businessFunction",
        "type": "https://schema.org/BusinessFunction",
        "description": "The business function (e.g. sell, lease, repair, dispose) of the offer or component of a bundle (TypeAndQuantityNode). The default is http://purl.org/goodrelations/v1#Sell.",
        "expectedTypes": [
          "https://schema.org/BusinessFunction"
        ],
        "rangeTypes": [
          "https://schema.org/BusinessFunction"
        ],
        "domainTypes": [
          "https://schema.org/Demand",
          "https://schema.org/Offer",
          "https://schema.org/TypeAndQuantityNode"
        ]
      },
      {
        "name": "typeOfGood",
        "type": [
          "https://schema.org/Product",
          "https://schema.org/Service"
        ],
        "description": "The product that this structured value is referring to.",
        "expectedTypes": [
          "https://schema.org/Product",
          "https://schema.org/Service"
        ],
        "rangeTypes": [
          "https://schema.org/Product",
          "https://schema.org/Service"
        ],
        "domainTypes": [
          "https://schema.org/OwnershipInfo",
          "https://schema.org/TypeAndQuantityNode"
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
      }
    ]
  },
  {
    "name": "UKNonprofitType",
    "type": "https://schema.org/UKNonprofitType",
    "source": "generated",
    "description": "UKNonprofitType: Non-profit organization type originating from the United Kingdom.",
    "parentTypes": [
      "https://schema.org/NonprofitType"
    ],
    "enumerationValues": [
      {
        "name": "CharitableIncorporatedOrganization",
        "type": "https://schema.org/CharitableIncorporatedOrganization",
        "description": "CharitableIncorporatedOrganization: Non-profit type referring to a Charitable Incorporated Organization (UK)."
      },
      {
        "name": "LimitedByGuaranteeCharity",
        "type": "https://schema.org/LimitedByGuaranteeCharity",
        "description": "LimitedByGuaranteeCharity: Non-profit type referring to a charitable company that is limited by guarantee (UK)."
      },
      {
        "name": "UKTrust",
        "type": "https://schema.org/UKTrust",
        "description": "UKTrust: Non-profit type referring to a UK trust."
      },
      {
        "name": "UnincorporatedAssociationCharity",
        "type": "https://schema.org/UnincorporatedAssociationCharity",
        "description": "UnincorporatedAssociationCharity: Non-profit type referring to a charitable company that is not incorporated (UK)."
      }
    ]
  },
  {
    "name": "UnitPriceSpecification",
    "type": "https://schema.org/UnitPriceSpecification",
    "source": "generated",
    "description": "The price asked for a given offer by the respective organization or person.",
    "parentTypes": [
      "https://schema.org/PriceSpecification"
    ],
    "properties": [
      {
        "name": "billingDuration",
        "type": [
          "https://schema.org/Duration",
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "description": "Specifies for how long this price (or price component) will be billed. Can be used, for example, to model the contractual duration of a subscription or payment plan. Type can be either a Duration or a Number (in which case the unit of measurement, for example month, is specified by the unitCode property).",
        "expectedTypes": [
          "https://schema.org/Duration",
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/Duration",
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/UnitPriceSpecification"
        ]
      },
      {
        "name": "billingIncrement",
        "type": "https://schema.org/Number",
        "description": "This property specifies the minimal quantity and rounding increment that will be the basis for the billing. The unit of measurement is specified by the unitCode property.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/UnitPriceSpecification"
        ]
      },
      {
        "name": "billingStart",
        "type": "https://schema.org/Number",
        "description": "Specifies after how much time this price (or price component) becomes valid and billing starts. Can be used, for example, to model a price increase after the first year of a subscription. The unit of measurement is specified by the unitCode property.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/UnitPriceSpecification"
        ]
      },
      {
        "name": "priceComponentType",
        "type": "https://schema.org/PriceComponentTypeEnumeration",
        "description": "Identifies a price component (for example, a line item on an invoice), part of the total price for an offer.",
        "expectedTypes": [
          "https://schema.org/PriceComponentTypeEnumeration"
        ],
        "rangeTypes": [
          "https://schema.org/PriceComponentTypeEnumeration"
        ],
        "domainTypes": [
          "https://schema.org/UnitPriceSpecification"
        ]
      },
      {
        "name": "priceType",
        "type": [
          "https://schema.org/PriceTypeEnumeration",
          "https://schema.org/Text"
        ],
        "description": "Defines the type of a price specified for an offered product, for example a list price, a (temporary) sale price or a manufacturer suggested retail price. If multiple prices are specified for an offer the [[priceType]] property can be used to identify the type of each such specified price. The value of priceType can be specified as a value from enumeration PriceTypeEnumeration or, a UN/EDIFACT 5387 code, or as a free form text string for price types that are not already predefined in PriceTypeEnumeration.",
        "expectedTypes": [
          "https://schema.org/PriceTypeEnumeration",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/PriceTypeEnumeration",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/CompoundPriceSpecification",
          "https://schema.org/UnitPriceSpecification"
        ]
      },
      {
        "name": "referenceQuantity",
        "type": "https://schema.org/QuantitativeValue",
        "description": "The reference quantity for which a certain price applies, e.g. 1 EUR per 4 kWh of electricity. This property is a replacement for unitOfMeasurement for the advanced cases where the price does not relate to a standard unit.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/UnitPriceSpecification"
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
      }
    ]
  },
  {
    "name": "UnRegisterAction",
    "type": "https://schema.org/UnRegisterAction",
    "source": "generated",
    "description": "The act of un-registering from a service.\\n\\nRelated actions:\\n\\n* [[RegisterAction]]: antonym of UnRegisterAction.\\n* [[LeaveAction]]: Unlike LeaveAction, UnRegisterAction implies that you are unregistering from a service you were previously registered, rather than leaving a team/group of people.",
    "parentTypes": [
      "https://schema.org/InteractAction"
    ]
  },
  {
    "name": "UpdateAction",
    "type": "https://schema.org/UpdateAction",
    "source": "generated",
    "description": "The act of managing by changing/editing the state of the object.",
    "parentTypes": [
      "https://schema.org/Action"
    ],
    "properties": [
      {
        "name": "collection",
        "type": "https://schema.org/Thing",
        "description": "A sub property of object. The collection target of the action.",
        "expectedTypes": [
          "https://schema.org/Thing"
        ],
        "rangeTypes": [
          "https://schema.org/Thing"
        ],
        "domainTypes": [
          "https://schema.org/UpdateAction"
        ],
        "supersededBy": "https://schema.org/targetCollection"
      },
      {
        "name": "targetCollection",
        "type": "https://schema.org/Thing",
        "description": "A sub property of object. The collection target of the action.",
        "expectedTypes": [
          "https://schema.org/Thing"
        ],
        "rangeTypes": [
          "https://schema.org/Thing"
        ],
        "domainTypes": [
          "https://schema.org/UpdateAction"
        ]
      }
    ]
  },
  {
    "name": "URL",
    "type": "https://schema.org/URL",
    "source": "generated",
    "description": "Data type: URL.",
    "parentTypes": [
      "https://schema.org/Text"
    ]
  },
  {
    "name": "UseAction",
    "type": "https://schema.org/UseAction",
    "source": "generated",
    "description": "The act of applying an object to its intended purpose.",
    "parentTypes": [
      "https://schema.org/ConsumeAction"
    ]
  },
  {
    "name": "UserBlocks",
    "type": "https://schema.org/UserBlocks",
    "source": "generated",
    "description": "UserInteraction and its subtypes is an old way of talking about users interacting with pages. It is generally better to use [[Action]]-based vocabulary, alongside types such as [[Comment]].",
    "parentTypes": [
      "https://schema.org/UserInteraction"
    ]
  },
  {
    "name": "UserCheckins",
    "type": "https://schema.org/UserCheckins",
    "source": "generated",
    "description": "UserInteraction and its subtypes is an old way of talking about users interacting with pages. It is generally better to use [[Action]]-based vocabulary, alongside types such as [[Comment]].",
    "parentTypes": [
      "https://schema.org/UserInteraction"
    ]
  }
] satisfies readonly SchemaDefinition[];
