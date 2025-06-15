import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPublicTestimonials, getUserTestimonials } from '../../services/testimonialService';
import TestimonialCard from './TestimonialCard';
import TestimonialForm from './TestimonialForm';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const TestimonialsPage = () => {
  const { user, token } = useAuth();

  // Use React Query to fetch testimonials
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['testimonials', user?.email],
    queryFn: () => user ? getUserTestimonials(token) : getPublicTestimonials(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleFormSuccess = () => {
    refetch();
    toast.success('Testimonial submitted successfully!');
  };

  const handleCardAction = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Error loading testimonials: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Client Testimonials</h1>
      
      {/* Testimonial Form */}
      <div className="mb-12">
        <TestimonialForm onSuccess={handleFormSuccess} />
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.data?.map((testimonial) => (
          <TestimonialCard
            key={testimonial._id}
            testimonial={testimonial}
            onAction={handleCardAction}
          />
        ))}
      </div>

      {/* No Testimonials Message */}
      {(!data?.data || data.data.length === 0) && (
        <div className="text-center text-gray-500 mt-8">
          No testimonials found.
        </div>
      )}
    </div>
  );
};

export default TestimonialsPage; 