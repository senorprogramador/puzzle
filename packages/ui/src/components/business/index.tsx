import type { ReactNode } from "react";

import { Avatar } from "../data-display/avatar";
import "./business.css";

export type BusinessImage = {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
};

export type LogoCollectionProps = {
  items: readonly BusinessLogoItem[];
  label?: string;
  className?: string;
  scrollable?: boolean;
};

export type BusinessSocialLink = {
  id: string;
  label: string;
  href: string;
  external?: boolean;
};

export type BusinessMetricItem = {
  id: string;
  label: ReactNode;
  value: ReactNode;
  description?: ReactNode;
};

export type BusinessLogoItem = {
  id: string;
  name: string;
  image?: BusinessImage;
  description?: ReactNode;
  href?: string;
  external?: boolean;
};

export type BusinessContactItem = {
  id: string;
  label: ReactNode;
  value: ReactNode;
  href?: string;
};

export type BusinessImageViewProps = {
  image: BusinessImage;
  className?: string;
};

export const BusinessImageView = ({
  image,
  className,
}: BusinessImageViewProps) => {
  const src = image.src?.trim();

  return src ? (
    <img
      className={`puzzle-business-image ${className ?? ""}`.trim()}
      src={src}
      alt={image.alt ?? ""}
      width={image.width}
      height={image.height}
      loading="lazy"
      decoding="async"
    />
  ) : (
    <span
      className={`puzzle-business-image-placeholder ${className ?? ""}`.trim()}
      role="img"
      aria-label={`${image.alt || "Image"} unavailable`}
    >
      Image unavailable
    </span>
  );
};

export type ProfileCardProps = {
  name: string;
  role: ReactNode;
  avatar?: BusinessImage;
  biography?: ReactNode;
  socials?: readonly BusinessSocialLink[];
  href?: string;
  external?: boolean;
  featured?: boolean;
  className?: string;
};

