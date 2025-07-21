import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Job {
  id: string;
  employer_id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  date: string;
  time: string;
  pay: string;
  urgent?: boolean;
  lat?: number | null;
  lng?: number | null;
  status: string;
  created_at: string;
  updated_at: string;
  distance?: number | null;
}

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setJobs(data || []);
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      toast({
        title: "Error",
        description: "Failed to load jobs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createJob = async (jobData: {
    title: string;
    category: string;
    description: string;
    location: string;
    date: Date;
    time: string;
    pay: string;
    urgent?: boolean;
    lat?: number;
    lng?: number;
  }, employerId: string) => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert({
          ...jobData,
          employer_id: employerId,
          date: jobData.date.toISOString().split('T')[0], // Convert to date string
          status: 'open'
        })
        .select()
        .single();

      if (error) throw error;

      // Add the new job to the local state
      setJobs(prev => [data, ...prev]);

      toast({
        title: "Job Posted Successfully!",
        description: "Your job posting is now live and workers in your area will be notified."
      });

      return { success: true, data };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create job",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    }
  };

  const applyToJob = async (jobId: string, workerId: string) => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .insert({
          job_id: jobId,
          worker_id: workerId,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Application Sent!",
        description: "Your application has been sent to the employer. They will contact you soon."
      });

      return { success: true, data };
    } catch (error: any) {
      if (error.code === '23505') {
        toast({
          title: "Already Applied",
          description: "You have already applied to this job.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to apply to job",
          variant: "destructive"
        });
      }
      return { success: false, error: error.message };
    }
  };

  // Calculate distance between two points in kilometers
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const filterJobsByLocation = (userLocation: { lat: number; lng: number }) => {
    const maxDistance = 15; // 15 km radius
    const filtered = jobs.filter(job => {
      if (!job.lat || !job.lng) return true; // Include jobs without coordinates
      const distance = calculateDistance(userLocation.lat, userLocation.lng, job.lat, job.lng);
      return distance <= maxDistance;
    }).map(job => ({
      ...job,
      distance: job.lat && job.lng 
        ? calculateDistance(userLocation.lat, userLocation.lng, job.lat, job.lng)
        : null
    })).sort((a, b) => {
      // Sort by distance, putting jobs without distance at the end
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });
    
    return filtered;
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return {
    jobs,
    loading,
    fetchJobs,
    createJob,
    applyToJob,
    filterJobsByLocation
  };
}