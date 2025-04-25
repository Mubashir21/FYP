import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Heading,
  Button,
  Section,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface AdminNotificationEmailProps {
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userId: string;
}

export function AdminNotificationEmail({
  userFirstName,
  userLastName,
  userEmail,
  userId,
}: AdminNotificationEmailProps) {
  const approvalUrl = `https://wildtechalert.com/admin/settings/approvals`;

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>
            New User Registration Requires Approval
          </Heading>
          <Text style={paragraph}>
            A new user has registered for WildTechAlert and is awaiting your
            approval.
          </Text>

          <Section style={detailsSection}>
            <Text style={detailsHeading}>User Details:</Text>
            <Text style={detailsItem}>
              <strong>Name:</strong> {userFirstName} {userLastName}
            </Text>
            <Text style={detailsItem}>
              <strong>Email:</strong> {userEmail}
            </Text>
            <Text style={detailsItem}>
              <strong>User ID:</strong> {userId}
            </Text>
          </Section>

          <Hr style={divider} />

          <Text style={paragraph}>
            Please review this registration and approve or reject it in the
            admin dashboard.
          </Text>

          <Button
            style={{ ...button, padding: "12px 20px" }}
            href={approvalUrl}
          >
            Go to Approvals Dashboard
          </Button>

          <Text style={footer}>
            This is an automated message from the WildTechAlert system.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default AdminNotificationEmail;

const main = {
  backgroundColor: "#f9f9f9",
  padding: "24px",
  fontFamily: "Inter, Arial, sans-serif",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  padding: "24px",
  borderRadius: "8px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
};

const heading = {
  color: "#111827",
  fontSize: "24px",
  fontWeight: "bold",
};

const paragraph = {
  color: "#374151",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "16px 0",
};

const detailsSection = {
  backgroundColor: "#f3f4f6",
  padding: "16px",
  borderRadius: "6px",
  margin: "20px 0",
};

const detailsHeading = {
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0 0 12px 0",
  color: "#111827",
};

const detailsItem = {
  margin: "8px 0",
  fontSize: "14px",
  color: "#4b5563",
};

const divider = {
  borderColor: "#e5e7eb",
  margin: "20px 0",
};

const button = {
  backgroundColor: "#047857",
  borderRadius: "6px",
  color: "#ffffff",
  fontWeight: "bold",
  border: "none",
  cursor: "pointer",
  display: "inline-block",
  textDecoration: "none",
  textAlign: "center" as const,
  margin: "16px 0",
};

const footer = {
  color: "#6b7280",
  fontSize: "12px",
  marginTop: "24px",
  textAlign: "center" as const,
};
