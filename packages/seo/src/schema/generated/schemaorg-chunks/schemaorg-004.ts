/*
 * This file is generated. Do not edit manually.
 * Schema.org version: 30.1
 * Source SHA-256: 0a4b8c4c910fc831ec8695196510973390906a5ee34dc6b862dfec4d21a12f74
 */

import type { SchemaDefinition } from "../../types";

export const generatedSchemaDefinitions4: readonly SchemaDefinition[] =
[
  {
    "name": "MovieSeries",
    "type": "https://schema.org/MovieSeries",
    "source": "generated",
    "description": "A series of movies. Included movies can be indicated with the hasPart property.",
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
    "name": "MovieTheater",
    "type": "https://schema.org/MovieTheater",
    "source": "generated",
    "description": "A movie theater.",
    "parentTypes": [
      "https://schema.org/CivicStructure",
      "https://schema.org/EntertainmentBusiness"
    ],
    "properties": [
      {
        "name": "screenCount",
        "type": "https://schema.org/Number",
        "description": "The number of screens in the movie theater.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/MovieTheater"
        ]
      }
    ]
  },
  {
    "name": "MovingCompany",
    "type": "https://schema.org/MovingCompany",
    "source": "generated",
    "description": "A moving company.",
    "parentTypes": [
      "https://schema.org/HomeAndConstructionBusiness"
    ]
  },
  {
    "name": "Municipality",
    "type": "https://spec.edmcouncil.org/fibo/ontology/FND/Places/Locations/Municipality",
    "source": "generated"
  },
  {
    "name": "Muscle",
    "type": "https://schema.org/Muscle",
    "source": "generated",
    "description": "A muscle is an anatomical structure consisting of a contractile form of tissue that animals use to effect movement.",
    "parentTypes": [
      "https://schema.org/AnatomicalStructure"
    ],
    "properties": [
      {
        "name": "antagonist",
        "type": "https://schema.org/Muscle",
        "description": "The muscle whose action counteracts the specified muscle.",
        "expectedTypes": [
          "https://schema.org/Muscle"
        ],
        "rangeTypes": [
          "https://schema.org/Muscle"
        ],
        "domainTypes": [
          "https://schema.org/Muscle"
        ]
      },
      {
        "name": "bloodSupply",
        "type": "https://schema.org/Vessel",
        "description": "The blood vessel that carries blood from the heart to the muscle.",
        "expectedTypes": [
          "https://schema.org/Vessel"
        ],
        "rangeTypes": [
          "https://schema.org/Vessel"
        ],
        "domainTypes": [
          "https://schema.org/Muscle"
        ]
      },
      {
        "name": "insertion",
        "type": "https://schema.org/AnatomicalStructure",
        "description": "The place of attachment of a muscle, or what the muscle moves.",
        "expectedTypes": [
          "https://schema.org/AnatomicalStructure"
        ],
        "rangeTypes": [
          "https://schema.org/AnatomicalStructure"
        ],
        "domainTypes": [
          "https://schema.org/Muscle"
        ]
      },
      {
        "name": "muscleAction",
        "type": "https://schema.org/Text",
        "description": "The movement the muscle generates.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Muscle"
        ]
      },
      {
        "name": "nerve",
        "type": "https://schema.org/Nerve",
        "description": "The underlying innervation associated with the muscle.",
        "expectedTypes": [
          "https://schema.org/Nerve"
        ],
        "rangeTypes": [
          "https://schema.org/Nerve"
        ],
        "domainTypes": [
          "https://schema.org/Muscle"
        ]
      }
    ]
  },
  {
    "name": "Museum",
    "type": "https://schema.org/Museum",
    "source": "generated",
    "description": "A museum.",
    "parentTypes": [
      "https://schema.org/CivicStructure"
    ]
  },
  {
    "name": "MusicAlbum",
    "type": "https://schema.org/MusicAlbum",
    "source": "generated",
    "description": "A collection of music tracks.",
    "parentTypes": [
      "https://schema.org/MusicPlaylist"
    ],
    "properties": [
      {
        "name": "albumProductionType",
        "type": "https://schema.org/MusicAlbumProductionType",
        "description": "Classification of the album by its type of content: soundtrack, live album, studio album, etc.",
        "expectedTypes": [
          "https://schema.org/MusicAlbumProductionType"
        ],
        "rangeTypes": [
          "https://schema.org/MusicAlbumProductionType"
        ],
        "domainTypes": [
          "https://schema.org/MusicAlbum"
        ]
      },
      {
        "name": "albumRelease",
        "type": "https://schema.org/MusicRelease",
        "description": "A release of this album.",
        "expectedTypes": [
          "https://schema.org/MusicRelease"
        ],
        "rangeTypes": [
          "https://schema.org/MusicRelease"
        ],
        "domainTypes": [
          "https://schema.org/MusicAlbum"
        ],
        "inverseOf": "https://schema.org/releaseOf"
      },
      {
        "name": "albumReleaseType",
        "type": "https://schema.org/MusicAlbumReleaseType",
        "description": "The kind of release which this album is: single, EP or album.",
        "expectedTypes": [
          "https://schema.org/MusicAlbumReleaseType"
        ],
        "rangeTypes": [
          "https://schema.org/MusicAlbumReleaseType"
        ],
        "domainTypes": [
          "https://schema.org/MusicAlbum"
        ]
      },
      {
        "name": "byArtist",
        "type": [
          "https://schema.org/MusicGroup",
          "https://schema.org/Person"
        ],
        "description": "The artist that performed this album or recording.",
        "expectedTypes": [
          "https://schema.org/MusicGroup",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/MusicGroup",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/MusicAlbum",
          "https://schema.org/MusicRecording"
        ]
      }
    ]
  },
  {
    "name": "MusicAlbumProductionType",
    "type": "https://schema.org/MusicAlbumProductionType",
    "source": "generated",
    "description": "Classification of the album by its type of content: soundtrack, live album, studio album, etc.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "CompilationAlbum",
        "type": "https://schema.org/CompilationAlbum",
        "description": "CompilationAlbum."
      },
      {
        "name": "DemoAlbum",
        "type": "https://schema.org/DemoAlbum",
        "description": "DemoAlbum."
      },
      {
        "name": "DJMixAlbum",
        "type": "https://schema.org/DJMixAlbum",
        "description": "DJMixAlbum."
      },
      {
        "name": "LiveAlbum",
        "type": "https://schema.org/LiveAlbum",
        "description": "LiveAlbum."
      },
      {
        "name": "MixtapeAlbum",
        "type": "https://schema.org/MixtapeAlbum",
        "description": "MixtapeAlbum."
      },
      {
        "name": "RemixAlbum",
        "type": "https://schema.org/RemixAlbum",
        "description": "RemixAlbum."
      },
      {
        "name": "SoundtrackAlbum",
        "type": "https://schema.org/SoundtrackAlbum",
        "description": "SoundtrackAlbum."
      },
      {
        "name": "SpokenWordAlbum",
        "type": "https://schema.org/SpokenWordAlbum",
        "description": "SpokenWordAlbum."
      },
      {
        "name": "StudioAlbum",
        "type": "https://schema.org/StudioAlbum",
        "description": "StudioAlbum."
      }
    ]
  },
  {
    "name": "MusicAlbumReleaseType",
    "type": "https://schema.org/MusicAlbumReleaseType",
    "source": "generated",
    "description": "The kind of release which this album is: single, EP or album.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "AlbumRelease",
        "type": "https://schema.org/AlbumRelease",
        "description": "AlbumRelease."
      },
      {
        "name": "BroadcastRelease",
        "type": "https://schema.org/BroadcastRelease",
        "description": "BroadcastRelease."
      },
      {
        "name": "EPRelease",
        "type": "https://schema.org/EPRelease",
        "description": "EPRelease."
      },
      {
        "name": "SingleRelease",
        "type": "https://schema.org/SingleRelease",
        "description": "SingleRelease."
      }
    ]
  },
  {
    "name": "MusicComposition",
    "type": "https://schema.org/MusicComposition",
    "source": "generated",
    "description": "A musical composition.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ],
    "properties": [
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
        "name": "firstPerformance",
        "type": "https://schema.org/Event",
        "description": "The date and place the work was first performed.",
        "expectedTypes": [
          "https://schema.org/Event"
        ],
        "rangeTypes": [
          "https://schema.org/Event"
        ],
        "domainTypes": [
          "https://schema.org/MusicComposition"
        ]
      },
      {
        "name": "includedComposition",
        "type": "https://schema.org/MusicComposition",
        "description": "Smaller compositions included in this work (e.g. a movement in a symphony).",
        "expectedTypes": [
          "https://schema.org/MusicComposition"
        ],
        "rangeTypes": [
          "https://schema.org/MusicComposition"
        ],
        "domainTypes": [
          "https://schema.org/MusicComposition"
        ]
      },
      {
        "name": "iswcCode",
        "type": "https://schema.org/Text",
        "description": "The International Standard Musical Work Code for the composition.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MusicComposition"
        ]
      },
      {
        "name": "lyricist",
        "type": "https://schema.org/Person",
        "description": "The person who wrote the words.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/MusicComposition"
        ]
      },
      {
        "name": "lyrics",
        "type": "https://schema.org/CreativeWork",
        "description": "The words in the song.",
        "expectedTypes": [
          "https://schema.org/CreativeWork"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork"
        ],
        "domainTypes": [
          "https://schema.org/MusicComposition"
        ]
      },
      {
        "name": "musicalKey",
        "type": "https://schema.org/Text",
        "description": "The key, mode, or scale this composition uses.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MusicComposition"
        ]
      },
      {
        "name": "musicArrangement",
        "type": "https://schema.org/MusicComposition",
        "description": "An arrangement derived from the composition.",
        "expectedTypes": [
          "https://schema.org/MusicComposition"
        ],
        "rangeTypes": [
          "https://schema.org/MusicComposition"
        ],
        "domainTypes": [
          "https://schema.org/MusicComposition"
        ]
      },
      {
        "name": "musicCompositionForm",
        "type": "https://schema.org/Text",
        "description": "The type of composition (e.g. overture, sonata, symphony, etc.).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MusicComposition"
        ]
      },
      {
        "name": "recordedAs",
        "type": "https://schema.org/MusicRecording",
        "description": "An audio recording of the work.",
        "expectedTypes": [
          "https://schema.org/MusicRecording"
        ],
        "rangeTypes": [
          "https://schema.org/MusicRecording"
        ],
        "domainTypes": [
          "https://schema.org/MusicComposition"
        ],
        "inverseOf": "https://schema.org/recordingOf"
      }
    ]
  },
  {
    "name": "MusicEvent",
    "type": "https://schema.org/MusicEvent",
    "source": "generated",
    "description": "Event type: Music event.",
    "parentTypes": [
      "https://schema.org/Event"
    ]
  },
  {
    "name": "MusicGroup",
    "type": "https://schema.org/MusicGroup",
    "source": "generated",
    "description": "A musical group, such as a band, an orchestra, or a choir. Can also be a solo musician.",
    "parentTypes": [
      "https://schema.org/PerformingGroup"
    ],
    "properties": [
      {
        "name": "album",
        "type": "https://schema.org/MusicAlbum",
        "description": "A music album.",
        "expectedTypes": [
          "https://schema.org/MusicAlbum"
        ],
        "rangeTypes": [
          "https://schema.org/MusicAlbum"
        ],
        "domainTypes": [
          "https://schema.org/MusicGroup"
        ]
      },
      {
        "name": "albums",
        "type": "https://schema.org/MusicAlbum",
        "description": "A collection of music albums.",
        "expectedTypes": [
          "https://schema.org/MusicAlbum"
        ],
        "rangeTypes": [
          "https://schema.org/MusicAlbum"
        ],
        "domainTypes": [
          "https://schema.org/MusicGroup"
        ],
        "supersededBy": "https://schema.org/album"
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
        "name": "musicGroupMember",
        "type": "https://schema.org/Person",
        "description": "A member of a music group&#x2014;for example, John, Paul, George, or Ringo.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/MusicGroup"
        ],
        "supersededBy": "https://schema.org/member"
      },
      {
        "name": "track",
        "type": [
          "https://schema.org/ItemList",
          "https://schema.org/MusicRecording"
        ],
        "description": "A music recording (track)&#x2014;usually a single song. If an ItemList is given, the list should contain items of type MusicRecording.",
        "expectedTypes": [
          "https://schema.org/ItemList",
          "https://schema.org/MusicRecording"
        ],
        "rangeTypes": [
          "https://schema.org/ItemList",
          "https://schema.org/MusicRecording"
        ],
        "domainTypes": [
          "https://schema.org/MusicGroup",
          "https://schema.org/MusicPlaylist"
        ]
      },
      {
        "name": "tracks",
        "type": "https://schema.org/MusicRecording",
        "description": "A music recording (track)&#x2014;usually a single song.",
        "expectedTypes": [
          "https://schema.org/MusicRecording"
        ],
        "rangeTypes": [
          "https://schema.org/MusicRecording"
        ],
        "domainTypes": [
          "https://schema.org/MusicGroup",
          "https://schema.org/MusicPlaylist"
        ],
        "supersededBy": "https://schema.org/track"
      }
    ]
  },
  {
    "name": "MusicPlaylist",
    "type": "https://schema.org/MusicPlaylist",
    "source": "generated",
    "description": "A collection of music tracks in playlist form.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ],
    "properties": [
      {
        "name": "numTracks",
        "type": "https://schema.org/Integer",
        "description": "The number of tracks in this album or playlist.",
        "expectedTypes": [
          "https://schema.org/Integer"
        ],
        "rangeTypes": [
          "https://schema.org/Integer"
        ],
        "domainTypes": [
          "https://schema.org/MusicPlaylist"
        ]
      },
      {
        "name": "track",
        "type": [
          "https://schema.org/ItemList",
          "https://schema.org/MusicRecording"
        ],
        "description": "A music recording (track)&#x2014;usually a single song. If an ItemList is given, the list should contain items of type MusicRecording.",
        "expectedTypes": [
          "https://schema.org/ItemList",
          "https://schema.org/MusicRecording"
        ],
        "rangeTypes": [
          "https://schema.org/ItemList",
          "https://schema.org/MusicRecording"
        ],
        "domainTypes": [
          "https://schema.org/MusicGroup",
          "https://schema.org/MusicPlaylist"
        ]
      },
      {
        "name": "tracks",
        "type": "https://schema.org/MusicRecording",
        "description": "A music recording (track)&#x2014;usually a single song.",
        "expectedTypes": [
          "https://schema.org/MusicRecording"
        ],
        "rangeTypes": [
          "https://schema.org/MusicRecording"
        ],
        "domainTypes": [
          "https://schema.org/MusicGroup",
          "https://schema.org/MusicPlaylist"
        ],
        "supersededBy": "https://schema.org/track"
      }
    ]
  },
  {
    "name": "MusicRecording",
    "type": "https://schema.org/MusicRecording",
    "source": "generated",
    "description": "A music recording (track), usually a single song.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ],
    "properties": [
      {
        "name": "byArtist",
        "type": [
          "https://schema.org/MusicGroup",
          "https://schema.org/Person"
        ],
        "description": "The artist that performed this album or recording.",
        "expectedTypes": [
          "https://schema.org/MusicGroup",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/MusicGroup",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/MusicAlbum",
          "https://schema.org/MusicRecording"
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
        "name": "inAlbum",
        "type": "https://schema.org/MusicAlbum",
        "description": "The album to which this recording belongs.",
        "expectedTypes": [
          "https://schema.org/MusicAlbum"
        ],
        "rangeTypes": [
          "https://schema.org/MusicAlbum"
        ],
        "domainTypes": [
          "https://schema.org/MusicRecording"
        ]
      },
      {
        "name": "inPlaylist",
        "type": "https://schema.org/MusicPlaylist",
        "description": "The playlist to which this recording belongs.",
        "expectedTypes": [
          "https://schema.org/MusicPlaylist"
        ],
        "rangeTypes": [
          "https://schema.org/MusicPlaylist"
        ],
        "domainTypes": [
          "https://schema.org/MusicRecording"
        ]
      },
      {
        "name": "isrcCode",
        "type": "https://schema.org/Text",
        "description": "The International Standard Recording Code for the recording.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MusicRecording"
        ]
      },
      {
        "name": "recordingOf",
        "type": "https://schema.org/MusicComposition",
        "description": "The composition this track is a recording of.",
        "expectedTypes": [
          "https://schema.org/MusicComposition"
        ],
        "rangeTypes": [
          "https://schema.org/MusicComposition"
        ],
        "domainTypes": [
          "https://schema.org/MusicRecording"
        ],
        "inverseOf": "https://schema.org/recordedAs"
      }
    ]
  },
  {
    "name": "MusicRelease",
    "type": "https://schema.org/MusicRelease",
    "source": "generated",
    "description": "A MusicRelease is a specific release of a music album.",
    "parentTypes": [
      "https://schema.org/MusicPlaylist"
    ],
    "properties": [
      {
        "name": "catalogNumber",
        "type": "https://schema.org/Text",
        "description": "The catalog number for the release.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MusicRelease"
        ]
      },
      {
        "name": "creditedTo",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "The group the release is credited to if different than the byArtist. For example, Red and Blue is credited to \"Stefani Germanotta Band\", but by Lady Gaga.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/MusicRelease"
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
        "name": "musicReleaseFormat",
        "type": "https://schema.org/MusicReleaseFormatType",
        "description": "Format of this release (the type of recording media used, i.e. compact disc, digital media, LP, etc.).",
        "expectedTypes": [
          "https://schema.org/MusicReleaseFormatType"
        ],
        "rangeTypes": [
          "https://schema.org/MusicReleaseFormatType"
        ],
        "domainTypes": [
          "https://schema.org/MusicRelease"
        ]
      },
      {
        "name": "recordLabel",
        "type": "https://schema.org/Organization",
        "description": "The label that issued the release.",
        "expectedTypes": [
          "https://schema.org/Organization"
        ],
        "rangeTypes": [
          "https://schema.org/Organization"
        ],
        "domainTypes": [
          "https://schema.org/MusicRelease"
        ]
      },
      {
        "name": "releaseOf",
        "type": "https://schema.org/MusicAlbum",
        "description": "The album this is a release of.",
        "expectedTypes": [
          "https://schema.org/MusicAlbum"
        ],
        "rangeTypes": [
          "https://schema.org/MusicAlbum"
        ],
        "domainTypes": [
          "https://schema.org/MusicRelease"
        ],
        "inverseOf": "https://schema.org/albumRelease"
      }
    ]
  },
  {
    "name": "MusicReleaseFormatType",
    "type": "https://schema.org/MusicReleaseFormatType",
    "source": "generated",
    "description": "Format of this release (the type of recording media used, i.e. compact disc, digital media, LP, etc.).",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "CassetteFormat",
        "type": "https://schema.org/CassetteFormat",
        "description": "CassetteFormat."
      },
      {
        "name": "CDFormat",
        "type": "https://schema.org/CDFormat",
        "description": "CDFormat."
      },
      {
        "name": "DigitalAudioTapeFormat",
        "type": "https://schema.org/DigitalAudioTapeFormat",
        "description": "DigitalAudioTapeFormat."
      },
      {
        "name": "DigitalFormat",
        "type": "https://schema.org/DigitalFormat",
        "description": "DigitalFormat."
      },
      {
        "name": "DVDFormat",
        "type": "https://schema.org/DVDFormat",
        "description": "DVDFormat."
      },
      {
        "name": "LaserDiscFormat",
        "type": "https://schema.org/LaserDiscFormat",
        "description": "LaserDiscFormat."
      },
      {
        "name": "VinylFormat",
        "type": "https://schema.org/VinylFormat",
        "description": "VinylFormat."
      }
    ]
  },
  {
    "name": "MusicStore",
    "type": "https://schema.org/MusicStore",
    "source": "generated",
    "description": "A music store.",
    "parentTypes": [
      "https://schema.org/Store"
    ]
  },
  {
    "name": "MusicVenue",
    "type": "https://schema.org/MusicVenue",
    "source": "generated",
    "description": "A music venue.",
    "parentTypes": [
      "https://schema.org/CivicStructure"
    ]
  },
  {
    "name": "MusicVideoObject",
    "type": "https://schema.org/MusicVideoObject",
    "source": "generated",
    "description": "A music video file.",
    "parentTypes": [
      "https://schema.org/MediaObject"
    ]
  },
  {
    "name": "MutualContractualAgreement",
    "type": "https://spec.edmcouncil.org/fibo/ontology/FND/Agreements/Contracts/MutualContractualAgreement",
    "source": "generated"
  },
  {
    "name": "NailSalon",
    "type": "https://schema.org/NailSalon",
    "source": "generated",
    "description": "A nail salon.",
    "parentTypes": [
      "https://schema.org/HealthAndBeautyBusiness"
    ]
  },
  {
    "name": "Nerve",
    "type": "https://schema.org/Nerve",
    "source": "generated",
    "description": "A common pathway for the electrochemical nerve impulses that are transmitted along each of the axons.",
    "parentTypes": [
      "https://schema.org/AnatomicalStructure"
    ],
    "properties": [
      {
        "name": "branch",
        "type": "https://schema.org/AnatomicalStructure",
        "description": "The branches that delineate from the nerve bundle. Not to be confused with [[branchOf]].",
        "expectedTypes": [
          "https://schema.org/AnatomicalStructure"
        ],
        "rangeTypes": [
          "https://schema.org/AnatomicalStructure"
        ],
        "domainTypes": [
          "https://schema.org/Nerve"
        ],
        "supersededBy": "https://schema.org/arterialBranch"
      },
      {
        "name": "nerveMotor",
        "type": "https://schema.org/Muscle",
        "description": "The neurological pathway extension that involves muscle control.",
        "expectedTypes": [
          "https://schema.org/Muscle"
        ],
        "rangeTypes": [
          "https://schema.org/Muscle"
        ],
        "domainTypes": [
          "https://schema.org/Nerve"
        ]
      },
      {
        "name": "sensoryUnit",
        "type": [
          "https://schema.org/AnatomicalStructure",
          "https://schema.org/SuperficialAnatomy"
        ],
        "description": "The neurological pathway extension that inputs and sends information to the brain or spinal cord.",
        "expectedTypes": [
          "https://schema.org/AnatomicalStructure",
          "https://schema.org/SuperficialAnatomy"
        ],
        "rangeTypes": [
          "https://schema.org/AnatomicalStructure",
          "https://schema.org/SuperficialAnatomy"
        ],
        "domainTypes": [
          "https://schema.org/Nerve"
        ]
      },
      {
        "name": "sourcedFrom",
        "type": "https://schema.org/BrainStructure",
        "description": "The neurological pathway that originates the neurons.",
        "expectedTypes": [
          "https://schema.org/BrainStructure"
        ],
        "rangeTypes": [
          "https://schema.org/BrainStructure"
        ],
        "domainTypes": [
          "https://schema.org/Nerve"
        ]
      }
    ]
  },
  {
    "name": "NewsArticle",
    "type": "https://schema.org/NewsArticle",
    "source": "generated",
    "description": "A NewsArticle is an article whose content reports news, or provides background context and supporting materials for understanding the news.\n\nA more detailed overview of [schema.org News markup](/docs/news.html) is also available.\n",
    "parentTypes": [
      "https://schema.org/Article"
    ],
    "properties": [
      {
        "name": "dateline",
        "type": "https://schema.org/Text",
        "description": "A [dateline](https://en.wikipedia.org/wiki/Dateline) is a brief piece of text included in news articles that describes where and when the story was written or filed though the date is often omitted. Sometimes only a placename is provided.\n\nStructured representations of dateline-related information can also be expressed more explicitly using [[locationCreated]] (which represents where a work was created, e.g. where a news report was written).  For location depicted or described in the content, use [[contentLocation]].\n\nDateline summaries are oriented more towards human readers than towards automated processing, and can vary substantially. Some examples: \"BEIRUT, Lebanon, June 2.\", \"Paris, France\", \"December 19, 2017 11:43AM Reporting from Washington\", \"Beijing/Moscow\", \"QUEZON CITY, Philippines\".\n      ",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/NewsArticle"
        ]
      },
      {
        "name": "printColumn",
        "type": "https://schema.org/Text",
        "description": "The number of the column in which the NewsArticle appears in the print edition.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/NewsArticle"
        ]
      },
      {
        "name": "printEdition",
        "type": "https://schema.org/Text",
        "description": "The edition of the print product in which the NewsArticle appears.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/NewsArticle"
        ]
      },
      {
        "name": "printPage",
        "type": "https://schema.org/Text",
        "description": "If this NewsArticle appears in print, this field indicates the name of the page on which the article is found. Please note that this field is intended for the exact page name (e.g. A5, B18).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/NewsArticle"
        ]
      },
      {
        "name": "printSection",
        "type": "https://schema.org/Text",
        "description": "If this NewsArticle appears in print, this field indicates the print section in which the article appeared.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/NewsArticle"
        ]
      }
    ]
  },
  {
    "name": "NewsMediaOrganization",
    "type": "https://schema.org/NewsMediaOrganization",
    "source": "generated",
    "description": "A News/Media organization such as a newspaper or TV station.",
    "parentTypes": [
      "https://schema.org/Organization"
    ],
    "properties": [
      {
        "name": "actionableFeedbackPolicy",
        "type": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "description": "For a [[NewsMediaOrganization]] or other news-related [[Organization]], a statement about public engagement activities (for news media, the newsroom’s), including involving the public - digitally or otherwise -- in coverage decisions, reporting and activities after publication.",
        "expectedTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/NewsMediaOrganization",
          "https://schema.org/Organization"
        ]
      },
      {
        "name": "correctionsPolicy",
        "type": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "description": "For an [[Organization]] (e.g. [[NewsMediaOrganization]]), a statement describing (in news media, the newsroom’s) disclosure and correction policy for errors.",
        "expectedTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/NewsMediaOrganization",
          "https://schema.org/Organization"
        ]
      },
      {
        "name": "diversityPolicy",
        "type": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "description": "Statement on diversity policy by an [[Organization]] e.g. a [[NewsMediaOrganization]]. For a [[NewsMediaOrganization]], a statement describing the newsroom’s diversity policy on both staffing and sources, typically providing staffing data.",
        "expectedTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/NewsMediaOrganization",
          "https://schema.org/Organization"
        ]
      },
      {
        "name": "diversityStaffingReport",
        "type": [
          "https://schema.org/Article",
          "https://schema.org/URL"
        ],
        "description": "For an [[Organization]] (often but not necessarily a [[NewsMediaOrganization]]), a report on staffing diversity issues. In a news context this might be for example ASNE or RTDNA (US) reports, or self-reported.",
        "expectedTypes": [
          "https://schema.org/Article",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Article",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/NewsMediaOrganization",
          "https://schema.org/Organization"
        ]
      },
      {
        "name": "ethicsPolicy",
        "type": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "description": "Statement about ethics policy, e.g. of a [[NewsMediaOrganization]] regarding journalistic and publishing practices, or of a [[Restaurant]], a page describing food source policies. In the case of a [[NewsMediaOrganization]], an ethicsPolicy is typically a statement describing the personal, organizational, and corporate standards of behavior expected by the organization.",
        "expectedTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/NewsMediaOrganization",
          "https://schema.org/Organization"
        ]
      },
      {
        "name": "masthead",
        "type": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "description": "For a [[NewsMediaOrganization]], a link to the masthead page or a page listing top editorial management.",
        "expectedTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/NewsMediaOrganization"
        ]
      },
      {
        "name": "missionCoveragePrioritiesPolicy",
        "type": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "description": "For a [[NewsMediaOrganization]], a statement on coverage priorities, including any public agenda or stance on issues.",
        "expectedTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/NewsMediaOrganization"
        ]
      },
      {
        "name": "noBylinesPolicy",
        "type": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "description": "For a [[NewsMediaOrganization]] or other news-related [[Organization]], a statement explaining when authors of articles are not named in bylines.",
        "expectedTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/NewsMediaOrganization"
        ]
      },
      {
        "name": "ownershipFundingInfo",
        "type": [
          "https://schema.org/AboutPage",
          "https://schema.org/CreativeWork",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "For an [[Organization]] (often but not necessarily a [[NewsMediaOrganization]]), a description of organizational ownership structure; funding and grants. In a news/media setting, this is with particular reference to editorial independence.   Note that the [[funder]] is also available and can be used to make basic funder information machine-readable.",
        "expectedTypes": [
          "https://schema.org/AboutPage",
          "https://schema.org/CreativeWork",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/AboutPage",
          "https://schema.org/CreativeWork",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/NewsMediaOrganization",
          "https://schema.org/Organization"
        ]
      },
      {
        "name": "unnamedSourcesPolicy",
        "type": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "description": "For an [[Organization]] (typically a [[NewsMediaOrganization]]), a statement about policy on use of unnamed sources and the decision process required.",
        "expectedTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/NewsMediaOrganization",
          "https://schema.org/Organization"
        ]
      },
      {
        "name": "verificationFactCheckingPolicy",
        "type": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "description": "Disclosure about verification and fact-checking processes for a [[NewsMediaOrganization]] or other fact-checking [[Organization]].",
        "expectedTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/NewsMediaOrganization"
        ]
      }
    ]
  },
  {
    "name": "Newspaper",
    "type": "https://schema.org/Newspaper",
    "source": "generated",
    "description": "A publication containing information about varied topics that are pertinent to general information, a geographic area, or a specific subject matter (i.e. business, culture, education). Often published daily.",
    "parentTypes": [
      "https://schema.org/Periodical"
    ]
  },
  {
    "name": "NGO",
    "type": "https://schema.org/NGO",
    "source": "generated",
    "description": "Organization: Non-governmental Organization.",
    "parentTypes": [
      "https://schema.org/Organization"
    ]
  },
  {
    "name": "NightClub",
    "type": "https://schema.org/NightClub",
    "source": "generated",
    "description": "A nightclub or discotheque.",
    "parentTypes": [
      "https://schema.org/EntertainmentBusiness"
    ]
  },
  {
    "name": "NLNonprofitType",
    "type": "https://schema.org/NLNonprofitType",
    "source": "generated",
    "description": "NLNonprofitType: Non-profit organization type originating from the Netherlands.",
    "parentTypes": [
      "https://schema.org/NonprofitType"
    ],
    "enumerationValues": [
      {
        "name": "NonprofitANBI",
        "type": "https://schema.org/NonprofitANBI",
        "description": "NonprofitANBI: Non-profit type referring to a Public Benefit Organization (NL)."
      },
      {
        "name": "NonprofitSBBI",
        "type": "https://schema.org/NonprofitSBBI",
        "description": "NonprofitSBBI: Non-profit type referring to a Social Interest Promoting Institution (NL)."
      }
    ]
  },
  {
    "name": "NonGovernmentalOrganization",
    "type": "https://spec.edmcouncil.org/fibo/ontology/BE/NotForProfitOrganizations/NotForProfitOrganizations/NonGovernmentalOrganization",
    "source": "generated"
  },
  {
    "name": "NonprofitType",
    "type": "https://schema.org/NonprofitType",
    "source": "generated",
    "description": "NonprofitType enumerates several kinds of official non-profit types of which a non-profit organization can be.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ]
  },
  {
    "name": "Notary",
    "type": "https://schema.org/Notary",
    "source": "generated",
    "description": "A notary.",
    "parentTypes": [
      "https://schema.org/LegalService"
    ]
  },
  {
    "name": "NoteDigitalDocument",
    "type": "https://schema.org/NoteDigitalDocument",
    "source": "generated",
    "description": "A file containing a note, primarily for the author.",
    "parentTypes": [
      "https://schema.org/DigitalDocument"
    ]
  },
  {
    "name": "Number",
    "type": "https://schema.org/Number",
    "source": "generated",
    "description": "Data type: Number.\\n\\nUsage guidelines:\\n\\n* Use values from 0123456789 (Unicode 'DIGIT ZERO' (U+0030) to 'DIGIT NINE' (U+0039)) rather than superficially similar Unicode symbols.\\n* Use '.' (Unicode 'FULL STOP' (U+002E)) rather than ',' to indicate a decimal point. Avoid using these symbols as a readability separator."
  },
  {
    "name": "NutritionInformation",
    "type": "https://schema.org/NutritionInformation",
    "source": "generated",
    "description": "Nutritional information about the recipe.",
    "parentTypes": [
      "https://schema.org/StructuredValue"
    ],
    "properties": [
      {
        "name": "calories",
        "type": "https://schema.org/Energy",
        "description": "The number of calories.",
        "expectedTypes": [
          "https://schema.org/Energy"
        ],
        "rangeTypes": [
          "https://schema.org/Energy"
        ],
        "domainTypes": [
          "https://schema.org/NutritionInformation"
        ]
      },
      {
        "name": "carbohydrateContent",
        "type": "https://schema.org/Mass",
        "description": "The number of grams of carbohydrates.",
        "expectedTypes": [
          "https://schema.org/Mass"
        ],
        "rangeTypes": [
          "https://schema.org/Mass"
        ],
        "domainTypes": [
          "https://schema.org/NutritionInformation"
        ]
      },
      {
        "name": "cholesterolContent",
        "type": "https://schema.org/Mass",
        "description": "The number of milligrams of cholesterol.",
        "expectedTypes": [
          "https://schema.org/Mass"
        ],
        "rangeTypes": [
          "https://schema.org/Mass"
        ],
        "domainTypes": [
          "https://schema.org/NutritionInformation"
        ]
      },
      {
        "name": "fatContent",
        "type": "https://schema.org/Mass",
        "description": "The number of grams of fat.",
        "expectedTypes": [
          "https://schema.org/Mass"
        ],
        "rangeTypes": [
          "https://schema.org/Mass"
        ],
        "domainTypes": [
          "https://schema.org/NutritionInformation"
        ]
      },
      {
        "name": "fiberContent",
        "type": "https://schema.org/Mass",
        "description": "The number of grams of fiber.",
        "expectedTypes": [
          "https://schema.org/Mass"
        ],
        "rangeTypes": [
          "https://schema.org/Mass"
        ],
        "domainTypes": [
          "https://schema.org/NutritionInformation"
        ]
      },
      {
        "name": "proteinContent",
        "type": "https://schema.org/Mass",
        "description": "The number of grams of protein.",
        "expectedTypes": [
          "https://schema.org/Mass"
        ],
        "rangeTypes": [
          "https://schema.org/Mass"
        ],
        "domainTypes": [
          "https://schema.org/NutritionInformation"
        ]
      },
      {
        "name": "saturatedFatContent",
        "type": "https://schema.org/Mass",
        "description": "The number of grams of saturated fat.",
        "expectedTypes": [
          "https://schema.org/Mass"
        ],
        "rangeTypes": [
          "https://schema.org/Mass"
        ],
        "domainTypes": [
          "https://schema.org/NutritionInformation"
        ]
      },
      {
        "name": "servingSize",
        "type": "https://schema.org/Text",
        "description": "The serving size, in terms of the number of volume or mass.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/NutritionInformation"
        ]
      },
      {
        "name": "sodiumContent",
        "type": "https://schema.org/Mass",
        "description": "The number of milligrams of sodium.",
        "expectedTypes": [
          "https://schema.org/Mass"
        ],
        "rangeTypes": [
          "https://schema.org/Mass"
        ],
        "domainTypes": [
          "https://schema.org/NutritionInformation"
        ]
      },
      {
        "name": "sugarContent",
        "type": "https://schema.org/Mass",
        "description": "The number of grams of sugar.",
        "expectedTypes": [
          "https://schema.org/Mass"
        ],
        "rangeTypes": [
          "https://schema.org/Mass"
        ],
        "domainTypes": [
          "https://schema.org/NutritionInformation"
        ]
      },
      {
        "name": "transFatContent",
        "type": "https://schema.org/Mass",
        "description": "The number of grams of trans fat.",
        "expectedTypes": [
          "https://schema.org/Mass"
        ],
        "rangeTypes": [
          "https://schema.org/Mass"
        ],
        "domainTypes": [
          "https://schema.org/NutritionInformation"
        ]
      },
      {
        "name": "unsaturatedFatContent",
        "type": "https://schema.org/Mass",
        "description": "The number of grams of unsaturated fat.",
        "expectedTypes": [
          "https://schema.org/Mass"
        ],
        "rangeTypes": [
          "https://schema.org/Mass"
        ],
        "domainTypes": [
          "https://schema.org/NutritionInformation"
        ]
      }
    ]
  },
  {
    "name": "Observation",
    "type": "https://schema.org/Observation",
    "source": "generated",
    "description": "Instances of the class [[Observation]] are used to specify observations about an entity at a particular time. The principal properties of an [[Observation]] are [[observationAbout]], [[measuredProperty]], [[statType]], [[value] and [[observationDate]]  and [[measuredProperty]]. Some but not all Observations represent a [[QuantitativeValue]]. Quantitative observations can be about a [[StatisticalVariable]], which is an abstract specification about which we can make observations that are grounded at a particular location and time.\n\nObservations can also encode a subset of simple RDF-like statements (its observationAbout, a StatisticalVariable, defining the measuredPoperty; its observationAbout property indicating the entity the statement is about, and [[value]] )\n\nIn the context of a quantitative knowledge graph, typical properties could include [[measuredProperty]], [[observationAbout]], [[observationDate]], [[value]], [[unitCode]], [[unitText]], [[measurementMethod]].\n    ",
    "parentTypes": [
      "https://schema.org/Intangible",
      "https://schema.org/QuantitativeValue"
    ],
    "properties": [
      {
        "name": "marginOfError",
        "type": "https://schema.org/QuantitativeValue",
        "description": "A [[marginOfError]] for an [[Observation]].",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/Observation"
        ]
      },
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
        "name": "observationAbout",
        "type": [
          "https://schema.org/Place",
          "https://schema.org/Thing"
        ],
        "description": "The [[observationAbout]] property identifies an entity, often a [[Place]], associated with an [[Observation]].",
        "expectedTypes": [
          "https://schema.org/Place",
          "https://schema.org/Thing"
        ],
        "rangeTypes": [
          "https://schema.org/Place",
          "https://schema.org/Thing"
        ],
        "domainTypes": [
          "https://schema.org/Observation"
        ]
      },
      {
        "name": "observationDate",
        "type": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "description": "The observationDate of an [[Observation]].",
        "expectedTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/Observation"
        ]
      },
      {
        "name": "observationPeriod",
        "type": "https://schema.org/Text",
        "description": "The length of time an Observation took place over. The format follows `P[0-9]*[Y|M|D|h|m|s]`. For example, P1Y is Period 1 Year, P3M is Period 3 Months, P3h is Period 3 hours.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Observation"
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
    "name": "Occupation",
    "type": "https://schema.org/Occupation",
    "source": "generated",
    "description": "A profession, may involve prolonged training and/or a formal qualification.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "educationRequirements",
        "type": [
          "https://schema.org/EducationalOccupationalCredential",
          "https://schema.org/Text"
        ],
        "description": "Educational background needed for the position or Occupation.",
        "expectedTypes": [
          "https://schema.org/EducationalOccupationalCredential",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/EducationalOccupationalCredential",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/JobPosting",
          "https://schema.org/Occupation"
        ]
      },
      {
        "name": "estimatedSalary",
        "type": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/MonetaryAmountDistribution",
          "https://schema.org/Number"
        ],
        "description": "An estimated salary for a job posting or occupation, based on a variety of variables including, but not limited to industry, job title, and location. Estimated salaries  are often computed by outside organizations rather than the hiring organization, who may not have committed to the estimated value.",
        "expectedTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/MonetaryAmountDistribution",
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/MonetaryAmountDistribution",
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/JobPosting",
          "https://schema.org/Occupation"
        ]
      },
      {
        "name": "experienceRequirements",
        "type": [
          "https://schema.org/OccupationalExperienceRequirements",
          "https://schema.org/Text"
        ],
        "description": "Description of skills and experience needed for the position or Occupation.",
        "expectedTypes": [
          "https://schema.org/OccupationalExperienceRequirements",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/OccupationalExperienceRequirements",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/JobPosting",
          "https://schema.org/Occupation"
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
        "name": "occupationLocation",
        "type": "https://schema.org/AdministrativeArea",
        "description": " The region/country for which this occupational description is appropriate. Note that educational requirements and qualifications can vary between jurisdictions.",
        "expectedTypes": [
          "https://schema.org/AdministrativeArea"
        ],
        "rangeTypes": [
          "https://schema.org/AdministrativeArea"
        ],
        "domainTypes": [
          "https://schema.org/Occupation"
        ]
      },
      {
        "name": "qualifications",
        "type": [
          "https://schema.org/Credential",
          "https://schema.org/Text"
        ],
        "description": "Specific qualifications required for this role or Occupation.",
        "expectedTypes": [
          "https://schema.org/Credential",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Credential",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/JobPosting",
          "https://schema.org/Occupation"
        ]
      },
      {
        "name": "responsibilities",
        "type": "https://schema.org/Text",
        "description": "Responsibilities associated with this role or Occupation.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/JobPosting",
          "https://schema.org/Occupation"
        ]
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
      }
    ]
  },
  {
    "name": "OccupationalExperienceRequirements",
    "type": "https://schema.org/OccupationalExperienceRequirements",
    "source": "generated",
    "description": "Indicates employment-related experience requirements, e.g. [[monthsOfExperience]].",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "monthsOfExperience",
        "type": "https://schema.org/Number",
        "description": "Indicates the minimal number of months of experience required for a position.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/OccupationalExperienceRequirements"
        ]
      }
    ]
  },
  {
    "name": "OccupationalTherapy",
    "type": "https://schema.org/OccupationalTherapy",
    "source": "generated",
    "description": "A treatment of people with physical, emotional, or social problems, using purposeful activity to help them overcome or learn to deal with their problems.",
    "parentTypes": [
      "https://schema.org/MedicalTherapy"
    ]
  },
  {
    "name": "Occurrence",
    "type": "https://spec.edmcouncil.org/fibo/ontology/FND/DatesAndTimes/Occurrences/Occurrence",
    "source": "generated"
  },
  {
    "name": "OceanBodyOfWater",
    "type": "https://schema.org/OceanBodyOfWater",
    "source": "generated",
    "description": "An ocean (for example, the Pacific).",
    "parentTypes": [
      "https://schema.org/BodyOfWater"
    ]
  },
  {
    "name": "Offer",
    "type": "https://spec.edmcouncil.org/fibo/ontology/FND/ProductsAndServices/ProductsAndServices/Offer",
    "source": "generated"
  },
  {
    "name": "Offer",
    "type": "https://schema.org/Offer",
    "source": "generated",
    "description": "An offer to transfer some rights to an item or to provide a service — for example, an offer to sell tickets to an event, to rent the DVD of a movie, to stream a TV show over the internet, to repair a motorcycle, or to loan a book.\\n\\nNote: As the [[businessFunction]] property, which identifies the form of offer (e.g. sell, lease, repair, dispose), defaults to http://purl.org/goodrelations/v1#Sell; an Offer without a defined businessFunction value can be assumed to be an offer to sell.\\n\\nFor [GTIN](http://www.gs1.org/barcodes/technical/idkeys/gtin)-related fields, see [Check Digit calculator](http://www.gs1.org/barcodes/support/check_digit_calculator) and [validation guide](http://www.gs1us.org/resources/standards/gtin-validation-guide) from [GS1](http://www.gs1.org/).",
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
        "name": "addOn",
        "type": "https://schema.org/Offer",
        "description": "An additional offer that can only be obtained in combination with the first base offer (e.g. supplements and extensions that are available for a surcharge).",
        "expectedTypes": [
          "https://schema.org/Offer"
        ],
        "rangeTypes": [
          "https://schema.org/Offer"
        ],
        "domainTypes": [
          "https://schema.org/Offer"
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
        "name": "checkoutPageURLTemplate",
        "type": "https://schema.org/Text",
        "description": "A URL template (RFC 6570) for a checkout page for an offer. This approach allows merchants to specify a URL for online checkout of the offered product, by interpolating parameters such as the logged in user ID, product ID, quantity, discount code etc. Parameter naming and standardization are not specified here.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Offer"
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
        "name": "itemPopularity",
        "type": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "description": "A measure of the relative popularity or sales rank of the offer within a marketplace, catalog, or platform (e.g. a platform-specific bestseller ranking or sales rank). This property is intended for platform-level or catalog-wide comparative rankings rather than self-asserted promotional claims.",
        "expectedTypes": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/Offer"
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
        "name": "offeredBy",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "A pointer to the organization or person making the offer.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Offer"
        ],
        "inverseOf": "https://schema.org/makesOffer"
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
        "name": "priceValidUntil",
        "type": "https://schema.org/Date",
        "description": "The date after which the price is no longer available.",
        "expectedTypes": [
          "https://schema.org/Date"
        ],
        "rangeTypes": [
          "https://schema.org/Date"
        ],
        "domainTypes": [
          "https://schema.org/Offer"
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
        "name": "shippingDetails",
        "type": "https://schema.org/OfferShippingDetails",
        "description": "Indicates information about the shipping policies and options associated with an [[Offer]].",
        "expectedTypes": [
          "https://schema.org/OfferShippingDetails"
        ],
        "rangeTypes": [
          "https://schema.org/OfferShippingDetails"
        ],
        "domainTypes": [
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
    "name": "Offer",
    "type": "http://unece.org/vocab#Offer",
    "source": "generated"
  },
  {
    "name": "OfferCatalog",
    "type": "https://schema.org/OfferCatalog",
    "source": "generated",
    "description": "An OfferCatalog is an ItemList that contains related Offers and/or further OfferCatalogs that are offeredBy the same provider.",
    "parentTypes": [
      "https://schema.org/ItemList"
    ]
  },
  {
    "name": "OfferForLease",
    "type": "https://schema.org/OfferForLease",
    "source": "generated",
    "description": "An [[OfferForLease]] in Schema.org represents an [[Offer]] to lease out something, i.e. an [[Offer]] whose\n  [[businessFunction]] is [lease out](http://purl.org/goodrelations/v1#LeaseOut.). See [Good Relations](https://en.wikipedia.org/wiki/GoodRelations) for\n  background on the underlying concepts.\n  ",
    "parentTypes": [
      "https://schema.org/Offer"
    ]
  },
  {
    "name": "OfferForPurchase",
    "type": "https://schema.org/OfferForPurchase",
    "source": "generated",
    "description": "An [[OfferForPurchase]] in Schema.org represents an [[Offer]] to sell something, i.e. an [[Offer]] whose\n  [[businessFunction]] is [sell](http://purl.org/goodrelations/v1#Sell.). See [Good Relations](https://en.wikipedia.org/wiki/GoodRelations) for\n  background on the underlying concepts.\n  ",
    "parentTypes": [
      "https://schema.org/Offer"
    ]
  },
  {
    "name": "OfferItemCondition",
    "type": "https://schema.org/OfferItemCondition",
    "source": "generated",
    "description": "A list of possible conditions for the item.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "DamagedCondition",
        "type": "https://schema.org/DamagedCondition",
        "description": "Indicates that the item is damaged."
      },
      {
        "name": "NewCondition",
        "type": "https://schema.org/NewCondition",
        "description": "Indicates that the item is new."
      },
      {
        "name": "RefurbishedCondition",
        "type": "https://schema.org/RefurbishedCondition",
        "description": "Indicates that the item is refurbished."
      },
      {
        "name": "UsedCondition",
        "type": "https://schema.org/UsedCondition",
        "description": "Indicates that the item is used."
      }
    ]
  },
  {
    "name": "OfferShippingDetails",
    "type": "https://schema.org/OfferShippingDetails",
    "source": "generated",
    "description": "OfferShippingDetails represents information about shipping destinations.\n\nMultiple of these entities can be used to represent different shipping rates for different destinations:\n\nOne entity for Alaska/Hawaii. A different one for continental US. A different one for all France.\n\nMultiple of these entities can be used to represent different shipping costs and delivery times.\n\nTwo entities that are identical but differ in rate and time:\n\nE.g. Cheaper and slower: $5 in 5-7 days\nor Fast and expensive: $15 in 1-2 days.",
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
        "name": "hasShippingService",
        "type": "https://schema.org/ShippingService",
        "description": "Specification of a shipping service offered by the organization.",
        "expectedTypes": [
          "https://schema.org/ShippingService"
        ],
        "rangeTypes": [
          "https://schema.org/ShippingService"
        ],
        "domainTypes": [
          "https://schema.org/OfferShippingDetails",
          "https://schema.org/Organization"
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
        "name": "shippingSettingsLink",
        "type": "https://schema.org/URL",
        "description": "Link to a page containing [[ShippingRateSettings]] and [[DeliveryTimeSettings]] details.",
        "expectedTypes": [
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/OfferShippingDetails"
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
    "name": "OfficeEquipmentStore",
    "type": "https://schema.org/OfficeEquipmentStore",
    "source": "generated",
    "description": "An office equipment store.",
    "parentTypes": [
      "https://schema.org/Store"
    ]
  },
  {
    "name": "OnDemandEvent",
    "type": "https://schema.org/OnDemandEvent",
    "source": "generated",
    "description": "A publication event, e.g. catch-up TV or radio podcast, during which a program is available on-demand.",
    "parentTypes": [
      "https://schema.org/PublicationEvent"
    ]
  },
  {
    "name": "OnlineBusiness",
    "type": "https://schema.org/OnlineBusiness",
    "source": "generated",
    "description": "A particular online business, either standalone or the online part of a broader organization. Examples include an eCommerce site, an online travel booking site, an online learning site, an online logistics and shipping provider, an online (virtual) doctor, etc.",
    "parentTypes": [
      "https://schema.org/Organization"
    ]
  },
  {
    "name": "OnlineMarketplace",
    "type": "https://schema.org/OnlineMarketplace",
    "source": "generated",
    "description": "An eCommerce marketplace.",
    "parentTypes": [
      "https://schema.org/OnlineStore"
    ],
    "properties": [
      {
        "name": "hasStore",
        "type": "https://schema.org/OnlineStore",
        "description": "An eCommerce store part of an online marketplace.",
        "expectedTypes": [
          "https://schema.org/OnlineStore"
        ],
        "rangeTypes": [
          "https://schema.org/OnlineStore"
        ],
        "domainTypes": [
          "https://schema.org/OnlineMarketplace"
        ]
      }
    ]
  },
  {
    "name": "OnlineStore",
    "type": "https://schema.org/OnlineStore",
    "source": "generated",
    "description": "An eCommerce site.",
    "parentTypes": [
      "https://schema.org/OnlineBusiness"
    ],
    "properties": [
      {
        "name": "isStoreOn",
        "type": "https://schema.org/OnlineMarketplace",
        "description": "The eCommerce marketplace this online store is on.",
        "expectedTypes": [
          "https://schema.org/OnlineMarketplace"
        ],
        "rangeTypes": [
          "https://schema.org/OnlineMarketplace"
        ],
        "domainTypes": [
          "https://schema.org/OnlineStore"
        ]
      }
    ]
  },
  {
    "name": "OpeningHoursSpecification",
    "type": "https://schema.org/OpeningHoursSpecification",
    "source": "generated",
    "description": "A structured value providing information about the opening hours of a place or a certain service inside a place.\\n\\n\nThe place is __open__ if the [[opens]] property is specified, and __closed__ otherwise.\\n\\nIf the value for the [[closes]] property is less than the value for the [[opens]] property then the hour range is assumed to span over the next day.\n      ",
    "parentTypes": [
      "https://schema.org/StructuredValue"
    ],
    "properties": [
      {
        "name": "closes",
        "type": "https://schema.org/Time",
        "description": "The closing hour of the place or service on the given day(s) of the week.",
        "expectedTypes": [
          "https://schema.org/Time"
        ],
        "rangeTypes": [
          "https://schema.org/Time"
        ],
        "domainTypes": [
          "https://schema.org/OpeningHoursSpecification"
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
        "name": "opens",
        "type": "https://schema.org/Time",
        "description": "The opening hour of the place or service on the given day(s) of the week.",
        "expectedTypes": [
          "https://schema.org/Time"
        ],
        "rangeTypes": [
          "https://schema.org/Time"
        ],
        "domainTypes": [
          "https://schema.org/OpeningHoursSpecification"
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
    "name": "OperatingSystem",
    "type": "https://schema.org/OperatingSystem",
    "source": "generated",
    "description": "System software that manages computer hardware and software resources, and provides common services for computer programs.",
    "parentTypes": [
      "https://schema.org/SoftwareApplication"
    ]
  },
  {
    "name": "OpinionNewsArticle",
    "type": "https://schema.org/OpinionNewsArticle",
    "source": "generated",
    "description": "An [[OpinionNewsArticle]] is a [[NewsArticle]] that primarily expresses opinions rather than journalistic reporting of news and events. For example, a [[NewsArticle]] consisting of a column or [[Blog]]/[[BlogPosting]] entry in the Opinions section of a news publication. ",
    "parentTypes": [
      "https://schema.org/NewsArticle"
    ]
  },
  {
    "name": "Optician",
    "type": "https://schema.org/Optician",
    "source": "generated",
    "description": "A store that sells reading glasses and similar devices for improving vision.",
    "parentTypes": [
      "https://schema.org/MedicalBusiness"
    ]
  },
  {
    "name": "Order",
    "type": "https://schema.org/Order",
    "source": "generated",
    "description": "An order is a confirmation of a transaction (a receipt), which can contain multiple line items, each represented by an Offer that has been accepted by the customer.",
    "parentTypes": [
      "https://schema.org/Intangible",
      "https://spec.edmcouncil.org/fibo/ontology/FND/Arrangements/Documents/LegalDocument"
    ],
    "properties": [
      {
        "name": "acceptedOffer",
        "type": "https://schema.org/Offer",
        "description": "The offer(s) -- e.g., product, quantity and price combinations -- included in the order.",
        "expectedTypes": [
          "https://schema.org/Offer"
        ],
        "rangeTypes": [
          "https://schema.org/Offer"
        ],
        "domainTypes": [
          "https://schema.org/Order"
        ]
      },
      {
        "name": "billingAddress",
        "type": "https://schema.org/PostalAddress",
        "description": "The billing address for the order.",
        "expectedTypes": [
          "https://schema.org/PostalAddress"
        ],
        "rangeTypes": [
          "https://schema.org/PostalAddress"
        ],
        "domainTypes": [
          "https://schema.org/Order"
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
        "name": "discount",
        "type": [
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "description": "Any discount applied (to an Order).",
        "expectedTypes": [
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Number",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Order"
        ]
      },
      {
        "name": "discountCode",
        "type": "https://schema.org/Text",
        "description": "Code used to redeem a discount.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Order"
        ]
      },
      {
        "name": "discountCurrency",
        "type": "https://schema.org/Text",
        "description": "The currency of the discount.\\n\\nUse standard formats: [ISO 4217 currency format](http://en.wikipedia.org/wiki/ISO_4217), e.g. \"USD\"; [Ticker symbol](https://en.wikipedia.org/wiki/List_of_cryptocurrencies) for cryptocurrencies, e.g. \"BTC\"; well known names for [Local Exchange Trading Systems](https://en.wikipedia.org/wiki/Local_exchange_trading_system) (LETS) and other currency types, e.g. \"Ithaca HOUR\".",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Order"
        ]
      },
      {
        "name": "isGift",
        "type": "https://schema.org/Boolean",
        "description": "Indicates whether the offer was accepted as a gift for someone other than the buyer.",
        "expectedTypes": [
          "https://schema.org/Boolean"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean"
        ],
        "domainTypes": [
          "https://schema.org/Order"
        ]
      },
      {
        "name": "merchant",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "'merchant' is an out-dated term for 'seller'.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Order"
        ],
        "supersededBy": "https://schema.org/seller"
      },
      {
        "name": "orderDate",
        "type": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "description": "Date order was placed.",
        "expectedTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/Order"
        ]
      },
      {
        "name": "orderDelivery",
        "type": "https://schema.org/ParcelDelivery",
        "description": "The delivery of the parcel related to this order or order item.",
        "expectedTypes": [
          "https://schema.org/ParcelDelivery"
        ],
        "rangeTypes": [
          "https://schema.org/ParcelDelivery"
        ],
        "domainTypes": [
          "https://schema.org/Order",
          "https://schema.org/OrderItem"
        ]
      },
      {
        "name": "orderedItem",
        "type": [
          "https://schema.org/OrderItem",
          "https://schema.org/Product",
          "https://schema.org/Service"
        ],
        "description": "The item ordered.",
        "expectedTypes": [
          "https://schema.org/OrderItem",
          "https://schema.org/Product",
          "https://schema.org/Service"
        ],
        "rangeTypes": [
          "https://schema.org/OrderItem",
          "https://schema.org/Product",
          "https://schema.org/Service"
        ],
        "domainTypes": [
          "https://schema.org/Order",
          "https://schema.org/OrderItem"
        ]
      },
      {
        "name": "orderNumber",
        "type": "https://schema.org/Text",
        "description": "The identifier of the transaction.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Order"
        ]
      },
      {
        "name": "orderStatus",
        "type": "https://schema.org/OrderStatus",
        "description": "The current status of the order.",
        "expectedTypes": [
          "https://schema.org/OrderStatus"
        ],
        "rangeTypes": [
          "https://schema.org/OrderStatus"
        ],
        "domainTypes": [
          "https://schema.org/Order"
        ]
      },
      {
        "name": "partOfInvoice",
        "type": "https://schema.org/Invoice",
        "description": "The order is being paid as part of the referenced Invoice.",
        "expectedTypes": [
          "https://schema.org/Invoice"
        ],
        "rangeTypes": [
          "https://schema.org/Invoice"
        ],
        "domainTypes": [
          "https://schema.org/Order"
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
        "name": "paymentUrl",
        "type": "https://schema.org/URL",
        "description": "The URL for sending a payment.",
        "expectedTypes": [
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Order"
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
      }
    ]
  },
  {
    "name": "Order",
    "type": "http://unece.org/vocab#Order",
    "source": "generated"
  },
  {
    "name": "OrderAction",
    "type": "https://schema.org/OrderAction",
    "source": "generated",
    "description": "An agent orders an object/product/service to be delivered/sent.",
    "parentTypes": [
      "https://schema.org/TradeAction"
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
    "name": "OrderItem",
    "type": "https://schema.org/OrderItem",
    "source": "generated",
    "description": "An order item is a line of an order. It includes the quantity and shipping details of a bought offer.",
    "parentTypes": [
      "https://schema.org/StructuredValue"
    ],
    "properties": [
      {
        "name": "orderDelivery",
        "type": "https://schema.org/ParcelDelivery",
        "description": "The delivery of the parcel related to this order or order item.",
        "expectedTypes": [
          "https://schema.org/ParcelDelivery"
        ],
        "rangeTypes": [
          "https://schema.org/ParcelDelivery"
        ],
        "domainTypes": [
          "https://schema.org/Order",
          "https://schema.org/OrderItem"
        ]
      },
      {
        "name": "orderedItem",
        "type": [
          "https://schema.org/OrderItem",
          "https://schema.org/Product",
          "https://schema.org/Service"
        ],
        "description": "The item ordered.",
        "expectedTypes": [
          "https://schema.org/OrderItem",
          "https://schema.org/Product",
          "https://schema.org/Service"
        ],
        "rangeTypes": [
          "https://schema.org/OrderItem",
          "https://schema.org/Product",
          "https://schema.org/Service"
        ],
        "domainTypes": [
          "https://schema.org/Order",
          "https://schema.org/OrderItem"
        ]
      },
      {
        "name": "orderItemNumber",
        "type": "https://schema.org/Text",
        "description": "The identifier of the order item.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/OrderItem"
        ]
      },
      {
        "name": "orderItemStatus",
        "type": "https://schema.org/OrderStatus",
        "description": "The current status of the order item.",
        "expectedTypes": [
          "https://schema.org/OrderStatus"
        ],
        "rangeTypes": [
          "https://schema.org/OrderStatus"
        ],
        "domainTypes": [
          "https://schema.org/OrderItem"
        ]
      },
      {
        "name": "orderQuantity",
        "type": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "description": "The number of the item ordered. If the property is not set, assume the quantity is one.",
        "expectedTypes": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/Number",
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/OrderItem"
        ]
      }
    ]
  },
  {
    "name": "OrderStatus",
    "type": "https://schema.org/OrderStatus",
    "source": "generated",
    "description": "Enumerated status values for Order.",
    "parentTypes": [
      "https://schema.org/StatusEnumeration"
    ],
    "enumerationValues": [
      {
        "name": "OrderCancelled",
        "type": "https://schema.org/OrderCancelled",
        "description": "OrderStatus representing cancellation of an order."
      },
      {
        "name": "OrderDelivered",
        "type": "https://schema.org/OrderDelivered",
        "description": "OrderStatus representing successful delivery of an order."
      },
      {
        "name": "OrderInTransit",
        "type": "https://schema.org/OrderInTransit",
        "description": "OrderStatus representing that an order is in transit."
      },
      {
        "name": "OrderPaymentDue",
        "type": "https://schema.org/OrderPaymentDue",
        "description": "OrderStatus representing that payment is due on an order."
      },
      {
        "name": "OrderPickupAvailable",
        "type": "https://schema.org/OrderPickupAvailable",
        "description": "OrderStatus representing availability of an order for pickup."
      },
      {
        "name": "OrderProblem",
        "type": "https://schema.org/OrderProblem",
        "description": "OrderStatus representing that there is a problem with the order."
      },
      {
        "name": "OrderProcessing",
        "type": "https://schema.org/OrderProcessing",
        "description": "OrderStatus representing that an order is being processed."
      },
      {
        "name": "OrderReturned",
        "type": "https://schema.org/OrderReturned",
        "description": "OrderStatus representing that an order has been returned."
      }
    ]
  },
  {
    "name": "Organization",
    "type": "https://spec.edmcouncil.org/fibo/ontology/FND/Organizations/Organizations/Organization",
    "source": "generated"
  },
  {
    "name": "Organization",
    "type": "https://ref.gs1.org/voc/Organization",
    "source": "generated"
  },
  {
    "name": "Organization",
    "type": "https://schema.org/Organization",
    "source": "generated",
    "description": "An organization such as a school, NGO, corporation, club, etc.",
    "parentTypes": [
      "https://schema.org/Thing"
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
        "name": "actionableFeedbackPolicy",
        "type": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "description": "For a [[NewsMediaOrganization]] or other news-related [[Organization]], a statement about public engagement activities (for news media, the newsroom’s), including involving the public - digitally or otherwise -- in coverage decisions, reporting and activities after publication.",
        "expectedTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/NewsMediaOrganization",
          "https://schema.org/Organization"
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
        "name": "companyRegistration",
        "type": "https://schema.org/Certification",
        "description": "The official registration information of a business including the organization that issued it such as Company House or Chamber of Commerce in form of a Certification.",
        "expectedTypes": [
          "https://schema.org/Certification"
        ],
        "rangeTypes": [
          "https://schema.org/Certification"
        ],
        "domainTypes": [
          "https://schema.org/Organization"
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
        "name": "correctionsPolicy",
        "type": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "description": "For an [[Organization]] (e.g. [[NewsMediaOrganization]]), a statement describing (in news media, the newsroom’s) disclosure and correction policy for errors.",
        "expectedTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/NewsMediaOrganization",
          "https://schema.org/Organization"
        ]
      },
      {
        "name": "department",
        "type": "https://schema.org/Organization",
        "description": "A relationship between an organization and a department of that organization, also described as an organization (allowing different urls, logos, opening hours). For example: a store with a pharmacy, or a bakery with a cafe.",
        "expectedTypes": [
          "https://schema.org/Organization"
        ],
        "rangeTypes": [
          "https://schema.org/Organization"
        ],
        "domainTypes": [
          "https://schema.org/Organization"
        ]
      },
      {
        "name": "dissolutionDate",
        "type": "https://schema.org/Date",
        "description": "The date that this organization was dissolved.",
        "expectedTypes": [
          "https://schema.org/Date"
        ],
        "rangeTypes": [
          "https://schema.org/Date"
        ],
        "domainTypes": [
          "https://schema.org/Organization"
        ]
      },
      {
        "name": "diversityPolicy",
        "type": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "description": "Statement on diversity policy by an [[Organization]] e.g. a [[NewsMediaOrganization]]. For a [[NewsMediaOrganization]], a statement describing the newsroom’s diversity policy on both staffing and sources, typically providing staffing data.",
        "expectedTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/NewsMediaOrganization",
          "https://schema.org/Organization"
        ]
      },
      {
        "name": "diversityStaffingReport",
        "type": [
          "https://schema.org/Article",
          "https://schema.org/URL"
        ],
        "description": "For an [[Organization]] (often but not necessarily a [[NewsMediaOrganization]]), a report on staffing diversity issues. In a news context this might be for example ASNE or RTDNA (US) reports, or self-reported.",
        "expectedTypes": [
          "https://schema.org/Article",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Article",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/NewsMediaOrganization",
          "https://schema.org/Organization"
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
        "name": "employee",
        "type": "https://schema.org/Person",
        "description": "Someone working for this organization.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Organization"
        ]
      },
      {
        "name": "employees",
        "type": "https://schema.org/Person",
        "description": "People working for this organization.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Organization"
        ],
        "supersededBy": "https://schema.org/employee"
      },
      {
        "name": "ethicsPolicy",
        "type": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "description": "Statement about ethics policy, e.g. of a [[NewsMediaOrganization]] regarding journalistic and publishing practices, or of a [[Restaurant]], a page describing food source policies. In the case of a [[NewsMediaOrganization]], an ethicsPolicy is typically a statement describing the personal, organizational, and corporate standards of behavior expected by the organization.",
        "expectedTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/NewsMediaOrganization",
          "https://schema.org/Organization"
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
        "name": "founder",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "A person or organization who founded this organization.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Organization"
        ]
      },
      {
        "name": "founders",
        "type": "https://schema.org/Person",
        "description": "A person who founded this organization.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Organization"
        ],
        "supersededBy": "https://schema.org/founder"
      },
      {
        "name": "foundingDate",
        "type": "https://schema.org/Date",
        "description": "The date that this organization was founded.",
        "expectedTypes": [
          "https://schema.org/Date"
        ],
        "rangeTypes": [
          "https://schema.org/Date"
        ],
        "domainTypes": [
          "https://schema.org/Organization"
        ]
      },
      {
        "name": "foundingLocation",
        "type": "https://schema.org/Place",
        "description": "The place where the Organization was founded.",
        "expectedTypes": [
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/Organization"
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
        "name": "hasMemberProgram",
        "type": "https://schema.org/MemberProgram",
        "description": "MemberProgram offered by an Organization, for example an eCommerce merchant or an airline.",
        "expectedTypes": [
          "https://schema.org/MemberProgram"
        ],
        "rangeTypes": [
          "https://schema.org/MemberProgram"
        ],
        "domainTypes": [
          "https://schema.org/Organization"
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
        "name": "hasShippingService",
        "type": "https://schema.org/ShippingService",
        "description": "Specification of a shipping service offered by the organization.",
        "expectedTypes": [
          "https://schema.org/ShippingService"
        ],
        "rangeTypes": [
          "https://schema.org/ShippingService"
        ],
        "domainTypes": [
          "https://schema.org/OfferShippingDetails",
          "https://schema.org/Organization"
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
        "name": "iso6523Code",
        "type": "https://schema.org/Text",
        "description": "An organization identifier as defined in [ISO 6523(-1)](https://en.wikipedia.org/wiki/ISO/IEC_6523). The identifier should be in the `XXXX:YYYYYY:ZZZ` or `XXXX:YYYYYY`format. Where `XXXX` is a 4 digit _ICD_ (International Code Designator), `YYYYYY` is an _OID_ (Organization Identifier) with all formatting characters (dots, dashes, spaces) removed with a maximal length of 35 characters, and `ZZZ` is an optional OPI (Organization Part Identifier) with a maximum length of 35 characters. The various components (ICD, OID, OPI) are joined with a colon character (ASCII `0x3a`). Note that many existing organization identifiers defined as attributes like [leiCode](https://schema.org/leiCode) (`0199`), [duns](https://schema.org/duns) (`0060`) or [GLN](https://schema.org/globalLocationNumber) (`0088`) can be expressed using ISO-6523. If possible, ISO-6523 codes should be preferred to populating [vatID](https://schema.org/vatID) or [taxID](https://schema.org/taxID), as ISO identifiers are less ambiguous.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Organization"
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
        "name": "legalAddress",
        "type": "https://schema.org/PostalAddress",
        "description": "The legal address of an organization which acts as the officially registered address used for legal and tax purposes. The legal address can be different from the place of operations of a business and other addresses can be part of an organization.",
        "expectedTypes": [
          "https://schema.org/PostalAddress"
        ],
        "rangeTypes": [
          "https://schema.org/PostalAddress"
        ],
        "domainTypes": [
          "https://schema.org/Organization"
        ]
      },
      {
        "name": "legalName",
        "type": "https://schema.org/Text",
        "description": "The official name of the organization, e.g. the registered company name.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Organization"
        ]
      },
      {
        "name": "legalRepresentative",
        "type": "https://schema.org/Person",
        "description": "One or multiple persons who represent this organization legally such as CEO or sole administrator.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Organization"
        ]
      },
      {
        "name": "leiCode",
        "type": "https://schema.org/Text",
        "description": "An organization identifier that uniquely identifies a legal entity as defined in ISO 17442.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Organization"
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
        "name": "nonprofitStatus",
        "type": "https://schema.org/NonprofitType",
        "description": "nonprofitStatus indicates the legal status of a non-profit organization in its primary place of business.",
        "expectedTypes": [
          "https://schema.org/NonprofitType"
        ],
        "rangeTypes": [
          "https://schema.org/NonprofitType"
        ],
        "domainTypes": [
          "https://schema.org/Organization"
        ]
      },
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
        "name": "ownershipFundingInfo",
        "type": [
          "https://schema.org/AboutPage",
          "https://schema.org/CreativeWork",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "For an [[Organization]] (often but not necessarily a [[NewsMediaOrganization]]), a description of organizational ownership structure; funding and grants. In a news/media setting, this is with particular reference to editorial independence.   Note that the [[funder]] is also available and can be used to make basic funder information machine-readable.",
        "expectedTypes": [
          "https://schema.org/AboutPage",
          "https://schema.org/CreativeWork",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/AboutPage",
          "https://schema.org/CreativeWork",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/NewsMediaOrganization",
          "https://schema.org/Organization"
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
        "name": "parentOrganization",
        "type": "https://schema.org/Organization",
        "description": "The larger organization that this organization is a [[subOrganization]] of, if any.",
        "expectedTypes": [
          "https://schema.org/Organization"
        ],
        "rangeTypes": [
          "https://schema.org/Organization"
        ],
        "domainTypes": [
          "https://schema.org/Organization"
        ],
        "inverseOf": "https://schema.org/subOrganization"
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
        "name": "subOrganization",
        "type": "https://schema.org/Organization",
        "description": "A relationship between two organizations where the first includes the second, e.g., as a subsidiary. See also: the more specific 'department' property.",
        "expectedTypes": [
          "https://schema.org/Organization"
        ],
        "rangeTypes": [
          "https://schema.org/Organization"
        ],
        "domainTypes": [
          "https://schema.org/Organization"
        ],
        "inverseOf": "https://schema.org/parentOrganization"
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
        "name": "unnamedSourcesPolicy",
        "type": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "description": "For an [[Organization]] (typically a [[NewsMediaOrganization]]), a statement about policy on use of unnamed sources and the decision process required.",
        "expectedTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/NewsMediaOrganization",
          "https://schema.org/Organization"
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
      }
    ]
  },
  {
    "name": "OrganizationRole",
    "type": "https://schema.org/OrganizationRole",
    "source": "generated",
    "description": "A subclass of Role used to describe roles within organizations.",
    "parentTypes": [
      "https://schema.org/Role"
    ],
    "properties": [
      {
        "name": "numberedPosition",
        "type": "https://schema.org/Number",
        "description": "A number associated with a role in an organization, for example, the number on an athlete's jersey.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/OrganizationRole"
        ]
      }
    ]
  },
  {
    "name": "OrganizeAction",
    "type": "https://schema.org/OrganizeAction",
    "source": "generated",
    "description": "The act of manipulating/administering/supervising/controlling one or more objects.",
    "parentTypes": [
      "https://schema.org/Action"
    ]
  },
  {
    "name": "OutletStore",
    "type": "https://schema.org/OutletStore",
    "source": "generated",
    "description": "An outlet store.",
    "parentTypes": [
      "https://schema.org/Store"
    ]
  },
  {
    "name": "OwnershipInfo",
    "type": "https://schema.org/OwnershipInfo",
    "source": "generated",
    "description": "A structured value providing information about when a certain organization or person owned a certain product.",
    "parentTypes": [
      "https://schema.org/StructuredValue"
    ],
    "properties": [
      {
        "name": "acquiredFrom",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "The organization or person from which the product was acquired.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/OwnershipInfo"
        ]
      },
      {
        "name": "ownedFrom",
        "type": "https://schema.org/DateTime",
        "description": "The date and time of obtaining the product.",
        "expectedTypes": [
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/OwnershipInfo"
        ]
      },
      {
        "name": "ownedThrough",
        "type": "https://schema.org/DateTime",
        "description": "The date and time of giving up ownership on the product.",
        "expectedTypes": [
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/OwnershipInfo"
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
      }
    ]
  },
  {
    "name": "PaintAction",
    "type": "https://schema.org/PaintAction",
    "source": "generated",
    "description": "The act of producing a painting, typically with paint and canvas as instruments.",
    "parentTypes": [
      "https://schema.org/CreateAction"
    ]
  },
  {
    "name": "Painting",
    "type": "https://schema.org/Painting",
    "source": "generated",
    "description": "A painting.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ]
  },
  {
    "name": "PalliativeProcedure",
    "type": "https://schema.org/PalliativeProcedure",
    "source": "generated",
    "description": "A medical procedure intended primarily for palliative purposes, aimed at relieving the symptoms of an underlying health condition.",
    "parentTypes": [
      "https://schema.org/MedicalProcedure",
      "https://schema.org/MedicalTherapy"
    ]
  },
  {
    "name": "ParcelDelivery",
    "type": "https://schema.org/ParcelDelivery",
    "source": "generated",
    "description": "The delivery of a parcel either via the postal service or a commercial service.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
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
        "name": "deliveryAddress",
        "type": "https://schema.org/PostalAddress",
        "description": "Destination address.",
        "expectedTypes": [
          "https://schema.org/PostalAddress"
        ],
        "rangeTypes": [
          "https://schema.org/PostalAddress"
        ],
        "domainTypes": [
          "https://schema.org/ParcelDelivery"
        ]
      },
      {
        "name": "deliveryStatus",
        "type": "https://schema.org/DeliveryEvent",
        "description": "New entry added as the package passes through each leg of its journey (from shipment to final delivery).",
        "expectedTypes": [
          "https://schema.org/DeliveryEvent"
        ],
        "rangeTypes": [
          "https://schema.org/DeliveryEvent"
        ],
        "domainTypes": [
          "https://schema.org/ParcelDelivery"
        ]
      },
      {
        "name": "expectedArrivalFrom",
        "type": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "description": "The earliest date the package may arrive.",
        "expectedTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/ParcelDelivery"
        ]
      },
      {
        "name": "expectedArrivalUntil",
        "type": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "description": "The latest date the package may arrive.",
        "expectedTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/ParcelDelivery"
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
      },
      {
        "name": "itemShipped",
        "type": "https://schema.org/Product",
        "description": "Item(s) being shipped.",
        "expectedTypes": [
          "https://schema.org/Product"
        ],
        "rangeTypes": [
          "https://schema.org/Product"
        ],
        "domainTypes": [
          "https://schema.org/ParcelDelivery"
        ]
      },
      {
        "name": "originAddress",
        "type": "https://schema.org/PostalAddress",
        "description": "Shipper's address.",
        "expectedTypes": [
          "https://schema.org/PostalAddress"
        ],
        "rangeTypes": [
          "https://schema.org/PostalAddress"
        ],
        "domainTypes": [
          "https://schema.org/ParcelDelivery"
        ]
      },
      {
        "name": "partOfOrder",
        "type": "https://schema.org/Order",
        "description": "The overall order the items in this delivery were included in.",
        "expectedTypes": [
          "https://schema.org/Order"
        ],
        "rangeTypes": [
          "https://schema.org/Order"
        ],
        "domainTypes": [
          "https://schema.org/ParcelDelivery"
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
        "name": "trackingNumber",
        "type": "https://schema.org/Text",
        "description": "Shipper tracking number.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/ParcelDelivery"
        ]
      },
      {
        "name": "trackingUrl",
        "type": "https://schema.org/URL",
        "description": "Tracking url for the parcel delivery.",
        "expectedTypes": [
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/ParcelDelivery"
        ]
      }
    ]
  },
  {
    "name": "ParentAudience",
    "type": "https://schema.org/ParentAudience",
    "source": "generated",
    "description": "A set of characteristics describing parents, who can be interested in viewing some content.",
    "parentTypes": [
      "https://schema.org/PeopleAudience"
    ],
    "properties": [
      {
        "name": "childMaxAge",
        "type": "https://schema.org/Number",
        "description": "Maximal age of the child.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/ParentAudience"
        ]
      },
      {
        "name": "childMinAge",
        "type": "https://schema.org/Number",
        "description": "Minimal age of the child.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/ParentAudience"
        ]
      }
    ]
  },
  {
    "name": "Park",
    "type": "https://schema.org/Park",
    "source": "generated",
    "description": "A park.",
    "parentTypes": [
      "https://schema.org/CivicStructure"
    ]
  },
  {
    "name": "ParkingFacility",
    "type": "https://schema.org/ParkingFacility",
    "source": "generated",
    "description": "A parking lot or other parking facility.",
    "parentTypes": [
      "https://schema.org/CivicStructure"
    ]
  },
  {
    "name": "PathologyTest",
    "type": "https://schema.org/PathologyTest",
    "source": "generated",
    "description": "A medical test performed by a laboratory that typically involves examination of a tissue sample by a pathologist.",
    "parentTypes": [
      "https://schema.org/MedicalTest"
    ],
    "properties": [
      {
        "name": "tissueSample",
        "type": "https://schema.org/Text",
        "description": "The type of tissue sample required for the test.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/PathologyTest"
        ]
      }
    ]
  },
  {
    "name": "Patient",
    "type": "https://schema.org/Patient",
    "source": "generated",
    "description": "A patient is any person recipient of health care services.",
    "parentTypes": [
      "https://schema.org/MedicalAudience",
      "https://schema.org/Person"
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
      },
      {
        "name": "healthCondition",
        "type": "https://schema.org/MedicalCondition",
        "description": "Specifying the health condition(s) of a patient, medical study, or other target audience.",
        "expectedTypes": [
          "https://schema.org/MedicalCondition"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalCondition"
        ],
        "domainTypes": [
          "https://schema.org/MedicalStudy",
          "https://schema.org/Patient",
          "https://schema.org/PeopleAudience"
        ]
      }
    ]
  },
  {
    "name": "PawnShop",
    "type": "https://schema.org/PawnShop",
    "source": "generated",
    "description": "A shop that will buy, or lend money against the security of, personal possessions.",
    "parentTypes": [
      "https://schema.org/Store"
    ]
  },
  {
    "name": "PayAction",
    "type": "https://schema.org/PayAction",
    "source": "generated",
    "description": "An agent pays a price to a participant.",
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
    "name": "PaymentCard",
    "type": "https://schema.org/PaymentCard",
    "source": "generated",
    "description": "A payment method using a credit, debit, store or other card to associate the payment with an account.",
    "parentTypes": [
      "https://schema.org/FinancialProduct",
      "https://schema.org/PaymentMethod"
    ],
    "properties": [
      {
        "name": "cashBack",
        "type": [
          "https://schema.org/Boolean",
          "https://schema.org/Number"
        ],
        "description": "A cardholder benefit that pays the cardholder a small percentage of their net expenditures.",
        "expectedTypes": [
          "https://schema.org/Boolean",
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean",
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/PaymentCard"
        ]
      },
      {
        "name": "contactlessPayment",
        "type": "https://schema.org/Boolean",
        "description": "A secure method for consumers to purchase products or services via debit, credit or smartcards by using RFID or NFC technology.",
        "expectedTypes": [
          "https://schema.org/Boolean"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean"
        ],
        "domainTypes": [
          "https://schema.org/PaymentCard"
        ]
      },
      {
        "name": "floorLimit",
        "type": "https://schema.org/MonetaryAmount",
        "description": "A floor limit is the amount of money above which credit card transactions must be authorized.",
        "expectedTypes": [
          "https://schema.org/MonetaryAmount"
        ],
        "rangeTypes": [
          "https://schema.org/MonetaryAmount"
        ],
        "domainTypes": [
          "https://schema.org/PaymentCard"
        ]
      },
      {
        "name": "monthlyMinimumRepaymentAmount",
        "type": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/Number"
        ],
        "description": "The minimum payment is the lowest amount of money that one is required to pay on a credit card statement each month.",
        "expectedTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/PaymentCard"
        ]
      }
    ]
  },
  {
    "name": "PaymentChargeSpecification",
    "type": "https://schema.org/PaymentChargeSpecification",
    "source": "generated",
    "description": "The costs of settling the payment using a particular payment method.",
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
        "name": "appliesToPaymentMethod",
        "type": "https://schema.org/PaymentMethod",
        "description": "The payment method(s) to which the payment charge specification applies.",
        "expectedTypes": [
          "https://schema.org/PaymentMethod"
        ],
        "rangeTypes": [
          "https://schema.org/PaymentMethod"
        ],
        "domainTypes": [
          "https://schema.org/PaymentChargeSpecification"
        ]
      }
    ]
  },
  {
    "name": "PaymentMeans",
    "type": "http://unece.org/vocab#PaymentMeans",
    "source": "generated"
  },
  {
    "name": "PaymentMechanism",
    "type": "https://spec.edmcouncil.org/fibo/ontology/FBC/ProductsAndServices/FinancialProductsAndServices/PaymentMechanism",
    "source": "generated"
  },
  {
    "name": "PaymentMethod",
    "type": "https://schema.org/PaymentMethod",
    "source": "generated",
    "description": "A payment method is a standardized procedure for transferring the monetary amount for a purchase. Payment methods are characterized by the legal and technical structures used, and by the organization or group carrying out the transaction. The following legacy values should be accepted: \\n\\n* http://purl.org/goodrelations/v1#ByBankTransferInAdvance\\n* http://purl.org/goodrelations/v1#ByInvoice\\n* http://purl.org/goodrelations/v1#Cash\\n* http://purl.org/goodrelations/v1#CheckInAdvance\\n* http://purl.org/goodrelations/v1#COD\\n* http://purl.org/goodrelations/v1#DirectDebit\\n* http://purl.org/goodrelations/v1#GoogleCheckout\\n* http://purl.org/goodrelations/v1#PayPal\\n* http://purl.org/goodrelations/v1#PaySwarm\\n\\nStructured values, or [UNCE payment means](https://vocabulary.uncefact.org/PaymentMeans) are recommended or for newer annotations.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "paymentMethodType",
        "type": "https://schema.org/PaymentMethodType",
        "description": "The type of a payment method.",
        "expectedTypes": [
          "https://schema.org/PaymentMethodType"
        ],
        "rangeTypes": [
          "https://schema.org/PaymentMethodType"
        ],
        "domainTypes": [
          "https://schema.org/PaymentMethod"
        ]
      }
    ]
  },
  {
    "name": "PaymentMethodType",
    "type": "https://schema.org/PaymentMethodType",
    "source": "generated",
    "description": "The type of payment method, only for generic payment types, specific forms of payments, like card payment should be expressed using subclasses of PaymentMethod.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "ByBankTransferInAdvance",
        "type": "https://schema.org/ByBankTransferInAdvance",
        "description": "Payment in advance by bank transfer, equivalent to <code>http://purl.org/goodrelations/v1#ByBankTransferInAdvance</code>."
      },
      {
        "name": "ByInvoice",
        "type": "https://schema.org/ByInvoice",
        "description": "Payment by invoice, typically after the goods were delivered, equivalent to <code>http://purl.org/goodrelations/v1#ByInvoice</code>."
      },
      {
        "name": "Cash",
        "type": "https://schema.org/Cash",
        "description": "Payment using cash, on premises, equivalent to <code>http://purl.org/goodrelations/v1#Cash</code>."
      },
      {
        "name": "CheckInAdvance",
        "type": "https://schema.org/CheckInAdvance",
        "description": "Payment in advance by sending a check, equivalent to <code>http://purl.org/goodrelations/v1#CheckInAdvance</code>."
      },
      {
        "name": "COD",
        "type": "https://schema.org/COD",
        "description": "Cash on Delivery (COD) payment, equivalent to <code>http://purl.org/goodrelations/v1#COD</code>."
      },
      {
        "name": "DirectDebit",
        "type": "https://schema.org/DirectDebit",
        "description": "Payment in advance by direct debit from the bank, equivalent to <code>http://purl.org/goodrelations/v1#DirectDebit</code>."
      },
      {
        "name": "InStorePrepay",
        "type": "https://schema.org/InStorePrepay",
        "description": "Payment in advance in some form of shop or kiosk for goods purchased online."
      },
      {
        "name": "PhoneCarrierPayment",
        "type": "https://schema.org/PhoneCarrierPayment",
        "description": "Payment by billing via the phone carrier."
      }
    ]
  },
  {
    "name": "PaymentService",
    "type": "https://spec.edmcouncil.org/fibo/ontology/PAY/PaymentServices/PaymentServices/PaymentService",
    "source": "generated"
  },
  {
    "name": "PaymentService",
    "type": "https://schema.org/PaymentService",
    "source": "generated",
    "description": "A Service to transfer funds from a person or organization to a beneficiary person or organization.",
    "parentTypes": [
      "https://schema.org/FinancialProduct",
      "https://schema.org/PaymentMethod"
    ]
  },
  {
    "name": "PaymentStatusType",
    "type": "https://schema.org/PaymentStatusType",
    "source": "generated",
    "description": "A specific payment status. For example, PaymentDue, PaymentComplete, etc.",
    "parentTypes": [
      "https://schema.org/StatusEnumeration"
    ],
    "enumerationValues": [
      {
        "name": "PaymentAutomaticallyApplied",
        "type": "https://schema.org/PaymentAutomaticallyApplied",
        "description": "An automatic payment system is in place and will be used."
      },
      {
        "name": "PaymentComplete",
        "type": "https://schema.org/PaymentComplete",
        "description": "The payment has been received and processed."
      },
      {
        "name": "PaymentDeclined",
        "type": "https://schema.org/PaymentDeclined",
        "description": "The payee received the payment, but it was declined for some reason."
      },
      {
        "name": "PaymentDue",
        "type": "https://schema.org/PaymentDue",
        "description": "The payment is due, but still within an acceptable time to be received."
      },
      {
        "name": "PaymentPastDue",
        "type": "https://schema.org/PaymentPastDue",
        "description": "The payment is due and considered late."
      }
    ]
  },
  {
    "name": "PeopleAudience",
    "type": "https://schema.org/PeopleAudience",
    "source": "generated",
    "description": "A set of characteristics belonging to people, e.g. who compose an item's target audience.",
    "parentTypes": [
      "https://schema.org/Audience"
    ],
    "properties": [
      {
        "name": "healthCondition",
        "type": "https://schema.org/MedicalCondition",
        "description": "Specifying the health condition(s) of a patient, medical study, or other target audience.",
        "expectedTypes": [
          "https://schema.org/MedicalCondition"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalCondition"
        ],
        "domainTypes": [
          "https://schema.org/MedicalStudy",
          "https://schema.org/Patient",
          "https://schema.org/PeopleAudience"
        ]
      },
      {
        "name": "requiredGender",
        "type": "https://schema.org/Text",
        "description": "Audiences defined by a person's gender.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/PeopleAudience"
        ]
      },
      {
        "name": "requiredMaxAge",
        "type": "https://schema.org/Integer",
        "description": "Audiences defined by a person's maximum age.",
        "expectedTypes": [
          "https://schema.org/Integer"
        ],
        "rangeTypes": [
          "https://schema.org/Integer"
        ],
        "domainTypes": [
          "https://schema.org/PeopleAudience"
        ]
      },
      {
        "name": "requiredMinAge",
        "type": "https://schema.org/Integer",
        "description": "Audiences defined by a person's minimum age.",
        "expectedTypes": [
          "https://schema.org/Integer"
        ],
        "rangeTypes": [
          "https://schema.org/Integer"
        ],
        "domainTypes": [
          "https://schema.org/PeopleAudience"
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
        "name": "suggestedMaxAge",
        "type": "https://schema.org/Number",
        "description": "Maximum recommended age in years for the audience or user.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/PeopleAudience"
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
      },
      {
        "name": "suggestedMinAge",
        "type": "https://schema.org/Number",
        "description": "Minimum recommended age in years for the audience or user.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/PeopleAudience"
        ]
      }
    ]
  },
  {
    "name": "PerformAction",
    "type": "https://schema.org/PerformAction",
    "source": "generated",
    "description": "The act of participating in performance arts.",
    "parentTypes": [
      "https://schema.org/PlayAction"
    ],
    "properties": [
      {
        "name": "entertainmentBusiness",
        "type": "https://schema.org/EntertainmentBusiness",
        "description": "A sub property of location. The entertainment business where the action occurred.",
        "expectedTypes": [
          "https://schema.org/EntertainmentBusiness"
        ],
        "rangeTypes": [
          "https://schema.org/EntertainmentBusiness"
        ],
        "domainTypes": [
          "https://schema.org/PerformAction"
        ]
      }
    ]
  },
  {
    "name": "PerformanceRole",
    "type": "https://schema.org/PerformanceRole",
    "source": "generated",
    "description": "A PerformanceRole is a Role that some entity places with regard to a theatrical performance, e.g. in a Movie, TVSeries etc.",
    "parentTypes": [
      "https://schema.org/Role"
    ],
    "properties": [
      {
        "name": "characterName",
        "type": "https://schema.org/Text",
        "description": "The name of a character played in some acting or performing role, i.e. in a PerformanceRole.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/PerformanceRole"
        ]
      }
    ]
  },
  {
    "name": "PerformingArtsEvent",
    "type": "https://schema.org/PerformingArtsEvent",
    "source": "generated",
    "description": "Live performance <a class=\"localLink\" href=\"http://schema.org/Event\">Event of the performing arts (music, theatre, dance, acrobatics, spoken word), including performance art and performative sports (e.g. choreographed forms of martial arts, figure skating, competitive ballroom dancing).<br/><br/>Note: Use <a class=\"localLink\" href=\"http://schema.org/additionalType\">additionalType</a> to differentiate between productions / shows (PerformanceWork, EventSeries), tours (EventSeries), and individual performances.",
    "parentTypes": [
      "https://schema.org/Event"
    ]
  },
  {
    "name": "PerformingArtsTheater",
    "type": "https://schema.org/PerformingArtsTheater",
    "source": "generated",
    "description": "A theater or other performing art center.",
    "parentTypes": [
      "https://schema.org/CivicStructure"
    ]
  },
  {
    "name": "PerformingGroup",
    "type": "https://schema.org/PerformingGroup",
    "source": "generated",
    "description": "A performance group, such as a band, an orchestra, or a circus.",
    "parentTypes": [
      "https://schema.org/Organization"
    ]
  },
  {
    "name": "Periodical",
    "type": "http://purl.org/ontology/bibo/Periodical",
    "source": "generated"
  },
  {
    "name": "Periodical",
    "type": "https://schema.org/Periodical",
    "source": "generated",
    "description": "A publication in any medium issued in successive parts bearing numerical or chronological designations and intended to continue indefinitely, such as a magazine, scholarly journal, or newspaper.\\n\\nSee also [blog post](https://blog.schema.org/2014/09/02/schema-org-support-for-bibliographic-relationships-and-periodicals/).",
    "parentTypes": [
      "https://schema.org/CreativeWorkSeries"
    ]
  },
  {
    "name": "Permit",
    "type": "https://schema.org/Permit",
    "source": "generated",
    "description": "A permit issued by an organization, e.g. a parking pass.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
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
        "name": "issuedThrough",
        "type": "https://schema.org/Service",
        "description": "The service through which the permit was granted.",
        "expectedTypes": [
          "https://schema.org/Service"
        ],
        "rangeTypes": [
          "https://schema.org/Service"
        ],
        "domainTypes": [
          "https://schema.org/Permit"
        ]
      },
      {
        "name": "permitAudience",
        "type": "https://schema.org/Audience",
        "description": "The target audience for this permit.",
        "expectedTypes": [
          "https://schema.org/Audience"
        ],
        "rangeTypes": [
          "https://schema.org/Audience"
        ],
        "domainTypes": [
          "https://schema.org/Permit"
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
      },
      {
        "name": "validUntil",
        "type": "https://schema.org/Date",
        "description": "The date when the item is no longer valid.",
        "expectedTypes": [
          "https://schema.org/Date"
        ],
        "rangeTypes": [
          "https://schema.org/Date"
        ],
        "domainTypes": [
          "https://schema.org/Permit"
        ]
      }
    ]
  },
  {
    "name": "Person",
    "type": "http://xmlns.com/foaf/0.1/Person",
    "source": "generated"
  }
] satisfies readonly SchemaDefinition[];
