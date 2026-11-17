import type { EmailMessage, EmailProvider } from "@puzzle-ui/auth";
import type { WorkspaceInvitationDelivery } from "@puzzle-ui/workspace/server";

import { getEnvironmentVariable } from "./environment";

type EmailContent = {
  readonly to: string;
  readonly subject: string;
  readonly text: string;
};

const getEmailConfiguration = () => {
  const apiKey = getEnvironmentVariable("RESEND_API_KEY");
  const from = getEnvironmentVariable("WORKSPACE_EMAIL_FROM");

  if (!apiKey || !from) {
    throw new Error(
      "Set RESEND_API_KEY and WORKSPACE_EMAIL_FROM to enable email delivery.",
    );
  }

  return { apiKey, from };
};

const sendEmail = async (content: EmailContent): Promise<void> => {
  const { apiKey, from } = getEmailConfiguration();
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [content.to],
      subject: content.subject,
      text: content.text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Email delivery failed with HTTP ${response.status}.`);
  }
};

const authEmailText = (message: EmailMessage) => {
  const url = message.variables.url;
  const expiresAt = message.variables.expiresAt;

  return [
    message.subject,
    "",
    url ? `Continue by opening this link: ${url}` : "",
    expiresAt ? `This link expires at ${expiresAt}.` : "",
  ]
    .filter(Boolean)
    .join("\n");
};

const createResendEmailProvider = (): EmailProvider => ({
  send: (message) =>
    sendEmail({
      to: message.to,
      subject: message.subject,
      text: authEmailText(message),
    }),
});

const getInvitationDelivery = () => {
  if (
    !getEnvironmentVariable("RESEND_API_KEY") ||
    !getEnvironmentVariable("WORKSPACE_EMAIL_FROM")
  ) {
    return undefined;
  }

  return async ({
    email,
    workspaceName,
    invitationUrl,
  }: WorkspaceInvitationDelivery) => {
    await sendEmail({
      to: email,
      subject: `Join ${workspaceName} on Puzzle`,
      text: [
        `You have been invited to join ${workspaceName} on Puzzle.`,
        "",
        `Accept the invitation: ${invitationUrl}`,
      ].join("\n"),
    });
  };
};

export { createResendEmailProvider, getInvitationDelivery };
