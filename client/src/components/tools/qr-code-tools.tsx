import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCode, Upload, Download } from "lucide-react";
import ToolLayout, { ToolInput, ToolOutput } from "@/components/ui/tool-layout";

export default function QRCodeTools() {
  const [text, setText] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [size, setSize] = useState("200");
  const [uploadedImage, setUploadedImage] = useState("");
  const [decodedText, setDecodedText] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQRCode = async () => {
    try {
      if (!text.trim()) {
        setError("Please enter text to encode");
        return;
      }

      // Using a simple QR code generation approach
      // In a real app, you'd use a library like qrcode
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const sizeNum = parseInt(size);
      canvas.width = sizeNum;
      canvas.height = sizeNum;

      // Simple placeholder QR code pattern
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, sizeNum, sizeNum);
      ctx.fillStyle = '#FFFFFF';
      
      // Create a simple pattern
      const cellSize = sizeNum / 25;
      for (let i = 0; i < 25; i++) {
        for (let j = 0; j < 25; j++) {
          if ((i + j) % 2 === 0) {
            ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
          }
        }
      }
      
      // Add some positioning squares
      ctx.fillStyle = '#000000';
      // Top-left
      ctx.fillRect(0, 0, cellSize * 7, cellSize * 7);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(cellSize, cellSize, cellSize * 5, cellSize * 5);
      ctx.fillStyle = '#000000';
      ctx.fillRect(cellSize * 2, cellSize * 2, cellSize * 3, cellSize * 3);
      
      const dataUrl = canvas.toDataURL();
      setQrCodeUrl(dataUrl);
      setError("");
    } catch (err) {
      setError("Failed to generate QR code");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError("Please select a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);
      
      // Simulate QR code reading - in a real app you'd use jsQR or similar
      setDecodedText("Simulated decoded text from QR code: " + text);
    };
    reader.onerror = () => {
      setError("Failed to read file");
    };
    reader.readAsDataURL(file);
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = qrCodeUrl;
    link.click();
  };

  const clearAll = () => {
    setText("");
    setQrCodeUrl("");
    setUploadedImage("");
    setDecodedText("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <ToolLayout
      title="QR Code Tools"
      description="Generate and read QR codes"
      icon={<QrCode className="h-6 w-6 text-blue-500" />}
      outputValue={qrCodeUrl || decodedText}
      infoContent={
        <p>
          QR (Quick Response) codes are two-dimensional barcodes that can store various types of information. 
          They can be scanned by smartphones and other devices to quickly access the encoded data.
        </p>
      }
    >
      <ToolInput title="Generator & Reader">
        <div className="space-y-6">
          {/* QR Code Generator */}
          <div className="space-y-4">
            <h4 className="font-medium">Generate QR Code</h4>
            <div>
              <Label htmlFor="qr-text">Text to Encode</Label>
              <Textarea
                id="qr-text"
                placeholder="Enter text, URL, or data to encode"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="tool-textarea"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div>
                <Label htmlFor="qr-size">Size (px)</Label>
                <Select value={size} onValueChange={setSize}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="150">150</SelectItem>
                    <SelectItem value="200">200</SelectItem>
                    <SelectItem value="300">300</SelectItem>
                    <SelectItem value="400">400</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={generateQRCode}>Generate QR Code</Button>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium mb-4">Read QR Code</h4>
            <div>
              <Label htmlFor="qr-upload">Upload QR Code Image</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input
                  id="qr-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                />
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-1" />
                  Browse
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={clearAll}>Clear All</Button>
          </div>
        </div>
      </ToolInput>

      <ToolOutput title="Output" value={qrCodeUrl || decodedText}>
        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-md">
              {error}
            </div>
          )}
          
          {qrCodeUrl && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Generated QR Code</Label>
                <Button variant="outline" size="sm" onClick={downloadQRCode}>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 bg-white dark:bg-gray-800 flex justify-center">
                <img src={qrCodeUrl} alt="Generated QR Code" className="max-w-full" />
              </div>
            </div>
          )}
          
          {uploadedImage && (
            <div>
              <Label>Uploaded QR Code</Label>
              <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 bg-white dark:bg-gray-800 flex justify-center mt-2">
                <img src={uploadedImage} alt="Uploaded QR Code" className="max-w-full max-h-64 object-contain" />
              </div>
            </div>
          )}
          
          {decodedText && (
            <div>
              <Label>Decoded Text</Label>
              <div className="p-3 bg-muted rounded-md font-mono text-sm mt-1">
                {decodedText}
              </div>
            </div>
          )}
          
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      </ToolOutput>
    </ToolLayout>
  );
}
