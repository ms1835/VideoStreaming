import React, { useContext, useEffect, useState } from 'react'
import VideoCard from './VideoCard';
import Loader from './Loader';
import Pagination from './Pagination';
import { ToastContext } from '../context/ToastContext';
import Toast from './Message';
import { usePagination } from '../hooks/usePagination';

const Home = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const { addToast } = useContext(ToastContext);
    const { page, totalPages, setPage, setTotalPages, handlePreviousPage, handleNextPage } = usePagination();
    const limit = 10;

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
                <Toast></Toast>
                <div className='px-4 pt-2 text-gray-200 min-h-full flex flex-col'>
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

                    <div className="w-full flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
                            {videos.length > 0 ? videos.map((video, index) => (
                                <VideoCard key={index} video={video} fromDashboard={false} creator={video.creator} />
                            )) : (
                                <div className='col-span-full text-center text-gray-200'>No videos found.</div>
                            )}
                        </div>
                    </div>

                    <Pagination 
                        page={page} 
                        totalPages={totalPages} 
                        onPreviousPage={handlePreviousPage} 
                        onNextPage={handleNextPage} 
                    />

                </div>
            </>
    )
}

export default Home;
