import React, { useEffect, useState } from 'react';
import { Table, Button } from 'flowbite-react';

const AdminSuggestedPosts = () => {
    const [suggestedPosts, setSuggestedPosts] = useState([]);

    useEffect(() => {
        const fetchSuggestedPosts = async () => {
            const res = await fetch('/api/suggestedPost/suggested');
            const data = await res.json();
            setSuggestedPosts(data);
        };
        fetchSuggestedPosts();
    }, []);

    const handleApprove = async (id) => {
        const res = await fetch(`/api/suggestedPost/approve/${id}`, {
            method: 'PUT',
        });
        if (res.ok) {
            setSuggestedPosts(suggestedPosts.filter((post) => post._id !== id));
        } else {
            alert('Failed to approve post');
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl mb-4">Suggested Posts</h1>
            <Table hoverable>
                <Table.Head>
                    <Table.HeadCell>Title</Table.HeadCell>
                    <Table.HeadCell>Author</Table.HeadCell>
                    <Table.HeadCell>Category</Table.HeadCell>
                    <Table.HeadCell>Actions</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                    {suggestedPosts.map((post) => (
                        <Table.Row key={post._id}>
                            <Table.Cell>{post.title}</Table.Cell>
                            <Table.Cell>{post.author.username}</Table.Cell>
                            <Table.Cell>{post.category}</Table.Cell>
                            <Table.Cell>
                                <Button onClick={() => handleApprove(post._id)}>Approve</Button>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
};

export default AdminSuggestedPosts;