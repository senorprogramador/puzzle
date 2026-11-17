/*
 * This file is generated. Do not edit manually.
 * Schema.org version: 30.1
 * Source SHA-256: 0a4b8c4c910fc831ec8695196510973390906a5ee34dc6b862dfec4d21a12f74
 */

import type { SchemaDefinition } from "../../types";

export const generatedSchemaDefinitions1: readonly SchemaDefinition[] =
[
  {
    "name": "CreativeWork",
    "type": "https://schema.org/CreativeWork",
    "source": "generated",
    "description": "The most generic kind of creative work, including books, movies, photographs, software programs, etc.",
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
        "name": "abstract",
        "type": "https://schema.org/Text",
        "description": "An abstract is a short description that summarizes a [[CreativeWork]].",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "accessibilityAPI",
        "type": "https://schema.org/Text",
        "description": "Indicates that the resource is compatible with the referenced accessibility API. Values should be drawn from the [approved vocabulary](https://www.w3.org/2021/a11y-discov-vocab/latest/#accessibilityAPI-vocabulary).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "accessibilityControl",
        "type": "https://schema.org/Text",
        "description": "Identifies input methods that are sufficient to fully control the described resource. Values should be drawn from the [approved vocabulary](https://www.w3.org/2021/a11y-discov-vocab/latest/#accessibilityControl-vocabulary).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "accessibilityFeature",
        "type": "https://schema.org/Text",
        "description": "Content features of the resource, such as accessible media, alternatives and supported enhancements for accessibility. Values should be drawn from the [approved vocabulary](https://www.w3.org/2021/a11y-discov-vocab/latest/#accessibilityFeature-vocabulary).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "accessibilityHazard",
        "type": "https://schema.org/Text",
        "description": "A characteristic of the described resource that is physiologically dangerous to some users. Related to WCAG 2.0 guideline 2.3. Values should be drawn from the [approved vocabulary](https://www.w3.org/2021/a11y-discov-vocab/latest/#accessibilityHazard-vocabulary).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "accessibilitySummary",
        "type": "https://schema.org/Text",
        "description": "A human-readable summary of specific accessibility features or deficiencies, consistent with the other accessibility metadata but expressing subtleties such as \"short descriptions are present but long descriptions will be needed for non-visual users\" or \"short descriptions are present and no long descriptions are needed\".",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "accessMode",
        "type": "https://schema.org/Text",
        "description": "The human sensory perceptual system or cognitive faculty through which a person may process or perceive the intellectual content of a resource, not including any adaptations of the content (e.g., text alternatives for images). Values should be drawn from the [approved vocabulary](https://www.w3.org/2021/a11y-discov-vocab/latest/#accessMode-vocabulary).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "accessModeSufficient",
        "type": "https://schema.org/ItemList",
        "description": "A list of single or combined access modes that are sufficient to understand all the intellectual content of a resource, including any adaptations. Values should be drawn from the [approved vocabulary](https://www.w3.org/2021/a11y-discov-vocab/latest/#accessModeSufficient-vocabulary).",
        "expectedTypes": [
          "https://schema.org/ItemList"
        ],
        "rangeTypes": [
          "https://schema.org/ItemList"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "accountablePerson",
        "type": "https://schema.org/Person",
        "description": "Specifies the Person that is legally accountable for the CreativeWork.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "acquireLicensePage",
        "type": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "description": "Indicates a page documenting how licenses can be purchased or otherwise acquired, for the current item.",
        "expectedTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
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
        "name": "alternativeHeadline",
        "type": "https://schema.org/Text",
        "description": "A secondary title of the CreativeWork.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "archivedAt",
        "type": [
          "https://schema.org/URL",
          "https://schema.org/WebPage"
        ],
        "description": "Indicates a page or other link involved in archival of a [[CreativeWork]]. In the case of [[MediaReview]], the items in a [[MediaReviewItem]] may often become inaccessible, but be archived by archival, journalistic, activist, or law enforcement organizations. In such cases, the referenced page may not directly publish the content.",
        "expectedTypes": [
          "https://schema.org/URL",
          "https://schema.org/WebPage"
        ],
        "rangeTypes": [
          "https://schema.org/URL",
          "https://schema.org/WebPage"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "assesses",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text"
        ],
        "description": "The item being described is intended to assess the competency or learning outcome defined by the referenced term.",
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
          "https://schema.org/EducationEvent",
          "https://schema.org/LearningResource"
        ]
      },
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
        "name": "audio",
        "type": [
          "https://schema.org/AudioObject",
          "https://schema.org/Clip",
          "https://schema.org/MusicRecording"
        ],
        "description": "An embedded audio object.",
        "expectedTypes": [
          "https://schema.org/AudioObject",
          "https://schema.org/Clip",
          "https://schema.org/MusicRecording"
        ],
        "rangeTypes": [
          "https://schema.org/AudioObject",
          "https://schema.org/Clip",
          "https://schema.org/MusicRecording"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
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
        "name": "character",
        "type": "https://schema.org/Person",
        "description": "Fictional person connected with a creative work.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "citation",
        "type": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Text"
        ],
        "description": "A citation or reference to another creative work, such as another publication, web page, scholarly article, etc.",
        "expectedTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
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
        "name": "commentCount",
        "type": "https://schema.org/Integer",
        "description": "The number of comments this CreativeWork (e.g. Article, Question or Answer) has received. This is most applicable to works published in Web sites with commenting system; additional comments may exist elsewhere.",
        "expectedTypes": [
          "https://schema.org/Integer"
        ],
        "rangeTypes": [
          "https://schema.org/Integer"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "conditionsOfAccess",
        "type": "https://schema.org/Text",
        "description": "Conditions that affect the availability of, or method(s) of access to, an item. Typically used for real world items such as an [[ArchiveComponent]] held by an [[ArchiveOrganization]]. This property is not suitable for use as a general Web access control mechanism. It is expressed only in natural language.\\n\\nFor example \"Available by appointment from the Reading Room\" or \"Accessible only from logged-in accounts \". ",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "contentLocation",
        "type": "https://schema.org/Place",
        "description": "The location depicted or described in the content. For example, the location in a photograph or painting.",
        "expectedTypes": [
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "contentRating",
        "type": [
          "https://schema.org/Rating",
          "https://schema.org/Text"
        ],
        "description": "Official rating of a piece of content&#x2014;for example, 'MPAA PG-13'.",
        "expectedTypes": [
          "https://schema.org/Rating",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Rating",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "contentReferenceTime",
        "type": "https://schema.org/DateTime",
        "description": "The specific time described by a creative work, for works (e.g. articles, video objects etc.) that emphasise a particular moment within an Event.",
        "expectedTypes": [
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
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
        "name": "copyrightHolder",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "The party holding the legal copyright to the CreativeWork.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "copyrightNotice",
        "type": "https://schema.org/Text",
        "description": "Text of a notice appropriate for describing the copyright aspects of this Creative Work, ideally indicating the owner of the copyright for the Work.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "copyrightYear",
        "type": "https://schema.org/Number",
        "description": "The year during which the claimed copyright for the CreativeWork was first asserted.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "correction",
        "type": [
          "https://schema.org/CorrectionComment",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "Indicates a correction to a [[CreativeWork]], either via a [[CorrectionComment]], textually or in another document.",
        "expectedTypes": [
          "https://schema.org/CorrectionComment",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/CorrectionComment",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
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
        "name": "creativeWorkStatus",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text"
        ],
        "description": "The status of a creative work in terms of its stage in a lifecycle. Example terms include Incomplete, Draft, Published, Obsolete. Some organizations define a set of terms for the stages of their publication lifecycle.",
        "expectedTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
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
        "name": "creditText",
        "type": "https://schema.org/Text",
        "description": "Text that can be used to credit person(s) and/or organization(s) associated with a published Creative Work.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "dateCreated",
        "type": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "description": "The date on which the CreativeWork was created or the item was added to a DataFeed.",
        "expectedTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/DataFeedItem"
        ]
      },
      {
        "name": "dateModified",
        "type": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "description": "The date on which the CreativeWork was most recently modified or when the item's entry was modified within a DataFeed.",
        "expectedTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/DataFeedItem"
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
        "name": "digitalSourceType",
        "type": "https://schema.org/IPTCDigitalSourceEnumeration",
        "description": "Indicates an IPTCDigitalSourceEnumeration code indicating the nature of the digital source(s) for some [[CreativeWork]].",
        "expectedTypes": [
          "https://schema.org/IPTCDigitalSourceEnumeration"
        ],
        "rangeTypes": [
          "https://schema.org/IPTCDigitalSourceEnumeration"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "discussionUrl",
        "type": "https://schema.org/URL",
        "description": "A link to the page containing the comments of the CreativeWork.",
        "expectedTypes": [
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
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
        "name": "editEIDR",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "An [EIDR](https://eidr.org/) (Entertainment Identifier Registry) [[identifier]] representing a specific edit / edition for a work of film or television.\n\nFor example, the motion picture known as \"Ghostbusters\" whose [[titleEIDR]] is \"10.5240/7EC7-228A-510A-053E-CBB8-J\" has several edits, e.g. \"10.5240/1F2A-E1C5-680A-14C6-E76B-I\" and \"10.5240/8A35-3BEE-6497-5D12-9E4F-3\".\n\nSince schema.org types like [[Movie]] and [[TVEpisode]] can be used for both works and their multiple expressions, it is possible to use [[titleEIDR]] alone (for a general description), or alongside [[editEIDR]] for a more edit-specific description.\n",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "editor",
        "type": "https://schema.org/Person",
        "description": "Specifies the Person who edited the CreativeWork.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "educationalAlignment",
        "type": "https://schema.org/AlignmentObject",
        "description": "An alignment to an established educational framework.\n\nThis property should not be used where the nature of the alignment can be described using a simple property, for example to express that a resource [[teaches]] or [[assesses]] a competency.",
        "expectedTypes": [
          "https://schema.org/AlignmentObject"
        ],
        "rangeTypes": [
          "https://schema.org/AlignmentObject"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/LearningResource"
        ]
      },
      {
        "name": "educationalLevel",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "The level in terms of progression through an educational or training context. Examples of educational levels include 'beginner', 'intermediate' or 'advanced', and formal sets of level indicators.",
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
          "https://schema.org/EducationalOccupationalCredential",
          "https://schema.org/EducationEvent",
          "https://schema.org/LearningResource"
        ]
      },
      {
        "name": "educationalUse",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text"
        ],
        "description": "The purpose of a work in the context of education; for example, 'assignment', 'group work'.",
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
          "https://schema.org/LearningResource"
        ]
      },
      {
        "name": "encoding",
        "type": "https://schema.org/MediaObject",
        "description": "A media object that encodes this CreativeWork. This property is a synonym for associatedMedia.",
        "expectedTypes": [
          "https://schema.org/MediaObject"
        ],
        "rangeTypes": [
          "https://schema.org/MediaObject"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ],
        "inverseOf": "https://schema.org/encodesCreativeWork"
      },
      {
        "name": "encodingFormat",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "Media type typically expressed using a MIME format (see [IANA site](http://www.iana.org/assignments/media-types/media-types.xhtml) and [MDN reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types)), e.g. application/zip for a SoftwareApplication binary, audio/mpeg for .mp3 etc.\n\nIn cases where a [[CreativeWork]] has several media type representations, [[encoding]] can be used to indicate each [[MediaObject]] alongside particular [[encodingFormat]] information.\n\nUnregistered or niche encoding and file formats can be indicated instead via the most appropriate URL, e.g. defining Web page or a Wikipedia/Wikidata entry.",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/MediaObject"
        ]
      },
      {
        "name": "encodings",
        "type": "https://schema.org/MediaObject",
        "description": "A media object that encodes this CreativeWork.",
        "expectedTypes": [
          "https://schema.org/MediaObject"
        ],
        "rangeTypes": [
          "https://schema.org/MediaObject"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ],
        "supersededBy": "https://schema.org/encoding"
      },
      {
        "name": "exampleOfWork",
        "type": "https://schema.org/CreativeWork",
        "description": "A creative work that this work is an example/instance/realization/derivation of.",
        "expectedTypes": [
          "https://schema.org/CreativeWork"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ],
        "inverseOf": "https://schema.org/workExample"
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
        "name": "fileFormat",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "Media type, typically MIME format (see [IANA site](http://www.iana.org/assignments/media-types/media-types.xhtml)) of the content, e.g. application/zip of a SoftwareApplication binary. In cases where a CreativeWork has several media type representations, 'encoding' can be used to indicate each MediaObject alongside particular fileFormat information. Unregistered or niche file formats can be indicated instead via the most appropriate URL, e.g. defining Web page or a Wikipedia entry.",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ],
        "supersededBy": "https://schema.org/encodingFormat"
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
        "name": "hasPart",
        "type": "https://schema.org/CreativeWork",
        "description": "Indicates an item or CreativeWork that is part of this item, or CreativeWork (in some sense).",
        "expectedTypes": [
          "https://schema.org/CreativeWork"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ],
        "inverseOf": "https://schema.org/isPartOf"
      },
      {
        "name": "headline",
        "type": "https://schema.org/Text",
        "description": "Headline of the article.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
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
        "name": "interactivityType",
        "type": "https://schema.org/Text",
        "description": "The predominant mode of learning supported by the learning resource. Acceptable values are 'active', 'expositive', or 'mixed'.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "interpretedAsClaim",
        "type": "https://schema.org/Claim",
        "description": "Used to indicate a specific claim contained, implied, translated or refined from the content of a [[MediaObject]] or other [[CreativeWork]]. The interpreting party can be indicated using [[claimInterpreter]].",
        "expectedTypes": [
          "https://schema.org/Claim"
        ],
        "rangeTypes": [
          "https://schema.org/Claim"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/MediaObject"
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
        "name": "isBasedOn",
        "type": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Product",
          "https://schema.org/URL"
        ],
        "description": "A resource from which this work is derived or from which it is a modification or adaptation.",
        "expectedTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Product",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Product",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "isBasedOnUrl",
        "type": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Product",
          "https://schema.org/URL"
        ],
        "description": "A resource that was used in the creation of this resource. This term can be repeated for multiple sources. For example, http://example.com/great-multiplication-intro.html.",
        "expectedTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Product",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/Product",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ],
        "supersededBy": "https://schema.org/isBasedOn"
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
        "name": "isPartOf",
        "type": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "description": "Indicates an item or CreativeWork that this item, or CreativeWork (in some sense), is part of.",
        "expectedTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ],
        "inverseOf": "https://schema.org/hasPart"
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
        "name": "learningResourceType",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text"
        ],
        "description": "The predominant type or kind characterizing the learning resource. For example, 'presentation', 'handout'.",
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
          "https://schema.org/LearningResource"
        ]
      },
      {
        "name": "license",
        "type": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "description": "A license document that applies to this content, typically indicated by URL.",
        "expectedTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "locationCreated",
        "type": "https://schema.org/Place",
        "description": "The location where the CreativeWork was created, which may not be the same as the location depicted in the CreativeWork.",
        "expectedTypes": [
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "mainEntity",
        "type": "https://schema.org/Thing",
        "description": "Indicates the primary entity described in some page or other CreativeWork.",
        "expectedTypes": [
          "https://schema.org/Thing"
        ],
        "rangeTypes": [
          "https://schema.org/Thing"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ],
        "inverseOf": "https://schema.org/mainEntityOfPage"
      },
      {
        "name": "maintainer",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "A maintainer of a [[Dataset]], software package ([[SoftwareApplication]]), or other [[Project]]. A maintainer is a [[Person]] or [[Organization]] that manages contributions to, and/or publication of, some (typically complex) artifact. It is common for distributions of software and data to be based on \"upstream\" sources. When [[maintainer]] is applied to a specific version of something e.g. a particular version or packaging of a [[Dataset]], it is always  possible that the upstream source has a different maintainer. The [[isBasedOn]] property can be used to indicate such relationships between datasets to make the different maintenance roles clear. Similarly in the case of software, a package may have dedicated maintainers working on integration into software distributions such as Ubuntu, as well as upstream maintainers of the underlying work.\n      ",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
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
        "name": "materialExtent",
        "type": [
          "https://schema.org/QuantitativeValue",
          "https://schema.org/Text"
        ],
        "description": "The quantity of the materials being described or an expression of the physical space they occupy.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "mentions",
        "type": "https://schema.org/Thing",
        "description": "Indicates that the CreativeWork contains a reference to, but is not necessarily about a concept.",
        "expectedTypes": [
          "https://schema.org/Thing"
        ],
        "rangeTypes": [
          "https://schema.org/Thing"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
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
        "name": "position",
        "type": [
          "https://schema.org/Integer",
          "https://schema.org/Text"
        ],
        "description": "The position of an item in a series or sequence of items.",
        "expectedTypes": [
          "https://schema.org/Integer",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Integer",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/ListItem"
        ]
      },
      {
        "name": "producer",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "The person or organization who produced the work (e.g. music album, movie, TV/radio series etc.).",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
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
        "name": "publication",
        "type": "https://schema.org/PublicationEvent",
        "description": "A publication event associated with the item.",
        "expectedTypes": [
          "https://schema.org/PublicationEvent"
        ],
        "rangeTypes": [
          "https://schema.org/PublicationEvent"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
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
        "name": "publisherImprint",
        "type": "https://schema.org/Organization",
        "description": "The publishing division which published the comic.",
        "expectedTypes": [
          "https://schema.org/Organization"
        ],
        "rangeTypes": [
          "https://schema.org/Organization"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
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
        "name": "recordedAt",
        "type": "https://schema.org/Event",
        "description": "The Event where the CreativeWork was recorded. The CreativeWork may capture all or part of the event.",
        "expectedTypes": [
          "https://schema.org/Event"
        ],
        "rangeTypes": [
          "https://schema.org/Event"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ],
        "inverseOf": "https://schema.org/recordedIn"
      },
      {
        "name": "releasedEvent",
        "type": "https://schema.org/PublicationEvent",
        "description": "The place and time the release was issued, expressed as a PublicationEvent.",
        "expectedTypes": [
          "https://schema.org/PublicationEvent"
        ],
        "rangeTypes": [
          "https://schema.org/PublicationEvent"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
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
        "name": "schemaVersion",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "Indicates (by URL or string) a particular version of a schema used in some CreativeWork. This property was created primarily to\n    indicate the use of a specific schema.org release, e.g. ```10.0``` as a simple string, or more explicitly via URL, ```https://schema.org/docs/releases.html#v10.0```. There may be situations in which other schemas might usefully be referenced this way, e.g. ```http://dublincore.org/specifications/dublin-core/dces/1999-07-02/``` but this has not been carefully explored in the community.",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "sdDatePublished",
        "type": "https://schema.org/Date",
        "description": "Indicates the date on which the current structured data was generated / published. Typically used alongside [[sdPublisher]].",
        "expectedTypes": [
          "https://schema.org/Date"
        ],
        "rangeTypes": [
          "https://schema.org/Date"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "sdLicense",
        "type": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "description": "A license document that applies to this structured data, typically indicated by URL.",
        "expectedTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "sdPublisher",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "Indicates the party responsible for generating and publishing the current structured data markup, typically in cases where the structured data is derived automatically from existing published content but published on a different site. For example, student projects and open data initiatives often re-publish existing content with more explicitly structured metadata. The\n[[sdPublisher]] property helps make such practices more explicit.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
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
        "name": "sourceOrganization",
        "type": "https://schema.org/Organization",
        "description": "The Organization on whose behalf the creator was working.",
        "expectedTypes": [
          "https://schema.org/Organization"
        ],
        "rangeTypes": [
          "https://schema.org/Organization"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "spatial",
        "type": "https://schema.org/Place",
        "description": "The \"spatial\" property can be used in cases when more specific properties\n(e.g. [[locationCreated]], [[spatialCoverage]], [[contentLocation]]) are not known to be appropriate.",
        "expectedTypes": [
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "spatialCoverage",
        "type": "https://schema.org/Place",
        "description": "The spatialCoverage of a CreativeWork indicates the place(s) which are the focus of the content. It is a subproperty of\n      contentLocation intended primarily for more technical and detailed materials. For example with a Dataset, it indicates\n      areas that the dataset describes: a dataset of New York weather would have spatialCoverage which was the place: the state of New York.",
        "expectedTypes": [
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
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
        "name": "teaches",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text"
        ],
        "description": "The item being described is intended to help a person learn the competency or learning outcome defined by the referenced term.",
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
          "https://schema.org/EducationEvent",
          "https://schema.org/LearningResource"
        ]
      },
      {
        "name": "temporal",
        "type": [
          "https://schema.org/DateTime",
          "https://schema.org/Text"
        ],
        "description": "The \"temporal\" property can be used in cases where more specific properties\n(e.g. [[temporalCoverage]], [[dateCreated]], [[dateModified]], [[datePublished]]) are not known to be appropriate.",
        "expectedTypes": [
          "https://schema.org/DateTime",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/DateTime",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "temporalCoverage",
        "type": [
          "https://schema.org/DateTime",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "The temporalCoverage of a CreativeWork indicates the period that the content applies to, i.e. that it describes, either as a DateTime or as a textual string indicating a time period in [ISO 8601 time interval format](https://en.wikipedia.org/wiki/ISO_8601#Time_intervals). In\n      the case of a Dataset it will typically indicate the relevant time period in a precise notation (e.g. for a 2011 census dataset, the year 2011 would be written \"2011/2012\"). Other forms of content, e.g. ScholarlyArticle, Book, TVSeries or TVEpisode, may indicate their temporalCoverage in broader terms - textually or via well-known URL.\n      Written works such as books may sometimes have precise temporal coverage too, e.g. a work set in 1939 - 1945 can be indicated in ISO 8601 interval format format via \"1939/1945\".\n\nOpen-ended date ranges can be written with \"..\" in place of the end date. For example, \"2015-11/..\" indicates a range beginning in November 2015 and with no specified final date. This is tentative and might be updated in future when ISO 8601 is officially updated.",
        "expectedTypes": [
          "https://schema.org/DateTime",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/DateTime",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "text",
        "type": "https://schema.org/Text",
        "description": "The textual content of this CreativeWork.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "thumbnail",
        "type": "https://schema.org/ImageObject",
        "description": "Thumbnail image for an image or video.",
        "expectedTypes": [
          "https://schema.org/ImageObject"
        ],
        "rangeTypes": [
          "https://schema.org/ImageObject"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "thumbnailUrl",
        "type": "https://schema.org/URL",
        "description": "A thumbnail image relevant to the Thing.",
        "expectedTypes": [
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "timeRequired",
        "type": "https://schema.org/Duration",
        "description": "Approximate or typical time it usually takes to work with or through the content of this work for the typical or target audience.",
        "expectedTypes": [
          "https://schema.org/Duration"
        ],
        "rangeTypes": [
          "https://schema.org/Duration"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "translationOfWork",
        "type": "https://schema.org/CreativeWork",
        "description": "The work that this work has been translated from. E.g. 物种起源 is a translationOf “On the Origin of Species”.",
        "expectedTypes": [
          "https://schema.org/CreativeWork"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ],
        "inverseOf": "https://schema.org/workTranslation"
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
        "name": "usageInfo",
        "type": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "description": "The schema.org [[usageInfo]] property indicates further information about a [[CreativeWork]]. This property is applicable both to works that are freely available and to those that require payment or other transactions. It can reference additional information, e.g. community expectations on preferred linking and citation conventions, as well as purchasing details. For something that can be commercially licensed, usageInfo can provide detailed, resource-specific information about licensing options.\n\nThis property can be used alongside the license property which indicates license(s) applicable to some piece of content. The usageInfo property can provide information about other licensing options, e.g. acquiring commercial usage rights for an image that is also available under non-commercial creative commons licenses.",
        "expectedTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "version",
        "type": [
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "description": "The version of the CreativeWork embodied by a specified resource.",
        "expectedTypes": [
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ]
      },
      {
        "name": "video",
        "type": [
          "https://schema.org/Clip",
          "https://schema.org/VideoObject"
        ],
        "description": "An embedded video object.",
        "expectedTypes": [
          "https://schema.org/Clip",
          "https://schema.org/VideoObject"
        ],
        "rangeTypes": [
          "https://schema.org/Clip",
          "https://schema.org/VideoObject"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
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
      },
      {
        "name": "workExample",
        "type": "https://schema.org/CreativeWork",
        "description": "Example/instance/realization/derivation of the concept of this creative work. E.g. the paperback edition, first edition, or e-book.",
        "expectedTypes": [
          "https://schema.org/CreativeWork"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ],
        "inverseOf": "https://schema.org/exampleOfWork"
      },
      {
        "name": "workTranslation",
        "type": "https://schema.org/CreativeWork",
        "description": "A work that is a translation of the content of this work. E.g. 西遊記 has an English workTranslation “Journey to the West”, a German workTranslation “Monkeys Pilgerfahrt” and a Vietnamese  translation Tây du ký bình khảo.",
        "expectedTypes": [
          "https://schema.org/CreativeWork"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork"
        ],
        "inverseOf": "https://schema.org/translationOfWork"
      }
    ]
  },
  {
    "name": "CreativeWorkSeason",
    "type": "https://schema.org/CreativeWorkSeason",
    "source": "generated",
    "description": "A media season, e.g. TV, radio, video game etc.",
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
        "name": "seasonNumber",
        "type": [
          "https://schema.org/Integer",
          "https://schema.org/Text"
        ],
        "description": "Position of the season within an ordered group of seasons.",
        "expectedTypes": [
          "https://schema.org/Integer",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Integer",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWorkSeason"
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
    "name": "CreativeWorkSeries",
    "type": "https://schema.org/CreativeWorkSeries",
    "source": "generated",
    "description": "A CreativeWorkSeries in schema.org is a group of related items, typically but not necessarily of the same kind. CreativeWorkSeries are usually organized into some order, often chronological. Unlike [[ItemList]] which is a general purpose data structure for lists of things, the emphasis with CreativeWorkSeries is on published materials (written e.g. books and periodicals, or media such as TV, radio and games).\\n\\nSpecific subtypes are available for describing [[TVSeries]], [[RadioSeries]], [[MovieSeries]], [[BookSeries]], [[Periodical]] and [[VideoGameSeries]]. In each case, the [[hasPart]] / [[isPartOf]] properties can be used to relate the CreativeWorkSeries to its parts. The general CreativeWorkSeries type serves largely just to organize these more specific and practical subtypes.\\n\\nIt is common for properties applicable to an item from the series to be usefully applied to the containing group. Schema.org attempts to anticipate some of these cases, but publishers should be free to apply properties of the series parts to the series as a whole wherever they seem appropriate.\n    ",
    "parentTypes": [
      "https://schema.org/CreativeWork",
      "https://schema.org/Series"
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
    "name": "Credential",
    "type": "https://schema.org/Credential",
    "source": "generated",
    "description": "A credential is a certificate that is used to verify the identity of a person or entity.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ],
    "properties": [
      {
        "name": "credentialCategory",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "The category or type of credential being described, for example \"degree”, “certificate”, “badge”, or more specific term.",
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
          "https://schema.org/Credential"
        ]
      },
      {
        "name": "recognizedBy",
        "type": "https://schema.org/Organization",
        "description": "An organization that acknowledges the validity, value or utility of a credential. Note: recognition may include a process of quality assurance or accreditation.",
        "expectedTypes": [
          "https://schema.org/Organization"
        ],
        "rangeTypes": [
          "https://schema.org/Organization"
        ],
        "domainTypes": [
          "https://schema.org/Credential"
        ]
      },
      {
        "name": "validFor",
        "type": "https://schema.org/Duration",
        "description": "The duration of validity of a permit or similar thing.",
        "expectedTypes": [
          "https://schema.org/Duration"
        ],
        "rangeTypes": [
          "https://schema.org/Duration"
        ],
        "domainTypes": [
          "https://schema.org/Credential",
          "https://schema.org/Permit"
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
    "name": "CreditCard",
    "type": "https://schema.org/CreditCard",
    "source": "generated",
    "description": "A card payment method of a particular brand or name.  Used to mark up a particular payment method and/or the financial product/service that supplies the card account.\\n\\nCommonly used values:\\n\\n* http://purl.org/goodrelations/v1#AmericanExpress\\n* http://purl.org/goodrelations/v1#DinersClub\\n* http://purl.org/goodrelations/v1#Discover\\n* http://purl.org/goodrelations/v1#JCB\\n* http://purl.org/goodrelations/v1#MasterCard\\n* http://purl.org/goodrelations/v1#VISA\n       ",
    "parentTypes": [
      "https://schema.org/LoanOrCredit",
      "https://schema.org/PaymentCard"
    ]
  },
  {
    "name": "Crematorium",
    "type": "https://schema.org/Crematorium",
    "source": "generated",
    "description": "A crematorium.",
    "parentTypes": [
      "https://schema.org/CivicStructure"
    ]
  },
  {
    "name": "CriticReview",
    "type": "https://schema.org/CriticReview",
    "source": "generated",
    "description": "A [[CriticReview]] is a more specialized form of Review written or published by a source that is recognized for its reviewing activities. These can include online columns, travel and food guides, TV and radio shows, blogs and other independent Web sites. [[CriticReview]]s are typically more in-depth and professionally written. For simpler, casually written user/visitor/viewer/customer reviews, it is more appropriate to use the [[UserReview]] type. Review aggregator sites such as Metacritic already separate out the site's user reviews from selected critic reviews that originate from third-party sources.",
    "parentTypes": [
      "https://schema.org/Review"
    ]
  },
  {
    "name": "CssSelectorType",
    "type": "https://schema.org/CssSelectorType",
    "source": "generated",
    "description": "Text representing a CSS selector.",
    "parentTypes": [
      "https://schema.org/Text"
    ]
  },
  {
    "name": "CurrencyConversionService",
    "type": "https://schema.org/CurrencyConversionService",
    "source": "generated",
    "description": "A service to convert funds from one currency to another currency.",
    "parentTypes": [
      "https://schema.org/FinancialProduct"
    ]
  },
  {
    "name": "DanceEvent",
    "type": "https://schema.org/DanceEvent",
    "source": "generated",
    "description": "Event type: A social dance.",
    "parentTypes": [
      "https://schema.org/Event"
    ]
  },
  {
    "name": "DanceGroup",
    "type": "https://schema.org/DanceGroup",
    "source": "generated",
    "description": "A dance group&#x2014;for example, the Alvin Ailey Dance Theater or Riverdance.",
    "parentTypes": [
      "https://schema.org/PerformingGroup"
    ]
  },
  {
    "name": "DataCatalog",
    "type": "https://schema.org/DataCatalog",
    "source": "generated",
    "description": "A collection of datasets.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ],
    "properties": [
      {
        "name": "dataset",
        "type": "https://schema.org/Dataset",
        "description": "A dataset contained in this catalog.",
        "expectedTypes": [
          "https://schema.org/Dataset"
        ],
        "rangeTypes": [
          "https://schema.org/Dataset"
        ],
        "domainTypes": [
          "https://schema.org/DataCatalog"
        ],
        "inverseOf": "https://schema.org/includedInDataCatalog"
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
      }
    ]
  },
  {
    "name": "DataDownload",
    "type": "https://schema.org/DataDownload",
    "source": "generated",
    "description": "All or part of a [[Dataset]] in downloadable form. ",
    "parentTypes": [
      "https://schema.org/MediaObject"
    ],
    "properties": [
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
      }
    ]
  },
  {
    "name": "DataFeed",
    "type": "https://schema.org/DataFeed",
    "source": "generated",
    "description": "A single feed providing structured information about one or more entities or topics.",
    "parentTypes": [
      "https://schema.org/Dataset"
    ],
    "properties": [
      {
        "name": "dataFeedElement",
        "type": [
          "https://schema.org/DataFeedItem",
          "https://schema.org/Text",
          "https://schema.org/Thing"
        ],
        "description": "An item within a data feed. Data feeds may have many elements.",
        "expectedTypes": [
          "https://schema.org/DataFeedItem",
          "https://schema.org/Text",
          "https://schema.org/Thing"
        ],
        "rangeTypes": [
          "https://schema.org/DataFeedItem",
          "https://schema.org/Text",
          "https://schema.org/Thing"
        ],
        "domainTypes": [
          "https://schema.org/DataFeed"
        ]
      }
    ]
  },
  {
    "name": "DataFeedItem",
    "type": "https://schema.org/DataFeedItem",
    "source": "generated",
    "description": "A single item within a larger data feed.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "dateCreated",
        "type": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "description": "The date on which the CreativeWork was created or the item was added to a DataFeed.",
        "expectedTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/DataFeedItem"
        ]
      },
      {
        "name": "dateDeleted",
        "type": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "description": "The datetime the item was removed from the DataFeed.",
        "expectedTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/DataFeedItem"
        ]
      },
      {
        "name": "dateModified",
        "type": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "description": "The date on which the CreativeWork was most recently modified or when the item's entry was modified within a DataFeed.",
        "expectedTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/DataFeedItem"
        ]
      },
      {
        "name": "item",
        "type": "https://schema.org/Thing",
        "description": "An entity represented by an entry in a list or data feed (e.g. an 'artist' in a list of 'artists').",
        "expectedTypes": [
          "https://schema.org/Thing"
        ],
        "rangeTypes": [
          "https://schema.org/Thing"
        ],
        "domainTypes": [
          "https://schema.org/DataFeedItem",
          "https://schema.org/ListItem"
        ]
      }
    ]
  },
  {
    "name": "Dataset",
    "type": "http://www.w3.org/ns/dcat#Dataset",
    "source": "generated"
  },
  {
    "name": "Dataset",
    "type": "http://purl.org/dc/dcmitype/Dataset",
    "source": "generated"
  },
  {
    "name": "Dataset",
    "type": "https://schema.org/Dataset",
    "source": "generated",
    "description": "A body of structured information describing some topic(s) of interest.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ],
    "properties": [
      {
        "name": "catalog",
        "type": "https://schema.org/DataCatalog",
        "description": "A data catalog which contains this dataset.",
        "expectedTypes": [
          "https://schema.org/DataCatalog"
        ],
        "rangeTypes": [
          "https://schema.org/DataCatalog"
        ],
        "domainTypes": [
          "https://schema.org/Dataset"
        ],
        "supersededBy": "https://schema.org/includedInDataCatalog"
      },
      {
        "name": "datasetTimeInterval",
        "type": "https://schema.org/DateTime",
        "description": "The range of temporal applicability of a dataset, e.g. for a 2011 census dataset, the year 2011 (in ISO 8601 time interval format).",
        "expectedTypes": [
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/Dataset"
        ],
        "supersededBy": "https://schema.org/temporalCoverage"
      },
      {
        "name": "distribution",
        "type": "https://schema.org/DataDownload",
        "description": "A downloadable form of this dataset, at a specific location, in a specific format. This property can be repeated if different variations are available. There is no expectation that different downloadable distributions must contain exactly equivalent information (see also [DCAT](https://www.w3.org/TR/vocab-dcat-3/#Class:Distribution) on this point). Different distributions might include or exclude different subsets of the entire dataset, for example.",
        "expectedTypes": [
          "https://schema.org/DataDownload"
        ],
        "rangeTypes": [
          "https://schema.org/DataDownload"
        ],
        "domainTypes": [
          "https://schema.org/Dataset"
        ]
      },
      {
        "name": "includedDataCatalog",
        "type": "https://schema.org/DataCatalog",
        "description": "A data catalog which contains this dataset (this property was previously 'catalog', preferred name is now 'includedInDataCatalog').",
        "expectedTypes": [
          "https://schema.org/DataCatalog"
        ],
        "rangeTypes": [
          "https://schema.org/DataCatalog"
        ],
        "domainTypes": [
          "https://schema.org/Dataset"
        ],
        "supersededBy": "https://schema.org/includedInDataCatalog"
      },
      {
        "name": "includedInDataCatalog",
        "type": "https://schema.org/DataCatalog",
        "description": "A data catalog which contains this dataset.",
        "expectedTypes": [
          "https://schema.org/DataCatalog"
        ],
        "rangeTypes": [
          "https://schema.org/DataCatalog"
        ],
        "domainTypes": [
          "https://schema.org/Dataset"
        ],
        "inverseOf": "https://schema.org/dataset"
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
        "name": "variableMeasured",
        "type": [
          "https://schema.org/Property",
          "https://schema.org/PropertyValue",
          "https://schema.org/StatisticalVariable",
          "https://schema.org/Text"
        ],
        "description": "The variableMeasured property can indicate (repeated as necessary) the  variables that are measured in some dataset, either described as text or as pairs of identifier and description using PropertyValue, or more explicitly as a [[StatisticalVariable]].",
        "expectedTypes": [
          "https://schema.org/Property",
          "https://schema.org/PropertyValue",
          "https://schema.org/StatisticalVariable",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Property",
          "https://schema.org/PropertyValue",
          "https://schema.org/StatisticalVariable",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Dataset",
          "https://schema.org/Observation"
        ]
      }
    ]
  },
  {
    "name": "Dataset",
    "type": "http://rdfs.org/ns/void#Dataset",
    "source": "generated"
  },
  {
    "name": "DataType",
    "type": "https://schema.org/DataType",
    "source": "generated",
    "description": "The basic data types such as Integers, Strings, etc.",
    "parentTypes": [
      "http://www.w3.org/2000/01/rdf-schema#Class"
    ]
  },
  {
    "name": "Date",
    "type": "https://www.omg.org/spec/Commons/DatesAndTimes/Date",
    "source": "generated"
  },
  {
    "name": "Date",
    "type": "https://schema.org/Date",
    "source": "generated",
    "description": "A date value in [ISO 8601 date format](http://en.wikipedia.org/wiki/ISO_8601)."
  },
  {
    "name": "DatedMoneySpecification",
    "type": "https://schema.org/DatedMoneySpecification",
    "source": "generated",
    "description": "A DatedMoneySpecification represents monetary values with optional start and end dates. For example, this could represent an employee's salary over a specific period of time. __Note:__ This type has been superseded by [[MonetaryAmount]], use of that type is recommended.",
    "parentTypes": [
      "https://schema.org/StructuredValue"
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
      },
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
    "name": "DateTime",
    "type": "https://www.omg.org/spec/Commons/DatesAndTimes/DateTime",
    "source": "generated"
  },
  {
    "name": "DateTime",
    "type": "https://schema.org/DateTime",
    "source": "generated",
    "description": "A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm] (see Chapter 5.4 of ISO 8601)."
  },
  {
    "name": "DayOfWeek",
    "type": "https://schema.org/DayOfWeek",
    "source": "generated",
    "description": "The day of the week, e.g. used to specify to which day the opening hours of an OpeningHoursSpecification refer.\n\nOriginally, URLs from [GoodRelations](http://purl.org/goodrelations/v1) were used (for [[Monday]], [[Tuesday]], [[Wednesday]], [[Thursday]], [[Friday]], [[Saturday]], [[Sunday]] plus a special entry for [[PublicHolidays]]); these have now been integrated directly into schema.org.\n      ",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "Friday",
        "type": "https://schema.org/Friday",
        "description": "The day of the week between Thursday and Saturday."
      },
      {
        "name": "Monday",
        "type": "https://schema.org/Monday",
        "description": "The day of the week between Sunday and Tuesday."
      },
      {
        "name": "PublicHolidays",
        "type": "https://schema.org/PublicHolidays",
        "description": "This stands for any day that is a public holiday; it is a placeholder for all official public holidays in some particular location. While not technically a \"day of the week\", it can be used with [[OpeningHoursSpecification]]. In the context of an opening hours specification it can be used to indicate opening hours on public holidays, overriding general opening hours for the day of the week on which a public holiday occurs."
      },
      {
        "name": "Saturday",
        "type": "https://schema.org/Saturday",
        "description": "The day of the week between Friday and Sunday."
      },
      {
        "name": "Sunday",
        "type": "https://schema.org/Sunday",
        "description": "The day of the week between Saturday and Monday."
      },
      {
        "name": "Thursday",
        "type": "https://schema.org/Thursday",
        "description": "The day of the week between Wednesday and Friday."
      },
      {
        "name": "Tuesday",
        "type": "https://schema.org/Tuesday",
        "description": "The day of the week between Monday and Wednesday."
      },
      {
        "name": "Wednesday",
        "type": "https://schema.org/Wednesday",
        "description": "The day of the week between Tuesday and Thursday."
      }
    ]
  },
  {
    "name": "DaySpa",
    "type": "https://schema.org/DaySpa",
    "source": "generated",
    "description": "A day spa.",
    "parentTypes": [
      "https://schema.org/HealthAndBeautyBusiness"
    ]
  },
  {
    "name": "DDxElement",
    "type": "https://schema.org/DDxElement",
    "source": "generated",
    "description": "An alternative, closely-related condition typically considered later in the differential diagnosis process along with the signs that are used to distinguish it.",
    "parentTypes": [
      "https://schema.org/MedicalIntangible"
    ],
    "properties": [
      {
        "name": "diagnosis",
        "type": "https://schema.org/MedicalCondition",
        "description": "One or more alternative conditions considered in the differential diagnosis process as output of a diagnosis process.",
        "expectedTypes": [
          "https://schema.org/MedicalCondition"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalCondition"
        ],
        "domainTypes": [
          "https://schema.org/DDxElement",
          "https://schema.org/Patient"
        ]
      },
      {
        "name": "distinguishingSign",
        "type": "https://schema.org/MedicalSignOrSymptom",
        "description": "One of a set of signs and symptoms that can be used to distinguish this diagnosis from others in the differential diagnosis.",
        "expectedTypes": [
          "https://schema.org/MedicalSignOrSymptom"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalSignOrSymptom"
        ],
        "domainTypes": [
          "https://schema.org/DDxElement"
        ]
      }
    ]
  },
  {
    "name": "DeactivateAction",
    "type": "https://schema.org/DeactivateAction",
    "source": "generated",
    "description": "The act of stopping or deactivating a device or application (e.g. stopping a timer or turning off a flashlight).",
    "parentTypes": [
      "https://schema.org/ControlAction"
    ]
  },
  {
    "name": "DeclarationOfConformity",
    "type": "https://schema.org/DeclarationOfConformity",
    "source": "generated",
    "description": "A Declaration of Conformity (DoC), a formal document issued by a manufacturer declaring that a product meets specific regulatory requirements.",
    "parentTypes": [
      "https://schema.org/Certification"
    ]
  },
  {
    "name": "DefenceEstablishment",
    "type": "https://schema.org/DefenceEstablishment",
    "source": "generated",
    "description": "A defence establishment, such as an army or navy base.",
    "parentTypes": [
      "https://schema.org/GovernmentBuilding"
    ]
  },
  {
    "name": "DefinedRegion",
    "type": "https://schema.org/DefinedRegion",
    "source": "generated",
    "description": "A DefinedRegion is a geographic area defined by potentially arbitrary (rather than political, administrative or natural geographical) criteria. Properties are provided for defining a region by reference to sets of postal codes.\n\nExamples: a delivery destination when shopping. Region where regional pricing is configured.\n\nRequirement 1:\nCountry: US\nStates: \"NY\", \"CA\"\n\nRequirement 2:\nCountry: US\nPostalCode Set: { [94000-94585], [97000, 97999], [13000, 13599]}\n{ [12345, 12345], [78945, 78945], }\nRegion = state, canton, prefecture, autonomous community...\n",
    "parentTypes": [
      "https://schema.org/Place",
      "https://schema.org/StructuredValue"
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
        "name": "postalCodePrefix",
        "type": "https://schema.org/Text",
        "description": "A defined range of postal codes indicated by a common textual prefix. Used for non-numeric systems such as UK.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/DefinedRegion"
        ]
      },
      {
        "name": "postalCodeRange",
        "type": "https://schema.org/PostalCodeRangeSpecification",
        "description": "A defined range of postal codes.",
        "expectedTypes": [
          "https://schema.org/PostalCodeRangeSpecification"
        ],
        "rangeTypes": [
          "https://schema.org/PostalCodeRangeSpecification"
        ],
        "domainTypes": [
          "https://schema.org/DefinedRegion"
        ]
      }
    ]
  },
  {
    "name": "DefinedTerm",
    "type": "https://schema.org/DefinedTerm",
    "source": "generated",
    "description": "A word, name, acronym, phrase, etc. with a formal definition. Often used in the context of category or subject classification, glossaries or dictionaries, product or creative work types, etc. Use the name property for the term being defined, use termCode if the term has an alpha-numeric code allocated, use description to provide the definition of the term. Use the about property to specify what the term is about.",
    "parentTypes": [
      "https://schema.org/Intangible"
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
        "name": "inDefinedTermSet",
        "type": [
          "https://schema.org/DefinedTermSet",
          "https://schema.org/URL"
        ],
        "description": "A [[DefinedTermSet]] that contains this term.",
        "expectedTypes": [
          "https://schema.org/DefinedTermSet",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/DefinedTermSet",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/DefinedTerm"
        ]
      },
      {
        "name": "termCode",
        "type": "https://schema.org/Text",
        "description": "A code that identifies this [[DefinedTerm]] within a [[DefinedTermSet]].",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/DefinedTerm"
        ]
      }
    ]
  },
  {
    "name": "DefinedTermSet",
    "type": "https://schema.org/DefinedTermSet",
    "source": "generated",
    "description": "A set of defined terms, for example a set of categories or a classification scheme, a glossary, dictionary or enumeration. Use the about property to specify what the term set is about.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
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
      }
    ]
  },
  {
    "name": "DeleteAction",
    "type": "https://schema.org/DeleteAction",
    "source": "generated",
    "description": "The act of editing a recipient by removing one of its objects.",
    "parentTypes": [
      "https://schema.org/UpdateAction"
    ]
  },
  {
    "name": "DeliveryChargeSpecification",
    "type": "https://schema.org/DeliveryChargeSpecification",
    "source": "generated",
    "description": "The price for the delivery of an offer using a particular delivery method.",
    "parentTypes": [
      "https://schema.org/PriceSpecification"
    ],
    "properties": [
      {
        "name": "appliesToDeliveryMethod",
        "type": "https://schema.org/DeliveryMethod",
        "description": "The delivery method(s) to which the delivery charge or payment charge specification applies.",
        "expectedTypes": [
          "https://schema.org/DeliveryMethod"
        ],
        "rangeTypes": [
          "https://schema.org/DeliveryMethod"
        ],
        "domainTypes": [
          "https://schema.org/DeliveryChargeSpecification",
          "https://schema.org/PaymentChargeSpecification"
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
      }
    ]
  },
  {
    "name": "DeliveryEvent",
    "type": "https://schema.org/DeliveryEvent",
    "source": "generated",
    "description": "An event involving the delivery of an item.",
    "parentTypes": [
      "https://schema.org/Event"
    ],
    "properties": [
      {
        "name": "accessCode",
        "type": "https://schema.org/Text",
        "description": "Password, PIN, or access code needed for delivery (e.g. from a locker).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/DeliveryEvent"
        ]
      },
      {
        "name": "availableFrom",
        "type": "https://schema.org/DateTime",
        "description": "When the item is available for pickup from the store, locker, etc.",
        "expectedTypes": [
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/DeliveryEvent"
        ]
      },
      {
        "name": "availableThrough",
        "type": "https://schema.org/DateTime",
        "description": "After this date, the item will no longer be available for pickup.",
        "expectedTypes": [
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/DeliveryEvent"
        ]
      },
      {
        "name": "hasDeliveryMethod",
        "type": "https://schema.org/DeliveryMethod",
        "description": "Method used for delivery or shipping.",
        "expectedTypes": [
          "https://schema.org/DeliveryMethod"
        ],
        "rangeTypes": [
          "https://schema.org/DeliveryMethod"
        ],
        "domainTypes": [
          "https://schema.org/DeliveryEvent",
          "https://schema.org/ParcelDelivery"
        ]
      }
    ]
  },
  {
    "name": "DeliveryMethod",
    "type": "https://schema.org/DeliveryMethod",
    "source": "generated",
    "description": "A delivery method is a standardized procedure for transferring the product or service to the destination of fulfillment chosen by the customer. Delivery methods are characterized by the means of transportation used, and by the organization or group that is the contracting party for the sending organization or person.\\n\\nCommonly used values:\\n\\n* http://purl.org/goodrelations/v1#DeliveryModeDirectDownload\\n* http://purl.org/goodrelations/v1#DeliveryModeFreight\\n* http://purl.org/goodrelations/v1#DeliveryModeMail\\n* http://purl.org/goodrelations/v1#DeliveryModeOwnFleet\\n* http://purl.org/goodrelations/v1#DeliveryModePickUp\\n* http://purl.org/goodrelations/v1#DHL\\n* http://purl.org/goodrelations/v1#FederalExpress\\n* http://purl.org/goodrelations/v1#UPS\n        ",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "LockerDelivery",
        "type": "https://schema.org/LockerDelivery",
        "description": "A DeliveryMethod in which an item is made available via locker."
      },
      {
        "name": "OnSitePickup",
        "type": "https://schema.org/OnSitePickup",
        "description": "A DeliveryMethod in which an item is collected on site, e.g. in a store or at a box office."
      },
      {
        "name": "ParcelService",
        "type": "https://schema.org/ParcelService",
        "description": "A private parcel service as the delivery mode available for a certain offer.\\n\\nCommonly used values:\\n\\n* http://purl.org/goodrelations/v1#DHL\\n* http://purl.org/goodrelations/v1#FederalExpress\\n* http://purl.org/goodrelations/v1#UPS\n      "
      }
    ]
  },
  {
    "name": "DeliveryTimeSettings",
    "type": "https://schema.org/DeliveryTimeSettings",
    "source": "generated",
    "description": "A DeliveryTimeSettings represents re-usable pieces of shipping information, relating to timing. It is designed for publication on an URL that may be referenced via the [[shippingSettingsLink]] property of an [[OfferShippingDetails]]. Several occurrences can be published, distinguished (and identified/referenced) by their different values for [[transitTimeLabel]].",
    "parentTypes": [
      "https://schema.org/StructuredValue"
    ],
    "properties": [
      {
        "name": "deliveryTime",
        "type": "https://schema.org/ShippingDeliveryTime",
        "description": "The total delay between the receipt of the order and the goods reaching the final customer.",
        "expectedTypes": [
          "https://schema.org/ShippingDeliveryTime"
        ],
        "rangeTypes": [
          "https://schema.org/ShippingDeliveryTime"
        ],
        "domainTypes": [
          "https://schema.org/DeliveryTimeSettings",
          "https://schema.org/OfferShippingDetails"
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
        "name": "transitTimeLabel",
        "type": "https://schema.org/Text",
        "description": "Label to match an [[OfferShippingDetails]] with a [[DeliveryTimeSettings]] (within the context of a [[shippingSettingsLink]] cross-reference).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/DeliveryTimeSettings",
          "https://schema.org/OfferShippingDetails"
        ]
      }
    ]
  },
  {
    "name": "Demand",
    "type": "https://schema.org/Demand",
    "source": "generated",
    "description": "A demand entity represents the public, not necessarily binding, not necessarily exclusive, announcement by an organization or person to seek a certain type of goods or services. For describing demand using this type, the very same properties used for Offer apply.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "acceptedPaymentMethod",
        "type": [
          "https://schema.org/LoanOrCredit",
          "https://schema.org/PaymentMethod",
          "https://schema.org/Text"
        ],
        "description": "The payment method(s) that are accepted in general by an organization, or for some specific demand or offer.",
        "expectedTypes": [
          "https://schema.org/LoanOrCredit",
          "https://schema.org/PaymentMethod",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/LoanOrCredit",
          "https://schema.org/PaymentMethod",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Demand",
          "https://schema.org/Offer",
          "https://schema.org/Organization"
        ]
      },
      {
        "name": "advanceBookingRequirement",
        "type": "https://schema.org/QuantitativeValue",
        "description": "The amount of time that is required between accepting the offer and the actual usage of the resource or service.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/Demand",
          "https://schema.org/Offer"
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
        "name": "availability",
        "type": "https://schema.org/ItemAvailability",
        "description": "The availability of this item&#x2014;for example In stock, Out of stock, Pre-order, etc.",
        "expectedTypes": [
          "https://schema.org/ItemAvailability"
        ],
        "rangeTypes": [
          "https://schema.org/ItemAvailability"
        ],
        "domainTypes": [
          "https://schema.org/Demand",
          "https://schema.org/Offer"
        ]
      },
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
        "name": "availableAtOrFrom",
        "type": "https://schema.org/Place",
        "description": "The place(s) from which the offer can be obtained (e.g. store locations).",
        "expectedTypes": [
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/Demand",
          "https://schema.org/Offer"
        ]
      },
      {
        "name": "availableDeliveryMethod",
        "type": "https://schema.org/DeliveryMethod",
        "description": "The delivery method(s) available for this offer.",
        "expectedTypes": [
          "https://schema.org/DeliveryMethod"
        ],
        "rangeTypes": [
          "https://schema.org/DeliveryMethod"
        ],
        "domainTypes": [
          "https://schema.org/Demand",
          "https://schema.org/Offer"
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
        "name": "deliveryLeadTime",
        "type": "https://schema.org/QuantitativeValue",
        "description": "The typical delay between the receipt of the order and the goods either leaving the warehouse or being prepared for pickup, in case the delivery method is on site pickup.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/Demand",
          "https://schema.org/Offer"
        ]
      },
      {
        "name": "eligibleCustomerType",
        "type": "https://schema.org/BusinessEntityType",
        "description": "The type(s) of customers for which the given offer is valid.",
        "expectedTypes": [
          "https://schema.org/BusinessEntityType"
        ],
        "rangeTypes": [
          "https://schema.org/BusinessEntityType"
        ],
        "domainTypes": [
          "https://schema.org/Demand",
          "https://schema.org/Offer"
        ]
      },
      {
        "name": "eligibleDuration",
        "type": "https://schema.org/QuantitativeValue",
        "description": "The duration for which the given offer is valid.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/Demand",
          "https://schema.org/Offer"
        ]
      },
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
        "name": "itemOffered",
        "type": [
          "https://schema.org/AggregateOffer",
          "https://schema.org/CreativeWork",
          "https://schema.org/Event",
          "https://schema.org/MenuItem",
          "https://schema.org/Product",
          "https://schema.org/Service",
          "https://schema.org/Trip"
        ],
        "description": "An item being offered (or demanded). The transactional nature of the offer or demand is documented using [[businessFunction]], e.g. sell, lease etc. While several common expected types are listed explicitly in this definition, others can be used. Using a second type, such as Product or a subtype of Product, can clarify the nature of the offer.",
        "expectedTypes": [
          "https://schema.org/AggregateOffer",
          "https://schema.org/CreativeWork",
          "https://schema.org/Event",
          "https://schema.org/MenuItem",
          "https://schema.org/Product",
          "https://schema.org/Service",
          "https://schema.org/Trip"
        ],
        "rangeTypes": [
          "https://schema.org/AggregateOffer",
          "https://schema.org/CreativeWork",
          "https://schema.org/Event",
          "https://schema.org/MenuItem",
          "https://schema.org/Product",
          "https://schema.org/Service",
          "https://schema.org/Trip"
        ],
        "domainTypes": [
          "https://schema.org/Demand",
          "https://schema.org/Offer"
        ],
        "inverseOf": "https://schema.org/offers"
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
        "name": "warranty",
        "type": "https://schema.org/WarrantyPromise",
        "description": "The warranty promise(s) included in the offer.",
        "expectedTypes": [
          "https://schema.org/WarrantyPromise"
        ],
        "rangeTypes": [
          "https://schema.org/WarrantyPromise"
        ],
        "domainTypes": [
          "https://schema.org/Demand",
          "https://schema.org/Offer"
        ]
      }
    ]
  },
  {
    "name": "DENonprofitType",
    "type": "https://schema.org/DENonprofitType",
    "source": "generated",
    "description": "DENonprofitType: Non-profit organization type originating from Germany in accordance with article 52 of the German fiscal code (Abgabenverordnung or AO).",
    "parentTypes": [
      "https://schema.org/NonprofitType"
    ],
    "enumerationValues": [
      {
        "name": "DECooperativeCharity",
        "type": "https://schema.org/DECooperativeCharity",
        "description": "DECooperativeCharity: Non-profit type referring to a charitable Cooperative (German Genossenschaft) that has been recognized by the tax authorities as a charitable non-profit."
      },
      {
        "name": "DEFoundationCharity",
        "type": "https://schema.org/DEFoundationCharity",
        "description": "DEFoundationCharity: Non-profit type referring to a charitable Foundation (German Stiftung) that has been recognized by the tax authorities as a charitable non-profit."
      },
      {
        "name": "DEJointStockCompanyCharity",
        "type": "https://schema.org/DEJointStockCompanyCharity",
        "description": "DEJointStockCompanyCharity: Non-profit type referring to a charitable Joint Stock Company (German gAG gemeinnützige Aktiengesellschaft) that has been recognized by the tax authorities as a charitable non-profit."
      },
      {
        "name": "DELimitedLiabilityCharity",
        "type": "https://schema.org/DELimitedLiabilityCharity",
        "description": "DELimitedLiabilityCharity: Non-profit type referring to a charitable Common Stock Company (German gGmbH or gemeinnützige Gesellschaft mit beschränkter Haftung) that has been recognized by the tax authorities as a charitable non-profit."
      },
      {
        "name": "DENotRegisteredAssociationCharity",
        "type": "https://schema.org/DENotRegisteredAssociationCharity",
        "description": "DENotRegisteredAssociationCharity: Non-profit type referring to a charitable association that is not registered with the German association register (gemeinnütziger Verein) and has been recognized by the tax authorities as a charitable non-profit."
      },
      {
        "name": "DEPublicCharity",
        "type": "https://schema.org/DEPublicCharity",
        "description": "DEPublicCharity: Non-profit type referring to a charitable government owned juridical person (German Körperschaft öffentlichen Rechts) that has been recognized by the tax authorities as a charitable non-profit."
      },
      {
        "name": "DERegisteredAssociationCharity",
        "type": "https://schema.org/DERegisteredAssociationCharity",
        "description": "DERegisteredAssociationCharity: Non-profit type referring to a charitable association that is registered with the German association register (german gemeinnütziger e.v. or gemeinnütziger eingetragener Verein) and has been recognized by the tax authorities as a charitable non-profit."
      }
    ]
  },
  {
    "name": "Dentist",
    "type": "https://schema.org/Dentist",
    "source": "generated",
    "description": "A dentist.",
    "parentTypes": [
      "https://schema.org/LocalBusiness",
      "https://schema.org/MedicalBusiness",
      "https://schema.org/MedicalOrganization"
    ]
  },
  {
    "name": "DepartAction",
    "type": "https://schema.org/DepartAction",
    "source": "generated",
    "description": "The act of  departing from a place. An agent departs from a fromLocation for a destination, optionally with participants.",
    "parentTypes": [
      "https://schema.org/MoveAction"
    ]
  },
  {
    "name": "DepartmentStore",
    "type": "https://schema.org/DepartmentStore",
    "source": "generated",
    "description": "A department store.",
    "parentTypes": [
      "https://schema.org/Store"
    ]
  },
  {
    "name": "DepositAccount",
    "type": "https://schema.org/DepositAccount",
    "source": "generated",
    "description": "A type of Bank Account with a main purpose of depositing funds to gain interest or other benefits.",
    "parentTypes": [
      "https://schema.org/BankAccount",
      "https://schema.org/InvestmentOrDeposit"
    ]
  },
  {
    "name": "DiagnosticLab",
    "type": "https://schema.org/DiagnosticLab",
    "source": "generated",
    "description": "A medical laboratory that offers on-site or off-site diagnostic services.",
    "parentTypes": [
      "https://schema.org/MedicalOrganization"
    ],
    "properties": [
      {
        "name": "availableTest",
        "type": "https://schema.org/MedicalTest",
        "description": "A diagnostic test or procedure offered by this lab.",
        "expectedTypes": [
          "https://schema.org/MedicalTest"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalTest"
        ],
        "domainTypes": [
          "https://schema.org/DiagnosticLab"
        ]
      }
    ]
  },
  {
    "name": "DiagnosticProcedure",
    "type": "https://schema.org/DiagnosticProcedure",
    "source": "generated",
    "description": "A medical procedure intended primarily for diagnostic, as opposed to therapeutic, purposes.",
    "parentTypes": [
      "https://schema.org/MedicalProcedure"
    ]
  },
  {
    "name": "Diet",
    "type": "https://schema.org/Diet",
    "source": "generated",
    "description": "A strategy of regulating the intake of food to achieve or maintain a specific health-related goal.",
    "parentTypes": [
      "https://schema.org/CreativeWork",
      "https://schema.org/LifestyleModification"
    ],
    "properties": [
      {
        "name": "dietFeatures",
        "type": "https://schema.org/Text",
        "description": "Nutritional information specific to the dietary plan. May include dietary recommendations on what foods to avoid, what foods to consume, and specific alterations/deviations from the USDA or other regulatory body's approved dietary guidelines.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Diet"
        ]
      },
      {
        "name": "endorsers",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "People or organizations that endorse the plan.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Diet"
        ]
      },
      {
        "name": "expertConsiderations",
        "type": "https://schema.org/Text",
        "description": "Medical expert advice related to the plan.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Diet"
        ]
      },
      {
        "name": "physiologicalBenefits",
        "type": "https://schema.org/Text",
        "description": "Specific physiologic benefits associated to the plan.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Diet"
        ]
      },
      {
        "name": "risks",
        "type": "https://schema.org/Text",
        "description": "Specific physiologic risks associated to the diet plan.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Diet"
        ]
      }
    ]
  },
  {
    "name": "DietarySupplement",
    "type": "https://schema.org/DietarySupplement",
    "source": "generated",
    "description": "A product taken by mouth that contains a dietary ingredient intended to supplement the diet. Dietary ingredients may include vitamins, minerals, herbs or other botanicals, amino acids, and substances such as enzymes, organ tissues, glandulars and metabolites.",
    "parentTypes": [
      "https://schema.org/Product",
      "https://schema.org/Substance"
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
        "name": "isProprietary",
        "type": "https://schema.org/Boolean",
        "description": "True if this item's name is a proprietary/brand name (vs. generic name).",
        "expectedTypes": [
          "https://schema.org/Boolean"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean"
        ],
        "domainTypes": [
          "https://schema.org/DietarySupplement",
          "https://schema.org/Drug"
        ]
      },
      {
        "name": "legalStatus",
        "type": [
          "https://schema.org/DrugLegalStatus",
          "https://schema.org/MedicalEnumeration",
          "https://schema.org/Text"
        ],
        "description": "The drug or supplement's legal status, including any controlled substance schedules that apply.",
        "expectedTypes": [
          "https://schema.org/DrugLegalStatus",
          "https://schema.org/MedicalEnumeration",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/DrugLegalStatus",
          "https://schema.org/MedicalEnumeration",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/DietarySupplement",
          "https://schema.org/Drug",
          "https://schema.org/MedicalEntity"
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
      },
      {
        "name": "mechanismOfAction",
        "type": "https://schema.org/Text",
        "description": "The specific biochemical interaction through which this drug or supplement produces its pharmacological effect.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/DietarySupplement",
          "https://schema.org/Drug"
        ]
      },
      {
        "name": "nonProprietaryName",
        "type": "https://schema.org/Text",
        "description": "The generic name of this drug or supplement.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/DietarySupplement",
          "https://schema.org/Drug"
        ]
      },
      {
        "name": "proprietaryName",
        "type": "https://schema.org/Text",
        "description": "Proprietary name given to the diet plan, typically by its originator or creator.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/DietarySupplement",
          "https://schema.org/Drug"
        ]
      },
      {
        "name": "recommendedIntake",
        "type": "https://schema.org/RecommendedDoseSchedule",
        "description": "Recommended intake of this supplement for a given population as defined by a specific recommending authority.",
        "expectedTypes": [
          "https://schema.org/RecommendedDoseSchedule"
        ],
        "rangeTypes": [
          "https://schema.org/RecommendedDoseSchedule"
        ],
        "domainTypes": [
          "https://schema.org/DietarySupplement"
        ]
      },
      {
        "name": "safetyConsideration",
        "type": "https://schema.org/Text",
        "description": "Any potential safety concern associated with the supplement. May include interactions with other drugs and foods, pregnancy, breastfeeding, known adverse reactions, and documented efficacy of the supplement.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/DietarySupplement"
        ]
      },
      {
        "name": "targetPopulation",
        "type": "https://schema.org/Text",
        "description": "Characteristics of the population for which this is intended, or which typically uses it, e.g. 'adults'.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/DietarySupplement",
          "https://schema.org/DoseSchedule"
        ]
      }
    ]
  },
  {
    "name": "DigitalDocument",
    "type": "https://schema.org/DigitalDocument",
    "source": "generated",
    "description": "An electronic file or document.",
    "parentTypes": [
      "https://schema.org/CreativeWork",
      "https://spec.edmcouncil.org/fibo/ontology/FND/Arrangements/Documents/Document"
    ],
    "properties": [
      {
        "name": "hasDigitalDocumentPermission",
        "type": "https://schema.org/DigitalDocumentPermission",
        "description": "A permission related to the access to this document (e.g. permission to read or write an electronic document). For a public document, specify a grantee with an Audience with audienceType equal to \"public\".",
        "expectedTypes": [
          "https://schema.org/DigitalDocumentPermission"
        ],
        "rangeTypes": [
          "https://schema.org/DigitalDocumentPermission"
        ],
        "domainTypes": [
          "https://schema.org/DigitalDocument"
        ]
      }
    ]
  },
  {
    "name": "DigitalDocumentPermission",
    "type": "https://schema.org/DigitalDocumentPermission",
    "source": "generated",
    "description": "A permission for a particular person or group to access a particular file.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "grantee",
        "type": [
          "https://schema.org/Audience",
          "https://schema.org/ContactPoint",
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "The person, organization, contact point, or audience that has been granted this permission.",
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
          "https://schema.org/DigitalDocumentPermission"
        ]
      },
      {
        "name": "permissionType",
        "type": "https://schema.org/DigitalDocumentPermissionType",
        "description": "The type of permission granted the person, organization, or audience.",
        "expectedTypes": [
          "https://schema.org/DigitalDocumentPermissionType"
        ],
        "rangeTypes": [
          "https://schema.org/DigitalDocumentPermissionType"
        ],
        "domainTypes": [
          "https://schema.org/DigitalDocumentPermission"
        ]
      }
    ]
  },
  {
    "name": "DigitalDocumentPermissionType",
    "type": "https://schema.org/DigitalDocumentPermissionType",
    "source": "generated",
    "description": "A type of permission which can be granted for accessing a digital document.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "CommentPermission",
        "type": "https://schema.org/CommentPermission",
        "description": "Permission to add comments to the document."
      },
      {
        "name": "ReadPermission",
        "type": "https://schema.org/ReadPermission",
        "description": "Permission to read or view the document."
      },
      {
        "name": "WritePermission",
        "type": "https://schema.org/WritePermission",
        "description": "Permission to write or edit the document."
      }
    ]
  },
  {
    "name": "DigitalPlatformEnumeration",
    "type": "https://schema.org/DigitalPlatformEnumeration",
    "source": "generated",
    "description": "Enumerates some common technology platforms, for use with properties such as [[actionPlatform]]. It is not supposed to be comprehensive - when a suitable code is not enumerated here, textual or URL values can be used instead. These codes are at a fairly high level and do not deal with versioning and other nuance. Additional codes can be suggested [in github](https://github.com/schemaorg/schemaorg/issues/3057). ",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "AndroidPlatform",
        "type": "https://schema.org/AndroidPlatform",
        "description": "Represents the broad notion of Android-based operating systems."
      },
      {
        "name": "DesktopWebPlatform",
        "type": "https://schema.org/DesktopWebPlatform",
        "description": "Represents the broad notion of 'desktop' browsers as a Web Platform."
      },
      {
        "name": "GenericWebPlatform",
        "type": "https://schema.org/GenericWebPlatform",
        "description": "Represents the generic notion of the Web Platform. More specific codes include [[MobileWebPlatform]] and [[DesktopWebPlatform]], as an incomplete list. "
      },
      {
        "name": "IOSPlatform",
        "type": "https://schema.org/IOSPlatform",
        "description": "Represents the broad notion of iOS-based operating systems."
      },
      {
        "name": "MobileWebPlatform",
        "type": "https://schema.org/MobileWebPlatform",
        "description": "Represents the broad notion of 'mobile' browsers as a Web Platform."
      }
    ]
  },
  {
    "name": "DigitalProductPassport",
    "type": "https://schema.org/DigitalProductPassport",
    "source": "generated",
    "description": "A digital product passport (DPP), a record containing information about a product's lifecycle, sustainability, and compliance.",
    "parentTypes": [
      "https://schema.org/Certification"
    ]
  },
  {
    "name": "DisagreeAction",
    "type": "https://schema.org/DisagreeAction",
    "source": "generated",
    "description": "The act of expressing a difference of opinion with the object. An agent disagrees to/about an object (a proposition, topic or theme) with participants.",
    "parentTypes": [
      "https://schema.org/ReactAction"
    ]
  },
  {
    "name": "DiscoverAction",
    "type": "https://schema.org/DiscoverAction",
    "source": "generated",
    "description": "The act of discovering/finding an object.",
    "parentTypes": [
      "https://schema.org/FindAction"
    ]
  },
  {
    "name": "DiscussionForumPosting",
    "type": "https://schema.org/DiscussionForumPosting",
    "source": "generated",
    "description": "A posting to a discussion forum.",
    "parentTypes": [
      "https://schema.org/SocialMediaPosting"
    ]
  },
  {
    "name": "DislikeAction",
    "type": "https://schema.org/DislikeAction",
    "source": "generated",
    "description": "The act of expressing a negative sentiment about the object. An agent dislikes an object (a proposition, topic or theme) with participants.",
    "parentTypes": [
      "https://schema.org/ReactAction"
    ]
  },
  {
    "name": "Distance",
    "type": "https://schema.org/Distance",
    "source": "generated",
    "description": "Properties that take Distances as values are of the form '&lt;Number&gt; &lt;Length unit of measure&gt;'. E.g., '7 ft'.",
    "parentTypes": [
      "https://schema.org/Quantity"
    ]
  },
  {
    "name": "Distillery",
    "type": "https://schema.org/Distillery",
    "source": "generated",
    "description": "A distillery.",
    "parentTypes": [
      "https://schema.org/FoodEstablishment"
    ]
  },
  {
    "name": "Distribution",
    "type": "http://www.w3.org/ns/dcat#Distribution",
    "source": "generated"
  },
  {
    "name": "Document",
    "type": "https://spec.edmcouncil.org/fibo/ontology/FND/Arrangements/Documents/Document",
    "source": "generated"
  },
  {
    "name": "DonateAction",
    "type": "https://schema.org/DonateAction",
    "source": "generated",
    "description": "The act of providing goods, services, or money without compensation, often for philanthropic reasons.",
    "parentTypes": [
      "https://schema.org/TransferAction"
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
    "name": "DoseSchedule",
    "type": "https://schema.org/DoseSchedule",
    "source": "generated",
    "description": "A specific dosing schedule for a drug or supplement.",
    "parentTypes": [
      "https://schema.org/MedicalIntangible"
    ],
    "properties": [
      {
        "name": "doseUnit",
        "type": "https://schema.org/Text",
        "description": "The unit of the dose, e.g. 'mg'.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/DoseSchedule"
        ]
      },
      {
        "name": "doseValue",
        "type": [
          "https://schema.org/Number",
          "https://schema.org/QualitativeValue"
        ],
        "description": "The value of the dose, e.g. 500.",
        "expectedTypes": [
          "https://schema.org/Number",
          "https://schema.org/QualitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/Number",
          "https://schema.org/QualitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/DoseSchedule"
        ]
      },
      {
        "name": "frequency",
        "type": "https://schema.org/Text",
        "description": "How often the dose is taken, e.g. 'daily'.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/DoseSchedule"
        ]
      },
      {
        "name": "targetPopulation",
        "type": "https://schema.org/Text",
        "description": "Characteristics of the population for which this is intended, or which typically uses it, e.g. 'adults'.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/DietarySupplement",
          "https://schema.org/DoseSchedule"
        ]
      }
    ]
  },
  {
    "name": "DownloadAction",
    "type": "https://schema.org/DownloadAction",
    "source": "generated",
    "description": "The act of downloading an object.",
    "parentTypes": [
      "https://schema.org/TransferAction"
    ]
  },
  {
    "name": "DrawAction",
    "type": "https://schema.org/DrawAction",
    "source": "generated",
    "description": "The act of producing a visual/graphical representation of an object, typically with a pen/pencil and paper as instruments.",
    "parentTypes": [
      "https://schema.org/CreateAction"
    ]
  },
  {
    "name": "Drawing",
    "type": "https://schema.org/Drawing",
    "source": "generated",
    "description": "A picture or diagram made with a pencil, pen, or crayon rather than paint.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ]
  },
  {
    "name": "DrinkAction",
    "type": "https://schema.org/DrinkAction",
    "source": "generated",
    "description": "The act of swallowing liquids.",
    "parentTypes": [
      "https://schema.org/ConsumeAction"
    ]
  },
  {
    "name": "DriveWheelConfigurationValue",
    "type": "https://schema.org/DriveWheelConfigurationValue",
    "source": "generated",
    "description": "A value indicating which roadwheels will receive torque.",
    "parentTypes": [
      "https://schema.org/QualitativeValue"
    ],
    "enumerationValues": [
      {
        "name": "AllWheelDriveConfiguration",
        "type": "https://schema.org/AllWheelDriveConfiguration",
        "description": "All-wheel Drive is a transmission layout where the engine drives all four wheels."
      },
      {
        "name": "FourWheelDriveConfiguration",
        "type": "https://schema.org/FourWheelDriveConfiguration",
        "description": "Four-wheel drive is a transmission layout where the engine primarily drives two wheels with a part-time four-wheel drive capability."
      },
      {
        "name": "FrontWheelDriveConfiguration",
        "type": "https://schema.org/FrontWheelDriveConfiguration",
        "description": "Front-wheel drive is a transmission layout where the engine drives the front wheels."
      },
      {
        "name": "RearWheelDriveConfiguration",
        "type": "https://schema.org/RearWheelDriveConfiguration",
        "description": "Real-wheel drive is a transmission layout where the engine drives the rear wheels."
      }
    ]
  },
  {
    "name": "Drug",
    "type": "https://schema.org/Drug",
    "source": "generated",
    "description": "A chemical or biologic substance, used as a medical therapy, that has a physiological effect on an organism. Here the term drug is used interchangeably with the term medicine although clinical knowledge makes a clear difference between them.",
    "parentTypes": [
      "https://schema.org/Product",
      "https://schema.org/Substance"
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
        "name": "administrationRoute",
        "type": "https://schema.org/Text",
        "description": "A route by which this drug may be administered, e.g. 'oral'.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Drug"
        ]
      },
      {
        "name": "alcoholWarning",
        "type": "https://schema.org/Text",
        "description": "Any precaution, guidance, contraindication, etc. related to consumption of alcohol while taking this drug.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Drug"
        ]
      },
      {
        "name": "availableStrength",
        "type": "https://schema.org/DrugStrength",
        "description": "An available dosage strength for the drug.",
        "expectedTypes": [
          "https://schema.org/DrugStrength"
        ],
        "rangeTypes": [
          "https://schema.org/DrugStrength"
        ],
        "domainTypes": [
          "https://schema.org/Drug"
        ]
      },
      {
        "name": "breastfeedingWarning",
        "type": "https://schema.org/Text",
        "description": "Any precaution, guidance, contraindication, etc. related to this drug's use by breastfeeding mothers.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Drug"
        ]
      },
      {
        "name": "clincalPharmacology",
        "type": "https://schema.org/Text",
        "description": "Description of the absorption and elimination of drugs, including their concentration (pharmacokinetics, pK) and biological effects (pharmacodynamics, pD).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Drug"
        ],
        "supersededBy": "https://schema.org/clinicalPharmacology"
      },
      {
        "name": "clinicalPharmacology",
        "type": "https://schema.org/Text",
        "description": "Description of the absorption and elimination of drugs, including their concentration (pharmacokinetics, pK) and biological effects (pharmacodynamics, pD).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Drug"
        ]
      },
      {
        "name": "dosageForm",
        "type": "https://schema.org/Text",
        "description": "A dosage form in which this drug/supplement is available, e.g. 'tablet', 'suspension', 'injection'.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Drug"
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
        "name": "drugClass",
        "type": "https://schema.org/DrugClass",
        "description": "The class of drug this belongs to (e.g., statins).",
        "expectedTypes": [
          "https://schema.org/DrugClass"
        ],
        "rangeTypes": [
          "https://schema.org/DrugClass"
        ],
        "domainTypes": [
          "https://schema.org/Drug"
        ]
      },
      {
        "name": "drugUnit",
        "type": "https://schema.org/Text",
        "description": "The unit in which the drug is measured, e.g. '5 mg tablet'.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Drug",
          "https://schema.org/DrugCost"
        ]
      },
      {
        "name": "foodWarning",
        "type": "https://schema.org/Text",
        "description": "Any precaution, guidance, contraindication, etc. related to consumption of specific foods while taking this drug.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Drug"
        ]
      },
      {
        "name": "includedInHealthInsurancePlan",
        "type": "https://schema.org/HealthInsurancePlan",
        "description": "The insurance plans that cover this drug.",
        "expectedTypes": [
          "https://schema.org/HealthInsurancePlan"
        ],
        "rangeTypes": [
          "https://schema.org/HealthInsurancePlan"
        ],
        "domainTypes": [
          "https://schema.org/Drug"
        ]
      },
      {
        "name": "interactingDrug",
        "type": "https://schema.org/Drug",
        "description": "Another drug that is known to interact with this drug in a way that impacts the effect of this drug or causes a risk to the patient. Note: disease interactions are typically captured as contraindications.",
        "expectedTypes": [
          "https://schema.org/Drug"
        ],
        "rangeTypes": [
          "https://schema.org/Drug"
        ],
        "domainTypes": [
          "https://schema.org/Drug"
        ]
      },
      {
        "name": "isAvailableGenerically",
        "type": "https://schema.org/Boolean",
        "description": "True if the drug is available in a generic form (regardless of name).",
        "expectedTypes": [
          "https://schema.org/Boolean"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean"
        ],
        "domainTypes": [
          "https://schema.org/Drug"
        ]
      },
      {
        "name": "isProprietary",
        "type": "https://schema.org/Boolean",
        "description": "True if this item's name is a proprietary/brand name (vs. generic name).",
        "expectedTypes": [
          "https://schema.org/Boolean"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean"
        ],
        "domainTypes": [
          "https://schema.org/DietarySupplement",
          "https://schema.org/Drug"
        ]
      },
      {
        "name": "labelDetails",
        "type": "https://schema.org/URL",
        "description": "Link to the drug's label details.",
        "expectedTypes": [
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Drug"
        ]
      },
      {
        "name": "legalStatus",
        "type": [
          "https://schema.org/DrugLegalStatus",
          "https://schema.org/MedicalEnumeration",
          "https://schema.org/Text"
        ],
        "description": "The drug or supplement's legal status, including any controlled substance schedules that apply.",
        "expectedTypes": [
          "https://schema.org/DrugLegalStatus",
          "https://schema.org/MedicalEnumeration",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/DrugLegalStatus",
          "https://schema.org/MedicalEnumeration",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/DietarySupplement",
          "https://schema.org/Drug",
          "https://schema.org/MedicalEntity"
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
      },
      {
        "name": "mechanismOfAction",
        "type": "https://schema.org/Text",
        "description": "The specific biochemical interaction through which this drug or supplement produces its pharmacological effect.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/DietarySupplement",
          "https://schema.org/Drug"
        ]
      },
      {
        "name": "nonProprietaryName",
        "type": "https://schema.org/Text",
        "description": "The generic name of this drug or supplement.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/DietarySupplement",
          "https://schema.org/Drug"
        ]
      },
      {
        "name": "overdosage",
        "type": "https://schema.org/Text",
        "description": "Any information related to overdose on a drug, including signs or symptoms, treatments, contact information for emergency response.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Drug"
        ]
      },
      {
        "name": "pregnancyCategory",
        "type": "https://schema.org/DrugPregnancyCategory",
        "description": "Pregnancy category of this drug.",
        "expectedTypes": [
          "https://schema.org/DrugPregnancyCategory"
        ],
        "rangeTypes": [
          "https://schema.org/DrugPregnancyCategory"
        ],
        "domainTypes": [
          "https://schema.org/Drug"
        ]
      },
      {
        "name": "pregnancyWarning",
        "type": "https://schema.org/Text",
        "description": "Any precaution, guidance, contraindication, etc. related to this drug's use during pregnancy.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Drug"
        ]
      },
      {
        "name": "prescribingInfo",
        "type": "https://schema.org/URL",
        "description": "Link to prescribing information for the drug.",
        "expectedTypes": [
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Drug"
        ]
      },
      {
        "name": "prescriptionStatus",
        "type": [
          "https://schema.org/DrugPrescriptionStatus",
          "https://schema.org/Text"
        ],
        "description": "Indicates the status of drug prescription, e.g. local catalogs classifications or whether the drug is available by prescription or over-the-counter, etc.",
        "expectedTypes": [
          "https://schema.org/DrugPrescriptionStatus",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/DrugPrescriptionStatus",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Drug"
        ]
      },
      {
        "name": "proprietaryName",
        "type": "https://schema.org/Text",
        "description": "Proprietary name given to the diet plan, typically by its originator or creator.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/DietarySupplement",
          "https://schema.org/Drug"
        ]
      },
      {
        "name": "relatedDrug",
        "type": "https://schema.org/Drug",
        "description": "Any other drug related to this one, for example commonly-prescribed alternatives.",
        "expectedTypes": [
          "https://schema.org/Drug"
        ],
        "rangeTypes": [
          "https://schema.org/Drug"
        ],
        "domainTypes": [
          "https://schema.org/Drug"
        ]
      },
      {
        "name": "rxcui",
        "type": "https://schema.org/Text",
        "description": "The RxCUI drug identifier from RXNORM.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Drug"
        ]
      },
      {
        "name": "warning",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "Any FDA or other warnings about the drug (text or URL).",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Drug"
        ]
      }
    ]
  },
  {
    "name": "DrugClass",
    "type": "https://schema.org/DrugClass",
    "source": "generated",
    "description": "A class of medical drugs, e.g., statins. Classes can represent general pharmacological class, common mechanisms of action, common physiological effects, etc.",
    "parentTypes": [
      "https://schema.org/MedicalEntity"
    ],
    "properties": [
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
    "name": "DrugCost",
    "type": "https://schema.org/DrugCost",
    "source": "generated",
    "description": "The cost per unit of a medical drug. Note that this type is not meant to represent the price in an offer of a drug for sale; see the Offer type for that. This type will typically be used to tag wholesale or average retail cost of a drug, or maximum reimbursable cost. Costs of medical drugs vary widely depending on how and where they are paid for, so while this type captures some of the variables, costs should be used with caution by consumers of this schema's markup.",
    "parentTypes": [
      "https://schema.org/MedicalEntity"
    ],
    "properties": [
      {
        "name": "applicableLocation",
        "type": "https://schema.org/AdministrativeArea",
        "description": "The location in which the status applies.",
        "expectedTypes": [
          "https://schema.org/AdministrativeArea"
        ],
        "rangeTypes": [
          "https://schema.org/AdministrativeArea"
        ],
        "domainTypes": [
          "https://schema.org/DrugCost",
          "https://schema.org/DrugLegalStatus"
        ]
      },
      {
        "name": "costCategory",
        "type": "https://schema.org/DrugCostCategory",
        "description": "The category of cost, such as wholesale, retail, reimbursement cap, etc.",
        "expectedTypes": [
          "https://schema.org/DrugCostCategory"
        ],
        "rangeTypes": [
          "https://schema.org/DrugCostCategory"
        ],
        "domainTypes": [
          "https://schema.org/DrugCost"
        ]
      },
      {
        "name": "costCurrency",
        "type": "https://schema.org/Text",
        "description": "The currency (in 3-letter) of the drug cost. See: http://en.wikipedia.org/wiki/ISO_4217. ",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/DrugCost"
        ]
      },
      {
        "name": "costOrigin",
        "type": "https://schema.org/Text",
        "description": "Additional details to capture the origin of the cost data. For example, 'Medicare Part B'.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/DrugCost"
        ]
      },
      {
        "name": "costPerUnit",
        "type": [
          "https://schema.org/Number",
          "https://schema.org/QualitativeValue",
          "https://schema.org/Text"
        ],
        "description": "The cost per unit of the drug.",
        "expectedTypes": [
          "https://schema.org/Number",
          "https://schema.org/QualitativeValue",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Number",
          "https://schema.org/QualitativeValue",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/DrugCost"
        ]
      },
      {
        "name": "drugUnit",
        "type": "https://schema.org/Text",
        "description": "The unit in which the drug is measured, e.g. '5 mg tablet'.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Drug",
          "https://schema.org/DrugCost"
        ]
      }
    ]
  },
  {
    "name": "DrugCostCategory",
    "type": "https://schema.org/DrugCostCategory",
    "source": "generated",
    "description": "Enumerated categories of medical drug costs.",
    "parentTypes": [
      "https://schema.org/MedicalEnumeration"
    ],
    "enumerationValues": [
      {
        "name": "ReimbursementCap",
        "type": "https://schema.org/ReimbursementCap",
        "description": "The drug's cost represents the maximum reimbursement paid by an insurer for the drug."
      },
      {
        "name": "Retail",
        "type": "https://schema.org/Retail",
        "description": "The drug's cost represents the retail cost of the drug."
      },
      {
        "name": "Wholesale",
        "type": "https://schema.org/Wholesale",
        "description": "The drug's cost represents the wholesale acquisition cost of the drug."
      }
    ]
  },
  {
    "name": "DrugLegalStatus",
    "type": "https://schema.org/DrugLegalStatus",
    "source": "generated",
    "description": "The legal availability status of a medical drug.",
    "parentTypes": [
      "https://schema.org/MedicalIntangible"
    ],
    "properties": [
      {
        "name": "applicableLocation",
        "type": "https://schema.org/AdministrativeArea",
        "description": "The location in which the status applies.",
        "expectedTypes": [
          "https://schema.org/AdministrativeArea"
        ],
        "rangeTypes": [
          "https://schema.org/AdministrativeArea"
        ],
        "domainTypes": [
          "https://schema.org/DrugCost",
          "https://schema.org/DrugLegalStatus"
        ]
      }
    ]
  },
  {
    "name": "DrugPregnancyCategory",
    "type": "https://schema.org/DrugPregnancyCategory",
    "source": "generated",
    "description": "Categories that represent an assessment of the risk of fetal injury due to a drug or pharmaceutical used as directed by the mother during pregnancy.",
    "parentTypes": [
      "https://schema.org/MedicalEnumeration"
    ],
    "enumerationValues": [
      {
        "name": "FDAcategoryA",
        "type": "https://schema.org/FDAcategoryA",
        "description": "A designation by the US FDA signifying that adequate and well-controlled studies have failed to demonstrate a risk to the fetus in the first trimester of pregnancy (and there is no evidence of risk in later trimesters)."
      },
      {
        "name": "FDAcategoryB",
        "type": "https://schema.org/FDAcategoryB",
        "description": "A designation by the US FDA signifying that animal reproduction studies have failed to demonstrate a risk to the fetus and there are no adequate and well-controlled studies in pregnant women."
      },
      {
        "name": "FDAcategoryC",
        "type": "https://schema.org/FDAcategoryC",
        "description": "A designation by the US FDA signifying that animal reproduction studies have shown an adverse effect on the fetus and there are no adequate and well-controlled studies in humans, but potential benefits may warrant use of the drug in pregnant women despite potential risks."
      },
      {
        "name": "FDAcategoryD",
        "type": "https://schema.org/FDAcategoryD",
        "description": "A designation by the US FDA signifying that there is positive evidence of human fetal risk based on adverse reaction data from investigational or marketing experience or studies in humans, but potential benefits may warrant use of the drug in pregnant women despite potential risks."
      },
      {
        "name": "FDAcategoryX",
        "type": "https://schema.org/FDAcategoryX",
        "description": "A designation by the US FDA signifying that studies in animals or humans have demonstrated fetal abnormalities and/or there is positive evidence of human fetal risk based on adverse reaction data from investigational or marketing experience, and the risks involved in use of the drug in pregnant women clearly outweigh potential benefits."
      },
      {
        "name": "FDAnotEvaluated",
        "type": "https://schema.org/FDAnotEvaluated",
        "description": "A designation that the drug in question has not been assigned a pregnancy category designation by the US FDA."
      }
    ]
  },
  {
    "name": "DrugPrescriptionStatus",
    "type": "https://schema.org/DrugPrescriptionStatus",
    "source": "generated",
    "description": "Indicates whether this drug is available by prescription or over-the-counter.",
    "parentTypes": [
      "https://schema.org/MedicalEnumeration"
    ],
    "enumerationValues": [
      {
        "name": "OTC",
        "type": "https://schema.org/OTC",
        "description": "The character of a medical substance, typically a medicine, of being available over the counter or not."
      },
      {
        "name": "PrescriptionOnly",
        "type": "https://schema.org/PrescriptionOnly",
        "description": "Available by prescription only."
      }
    ]
  },
  {
    "name": "DrugStrength",
    "type": "https://schema.org/DrugStrength",
    "source": "generated",
    "description": "A specific strength in which a medical drug is available in a specific country.",
    "parentTypes": [
      "https://schema.org/MedicalIntangible"
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
        "name": "availableIn",
        "type": "https://schema.org/AdministrativeArea",
        "description": "The location in which the strength is available.",
        "expectedTypes": [
          "https://schema.org/AdministrativeArea"
        ],
        "rangeTypes": [
          "https://schema.org/AdministrativeArea"
        ],
        "domainTypes": [
          "https://schema.org/DrugStrength"
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
      },
      {
        "name": "strengthUnit",
        "type": "https://schema.org/Text",
        "description": "The units of an active ingredient's strength, e.g. mg.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/DrugStrength"
        ]
      },
      {
        "name": "strengthValue",
        "type": "https://schema.org/Number",
        "description": "The value of an active ingredient's strength, e.g. 325.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/DrugStrength"
        ]
      }
    ]
  },
  {
    "name": "DryCleaningOrLaundry",
    "type": "https://schema.org/DryCleaningOrLaundry",
    "source": "generated",
    "description": "A dry-cleaning business.",
    "parentTypes": [
      "https://schema.org/LocalBusiness"
    ]
  },
  {
    "name": "Duration",
    "type": "https://www.omg.org/spec/Commons/DatesAndTimes/Duration",
    "source": "generated"
  },
  {
    "name": "Duration",
    "type": "https://schema.org/Duration",
    "source": "generated",
    "description": "Quantity: Duration (use [ISO 8601 duration format](http://en.wikipedia.org/wiki/ISO_8601)).",
    "parentTypes": [
      "https://schema.org/Quantity"
    ]
  },
  {
    "name": "EatAction",
    "type": "https://schema.org/EatAction",
    "source": "generated",
    "description": "The act of swallowing solid objects.",
    "parentTypes": [
      "https://schema.org/ConsumeAction"
    ]
  },
  {
    "name": "EducationalAudience",
    "type": "https://schema.org/EducationalAudience",
    "source": "generated",
    "description": "An EducationalAudience.",
    "parentTypes": [
      "https://schema.org/Audience"
    ],
    "properties": [
      {
        "name": "educationalRole",
        "type": "https://schema.org/Text",
        "description": "An educationalRole of an EducationalAudience.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/EducationalAudience"
        ]
      }
    ]
  },
  {
    "name": "EducationalOccupationalCredential",
    "type": "https://schema.org/EducationalOccupationalCredential",
    "source": "generated",
    "description": "An educational or occupational credential. A diploma, academic degree, certification, qualification, badge, etc., that may be awarded to a person or other entity that meets the requirements defined by the credentialer.",
    "parentTypes": [
      "https://schema.org/Credential"
    ],
    "properties": [
      {
        "name": "competencyRequired",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "Knowledge, skill, ability or personal attribute that must be demonstrated by a person or other entity in order to do something such as earn an Educational Occupational Credential or understand a LearningResource.",
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
          "https://schema.org/EducationalOccupationalCredential",
          "https://schema.org/LearningResource"
        ]
      },
      {
        "name": "educationalLevel",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "The level in terms of progression through an educational or training context. Examples of educational levels include 'beginner', 'intermediate' or 'advanced', and formal sets of level indicators.",
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
          "https://schema.org/EducationalOccupationalCredential",
          "https://schema.org/EducationEvent",
          "https://schema.org/LearningResource"
        ]
      }
    ]
  },
  {
    "name": "EducationalOccupationalProgram",
    "type": "https://schema.org/EducationalOccupationalProgram",
    "source": "generated",
    "description": "A program offered by an institution which determines the learning progress to achieve an outcome, usually a credential like a degree or certificate. This would define a discrete set of opportunities (e.g., job, courses) that together constitute a program with a clear start, end, set of requirements, and transition to a new occupational opportunity (e.g., a job), or sometimes a higher educational opportunity (e.g., an advanced degree).",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "applicationDeadline",
        "type": [
          "https://schema.org/Date",
          "https://schema.org/Text"
        ],
        "description": "The date on which the program stops collecting applications for the next enrollment cycle. Flexible application deadlines (for example, a program with rolling admissions) can be described in a textual string, rather than as a DateTime.",
        "expectedTypes": [
          "https://schema.org/Date",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Date",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/EducationalOccupationalProgram"
        ]
      },
      {
        "name": "applicationStartDate",
        "type": "https://schema.org/Date",
        "description": "The date at which the program begins collecting applications for the next enrollment cycle.",
        "expectedTypes": [
          "https://schema.org/Date"
        ],
        "rangeTypes": [
          "https://schema.org/Date"
        ],
        "domainTypes": [
          "https://schema.org/EducationalOccupationalProgram"
        ]
      },
      {
        "name": "dayOfWeek",
        "type": "https://schema.org/DayOfWeek",
        "description": "The day of the week for which these opening hours are valid.",
        "expectedTypes": [
          "https://schema.org/DayOfWeek"
        ],
        "rangeTypes": [
          "https://schema.org/DayOfWeek"
        ],
        "domainTypes": [
          "https://schema.org/EducationalOccupationalProgram",
          "https://schema.org/OpeningHoursSpecification"
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
        "name": "educationalProgramMode",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "Similar to courseMode, the medium or means of delivery of the program as a whole. The value may either be a text label (e.g. \"online\", \"onsite\" or \"blended\"; \"synchronous\" or \"asynchronous\"; \"full-time\" or \"part-time\") or a URL reference to a term from a controlled vocabulary (e.g. https://ceds.ed.gov/element/001311#Asynchronous ).",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/EducationalOccupationalProgram"
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
        "name": "hasCourse",
        "type": "https://schema.org/Course",
        "description": "A course or class that is one of the learning opportunities that constitute an educational / occupational program. No information is implied about whether the course is mandatory or optional; no guarantee is implied about whether the course will be available to everyone on the program.",
        "expectedTypes": [
          "https://schema.org/Course"
        ],
        "rangeTypes": [
          "https://schema.org/Course"
        ],
        "domainTypes": [
          "https://schema.org/EducationalOccupationalProgram"
        ]
      },
      {
        "name": "maximumEnrollment",
        "type": "https://schema.org/Integer",
        "description": "The maximum number of students who may be enrolled in the program.",
        "expectedTypes": [
          "https://schema.org/Integer"
        ],
        "rangeTypes": [
          "https://schema.org/Integer"
        ],
        "domainTypes": [
          "https://schema.org/EducationalOccupationalProgram"
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
        "name": "programPrerequisites",
        "type": [
          "https://schema.org/AlignmentObject",
          "https://schema.org/Course",
          "https://schema.org/EducationalOccupationalCredential",
          "https://schema.org/Text"
        ],
        "description": "Prerequisites for enrolling in the program.",
        "expectedTypes": [
          "https://schema.org/AlignmentObject",
          "https://schema.org/Course",
          "https://schema.org/EducationalOccupationalCredential",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/AlignmentObject",
          "https://schema.org/Course",
          "https://schema.org/EducationalOccupationalCredential",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/EducationalOccupationalProgram"
        ]
      },
      {
        "name": "programType",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text"
        ],
        "description": "The type of educational or occupational program. For example, classroom, internship, alternance, etc.",
        "expectedTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/EducationalOccupationalProgram"
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
        "name": "salaryUponCompletion",
        "type": "https://schema.org/MonetaryAmountDistribution",
        "description": "The expected salary upon completing the training.",
        "expectedTypes": [
          "https://schema.org/MonetaryAmountDistribution"
        ],
        "rangeTypes": [
          "https://schema.org/MonetaryAmountDistribution"
        ],
        "domainTypes": [
          "https://schema.org/EducationalOccupationalProgram"
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
        "name": "termDuration",
        "type": "https://schema.org/Duration",
        "description": "The amount of time in a term as defined by the institution. A term is a length of time where students take one or more classes. Semesters and quarters are common units for term.",
        "expectedTypes": [
          "https://schema.org/Duration"
        ],
        "rangeTypes": [
          "https://schema.org/Duration"
        ],
        "domainTypes": [
          "https://schema.org/EducationalOccupationalProgram"
        ]
      },
      {
        "name": "termsPerYear",
        "type": "https://schema.org/Number",
        "description": "The number of times terms of study are offered per year. Semesters and quarters are common units for term. For example, if the student can only take 2 semesters for the program in one year, then termsPerYear should be 2.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/EducationalOccupationalProgram"
        ]
      },
      {
        "name": "timeOfDay",
        "type": "https://schema.org/Text",
        "description": "The time of day the program normally runs. For example, \"evenings\".",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/EducationalOccupationalProgram"
        ]
      },
      {
        "name": "timeToComplete",
        "type": "https://schema.org/Duration",
        "description": "The expected length of time to complete the program if attending full-time.",
        "expectedTypes": [
          "https://schema.org/Duration"
        ],
        "rangeTypes": [
          "https://schema.org/Duration"
        ],
        "domainTypes": [
          "https://schema.org/EducationalOccupationalProgram"
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
      },
      {
        "name": "typicalCreditsPerTerm",
        "type": [
          "https://schema.org/Integer",
          "https://schema.org/StructuredValue"
        ],
        "description": "The number of credits or units a full-time student would be expected to take in 1 term however 'term' is defined by the institution.",
        "expectedTypes": [
          "https://schema.org/Integer",
          "https://schema.org/StructuredValue"
        ],
        "rangeTypes": [
          "https://schema.org/Integer",
          "https://schema.org/StructuredValue"
        ],
        "domainTypes": [
          "https://schema.org/EducationalOccupationalProgram"
        ]
      }
    ]
  },
  {
    "name": "EducationalOrganization",
    "type": "https://schema.org/EducationalOrganization",
    "source": "generated",
    "description": "An educational organization.",
    "parentTypes": [
      "https://schema.org/CivicStructure",
      "https://schema.org/Organization"
    ],
    "properties": [
      {
        "name": "alumni",
        "type": "https://schema.org/Person",
        "description": "Alumni of an organization.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/EducationalOrganization",
          "https://schema.org/Organization"
        ],
        "inverseOf": "https://schema.org/alumniOf"
      }
    ]
  },
  {
    "name": "EducationEvent",
    "type": "https://schema.org/EducationEvent",
    "source": "generated",
    "description": "Event type: Education event.",
    "parentTypes": [
      "https://schema.org/Event"
    ],
    "properties": [
      {
        "name": "assesses",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text"
        ],
        "description": "The item being described is intended to assess the competency or learning outcome defined by the referenced term.",
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
          "https://schema.org/EducationEvent",
          "https://schema.org/LearningResource"
        ]
      },
      {
        "name": "educationalLevel",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "The level in terms of progression through an educational or training context. Examples of educational levels include 'beginner', 'intermediate' or 'advanced', and formal sets of level indicators.",
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
          "https://schema.org/EducationalOccupationalCredential",
          "https://schema.org/EducationEvent",
          "https://schema.org/LearningResource"
        ]
      },
      {
        "name": "teaches",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text"
        ],
        "description": "The item being described is intended to help a person learn the competency or learning outcome defined by the referenced term.",
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
          "https://schema.org/EducationEvent",
          "https://schema.org/LearningResource"
        ]
      }
    ]
  },
  {
    "name": "Electrician",
    "type": "https://schema.org/Electrician",
    "source": "generated",
    "description": "An electrician.",
    "parentTypes": [
      "https://schema.org/HomeAndConstructionBusiness"
    ]
  },
  {
    "name": "ElectronicDocument",
    "type": "http://unece.org/vocab#ElectronicDocument",
    "source": "generated"
  },
  {
    "name": "ElectronicsStore",
    "type": "https://schema.org/ElectronicsStore",
    "source": "generated",
    "description": "An electronics store.",
    "parentTypes": [
      "https://schema.org/Store"
    ]
  },
  {
    "name": "ElementarySchool",
    "type": "https://schema.org/ElementarySchool",
    "source": "generated",
    "description": "An elementary school.",
    "parentTypes": [
      "https://schema.org/EducationalOrganization"
    ]
  },
  {
    "name": "EmailMessage",
    "type": "https://schema.org/EmailMessage",
    "source": "generated",
    "description": "An email message.",
    "parentTypes": [
      "https://schema.org/Message"
    ]
  },
  {
    "name": "Embassy",
    "type": "https://schema.org/Embassy",
    "source": "generated",
    "description": "An embassy.",
    "parentTypes": [
      "https://schema.org/GovernmentBuilding"
    ]
  },
  {
    "name": "EmergencyService",
    "type": "https://schema.org/EmergencyService",
    "source": "generated",
    "description": "An emergency service, such as a fire station or ER.",
    "parentTypes": [
      "https://schema.org/LocalBusiness"
    ]
  },
  {
    "name": "EmployeeRole",
    "type": "https://schema.org/EmployeeRole",
    "source": "generated",
    "description": "A subclass of OrganizationRole used to describe employee relationships.",
    "parentTypes": [
      "https://schema.org/OrganizationRole"
    ],
    "properties": [
      {
        "name": "baseSalary",
        "type": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/Number",
          "https://schema.org/PriceSpecification"
        ],
        "description": "The base salary of the job or of an employee in an EmployeeRole.",
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
          "https://schema.org/EmployeeRole",
          "https://schema.org/JobPosting"
        ]
      },
      {
        "name": "salaryCurrency",
        "type": "https://schema.org/Text",
        "description": "The currency (coded using [ISO 4217](http://en.wikipedia.org/wiki/ISO_4217)) used for the main salary information in this job posting or for this employee.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/EmployeeRole",
          "https://schema.org/JobPosting"
        ]
      }
    ]
  },
  {
    "name": "EmployerAggregateRating",
    "type": "https://schema.org/EmployerAggregateRating",
    "source": "generated",
    "description": "An aggregate rating of an Organization related to its role as an employer.",
    "parentTypes": [
      "https://schema.org/AggregateRating"
    ]
  },
  {
    "name": "EmployerReview",
    "type": "https://schema.org/EmployerReview",
    "source": "generated",
    "description": "An [[EmployerReview]] is a review of an [[Organization]] regarding its role as an employer, written by a current or former employee of that organization.",
    "parentTypes": [
      "https://schema.org/Review"
    ]
  },
  {
    "name": "EmploymentAgency",
    "type": "https://schema.org/EmploymentAgency",
    "source": "generated",
    "description": "An employment agency.",
    "parentTypes": [
      "https://schema.org/LocalBusiness"
    ]
  },
  {
    "name": "EndorseAction",
    "type": "https://schema.org/EndorseAction",
    "source": "generated",
    "description": "An agent approves/certifies/likes/supports/sanctions an object.",
    "parentTypes": [
      "https://schema.org/ReactAction"
    ],
    "properties": [
      {
        "name": "endorsee",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "A sub property of participant. The person/organization being supported.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/EndorseAction"
        ]
      }
    ]
  },
  {
    "name": "EndorsementRating",
    "type": "https://schema.org/EndorsementRating",
    "source": "generated",
    "description": "An EndorsementRating is a rating that expresses some level of endorsement, for example inclusion in a \"critic's pick\" blog, a\n\"Like\" or \"+1\" on a social network. It can be considered the [[result]] of an [[EndorseAction]] in which the [[object]] of the action is rated positively by\nsome [[agent]]. As is common elsewhere in schema.org, it is sometimes more useful to describe the results of such an action without explicitly describing the [[Action]].\n\nAn [[EndorsementRating]] may be part of a numeric scale or organized system, but this is not required: having an explicit type for indicating a positive,\nendorsement rating is particularly useful in the absence of numeric scales as it helps consumers understand that the rating is broadly positive.\n",
    "parentTypes": [
      "https://schema.org/Rating"
    ]
  },
  {
    "name": "Energy",
    "type": "https://schema.org/Energy",
    "source": "generated",
    "description": "Properties that take Energy as values are of the form '&lt;Number&gt; &lt;Energy unit of measure&gt;'.",
    "parentTypes": [
      "https://schema.org/Quantity"
    ]
  },
  {
    "name": "EnergyConsumptionDetails",
    "type": "https://schema.org/EnergyConsumptionDetails",
    "source": "generated",
    "description": "EnergyConsumptionDetails represents information related to the energy efficiency of a product that consumes energy. The information that can be provided is based on international regulations such as for example [EU directive 2017/1369](https://eur-lex.europa.eu/eli/reg/2017/1369/oj) for energy labeling and the [Energy labeling rule](https://www.ftc.gov/enforcement/rules/rulemaking-regulatory-reform-proceedings/energy-water-use-labeling-consumer) under the Energy Policy and Conservation Act (EPCA) in the US.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "energyEfficiencyScaleMax",
        "type": "https://schema.org/EUEnergyEfficiencyEnumeration",
        "description": "Specifies the most energy efficient class on the regulated EU energy consumption scale for the product category a product belongs to. For example, energy consumption for televisions placed on the market after January 1, 2020 is scaled from D to A+++.",
        "expectedTypes": [
          "https://schema.org/EUEnergyEfficiencyEnumeration"
        ],
        "rangeTypes": [
          "https://schema.org/EUEnergyEfficiencyEnumeration"
        ],
        "domainTypes": [
          "https://schema.org/EnergyConsumptionDetails"
        ]
      },
      {
        "name": "energyEfficiencyScaleMin",
        "type": "https://schema.org/EUEnergyEfficiencyEnumeration",
        "description": "Specifies the least energy efficient class on the regulated EU energy consumption scale for the product category a product belongs to. For example, energy consumption for televisions placed on the market after January 1, 2020 is scaled from D to A+++.",
        "expectedTypes": [
          "https://schema.org/EUEnergyEfficiencyEnumeration"
        ],
        "rangeTypes": [
          "https://schema.org/EUEnergyEfficiencyEnumeration"
        ],
        "domainTypes": [
          "https://schema.org/EnergyConsumptionDetails"
        ]
      },
      {
        "name": "hasEnergyEfficiencyCategory",
        "type": "https://schema.org/EnergyEfficiencyEnumeration",
        "description": "Defines the energy efficiency Category (which could be either a rating out of range of values or a yes/no certification) for a product according to an international energy efficiency standard.",
        "expectedTypes": [
          "https://schema.org/EnergyEfficiencyEnumeration"
        ],
        "rangeTypes": [
          "https://schema.org/EnergyEfficiencyEnumeration"
        ],
        "domainTypes": [
          "https://schema.org/EnergyConsumptionDetails"
        ]
      }
    ]
  },
  {
    "name": "EnergyEfficiencyEnumeration",
    "type": "https://schema.org/EnergyEfficiencyEnumeration",
    "source": "generated",
    "description": "Enumerates energy efficiency levels (also known as \"classes\" or \"ratings\") and certifications that are part of several international energy efficiency standards.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ]
  },
  {
    "name": "EnergyStarEnergyEfficiencyEnumeration",
    "type": "https://schema.org/EnergyStarEnergyEfficiencyEnumeration",
    "source": "generated",
    "description": "Used to indicate whether a product is EnergyStar certified.",
    "parentTypes": [
      "https://schema.org/EnergyEfficiencyEnumeration"
    ],
    "enumerationValues": [
      {
        "name": "EnergyStarCertified",
        "type": "https://schema.org/EnergyStarCertified",
        "description": "Represents EnergyStar certification."
      }
    ]
  },
  {
    "name": "EngineSpecification",
    "type": "https://schema.org/EngineSpecification",
    "source": "generated",
    "description": "Information about the engine of the vehicle. A vehicle can have multiple engines represented by multiple engine specification entities.",
    "parentTypes": [
      "https://schema.org/StructuredValue"
    ],
    "properties": [
      {
        "name": "engineDisplacement",
        "type": "https://schema.org/QuantitativeValue",
        "description": "The volume swept by all of the pistons inside the cylinders of an internal combustion engine in a single movement. \\n\\nTypical unit code(s): CMQ for cubic centimeter, LTR for liters, INQ for cubic inches\\n* Note 1: You can link to information about how the given value has been determined using the [[valueReference]] property.\\n* Note 2: You can use [[minValue]] and [[maxValue]] to indicate ranges.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/EngineSpecification"
        ]
      },
      {
        "name": "enginePower",
        "type": "https://schema.org/QuantitativeValue",
        "description": "The power of the vehicle's engine.\n    Typical unit code(s): KWT for kilowatt, BHP for brake horsepower, N12 for metric horsepower (PS, with 1 PS = 735,49875 W)\\n\\n* Note 1: There are many different ways of measuring an engine's power. For an overview, see  [http://en.wikipedia.org/wiki/Horsepower#Engine\\_power\\_test\\_codes](http://en.wikipedia.org/wiki/Horsepower#Engine_power_test_codes).\\n* Note 2: You can link to information about how the given value has been determined using the [[valueReference]] property.\\n* Note 3: You can use [[minValue]] and [[maxValue]] to indicate ranges.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/EngineSpecification"
        ]
      },
      {
        "name": "engineType",
        "type": [
          "https://schema.org/QualitativeValue",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "The type of engine or engines powering the vehicle.",
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
          "https://schema.org/EngineSpecification"
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
        "name": "torque",
        "type": "https://schema.org/QuantitativeValue",
        "description": "The torque (turning force) of the vehicle's engine.\\n\\nTypical unit code(s): NU for newton metre (N m), F17 for pound-force per foot, or F48 for pound-force per inch\\n\\n* Note 1: You can link to information about how the given value has been determined (e.g. reference RPM) using the [[valueReference]] property.\\n* Note 2: You can use [[minValue]] and [[maxValue]] to indicate ranges.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/EngineSpecification"
        ]
      }
    ]
  },
  {
    "name": "EntertainmentBusiness",
    "type": "https://schema.org/EntertainmentBusiness",
    "source": "generated",
    "description": "A business providing entertainment.",
    "parentTypes": [
      "https://schema.org/LocalBusiness"
    ]
  },
  {
    "name": "EntryPoint",
    "type": "https://schema.org/EntryPoint",
    "source": "generated",
    "description": "An entry point, within some Web-based protocol.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "actionApplication",
        "type": "https://schema.org/SoftwareApplication",
        "description": "An application that can complete the request.",
        "expectedTypes": [
          "https://schema.org/SoftwareApplication"
        ],
        "rangeTypes": [
          "https://schema.org/SoftwareApplication"
        ],
        "domainTypes": [
          "https://schema.org/EntryPoint"
        ]
      },
      {
        "name": "actionPlatform",
        "type": [
          "https://schema.org/DigitalPlatformEnumeration",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "The high level platform(s) where the Action can be performed for the given URL. To specify a specific application or operating system instance, use actionApplication.",
        "expectedTypes": [
          "https://schema.org/DigitalPlatformEnumeration",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/DigitalPlatformEnumeration",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/EntryPoint"
        ]
      },
      {
        "name": "application",
        "type": "https://schema.org/SoftwareApplication",
        "description": "An application that can complete the request.",
        "expectedTypes": [
          "https://schema.org/SoftwareApplication"
        ],
        "rangeTypes": [
          "https://schema.org/SoftwareApplication"
        ],
        "domainTypes": [
          "https://schema.org/EntryPoint"
        ],
        "supersededBy": "https://schema.org/actionApplication"
      },
      {
        "name": "contentType",
        "type": "https://schema.org/Text",
        "description": "The supported content type(s) for an EntryPoint response.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/EntryPoint"
        ]
      },
      {
        "name": "encodingType",
        "type": "https://schema.org/Text",
        "description": "The supported encoding type(s) for an EntryPoint request.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/EntryPoint"
        ]
      },
      {
        "name": "httpMethod",
        "type": "https://schema.org/Text",
        "description": "An HTTP method that specifies the appropriate HTTP method for a request to an HTTP EntryPoint. Values are capitalized strings as used in HTTP.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/EntryPoint"
        ]
      },
      {
        "name": "urlTemplate",
        "type": "https://schema.org/Text",
        "description": "An url template (RFC6570) that will be used to construct the target of the execution of the action.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/EntryPoint"
        ]
      }
    ]
  },
  {
    "name": "Enumeration",
    "type": "https://schema.org/Enumeration",
    "source": "generated",
    "description": "Lists or enumerations—for example, a list of cuisines or music genres, etc.",
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
    "name": "EnvironmentalProductDeclaration",
    "type": "https://schema.org/EnvironmentalProductDeclaration",
    "source": "generated",
    "description": "An Environmental Product Declaration (EPD) that quantifies environmental information on the life cycle of a product.",
    "parentTypes": [
      "https://schema.org/Certification"
    ]
  }
] satisfies readonly SchemaDefinition[];
