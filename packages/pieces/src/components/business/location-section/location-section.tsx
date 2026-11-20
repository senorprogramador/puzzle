"use client";

import { Heading, Text } from "@puzzle-ui/ui";

import { useState, type ElementType } from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../../marketing/shared";
import { validateContentIds } from "../../content/shared";
import { EmptyStatePanel } from "../../data-display/empty-state-panel";
import type {
  LocationItem,
  LocationSectionProps,
  LocationSectionVariant,
} from "./location-section.types";

import "./location-section.css";

const LocationDetails = ({ location }: { location: LocationItem }) => (
  <div className="puzzle-location-section__details">
    {location.image ? (
      <div className="puzzle-location-section__image">{location.image}</div>
    ) : null}
    {location.description ? <Text as="p">{location.description}</Text> : null}
    {location.address ? <address>{location.address}</address> : null}
    <dl>
      {location.phone ? (
        <div>
          <dt>Phone</dt>
          <dd>
            <a href={`tel:${location.phone}`}>{location.phone}</a>
          </dd>
        </div>
      ) : null}
      {location.email ? (
        <div>
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${location.email}`}>{location.email}</a>
          </dd>
        </div>
      ) : null}
      {location.coordinates ? (
        <div>
          <dt>Coordinates</dt>
          <dd>
            <data
              value={`${location.coordinates.latitude},${location.coordinates.longitude}`}
            >
              {location.coordinates.latitude}, {location.coordinates.longitude}
            </data>
          </dd>
        </div>
      ) : null}
    </dl>
    {location.openingHours?.length ? (
      <dl className="puzzle-location-section__hours">
        {location.openingHours.map((hours, index) => (
          <div key={`${location.id}-hours-${index}`}>
            <dt>{hours.day}</dt>
            <dd>{hours.hours}</dd>
          </div>
        ))}
      </dl>
    ) : null}
    {location.directionsHref ? (
      <a
        className="puzzle-location-section__directions"
        href={location.directionsHref}
      >
        Get directions
      </a>
    ) : null}
  </div>
);

const LocationSection = <C extends ElementType = "section">({
  variant = "split",
  locations,
  selectedLocationId,
  defaultSelectedLocationId,
  onLocationSelect,
  mapSlot,
  mapLabel = "Location map",
  children,
  className,
  ...sectionProps
}: LocationSectionProps<C>) => {
  validateContentIds(locations, "Location");
  const [uncontrolledSelectedId, setUncontrolledSelectedId] = useState(
    defaultSelectedLocationId ?? locations[0]?.id,
  );
  const activeLocationId = selectedLocationId ?? uncontrolledSelectedId;
  const selectedLocation =
    locations.find((location) => location.id === activeLocationId) ??
    locations[0];
  const nativeProps = sectionProps as MarketingSectionBaseProps<C>;

  const selectLocation = (locationId: string) => {
    if (selectedLocationId === undefined) {
      setUncontrolledSelectedId(locationId);
    }
    onLocationSelect?.(locationId);
  };

  return (
    <MarketingSection<C>
      {...nativeProps}
      className={`puzzle-location-section ${className ?? ""}`.trim()}
      family="location"
      variant={variant satisfies LocationSectionVariant}
    >
      {locations.length ? (
        <div className="puzzle-location-section__layout">
          {locations.length > 1 ? (
            <ul className="puzzle-location-section__list" aria-label="Locations">
              {locations.map((location) => (
                <li key={location.id}>
                  <button
                    type="button"
                    aria-pressed={location.id === selectedLocation?.id}
                    onClick={() => selectLocation(location.id)}
                  >
                    {location.name}
                    {location.address ? (
                      <span>{location.address}</span>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          {selectedLocation ? (
            <article
              className="puzzle-location-section__selected"
              aria-label={
                typeof selectedLocation.name === "string"
                  ? selectedLocation.name
                  : undefined
              }
            >
              <Heading level="headline3" as="h3">{selectedLocation.name}</Heading>
              <LocationDetails location={selectedLocation} />
            </article>
          ) : null}
          {(mapSlot ?? selectedLocation?.mapSlot) ? (
            <div
              className="puzzle-location-section__map"
              role="region"
              aria-label={mapLabel}
            >
              {mapSlot ?? selectedLocation?.mapSlot}
            </div>
          ) : null}
        </div>
      ) : (
        <EmptyStatePanel
          title="No locations available"
          variant="minimal"
          className="puzzle-location-section__empty"
        >
          Add locations to show contact and direction details.
        </EmptyStatePanel>
      )}
      {children}
    </MarketingSection>
  );
};

export { LocationSection };
