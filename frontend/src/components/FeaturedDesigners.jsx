import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { VscVerified } from "react-icons/vsc";

// --- Static Data Import ---
// This data will be used for the "Featured Designers" section.
import StaticDesigners from './Designer/DesignerData.jsx';

// --- Redux Action Import ---
import { getFeaturedDesigners } from '../actions/user';


const FeaturedDesigners = () => {
    const dispatch = useDispatch();
    // This fetches the dynamic list of designers (now treated as students) from Redux.
    const { designers: studentDesigners, isLoading } = useSelector((state) => state.user);

    useEffect(() => {
        // This action fetches the student designers.
        dispatch(getFeaturedDesigners());
    }, [dispatch]);
    
    // Loading state for the Redux-fetched data.
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#FAF7F3]">
                <h1 className="text-xl font-semibold text-gray-700">Loading designers...</h1>
            </div>
        );
    }
    
    return (
        <div className="bg-[#FAF7F3] min-h-screen px-4 md:px-16 py-8">
            <div className="max-w-7xl mx-auto">

                {/* --- Section 1: Featured Designers (Using Static Data) --- */}
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
                    Featured Designers
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {/* Map over the imported static data */}
                    {StaticDesigners.map(designer => {
                        // Create a URL-friendly slug from the designer's name
                        const designerId = designer.name.toLowerCase().replace(/\s+/g, '-');
                        
                        return (
                            <Link 
                                to={`/designer/${designerId}`}
                                key={designer.name}
                                className="block bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1"
                            >
                                <div className="p-6 text-center">
                                    <img 
                                        src={designer.profileImage.url} // Use property from static data
                                        alt={designer.profileImage.alt} 
                                        className="w-32 h-32 rounded-full mx-auto object-cover object-top border-4 border-[#dcc5b2]" 
                                    />
                                    <h2 className="mt-4 text-xl font-bold text-gray-800">
                                        {designer.name}
                                    </h2>
                                    <p className="mt-2 text-sm text-gray-600 truncate font-mono">
                                        @{designer.socials.instagram.split('/').pop()}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* --- Section 2: Student Designers (Using Redux Data) --- */}
                <div className='flex justify-center items-center mt-20'>
                    <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
                        Student Designers 
                    </h1>
                    <VscVerified className="text-4xl text-[#96785f] ml-2 mb-12"/>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {/* Check if there are student designers to display */}
                    {studentDesigners && studentDesigners.length > 0 ? (
                        studentDesigners.map(designer => (
                            <Link 
                                to={`/user/${designer._id}`}
                                key={designer._id}
                                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1"
                            >
                                <div className="p-6 text-center">
                                    <img 
                                        src={designer.profilePhoto || `https://placehold.co/128x128/F0E4D3/44403c?text=${designer?.name?.charAt(0) || "A" }`}
                                        alt={designer.name} 
                                        className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-[#dcc5b2]" 
                                    />
                                    <h2 className="mt-4 text-xl font-bold text-gray-800">
                                        {designer.name}
                                    </h2>
                                    <p className="mt-2 text-sm text-gray-600 truncate">
                                        {designer.bio}
                                    </p>
                                </div>
                            </Link>
                        ))
                    ) : (
                        // Message if no student designers are found
                        <div className="col-span-full text-center">
                            <h2 className="text-xl font-semibold text-gray-700">No student designers found.</h2>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeaturedDesigners;
