import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Heading,
  Button,
} from "@react-email/components";
import * as React from "react";

export function ApprovedEmail({ firstName }: { firstName: string }) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>
            Your WildTechAlert account is approved, {firstName}!
          </Heading>
          <Text style={paragraph}>
            Great news! Your <strong>WildTechAlert</strong> account has been
            approved by our administrators.
          </Text>
          <Text style={paragraph}>
            You can now access the platform and look at all the amazing data.
          </Text>
          <Button
            style={{ ...button, padding: "12px 20px" }}
            href="https://wildtechalert.com/login"
          >
            Log in to your account
          </Button>
          <Text style={footer}>
            If you did not create this account, please contact our support team
            immediately.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default ApprovedEmail;

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
  fontSize: "14px",
  marginTop: "24px",
};
