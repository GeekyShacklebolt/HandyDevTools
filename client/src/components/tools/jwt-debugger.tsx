import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Key, AlertTriangle } from "lucide-react";
import ToolLayout, { ToolInput, ToolOutput } from "@/components/ui/tool-layout";
import { useToolState } from "@/hooks/use-tool-state";

export default function JWTDebugger() {
  const [state, setState] = useToolState("jwt-debugger", {
    jwtInput: "",
    header: "",
    payload: "",
    signature: "",
    error: ""
  });

  const { jwtInput, header, payload, signature, error } = state;

  const updateState = (updates: Partial<typeof state>) => {
    setState({ ...state, ...updates });
  };

    const decodeJWT = () => {
    try {
      const parts = jwtInput.split('.');
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format");
      }

      // Decode header
      const headerDecoded = JSON.parse(atob(parts[0]));
      const headerJson = JSON.stringify(headerDecoded, null, 2);

      // Decode payload
      const payloadDecoded = JSON.parse(atob(parts[1]));
      const payloadJson = JSON.stringify(payloadDecoded, null, 2);

      // Signature (base64url encoded)
      const signaturePart = parts[2];

      updateState({
        header: headerJson,
        payload: payloadJson,
        signature: signaturePart,
        error: ""
      });
    } catch (err) {
      updateState({
        error: err instanceof Error ? err.message : "Failed to decode JWT",
        header: "",
        payload: "",
        signature: ""
      });
    }
  };

  const clearAll = () => {
    updateState({
      jwtInput: "",
      header: "",
      payload: "",
      signature: "",
      error: ""
    });
  };

  const exampleJWT = () => {
    const example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    updateState({ jwtInput: example });
    decodeJWT();
  };

  return (
    <ToolLayout
      title="JWT Debugger"
      description="Debug and inspect JWT tokens"
      icon={<Key className="h-6 w-6 text-blue-500" />}
      outputValue={payload}
      infoContent={
        <div>
          <p className="mb-2">
            JSON Web Token (JWT) is a compact, URL-safe means of representing claims to be transferred between two parties.
            The claims in a JWT are encoded as a JSON object that is digitally signed using JSON Web Signature (JWS).
          </p>
          <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-md">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-2" />
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Warning: This tool only decodes JWTs. It does not verify signatures.
              </span>
            </div>
          </div>
        </div>
      }
    >
      <ToolInput title="Input">
        <div className="space-y-4">
          <div>
            <Label htmlFor="jwt-input">JWT Token</Label>
            <Textarea
              id="jwt-input"
              placeholder="Paste your JWT token here"
              value={jwtInput}
              onChange={(e) => updateState({ jwtInput: e.target.value })}
              className="tool-textarea"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={decodeJWT}>Decode JWT</Button>
            <Button variant="outline" onClick={exampleJWT}>Load Example</Button>
            <Button variant="outline" onClick={clearAll}>Clear</Button>
          </div>
        </div>
      </ToolInput>

      <ToolOutput title="Output" value={payload}>
        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-md">
              {error}
            </div>
          )}

          <div>
            <Label>Header</Label>
            <div className="p-3 bg-muted rounded-md font-mono text-sm mt-1 whitespace-pre-wrap max-h-32 overflow-y-auto">
              {header || "No header decoded"}
            </div>
          </div>

          <div>
            <Label>Payload</Label>
            <div className="p-3 bg-muted rounded-md font-mono text-sm mt-1 whitespace-pre-wrap max-h-32 overflow-y-auto">
              {payload || "No payload decoded"}
            </div>
          </div>

          <div>
            <Label>Signature</Label>
            <div className="p-3 bg-muted rounded-md font-mono text-sm mt-1 break-all">
              {signature || "No signature"}
            </div>
          </div>
        </div>
      </ToolOutput>
    </ToolLayout>
  );
}