export const SocialLinks = ({
  links,
  label = "Social links",
  className,
}: {
  links: readonly BusinessSocialLink[];
  label?: string;
  className?: string;
}) =>
  links.length ? (
    <ul
      className={`puzzle-business-social-links ${className ?? ""}`.trim()}
      aria-label={label}
    >
      {links.map((link) => (
        <li key={link.id}>
          <a
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  ) : null;

export const ProfileCard = ({
  name,
  role,
  avatar,
  biography,
  socials = [],
  href,
  featured,
  external,
  className,
}: ProfileCardProps) => (
  <article
    className={`puzzle-business-profile ${className ?? ""}`.trim()}
    data-featured={featured || undefined}
  >
    <Avatar
      className="puzzle-business-profile__avatar"
      src={avatar?.src}
      alt={name}
      size={64}
      loading="lazy"
      decoding="async"
    />
    <div className="puzzle-business-profile__content">
      <h3 className="puzzle-business-profile__name">
        {href ? (
          <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
          >
            {name}
          </a>
        ) : (
          name
        )}
      </h3>
      <p className="puzzle-business-profile__role">{role}</p>
      {biography ? (
        <p className="puzzle-business-profile__biography">{biography}</p>
      ) : null}
      <SocialLinks links={socials} />
    </div>
  </article>
);

export type CompanyInfoProps = {
  name: string;
  tagline?: ReactNode;
  description?: ReactNode;
  logo?: BusinessImage;
  href?: string;
  external?: boolean;
  className?: string;
};

export const CompanyInfo = ({
  name,
  tagline,
  description,
  logo,
  href,
  external,
  className,
}: CompanyInfoProps) => (
  <div className={`puzzle-business-company ${className ?? ""}`.trim()}>
    {logo?.src ? (
      <img
        className="puzzle-business-company__logo"
        src={logo.src}
        alt={logo.alt ?? `${name} logo`}
        loading="lazy"
        decoding="async"
      />
    ) : null}
    <div className="puzzle-business-company__content">
      <h3 className="puzzle-business-company__name">
        {href ? (
          <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
          >
            {name}
          </a>
        ) : (
          name
        )}
      </h3>
      {tagline ? <p className="puzzle-business-company__tagline">{tagline}</p> : null}
      {description ? (
        <p className="puzzle-business-company__description">{description}</p>
      ) : null}
    </div>
  </div>
);

export const ContactDetails = ({
  items,
  className,
}: {
  items: readonly BusinessContactItem[];
  className?: string;
}) =>
  items.length ? (
    <dl className={`puzzle-business-contact-details ${className ?? ""}`.trim()}>
      {items.map((item) => (
        <div className="puzzle-business-contact-details__item" key={item.id}>
          <dt>{item.label}</dt>
          <dd>
            {item.href ? <a href={item.href}>{item.value}</a> : item.value}
          </dd>
        </div>
      ))}
    </dl>
  ) : null;

export const LogoCollection = ({
  items,
  label = "Organizations",
  className,
  scrollable = false,
}: LogoCollectionProps) =>
  items.length ? (
    <ul
      className={`puzzle-business-logo-collection ${className ?? ""}`.trim()}
      aria-label={label}
      tabIndex={scrollable ? 0 : undefined}
    >
      {items.map((item) => (
        <li key={item.id}>
          {item.href ? (
            <a
              href={item.href}
              aria-label={item.name}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
            >
              <LogoItemContent item={item} />
            </a>
          ) : (
            <LogoItemContent item={item} />
          )}
          {item.description ? (
            <p className="puzzle-business-logo-collection__description">
              {item.description}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  ) : null;

const LogoItemContent = ({ item }: { item: BusinessLogoItem }) =>
  item.image?.src ? (
    <img
      className="puzzle-business-logo-collection__image"
      src={item.image.src}
      alt={item.image.alt ?? item.name}
      loading="lazy"
      decoding="async"
    />
  ) : (
    <span className="puzzle-business-logo-collection__name">{item.name}</span>
  );

export const MetricList = ({
  items,
  className,
}: {
  items: readonly BusinessMetricItem[];
  className?: string;
}) =>
  items.length ? (
    <dl className={`puzzle-business-metrics ${className ?? ""}`.trim()}>
      {items.map((item) => (
        <div className="puzzle-business-metrics__item" key={item.id}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
          {item.description ? <p>{item.description}</p> : null}
        </div>
      ))}
    </dl>
  ) : null;

export type ServiceCardProps = {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  image?: ReactNode;
  pricing?: ReactNode;
  action?: ReactNode;
  href?: string;
  featured?: boolean;
  external?: boolean;
  number?: ReactNode;
  className?: string;
};

export const ServiceCard = ({
  title,
  description,
  icon,
  image,
  pricing,
  action,
  href,
  featured,
  external,
  number,
  className,
}: ServiceCardProps) => (
  <article
    className={`puzzle-business-service ${className ?? ""}`.trim()}
    data-featured={featured || undefined}
  >
    {number !== undefined ? (
      <span className="puzzle-business-service__number" aria-hidden="true">
        {number}
      </span>
    ) : null}
    {icon ? (
      <span className="puzzle-business-service__icon" aria-hidden="true">
        {icon}
      </span>
    ) : null}
    {image ? (
      <div className="puzzle-business-service__media">{image}</div>
    ) : null}
    <div className="puzzle-business-service__content">
      <h3>
        {href ? (
          <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
          >
            {title}
          </a>
        ) : (
          title
        )}
      </h3>
      {description ? <p>{description}</p> : null}
      {pricing ? (
        <div className="puzzle-business-service__pricing">{pricing}</div>
      ) : null}
      {action ? (
        <div className="puzzle-business-service__action">{action}</div>
      ) : null}
    </div>
  </article>
);

export type CaseStudyCardProps = {
  title: string;
  client?: string;
  industry?: string;
  challenge?: ReactNode;
  solution?: ReactNode;
  results?: ReactNode;
  media?: ReactNode;
  metrics?: readonly BusinessMetricItem[];
  href?: string;
  external?: boolean;
  featured?: boolean;
  className?: string;
};

export const CaseStudyCard = ({
  title,
  client,
  industry,
  challenge,
  solution,
  results,
  media,
  metrics = [],
  href,
  external,
  featured,
  className,
}: CaseStudyCardProps) => (
  <article
    className={`puzzle-business-case-study ${className ?? ""}`.trim()}
    data-featured={featured || undefined}
  >
    {media ? (
      <div className="puzzle-business-case-study__media">{media}</div>
    ) : null}
    <div className="puzzle-business-case-study__content">
      {client || industry ? (
        <p className="puzzle-business-case-study__meta">
          {[client, industry].filter(Boolean).join(" · ")}
        </p>
      ) : null}
      <h3>
        {href ? (
          <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
          >
            {title}
          </a>
        ) : (
          title
        )}
      </h3>
      {challenge ? (
        <div className="puzzle-business-case-study__detail">
          <h4>Challenge</h4>
          <p>{challenge}</p>
        </div>
      ) : null}
      {solution ? (
        <div className="puzzle-business-case-study__detail">
          <h4>Solution</h4>
          <p>{solution}</p>
        </div>
      ) : null}
      {results ? (
        <div className="puzzle-business-case-study__detail">
          <h4>Results</h4>
          <p>{results}</p>
        </div>
      ) : null}
      <MetricList
        items={metrics}
        className="puzzle-business-case-study__metrics"
      />
    </div>
  </article>
);
