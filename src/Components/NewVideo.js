import { useEffect, useState } from 'react';
import { VIDEO_API_END_POINT, CHANNEL_API_END_POINT } from '../config/constants.js';
import axios from 'axios';

function NewVideo() {

  const [channels, setChannels] = useState([]);
  const [loadingChannels, setLoadingChannels] = useState(true);

  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');

        const res = await axios.get(CHANNEL_API_END_POINT, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        setChannels(res.data.results);
      } catch (err) {
        console.error('Failed to load channels', err);
      } finally {
        setLoadingChannels(false);
      }
    };

    fetchChannels();
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags:'',
    channelId: ''
  });

  const handleChange = (e) => {
    setFormData((prevData)=>({ ...prevData, [e.target.name]: e.target.value }));
  };

  const handleNewVideo = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing

    try {
      if (!file) return;

      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('tags', formData.tags);  
      data.append('channelId', formData.channelId);
      data.append('file', file);

      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post(
        VIDEO_API_END_POINT, 
        data,//converted Json to FormData
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`, // Token in header
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentComplete = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentComplete);
          },          
        },
      );

      console.log(`Create Video successful! Welcome, ${response.data.name}`);
    } catch (error) {
      console.log(`Create Video failed: ${error.response?.data?.message || error.message}`);
    } 
    alert("hello2!");
    console.log("Form Data:", formData);
  };
  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-100 py-10">
      <div className="bg-white p-4 rounded-lg w-full max-w-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Create New Video</h2>
        <form className="space-y-4" onSubmit={handleNewVideo}>
        <div className="flex items-center space-x-3">
            <label htmlFor="title" className="w-1/3 text-gray-700 text-center">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Video Title"
              className="w-2/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center space-x-3">
            <label htmlFor="description" className="w-1/3 text-gray-700 text-center">Description</label>
            <textarea id="description" 
              name="description"
              value={formData.description}
              onChange={handleChange}              
              rows="4" 
              className="block p-2.5 w-2/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500" 
              placeholder="Write your description here...">
            </textarea>
          </div>
          <div className="p-4 text-center">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="inline-block bg-blue-500 text-white px-4 py-2 rounded shadow cursor-pointer mt-4">
                Choose File
            </label>
            {file && <p className="mt-2">{file.name}</p>}
            {uploadProgress > 0 && (
              <div className="mt-4 w-full">
                <div className="bg-gray-200 rounded h-4">
                  <div
                    className="bg-green-500 h-4 rounded"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm">{uploadProgress}%</p>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <label className="w-1/3 text-gray-700 text-center">
              Channel
            </label>
            <select
              name="channelId"
              value={formData.channelId}
              onChange={handleChange}
              disabled={loadingChannels}
              className="w-2/3 px-4 py-2 border border-gray-300 rounded-md
                        focus:outline-none focus:border-indigo-500
                        disabled:bg-gray-100"
            >
              <option value="">
                {loadingChannels ? 'Loading channels...' : 'Select a channel'}
              </option>

              {channels.map(channel => (
                <option key={channel._id} value={channel._id}>
                  {channel.name}
                </option>
              ))}
            </select>
          </div>
          <div className="text-center mt-8">
            <button
              type="submit"
              id="submitBtn"
              name="submitBtn"
              className={`${
                !file
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600'
              } text-white px-4 py-2 rounded shadow`}
              disabled={!file}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewVideo;