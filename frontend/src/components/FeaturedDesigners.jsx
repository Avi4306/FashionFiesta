import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

// Import the Redux action creator
import { getFeaturedDesigners } from '../actions/user';


const FeaturedDesigners = () => {
    // Dispatch hook to send actions to the store
    const dispatch = useDispatch();

    // useSelector hook to pull data from the Redux store
    // The state key 'designers' comes from your rootReducer
    const { designers, isLoading } = useSelector((state) => state.user);

    // Fetch designers from the API when the component first loads
    useEffect(() => {
        dispatch(getFeaturedDesigners());
    }, [dispatch]); // The dependency array ensures this effect only runs once

    // --- Conditional Rendering for Loading and Error States ---
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#FAF7F3]">
                <h1 className="text-xl font-semibold text-gray-700">Loading designers...</h1>
            </div>
        );
    }
    
    // Check if there was an error or no designers were found
    if (!designers.length) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#FAF7F3]">
                <h1 className="text-2xl font-semibold text-gray-700">No designers found at the moment.</h1>
            </div>
        );
    }

    // --- Main Component Render ---
    return (
        <div className="bg-[#FAF7F3] min-h-screen px-4 md:px-16 py-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
                    Featured Designers
                </h1>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {designers.map(designer => (
                        <Link 
                            to={`/user/${designer._id}`} // Use the real ID for the link
                            key={designer._id} // Use the real ID as the unique key
                            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1"
                        >
                            <div className="p-6 text-center">
                                <img 
                                    src={designer.profilePhoto} // Use the profilePhoto from your schema
                                    alt={designer.name} 
                                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-[#dcc5b2]" 
                                />
                                <h2 className="mt-4 text-xl font-bold text-gray-800">
                                    {designer.name}
                                </h2>
                                <p className="mt-2 text-sm text-gray-600">
                                    {designer.bio}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeaturedDesigners;