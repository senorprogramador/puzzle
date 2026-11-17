/*
 * This file is generated. Do not edit manually.
 * Schema.org version: 30.1
 * Source SHA-256: 0a4b8c4c910fc831ec8695196510973390906a5ee34dc6b862dfec4d21a12f74
 */

import type { SchemaDefinition } from "../../types";

export const generatedSchemaDefinitions3: readonly SchemaDefinition[] =
[
  {
    "name": "JobPosting",
    "type": "https://schema.org/JobPosting",
    "source": "generated",
    "description": "A listing that describes a job opening in a certain organization.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "applicantLocationRequirements",
        "type": "https://schema.org/AdministrativeArea",
        "description": "The location(s) applicants can apply from. This is usually used for telecommuting jobs where the applicant does not need to be in a physical office. Note: This should not be used for citizenship or work visa requirements.",
        "expectedTypes": [
          "https://schema.org/AdministrativeArea"
        ],
        "rangeTypes": [
          "https://schema.org/AdministrativeArea"
        ],
        "domainTypes": [
          "https://schema.org/JobPosting"
        ]
      },
      {
        "name": "applicationContact",
        "type": "https://schema.org/ContactPoint",
        "description": "Contact details for further information relevant to this job posting.",
        "expectedTypes": [
          "https://schema.org/ContactPoint"
        ],
        "rangeTypes": [
          "https://schema.org/ContactPoint"
        ],
        "domainTypes": [
          "https://schema.org/JobPosting"
        ]
      },
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
        "name": "benefits",
        "type": "https://schema.org/Text",
        "description": "Description of benefits associated with the job.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/JobPosting"
        ],
        "supersededBy": "https://schema.org/jobBenefits"
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
        "name": "directApply",
        "type": "https://schema.org/Boolean",
        "description": "Indicates whether an [[url]] that is associated with a [[JobPosting]] enables direct application for the job, via the posting website. A job posting is considered to have directApply of [[True]] if an application process for the specified job can be directly initiated via the url(s) given (noting that e.g. multiple internet domains might nevertheless be involved at an implementation level). A value of [[False]] is appropriate if there is no clear path to applying directly online for the specified job, navigating directly from the JobPosting url(s) supplied.",
        "expectedTypes": [
          "https://schema.org/Boolean"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean"
        ],
        "domainTypes": [
          "https://schema.org/JobPosting"
        ]
      },
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
        "name": "eligibilityToWorkRequirement",
        "type": "https://schema.org/Text",
        "description": "The legal requirements such as citizenship, visa and other documentation required for an applicant to this job.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/JobPosting"
        ]
      },
      {
        "name": "employerOverview",
        "type": "https://schema.org/Text",
        "description": "A description of the employer, career opportunities and work environment for this position.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/JobPosting"
        ]
      },
      {
        "name": "employmentType",
        "type": "https://schema.org/Text",
        "description": "Type of employment (e.g. full-time, part-time, contract, temporary, seasonal, internship).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/JobPosting"
        ]
      },
      {
        "name": "employmentUnit",
        "type": "https://schema.org/Organization",
        "description": "Indicates the department, unit and/or facility where the employee reports and/or in which the job is to be performed.",
        "expectedTypes": [
          "https://schema.org/Organization"
        ],
        "rangeTypes": [
          "https://schema.org/Organization"
        ],
        "domainTypes": [
          "https://schema.org/JobPosting"
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
        "name": "experienceInPlaceOfEducation",
        "type": "https://schema.org/Boolean",
        "description": "Indicates whether a [[JobPosting]] will accept experience (as indicated by [[OccupationalExperienceRequirements]]) in place of its formal educational qualifications (as indicated by [[educationRequirements]]). If true, indicates that satisfying one of these requirements is sufficient.",
        "expectedTypes": [
          "https://schema.org/Boolean"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean"
        ],
        "domainTypes": [
          "https://schema.org/JobPosting"
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
        "name": "hiringOrganization",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "Organization or Person offering the job position.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/JobPosting"
        ]
      },
      {
        "name": "incentiveCompensation",
        "type": "https://schema.org/Text",
        "description": "Description of bonus and commission compensation aspects of the job.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/JobPosting"
        ]
      },
      {
        "name": "incentives",
        "type": "https://schema.org/Text",
        "description": "Description of bonus and commission compensation aspects of the job.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/JobPosting"
        ],
        "supersededBy": "https://schema.org/incentiveCompensation"
      },
      {
        "name": "industry",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text"
        ],
        "description": "The industry associated with the job position.",
        "expectedTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/JobPosting"
        ]
      },
      {
        "name": "jobBenefits",
        "type": "https://schema.org/Text",
        "description": "Description of benefits associated with the job.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/JobPosting"
        ]
      },
      {
        "name": "jobDuration",
        "type": [
          "https://schema.org/Duration",
          "https://schema.org/QuantitativeValue"
        ],
        "description": "The expected duration of an employment offer as advertised by the employer. Relevant for job postings that have a clearly defined period in mind such as seasonal work, substitutes for maternal leave or any other temporary employment.",
        "expectedTypes": [
          "https://schema.org/Duration",
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/Duration",
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/JobPosting"
        ]
      },
      {
        "name": "jobImmediateStart",
        "type": "https://schema.org/Boolean",
        "description": "An indicator as to whether a position is available for an immediate start.",
        "expectedTypes": [
          "https://schema.org/Boolean"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean"
        ],
        "domainTypes": [
          "https://schema.org/JobPosting"
        ]
      },
      {
        "name": "jobLocation",
        "type": "https://schema.org/Place",
        "description": "A (typically single) geographic location associated with the job position.",
        "expectedTypes": [
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/JobPosting"
        ]
      },
      {
        "name": "jobLocationType",
        "type": "https://schema.org/Text",
        "description": "A description of the job location (e.g. TELECOMMUTE for telecommute jobs).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/JobPosting"
        ]
      },
      {
        "name": "jobStartDate",
        "type": [
          "https://schema.org/Date",
          "https://schema.org/Text"
        ],
        "description": "The date on which a successful applicant for this job would be expected to start work. Choose a specific date in the future or use the jobImmediateStart property to indicate the position is to be filled as soon as possible.",
        "expectedTypes": [
          "https://schema.org/Date",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Date",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/JobPosting"
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
        "name": "physicalRequirement",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "A description of the types of physical activity associated with the job. Defined terms such as those in O*net may be used, but note that there is no way to specify the level of ability as well as its nature when using a defined term.",
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
          "https://schema.org/JobPosting"
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
        "name": "relevantOccupation",
        "type": "https://schema.org/Occupation",
        "description": "The Occupation for the JobPosting.",
        "expectedTypes": [
          "https://schema.org/Occupation"
        ],
        "rangeTypes": [
          "https://schema.org/Occupation"
        ],
        "domainTypes": [
          "https://schema.org/JobPosting"
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
      },
      {
        "name": "securityClearanceRequirement",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "A description of any security clearance requirements of the job.",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/JobPosting"
        ]
      },
      {
        "name": "sensoryRequirement",
        "type": [
          "https://schema.org/DefinedTerm",
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "A description of any sensory requirements and levels necessary to function on the job, including hearing and vision. Defined terms such as those in O*net may be used, but note that there is no way to specify the level of ability as well as its nature when using a defined term.",
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
          "https://schema.org/JobPosting"
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
      },
      {
        "name": "specialCommitments",
        "type": "https://schema.org/Text",
        "description": "Any special commitments associated with this job posting. Valid entries include VeteranCommit, MilitarySpouseCommit, etc.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/JobPosting"
        ]
      },
      {
        "name": "title",
        "type": "https://schema.org/Text",
        "description": "The title of the job.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/JobPosting"
        ]
      },
      {
        "name": "totalJobOpenings",
        "type": "https://schema.org/Integer",
        "description": "The number of positions open for this job posting. Use a positive integer. Do not use if the number of positions is unclear or not known.",
        "expectedTypes": [
          "https://schema.org/Integer"
        ],
        "rangeTypes": [
          "https://schema.org/Integer"
        ],
        "domainTypes": [
          "https://schema.org/JobPosting"
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
        "name": "workHours",
        "type": "https://schema.org/Text",
        "description": "The typical working hours for this job (e.g. 1st shift, night shift, 8am-5pm).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/JobPosting"
        ]
      }
    ]
  },
  {
    "name": "JoinAction",
    "type": "https://schema.org/JoinAction",
    "source": "generated",
    "description": "An agent joins an event/group with participants/friends at a location.\\n\\nRelated actions:\\n\\n* [[RegisterAction]]: Unlike RegisterAction, JoinAction refers to joining a group/team of people.\\n* [[SubscribeAction]]: Unlike SubscribeAction, JoinAction does not imply that you'll be receiving updates.\\n* [[FollowAction]]: Unlike FollowAction, JoinAction does not imply that you'll be polling for updates.",
    "parentTypes": [
      "https://schema.org/InteractAction"
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
    "name": "Joint",
    "type": "https://schema.org/Joint",
    "source": "generated",
    "description": "The anatomical location at which two or more bones make contact.",
    "parentTypes": [
      "https://schema.org/AnatomicalStructure"
    ],
    "properties": [
      {
        "name": "biomechnicalClass",
        "type": "https://schema.org/Text",
        "description": "The biomechanical properties of the bone.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Joint"
        ]
      },
      {
        "name": "functionalClass",
        "type": [
          "https://schema.org/MedicalEntity",
          "https://schema.org/Text"
        ],
        "description": "The degree of mobility the joint allows.",
        "expectedTypes": [
          "https://schema.org/MedicalEntity",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalEntity",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Joint"
        ]
      },
      {
        "name": "structuralClass",
        "type": "https://schema.org/Text",
        "description": "The name given to how bone physically connects to each other.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Joint"
        ]
      }
    ]
  },
  {
    "name": "LakeBodyOfWater",
    "type": "https://schema.org/LakeBodyOfWater",
    "source": "generated",
    "description": "A lake (for example, Lake Pontrachain).",
    "parentTypes": [
      "https://schema.org/BodyOfWater"
    ]
  },
  {
    "name": "Landform",
    "type": "https://schema.org/Landform",
    "source": "generated",
    "description": "A landform or physical feature.  Landform elements include mountains, plains, lakes, rivers, seascape and oceanic waterbody interface features such as bays, peninsulas, seas and so forth, including sub-aqueous terrain features such as submersed mountain ranges, volcanoes, and the great ocean basins.",
    "parentTypes": [
      "https://schema.org/Place"
    ]
  },
  {
    "name": "LandmarksOrHistoricalBuildings",
    "type": "https://schema.org/LandmarksOrHistoricalBuildings",
    "source": "generated",
    "description": "An historical landmark or building.",
    "parentTypes": [
      "https://schema.org/Place"
    ]
  },
  {
    "name": "Language",
    "type": "https://schema.org/Language",
    "source": "generated",
    "description": "Natural languages such as Spanish, Tamil, Hindi, English, etc. Formal language code tags expressed in [BCP 47](https://en.wikipedia.org/wiki/IETF_language_tag) can be used via the [[alternateName]] property. The Language type previously also covered programming languages such as Scheme and Lisp, which are now best represented using [[ComputerLanguage]].",
    "parentTypes": [
      "https://schema.org/Intangible"
    ]
  },
  {
    "name": "LearningResource",
    "type": "https://schema.org/LearningResource",
    "source": "generated",
    "description": "The LearningResource type can be used to indicate [[CreativeWork]]s (whether physical or digital) that have a particular and explicit orientation towards learning, education, skill acquisition, and other educational purposes.\n\n[[LearningResource]] is expected to be used as an addition to a primary type such as [[Book]], [[VideoObject]], [[Product]] etc.\n\n[[EducationEvent]] serves a similar purpose for event-like things (e.g. a [[Trip]]). A [[LearningResource]] may be created as a result of an [[EducationEvent]], for example by recording one.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
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
    "name": "LeaveAction",
    "type": "https://schema.org/LeaveAction",
    "source": "generated",
    "description": "An agent leaves an event / group with participants/friends at a location.\\n\\nRelated actions:\\n\\n* [[JoinAction]]: The antonym of LeaveAction.\\n* [[UnRegisterAction]]: Unlike UnRegisterAction, LeaveAction implies leaving a group/team of people rather than a service.",
    "parentTypes": [
      "https://schema.org/InteractAction"
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
    "name": "LegalDocument",
    "type": "https://spec.edmcouncil.org/fibo/ontology/FND/Arrangements/Documents/LegalDocument",
    "source": "generated"
  },
  {
    "name": "LegalForceStatus",
    "type": "https://schema.org/LegalForceStatus",
    "source": "generated",
    "description": "A list of possible statuses for the legal force of a legislation.",
    "parentTypes": [
      "https://schema.org/StatusEnumeration"
    ],
    "enumerationValues": [
      {
        "name": "InForce",
        "type": "https://schema.org/InForce",
        "description": "Indicates that a legislation is in force."
      },
      {
        "name": "NotInForce",
        "type": "https://schema.org/NotInForce",
        "description": "Indicates that a legislation is currently not in force."
      },
      {
        "name": "PartiallyInForce",
        "type": "https://schema.org/PartiallyInForce",
        "description": "Indicates that parts of the legislation are in force, and parts are not."
      }
    ]
  },
  {
    "name": "LegalService",
    "type": "https://schema.org/LegalService",
    "source": "generated",
    "description": "A LegalService is a business that provides legally-oriented services, advice and representation, e.g. law firms.\\n\\nAs a [[LocalBusiness]] it can be described as a [[provider]] of one or more [[Service]]\\(s).",
    "parentTypes": [
      "https://schema.org/LocalBusiness"
    ]
  },
  {
    "name": "LegalValueLevel",
    "type": "https://schema.org/LegalValueLevel",
    "source": "generated",
    "description": "A list of possible levels for the legal validity of a legislation.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "AuthoritativeLegalValue",
        "type": "https://schema.org/AuthoritativeLegalValue",
        "description": "Indicates that the publisher gives some special status to the publication of the document. (\"The Queens Printer\" version of a UK Act of Parliament, or the PDF version of a Directive published by the EU Office of Publications). Something \"Authoritative\" is considered to be also [[OfficialLegalValue]]\"."
      },
      {
        "name": "DefinitiveLegalValue",
        "type": "https://schema.org/DefinitiveLegalValue",
        "description": "Indicates a document for which the text is conclusively what the law says and is legally binding. (e.g. The digitally signed version of an Official Journal.)\n  Something \"Definitive\" is considered to be also [[AuthoritativeLegalValue]]."
      },
      {
        "name": "OfficialLegalValue",
        "type": "https://schema.org/OfficialLegalValue",
        "description": "All the documents published by an official publisher should have at least the legal value level \"OfficialLegalValue\". This indicates that the document was published by an organisation with the public task of making it available (e.g. a consolidated version of a EU directive published by the EU Office of Publications)."
      },
      {
        "name": "UnofficialLegalValue",
        "type": "https://schema.org/UnofficialLegalValue",
        "description": "Indicates that a document has no particular or special standing (e.g. a republication of a law by a private publisher)."
      }
    ]
  },
  {
    "name": "Legislation",
    "type": "https://schema.org/Legislation",
    "source": "generated",
    "description": "A legal document such as an act, decree, bill, etc. (enforceable or not) or a component of a legal act (like an article).",
    "parentTypes": [
      "https://schema.org/CreativeWork"
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
        "name": "legislationAmends",
        "type": "https://schema.org/Legislation",
        "description": "Another legislation that this legislation amends, introducing legal changes.",
        "expectedTypes": [
          "https://schema.org/Legislation"
        ],
        "rangeTypes": [
          "https://schema.org/Legislation"
        ],
        "domainTypes": [
          "https://schema.org/Legislation"
        ]
      },
      {
        "name": "legislationApplies",
        "type": "https://schema.org/Legislation",
        "description": "Indicates that this legislation (or part of a legislation) somehow transfers another legislation in a different legislative context. This is an informative link, and it has no legal value. For legally-binding links of transposition, use the <a href=\"/legislationTransposes\">legislationTransposes</a> property. For example an informative consolidated law of a European Union's member state \"applies\" the consolidated version of the European Directive implemented in it.",
        "expectedTypes": [
          "https://schema.org/Legislation"
        ],
        "rangeTypes": [
          "https://schema.org/Legislation"
        ],
        "domainTypes": [
          "https://schema.org/Legislation"
        ]
      },
      {
        "name": "legislationChanges",
        "type": "https://schema.org/Legislation",
        "description": "Another legislation that this legislation changes. This encompasses the notions of amendment, replacement, correction, repeal, or other types of change. This may be a direct change (textual or non-textual amendment) or a consequential or indirect change. The property is to be used to express the existence of a change relationship between two acts rather than the existence of a consolidated version of the text that shows the result of the change. For consolidation relationships, use the <a href=\"/legislationConsolidates\">legislationConsolidates</a> property.",
        "expectedTypes": [
          "https://schema.org/Legislation"
        ],
        "rangeTypes": [
          "https://schema.org/Legislation"
        ],
        "domainTypes": [
          "https://schema.org/Legislation"
        ]
      },
      {
        "name": "legislationCommences",
        "type": "https://schema.org/Legislation",
        "description": "Another legislation that this one sets into force.",
        "expectedTypes": [
          "https://schema.org/Legislation"
        ],
        "rangeTypes": [
          "https://schema.org/Legislation"
        ],
        "domainTypes": [
          "https://schema.org/Legislation"
        ]
      },
      {
        "name": "legislationConsolidates",
        "type": "https://schema.org/Legislation",
        "description": "Indicates another legislation taken into account in this consolidated legislation (which is usually the product of an editorial process that revises the legislation). This property should be used multiple times to refer to both the original version or the previous consolidated version, and to the legislations making the change.",
        "expectedTypes": [
          "https://schema.org/Legislation"
        ],
        "rangeTypes": [
          "https://schema.org/Legislation"
        ],
        "domainTypes": [
          "https://schema.org/Legislation"
        ]
      },
      {
        "name": "legislationCorrects",
        "type": "https://schema.org/Legislation",
        "description": "Another legislation in which this one introduces textual changes, like correction of spelling mistakes, with no legal impact (for modifications that have legal impact, use <a href=\"/legislationAmends\">legislationAmends</a>).",
        "expectedTypes": [
          "https://schema.org/Legislation"
        ],
        "rangeTypes": [
          "https://schema.org/Legislation"
        ],
        "domainTypes": [
          "https://schema.org/Legislation"
        ]
      },
      {
        "name": "legislationCountersignedBy",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "The person or organization that countersigned the legislation. Depending on the legal context, a countersignature can indicate that the signed authority undertakes to assume responsibility for texts emanating from a person who is inviolable and irresponsible, (for example a King, Grand Duc or President), or that the authority is in charge of the implementation of the text.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Legislation"
        ]
      },
      {
        "name": "legislationDate",
        "type": "https://schema.org/Date",
        "description": "The date of adoption or signature of the legislation. This is the date at which the text is officially aknowledged to be a legislation, even though it might not even be published or in force.",
        "expectedTypes": [
          "https://schema.org/Date"
        ],
        "rangeTypes": [
          "https://schema.org/Date"
        ],
        "domainTypes": [
          "https://schema.org/Legislation"
        ]
      },
      {
        "name": "legislationDateOfApplicability",
        "type": "https://schema.org/Date",
        "description": "The date at which the Legislation becomes applicable. This can sometimes be distinct from the date of entry into force : a text may come in force today, and state it will become applicable in 3 months.",
        "expectedTypes": [
          "https://schema.org/Date"
        ],
        "rangeTypes": [
          "https://schema.org/Date"
        ],
        "domainTypes": [
          "https://schema.org/Legislation"
        ]
      },
      {
        "name": "legislationDateVersion",
        "type": "https://schema.org/Date",
        "description": "The point-in-time at which the provided description of the legislation is valid (e.g.: when looking at the law on the 2016-04-07 (= dateVersion), I get the consolidation of 2015-04-12 of the \"National Insurance Contributions Act 2015\")",
        "expectedTypes": [
          "https://schema.org/Date"
        ],
        "rangeTypes": [
          "https://schema.org/Date"
        ],
        "domainTypes": [
          "https://schema.org/Legislation"
        ]
      },
      {
        "name": "legislationEnsuresImplementationOf",
        "type": "https://schema.org/Legislation",
        "description": "Indicates that this Legislation ensures the implementation of another Legislation, for example by modifying national legislations so that they do not contradict to an EU regulation or decision. This implies a legal meaning. Transpositions of EU Directive should be captured with <a href=\"/legislationTransposes\">legislationTransposes</a>.",
        "expectedTypes": [
          "https://schema.org/Legislation"
        ],
        "rangeTypes": [
          "https://schema.org/Legislation"
        ],
        "domainTypes": [
          "https://schema.org/Legislation"
        ]
      },
      {
        "name": "legislationIdentifier",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "An identifier for the legislation. This can be either a string-based identifier, like the CELEX at EU level or the NOR in France, or a web-based, URL/URI identifier, like an ELI (European Legislation Identifier) or an URN-Lex.",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/Legislation"
        ]
      },
      {
        "name": "legislationJurisdiction",
        "type": [
          "https://schema.org/AdministrativeArea",
          "https://schema.org/Text"
        ],
        "description": "The jurisdiction from which the legislation originates.",
        "expectedTypes": [
          "https://schema.org/AdministrativeArea",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/AdministrativeArea",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Legislation"
        ]
      },
      {
        "name": "legislationLegalForce",
        "type": "https://schema.org/LegalForceStatus",
        "description": "Whether the legislation is currently in force, not in force, or partially in force.",
        "expectedTypes": [
          "https://schema.org/LegalForceStatus"
        ],
        "rangeTypes": [
          "https://schema.org/LegalForceStatus"
        ],
        "domainTypes": [
          "https://schema.org/Legislation"
        ]
      },
      {
        "name": "legislationPassedBy",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "The person or organization that originally passed or made the law: typically parliament (for primary legislation) or government (for secondary legislation). This indicates the \"legal author\" of the law, as opposed to its physical author.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Legislation"
        ]
      },
      {
        "name": "legislationRepeals",
        "type": "https://schema.org/Legislation",
        "description": "Another legislation that this legislation repeals (cancels, abrogates).",
        "expectedTypes": [
          "https://schema.org/Legislation"
        ],
        "rangeTypes": [
          "https://schema.org/Legislation"
        ],
        "domainTypes": [
          "https://schema.org/Legislation"
        ]
      },
      {
        "name": "legislationResponsible",
        "type": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "An individual or organization that has some kind of responsibility for the legislation. Typically the ministry who is/was in charge of elaborating the legislation, or the adressee for potential questions about the legislation once it is published.",
        "expectedTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Legislation"
        ]
      },
      {
        "name": "legislationTransposes",
        "type": "https://schema.org/Legislation",
        "description": "Indicates that this legislation (or part of legislation) fulfills the objectives set by another legislation, by passing appropriate implementation measures. Typically, some legislations of European Union's member states or regions transpose European Directives. This indicates a legally binding link between the 2 legislations.",
        "expectedTypes": [
          "https://schema.org/Legislation"
        ],
        "rangeTypes": [
          "https://schema.org/Legislation"
        ],
        "domainTypes": [
          "https://schema.org/Legislation"
        ]
      },
      {
        "name": "legislationType",
        "type": [
          "https://schema.org/CategoryCode",
          "https://schema.org/Text"
        ],
        "description": "The type of the legislation. Examples of values are \"law\", \"act\", \"directive\", \"decree\", \"regulation\", \"statutory instrument\", \"loi organique\", \"règlement grand-ducal\", etc., depending on the country.",
        "expectedTypes": [
          "https://schema.org/CategoryCode",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/CategoryCode",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/Legislation"
        ]
      }
    ]
  },
  {
    "name": "LegislationObject",
    "type": "https://schema.org/LegislationObject",
    "source": "generated",
    "description": "A specific object or file containing a Legislation. Note that the same Legislation can be published in multiple files. For example, a digitally signed PDF, a plain PDF and an HTML version.",
    "parentTypes": [
      "https://schema.org/Legislation",
      "https://schema.org/MediaObject"
    ],
    "properties": [
      {
        "name": "legislationLegalValue",
        "type": "https://schema.org/LegalValueLevel",
        "description": "The legal value of this legislation file. The same legislation can be written in multiple files with different legal values. Typically a digitally signed PDF have a \"stronger\" legal value than the HTML file of the same act.",
        "expectedTypes": [
          "https://schema.org/LegalValueLevel"
        ],
        "rangeTypes": [
          "https://schema.org/LegalValueLevel"
        ],
        "domainTypes": [
          "https://schema.org/LegislationObject"
        ]
      }
    ]
  },
  {
    "name": "LegislativeBuilding",
    "type": "https://schema.org/LegislativeBuilding",
    "source": "generated",
    "description": "A legislative building&#x2014;for example, the state capitol.",
    "parentTypes": [
      "https://schema.org/GovernmentBuilding"
    ]
  },
  {
    "name": "LendAction",
    "type": "https://schema.org/LendAction",
    "source": "generated",
    "description": "The act of providing an object under an agreement that it will be returned at a later date. Reciprocal of BorrowAction.\\n\\nRelated actions:\\n\\n* [[BorrowAction]]: Reciprocal of LendAction.",
    "parentTypes": [
      "https://schema.org/TransferAction"
    ],
    "properties": [
      {
        "name": "borrower",
        "type": "https://schema.org/Person",
        "description": "A sub property of participant. The person that borrows the object being lent.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/LendAction"
        ]
      }
    ]
  },
  {
    "name": "Library",
    "type": "https://schema.org/Library",
    "source": "generated",
    "description": "A library.",
    "parentTypes": [
      "https://schema.org/LocalBusiness"
    ]
  },
  {
    "name": "LibrarySystem",
    "type": "https://schema.org/LibrarySystem",
    "source": "generated",
    "description": "A [[LibrarySystem]] is a collaborative system amongst several libraries.",
    "parentTypes": [
      "https://schema.org/Organization"
    ]
  },
  {
    "name": "LifestyleModification",
    "type": "https://schema.org/LifestyleModification",
    "source": "generated",
    "description": "A process of care involving exercise, changes to diet, fitness routines, and other lifestyle changes aimed at improving a health condition.",
    "parentTypes": [
      "https://schema.org/MedicalEntity"
    ]
  },
  {
    "name": "Ligament",
    "type": "https://schema.org/Ligament",
    "source": "generated",
    "description": "A short band of tough, flexible, fibrous connective tissue that functions to connect multiple bones, cartilages, and structurally support joints.",
    "parentTypes": [
      "https://schema.org/AnatomicalStructure"
    ]
  },
  {
    "name": "LikeAction",
    "type": "https://schema.org/LikeAction",
    "source": "generated",
    "description": "The act of expressing a positive sentiment about the object. An agent likes an object (a proposition, topic or theme) with participants.",
    "parentTypes": [
      "https://schema.org/ReactAction"
    ]
  },
  {
    "name": "LineTradeAgreement",
    "type": "http://unece.org/vocab#LineTradeAgreement",
    "source": "generated"
  },
  {
    "name": "LinkRole",
    "type": "https://schema.org/LinkRole",
    "source": "generated",
    "description": "A Role that represents a Web link, e.g. as expressed via the 'url' property. Its linkRelationship property can indicate URL-based and plain textual link types, e.g. those in IANA link registry or others such as 'amphtml'. This structure provides a placeholder where details from HTML's link element can be represented outside of HTML, e.g. in JSON-LD feeds.",
    "parentTypes": [
      "https://schema.org/Role"
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
        "name": "linkRelationship",
        "type": "https://schema.org/Text",
        "description": "Indicates the relationship type of a Web link. ",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/LinkRole"
        ]
      }
    ]
  },
  {
    "name": "LiquorStore",
    "type": "https://schema.org/LiquorStore",
    "source": "generated",
    "description": "A shop that sells alcoholic drinks such as wine, beer, whisky and other spirits.",
    "parentTypes": [
      "https://schema.org/Store"
    ]
  },
  {
    "name": "ListenAction",
    "type": "https://schema.org/ListenAction",
    "source": "generated",
    "description": "The act of consuming audio content.",
    "parentTypes": [
      "https://schema.org/ConsumeAction"
    ]
  },
  {
    "name": "ListItem",
    "type": "https://schema.org/ListItem",
    "source": "generated",
    "description": "An list item, e.g. a step in a checklist or how-to description.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
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
      },
      {
        "name": "nextItem",
        "type": "https://schema.org/ListItem",
        "description": "A link to the ListItem that follows the current one.",
        "expectedTypes": [
          "https://schema.org/ListItem"
        ],
        "rangeTypes": [
          "https://schema.org/ListItem"
        ],
        "domainTypes": [
          "https://schema.org/ListItem"
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
        "name": "previousItem",
        "type": "https://schema.org/ListItem",
        "description": "A link to the ListItem that precedes the current one.",
        "expectedTypes": [
          "https://schema.org/ListItem"
        ],
        "rangeTypes": [
          "https://schema.org/ListItem"
        ],
        "domainTypes": [
          "https://schema.org/ListItem"
        ]
      }
    ]
  },
  {
    "name": "LiteraryEvent",
    "type": "https://schema.org/LiteraryEvent",
    "source": "generated",
    "description": "Event type: Literary event.",
    "parentTypes": [
      "https://schema.org/Event"
    ]
  },
  {
    "name": "LiveBlogPosting",
    "type": "https://schema.org/LiveBlogPosting",
    "source": "generated",
    "description": "A [[LiveBlogPosting]] is a [[BlogPosting]] intended to provide a rolling textual coverage of an ongoing event through continuous updates.",
    "parentTypes": [
      "https://schema.org/BlogPosting"
    ],
    "properties": [
      {
        "name": "coverageEndTime",
        "type": "https://schema.org/DateTime",
        "description": "The time when the live blog will stop covering the Event. Note that coverage may continue after the Event concludes.",
        "expectedTypes": [
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/LiveBlogPosting"
        ]
      },
      {
        "name": "coverageStartTime",
        "type": "https://schema.org/DateTime",
        "description": "The time when the live blog will begin covering the Event. Note that coverage may begin before the Event's start time. The LiveBlogPosting may also be created before coverage begins.",
        "expectedTypes": [
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/LiveBlogPosting"
        ]
      },
      {
        "name": "liveBlogUpdate",
        "type": "https://schema.org/BlogPosting",
        "description": "An update to the LiveBlog.",
        "expectedTypes": [
          "https://schema.org/BlogPosting"
        ],
        "rangeTypes": [
          "https://schema.org/BlogPosting"
        ],
        "domainTypes": [
          "https://schema.org/LiveBlogPosting"
        ]
      }
    ]
  },
  {
    "name": "LoanOrCredit",
    "type": "https://schema.org/LoanOrCredit",
    "source": "generated",
    "description": "A financial product for the loaning of an amount of money, or line of credit, under agreed terms and charges.",
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
        "name": "gracePeriod",
        "type": "https://schema.org/Duration",
        "description": "The period of time after any due date that the borrower has to fulfil its obligations before a default (failure to pay) is deemed to have occurred.",
        "expectedTypes": [
          "https://schema.org/Duration"
        ],
        "rangeTypes": [
          "https://schema.org/Duration"
        ],
        "domainTypes": [
          "https://schema.org/LoanOrCredit"
        ]
      },
      {
        "name": "loanRepaymentForm",
        "type": "https://schema.org/RepaymentSpecification",
        "description": "A form of paying back money previously borrowed from a lender. Repayment usually takes the form of periodic payments that normally include part principal plus interest in each payment.",
        "expectedTypes": [
          "https://schema.org/RepaymentSpecification"
        ],
        "rangeTypes": [
          "https://schema.org/RepaymentSpecification"
        ],
        "domainTypes": [
          "https://schema.org/LoanOrCredit"
        ]
      },
      {
        "name": "loanTerm",
        "type": "https://schema.org/QuantitativeValue",
        "description": "The duration of the loan or credit agreement.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/LoanOrCredit"
        ]
      },
      {
        "name": "loanType",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "description": "The type of a loan or credit.",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/LoanOrCredit"
        ]
      },
      {
        "name": "recourseLoan",
        "type": "https://schema.org/Boolean",
        "description": "The only way you get the money back in the event of default is the security. Recourse is where you still have the opportunity to go back to the borrower for the rest of the money.",
        "expectedTypes": [
          "https://schema.org/Boolean"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean"
        ],
        "domainTypes": [
          "https://schema.org/LoanOrCredit"
        ]
      },
      {
        "name": "renegotiableLoan",
        "type": "https://schema.org/Boolean",
        "description": "Whether the terms for payment of interest can be renegotiated during the life of the loan.",
        "expectedTypes": [
          "https://schema.org/Boolean"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean"
        ],
        "domainTypes": [
          "https://schema.org/LoanOrCredit"
        ]
      },
      {
        "name": "requiredCollateral",
        "type": [
          "https://schema.org/Text",
          "https://schema.org/Thing"
        ],
        "description": "Assets required to secure loan or credit repayments. It may take form of third party pledge, goods, financial instruments (cash, securities, etc.)",
        "expectedTypes": [
          "https://schema.org/Text",
          "https://schema.org/Thing"
        ],
        "rangeTypes": [
          "https://schema.org/Text",
          "https://schema.org/Thing"
        ],
        "domainTypes": [
          "https://schema.org/LoanOrCredit"
        ]
      }
    ]
  },
  {
    "name": "LocalBusiness",
    "type": "https://schema.org/LocalBusiness",
    "source": "generated",
    "description": "A particular physical business or branch of an organization. Examples of LocalBusiness include a restaurant, a particular branch of a restaurant chain, a branch of a bank, a medical practice, a club, a bowling alley, etc.",
    "parentTypes": [
      "https://schema.org/Organization",
      "https://schema.org/Place"
    ],
    "properties": [
      {
        "name": "branchOf",
        "type": "https://schema.org/Organization",
        "description": "The larger organization that this local business is a branch of, if any. Not to be confused with (anatomical) [[branch]].",
        "expectedTypes": [
          "https://schema.org/Organization"
        ],
        "rangeTypes": [
          "https://schema.org/Organization"
        ],
        "domainTypes": [
          "https://schema.org/LocalBusiness"
        ],
        "supersededBy": "https://schema.org/parentOrganization"
      },
      {
        "name": "currenciesAccepted",
        "type": "https://schema.org/Text",
        "description": "The currency accepted.\\n\\nUse standard formats: [ISO 4217 currency format](http://en.wikipedia.org/wiki/ISO_4217), e.g. \"USD\"; [Ticker symbol](https://en.wikipedia.org/wiki/List_of_cryptocurrencies) for cryptocurrencies, e.g. \"BTC\"; well known names for [Local Exchange Trading Systems](https://en.wikipedia.org/wiki/Local_exchange_trading_system) (LETS) and other currency types, e.g. \"Ithaca HOUR\".",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/LocalBusiness"
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
      },
      {
        "name": "paymentAccepted",
        "type": "https://schema.org/Text",
        "description": "Cash, Credit Card, Cryptocurrency, Local Exchange Tradings System, etc.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/LocalBusiness"
        ]
      },
      {
        "name": "priceRange",
        "type": "https://schema.org/Text",
        "description": "The price range of the business, for example ```$$$```.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/LocalBusiness"
        ]
      }
    ]
  },
  {
    "name": "Location",
    "type": "https://www.omg.org/spec/Commons/Locations/Location",
    "source": "generated"
  },
  {
    "name": "LocationFeatureSpecification",
    "type": "https://schema.org/LocationFeatureSpecification",
    "source": "generated",
    "description": "Specifies a location feature by providing a structured value representing a feature of an accommodation as a property-value pair of varying degrees of formality.",
    "parentTypes": [
      "https://schema.org/PropertyValue"
    ],
    "properties": [
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
    "name": "Locksmith",
    "type": "https://schema.org/Locksmith",
    "source": "generated",
    "description": "A locksmith.",
    "parentTypes": [
      "https://schema.org/HomeAndConstructionBusiness"
    ]
  },
  {
    "name": "LodgingBusiness",
    "type": "https://schema.org/LodgingBusiness",
    "source": "generated",
    "description": "A lodging business, such as a motel, hotel, or inn.",
    "parentTypes": [
      "https://schema.org/LocalBusiness"
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
        "name": "checkinTime",
        "type": [
          "https://schema.org/DateTime",
          "https://schema.org/Time"
        ],
        "description": "The earliest someone may check into a lodging establishment.",
        "expectedTypes": [
          "https://schema.org/DateTime",
          "https://schema.org/Time"
        ],
        "rangeTypes": [
          "https://schema.org/DateTime",
          "https://schema.org/Time"
        ],
        "domainTypes": [
          "https://schema.org/LodgingBusiness",
          "https://schema.org/LodgingReservation"
        ]
      },
      {
        "name": "checkoutTime",
        "type": [
          "https://schema.org/DateTime",
          "https://schema.org/Time"
        ],
        "description": "The latest someone may check out of a lodging establishment.",
        "expectedTypes": [
          "https://schema.org/DateTime",
          "https://schema.org/Time"
        ],
        "rangeTypes": [
          "https://schema.org/DateTime",
          "https://schema.org/Time"
        ],
        "domainTypes": [
          "https://schema.org/LodgingBusiness",
          "https://schema.org/LodgingReservation"
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
    "name": "LodgingReservation",
    "type": "https://schema.org/LodgingReservation",
    "source": "generated",
    "description": "A reservation for lodging at a hotel, motel, inn, etc.\\n\\nNote: This type is for information about actual reservations, e.g. in confirmation emails or HTML pages with individual confirmations of reservations.",
    "parentTypes": [
      "https://schema.org/Reservation"
    ],
    "properties": [
      {
        "name": "checkinTime",
        "type": [
          "https://schema.org/DateTime",
          "https://schema.org/Time"
        ],
        "description": "The earliest someone may check into a lodging establishment.",
        "expectedTypes": [
          "https://schema.org/DateTime",
          "https://schema.org/Time"
        ],
        "rangeTypes": [
          "https://schema.org/DateTime",
          "https://schema.org/Time"
        ],
        "domainTypes": [
          "https://schema.org/LodgingBusiness",
          "https://schema.org/LodgingReservation"
        ]
      },
      {
        "name": "checkoutTime",
        "type": [
          "https://schema.org/DateTime",
          "https://schema.org/Time"
        ],
        "description": "The latest someone may check out of a lodging establishment.",
        "expectedTypes": [
          "https://schema.org/DateTime",
          "https://schema.org/Time"
        ],
        "rangeTypes": [
          "https://schema.org/DateTime",
          "https://schema.org/Time"
        ],
        "domainTypes": [
          "https://schema.org/LodgingBusiness",
          "https://schema.org/LodgingReservation"
        ]
      },
      {
        "name": "lodgingUnitDescription",
        "type": "https://schema.org/Text",
        "description": "A full description of the lodging unit.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/LodgingReservation"
        ]
      },
      {
        "name": "lodgingUnitType",
        "type": [
          "https://schema.org/QualitativeValue",
          "https://schema.org/Text"
        ],
        "description": "Textual description of the unit type (including suite vs. room, size of bed, etc.).",
        "expectedTypes": [
          "https://schema.org/QualitativeValue",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/QualitativeValue",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/LodgingReservation"
        ]
      },
      {
        "name": "numAdults",
        "type": [
          "https://schema.org/Integer",
          "https://schema.org/QuantitativeValue"
        ],
        "description": "The number of adults staying in the unit.",
        "expectedTypes": [
          "https://schema.org/Integer",
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/Integer",
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/LodgingReservation"
        ]
      },
      {
        "name": "numChildren",
        "type": [
          "https://schema.org/Integer",
          "https://schema.org/QuantitativeValue"
        ],
        "description": "The number of children staying in the unit.",
        "expectedTypes": [
          "https://schema.org/Integer",
          "https://schema.org/QuantitativeValue"
        ],
        "rangeTypes": [
          "https://schema.org/Integer",
          "https://schema.org/QuantitativeValue"
        ],
        "domainTypes": [
          "https://schema.org/LodgingReservation"
        ]
      }
    ]
  },
  {
    "name": "LoginAction",
    "type": "https://schema.org/LoginAction",
    "source": "generated",
    "description": "The action of logging into a device or application.",
    "parentTypes": [
      "https://schema.org/ControlAction"
    ]
  },
  {
    "name": "LoseAction",
    "type": "https://schema.org/LoseAction",
    "source": "generated",
    "description": "The act of being defeated in a competitive activity.",
    "parentTypes": [
      "https://schema.org/AchieveAction"
    ],
    "properties": [
      {
        "name": "winner",
        "type": "https://schema.org/Person",
        "description": "A sub property of participant. The winner of the action.",
        "expectedTypes": [
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/LoseAction"
        ]
      }
    ]
  },
  {
    "name": "LymphaticVessel",
    "type": "https://schema.org/LymphaticVessel",
    "source": "generated",
    "description": "A type of blood vessel that specifically carries lymph fluid unidirectionally toward the heart.",
    "parentTypes": [
      "https://schema.org/Vessel"
    ],
    "properties": [
      {
        "name": "originatesFrom",
        "type": "https://schema.org/Vessel",
        "description": "The vasculature the lymphatic structure originates, or afferents, from.",
        "expectedTypes": [
          "https://schema.org/Vessel"
        ],
        "rangeTypes": [
          "https://schema.org/Vessel"
        ],
        "domainTypes": [
          "https://schema.org/LymphaticVessel"
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
        "name": "runsTo",
        "type": "https://schema.org/Vessel",
        "description": "The vasculature the lymphatic structure runs, or efferents, to.",
        "expectedTypes": [
          "https://schema.org/Vessel"
        ],
        "rangeTypes": [
          "https://schema.org/Vessel"
        ],
        "domainTypes": [
          "https://schema.org/LymphaticVessel"
        ]
      }
    ]
  },
  {
    "name": "Manuscript",
    "type": "https://schema.org/Manuscript",
    "source": "generated",
    "description": "A book, document, or piece of music written by hand rather than typed or printed.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ]
  },
  {
    "name": "Map",
    "type": "https://schema.org/Map",
    "source": "generated",
    "description": "A map.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ],
    "properties": [
      {
        "name": "mapType",
        "type": "https://schema.org/MapCategoryType",
        "description": "Indicates the kind of Map, from the MapCategoryType Enumeration.",
        "expectedTypes": [
          "https://schema.org/MapCategoryType"
        ],
        "rangeTypes": [
          "https://schema.org/MapCategoryType"
        ],
        "domainTypes": [
          "https://schema.org/Map"
        ]
      }
    ]
  },
  {
    "name": "MapCategoryType",
    "type": "https://schema.org/MapCategoryType",
    "source": "generated",
    "description": "An enumeration of several kinds of Map.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "ParkingMap",
        "type": "https://schema.org/ParkingMap",
        "description": "A parking map."
      },
      {
        "name": "SeatingMap",
        "type": "https://schema.org/SeatingMap",
        "description": "A seating map."
      },
      {
        "name": "TransitMap",
        "type": "https://schema.org/TransitMap",
        "description": "A transit map."
      },
      {
        "name": "VenueMap",
        "type": "https://schema.org/VenueMap",
        "description": "A venue map (e.g. for malls, auditoriums, museums, etc.)."
      }
    ]
  },
  {
    "name": "MarryAction",
    "type": "https://schema.org/MarryAction",
    "source": "generated",
    "description": "The act of marrying a person.",
    "parentTypes": [
      "https://schema.org/InteractAction"
    ]
  },
  {
    "name": "Mass",
    "type": "https://schema.org/Mass",
    "source": "generated",
    "description": "Properties that take Mass as values are of the form '&lt;Number&gt; &lt;Mass unit of measure&gt;'. E.g., '7 kg'.",
    "parentTypes": [
      "https://schema.org/Quantity"
    ]
  },
  {
    "name": "MathSolver",
    "type": "https://schema.org/MathSolver",
    "source": "generated",
    "description": "A math solver which is capable of solving a subset of mathematical problems.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ],
    "properties": [
      {
        "name": "mathExpression",
        "type": [
          "https://schema.org/SolveMathAction",
          "https://schema.org/Text"
        ],
        "description": "A mathematical expression (e.g. 'x^2-3x=0') that may be solved for a specific variable, simplified, or transformed. This can take many formats, e.g. LaTeX, Ascii-Math, or math as you would write with a keyboard.",
        "expectedTypes": [
          "https://schema.org/SolveMathAction",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/SolveMathAction",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MathSolver"
        ]
      }
    ]
  },
  {
    "name": "MaximumDoseSchedule",
    "type": "https://schema.org/MaximumDoseSchedule",
    "source": "generated",
    "description": "The maximum dosing schedule considered safe for a drug or supplement as recommended by an authority or by the drug/supplement's manufacturer. Capture the recommending authority in the recognizingAuthority property of MedicalEntity.",
    "parentTypes": [
      "https://schema.org/DoseSchedule"
    ]
  },
  {
    "name": "MeasurementMethodEnum",
    "type": "https://schema.org/MeasurementMethodEnum",
    "source": "generated",
    "description": "Enumeration(s) for use with [[measurementMethod]].",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "ExampleMeasurementMethodEnum",
        "type": "https://schema.org/ExampleMeasurementMethodEnum",
        "description": "An example [[MeasurementMethodEnum]] (to remove when real enums are added)."
      }
    ]
  },
  {
    "name": "MeasurementTypeEnumeration",
    "type": "https://schema.org/MeasurementTypeEnumeration",
    "source": "generated",
    "description": "Enumeration of common measurement types (or dimensions), for example \"chest\" for a person, \"inseam\" for pants, \"gauge\" for screws, or \"wheel\" for bicycles.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ]
  },
  {
    "name": "MediaEnumeration",
    "type": "https://schema.org/MediaEnumeration",
    "source": "generated",
    "description": "MediaEnumeration enumerations are lists of codes, labels etc. useful for describing media objects. They may be reflections of externally developed lists, or created at schema.org, or a combination.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ]
  },
  {
    "name": "MediaGallery",
    "type": "https://schema.org/MediaGallery",
    "source": "generated",
    "description": "Web page type: Media gallery page. A mixed-media page that can contain media such as images, videos, and other multimedia.",
    "parentTypes": [
      "https://schema.org/CollectionPage"
    ]
  },
  {
    "name": "MediaManipulationRatingEnumeration",
    "type": "https://schema.org/MediaManipulationRatingEnumeration",
    "source": "generated",
    "description": " Codes for use with the [[mediaAuthenticityCategory]] property, indicating the authenticity of a media object (in the context of how it was published or shared). In general these codes are not mutually exclusive, although some combinations (such as 'original' versus 'transformed', 'edited' and 'staged') would be contradictory if applied in the same [[MediaReview]]. Note that the application of these codes is with regard to a piece of media shared or published in a particular context.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "DecontextualizedContent",
        "type": "https://schema.org/DecontextualizedContent",
        "description": "Content coded 'missing context' in a [[MediaReview]], considered in the context of how it was published or shared.\n\nFor a [[VideoObject]] to be 'missing context': Presenting unaltered video in an inaccurate manner that misrepresents the footage. For example, using incorrect dates or locations, altering the transcript or sharing brief clips from a longer video to mislead viewers. (A video rated 'original' can also be missing context.)\n\nFor an [[ImageObject]] to be 'missing context': Presenting unaltered images in an inaccurate manner to misrepresent the image and mislead the viewer. For example, a common tactic is using an unaltered image but saying it came from a different time or place. (An image rated 'original' can also be missing context.)\n\nFor an [[ImageObject]] with embedded text to be 'missing context': An unaltered image presented in an inaccurate manner to misrepresent the image and mislead the viewer. For example, a common tactic is using an unaltered image but saying it came from a different time or place. (An 'original' image with inaccurate text would generally fall in this category.)\n\nFor an [[AudioObject]] to be 'missing context': Unaltered audio presented in an inaccurate manner that misrepresents it. For example, using incorrect dates or locations, or sharing brief clips from a longer recording to mislead viewers. (Audio rated “original” can also be missing context.)\n"
      },
      {
        "name": "EditedOrCroppedContent",
        "type": "https://schema.org/EditedOrCroppedContent",
        "description": "Content coded 'edited or cropped content' in a [[MediaReview]], considered in the context of how it was published or shared.\n\nFor a [[VideoObject]] to be 'edited or cropped content': The video has been edited or rearranged. This category applies to time edits, including editing multiple videos together to alter the story being told or editing out large portions from a video.\n\nFor an [[ImageObject]] to be 'edited or cropped content': Presenting a part of an image from a larger whole to mislead the viewer.\n\nFor an [[ImageObject]] with embedded text to be 'edited or cropped content': Presenting a part of an image from a larger whole to mislead the viewer.\n\nFor an [[AudioObject]] to be 'edited or cropped content': The audio has been edited or rearranged. This category applies to time edits, including editing multiple audio clips together to alter the story being told or editing out large portions from the recording.\n"
      },
      {
        "name": "OriginalMediaContent",
        "type": "https://schema.org/OriginalMediaContent",
        "description": "Content coded 'as original media content' in a [[MediaReview]], considered in the context of how it was published or shared.\n\nFor a [[VideoObject]] to be 'original': No evidence the footage has been misleadingly altered or manipulated, though it may contain false or misleading claims.\n\nFor an [[ImageObject]] to be 'original': No evidence the image has been misleadingly altered or manipulated, though it may still contain false or misleading claims.\n\nFor an [[ImageObject]] with embedded text to be 'original': No evidence the image has been misleadingly altered or manipulated, though it may still contain false or misleading claims.\n\nFor an [[AudioObject]] to be 'original': No evidence the audio has been misleadingly altered or manipulated, though it may contain false or misleading claims.\n"
      },
      {
        "name": "SatireOrParodyContent",
        "type": "https://schema.org/SatireOrParodyContent",
        "description": "Content coded 'satire or parody content' in a [[MediaReview]], considered in the context of how it was published or shared.\n\nFor a [[VideoObject]] to be 'satire or parody content': A video that was created as political or humorous commentary and is presented in that context. (Reshares of satire/parody content that do not include relevant context are more likely to fall under the “missing context” rating.)\n\nFor an [[ImageObject]] to be 'satire or parody content': An image that was created as political or humorous commentary and is presented in that context. (Reshares of satire/parody content that do not include relevant context are more likely to fall under the “missing context” rating.)\n\nFor an [[ImageObject]] with embedded text to be 'satire or parody content': An image that was created as political or humorous commentary and is presented in that context. (Reshares of satire/parody content that do not include relevant context are more likely to fall under the “missing context” rating.)\n\nFor an [[AudioObject]] to be 'satire or parody content': Audio that was created as political or humorous commentary and is presented in that context. (Reshares of satire/parody content that do not include relevant context are more likely to fall under the “missing context” rating.)\n"
      },
      {
        "name": "StagedContent",
        "type": "https://schema.org/StagedContent",
        "description": "Content coded 'staged content' in a [[MediaReview]], considered in the context of how it was published or shared.\n\nFor a [[VideoObject]] to be 'staged content': A video that has been created using actors or similarly contrived.\n\nFor an [[ImageObject]] to be 'staged content': An image that was created using actors or similarly contrived, such as a screenshot of a fake tweet.\n\nFor an [[ImageObject]] with embedded text to be 'staged content': An image that was created using actors or similarly contrived, such as a screenshot of a fake tweet.\n\nFor an [[AudioObject]] to be 'staged content': Audio that has been created using actors or similarly contrived.\n"
      },
      {
        "name": "TransformedContent",
        "type": "https://schema.org/TransformedContent",
        "description": "Content coded 'transformed content' in a [[MediaReview]], considered in the context of how it was published or shared.\n\nFor a [[VideoObject]] to be 'transformed content':  or all of the video has been manipulated to transform the footage itself. This category includes using tools like the Adobe Suite to change the speed of the video, add or remove visual elements or dub audio. Deepfakes are also a subset of transformation.\n\nFor an [[ImageObject]] to be 'transformed content': Adding or deleting visual elements to give the image a different meaning with the intention to mislead.\n\nFor an [[ImageObject]] with embedded text to be 'transformed content': Adding or deleting visual elements to give the image a different meaning with the intention to mislead.\n\nFor an [[AudioObject]] to be 'transformed content': Part or all of the audio has been manipulated to alter the words or sounds, or the audio has been synthetically generated, such as to create a sound-alike voice.\n"
      }
    ]
  },
  {
    "name": "MediaObject",
    "type": "https://schema.org/MediaObject",
    "source": "generated",
    "description": "A media object, such as an image, video, audio, or text object embedded in a web page or a downloadable dataset i.e. DataDownload. Note that a creative work may have many media objects associated with it on the same web page. For example, a page about a single song (MusicRecording) may have a music video (VideoObject), and a high and low bandwidth audio stream (2 AudioObject's).",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ],
    "properties": [
      {
        "name": "associatedArticle",
        "type": "https://schema.org/NewsArticle",
        "description": "A NewsArticle associated with the Media Object.",
        "expectedTypes": [
          "https://schema.org/NewsArticle"
        ],
        "rangeTypes": [
          "https://schema.org/NewsArticle"
        ],
        "domainTypes": [
          "https://schema.org/MediaObject"
        ]
      },
      {
        "name": "bitrate",
        "type": "https://schema.org/Text",
        "description": "The bitrate of the media object.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MediaObject"
        ]
      },
      {
        "name": "contentSize",
        "type": "https://schema.org/Text",
        "description": "File size in (mega/kilo)bytes.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MediaObject"
        ]
      },
      {
        "name": "contentUrl",
        "type": "https://schema.org/URL",
        "description": "Actual bytes of the media object, for example the image file or video file.",
        "expectedTypes": [
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/MediaObject"
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
        "name": "embedUrl",
        "type": "https://schema.org/URL",
        "description": "A URL pointing to a player for a specific video. In general, this is the information in the ```src``` element of an ```embed``` tag and should not be the same as the content of the ```loc``` tag.",
        "expectedTypes": [
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/MediaObject"
        ]
      },
      {
        "name": "encodesCreativeWork",
        "type": "https://schema.org/CreativeWork",
        "description": "The CreativeWork encoded by this media object.",
        "expectedTypes": [
          "https://schema.org/CreativeWork"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork"
        ],
        "domainTypes": [
          "https://schema.org/MediaObject"
        ],
        "inverseOf": "https://schema.org/encoding"
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
        "name": "playerType",
        "type": "https://schema.org/Text",
        "description": "Player type required&#x2014;for example, Flash or Silverlight.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MediaObject"
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
        "name": "regionsAllowed",
        "type": "https://schema.org/Place",
        "description": "The regions where the media is allowed. If not specified, then it's assumed to be allowed everywhere. Specify the countries in [ISO 3166 format](http://en.wikipedia.org/wiki/ISO_3166).",
        "expectedTypes": [
          "https://schema.org/Place"
        ],
        "rangeTypes": [
          "https://schema.org/Place"
        ],
        "domainTypes": [
          "https://schema.org/MediaObject"
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
      },
      {
        "name": "sha256",
        "type": "https://schema.org/Text",
        "description": "The [SHA-2](https://en.wikipedia.org/wiki/SHA-2) SHA256 hash of the content of the item. For example, a zero-length input has value 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MediaObject"
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
        "name": "uploadDate",
        "type": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "description": "Date (including time if available) when this media object was uploaded to this site.",
        "expectedTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/MediaObject"
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
    "name": "MediaReview",
    "type": "https://schema.org/MediaReview",
    "source": "generated",
    "description": "A [[MediaReview]] is a more specialized form of Review dedicated to the evaluation of media content online, typically in the context of fact-checking and misinformation.\n    For more general reviews of media in the broader sense, use [[UserReview]], [[CriticReview]] or other [[Review]] types. This definition is\n    a work in progress. While the [[MediaManipulationRatingEnumeration]] list reflects significant community review amongst fact-checkers and others working\n    to combat misinformation, the specific structures for representing media objects, their versions and publication context, are still evolving. Similarly, best practices for the relationship between [[MediaReview]] and [[ClaimReview]] markup have not yet been finalized.",
    "parentTypes": [
      "https://schema.org/Review"
    ],
    "properties": [
      {
        "name": "mediaAuthenticityCategory",
        "type": "https://schema.org/MediaManipulationRatingEnumeration",
        "description": "Indicates a MediaManipulationRatingEnumeration classification of a media object (in the context of how it was published or shared).",
        "expectedTypes": [
          "https://schema.org/MediaManipulationRatingEnumeration"
        ],
        "rangeTypes": [
          "https://schema.org/MediaManipulationRatingEnumeration"
        ],
        "domainTypes": [
          "https://schema.org/MediaReview"
        ]
      },
      {
        "name": "originalMediaContextDescription",
        "type": "https://schema.org/Text",
        "description": "Describes, in a [[MediaReview]] when dealing with [[DecontextualizedContent]], background information that can contribute to better interpretation of the [[MediaObject]].",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MediaReview"
        ]
      },
      {
        "name": "originalMediaLink",
        "type": [
          "https://schema.org/MediaObject",
          "https://schema.org/URL",
          "https://schema.org/WebPage"
        ],
        "description": "Link to the page containing an original version of the content, or directly to an online copy of the original [[MediaObject]] content, e.g. video file.",
        "expectedTypes": [
          "https://schema.org/MediaObject",
          "https://schema.org/URL",
          "https://schema.org/WebPage"
        ],
        "rangeTypes": [
          "https://schema.org/MediaObject",
          "https://schema.org/URL",
          "https://schema.org/WebPage"
        ],
        "domainTypes": [
          "https://schema.org/MediaReview"
        ]
      }
    ]
  },
  {
    "name": "MediaReviewItem",
    "type": "https://schema.org/MediaReviewItem",
    "source": "generated",
    "description": "Represents an item or group of closely related items treated as a unit for the sake of evaluation in a [[MediaReview]]. Authorship etc. apply to the items rather than to the curation/grouping or reviewing party.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ],
    "properties": [
      {
        "name": "mediaItemAppearance",
        "type": "https://schema.org/MediaObject",
        "description": "In the context of a [[MediaReview]], indicates specific media item(s) that are grouped using a [[MediaReviewItem]].",
        "expectedTypes": [
          "https://schema.org/MediaObject"
        ],
        "rangeTypes": [
          "https://schema.org/MediaObject"
        ],
        "domainTypes": [
          "https://schema.org/MediaReviewItem"
        ]
      }
    ]
  },
  {
    "name": "MediaSubscription",
    "type": "https://schema.org/MediaSubscription",
    "source": "generated",
    "description": "A subscription which allows a user to access media including audio, video, books, etc.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "authenticator",
        "type": "https://schema.org/Organization",
        "description": "The Organization responsible for authenticating the user's subscription. For example, many media apps require a cable/satellite provider to authenticate your subscription before playing media.",
        "expectedTypes": [
          "https://schema.org/Organization"
        ],
        "rangeTypes": [
          "https://schema.org/Organization"
        ],
        "domainTypes": [
          "https://schema.org/MediaSubscription"
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
    "name": "MedicalAudience",
    "type": "https://schema.org/MedicalAudience",
    "source": "generated",
    "description": "Target audiences for medical web pages.",
    "parentTypes": [
      "https://schema.org/Audience",
      "https://schema.org/PeopleAudience"
    ]
  },
  {
    "name": "MedicalAudienceType",
    "type": "https://schema.org/MedicalAudienceType",
    "source": "generated",
    "description": "Target audiences types for medical web pages. Enumerated type.",
    "parentTypes": [
      "https://schema.org/MedicalEnumeration"
    ],
    "enumerationValues": [
      {
        "name": "Clinician",
        "type": "https://schema.org/Clinician",
        "description": "Medical clinicians, including practicing physicians and other medical professionals involved in clinical practice."
      },
      {
        "name": "MedicalResearcher",
        "type": "https://schema.org/MedicalResearcher",
        "description": "Medical researchers."
      }
    ]
  },
  {
    "name": "MedicalBusiness",
    "type": "https://schema.org/MedicalBusiness",
    "source": "generated",
    "description": "A particular physical or virtual business of an organization for medical purposes. Examples of MedicalBusiness include different businesses run by health professionals.",
    "parentTypes": [
      "https://schema.org/LocalBusiness"
    ]
  },
  {
    "name": "MedicalCause",
    "type": "https://schema.org/MedicalCause",
    "source": "generated",
    "description": "The causative agent(s) that are responsible for the pathophysiologic process that eventually results in a medical condition, symptom or sign. In this schema, unless otherwise specified this is meant to be the proximate cause of the medical condition, symptom or sign. The proximate cause is defined as the causative agent that most directly results in the medical condition, symptom or sign. For example, the HIV virus could be considered a cause of AIDS. Or in a diagnostic context, if a patient fell and sustained a hip fracture and two days later sustained a pulmonary embolism which eventuated in a cardiac arrest, the cause of the cardiac arrest (the proximate cause) would be the pulmonary embolism and not the fall. Medical causes can include cardiovascular, chemical, dermatologic, endocrine, environmental, gastroenterologic, genetic, hematologic, gynecologic, iatrogenic, infectious, musculoskeletal, neurologic, nutritional, obstetric, oncologic, otolaryngologic, pharmacologic, psychiatric, pulmonary, renal, rheumatologic, toxic, traumatic, or urologic causes; medical conditions can be causes as well.",
    "parentTypes": [
      "https://schema.org/MedicalEntity"
    ],
    "properties": [
      {
        "name": "causeOf",
        "type": "https://schema.org/MedicalEntity",
        "description": "The condition, complication, symptom, sign, etc. caused.",
        "expectedTypes": [
          "https://schema.org/MedicalEntity"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalEntity"
        ],
        "domainTypes": [
          "https://schema.org/MedicalCause"
        ],
        "inverseOf": "https://schema.org/cause"
      }
    ]
  },
  {
    "name": "MedicalClinic",
    "type": "https://schema.org/MedicalClinic",
    "source": "generated",
    "description": "A facility, often associated with a hospital or medical school, that is devoted to the specific diagnosis and/or healthcare. Previously limited to outpatients but with evolution it may be open to inpatients as well.",
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
    "name": "MedicalCode",
    "type": "https://schema.org/MedicalCode",
    "source": "generated",
    "description": "A code for a medical entity.",
    "parentTypes": [
      "https://schema.org/CategoryCode",
      "https://schema.org/MedicalIntangible"
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
        "name": "codingSystem",
        "type": "https://schema.org/Text",
        "description": "The coding system, e.g. 'ICD-10'.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MedicalCode"
        ]
      }
    ]
  },
  {
    "name": "MedicalCondition",
    "type": "https://schema.org/MedicalCondition",
    "source": "generated",
    "description": "Any condition of the human body that affects the normal functioning of a person, whether physically or mentally. Includes diseases, injuries, disabilities, disorders, syndromes, etc.",
    "parentTypes": [
      "https://schema.org/MedicalEntity"
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
        "name": "cause",
        "type": "https://schema.org/MedicalCause",
        "description": "The cause of a medical condition.",
        "expectedTypes": [
          "https://schema.org/MedicalCause"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalCause"
        ],
        "domainTypes": [
          "https://schema.org/MedicalCondition"
        ],
        "inverseOf": "https://schema.org/causeOf"
      },
      {
        "name": "differentialDiagnosis",
        "type": "https://schema.org/DDxElement",
        "description": "One of a set of differential diagnoses for the condition. Specifically, a closely-related or competing diagnosis typically considered later in the cognitive process whereby this medical condition is distinguished from others most likely responsible for a similar collection of signs and symptoms to reach the most parsimonious diagnosis or diagnoses in a patient.",
        "expectedTypes": [
          "https://schema.org/DDxElement"
        ],
        "rangeTypes": [
          "https://schema.org/DDxElement"
        ],
        "domainTypes": [
          "https://schema.org/MedicalCondition"
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
        "name": "expectedPrognosis",
        "type": "https://schema.org/Text",
        "description": "The likely outcome in either the short term or long term of the medical condition.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MedicalCondition"
        ]
      },
      {
        "name": "naturalProgression",
        "type": "https://schema.org/Text",
        "description": "The expected progression of the condition if it is not treated and allowed to progress naturally.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MedicalCondition"
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
      },
      {
        "name": "possibleComplication",
        "type": "https://schema.org/Text",
        "description": "A possible unexpected and unfavorable evolution of a medical condition. Complications may include worsening of the signs or symptoms of the disease, extension of the condition to other organ systems, etc.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MedicalCondition"
        ]
      },
      {
        "name": "possibleTreatment",
        "type": [
          "https://schema.org/Drug",
          "https://schema.org/DrugClass",
          "https://schema.org/LifestyleModification",
          "https://schema.org/MedicalTherapy"
        ],
        "description": "A possible treatment to address this condition, sign or symptom.",
        "expectedTypes": [
          "https://schema.org/Drug",
          "https://schema.org/DrugClass",
          "https://schema.org/LifestyleModification",
          "https://schema.org/MedicalTherapy"
        ],
        "rangeTypes": [
          "https://schema.org/Drug",
          "https://schema.org/DrugClass",
          "https://schema.org/LifestyleModification",
          "https://schema.org/MedicalTherapy"
        ],
        "domainTypes": [
          "https://schema.org/MedicalCondition",
          "https://schema.org/MedicalSignOrSymptom"
        ]
      },
      {
        "name": "primaryPrevention",
        "type": "https://schema.org/MedicalTherapy",
        "description": "A preventative therapy used to prevent an initial occurrence of the medical condition, such as vaccination.",
        "expectedTypes": [
          "https://schema.org/MedicalTherapy"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalTherapy"
        ],
        "domainTypes": [
          "https://schema.org/MedicalCondition"
        ]
      },
      {
        "name": "riskFactor",
        "type": "https://schema.org/MedicalRiskFactor",
        "description": "A modifiable or non-modifiable factor that increases the risk of a patient contracting this condition, e.g. age,  coexisting condition.",
        "expectedTypes": [
          "https://schema.org/MedicalRiskFactor"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalRiskFactor"
        ],
        "domainTypes": [
          "https://schema.org/MedicalCondition"
        ]
      },
      {
        "name": "secondaryPrevention",
        "type": [
          "https://schema.org/Drug",
          "https://schema.org/DrugClass",
          "https://schema.org/LifestyleModification",
          "https://schema.org/MedicalTherapy"
        ],
        "description": "A preventative therapy used to prevent reoccurrence of the medical condition after an initial episode of the condition.",
        "expectedTypes": [
          "https://schema.org/Drug",
          "https://schema.org/DrugClass",
          "https://schema.org/LifestyleModification",
          "https://schema.org/MedicalTherapy"
        ],
        "rangeTypes": [
          "https://schema.org/Drug",
          "https://schema.org/DrugClass",
          "https://schema.org/LifestyleModification",
          "https://schema.org/MedicalTherapy"
        ],
        "domainTypes": [
          "https://schema.org/MedicalCondition"
        ]
      },
      {
        "name": "signOrSymptom",
        "type": "https://schema.org/MedicalSignOrSymptom",
        "description": "A sign or symptom of this condition. Signs are objective or physically observable manifestations of the medical condition while symptoms are the subjective experience of the medical condition.",
        "expectedTypes": [
          "https://schema.org/MedicalSignOrSymptom"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalSignOrSymptom"
        ],
        "domainTypes": [
          "https://schema.org/MedicalCondition"
        ]
      },
      {
        "name": "stage",
        "type": "https://schema.org/MedicalConditionStage",
        "description": "The stage of the condition, if applicable.",
        "expectedTypes": [
          "https://schema.org/MedicalConditionStage"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalConditionStage"
        ],
        "domainTypes": [
          "https://schema.org/MedicalCondition"
        ]
      },
      {
        "name": "status",
        "type": [
          "https://schema.org/EventStatusType",
          "https://schema.org/MedicalStudyStatus",
          "https://schema.org/Text"
        ],
        "description": "The status of the study (enumerated).",
        "expectedTypes": [
          "https://schema.org/EventStatusType",
          "https://schema.org/MedicalStudyStatus",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/EventStatusType",
          "https://schema.org/MedicalStudyStatus",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MedicalCondition",
          "https://schema.org/MedicalProcedure",
          "https://schema.org/MedicalStudy"
        ]
      },
      {
        "name": "typicalTest",
        "type": "https://schema.org/MedicalTest",
        "description": "A medical test typically performed given this condition.",
        "expectedTypes": [
          "https://schema.org/MedicalTest"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalTest"
        ],
        "domainTypes": [
          "https://schema.org/MedicalCondition"
        ]
      }
    ]
  },
  {
    "name": "MedicalConditionStage",
    "type": "https://schema.org/MedicalConditionStage",
    "source": "generated",
    "description": "A stage of a medical condition, such as 'Stage IIIa'.",
    "parentTypes": [
      "https://schema.org/MedicalIntangible"
    ],
    "properties": [
      {
        "name": "stageAsNumber",
        "type": "https://schema.org/Number",
        "description": "The stage represented as a number, e.g. 3.",
        "expectedTypes": [
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/MedicalConditionStage"
        ]
      },
      {
        "name": "subStageSuffix",
        "type": "https://schema.org/Text",
        "description": "The substage, e.g. 'a' for Stage IIIa.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MedicalConditionStage"
        ]
      }
    ]
  },
  {
    "name": "MedicalContraindication",
    "type": "https://schema.org/MedicalContraindication",
    "source": "generated",
    "description": "A condition or factor that serves as a reason to withhold a certain medical therapy. Contraindications can be absolute (there are no reasonable circumstances for undertaking a course of action) or relative (the patient is at higher risk of complications, but these risks may be outweighed by other considerations or mitigated by other measures).",
    "parentTypes": [
      "https://schema.org/MedicalEntity"
    ]
  },
  {
    "name": "MedicalDevice",
    "type": "https://schema.org/MedicalDevice",
    "source": "generated",
    "description": "Any object used in a medical capacity, such as to diagnose or treat a patient.",
    "parentTypes": [
      "https://schema.org/MedicalEntity"
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
        "name": "contraindication",
        "type": [
          "https://schema.org/MedicalContraindication",
          "https://schema.org/Text"
        ],
        "description": "A contraindication for this therapy.",
        "expectedTypes": [
          "https://schema.org/MedicalContraindication",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalContraindication",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MedicalDevice",
          "https://schema.org/MedicalTherapy"
        ]
      },
      {
        "name": "postOp",
        "type": "https://schema.org/Text",
        "description": "A description of the postoperative procedures, care, and/or followups for this device.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MedicalDevice"
        ]
      },
      {
        "name": "preOp",
        "type": "https://schema.org/Text",
        "description": "A description of the workup, testing, and other preparations required before implanting this device.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MedicalDevice"
        ]
      },
      {
        "name": "procedure",
        "type": "https://schema.org/Text",
        "description": "A description of the procedure involved in setting up, using, and/or installing the device.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MedicalDevice"
        ]
      },
      {
        "name": "seriousAdverseOutcome",
        "type": "https://schema.org/MedicalEntity",
        "description": "A possible serious complication and/or serious side effect of this therapy. Serious adverse outcomes include those that are life-threatening; result in death, disability, or permanent damage; require hospitalization or prolong existing hospitalization; cause congenital anomalies or birth defects; or jeopardize the patient and may require medical or surgical intervention to prevent one of the outcomes in this definition.",
        "expectedTypes": [
          "https://schema.org/MedicalEntity"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalEntity"
        ],
        "domainTypes": [
          "https://schema.org/MedicalDevice",
          "https://schema.org/MedicalTherapy"
        ]
      }
    ]
  },
  {
    "name": "MedicalDevicePurpose",
    "type": "https://schema.org/MedicalDevicePurpose",
    "source": "generated",
    "description": "Categories of medical devices, organized by the purpose or intended use of the device.",
    "parentTypes": [
      "https://schema.org/MedicalEnumeration"
    ],
    "enumerationValues": [
      {
        "name": "Diagnostic",
        "type": "https://schema.org/Diagnostic",
        "description": "A medical device used for diagnostic purposes."
      },
      {
        "name": "Therapeutic",
        "type": "https://schema.org/Therapeutic",
        "description": "A medical device used for therapeutic purposes."
      }
    ]
  },
  {
    "name": "MedicalEntity",
    "type": "https://schema.org/MedicalEntity",
    "source": "generated",
    "description": "The most generic type of entity related to health and the practice of medicine.",
    "parentTypes": [
      "https://schema.org/Thing"
    ],
    "properties": [
      {
        "name": "code",
        "type": "https://schema.org/MedicalCode",
        "description": "A medical code for the entity, taken from a controlled vocabulary or ontology such as ICD-9, DiseasesDB, MeSH, SNOMED-CT, RxNorm, etc.",
        "expectedTypes": [
          "https://schema.org/MedicalCode"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalCode"
        ],
        "domainTypes": [
          "https://schema.org/MedicalEntity"
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
        "name": "guideline",
        "type": "https://schema.org/MedicalGuideline",
        "description": "A medical guideline related to this entity.",
        "expectedTypes": [
          "https://schema.org/MedicalGuideline"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalGuideline"
        ],
        "domainTypes": [
          "https://schema.org/MedicalEntity"
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
        "name": "medicineSystem",
        "type": "https://schema.org/MedicineSystem",
        "description": "The system of medicine that includes this MedicalEntity, for example 'evidence-based', 'homeopathic', 'chiropractic', etc.",
        "expectedTypes": [
          "https://schema.org/MedicineSystem"
        ],
        "rangeTypes": [
          "https://schema.org/MedicineSystem"
        ],
        "domainTypes": [
          "https://schema.org/MedicalEntity"
        ]
      },
      {
        "name": "recognizingAuthority",
        "type": "https://schema.org/Organization",
        "description": "If applicable, the organization that officially recognizes this entity as part of its endorsed system of medicine.",
        "expectedTypes": [
          "https://schema.org/Organization"
        ],
        "rangeTypes": [
          "https://schema.org/Organization"
        ],
        "domainTypes": [
          "https://schema.org/MedicalEntity"
        ]
      },
      {
        "name": "relevantSpecialty",
        "type": "https://schema.org/MedicalSpecialty",
        "description": "If applicable, a medical specialty in which this entity is relevant.",
        "expectedTypes": [
          "https://schema.org/MedicalSpecialty"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalSpecialty"
        ],
        "domainTypes": [
          "https://schema.org/MedicalEntity"
        ]
      },
      {
        "name": "study",
        "type": "https://schema.org/MedicalStudy",
        "description": "A medical study or trial related to this entity.",
        "expectedTypes": [
          "https://schema.org/MedicalStudy"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalStudy"
        ],
        "domainTypes": [
          "https://schema.org/MedicalEntity"
        ]
      }
    ]
  },
  {
    "name": "MedicalEnumeration",
    "type": "https://schema.org/MedicalEnumeration",
    "source": "generated",
    "description": "Enumerations related to health and the practice of medicine: A concept that is used to attribute a quality to another concept, as a qualifier, a collection of items or a listing of all of the elements of a set in medicine practice.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ]
  },
  {
    "name": "MedicalEvidenceLevel",
    "type": "https://schema.org/MedicalEvidenceLevel",
    "source": "generated",
    "description": "Level of evidence for a medical guideline. Enumerated type.",
    "parentTypes": [
      "https://schema.org/MedicalEnumeration"
    ],
    "enumerationValues": [
      {
        "name": "EvidenceLevelA",
        "type": "https://schema.org/EvidenceLevelA",
        "description": "Data derived from multiple randomized clinical trials or meta-analyses."
      },
      {
        "name": "EvidenceLevelB",
        "type": "https://schema.org/EvidenceLevelB",
        "description": "Data derived from a single randomized trial, or nonrandomized studies."
      },
      {
        "name": "EvidenceLevelC",
        "type": "https://schema.org/EvidenceLevelC",
        "description": "Only consensus opinion of experts, case studies, or standard-of-care."
      }
    ]
  },
  {
    "name": "MedicalGuideline",
    "type": "https://schema.org/MedicalGuideline",
    "source": "generated",
    "description": "Any recommendation made by a standard society (e.g. ACC/AHA) or consensus statement that denotes how to diagnose and treat a particular condition. Note: this type should be used to tag the actual guideline recommendation; if the guideline recommendation occurs in a larger scholarly article, use MedicalScholarlyArticle to tag the overall article, not this type. Note also: the organization making the recommendation should be captured in the recognizingAuthority base property of MedicalEntity.",
    "parentTypes": [
      "https://schema.org/MedicalEntity"
    ],
    "properties": [
      {
        "name": "evidenceLevel",
        "type": "https://schema.org/MedicalEvidenceLevel",
        "description": "Strength of evidence of the data used to formulate the guideline (enumerated).",
        "expectedTypes": [
          "https://schema.org/MedicalEvidenceLevel"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalEvidenceLevel"
        ],
        "domainTypes": [
          "https://schema.org/MedicalGuideline"
        ]
      },
      {
        "name": "evidenceOrigin",
        "type": "https://schema.org/Text",
        "description": "Source of the data used to formulate the guidance, e.g. RCT, consensus opinion, etc.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MedicalGuideline"
        ]
      },
      {
        "name": "guidelineDate",
        "type": "https://schema.org/Date",
        "description": "Date on which this guideline's recommendation was made.",
        "expectedTypes": [
          "https://schema.org/Date"
        ],
        "rangeTypes": [
          "https://schema.org/Date"
        ],
        "domainTypes": [
          "https://schema.org/MedicalGuideline"
        ]
      },
      {
        "name": "guidelineSubject",
        "type": "https://schema.org/MedicalEntity",
        "description": "The medical conditions, treatments, etc. that are the subject of the guideline.",
        "expectedTypes": [
          "https://schema.org/MedicalEntity"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalEntity"
        ],
        "domainTypes": [
          "https://schema.org/MedicalGuideline"
        ]
      }
    ]
  },
  {
    "name": "MedicalGuidelineContraindication",
    "type": "https://schema.org/MedicalGuidelineContraindication",
    "source": "generated",
    "description": "A guideline contraindication that designates a process as harmful and where quality of the data supporting the contraindication is sound.",
    "parentTypes": [
      "https://schema.org/MedicalGuideline"
    ]
  },
  {
    "name": "MedicalGuidelineRecommendation",
    "type": "https://schema.org/MedicalGuidelineRecommendation",
    "source": "generated",
    "description": "A guideline recommendation that is regarded as efficacious and where quality of the data supporting the recommendation is sound.",
    "parentTypes": [
      "https://schema.org/MedicalGuideline"
    ],
    "properties": [
      {
        "name": "recommendationStrength",
        "type": "https://schema.org/Text",
        "description": "Strength of the guideline's recommendation (e.g. 'class I').",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MedicalGuidelineRecommendation"
        ]
      }
    ]
  },
  {
    "name": "MedicalImagingTechnique",
    "type": "https://schema.org/MedicalImagingTechnique",
    "source": "generated",
    "description": "Any medical imaging modality typically used for diagnostic purposes. Enumerated type.",
    "parentTypes": [
      "https://schema.org/MedicalEnumeration"
    ],
    "enumerationValues": [
      {
        "name": "CT",
        "type": "https://schema.org/CT",
        "description": "X-ray computed tomography imaging."
      },
      {
        "name": "MRI",
        "type": "https://schema.org/MRI",
        "description": "Magnetic resonance imaging."
      },
      {
        "name": "PET",
        "type": "https://schema.org/PET",
        "description": "Positron emission tomography imaging."
      },
      {
        "name": "Radiography",
        "type": "https://schema.org/Radiography",
        "description": "Radiography is an imaging technique that uses electromagnetic radiation other than visible light, especially X-rays, to view the internal structure of a non-uniformly composed and opaque object such as the human body."
      },
      {
        "name": "Ultrasound",
        "type": "https://schema.org/Ultrasound",
        "description": "Ultrasound imaging."
      },
      {
        "name": "XRay",
        "type": "https://schema.org/XRay",
        "description": "X-ray imaging."
      }
    ]
  },
  {
    "name": "MedicalIndication",
    "type": "https://schema.org/MedicalIndication",
    "source": "generated",
    "description": "A condition or factor that indicates use of a medical therapy, including signs, symptoms, risk factors, anatomical states, etc.",
    "parentTypes": [
      "https://schema.org/MedicalEntity"
    ]
  },
  {
    "name": "MedicalIntangible",
    "type": "https://schema.org/MedicalIntangible",
    "source": "generated",
    "description": "A utility class that serves as the umbrella for a number of 'intangible' things in the medical space.",
    "parentTypes": [
      "https://schema.org/MedicalEntity"
    ]
  },
  {
    "name": "MedicalObservationalStudy",
    "type": "https://schema.org/MedicalObservationalStudy",
    "source": "generated",
    "description": "An observational study is a type of medical study that attempts to infer the possible effect of a treatment through observation of a cohort of subjects over a period of time. In an observational study, the assignment of subjects into treatment groups versus control groups is outside the control of the investigator. This is in contrast with controlled studies, such as the randomized controlled trials represented by MedicalTrial, where each subject is randomly assigned to a treatment group or a control group before the start of the treatment.",
    "parentTypes": [
      "https://schema.org/MedicalStudy"
    ],
    "properties": [
      {
        "name": "studyDesign",
        "type": "https://schema.org/MedicalObservationalStudyDesign",
        "description": "Specifics about the observational study design (enumerated).",
        "expectedTypes": [
          "https://schema.org/MedicalObservationalStudyDesign"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalObservationalStudyDesign"
        ],
        "domainTypes": [
          "https://schema.org/MedicalObservationalStudy"
        ]
      }
    ]
  },
  {
    "name": "MedicalObservationalStudyDesign",
    "type": "https://schema.org/MedicalObservationalStudyDesign",
    "source": "generated",
    "description": "Design models for observational medical studies. Enumerated type.",
    "parentTypes": [
      "https://schema.org/MedicalEnumeration"
    ],
    "enumerationValues": [
      {
        "name": "CaseSeries",
        "type": "https://schema.org/CaseSeries",
        "description": "A case series (also known as a clinical series) is a medical research study that tracks patients with a known exposure given similar treatment or examines their medical records for exposure and outcome. A case series can be retrospective or prospective and usually involves a smaller number of patients than the more powerful case-control studies or randomized controlled trials. Case series may be consecutive or non-consecutive, depending on whether all cases presenting to the reporting authors over a period of time were included, or only a selection."
      },
      {
        "name": "CohortStudy",
        "type": "https://schema.org/CohortStudy",
        "description": "Also known as a panel study. A cohort study is a form of longitudinal study used in medicine and social science. It is one type of study design and should be compared with a cross-sectional study.  A cohort is a group of people who share a common characteristic or experience within a defined period (e.g., are born, leave school, lose their job, are exposed to a drug or a vaccine, etc.). The comparison group may be the general population from which the cohort is drawn, or it may be another cohort of persons thought to have had little or no exposure to the substance under investigation, but otherwise similar. Alternatively, subgroups within the cohort may be compared with each other."
      },
      {
        "name": "CrossSectional",
        "type": "https://schema.org/CrossSectional",
        "description": "Studies carried out on pre-existing data (usually from 'snapshot' surveys), such as that collected by the Census Bureau. Sometimes called Prevalence Studies."
      },
      {
        "name": "Longitudinal",
        "type": "https://schema.org/Longitudinal",
        "description": "Unlike cross-sectional studies, longitudinal studies track the same people, and therefore the differences observed in those people are less likely to be the result of cultural differences across generations. Longitudinal studies are also used in medicine to uncover predictors of certain diseases."
      },
      {
        "name": "Observational",
        "type": "https://schema.org/Observational",
        "description": "An observational study design."
      },
      {
        "name": "Registry",
        "type": "https://schema.org/Registry",
        "description": "A registry-based study design."
      }
    ]
  },
  {
    "name": "MedicalOrganization",
    "type": "https://schema.org/MedicalOrganization",
    "source": "generated",
    "description": "A medical organization (physical or not), such as hospital, institution or clinic.",
    "parentTypes": [
      "https://schema.org/Organization"
    ],
    "properties": [
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
        "name": "isAcceptingNewPatients",
        "type": "https://schema.org/Boolean",
        "description": "Whether the provider is accepting new patients.",
        "expectedTypes": [
          "https://schema.org/Boolean"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean"
        ],
        "domainTypes": [
          "https://schema.org/MedicalOrganization"
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
    "name": "MedicalProcedure",
    "type": "https://schema.org/MedicalProcedure",
    "source": "generated",
    "description": "A process of care used in either a diagnostic, therapeutic, preventive or palliative capacity that relies on invasive (surgical), non-invasive, or other techniques.",
    "parentTypes": [
      "https://schema.org/MedicalEntity"
    ],
    "properties": [
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
        "name": "followup",
        "type": "https://schema.org/Text",
        "description": "Typical or recommended followup care after the procedure is performed.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MedicalProcedure"
        ]
      },
      {
        "name": "howPerformed",
        "type": "https://schema.org/Text",
        "description": "How the procedure is performed.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MedicalProcedure"
        ]
      },
      {
        "name": "preparation",
        "type": [
          "https://schema.org/MedicalEntity",
          "https://schema.org/Text"
        ],
        "description": "Typical preparation that a patient must undergo before having the procedure performed.",
        "expectedTypes": [
          "https://schema.org/MedicalEntity",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalEntity",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MedicalProcedure"
        ]
      },
      {
        "name": "procedureType",
        "type": "https://schema.org/MedicalProcedureType",
        "description": "The type of procedure, for example Surgical, Noninvasive, or Percutaneous.",
        "expectedTypes": [
          "https://schema.org/MedicalProcedureType"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalProcedureType"
        ],
        "domainTypes": [
          "https://schema.org/MedicalProcedure"
        ]
      },
      {
        "name": "status",
        "type": [
          "https://schema.org/EventStatusType",
          "https://schema.org/MedicalStudyStatus",
          "https://schema.org/Text"
        ],
        "description": "The status of the study (enumerated).",
        "expectedTypes": [
          "https://schema.org/EventStatusType",
          "https://schema.org/MedicalStudyStatus",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/EventStatusType",
          "https://schema.org/MedicalStudyStatus",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MedicalCondition",
          "https://schema.org/MedicalProcedure",
          "https://schema.org/MedicalStudy"
        ]
      }
    ]
  },
  {
    "name": "MedicalProcedureType",
    "type": "https://schema.org/MedicalProcedureType",
    "source": "generated",
    "description": "An enumeration that describes different types of medical procedures.",
    "parentTypes": [
      "https://schema.org/MedicalEnumeration"
    ],
    "enumerationValues": [
      {
        "name": "NoninvasiveProcedure",
        "type": "https://schema.org/NoninvasiveProcedure",
        "description": "A type of medical procedure that involves noninvasive techniques."
      },
      {
        "name": "PercutaneousProcedure",
        "type": "https://schema.org/PercutaneousProcedure",
        "description": "A type of medical procedure that involves percutaneous techniques, where access to organs or tissue is achieved via needle-puncture of the skin. For example, catheter-based procedures like stent delivery."
      }
    ]
  },
  {
    "name": "MedicalRiskCalculator",
    "type": "https://schema.org/MedicalRiskCalculator",
    "source": "generated",
    "description": "A complex mathematical calculation requiring an online calculator, used to assess prognosis. Note: use the url property of Thing to record any URLs for online calculators.",
    "parentTypes": [
      "https://schema.org/MedicalRiskEstimator"
    ]
  },
  {
    "name": "MedicalRiskEstimator",
    "type": "https://schema.org/MedicalRiskEstimator",
    "source": "generated",
    "description": "Any rule set or interactive tool for estimating the risk of developing a complication or condition.",
    "parentTypes": [
      "https://schema.org/MedicalEntity"
    ],
    "properties": [
      {
        "name": "estimatesRiskOf",
        "type": "https://schema.org/MedicalEntity",
        "description": "The condition, complication, or symptom whose risk is being estimated.",
        "expectedTypes": [
          "https://schema.org/MedicalEntity"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalEntity"
        ],
        "domainTypes": [
          "https://schema.org/MedicalRiskEstimator"
        ]
      },
      {
        "name": "includedRiskFactor",
        "type": "https://schema.org/MedicalRiskFactor",
        "description": "A modifiable or non-modifiable risk factor included in the calculation, e.g. age, coexisting condition.",
        "expectedTypes": [
          "https://schema.org/MedicalRiskFactor"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalRiskFactor"
        ],
        "domainTypes": [
          "https://schema.org/MedicalRiskEstimator"
        ]
      }
    ]
  },
  {
    "name": "MedicalRiskFactor",
    "type": "https://schema.org/MedicalRiskFactor",
    "source": "generated",
    "description": "A risk factor is anything that increases a person's likelihood of developing or contracting a disease, medical condition, or complication.",
    "parentTypes": [
      "https://schema.org/MedicalEntity"
    ],
    "properties": [
      {
        "name": "increasesRiskOf",
        "type": "https://schema.org/MedicalEntity",
        "description": "The condition, complication, etc. influenced by this factor.",
        "expectedTypes": [
          "https://schema.org/MedicalEntity"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalEntity"
        ],
        "domainTypes": [
          "https://schema.org/MedicalRiskFactor"
        ]
      }
    ]
  },
  {
    "name": "MedicalRiskScore",
    "type": "https://schema.org/MedicalRiskScore",
    "source": "generated",
    "description": "A simple system that adds up the number of risk factors to yield a score that is associated with prognosis, e.g. CHAD score, TIMI risk score.",
    "parentTypes": [
      "https://schema.org/MedicalRiskEstimator"
    ],
    "properties": [
      {
        "name": "algorithm",
        "type": "https://schema.org/Text",
        "description": "The algorithm or rules to follow to compute the score.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MedicalRiskScore"
        ]
      }
    ]
  },
  {
    "name": "MedicalScholarlyArticle",
    "type": "https://schema.org/MedicalScholarlyArticle",
    "source": "generated",
    "description": "A scholarly article in the medical domain.",
    "parentTypes": [
      "https://schema.org/ScholarlyArticle"
    ],
    "properties": [
      {
        "name": "publicationType",
        "type": "https://schema.org/Text",
        "description": "The type of the medical article, taken from the US NLM MeSH publication type catalog. See also [MeSH documentation](http://www.nlm.nih.gov/mesh/pubtypes.html).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MedicalScholarlyArticle"
        ]
      }
    ]
  },
  {
    "name": "MedicalSign",
    "type": "https://schema.org/MedicalSign",
    "source": "generated",
    "description": "Any physical manifestation of a person's medical condition discoverable by objective diagnostic tests or physical examination.",
    "parentTypes": [
      "https://schema.org/MedicalSignOrSymptom"
    ],
    "properties": [
      {
        "name": "identifyingExam",
        "type": "https://schema.org/PhysicalExam",
        "description": "A physical examination that can identify this sign.",
        "expectedTypes": [
          "https://schema.org/PhysicalExam"
        ],
        "rangeTypes": [
          "https://schema.org/PhysicalExam"
        ],
        "domainTypes": [
          "https://schema.org/MedicalSign"
        ]
      },
      {
        "name": "identifyingTest",
        "type": "https://schema.org/MedicalTest",
        "description": "A diagnostic test that can identify this sign.",
        "expectedTypes": [
          "https://schema.org/MedicalTest"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalTest"
        ],
        "domainTypes": [
          "https://schema.org/MedicalSign"
        ]
      }
    ]
  },
  {
    "name": "MedicalSignOrSymptom",
    "type": "https://schema.org/MedicalSignOrSymptom",
    "source": "generated",
    "description": "Any feature associated or not with a medical condition. In medicine a symptom is generally subjective while a sign is objective.",
    "parentTypes": [
      "https://schema.org/MedicalCondition"
    ],
    "properties": [
      {
        "name": "possibleTreatment",
        "type": [
          "https://schema.org/Drug",
          "https://schema.org/DrugClass",
          "https://schema.org/LifestyleModification",
          "https://schema.org/MedicalTherapy"
        ],
        "description": "A possible treatment to address this condition, sign or symptom.",
        "expectedTypes": [
          "https://schema.org/Drug",
          "https://schema.org/DrugClass",
          "https://schema.org/LifestyleModification",
          "https://schema.org/MedicalTherapy"
        ],
        "rangeTypes": [
          "https://schema.org/Drug",
          "https://schema.org/DrugClass",
          "https://schema.org/LifestyleModification",
          "https://schema.org/MedicalTherapy"
        ],
        "domainTypes": [
          "https://schema.org/MedicalCondition",
          "https://schema.org/MedicalSignOrSymptom"
        ]
      }
    ]
  },
  {
    "name": "MedicalSpecialty",
    "type": "https://schema.org/MedicalSpecialty",
    "source": "generated",
    "description": "Any specific branch of medical science or practice. Medical specialities include clinical specialties that pertain to particular organ systems and their respective disease states, as well as allied health specialties. Enumerated type.",
    "parentTypes": [
      "https://schema.org/MedicalEnumeration",
      "https://schema.org/Specialty"
    ],
    "enumerationValues": [
      {
        "name": "Anesthesia",
        "type": "https://schema.org/Anesthesia",
        "description": "A specific branch of medical science that pertains to study of anesthetics and their application."
      },
      {
        "name": "Audiology",
        "type": "https://schema.org/Audiology",
        "description": "A specific branch of medical science concerned with the diagnosis, management, and non-surgical treatment of hearing, balance, and related auditory processing disorders, including conditions such as tinnitus, hyperacusis, and misophonia."
      },
      {
        "name": "Cardiovascular",
        "type": "https://schema.org/Cardiovascular",
        "description": "A specific branch of medical science that pertains to diagnosis and treatment of disorders of heart and vasculature."
      },
      {
        "name": "CommunityHealth",
        "type": "https://schema.org/CommunityHealth",
        "description": "A field of public health focusing on improving health characteristics of a defined population in relation with their geographical or environment areas."
      },
      {
        "name": "Dentistry",
        "type": "https://schema.org/Dentistry",
        "description": "A branch of medicine that is involved in the dental care."
      },
      {
        "name": "Dermatologic",
        "type": "https://schema.org/Dermatologic",
        "description": "Something relating to or practicing dermatology."
      },
      {
        "name": "Dermatology",
        "type": "https://schema.org/Dermatology",
        "description": "A specific branch of medical science that pertains to diagnosis and treatment of disorders of skin."
      },
      {
        "name": "DietNutrition",
        "type": "https://schema.org/DietNutrition",
        "description": "Dietetics and nutrition as a medical specialty."
      },
      {
        "name": "Emergency",
        "type": "https://schema.org/Emergency",
        "description": "A specific branch of medical science that deals with the evaluation and initial treatment of medical conditions caused by trauma or sudden illness."
      },
      {
        "name": "Endocrine",
        "type": "https://schema.org/Endocrine",
        "description": "A specific branch of medical science that pertains to diagnosis and treatment of disorders of endocrine glands and their secretions."
      },
      {
        "name": "Gastroenterologic",
        "type": "https://schema.org/Gastroenterologic",
        "description": "A specific branch of medical science that pertains to diagnosis and treatment of disorders of digestive system."
      },
      {
        "name": "Genetic",
        "type": "https://schema.org/Genetic",
        "description": "A specific branch of medical science that pertains to hereditary transmission and the variation of inherited characteristics and disorders."
      },
      {
        "name": "Geriatric",
        "type": "https://schema.org/Geriatric",
        "description": "A specific branch of medical science that is concerned with the diagnosis and treatment of diseases, debilities and provision of care to the aged."
      },
      {
        "name": "Gynecologic",
        "type": "https://schema.org/Gynecologic",
        "description": "A specific branch of medical science that pertains to the health care of women, particularly in the diagnosis and treatment of disorders affecting the female reproductive system."
      },
      {
        "name": "Hematologic",
        "type": "https://schema.org/Hematologic",
        "description": "A specific branch of medical science that pertains to diagnosis and treatment of disorders of blood and blood producing organs."
      },
      {
        "name": "Infectious",
        "type": "https://schema.org/Infectious",
        "description": "Something in medical science that pertains to infectious diseases, i.e. caused by bacterial, viral, fungal or parasitic infections."
      },
      {
        "name": "LaboratoryScience",
        "type": "https://schema.org/LaboratoryScience",
        "description": "A medical science pertaining to chemical, hematological, immunologic, microscopic, or bacteriological diagnostic analyses or research."
      },
      {
        "name": "Midwifery",
        "type": "https://schema.org/Midwifery",
        "description": "A nurse-like health profession that deals with pregnancy, childbirth, and the postpartum period (including care of the newborn), besides sexual and reproductive health of women throughout their lives."
      },
      {
        "name": "Musculoskeletal",
        "type": "https://schema.org/Musculoskeletal",
        "description": "A specific branch of medical science that pertains to diagnosis and treatment of disorders of muscles, ligaments and skeletal system."
      },
      {
        "name": "Neurologic",
        "type": "https://schema.org/Neurologic",
        "description": "A specific branch of medical science that studies the nerves and nervous system and its respective disease states."
      },
      {
        "name": "Nursing",
        "type": "https://schema.org/Nursing",
        "description": "A health profession of a person formally educated and trained in the care of the sick or infirm person."
      },
      {
        "name": "Obstetric",
        "type": "https://schema.org/Obstetric",
        "description": "A specific branch of medical science that specializes in the care of women during the prenatal and postnatal care and with the delivery of the child."
      },
      {
        "name": "Oncologic",
        "type": "https://schema.org/Oncologic",
        "description": "A specific branch of medical science that deals with benign and malignant tumors, including the study of their development, diagnosis, treatment and prevention."
      },
      {
        "name": "Ophthalmology",
        "type": "https://schema.org/Ophthalmology",
        "description": "A specific branch of medical science that pertains to the diagnosis and treatment of disorders of the eye and its associated visual structures, including medical and surgical interventions."
      },
      {
        "name": "Optometric",
        "type": "https://schema.org/Optometric",
        "description": "The science or practice of testing visual acuity and prescribing corrective lenses."
      },
      {
        "name": "Otolaryngologic",
        "type": "https://schema.org/Otolaryngologic",
        "description": "A specific branch of medical science that is concerned with the ear, nose and throat and their respective disease states."
      },
      {
        "name": "Pathology",
        "type": "https://schema.org/Pathology",
        "description": "A specific branch of medical science that is concerned with the study of the cause, origin and nature of a disease state, including its consequences as a result of manifestation of the disease. In clinical care, the term is used to designate a branch of medicine using laboratory tests to diagnose and determine the prognostic significance of illness."
      },
      {
        "name": "Pediatric",
        "type": "https://schema.org/Pediatric",
        "description": "A specific branch of medical science that specializes in the care of infants, children and adolescents."
      },
      {
        "name": "PharmacySpecialty",
        "type": "https://schema.org/PharmacySpecialty",
        "description": "The practice or art and science of preparing and dispensing drugs and medicines."
      },
      {
        "name": "Physiotherapy",
        "type": "https://schema.org/Physiotherapy",
        "description": "The practice of treatment of disease, injury, or deformity by physical methods such as massage, heat treatment, and exercise rather than by drugs or surgery."
      },
      {
        "name": "PlasticSurgery",
        "type": "https://schema.org/PlasticSurgery",
        "description": "A specific branch of medical science that pertains to therapeutic or cosmetic repair or re-formation of missing, injured or malformed tissues or body parts by manual and instrumental means."
      },
      {
        "name": "Podiatric",
        "type": "https://schema.org/Podiatric",
        "description": "Podiatry is the care of the human foot, especially the diagnosis and treatment of foot disorders."
      },
      {
        "name": "PrimaryCare",
        "type": "https://schema.org/PrimaryCare",
        "description": "The medical care by a physician, or other health-care professional, who is the patient's first contact with the health-care system and who may recommend a specialist if necessary."
      },
      {
        "name": "Psychiatric",
        "type": "https://schema.org/Psychiatric",
        "description": "A specific branch of medical science that is concerned with the study, treatment, and prevention of mental illness, using both medical and psychological therapies."
      },
      {
        "name": "PublicHealth",
        "type": "https://schema.org/PublicHealth",
        "description": "Branch of medicine that pertains to the health services to improve and protect community health, especially epidemiology, sanitation, immunization, and preventive medicine."
      },
      {
        "name": "Pulmonary",
        "type": "https://schema.org/Pulmonary",
        "description": "A specific branch of medical science that pertains to the study of the respiratory system and its respective disease states."
      },
      {
        "name": "Radiography",
        "type": "https://schema.org/Radiography",
        "description": "Radiography is an imaging technique that uses electromagnetic radiation other than visible light, especially X-rays, to view the internal structure of a non-uniformly composed and opaque object such as the human body."
      },
      {
        "name": "Renal",
        "type": "https://schema.org/Renal",
        "description": "A specific branch of medical science that pertains to the study of the kidneys and its respective disease states."
      },
      {
        "name": "RespiratoryTherapy",
        "type": "https://schema.org/RespiratoryTherapy",
        "description": "The therapy that is concerned with the maintenance or improvement of respiratory function (as in patients with pulmonary disease)."
      },
      {
        "name": "Rheumatologic",
        "type": "https://schema.org/Rheumatologic",
        "description": "A specific branch of medical science that deals with the study and treatment of rheumatic, autoimmune or joint diseases."
      },
      {
        "name": "SpeechPathology",
        "type": "https://schema.org/SpeechPathology",
        "description": "The scientific study and treatment of defects, disorders, and malfunctions of speech and voice, as stuttering, lisping, or lalling, and of language disturbances, as aphasia or delayed language acquisition."
      },
      {
        "name": "Surgical",
        "type": "https://schema.org/Surgical",
        "description": "A specific branch of medical science that pertains to treating diseases, injuries and deformities by manual and instrumental means."
      },
      {
        "name": "Toxicologic",
        "type": "https://schema.org/Toxicologic",
        "description": "A specific branch of medical science that is concerned with poisons, their nature, effects and detection and involved in the treatment of poisoning."
      },
      {
        "name": "Urologic",
        "type": "https://schema.org/Urologic",
        "description": "A specific branch of medical science that is concerned with the diagnosis and treatment of diseases pertaining to the urinary tract and the urogenital system."
      }
    ]
  },
  {
    "name": "MedicalStudy",
    "type": "https://schema.org/MedicalStudy",
    "source": "generated",
    "description": "A medical study is an umbrella type covering all kinds of research studies relating to human medicine or health, including observational studies and interventional trials and registries, randomized, controlled or not. When the specific type of study is known, use one of the extensions of this type, such as MedicalTrial or MedicalObservationalStudy. Also, note that this type should be used to mark up data that describes the study itself; to tag an article that publishes the results of a study, use MedicalScholarlyArticle. Note: use the code property of MedicalEntity to store study IDs, e.g. clinicaltrials.gov ID.",
    "parentTypes": [
      "https://schema.org/MedicalEntity"
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
        "name": "status",
        "type": [
          "https://schema.org/EventStatusType",
          "https://schema.org/MedicalStudyStatus",
          "https://schema.org/Text"
        ],
        "description": "The status of the study (enumerated).",
        "expectedTypes": [
          "https://schema.org/EventStatusType",
          "https://schema.org/MedicalStudyStatus",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/EventStatusType",
          "https://schema.org/MedicalStudyStatus",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MedicalCondition",
          "https://schema.org/MedicalProcedure",
          "https://schema.org/MedicalStudy"
        ]
      },
      {
        "name": "studyLocation",
        "type": "https://schema.org/AdministrativeArea",
        "description": "The location in which the study is taking/took place.",
        "expectedTypes": [
          "https://schema.org/AdministrativeArea"
        ],
        "rangeTypes": [
          "https://schema.org/AdministrativeArea"
        ],
        "domainTypes": [
          "https://schema.org/MedicalStudy"
        ]
      },
      {
        "name": "studySubject",
        "type": "https://schema.org/MedicalEntity",
        "description": "A subject of the study, i.e. one of the medical conditions, therapies, devices, drugs, etc. investigated by the study.",
        "expectedTypes": [
          "https://schema.org/MedicalEntity"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalEntity"
        ],
        "domainTypes": [
          "https://schema.org/MedicalStudy"
        ]
      }
    ]
  },
  {
    "name": "MedicalStudyStatus",
    "type": "https://schema.org/MedicalStudyStatus",
    "source": "generated",
    "description": "The status of a medical study. Enumerated type.",
    "parentTypes": [
      "https://schema.org/MedicalEnumeration"
    ],
    "enumerationValues": [
      {
        "name": "ActiveNotRecruiting",
        "type": "https://schema.org/ActiveNotRecruiting",
        "description": "Active, but not recruiting new participants."
      },
      {
        "name": "Completed",
        "type": "https://schema.org/Completed",
        "description": "Completed."
      },
      {
        "name": "EnrollingByInvitation",
        "type": "https://schema.org/EnrollingByInvitation",
        "description": "Enrolling participants by invitation only."
      },
      {
        "name": "NotYetRecruiting",
        "type": "https://schema.org/NotYetRecruiting",
        "description": "Not yet recruiting."
      },
      {
        "name": "Recruiting",
        "type": "https://schema.org/Recruiting",
        "description": "Recruiting participants."
      },
      {
        "name": "ResultsAvailable",
        "type": "https://schema.org/ResultsAvailable",
        "description": "Results are available."
      },
      {
        "name": "ResultsNotAvailable",
        "type": "https://schema.org/ResultsNotAvailable",
        "description": "Results are not available."
      },
      {
        "name": "Suspended",
        "type": "https://schema.org/Suspended",
        "description": "Suspended."
      },
      {
        "name": "Terminated",
        "type": "https://schema.org/Terminated",
        "description": "Terminated."
      },
      {
        "name": "Withdrawn",
        "type": "https://schema.org/Withdrawn",
        "description": "Withdrawn."
      }
    ]
  },
  {
    "name": "MedicalSymptom",
    "type": "https://schema.org/MedicalSymptom",
    "source": "generated",
    "description": "Any complaint sensed and expressed by the patient (therefore defined as subjective)  like stomachache, lower-back pain, or fatigue.",
    "parentTypes": [
      "https://schema.org/MedicalSignOrSymptom"
    ]
  },
  {
    "name": "MedicalTest",
    "type": "https://schema.org/MedicalTest",
    "source": "generated",
    "description": "Any medical test, typically performed for diagnostic purposes.",
    "parentTypes": [
      "https://schema.org/MedicalEntity"
    ],
    "properties": [
      {
        "name": "affectedBy",
        "type": "https://schema.org/Drug",
        "description": "Drugs that affect the test's results.",
        "expectedTypes": [
          "https://schema.org/Drug"
        ],
        "rangeTypes": [
          "https://schema.org/Drug"
        ],
        "domainTypes": [
          "https://schema.org/MedicalTest"
        ]
      },
      {
        "name": "normalRange",
        "type": [
          "https://schema.org/MedicalEnumeration",
          "https://schema.org/Text"
        ],
        "description": "Range of acceptable values for a typical patient, when applicable.",
        "expectedTypes": [
          "https://schema.org/MedicalEnumeration",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalEnumeration",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MedicalTest"
        ]
      },
      {
        "name": "signDetected",
        "type": "https://schema.org/MedicalSign",
        "description": "A sign detected by the test.",
        "expectedTypes": [
          "https://schema.org/MedicalSign"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalSign"
        ],
        "domainTypes": [
          "https://schema.org/MedicalTest"
        ]
      },
      {
        "name": "usedToDiagnose",
        "type": "https://schema.org/MedicalCondition",
        "description": "A condition the test is used to diagnose.",
        "expectedTypes": [
          "https://schema.org/MedicalCondition"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalCondition"
        ],
        "domainTypes": [
          "https://schema.org/MedicalTest"
        ]
      },
      {
        "name": "usesDevice",
        "type": "https://schema.org/MedicalDevice",
        "description": "Device used to perform the test.",
        "expectedTypes": [
          "https://schema.org/MedicalDevice"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalDevice"
        ],
        "domainTypes": [
          "https://schema.org/MedicalTest"
        ]
      }
    ]
  },
  {
    "name": "MedicalTestPanel",
    "type": "https://schema.org/MedicalTestPanel",
    "source": "generated",
    "description": "Any collection of tests commonly ordered together.",
    "parentTypes": [
      "https://schema.org/MedicalTest"
    ],
    "properties": [
      {
        "name": "subTest",
        "type": "https://schema.org/MedicalTest",
        "description": "A component test of the panel.",
        "expectedTypes": [
          "https://schema.org/MedicalTest"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalTest"
        ],
        "domainTypes": [
          "https://schema.org/MedicalTestPanel"
        ]
      }
    ]
  },
  {
    "name": "MedicalTherapy",
    "type": "https://schema.org/MedicalTherapy",
    "source": "generated",
    "description": "Any medical intervention designed to prevent, treat, and cure human diseases and medical conditions, including both curative and palliative therapies. Medical therapies are typically processes of care relying upon pharmacotherapy, behavioral therapy, supportive therapy (with fluid or nutrition for example), or detoxification (e.g. hemodialysis) aimed at improving or preventing a health condition.",
    "parentTypes": [
      "https://schema.org/TherapeuticProcedure"
    ],
    "properties": [
      {
        "name": "contraindication",
        "type": [
          "https://schema.org/MedicalContraindication",
          "https://schema.org/Text"
        ],
        "description": "A contraindication for this therapy.",
        "expectedTypes": [
          "https://schema.org/MedicalContraindication",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalContraindication",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MedicalDevice",
          "https://schema.org/MedicalTherapy"
        ]
      },
      {
        "name": "duplicateTherapy",
        "type": "https://schema.org/MedicalTherapy",
        "description": "A therapy that duplicates or overlaps this one.",
        "expectedTypes": [
          "https://schema.org/MedicalTherapy"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalTherapy"
        ],
        "domainTypes": [
          "https://schema.org/MedicalTherapy"
        ]
      },
      {
        "name": "seriousAdverseOutcome",
        "type": "https://schema.org/MedicalEntity",
        "description": "A possible serious complication and/or serious side effect of this therapy. Serious adverse outcomes include those that are life-threatening; result in death, disability, or permanent damage; require hospitalization or prolong existing hospitalization; cause congenital anomalies or birth defects; or jeopardize the patient and may require medical or surgical intervention to prevent one of the outcomes in this definition.",
        "expectedTypes": [
          "https://schema.org/MedicalEntity"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalEntity"
        ],
        "domainTypes": [
          "https://schema.org/MedicalDevice",
          "https://schema.org/MedicalTherapy"
        ]
      }
    ]
  },
  {
    "name": "MedicalTrial",
    "type": "https://schema.org/MedicalTrial",
    "source": "generated",
    "description": "A medical trial is a type of medical study that uses a scientific process to compare the safety and efficacy of medical therapies or medical procedures. In general, medical trials are controlled and subjects are allocated at random to the different treatment and/or control groups.",
    "parentTypes": [
      "https://schema.org/MedicalStudy"
    ],
    "properties": [
      {
        "name": "trialDesign",
        "type": "https://schema.org/MedicalTrialDesign",
        "description": "Specifics about the trial design (enumerated).",
        "expectedTypes": [
          "https://schema.org/MedicalTrialDesign"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalTrialDesign"
        ],
        "domainTypes": [
          "https://schema.org/MedicalTrial"
        ]
      }
    ]
  },
  {
    "name": "MedicalTrialDesign",
    "type": "https://schema.org/MedicalTrialDesign",
    "source": "generated",
    "description": "Design models for medical trials. Enumerated type.",
    "parentTypes": [
      "https://schema.org/MedicalEnumeration"
    ],
    "enumerationValues": [
      {
        "name": "DoubleBlindedTrial",
        "type": "https://schema.org/DoubleBlindedTrial",
        "description": "A trial design in which neither the researcher nor the patient knows the details of the treatment the patient was randomly assigned to."
      },
      {
        "name": "InternationalTrial",
        "type": "https://schema.org/InternationalTrial",
        "description": "An international trial."
      },
      {
        "name": "MultiCenterTrial",
        "type": "https://schema.org/MultiCenterTrial",
        "description": "A trial that takes place at multiple centers."
      },
      {
        "name": "OpenTrial",
        "type": "https://schema.org/OpenTrial",
        "description": "A trial design in which the researcher knows the full details of the treatment, and so does the patient."
      },
      {
        "name": "PlaceboControlledTrial",
        "type": "https://schema.org/PlaceboControlledTrial",
        "description": "A placebo-controlled trial design."
      },
      {
        "name": "RandomizedTrial",
        "type": "https://schema.org/RandomizedTrial",
        "description": "A randomized trial design."
      },
      {
        "name": "SingleBlindedTrial",
        "type": "https://schema.org/SingleBlindedTrial",
        "description": "A trial design in which the researcher knows which treatment the patient was randomly assigned to but the patient does not."
      },
      {
        "name": "SingleCenterTrial",
        "type": "https://schema.org/SingleCenterTrial",
        "description": "A trial that takes place at a single center."
      },
      {
        "name": "TripleBlindedTrial",
        "type": "https://schema.org/TripleBlindedTrial",
        "description": "A trial design in which neither the researcher, the person administering the therapy nor the patient knows the details of the treatment the patient was randomly assigned to."
      }
    ]
  },
  {
    "name": "MedicalWebPage",
    "type": "https://schema.org/MedicalWebPage",
    "source": "generated",
    "description": "A web page that provides medical information.",
    "parentTypes": [
      "https://schema.org/WebPage"
    ],
    "properties": [
      {
        "name": "aspect",
        "type": "https://schema.org/Text",
        "description": "An aspect of medical practice that is considered on the page, such as 'diagnosis', 'treatment', 'causes', 'prognosis', 'etiology', 'epidemiology', etc.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MedicalWebPage"
        ],
        "supersededBy": "https://schema.org/mainContentOfPage"
      },
      {
        "name": "medicalAudience",
        "type": [
          "https://schema.org/MedicalAudience",
          "https://schema.org/MedicalAudienceType"
        ],
        "description": "Medical audience for page.",
        "expectedTypes": [
          "https://schema.org/MedicalAudience",
          "https://schema.org/MedicalAudienceType"
        ],
        "rangeTypes": [
          "https://schema.org/MedicalAudience",
          "https://schema.org/MedicalAudienceType"
        ],
        "domainTypes": [
          "https://schema.org/MedicalWebPage"
        ]
      }
    ]
  },
  {
    "name": "MedicineSystem",
    "type": "https://schema.org/MedicineSystem",
    "source": "generated",
    "description": "Systems of medical practice.",
    "parentTypes": [
      "https://schema.org/MedicalEnumeration"
    ],
    "enumerationValues": [
      {
        "name": "Ayurvedic",
        "type": "https://schema.org/Ayurvedic",
        "description": "A system of medicine that originated in India over thousands of years and that focuses on integrating and balancing the body, mind, and spirit."
      },
      {
        "name": "Chiropractic",
        "type": "https://schema.org/Chiropractic",
        "description": "A system of medicine focused on the relationship between the body's structure, mainly the spine, and its functioning."
      },
      {
        "name": "Homeopathic",
        "type": "https://schema.org/Homeopathic",
        "description": "A system of medicine based on the principle that a disease can be cured by a substance that produces similar symptoms in healthy people."
      },
      {
        "name": "Osteopathic",
        "type": "https://schema.org/Osteopathic",
        "description": "A system of medicine focused on promoting the body's innate ability to heal itself."
      },
      {
        "name": "TraditionalChinese",
        "type": "https://schema.org/TraditionalChinese",
        "description": "A system of medicine based on common theoretical concepts that originated in China and evolved over thousands of years, that uses herbs, acupuncture, exercise, massage, dietary therapy, and other methods to treat a wide range of conditions."
      },
      {
        "name": "WesternConventional",
        "type": "https://schema.org/WesternConventional",
        "description": "The conventional Western system of medicine, that aims to apply the best available evidence gained from the scientific method to clinical decision making. Also known as conventional or Western medicine."
      }
    ]
  },
  {
    "name": "MeetingRoom",
    "type": "https://schema.org/MeetingRoom",
    "source": "generated",
    "description": "A meeting room, conference room, or conference hall is a room provided for singular events such as business conferences and meetings (source: Wikipedia, the free encyclopedia, see <a href=\"http://en.wikipedia.org/wiki/Conference_hall\">http://en.wikipedia.org/wiki/Conference_hall</a>).\n<br /><br />\nSee also the <a href=\"/docs/hotels.html\">dedicated document on the use of schema.org for marking up hotels and other forms of accommodations</a>.\n",
    "parentTypes": [
      "https://schema.org/Room"
    ]
  },
  {
    "name": "MemberProgram",
    "type": "https://schema.org/MemberProgram",
    "source": "generated",
    "description": "A MemberProgram defines a loyalty (or membership) program that provides its members with certain benefits, for example better pricing, free shipping or returns, or the ability to earn loyalty points. Member programs may have multiple tiers, for example silver and gold members, each with different benefits.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "hasTiers",
        "type": "https://schema.org/MemberProgramTier",
        "description": "The tiers of a member program.",
        "expectedTypes": [
          "https://schema.org/MemberProgramTier"
        ],
        "rangeTypes": [
          "https://schema.org/MemberProgramTier"
        ],
        "domainTypes": [
          "https://schema.org/MemberProgram"
        ],
        "inverseOf": "https://schema.org/isTierOf"
      },
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
      }
    ]
  },
  {
    "name": "MemberProgramTier",
    "type": "https://schema.org/MemberProgramTier",
    "source": "generated",
    "description": "A MemberProgramTier specifies a tier under a loyalty (member) program, for example \"gold\".",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "hasTierBenefit",
        "type": "https://schema.org/TierBenefitEnumeration",
        "description": "A member benefit for a particular tier of a loyalty program.",
        "expectedTypes": [
          "https://schema.org/TierBenefitEnumeration"
        ],
        "rangeTypes": [
          "https://schema.org/TierBenefitEnumeration"
        ],
        "domainTypes": [
          "https://schema.org/MemberProgramTier"
        ]
      },
      {
        "name": "hasTierRequirement",
        "type": [
          "https://schema.org/CreditCard",
          "https://schema.org/MonetaryAmount",
          "https://schema.org/Text",
          "https://schema.org/UnitPriceSpecification"
        ],
        "description": "A requirement for a user to join a membership tier, for example: a CreditCard if the tier requires sign up for a credit card, A UnitPriceSpecification if the user is required to pay a (periodic) fee, or a MonetaryAmount if the user needs to spend a minimum amount to join the tier. If a tier is free to join then this property does not need to be specified.",
        "expectedTypes": [
          "https://schema.org/CreditCard",
          "https://schema.org/MonetaryAmount",
          "https://schema.org/Text",
          "https://schema.org/UnitPriceSpecification"
        ],
        "rangeTypes": [
          "https://schema.org/CreditCard",
          "https://schema.org/MonetaryAmount",
          "https://schema.org/Text",
          "https://schema.org/UnitPriceSpecification"
        ],
        "domainTypes": [
          "https://schema.org/MemberProgramTier"
        ]
      },
      {
        "name": "isTierOf",
        "type": "https://schema.org/MemberProgram",
        "description": "The member program this tier is a part of.",
        "expectedTypes": [
          "https://schema.org/MemberProgram"
        ],
        "rangeTypes": [
          "https://schema.org/MemberProgram"
        ],
        "domainTypes": [
          "https://schema.org/MemberProgramTier"
        ],
        "inverseOf": "https://schema.org/hasTiers"
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
      }
    ]
  },
  {
    "name": "MensClothingStore",
    "type": "https://schema.org/MensClothingStore",
    "source": "generated",
    "description": "A men's clothing store.",
    "parentTypes": [
      "https://schema.org/Store"
    ]
  },
  {
    "name": "Menu",
    "type": "https://schema.org/Menu",
    "source": "generated",
    "description": "A structured representation of food or drink items available from a FoodEstablishment.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ],
    "properties": [
      {
        "name": "hasMenuItem",
        "type": "https://schema.org/MenuItem",
        "description": "A food or drink item contained in a menu or menu section.",
        "expectedTypes": [
          "https://schema.org/MenuItem"
        ],
        "rangeTypes": [
          "https://schema.org/MenuItem"
        ],
        "domainTypes": [
          "https://schema.org/Menu",
          "https://schema.org/MenuSection"
        ]
      },
      {
        "name": "hasMenuSection",
        "type": "https://schema.org/MenuSection",
        "description": "A subgrouping of the menu (by dishes, course, serving time period, etc.).",
        "expectedTypes": [
          "https://schema.org/MenuSection"
        ],
        "rangeTypes": [
          "https://schema.org/MenuSection"
        ],
        "domainTypes": [
          "https://schema.org/Menu",
          "https://schema.org/MenuSection"
        ]
      }
    ]
  },
  {
    "name": "MenuItem",
    "type": "https://schema.org/MenuItem",
    "source": "generated",
    "description": "A food or drink item listed in a menu or menu section.",
    "parentTypes": [
      "https://schema.org/Intangible"
    ],
    "properties": [
      {
        "name": "menuAddOn",
        "type": [
          "https://schema.org/MenuItem",
          "https://schema.org/MenuSection"
        ],
        "description": "Additional menu item(s) such as a side dish of salad or side order of fries that can be added to this menu item. Additionally it can be a menu section containing allowed add-on menu items for this menu item.",
        "expectedTypes": [
          "https://schema.org/MenuItem",
          "https://schema.org/MenuSection"
        ],
        "rangeTypes": [
          "https://schema.org/MenuItem",
          "https://schema.org/MenuSection"
        ],
        "domainTypes": [
          "https://schema.org/MenuItem"
        ]
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
    "name": "MenuSection",
    "type": "https://schema.org/MenuSection",
    "source": "generated",
    "description": "A sub-grouping of food or drink items in a menu. E.g. courses (such as 'Dinner', 'Breakfast', etc.), specific type of dishes (such as 'Meat', 'Vegan', 'Drinks', etc.), or some other classification made by the menu provider.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ],
    "properties": [
      {
        "name": "hasMenuItem",
        "type": "https://schema.org/MenuItem",
        "description": "A food or drink item contained in a menu or menu section.",
        "expectedTypes": [
          "https://schema.org/MenuItem"
        ],
        "rangeTypes": [
          "https://schema.org/MenuItem"
        ],
        "domainTypes": [
          "https://schema.org/Menu",
          "https://schema.org/MenuSection"
        ]
      },
      {
        "name": "hasMenuSection",
        "type": "https://schema.org/MenuSection",
        "description": "A subgrouping of the menu (by dishes, course, serving time period, etc.).",
        "expectedTypes": [
          "https://schema.org/MenuSection"
        ],
        "rangeTypes": [
          "https://schema.org/MenuSection"
        ],
        "domainTypes": [
          "https://schema.org/Menu",
          "https://schema.org/MenuSection"
        ]
      }
    ]
  },
  {
    "name": "MerchantReturnEnumeration",
    "type": "https://schema.org/MerchantReturnEnumeration",
    "source": "generated",
    "description": "Enumerates several kinds of product return policies.",
    "parentTypes": [
      "https://schema.org/Enumeration"
    ],
    "enumerationValues": [
      {
        "name": "MerchantReturnFiniteReturnWindow",
        "type": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "description": "Specifies that there is a finite window for product returns."
      },
      {
        "name": "MerchantReturnNotPermitted",
        "type": "https://schema.org/MerchantReturnNotPermitted",
        "description": "Specifies that product returns are not permitted."
      },
      {
        "name": "MerchantReturnUnlimitedWindow",
        "type": "https://schema.org/MerchantReturnUnlimitedWindow",
        "description": "Specifies that there is an unlimited window for product returns."
      },
      {
        "name": "MerchantReturnUnspecified",
        "type": "https://schema.org/MerchantReturnUnspecified",
        "description": "Specifies that a product return policy is not provided."
      }
    ]
  },
  {
    "name": "MerchantReturnPolicy",
    "type": "https://schema.org/MerchantReturnPolicy",
    "source": "generated",
    "description": "A MerchantReturnPolicy provides information about product return policies associated with an [[Organization]], [[Product]], or [[Offer]].",
    "parentTypes": [
      "https://schema.org/Intangible"
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
        "name": "applicableCountry",
        "type": [
          "https://schema.org/Country",
          "https://schema.org/Text"
        ],
        "description": "A country where a particular merchant return policy applies to, for example the two-letter ISO 3166-1 alpha-2 country code.",
        "expectedTypes": [
          "https://schema.org/Country",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Country",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MerchantReturnPolicy"
        ]
      },
      {
        "name": "customerRemorseReturnFees",
        "type": "https://schema.org/ReturnFeesEnumeration",
        "description": "The type of return fees if the product is returned due to customer remorse.",
        "expectedTypes": [
          "https://schema.org/ReturnFeesEnumeration"
        ],
        "rangeTypes": [
          "https://schema.org/ReturnFeesEnumeration"
        ],
        "domainTypes": [
          "https://schema.org/MerchantReturnPolicy"
        ]
      },
      {
        "name": "customerRemorseReturnLabelSource",
        "type": "https://schema.org/ReturnLabelSourceEnumeration",
        "description": "The method (from an enumeration) by which the customer obtains a return shipping label for a product returned due to customer remorse.",
        "expectedTypes": [
          "https://schema.org/ReturnLabelSourceEnumeration"
        ],
        "rangeTypes": [
          "https://schema.org/ReturnLabelSourceEnumeration"
        ],
        "domainTypes": [
          "https://schema.org/MerchantReturnPolicy"
        ]
      },
      {
        "name": "customerRemorseReturnShippingFeesAmount",
        "type": "https://schema.org/MonetaryAmount",
        "description": "The amount of shipping costs if a product is returned due to customer remorse. Applicable when property [[customerRemorseReturnFees]] equals [[ReturnShippingFees]].",
        "expectedTypes": [
          "https://schema.org/MonetaryAmount"
        ],
        "rangeTypes": [
          "https://schema.org/MonetaryAmount"
        ],
        "domainTypes": [
          "https://schema.org/MerchantReturnPolicy"
        ]
      },
      {
        "name": "inStoreReturnsOffered",
        "type": "https://schema.org/Boolean",
        "description": "Are in-store returns offered? (For more advanced return methods use the [[returnMethod]] property.)",
        "expectedTypes": [
          "https://schema.org/Boolean"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean"
        ],
        "domainTypes": [
          "https://schema.org/MerchantReturnPolicy"
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
        "name": "itemDefectReturnFees",
        "type": "https://schema.org/ReturnFeesEnumeration",
        "description": "The type of return fees for returns of defect products.",
        "expectedTypes": [
          "https://schema.org/ReturnFeesEnumeration"
        ],
        "rangeTypes": [
          "https://schema.org/ReturnFeesEnumeration"
        ],
        "domainTypes": [
          "https://schema.org/MerchantReturnPolicy"
        ]
      },
      {
        "name": "itemDefectReturnLabelSource",
        "type": "https://schema.org/ReturnLabelSourceEnumeration",
        "description": "The method (from an enumeration) by which the customer obtains a return shipping label for a defect product.",
        "expectedTypes": [
          "https://schema.org/ReturnLabelSourceEnumeration"
        ],
        "rangeTypes": [
          "https://schema.org/ReturnLabelSourceEnumeration"
        ],
        "domainTypes": [
          "https://schema.org/MerchantReturnPolicy"
        ]
      },
      {
        "name": "itemDefectReturnShippingFeesAmount",
        "type": "https://schema.org/MonetaryAmount",
        "description": "Amount of shipping costs for defect product returns. Applicable when property [[itemDefectReturnFees]] equals [[ReturnShippingFees]].",
        "expectedTypes": [
          "https://schema.org/MonetaryAmount"
        ],
        "rangeTypes": [
          "https://schema.org/MonetaryAmount"
        ],
        "domainTypes": [
          "https://schema.org/MerchantReturnPolicy"
        ]
      },
      {
        "name": "merchantReturnDays",
        "type": [
          "https://schema.org/Date",
          "https://schema.org/DateTime",
          "https://schema.org/Integer"
        ],
        "description": "Specifies either a fixed return date or the number of days (from the delivery date) that a product can be returned. Used when the [[returnPolicyCategory]] property is specified as [[MerchantReturnFiniteReturnWindow]].",
        "expectedTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime",
          "https://schema.org/Integer"
        ],
        "rangeTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime",
          "https://schema.org/Integer"
        ],
        "domainTypes": [
          "https://schema.org/MerchantReturnPolicy",
          "https://schema.org/MerchantReturnPolicySeasonalOverride"
        ]
      },
      {
        "name": "merchantReturnLink",
        "type": "https://schema.org/URL",
        "description": "Specifies a Web page or service by URL, for product returns.",
        "expectedTypes": [
          "https://schema.org/URL"
        ],
        "rangeTypes": [
          "https://schema.org/URL"
        ],
        "domainTypes": [
          "https://schema.org/MerchantReturnPolicy"
        ]
      },
      {
        "name": "refundType",
        "type": "https://schema.org/RefundTypeEnumeration",
        "description": "A refund type, from an enumerated list.",
        "expectedTypes": [
          "https://schema.org/RefundTypeEnumeration"
        ],
        "rangeTypes": [
          "https://schema.org/RefundTypeEnumeration"
        ],
        "domainTypes": [
          "https://schema.org/MerchantReturnPolicy",
          "https://schema.org/MerchantReturnPolicySeasonalOverride"
        ]
      },
      {
        "name": "restockingFee",
        "type": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/Number"
        ],
        "description": "Use [[MonetaryAmount]] to specify a fixed restocking fee for product returns, or use [[Number]] to specify a percentage of the product price paid by the customer.",
        "expectedTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/MerchantReturnPolicy",
          "https://schema.org/MerchantReturnPolicySeasonalOverride"
        ]
      },
      {
        "name": "returnFees",
        "type": "https://schema.org/ReturnFeesEnumeration",
        "description": "The type of return fees for purchased products (for any return reason).",
        "expectedTypes": [
          "https://schema.org/ReturnFeesEnumeration"
        ],
        "rangeTypes": [
          "https://schema.org/ReturnFeesEnumeration"
        ],
        "domainTypes": [
          "https://schema.org/MerchantReturnPolicy",
          "https://schema.org/MerchantReturnPolicySeasonalOverride"
        ]
      },
      {
        "name": "returnLabelSource",
        "type": "https://schema.org/ReturnLabelSourceEnumeration",
        "description": "The method (from an enumeration) by which the customer obtains a return shipping label for a product returned for any reason.",
        "expectedTypes": [
          "https://schema.org/ReturnLabelSourceEnumeration"
        ],
        "rangeTypes": [
          "https://schema.org/ReturnLabelSourceEnumeration"
        ],
        "domainTypes": [
          "https://schema.org/MerchantReturnPolicy"
        ]
      },
      {
        "name": "returnMethod",
        "type": "https://schema.org/ReturnMethodEnumeration",
        "description": "The type of return method offered, specified from an enumeration.",
        "expectedTypes": [
          "https://schema.org/ReturnMethodEnumeration"
        ],
        "rangeTypes": [
          "https://schema.org/ReturnMethodEnumeration"
        ],
        "domainTypes": [
          "https://schema.org/MerchantReturnPolicy",
          "https://schema.org/MerchantReturnPolicySeasonalOverride"
        ]
      },
      {
        "name": "returnPolicyCategory",
        "type": "https://schema.org/MerchantReturnEnumeration",
        "description": "Specifies an applicable return policy (from an enumeration).",
        "expectedTypes": [
          "https://schema.org/MerchantReturnEnumeration"
        ],
        "rangeTypes": [
          "https://schema.org/MerchantReturnEnumeration"
        ],
        "domainTypes": [
          "https://schema.org/MerchantReturnPolicy",
          "https://schema.org/MerchantReturnPolicySeasonalOverride"
        ]
      },
      {
        "name": "returnPolicyCountry",
        "type": [
          "https://schema.org/Country",
          "https://schema.org/Text"
        ],
        "description": "The country where the product has to be sent to for returns, for example \"Ireland\" using the [[name]] property of [[Country]]. You can also provide the two-letter [ISO 3166-1 alpha-2 country code](http://en.wikipedia.org/wiki/ISO_3166-1). Note that this can be different from the country where the product was originally shipped from or sent to.",
        "expectedTypes": [
          "https://schema.org/Country",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Country",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MerchantReturnPolicy"
        ]
      },
      {
        "name": "returnPolicySeasonalOverride",
        "type": "https://schema.org/MerchantReturnPolicySeasonalOverride",
        "description": "Seasonal override of a return policy.",
        "expectedTypes": [
          "https://schema.org/MerchantReturnPolicySeasonalOverride"
        ],
        "rangeTypes": [
          "https://schema.org/MerchantReturnPolicySeasonalOverride"
        ],
        "domainTypes": [
          "https://schema.org/MerchantReturnPolicy"
        ]
      },
      {
        "name": "returnShippingFeesAmount",
        "type": "https://schema.org/MonetaryAmount",
        "description": "Amount of shipping costs for product returns (for any reason). Applicable when property [[returnFees]] equals [[ReturnShippingFees]].",
        "expectedTypes": [
          "https://schema.org/MonetaryAmount"
        ],
        "rangeTypes": [
          "https://schema.org/MonetaryAmount"
        ],
        "domainTypes": [
          "https://schema.org/MerchantReturnPolicy",
          "https://schema.org/MerchantReturnPolicySeasonalOverride"
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
    "name": "MerchantReturnPolicySeasonalOverride",
    "type": "https://schema.org/MerchantReturnPolicySeasonalOverride",
    "source": "generated",
    "description": "A seasonal override of a return policy, for example used for holidays.",
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
        "name": "merchantReturnDays",
        "type": [
          "https://schema.org/Date",
          "https://schema.org/DateTime",
          "https://schema.org/Integer"
        ],
        "description": "Specifies either a fixed return date or the number of days (from the delivery date) that a product can be returned. Used when the [[returnPolicyCategory]] property is specified as [[MerchantReturnFiniteReturnWindow]].",
        "expectedTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime",
          "https://schema.org/Integer"
        ],
        "rangeTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime",
          "https://schema.org/Integer"
        ],
        "domainTypes": [
          "https://schema.org/MerchantReturnPolicy",
          "https://schema.org/MerchantReturnPolicySeasonalOverride"
        ]
      },
      {
        "name": "refundType",
        "type": "https://schema.org/RefundTypeEnumeration",
        "description": "A refund type, from an enumerated list.",
        "expectedTypes": [
          "https://schema.org/RefundTypeEnumeration"
        ],
        "rangeTypes": [
          "https://schema.org/RefundTypeEnumeration"
        ],
        "domainTypes": [
          "https://schema.org/MerchantReturnPolicy",
          "https://schema.org/MerchantReturnPolicySeasonalOverride"
        ]
      },
      {
        "name": "restockingFee",
        "type": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/Number"
        ],
        "description": "Use [[MonetaryAmount]] to specify a fixed restocking fee for product returns, or use [[Number]] to specify a percentage of the product price paid by the customer.",
        "expectedTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/Number"
        ],
        "rangeTypes": [
          "https://schema.org/MonetaryAmount",
          "https://schema.org/Number"
        ],
        "domainTypes": [
          "https://schema.org/MerchantReturnPolicy",
          "https://schema.org/MerchantReturnPolicySeasonalOverride"
        ]
      },
      {
        "name": "returnFees",
        "type": "https://schema.org/ReturnFeesEnumeration",
        "description": "The type of return fees for purchased products (for any return reason).",
        "expectedTypes": [
          "https://schema.org/ReturnFeesEnumeration"
        ],
        "rangeTypes": [
          "https://schema.org/ReturnFeesEnumeration"
        ],
        "domainTypes": [
          "https://schema.org/MerchantReturnPolicy",
          "https://schema.org/MerchantReturnPolicySeasonalOverride"
        ]
      },
      {
        "name": "returnMethod",
        "type": "https://schema.org/ReturnMethodEnumeration",
        "description": "The type of return method offered, specified from an enumeration.",
        "expectedTypes": [
          "https://schema.org/ReturnMethodEnumeration"
        ],
        "rangeTypes": [
          "https://schema.org/ReturnMethodEnumeration"
        ],
        "domainTypes": [
          "https://schema.org/MerchantReturnPolicy",
          "https://schema.org/MerchantReturnPolicySeasonalOverride"
        ]
      },
      {
        "name": "returnPolicyCategory",
        "type": "https://schema.org/MerchantReturnEnumeration",
        "description": "Specifies an applicable return policy (from an enumeration).",
        "expectedTypes": [
          "https://schema.org/MerchantReturnEnumeration"
        ],
        "rangeTypes": [
          "https://schema.org/MerchantReturnEnumeration"
        ],
        "domainTypes": [
          "https://schema.org/MerchantReturnPolicy",
          "https://schema.org/MerchantReturnPolicySeasonalOverride"
        ]
      },
      {
        "name": "returnShippingFeesAmount",
        "type": "https://schema.org/MonetaryAmount",
        "description": "Amount of shipping costs for product returns (for any reason). Applicable when property [[returnFees]] equals [[ReturnShippingFees]].",
        "expectedTypes": [
          "https://schema.org/MonetaryAmount"
        ],
        "rangeTypes": [
          "https://schema.org/MonetaryAmount"
        ],
        "domainTypes": [
          "https://schema.org/MerchantReturnPolicy",
          "https://schema.org/MerchantReturnPolicySeasonalOverride"
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
    "name": "Message",
    "type": "https://schema.org/Message",
    "source": "generated",
    "description": "A single message from a sender to one or more organizations or people.",
    "parentTypes": [
      "https://schema.org/CreativeWork"
    ],
    "properties": [
      {
        "name": "bccRecipient",
        "type": [
          "https://schema.org/ContactPoint",
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "A sub property of recipient. The recipient blind copied on a message.",
        "expectedTypes": [
          "https://schema.org/ContactPoint",
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/ContactPoint",
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Message"
        ]
      },
      {
        "name": "ccRecipient",
        "type": [
          "https://schema.org/ContactPoint",
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "A sub property of recipient. The recipient copied on a message.",
        "expectedTypes": [
          "https://schema.org/ContactPoint",
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "rangeTypes": [
          "https://schema.org/ContactPoint",
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "domainTypes": [
          "https://schema.org/Message"
        ]
      },
      {
        "name": "dateRead",
        "type": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "description": "The date/time at which the message has been read by the recipient if a single recipient exists.",
        "expectedTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/Date",
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/Message"
        ]
      },
      {
        "name": "dateReceived",
        "type": "https://schema.org/DateTime",
        "description": "The date/time the message was received if a single recipient exists.",
        "expectedTypes": [
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/Message"
        ]
      },
      {
        "name": "dateSent",
        "type": "https://schema.org/DateTime",
        "description": "The date/time at which the message was sent.",
        "expectedTypes": [
          "https://schema.org/DateTime"
        ],
        "rangeTypes": [
          "https://schema.org/DateTime"
        ],
        "domainTypes": [
          "https://schema.org/Message"
        ]
      },
      {
        "name": "messageAttachment",
        "type": "https://schema.org/CreativeWork",
        "description": "A CreativeWork attached to the message.",
        "expectedTypes": [
          "https://schema.org/CreativeWork"
        ],
        "rangeTypes": [
          "https://schema.org/CreativeWork"
        ],
        "domainTypes": [
          "https://schema.org/Message"
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
      },
      {
        "name": "toRecipient",
        "type": [
          "https://schema.org/Audience",
          "https://schema.org/ContactPoint",
          "https://schema.org/Organization",
          "https://schema.org/Person"
        ],
        "description": "A sub property of recipient. The recipient who was directly sent the message.",
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
          "https://schema.org/Message"
        ]
      }
    ]
  },
  {
    "name": "MiddleSchool",
    "type": "https://schema.org/MiddleSchool",
    "source": "generated",
    "description": "A middle school (typically for children aged around 11-14, although this varies somewhat).",
    "parentTypes": [
      "https://schema.org/EducationalOrganization"
    ]
  },
  {
    "name": "MobileApplication",
    "type": "https://schema.org/MobileApplication",
    "source": "generated",
    "description": "A software application designed specifically to work well on a mobile device such as a telephone.",
    "parentTypes": [
      "https://schema.org/SoftwareApplication"
    ],
    "properties": [
      {
        "name": "carrierRequirements",
        "type": "https://schema.org/Text",
        "description": "Specifies specific carrier(s) requirements for the application (e.g. an application may only work on a specific carrier network).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MobileApplication"
        ]
      }
    ]
  },
  {
    "name": "MobilePhoneStore",
    "type": "https://schema.org/MobilePhoneStore",
    "source": "generated",
    "description": "A store that sells mobile phones and related accessories.",
    "parentTypes": [
      "https://schema.org/Store"
    ]
  },
  {
    "name": "MolecularEntity",
    "type": "https://schema.org/MolecularEntity",
    "source": "generated",
    "description": "Any constitutionally or isotopically distinct atom, molecule, ion, ion pair, radical, radical ion, complex, conformer etc., identifiable as a separately distinguishable entity.",
    "parentTypes": [
      "https://schema.org/BioChemEntity"
    ],
    "properties": [
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
        "name": "inChI",
        "type": "https://schema.org/Text",
        "description": "Non-proprietary identifier for molecular entity that can be used in printed and electronic data sources thus enabling easier linking of diverse data compilations.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MolecularEntity"
        ]
      },
      {
        "name": "inChIKey",
        "type": "https://schema.org/Text",
        "description": "InChIKey is a hashed version of the full InChI (using the SHA-256 algorithm).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MolecularEntity"
        ]
      },
      {
        "name": "iupacName",
        "type": "https://schema.org/Text",
        "description": "Systematic method of naming chemical compounds as recommended by the International Union of Pure and Applied Chemistry (IUPAC).",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MolecularEntity"
        ]
      },
      {
        "name": "molecularFormula",
        "type": "https://schema.org/Text",
        "description": "The empirical formula is the simplest whole number ratio of all the atoms in a molecule.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MolecularEntity"
        ]
      },
      {
        "name": "molecularWeight",
        "type": [
          "https://schema.org/QuantitativeValue",
          "https://schema.org/Text"
        ],
        "description": "This is the molecular weight of the entity being described, not of the parent. Units should be included in the form '&lt;Number&gt; &lt;unit&gt;', for example '12 amu' or as '&lt;QuantitativeValue&gt;.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MolecularEntity"
        ]
      },
      {
        "name": "monoisotopicMolecularWeight",
        "type": [
          "https://schema.org/QuantitativeValue",
          "https://schema.org/Text"
        ],
        "description": "The monoisotopic mass is the sum of the masses of the atoms in a molecule using the unbound, ground-state, rest mass of the principal (most abundant) isotope for each element instead of the isotopic average mass. Please include the units in the form '&lt;Number&gt; &lt;unit&gt;', for example '770.230488 g/mol' or as '&lt;QuantitativeValue&gt;.",
        "expectedTypes": [
          "https://schema.org/QuantitativeValue",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/QuantitativeValue",
          "https://schema.org/Text"
        ],
        "domainTypes": [
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
      },
      {
        "name": "smiles",
        "type": "https://schema.org/Text",
        "description": "A specification in form of a line notation for describing the structure of chemical species using short ASCII strings.  Double bond stereochemistry \\ indicators may need to be escaped in the string in formats where the backslash is an escape character.",
        "expectedTypes": [
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MolecularEntity"
        ]
      }
    ]
  },
  {
    "name": "MonetaryAmount",
    "type": "https://schema.org/MonetaryAmount",
    "source": "generated",
    "description": "A monetary value or range. This type can be used to describe an amount of money such as $50 USD, or a range as in describing a bank account being suitable for a balance between £1,000 and £1,000,000 GBP, or the value of a salary, etc. It is recommended to use [[PriceSpecification]] Types to describe the price of an Offer, Invoice, etc.",
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
      }
    ]
  },
  {
    "name": "MonetaryAmountDistribution",
    "type": "https://schema.org/MonetaryAmountDistribution",
    "source": "generated",
    "description": "A statistical distribution of monetary amounts.",
    "parentTypes": [
      "https://schema.org/QuantitativeValueDistribution"
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
      }
    ]
  },
  {
    "name": "MonetaryGrant",
    "type": "https://schema.org/MonetaryGrant",
    "source": "generated",
    "description": "A monetary grant.",
    "parentTypes": [
      "https://schema.org/Grant"
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
      }
    ]
  },
  {
    "name": "MoneyTransfer",
    "type": "https://schema.org/MoneyTransfer",
    "source": "generated",
    "description": "The act of transferring money from one place to another place. This may occur electronically or physically.",
    "parentTypes": [
      "https://schema.org/TransferAction"
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
        "name": "beneficiaryBank",
        "type": [
          "https://schema.org/BankOrCreditUnion",
          "https://schema.org/Text"
        ],
        "description": "A bank or bank’s branch, financial institution or international financial institution operating the beneficiary’s bank account or releasing funds for the beneficiary.",
        "expectedTypes": [
          "https://schema.org/BankOrCreditUnion",
          "https://schema.org/Text"
        ],
        "rangeTypes": [
          "https://schema.org/BankOrCreditUnion",
          "https://schema.org/Text"
        ],
        "domainTypes": [
          "https://schema.org/MoneyTransfer"
        ]
      }
    ]
  },
  {
    "name": "MortgageLoan",
    "type": "https://schema.org/MortgageLoan",
    "source": "generated",
    "description": "A loan in which property or real estate is used as collateral. (A loan securitized against some real estate.)",
    "parentTypes": [
      "https://schema.org/LoanOrCredit"
    ],
    "properties": [
      {
        "name": "domiciledMortgage",
        "type": "https://schema.org/Boolean",
        "description": "Whether borrower is a resident of the jurisdiction where the property is located.",
        "expectedTypes": [
          "https://schema.org/Boolean"
        ],
        "rangeTypes": [
          "https://schema.org/Boolean"
        ],
        "domainTypes": [
          "https://schema.org/MortgageLoan"
        ]
      },
      {
        "name": "loanMortgageMandateAmount",
        "type": "https://schema.org/MonetaryAmount",
        "description": "Amount of mortgage mandate that can be converted into a proper mortgage at a later stage.",
        "expectedTypes": [
          "https://schema.org/MonetaryAmount"
        ],
        "rangeTypes": [
          "https://schema.org/MonetaryAmount"
        ],
        "domainTypes": [
          "https://schema.org/MortgageLoan"
        ]
      }
    ]
  },
  {
    "name": "Mosque",
    "type": "https://schema.org/Mosque",
    "source": "generated",
    "description": "A mosque.",
    "parentTypes": [
      "https://schema.org/PlaceOfWorship"
    ]
  },
  {
    "name": "Motel",
    "type": "https://schema.org/Motel",
    "source": "generated",
    "description": "A motel.\n<br /><br />\nSee also the <a href=\"/docs/hotels.html\">dedicated document on the use of schema.org for marking up hotels and other forms of accommodations</a>.\n",
    "parentTypes": [
      "https://schema.org/LodgingBusiness"
    ]
  },
  {
    "name": "Motorcycle",
    "type": "https://schema.org/Motorcycle",
    "source": "generated",
    "description": "A motorcycle or motorbike is a single-track, two-wheeled motor vehicle.",
    "parentTypes": [
      "https://schema.org/Vehicle"
    ]
  },
  {
    "name": "MotorcycleDealer",
    "type": "https://schema.org/MotorcycleDealer",
    "source": "generated",
    "description": "A motorcycle dealer.",
    "parentTypes": [
      "https://schema.org/AutomotiveBusiness"
    ]
  },
  {
    "name": "MotorcycleRepair",
    "type": "https://schema.org/MotorcycleRepair",
    "source": "generated",
    "description": "A motorcycle repair shop.",
    "parentTypes": [
      "https://schema.org/AutomotiveBusiness"
    ]
  },
  {
    "name": "MotorizedBicycle",
    "type": "https://schema.org/MotorizedBicycle",
    "source": "generated",
    "description": "A motorized bicycle is a bicycle with an attached motor used to power the vehicle, or to assist with pedaling.",
    "parentTypes": [
      "https://schema.org/Vehicle"
    ]
  },
  {
    "name": "Mountain",
    "type": "https://schema.org/Mountain",
    "source": "generated",
    "description": "A mountain, like Mount Whitney or Mount Everest.",
    "parentTypes": [
      "https://schema.org/Landform"
    ]
  },
  {
    "name": "MoveAction",
    "type": "https://schema.org/MoveAction",
    "source": "generated",
    "description": "The act of an agent relocating to a place.\\n\\nRelated actions:\\n\\n* [[TransferAction]]: Unlike TransferAction, the subject of the move is a living Person or Organization rather than an inanimate object.",
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
    "name": "Movie",
    "type": "https://schema.org/Movie",
    "source": "generated",
    "description": "A movie.",
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
    "name": "MovieClip",
    "type": "https://schema.org/MovieClip",
    "source": "generated",
    "description": "A short segment/part of a movie.",
    "parentTypes": [
      "https://schema.org/Clip"
    ]
  },
  {
    "name": "MovieRentalStore",
    "type": "https://schema.org/MovieRentalStore",
    "source": "generated",
    "description": "A movie rental store.",
    "parentTypes": [
      "https://schema.org/Store"
    ]
  }
] satisfies readonly SchemaDefinition[];
