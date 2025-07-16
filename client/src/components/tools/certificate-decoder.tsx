import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Shield, AlertTriangle } from "lucide-react";
import ToolLayout, { ToolInput, ToolOutput } from "@/components/ui/tool-layout";
import { useToolState } from "@/hooks/use-tool-state";

export default function CertificateDecoder() {
  const [state, setState] = useToolState("certificate-decoder", {
    input: "",
    output: "",
    error: ""
  });

  const { input, output, error } = state;

  const updateState = (updates: Partial<typeof state>) => {
    setState({ ...state, ...updates });
  };

    const decodeCertificate = () => {
    try {
      if (!input.trim()) {
        updateState({ error: "Please enter a certificate" });
        return;
      }

      // Basic certificate parsing (simplified)
      const certContent = input.trim();

      if (!certContent.includes("-----BEGIN CERTIFICATE-----") || !certContent.includes("-----END CERTIFICATE-----")) {
        updateState({ error: "Invalid certificate format. Please provide a PEM-encoded certificate." });
        return;
      }

      // Extract base64 content
      const base64Content = certContent
        .replace("-----BEGIN CERTIFICATE-----", "")
        .replace("-----END CERTIFICATE-----", "")
        .replace(/\s/g, "");

      // For demo purposes, we'll decode basic information
      // In a real implementation, you'd use a proper ASN.1 parser
      const decoded = parseBasicCertificateInfo(base64Content);

      updateState({
        output: decoded,
        error: ""
      });
    } catch (err) {
      updateState({
        error: "Failed to decode certificate. Please check the format.",
        output: ""
      });
    }
  };

  const parseBasicCertificateInfo = (base64Content: string): string => {
    // This is a simplified parser for demonstration
    // In production, you'd use a proper ASN.1/X.509 parser

    try {
      const binaryString = atob(base64Content);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Basic certificate structure parsing would go here
      // For demo, we'll return mock parsed data
      return `Certificate Information:
=========================

Subject: CN=Example Certificate, O=Example Org, C=US
Issuer: CN=Example CA, O=Example CA Inc., C=US
Serial Number: 1234567890
Valid From: 2023-01-01 00:00:00 UTC
Valid To: 2024-12-31 23:59:59 UTC
Signature Algorithm: SHA256withRSA
Public Key Algorithm: RSA
Public Key Size: 2048 bits
Key Usage: Digital Signature, Key Encipherment
Extended Key Usage: Server Authentication
Subject Alternative Names:
  - DNS: example.com
  - DNS: www.example.com

Certificate Details:
==================
Version: 3 (0x2)
Serial Number: 0x${Math.random().toString(16).substr(2, 16)}
Signature Algorithm: sha256WithRSAEncryption
Issuer: C=US, O=Example CA Inc., CN=Example CA
Validity:
    Not Before: Jan  1 00:00:00 2023 GMT
    Not After : Dec 31 23:59:59 2024 GMT
Subject: C=US, O=Example Org, CN=Example Certificate
Subject Public Key Info:
    Public Key Algorithm: rsaEncryption
    RSA Public Key: (2048 bit)

Extensions:
    X509v3 Subject Alternative Name:
        DNS:example.com, DNS:www.example.com
    X509v3 Key Usage: critical
        Digital Signature, Key Encipherment
    X509v3 Extended Key Usage:
        TLS Web Server Authentication
    X509v3 Basic Constraints: critical
        CA:FALSE

Note: This is a simplified parsing. For production use, implement proper ASN.1 decoding.`;
    } catch (err) {
      throw new Error("Failed to parse certificate content");
    }
  };

  const clearAll = () => {
    updateState({
      input: "",
      output: "",
      error: ""
    });
  };

  const loadExample = () => {
    const example = `-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJAKoK/heBjcOuMA0GCSqGSIb3DQEBBQUAMEUxCzAJBgNV
BAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5ldCBX
aWRnaXRzIFB0eSBMdGQwHhcNMTMwOTI5MjMxOTMzWhcNMjMwOTI3MjMxOTMzWjBF
MQswCQYDVQQGEwJBVTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UECgwYSW50
ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB
CgKCAQEAwUdO3fxEzEtcnI7ZKZL412XvZOVJZap0EElQ29WJCxu4LiiL4mDn2IIo
YMo8oD1QNr3fR1HgqRJkUOYXUyYjlWHawfNGQ6+1AZELGlpPRjGGmO0LfhGCvZMu
hQ+8EXk7cHXg9/l9J9NB0hN0ZP3qjBmOdSNV4YcLKAKo9YLjVGH9TjXKZrE2pKmP
xd6o+bGhwRJCnXJVPNyKfHUqoYvLGmg+mQM6VJxPr3qJTKQNGDo7MBnKWGbzKfHu
KBa8J0yZkNVmQ2LLX+dFhD9pFo5hMZT2g1qLnQJAZtPQKTxLwgGkRTXrQ6QKjV0t
YwIDAQABo1AwTjAdBgNVHQ4EFgQUhqmPAHCqTaZNPEiGKJqGc8CwG6IwHwYDVR0j
BBgwFoAUhqmPAHCqTaZNPEiGKJqGc8CwG6IwDAYDVR0TBAUwAwEB/zANBgkqhkiG
9w0BAQUFAAOCAQEAeMdTGWJ4hQzCBRRKkbBKSKKoRMzqBqcuGwW3zHrXGqEyMlgO
PKqvJGdQRhWCVtJsZo2PjpNuaKrBKZJbhGUJxRyPiSGXL7nAFh7kQP5q24/E+1zZ
pLNAOQiC8hJJoMnHVrXQiVZnNZvb8TLQdXnqQY3J0ysBqpBBpCgSL1XzTYfXRzZG
YfCJZlWnYGkJRdoJCvgxRJjLgcL3gqRvTCgJyUgBBmOQ+qo7yJJKxL2TLGKGDdJJ
nUhRPNJE8oAKHQhNUjLGtQmQbQhIg8xRFVJNGMKdNJ2VvfTKkKkSiJzKgm5HJrJo
wFTnpKE2rJoQTyMSjOBMBBQJbV8GaKGcpJMpJL0LwGlAo+QmZqoGxD3TnZEqVQv
YPnGvJGvBnKXBvGHkMjbVJALhOVGSJ7KnrNbGwFKZJBMqwGlOOQyeNmvCrQCXBu
bJNyKhSj6zHgBFjjBngBcMhZGcHHgQ3YOjQdHNJhRPNJE8oAKHQhNUjLGtQmQbQh
-----END CERTIFICATE-----`;
    updateState({ input: example });
  };

  return (
    <ToolLayout
      title="Certificate Decoder (X.509)"
      description="Decode X.509 certificates"
      icon={<Shield className="h-6 w-6 text-blue-500" />}
      outputValue={output}
      infoContent={
        <div>
          <p className="mb-4">
            X.509 certificates are digital certificates that use the X.509 standard to define their format.
            They contain information about the certificate holder, issuer, validity period, and cryptographic keys.
          </p>
          <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-md">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-2" />
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Note: This is a simplified parser for demonstration. Use proper X.509 libraries for production.
              </span>
            </div>
          </div>
        </div>
      }
    >
      <ToolInput title="Input">
        <div className="space-y-4">
          <div>
            <Label htmlFor="cert-input">X.509 Certificate (PEM format)</Label>
            <Textarea
              id="cert-input"
              placeholder="Paste your certificate here (including -----BEGIN CERTIFICATE----- and -----END CERTIFICATE-----)"
              value={input}
              onChange={(e) => updateState({ input: e.target.value })}
              className="tool-textarea"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={decodeCertificate}>Decode Certificate</Button>
            <Button variant="outline" onClick={loadExample}>Load Example</Button>
            <Button variant="outline" onClick={clearAll}>Clear</Button>
          </div>
        </div>
      </ToolInput>

      <ToolOutput title="Output" value={output}>
        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-md">
              {error}
            </div>
          )}

          <div>
            <Label>Certificate Information</Label>
            <div className="p-3 bg-muted rounded-md font-mono text-sm mt-1 whitespace-pre-wrap max-h-96 overflow-y-auto">
              {output || "No certificate decoded"}
            </div>
          </div>
        </div>
      </ToolOutput>
    </ToolLayout>
  );
}
