import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CreateGroupForm = () => {
    const [groupName, setGroupName] = useState('');
    const [token, setToken] = useState('');

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const { token } = JSON.parse(userInfo);
            setToken(token);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post(
                'http://localhost:3000/api/groups/createGroup',
                { groupName },
                config
            );
            console.log('Group created:', response.data);
            // Optionally, you can redirect to another page or update the UI as needed
        } catch (error) {
            console.error('Error creating group:', error.response.data.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center h-40 border'>
            <input
                type="text"
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className=' w-[80%] py-2 text-black rounded-lg outline-none cursor-pointer  placeholder:text-gray-600 placeholder:text-xs placeholder:px-3 '
            />
            <button type="submit" className='px-2 py-2 my-4 text-black bg-emerald-200 rounded-xl'>Create Group</button>
        </form>
    );
};

export default CreateGroupForm;
