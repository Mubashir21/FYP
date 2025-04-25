import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Heading,
} from "@react-email/components";
import * as React from "react";

export function SignupEmail({ firstName }: { firstName: string }) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>
            Welcome to WildTechAlert, {firstName}!
          </Heading>
          <Text style={paragraph}>
            Thanks for signing up with <strong>WildTechAlert</strong>.
          </Text>
          <Text style={paragraph}>
            Your request has been received and is currently awaiting admin
            approval. You will receive a confirmation email once your account
            has been approved.
          </Text>
          <Text style={footer}>
            If you did not create this account, you can safely ignore this
            email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default SignupEmail;

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

const footer = {
  color: "#6b7280",
  fontSize: "14px",
  marginTop: "24px",
};
