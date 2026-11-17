/*
 * This file is generated. Do not edit manually.
 * Schema.org version: 30.1
 * Source SHA-256: 0a4b8c4c910fc831ec8695196510973390906a5ee34dc6b862dfec4d21a12f74
 */

import type { SchemaDefinition } from "../../types";

export const generatedSchemaDefinitions0: readonly SchemaDefinition[] =
[
  {
    "name": "105590001",
    "type": "http://purl.bioontology.org/ontology/SNOMEDCT/105590001",
    "source": "generated"
  },
  {
    "name": "116154003",
    "type": "http://purl.bioontology.org/ontology/SNOMEDCT/116154003",
    "source": "generated"
  },
  {
    "name": "277132007",
    "type": "http://purl.bioontology.org/ontology/SNOMEDCT/277132007",
    "source": "generated"
  },
  {
    "name": "387713003",
    "type": "http://purl.bioontology.org/ontology/SNOMEDCT/387713003",
    "source": "generated"
  },
  {
    "name": "3DModel",
    "type": "https://schema.org/3DModel",
    "source": "generated",
    "description": "A 3D model represents some kind of 3D content, which may have [[encoding]]s in one or more [[MediaObject]]s. Many 3D formats are available (e.g. see [Wikipedia](https://en.wikipedia.org/wiki/Category:3D_graphics_file_formats)); specific encoding formats can be represented using the [[encodingFormat]] property applied to the relevant [[MediaObject]]. For the\ncase of a single file published after Zip compression, the convention of appending '+zip' to the [[encodingFormat]] can be used. Geospatial, AR/VR, artistic/animation, gaming, engineering and scientific content can all be represented using [[3DModel]].",
    "parentTypes": [
      "https://schema.org/MediaObject"
    ],
    "properties": [
      {
        "name": "isResizable",
        "type": "https://schema.org/Boolean",
        "description": "Whether the 3DModel allows resizing. For example, room layout applications often do not allow 3DModel elements to be resized to reflect reality.",
        "expectedTypes": [
          "https://schema.org/Boolean"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean"
        ],
        "domainTypes": [
          "https://schema.org/3DModel"
        ]
      }
    ]
  },
  {
    "name": "410942007",
    "type": "http://purl.bioontology.org/ontology/SNOMEDCT/410942007",
    "source": "generated"
  },
  {
    "name": "50731006",
    "type": "http://purl.bioontology.org/ontology/SNOMEDCT/50731006",
    "source": "generated"
  },
  {
    "name": "51114001",
    "type": "http://purl.bioontology.org/ontology/SNOMEDCT/51114001",
    "source": "generated"
  },
  {
    "name": "63653004",
    "type": "http://purl.bioontology.org/ontology/SNOMEDCT/63653004",
    "source": "generated"
  },
  {
    "name": "AboutPage",
    "type": "https://schema.org/AboutPage",
    "source": "generated",
    "description": "Web page type: About page.",
    "parentTypes": [
      "https://schema.org/WebPage"
    ]
  },
  {
    "name": "AcceptAction",
    "type": "https://schema.org/AcceptAction",
    "source": "generated",
    "description": "The act of committing to/adopting an object.\\n\\nRelated actions:\\n\\n* [[RejectAction]]: The antonym of AcceptAction.",
    "parentTypes": [
      "https://schema.org/AllocateAction"
    ]
  },
  {
    "name": "Accommodation",
    "type": "https://schema.org/Accommodation",
    "source": "generated",
    "description": "An accommodation is a place that can accommodate human beings, e.g. a hotel room, a camping pitch, or a meeting room. Many accommodations are for overnight stays, but this is not a mandatory requirement.\nFor more specific types of accommodations not defined in schema.org, one can use [[additionalType]] with external vocabularies.\n<br /><br />\nSee also the <a href=\"/docs/hotels.html\">dedicated document on the use of schema.org for marking up hotels and other forms of accommodations</a>.\n",
    "parentTypes": [
      "https://schema.org/Place"
    ],
    "properties": [
      {
        "name": "accommodationCategory",
        "type": "https://schema.org/Text",
        "description": "Category of an [[Accommodation]], following real estate conventions, e.g. RESO (see [PropertySubType](https://ddwiki.reso.org/display/DDW17/PropertySubType+Field), and [PropertyType](https://ddwiki.reso.org/display/DDW17/PropertyType+Field) fields  for suggested values).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Accommodation"
        ]
      },
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
      },
      {
        "name": "floorSize",
        "type": "https://schema.org/QuantitativeValue",
        "description": "The size of the accommodation, e.g. in square meter or squarefoot.\nTypical unit code(s): MTK for square meter, FTK for square foot, or YDK for square yard.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/Accommodation",
          "https://schema.org/FloorPlan"
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
      },
      {
        "name": "numberOfBathroomsTotal",
        "type": "https://schema.org/Integer",
        "description": "The total integer number of bathrooms in some [[Accommodation]], following real estate conventions as [documented in RESO](https://ddwiki.reso.org/display/DDW17/BathroomsTotalInteger+Field): \"The simple sum of the number of bathrooms. For example for a property with two Full Bathrooms and one Half Bathroom, the Bathrooms Total Integer will be 3.\". See also [[numberOfRooms]].",
        "expectedTypes": [
          "https://schema.org/Integer"
        ],
        "rangeTypes": [
          "https://schema.org/Integer"
        ],
        "domainTypes": [
          "https://schema.org/Accommodation",
          "https://schema.org/FloorPlan"
        ]
      },
      {
        "name": "numberOfBedrooms",
        "type": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "description": "The total integer number of bedrooms in a some [[Accommodation]], [[ApartmentComplex]] or [[FloorPlan]].",
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
          "https://schema.org/ApartmentComplex",
          "https://schema.org/FloorPlan"
        ]
      },
      {
        "name": "numberOfFullBathrooms",
        "type": "https://schema.org/Number",
        "description": "Number of full bathrooms - The total number of full and ¾ bathrooms in an [[Accommodation]]. This corresponds to the [BathroomsFull field in RESO](https://ddwiki.reso.org/display/DDW17/BathroomsFull+Field).",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/Accommodation",
          "https://schema.org/FloorPlan"
        ]
      },
      {
        "name": "numberOfPartialBathrooms",
        "type": "https://schema.org/Number",
        "description": "Number of partial bathrooms - The total number of half and ¼ bathrooms in an [[Accommodation]]. This corresponds to the [BathroomsPartial field in RESO](https://ddwiki.reso.org/display/DDW17/BathroomsPartial+Field). ",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/Accommodation",
          "https://schema.org/FloorPlan"
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
      },
      {
        "name": "permittedUsage",
        "type": "https://schema.org/Text",
        "description": "Indications regarding the permitted usage of the accommodation.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Accommodation"
        ]
      },
      {
        "name": "petsAllowed",
        "type": [
          "https://schema.org/Boolean",
          "https://schema.org/Text"
        ],
        "description": "Indicates whether pets are allowed to enter the accommodation or lodging business. More detailed information can be put in a text value.",
        "expectedTypes": [
          "https://schema.org/Boolean",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Accommodation",
          "https://schema.org/ApartmentComplex",
          "https://schema.org/FloorPlan",
          "https://schema.org/LodgingBusiness"
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
      },
      {
        "name": "yearBuilt",
        "type": "https://schema.org/Number",
        "description": "The year an [[Accommodation]] was constructed. This corresponds to the [YearBuilt field in RESO](https://ddwiki.reso.org/display/DDW17/YearBuilt+Field). ",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/Accommodation"
        ]
      }
    ]
  },
  {
    "name": "AccountingService",
    "type": "https://schema.org/AccountingService",
    "source": "generated",
    "description": "Accountancy business.\\n\\nAs a [[LocalBusiness]] it can be described as a [[provider]] of one or more [[Service]]\\(s).\n      ",
    "parentTypes": [
      "https://schema.org/FinancialService"
    ]
  },
  {
    "name": "AchieveAction",
    "type": "https://schema.org/AchieveAction",
    "source": "generated",
    "description": "The act of accomplishing something via previous efforts. It is an instantaneous action rather than an ongoing process.",
    "parentTypes": [
      "https://schema.org/Action"
    ]
  },
  {
    "name": "Action",
    "type": "https://schema.org/Action",
    "source": "generated",
    "description": "An action performed by a direct agent and indirect participants upon a direct object. Optionally happens at a location with the help of an inanimate instrument. The execution of the action may produce a result. Specific action sub-type documentation specifies the exact expectation of each argument/role.\\n\\nSee also [blog post](https://blog.schema.org/2014/04/16/announcing-schema-org-actions/) and [Actions overview document](https://schema.org/docs/actions.html).",
    "parentTypes": [
      "https://schema.org/Thing"
    ],
    "properties": [
      {
        "name": "actionProcess",
        "type": "https://schema.org/HowTo",
        "description": "Description of the process by which the action was performed.",
        "expectedTypes": [
          "https://schema.org/HowTo"
        ],
        "rangeTypes": [
          "https://schema.org/HowTo"
        ],
        "domainTypes": [
          "https://schema.org/Action"
        ]
      },
      {
        "name": "actionStatus",
        "type": "https://schema.org/ActionStatusType",
        "description": "Indicates the current disposition of the Action.",
        "expectedTypes": [
          "https://schema.org/ActionStatusType"
        ],
        "rangeTypes": [
          "https://schema.org/ActionStatusType"
        ],
        "domainTypes": [
          "https://schema.org/Action"
        ]
      },
      {
        "name": "agent",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "The direct performer or driver of the action (animate or inanimate). E.g. *John* wrote a book.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Action"
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
        "name": "error",
        "type": "https://schema.org/Thing",
        "description": "For failed actions, more information on the cause of the failure. Consider using the Error type.",
        "expectedTypes": [
          "https://schema.org/Thing"
        ],
        "rangeTypes": [
          "https://schema.org/Thing"
        ],
        "domainTypes": [
          "https://schema.org/Action"
        ]
      },
      {
        "name": "instrument",
        "type": "https://schema.org/Thing",
        "description": "The object that helped the agent perform the action. E.g. John wrote a book with *a pen*.",
        "expectedTypes": [
          "https://schema.org/Thing"
        ],
        "rangeTypes": [
          "https://schema.org/Thing"
        ],
        "domainTypes": [
          "https://schema.org/Action"
        ]
      },
      {
        "name": "location",
        "type": [
          "https://schema.org/Place",
          "https://schema.org/PostalAddress",
          "https://schema.org/Text",
          "https://schema.org/VirtualLocation"
        ],
        "description": "The location of, for example, where an event is happening, where an organization is located, or where an action takes place.",
        "expectedTypes": [
          "https://schema.org/Place",
          "https://schema.org/PostalAddress",
          "https://schema.org/Text",
          "https://schema.org/VirtualLocation"
        ],
        "rangeTypes": [
          "https://schema.org/Place",
          "https://schema.org/PostalAddress",
          "https://schema.org/Text",
          "https://schema.org/VirtualLocation"
        ],
        "domainTypes": [
          "https://schema.org/Action",
          "https://schema.org/Event",
          "https://schema.org/InteractionCounter",
          "https://schema.org/Organization"
        ]
      },
      {
        "name": "object",
        "type": "https://schema.org/Thing",
        "description": "The object upon which the action is carried out, whose state is kept intact or changed. Also known as the semantic roles patient, affected or undergoer (which change their state) or theme (which doesn't). E.g. John read *a book*.",
        "expectedTypes": [
          "https://schema.org/Thing"
        ],
        "rangeTypes": [
          "https://schema.org/Thing"
        ],
        "domainTypes": [
          "https://schema.org/Action"
        ]
      },
      {
        "name": "participant",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "Other co-agents that participated in the action indirectly. E.g. John wrote a book with *Steve*.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Action"
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
        "name": "result",
        "type": "https://schema.org/Thing",
        "description": "The result produced in the action. E.g. John wrote *a book*.",
        "expectedTypes": [
          "https://schema.org/Thing"
        ],
        "rangeTypes": [
          "https://schema.org/Thing"
        ],
        "domainTypes": [
          "https://schema.org/Action"
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
      },
      {
        "name": "target",
        "type": [
          "https://schema.org/EntryPoint",
          "https://schema.org/URL"
        ],
        "description": "Indicates a target EntryPoint, or url, for an Action.",
        "expectedTypes": [
          "https://schema.org/EntryPoint",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/EntryPoint",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Action"
        ]
      }
    ]
  },
  {
    "name": "ActionAccessSpecification",
    "type": "https://schema.org/ActionAccessSpecification",
    "source": "generated",
    "description": "A set of requirements that must be fulfilled in order to perform an Action.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "availabilityEnds",
        "type": [
          "https://schema.org/Date",
          "https://schema.org/DateTime",
          "https://schema.org/Time"
        ],
        "description": "The end of the availability of the product or service included in the offer.",
        "expectedTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime",
          "https://schema.org/Time"
        ],
        "rangeTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime",
          "https://schema.org/Time"
        ],
        "domainTypes": [
          "https://schema.org/ActionAccessSpecification",
          "https://schema.org/Demand",
          "https://schema.org/Offer"
        ]
      },
      {
        "name": "availabilityStarts",
        "type": [
          "https://schema.org/Date",
          "https://schema.org/DateTime",
          "https://schema.org/Time"
        ],
        "description": "The beginning of the availability of the product or service included in the offer.",
        "expectedTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime",
          "https://schema.org/Time"
        ],
        "rangeTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime",
          "https://schema.org/Time"
        ],
        "domainTypes": [
          "https://schema.org/ActionAccessSpecification",
          "https://schema.org/Demand",
          "https://schema.org/Offer"
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
        "name": "eligibleRegion",
        "type": [
          "https://schema.org/GeoShape",
          "https://schema.org/Place",
          "https://schema.org/Text"
        ],
        "description": "The ISO 3166-1 (ISO 3166-1 alpha-2) or ISO 3166-2 code, the place, or the GeoShape for the geo-political region(s) for which the offer or delivery charge specification is valid.\\n\\nSee also [[ineligibleRegion]].\n    ",
        "expectedTypes": [
          "https://schema.org/GeoShape",
          "https://schema.org/Place",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/GeoShape",
          "https://schema.org/Place",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/ActionAccessSpecification",
          "https://schema.org/DeliveryChargeSpecification",
          "https://schema.org/Demand",
          "https://schema.org/Offer"
        ]
      },
      {
        "name": "expectsAcceptanceOf",
        "type": "https://schema.org/Offer",
        "description": "An Offer which must be accepted before the user can perform the Action. For example, the user may need to buy a movie before being able to watch it.",
        "expectedTypes": [
          "https://schema.org/Offer"
        ],
        "rangeTypes": [
          "https://schema.org/Offer"
        ],
        "domainTypes": [
          "https://schema.org/ActionAccessSpecification",
          "https://schema.org/ConsumeAction",
          "https://schema.org/MediaSubscription"
        ]
      },
      {
        "name": "ineligibleRegion",
        "type": [
          "https://schema.org/GeoShape",
          "https://schema.org/Place",
          "https://schema.org/Text"
        ],
        "description": "The ISO 3166-1 (ISO 3166-1 alpha-2) or ISO 3166-2 code, the place, or the GeoShape for the geo-political region(s) for which the offer or delivery charge specification is not valid, e.g. a region where the transaction is not allowed.\\n\\nSee also [[eligibleRegion]].\n      ",
        "expectedTypes": [
          "https://schema.org/GeoShape",
          "https://schema.org/Place",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/GeoShape",
          "https://schema.org/Place",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/ActionAccessSpecification",
          "https://schema.org/DeliveryChargeSpecification",
          "https://schema.org/Demand",
          "https://schema.org/MediaObject",
          "https://schema.org/Offer"
        ]
      },
      {
        "name": "requiresSubscription",
        "type": [
          "https://schema.org/Boolean",
          "https://schema.org/MediaSubscription"
        ],
        "description": "Indicates if use of the media require a subscription  (either paid or free). Allowed values are ```true``` or ```false``` (note that an earlier version had 'yes', 'no').",
        "expectedTypes": [
          "https://schema.org/Boolean",
          "https://schema.org/MediaSubscription"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean",
          "https://schema.org/MediaSubscription"
        ],
        "domainTypes": [
          "https://schema.org/ActionAccessSpecification",
          "https://schema.org/MediaObject"
        ]
      }
    ]
  },
  {
    "name": "ActionStatusType",
    "type": "https://schema.org/ActionStatusType",
    "source": "generated",
    "description": "The status of an Action.",
    "parentTypes": [
      "https://schema.org/StatusEnumeration"
    ],
    "enumerationValues": [
      {
        "name": "ActiveActionStatus",
        "type": "https://schema.org/ActiveActionStatus",
        "description": "An in-progress action (e.g., while watching the movie, or driving to a location)."
      },
      {
        "name": "CompletedActionStatus",
        "type": "https://schema.org/CompletedActionStatus",
        "description": "An action that has already taken place."
      },
      {
        "name": "FailedActionStatus",
        "type": "https://schema.org/FailedActionStatus",
        "description": "An action that failed to complete. The action's error property and the HTTP return code contain more information about the failure."
      },
      {
        "name": "PotentialActionStatus",
        "type": "https://schema.org/PotentialActionStatus",
        "description": "A description of an action that is supported."
      }
    ]
  },
  {
    "name": "ActivateAction",
    "type": "https://schema.org/ActivateAction",
    "source": "generated",
    "description": "The act of starting or activating a device or application (e.g. starting a timer or turning on a flashlight).",
    "parentTypes": [
      "https://schema.org/ControlAction"
    ]
  },
  {
    "name": "AddAction",
    "type": "https://schema.org/AddAction",
    "source": "generated",
    "description": "The act of editing by adding an object to a collection.",
    "parentTypes": [
      "https://schema.org/UpdateAction"
    ]
  },
  {
    "name": "Address",
    "type": "https://www.omg.org/spec/Commons/Locations/Address",
    "source": "generated"
  },
  {
    "name": "AdministrativeArea",
    "type": "https://schema.org/AdministrativeArea",
    "source": "generated",
    "description": "A geographical region, typically under the jurisdiction of a particular government.",
    "parentTypes": [
      "https://schema.org/Place"
    ]
  },
  {
    "name": "AdultEntertainment",
    "type": "https://schema.org/AdultEntertainment",
    "source": "generated",
    "description": "An adult entertainment establishment.",
    "parentTypes": [
      "https://schema.org/EntertainmentBusiness"
    ]
  },
  {
    "name": "AdultOrientedEnumeration",
    "type": "https://schema.org/AdultOrientedEnumeration",
    "source": "generated",
    "description": "Enumeration of considerations that make a product relevant or potentially restricted for adults only.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "AlcoholConsideration",
        "type": "https://schema.org/AlcoholConsideration",
        "description": "Item contains alcohol or promotes alcohol consumption."
      },
      {
        "name": "DangerousGoodConsideration",
        "type": "https://schema.org/DangerousGoodConsideration",
        "description": "The item is dangerous and requires careful handling and/or special training of the user. See also the [UN Model Classification](https://unece.org/DAM/trans/danger/publi/unrec/rev17/English/02EREv17_Part2.pdf) defining the 9 classes of dangerous goods such as explosives, gases, flammables, and more."
      },
      {
        "name": "HealthcareConsideration",
        "type": "https://schema.org/HealthcareConsideration",
        "description": "Item is a pharmaceutical (e.g., a prescription or OTC drug) or a restricted medical device."
      },
      {
        "name": "NarcoticConsideration",
        "type": "https://schema.org/NarcoticConsideration",
        "description": "Item is a narcotic as defined by the [1961 UN convention](https://www.incb.org/incb/en/narcotic-drugs/Yellowlist/yellow-list.html), for example marijuana or heroin."
      },
      {
        "name": "ReducedRelevanceForChildrenConsideration",
        "type": "https://schema.org/ReducedRelevanceForChildrenConsideration",
        "description": "A general code for cases where relevance to children is reduced, e.g. adult education, mortgages, retirement-related products, etc."
      },
      {
        "name": "SexualContentConsideration",
        "type": "https://schema.org/SexualContentConsideration",
        "description": "The item contains sexually oriented content such as nudity, suggestive or explicit material, or related online services, or is intended to enhance sexual activity. Examples: Erotic videos or magazine, sexual enhancement devices, sex toys."
      },
      {
        "name": "TobaccoNicotineConsideration",
        "type": "https://schema.org/TobaccoNicotineConsideration",
        "description": "Item contains tobacco and/or nicotine, for example cigars, cigarettes, chewing tobacco, e-cigarettes, or hookahs."
      },
      {
        "name": "UnclassifiedAdultConsideration",
        "type": "https://schema.org/UnclassifiedAdultConsideration",
        "description": "The item is suitable only for adults, without indicating why. Due to widespread use of \"adult\" as a euphemism for \"sexual\", many such items are likely suited also for the SexualContentConsideration code."
      },
      {
        "name": "ViolenceConsideration",
        "type": "https://schema.org/ViolenceConsideration",
        "description": "Item shows or promotes violence."
      },
      {
        "name": "WeaponConsideration",
        "type": "https://schema.org/WeaponConsideration",
        "description": "The item is intended to induce bodily harm, for example guns, mace, combat knives, brass knuckles, nail or other bombs, and spears."
      }
    ]
  },
  {
    "name": "AdvertiserContentArticle",
    "type": "https://schema.org/AdvertiserContentArticle",
    "source": "generated",
    "description": "An [[Article]] that an external entity has paid to place or to produce to its specifications. Includes [advertorials](https://en.wikipedia.org/wiki/Advertorial), sponsored content, native advertising and other paid content.",
    "parentTypes": [
      "https://schema.org/Article"
    ]
  },
  {
    "name": "AggregateOffer",
    "type": "https://schema.org/AggregateOffer",
    "source": "generated",
    "description": "When a single product is associated with multiple offers (for example, the same pair of shoes is offered by different merchants), then AggregateOffer can be used.\\n\\nNote: AggregateOffers are normally expected to associate multiple offers that all share the same defined [[businessFunction]] value, or default to http://purl.org/goodrelations/v1#Sell if businessFunction is not explicitly defined.",
    "parentTypes": [
      "https://schema.org/Offer"
    ],
    "properties": [
      {
        "name": "highPrice",
        "type": [
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "description": "The highest price of all offers available.\\n\\nUsage guidelines:\\n\\n* Use values from 0123456789 (Unicode 'DIGIT ZERO' (U+0030) to 'DIGIT NINE' (U+0039)) rather than superficially similar Unicode symbols.\\n* Use '.' (Unicode 'FULL STOP' (U+002E)) rather than ',' to indicate a decimal point. Avoid using these symbols as a readability separator.",
        "expectedTypes": [
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/AggregateOffer"
        ]
      },
      {
        "name": "lowPrice",
        "type": [
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "description": "The lowest price of all offers available.\\n\\nUsage guidelines:\\n\\n* Use values from 0123456789 (Unicode 'DIGIT ZERO' (U+0030) to 'DIGIT NINE' (U+0039)) rather than superficially similar Unicode symbols.\\n* Use '.' (Unicode 'FULL STOP' (U+002E)) rather than ',' to indicate a decimal point. Avoid using these symbols as a readability separator.",
        "expectedTypes": [
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/AggregateOffer"
        ]
      },
      {
        "name": "offerCount",
        "type": "https://schema.org/Integer",
        "description": "The number of offers for the product.",
        "expectedTypes": [
          "https://schema.org/Integer"
        ],
        "rangeTypes": [
          "https://schema.org/Integer"
        ],
        "domainTypes": [
          "https://schema.org/AggregateOffer"
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
      }
    ]
  },
  {
    "name": "AggregateRating",
    "type": "https://schema.org/AggregateRating",
    "source": "generated",
    "description": "The average rating based on multiple ratings or reviews.",
    "parentTypes": [
      "https://schema.org/Rating"
    ],
    "properties": [
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
        "name": "ratingCount",
        "type": "https://schema.org/Integer",
        "description": "The count of total number of ratings.",
        "expectedTypes": [
          "https://schema.org/Integer"
        ],
        "rangeTypes": [
          "https://schema.org/Integer"
        ],
        "domainTypes": [
          "https://schema.org/AggregateRating"
        ]
      },
      {
        "name": "reviewCount",
        "type": "https://schema.org/Integer",
        "description": "The count of total number of reviews.",
        "expectedTypes": [
          "https://schema.org/Integer"
        ],
        "rangeTypes": [
          "https://schema.org/Integer"
        ],
        "domainTypes": [
          "https://schema.org/AggregateRating"
        ]
      }
    ]
  },
  {
    "name": "AgreeAction",
    "type": "https://schema.org/AgreeAction",
    "source": "generated",
    "description": "The act of expressing a consistency of opinion with the object. An agent agrees to/about an object (a proposition, topic or theme) with participants.",
    "parentTypes": [
      "https://schema.org/ReactAction"
    ]
  },
  {
    "name": "Airline",
    "type": "https://schema.org/Airline",
    "source": "generated",
    "description": "An organization that provides flights for passengers.",
    "parentTypes": [
      "https://schema.org/Organization"
    ],
    "properties": [
      {
        "name": "boardingPolicy",
        "type": "https://schema.org/BoardingPolicyType",
        "description": "The type of boarding policy used by the airline (e.g. zone-based or group-based).",
        "expectedTypes": [
          "https://schema.org/BoardingPolicyType"
        ],
        "rangeTypes": [
          "https://schema.org/BoardingPolicyType"
        ],
        "domainTypes": [
          "https://schema.org/Airline",
          "https://schema.org/Flight"
        ]
      },
      {
        "name": "iataCode",
        "type": "https://schema.org/Text",
        "description": "IATA identifier for an airline or airport.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Airline",
          "https://schema.org/Airport"
        ]
      }
    ]
  },
  {
    "name": "Airport",
    "type": "https://schema.org/Airport",
    "source": "generated",
    "description": "An airport.",
    "parentTypes": [
      "https://schema.org/CivicStructure"
    ],
    "properties": [
      {
        "name": "iataCode",
        "type": "https://schema.org/Text",
        "description": "IATA identifier for an airline or airport.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Airline",
          "https://schema.org/Airport"
        ]
      },
      {
        "name": "icaoCode",
        "type": "https://schema.org/Text",
        "description": "ICAO identifier for an airport.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Airport"
        ]
      }
    ]
  },
  {
    "name": "AlignmentObject",
    "type": "https://schema.org/AlignmentObject",
    "source": "generated",
    "description": "An intangible item that describes an alignment between a learning resource and a node in an educational framework.\nShould not be used where the nature of the alignment can be described using a simple property, for example to express that a resource [[teaches]] or [[assesses]] a competency.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "alignmentType",
        "type": "https://schema.org/Text",
        "description": "A category of alignment between the learning resource and the framework node. Recommended values include: 'requires', 'textComplexity', 'readingLevel', and 'educationalSubject'.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/AlignmentObject"
        ]
      },
      {
        "name": "educationalFramework",
        "type": "https://schema.org/Text",
        "description": "The framework to which the resource being described is aligned.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/AlignmentObject"
        ]
      },
      {
        "name": "targetDescription",
        "type": "https://schema.org/Text",
        "description": "The description of a node in an established educational framework.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/AlignmentObject"
        ]
      },
      {
        "name": "targetName",
        "type": "https://schema.org/Text",
        "description": "The name of a node in an established educational framework.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/AlignmentObject"
        ]
      },
      {
        "name": "targetUrl",
        "type": "https://schema.org/URL",
        "description": "The URL of a node in an established educational framework.",
        "expectedTypes": [
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/AlignmentObject"
        ]
      }
    ]
  },
  {
    "name": "AllocateAction",
    "type": "https://schema.org/AllocateAction",
    "source": "generated",
    "description": "The act of organizing tasks/objects/events by associating resources to it.",
    "parentTypes": [
      "https://schema.org/OrganizeAction"
    ]
  },
  {
    "name": "AmountType",
    "type": "http://unece.org/vocab#AmountType",
    "source": "generated"
  },
  {
    "name": "AmpStory",
    "type": "https://schema.org/AmpStory",
    "source": "generated",
    "description": "A creative work with a visual storytelling format intended to be viewed online, particularly on mobile devices.",
    "parentTypes": [
      "https://schema.org/CreativeWork",
      "https://schema.org/MediaObject"
    ]
  },
  {
    "name": "AMRadioChannel",
    "type": "https://schema.org/AMRadioChannel",
    "source": "generated",
    "description": "A radio channel that uses AM.",
    "parentTypes": [
      "https://schema.org/RadioChannel"
    ]
  },
  {
    "name": "AmusementPark",
    "type": "https://schema.org/AmusementPark",
    "source": "generated",
    "description": "An amusement park.",
    "parentTypes": [
      "https://schema.org/EntertainmentBusiness"
    ]
  },
  {
    "name": "AnalysisNewsArticle",
    "type": "https://schema.org/AnalysisNewsArticle",
    "source": "generated",
    "description": "An AnalysisNewsArticle is a [[NewsArticle]] that, while based on factual reporting, incorporates the expertise of the author/producer, offering interpretations and conclusions.",
    "parentTypes": [
      "https://schema.org/NewsArticle"
    ]
  },
  {
    "name": "AnatomicalStructure",
    "type": "https://schema.org/AnatomicalStructure",
    "source": "generated",
    "description": "Any part of the human body, typically a component of an anatomical system. Organs, tissues, and cells are all anatomical structures.",
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
        "name": "bodyLocation",
        "type": "https://schema.org/Text",
        "description": "Location in the body of the anatomical structure.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/AnatomicalStructure",
          "https://schema.org/MedicalProcedure"
        ]
      },
      {
        "name": "connectedTo",
        "type": "https://schema.org/AnatomicalStructure",
        "description": "Other anatomical structures to which this structure is connected.",
        "expectedTypes": [
          "https://schema.org/AnatomicalStructure"
        ],
        "rangeTypes": [
          "https://schema.org/AnatomicalStructure"
        ],
        "domainTypes": [
          "https://schema.org/AnatomicalStructure"
        ]
      },
      {
        "name": "diagram",
        "type": "https://schema.org/ImageObject",
        "description": "An image containing a diagram that illustrates the structure and/or its component substructures and/or connections with other structures.",
        "expectedTypes": [
          "https://schema.org/ImageObject"
        ],
        "rangeTypes": [
          "https://schema.org/ImageObject"
        ],
        "domainTypes": [
          "https://schema.org/AnatomicalStructure"
        ]
      },
      {
        "name": "partOfSystem",
        "type": "https://schema.org/AnatomicalSystem",
        "description": "The anatomical or organ system that this structure is part of.",
        "expectedTypes": [
          "https://schema.org/AnatomicalSystem"
        ],
        "rangeTypes": [
          "https://schema.org/AnatomicalSystem"
        ],
        "domainTypes": [
          "https://schema.org/AnatomicalStructure"
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
        "name": "subStructure",
        "type": "https://schema.org/AnatomicalStructure",
        "description": "Component (sub-)structure(s) that comprise this anatomical structure.",
        "expectedTypes": [
          "https://schema.org/AnatomicalStructure"
        ],
        "rangeTypes": [
          "https://schema.org/AnatomicalStructure"
        ],
        "domainTypes": [
          "https://schema.org/AnatomicalStructure"
        ]
      }
    ]
  },
  {
    "name": "AnatomicalSystem",
    "type": "https://schema.org/AnatomicalSystem",
    "source": "generated",
    "description": "An anatomical system is a group of anatomical structures that work together to perform a certain task. Anatomical systems, such as organ systems, are one organizing principle of anatomy, and can include circulatory, digestive, endocrine, integumentary, immune, lymphatic, muscular, nervous, reproductive, respiratory, skeletal, urinary, vestibular, and other systems.",
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
        "name": "comprisedOf",
        "type": [
          "https://schema.org/AnatomicalStructure",
          "https://schema.org/AnatomicalSystem"
        ],
        "description": "Specifying something physically contained by something else. Typically used here for the underlying anatomical structures, such as organs, that comprise the anatomical system.",
        "expectedTypes": [
          "https://schema.org/AnatomicalStructure",
          "https://schema.org/AnatomicalSystem"
        ],
        "rangeTypes": [
          "https://schema.org/AnatomicalStructure",
          "https://schema.org/AnatomicalSystem"
        ],
        "domainTypes": [
          "https://schema.org/AnatomicalSystem"
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
        "name": "relatedStructure",
        "type": "https://schema.org/AnatomicalStructure",
        "description": "Related anatomical structure(s) that are not part of the system but relate or connect to it, such as vascular bundles associated with an organ system.",
        "expectedTypes": [
          "https://schema.org/AnatomicalStructure"
        ],
        "rangeTypes": [
          "https://schema.org/AnatomicalStructure"
        ],
        "domainTypes": [
          "https://schema.org/AnatomicalSystem"
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
      }
    ]
  },
  {
    "name": "AnimalShelter",
    "type": "https://schema.org/AnimalShelter",
    "source": "generated",
    "description": "Animal shelter.",
    "parentTypes": [
      "https://schema.org/LocalBusiness"
    ]
  },
  {
    "name": "Answer",
    "type": "https://schema.org/Answer",
    "source": "generated",
    "description": "An answer offered to a question; perhaps correct, perhaps opinionated or wrong.",
    "parentTypes": [
      "https://schema.org/Comment"
    ],
    "properties": [
      {
        "name": "answerExplanation",
        "type": [
          "https://schema.org/Comment",
          "https://schema.org/WebContent"
        ],
        "description": "A step-by-step or full explanation about Answer. Can outline how this Answer was achieved or contain more broad clarification or statement about it. ",
        "expectedTypes": [
          "https://schema.org/Comment",
          "https://schema.org/WebContent"
        ],
        "rangeTypes": [
          "https://schema.org/Comment",
          "https://schema.org/WebContent"
        ],
        "domainTypes": [
          "https://schema.org/Answer"
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
      }
    ]
  },
  {
    "name": "Apartment",
    "type": "https://schema.org/Apartment",
    "source": "generated",
    "description": "An apartment (in American English) or flat (in British English) is a self-contained housing unit (a type of residential real estate) that occupies only part of a building (source: Wikipedia, the free encyclopedia, see <a href=\"http://en.wikipedia.org/wiki/Apartment\">http://en.wikipedia.org/wiki/Apartment</a>).",
    "parentTypes": [
      "https://schema.org/Accommodation"
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
    "name": "ApartmentComplex",
    "type": "https://schema.org/ApartmentComplex",
    "source": "generated",
    "description": "Residence type: Apartment complex.",
    "parentTypes": [
      "https://schema.org/Residence"
    ],
    "properties": [
      {
        "name": "numberOfAccommodationUnits",
        "type": "https://schema.org/QuantitativeValue",
        "description": "Indicates the total (available plus unavailable) number of accommodation units in an [[ApartmentComplex]], or the number of accommodation units for a specific [[FloorPlan]] (within its specific [[ApartmentComplex]]). See also [[numberOfAvailableAccommodationUnits]].",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/ApartmentComplex",
          "https://schema.org/FloorPlan"
        ]
      },
      {
        "name": "numberOfAvailableAccommodationUnits",
        "type": "https://schema.org/QuantitativeValue",
        "description": "Indicates the number of available accommodation units in an [[ApartmentComplex]], or the number of accommodation units for a specific [[FloorPlan]] (within its specific [[ApartmentComplex]]). See also [[numberOfAccommodationUnits]].",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/ApartmentComplex",
          "https://schema.org/FloorPlan"
        ]
      },
      {
        "name": "numberOfBedrooms",
        "type": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "description": "The total integer number of bedrooms in a some [[Accommodation]], [[ApartmentComplex]] or [[FloorPlan]].",
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
          "https://schema.org/ApartmentComplex",
          "https://schema.org/FloorPlan"
        ]
      },
      {
        "name": "petsAllowed",
        "type": [
          "https://schema.org/Boolean",
          "https://schema.org/Text"
        ],
        "description": "Indicates whether pets are allowed to enter the accommodation or lodging business. More detailed information can be put in a text value.",
        "expectedTypes": [
          "https://schema.org/Boolean",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Accommodation",
          "https://schema.org/ApartmentComplex",
          "https://schema.org/FloorPlan",
          "https://schema.org/LodgingBusiness"
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
    "name": "APIReference",
    "type": "https://schema.org/APIReference",
    "source": "generated",
    "description": "Reference documentation for application programming interfaces (APIs).",
    "parentTypes": [
      "https://schema.org/TechArticle"
    ],
    "properties": [
      {
        "name": "assembly",
        "type": "https://schema.org/Text",
        "description": "Library file name, e.g., mscorlib.dll, system.web.dll.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/APIReference"
        ],
        "supersededBy": "https://schema.org/executableLibraryName"
      },
      {
        "name": "assemblyVersion",
        "type": "https://schema.org/Text",
        "description": "Associated product/technology version. E.g., .NET Framework 4.5.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/APIReference"
        ]
      },
      {
        "name": "executableLibraryName",
        "type": "https://schema.org/Text",
        "description": "Library file name, e.g., mscorlib.dll, system.web.dll.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/APIReference"
        ]
      },
      {
        "name": "programmingModel",
        "type": "https://schema.org/Text",
        "description": "Indicates whether API is managed or unmanaged.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/APIReference"
        ]
      },
      {
        "name": "targetPlatform",
        "type": "https://schema.org/Text",
        "description": "Type of app development: phone, Metro style, desktop, XBox, etc.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/APIReference"
        ]
      }
    ]
  },
  {
    "name": "AppendAction",
    "type": "https://schema.org/AppendAction",
    "source": "generated",
    "description": "The act of inserting at the end if an ordered collection.",
    "parentTypes": [
      "https://schema.org/InsertAction"
    ]
  },
  {
    "name": "ApplyAction",
    "type": "https://schema.org/ApplyAction",
    "source": "generated",
    "description": "The act of registering to an organization/service without the guarantee to receive it.\\n\\nRelated actions:\\n\\n* [[RegisterAction]]: Unlike RegisterAction, ApplyAction has no guarantees that the application will be accepted.",
    "parentTypes": [
      "https://schema.org/OrganizeAction"
    ]
  },
  {
    "name": "ApprovedIndication",
    "type": "https://schema.org/ApprovedIndication",
    "source": "generated",
    "description": "An indication for a medical therapy that has been formally specified or approved by a regulatory body that regulates use of the therapy; for example, the US FDA approves indications for most drugs in the US.",
    "parentTypes": [
      "https://schema.org/MedicalIndication"
    ]
  },
  {
    "name": "Aquarium",
    "type": "https://schema.org/Aquarium",
    "source": "generated",
    "description": "Aquarium.",
    "parentTypes": [
      "https://schema.org/CivicStructure"
    ]
  },
  {
    "name": "ArchiveComponent",
    "type": "https://schema.org/ArchiveComponent",
    "source": "generated",
    "description": "An intangible type to be applied to any archive content, carrying with it a set of properties required to describe archival items and collections.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ],
    "properties": [
      {
        "name": "holdingArchive",
        "type": "https://schema.org/ArchiveOrganization",
        "description": "[[ArchiveOrganization]] that holds, keeps or maintains the [[ArchiveComponent]].",
        "expectedTypes": [
          "https://schema.org/ArchiveOrganization"
        ],
        "rangeTypes": [
          "https://schema.org/ArchiveOrganization"
        ],
        "domainTypes": [
          "https://schema.org/ArchiveComponent"
        ],
        "inverseOf": "https://schema.org/archiveHeld"
      },
      {
        "name": "itemLocation",
        "type": [
          "https://schema.org/Place",
          "https://schema.org/PostalAddress",
          "https://schema.org/Text"
        ],
        "description": "Current location of the item.",
        "expectedTypes": [
          "https://schema.org/Place",
          "https://schema.org/PostalAddress",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Place",
          "https://schema.org/PostalAddress",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/ArchiveComponent"
        ]
      }
    ]
  },
  {
    "name": "ArchiveOrganization",
    "type": "https://schema.org/ArchiveOrganization",
    "source": "generated",
    "description": "An organization with archival holdings. An organization which keeps and preserves archival material and typically makes it accessible to the public.",
    "parentTypes": [
      "https://schema.org/LocalBusiness"
    ],
    "properties": [
      {
        "name": "archiveHeld",
        "type": "https://schema.org/ArchiveComponent",
        "description": "Collection, [fonds](https://en.wikipedia.org/wiki/Fonds), or item held, kept or maintained by an [[ArchiveOrganization]].",
        "expectedTypes": [
          "https://schema.org/ArchiveComponent"
        ],
        "rangeTypes": [
          "https://schema.org/ArchiveComponent"
        ],
        "domainTypes": [
          "https://schema.org/ArchiveOrganization"
        ],
        "inverseOf": "https://schema.org/holdingArchive"
      }
    ]
  },
  {
    "name": "ArriveAction",
    "type": "https://schema.org/ArriveAction",
    "source": "generated",
    "description": "The act of arriving at a place. An agent arrives at a destination from a fromLocation, optionally with participants.",
    "parentTypes": [
      "https://schema.org/MoveAction"
    ]
  },
  {
    "name": "Artery",
    "type": "https://schema.org/Artery",
    "source": "generated",
    "description": "A type of blood vessel that specifically carries blood away from the heart.",
    "parentTypes": [
      "https://schema.org/Vessel"
    ],
    "properties": [
      {
        "name": "arterialBranch",
        "type": "https://schema.org/AnatomicalStructure",
        "description": "The branches that comprise the arterial structure.",
        "expectedTypes": [
          "https://schema.org/AnatomicalStructure"
        ],
        "rangeTypes": [
          "https://schema.org/AnatomicalStructure"
        ],
        "domainTypes": [
          "https://schema.org/Artery"
        ]
      },
      {
        "name": "supplyTo",
        "type": "https://schema.org/AnatomicalStructure",
        "description": "The area to which the artery supplies blood.",
        "expectedTypes": [
          "https://schema.org/AnatomicalStructure"
        ],
        "rangeTypes": [
          "https://schema.org/AnatomicalStructure"
        ],
        "domainTypes": [
          "https://schema.org/Artery"
        ]
      }
    ]
  },
  {
    "name": "ArtGallery",
    "type": "https://schema.org/ArtGallery",
    "source": "generated",
    "description": "An art gallery.",
    "parentTypes": [
      "https://schema.org/EntertainmentBusiness"
    ]
  },
  {
    "name": "Article",
    "type": "https://schema.org/Article",
    "source": "generated",
    "description": "An article, such as a news article or piece of investigative report. Newspapers and magazines have articles of many different types and this is intended to cover them all.\\n\\nSee also [blog post](https://blog.schema.org/2014/09/02/schema-org-support-for-bibliographic-relationships-and-periodicals/).",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ],
    "properties": [
      {
        "name": "articleBody",
        "type": "https://schema.org/Text",
        "description": "The actual body of the article.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Article"
        ]
      },
      {
        "name": "articleSection",
        "type": "https://schema.org/Text",
        "description": "Articles may belong to one or more 'sections' in a magazine or newspaper, such as Sports, Lifestyle, etc.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Article"
        ]
      },
      {
        "name": "backstory",
        "type": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Text"
        ],
        "description": "For an [[Article]], typically a [[NewsArticle]], the backstory property provides a textual summary giving a brief explanation of why and how an article was created. In a journalistic setting this could include information about reporting process, methods, interviews, data sources, etc.",
        "expectedTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Article"
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
      },
      {
        "name": "speakable",
        "type": [
          "https://schema.org/SpeakableSpecification",
          "https://schema.org/URL"
        ],
        "description": "Indicates sections of a Web page that are particularly 'speakable' in the sense of being highlighted as being especially appropriate for text-to-speech conversion. Other sections of a page may also be usefully spoken in particular circumstances; the 'speakable' property serves to indicate the parts most likely to be generally useful for speech.\n\nThe *speakable* property can be repeated an arbitrary number of times, with three kinds of possible 'content-locator' values:\n\n1.) *id-value* URL references - uses *id-value* of an element in the page being annotated. The simplest use of *speakable* has (potentially relative) URL values, referencing identified sections of the document concerned.\n\n2.) CSS Selectors - addresses content in the annotated page, e.g. via class attribute. Use the [[cssSelector]] property.\n\n3.)  XPaths - addresses content via XPaths (assuming an XML view of the content). Use the [[xpath]] property.\n\n\nFor more sophisticated markup of speakable sections beyond simple ID references, either CSS selectors or XPath expressions to pick out document section(s) as speakable. For this\nwe define a supporting type, [[SpeakableSpecification]]  which is defined to be a possible value of the *speakable* property.\n         ",
        "expectedTypes": [
          "https://schema.org/SpeakableSpecification",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/SpeakableSpecification",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Article",
          "https://schema.org/WebPage"
        ]
      },
      {
        "name": "wordCount",
        "type": "https://schema.org/Integer",
        "description": "The number of words in the text of the CreativeWork such as an Article, Book, etc.",
        "expectedTypes": [
          "https://schema.org/Integer"
        ],
        "rangeTypes": [
          "https://schema.org/Integer"
        ],
        "domainTypes": [
          "https://schema.org/Article",
          "https://schema.org/CreativeWork"
        ]
      }
    ]
  },
  {
    "name": "AskAction",
    "type": "https://schema.org/AskAction",
    "source": "generated",
    "description": "The act of posing a question / favor to someone.\\n\\nRelated actions:\\n\\n* [[ReplyAction]]: Appears generally as a response to AskAction.",
    "parentTypes": [
      "https://schema.org/CommunicateAction"
    ],
    "properties": [
      {
        "name": "question",
        "type": "https://schema.org/Question",
        "description": "A sub property of object. A question.",
        "expectedTypes": [
          "https://schema.org/Question"
        ],
        "rangeTypes": [
          "https://schema.org/Question"
        ],
        "domainTypes": [
          "https://schema.org/AskAction"
        ]
      }
    ]
  },
  {
    "name": "AskPublicNewsArticle",
    "type": "https://schema.org/AskPublicNewsArticle",
    "source": "generated",
    "description": "A [[NewsArticle]] expressing an open call by a [[NewsMediaOrganization]] asking the public for input, insights, clarifications, anecdotes, documentation, etc., on an issue, for reporting purposes.",
    "parentTypes": [
      "https://schema.org/NewsArticle"
    ]
  },
  {
    "name": "AssessAction",
    "type": "https://schema.org/AssessAction",
    "source": "generated",
    "description": "The act of forming one's opinion, reaction or sentiment.",
    "parentTypes": [
      "https://schema.org/Action"
    ]
  },
  {
    "name": "AssignAction",
    "type": "https://schema.org/AssignAction",
    "source": "generated",
    "description": "The act of allocating an action/event/task to some destination (someone or something).",
    "parentTypes": [
      "https://schema.org/AllocateAction"
    ]
  },
  {
    "name": "Atlas",
    "type": "https://schema.org/Atlas",
    "source": "generated",
    "description": "A collection or bound volume of maps, charts, plates or tables, physical or in media form illustrating any subject.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ]
  },
  {
    "name": "atTime",
    "type": "http://www.w3.org/ns/prov#atTime",
    "source": "generated"
  },
  {
    "name": "Attorney",
    "type": "https://schema.org/Attorney",
    "source": "generated",
    "description": "Professional service: Attorney. \\n\\nThis type is deprecated - [[LegalService]] is more inclusive and less ambiguous.",
    "parentTypes": [
      "https://schema.org/LegalService"
    ]
  },
  {
    "name": "Audience",
    "type": "https://schema.org/Audience",
    "source": "generated",
    "description": "Intended audience for an item, i.e. the group for whom the item was created.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "audienceType",
        "type": "https://schema.org/Text",
        "description": "The target group associated with a given audience (e.g. veterans, car owners, musicians, etc.).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Audience"
        ]
      },
      {
        "name": "geographicArea",
        "type": "https://schema.org/AdministrativeArea",
        "description": "The geographic area associated with the audience.",
        "expectedTypes": [
          "https://schema.org/AdministrativeArea"
        ],
        "rangeTypes": [
          "https://schema.org/AdministrativeArea"
        ],
        "domainTypes": [
          "https://schema.org/Audience"
        ]
      }
    ]
  },
  {
    "name": "Audiobook",
    "type": "https://schema.org/Audiobook",
    "source": "generated",
    "description": "An audiobook.",
    "parentTypes": [
      "https://schema.org/AudioObject",
      "https://schema.org/Book"
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
        "name": "readBy",
        "type": "https://schema.org/Person",
        "description": "A person who reads (performs) the audiobook.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Audiobook"
        ]
      }
    ]
  },
  {
    "name": "AudioObject",
    "type": "https://schema.org/AudioObject",
    "source": "generated",
    "description": "An audio file.",
    "parentTypes": [
      "https://schema.org/MediaObject"
    ],
    "properties": [
      {
        "name": "caption",
        "type": [
          "https://schema.org/MediaObject",
          "https://schema.org/Text"
        ],
        "description": "The caption for this object. For downloadable machine formats (closed caption, subtitles etc.) use MediaObject and indicate the [[encodingFormat]].",
        "expectedTypes": [
          "https://schema.org/MediaObject",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/MediaObject",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/AudioObject",
          "https://schema.org/ImageObject",
          "https://schema.org/VideoObject"
        ]
      },
      {
        "name": "embeddedTextCaption",
        "type": "https://schema.org/Text",
        "description": "Represents textual captioning from a [[MediaObject]], e.g. text of a 'meme'.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/AudioObject",
          "https://schema.org/ImageObject",
          "https://schema.org/VideoObject"
        ]
      },
      {
        "name": "transcript",
        "type": "https://schema.org/Text",
        "description": "If this MediaObject is an AudioObject or VideoObject, the transcript of that object.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/AudioObject",
          "https://schema.org/VideoObject"
        ]
      }
    ]
  },
  {
    "name": "AudioObjectSnapshot",
    "type": "https://schema.org/AudioObjectSnapshot",
    "source": "generated",
    "description": "A specific and exact (byte-for-byte) version of an [[AudioObject]]. Two byte-for-byte identical files, for the purposes of this type, considered identical. If they have different embedded metadata the files will differ. Different external facts about the files, e.g. creator or dateCreated that aren't represented in their actual content, do not affect this notion of identity.",
    "parentTypes": [
      "https://schema.org/AudioObject"
    ]
  },
  {
    "name": "AuthenticateAction",
    "type": "https://schema.org/AuthenticateAction",
    "source": "generated",
    "description": "The action of authenticating into a device or application.",
    "parentTypes": [
      "https://schema.org/ControlAction"
    ]
  },
  {
    "name": "AuthorizeAction",
    "type": "https://schema.org/AuthorizeAction",
    "source": "generated",
    "description": "The act of granting permission to an object.",
    "parentTypes": [
      "https://schema.org/AllocateAction"
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
    "name": "AutoBodyShop",
    "type": "https://schema.org/AutoBodyShop",
    "source": "generated",
    "description": "Auto body shop.",
    "parentTypes": [
      "https://schema.org/AutomotiveBusiness"
    ]
  },
  {
    "name": "AutoDealer",
    "type": "https://schema.org/AutoDealer",
    "source": "generated",
    "description": "An car dealership.",
    "parentTypes": [
      "https://schema.org/AutomotiveBusiness"
    ]
  },
  {
    "name": "AutomatedTeller",
    "type": "https://schema.org/AutomatedTeller",
    "source": "generated",
    "description": "ATM/cash machine.",
    "parentTypes": [
      "https://schema.org/FinancialService"
    ]
  },
  {
    "name": "AutomotiveBusiness",
    "type": "https://schema.org/AutomotiveBusiness",
    "source": "generated",
    "description": "Car repair, sales, or parts.",
    "parentTypes": [
      "https://schema.org/LocalBusiness"
    ]
  },
  {
    "name": "AutoPartsStore",
    "type": "https://schema.org/AutoPartsStore",
    "source": "generated",
    "description": "An auto parts store.",
    "parentTypes": [
      "https://schema.org/AutomotiveBusiness",
      "https://schema.org/Store"
    ]
  },
  {
    "name": "AutoRental",
    "type": "https://schema.org/AutoRental",
    "source": "generated",
    "description": "A car rental business.",
    "parentTypes": [
      "https://schema.org/AutomotiveBusiness"
    ]
  },
  {
    "name": "AutoRepair",
    "type": "https://schema.org/AutoRepair",
    "source": "generated",
    "description": "Car repair business.",
    "parentTypes": [
      "https://schema.org/AutomotiveBusiness"
    ]
  },
  {
    "name": "AutoWash",
    "type": "https://schema.org/AutoWash",
    "source": "generated",
    "description": "A car wash business.",
    "parentTypes": [
      "https://schema.org/AutomotiveBusiness"
    ]
  },
  {
    "name": "BackgroundNewsArticle",
    "type": "https://schema.org/BackgroundNewsArticle",
    "source": "generated",
    "description": "A [[NewsArticle]] providing historical context, definition and detail on a specific topic (aka \"explainer\" or \"backgrounder\"). For example, an in-depth article or frequently-asked-questions ([FAQ](https://en.wikipedia.org/wiki/FAQ)) document on topics such as Climate Change or the European Union. Other kinds of background material from a non-news setting are often described using [[Book]] or [[Article]], in particular [[ScholarlyArticle]]. See also [[NewsArticle]] for related vocabulary from a learning/education perspective.",
    "parentTypes": [
      "https://schema.org/NewsArticle"
    ]
  },
  {
    "name": "Bakery",
    "type": "https://schema.org/Bakery",
    "source": "generated",
    "description": "A bakery.",
    "parentTypes": [
      "https://schema.org/FoodEstablishment"
    ]
  },
  {
    "name": "BankAccount",
    "type": "https://spec.edmcouncil.org/fibo/ontology/FBC/ProductsAndServices/FinancialProductsAndServices/BankAccount",
    "source": "generated"
  },
  {
    "name": "BankAccount",
    "type": "https://schema.org/BankAccount",
    "source": "generated",
    "description": "A product or service offered by a bank whereby one may deposit, withdraw or transfer money and in some cases be paid interest.",
    "parentTypes": [
      "https://schema.org/FinancialProduct"
    ],
    "properties": [
      {
        "name": "accountMinimumInflow",
        "type": "https://schema.org/MonetaryAmount",
        "description": "A minimum amount that has to be paid in every month.",
        "expectedTypes": [
          "https://schema.org/MonetaryAmount"
        ],
        "rangeTypes": [
          "https://schema.org/MonetaryAmount"
        ],
        "domainTypes": [
          "https://schema.org/BankAccount"
        ]
      },
      {
        "name": "accountOverdraftLimit",
        "type": "https://schema.org/MonetaryAmount",
        "description": "An overdraft is an extension of credit from a lending institution when an account reaches zero. An overdraft allows the individual to continue withdrawing money even if the account has no funds in it. Basically the bank allows people to borrow a set amount of money.",
        "expectedTypes": [
          "https://schema.org/MonetaryAmount"
        ],
        "rangeTypes": [
          "https://schema.org/MonetaryAmount"
        ],
        "domainTypes": [
          "https://schema.org/BankAccount"
        ]
      },
      {
        "name": "bankAccountType",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "The type of a bank account.",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/BankAccount"
        ]
      }
    ]
  },
  {
    "name": "BankOrCreditUnion",
    "type": "https://schema.org/BankOrCreditUnion",
    "source": "generated",
    "description": "Bank or credit union.",
    "parentTypes": [
      "https://schema.org/FinancialService"
    ]
  },
  {
    "name": "Barcode",
    "type": "https://schema.org/Barcode",
    "source": "generated",
    "description": "An image of a visual machine-readable code such as a barcode or QR code.",
    "parentTypes": [
      "https://schema.org/ImageObject"
    ]
  },
  {
    "name": "BarOrPub",
    "type": "https://schema.org/BarOrPub",
    "source": "generated",
    "description": "A bar or pub.",
    "parentTypes": [
      "https://schema.org/FoodEstablishment"
    ]
  },
  {
    "name": "Beach",
    "type": "https://schema.org/Beach",
    "source": "generated",
    "description": "Beach.",
    "parentTypes": [
      "https://schema.org/CivicStructure"
    ]
  },
  {
    "name": "BeautySalon",
    "type": "https://schema.org/BeautySalon",
    "source": "generated",
    "description": "Beauty salon.",
    "parentTypes": [
      "https://schema.org/HealthAndBeautyBusiness"
    ]
  },
  {
    "name": "BedAndBreakfast",
    "type": "https://schema.org/BedAndBreakfast",
    "source": "generated",
    "description": "Bed and breakfast.\n<br /><br />\nSee also the <a href=\"/docs/hotels.html\">dedicated document on the use of schema.org for marking up hotels and other forms of accommodations</a>.\n",
    "parentTypes": [
      "https://schema.org/LodgingBusiness"
    ]
  },
  {
    "name": "BedDetails",
    "type": "https://schema.org/BedDetails",
    "source": "generated",
    "description": "An entity holding detailed information about the available bed types, e.g. the quantity of twin beds for a hotel room. For the single case of just one bed of a certain type, you can use bed directly with a text. See also [[BedType]] (under development).",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "numberOfBeds",
        "type": "https://schema.org/Number",
        "description": "The quantity of the given bed type available in the HotelRoom, Suite, House, or Apartment.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/BedDetails"
        ]
      },
      {
        "name": "typeOfBed",
        "type": [
          "https://schema.org/BedType",
          "https://schema.org/Text"
        ],
        "description": "The type of bed to which the BedDetail refers, i.e. the type of bed available in the quantity indicated by quantity.",
        "expectedTypes": [
          "https://schema.org/BedType",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/BedType",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/BedDetails"
        ]
      }
    ]
  },
  {
    "name": "BedType",
    "type": "https://schema.org/BedType",
    "source": "generated",
    "description": "A type of bed. This is used for indicating the bed or beds available in an accommodation.",
    "parentTypes": [
      "https://schema.org/QualitativeValue"
    ]
  },
  {
    "name": "BefriendAction",
    "type": "https://schema.org/BefriendAction",
    "source": "generated",
    "description": "The act of forming a personal connection with someone (object) mutually/bidirectionally/symmetrically.\\n\\nRelated actions:\\n\\n* [[FollowAction]]: Unlike FollowAction, BefriendAction implies that the connection is reciprocal.",
    "parentTypes": [
      "https://schema.org/InteractAction"
    ]
  },
  {
    "name": "BikeStore",
    "type": "https://schema.org/BikeStore",
    "source": "generated",
    "description": "A bike store.",
    "parentTypes": [
      "https://schema.org/Store"
    ]
  },
  {
    "name": "BioChemEntity",
    "type": "https://schema.org/BioChemEntity",
    "source": "generated",
    "description": "Any biological, chemical, or biochemical thing. For example: a protein; a gene; a chemical; a synthetic chemical.",
    "parentTypes": [
      "https://schema.org/Thing"
    ],
    "properties": [
      {
        "name": "associatedDisease",
        "type": [
          "https://schema.org/MedicalCondition",
          "https://schema.org/PropertyValue",
          "https://schema.org/URL"
        ],
        "description": "Disease associated to this BioChemEntity. Such disease can be a MedicalCondition or a URL. If you want to add an evidence supporting the association, please use PropertyValue.",
        "expectedTypes": [
          "https://schema.org/MedicalCondition",
          "https://schema.org/PropertyValue",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalCondition",
          "https://schema.org/PropertyValue",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/BioChemEntity"
        ]
      },
      {
        "name": "bioChemInteraction",
        "type": "https://schema.org/BioChemEntity",
        "description": "A BioChemEntity that is known to interact with this item.",
        "expectedTypes": [
          "https://schema.org/BioChemEntity"
        ],
        "rangeTypes": [
          "https://schema.org/BioChemEntity"
        ],
        "domainTypes": [
          "https://schema.org/BioChemEntity"
        ]
      },
      {
        "name": "bioChemSimilarity",
        "type": "https://schema.org/BioChemEntity",
        "description": "A similar BioChemEntity, e.g., obtained by fingerprint similarity algorithms.",
        "expectedTypes": [
          "https://schema.org/BioChemEntity"
        ],
        "rangeTypes": [
          "https://schema.org/BioChemEntity"
        ],
        "domainTypes": [
          "https://schema.org/BioChemEntity"
        ]
      },
      {
        "name": "biologicalRole",
        "type": "https://schema.org/DefinedTerm",
        "description": "A role played by the BioChemEntity within a biological context.",
        "expectedTypes": [
          "https://schema.org/DefinedTerm"
        ],
        "rangeTypes": [
          "https://schema.org/DefinedTerm"
        ],
        "domainTypes": [
          "https://schema.org/BioChemEntity"
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
        "name": "hasBioChemEntityPart",
        "type": "https://schema.org/BioChemEntity",
        "description": "Indicates a BioChemEntity that (in some sense) has this BioChemEntity as a part. ",
        "expectedTypes": [
          "https://schema.org/BioChemEntity"
        ],
        "rangeTypes": [
          "https://schema.org/BioChemEntity"
        ],
        "domainTypes": [
          "https://schema.org/BioChemEntity"
        ],
        "inverseOf": "https://schema.org/isPartOfBioChemEntity"
      },
      {
        "name": "hasMolecularFunction",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/PropertyValue",
          "https://schema.org/URL"
        ],
        "description": "Molecular function performed by this BioChemEntity; please use PropertyValue if you want to include any evidence.",
        "expectedTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/PropertyValue",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/PropertyValue",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/BioChemEntity"
        ]
      },
      {
        "name": "hasRepresentation",
        "type": [
          "https://schema.org/PropertyValue",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "A common representation such as a protein sequence or chemical structure for this entity. For images use schema.org/image.",
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
          "https://schema.org/BioChemEntity"
        ]
      },
      {
        "name": "isEncodedByBioChemEntity",
        "type": "https://schema.org/Gene",
        "description": "Another BioChemEntity encoding by this one.",
        "expectedTypes": [
          "https://schema.org/Gene"
        ],
        "rangeTypes": [
          "https://schema.org/Gene"
        ],
        "domainTypes": [
          "https://schema.org/BioChemEntity"
        ],
        "inverseOf": "https://schema.org/encodesBioChemEntity"
      },
      {
        "name": "isInvolvedInBiologicalProcess",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/PropertyValue",
          "https://schema.org/URL"
        ],
        "description": "Biological process this BioChemEntity is involved in; please use PropertyValue if you want to include any evidence.",
        "expectedTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/PropertyValue",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/PropertyValue",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/BioChemEntity"
        ]
      },
      {
        "name": "isLocatedInSubcellularLocation",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/PropertyValue",
          "https://schema.org/URL"
        ],
        "description": "Subcellular location where this BioChemEntity is located; please use PropertyValue if you want to include any evidence.",
        "expectedTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/PropertyValue",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/PropertyValue",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/BioChemEntity"
        ]
      },
      {
        "name": "isPartOfBioChemEntity",
        "type": "https://schema.org/BioChemEntity",
        "description": "Indicates a BioChemEntity that is (in some sense) a part of this BioChemEntity. ",
        "expectedTypes": [
          "https://schema.org/BioChemEntity"
        ],
        "rangeTypes": [
          "https://schema.org/BioChemEntity"
        ],
        "domainTypes": [
          "https://schema.org/BioChemEntity"
        ],
        "inverseOf": "https://schema.org/hasBioChemEntityPart"
      },
      {
        "name": "taxonomicRange",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Taxon",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "The taxonomic grouping of the organism that expresses, encodes, or in some way related to the BioChemEntity.",
        "expectedTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Taxon",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Taxon",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/BioChemEntity"
        ]
      }
    ]
  },
  {
    "name": "Blog",
    "type": "https://schema.org/Blog",
    "source": "generated",
    "description": "A [blog](https://en.wikipedia.org/wiki/Blog), sometimes known as a \"weblog\". Note that the individual posts ([[BlogPosting]]s) in a [[Blog]] are often colloquially referred to by the same term.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ],
    "properties": [
      {
        "name": "blogPost",
        "type": "https://schema.org/BlogPosting",
        "description": "A posting that is part of this blog.",
        "expectedTypes": [
          "https://schema.org/BlogPosting"
        ],
        "rangeTypes": [
          "https://schema.org/BlogPosting"
        ],
        "domainTypes": [
          "https://schema.org/Blog"
        ]
      },
      {
        "name": "blogPosts",
        "type": "https://schema.org/BlogPosting",
        "description": "Indicates a post that is part of a [[Blog]]. Note that historically, what we term a \"Blog\" was once known as a \"weblog\", and that what we term a \"BlogPosting\" is now often colloquially referred to as a \"blog\".",
        "expectedTypes": [
          "https://schema.org/BlogPosting"
        ],
        "rangeTypes": [
          "https://schema.org/BlogPosting"
        ],
        "domainTypes": [
          "https://schema.org/Blog"
        ],
        "supersededBy": "https://schema.org/blogPost"
      },
      {
        "name": "issn",
        "type": "https://schema.org/Text",
        "description": "The International Standard Serial Number (ISSN) that identifies this serial publication. You can repeat this property to identify different formats of, or the linking ISSN (ISSN-L) for, this serial publication.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Blog",
          "https://schema.org/CreativeWorkSeries",
          "https://schema.org/Dataset",
          "https://schema.org/WebSite"
        ]
      }
    ]
  },
  {
    "name": "BlogPosting",
    "type": "https://schema.org/BlogPosting",
    "source": "generated",
    "description": "A blog post.",
    "parentTypes": [
      "https://schema.org/SocialMediaPosting"
    ]
  },
  {
    "name": "BloodTest",
    "type": "https://schema.org/BloodTest",
    "source": "generated",
    "description": "A medical test performed on a sample of a patient's blood.",
    "parentTypes": [
      "https://schema.org/MedicalTest"
    ]
  },
  {
    "name": "BoardingPolicyType",
    "type": "https://schema.org/BoardingPolicyType",
    "source": "generated",
    "description": "A type of boarding policy used by an airline.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "GroupBoardingPolicy",
        "type": "https://schema.org/GroupBoardingPolicy",
        "description": "The airline boards by groups based on check-in time, priority, etc."
      },
      {
        "name": "ZoneBoardingPolicy",
        "type": "https://schema.org/ZoneBoardingPolicy",
        "description": "The airline boards by zones of the plane."
      }
    ]
  },
  {
    "name": "BoatReservation",
    "type": "https://schema.org/BoatReservation",
    "source": "generated",
    "description": "A reservation for boat travel.\n\nNote: This type is for information about actual reservations, e.g. in confirmation emails or HTML pages with individual confirmations of reservations. For offers of tickets, use [[Offer]].",
    "parentTypes": [
      "https://schema.org/Reservation"
    ]
  },
  {
    "name": "BoatTerminal",
    "type": "https://schema.org/BoatTerminal",
    "source": "generated",
    "description": "A terminal for boats, ships, and other water vessels.",
    "parentTypes": [
      "https://schema.org/CivicStructure"
    ]
  },
  {
    "name": "BoatTrip",
    "type": "https://schema.org/BoatTrip",
    "source": "generated",
    "description": "A trip on a commercial ferry line.",
    "parentTypes": [
      "https://schema.org/Trip"
    ],
    "properties": [
      {
        "name": "arrivalBoatTerminal",
        "type": "https://schema.org/BoatTerminal",
        "description": "The terminal or port from which the boat arrives.",
        "expectedTypes": [
          "https://schema.org/BoatTerminal"
        ],
        "rangeTypes": [
          "https://schema.org/BoatTerminal"
        ],
        "domainTypes": [
          "https://schema.org/BoatTrip"
        ]
      },
      {
        "name": "departureBoatTerminal",
        "type": "https://schema.org/BoatTerminal",
        "description": "The terminal or port from which the boat departs.",
        "expectedTypes": [
          "https://schema.org/BoatTerminal"
        ],
        "rangeTypes": [
          "https://schema.org/BoatTerminal"
        ],
        "domainTypes": [
          "https://schema.org/BoatTrip"
        ]
      }
    ]
  },
  {
    "name": "BodyMeasurementTypeEnumeration",
    "type": "https://schema.org/BodyMeasurementTypeEnumeration",
    "source": "generated",
    "description": "Enumerates types (or dimensions) of a person's body measurements, for example for fitting of clothes.",
    "parentTypes": [
      "https://schema.org/MeasurementTypeEnumeration"
    ],
    "enumerationValues": [
      {
        "name": "BodyMeasurementArm",
        "type": "https://schema.org/BodyMeasurementArm",
        "description": "Arm length (measured between arms/shoulder line intersection and the prominent wrist bone). Used, for example, to fit shirts."
      },
      {
        "name": "BodyMeasurementBust",
        "type": "https://schema.org/BodyMeasurementBust",
        "description": "Maximum girth of bust. Used, for example, to fit women's suits."
      },
      {
        "name": "BodyMeasurementChest",
        "type": "https://schema.org/BodyMeasurementChest",
        "description": "Maximum girth of chest. Used, for example, to fit men's suits."
      },
      {
        "name": "BodyMeasurementFoot",
        "type": "https://schema.org/BodyMeasurementFoot",
        "description": "Foot length (measured between end of the most prominent toe and the most prominent part of the heel). Used, for example, to measure socks."
      },
      {
        "name": "BodyMeasurementHand",
        "type": "https://schema.org/BodyMeasurementHand",
        "description": "Maximum hand girth (measured over the knuckles of the open right hand excluding thumb, fingers together). Used, for example, to fit gloves."
      },
      {
        "name": "BodyMeasurementHead",
        "type": "https://schema.org/BodyMeasurementHead",
        "description": "Maximum girth of head above the ears. Used, for example, to fit hats."
      },
      {
        "name": "BodyMeasurementHeight",
        "type": "https://schema.org/BodyMeasurementHeight",
        "description": "Body height (measured between crown of head and soles of feet). Used, for example, to fit jackets."
      },
      {
        "name": "BodyMeasurementHips",
        "type": "https://schema.org/BodyMeasurementHips",
        "description": "Girth of hips (measured around the buttocks). Used, for example, to fit skirts."
      },
      {
        "name": "BodyMeasurementInsideLeg",
        "type": "https://schema.org/BodyMeasurementInsideLeg",
        "description": "Inside leg (measured between crotch and soles of feet). Used, for example, to fit pants."
      },
      {
        "name": "BodyMeasurementNeck",
        "type": "https://schema.org/BodyMeasurementNeck",
        "description": "Girth of neck. Used, for example, to fit shirts."
      },
      {
        "name": "BodyMeasurementUnderbust",
        "type": "https://schema.org/BodyMeasurementUnderbust",
        "description": "Girth of body just below the bust. Used, for example, to fit women's swimwear."
      },
      {
        "name": "BodyMeasurementWaist",
        "type": "https://schema.org/BodyMeasurementWaist",
        "description": "Girth of natural waistline (between hip bones and lower ribs). Used, for example, to fit pants."
      },
      {
        "name": "BodyMeasurementWeight",
        "type": "https://schema.org/BodyMeasurementWeight",
        "description": "Body weight. Used, for example, to measure pantyhose."
      }
    ]
  },
  {
    "name": "BodyOfWater",
    "type": "https://schema.org/BodyOfWater",
    "source": "generated",
    "description": "A body of water, such as a sea, ocean, or lake.",
    "parentTypes": [
      "https://schema.org/Landform"
    ]
  },
  {
    "name": "Bone",
    "type": "https://schema.org/Bone",
    "source": "generated",
    "description": "Rigid connective tissue that comprises up the skeletal structure of the human body.",
    "parentTypes": [
      "https://schema.org/AnatomicalStructure"
    ]
  },
  {
    "name": "Book",
    "type": "https://schema.org/Book",
    "source": "generated",
    "description": "A book.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ],
    "properties": [
      {
        "name": "abridged",
        "type": "https://schema.org/Boolean",
        "description": "Indicates whether the book is an abridged edition.",
        "expectedTypes": [
          "https://schema.org/Boolean"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean"
        ],
        "domainTypes": [
          "https://schema.org/Book"
        ]
      },
      {
        "name": "bookEdition",
        "type": "https://schema.org/Text",
        "description": "The edition of the book.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Book"
        ]
      },
      {
        "name": "bookFormat",
        "type": "https://schema.org/BookFormatType",
        "description": "The format of the book.",
        "expectedTypes": [
          "https://schema.org/BookFormatType"
        ],
        "rangeTypes": [
          "https://schema.org/BookFormatType"
        ],
        "domainTypes": [
          "https://schema.org/Book"
        ]
      },
      {
        "name": "illustrator",
        "type": "https://schema.org/Person",
        "description": "The illustrator of the book.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Book"
        ]
      },
      {
        "name": "isbn",
        "type": "https://schema.org/Text",
        "description": "The ISBN of the book.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Book"
        ]
      },
      {
        "name": "numberOfPages",
        "type": "https://schema.org/Integer",
        "description": "The number of pages in the book.",
        "expectedTypes": [
          "https://schema.org/Integer"
        ],
        "rangeTypes": [
          "https://schema.org/Integer"
        ],
        "domainTypes": [
          "https://schema.org/Book"
        ]
      }
    ]
  },
  {
    "name": "BookFormatType",
    "type": "https://schema.org/BookFormatType",
    "source": "generated",
    "description": "The publication format of the book.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "AudiobookFormat",
        "type": "https://schema.org/AudiobookFormat",
        "description": "Book format: Audiobook. This is an enumerated value for use with the bookFormat property. There is also a type 'Audiobook' in the bib extension which includes Audiobook specific properties."
      },
      {
        "name": "EBook",
        "type": "https://schema.org/EBook",
        "description": "Book format: Ebook."
      },
      {
        "name": "GraphicNovel",
        "type": "https://schema.org/GraphicNovel",
        "description": "This type is deprecated: GraphicNovel does not fit the BookFormatType enumeration, as it can appear in multiple formats (e.g., Hardcover, eBook). It is not mutually exclusive and therefore deprecated. Use standard BookFormatType values instead in combination with the SequentialArt.\n\nBook format: GraphicNovel. May represent a bound collection of ComicIssue instances."
      },
      {
        "name": "Hardcover",
        "type": "https://schema.org/Hardcover",
        "description": "A durable, archival-quality book featuring a rigid protective shell made of heavy board wrapped in cloth or paper, designed to withstand heavy use and preservation on a shelf."
      },
      {
        "name": "Pamphlet",
        "type": "https://schema.org/Pamphlet",
        "description": "A small, unbound or stapled booklet consisting of few pages with a flexible paper cover, designed for the economical distribution of focused information on a single subject."
      },
      {
        "name": "Paperback",
        "type": "https://schema.org/Paperback",
        "description": "A flexible, lightweight book bound with a thick paper or cardstock cover and glued spine, prioritizing portability and affordability over long-term durability."
      }
    ]
  },
  {
    "name": "BookmarkAction",
    "type": "https://schema.org/BookmarkAction",
    "source": "generated",
    "description": "An agent bookmarks/flags/labels/tags/marks an object.",
    "parentTypes": [
      "https://schema.org/OrganizeAction"
    ]
  },
  {
    "name": "BookSeries",
    "type": "https://schema.org/BookSeries",
    "source": "generated",
    "description": "A series of books. Included books can be indicated with the hasPart property.",
    "parentTypes": [
      "https://schema.org/CreativeWorkSeries"
    ]
  },
  {
    "name": "BookStore",
    "type": "https://schema.org/BookStore",
    "source": "generated",
    "description": "A bookstore.",
    "parentTypes": [
      "https://schema.org/Store"
    ]
  },
  {
    "name": "Boolean",
    "type": "https://schema.org/Boolean",
    "source": "generated",
    "description": "Boolean: True or False."
  },
  {
    "name": "BorrowAction",
    "type": "https://schema.org/BorrowAction",
    "source": "generated",
    "description": "The act of obtaining an object under an agreement to return it at a later date. Reciprocal of LendAction.\\n\\nRelated actions:\\n\\n* [[LendAction]]: Reciprocal of BorrowAction.",
    "parentTypes": [
      "https://schema.org/TransferAction"
    ],
    "properties": [
      {
        "name": "lender",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "A sub property of participant. The person that lends the object being borrowed.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/BorrowAction"
        ]
      }
    ]
  },
  {
    "name": "BowlingAlley",
    "type": "https://schema.org/BowlingAlley",
    "source": "generated",
    "description": "A bowling alley.",
    "parentTypes": [
      "https://schema.org/SportsActivityLocation"
    ]
  },
  {
    "name": "BrainStructure",
    "type": "https://schema.org/BrainStructure",
    "source": "generated",
    "description": "Any anatomical structure which pertains to the soft nervous tissue functioning as the coordinating center of sensation and intellectual and nervous activity.",
    "parentTypes": [
      "https://schema.org/AnatomicalStructure"
    ]
  },
  {
    "name": "Brand",
    "type": "https://schema.org/Brand",
    "source": "generated",
    "description": "A brand is a name used by an organization or business person for labeling a product, product group, or similar.",
    "parentTypes": [
      "https://schema.org/Intangible",
      "https://www.omg.org/spec/Commons/Classifiers/Classifier"
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
      }
    ]
  },
  {
    "name": "BrandName",
    "type": "http://unece.org/vocab#BrandName",
    "source": "generated"
  },
  {
    "name": "BreadcrumbList",
    "type": "https://schema.org/BreadcrumbList",
    "source": "generated",
    "description": "A BreadcrumbList is an ItemList consisting of a chain of linked Web pages, typically described using at least their URL and their name, and typically ending with the current page.\\n\\nThe [[position]] property is used to reconstruct the order of the items in a BreadcrumbList. The convention is that a breadcrumb list has an [[itemListOrder]] of [[ItemListOrderAscending]] (lower values listed first), and that the first items in this list correspond to the \"top\" or beginning of the breadcrumb trail, e.g. with a site or section homepage. The specific values of 'position' are not assigned meaning for a BreadcrumbList, but they should be integers, e.g. beginning with '1' for the first item in the list.\n      ",
    "parentTypes": [
      "https://schema.org/ItemList"
    ]
  },
  {
    "name": "Brewery",
    "type": "https://schema.org/Brewery",
    "source": "generated",
    "description": "Brewery.",
    "parentTypes": [
      "https://schema.org/FoodEstablishment"
    ]
  },
  {
    "name": "Bridge",
    "type": "https://schema.org/Bridge",
    "source": "generated",
    "description": "A bridge.",
    "parentTypes": [
      "https://schema.org/CivicStructure"
    ]
  },
  {
    "name": "BroadcastChannel",
    "type": "https://schema.org/BroadcastChannel",
    "source": "generated",
    "description": "A unique instance of a BroadcastService on a CableOrSatelliteService lineup.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "broadcastChannelId",
        "type": "https://schema.org/Text",
        "description": "The unique address by which the BroadcastService can be identified in a provider lineup. In US, this is typically a number.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/BroadcastChannel"
        ]
      },
      {
        "name": "broadcastFrequency",
        "type": [
          "https://schema.org/BroadcastFrequencySpecification",
          "https://schema.org/Text"
        ],
        "description": "The frequency used for over-the-air broadcasts. Numeric values or simple ranges, e.g. 87-99. In addition a shortcut idiom is supported for frequencies of AM and FM radio channels, e.g. \"87 FM\".",
        "expectedTypes": [
          "https://schema.org/BroadcastFrequencySpecification",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/BroadcastFrequencySpecification",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/BroadcastChannel",
          "https://schema.org/BroadcastService"
        ]
      },
      {
        "name": "broadcastServiceTier",
        "type": "https://schema.org/Text",
        "description": "The type of service required to have access to the channel (e.g. Standard or Premium).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/BroadcastChannel"
        ]
      },
      {
        "name": "genre",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "Genre of the creative work, broadcast channel or group.",
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
          "https://schema.org/BroadcastChannel",
          "https://schema.org/CreativeWork",
          "https://schema.org/MusicGroup"
        ]
      },
      {
        "name": "inBroadcastLineup",
        "type": "https://schema.org/CableOrSatelliteService",
        "description": "The CableOrSatelliteService offering the channel.",
        "expectedTypes": [
          "https://schema.org/CableOrSatelliteService"
        ],
        "rangeTypes": [
          "https://schema.org/CableOrSatelliteService"
        ],
        "domainTypes": [
          "https://schema.org/BroadcastChannel"
        ]
      },
      {
        "name": "providesBroadcastService",
        "type": "https://schema.org/BroadcastService",
        "description": "The BroadcastService offered on this channel.",
        "expectedTypes": [
          "https://schema.org/BroadcastService"
        ],
        "rangeTypes": [
          "https://schema.org/BroadcastService"
        ],
        "domainTypes": [
          "https://schema.org/BroadcastChannel"
        ],
        "inverseOf": "https://schema.org/hasBroadcastChannel"
      }
    ]
  },
  {
    "name": "BroadcastEvent",
    "type": "https://schema.org/BroadcastEvent",
    "source": "generated",
    "description": "An over the air or online broadcast event.",
    "parentTypes": [
      "https://schema.org/PublicationEvent"
    ],
    "properties": [
      {
        "name": "broadcastOfEvent",
        "type": "https://schema.org/Event",
        "description": "The event being broadcast such as a sporting event or awards ceremony.",
        "expectedTypes": [
          "https://schema.org/Event"
        ],
        "rangeTypes": [
          "https://schema.org/Event"
        ],
        "domainTypes": [
          "https://schema.org/BroadcastEvent"
        ]
      },
      {
        "name": "isLiveBroadcast",
        "type": "https://schema.org/Boolean",
        "description": "True if the broadcast is of a live event.",
        "expectedTypes": [
          "https://schema.org/Boolean"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean"
        ],
        "domainTypes": [
          "https://schema.org/BroadcastEvent"
        ]
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
      }
    ]
  },
  {
    "name": "BroadcastFrequencySpecification",
    "type": "https://schema.org/BroadcastFrequencySpecification",
    "source": "generated",
    "description": "The frequency in MHz and the modulation used for a particular BroadcastService.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "broadcastFrequencyValue",
        "type": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "description": "The frequency in MHz for a particular broadcast.",
        "expectedTypes": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/BroadcastFrequencySpecification"
        ]
      },
      {
        "name": "broadcastSignalModulation",
        "type": [
          "https://schema.org/QualitativeValue",
          "https://schema.org/Text"
        ],
        "description": "The modulation (e.g. FM, AM, etc) used by a particular broadcast service.",
        "expectedTypes": [
          "https://schema.org/QualitativeValue",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/QualitativeValue",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/BroadcastFrequencySpecification"
        ]
      },
      {
        "name": "broadcastSubChannel",
        "type": "https://schema.org/Text",
        "description": "The subchannel used for the broadcast.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/BroadcastFrequencySpecification"
        ]
      }
    ]
  },
  {
    "name": "BroadcastService",
    "type": "https://schema.org/BroadcastService",
    "source": "generated",
    "description": "A delivery service through which content is provided via broadcast over the air or online.",
    "parentTypes": [
      "https://schema.org/Service"
    ],
    "properties": [
      {
        "name": "area",
        "type": "https://schema.org/Place",
        "description": "The area within which users can expect to reach the broadcast service.",
        "expectedTypes": [
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/BroadcastService"
        ],
        "supersededBy": "https://schema.org/serviceArea"
      },
      {
        "name": "broadcastAffiliateOf",
        "type": "https://schema.org/Organization",
        "description": "The media network(s) whose content is broadcast on this station.",
        "expectedTypes": [
          "https://schema.org/Organization"
        ],
        "rangeTypes": [
          "https://schema.org/Organization"
        ],
        "domainTypes": [
          "https://schema.org/BroadcastService"
        ]
      },
      {
        "name": "broadcastDisplayName",
        "type": "https://schema.org/Text",
        "description": "The name displayed in the channel guide. For many US affiliates, it is the network name.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/BroadcastService"
        ]
      },
      {
        "name": "broadcaster",
        "type": "https://schema.org/Organization",
        "description": "The organization owning or operating the broadcast service.",
        "expectedTypes": [
          "https://schema.org/Organization"
        ],
        "rangeTypes": [
          "https://schema.org/Organization"
        ],
        "domainTypes": [
          "https://schema.org/BroadcastService"
        ]
      },
      {
        "name": "broadcastFrequency",
        "type": [
          "https://schema.org/BroadcastFrequencySpecification",
          "https://schema.org/Text"
        ],
        "description": "The frequency used for over-the-air broadcasts. Numeric values or simple ranges, e.g. 87-99. In addition a shortcut idiom is supported for frequencies of AM and FM radio channels, e.g. \"87 FM\".",
        "expectedTypes": [
          "https://schema.org/BroadcastFrequencySpecification",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/BroadcastFrequencySpecification",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/BroadcastChannel",
          "https://schema.org/BroadcastService"
        ]
      },
      {
        "name": "broadcastTimezone",
        "type": "https://schema.org/Text",
        "description": "The timezone in [ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601) for which the service bases its broadcasts.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/BroadcastService"
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
        "name": "hasBroadcastChannel",
        "type": "https://schema.org/BroadcastChannel",
        "description": "A broadcast channel of a broadcast service.",
        "expectedTypes": [
          "https://schema.org/BroadcastChannel"
        ],
        "rangeTypes": [
          "https://schema.org/BroadcastChannel"
        ],
        "domainTypes": [
          "https://schema.org/BroadcastService"
        ],
        "inverseOf": "https://schema.org/providesBroadcastService"
      },
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
        "name": "parentService",
        "type": "https://schema.org/BroadcastService",
        "description": "A broadcast service to which the broadcast service may belong to such as regional variations of a national channel.",
        "expectedTypes": [
          "https://schema.org/BroadcastService"
        ],
        "rangeTypes": [
          "https://schema.org/BroadcastService"
        ],
        "domainTypes": [
          "https://schema.org/BroadcastService"
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
      }
    ]
  },
  {
    "name": "BrokerageAccount",
    "type": "https://schema.org/BrokerageAccount",
    "source": "generated",
    "description": "An account that allows an investor to deposit funds and place investment orders with a licensed broker or brokerage firm.",
    "parentTypes": [
      "https://schema.org/InvestmentOrDeposit"
    ]
  },
  {
    "name": "BuddhistTemple",
    "type": "https://schema.org/BuddhistTemple",
    "source": "generated",
    "description": "A Buddhist temple.",
    "parentTypes": [
      "https://schema.org/PlaceOfWorship"
    ]
  },
  {
    "name": "BusinessAudience",
    "type": "https://schema.org/BusinessAudience",
    "source": "generated",
    "description": "A set of characteristics belonging to businesses, e.g. who compose an item's target audience.",
    "parentTypes": [
      "https://schema.org/Audience"
    ],
    "properties": [
      {
        "name": "numberOfEmployees",
        "type": "https://schema.org/QuantitativeValue",
        "description": "The number of employees in an organization, e.g. business.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/BusinessAudience",
          "https://schema.org/Organization"
        ]
      },
      {
        "name": "yearlyRevenue",
        "type": "https://schema.org/QuantitativeValue",
        "description": "The size of the business in annual revenue.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/BusinessAudience"
        ]
      },
      {
        "name": "yearsInOperation",
        "type": "https://schema.org/QuantitativeValue",
        "description": "The age of the business.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/BusinessAudience"
        ]
      }
    ]
  },
  {
    "name": "BusinessEntityType",
    "type": "https://schema.org/BusinessEntityType",
    "source": "generated",
    "description": "A business entity type is a conceptual entity representing the legal form, the size, the main line of business, the position in the value chain, or any combination thereof, of an organization or business person.\\n\\nCommonly used values:\\n\\n* http://purl.org/goodrelations/v1#Business\\n* http://purl.org/goodrelations/v1#Enduser\\n* http://purl.org/goodrelations/v1#PublicInstitution\\n* http://purl.org/goodrelations/v1#Reseller\n    ",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ]
  },
  {
    "name": "BusinessEvent",
    "type": "https://schema.org/BusinessEvent",
    "source": "generated",
    "description": "Event type: Business event.",
    "parentTypes": [
      "https://schema.org/Event"
    ]
  },
  {
    "name": "BusinessFunction",
    "type": "https://schema.org/BusinessFunction",
    "source": "generated",
    "description": "The business function specifies the type of activity or access (i.e., the bundle of rights) offered by the organization or business person through the offer. Typical are sell, rental or lease, maintenance or repair, manufacture / produce, recycle / dispose, engineering / construction, or installation. Proprietary specifications of access rights are also instances of this class.\\n\\nCommonly used values:\\n\\n* http://purl.org/goodrelations/v1#ConstructionInstallation\\n* http://purl.org/goodrelations/v1#Dispose\\n* http://purl.org/goodrelations/v1#LeaseOut\\n* http://purl.org/goodrelations/v1#Maintain\\n* http://purl.org/goodrelations/v1#ProvideService\\n* http://purl.org/goodrelations/v1#Repair\\n* http://purl.org/goodrelations/v1#Sell\\n* http://purl.org/goodrelations/v1#Buy\n        ",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ]
  },
  {
    "name": "BusOrCoach",
    "type": "https://schema.org/BusOrCoach",
    "source": "generated",
    "description": "A bus (also omnibus or autobus) is a road vehicle designed to carry passengers. Coaches are luxury buses, usually in service for long distance travel.",
    "parentTypes": [
      "https://schema.org/Vehicle"
    ],
    "properties": [
      {
        "name": "acrissCode",
        "type": "https://schema.org/Text",
        "description": "The ACRISS Car Classification Code is a code used by many car rental companies, for classifying vehicles. ACRISS stands for Association of Car Rental Industry Systems and Standards.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/BusOrCoach",
          "https://schema.org/Car"
        ]
      },
      {
        "name": "roofLoad",
        "type": "https://schema.org/QuantitativeValue",
        "description": "The permitted total weight of cargo and installations (e.g. a roof rack) on top of the vehicle.\\n\\nTypical unit code(s): KGM for kilogram, LBR for pound\\n\\n* Note 1: You can indicate additional information in the [[name]] of the [[QuantitativeValue]] node.\\n* Note 2: You may also link to a [[QualitativeValue]] node that provides additional information using [[valueReference]]\\n* Note 3: Note that you can use [[minValue]] and [[maxValue]] to indicate ranges.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/BusOrCoach",
          "https://schema.org/Car"
        ]
      }
    ]
  },
  {
    "name": "BusReservation",
    "type": "https://schema.org/BusReservation",
    "source": "generated",
    "description": "A reservation for bus travel. \\n\\nNote: This type is for information about actual reservations, e.g. in confirmation emails or HTML pages with individual confirmations of reservations. For offers of tickets, use [[Offer]].",
    "parentTypes": [
      "https://schema.org/Reservation"
    ]
  },
  {
    "name": "BusStation",
    "type": "https://schema.org/BusStation",
    "source": "generated",
    "description": "A bus station.",
    "parentTypes": [
      "https://schema.org/CivicStructure"
    ]
  },
  {
    "name": "BusStop",
    "type": "https://schema.org/BusStop",
    "source": "generated",
    "description": "A bus stop.",
    "parentTypes": [
      "https://schema.org/CivicStructure"
    ]
  },
  {
    "name": "BusTrip",
    "type": "https://schema.org/BusTrip",
    "source": "generated",
    "description": "A trip on a commercial bus line.",
    "parentTypes": [
      "https://schema.org/Trip"
    ],
    "properties": [
      {
        "name": "arrivalBusStop",
        "type": [
          "https://schema.org/BusStation",
          "https://schema.org/BusStop"
        ],
        "description": "The stop or station from which the bus arrives.",
        "expectedTypes": [
          "https://schema.org/BusStation",
          "https://schema.org/BusStop"
        ],
        "rangeTypes": [
          "https://schema.org/BusStation",
          "https://schema.org/BusStop"
        ],
        "domainTypes": [
          "https://schema.org/BusTrip"
        ]
      },
      {
        "name": "busName",
        "type": "https://schema.org/Text",
        "description": "The name of the bus (e.g. Bolt Express).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/BusTrip"
        ]
      },
      {
        "name": "busNumber",
        "type": "https://schema.org/Text",
        "description": "The unique identifier for the bus.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/BusTrip"
        ]
      },
      {
        "name": "departureBusStop",
        "type": [
          "https://schema.org/BusStation",
          "https://schema.org/BusStop"
        ],
        "description": "The stop or station from which the bus departs.",
        "expectedTypes": [
          "https://schema.org/BusStation",
          "https://schema.org/BusStop"
        ],
        "rangeTypes": [
          "https://schema.org/BusStation",
          "https://schema.org/BusStop"
        ],
        "domainTypes": [
          "https://schema.org/BusTrip"
        ]
      }
    ]
  },
  {
    "name": "BuyAction",
    "type": "https://schema.org/BuyAction",
    "source": "generated",
    "description": "The act of giving money to a seller in exchange for goods or services rendered. An agent buys an object, product, or service from a seller for a price. Reciprocal of SellAction.",
    "parentTypes": [
      "https://schema.org/TradeAction"
    ],
    "properties": [
      {
        "name": "seller",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "An entity which offers (sells / leases / lends / loans) the services / goods.  A seller may also be a provider.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/BuyAction",
          "https://schema.org/Demand",
          "https://schema.org/Flight",
          "https://schema.org/Offer",
          "https://schema.org/Order"
        ]
      },
      {
        "name": "vendor",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "'vendor' is an earlier term for 'seller'.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/BuyAction"
        ],
        "supersededBy": "https://schema.org/seller"
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
    "name": "CableOrSatelliteService",
    "type": "https://schema.org/CableOrSatelliteService",
    "source": "generated",
    "description": "A service which provides access to media programming like TV or radio. Access may be via cable or satellite.",
    "parentTypes": [
      "https://schema.org/Service"
    ]
  },
  {
    "name": "CafeOrCoffeeShop",
    "type": "https://schema.org/CafeOrCoffeeShop",
    "source": "generated",
    "description": "A cafe or coffee shop.",
    "parentTypes": [
      "https://schema.org/FoodEstablishment"
    ]
  },
  {
    "name": "Campground",
    "type": "https://schema.org/Campground",
    "source": "generated",
    "description": "A camping site, campsite, or [[Campground]] is a place used for overnight stay in the outdoors, typically containing individual [[CampingPitch]] locations. \\n\\n\nIn British English a campsite is an area, usually divided into a number of pitches, where people can camp overnight using tents or camper vans or caravans; this British English use of the word is synonymous with the American English expression campground. In American English the term campsite generally means an area where an individual, family, group, or military unit can pitch a tent or park a camper; a campground may contain many campsites (source: Wikipedia, see [https://en.wikipedia.org/wiki/Campsite](https://en.wikipedia.org/wiki/Campsite)).\\n\\n\n\nSee also the dedicated [document on the use of schema.org for marking up hotels and other forms of accommodations](/docs/hotels.html).\n",
    "parentTypes": [
      "https://schema.org/CivicStructure",
      "https://schema.org/LodgingBusiness"
    ]
  },
  {
    "name": "CampingPitch",
    "type": "https://schema.org/CampingPitch",
    "source": "generated",
    "description": "A [[CampingPitch]] is an individual place for overnight stay in the outdoors, typically being part of a larger camping site, or [[Campground]].\\n\\n\nIn British English a campsite, or campground, is an area, usually divided into a number of pitches, where people can camp overnight using tents or camper vans or caravans; this British English use of the word is synonymous with the American English expression campground. In American English the term campsite generally means an area where an individual, family, group, or military unit can pitch a tent or park a camper; a campground may contain many campsites.\n(Source: Wikipedia, see [https://en.wikipedia.org/wiki/Campsite](https://en.wikipedia.org/wiki/Campsite).)\\n\\n\nSee also the dedicated [document on the use of schema.org for marking up hotels and other forms of accommodations](/docs/hotels.html).\n",
    "parentTypes": [
      "https://schema.org/Accommodation"
    ]
  },
  {
    "name": "Canal",
    "type": "https://schema.org/Canal",
    "source": "generated",
    "description": "A canal, like the Panama Canal.",
    "parentTypes": [
      "https://schema.org/BodyOfWater"
    ]
  },
  {
    "name": "CancelAction",
    "type": "https://schema.org/CancelAction",
    "source": "generated",
    "description": "The act of asserting that a future event/action is no longer going to happen.\\n\\nRelated actions:\\n\\n* [[ConfirmAction]]: The antonym of CancelAction.",
    "parentTypes": [
      "https://schema.org/PlanAction"
    ]
  },
  {
    "name": "Car",
    "type": "https://schema.org/Car",
    "source": "generated",
    "description": "A car is a wheeled, self-powered motor vehicle used for transportation.",
    "parentTypes": [
      "https://schema.org/Vehicle"
    ],
    "properties": [
      {
        "name": "acrissCode",
        "type": "https://schema.org/Text",
        "description": "The ACRISS Car Classification Code is a code used by many car rental companies, for classifying vehicles. ACRISS stands for Association of Car Rental Industry Systems and Standards.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/BusOrCoach",
          "https://schema.org/Car"
        ]
      },
      {
        "name": "roofLoad",
        "type": "https://schema.org/QuantitativeValue",
        "description": "The permitted total weight of cargo and installations (e.g. a roof rack) on top of the vehicle.\\n\\nTypical unit code(s): KGM for kilogram, LBR for pound\\n\\n* Note 1: You can indicate additional information in the [[name]] of the [[QuantitativeValue]] node.\\n* Note 2: You may also link to a [[QualitativeValue]] node that provides additional information using [[valueReference]]\\n* Note 3: Note that you can use [[minValue]] and [[maxValue]] to indicate ranges.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/BusOrCoach",
          "https://schema.org/Car"
        ]
      }
    ]
  },
  {
    "name": "CarUsageType",
    "type": "https://schema.org/CarUsageType",
    "source": "generated",
    "description": "A value indicating a special usage of a car, e.g. commercial rental, driving school, or as a taxi.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "DrivingSchoolVehicleUsage",
        "type": "https://schema.org/DrivingSchoolVehicleUsage",
        "description": "Indicates the usage of the vehicle for driving school."
      },
      {
        "name": "RentalVehicleUsage",
        "type": "https://schema.org/RentalVehicleUsage",
        "description": "Indicates the usage of the vehicle as a rental car."
      },
      {
        "name": "TaxiVehicleUsage",
        "type": "https://schema.org/TaxiVehicleUsage",
        "description": "Indicates the usage of the car as a taxi."
      }
    ]
  },
  {
    "name": "Casino",
    "type": "https://schema.org/Casino",
    "source": "generated",
    "description": "A casino.",
    "parentTypes": [
      "https://schema.org/EntertainmentBusiness"
    ]
  },
  {
    "name": "Catalog",
    "type": "http://www.w3.org/ns/dcat#Catalog",
    "source": "generated"
  },
  {
    "name": "CategoryCode",
    "type": "https://schema.org/CategoryCode",
    "source": "generated",
    "description": "A Category Code.",
    "parentTypes": [
      "https://schema.org/DefinedTerm"
    ],
    "properties": [
      {
        "name": "codeValue",
        "type": "https://schema.org/Text",
        "description": "A short textual code that uniquely identifies the value.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/CategoryCode",
          "https://schema.org/MedicalCode"
        ]
      },
      {
        "name": "inCodeSet",
        "type": [
          "https://schema.org/CategoryCodeSet",
          "https://schema.org/URL"
        ],
        "description": "A [[CategoryCodeSet]] that contains this category code.",
        "expectedTypes": [
          "https://schema.org/CategoryCodeSet",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/CategoryCodeSet",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/CategoryCode"
        ]
      }
    ]
  },
  {
    "name": "CategoryCodeSet",
    "type": "https://schema.org/CategoryCodeSet",
    "source": "generated",
    "description": "A set of Category Code values.",
    "parentTypes": [
      "https://schema.org/DefinedTermSet"
    ],
    "properties": [
      {
        "name": "hasCategoryCode",
        "type": "https://schema.org/CategoryCode",
        "description": "A Category code contained in this code set.",
        "expectedTypes": [
          "https://schema.org/CategoryCode"
        ],
        "rangeTypes": [
          "https://schema.org/CategoryCode"
        ],
        "domainTypes": [
          "https://schema.org/CategoryCodeSet"
        ]
      }
    ]
  },
  {
    "name": "CatholicChurch",
    "type": "https://schema.org/CatholicChurch",
    "source": "generated",
    "description": "A Catholic church.",
    "parentTypes": [
      "https://schema.org/Church"
    ]
  },
  {
    "name": "CDCPMDRecord",
    "type": "https://schema.org/CDCPMDRecord",
    "source": "generated",
    "description": "A CDCPMDRecord is a data structure representing a record in a CDC tabular data format\n      used for hospital data reporting. See [documentation](/docs/cdc-covid.html) for details, and the linked CDC materials for authoritative\n      definitions used as the source here.\n      ",
    "parentTypes": [
      "https://schema.org/StructuredValue"
    ],
    "properties": [
      {
        "name": "cvdCollectionDate",
        "type": [
          "https://schema.org/DateTime",
          "https://schema.org/Text"
        ],
        "description": "collectiondate - Date for which patient counts are reported.",
        "expectedTypes": [
          "https://schema.org/DateTime",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/DateTime",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/CDCPMDRecord"
        ]
      },
      {
        "name": "cvdFacilityCounty",
        "type": "https://schema.org/Text",
        "description": "Name of the County of the NHSN facility that this data record applies to. Use [[cvdFacilityId]] to identify the facility. To provide other details, [[healthcareReportingData]] can be used on a [[Hospital]] entry.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/CDCPMDRecord"
        ]
      },
      {
        "name": "cvdFacilityId",
        "type": "https://schema.org/Text",
        "description": "Identifier of the NHSN facility that this data record applies to. Use [[cvdFacilityCounty]] to indicate the county. To provide other details, [[healthcareReportingData]] can be used on a [[Hospital]] entry.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/CDCPMDRecord"
        ]
      },
      {
        "name": "cvdNumBeds",
        "type": "https://schema.org/Number",
        "description": "numbeds - HOSPITAL INPATIENT BEDS: Inpatient beds, including all staffed, licensed, and overflow (surge) beds used for inpatients.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/CDCPMDRecord"
        ]
      },
      {
        "name": "cvdNumBedsOcc",
        "type": "https://schema.org/Number",
        "description": "numbedsocc - HOSPITAL INPATIENT BED OCCUPANCY: Total number of staffed inpatient beds that are occupied.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/CDCPMDRecord"
        ]
      },
      {
        "name": "cvdNumC19Died",
        "type": "https://schema.org/Number",
        "description": "numc19died - DEATHS: Patients with suspected or confirmed COVID-19 who died in the hospital, ED, or any overflow location.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/CDCPMDRecord"
        ]
      },
      {
        "name": "cvdNumC19HOPats",
        "type": "https://schema.org/Number",
        "description": "numc19hopats - HOSPITAL ONSET: Patients hospitalized in an NHSN inpatient care location with onset of suspected or confirmed COVID-19 14 or more days after hospitalization.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/CDCPMDRecord"
        ]
      },
      {
        "name": "cvdNumC19HospPats",
        "type": "https://schema.org/Number",
        "description": "numc19hosppats - HOSPITALIZED: Patients currently hospitalized in an inpatient care location who have suspected or confirmed COVID-19.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/CDCPMDRecord"
        ]
      },
      {
        "name": "cvdNumC19MechVentPats",
        "type": "https://schema.org/Number",
        "description": "numc19mechventpats - HOSPITALIZED and VENTILATED: Patients hospitalized in an NHSN inpatient care location who have suspected or confirmed COVID-19 and are on a mechanical ventilator.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/CDCPMDRecord"
        ]
      },
      {
        "name": "cvdNumC19OFMechVentPats",
        "type": "https://schema.org/Number",
        "description": "numc19ofmechventpats - ED/OVERFLOW and VENTILATED: Patients with suspected or confirmed COVID-19 who are in the ED or any overflow location awaiting an inpatient bed and on a mechanical ventilator.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/CDCPMDRecord"
        ]
      },
      {
        "name": "cvdNumC19OverflowPats",
        "type": "https://schema.org/Number",
        "description": "numc19overflowpats - ED/OVERFLOW: Patients with suspected or confirmed COVID-19 who are in the ED or any overflow location awaiting an inpatient bed.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/CDCPMDRecord"
        ]
      },
      {
        "name": "cvdNumICUBeds",
        "type": "https://schema.org/Number",
        "description": "numicubeds - ICU BEDS: Total number of staffed inpatient intensive care unit (ICU) beds.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/CDCPMDRecord"
        ]
      },
      {
        "name": "cvdNumICUBedsOcc",
        "type": "https://schema.org/Number",
        "description": "numicubedsocc - ICU BED OCCUPANCY: Total number of staffed inpatient ICU beds that are occupied.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/CDCPMDRecord"
        ]
      },
      {
        "name": "cvdNumTotBeds",
        "type": "https://schema.org/Number",
        "description": "numtotbeds - ALL HOSPITAL BEDS: Total number of all inpatient and outpatient beds, including all staffed, ICU, licensed, and overflow (surge) beds used for inpatients or outpatients.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/CDCPMDRecord"
        ]
      },
      {
        "name": "cvdNumVent",
        "type": "https://schema.org/Number",
        "description": "numvent - MECHANICAL VENTILATORS: Total number of ventilators available.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/CDCPMDRecord"
        ]
      },
      {
        "name": "cvdNumVentUse",
        "type": "https://schema.org/Number",
        "description": "numventuse - MECHANICAL VENTILATORS IN USE: Total number of ventilators in use.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/CDCPMDRecord"
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
      }
    ]
  },
  {
    "name": "Cemetery",
    "type": "https://schema.org/Cemetery",
    "source": "generated",
    "description": "A graveyard.",
    "parentTypes": [
      "https://schema.org/CivicStructure"
    ]
  },
  {
    "name": "Certificate",
    "type": "https://spec.edmcouncil.org/fibo/ontology/FND/Arrangements/Documents/Certificate",
    "source": "generated"
  },
  {
    "name": "Certification",
    "type": "https://schema.org/Certification",
    "source": "generated",
    "description": "A Certification is an official and authoritative statement about a subject, for example a product, service, person, or organization. A certification is typically issued by an indendent certification body, for example a professional organization or government. It formally attests certain characteristics about the subject, for example Organizations can be ISO certified, Food products can be certified Organic or Vegan, a Person can be a certified professional, a Place can be certified for food processing. There are certifications for many domains: regulatory, organizational, recycling, food, efficiency, educational, ecological, etc. A certification is a form of credential, as are accreditations and licenses. Mapped from the [gs1:CertificationDetails](https://www.gs1.org/voc/CertificationDetails) class in the GS1 Web Vocabulary.",
    "parentTypes": [
      "https://schema.org/CreativeWork",
      "https://spec.edmcouncil.org/fibo/ontology/FND/Arrangements/Documents/Certificate"
    ],
    "properties": [
      {
        "name": "about",
        "type": "https://schema.org/Thing",
        "description": "The subject matter of an object.",
        "expectedTypes": [
          "https://schema.org/Thing"
        ],
        "rangeTypes": [
          "https://schema.org/Thing"
        ],
        "domainTypes": [
          "https://schema.org/Certification",
          "https://schema.org/CommunicateAction",
          "https://schema.org/CreativeWork",
          "https://schema.org/DefinedTerm",
          "https://schema.org/DefinedTermSet",
          "https://schema.org/Event"
        ],
        "inverseOf": "https://schema.org/subjectOf"
      },
      {
        "name": "auditDate",
        "type": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "description": "Date when a certification was last audited. See also  [gs1:certificationAuditDate](https://www.gs1.org/voc/certificationAuditDate).",
        "expectedTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/Certification"
        ]
      },
      {
        "name": "certificationIdentification",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text"
        ],
        "description": "Identifier of a certification instance (as registered with an independent certification body). Typically this identifier can be used to consult and verify the certification instance. See also [gs1:certificationIdentification](https://www.gs1.org/voc/certificationIdentification).",
        "expectedTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Certification"
        ]
      },
      {
        "name": "certificationRating",
        "type": "https://schema.org/Rating",
        "description": "Rating of a certification instance (as defined by an independent certification body). Typically this rating can be used to rate the level to which the requirements of the certification instance are fulfilled. See also [gs1:certificationValue](https://www.gs1.org/voc/certificationValue).",
        "expectedTypes": [
          "https://schema.org/Rating"
        ],
        "rangeTypes": [
          "https://schema.org/Rating"
        ],
        "domainTypes": [
          "https://schema.org/Certification"
        ]
      },
      {
        "name": "certificationStatus",
        "type": "https://schema.org/CertificationStatusEnumeration",
        "description": "Indicates the current status of a certification: active or inactive. See also  [gs1:certificationStatus](https://www.gs1.org/voc/certificationStatus).",
        "expectedTypes": [
          "https://schema.org/CertificationStatusEnumeration"
        ],
        "rangeTypes": [
          "https://schema.org/CertificationStatusEnumeration"
        ],
        "domainTypes": [
          "https://schema.org/Certification"
        ]
      },
      {
        "name": "datePublished",
        "type": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "description": "Date of first publication or broadcast. For example the date a [[CreativeWork]] was broadcast or a [[Certification]] was issued.",
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
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "expires",
        "type": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "description": "Date the content expires and is no longer useful or available. For example a [[VideoObject]] or [[NewsArticle]] whose availability or relevance is time-limited, a [[ClaimReview]] fact check whose publisher wants to indicate that it may no longer be relevant (or helpful to highlight) after some date, or a [[Certification]] the validity has expired.",
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
          "https://schema.org/CreativeWork"
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
        "name": "validIn",
        "type": "https://schema.org/AdministrativeArea",
        "description": "The geographic area where the item is valid. Applies for example to a [[Permit]], a [[Certification]], or an [[EducationalOccupationalCredential]]. ",
        "expectedTypes": [
          "https://schema.org/AdministrativeArea"
        ],
        "rangeTypes": [
          "https://schema.org/AdministrativeArea"
        ],
        "domainTypes": [
          "https://schema.org/Certification",
          "https://schema.org/Credential",
          "https://schema.org/Permit"
        ]
      }
    ]
  },
  {
    "name": "CertificationDetails",
    "type": "https://ref.gs1.org/voc/CertificationDetails",
    "source": "generated"
  },
  {
    "name": "CertificationStatusEnumeration",
    "type": "https://schema.org/CertificationStatusEnumeration",
    "source": "generated",
    "description": "Enumerates the different statuses of a Certification (Active and Inactive).",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "CertificationActive",
        "type": "https://schema.org/CertificationActive",
        "description": "Specifies that a certification is active."
      },
      {
        "name": "CertificationInactive",
        "type": "https://schema.org/CertificationInactive",
        "description": "Specifies that a certification is inactive (no longer in effect)."
      }
    ]
  },
  {
    "name": "Chapter",
    "type": "https://schema.org/Chapter",
    "source": "generated",
    "description": "One of the sections into which a book is divided. A chapter usually has a section number or a name.",
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
      }
    ]
  },
  {
    "name": "CheckAction",
    "type": "https://schema.org/CheckAction",
    "source": "generated",
    "description": "An agent inspects, determines, investigates, inquires, or examines an object's accuracy, quality, condition, or state.",
    "parentTypes": [
      "https://schema.org/FindAction"
    ]
  },
  {
    "name": "CheckInAction",
    "type": "https://schema.org/CheckInAction",
    "source": "generated",
    "description": "The act of an agent communicating (service provider, social media, etc) their arrival by registering/confirming for a previously reserved service (e.g. flight check-in) or at a place (e.g. hotel), possibly resulting in a result (boarding pass, etc).\\n\\nRelated actions:\\n\\n* [[CheckOutAction]]: The antonym of CheckInAction.\\n* [[ArriveAction]]: Unlike ArriveAction, CheckInAction implies that the agent is informing/confirming the start of a previously reserved service.\\n* [[ConfirmAction]]: Unlike ConfirmAction, CheckInAction implies that the agent is informing/confirming the *start* of a previously reserved service rather than its validity/existence.",
    "parentTypes": [
      "https://schema.org/CommunicateAction"
    ]
  },
  {
    "name": "CheckOutAction",
    "type": "https://schema.org/CheckOutAction",
    "source": "generated",
    "description": "The act of an agent communicating (service provider, social media, etc) their departure of a previously reserved service (e.g. flight check-in) or place (e.g. hotel).\\n\\nRelated actions:\\n\\n* [[CheckInAction]]: The antonym of CheckOutAction.\\n* [[DepartAction]]: Unlike DepartAction, CheckOutAction implies that the agent is informing/confirming the end of a previously reserved service.\\n* [[CancelAction]]: Unlike CancelAction, CheckOutAction implies that the agent is informing/confirming the end of a previously reserved service.",
    "parentTypes": [
      "https://schema.org/CommunicateAction"
    ]
  },
  {
    "name": "CheckoutPage",
    "type": "https://schema.org/CheckoutPage",
    "source": "generated",
    "description": "Web page type: Checkout page.",
    "parentTypes": [
      "https://schema.org/WebPage"
    ]
  },
  {
    "name": "ChemicalSubstance",
    "type": "https://schema.org/ChemicalSubstance",
    "source": "generated",
    "description": "A chemical substance is 'a portion of matter of constant composition, composed of molecular entities of the same type or of different types' (source: [ChEBI:59999](https://www.ebi.ac.uk/chebi/searchId.do?chebiId=59999)).",
    "parentTypes": [
      "https://schema.org/BioChemEntity"
    ],
    "properties": [
      {
        "name": "chemicalComposition",
        "type": "https://schema.org/Text",
        "description": "The chemical composition describes the identity and relative ratio of the chemical elements that make up the substance.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/ChemicalSubstance"
        ]
      },
      {
        "name": "chemicalRole",
        "type": "https://schema.org/DefinedTerm",
        "description": "A role played by the BioChemEntity within a chemical context.",
        "expectedTypes": [
          "https://schema.org/DefinedTerm"
        ],
        "rangeTypes": [
          "https://schema.org/DefinedTerm"
        ],
        "domainTypes": [
          "https://schema.org/ChemicalSubstance",
          "https://schema.org/MolecularEntity"
        ]
      },
      {
        "name": "potentialUse",
        "type": "https://schema.org/DefinedTerm",
        "description": "Intended use of the BioChemEntity by humans.",
        "expectedTypes": [
          "https://schema.org/DefinedTerm"
        ],
        "rangeTypes": [
          "https://schema.org/DefinedTerm"
        ],
        "domainTypes": [
          "https://schema.org/ChemicalSubstance",
          "https://schema.org/MolecularEntity"
        ]
      }
    ]
  },
  {
    "name": "ChildCare",
    "type": "https://schema.org/ChildCare",
    "source": "generated",
    "description": "A Childcare center.",
    "parentTypes": [
      "https://schema.org/LocalBusiness"
    ]
  },
  {
    "name": "ChildrensEvent",
    "type": "https://schema.org/ChildrensEvent",
    "source": "generated",
    "description": "Event type: Children's event.",
    "parentTypes": [
      "https://schema.org/Event"
    ]
  },
  {
    "name": "ChooseAction",
    "type": "https://schema.org/ChooseAction",
    "source": "generated",
    "description": "The act of expressing a preference from a set of options or a large or unbounded set of choices/options.",
    "parentTypes": [
      "https://schema.org/AssessAction"
    ],
    "properties": [
      {
        "name": "actionOption",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/Thing"
        ],
        "description": "A sub property of object. The options subject to this action.",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/Thing"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/Thing"
        ],
        "domainTypes": [
          "https://schema.org/ChooseAction"
        ]
      },
      {
        "name": "option",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/Thing"
        ],
        "description": "A sub property of object. The options subject to this action.",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/Thing"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/Thing"
        ],
        "domainTypes": [
          "https://schema.org/ChooseAction"
        ],
        "supersededBy": "https://schema.org/actionOption"
      }
    ]
  },
  {
    "name": "Church",
    "type": "https://schema.org/Church",
    "source": "generated",
    "description": "A church.",
    "parentTypes": [
      "https://schema.org/PlaceOfWorship"
    ]
  },
  {
    "name": "City",
    "type": "https://schema.org/City",
    "source": "generated",
    "description": "A city or town.",
    "parentTypes": [
      "https://schema.org/AdministrativeArea"
    ]
  },
  {
    "name": "CityHall",
    "type": "https://schema.org/CityHall",
    "source": "generated",
    "description": "A city hall.",
    "parentTypes": [
      "https://schema.org/GovernmentBuilding"
    ]
  },
  {
    "name": "CivicStructure",
    "type": "https://schema.org/CivicStructure",
    "source": "generated",
    "description": "A public structure, such as a town hall or concert hall.",
    "parentTypes": [
      "https://schema.org/Place"
    ],
    "properties": [
      {
        "name": "openingHours",
        "type": "https://schema.org/Text",
        "description": "The general opening hours for a business. Opening hours can be specified as a weekly time range, starting with days, then times per day. Multiple days can be listed with commas ',' separating each day. Day or time ranges are specified using a hyphen '-'.\\n\\n* Days are specified using the following two-letter combinations: ```Mo```, ```Tu```, ```We```, ```Th```, ```Fr```, ```Sa```, ```Su```.\\n* Times are specified using 24:00 format. For example, 3pm is specified as ```15:00```, 10am as ```10:00```. \\n* Here is an example: <code>&lt;time itemprop=\"openingHours\" datetime=&quot;Tu,Th 16:00-20:00&quot;&gt;Tuesdays and Thursdays 4-8pm&lt;/time&gt;</code>.\\n* If a business is open 7 days a week, then it can be specified as <code>&lt;time itemprop=&quot;openingHours&quot; datetime=&quot;Mo-Su&quot;&gt;Monday through Sunday, all day&lt;/time&gt;</code>.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/CivicStructure",
          "https://schema.org/LocalBusiness"
        ]
      }
    ]
  },
  {
    "name": "Claim",
    "type": "https://schema.org/Claim",
    "source": "generated",
    "description": "A [[Claim]] in Schema.org represents a specific, factually-oriented claim that could be the [[itemReviewed]] in a [[ClaimReview]]. The content of a claim can be summarized with the [[text]] property. Variations on well known claims can have their common identity indicated via [[sameAs]] links, and summarized with a [[name]]. Ideally, a [[Claim]] description includes enough contextual information to minimize the risk of ambiguity or inclarity. In practice, many claims are better understood in the context in which they appear or the interpretations provided by claim reviews.\n\n  Beyond [[ClaimReview]], the Claim type can be associated with related creative works - for example a [[ScholarlyArticle]] or [[Question]] might be [[about]] some [[Claim]].\n\n  At this time, Schema.org does not define any types of relationship between claims. This is a natural area for future exploration.\n  ",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ],
    "properties": [
      {
        "name": "appearance",
        "type": "https://schema.org/CreativeWork",
        "description": "Indicates an occurrence of a [[Claim]] in some [[CreativeWork]].",
        "expectedTypes": [
          "https://schema.org/CreativeWork"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork"
        ],
        "domainTypes": [
          "https://schema.org/Claim"
        ]
      },
      {
        "name": "claimInterpreter",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "For a [[Claim]] interpreted from [[MediaObject]] content, the [[interpretedAsClaim]] property can be used to indicate a claim contained, implied or refined from the content of a [[MediaObject]].",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Claim"
        ]
      },
      {
        "name": "firstAppearance",
        "type": "https://schema.org/CreativeWork",
        "description": "Indicates the first known occurrence of a [[Claim]] in some [[CreativeWork]].",
        "expectedTypes": [
          "https://schema.org/CreativeWork"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork"
        ],
        "domainTypes": [
          "https://schema.org/Claim"
        ]
      }
    ]
  },
  {
    "name": "ClaimReview",
    "type": "https://schema.org/ClaimReview",
    "source": "generated",
    "description": "A fact-checking review of claims made (or reported) in some creative work (referenced via itemReviewed).",
    "parentTypes": [
      "https://schema.org/Review"
    ],
    "properties": [
      {
        "name": "claimReviewed",
        "type": "https://schema.org/Text",
        "description": "A short summary of the specific claims reviewed in a ClaimReview.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/ClaimReview"
        ]
      }
    ]
  },
  {
    "name": "Class",
    "type": "https://schema.org/Class",
    "source": "generated",
    "description": "A class, also often called a 'Type'; equivalent to rdfs:Class.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
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
    "name": "Classifier",
    "type": "https://www.omg.org/spec/Commons/Classifiers/Classifier",
    "source": "generated"
  },
  {
    "name": "Clip",
    "type": "https://schema.org/Clip",
    "source": "generated",
    "description": "A short TV or radio program or a segment/part of a program.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
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
        "name": "clipNumber",
        "type": [
          "https://schema.org/Integer",
          "https://schema.org/Text"
        ],
        "description": "Position of the clip within an ordered group of clips.",
        "expectedTypes": [
          "https://schema.org/Integer",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Integer",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Clip"
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
        "name": "endOffset",
        "type": [
          "https://schema.org/HyperTocEntry",
          "https://schema.org/Number"
        ],
        "description": "The end time of the clip expressed as the number of seconds from the beginning of the work.",
        "expectedTypes": [
          "https://schema.org/HyperTocEntry",
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/HyperTocEntry",
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/Clip"
        ]
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
        "name": "partOfEpisode",
        "type": "https://schema.org/Episode",
        "description": "The episode to which this clip belongs.",
        "expectedTypes": [
          "https://schema.org/Episode"
        ],
        "rangeTypes": [
          "https://schema.org/Episode"
        ],
        "domainTypes": [
          "https://schema.org/Clip"
        ]
      },
      {
        "name": "partOfSeason",
        "type": "https://schema.org/CreativeWorkSeason",
        "description": "The season to which this episode belongs.",
        "expectedTypes": [
          "https://schema.org/CreativeWorkSeason"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWorkSeason"
        ],
        "domainTypes": [
          "https://schema.org/Clip",
          "https://schema.org/Episode"
        ]
      },
      {
        "name": "partOfSeries",
        "type": "https://schema.org/CreativeWorkSeries",
        "description": "The series to which this episode or season belongs.",
        "expectedTypes": [
          "https://schema.org/CreativeWorkSeries"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWorkSeries"
        ],
        "domainTypes": [
          "https://schema.org/Clip",
          "https://schema.org/CreativeWorkSeason",
          "https://schema.org/Episode"
        ]
      },
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
    "name": "ClothingStore",
    "type": "https://schema.org/ClothingStore",
    "source": "generated",
    "description": "A clothing store.",
    "parentTypes": [
      "https://schema.org/Store"
    ]
  },
  {
    "name": "Code",
    "type": "https://schema.org/Code",
    "source": "generated",
    "description": "Computer programming source code. Example: Full (compile ready) solutions, code snippet samples, scripts, templates.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ]
  },
  {
    "name": "Collection",
    "type": "https://www.omg.org/spec/Commons/Collections/Collection",
    "source": "generated"
  },
  {
    "name": "Collection",
    "type": "https://schema.org/Collection",
    "source": "generated",
    "description": "A collection of items, e.g. creative works or products.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ],
    "properties": [
      {
        "name": "collectionSize",
        "type": "https://schema.org/Integer",
        "description": "The number of items in the [[Collection]].",
        "expectedTypes": [
          "https://schema.org/Integer"
        ],
        "rangeTypes": [
          "https://schema.org/Integer"
        ],
        "domainTypes": [
          "https://schema.org/Collection"
        ]
      }
    ]
  },
  {
    "name": "CollectionPage",
    "type": "https://schema.org/CollectionPage",
    "source": "generated",
    "description": "Web page type: Collection page.",
    "parentTypes": [
      "https://schema.org/WebPage"
    ]
  },
  {
    "name": "CollegeOrUniversity",
    "type": "https://schema.org/CollegeOrUniversity",
    "source": "generated",
    "description": "A college, university, or other third-level educational institution.",
    "parentTypes": [
      "https://schema.org/EducationalOrganization"
    ]
  },
  {
    "name": "ComedyClub",
    "type": "https://schema.org/ComedyClub",
    "source": "generated",
    "description": "A comedy club.",
    "parentTypes": [
      "https://schema.org/EntertainmentBusiness"
    ]
  },
  {
    "name": "ComedyEvent",
    "type": "https://schema.org/ComedyEvent",
    "source": "generated",
    "description": "Event type: Comedy event.",
    "parentTypes": [
      "https://schema.org/Event"
    ]
  },
  {
    "name": "ComicCoverArt",
    "type": "https://schema.org/ComicCoverArt",
    "source": "generated",
    "description": "The artwork on the cover of a comic.",
    "parentTypes": [
      "https://schema.org/ComicStory",
      "https://schema.org/CoverArt"
    ]
  },
  {
    "name": "ComicIssue",
    "type": "https://schema.org/ComicIssue",
    "source": "generated",
    "description": "Individual comic issues are serially published as\n    \tpart of a larger series. For the sake of consistency, even one-shot issues\n    \tbelong to a series comprised of a single issue. All comic issues can be\n    \tuniquely identified by: the combination of the name and volume number of the\n    \tseries to which the issue belongs; the issue number; and the variant\n    \tdescription of the issue (if any).",
    "parentTypes": [
      "https://schema.org/PublicationIssue"
    ],
    "properties": [
      {
        "name": "artist",
        "type": "https://schema.org/Person",
        "description": "The primary artist for a work\n    \tin a medium other than pencils or digital line art--for example, if the\n    \tprimary artwork is done in watercolors or digital paints.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/ComicIssue",
          "https://schema.org/ComicStory",
          "https://schema.org/VisualArtwork"
        ]
      },
      {
        "name": "colorist",
        "type": "https://schema.org/Person",
        "description": "The individual who adds color to inked drawings.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/ComicIssue",
          "https://schema.org/ComicStory",
          "https://schema.org/VisualArtwork"
        ]
      },
      {
        "name": "inker",
        "type": "https://schema.org/Person",
        "description": "The individual who traces over the pencil drawings in ink after pencils are complete.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/ComicIssue",
          "https://schema.org/ComicStory",
          "https://schema.org/VisualArtwork"
        ]
      },
      {
        "name": "letterer",
        "type": "https://schema.org/Person",
        "description": "The individual who adds lettering, including speech balloons and sound effects, to artwork.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/ComicIssue",
          "https://schema.org/ComicStory",
          "https://schema.org/VisualArtwork"
        ]
      },
      {
        "name": "penciler",
        "type": "https://schema.org/Person",
        "description": "The individual who draws the primary narrative artwork.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/ComicIssue",
          "https://schema.org/ComicStory",
          "https://schema.org/VisualArtwork"
        ]
      },
      {
        "name": "variantCover",
        "type": "https://schema.org/Text",
        "description": "A description of the variant cover\n    \tfor the issue, if the issue is a variant printing. For example, \"Bryan Hitch\n    \tVariant Cover\" or \"2nd Printing Variant\".",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/ComicIssue"
        ]
      }
    ]
  },
  {
    "name": "ComicSeries",
    "type": "https://schema.org/ComicSeries",
    "source": "generated",
    "description": "A sequential publication of comic stories under a\n    \tunifying title, for example \"The Amazing Spider-Man\" or \"Groo the\n    \tWanderer\".",
    "parentTypes": [
      "https://schema.org/Periodical"
    ]
  },
  {
    "name": "ComicStory",
    "type": "https://schema.org/ComicStory",
    "source": "generated",
    "description": "The term \"story\" is any indivisible, re-printable\n    \tunit of a comic, including the interior stories, covers, and backmatter. Most\n    \tcomics have at least two stories: a cover (ComicCoverArt) and an interior story.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ],
    "properties": [
      {
        "name": "artist",
        "type": "https://schema.org/Person",
        "description": "The primary artist for a work\n    \tin a medium other than pencils or digital line art--for example, if the\n    \tprimary artwork is done in watercolors or digital paints.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/ComicIssue",
          "https://schema.org/ComicStory",
          "https://schema.org/VisualArtwork"
        ]
      },
      {
        "name": "colorist",
        "type": "https://schema.org/Person",
        "description": "The individual who adds color to inked drawings.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/ComicIssue",
          "https://schema.org/ComicStory",
          "https://schema.org/VisualArtwork"
        ]
      },
      {
        "name": "inker",
        "type": "https://schema.org/Person",
        "description": "The individual who traces over the pencil drawings in ink after pencils are complete.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/ComicIssue",
          "https://schema.org/ComicStory",
          "https://schema.org/VisualArtwork"
        ]
      },
      {
        "name": "letterer",
        "type": "https://schema.org/Person",
        "description": "The individual who adds lettering, including speech balloons and sound effects, to artwork.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/ComicIssue",
          "https://schema.org/ComicStory",
          "https://schema.org/VisualArtwork"
        ]
      },
      {
        "name": "penciler",
        "type": "https://schema.org/Person",
        "description": "The individual who draws the primary narrative artwork.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/ComicIssue",
          "https://schema.org/ComicStory",
          "https://schema.org/VisualArtwork"
        ]
      }
    ]
  },
  {
    "name": "Comment",
    "type": "https://schema.org/Comment",
    "source": "generated",
    "description": "A comment on an item - for example, a comment on a blog post. The comment's content is expressed via the [[text]] property, and its topic via [[about]], properties shared with all CreativeWorks.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ],
    "properties": [
      {
        "name": "downvoteCount",
        "type": "https://schema.org/Integer",
        "description": "The number of downvotes this question, answer or comment has received from the community.",
        "expectedTypes": [
          "https://schema.org/Integer"
        ],
        "rangeTypes": [
          "https://schema.org/Integer"
        ],
        "domainTypes": [
          "https://schema.org/Comment"
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
      },
      {
        "name": "upvoteCount",
        "type": "https://schema.org/Integer",
        "description": "The number of upvotes this question, answer or comment has received from the community.",
        "expectedTypes": [
          "https://schema.org/Integer"
        ],
        "rangeTypes": [
          "https://schema.org/Integer"
        ],
        "domainTypes": [
          "https://schema.org/Comment"
        ]
      }
    ]
  },
  {
    "name": "CommentAction",
    "type": "https://schema.org/CommentAction",
    "source": "generated",
    "description": "The act of generating a comment about a subject.",
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
    "name": "CommunicateAction",
    "type": "https://schema.org/CommunicateAction",
    "source": "generated",
    "description": "The act of conveying information to another person via a communication medium (instrument) such as speech, email, or telephone conversation.",
    "parentTypes": [
      "https://schema.org/InteractAction"
    ],
    "properties": [
      {
        "name": "about",
        "type": "https://schema.org/Thing",
        "description": "The subject matter of an object.",
        "expectedTypes": [
          "https://schema.org/Thing"
        ],
        "rangeTypes": [
          "https://schema.org/Thing"
        ],
        "domainTypes": [
          "https://schema.org/Certification",
          "https://schema.org/CommunicateAction",
          "https://schema.org/CreativeWork",
          "https://schema.org/DefinedTerm",
          "https://schema.org/DefinedTermSet",
          "https://schema.org/Event"
        ],
        "inverseOf": "https://schema.org/subjectOf"
      },
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
        "name": "language",
        "type": "https://schema.org/Language",
        "description": "A sub property of instrument. The language used on this action.",
        "expectedTypes": [
          "https://schema.org/Language"
        ],
        "rangeTypes": [
          "https://schema.org/Language"
        ],
        "domainTypes": [
          "https://schema.org/CommunicateAction",
          "https://schema.org/WriteAction"
        ],
        "supersededBy": "https://schema.org/inLanguage"
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
    "name": "CompleteDataFeed",
    "type": "https://schema.org/CompleteDataFeed",
    "source": "generated",
    "description": "A [[CompleteDataFeed]] is a [[DataFeed]] whose standard representation includes content for every item currently in the feed.\n\nThis is the equivalent of Atom's element as defined in Feed Paging and Archiving [RFC 5005](https://tools.ietf.org/html/rfc5005), for example (and as defined for Atom), when using data from a feed that represents a collection of items that varies over time (e.g. \"Top Twenty Records\") there is no need to have newer entries mixed in alongside older, obsolete entries. By marking this feed as a CompleteDataFeed, old entries can be safely discarded when the feed is refreshed, since we can assume the feed has provided descriptions for all current items.",
    "parentTypes": [
      "https://schema.org/DataFeed"
    ]
  },
  {
    "name": "CompoundPriceSpecification",
    "type": "https://schema.org/CompoundPriceSpecification",
    "source": "generated",
    "description": "A compound price specification is one that bundles multiple prices that all apply in combination for different dimensions of consumption. Use the name property of the attached unit price specification for indicating the dimension of a price component (e.g. \"electricity\" or \"final cleaning\").",
    "parentTypes": [
      "https://schema.org/PriceSpecification"
    ],
    "properties": [
      {
        "name": "priceComponent",
        "type": "https://schema.org/PriceSpecification",
        "description": "This property links to all [[UnitPriceSpecification]] nodes that apply in parallel for the [[CompoundPriceSpecification]] node.",
        "expectedTypes": [
          "https://schema.org/PriceSpecification"
        ],
        "rangeTypes": [
          "https://schema.org/PriceSpecification"
        ],
        "domainTypes": [
          "https://schema.org/CompoundPriceSpecification"
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
      }
    ]
  },
  {
    "name": "ComputerLanguage",
    "type": "https://schema.org/ComputerLanguage",
    "source": "generated",
    "description": "This type covers computer programming languages such as Scheme and Lisp, as well as other language-like computer representations. Natural languages are best represented with the [[Language]] type.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ]
  },
  {
    "name": "ComputerStore",
    "type": "https://schema.org/ComputerStore",
    "source": "generated",
    "description": "A computer store.",
    "parentTypes": [
      "https://schema.org/Store"
    ]
  },
  {
    "name": "ConferenceEvent",
    "type": "https://schema.org/ConferenceEvent",
    "source": "generated",
    "description": "Event type: Conference event.",
    "parentTypes": [
      "https://schema.org/Event"
    ]
  },
  {
    "name": "ConfirmAction",
    "type": "https://schema.org/ConfirmAction",
    "source": "generated",
    "description": "The act of notifying someone that a future event/action is going to happen as expected.\\n\\nRelated actions:\\n\\n* [[CancelAction]]: The antonym of ConfirmAction.",
    "parentTypes": [
      "https://schema.org/InformAction"
    ]
  },
  {
    "name": "Consortium",
    "type": "https://schema.org/Consortium",
    "source": "generated",
    "description": "A Consortium is a membership [[Organization]] whose members are typically Organizations.",
    "parentTypes": [
      "https://schema.org/Organization"
    ]
  },
  {
    "name": "ConstraintNode",
    "type": "https://schema.org/ConstraintNode",
    "source": "generated",
    "description": "The ConstraintNode type is provided to support usecases in which a node in a structured data graph is described with properties which appear to describe a single entity, but are being used in a situation where they serve a more abstract purpose. A [[ConstraintNode]] can be described using [[constraintProperty]] and [[numConstraints]]. These constraint properties can serve a\n    variety of purposes, and their values may sometimes be understood to indicate sets of possible values rather than single, exact and specific values.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "constraintProperty",
        "type": [
          "https://schema.org/Property",
          "https://schema.org/URL"
        ],
        "description": "Indicates a property used as a constraint. For example, in the definition of a [[StatisticalVariable]]. The value is a property, either from within Schema.org or from other compatible (e.g. RDF) systems such as DataCommons.org or Wikidata.org. ",
        "expectedTypes": [
          "https://schema.org/Property",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Property",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/ConstraintNode"
        ]
      },
      {
        "name": "numConstraints",
        "type": "https://schema.org/Integer",
        "description": "Indicates the number of constraints property values defined for a particular [[ConstraintNode]] such as [[StatisticalVariable]]. This helps applications understand if they have access to a sufficiently complete description of a [[StatisticalVariable]] or other construct that is defined using properties on template-style nodes.",
        "expectedTypes": [
          "https://schema.org/Integer"
        ],
        "rangeTypes": [
          "https://schema.org/Integer"
        ],
        "domainTypes": [
          "https://schema.org/ConstraintNode"
        ]
      }
    ]
  },
  {
    "name": "ConsumeAction",
    "type": "https://schema.org/ConsumeAction",
    "source": "generated",
    "description": "The act of ingesting information/resources/food.",
    "parentTypes": [
      "https://schema.org/Action"
    ],
    "properties": [
      {
        "name": "actionAccessibilityRequirement",
        "type": "https://schema.org/ActionAccessSpecification",
        "description": "A set of requirements that must be fulfilled in order to perform an Action. If more than one value is specified, fulfilling one set of requirements will allow the Action to be performed.",
        "expectedTypes": [
          "https://schema.org/ActionAccessSpecification"
        ],
        "rangeTypes": [
          "https://schema.org/ActionAccessSpecification"
        ],
        "domainTypes": [
          "https://schema.org/ConsumeAction"
        ]
      },
      {
        "name": "expectsAcceptanceOf",
        "type": "https://schema.org/Offer",
        "description": "An Offer which must be accepted before the user can perform the Action. For example, the user may need to buy a movie before being able to watch it.",
        "expectedTypes": [
          "https://schema.org/Offer"
        ],
        "rangeTypes": [
          "https://schema.org/Offer"
        ],
        "domainTypes": [
          "https://schema.org/ActionAccessSpecification",
          "https://schema.org/ConsumeAction",
          "https://schema.org/MediaSubscription"
        ]
      }
    ]
  },
  {
    "name": "ContactPage",
    "type": "https://schema.org/ContactPage",
    "source": "generated",
    "description": "Web page type: Contact page.",
    "parentTypes": [
      "https://schema.org/WebPage"
    ]
  },
  {
    "name": "ContactPoint",
    "type": "https://spec.edmcouncil.org/fibo/ontology/FND/Organizations/Organizations/ContactPoint",
    "source": "generated"
  },
  {
    "name": "ContactPoint",
    "type": "https://ref.gs1.org/voc/ContactPoint",
    "source": "generated"
  },
  {
    "name": "ContactPoint",
    "type": "https://schema.org/ContactPoint",
    "source": "generated",
    "description": "A contact point&#x2014;for example, a Customer Complaints department.",
    "parentTypes": [
      "https://schema.org/StructuredValue"
    ],
    "properties": [
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
        "name": "contactOption",
        "type": "https://schema.org/ContactPointOption",
        "description": "An option available on this contact point (e.g. a toll-free number or support for hearing-impaired callers).",
        "expectedTypes": [
          "https://schema.org/ContactPointOption"
        ],
        "rangeTypes": [
          "https://schema.org/ContactPointOption"
        ],
        "domainTypes": [
          "https://schema.org/ContactPoint"
        ]
      },
      {
        "name": "contactType",
        "type": "https://schema.org/Text",
        "description": "A person or organization can have different contact points, for different purposes. For example, a sales contact point, a PR contact point and so on. This property is used to specify the kind of contact point.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/ContactPoint"
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
        "name": "productSupported",
        "type": [
          "https://schema.org/Product",
          "https://schema.org/Text"
        ],
        "description": "The product or service this support contact point is related to (such as product support for a particular product line). This can be a specific product or product line (e.g. \"iPhone\") or a general category of products or services (e.g. \"smartphones\").",
        "expectedTypes": [
          "https://schema.org/Product",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Product",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/ContactPoint"
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
      }
    ]
  },
  {
    "name": "ContactPointOption",
    "type": "https://schema.org/ContactPointOption",
    "source": "generated",
    "description": "Enumerated options related to a ContactPoint.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "HearingImpairedSupported",
        "type": "https://schema.org/HearingImpairedSupported",
        "description": "Uses devices to support users with hearing impairments."
      },
      {
        "name": "TollFree",
        "type": "https://schema.org/TollFree",
        "description": "The associated telephone number is toll free."
      }
    ]
  },
  {
    "name": "Continent",
    "type": "https://www.omg.org/spec/LCC/Countries/CountryRepresentation/Continent",
    "source": "generated"
  },
  {
    "name": "Continent",
    "type": "https://schema.org/Continent",
    "source": "generated",
    "description": "One of the continents (for example, Europe or Africa).",
    "parentTypes": [
      "https://schema.org/Landform"
    ]
  },
  {
    "name": "ControlAction",
    "type": "https://schema.org/ControlAction",
    "source": "generated",
    "description": "An agent controls a device or application.",
    "parentTypes": [
      "https://schema.org/Action"
    ]
  },
  {
    "name": "ConvenienceStore",
    "type": "https://schema.org/ConvenienceStore",
    "source": "generated",
    "description": "A convenience store.",
    "parentTypes": [
      "https://schema.org/Store"
    ]
  },
  {
    "name": "Conversation",
    "type": "https://schema.org/Conversation",
    "source": "generated",
    "description": "One or more messages between organizations or people on a particular topic. Individual messages can be linked to the conversation with isPartOf or hasPart properties.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ]
  },
  {
    "name": "CookAction",
    "type": "https://schema.org/CookAction",
    "source": "generated",
    "description": "The act of producing/preparing food.",
    "parentTypes": [
      "https://schema.org/CreateAction"
    ],
    "properties": [
      {
        "name": "foodEstablishment",
        "type": [
          "https://schema.org/FoodEstablishment",
          "https://schema.org/Place"
        ],
        "description": "A sub property of location. The specific food establishment where the action occurred.",
        "expectedTypes": [
          "https://schema.org/FoodEstablishment",
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/FoodEstablishment",
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/CookAction"
        ]
      },
      {
        "name": "foodEvent",
        "type": "https://schema.org/FoodEvent",
        "description": "A sub property of location. The specific food event where the action occurred.",
        "expectedTypes": [
          "https://schema.org/FoodEvent"
        ],
        "rangeTypes": [
          "https://schema.org/FoodEvent"
        ],
        "domainTypes": [
          "https://schema.org/CookAction"
        ]
      },
      {
        "name": "recipe",
        "type": "https://schema.org/Recipe",
        "description": "A sub property of instrument. The recipe/instructions used to perform the action.",
        "expectedTypes": [
          "https://schema.org/Recipe"
        ],
        "rangeTypes": [
          "https://schema.org/Recipe"
        ],
        "domainTypes": [
          "https://schema.org/CookAction"
        ]
      }
    ]
  },
  {
    "name": "Cooperative",
    "type": "https://schema.org/Cooperative",
    "source": "generated",
    "description": "An organization that is a joint project of multiple organizations or persons.",
    "parentTypes": [
      "https://schema.org/Organization"
    ]
  },
  {
    "name": "CooperativeSociety",
    "type": "https://spec.edmcouncil.org/fibo/ontology/BE/LegalEntities/CorporateBodies/CooperativeSociety",
    "source": "generated"
  },
  {
    "name": "Corporation",
    "type": "https://spec.edmcouncil.org/fibo/ontology/BE/Corporations/Corporations/Corporation",
    "source": "generated"
  },
  {
    "name": "Corporation",
    "type": "https://schema.org/Corporation",
    "source": "generated",
    "description": "Organization: A business corporation.",
    "parentTypes": [
      "https://schema.org/Organization"
    ],
    "properties": [
      {
        "name": "tickerSymbol",
        "type": "https://schema.org/Text",
        "description": "The exchange traded instrument associated with a Corporation object. The tickerSymbol is expressed as an exchange and an instrument name separated by a space character. For the exchange component of the tickerSymbol attribute, we recommend using the controlled vocabulary of Market Identifier Codes (MIC) specified in ISO 15022.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Corporation"
        ]
      }
    ]
  },
  {
    "name": "CorrectionComment",
    "type": "https://schema.org/CorrectionComment",
    "source": "generated",
    "description": "A [[comment]] that corrects [[CreativeWork]].",
    "parentTypes": [
      "https://schema.org/Comment"
    ]
  },
  {
    "name": "Country",
    "type": "https://ref.gs1.org/voc/Country",
    "source": "generated"
  },
  {
    "name": "Country",
    "type": "https://www.omg.org/spec/LCC/Countries/CountryRepresentation/Country",
    "source": "generated"
  },
  {
    "name": "Country",
    "type": "https://schema.org/Country",
    "source": "generated",
    "description": "A country.",
    "parentTypes": [
      "https://schema.org/AdministrativeArea",
      "https://www.omg.org/spec/Commons/GeopoliticalEntities/GeopoliticalEntity"
    ]
  },
  {
    "name": "Country",
    "type": "http://unece.org/vocab#Country",
    "source": "generated"
  },
  {
    "name": "Course",
    "type": "https://schema.org/Course",
    "source": "generated",
    "description": "A description of an educational course which may be offered as distinct instances which take place at different times or take place at different locations, or be offered through different media or modes of study. An educational course is a sequence of one or more educational events and/or creative works which aims to build knowledge, competence or ability of learners.",
    "parentTypes": [
      "https://schema.org/CreativeWork",
      "https://schema.org/LearningResource"
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
        "name": "courseCode",
        "type": "https://schema.org/Text",
        "description": "The identifier for the [[Course]] used by the course [[provider]] (e.g. CS101 or 6.001).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Course"
        ]
      },
      {
        "name": "coursePrerequisites",
        "type": [
          "https://schema.org/AlignmentObject",
          "https://schema.org/Course",
          "https://schema.org/Text"
        ],
        "description": "Requirements for taking the Course. May be completion of another [[Course]] or a textual description like \"permission of instructor\". Requirements may be a pre-requisite competency, referenced using [[AlignmentObject]].",
        "expectedTypes": [
          "https://schema.org/AlignmentObject",
          "https://schema.org/Course",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/AlignmentObject",
          "https://schema.org/Course",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Course"
        ]
      },
      {
        "name": "educationalCredentialAwarded",
        "type": [
          "https://schema.org/EducationalOccupationalCredential",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "A description of the qualification, award, certificate, diploma or other educational credential awarded as a consequence of successful completion of this course or program.",
        "expectedTypes": [
          "https://schema.org/EducationalOccupationalCredential",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/EducationalOccupationalCredential",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Course",
          "https://schema.org/EducationalOccupationalProgram"
        ]
      },
      {
        "name": "financialAidEligible",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text"
        ],
        "description": "A financial aid type or program which students may use to pay for tuition or fees associated with the program.",
        "expectedTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Course",
          "https://schema.org/EducationalOccupationalProgram"
        ]
      },
      {
        "name": "hasCourseInstance",
        "type": "https://schema.org/CourseInstance",
        "description": "An offering of the course at a specific time and place or through specific media or mode of study or to a specific section of students.",
        "expectedTypes": [
          "https://schema.org/CourseInstance"
        ],
        "rangeTypes": [
          "https://schema.org/CourseInstance"
        ],
        "domainTypes": [
          "https://schema.org/Course"
        ]
      },
      {
        "name": "numberOfCredits",
        "type": [
          "https://schema.org/Integer",
          "https://schema.org/StructuredValue"
        ],
        "description": "The number of credits or units awarded by a Course or required to complete an EducationalOccupationalProgram.",
        "expectedTypes": [
          "https://schema.org/Integer",
          "https://schema.org/StructuredValue"
        ],
        "rangeTypes": [
          "https://schema.org/Integer",
          "https://schema.org/StructuredValue"
        ],
        "domainTypes": [
          "https://schema.org/Course",
          "https://schema.org/EducationalOccupationalProgram"
        ]
      },
      {
        "name": "occupationalCredentialAwarded",
        "type": [
          "https://schema.org/EducationalOccupationalCredential",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "A description of the qualification, award, certificate, diploma or other occupational credential awarded as a consequence of successful completion of this course or program.",
        "expectedTypes": [
          "https://schema.org/EducationalOccupationalCredential",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/EducationalOccupationalCredential",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Course",
          "https://schema.org/EducationalOccupationalProgram"
        ]
      },
      {
        "name": "syllabusSections",
        "type": "https://schema.org/Syllabus",
        "description": "Indicates (typically several) Syllabus entities that lay out what each section of the overall course will cover.",
        "expectedTypes": [
          "https://schema.org/Syllabus"
        ],
        "rangeTypes": [
          "https://schema.org/Syllabus"
        ],
        "domainTypes": [
          "https://schema.org/Course"
        ]
      },
      {
        "name": "totalHistoricalEnrollment",
        "type": "https://schema.org/Integer",
        "description": "The total number of students that have enrolled in the history of the course.",
        "expectedTypes": [
          "https://schema.org/Integer"
        ],
        "rangeTypes": [
          "https://schema.org/Integer"
        ],
        "domainTypes": [
          "https://schema.org/Course"
        ]
      }
    ]
  },
  {
    "name": "CourseInstance",
    "type": "https://schema.org/CourseInstance",
    "source": "generated",
    "description": "An instance of a [[Course]] which is distinct from other instances because it is offered at a different time or location or through different media or modes of study or to a specific section of students.",
    "parentTypes": [
      "https://schema.org/Event"
    ],
    "properties": [
      {
        "name": "courseMode",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "The medium or means of delivery of the course instance or the mode of study, either as a text label (e.g. \"online\", \"onsite\" or \"blended\"; \"synchronous\" or \"asynchronous\"; \"full-time\" or \"part-time\") or as a URL reference to a term from a controlled vocabulary (e.g. https://ceds.ed.gov/element/001311#Asynchronous).",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/CourseInstance"
        ]
      },
      {
        "name": "courseSchedule",
        "type": "https://schema.org/Schedule",
        "description": "Represents the length and pace of a course, expressed as a [[Schedule]].",
        "expectedTypes": [
          "https://schema.org/Schedule"
        ],
        "rangeTypes": [
          "https://schema.org/Schedule"
        ],
        "domainTypes": [
          "https://schema.org/CourseInstance"
        ]
      },
      {
        "name": "courseWorkload",
        "type": "https://schema.org/Text",
        "description": "The amount of work expected of students taking the course, often provided as a figure per week or per month, and may be broken down by type. For example, \"2 hours of lectures, 1 hour of lab work and 3 hours of independent study per week\".",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/CourseInstance"
        ]
      },
      {
        "name": "instructor",
        "type": "https://schema.org/Person",
        "description": "A person assigned to instruct or provide instructional assistance for the [[CourseInstance]].",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/CourseInstance"
        ]
      }
    ]
  },
  {
    "name": "Courthouse",
    "type": "https://schema.org/Courthouse",
    "source": "generated",
    "description": "A courthouse.",
    "parentTypes": [
      "https://schema.org/GovernmentBuilding"
    ]
  },
  {
    "name": "CoverArt",
    "type": "https://schema.org/CoverArt",
    "source": "generated",
    "description": "The artwork on the outer surface of a CreativeWork.",
    "parentTypes": [
      "https://schema.org/VisualArtwork"
    ]
  },
  {
    "name": "CovidTestingFacility",
    "type": "https://schema.org/CovidTestingFacility",
    "source": "generated",
    "description": "A CovidTestingFacility is a [[MedicalClinic]] where testing for the COVID-19 Coronavirus\n      disease is available. If the facility is being made available from an established [[Pharmacy]], [[Hotel]], or other\n      non-medical organization, multiple types can be listed. This makes it easier to re-use existing schema.org information\n      about that place, e.g. contact info, address, opening hours. Note that in an emergency, such information may not always be reliable.\n      ",
    "parentTypes": [
      "https://schema.org/MedicalClinic"
    ]
  },
  {
    "name": "CreateAction",
    "type": "https://schema.org/CreateAction",
    "source": "generated",
    "description": "The act of deliberately creating/producing/generating/building a result out of the agent.",
    "parentTypes": [
      "https://schema.org/Action"
    ]
  }
] satisfies readonly SchemaDefinition[];
