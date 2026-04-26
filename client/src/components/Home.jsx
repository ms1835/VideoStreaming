import React, { useContext, useEffect, useState } from 'react'
import VideoCard from './VideoCard';
import Loader from './Loader';
import { ToastContext } from '../context/ToastContext';
import Toast from './Message';

const Home = ({ setPaginationData }) => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const { addToast } = useContext(ToastContext);
    const limit = 9;

    const fetchVideos = async (requestedPage = 1, query = '') => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: requestedPage.toString(),
                limit: limit.toString()
            });
            if (query) params.set('search', query);

            const rawData = await fetch(`${import.meta.env.VITE_SERVER_URI}?${params.toString()}`, {
                method: 'GET',
                credentials: 'include'
            });
            const response = await rawData.json();
            if (!response?.success) {
                throw new Error(response?.message || 'Unable to fetch videos');
            }
            setVideos(response.data || []);
            setPage(response.pagination?.page || 1);
            setTotalPages(response.pagination?.totalPages || 1);
        } catch (error) {
            console.log(error);
            addToast({ type: 'error', message: error.message });
        } finally {
            setLoading(false);
        }
    }

    const searchVideos = async (query) => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                search: query
            });

            const rawData = await fetch(`${import.meta.env.VITE_SERVER_URI}/semantic-search?${params.toString()}`, {
                method: 'GET',
                credentials: 'include'
            });
            const response = await rawData.json();
            if (!response?.success) {
                throw new Error(response?.message || 'Unable to search videos');
            }
            setVideos(response.data || []);
            setPage(1);
            setTotalPages(response?.pagination?.totalPages || 1);
        } catch (error) {
            console.log(error);
            addToast({ type: 'error', message: error.message });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (searchQuery) {
            searchVideos(searchQuery);
        } else {
            fetchVideos(page);
        }
    }, [page, searchQuery]);

    useEffect(() => {
        if (setPaginationData) {
            setPaginationData({
                page,
                totalPages,
                onPageChange: setPage
            });
        }
    }, [page, totalPages, setPaginationData]);

    const handleSearch = (event) => {
        event.preventDefault();
        setPage(1);
        setSearchQuery(searchTerm.trim());
    }

    const handleClearSearch = () => {
        setSearchTerm('');
        setSearchQuery('');
        setPage(1);
    }

    return (
        loading ? <Loader /> :
            <>
                <div className='absolute top-3 right-3'>
                    <Toast></Toast>
                </div>
                <div className='p-8 text-gray-200'>
                    <form onSubmit={handleSearch} className='mb-6 flex flex-col sm:flex-row gap-3'>
                        <input
                            type='text'
                            placeholder='Search videos by title or description...'
                            className='w-full border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-900 text-gray-200'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type='submit' className='px-4 py-2 bg-emerald-500 text-gray-200 rounded hover:bg-emerald-600'>Search</button>
                        <button type='button' onClick={handleClearSearch} className='px-4 py-2 bg-gray-900 text-gray-200 rounded hover:bg-gray-800'>Clear</button>
                    </form>

                    <div className="w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
                            {videos.length > 0 ? videos.map((video, index) => (
                                <VideoCard key={index} video={video} fromDashboard={false} />
                            )) : (
                                <div className='col-span-full text-center text-gray-200'>No videos found.</div>
                            )}
                        </div>
                    </div>

                </div>
            </>
    )
}

export default Home;
