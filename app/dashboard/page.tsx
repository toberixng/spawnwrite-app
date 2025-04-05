// app/dashboard/page.tsx
"use client";

import { UserButton } from '@clerk/nextjs';
import { Box, Heading, Text } from '@chakra-ui/react';

export default function Dashboard() {
  return (
    <Box p={8}>
      <Heading>Dashboard</Heading>
      <Text mt={4}>Welcome to SpawnWrite!</Text>
      <UserButton afterSignOutUrl="/" />
    </Box>
  );
}