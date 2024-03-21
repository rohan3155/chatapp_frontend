import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateGroupForm from './CreateGroupForm';
import AddMemberToGroupForm from './AddMemberToGroupForm';

const UsersList = ({ users, selectedUser, handleSelection, selectedGroup, setselectedGroup, selectedUserForGroup, setselectedUserForGroup }) => {
    const [groups, setGroups] = useState([]);
    const [token, setToken] = useState('');
    const [addToGroup, setAddToGroup] = useState(false)



    // console.log(selectedUserForGroup)
    console.log(selectedGroup)

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const { token } = JSON.parse(userInfo);
            setToken(token);
        }
    }, []);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get('http://localhost:3000/api/groups/list', config);
                setGroups(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching groups:', error.response ? error.response.data.message : error.message);
            }
        };

        if (token) {
            fetchGroups();
        }
    }, [token]);

    return (
        <div className='w-1/5 p-4 bg-black'>
            <h1 className='mb-4 text-lg font-semibold text-center'>Friends</h1>
            <div className='space-y-2'>
                {users.map((user) => (
                    <div
                        key={user._id}
                        className={`flex items-center py-2 px-4 cursor-pointer border rounded-lg ${selectedUser && selectedUser._id === user._id ? 'bg-green-200 text-black' : ''}`}
                        onClick={() => {
                            handleSelection(user);
                            setselectedUserForGroup(user._id);
                        }}

                    >
                        <img src={user.pic} alt='' className='w-8 h-8 mr-2 rounded-full' />
                        <span className='uppercase'>{user.name}</span>
                    </div>
                ))}
            </div>
            {/* Display list of groups */}
            <div className='mt-4'>
                <h1 className='mb-4 text-lg font-semibold'>Groups</h1>
                <h1 className='mb-4 text-sm font-semibold'>Selec to view chat</h1>
                <ul className='space-y-2'>
                    {groups.map((group) => (
                        <li key={group._id} className={`text-center text-white uppercase border cursor-pointer ${selectedGroup == group._id ? 'text-black bg-green-200 ' : ''} `} onClick={() => setselectedGroup(group._id)} >{group.name}</li>
                    ))}
                </ul>
            </div>
            {/* Button to create a group */}
            <div className="mt-4">
                <CreateGroupForm />
            </div>
            <button className='px-2 py-2 mt-4 text-black rounded-lg bg-slate-500' onClick={() => setAddToGroup(!addToGroup)}>Add User to group?</button>
            {/* Button to add user to group (only visible when a user is selected) */}
            {(selectedUser && addToGroup) && (
                <div className="mt-4">
                    <AddMemberToGroupForm groupId={selectedGroup} userId={selectedUserForGroup} token={token} />
                </div>
            )}
        </div>
    );
};

export default UsersList;
