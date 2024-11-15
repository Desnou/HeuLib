import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { TextInput, Button, Textarea } from 'flowbite-react';

const SuggestPostForm = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/suggestedPost/suggest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (res.ok) {
            alert('Suggested post created successfully');
        } else {
            alert('Failed to create suggested post');
        }
    };

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <TextInput
                id="title"
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                required
            />
            <Textarea
                id="content"
                placeholder="Content"
                value={formData.content}
                onChange={handleChange}
                required
            />
            <TextInput
                id="category"
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
                required
            />
            <Button type="submit">Suggest Post</Button>
        </form>
    );
};

export default SuggestPostForm;