import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useEffect, useState } from 'react';

const HomeInstructor = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState('');
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');

    useEffect(() => {
        fetchImage();
    }, []);

    const fetchImage = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/admin/image`);
            if (data.image) {
                setUploadedImageUrl(data.image.url);
            }
        } catch (error) {
            console.error('Error fetching image:', error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleUpload = async () => {
        if (!image) return alert('Please select an image');

        const formData = new FormData();
        formData.append('image', image);

        try {
            const { data } = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/admin/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUploadedImageUrl(data.image.url);
            alert('Image uploaded successfully');
        } catch (error) {
            console.error('Upload Error', error);
        }
    };

    const handleUpdate = async () => {
        if (!image) return alert('Please select an image');

        const formData = new FormData();
        formData.append('image', image);

        try {
            const { data } = await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/admin/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUploadedImageUrl(data.image.url);
            alert('Image updated successfully');
        } catch (error) {
            console.error('Update Error', error);
        }
    };

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Home Image</CardTitle>
                </CardHeader>
                <CardContent className=" space-y-4 space-x-2">
                    <Input type="file" accept="image/*" onChange={handleImageChange} />
                    {preview && <img src={preview} alt="Preview" width="200" />}
                    <Button onClick={handleUpload}>Upload</Button>
                    <Button onClick={handleUpdate}>Update</Button >

                    {uploadedImageUrl && (
                        <div>
                            <h3>Current Image:</h3>
                            <img className='rounded-sm' src={uploadedImageUrl} alt="Admin Image" width="300" />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default HomeInstructor;
