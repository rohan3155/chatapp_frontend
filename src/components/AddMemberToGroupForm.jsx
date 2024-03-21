import React from 'react';
import axios from 'axios';

const AddMemberToGroupForm = ({ groupId, userId, token }) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            console.log(userId)
            console.log(groupId)
            console.log(token)
            const response = await axios.post(`http://localhost:3000/api/groups/${groupId}/addUser`, { userId }, config);
            console.log('User added to group:', response.data);
            // Optionally, you can update the UI to reflect the changes
        } catch (error) {
            console.error('Error adding user to group:', error.response.data.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center border h-28'>
            <input
                type="text"
                placeholder="Enter user ID"
                value={userId}
                onChange={() => {}}
                className='px-2 py-2 text-black rounded-lg outline-none cursor-pointer placeholder:text-gray-600'
            />
            <input
                type="text"
                placeholder="Enter group ID"
                value={groupId}
                className='text-black'
                onChange={() => {}}
            />
            <button type="submit">Add User to Group</button>
        </form>
    );
};

export default AddMemberToGroupForm;
