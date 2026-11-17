/*
 * This file is generated. Do not edit manually.
 * Schema.org version: 30.1
 * Source SHA-256: 0a4b8c4c910fc831ec8695196510973390906a5ee34dc6b862dfec4d21a12f74
 */

import type { SchemaDefinition } from "../../types";

export const generatedSchemaDefinitions2: readonly SchemaDefinition[] =
[
  {
    "name": "Episode",
    "type": "https://schema.org/Episode",
    "source": "generated",
    "description": "A media episode (e.g. TV, radio, video game) which can be part of a series or season.",
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
        "name": "episodeNumber",
        "type": [
          "https://schema.org/Integer",
          "https://schema.org/Text"
        ],
        "description": "Position of the episode within an ordered group of episodes.",
        "expectedTypes": [
          "https://schema.org/Integer",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Integer",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Episode"
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
    "name": "Error",
    "type": "http://www.w3.org/ns/hydra/core#Error",
    "source": "generated"
  },
  {
    "name": "Error",
    "type": "https://schema.org/Error",
    "source": "generated",
    "description": "Representation of an Error.",
    "parentTypes": [
      "http://sarif.info/Result",
      "https://schema.org/InstantaneousEvent"
    ],
    "properties": [
      {
        "name": "errorCode",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Integer",
          "https://schema.org/StatusEnumeration",
          "https://schema.org/Text"
        ],
        "description": "Application or platform dependant error code.",
        "expectedTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Integer",
          "https://schema.org/StatusEnumeration",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Integer",
          "https://schema.org/StatusEnumeration",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Error"
        ]
      }
    ]
  },
  {
    "name": "EUEnergyEfficiencyEnumeration",
    "type": "https://schema.org/EUEnergyEfficiencyEnumeration",
    "source": "generated",
    "description": "Enumerates the EU energy efficiency classes A-G as well as A+, A++, and A+++ as defined in EU directive 2017/1369.",
    "parentTypes": [
      "https://schema.org/EnergyEfficiencyEnumeration"
    ],
    "enumerationValues": [
      {
        "name": "EUEnergyEfficiencyCategoryA",
        "type": "https://schema.org/EUEnergyEfficiencyCategoryA",
        "description": "Represents EU Energy Efficiency Class A as defined in EU energy labeling regulations."
      },
      {
        "name": "EUEnergyEfficiencyCategoryA1Plus",
        "type": "https://schema.org/EUEnergyEfficiencyCategoryA1Plus",
        "description": "Represents EU Energy Efficiency Class A+ as defined in EU energy labeling regulations."
      },
      {
        "name": "EUEnergyEfficiencyCategoryA2Plus",
        "type": "https://schema.org/EUEnergyEfficiencyCategoryA2Plus",
        "description": "Represents EU Energy Efficiency Class A++ as defined in EU energy labeling regulations."
      },
      {
        "name": "EUEnergyEfficiencyCategoryA3Plus",
        "type": "https://schema.org/EUEnergyEfficiencyCategoryA3Plus",
        "description": "Represents EU Energy Efficiency Class A+++ as defined in EU energy labeling regulations."
      },
      {
        "name": "EUEnergyEfficiencyCategoryB",
        "type": "https://schema.org/EUEnergyEfficiencyCategoryB",
        "description": "Represents EU Energy Efficiency Class B as defined in EU energy labeling regulations."
      },
      {
        "name": "EUEnergyEfficiencyCategoryC",
        "type": "https://schema.org/EUEnergyEfficiencyCategoryC",
        "description": "Represents EU Energy Efficiency Class C as defined in EU energy labeling regulations."
      },
      {
        "name": "EUEnergyEfficiencyCategoryD",
        "type": "https://schema.org/EUEnergyEfficiencyCategoryD",
        "description": "Represents EU Energy Efficiency Class D as defined in EU energy labeling regulations."
      },
      {
        "name": "EUEnergyEfficiencyCategoryE",
        "type": "https://schema.org/EUEnergyEfficiencyCategoryE",
        "description": "Represents EU Energy Efficiency Class E as defined in EU energy labeling regulations."
      },
      {
        "name": "EUEnergyEfficiencyCategoryF",
        "type": "https://schema.org/EUEnergyEfficiencyCategoryF",
        "description": "Represents EU Energy Efficiency Class F as defined in EU energy labeling regulations."
      },
      {
        "name": "EUEnergyEfficiencyCategoryG",
        "type": "https://schema.org/EUEnergyEfficiencyCategoryG",
        "description": "Represents EU Energy Efficiency Class G as defined in EU energy labeling regulations."
      }
    ]
  },
  {
    "name": "Event",
    "type": "http://purl.org/dc/dcmitype/Event",
    "source": "generated"
  },
  {
    "name": "Event",
    "type": "https://schema.org/Event",
    "source": "generated",
    "description": "An event happening at a certain time and location, such as a concert, lecture, or festival. Ticketing information may be added via the [[offers]] property. Repeated events may be structured as separate Event objects.",
    "parentTypes": [
      "https://schema.org/Thing"
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
        "name": "attendee",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "A person or organization attending the event.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Event"
        ]
      },
      {
        "name": "attendees",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "A person attending the event.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Event"
        ],
        "supersededBy": "https://schema.org/attendee"
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
        "name": "composer",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "The person or organization who wrote a composition, or who is the composer of a work performed at some event.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Event",
          "https://schema.org/MusicComposition"
        ]
      },
      {
        "name": "contributor",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "A secondary contributor to the CreativeWork or Event.",
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
          "https://schema.org/Event"
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
        "name": "doorTime",
        "type": [
          "https://schema.org/DateTime",
          "https://schema.org/Time"
        ],
        "description": "The time admission will commence.",
        "expectedTypes": [
          "https://schema.org/DateTime",
          "https://schema.org/Time"
        ],
        "rangeTypes": [
          "https://schema.org/DateTime",
          "https://schema.org/Time"
        ],
        "domainTypes": [
          "https://schema.org/Event"
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
        "name": "eventAttendanceMode",
        "type": "https://schema.org/EventAttendanceModeEnumeration",
        "description": "The eventAttendanceMode of an event indicates whether it occurs online, offline, or a mix.",
        "expectedTypes": [
          "https://schema.org/EventAttendanceModeEnumeration"
        ],
        "rangeTypes": [
          "https://schema.org/EventAttendanceModeEnumeration"
        ],
        "domainTypes": [
          "https://schema.org/Event"
        ]
      },
      {
        "name": "eventSchedule",
        "type": "https://schema.org/Schedule",
        "description": "Associates an [[Event]] with a [[Schedule]]. There are circumstances where it is preferable to share a schedule for a series of\n      repeating events rather than data on the individual events themselves. For example, a website or application might prefer to publish a schedule for a weekly\n      gym class rather than provide data on every event. A schedule could be processed by applications to add forthcoming events to a calendar. An [[Event]] that\n      is associated with a [[Schedule]] using this property should not have [[startDate]] or [[endDate]] properties. These are instead defined within the associated\n      [[Schedule]], this avoids any ambiguity for clients using the data. The property might have repeated values to specify different schedules, e.g. for different months\n      or seasons.",
        "expectedTypes": [
          "https://schema.org/Schedule"
        ],
        "rangeTypes": [
          "https://schema.org/Schedule"
        ],
        "domainTypes": [
          "https://schema.org/Event"
        ]
      },
      {
        "name": "eventStatus",
        "type": "https://schema.org/EventStatusType",
        "description": "An eventStatus of an event represents its status; particularly useful when an event is cancelled or rescheduled.",
        "expectedTypes": [
          "https://schema.org/EventStatusType"
        ],
        "rangeTypes": [
          "https://schema.org/EventStatusType"
        ],
        "domainTypes": [
          "https://schema.org/Event"
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
        "name": "hasParticipationOffer",
        "type": "https://schema.org/Offer",
        "description": "An offer to participate in the event, for example, Call for Proposals, Call for Speakers, or Call for Performers.",
        "expectedTypes": [
          "https://schema.org/Offer"
        ],
        "rangeTypes": [
          "https://schema.org/Offer"
        ],
        "domainTypes": [
          "https://schema.org/Event"
        ]
      },
      {
        "name": "hasSponsorshipOffer",
        "type": "https://schema.org/Offer",
        "description": "An offer to sponsor the event, for example, Sponsorship Prospectus, Sponsorship Opportunities, or Sponsor Packages.",
        "expectedTypes": [
          "https://schema.org/Offer"
        ],
        "rangeTypes": [
          "https://schema.org/Offer"
        ],
        "domainTypes": [
          "https://schema.org/Event"
        ]
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
        "name": "maximumPhysicalAttendeeCapacity",
        "type": "https://schema.org/Integer",
        "description": "The maximum physical attendee capacity of an [[Event]] whose [[eventAttendanceMode]] is [[OfflineEventAttendanceMode]] (or the offline aspects, in the case of a [[MixedEventAttendanceMode]]). ",
        "expectedTypes": [
          "https://schema.org/Integer"
        ],
        "rangeTypes": [
          "https://schema.org/Integer"
        ],
        "domainTypes": [
          "https://schema.org/Event"
        ]
      },
      {
        "name": "maximumVirtualAttendeeCapacity",
        "type": "https://schema.org/Integer",
        "description": "The maximum virtual attendee capacity of an [[Event]] whose [[eventAttendanceMode]] is [[OnlineEventAttendanceMode]] (or the online aspects, in the case of a [[MixedEventAttendanceMode]]). ",
        "expectedTypes": [
          "https://schema.org/Integer"
        ],
        "rangeTypes": [
          "https://schema.org/Integer"
        ],
        "domainTypes": [
          "https://schema.org/Event"
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
        "name": "organizer",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "An organizer of an Event.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Event"
        ]
      },
      {
        "name": "performer",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "A performer at the event&#x2014;for example, a presenter, musician, musical group or actor.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Event"
        ]
      },
      {
        "name": "performers",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "The main performer or performers of the event&#x2014;for example, a presenter, musician, or actor.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Event"
        ],
        "supersededBy": "https://schema.org/performer"
      },
      {
        "name": "previousStartDate",
        "type": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "description": "Used in conjunction with eventStatus for rescheduled or cancelled events. This property contains the previously scheduled start date. For rescheduled events, the startDate property should be used for the newly scheduled start date. In the (rare) case of an event that has been postponed and rescheduled multiple times, this field may be repeated.",
        "expectedTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/Event"
        ]
      },
      {
        "name": "recordedIn",
        "type": "https://schema.org/CreativeWork",
        "description": "The CreativeWork that captured all or part of this Event.",
        "expectedTypes": [
          "https://schema.org/CreativeWork"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork"
        ],
        "domainTypes": [
          "https://schema.org/Event"
        ],
        "inverseOf": "https://schema.org/recordedAt"
      },
      {
        "name": "remainingAttendeeCapacity",
        "type": "https://schema.org/Integer",
        "description": "The number of attendee places for an event that remain unallocated.",
        "expectedTypes": [
          "https://schema.org/Integer"
        ],
        "rangeTypes": [
          "https://schema.org/Integer"
        ],
        "domainTypes": [
          "https://schema.org/Event"
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
        "name": "subEvent",
        "type": "https://schema.org/Event",
        "description": "An Event that is part of this event. For example, a conference event includes many presentations, each of which is a subEvent of the conference.",
        "expectedTypes": [
          "https://schema.org/Event"
        ],
        "rangeTypes": [
          "https://schema.org/Event"
        ],
        "domainTypes": [
          "https://schema.org/Event"
        ],
        "inverseOf": "https://schema.org/superEvent"
      },
      {
        "name": "subEvents",
        "type": "https://schema.org/Event",
        "description": "Events that are a part of this event. For example, a conference event includes many presentations, each subEvents of the conference.",
        "expectedTypes": [
          "https://schema.org/Event"
        ],
        "rangeTypes": [
          "https://schema.org/Event"
        ],
        "domainTypes": [
          "https://schema.org/Event"
        ],
        "supersededBy": "https://schema.org/subEvent"
      },
      {
        "name": "superEvent",
        "type": "https://schema.org/Event",
        "description": "An event that this event is a part of. For example, a collection of individual music performances might each have a music festival as their superEvent.",
        "expectedTypes": [
          "https://schema.org/Event"
        ],
        "rangeTypes": [
          "https://schema.org/Event"
        ],
        "domainTypes": [
          "https://schema.org/Event"
        ],
        "inverseOf": "https://schema.org/subEvent"
      },
      {
        "name": "translator",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "Organization or person who adapts a creative work to different languages, regional differences and technical requirements of a target market, or that translates during some event.",
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
          "https://schema.org/Event"
        ]
      },
      {
        "name": "typicalAgeRange",
        "type": "https://schema.org/Text",
        "description": "The typical expected age range, e.g. '7-9', '11-'.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Event"
        ]
      },
      {
        "name": "workFeatured",
        "type": "https://schema.org/CreativeWork",
        "description": "A work featured in some event, e.g. exhibited in an ExhibitionEvent.\n       Specific subproperties are available for workPerformed (e.g. a play), or a workPresented (a Movie at a ScreeningEvent).",
        "expectedTypes": [
          "https://schema.org/CreativeWork"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork"
        ],
        "domainTypes": [
          "https://schema.org/Event"
        ]
      },
      {
        "name": "workPerformed",
        "type": "https://schema.org/CreativeWork",
        "description": "A work performed in some event, for example a play performed in a TheaterEvent.",
        "expectedTypes": [
          "https://schema.org/CreativeWork"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork"
        ],
        "domainTypes": [
          "https://schema.org/Event"
        ]
      }
    ]
  },
  {
    "name": "EventAttendanceModeEnumeration",
    "type": "https://schema.org/EventAttendanceModeEnumeration",
    "source": "generated",
    "description": "An EventAttendanceModeEnumeration value is one of potentially several modes of organising an event, relating to whether it is online or offline.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "MixedEventAttendanceMode",
        "type": "https://schema.org/MixedEventAttendanceMode",
        "description": "MixedEventAttendanceMode - an event that is conducted as a combination of both offline and online modes."
      },
      {
        "name": "OfflineEventAttendanceMode",
        "type": "https://schema.org/OfflineEventAttendanceMode",
        "description": "OfflineEventAttendanceMode - an event that is primarily conducted offline. "
      },
      {
        "name": "OnlineEventAttendanceMode",
        "type": "https://schema.org/OnlineEventAttendanceMode",
        "description": "OnlineEventAttendanceMode - an event that is primarily conducted online. "
      }
    ]
  },
  {
    "name": "EventReservation",
    "type": "https://schema.org/EventReservation",
    "source": "generated",
    "description": "A reservation for an event like a concert, sporting event, or lecture.\\n\\nNote: This type is for information about actual reservations, e.g. in confirmation emails or HTML pages with individual confirmations of reservations. For offers of tickets, use [[Offer]].",
    "parentTypes": [
      "https://schema.org/Reservation"
    ]
  },
  {
    "name": "EventSeries",
    "type": "https://schema.org/EventSeries",
    "source": "generated",
    "description": "A series of [[Event]]s. Included events can relate with the series using the [[superEvent]] property.\n\nAn EventSeries is a collection of events that share some unifying characteristic. For example, \"The Olympic Games\" is a series, which\nis repeated regularly. The \"2012 London Olympics\" can be presented both as an [[Event]] in the series \"Olympic Games\", and as an\n[[EventSeries]] that included a number of sporting competitions as Events.\n\nThe nature of the association between the events in an [[EventSeries]] can vary, but typical examples could\ninclude a thematic event series (e.g. topical meetups or classes), or a series of regular events that share a location, attendee group and/or organizers.\n\nEventSeries has been defined as a kind of Event to make it easy for publishers to use it in an Event context without\nworrying about which kinds of series are really event-like enough to call an Event. In general an EventSeries\nmay seem more Event-like when the period of time is compact and when aspects such as location are fixed, but\nit may also sometimes prove useful to describe a longer-term series as an Event.\n   ",
    "parentTypes": [
      "https://schema.org/Event",
      "https://schema.org/Series"
    ]
  },
  {
    "name": "EventStatusType",
    "type": "https://schema.org/EventStatusType",
    "source": "generated",
    "description": "EventStatusType is an enumeration type whose instances represent several states that an Event may be in.",
    "parentTypes": [
      "https://schema.org/StatusEnumeration"
    ],
    "enumerationValues": [
      {
        "name": "EventCancelled",
        "type": "https://schema.org/EventCancelled",
        "description": "The event has been cancelled. If the event has multiple startDate values, all are assumed to be cancelled. Either startDate or previousStartDate may be used to specify the event's cancelled date(s)."
      },
      {
        "name": "EventMovedOnline",
        "type": "https://schema.org/EventMovedOnline",
        "description": "Indicates that the event was changed to allow online participation. See [[eventAttendanceMode]] for specifics of whether it is now fully or partially online."
      },
      {
        "name": "EventPostponed",
        "type": "https://schema.org/EventPostponed",
        "description": "The event has been postponed and no new date has been set. The event's previousStartDate should be set."
      },
      {
        "name": "EventRescheduled",
        "type": "https://schema.org/EventRescheduled",
        "description": "The event has been rescheduled. The event's previousStartDate should be set to the old date and the startDate should be set to the event's new date. (If the event has been rescheduled multiple times, the previousStartDate property may be repeated.)"
      },
      {
        "name": "EventScheduled",
        "type": "https://schema.org/EventScheduled",
        "description": "The event is taking place or has taken place on the startDate as scheduled. Use of this value is optional, as it is assumed by default."
      }
    ]
  },
  {
    "name": "EventVenue",
    "type": "https://schema.org/EventVenue",
    "source": "generated",
    "description": "An event venue.",
    "parentTypes": [
      "https://schema.org/CivicStructure"
    ]
  },
  {
    "name": "ExchangeRateSpecification",
    "type": "https://schema.org/ExchangeRateSpecification",
    "source": "generated",
    "description": "A structured value representing exchange rate.",
    "parentTypes": [
      "https://schema.org/StructuredValue"
    ],
    "properties": [
      {
        "name": "currency",
        "type": "https://schema.org/Text",
        "description": "The currency in which the monetary amount is expressed.\\n\\nUse standard formats: [ISO 4217 currency format](http://en.wikipedia.org/wiki/ISO_4217), e.g. \"USD\"; [Ticker symbol](https://en.wikipedia.org/wiki/List_of_cryptocurrencies) for cryptocurrencies, e.g. \"BTC\"; well known names for [Local Exchange Trading Systems](https://en.wikipedia.org/wiki/Local_exchange_trading_system) (LETS) and other currency types, e.g. \"Ithaca HOUR\".",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/DatedMoneySpecification",
          "https://schema.org/ExchangeRateSpecification",
          "https://schema.org/LoanOrCredit",
          "https://schema.org/MonetaryAmount",
          "https://schema.org/MonetaryAmountDistribution"
        ]
      },
      {
        "name": "currentExchangeRate",
        "type": "https://schema.org/UnitPriceSpecification",
        "description": "The current price of a currency.",
        "expectedTypes": [
          "https://schema.org/UnitPriceSpecification"
        ],
        "rangeTypes": [
          "https://schema.org/UnitPriceSpecification"
        ],
        "domainTypes": [
          "https://schema.org/ExchangeRateSpecification"
        ]
      },
      {
        "name": "exchangeRateSpread",
        "type": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/Number"
        ],
        "description": "The difference between the price at which a broker or other intermediary buys and sells foreign currency.",
        "expectedTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/ExchangeRateSpecification"
        ]
      }
    ]
  },
  {
    "name": "ExerciseAction",
    "type": "https://schema.org/ExerciseAction",
    "source": "generated",
    "description": "The act of participating in exertive activity for the purposes of improving health and fitness.",
    "parentTypes": [
      "https://schema.org/PlayAction"
    ],
    "properties": [
      {
        "name": "course",
        "type": "https://schema.org/Place",
        "description": "A sub property of location. The course where this action was taken.",
        "expectedTypes": [
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/ExerciseAction"
        ],
        "supersededBy": "https://schema.org/exerciseCourse"
      },
      {
        "name": "diet",
        "type": "https://schema.org/Diet",
        "description": "A sub property of instrument. The diet used in this action.",
        "expectedTypes": [
          "https://schema.org/Diet"
        ],
        "rangeTypes": [
          "https://schema.org/Diet"
        ],
        "domainTypes": [
          "https://schema.org/ExerciseAction"
        ]
      },
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
      },
      {
        "name": "exerciseCourse",
        "type": "https://schema.org/Place",
        "description": "A sub property of location. The course where this action was taken.",
        "expectedTypes": [
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/ExerciseAction"
        ]
      },
      {
        "name": "exercisePlan",
        "type": "https://schema.org/ExercisePlan",
        "description": "A sub property of instrument. The exercise plan used on this action.",
        "expectedTypes": [
          "https://schema.org/ExercisePlan"
        ],
        "rangeTypes": [
          "https://schema.org/ExercisePlan"
        ],
        "domainTypes": [
          "https://schema.org/ExerciseAction"
        ]
      },
      {
        "name": "exerciseRelatedDiet",
        "type": "https://schema.org/Diet",
        "description": "A sub property of instrument. The diet used in this action.",
        "expectedTypes": [
          "https://schema.org/Diet"
        ],
        "rangeTypes": [
          "https://schema.org/Diet"
        ],
        "domainTypes": [
          "https://schema.org/ExerciseAction"
        ]
      },
      {
        "name": "exerciseType",
        "type": "https://schema.org/Text",
        "description": "Type(s) of exercise or activity, such as strength training, flexibility training, aerobics, cardiac rehabilitation, etc.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/ExerciseAction",
          "https://schema.org/ExercisePlan"
        ]
      },
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
        "name": "opponent",
        "type": "https://schema.org/Person",
        "description": "A sub property of participant. The opponent on this action.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/ExerciseAction"
        ]
      },
      {
        "name": "sportsActivityLocation",
        "type": "https://schema.org/SportsActivityLocation",
        "description": "A sub property of location. The sports activity location where this action occurred.",
        "expectedTypes": [
          "https://schema.org/SportsActivityLocation"
        ],
        "rangeTypes": [
          "https://schema.org/SportsActivityLocation"
        ],
        "domainTypes": [
          "https://schema.org/ExerciseAction"
        ]
      },
      {
        "name": "sportsEvent",
        "type": "https://schema.org/SportsEvent",
        "description": "A sub property of location. The sports event where this action occurred.",
        "expectedTypes": [
          "https://schema.org/SportsEvent"
        ],
        "rangeTypes": [
          "https://schema.org/SportsEvent"
        ],
        "domainTypes": [
          "https://schema.org/ExerciseAction"
        ]
      },
      {
        "name": "sportsTeam",
        "type": "https://schema.org/SportsTeam",
        "description": "A sub property of participant. The sports team that participated on this action.",
        "expectedTypes": [
          "https://schema.org/SportsTeam"
        ],
        "rangeTypes": [
          "https://schema.org/SportsTeam"
        ],
        "domainTypes": [
          "https://schema.org/ExerciseAction"
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
    "name": "ExerciseGym",
    "type": "https://schema.org/ExerciseGym",
    "source": "generated",
    "description": "A gym.",
    "parentTypes": [
      "https://schema.org/SportsActivityLocation"
    ]
  },
  {
    "name": "ExercisePlan",
    "type": "https://schema.org/ExercisePlan",
    "source": "generated",
    "description": "Fitness-related activity designed for a specific health-related purpose, including defined exercise routines as well as activity prescribed by a clinician.",
    "parentTypes": [
      "https://schema.org/CreativeWork",
      "https://schema.org/PhysicalActivity"
    ],
    "properties": [
      {
        "name": "activityDuration",
        "type": [
          "https://schema.org/Duration",
          "https://schema.org/QuantitativeValue"
        ],
        "description": "Length of time to engage in the activity.",
        "expectedTypes": [
          "https://schema.org/Duration",
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/Duration",
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/ExercisePlan"
        ]
      },
      {
        "name": "activityFrequency",
        "type": [
          "https://schema.org/QuantitativeValue",
          "https://schema.org/Text"
        ],
        "description": "How often one should engage in the activity.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/ExercisePlan"
        ]
      },
      {
        "name": "additionalVariable",
        "type": "https://schema.org/Text",
        "description": "Any additional component of the exercise prescription that may need to be articulated to the patient. This may include the order of exercises, the number of repetitions of movement, quantitative distance, progressions over time, etc.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/ExercisePlan"
        ]
      },
      {
        "name": "exerciseType",
        "type": "https://schema.org/Text",
        "description": "Type(s) of exercise or activity, such as strength training, flexibility training, aerobics, cardiac rehabilitation, etc.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/ExerciseAction",
          "https://schema.org/ExercisePlan"
        ]
      },
      {
        "name": "intensity",
        "type": [
          "https://schema.org/QuantitativeValue",
          "https://schema.org/Text"
        ],
        "description": "Quantitative measure gauging the degree of force involved in the exercise, for example, heartbeats per minute. May include the velocity of the movement.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/ExercisePlan"
        ]
      },
      {
        "name": "repetitions",
        "type": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "description": "Number of times one should repeat the activity.",
        "expectedTypes": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/ExercisePlan"
        ]
      },
      {
        "name": "restPeriods",
        "type": [
          "https://schema.org/QuantitativeValue",
          "https://schema.org/Text"
        ],
        "description": "How often one should break from the activity.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/ExercisePlan"
        ]
      },
      {
        "name": "workload",
        "type": [
          "https://schema.org/Energy",
          "https://schema.org/QuantitativeValue"
        ],
        "description": "Quantitative measure of the physiologic output of the exercise; also referred to as energy expenditure.",
        "expectedTypes": [
          "https://schema.org/Energy",
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/Energy",
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/ExercisePlan"
        ]
      }
    ]
  },
  {
    "name": "ExhibitionEvent",
    "type": "https://schema.org/ExhibitionEvent",
    "source": "generated",
    "description": "Event type: Exhibition event, e.g. at a museum, library, archive, tradeshow, ...",
    "parentTypes": [
      "https://schema.org/Event"
    ]
  },
  {
    "name": "F31_Performance",
    "type": "http://iflastandards.info/ns/lrm/lrmoo/F31_Performance",
    "source": "generated"
  },
  {
    "name": "FAQPage",
    "type": "https://schema.org/FAQPage",
    "source": "generated",
    "description": "A [[FAQPage]] is a [[WebPage]] presenting one or more \"[Frequently asked questions](https://en.wikipedia.org/wiki/FAQ)\" (see also [[QAPage]]).",
    "parentTypes": [
      "https://schema.org/WebPage"
    ]
  },
  {
    "name": "FastFoodRestaurant",
    "type": "https://schema.org/FastFoodRestaurant",
    "source": "generated",
    "description": "A fast-food restaurant.",
    "parentTypes": [
      "https://schema.org/FoodEstablishment"
    ]
  },
  {
    "name": "Festival",
    "type": "https://schema.org/Festival",
    "source": "generated",
    "description": "Event type: Festival.",
    "parentTypes": [
      "https://schema.org/Event"
    ]
  },
  {
    "name": "FilmAction",
    "type": "https://schema.org/FilmAction",
    "source": "generated",
    "description": "The act of capturing sound and moving images on film, video, or digitally.",
    "parentTypes": [
      "https://schema.org/CreateAction"
    ]
  },
  {
    "name": "FinancialCard",
    "type": "http://unece.org/vocab#FinancialCard",
    "source": "generated"
  },
  {
    "name": "FinancialIncentive",
    "type": "https://schema.org/FinancialIncentive",
    "source": "generated",
    "description": "<p>Represents financial incentives for goods/services offered by an organization (or individual).</p>\n\n<p>Typically contains the [[name]] of the incentive, the [[incentivizedItem]], the [[incentiveAmount]], the [[incentiveStatus]], [[incentiveType]], the [[provider]] of the incentive, and [[eligibleWithSupplier]].</p>\n\n<p>Optionally contains criteria on whether the incentive is limited based on [[purchaseType]], [[purchasePriceLimit]], [[incomeLimit]], and the [[qualifiedExpense]].\n    ",
    "parentTypes": [
      "https://schema.org/Intangible"
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
        "name": "eligibleWithSupplier",
        "type": "https://schema.org/Organization",
        "description": "The supplier of the incentivized item/service for which the incentive is valid for such as a utility company, merchant, or contractor.",
        "expectedTypes": [
          "https://schema.org/Organization"
        ],
        "rangeTypes": [
          "https://schema.org/Organization"
        ],
        "domainTypes": [
          "https://schema.org/FinancialIncentive"
        ]
      },
      {
        "name": "incentiveAmount",
        "type": [
          "https://schema.org/LoanOrCredit",
          "https://schema.org/QuantitativeValue",
          "https://schema.org/UnitPriceSpecification"
        ],
        "description": "Describes the amount that can be redeemed from this incentive.\n    \n<p>[[QuantitativeValue]]: Use this for incentives based on price (either raw amount or percentage-based). For a raw amount example, \"You can claim $2,500 - $7,500 from the total cost of installation\" would be represented as the following:</p>\n    {\n        \"@type\": \"QuantitativeValue\",\n        “minValue”: 2500,\n        “maxValue”: 7500,\n        \"unitCode\": \"USD\"\n    }\n<p>[[QuantitativeValue]] can also be used for percentage amounts. In such cases, value is used to represent the incentive’s percentage, while maxValue represents a limit (if one exists) to that incentive. The unitCode should be 'P1' and the unitText should be '%', while valueReference should be used for holding the currency type. For example, \"You can claim up to 30% of the total cost of installation, up to a maximum of $7,500\" would be:</p>\n    {\n        \"@type\": \"QuantitativeValue\",\n        \"value\": 30,\n        \"unitCode\": \"P1\",\n        \"unitText\": \"%\",\n        “maxValue”: 7500,\n        “valueReference”: “USD”\n    }\n<p>[[UnitPriceSpecification]]: Use this for incentives that are based on amounts rather than price. For example, a net metering rebate that pays $10/kWh, up to $1,000:</p>\n    {\n        \"@type\": \"UnitPriceSpecification\",\n        \"price\": 10,\n        \"priceCurrency\": \"USD\",\n        \"referenceQuantity\": 1,\n        \"unitCode\": \"DO3\",\n        \"unitText\": \"kw/h\",\n        \"maxPrice\": 1000,\n        \"description\": \"$10 / kwh up to $1000\"\n    }\n<p>[[LoanOrCredit]]: Use for incentives that are loan based. For example, a loan of $4,000 - $50,000 with a repayment term of 10 years, interest free would look like:</p>\n    {\n        \"@type\": \"LoanOrCredit\",\n        \"loanTerm\": {\n                \"@type\":\"QuantitativeValue\",\n                \"value\":\"10\",\n                \"unitCode\": \"ANN\"\n            },\n        \"amount\":[\n            {\n                \"@type\": \"QuantitativeValue\",\n                \"Name\":\"fixed interest rate\",\n                \"value\":\"0\",\n            },\n        ],\n        \"amount\":[\n            {\n                \"@type\": \"MonetaryAmount\",\n                \"Name\":\"min loan amount\",\n                \"value\":\"4000\",\n                \"currency\":\"CAD\"\n            },\n            {\n                \"@type\": \"MonetaryAmount\",\n                \"Name\":\"max loan amount\",\n                \"value\":\"50000\",\n                \"currency\":\"CAD\"\n            }\n        ],\n    }\n\nIn summary: <ul><li>Use [[QuantitativeValue]] for absolute/percentage-based incentives applied on the price of a good/service.</li>\n<li>Use [[UnitPriceSpecification]] for incentives based on a per-unit basis (e.g. net metering).</li>\n<li>Use [[LoanOrCredit]] for loans/credits.</li>\n</ul>.",
        "expectedTypes": [
          "https://schema.org/LoanOrCredit",
          "https://schema.org/QuantitativeValue",
          "https://schema.org/UnitPriceSpecification"
        ],
        "rangeTypes": [
          "https://schema.org/LoanOrCredit",
          "https://schema.org/QuantitativeValue",
          "https://schema.org/UnitPriceSpecification"
        ],
        "domainTypes": [
          "https://schema.org/FinancialIncentive"
        ]
      },
      {
        "name": "incentiveStatus",
        "type": "https://schema.org/IncentiveStatus",
        "description": "The status of the incentive (active, on hold, retired, etc.).",
        "expectedTypes": [
          "https://schema.org/IncentiveStatus"
        ],
        "rangeTypes": [
          "https://schema.org/IncentiveStatus"
        ],
        "domainTypes": [
          "https://schema.org/FinancialIncentive"
        ]
      },
      {
        "name": "incentiveType",
        "type": "https://schema.org/IncentiveType",
        "description": "The type of incentive offered (tax credit/rebate, tax deduction, tax waiver, subsidies, etc.).",
        "expectedTypes": [
          "https://schema.org/IncentiveType"
        ],
        "rangeTypes": [
          "https://schema.org/IncentiveType"
        ],
        "domainTypes": [
          "https://schema.org/FinancialIncentive"
        ]
      },
      {
        "name": "incentivizedItem",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Product"
        ],
        "description": "The type or specific product(s) and/or service(s) being incentivized.\n<p>DefinedTermSets are used for product and service categories such as the United Nations Standard Products and Services Code:</p>\n    {\n        \"@type\": \"DefinedTerm\",\n        \"inDefinedTermSet\": \"https://www.unspsc.org/\",\n        \"termCode\": \"261315XX\",\n        \"name\": \"Photovoltaic module\"\n    }\n\n<p>For a specific product or service, use the Product type:</p>\n    {\n        \"@type\": \"Product\",\n        \"name\": \"Kenmore White 17\" Microwave\",\n    }\nFor multiple different incentivized items, use multiple [[DefinedTerm]] or [[Product]].",
        "expectedTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Product"
        ],
        "rangeTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Product"
        ],
        "domainTypes": [
          "https://schema.org/FinancialIncentive"
        ]
      },
      {
        "name": "incomeLimit",
        "type": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/Text"
        ],
        "description": "Optional. Income limit for which the incentive is applicable for.\n    \n<p>If MonetaryAmount is specified, this should be based on annualized income (e.g. if an incentive is limited to those making <$114,000 annually):</p>\n    {\n        \"@type\": \"MonetaryAmount\",\n        \"maxValue\": 114000,\n        \"currency\": \"USD\",\n    }\n\nUse Text for incentives that are limited based on other criteria, for example if an incentive is only available to recipients making 120% of the median poverty income in their area.",
        "expectedTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/FinancialIncentive"
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
        "name": "publisher",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "The publisher of the article in question.",
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
          "https://schema.org/FinancialIncentive"
        ]
      },
      {
        "name": "purchasePriceLimit",
        "type": "https://schema.org/MonetaryAmount",
        "description": "Optional. The maximum price the item can have and still qualify for this offer.",
        "expectedTypes": [
          "https://schema.org/MonetaryAmount"
        ],
        "rangeTypes": [
          "https://schema.org/MonetaryAmount"
        ],
        "domainTypes": [
          "https://schema.org/FinancialIncentive"
        ]
      },
      {
        "name": "purchaseType",
        "type": "https://schema.org/PurchaseType",
        "description": "Optional. The type of purchase the consumer must make in order to qualify for this incentive.",
        "expectedTypes": [
          "https://schema.org/PurchaseType"
        ],
        "rangeTypes": [
          "https://schema.org/PurchaseType"
        ],
        "domainTypes": [
          "https://schema.org/FinancialIncentive"
        ]
      },
      {
        "name": "qualifiedExpense",
        "type": "https://schema.org/IncentiveQualifiedExpenseType",
        "description": "Optional. The types of expenses that are covered by the incentive. For example some incentives are only for the goods (tangible items) but the services (labor) are excluded.",
        "expectedTypes": [
          "https://schema.org/IncentiveQualifiedExpenseType"
        ],
        "rangeTypes": [
          "https://schema.org/IncentiveQualifiedExpenseType"
        ],
        "domainTypes": [
          "https://schema.org/FinancialIncentive"
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
      }
    ]
  },
  {
    "name": "FinancialProduct",
    "type": "https://schema.org/FinancialProduct",
    "source": "generated",
    "description": "A product provided to consumers and businesses by financial institutions such as banks, insurance companies, brokerage firms, consumer finance companies, and investment companies which comprise the financial services industry.",
    "parentTypes": [
      "https://schema.org/Service"
    ],
    "properties": [
      {
        "name": "annualPercentageRate",
        "type": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "description": "The annual rate that is charged for borrowing (or made by investing), expressed as a single percentage number that represents the actual yearly cost of funds over the term of a loan. This includes any fees or additional costs associated with the transaction.",
        "expectedTypes": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/FinancialProduct"
        ]
      },
      {
        "name": "feesAndCommissionsSpecification",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "Description of fees, commissions, and other terms applied either to a class of financial product, or by a financial service organization.",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/FinancialProduct",
          "https://schema.org/FinancialService"
        ]
      },
      {
        "name": "interestRate",
        "type": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "description": "The interest rate, charged or paid, applicable to the financial product. Note: This is different from the calculated annualPercentageRate.",
        "expectedTypes": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/FinancialProduct"
        ]
      }
    ]
  },
  {
    "name": "FinancialService",
    "type": "https://schema.org/FinancialService",
    "source": "generated",
    "description": "Financial services business.",
    "parentTypes": [
      "https://schema.org/LocalBusiness"
    ],
    "properties": [
      {
        "name": "feesAndCommissionsSpecification",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "Description of fees, commissions, and other terms applied either to a class of financial product, or by a financial service organization.",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/FinancialProduct",
          "https://schema.org/FinancialService"
        ]
      }
    ]
  },
  {
    "name": "FindAction",
    "type": "https://schema.org/FindAction",
    "source": "generated",
    "description": "The act of finding an object.\\n\\nRelated actions:\\n\\n* [[SearchAction]]: FindAction is generally lead by a SearchAction, but not necessarily.",
    "parentTypes": [
      "https://schema.org/Action"
    ]
  },
  {
    "name": "FireStation",
    "type": "https://schema.org/FireStation",
    "source": "generated",
    "description": "A fire station. With firemen.",
    "parentTypes": [
      "https://schema.org/CivicStructure",
      "https://schema.org/EmergencyService"
    ]
  },
  {
    "name": "Flight",
    "type": "https://schema.org/Flight",
    "source": "generated",
    "description": "An airline flight.",
    "parentTypes": [
      "https://schema.org/Trip"
    ],
    "properties": [
      {
        "name": "aircraft",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/Vehicle"
        ],
        "description": "The kind of aircraft (e.g., \"Boeing 747\").",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/Vehicle"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/Vehicle"
        ],
        "domainTypes": [
          "https://schema.org/Flight"
        ]
      },
      {
        "name": "arrivalAirport",
        "type": "https://schema.org/Airport",
        "description": "The airport where the flight terminates.",
        "expectedTypes": [
          "https://schema.org/Airport"
        ],
        "rangeTypes": [
          "https://schema.org/Airport"
        ],
        "domainTypes": [
          "https://schema.org/Flight"
        ]
      },
      {
        "name": "arrivalGate",
        "type": "https://schema.org/Text",
        "description": "Identifier of the flight's arrival gate.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Flight"
        ]
      },
      {
        "name": "arrivalTerminal",
        "type": "https://schema.org/Text",
        "description": "Identifier of the flight's arrival terminal.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Flight"
        ]
      },
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
        "name": "carrier",
        "type": "https://schema.org/Organization",
        "description": "'carrier' is an out-dated term indicating the 'provider' for parcel delivery and flights.",
        "expectedTypes": [
          "https://schema.org/Organization"
        ],
        "rangeTypes": [
          "https://schema.org/Organization"
        ],
        "domainTypes": [
          "https://schema.org/Flight",
          "https://schema.org/ParcelDelivery"
        ],
        "supersededBy": "https://schema.org/provider"
      },
      {
        "name": "departureAirport",
        "type": "https://schema.org/Airport",
        "description": "The airport where the flight originates.",
        "expectedTypes": [
          "https://schema.org/Airport"
        ],
        "rangeTypes": [
          "https://schema.org/Airport"
        ],
        "domainTypes": [
          "https://schema.org/Flight"
        ]
      },
      {
        "name": "departureGate",
        "type": "https://schema.org/Text",
        "description": "Identifier of the flight's departure gate.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Flight"
        ]
      },
      {
        "name": "departureTerminal",
        "type": "https://schema.org/Text",
        "description": "Identifier of the flight's departure terminal.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Flight"
        ]
      },
      {
        "name": "estimatedFlightDuration",
        "type": [
          "https://schema.org/Duration",
          "https://schema.org/Text"
        ],
        "description": "The estimated time the flight will take.",
        "expectedTypes": [
          "https://schema.org/Duration",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Duration",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Flight"
        ]
      },
      {
        "name": "flightDistance",
        "type": [
          "https://schema.org/Distance",
          "https://schema.org/Text"
        ],
        "description": "The distance of the flight.",
        "expectedTypes": [
          "https://schema.org/Distance",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Distance",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Flight"
        ]
      },
      {
        "name": "flightNumber",
        "type": "https://schema.org/Text",
        "description": "The unique identifier for a flight including the airline IATA code. For example, if describing United flight 110, where the IATA code for United is 'UA', the flightNumber is 'UA110'.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Flight"
        ]
      },
      {
        "name": "mealService",
        "type": "https://schema.org/Text",
        "description": "Description of the meals that will be provided or available for purchase.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Flight"
        ]
      },
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
        "name": "webCheckinTime",
        "type": "https://schema.org/DateTime",
        "description": "The time when a passenger can check into the flight online.",
        "expectedTypes": [
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/Flight"
        ]
      }
    ]
  },
  {
    "name": "FlightReservation",
    "type": "https://schema.org/FlightReservation",
    "source": "generated",
    "description": "A reservation for air travel.\\n\\nNote: This type is for information about actual reservations, e.g. in confirmation emails or HTML pages with individual confirmations of reservations. For offers of tickets, use [[Offer]].",
    "parentTypes": [
      "https://schema.org/Reservation"
    ],
    "properties": [
      {
        "name": "boardingGroup",
        "type": "https://schema.org/Text",
        "description": "The airline-specific indicator of boarding order / preference.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/FlightReservation"
        ]
      },
      {
        "name": "passengerPriorityStatus",
        "type": [
          "https://schema.org/QualitativeValue",
          "https://schema.org/Text"
        ],
        "description": "The priority status assigned to a passenger for security or boarding (e.g. FastTrack or Priority).",
        "expectedTypes": [
          "https://schema.org/QualitativeValue",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/QualitativeValue",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/FlightReservation"
        ]
      },
      {
        "name": "passengerSequenceNumber",
        "type": "https://schema.org/Text",
        "description": "The passenger's sequence number as assigned by the airline.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/FlightReservation"
        ]
      },
      {
        "name": "securityScreening",
        "type": "https://schema.org/Text",
        "description": "The type of security screening the passenger is subject to.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/FlightReservation"
        ]
      }
    ]
  },
  {
    "name": "Float",
    "type": "https://schema.org/Float",
    "source": "generated",
    "description": "Data type: Floating number.",
    "parentTypes": [
      "https://schema.org/Number"
    ]
  },
  {
    "name": "FloorPlan",
    "type": "https://schema.org/FloorPlan",
    "source": "generated",
    "description": "A FloorPlan is an explicit representation of a collection of similar accommodations, allowing the provision of common information (room counts, sizes, layout diagrams) and offers for rental or sale. In typical use, some [[ApartmentComplex]] has an [[accommodationFloorPlan]] which is a [[FloorPlan]].  A FloorPlan is always in the context of a particular place, either a larger [[ApartmentComplex]] or a single [[Apartment]]. The visual/spatial aspects of a floor plan (i.e. room layout, [see wikipedia](https://en.wikipedia.org/wiki/Floor_plan)) can be indicated using [[image]]. ",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
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
        "name": "isPlanForApartment",
        "type": "https://schema.org/Accommodation",
        "description": "Indicates some accommodation that this floor plan describes.",
        "expectedTypes": [
          "https://schema.org/Accommodation"
        ],
        "rangeTypes": [
          "https://schema.org/Accommodation"
        ],
        "domainTypes": [
          "https://schema.org/FloorPlan"
        ]
      },
      {
        "name": "layoutImage",
        "type": [
          "https://schema.org/ImageObject",
          "https://schema.org/URL"
        ],
        "description": "A schematic image showing the floorplan layout.",
        "expectedTypes": [
          "https://schema.org/ImageObject",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/ImageObject",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/FloorPlan"
        ]
      },
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
      }
    ]
  },
  {
    "name": "Florist",
    "type": "https://schema.org/Florist",
    "source": "generated",
    "description": "A florist.",
    "parentTypes": [
      "https://schema.org/Store"
    ]
  },
  {
    "name": "FMRadioChannel",
    "type": "https://schema.org/FMRadioChannel",
    "source": "generated",
    "description": "A radio channel that uses FM.",
    "parentTypes": [
      "https://schema.org/RadioChannel"
    ]
  },
  {
    "name": "FollowAction",
    "type": "https://schema.org/FollowAction",
    "source": "generated",
    "description": "The act of forming a personal connection with someone/something (object) unidirectionally/asymmetrically to get updates polled from.\\n\\nRelated actions:\\n\\n* [[BefriendAction]]: Unlike BefriendAction, FollowAction implies that the connection is *not* necessarily reciprocal.\\n* [[SubscribeAction]]: Unlike SubscribeAction, FollowAction implies that the follower acts as an active agent constantly/actively polling for updates.\\n* [[RegisterAction]]: Unlike RegisterAction, FollowAction implies that the agent is interested in continuing receiving updates from the object.\\n* [[JoinAction]]: Unlike JoinAction, FollowAction implies that the agent is interested in getting updates from the object.\\n* [[TrackAction]]: Unlike TrackAction, FollowAction refers to the polling of updates of all aspects of animate objects rather than the location of inanimate objects (e.g. you track a package, but you don't follow it).",
    "parentTypes": [
      "https://schema.org/InteractAction"
    ],
    "properties": [
      {
        "name": "followee",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "A sub property of object. The person or organization being followed.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/FollowAction"
        ]
      }
    ]
  },
  {
    "name": "FoodEstablishment",
    "type": "https://schema.org/FoodEstablishment",
    "source": "generated",
    "description": "A food-related business.",
    "parentTypes": [
      "https://schema.org/LocalBusiness"
    ],
    "properties": [
      {
        "name": "acceptsReservations",
        "type": [
          "https://schema.org/Boolean",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "Indicates whether a FoodEstablishment accepts reservations. Values can be Boolean, an URL at which reservations can be made or (for backwards compatibility) the strings ```Yes``` or ```No```.",
        "expectedTypes": [
          "https://schema.org/Boolean",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/FoodEstablishment"
        ]
      },
      {
        "name": "hasMenu",
        "type": [
          "https://schema.org/Menu",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "Either the actual menu as a structured representation, as text, or a URL of the menu.",
        "expectedTypes": [
          "https://schema.org/Menu",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Menu",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/FoodEstablishment"
        ]
      },
      {
        "name": "menu",
        "type": [
          "https://schema.org/Menu",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "Either the actual menu as a structured representation, as text, or a URL of the menu.",
        "expectedTypes": [
          "https://schema.org/Menu",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Menu",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/FoodEstablishment"
        ],
        "supersededBy": "https://schema.org/hasMenu"
      },
      {
        "name": "servesCuisine",
        "type": "https://schema.org/Text",
        "description": "The cuisine of the restaurant.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/FoodEstablishment"
        ]
      },
      {
        "name": "starRating",
        "type": "https://schema.org/Rating",
        "description": "An official rating for a lodging business or food establishment, e.g. from national associations or standards bodies. Use the author property to indicate the rating organization, e.g. as an Organization with name such as (e.g. HOTREC, DEHOGA, WHR, or Hotelstars).",
        "expectedTypes": [
          "https://schema.org/Rating"
        ],
        "rangeTypes": [
          "https://schema.org/Rating"
        ],
        "domainTypes": [
          "https://schema.org/FoodEstablishment",
          "https://schema.org/LodgingBusiness"
        ]
      }
    ]
  },
  {
    "name": "FoodEstablishmentReservation",
    "type": "https://schema.org/FoodEstablishmentReservation",
    "source": "generated",
    "description": "A reservation to dine at a food-related business.\\n\\nNote: This type is for information about actual reservations, e.g. in confirmation emails or HTML pages with individual confirmations of reservations.",
    "parentTypes": [
      "https://schema.org/Reservation"
    ],
    "properties": [
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
    "name": "FoodEvent",
    "type": "https://schema.org/FoodEvent",
    "source": "generated",
    "description": "Event type: Food event.",
    "parentTypes": [
      "https://schema.org/Event"
    ]
  },
  {
    "name": "FoodService",
    "type": "https://schema.org/FoodService",
    "source": "generated",
    "description": "A food service, like breakfast, lunch, or dinner.",
    "parentTypes": [
      "https://schema.org/Service"
    ]
  },
  {
    "name": "FulfillmentTypeEnumeration",
    "type": "https://schema.org/FulfillmentTypeEnumeration",
    "source": "generated",
    "description": "A type of product fulfillment.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "FulfillmentTypeCollectionPoint",
        "type": "https://schema.org/FulfillmentTypeCollectionPoint",
        "description": "Fulfillment to a collection point location."
      },
      {
        "name": "FulfillmentTypeDelivery",
        "type": "https://schema.org/FulfillmentTypeDelivery",
        "description": "Fulfillment to a customer selected address."
      },
      {
        "name": "FulfillmentTypePickupDropoff",
        "type": "https://schema.org/FulfillmentTypePickupDropoff",
        "description": "Fulfillment through pick-up drop-off locations."
      },
      {
        "name": "FulfillmentTypePickupInStore",
        "type": "https://schema.org/FulfillmentTypePickupInStore",
        "description": "Fulfillment through pick-up in a store."
      },
      {
        "name": "FulfillmentTypeScheduledDelivery",
        "type": "https://schema.org/FulfillmentTypeScheduledDelivery",
        "description": "Fulfillment to a customer selected address after scheduling with the customer."
      }
    ]
  },
  {
    "name": "FundingAgency",
    "type": "https://schema.org/FundingAgency",
    "source": "generated",
    "description": "A FundingAgency is an organization that implements one or more [[FundingScheme]]s and manages\n    the granting process (via [[Grant]]s, typically [[MonetaryGrant]]s).\n    A funding agency is not always required for grant funding, e.g. philanthropic giving, corporate sponsorship etc.\n    \nExamples of funding agencies include ERC, REA, NIH, Bill and Melinda Gates Foundation, ...\n    ",
    "parentTypes": [
      "https://schema.org/Project"
    ]
  },
  {
    "name": "FundingScheme",
    "type": "https://schema.org/FundingScheme",
    "source": "generated",
    "description": "A FundingScheme combines organizational, project and policy aspects of grant-based funding\n    that sets guidelines, principles and mechanisms to support other kinds of projects and activities.\n    Funding is typically organized via [[Grant]] funding. Examples of funding schemes: Swiss Priority Programmes (SPPs); EU Framework 7 (FP7); Horizon 2020; the NIH-R01 Grant Program; Wellcome institutional strategic support fund. For large scale public sector funding, the management and administration of grant awards is often handled by other, dedicated, organizations - [[FundingAgency]]s such as ERC, REA, ...",
    "parentTypes": [
      "https://schema.org/Organization"
    ]
  },
  {
    "name": "FurnitureStore",
    "type": "https://schema.org/FurnitureStore",
    "source": "generated",
    "description": "A furniture store.",
    "parentTypes": [
      "https://schema.org/Store"
    ]
  },
  {
    "name": "Game",
    "type": "https://schema.org/Game",
    "source": "generated",
    "description": "The Game type represents things which are games. These are typically rule-governed recreational activities, e.g. role-playing games in which players assume the role of characters in a fictional setting.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ],
    "properties": [
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
      }
    ]
  },
  {
    "name": "GameAvailabilityEnumeration",
    "type": "https://schema.org/GameAvailabilityEnumeration",
    "source": "generated",
    "description": "For a [[VideoGame]], such as used with a [[PlayGameAction]], an enumeration of the kind of game availability offered. ",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "DemoGameAvailability",
        "type": "https://schema.org/DemoGameAvailability",
        "description": "Indicates demo game availability, i.e. a somehow limited demonstration of the full game."
      },
      {
        "name": "FullGameAvailability",
        "type": "https://schema.org/FullGameAvailability",
        "description": "Indicates full game availability."
      }
    ]
  },
  {
    "name": "GamePlayMode",
    "type": "https://schema.org/GamePlayMode",
    "source": "generated",
    "description": "Indicates whether this game is multi-player, co-op or single-player.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "CoOp",
        "type": "https://schema.org/CoOp",
        "description": "Play mode: CoOp. Co-operative games, where you play on the same team with friends."
      },
      {
        "name": "MultiPlayer",
        "type": "https://schema.org/MultiPlayer",
        "description": "Play mode: MultiPlayer. Requiring or allowing multiple human players to play simultaneously."
      },
      {
        "name": "SinglePlayer",
        "type": "https://schema.org/SinglePlayer",
        "description": "Play mode: SinglePlayer. Which is played by a lone player."
      }
    ]
  },
  {
    "name": "GameServer",
    "type": "https://schema.org/GameServer",
    "source": "generated",
    "description": "Server that provides game interaction in a multiplayer game.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "game",
        "type": "https://schema.org/VideoGame",
        "description": "Video game which is played on this server.",
        "expectedTypes": [
          "https://schema.org/VideoGame"
        ],
        "rangeTypes": [
          "https://schema.org/VideoGame"
        ],
        "domainTypes": [
          "https://schema.org/GameServer"
        ],
        "inverseOf": "https://schema.org/gameServer"
      },
      {
        "name": "playersOnline",
        "type": "https://schema.org/Integer",
        "description": "Number of players on the server.",
        "expectedTypes": [
          "https://schema.org/Integer"
        ],
        "rangeTypes": [
          "https://schema.org/Integer"
        ],
        "domainTypes": [
          "https://schema.org/GameServer"
        ]
      },
      {
        "name": "serverStatus",
        "type": "https://schema.org/GameServerStatus",
        "description": "Status of a game server.",
        "expectedTypes": [
          "https://schema.org/GameServerStatus"
        ],
        "rangeTypes": [
          "https://schema.org/GameServerStatus"
        ],
        "domainTypes": [
          "https://schema.org/GameServer"
        ]
      }
    ]
  },
  {
    "name": "GameServerStatus",
    "type": "https://schema.org/GameServerStatus",
    "source": "generated",
    "description": "Status of a game server.",
    "parentTypes": [
      "https://schema.org/StatusEnumeration"
    ],
    "enumerationValues": [
      {
        "name": "OfflinePermanently",
        "type": "https://schema.org/OfflinePermanently",
        "description": "Game server status: OfflinePermanently. Server is offline and not available."
      },
      {
        "name": "OfflineTemporarily",
        "type": "https://schema.org/OfflineTemporarily",
        "description": "Game server status: OfflineTemporarily. Server is offline now but it can be online soon."
      },
      {
        "name": "Online",
        "type": "https://schema.org/Online",
        "description": "Game server status: Online. Server is available."
      },
      {
        "name": "OnlineFull",
        "type": "https://schema.org/OnlineFull",
        "description": "Game server status: OnlineFull. Server is online but unavailable. The maximum number of players has reached."
      }
    ]
  },
  {
    "name": "GardenStore",
    "type": "https://schema.org/GardenStore",
    "source": "generated",
    "description": "A garden store.",
    "parentTypes": [
      "https://schema.org/Store"
    ]
  },
  {
    "name": "GasStation",
    "type": "https://schema.org/GasStation",
    "source": "generated",
    "description": "A gas station.",
    "parentTypes": [
      "https://schema.org/AutomotiveBusiness"
    ]
  },
  {
    "name": "GatedResidenceCommunity",
    "type": "https://schema.org/GatedResidenceCommunity",
    "source": "generated",
    "description": "Residence type: Gated community.",
    "parentTypes": [
      "https://schema.org/Residence"
    ]
  },
  {
    "name": "GenderType",
    "type": "https://schema.org/GenderType",
    "source": "generated",
    "description": "An enumeration of genders.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "Female",
        "type": "https://schema.org/Female",
        "description": "The female gender."
      },
      {
        "name": "Male",
        "type": "https://schema.org/Male",
        "description": "The male gender."
      }
    ]
  },
  {
    "name": "Gene",
    "type": "https://schema.org/Gene",
    "source": "generated",
    "description": "A discrete unit of inheritance which affects one or more biological traits (Source: [https://en.wikipedia.org/wiki/Gene](https://en.wikipedia.org/wiki/Gene)). Examples include FOXP2 (Forkhead box protein P2), SCARNA21 (small Cajal body-specific RNA 21), A- (agouti genotype).",
    "parentTypes": [
      "https://schema.org/BioChemEntity"
    ],
    "properties": [
      {
        "name": "alternativeOf",
        "type": "https://schema.org/Gene",
        "description": "Another gene which is a variation of this one.",
        "expectedTypes": [
          "https://schema.org/Gene"
        ],
        "rangeTypes": [
          "https://schema.org/Gene"
        ],
        "domainTypes": [
          "https://schema.org/Gene"
        ]
      },
      {
        "name": "encodesBioChemEntity",
        "type": "https://schema.org/BioChemEntity",
        "description": "Another BioChemEntity encoded by this one. ",
        "expectedTypes": [
          "https://schema.org/BioChemEntity"
        ],
        "rangeTypes": [
          "https://schema.org/BioChemEntity"
        ],
        "domainTypes": [
          "https://schema.org/Gene"
        ],
        "inverseOf": "https://schema.org/isEncodedByBioChemEntity"
      },
      {
        "name": "expressedIn",
        "type": [
          "https://schema.org/AnatomicalStructure",
          "https://schema.org/AnatomicalSystem",
          "https://schema.org/BioChemEntity",
          "https://schema.org/DefinedTerm"
        ],
        "description": "Tissue, organ, biological sample, etc in which activity of this gene has been observed experimentally. For example brain, digestive system.",
        "expectedTypes": [
          "https://schema.org/AnatomicalStructure",
          "https://schema.org/AnatomicalSystem",
          "https://schema.org/BioChemEntity",
          "https://schema.org/DefinedTerm"
        ],
        "rangeTypes": [
          "https://schema.org/AnatomicalStructure",
          "https://schema.org/AnatomicalSystem",
          "https://schema.org/BioChemEntity",
          "https://schema.org/DefinedTerm"
        ],
        "domainTypes": [
          "https://schema.org/Gene"
        ]
      },
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
    "name": "GeneralContractor",
    "type": "https://schema.org/GeneralContractor",
    "source": "generated",
    "description": "A general contractor.",
    "parentTypes": [
      "https://schema.org/HomeAndConstructionBusiness"
    ]
  },
  {
    "name": "GeoCircle",
    "type": "https://schema.org/GeoCircle",
    "source": "generated",
    "description": "A GeoCircle is a GeoShape representing a circular geographic area. As it is a GeoShape\n          it provides the simple textual property 'circle', but also allows the combination of postalCode alongside geoRadius.\n          The center of the circle can be indicated via the 'geoMidpoint' property, or more approximately using 'address', 'postalCode'.\n       ",
    "parentTypes": [
      "https://schema.org/GeoShape"
    ],
    "properties": [
      {
        "name": "geoMidpoint",
        "type": "https://schema.org/GeoCoordinates",
        "description": "Indicates the GeoCoordinates at the centre of a GeoShape, e.g. GeoCircle.",
        "expectedTypes": [
          "https://schema.org/GeoCoordinates"
        ],
        "rangeTypes": [
          "https://schema.org/GeoCoordinates"
        ],
        "domainTypes": [
          "https://schema.org/GeoCircle"
        ]
      },
      {
        "name": "geoRadius",
        "type": [
          "https://schema.org/Distance",
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "description": "Indicates the approximate radius of a GeoCircle (metres unless indicated otherwise via Distance notation).",
        "expectedTypes": [
          "https://schema.org/Distance",
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Distance",
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/GeoCircle"
        ]
      }
    ]
  },
  {
    "name": "GeoCoordinates",
    "type": "https://schema.org/GeoCoordinates",
    "source": "generated",
    "description": "The geographic coordinates of a place or event.",
    "parentTypes": [
      "https://schema.org/StructuredValue"
    ],
    "properties": [
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
        "name": "elevation",
        "type": [
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "description": "The elevation of a location ([WGS 84](https://en.wikipedia.org/wiki/World_Geodetic_System)). Values may be of the form 'NUMBER UNIT\\_OF\\_MEASUREMENT' (e.g., '1,000 m', '3,200 ft') while numbers alone should be assumed to be a value in meters.",
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
          "https://schema.org/GeoShape"
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
      }
    ]
  },
  {
    "name": "GeographicalCoordinate",
    "type": "http://unece.org/vocab#GeographicalCoordinate",
    "source": "generated"
  },
  {
    "name": "GeographicCoordinate",
    "type": "https://www.omg.org/spec/Commons/Locations/GeographicCoordinate",
    "source": "generated"
  },
  {
    "name": "GeopoliticalEntity",
    "type": "https://www.omg.org/spec/Commons/GeopoliticalEntities/GeopoliticalEntity",
    "source": "generated"
  },
  {
    "name": "GeoShape",
    "type": "https://schema.org/GeoShape",
    "source": "generated",
    "description": "The geographic shape of a place. A GeoShape can be described using several properties whose values are based on latitude/longitude pairs. Either whitespace or commas can be used to separate latitude and longitude; whitespace should be used when writing a list of several such points.",
    "parentTypes": [
      "https://schema.org/StructuredValue"
    ],
    "properties": [
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
        "name": "box",
        "type": "https://schema.org/Text",
        "description": "A box is the area enclosed by the rectangle formed by two points. The first point is the lower corner, the second point is the upper corner. A box is expressed as two points separated by a space character.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/GeoShape"
        ]
      },
      {
        "name": "circle",
        "type": "https://schema.org/Text",
        "description": "A circle is the circular region of a specified radius centered at a specified latitude and longitude. A circle is expressed as a pair followed by a radius in meters.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/GeoShape"
        ]
      },
      {
        "name": "elevation",
        "type": [
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "description": "The elevation of a location ([WGS 84](https://en.wikipedia.org/wiki/World_Geodetic_System)). Values may be of the form 'NUMBER UNIT\\_OF\\_MEASUREMENT' (e.g., '1,000 m', '3,200 ft') while numbers alone should be assumed to be a value in meters.",
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
          "https://schema.org/GeoShape"
        ]
      },
      {
        "name": "line",
        "type": "https://schema.org/Text",
        "description": "A line is a point-to-point path consisting of two or more points. A line is expressed as a series of two or more point objects separated by space.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/GeoShape"
        ]
      },
      {
        "name": "polygon",
        "type": "https://schema.org/Text",
        "description": "A polygon is the area enclosed by a point-to-point path for which the starting and ending points are the same. A polygon is expressed as a series of four or more space delimited points where the first and final points are identical.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/GeoShape"
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
      }
    ]
  },
  {
    "name": "GeospatialGeometry",
    "type": "https://schema.org/GeospatialGeometry",
    "source": "generated",
    "description": "(Eventually to be defined as) a supertype of GeoShape designed to accommodate definitions from Geo-Spatial best practices.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
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
      }
    ]
  },
  {
    "name": "GiveAction",
    "type": "https://schema.org/GiveAction",
    "source": "generated",
    "description": "The act of transferring ownership of an object to a destination. Reciprocal of TakeAction.\\n\\nRelated actions:\\n\\n* [[TakeAction]]: Reciprocal of GiveAction.\\n* [[SendAction]]: Unlike SendAction, GiveAction implies that ownership is being transferred (e.g. I may send my laptop to you, but that doesn't mean I'm giving it to you).",
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
    "name": "GolfCourse",
    "type": "https://schema.org/GolfCourse",
    "source": "generated",
    "description": "A golf course.",
    "parentTypes": [
      "https://schema.org/SportsActivityLocation"
    ]
  },
  {
    "name": "GovernmentBenefitsType",
    "type": "https://schema.org/GovernmentBenefitsType",
    "source": "generated",
    "description": "GovernmentBenefitsType enumerates several kinds of government benefits to support the COVID-19 situation. Note that this structure may not capture all benefits offered.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "BasicIncome",
        "type": "https://schema.org/BasicIncome",
        "description": "BasicIncome: this is a benefit for basic income."
      },
      {
        "name": "BusinessSupport",
        "type": "https://schema.org/BusinessSupport",
        "description": "BusinessSupport: this is a benefit for supporting businesses."
      },
      {
        "name": "DisabilitySupport",
        "type": "https://schema.org/DisabilitySupport",
        "description": "DisabilitySupport: this is a benefit for disability support."
      },
      {
        "name": "HealthCare",
        "type": "https://schema.org/HealthCare",
        "description": "HealthCare: this is a benefit for health care."
      },
      {
        "name": "OneTimePayments",
        "type": "https://schema.org/OneTimePayments",
        "description": "OneTimePayments: this is a benefit for one-time payments for individuals."
      },
      {
        "name": "PaidLeave",
        "type": "https://schema.org/PaidLeave",
        "description": "PaidLeave: this is a benefit for paid leave."
      },
      {
        "name": "ParentalSupport",
        "type": "https://schema.org/ParentalSupport",
        "description": "ParentalSupport: this is a benefit for parental support."
      },
      {
        "name": "UnemploymentSupport",
        "type": "https://schema.org/UnemploymentSupport",
        "description": "UnemploymentSupport: this is a benefit for unemployment support."
      }
    ]
  },
  {
    "name": "GovernmentBuilding",
    "type": "https://schema.org/GovernmentBuilding",
    "source": "generated",
    "description": "A government building.",
    "parentTypes": [
      "https://schema.org/CivicStructure"
    ]
  },
  {
    "name": "GovernmentOffice",
    "type": "https://schema.org/GovernmentOffice",
    "source": "generated",
    "description": "A government office&#x2014;for example, an IRS or DMV office.",
    "parentTypes": [
      "https://schema.org/LocalBusiness"
    ]
  },
  {
    "name": "GovernmentOrganization",
    "type": "https://schema.org/GovernmentOrganization",
    "source": "generated",
    "description": "A governmental organization or agency.",
    "parentTypes": [
      "https://schema.org/Organization"
    ]
  },
  {
    "name": "GovernmentPermit",
    "type": "https://schema.org/GovernmentPermit",
    "source": "generated",
    "description": "A permit issued by a government agency.",
    "parentTypes": [
      "https://schema.org/Permit"
    ]
  },
  {
    "name": "GovernmentService",
    "type": "https://schema.org/GovernmentService",
    "source": "generated",
    "description": "A service provided by a government organization, e.g. food stamps, veterans benefits, etc.",
    "parentTypes": [
      "https://schema.org/Service"
    ],
    "properties": [
      {
        "name": "jurisdiction",
        "type": [
          "https://schema.org/AdministrativeArea",
          "https://schema.org/Text"
        ],
        "description": "Indicates a legal jurisdiction, e.g. of some legislation, or where some government service is based.",
        "expectedTypes": [
          "https://schema.org/AdministrativeArea",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/AdministrativeArea",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/GovernmentService",
          "https://schema.org/Legislation"
        ]
      },
      {
        "name": "serviceOperator",
        "type": "https://schema.org/Organization",
        "description": "The operating organization, if different from the provider.  This enables the representation of services that are provided by an organization, but operated by another organization like a subcontractor.",
        "expectedTypes": [
          "https://schema.org/Organization"
        ],
        "rangeTypes": [
          "https://schema.org/Organization"
        ],
        "domainTypes": [
          "https://schema.org/GovernmentService"
        ]
      }
    ]
  },
  {
    "name": "Grant",
    "type": "https://schema.org/Grant",
    "source": "generated",
    "description": "A grant, typically financial or otherwise quantifiable, of resources. Typically a [[funder]] sponsors some [[MonetaryAmount]] to an [[Organization]] or [[Person]],\n    sometimes not necessarily via a dedicated or long-lived [[Project]], resulting in one or more outputs, or [[fundedItem]]s. For financial sponsorship, indicate the [[funder]] of a [[MonetaryGrant]]. For non-financial support, indicate [[sponsor]] of [[Grant]]s of resources (e.g. office space).\n\nGrants support  activities directed towards some agreed collective goals, often but not always organized as [[Project]]s. Long-lived projects are sometimes sponsored by a variety of grants over time, but it is also common for a project to be associated with a single grant.\n\nThe amount of a [[Grant]] is represented using [[amount]] as a [[MonetaryAmount]].\n    ",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "fundedItem",
        "type": [
          "https://schema.org/BioChemEntity",
          "https://schema.org/CreativeWork",
          "https://schema.org/Event",
          "https://schema.org/MedicalEntity",
          "https://schema.org/Organization",
          "https://schema.org/Person",
          "https://schema.org/Product"
        ],
        "description": "Indicates something directly or indirectly funded or sponsored through a [[Grant]]. See also [[ownershipFundingInfo]].",
        "expectedTypes": [
          "https://schema.org/BioChemEntity",
          "https://schema.org/CreativeWork",
          "https://schema.org/Event",
          "https://schema.org/MedicalEntity",
          "https://schema.org/Organization",
          "https://schema.org/Person",
          "https://schema.org/Product"
        ],
        "rangeTypes": [
          "https://schema.org/BioChemEntity",
          "https://schema.org/CreativeWork",
          "https://schema.org/Event",
          "https://schema.org/MedicalEntity",
          "https://schema.org/Organization",
          "https://schema.org/Person",
          "https://schema.org/Product"
        ],
        "domainTypes": [
          "https://schema.org/Grant"
        ],
        "inverseOf": "https://schema.org/funding"
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
      }
    ]
  },
  {
    "name": "GroceryStore",
    "type": "https://schema.org/GroceryStore",
    "source": "generated",
    "description": "A grocery store.",
    "parentTypes": [
      "https://schema.org/Store"
    ]
  },
  {
    "name": "Guide",
    "type": "https://schema.org/Guide",
    "source": "generated",
    "description": "[[Guide]] is a page or article that recommends specific products or services, or aspects of a thing for a user to consider. A [[Guide]] may represent a Buying Guide and detail aspects of products or services for a user to consider. A [[Guide]] may represent a Product Guide and recommend specific products or services. A [[Guide]] may represent a Ranked List and recommend specific products or services with ranking.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
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
      }
    ]
  },
  {
    "name": "Hackathon",
    "type": "https://schema.org/Hackathon",
    "source": "generated",
    "description": "A [hackathon](https://en.wikipedia.org/wiki/Hackathon) event.",
    "parentTypes": [
      "https://schema.org/Event"
    ]
  },
  {
    "name": "HairSalon",
    "type": "https://schema.org/HairSalon",
    "source": "generated",
    "description": "A hair salon.",
    "parentTypes": [
      "https://schema.org/HealthAndBeautyBusiness"
    ]
  },
  {
    "name": "HardwareStore",
    "type": "https://schema.org/HardwareStore",
    "source": "generated",
    "description": "A hardware store.",
    "parentTypes": [
      "https://schema.org/Store"
    ]
  },
  {
    "name": "HealthAndBeautyBusiness",
    "type": "https://schema.org/HealthAndBeautyBusiness",
    "source": "generated",
    "description": "Health and beauty.",
    "parentTypes": [
      "https://schema.org/LocalBusiness"
    ]
  },
  {
    "name": "HealthAspectEnumeration",
    "type": "https://schema.org/HealthAspectEnumeration",
    "source": "generated",
    "description": "HealthAspectEnumeration enumerates several aspects of health content online, each of which might be described using [[hasHealthAspect]] and [[HealthTopicContent]].",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "AllergiesHealthAspect",
        "type": "https://schema.org/AllergiesHealthAspect",
        "description": "Content about the allergy-related aspects of a health topic."
      },
      {
        "name": "BenefitsHealthAspect",
        "type": "https://schema.org/BenefitsHealthAspect",
        "description": "Content about the benefits and advantages of usage or utilization of topic."
      },
      {
        "name": "CausesHealthAspect",
        "type": "https://schema.org/CausesHealthAspect",
        "description": "Information about the causes and main actions that gave rise to the topic."
      },
      {
        "name": "ContagiousnessHealthAspect",
        "type": "https://schema.org/ContagiousnessHealthAspect",
        "description": "Content about contagion mechanisms and contagiousness information over the topic."
      },
      {
        "name": "EffectivenessHealthAspect",
        "type": "https://schema.org/EffectivenessHealthAspect",
        "description": "Content about the effectiveness-related aspects of a health topic."
      },
      {
        "name": "GettingAccessHealthAspect",
        "type": "https://schema.org/GettingAccessHealthAspect",
        "description": "Content that discusses practical and policy aspects for getting access to specific kinds of healthcare (e.g. distribution mechanisms for vaccines)."
      },
      {
        "name": "HowItWorksHealthAspect",
        "type": "https://schema.org/HowItWorksHealthAspect",
        "description": "Content that discusses and explains how a particular health-related topic works, e.g. in terms of mechanisms and underlying science."
      },
      {
        "name": "HowOrWhereHealthAspect",
        "type": "https://schema.org/HowOrWhereHealthAspect",
        "description": "Information about how or where to find a topic. Also may contain location data that can be used for where to look for help if the topic is observed."
      },
      {
        "name": "IngredientsHealthAspect",
        "type": "https://schema.org/IngredientsHealthAspect",
        "description": "Content discussing ingredients-related aspects of a health topic."
      },
      {
        "name": "LivingWithHealthAspect",
        "type": "https://schema.org/LivingWithHealthAspect",
        "description": "Information about coping or life related to the topic."
      },
      {
        "name": "MayTreatHealthAspect",
        "type": "https://schema.org/MayTreatHealthAspect",
        "description": "Related topics may be treated by a Topic."
      },
      {
        "name": "MisconceptionsHealthAspect",
        "type": "https://schema.org/MisconceptionsHealthAspect",
        "description": "Content about common misconceptions and myths that are related to a topic."
      },
      {
        "name": "OverviewHealthAspect",
        "type": "https://schema.org/OverviewHealthAspect",
        "description": "Overview of the content. Contains a summarized view of the topic with the most relevant information for an introduction."
      },
      {
        "name": "PatientExperienceHealthAspect",
        "type": "https://schema.org/PatientExperienceHealthAspect",
        "description": "Content about the real life experience of patients or people that have lived a similar experience about the topic. May be forums, topics, Q-and-A and related material."
      },
      {
        "name": "PregnancyHealthAspect",
        "type": "https://schema.org/PregnancyHealthAspect",
        "description": "Content discussing pregnancy-related aspects of a health topic."
      },
      {
        "name": "PreventionHealthAspect",
        "type": "https://schema.org/PreventionHealthAspect",
        "description": "Information about actions or measures that can be taken to avoid getting the topic or reaching a critical situation related to the topic."
      },
      {
        "name": "PrognosisHealthAspect",
        "type": "https://schema.org/PrognosisHealthAspect",
        "description": "Typical progression and happenings of life course of the topic."
      },
      {
        "name": "RelatedTopicsHealthAspect",
        "type": "https://schema.org/RelatedTopicsHealthAspect",
        "description": "Other prominent or relevant topics tied to the main topic."
      },
      {
        "name": "RisksOrComplicationsHealthAspect",
        "type": "https://schema.org/RisksOrComplicationsHealthAspect",
        "description": "Information about the risk factors and possible complications that may follow a topic."
      },
      {
        "name": "SafetyHealthAspect",
        "type": "https://schema.org/SafetyHealthAspect",
        "description": "Content about the safety-related aspects of a health topic."
      },
      {
        "name": "ScreeningHealthAspect",
        "type": "https://schema.org/ScreeningHealthAspect",
        "description": "Content about how to screen or further filter a topic."
      },
      {
        "name": "SeeDoctorHealthAspect",
        "type": "https://schema.org/SeeDoctorHealthAspect",
        "description": "Information about questions that may be asked, when to see a professional, measures before seeing a doctor or content about the first consultation."
      },
      {
        "name": "SelfCareHealthAspect",
        "type": "https://schema.org/SelfCareHealthAspect",
        "description": "Self care actions or measures that can be taken to sooth, health or avoid a topic. This may be carried at home and can be carried/managed by the person itself."
      },
      {
        "name": "SideEffectsHealthAspect",
        "type": "https://schema.org/SideEffectsHealthAspect",
        "description": "Side effects that can be observed from the usage of the topic."
      },
      {
        "name": "StagesHealthAspect",
        "type": "https://schema.org/StagesHealthAspect",
        "description": "Stages that can be observed from a topic."
      },
      {
        "name": "SymptomsHealthAspect",
        "type": "https://schema.org/SymptomsHealthAspect",
        "description": "Symptoms or related symptoms of a Topic."
      },
      {
        "name": "TreatmentsHealthAspect",
        "type": "https://schema.org/TreatmentsHealthAspect",
        "description": "Treatments or related therapies for a Topic."
      },
      {
        "name": "TypesHealthAspect",
        "type": "https://schema.org/TypesHealthAspect",
        "description": "Categorization and other types related to a topic."
      },
      {
        "name": "UsageOrScheduleHealthAspect",
        "type": "https://schema.org/UsageOrScheduleHealthAspect",
        "description": "Content about how, when, frequency and dosage of a topic."
      }
    ]
  },
  {
    "name": "HealthClub",
    "type": "https://schema.org/HealthClub",
    "source": "generated",
    "description": "A health club.",
    "parentTypes": [
      "https://schema.org/HealthAndBeautyBusiness",
      "https://schema.org/SportsActivityLocation"
    ]
  },
  {
    "name": "HealthInsurancePlan",
    "type": "https://schema.org/HealthInsurancePlan",
    "source": "generated",
    "description": "A US-style health insurance plan, including PPOs, EPOs, and HMOs.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "benefitsSummaryUrl",
        "type": "https://schema.org/URL",
        "description": "The URL that goes directly to the summary of benefits and coverage for the specific standard plan or plan variation.",
        "expectedTypes": [
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/HealthInsurancePlan"
        ]
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
        "name": "healthPlanDrugOption",
        "type": "https://schema.org/Text",
        "description": "TODO.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/HealthInsurancePlan"
        ]
      },
      {
        "name": "healthPlanDrugTier",
        "type": "https://schema.org/Text",
        "description": "The tier(s) of drugs offered by this formulary or insurance plan.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/HealthInsurancePlan",
          "https://schema.org/HealthPlanFormulary"
        ]
      },
      {
        "name": "healthPlanId",
        "type": "https://schema.org/Text",
        "description": "The 14-character, HIOS-generated Plan ID number. (Plan IDs must be unique, even across different markets.)",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/HealthInsurancePlan"
        ]
      },
      {
        "name": "healthPlanMarketingUrl",
        "type": "https://schema.org/URL",
        "description": "The URL that goes directly to the plan brochure for the specific standard plan or plan variation.",
        "expectedTypes": [
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/HealthInsurancePlan"
        ]
      },
      {
        "name": "includesHealthPlanFormulary",
        "type": "https://schema.org/HealthPlanFormulary",
        "description": "Formularies covered by this plan.",
        "expectedTypes": [
          "https://schema.org/HealthPlanFormulary"
        ],
        "rangeTypes": [
          "https://schema.org/HealthPlanFormulary"
        ],
        "domainTypes": [
          "https://schema.org/HealthInsurancePlan"
        ]
      },
      {
        "name": "includesHealthPlanNetwork",
        "type": "https://schema.org/HealthPlanNetwork",
        "description": "Networks covered by this plan.",
        "expectedTypes": [
          "https://schema.org/HealthPlanNetwork"
        ],
        "rangeTypes": [
          "https://schema.org/HealthPlanNetwork"
        ],
        "domainTypes": [
          "https://schema.org/HealthInsurancePlan"
        ]
      },
      {
        "name": "usesHealthPlanIdStandard",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "The standard for interpreting the Plan ID. The preferred is \"HIOS\". See the Centers for Medicare & Medicaid Services for more details.",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/HealthInsurancePlan"
        ]
      }
    ]
  },
  {
    "name": "HealthPlanCostSharingSpecification",
    "type": "https://schema.org/HealthPlanCostSharingSpecification",
    "source": "generated",
    "description": "A description of costs to the patient under a given network or formulary.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "healthPlanCoinsuranceOption",
        "type": "https://schema.org/Text",
        "description": "Whether the coinsurance applies before or after deductible, etc. TODO: Is this a closed set?",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/HealthPlanCostSharingSpecification"
        ]
      },
      {
        "name": "healthPlanCoinsuranceRate",
        "type": "https://schema.org/Number",
        "description": "The rate of coinsurance expressed as a number between 0.0 and 1.0.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/HealthPlanCostSharingSpecification"
        ]
      },
      {
        "name": "healthPlanCopay",
        "type": "https://schema.org/PriceSpecification",
        "description": "The copay amount.",
        "expectedTypes": [
          "https://schema.org/PriceSpecification"
        ],
        "rangeTypes": [
          "https://schema.org/PriceSpecification"
        ],
        "domainTypes": [
          "https://schema.org/HealthPlanCostSharingSpecification"
        ]
      },
      {
        "name": "healthPlanCopayOption",
        "type": "https://schema.org/Text",
        "description": "Whether the copay is before or after deductible, etc. TODO: Is this a closed set?",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/HealthPlanCostSharingSpecification"
        ]
      },
      {
        "name": "healthPlanPharmacyCategory",
        "type": "https://schema.org/Text",
        "description": "The category or type of pharmacy associated with this cost sharing.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/HealthPlanCostSharingSpecification"
        ]
      }
    ]
  },
  {
    "name": "HealthPlanFormulary",
    "type": "https://schema.org/HealthPlanFormulary",
    "source": "generated",
    "description": "For a given health insurance plan, the specification for costs and coverage of prescription drugs.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "healthPlanCostSharing",
        "type": [
          "https://schema.org/Boolean",
          "https://schema.org/HealthPlanCostSharingSpecification"
        ],
        "description": "The costs to the patient for services under this network or formulary.",
        "expectedTypes": [
          "https://schema.org/Boolean",
          "https://schema.org/HealthPlanCostSharingSpecification"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean",
          "https://schema.org/HealthPlanCostSharingSpecification"
        ],
        "domainTypes": [
          "https://schema.org/HealthPlanFormulary",
          "https://schema.org/HealthPlanNetwork"
        ]
      },
      {
        "name": "healthPlanDrugTier",
        "type": "https://schema.org/Text",
        "description": "The tier(s) of drugs offered by this formulary or insurance plan.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/HealthInsurancePlan",
          "https://schema.org/HealthPlanFormulary"
        ]
      },
      {
        "name": "offersPrescriptionByMail",
        "type": "https://schema.org/Boolean",
        "description": "Whether prescriptions can be delivered by mail.",
        "expectedTypes": [
          "https://schema.org/Boolean"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean"
        ],
        "domainTypes": [
          "https://schema.org/HealthPlanFormulary"
        ]
      }
    ]
  },
  {
    "name": "HealthPlanNetwork",
    "type": "https://schema.org/HealthPlanNetwork",
    "source": "generated",
    "description": "A US-style health insurance plan network.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "healthPlanCostSharing",
        "type": [
          "https://schema.org/Boolean",
          "https://schema.org/HealthPlanCostSharingSpecification"
        ],
        "description": "The costs to the patient for services under this network or formulary.",
        "expectedTypes": [
          "https://schema.org/Boolean",
          "https://schema.org/HealthPlanCostSharingSpecification"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean",
          "https://schema.org/HealthPlanCostSharingSpecification"
        ],
        "domainTypes": [
          "https://schema.org/HealthPlanFormulary",
          "https://schema.org/HealthPlanNetwork"
        ]
      },
      {
        "name": "healthPlanNetworkId",
        "type": "https://schema.org/Text",
        "description": "Name or unique ID of network. (Networks are often reused across different insurance plans.)",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/HealthPlanNetwork",
          "https://schema.org/MedicalOrganization"
        ]
      },
      {
        "name": "healthPlanNetworkTier",
        "type": "https://schema.org/Text",
        "description": "The tier(s) for this network.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/HealthPlanNetwork"
        ]
      }
    ]
  },
  {
    "name": "HealthTopicContent",
    "type": "https://schema.org/HealthTopicContent",
    "source": "generated",
    "description": "[[HealthTopicContent]] is [[WebContent]] that is about some aspect of a health topic, e.g. a condition, its symptoms or treatments. Such content may be comprised of several parts or sections and use different types of media. Multiple instances of [[WebContent]] (and hence [[HealthTopicContent]]) can be related using [[hasPart]] / [[isPartOf]] where there is some kind of content hierarchy, and their content described with [[about]] and [[mentions]] e.g. building upon the existing [[MedicalCondition]] vocabulary.\n  ",
    "parentTypes": [
      "https://schema.org/WebContent"
    ],
    "properties": [
      {
        "name": "hasHealthAspect",
        "type": "https://schema.org/HealthAspectEnumeration",
        "description": "Indicates the aspect or aspects specifically addressed in some [[HealthTopicContent]]. For example, that the content is an overview, or that it talks about treatment, self-care, treatments or their side-effects.",
        "expectedTypes": [
          "https://schema.org/HealthAspectEnumeration"
        ],
        "rangeTypes": [
          "https://schema.org/HealthAspectEnumeration"
        ],
        "domainTypes": [
          "https://schema.org/HealthTopicContent"
        ]
      }
    ]
  },
  {
    "name": "HighSchool",
    "type": "https://schema.org/HighSchool",
    "source": "generated",
    "description": "A high school.",
    "parentTypes": [
      "https://schema.org/EducationalOrganization"
    ]
  },
  {
    "name": "HinduTemple",
    "type": "https://schema.org/HinduTemple",
    "source": "generated",
    "description": "A Hindu temple.",
    "parentTypes": [
      "https://schema.org/PlaceOfWorship"
    ]
  },
  {
    "name": "HobbyShop",
    "type": "https://schema.org/HobbyShop",
    "source": "generated",
    "description": "A store that sells materials useful or necessary for various hobbies.",
    "parentTypes": [
      "https://schema.org/Store"
    ]
  },
  {
    "name": "HomeAndConstructionBusiness",
    "type": "https://schema.org/HomeAndConstructionBusiness",
    "source": "generated",
    "description": "A construction business.\\n\\nA HomeAndConstructionBusiness is a [[LocalBusiness]] that provides services around homes and buildings.\\n\\nAs a [[LocalBusiness]] it can be described as a [[provider]] of one or more [[Service]]\\(s).",
    "parentTypes": [
      "https://schema.org/LocalBusiness"
    ]
  },
  {
    "name": "HomeGoodsStore",
    "type": "https://schema.org/HomeGoodsStore",
    "source": "generated",
    "description": "A home goods store.",
    "parentTypes": [
      "https://schema.org/Store"
    ]
  },
  {
    "name": "Hospital",
    "type": "https://schema.org/Hospital",
    "source": "generated",
    "description": "A hospital.",
    "parentTypes": [
      "https://schema.org/CivicStructure",
      "https://schema.org/EmergencyService",
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
        "name": "healthcareReportingData",
        "type": [
          "https://schema.org/CDCPMDRecord",
          "https://schema.org/Dataset"
        ],
        "description": "Indicates data describing a hospital, e.g. a CDC [[CDCPMDRecord]] or as some kind of [[Dataset]].",
        "expectedTypes": [
          "https://schema.org/CDCPMDRecord",
          "https://schema.org/Dataset"
        ],
        "rangeTypes": [
          "https://schema.org/CDCPMDRecord",
          "https://schema.org/Dataset"
        ],
        "domainTypes": [
          "https://schema.org/Hospital"
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
      }
    ]
  },
  {
    "name": "Hostel",
    "type": "https://schema.org/Hostel",
    "source": "generated",
    "description": "A hostel - cheap accommodation, often in shared dormitories.\n<br /><br />\nSee also the <a href=\"/docs/hotels.html\">dedicated document on the use of schema.org for marking up hotels and other forms of accommodations</a>.\n",
    "parentTypes": [
      "https://schema.org/LodgingBusiness"
    ]
  },
  {
    "name": "Hotel",
    "type": "https://schema.org/Hotel",
    "source": "generated",
    "description": "A hotel is an establishment that provides lodging paid on a short-term basis (source: Wikipedia, the free encyclopedia, see http://en.wikipedia.org/wiki/Hotel).\n<br /><br />\nSee also the <a href=\"/docs/hotels.html\">dedicated document on the use of schema.org for marking up hotels and other forms of accommodations</a>.\n",
    "parentTypes": [
      "https://schema.org/LodgingBusiness"
    ]
  },
  {
    "name": "HotelRoom",
    "type": "https://schema.org/HotelRoom",
    "source": "generated",
    "description": "A hotel room is a single room in a hotel.\n<br /><br />\nSee also the <a href=\"/docs/hotels.html\">dedicated document on the use of schema.org for marking up hotels and other forms of accommodations</a>.\n",
    "parentTypes": [
      "https://schema.org/Room"
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
    "name": "House",
    "type": "https://schema.org/House",
    "source": "generated",
    "description": "A house is a building or structure that has the ability to be occupied for habitation by humans or other creatures (source: Wikipedia, the free encyclopedia, see <a href=\"http://en.wikipedia.org/wiki/House\">http://en.wikipedia.org/wiki/House</a>).",
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
      }
    ]
  },
  {
    "name": "HousePainter",
    "type": "https://schema.org/HousePainter",
    "source": "generated",
    "description": "A house painting service.",
    "parentTypes": [
      "https://schema.org/HomeAndConstructionBusiness"
    ]
  },
  {
    "name": "HowTo",
    "type": "https://schema.org/HowTo",
    "source": "generated",
    "description": "Instructions that explain how to achieve a result by performing a sequence of steps.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ],
    "properties": [
      {
        "name": "estimatedCost",
        "type": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/Text"
        ],
        "description": "The estimated cost of the supply or supplies consumed when performing instructions.",
        "expectedTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/HowTo",
          "https://schema.org/HowToSupply"
        ]
      },
      {
        "name": "performTime",
        "type": "https://schema.org/Duration",
        "description": "The length of time it takes to perform instructions or a direction (not including time to prepare the supplies), in [ISO 8601 duration format](http://en.wikipedia.org/wiki/ISO_8601).",
        "expectedTypes": [
          "https://schema.org/Duration"
        ],
        "rangeTypes": [
          "https://schema.org/Duration"
        ],
        "domainTypes": [
          "https://schema.org/HowTo",
          "https://schema.org/HowToDirection"
        ]
      },
      {
        "name": "prepTime",
        "type": "https://schema.org/Duration",
        "description": "The length of time it takes to prepare the items to be used in instructions or a direction, in [ISO 8601 duration format](http://en.wikipedia.org/wiki/ISO_8601).",
        "expectedTypes": [
          "https://schema.org/Duration"
        ],
        "rangeTypes": [
          "https://schema.org/Duration"
        ],
        "domainTypes": [
          "https://schema.org/HowTo",
          "https://schema.org/HowToDirection"
        ]
      },
      {
        "name": "step",
        "type": [
          "https://schema.org/CreativeWork",
          "https://schema.org/HowToSection",
          "https://schema.org/HowToStep",
          "https://schema.org/Text"
        ],
        "description": "A single step item (as HowToStep, text, document, video, etc.) or a HowToSection.",
        "expectedTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/HowToSection",
          "https://schema.org/HowToStep",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/HowToSection",
          "https://schema.org/HowToStep",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/HowTo"
        ]
      },
      {
        "name": "steps",
        "type": [
          "https://schema.org/CreativeWork",
          "https://schema.org/ItemList",
          "https://schema.org/Text"
        ],
        "description": "A single step item (as HowToStep, text, document, video, etc.) or a HowToSection (originally misnamed 'steps'; 'step' is preferred).",
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
          "https://schema.org/HowTo",
          "https://schema.org/HowToSection"
        ],
        "supersededBy": "https://schema.org/step"
      },
      {
        "name": "supply",
        "type": [
          "https://schema.org/HowToSupply",
          "https://schema.org/Text"
        ],
        "description": "A sub-property of instrument. A supply consumed when performing instructions or a direction.",
        "expectedTypes": [
          "https://schema.org/HowToSupply",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/HowToSupply",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/HowTo",
          "https://schema.org/HowToDirection"
        ]
      },
      {
        "name": "tool",
        "type": [
          "https://schema.org/HowToTool",
          "https://schema.org/Text"
        ],
        "description": "A sub property of instrument. An object used (but not consumed) when performing instructions or a direction.",
        "expectedTypes": [
          "https://schema.org/HowToTool",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/HowToTool",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/HowTo",
          "https://schema.org/HowToDirection"
        ]
      },
      {
        "name": "totalTime",
        "type": "https://schema.org/Duration",
        "description": "The total time required to perform instructions or a direction (including time to prepare the supplies), in [ISO 8601 duration format](http://en.wikipedia.org/wiki/ISO_8601).",
        "expectedTypes": [
          "https://schema.org/Duration"
        ],
        "rangeTypes": [
          "https://schema.org/Duration"
        ],
        "domainTypes": [
          "https://schema.org/HowTo",
          "https://schema.org/HowToDirection"
        ]
      },
      {
        "name": "yield",
        "type": [
          "https://schema.org/QuantitativeValue",
          "https://schema.org/Text"
        ],
        "description": "The quantity that results by performing instructions. For example, a paper airplane, 10 personalized candles.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/HowTo"
        ]
      }
    ]
  },
  {
    "name": "HowToDirection",
    "type": "https://schema.org/HowToDirection",
    "source": "generated",
    "description": "A direction indicating a single action to do in the instructions for how to achieve a result.",
    "parentTypes": [
      "https://schema.org/CreativeWork",
      "https://schema.org/ListItem"
    ],
    "properties": [
      {
        "name": "afterMedia",
        "type": [
          "https://schema.org/MediaObject",
          "https://schema.org/URL"
        ],
        "description": "A media object representing the circumstances after performing this direction.",
        "expectedTypes": [
          "https://schema.org/MediaObject",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/MediaObject",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/HowToDirection"
        ]
      },
      {
        "name": "beforeMedia",
        "type": [
          "https://schema.org/MediaObject",
          "https://schema.org/URL"
        ],
        "description": "A media object representing the circumstances before performing this direction.",
        "expectedTypes": [
          "https://schema.org/MediaObject",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/MediaObject",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/HowToDirection"
        ]
      },
      {
        "name": "duringMedia",
        "type": [
          "https://schema.org/MediaObject",
          "https://schema.org/URL"
        ],
        "description": "A media object representing the circumstances while performing this direction.",
        "expectedTypes": [
          "https://schema.org/MediaObject",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/MediaObject",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/HowToDirection"
        ]
      },
      {
        "name": "performTime",
        "type": "https://schema.org/Duration",
        "description": "The length of time it takes to perform instructions or a direction (not including time to prepare the supplies), in [ISO 8601 duration format](http://en.wikipedia.org/wiki/ISO_8601).",
        "expectedTypes": [
          "https://schema.org/Duration"
        ],
        "rangeTypes": [
          "https://schema.org/Duration"
        ],
        "domainTypes": [
          "https://schema.org/HowTo",
          "https://schema.org/HowToDirection"
        ]
      },
      {
        "name": "prepTime",
        "type": "https://schema.org/Duration",
        "description": "The length of time it takes to prepare the items to be used in instructions or a direction, in [ISO 8601 duration format](http://en.wikipedia.org/wiki/ISO_8601).",
        "expectedTypes": [
          "https://schema.org/Duration"
        ],
        "rangeTypes": [
          "https://schema.org/Duration"
        ],
        "domainTypes": [
          "https://schema.org/HowTo",
          "https://schema.org/HowToDirection"
        ]
      },
      {
        "name": "supply",
        "type": [
          "https://schema.org/HowToSupply",
          "https://schema.org/Text"
        ],
        "description": "A sub-property of instrument. A supply consumed when performing instructions or a direction.",
        "expectedTypes": [
          "https://schema.org/HowToSupply",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/HowToSupply",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/HowTo",
          "https://schema.org/HowToDirection"
        ]
      },
      {
        "name": "tool",
        "type": [
          "https://schema.org/HowToTool",
          "https://schema.org/Text"
        ],
        "description": "A sub property of instrument. An object used (but not consumed) when performing instructions or a direction.",
        "expectedTypes": [
          "https://schema.org/HowToTool",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/HowToTool",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/HowTo",
          "https://schema.org/HowToDirection"
        ]
      },
      {
        "name": "totalTime",
        "type": "https://schema.org/Duration",
        "description": "The total time required to perform instructions or a direction (including time to prepare the supplies), in [ISO 8601 duration format](http://en.wikipedia.org/wiki/ISO_8601).",
        "expectedTypes": [
          "https://schema.org/Duration"
        ],
        "rangeTypes": [
          "https://schema.org/Duration"
        ],
        "domainTypes": [
          "https://schema.org/HowTo",
          "https://schema.org/HowToDirection"
        ]
      }
    ]
  },
  {
    "name": "HowToItem",
    "type": "https://schema.org/HowToItem",
    "source": "generated",
    "description": "An item used as either a tool or supply when performing the instructions for how to achieve a result.",
    "parentTypes": [
      "https://schema.org/ListItem"
    ],
    "properties": [
      {
        "name": "requiredQuantity",
        "type": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue",
          "https://schema.org/Text"
        ],
        "description": "The required quantity of the item(s).",
        "expectedTypes": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/HowToItem"
        ]
      }
    ]
  },
  {
    "name": "HowToSection",
    "type": "https://schema.org/HowToSection",
    "source": "generated",
    "description": "A sub-grouping of steps in the instructions for how to achieve a result (e.g. steps for making a pie crust within a pie recipe).",
    "parentTypes": [
      "https://schema.org/CreativeWork",
      "https://schema.org/ItemList",
      "https://schema.org/ListItem"
    ],
    "properties": [
      {
        "name": "steps",
        "type": [
          "https://schema.org/CreativeWork",
          "https://schema.org/ItemList",
          "https://schema.org/Text"
        ],
        "description": "A single step item (as HowToStep, text, document, video, etc.) or a HowToSection (originally misnamed 'steps'; 'step' is preferred).",
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
          "https://schema.org/HowTo",
          "https://schema.org/HowToSection"
        ],
        "supersededBy": "https://schema.org/step"
      }
    ]
  },
  {
    "name": "HowToStep",
    "type": "https://schema.org/HowToStep",
    "source": "generated",
    "description": "A step in the instructions for how to achieve a result. It is an ordered list with HowToDirection and/or HowToTip items.",
    "parentTypes": [
      "https://schema.org/CreativeWork",
      "https://schema.org/ItemList",
      "https://schema.org/ListItem"
    ]
  },
  {
    "name": "HowToSupply",
    "type": "https://schema.org/HowToSupply",
    "source": "generated",
    "description": "A supply consumed when performing the instructions for how to achieve a result.",
    "parentTypes": [
      "https://schema.org/HowToItem"
    ],
    "properties": [
      {
        "name": "estimatedCost",
        "type": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/Text"
        ],
        "description": "The estimated cost of the supply or supplies consumed when performing instructions.",
        "expectedTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/HowTo",
          "https://schema.org/HowToSupply"
        ]
      }
    ]
  },
  {
    "name": "HowToTip",
    "type": "https://schema.org/HowToTip",
    "source": "generated",
    "description": "An explanation in the instructions for how to achieve a result. It provides supplementary information about a technique, supply, author's preference, etc. It can explain what could be done, or what should not be done, but doesn't specify what should be done (see HowToDirection).",
    "parentTypes": [
      "https://schema.org/CreativeWork",
      "https://schema.org/ListItem"
    ]
  },
  {
    "name": "HowToTool",
    "type": "https://schema.org/HowToTool",
    "source": "generated",
    "description": "A tool used (but not consumed) when performing instructions for how to achieve a result.",
    "parentTypes": [
      "https://schema.org/HowToItem"
    ]
  },
  {
    "name": "HVACBusiness",
    "type": "https://schema.org/HVACBusiness",
    "source": "generated",
    "description": "A business that provides Heating, Ventilation and Air Conditioning services.",
    "parentTypes": [
      "https://schema.org/HomeAndConstructionBusiness"
    ]
  },
  {
    "name": "HyperToc",
    "type": "https://schema.org/HyperToc",
    "source": "generated",
    "description": "A HyperToc represents a hypertext table of contents for complex media objects, such as [[VideoObject]], [[AudioObject]]. Items in the table of contents are indicated using the [[tocEntry]] property, and typed [[HyperTocEntry]]. For cases where the same larger work is split into multiple files, [[associatedMedia]] can be used on individual [[HyperTocEntry]] items.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ],
    "properties": [
      {
        "name": "associatedMedia",
        "type": "https://schema.org/MediaObject",
        "description": "A media object that encodes this CreativeWork. This property is a synonym for encoding.",
        "expectedTypes": [
          "https://schema.org/MediaObject"
        ],
        "rangeTypes": [
          "https://schema.org/MediaObject"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/HyperToc",
          "https://schema.org/HyperTocEntry"
        ]
      },
      {
        "name": "tocEntry",
        "type": "https://schema.org/HyperTocEntry",
        "description": "Indicates a [[HyperTocEntry]] in a [[HyperToc]].",
        "expectedTypes": [
          "https://schema.org/HyperTocEntry"
        ],
        "rangeTypes": [
          "https://schema.org/HyperTocEntry"
        ],
        "domainTypes": [
          "https://schema.org/HyperToc"
        ]
      }
    ]
  },
  {
    "name": "HyperTocEntry",
    "type": "https://schema.org/HyperTocEntry",
    "source": "generated",
    "description": "A HyperToEntry is an item within a [[HyperToc]], which represents a hypertext table of contents for complex media objects, such as [[VideoObject]], [[AudioObject]]. The media object itself is indicated using [[associatedMedia]]. Each section of interest within that content can be described with a [[HyperTocEntry]], with associated [[startOffset]] and [[endOffset]]. When several entries are all from the same file, [[associatedMedia]] is used on the overarching [[HyperTocEntry]]; if the content has been split into multiple files, they can be referenced using [[associatedMedia]] on each [[HyperTocEntry]].",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ],
    "properties": [
      {
        "name": "associatedMedia",
        "type": "https://schema.org/MediaObject",
        "description": "A media object that encodes this CreativeWork. This property is a synonym for encoding.",
        "expectedTypes": [
          "https://schema.org/MediaObject"
        ],
        "rangeTypes": [
          "https://schema.org/MediaObject"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/HyperToc",
          "https://schema.org/HyperTocEntry"
        ]
      },
      {
        "name": "tocContinuation",
        "type": "https://schema.org/HyperTocEntry",
        "description": "A [[HyperTocEntry]] can have a [[tocContinuation]] indicated, which is another [[HyperTocEntry]] that would be the default next item to play or render.",
        "expectedTypes": [
          "https://schema.org/HyperTocEntry"
        ],
        "rangeTypes": [
          "https://schema.org/HyperTocEntry"
        ],
        "domainTypes": [
          "https://schema.org/HyperTocEntry"
        ]
      },
      {
        "name": "utterances",
        "type": "https://schema.org/Text",
        "description": "Text of an utterances (spoken words, lyrics etc.) that occurs at a certain section of a media object, represented as a [[HyperTocEntry]].",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/HyperTocEntry"
        ]
      }
    ]
  },
  {
    "name": "IceCreamShop",
    "type": "https://schema.org/IceCreamShop",
    "source": "generated",
    "description": "An ice cream shop.",
    "parentTypes": [
      "https://schema.org/FoodEstablishment"
    ]
  },
  {
    "name": "IgnoreAction",
    "type": "https://schema.org/IgnoreAction",
    "source": "generated",
    "description": "The act of intentionally disregarding the object. An agent ignores an object.",
    "parentTypes": [
      "https://schema.org/AssessAction"
    ]
  },
  {
    "name": "Image",
    "type": "http://purl.org/dc/dcmitype/Image",
    "source": "generated"
  },
  {
    "name": "ImageGallery",
    "type": "https://schema.org/ImageGallery",
    "source": "generated",
    "description": "Web page type: Image gallery page.",
    "parentTypes": [
      "https://schema.org/MediaGallery"
    ]
  },
  {
    "name": "ImageObject",
    "type": "https://schema.org/ImageObject",
    "source": "generated",
    "description": "An image file.",
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
        "name": "exifData",
        "type": [
          "https://schema.org/PropertyValue",
          "https://schema.org/Text"
        ],
        "description": "exif data for this object.",
        "expectedTypes": [
          "https://schema.org/PropertyValue",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/PropertyValue",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/ImageObject"
        ]
      },
      {
        "name": "representativeOfPage",
        "type": "https://schema.org/Boolean",
        "description": "Indicates whether this image is representative of the content of the page.",
        "expectedTypes": [
          "https://schema.org/Boolean"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean"
        ],
        "domainTypes": [
          "https://schema.org/ImageObject"
        ]
      }
    ]
  },
  {
    "name": "ImageObjectSnapshot",
    "type": "https://schema.org/ImageObjectSnapshot",
    "source": "generated",
    "description": "A specific and exact (byte-for-byte) version of an [[ImageObject]]. Two byte-for-byte identical files, for the purposes of this type, considered identical. If they have different embedded metadata (e.g. XMP, EXIF) the files will differ. Different external facts about the files, e.g. creator or dateCreated that aren't represented in their actual content, do not affect this notion of identity.",
    "parentTypes": [
      "https://schema.org/ImageObject"
    ]
  },
  {
    "name": "ImagingTest",
    "type": "https://schema.org/ImagingTest",
    "source": "generated",
    "description": "Any medical imaging modality typically used for diagnostic purposes.",
    "parentTypes": [
      "https://schema.org/MedicalTest"
    ],
    "properties": [
      {
        "name": "imagingTechnique",
        "type": "https://schema.org/MedicalImagingTechnique",
        "description": "Imaging technique used.",
        "expectedTypes": [
          "https://schema.org/MedicalImagingTechnique"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalImagingTechnique"
        ],
        "domainTypes": [
          "https://schema.org/ImagingTest"
        ]
      }
    ]
  },
  {
    "name": "IncentiveQualifiedExpenseType",
    "type": "https://schema.org/IncentiveQualifiedExpenseType",
    "source": "generated",
    "description": "The types of expenses that are covered by the incentive. For example some incentives are only for the goods (tangible items) but the services (labor) are excluded.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "IncentiveQualifiedExpenseTypeGoodsOnly",
        "type": "https://schema.org/IncentiveQualifiedExpenseTypeGoodsOnly",
        "description": "This incentive applies to goods only."
      },
      {
        "name": "IncentiveQualifiedExpenseTypeGoodsOrServices",
        "type": "https://schema.org/IncentiveQualifiedExpenseTypeGoodsOrServices",
        "description": "This incentive can apply to either goods or services (or both)."
      },
      {
        "name": "IncentiveQualifiedExpenseTypeServicesOnly",
        "type": "https://schema.org/IncentiveQualifiedExpenseTypeServicesOnly",
        "description": "This incentive applies to services only."
      },
      {
        "name": "IncentiveQualifiedExpenseTypeUtilityBill",
        "type": "https://schema.org/IncentiveQualifiedExpenseTypeUtilityBill",
        "description": "This incentive applies to utility bills."
      }
    ]
  },
  {
    "name": "IncentiveStatus",
    "type": "https://schema.org/IncentiveStatus",
    "source": "generated",
    "description": "Enumerates a status for an incentive, such as whether it is active.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "IncentiveStatusActive",
        "type": "https://schema.org/IncentiveStatusActive",
        "description": "This incentive is currently active."
      },
      {
        "name": "IncentiveStatusInDevelopment",
        "type": "https://schema.org/IncentiveStatusInDevelopment",
        "description": "This incentive is currently being developed, and may become active/retired in the future."
      },
      {
        "name": "IncentiveStatusOnHold",
        "type": "https://schema.org/IncentiveStatusOnHold",
        "description": "This incentive is currently active, but may not be accepting new applicants (e.g. max number of redemptions reached for a year)"
      },
      {
        "name": "IncentiveStatusRetired",
        "type": "https://schema.org/IncentiveStatusRetired",
        "description": "This incentive is not longer available."
      }
    ]
  },
  {
    "name": "IncentiveType",
    "type": "https://schema.org/IncentiveType",
    "source": "generated",
    "description": "Enumerates common financial incentives for products, including tax credits, tax deductions, rebates and subsidies, etc.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "IncentiveTypeLoan",
        "type": "https://schema.org/IncentiveTypeLoan",
        "description": "An incentive where the recipient can receive additional funding for the purchase/lease of the good/service, which must be paid back."
      },
      {
        "name": "IncentiveTypeRebateOrSubsidy",
        "type": "https://schema.org/IncentiveTypeRebateOrSubsidy",
        "description": "An incentive that reduces the purchase/lease cost of the good/service in question."
      },
      {
        "name": "IncentiveTypeTaxCredit",
        "type": "https://schema.org/IncentiveTypeTaxCredit",
        "description": "An incentive that directly reduces the amount of tax owed by the recipient."
      },
      {
        "name": "IncentiveTypeTaxDeduction",
        "type": "https://schema.org/IncentiveTypeTaxDeduction",
        "description": "An incentive that reduces the recipient's amount of taxable income."
      },
      {
        "name": "IncentiveTypeTaxWaiver",
        "type": "https://schema.org/IncentiveTypeTaxWaiver",
        "description": "An incentive that reduces/exempts the recipient from taxation applicable to the incentivized good/service (e.g. luxury taxes, registration taxes, circulation tax)."
      }
    ]
  },
  {
    "name": "IndividualPhysician",
    "type": "https://schema.org/IndividualPhysician",
    "source": "generated",
    "description": "An individual medical practitioner. For their official address use [[address]], for affiliations to hospitals use [[hospitalAffiliation]]. \nThe [[practicesAt]] property can be used to indicate [[MedicalOrganization]] hospitals, clinics, pharmacies etc. where this physician practices.",
    "parentTypes": [
      "https://schema.org/Physician"
    ],
    "properties": [
      {
        "name": "practicesAt",
        "type": "https://schema.org/MedicalOrganization",
        "description": "A [[MedicalOrganization]] where the [[IndividualPhysician]] practices.",
        "expectedTypes": [
          "https://schema.org/MedicalOrganization"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalOrganization"
        ],
        "domainTypes": [
          "https://schema.org/IndividualPhysician"
        ]
      }
    ]
  },
  {
    "name": "IndividualProduct",
    "type": "https://schema.org/IndividualProduct",
    "source": "generated",
    "description": "A single, identifiable product instance (e.g. a laptop with a particular serial number).",
    "parentTypes": [
      "https://schema.org/Product"
    ],
    "properties": [
      {
        "name": "serialNumber",
        "type": "https://schema.org/Text",
        "description": "The serial number or any alphanumeric identifier of a particular product. When attached to an offer, it is a shortcut for the serial number of the product included in the offer.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Demand",
          "https://schema.org/IndividualProduct",
          "https://schema.org/Offer"
        ]
      }
    ]
  },
  {
    "name": "InfectiousAgentClass",
    "type": "https://schema.org/InfectiousAgentClass",
    "source": "generated",
    "description": "Classes of agents or pathogens that transmit infectious diseases. Enumerated type.",
    "parentTypes": [
      "https://schema.org/MedicalEnumeration"
    ],
    "enumerationValues": [
      {
        "name": "Bacteria",
        "type": "https://schema.org/Bacteria",
        "description": "Pathogenic bacteria that cause bacterial infection."
      },
      {
        "name": "Fungus",
        "type": "https://schema.org/Fungus",
        "description": "Pathogenic fungus."
      },
      {
        "name": "MulticellularParasite",
        "type": "https://schema.org/MulticellularParasite",
        "description": "Multicellular parasite that causes an infection."
      },
      {
        "name": "Prion",
        "type": "https://schema.org/Prion",
        "description": "A prion is an infectious agent composed of protein in a misfolded form."
      },
      {
        "name": "Protozoa",
        "type": "https://schema.org/Protozoa",
        "description": "Single-celled organism that causes an infection."
      },
      {
        "name": "Virus",
        "type": "https://schema.org/Virus",
        "description": "Pathogenic virus that causes viral infection."
      }
    ]
  },
  {
    "name": "InfectiousDisease",
    "type": "https://schema.org/InfectiousDisease",
    "source": "generated",
    "description": "An infectious disease is a clinically evident human disease resulting from the presence of pathogenic microbial agents, like pathogenic viruses, pathogenic bacteria, fungi, protozoa, multicellular parasites, and prions. To be considered an infectious disease, such pathogens are known to be able to cause this disease.",
    "parentTypes": [
      "https://schema.org/MedicalCondition"
    ],
    "properties": [
      {
        "name": "infectiousAgent",
        "type": "https://schema.org/Text",
        "description": "The actual infectious agent, such as a specific bacterium.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/InfectiousDisease"
        ]
      },
      {
        "name": "infectiousAgentClass",
        "type": "https://schema.org/InfectiousAgentClass",
        "description": "The class of infectious agent (bacteria, prion, etc.) that causes the disease.",
        "expectedTypes": [
          "https://schema.org/InfectiousAgentClass"
        ],
        "rangeTypes": [
          "https://schema.org/InfectiousAgentClass"
        ],
        "domainTypes": [
          "https://schema.org/InfectiousDisease"
        ]
      },
      {
        "name": "transmissionMethod",
        "type": "https://schema.org/Text",
        "description": "How the disease spreads, either as a route or vector, for example 'direct contact', 'Aedes aegypti', etc.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/InfectiousDisease"
        ]
      }
    ]
  },
  {
    "name": "InformAction",
    "type": "https://schema.org/InformAction",
    "source": "generated",
    "description": "The act of notifying someone of information pertinent to them, with no expectation of a response.",
    "parentTypes": [
      "https://schema.org/CommunicateAction"
    ],
    "properties": [
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
    "name": "InsertAction",
    "type": "https://schema.org/InsertAction",
    "source": "generated",
    "description": "The act of adding at a specific location in an ordered collection.",
    "parentTypes": [
      "https://schema.org/AddAction"
    ],
    "properties": [
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
    "name": "InstallAction",
    "type": "https://schema.org/InstallAction",
    "source": "generated",
    "description": "The act of installing an application.",
    "parentTypes": [
      "https://schema.org/ConsumeAction"
    ]
  },
  {
    "name": "InstantaneousEvent",
    "type": "http://www.w3.org/ns/prov#InstantaneousEvent",
    "source": "generated"
  },
  {
    "name": "InstantaneousEvent",
    "type": "https://schema.org/InstantaneousEvent",
    "source": "generated",
    "description": "An event with no duration, like for instance a computer log entry.",
    "parentTypes": [
      "https://schema.org/StructuredValue"
    ],
    "properties": [
      {
        "name": "data",
        "type": "https://schema.org/Thing",
        "description": "Data associated with the event, like for instance a log message.",
        "expectedTypes": [
          "https://schema.org/Thing"
        ],
        "rangeTypes": [
          "https://schema.org/Thing"
        ],
        "domainTypes": [
          "https://schema.org/InstantaneousEvent"
        ]
      },
      {
        "name": "source",
        "type": "https://schema.org/Thing",
        "description": "The source or cause of the event.",
        "expectedTypes": [
          "https://schema.org/Thing"
        ],
        "rangeTypes": [
          "https://schema.org/Thing"
        ],
        "domainTypes": [
          "https://schema.org/InstantaneousEvent"
        ]
      },
      {
        "name": "timestamp",
        "type": "https://schema.org/DateTime",
        "description": "The instant the event occured.",
        "expectedTypes": [
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/InstantaneousEvent"
        ]
      }
    ]
  },
  {
    "name": "InsuranceAgency",
    "type": "https://schema.org/InsuranceAgency",
    "source": "generated",
    "description": "An Insurance agency.",
    "parentTypes": [
      "https://schema.org/FinancialService"
    ]
  },
  {
    "name": "Intangible",
    "type": "https://schema.org/Intangible",
    "source": "generated",
    "description": "A utility class that serves as the umbrella for a number of 'intangible' things such as quantities, structured values, etc.",
    "parentTypes": [
      "https://schema.org/Thing"
    ]
  },
  {
    "name": "Integer",
    "type": "https://schema.org/Integer",
    "source": "generated",
    "description": "Data type: Integer.",
    "parentTypes": [
      "https://schema.org/Number"
    ]
  },
  {
    "name": "InteractAction",
    "type": "https://schema.org/InteractAction",
    "source": "generated",
    "description": "The act of interacting with another person or organization.",
    "parentTypes": [
      "https://schema.org/Action"
    ]
  },
  {
    "name": "InteractionCounter",
    "type": "https://schema.org/InteractionCounter",
    "source": "generated",
    "description": "A summary of how users have interacted with this CreativeWork. In most cases, authors will use a subtype to specify the specific type of interaction.",
    "parentTypes": [
      "https://schema.org/StructuredValue"
    ],
    "properties": [
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
        "name": "interactionService",
        "type": [
          "https://schema.org/SoftwareApplication",
          "https://schema.org/WebSite"
        ],
        "description": "The WebSite or SoftwareApplication where the interactions took place.",
        "expectedTypes": [
          "https://schema.org/SoftwareApplication",
          "https://schema.org/WebSite"
        ],
        "rangeTypes": [
          "https://schema.org/SoftwareApplication",
          "https://schema.org/WebSite"
        ],
        "domainTypes": [
          "https://schema.org/InteractionCounter"
        ]
      },
      {
        "name": "interactionType",
        "type": "https://schema.org/Action",
        "description": "The Action representing the type of interaction. For up votes, +1s, etc. use [[LikeAction]]. For down votes use [[DislikeAction]]. Otherwise, use the most specific Action.",
        "expectedTypes": [
          "https://schema.org/Action"
        ],
        "rangeTypes": [
          "https://schema.org/Action"
        ],
        "domainTypes": [
          "https://schema.org/InteractionCounter"
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
        "name": "userInteractionCount",
        "type": "https://schema.org/Integer",
        "description": "The number of interactions for the CreativeWork using the WebSite or SoftwareApplication.",
        "expectedTypes": [
          "https://schema.org/Integer"
        ],
        "rangeTypes": [
          "https://schema.org/Integer"
        ],
        "domainTypes": [
          "https://schema.org/InteractionCounter"
        ]
      }
    ]
  },
  {
    "name": "InternetCafe",
    "type": "https://schema.org/InternetCafe",
    "source": "generated",
    "description": "An internet cafe.",
    "parentTypes": [
      "https://schema.org/LocalBusiness"
    ]
  },
  {
    "name": "InvestmentFund",
    "type": "https://schema.org/InvestmentFund",
    "source": "generated",
    "description": "A company or fund that gathers capital from a number of investors to create a pool of money that is then re-invested into stocks, bonds and other assets.",
    "parentTypes": [
      "https://schema.org/InvestmentOrDeposit"
    ]
  },
  {
    "name": "InvestmentOrDeposit",
    "type": "https://schema.org/InvestmentOrDeposit",
    "source": "generated",
    "description": "A type of financial product that typically requires the client to transfer funds to a financial service in return for potential beneficial financial return.",
    "parentTypes": [
      "https://schema.org/FinancialProduct"
    ],
    "properties": [
      {
        "name": "amount",
        "type": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/Number"
        ],
        "description": "The amount of money.",
        "expectedTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/DatedMoneySpecification",
          "https://schema.org/InvestmentOrDeposit",
          "https://schema.org/LoanOrCredit",
          "https://schema.org/MonetaryGrant",
          "https://schema.org/MoneyTransfer"
        ]
      }
    ]
  },
  {
    "name": "InviteAction",
    "type": "https://schema.org/InviteAction",
    "source": "generated",
    "description": "The act of asking someone to attend an event. Reciprocal of RsvpAction.",
    "parentTypes": [
      "https://schema.org/CommunicateAction"
    ],
    "properties": [
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
    "name": "Invoice",
    "type": "https://schema.org/Invoice",
    "source": "generated",
    "description": "A statement of the money due for goods or services; a bill.",
    "parentTypes": [
      "https://schema.org/Intangible",
      "https://spec.edmcouncil.org/fibo/ontology/FND/Arrangements/Documents/LegalDocument"
    ],
    "properties": [
      {
        "name": "accountId",
        "type": "https://schema.org/Text",
        "description": "The identifier for the account the payment will be applied to.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Invoice"
        ]
      },
      {
        "name": "billingPeriod",
        "type": "https://schema.org/Duration",
        "description": "The time interval used to compute the invoice.",
        "expectedTypes": [
          "https://schema.org/Duration"
        ],
        "rangeTypes": [
          "https://schema.org/Duration"
        ],
        "domainTypes": [
          "https://schema.org/Invoice"
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
        "name": "confirmationNumber",
        "type": "https://schema.org/Text",
        "description": "A number that confirms the given order or payment has been received.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Invoice",
          "https://schema.org/Order"
        ]
      },
      {
        "name": "customer",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "Party placing the order or paying the invoice.",
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
          "https://schema.org/Order"
        ]
      },
      {
        "name": "minimumPaymentDue",
        "type": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/PriceSpecification"
        ],
        "description": "The minimum payment required at this time.",
        "expectedTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/PriceSpecification"
        ],
        "rangeTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/PriceSpecification"
        ],
        "domainTypes": [
          "https://schema.org/Invoice"
        ]
      },
      {
        "name": "paymentDue",
        "type": "https://schema.org/DateTime",
        "description": "The date that payment is due.",
        "expectedTypes": [
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/Invoice",
          "https://schema.org/Order"
        ],
        "supersededBy": "https://schema.org/paymentDueDate"
      },
      {
        "name": "paymentDueDate",
        "type": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "description": "The date that payment is due.",
        "expectedTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/Invoice",
          "https://schema.org/Order"
        ]
      },
      {
        "name": "paymentMethod",
        "type": [
          "https://schema.org/PaymentMethod",
          "https://schema.org/Text"
        ],
        "description": "The name of the credit card or other method of payment for the order.",
        "expectedTypes": [
          "https://schema.org/PaymentMethod",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/PaymentMethod",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Invoice",
          "https://schema.org/Order"
        ]
      },
      {
        "name": "paymentMethodId",
        "type": "https://schema.org/Text",
        "description": "An identifier for the method of payment used (e.g. the last 4 digits of the credit card).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Invoice",
          "https://schema.org/Order"
        ]
      },
      {
        "name": "paymentStatus",
        "type": [
          "https://schema.org/PaymentStatusType",
          "https://schema.org/Text"
        ],
        "description": "The status of payment; whether the invoice has been paid or not.",
        "expectedTypes": [
          "https://schema.org/PaymentStatusType",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/PaymentStatusType",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Invoice"
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
        "name": "referencesOrder",
        "type": "https://schema.org/Order",
        "description": "The Order(s) related to this Invoice. One or more Orders may be combined into a single Invoice.",
        "expectedTypes": [
          "https://schema.org/Order"
        ],
        "rangeTypes": [
          "https://schema.org/Order"
        ],
        "domainTypes": [
          "https://schema.org/Invoice"
        ]
      },
      {
        "name": "scheduledPaymentDate",
        "type": "https://schema.org/Date",
        "description": "The date the invoice is scheduled to be paid.",
        "expectedTypes": [
          "https://schema.org/Date"
        ],
        "rangeTypes": [
          "https://schema.org/Date"
        ],
        "domainTypes": [
          "https://schema.org/Invoice"
        ]
      },
      {
        "name": "totalPaymentDue",
        "type": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/PriceSpecification"
        ],
        "description": "The total amount due.",
        "expectedTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/PriceSpecification"
        ],
        "rangeTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/PriceSpecification"
        ],
        "domainTypes": [
          "https://schema.org/Invoice"
        ]
      }
    ]
  },
  {
    "name": "Invoice",
    "type": "http://unece.org/vocab#Invoice",
    "source": "generated"
  },
  {
    "name": "IPTCDigitalSourceEnumeration",
    "type": "https://schema.org/IPTCDigitalSourceEnumeration",
    "source": "generated",
    "description": "<a href=\"https://www.iptc.org/\">IPTC</a> \"Digital Source\" codes for use with the [[digitalSourceType]] property, providing information about the source for a digital media object.\nIn general these codes are not declared here to be mutually exclusive, although some combinations would be contradictory if applied simultaneously, or might be considered mutually incompatible by upstream maintainers of the definitions. See the IPTC <a href=\"https://www.iptc.org/std/photometadata/documentation/userguide/\">documentation</a>\n for <a href=\"https://cv.iptc.org/newscodes/digitalsourcetype/\">detailed definitions</a> of all terms.",
    "parentTypes": [
      "https://schema.org/MediaEnumeration"
    ],
    "enumerationValues": [
      {
        "name": "AlgorithmicallyEnhancedDigitalSource",
        "type": "https://schema.org/AlgorithmicallyEnhancedDigitalSource",
        "description": "Content coded as '<a href=\"https://cv.iptc.org/newscodes/digitalsourcetype/algorithmicallyEnhanced\">algorithmically enhanced</a>' using the IPTC <a href=\"https://cv.iptc.org/newscodes/digitalsourcetype/\">digital source type</a> vocabulary."
      },
      {
        "name": "AlgorithmicMediaDigitalSource",
        "type": "https://schema.org/AlgorithmicMediaDigitalSource",
        "description": "Content coded as '<a href=\"https://cv.iptc.org/newscodes/digitalsourcetype/algorithmicMedia\">algorithmic media</a>' using the IPTC <a href=\"https://cv.iptc.org/newscodes/digitalsourcetype/\">digital source type</a> vocabulary."
      },
      {
        "name": "CompositeCaptureDigitalSource",
        "type": "https://schema.org/CompositeCaptureDigitalSource",
        "description": "Content coded as '<a href=\"https://cv.iptc.org/newscodes/digitalsourcetype/compositeCapture\">composite capture</a>' using the IPTC <a href=\"https://cv.iptc.org/newscodes/digitalsourcetype/\">digital source type</a> vocabulary."
      },
      {
        "name": "CompositeDigitalSource",
        "type": "https://schema.org/CompositeDigitalSource",
        "description": "Content coded as '<a href=\"https://cv.iptc.org/newscodes/digitalsourcetype/algorithmicMedia\">algorithmic media</a>' using the IPTC <a href=\"https://cv.iptc.org/newscodes/digitalsourcetype/\">digital source type</a> vocabulary."
      },
      {
        "name": "CompositeSyntheticDigitalSource",
        "type": "https://schema.org/CompositeSyntheticDigitalSource",
        "description": "Content coded as '<a href=\"https://cv.iptc.org/newscodes/digitalsourcetype/compositeSynthetic\">composite synthetic</a>' using the IPTC <a href=\"https://cv.iptc.org/newscodes/digitalsourcetype/\">digital source type</a> vocabulary."
      },
      {
        "name": "CompositeWithTrainedAlgorithmicMediaDigitalSource",
        "type": "https://schema.org/CompositeWithTrainedAlgorithmicMediaDigitalSource",
        "description": "Content coded as '<a href=\"https://cv.iptc.org/newscodes/digitalsourcetype/compositeWithTrainedAlgorithmicMedia\">composite with trained algorithmic media</a>' using the IPTC <a href=\"https://cv.iptc.org/newscodes/digitalsourcetype/\">digital source type</a> vocabulary."
      },
      {
        "name": "DataDrivenMediaDigitalSource",
        "type": "https://schema.org/DataDrivenMediaDigitalSource",
        "description": "Content coded as '<a href=\"https://cv.iptc.org/newscodes/digitalsourcetype/dataDrivenMedia\">data driven media</a>' using the IPTC <a href=\"https://cv.iptc.org/newscodes/digitalsourcetype/\">digital source type</a> vocabulary."
      },
      {
        "name": "DigitalArtDigitalSource",
        "type": "https://schema.org/DigitalArtDigitalSource",
        "description": "Content coded as '<a href=\"https://cv.iptc.org/newscodes/digitalsourcetype/digitalArt\">digital art</a>' using the IPTC <a href=\"https://cv.iptc.org/newscodes/digitalsourcetype/\">digital source type</a> vocabulary."
      },
      {
        "name": "DigitalCaptureDigitalSource",
        "type": "https://schema.org/DigitalCaptureDigitalSource",
        "description": "Content coded as '<a href=\"https://cv.iptc.org/newscodes/digitalsourcetype/digitalCapture\">digital capture</a></a>' using the IPTC <a href=\"https://cv.iptc.org/newscodes/digitalsourcetype/\">digital source type</a> vocabulary."
      },
      {
        "name": "MinorHumanEditsDigitalSource",
        "type": "https://schema.org/MinorHumanEditsDigitalSource",
        "description": "Content coded as '<a href=\"https://cv.iptc.org/newscodes/digitalsourcetype/minorHumanEdits\">minor human edits</a>' using the IPTC <a href=\"https://cv.iptc.org/newscodes/digitalsourcetype/\">digital source type</a> vocabulary."
      },
      {
        "name": "MultiFrameComputationalCaptureDigitalSource",
        "type": "https://schema.org/MultiFrameComputationalCaptureDigitalSource",
        "description": "Content coded as '<a href=\"https://cv.iptc.org/newscodes/digitalsourcetype/algorithmicMedia\">algorithmic media</a>' using the IPTC <a href=\"https://cv.iptc.org/newscodes/digitalsourcetype/\">digital source type</a> vocabulary."
      },
      {
        "name": "NegativeFilmDigitalSource",
        "type": "https://schema.org/NegativeFilmDigitalSource",
        "description": "Content coded as '<a href=\"https://cv.iptc.org/newscodes/digitalsourcetype/negativeFilm\">negative film</a></a>' using the IPTC <a href=\"https://cv.iptc.org/newscodes/digitalsourcetype/\">digital source type</a> vocabulary."
      },
      {
        "name": "PositiveFilmDigitalSource",
        "type": "https://schema.org/PositiveFilmDigitalSource",
        "description": "Content coded as '<a href=\"https://cv.iptc.org/newscodes/digitalsourcetype/positiveFilm\">positive film</a>' using the IPTC <a href=\"https://cv.iptc.org/newscodes/digitalsourcetype/\">digital source type</a> vocabulary."
      },
      {
        "name": "PrintDigitalSource",
        "type": "https://schema.org/PrintDigitalSource",
        "description": "Content coded as '<a href=\"https://cv.iptc.org/newscodes/digitalsourcetype/print\">print</a>' using the IPTC <a href=\"https://cv.iptc.org/newscodes/digitalsourcetype/\">digital source type</a> vocabulary."
      },
      {
        "name": "ScreenCaptureDigitalSource",
        "type": "https://schema.org/ScreenCaptureDigitalSource",
        "description": "Content coded as '<a href=\"https://cv.iptc.org/newscodes/digitalsourcetype/algorithmicMedia\">algorithmic media</a>' using the IPTC <a href=\"https://cv.iptc.org/newscodes/digitalsourcetype/\">digital source type</a> vocabulary."
      },
      {
        "name": "TrainedAlgorithmicMediaDigitalSource",
        "type": "https://schema.org/TrainedAlgorithmicMediaDigitalSource",
        "description": "Content coded as '<a href=\"https://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia\">trained algorithmic media</a>' using the IPTC <a href=\"https://cv.iptc.org/newscodes/digitalsourcetype/\">digital source type</a> vocabulary."
      },
      {
        "name": "VirtualRecordingDigitalSource",
        "type": "https://schema.org/VirtualRecordingDigitalSource",
        "description": "Content coded as '<a href=\"https://cv.iptc.org/newscodes/digitalsourcetype/virtualRecording\">virtual recording</a>' using the IPTC <a href=\"https://cv.iptc.org/newscodes/digitalsourcetype/\">digital source type</a> vocabulary."
      }
    ]
  },
  {
    "name": "Issue",
    "type": "http://purl.org/ontology/bibo/Issue",
    "source": "generated"
  },
  {
    "name": "ItemAvailability",
    "type": "https://schema.org/ItemAvailability",
    "source": "generated",
    "description": "A list of possible product availability options.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "BackOrder",
        "type": "https://schema.org/BackOrder",
        "description": "Indicates that the item is available on back order."
      },
      {
        "name": "Discontinued",
        "type": "https://schema.org/Discontinued",
        "description": "Indicates that the item has been discontinued."
      },
      {
        "name": "InStock",
        "type": "https://schema.org/InStock",
        "description": "Indicates that the item is in stock."
      },
      {
        "name": "InStoreOnly",
        "type": "https://schema.org/InStoreOnly",
        "description": "Indicates that the item is available only at physical locations."
      },
      {
        "name": "LimitedAvailability",
        "type": "https://schema.org/LimitedAvailability",
        "description": "Indicates that the item has limited availability."
      },
      {
        "name": "MadeToOrder",
        "type": "https://schema.org/MadeToOrder",
        "description": "Indicates that the item is made to order (custom made)."
      },
      {
        "name": "OnlineOnly",
        "type": "https://schema.org/OnlineOnly",
        "description": "Indicates that the item is available only online."
      },
      {
        "name": "OutOfStock",
        "type": "https://schema.org/OutOfStock",
        "description": "Indicates that the item is out of stock."
      },
      {
        "name": "PreOrder",
        "type": "https://schema.org/PreOrder",
        "description": "Indicates that the item is available for pre-order."
      },
      {
        "name": "PreSale",
        "type": "https://schema.org/PreSale",
        "description": "Indicates that the item is available for ordering and delivery before general availability."
      },
      {
        "name": "Reserved",
        "type": "https://schema.org/Reserved",
        "description": "Indicates that the item is reserved and therefore not available."
      },
      {
        "name": "SoldOut",
        "type": "https://schema.org/SoldOut",
        "description": "Indicates that the item has sold out."
      }
    ]
  },
  {
    "name": "ItemList",
    "type": "https://schema.org/ItemList",
    "source": "generated",
    "description": "A list of items of any sort&#x2014;for example, Top 10 Movies About Weathermen, or Top 100 Party Songs. Not to be confused with HTML lists, which are often used only for formatting.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "aggregateElement",
        "type": "https://schema.org/Thing",
        "description": "Indicates a prototype of the elements in the list that is used to hold aggregate information (ratings, offers, etc.).",
        "expectedTypes": [
          "https://schema.org/Thing"
        ],
        "rangeTypes": [
          "https://schema.org/Thing"
        ],
        "domainTypes": [
          "https://schema.org/ItemList"
        ]
      },
      {
        "name": "itemListElement",
        "type": [
          "https://schema.org/ListItem",
          "https://schema.org/Text",
          "https://schema.org/Thing"
        ],
        "description": "For itemListElement values, you can use simple strings (e.g. \"Peter\", \"Paul\", \"Mary\"), existing entities, or use ListItem.\\n\\nText values are best if the elements in the list are plain strings. Existing entities are best for a simple, unordered list of existing things in your data. ListItem is used with ordered lists when you want to provide additional context about the element in that list or when the same item might be in different places in different lists.\\n\\nNote: The order of elements in your mark-up is not sufficient for indicating the order or elements.  Use ListItem with a 'position' property in such cases.",
        "expectedTypes": [
          "https://schema.org/ListItem",
          "https://schema.org/Text",
          "https://schema.org/Thing"
        ],
        "rangeTypes": [
          "https://schema.org/ListItem",
          "https://schema.org/Text",
          "https://schema.org/Thing"
        ],
        "domainTypes": [
          "https://schema.org/ItemList"
        ]
      },
      {
        "name": "itemListOrder",
        "type": [
          "https://schema.org/ItemListOrderType",
          "https://schema.org/Text"
        ],
        "description": "Type of ordering (e.g. Ascending, Descending, Unordered).",
        "expectedTypes": [
          "https://schema.org/ItemListOrderType",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/ItemListOrderType",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/ItemList"
        ]
      },
      {
        "name": "numberOfItems",
        "type": "https://schema.org/Integer",
        "description": "The number of items in an ItemList. Note that some descriptions might not fully describe all items in a list (e.g., multi-page pagination); in such cases, the numberOfItems would be for the entire list.",
        "expectedTypes": [
          "https://schema.org/Integer"
        ],
        "rangeTypes": [
          "https://schema.org/Integer"
        ],
        "domainTypes": [
          "https://schema.org/ItemList"
        ]
      }
    ]
  },
  {
    "name": "ItemListOrderType",
    "type": "https://schema.org/ItemListOrderType",
    "source": "generated",
    "description": "Enumerated for values for itemListOrder for indicating how an ordered ItemList is organized.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "ItemListOrderAscending",
        "type": "https://schema.org/ItemListOrderAscending",
        "description": "An ItemList ordered with lower values listed first."
      },
      {
        "name": "ItemListOrderDescending",
        "type": "https://schema.org/ItemListOrderDescending",
        "description": "An ItemList ordered with higher values listed first."
      },
      {
        "name": "ItemListUnordered",
        "type": "https://schema.org/ItemListUnordered",
        "description": "An ItemList ordered with no explicit order."
      }
    ]
  },
  {
    "name": "ItemPage",
    "type": "https://schema.org/ItemPage",
    "source": "generated",
    "description": "A page devoted to a single item, such as a particular product or hotel.",
    "parentTypes": [
      "https://schema.org/WebPage"
    ]
  },
  {
    "name": "ITNonprofitType",
    "type": "https://schema.org/ITNonprofitType",
    "source": "generated",
    "description": "ITNonprofitType: Non-profit organization type originating from Italy. Most categories are drawn from the Italian Third Sector Code (Legislative Decree No. 117 of 3 July 2017), although some Italian non-profit entities, such as amateur sports entities, are primarily governed by other legislation.",
    "parentTypes": [
      "https://schema.org/NonprofitType"
    ],
    "enumerationValues": [
      {
        "name": "ITAmateurSportsClubCharity",
        "type": "https://schema.org/ITAmateurSportsClubCharity",
        "description": "ITAmateurSportsClubCharity: Non-profit type referring to Italian amateur sports clubs organized in corporate form (Ital. società sportiva dilettantistica or SSD), as distinct from amateur sports associations (Ital. associazione sportiva dilettantistica or ASD), governed primarily by Legislative Decree No. 36 of 28 February 2021, as amended, and registered in the national register of amateur sports activities established by Legislative Decree No. 39 of 28 February 2021. These entities are generally outside the Italian Third Sector unless also registered in the RUNTS."
      },
      {
        "name": "ITAssociativeNetworkCharity",
        "type": "https://schema.org/ITAssociativeNetworkCharity",
        "description": "ITAssociativeNetworkCharity: Non-profit type referring to Italian associative networks (Ital. rete associativa), associations grouping a large number of Third Sector entities, governed by Article 41 and related provisions of Legislative Decree No. 117 of 3 July 2017, the Italian Third Sector Code."
      },
      {
        "name": "ITCooperativeCharity",
        "type": "https://schema.org/ITCooperativeCharity",
        "description": "ITCooperativeCharity: Non-profit type referring to Italian social cooperatives (Ital. cooperativa sociale), governed primarily by Law 381 of 8 November 1991. Social cooperatives and their consortia qualify as social enterprises by operation of law under Article 1(4) of Legislative Decree No. 112 of 3 July 2017."
      },
      {
        "name": "ITMutualAidCharity",
        "type": "https://schema.org/ITMutualAidCharity",
        "description": "ITMutualAidCharity: Non-profit type referring to Italian mutual aid societies (Ital. società di mutuo soccorso or SOMS), governed by Law 3818 of 15 April 1886, in coordination with Articles 42 and following of Legislative Decree No. 117 of 3 July 2017, the Italian Third Sector Code."
      },
      {
        "name": "ITOtherThirdSectorEntityCharity",
        "type": "https://schema.org/ITOtherThirdSectorEntityCharity",
        "description": "ITOtherThirdSectorEntityCharity: Non-profit type referring to other Italian Third Sector entities (Ital. Ente del Terzo settore or ETS) registered in the Registro unico nazionale del Terzo settore (RUNTS) under Article 4 of Legislative Decree No. 117 of 3 July 2017 that do not fall within one of the specifically enumerated Third Sector categories."
      },
      {
        "name": "ITPhilanthropicEntityCharity",
        "type": "https://schema.org/ITPhilanthropicEntityCharity",
        "description": "ITPhilanthropicEntityCharity: Non-profit type referring to Italian philanthropic entities (Ital. ente filantropico), constituted as recognized associations or foundations and governed by Articles 37 and following of Legislative Decree No. 117 of 3 July 2017, the Italian Third Sector Code."
      },
      {
        "name": "ITSocialCompanyCharity",
        "type": "https://schema.org/ITSocialCompanyCharity",
        "description": "ITSocialCompanyCharity: Non-profit type referring to Italian social enterprises (Ital. impresa sociale), a status governed by Legislative Decree No. 112 of 3 July 2017, as amended. The status may be acquired by different types of private entities and is not limited to companies."
      },
      {
        "name": "ITSocialCooperativeCharity",
        "type": "https://schema.org/ITSocialCooperativeCharity",
        "description": "ITSocialCooperativeCharity: Non-profit type referring to Italian social cooperatives (Ital. cooperativa sociale), governed primarily by Law 381 of 8 November 1991. Social cooperatives and their consortia qualify as social enterprises by operation of law under Article 1(4) of Legislative Decree No. 112 of 3 July 2017."
      },
      {
        "name": "ITSocialEnterpriseCharity",
        "type": "https://schema.org/ITSocialEnterpriseCharity",
        "description": "ITSocialEnterpriseCharity: Non-profit type referring to Italian social enterprises (Ital. impresa sociale), a status governed by Legislative Decree No. 112 of 3 July 2017, as amended. The status may be acquired by different types of private entities and is not limited to companies."
      },
      {
        "name": "ITSocialPromotionCharity",
        "type": "https://schema.org/ITSocialPromotionCharity",
        "description": "ITSocialPromotionCharity: Non-profit type referring to Italian social promotion associations (Ital. associazione di promozione sociale or APS), governed primarily by Articles 35 and following of Legislative Decree No. 117 of 3 July 2017, the Italian Third Sector Code, which superseded Law 383 of 2000."
      },
      {
        "name": "ITSportCompanyCharity",
        "type": "https://schema.org/ITSportCompanyCharity",
        "description": "ITSportCompanyCharity: Non-profit type referring to Italian amateur sports clubs organized in corporate form (Ital. società sportiva dilettantistica or SSD), as distinct from amateur sports associations (Ital. associazione sportiva dilettantistica or ASD), governed primarily by Legislative Decree No. 36 of 28 February 2021, as amended, and registered in the national register of amateur sports activities established by Legislative Decree No. 39 of 28 February 2021. These entities are generally outside the Italian Third Sector unless also registered in the RUNTS."
      },
      {
        "name": "ITVolunteerAssociationCharity",
        "type": "https://schema.org/ITVolunteerAssociationCharity",
        "description": "ITVolunteerAssociationCharity: Non-profit type referring to Italian volunteer organizations (Ital. organizzazione di volontariato or ODV), governed primarily by Articles 32 and following of Legislative Decree No. 117 of 3 July 2017, the Italian Third Sector Code, which superseded Law 266 of 1991."
      }
    ]
  },
  {
    "name": "JewelryStore",
    "type": "https://schema.org/JewelryStore",
    "source": "generated",
    "description": "A jewelry store.",
    "parentTypes": [
      "https://schema.org/Store"
    ]
  }
] satisfies readonly SchemaDefinition[];
