import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  activeWorkers: number;
  jobsPosted: number;
  successRate: number;
  loading: boolean;
}

export function useStats() {
  const [stats, setStats] = useState<Stats>({
    activeWorkers: 0,
    jobsPosted: 0,
    successRate: 0,
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get count of workers (profiles with user_type = 'worker')
        const { count: workersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('user_type', 'worker');

        // Get count of all jobs posted
        const { count: jobsCount } = await supabase
          .from('jobs')
          .select('*', { count: 'exact', head: true });

        // Calculate success rate: (closed jobs / total jobs) * 100
        const { count: closedJobsCount } = await supabase
          .from('jobs')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'closed');

        let successRate = 0;
        if (jobsCount && jobsCount > 0) {
          successRate = Math.round(((closedJobsCount || 0) / jobsCount) * 100);
        }

        setStats({
          activeWorkers: workersCount || 0,
          jobsPosted: jobsCount || 0,
          successRate: successRate,
          loading: false
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();

    // Set up real-time subscription for stats updates
    const channel = supabase
      .channel('stats-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => fetchStats()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'jobs'
        },
        () => fetchStats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return stats;
}