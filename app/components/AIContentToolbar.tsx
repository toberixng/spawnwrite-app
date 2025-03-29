import { Button, Flex } from '@chakra-ui/react';

type AIContentToolbarProps = {
  onGenerateHeadline: () => void;
  onSummarize: () => void;
  onGenerateContent: () => void;
};

export default function AIContentToolbar({
  onGenerateHeadline,
  onSummarize,
  onGenerateContent,
}: AIContentToolbarProps) {
  return (
    <Flex gap={2} mb={4}>
      <Button onClick={onGenerateHeadline} variant="solid">
        Generate Headline
      </Button>
      <Button onClick={onSummarize} variant="solid">
        Summarize
      </Button>
      <Button onClick={onGenerateContent} variant="solid">
        Generate Content
      </Button>
    </Flex>
  );
}