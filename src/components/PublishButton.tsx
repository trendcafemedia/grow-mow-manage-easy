
import React from 'react';
import { Button } from '@/components/ui/button';

const PublishButton = () => {
  const publishUrl = 'https://grow-mow-manage-easy.vercel.app';

  const handlePublish = () => {
    // Implement publish logic with the updated URL
    window.open(publishUrl, '_blank');
  };

  return (
    <Button onClick={handlePublish}>
      Publish
    </Button>
  );
};

export default PublishButton;
