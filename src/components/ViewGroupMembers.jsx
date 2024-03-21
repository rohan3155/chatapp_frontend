import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewGroupMembers = ({ groupId }) => {
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await axios.get(`/api/groups/${groupId}/members`);
                setMembers(response.data);
            } catch (error) {
                console.error('Error fetching group members:', error.response.data.message);
            }
        };

        fetchMembers();
    }, [groupId]);

    return (
        <div>
            <h3>Group Members:</h3>
            <ul>
                {members.map((member) => (
                    <li key={member._id}>{member.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default ViewGroupMembers;
