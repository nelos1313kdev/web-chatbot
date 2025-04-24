import { useState } from 'react';
import SubscriptionModal from './SubscriptionModal';

interface FileUploadProps {
  isSubscribed: boolean;
}

export default function FileUpload({ isSubscribed }: FileUploadProps) {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isSubscribed) {
      setShowSubscriptionModal(true);
      event.target.value = ''; // Clear the file input
      return;
    }

    setUploading(true);
    // Here you would implement the actual file upload logic
    // For example, using FormData to send to your API endpoint
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      // Handle successful upload
      const data = await response.json();
      console.log('File uploaded:', data);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
      event.target.value = ''; // Clear the file input
    }
  };

  return (
    <>
      <div className="d-flex align-items-center">
        <label className="btn btn-outline-primary position-relative mb-0">
          <i className="bi bi-upload me-2"></i>
          Upload File
          <input
            type="file"
            className="position-absolute top-0 start-0 opacity-0"
            style={{ cursor: 'pointer' }}
            onChange={handleFileChange}
            accept=".txt,.pdf,.doc,.docx"
          />
        </label>
        {uploading && (
          <div className="spinner-border spinner-border-sm ms-2" role="status">
            <span className="visually-hidden">Uploading...</span>
          </div>
        )}
      </div>

      {showSubscriptionModal && (
        <SubscriptionModal onClose={() => setShowSubscriptionModal(false)} />
      )}
    </>
  );
} 