'use client';

import { useEffect } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { useRouter } from 'next/navigation';

export default function EditorLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const projects = useProjectStore((state) => state.projects);
  const currentProjectId = useProjectStore((state) => state.currentProjectId);
  const createProject = useProjectStore((state) => state.createProject);

  // Create default project if none exists
  // useEffect(() => {
  //   if (projects.length === 0) {
  //     console.log('No projects found, creating default project...');
  //     createProject('My First Project');
  //   }
  // }, [projects.length, createProject]);

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
