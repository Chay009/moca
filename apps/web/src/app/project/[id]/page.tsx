'use client';

import { useParams, useRouter } from 'next/navigation';
import { useProjectStore } from '@/store/projectStore';
import { useEffect } from 'react';
import EditorPage from '@/app/editor/page';

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const { setCurrentProject, getCurrentProject } = useProjectStore();
  const projectId = params.id as string;

  useEffect(() => {
    if (projectId) {
      setCurrentProject(projectId);
      
      // Verify project exists
      const project = getCurrentProject();
      if (!project) {
        // Project not found, redirect back to projects
        router.push('/projects' as any);
      }
    }
  }, [projectId, setCurrentProject, router]);

  return <EditorPage />;
}
