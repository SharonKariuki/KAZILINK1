// components/sections/ContentManagement.js
import { FaImage, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import { useState } from "react";

export default function ContentManagement({ banners, refresh, loading }) {
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newBanner, setNewBanner] = useState({
    title: "",
    imageUrl: "",
    link: "",
    isActive: true
  });

  const deleteBanner = async (id) => {
    try {
      const response = await fetch(`/api/admin/banners/${id}`, { 
        method: "DELETE" 
      });

      if (!response.ok) throw new Error('Failed to delete banner');
      
      refresh();
    } catch (error) {
      console.error("Error deleting banner:", error);
    }
  };

  const toggleBannerStatus = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    try {
      const response = await fetch(`/api/admin/banners/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update banner status');
      
      refresh();
    } catch (error) {
      console.error("Error updating banner status:", error);
    }
  };

  const handleAddBanner = async () => {
    try {
      const response = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBanner),
      });

      if (!response.ok) throw new Error('Failed to add banner');
      
      setIsAdding(false);
      setNewBanner({
        title: "",
        imageUrl: "",
        link: "",
        isActive: true
      });
      refresh();
    } catch (error) {
      console.error("Error adding banner:", error);
    }
  };

  const filteredBanners = Array.isArray(banners) ? banners.filter(banner => {
    return banner.title.toLowerCase().includes(search.toLowerCase());
  }) : [];

  return (
    <section className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-indigo-900">Content Management</h2>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[250px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search banners..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FaPlus className="mr-2" /> Add Banner
            </button>
          </div>
        </div>

        {isAdding && (
          <div className="mb-6 p-6 border border-indigo-200 rounded-xl bg-indigo-50">
            <h3 className="text-lg font-medium text-indigo-900 mb-4">Add New Banner</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={newBanner.title}
                  onChange={(e) => setNewBanner({...newBanner, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={newBanner.link}
                  onChange={(e) => setNewBanner({...newBanner, link: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={newBanner.imageUrl}
                  onChange={(e) => setNewBanner({...newBanner, imageUrl: e.target.value})}
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={newBanner.isActive}
                  onChange={(e) => setNewBanner({...newBanner, isActive: e.target.checked})}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Active
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBanner}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Banner
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBanners.length > 0 ? (
              filteredBanners.map((banner) => (
                <div key={banner._id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <div className="h-40 bg-gray-100 flex items-center justify-center">
                      {banner.imageUrl ? (
                        <img 
                          src={banner.imageUrl} 
                          alt={banner.title} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FaImage className="text-4xl text-gray-400" />
                      )}
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        banner.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {banner.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-1">{banner.title}</h3>
                    <p className="text-sm text-gray-500 mb-3 truncate">{banner.link}</p>
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => toggleBannerStatus(banner._id, banner.isActive)}
                        className={`px-3 py-1 rounded-lg text-sm ${
                          banner.isActive
                            ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {banner.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => deleteBanner(banner._id)}
                        className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
                        title="Delete banner"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="md:col-span-3 text-center py-12">
                <div className="mx-auto h-24 w-24 text-indigo-200 mb-4">
                  <FaImage className="w-full h-full" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No banners found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {search ? 'No banners match your search criteria' : 'There are no banners to display'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}