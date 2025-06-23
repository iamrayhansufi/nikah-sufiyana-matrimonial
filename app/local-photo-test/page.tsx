"use client";

import React, { useState } from 'react';

export default function LocalPhotoTest() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [viewUrl, setViewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('photo', selectedFile);
    // Use a test userId for local
    formData.append('userId', 'user:localtestuser');
    setMessage('Uploading...');
    const res = await fetch('/api/profiles/upload-photo', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (res.ok && data.url) {
      setUploadedUrl(data.url);
      setViewUrl(data.url);
      setMessage('Upload successful!');
    } else {
      setMessage('Upload failed: ' + (data.error || 'Unknown error'));
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <h2>Local Photo Upload & View Test</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!selectedFile} style={{ marginLeft: 8 }}>
        Upload
      </button>
      <div style={{ marginTop: 16 }}>{message}</div>
      {viewUrl && (
        <div style={{ marginTop: 16 }}>
          <strong>View Uploaded Image:</strong>
          <div>
            <img src={viewUrl} alt="Uploaded" style={{ maxWidth: 300, border: '1px solid #ccc' }} />
          </div>
        </div>
      )}
    </div>
  );
}
