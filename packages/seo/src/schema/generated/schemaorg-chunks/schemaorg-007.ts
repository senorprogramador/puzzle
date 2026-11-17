/*
 * This file is generated. Do not edit manually.
 * Schema.org version: 30.1
 * Source SHA-256: 0a4b8c4c910fc831ec8695196510973390906a5ee34dc6b862dfec4d21a12f74
 */

import type { SchemaDefinition } from "../../types";

export const generatedSchemaDefinitions7: readonly SchemaDefinition[] =
[
  {
    "name": "UserComments",
    "type": "https://schema.org/UserComments",
    "source": "generated",
    "description": "UserInteraction and its subtypes is an old way of talking about users interacting with pages. It is generally better to use [[Action]]-based vocabulary, alongside types such as [[Comment]].",
    "parentTypes": [
      "https://schema.org/UserInteraction"
    ],
    "properties": [
      {
        "name": "commentText",
        "type": "https://schema.org/Text",
        "description": "The text of the UserComment.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/UserComments"
        ]
      },
      {
        "name": "commentTime",
        "type": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "description": "The time at which the UserComment was made.",
        "expectedTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/UserComments"
        ]
      },
      {
        "name": "creator",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "The creator/author of this CreativeWork. This is the same as the Author property for CreativeWork.",
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
          "https://schema.org/UserComments"
        ]
      },
      {
        "name": "discusses",
        "type": "https://schema.org/CreativeWork",
        "description": "Specifies the CreativeWork associated with the UserComment.",
        "expectedTypes": [
          "https://schema.org/CreativeWork"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork"
        ],
        "domainTypes": [
          "https://schema.org/UserComments"
        ]
      },
      {
        "name": "replyToUrl",
        "type": "https://schema.org/URL",
        "description": "The URL at which a reply may be posted to the specified UserComment.",
        "expectedTypes": [
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/UserComments"
        ]
      }
    ]
  },
  {
    "name": "UserDownloads",
    "type": "https://schema.org/UserDownloads",
    "source": "generated",
    "description": "UserInteraction and its subtypes is an old way of talking about users interacting with pages. It is generally better to use [[Action]]-based vocabulary, alongside types such as [[Comment]].",
    "parentTypes": [
      "https://schema.org/UserInteraction"
    ]
  },
  {
    "name": "UserInteraction",
    "type": "https://schema.org/UserInteraction",
    "source": "generated",
    "description": "UserInteraction and its subtypes is an old way of talking about users interacting with pages. It is generally better to use [[Action]]-based vocabulary, alongside types such as [[Comment]].",
    "parentTypes": [
      "https://schema.org/Event"
    ]
  },
  {
    "name": "UserLikes",
    "type": "https://schema.org/UserLikes",
    "source": "generated",
    "description": "UserInteraction and its subtypes is an old way of talking about users interacting with pages. It is generally better to use [[Action]]-based vocabulary, alongside types such as [[Comment]].",
    "parentTypes": [
      "https://schema.org/UserInteraction"
    ]
  },
  {
    "name": "UserPageVisits",
    "type": "https://schema.org/UserPageVisits",
    "source": "generated",
    "description": "UserInteraction and its subtypes is an old way of talking about users interacting with pages. It is generally better to use [[Action]]-based vocabulary, alongside types such as [[Comment]].",
    "parentTypes": [
      "https://schema.org/UserInteraction"
    ]
  },
  {
    "name": "UserPlays",
    "type": "https://schema.org/UserPlays",
    "source": "generated",
    "description": "UserInteraction and its subtypes is an old way of talking about users interacting with pages. It is generally better to use [[Action]]-based vocabulary, alongside types such as [[Comment]].",
    "parentTypes": [
      "https://schema.org/UserInteraction"
    ]
  },
  {
    "name": "UserPlusOnes",
    "type": "https://schema.org/UserPlusOnes",
    "source": "generated",
    "description": "UserInteraction and its subtypes is an old way of talking about users interacting with pages. It is generally better to use [[Action]]-based vocabulary, alongside types such as [[Comment]].",
    "parentTypes": [
      "https://schema.org/UserInteraction"
    ]
  },
  {
    "name": "UserReview",
    "type": "https://schema.org/UserReview",
    "source": "generated",
    "description": "A review created by an end-user (e.g. consumer, purchaser, attendee etc.), in contrast with [[CriticReview]].",
    "parentTypes": [
      "https://schema.org/Review"
    ]
  },
  {
    "name": "UserTweets",
    "type": "https://schema.org/UserTweets",
    "source": "generated",
    "description": "UserInteraction and its subtypes is an old way of talking about users interacting with pages. It is generally better to use [[Action]]-based vocabulary, alongside types such as [[Comment]].",
    "parentTypes": [
      "https://schema.org/UserInteraction"
    ]
  },
  {
    "name": "USNonprofitType",
    "type": "https://schema.org/USNonprofitType",
    "source": "generated",
    "description": "USNonprofitType: Non-profit organization type originating from the United States.",
    "parentTypes": [
      "https://schema.org/NonprofitType"
    ],
    "enumerationValues": [
      {
        "name": "Nonprofit501a",
        "type": "https://schema.org/Nonprofit501a",
        "description": "Nonprofit501a: Non-profit type referring to Farmers’ Cooperative Associations."
      },
      {
        "name": "Nonprofit501c1",
        "type": "https://schema.org/Nonprofit501c1",
        "description": "Nonprofit501c1: Non-profit type referring to Corporations Organized Under Act of Congress, including Federal Credit Unions and National Farm Loan Associations."
      },
      {
        "name": "Nonprofit501c10",
        "type": "https://schema.org/Nonprofit501c10",
        "description": "Nonprofit501c10: Non-profit type referring to Domestic Fraternal Societies and Associations."
      },
      {
        "name": "Nonprofit501c11",
        "type": "https://schema.org/Nonprofit501c11",
        "description": "Nonprofit501c11: Non-profit type referring to Teachers' Retirement Fund Associations."
      },
      {
        "name": "Nonprofit501c12",
        "type": "https://schema.org/Nonprofit501c12",
        "description": "Nonprofit501c12: Non-profit type referring to Benevolent Life Insurance Associations, Mutual Ditch or Irrigation Companies, Mutual or Cooperative Telephone Companies."
      },
      {
        "name": "Nonprofit501c13",
        "type": "https://schema.org/Nonprofit501c13",
        "description": "Nonprofit501c13: Non-profit type referring to Cemetery Companies."
      },
      {
        "name": "Nonprofit501c14",
        "type": "https://schema.org/Nonprofit501c14",
        "description": "Nonprofit501c14: Non-profit type referring to State-Chartered Credit Unions, Mutual Reserve Funds."
      },
      {
        "name": "Nonprofit501c15",
        "type": "https://schema.org/Nonprofit501c15",
        "description": "Nonprofit501c15: Non-profit type referring to Mutual Insurance Companies or Associations."
      },
      {
        "name": "Nonprofit501c16",
        "type": "https://schema.org/Nonprofit501c16",
        "description": "Nonprofit501c16: Non-profit type referring to Cooperative Organizations to Finance Crop Operations."
      },
      {
        "name": "Nonprofit501c17",
        "type": "https://schema.org/Nonprofit501c17",
        "description": "Nonprofit501c17: Non-profit type referring to Supplemental Unemployment Benefit Trusts."
      },
      {
        "name": "Nonprofit501c18",
        "type": "https://schema.org/Nonprofit501c18",
        "description": "Nonprofit501c18: Non-profit type referring to Employee Funded Pension Trust (created before 25 June 1959)."
      },
      {
        "name": "Nonprofit501c19",
        "type": "https://schema.org/Nonprofit501c19",
        "description": "Nonprofit501c19: Non-profit type referring to Post or Organization of Past or Present Members of the Armed Forces."
      },
      {
        "name": "Nonprofit501c2",
        "type": "https://schema.org/Nonprofit501c2",
        "description": "Nonprofit501c2: Non-profit type referring to Title-holding Corporations for Exempt Organizations."
      },
      {
        "name": "Nonprofit501c20",
        "type": "https://schema.org/Nonprofit501c20",
        "description": "Nonprofit501c20: Non-profit type referring to Group Legal Services Plan Organizations."
      },
      {
        "name": "Nonprofit501c21",
        "type": "https://schema.org/Nonprofit501c21",
        "description": "Nonprofit501c21: Non-profit type referring to Black Lung Benefit Trusts."
      },
      {
        "name": "Nonprofit501c22",
        "type": "https://schema.org/Nonprofit501c22",
        "description": "Nonprofit501c22: Non-profit type referring to Withdrawal Liability Payment Funds."
      },
      {
        "name": "Nonprofit501c23",
        "type": "https://schema.org/Nonprofit501c23",
        "description": "Nonprofit501c23: Non-profit type referring to Veterans Organizations."
      },
      {
        "name": "Nonprofit501c24",
        "type": "https://schema.org/Nonprofit501c24",
        "description": "Nonprofit501c24: Non-profit type referring to Section 4049 ERISA Trusts."
      },
      {
        "name": "Nonprofit501c25",
        "type": "https://schema.org/Nonprofit501c25",
        "description": "Nonprofit501c25: Non-profit type referring to Real Property Title-Holding Corporations or Trusts with Multiple Parents."
      },
      {
        "name": "Nonprofit501c26",
        "type": "https://schema.org/Nonprofit501c26",
        "description": "Nonprofit501c26: Non-profit type referring to State-Sponsored Organizations Providing Health Coverage for High-Risk Individuals."
      },
      {
        "name": "Nonprofit501c27",
        "type": "https://schema.org/Nonprofit501c27",
        "description": "Nonprofit501c27: Non-profit type referring to State-Sponsored Workers' Compensation Reinsurance Organizations."
      },
      {
        "name": "Nonprofit501c28",
        "type": "https://schema.org/Nonprofit501c28",
        "description": "Nonprofit501c28: Non-profit type referring to National Railroad Retirement Investment Trusts."
      },
      {
        "name": "Nonprofit501c3",
        "type": "https://schema.org/Nonprofit501c3",
        "description": "Nonprofit501c3: Non-profit type referring to Religious, Educational, Charitable, Scientific, Literary, Testing for Public Safety, Fostering National or International Amateur Sports Competition, or Prevention of Cruelty to Children or Animals Organizations."
      },
      {
        "name": "Nonprofit501c4",
        "type": "https://schema.org/Nonprofit501c4",
        "description": "Nonprofit501c4: Non-profit type referring to Civic Leagues, Social Welfare Organizations, and Local Associations of Employees."
      },
      {
        "name": "Nonprofit501c5",
        "type": "https://schema.org/Nonprofit501c5",
        "description": "Nonprofit501c5: Non-profit type referring to Labor, Agricultural and Horticultural Organizations."
      },
      {
        "name": "Nonprofit501c6",
        "type": "https://schema.org/Nonprofit501c6",
        "description": "Nonprofit501c6: Non-profit type referring to Business Leagues, Chambers of Commerce, Real Estate Boards."
      },
      {
        "name": "Nonprofit501c7",
        "type": "https://schema.org/Nonprofit501c7",
        "description": "Nonprofit501c7: Non-profit type referring to Social and Recreational Clubs."
      },
      {
        "name": "Nonprofit501c8",
        "type": "https://schema.org/Nonprofit501c8",
        "description": "Nonprofit501c8: Non-profit type referring to Fraternal Beneficiary Societies and Associations."
      },
      {
        "name": "Nonprofit501c9",
        "type": "https://schema.org/Nonprofit501c9",
        "description": "Nonprofit501c9: Non-profit type referring to Voluntary Employee Beneficiary Associations."
      },
      {
        "name": "Nonprofit501d",
        "type": "https://schema.org/Nonprofit501d",
        "description": "Nonprofit501d: Non-profit type referring to Religious and Apostolic Associations."
      },
      {
        "name": "Nonprofit501e",
        "type": "https://schema.org/Nonprofit501e",
        "description": "Nonprofit501e: Non-profit type referring to Cooperative Hospital Service Organizations."
      },
      {
        "name": "Nonprofit501f",
        "type": "https://schema.org/Nonprofit501f",
        "description": "Nonprofit501f: Non-profit type referring to Cooperative Service Organizations."
      },
      {
        "name": "Nonprofit501k",
        "type": "https://schema.org/Nonprofit501k",
        "description": "Nonprofit501k: Non-profit type referring to Child Care Organizations."
      },
      {
        "name": "Nonprofit501n",
        "type": "https://schema.org/Nonprofit501n",
        "description": "Nonprofit501n: Non-profit type referring to Charitable Risk Pools."
      },
      {
        "name": "Nonprofit501q",
        "type": "https://schema.org/Nonprofit501q",
        "description": "Nonprofit501q: Non-profit type referring to Credit Counseling Organizations."
      },
      {
        "name": "Nonprofit527",
        "type": "https://schema.org/Nonprofit527",
        "description": "Nonprofit527: Non-profit type referring to political organizations."
      }
    ]
  },
  {
    "name": "VacationRental",
    "type": "https://schema.org/VacationRental",
    "source": "generated",
    "description": "A kind of lodging business that focuses on renting single properties for limited time.",
    "parentTypes": [
      "https://schema.org/LodgingBusiness"
    ]
  },
  {
    "name": "VCard",
    "type": "http://www.w3.org/2006/vcard/ns#VCard",
    "source": "generated"
  },
  {
    "name": "Vehicle",
    "type": "https://schema.org/Vehicle",
    "source": "generated",
    "description": "A vehicle is a device that is designed or used to transport people or cargo over land, water, air, or through space.",
    "parentTypes": [
      "https://schema.org/Product"
    ],
    "properties": [
      {
        "name": "accelerationTime",
        "type": "https://schema.org/QuantitativeValue",
        "description": "The time needed to accelerate the vehicle from a given start velocity to a given target velocity.\\n\\nTypical unit code(s): SEC for seconds\\n\\n* Note: There are unfortunately no standard unit codes for seconds/0..100 km/h or seconds/0..60 mph. Simply use \"SEC\" for seconds and indicate the velocities in the [[name]] of the [[QuantitativeValue]], or use [[valueReference]] with a [[QuantitativeValue]] of 0..60 mph or 0..100 km/h to specify the reference speeds.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/Vehicle"
        ]
      },
      {
        "name": "bodyType",
        "type": [
          "https://schema.org/QualitativeValue",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "Indicates the design and body style of the vehicle (e.g. station wagon, hatchback, etc.).",
        "expectedTypes": [
          "https://schema.org/QualitativeValue",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/QualitativeValue",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Vehicle"
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
        "name": "cargoVolume",
        "type": "https://schema.org/QuantitativeValue",
        "description": "The available volume for cargo or luggage. For automobiles, this is usually the trunk volume.\\n\\nTypical unit code(s): LTR for liters, FTQ for cubic foot/feet\\n\\nNote: You can use [[minValue]] and [[maxValue]] to indicate ranges.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/Vehicle"
        ]
      },
      {
        "name": "dateVehicleFirstRegistered",
        "type": "https://schema.org/Date",
        "description": "The date of the first registration of the vehicle with the respective public authorities.",
        "expectedTypes": [
          "https://schema.org/Date"
        ],
        "rangeTypes": [
          "https://schema.org/Date"
        ],
        "domainTypes": [
          "https://schema.org/Vehicle"
        ]
      },
      {
        "name": "driveWheelConfiguration",
        "type": [
          "https://schema.org/DriveWheelConfigurationValue",
          "https://schema.org/Text"
        ],
        "description": "The drive wheel configuration, i.e. which roadwheels will receive torque from the vehicle's engine via the drivetrain.",
        "expectedTypes": [
          "https://schema.org/DriveWheelConfigurationValue",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/DriveWheelConfigurationValue",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Vehicle"
        ]
      },
      {
        "name": "emissionsCO2",
        "type": "https://schema.org/Number",
        "description": "The CO2 emissions in g/km. When used in combination with a QuantitativeValue, put \"g/km\" into the unitText property of that value, since there is no UN/CEFACT Common Code for \"g/km\".",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/Vehicle"
        ]
      },
      {
        "name": "fuelCapacity",
        "type": "https://schema.org/QuantitativeValue",
        "description": "The capacity of the fuel tank or in the case of electric cars, the battery. If there are multiple components for storage, this should indicate the total of all storage of the same type.\\n\\nTypical unit code(s): LTR for liters, GLL of US gallons, GLI for UK / imperial gallons, AMH for ampere-hours (for electrical vehicles).",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/Vehicle"
        ]
      },
      {
        "name": "fuelConsumption",
        "type": "https://schema.org/QuantitativeValue",
        "description": "The amount of fuel consumed for traveling a particular distance or temporal duration with the given vehicle (e.g. liters per 100 km).\\n\\n* Note 1: There are unfortunately no standard unit codes for liters per 100 km.  Use [[unitText]] to indicate the unit of measurement, e.g. L/100 km.\\n* Note 2: There are two ways of indicating the fuel consumption, [[fuelConsumption]] (e.g. 8 liters per 100 km) and [[fuelEfficiency]] (e.g. 30 miles per gallon). They are reciprocal.\\n* Note 3: Often, the absolute value is useful only when related to driving speed (\"at 80 km/h\") or usage pattern (\"city traffic\"). You can use [[valueReference]] to link the value for the fuel consumption to another value.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/Vehicle"
        ]
      },
      {
        "name": "fuelEfficiency",
        "type": "https://schema.org/QuantitativeValue",
        "description": "The distance traveled per unit of fuel used; most commonly miles per gallon (mpg) or kilometers per liter (km/L).\\n\\n* Note 1: There are unfortunately no standard unit codes for miles per gallon or kilometers per liter. Use [[unitText]] to indicate the unit of measurement, e.g. mpg or km/L.\\n* Note 2: There are two ways of indicating the fuel consumption, [[fuelConsumption]] (e.g. 8 liters per 100 km) and [[fuelEfficiency]] (e.g. 30 miles per gallon). They are reciprocal.\\n* Note 3: Often, the absolute value is useful only when related to driving speed (\"at 80 km/h\") or usage pattern (\"city traffic\"). You can use [[valueReference]] to link the value for the fuel economy to another value.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/Vehicle"
        ]
      },
      {
        "name": "fuelType",
        "type": [
          "https://schema.org/QualitativeValue",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "The type of fuel suitable for the engine or engines of the vehicle. If the vehicle has only one engine, this property can be attached directly to the vehicle.",
        "expectedTypes": [
          "https://schema.org/QualitativeValue",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/QualitativeValue",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/EngineSpecification",
          "https://schema.org/Vehicle"
        ]
      },
      {
        "name": "knownVehicleDamages",
        "type": "https://schema.org/Text",
        "description": "A textual description of known damages, both repaired and unrepaired.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Vehicle"
        ]
      },
      {
        "name": "meetsEmissionStandard",
        "type": [
          "https://schema.org/QualitativeValue",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "Indicates that the vehicle meets the respective emission standard.",
        "expectedTypes": [
          "https://schema.org/QualitativeValue",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/QualitativeValue",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Vehicle"
        ]
      },
      {
        "name": "mileageFromOdometer",
        "type": "https://schema.org/QuantitativeValue",
        "description": "The total distance travelled by the particular vehicle since its initial production, as read from its odometer.\\n\\nTypical unit code(s): KMT for kilometers, SMI for statute miles.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/Vehicle"
        ]
      },
      {
        "name": "modelDate",
        "type": "https://schema.org/Date",
        "description": "The release date of a vehicle model (often used to differentiate versions of the same make and model).",
        "expectedTypes": [
          "https://schema.org/Date"
        ],
        "rangeTypes": [
          "https://schema.org/Date"
        ],
        "domainTypes": [
          "https://schema.org/Vehicle"
        ]
      },
      {
        "name": "numberOfAirbags",
        "type": [
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "description": "The number or type of airbags in the vehicle.",
        "expectedTypes": [
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Vehicle"
        ]
      },
      {
        "name": "numberOfAxles",
        "type": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "description": "The number of axles.\\n\\nTypical unit code(s): C62.",
        "expectedTypes": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/Vehicle"
        ]
      },
      {
        "name": "numberOfDoors",
        "type": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "description": "The number of doors.\\n\\nTypical unit code(s): C62.",
        "expectedTypes": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/Vehicle"
        ]
      },
      {
        "name": "numberOfForwardGears",
        "type": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "description": "The total number of forward gears available for the transmission system of the vehicle.\\n\\nTypical unit code(s): C62.",
        "expectedTypes": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/Vehicle"
        ]
      },
      {
        "name": "numberOfPreviousOwners",
        "type": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "description": "The number of owners of the vehicle, including the current one.\\n\\nTypical unit code(s): C62.",
        "expectedTypes": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/Vehicle"
        ]
      },
      {
        "name": "payload",
        "type": "https://schema.org/QuantitativeValue",
        "description": "The permitted weight of passengers and cargo, EXCLUDING the weight of the empty vehicle.\\n\\nTypical unit code(s): KGM for kilogram, LBR for pound\\n\\n* Note 1: Many databases specify the permitted TOTAL weight instead, which is the sum of [[weight]] and [[payload]]\\n* Note 2: You can indicate additional information in the [[name]] of the [[QuantitativeValue]] node.\\n* Note 3: You may also link to a [[QualitativeValue]] node that provides additional information using [[valueReference]].\\n* Note 4: Note that you can use [[minValue]] and [[maxValue]] to indicate ranges.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/Vehicle"
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
        "name": "seatingCapacity",
        "type": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "description": "The number of persons that can be seated (e.g. in a vehicle), both in terms of the physical space available, and in terms of limitations set by law.\\n\\nTypical unit code(s): C62 for persons.",
        "expectedTypes": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/Vehicle"
        ]
      },
      {
        "name": "speed",
        "type": "https://schema.org/QuantitativeValue",
        "description": "The speed range of the vehicle. If the vehicle is powered by an engine, the upper limit of the speed range (indicated by [[maxValue]]) should be the maximum speed achievable under regular conditions.\\n\\nTypical unit code(s): KMH for km/h, HM for mile per hour (0.447 04 m/s), KNT for knot\\n\\n*Note 1: Use [[minValue]] and [[maxValue]] to indicate the range. Typically, the minimal value is zero.\\n* Note 2: There are many different ways of measuring the speed range. You can link to information about how the given value has been determined using the [[valueReference]] property.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/Vehicle"
        ]
      },
      {
        "name": "steeringPosition",
        "type": "https://schema.org/SteeringPositionValue",
        "description": "The position of the steering wheel or similar device (mostly for cars).",
        "expectedTypes": [
          "https://schema.org/SteeringPositionValue"
        ],
        "rangeTypes": [
          "https://schema.org/SteeringPositionValue"
        ],
        "domainTypes": [
          "https://schema.org/Vehicle"
        ]
      },
      {
        "name": "tongueWeight",
        "type": "https://schema.org/QuantitativeValue",
        "description": "The permitted vertical load (TWR) of a trailer attached to the vehicle. Also referred to as Tongue Load Rating (TLR) or Vertical Load Rating (VLR).\\n\\nTypical unit code(s): KGM for kilogram, LBR for pound\\n\\n* Note 1: You can indicate additional information in the [[name]] of the [[QuantitativeValue]] node.\\n* Note 2: You may also link to a [[QualitativeValue]] node that provides additional information using [[valueReference]].\\n* Note 3: Note that you can use [[minValue]] and [[maxValue]] to indicate ranges.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/Vehicle"
        ]
      },
      {
        "name": "trailerWeight",
        "type": "https://schema.org/QuantitativeValue",
        "description": "The permitted weight of a trailer attached to the vehicle.\\n\\nTypical unit code(s): KGM for kilogram, LBR for pound\\n* Note 1: You can indicate additional information in the [[name]] of the [[QuantitativeValue]] node.\\n* Note 2: You may also link to a [[QualitativeValue]] node that provides additional information using [[valueReference]].\\n* Note 3: Note that you can use [[minValue]] and [[maxValue]] to indicate ranges.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/Vehicle"
        ]
      },
      {
        "name": "vehicleConfiguration",
        "type": "https://schema.org/Text",
        "description": "A short text indicating the configuration of the vehicle, e.g. '5dr hatchback ST 2.5 MT 225 hp' or 'limited edition'.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Vehicle"
        ]
      },
      {
        "name": "vehicleEngine",
        "type": "https://schema.org/EngineSpecification",
        "description": "Information about the engine or engines of the vehicle.",
        "expectedTypes": [
          "https://schema.org/EngineSpecification"
        ],
        "rangeTypes": [
          "https://schema.org/EngineSpecification"
        ],
        "domainTypes": [
          "https://schema.org/Vehicle"
        ]
      },
      {
        "name": "vehicleIdentificationNumber",
        "type": "https://schema.org/Text",
        "description": "The Vehicle Identification Number (VIN) is a unique serial number used by the automotive industry to identify individual motor vehicles.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Vehicle"
        ]
      },
      {
        "name": "vehicleInteriorColor",
        "type": "https://schema.org/Text",
        "description": "The color or color combination of the interior of the vehicle.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Vehicle"
        ]
      },
      {
        "name": "vehicleInteriorType",
        "type": "https://schema.org/Text",
        "description": "The type or material of the interior of the vehicle (e.g. synthetic fabric, leather, wood, etc.). While most interior types are characterized by the material used, an interior type can also be based on vehicle usage or target audience.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Vehicle"
        ]
      },
      {
        "name": "vehicleModelDate",
        "type": "https://schema.org/Date",
        "description": "The release date of a vehicle model (often used to differentiate versions of the same make and model).",
        "expectedTypes": [
          "https://schema.org/Date"
        ],
        "rangeTypes": [
          "https://schema.org/Date"
        ],
        "domainTypes": [
          "https://schema.org/Vehicle"
        ]
      },
      {
        "name": "vehicleSeatingCapacity",
        "type": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "description": "The number of passengers that can be seated in the vehicle, both in terms of the physical space available, and in terms of limitations set by law.\\n\\nTypical unit code(s): C62 for persons.",
        "expectedTypes": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/Vehicle"
        ]
      },
      {
        "name": "vehicleSpecialUsage",
        "type": [
          "https://schema.org/CarUsageType",
          "https://schema.org/Text"
        ],
        "description": "Indicates whether the vehicle has been used for special purposes, like commercial rental, driving school, or as a taxi. The legislation in many countries requires this information to be revealed when offering a car for sale.",
        "expectedTypes": [
          "https://schema.org/CarUsageType",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/CarUsageType",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Vehicle"
        ]
      },
      {
        "name": "vehicleTransmission",
        "type": [
          "https://schema.org/QualitativeValue",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "The type of component used for transmitting the power from a rotating power source to the wheels or other relevant component(s) (\"gearbox\" for cars).",
        "expectedTypes": [
          "https://schema.org/QualitativeValue",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/QualitativeValue",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Vehicle"
        ]
      },
      {
        "name": "weightTotal",
        "type": "https://schema.org/QuantitativeValue",
        "description": "The permitted total weight of the loaded vehicle, including passengers and cargo and the weight of the empty vehicle.\\n\\nTypical unit code(s): KGM for kilogram, LBR for pound\\n\\n* Note 1: You can indicate additional information in the [[name]] of the [[QuantitativeValue]] node.\\n* Note 2: You may also link to a [[QualitativeValue]] node that provides additional information using [[valueReference]].\\n* Note 3: Note that you can use [[minValue]] and [[maxValue]] to indicate ranges.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/Vehicle"
        ]
      },
      {
        "name": "wheelbase",
        "type": "https://schema.org/QuantitativeValue",
        "description": "The distance between the centers of the front and rear wheels.\\n\\nTypical unit code(s): CMT for centimeters, MTR for meters, INH for inches, FOT for foot/feet.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/Vehicle"
        ]
      }
    ]
  },
  {
    "name": "Vein",
    "type": "https://schema.org/Vein",
    "source": "generated",
    "description": "A type of blood vessel that specifically carries blood to the heart.",
    "parentTypes": [
      "https://schema.org/Vessel"
    ],
    "properties": [
      {
        "name": "drainsTo",
        "type": "https://schema.org/Vessel",
        "description": "The vasculature that the vein drains into.",
        "expectedTypes": [
          "https://schema.org/Vessel"
        ],
        "rangeTypes": [
          "https://schema.org/Vessel"
        ],
        "domainTypes": [
          "https://schema.org/Vein"
        ]
      },
      {
        "name": "regionDrained",
        "type": [
          "https://schema.org/AnatomicalStructure",
          "https://schema.org/AnatomicalSystem"
        ],
        "description": "The anatomical or organ system drained by this vessel; generally refers to a specific part of an organ.",
        "expectedTypes": [
          "https://schema.org/AnatomicalStructure",
          "https://schema.org/AnatomicalSystem"
        ],
        "rangeTypes": [
          "https://schema.org/AnatomicalStructure",
          "https://schema.org/AnatomicalSystem"
        ],
        "domainTypes": [
          "https://schema.org/LymphaticVessel",
          "https://schema.org/Vein"
        ]
      },
      {
        "name": "tributary",
        "type": "https://schema.org/AnatomicalStructure",
        "description": "The anatomical or organ system that the vein flows into; a larger structure that the vein connects to.",
        "expectedTypes": [
          "https://schema.org/AnatomicalStructure"
        ],
        "rangeTypes": [
          "https://schema.org/AnatomicalStructure"
        ],
        "domainTypes": [
          "https://schema.org/Vein"
        ]
      }
    ]
  },
  {
    "name": "Vessel",
    "type": "https://schema.org/Vessel",
    "source": "generated",
    "description": "A component of the human body circulatory system comprised of an intricate network of hollow tubes that transport blood throughout the entire body.",
    "parentTypes": [
      "https://schema.org/AnatomicalStructure"
    ]
  },
  {
    "name": "VeterinaryCare",
    "type": "https://schema.org/VeterinaryCare",
    "source": "generated",
    "description": "A vet's office.",
    "parentTypes": [
      "https://schema.org/MedicalOrganization"
    ]
  },
  {
    "name": "VideoGallery",
    "type": "https://schema.org/VideoGallery",
    "source": "generated",
    "description": "Web page type: Video gallery page.",
    "parentTypes": [
      "https://schema.org/MediaGallery"
    ]
  },
  {
    "name": "VideoGame",
    "type": "https://schema.org/VideoGame",
    "source": "generated",
    "description": "A video game is an electronic game that involves human interaction with a user interface to generate visual feedback on a video device.",
    "parentTypes": [
      "https://schema.org/Game",
      "https://schema.org/SoftwareApplication"
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
        "name": "cheatCode",
        "type": "https://schema.org/CreativeWork",
        "description": "Cheat codes to the game.",
        "expectedTypes": [
          "https://schema.org/CreativeWork"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork"
        ],
        "domainTypes": [
          "https://schema.org/VideoGame",
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
        "name": "gameEdition",
        "type": "https://schema.org/Text",
        "description": "The edition of a video game.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/VideoGame"
        ]
      },
      {
        "name": "gamePlatform",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/Thing",
          "https://schema.org/URL"
        ],
        "description": "The electronic systems used to play <a href=\"http://en.wikipedia.org/wiki/Category:Video_game_platforms\">video games</a>.",
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
          "https://schema.org/VideoGame",
          "https://schema.org/VideoGameSeries"
        ]
      },
      {
        "name": "gameServer",
        "type": "https://schema.org/GameServer",
        "description": "The server on which  it is possible to play the game.",
        "expectedTypes": [
          "https://schema.org/GameServer"
        ],
        "rangeTypes": [
          "https://schema.org/GameServer"
        ],
        "domainTypes": [
          "https://schema.org/VideoGame"
        ],
        "inverseOf": "https://schema.org/game"
      },
      {
        "name": "gameTip",
        "type": "https://schema.org/CreativeWork",
        "description": "Links to tips, tactics, etc.",
        "expectedTypes": [
          "https://schema.org/CreativeWork"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork"
        ],
        "domainTypes": [
          "https://schema.org/VideoGame"
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
        "name": "playMode",
        "type": "https://schema.org/GamePlayMode",
        "description": "Indicates whether this game is multi-player, co-op or single-player.  The game can be marked as multi-player, co-op and single-player at the same time.",
        "expectedTypes": [
          "https://schema.org/GamePlayMode"
        ],
        "rangeTypes": [
          "https://schema.org/GamePlayMode"
        ],
        "domainTypes": [
          "https://schema.org/VideoGame",
          "https://schema.org/VideoGameSeries"
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
    "name": "VideoGameClip",
    "type": "https://schema.org/VideoGameClip",
    "source": "generated",
    "description": "A short segment/part of a video game.",
    "parentTypes": [
      "https://schema.org/Clip"
    ]
  },
  {
    "name": "VideoGameSeries",
    "type": "https://schema.org/VideoGameSeries",
    "source": "generated",
    "description": "A video game series.",
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
        "name": "characterAttribute",
        "type": "https://schema.org/Thing",
        "description": "A piece of data that represents a particular aspect of a fictional character (skill, power, character points, advantage, disadvantage).",
        "expectedTypes": [
          "https://schema.org/Thing"
        ],
        "rangeTypes": [
          "https://schema.org/Thing"
        ],
        "domainTypes": [
          "https://schema.org/Game",
          "https://schema.org/VideoGameSeries"
        ]
      },
      {
        "name": "cheatCode",
        "type": "https://schema.org/CreativeWork",
        "description": "Cheat codes to the game.",
        "expectedTypes": [
          "https://schema.org/CreativeWork"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork"
        ],
        "domainTypes": [
          "https://schema.org/VideoGame",
          "https://schema.org/VideoGameSeries"
        ]
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
        "name": "gameItem",
        "type": "https://schema.org/Thing",
        "description": "An item is an object within the game world that can be collected by a player or, occasionally, a non-player character.",
        "expectedTypes": [
          "https://schema.org/Thing"
        ],
        "rangeTypes": [
          "https://schema.org/Thing"
        ],
        "domainTypes": [
          "https://schema.org/Game",
          "https://schema.org/VideoGameSeries"
        ]
      },
      {
        "name": "gameLocation",
        "type": [
          "https://schema.org/Place",
          "https://schema.org/PostalAddress",
          "https://schema.org/URL"
        ],
        "description": "Real or fictional location of the game (or part of game).",
        "expectedTypes": [
          "https://schema.org/Place",
          "https://schema.org/PostalAddress",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Place",
          "https://schema.org/PostalAddress",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Game",
          "https://schema.org/VideoGameSeries"
        ]
      },
      {
        "name": "gamePlatform",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/Thing",
          "https://schema.org/URL"
        ],
        "description": "The electronic systems used to play <a href=\"http://en.wikipedia.org/wiki/Category:Video_game_platforms\">video games</a>.",
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
          "https://schema.org/VideoGame",
          "https://schema.org/VideoGameSeries"
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
        "name": "numberOfPlayers",
        "type": "https://schema.org/QuantitativeValue",
        "description": "Indicate how many people can play this game (minimum, maximum, or range).",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/Game",
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
        "name": "playMode",
        "type": "https://schema.org/GamePlayMode",
        "description": "Indicates whether this game is multi-player, co-op or single-player.  The game can be marked as multi-player, co-op and single-player at the same time.",
        "expectedTypes": [
          "https://schema.org/GamePlayMode"
        ],
        "rangeTypes": [
          "https://schema.org/GamePlayMode"
        ],
        "domainTypes": [
          "https://schema.org/VideoGame",
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
        "name": "quest",
        "type": "https://schema.org/Thing",
        "description": "The task that a player-controlled character, or group of characters may complete in order to gain a reward.",
        "expectedTypes": [
          "https://schema.org/Thing"
        ],
        "rangeTypes": [
          "https://schema.org/Thing"
        ],
        "domainTypes": [
          "https://schema.org/Game",
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
    "name": "VideoObject",
    "type": "https://schema.org/VideoObject",
    "source": "generated",
    "description": "A video file.",
    "parentTypes": [
      "https://schema.org/MediaObject"
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
      },
      {
        "name": "videoFrameSize",
        "type": "https://schema.org/Text",
        "description": "The frame size of the video.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/VideoObject"
        ]
      },
      {
        "name": "videoQuality",
        "type": "https://schema.org/Text",
        "description": "The quality of the video.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/VideoObject"
        ]
      }
    ]
  },
  {
    "name": "VideoObjectSnapshot",
    "type": "https://schema.org/VideoObjectSnapshot",
    "source": "generated",
    "description": "A specific and exact (byte-for-byte) version of a [[VideoObject]]. Two byte-for-byte identical files, for the purposes of this type, considered identical. If they have different embedded metadata the files will differ. Different external facts about the files, e.g. creator or dateCreated that aren't represented in their actual content, do not affect this notion of identity.",
    "parentTypes": [
      "https://schema.org/VideoObject"
    ]
  },
  {
    "name": "ViewAction",
    "type": "https://schema.org/ViewAction",
    "source": "generated",
    "description": "The act of consuming static visual content.",
    "parentTypes": [
      "https://schema.org/ConsumeAction"
    ]
  },
  {
    "name": "VirtualLocation",
    "type": "https://schema.org/VirtualLocation",
    "source": "generated",
    "description": "An online or virtual location for attending events. For example, one may attend an online seminar or educational event. While a virtual location may be used as the location of an event, virtual locations should not be confused with physical locations in the real world.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ]
  },
  {
    "name": "VisualArtsEvent",
    "type": "https://schema.org/VisualArtsEvent",
    "source": "generated",
    "description": "Event type: Visual arts event.",
    "parentTypes": [
      "https://schema.org/Event"
    ]
  },
  {
    "name": "VisualArtwork",
    "type": "https://schema.org/VisualArtwork",
    "source": "generated",
    "description": "A work of art that is primarily visual in character.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ],
    "properties": [
      {
        "name": "artEdition",
        "type": [
          "https://schema.org/Integer",
          "https://schema.org/Text"
        ],
        "description": "The number of copies when multiple copies of a piece of artwork are produced - e.g. for a limited edition of 20 prints, 'artEdition' refers to the total number of copies (in this example \"20\").",
        "expectedTypes": [
          "https://schema.org/Integer",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Integer",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/VisualArtwork"
        ]
      },
      {
        "name": "artform",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "e.g. Painting, Drawing, Sculpture, Print, Photograph, Assemblage, Collage, etc.",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/VisualArtwork"
        ]
      },
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
        "name": "artMedium",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "The material used. (E.g. Oil, Watercolour, Acrylic, Linoprint, Marble, Cyanotype, Digital, Lithograph, DryPoint, Intaglio, Pastel, Woodcut, Pencil, Mixed Media, etc.)",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/VisualArtwork"
        ]
      },
      {
        "name": "artworkSurface",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "The supporting materials for the artwork, e.g. Canvas, Paper, Wood, Board, etc.",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
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
        "name": "surface",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "A material used as a surface in some artwork, e.g. Canvas, Paper, Wood, Board, etc.",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/VisualArtwork"
        ],
        "supersededBy": "https://schema.org/artworkSurface"
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
    "name": "VitalSign",
    "type": "https://schema.org/VitalSign",
    "source": "generated",
    "description": "Vital signs are measures of various physiological functions in order to assess the most basic body functions.",
    "parentTypes": [
      "https://schema.org/MedicalSign"
    ]
  },
  {
    "name": "Volcano",
    "type": "https://schema.org/Volcano",
    "source": "generated",
    "description": "A volcano, like Fujisan.",
    "parentTypes": [
      "https://schema.org/Landform"
    ]
  },
  {
    "name": "VoteAction",
    "type": "https://schema.org/VoteAction",
    "source": "generated",
    "description": "The act of expressing a preference from a fixed/finite/structured set of choices/options.",
    "parentTypes": [
      "https://schema.org/ChooseAction"
    ],
    "properties": [
      {
        "name": "candidate",
        "type": "https://schema.org/Person",
        "description": "A sub property of object. The candidate subject of this action.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/VoteAction"
        ]
      }
    ]
  },
  {
    "name": "WantAction",
    "type": "https://schema.org/WantAction",
    "source": "generated",
    "description": "The act of expressing a desire about the object. An agent wants an object.",
    "parentTypes": [
      "https://schema.org/ReactAction"
    ]
  },
  {
    "name": "WarrantyPromise",
    "type": "https://schema.org/WarrantyPromise",
    "source": "generated",
    "description": "A structured value representing the duration and scope of services that will be provided to a customer free of charge in case of a defect or malfunction of a product.",
    "parentTypes": [
      "https://schema.org/StructuredValue",
      "https://spec.edmcouncil.org/fibo/ontology/FND/Agreements/Contracts/MutualContractualAgreement"
    ],
    "properties": [
      {
        "name": "durationOfWarranty",
        "type": "https://schema.org/QuantitativeValue",
        "description": "The duration of the warranty promise. Common unitCode values are ANN for year, MON for months, or DAY for days.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/WarrantyPromise"
        ]
      },
      {
        "name": "warrantyScope",
        "type": "https://schema.org/WarrantyScope",
        "description": "The scope of the warranty promise.",
        "expectedTypes": [
          "https://schema.org/WarrantyScope"
        ],
        "rangeTypes": [
          "https://schema.org/WarrantyScope"
        ],
        "domainTypes": [
          "https://schema.org/WarrantyPromise"
        ]
      }
    ]
  },
  {
    "name": "WarrantyScope",
    "type": "https://schema.org/WarrantyScope",
    "source": "generated",
    "description": "A range of services that will be provided to a customer free of charge in case of a defect or malfunction of a product.\\n\\nCommonly used values:\\n\\n* http://purl.org/goodrelations/v1#Labor-BringIn\\n* http://purl.org/goodrelations/v1#PartsAndLabor-BringIn\\n* http://purl.org/goodrelations/v1#PartsAndLabor-PickUp\n      ",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ]
  },
  {
    "name": "WatchAction",
    "type": "https://schema.org/WatchAction",
    "source": "generated",
    "description": "The act of consuming dynamic/moving visual content.",
    "parentTypes": [
      "https://schema.org/ConsumeAction"
    ]
  },
  {
    "name": "Waterfall",
    "type": "https://schema.org/Waterfall",
    "source": "generated",
    "description": "A waterfall, like Niagara.",
    "parentTypes": [
      "https://schema.org/BodyOfWater"
    ]
  },
  {
    "name": "WearableMeasurementTypeEnumeration",
    "type": "https://schema.org/WearableMeasurementTypeEnumeration",
    "source": "generated",
    "description": "Enumerates common types of measurement for wearables products.",
    "parentTypes": [
      "https://schema.org/MeasurementTypeEnumeration"
    ],
    "enumerationValues": [
      {
        "name": "WearableMeasurementBack",
        "type": "https://schema.org/WearableMeasurementBack",
        "description": "Measurement of the back section, for example of a jacket."
      },
      {
        "name": "WearableMeasurementChestOrBust",
        "type": "https://schema.org/WearableMeasurementChestOrBust",
        "description": "Measurement of the chest/bust section, for example of a suit."
      },
      {
        "name": "WearableMeasurementCollar",
        "type": "https://schema.org/WearableMeasurementCollar",
        "description": "Measurement of the collar, for example of a shirt."
      },
      {
        "name": "WearableMeasurementCup",
        "type": "https://schema.org/WearableMeasurementCup",
        "description": "Measurement of the cup, for example of a bra."
      },
      {
        "name": "WearableMeasurementHeight",
        "type": "https://schema.org/WearableMeasurementHeight",
        "description": "Measurement of the height, for example the heel height of a shoe."
      },
      {
        "name": "WearableMeasurementHips",
        "type": "https://schema.org/WearableMeasurementHips",
        "description": "Measurement of the hip section, for example of a skirt."
      },
      {
        "name": "WearableMeasurementInseam",
        "type": "https://schema.org/WearableMeasurementInseam",
        "description": "Measurement of the inseam, for example of pants."
      },
      {
        "name": "WearableMeasurementLength",
        "type": "https://schema.org/WearableMeasurementLength",
        "description": "Represents the length, for example of a dress."
      },
      {
        "name": "WearableMeasurementOutsideLeg",
        "type": "https://schema.org/WearableMeasurementOutsideLeg",
        "description": "Measurement of the outside leg, for example of pants."
      },
      {
        "name": "WearableMeasurementSleeve",
        "type": "https://schema.org/WearableMeasurementSleeve",
        "description": "Measurement of the sleeve length, for example of a shirt."
      },
      {
        "name": "WearableMeasurementWaist",
        "type": "https://schema.org/WearableMeasurementWaist",
        "description": "Measurement of the waist section, for example of pants."
      },
      {
        "name": "WearableMeasurementWidth",
        "type": "https://schema.org/WearableMeasurementWidth",
        "description": "Measurement of the width, for example of shoes."
      }
    ]
  },
  {
    "name": "WearableSizeGroupEnumeration",
    "type": "https://schema.org/WearableSizeGroupEnumeration",
    "source": "generated",
    "description": "Enumerates common size groups (also known as \"size types\") for wearable products.",
    "parentTypes": [
      "https://schema.org/SizeGroupEnumeration"
    ],
    "enumerationValues": [
      {
        "name": "WearableSizeGroupBig",
        "type": "https://schema.org/WearableSizeGroupBig",
        "description": "Size group \"Big\" for wearables."
      },
      {
        "name": "WearableSizeGroupBoys",
        "type": "https://schema.org/WearableSizeGroupBoys",
        "description": "Size group \"Boys\" for wearables."
      },
      {
        "name": "WearableSizeGroupExtraShort",
        "type": "https://schema.org/WearableSizeGroupExtraShort",
        "description": "Size group \"Extra Short\" for wearables."
      },
      {
        "name": "WearableSizeGroupExtraTall",
        "type": "https://schema.org/WearableSizeGroupExtraTall",
        "description": "Size group \"Extra Tall\" for wearables."
      },
      {
        "name": "WearableSizeGroupGirls",
        "type": "https://schema.org/WearableSizeGroupGirls",
        "description": "Size group \"Girls\" for wearables."
      },
      {
        "name": "WearableSizeGroupHusky",
        "type": "https://schema.org/WearableSizeGroupHusky",
        "description": "Size group \"Husky\" (or \"Stocky\") for wearables."
      },
      {
        "name": "WearableSizeGroupInfants",
        "type": "https://schema.org/WearableSizeGroupInfants",
        "description": "Size group \"Infants\" for wearables."
      },
      {
        "name": "WearableSizeGroupJuniors",
        "type": "https://schema.org/WearableSizeGroupJuniors",
        "description": "Size group \"Juniors\" for wearables."
      },
      {
        "name": "WearableSizeGroupMaternity",
        "type": "https://schema.org/WearableSizeGroupMaternity",
        "description": "Size group \"Maternity\" for wearables."
      },
      {
        "name": "WearableSizeGroupMens",
        "type": "https://schema.org/WearableSizeGroupMens",
        "description": "Size group \"Mens\" for wearables."
      },
      {
        "name": "WearableSizeGroupMisses",
        "type": "https://schema.org/WearableSizeGroupMisses",
        "description": "Size group \"Misses\" (also known as \"Missy\") for wearables."
      },
      {
        "name": "WearableSizeGroupPetite",
        "type": "https://schema.org/WearableSizeGroupPetite",
        "description": "Size group \"Petite\" for wearables."
      },
      {
        "name": "WearableSizeGroupPlus",
        "type": "https://schema.org/WearableSizeGroupPlus",
        "description": "Size group \"Plus\" for wearables."
      },
      {
        "name": "WearableSizeGroupRegular",
        "type": "https://schema.org/WearableSizeGroupRegular",
        "description": "Size group \"Regular\" for wearables."
      },
      {
        "name": "WearableSizeGroupShort",
        "type": "https://schema.org/WearableSizeGroupShort",
        "description": "Size group \"Short\" for wearables."
      },
      {
        "name": "WearableSizeGroupTall",
        "type": "https://schema.org/WearableSizeGroupTall",
        "description": "Size group \"Tall\" for wearables."
      },
      {
        "name": "WearableSizeGroupWomens",
        "type": "https://schema.org/WearableSizeGroupWomens",
        "description": "Size group \"Womens\" for wearables."
      }
    ]
  },
  {
    "name": "WearableSizeSystemEnumeration",
    "type": "https://schema.org/WearableSizeSystemEnumeration",
    "source": "generated",
    "description": "Enumerates common size systems specific for wearable products.",
    "parentTypes": [
      "https://schema.org/SizeSystemEnumeration"
    ],
    "enumerationValues": [
      {
        "name": "WearableSizeSystemAU",
        "type": "https://schema.org/WearableSizeSystemAU",
        "description": "Australian size system for wearables."
      },
      {
        "name": "WearableSizeSystemBR",
        "type": "https://schema.org/WearableSizeSystemBR",
        "description": "Brazilian size system for wearables."
      },
      {
        "name": "WearableSizeSystemCN",
        "type": "https://schema.org/WearableSizeSystemCN",
        "description": "Chinese size system for wearables."
      },
      {
        "name": "WearableSizeSystemContinental",
        "type": "https://schema.org/WearableSizeSystemContinental",
        "description": "Continental size system for wearables."
      },
      {
        "name": "WearableSizeSystemDE",
        "type": "https://schema.org/WearableSizeSystemDE",
        "description": "German size system for wearables."
      },
      {
        "name": "WearableSizeSystemEN13402",
        "type": "https://schema.org/WearableSizeSystemEN13402",
        "description": "EN 13402 (joint European standard for size labelling of clothes)."
      },
      {
        "name": "WearableSizeSystemEurope",
        "type": "https://schema.org/WearableSizeSystemEurope",
        "description": "European size system for wearables."
      },
      {
        "name": "WearableSizeSystemFR",
        "type": "https://schema.org/WearableSizeSystemFR",
        "description": "French size system for wearables."
      },
      {
        "name": "WearableSizeSystemGS1",
        "type": "https://schema.org/WearableSizeSystemGS1",
        "description": "GS1 (formerly NRF) size system for wearables."
      },
      {
        "name": "WearableSizeSystemIT",
        "type": "https://schema.org/WearableSizeSystemIT",
        "description": "Italian size system for wearables."
      },
      {
        "name": "WearableSizeSystemJP",
        "type": "https://schema.org/WearableSizeSystemJP",
        "description": "Japanese size system for wearables."
      },
      {
        "name": "WearableSizeSystemMX",
        "type": "https://schema.org/WearableSizeSystemMX",
        "description": "Mexican size system for wearables."
      },
      {
        "name": "WearableSizeSystemUK",
        "type": "https://schema.org/WearableSizeSystemUK",
        "description": "United Kingdom size system for wearables."
      },
      {
        "name": "WearableSizeSystemUS",
        "type": "https://schema.org/WearableSizeSystemUS",
        "description": "United States size system for wearables."
      }
    ]
  },
  {
    "name": "WearAction",
    "type": "https://schema.org/WearAction",
    "source": "generated",
    "description": "The act of dressing oneself in clothing.",
    "parentTypes": [
      "https://schema.org/UseAction"
    ]
  },
  {
    "name": "WebAPI",
    "type": "https://schema.org/WebAPI",
    "source": "generated",
    "description": "An application programming interface accessible over Web/Internet technologies.",
    "parentTypes": [
      "https://schema.org/Service"
    ],
    "properties": [
      {
        "name": "documentation",
        "type": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "description": "Further documentation describing the Web API in more detail.",
        "expectedTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/WebAPI"
        ]
      }
    ]
  },
  {
    "name": "WebApplication",
    "type": "https://schema.org/WebApplication",
    "source": "generated",
    "description": "Web applications.",
    "parentTypes": [
      "https://schema.org/SoftwareApplication"
    ],
    "properties": [
      {
        "name": "browserRequirements",
        "type": "https://schema.org/Text",
        "description": "Specifies browser requirements in human-readable text. For example, 'requires HTML5 support'.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/WebApplication"
        ]
      }
    ]
  },
  {
    "name": "WebContent",
    "type": "https://schema.org/WebContent",
    "source": "generated",
    "description": "WebContent is a type representing all [[WebPage]], [[WebSite]] and [[WebPageElement]] content. It is sometimes the case that detailed distinctions between Web pages, sites and their parts are not always important or obvious. The  [[WebContent]] type makes it easier to describe Web-addressable content without requiring such distinctions to always be stated. (The intent is that the existing types [[WebPage]], [[WebSite]] and [[WebPageElement]] will eventually be declared as subtypes of [[WebContent]].)",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ]
  },
  {
    "name": "WebPage",
    "type": "https://schema.org/WebPage",
    "source": "generated",
    "description": "A web page. Every web page is implicitly assumed to be declared to be of type WebPage, so the various properties about that webpage, such as <code>breadcrumb</code> may be used. We recommend explicit declaration if these properties are specified, but if they are found outside of an itemscope, they will be assumed to be about the page.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ],
    "properties": [
      {
        "name": "breadcrumb",
        "type": [
          "https://schema.org/BreadcrumbList",
          "https://schema.org/Text"
        ],
        "description": "A set of links that can help a user understand and navigate a website hierarchy.",
        "expectedTypes": [
          "https://schema.org/BreadcrumbList",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/BreadcrumbList",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/WebPage"
        ]
      },
      {
        "name": "lastReviewed",
        "type": "https://schema.org/Date",
        "description": "Date on which the content on this web page was last reviewed for accuracy and/or completeness.",
        "expectedTypes": [
          "https://schema.org/Date"
        ],
        "rangeTypes": [
          "https://schema.org/Date"
        ],
        "domainTypes": [
          "https://schema.org/WebPage"
        ]
      },
      {
        "name": "mainContentOfPage",
        "type": "https://schema.org/WebPageElement",
        "description": "Indicates if this web page element is the main subject of the page.",
        "expectedTypes": [
          "https://schema.org/WebPageElement"
        ],
        "rangeTypes": [
          "https://schema.org/WebPageElement"
        ],
        "domainTypes": [
          "https://schema.org/WebPage"
        ]
      },
      {
        "name": "primaryImageOfPage",
        "type": "https://schema.org/ImageObject",
        "description": "Indicates the main image on the page.",
        "expectedTypes": [
          "https://schema.org/ImageObject"
        ],
        "rangeTypes": [
          "https://schema.org/ImageObject"
        ],
        "domainTypes": [
          "https://schema.org/WebPage"
        ]
      },
      {
        "name": "relatedLink",
        "type": "https://schema.org/URL",
        "description": "A link related to this web page, for example to other related web pages.",
        "expectedTypes": [
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/WebPage"
        ]
      },
      {
        "name": "reviewedBy",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "People or organizations that have reviewed the content on this web page for accuracy and/or completeness.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/WebPage"
        ]
      },
      {
        "name": "significantLink",
        "type": "https://schema.org/URL",
        "description": "One of the more significant URLs on the page. Typically, these are the non-navigation links that are clicked on the most.",
        "expectedTypes": [
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/WebPage"
        ]
      },
      {
        "name": "significantLinks",
        "type": "https://schema.org/URL",
        "description": "The most significant URLs on the page. Typically, these are the non-navigation links that are clicked on the most.",
        "expectedTypes": [
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/WebPage"
        ],
        "supersededBy": "https://schema.org/significantLink"
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
        "name": "specialty",
        "type": "https://schema.org/Specialty",
        "description": "One of the domain specialities to which this web page's content applies.",
        "expectedTypes": [
          "https://schema.org/Specialty"
        ],
        "rangeTypes": [
          "https://schema.org/Specialty"
        ],
        "domainTypes": [
          "https://schema.org/WebPage"
        ]
      }
    ]
  },
  {
    "name": "WebPageElement",
    "type": "https://schema.org/WebPageElement",
    "source": "generated",
    "description": "A web page element, like a table or an image.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
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
    "name": "WebSite",
    "type": "https://schema.org/WebSite",
    "source": "generated",
    "description": "A WebSite is a set of related web pages and other items typically served from a single web domain and accessible via URLs.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ],
    "properties": [
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
    "name": "WholesaleStore",
    "type": "https://schema.org/WholesaleStore",
    "source": "generated",
    "description": "A wholesale store.",
    "parentTypes": [
      "https://schema.org/Store"
    ]
  },
  {
    "name": "WinAction",
    "type": "https://schema.org/WinAction",
    "source": "generated",
    "description": "The act of achieving victory in a competitive activity.",
    "parentTypes": [
      "https://schema.org/AchieveAction"
    ],
    "properties": [
      {
        "name": "loser",
        "type": "https://schema.org/Person",
        "description": "A sub property of participant. The loser of the action.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/WinAction"
        ]
      }
    ]
  },
  {
    "name": "Winery",
    "type": "https://schema.org/Winery",
    "source": "generated",
    "description": "A winery.",
    "parentTypes": [
      "https://schema.org/FoodEstablishment"
    ]
  },
  {
    "name": "WorkBasedProgram",
    "type": "https://schema.org/WorkBasedProgram",
    "source": "generated",
    "description": "A program with both an educational and employment component. Typically based at a workplace and structured around work-based learning, with the aim of instilling competencies related to an occupation. WorkBasedProgram is used to distinguish programs such as apprenticeships from school, college or other classroom based educational programs.",
    "parentTypes": [
      "https://schema.org/EducationalOccupationalProgram"
    ],
    "properties": [
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
        "name": "trainingSalary",
        "type": "https://schema.org/MonetaryAmountDistribution",
        "description": "The estimated salary earned while in the program.",
        "expectedTypes": [
          "https://schema.org/MonetaryAmountDistribution"
        ],
        "rangeTypes": [
          "https://schema.org/MonetaryAmountDistribution"
        ],
        "domainTypes": [
          "https://schema.org/EducationalOccupationalProgram",
          "https://schema.org/WorkBasedProgram"
        ]
      }
    ]
  },
  {
    "name": "WorkersUnion",
    "type": "https://schema.org/WorkersUnion",
    "source": "generated",
    "description": "A Workers Union (also known as a Labor Union, Labour Union, or Trade Union) is an organization that promotes the interests of its worker members by collectively bargaining with management, organizing, and political lobbying.",
    "parentTypes": [
      "https://schema.org/Organization"
    ]
  },
  {
    "name": "WPAdBlock",
    "type": "https://schema.org/WPAdBlock",
    "source": "generated",
    "description": "An advertising section of the page.",
    "parentTypes": [
      "https://schema.org/WebPageElement"
    ]
  },
  {
    "name": "WPFooter",
    "type": "https://schema.org/WPFooter",
    "source": "generated",
    "description": "The footer section of the page.",
    "parentTypes": [
      "https://schema.org/WebPageElement"
    ]
  },
  {
    "name": "WPHeader",
    "type": "https://schema.org/WPHeader",
    "source": "generated",
    "description": "The header section of the page.",
    "parentTypes": [
      "https://schema.org/WebPageElement"
    ]
  },
  {
    "name": "WPSideBar",
    "type": "https://schema.org/WPSideBar",
    "source": "generated",
    "description": "A sidebar section of the page.",
    "parentTypes": [
      "https://schema.org/WebPageElement"
    ]
  },
  {
    "name": "WriteAction",
    "type": "https://schema.org/WriteAction",
    "source": "generated",
    "description": "The act of authoring written creative content.",
    "parentTypes": [
      "https://schema.org/CreateAction"
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
      }
    ]
  },
  {
    "name": "XPathType",
    "type": "https://schema.org/XPathType",
    "source": "generated",
    "description": "Text representing an XPath (typically but not necessarily version 1.0).",
    "parentTypes": [
      "https://schema.org/Text"
    ]
  },
  {
    "name": "Zoo",
    "type": "https://schema.org/Zoo",
    "source": "generated",
    "description": "A zoo.",
    "parentTypes": [
      "https://schema.org/CivicStructure"
    ]
  }
] satisfies readonly SchemaDefinition[];
