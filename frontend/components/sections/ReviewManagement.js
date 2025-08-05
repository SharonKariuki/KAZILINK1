// components/sections/ReviewManagement.js
import { FaStar, FaTrash, FaUserCircle } from "react-icons/fa";
import { useState } from "react";

export default function ReviewManagement({ reviews, refresh, loading }) {
  const [search, setSearch] = useState("");

  const deleteReview = async (id) => {
    try {
      const response = await fetch(`/api/admin/reviews/${id}`, { 
        method: "DELETE" 
      });

      if (!response.ok) throw new Error('Failed to delete review');
      
      refresh();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const filteredReviews = Array.isArray(reviews) ? reviews.filter(review => {
    const reviewerName = `${review.reviewer?.firstName || ''} ${review.reviewer?.lastName || ''}`.toLowerCase();
    return reviewerName.includes(search.toLowerCase()) || 
           review.comment.toLowerCase().includes(search.toLowerCase());
  }) : [];

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <FaStar 
            key={i} 
            className={`${i < rating ? 'text-yellow-400' : 'text-gray-300'} text-sm`} 
          />
        ))}
      </div>
    );
  };

  return (
    <section className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-indigo-900">Review Management</h2>
          
          <div className="relative flex-1 min-w-[250px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaStar className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search reviews..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <div key={review._id} className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                          <FaUserCircle className="text-xl" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {review.reviewer?.firstName} {review.reviewer?.lastName}
                        </p>
                        <p className="text-sm text-gray-500 mb-2">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex items-center mb-2">
                          {renderStars(review.rating)}
                          <span className="ml-2 text-sm text-gray-500">
                            {review.rating.toFixed(1)}/5
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteReview(review._id)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
                      title="Delete review"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto h-24 w-24 text-indigo-200 mb-4">
                  <FaStar className="w-full h-full" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No reviews found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {search ? 'No reviews match your search criteria' : 'There are no reviews to display'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}