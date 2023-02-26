import React, { useState, useEffect } from "react";
import io from 'socket.io-client';

const socket = io("http://server1.gas.usu.edu:3000");

function DockerForm() {
    const [name, setName] = useState('');
    const [imageNames, setImageNames] = useState([]);
    const [imageIds, setImageIds] = useState([]);

    const handleSubmit = async event => {
        event.preventDefault();

        const formData = { name, image: event.target.image.value }

        socket.emit('create-container', formData);

        console.log(formData);
        setName('');

    };

    useEffect(() => {
        socket.on('connected', () => {
            console.log('connected to the server');
        })

        socket.on('create-container');

        return () => {
            socket.disconnect();
        }

    }, [])


    // used to fetch images from the server
    useEffect(() => {
        async function fetchImages() {
          const response = await fetch('/containers/images');
          const data = await response.json();
          console.log(data.images);
          setImageNames(data.images.imageNames);
          setImageIds(data.images.imageIds);
        }

        fetchImages();
      }, []);


    return (
        <div className="block">
            <h1>Create a New Container</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="container_name_input">
                    Name:
                    <input id="container_name_input" type="text" 
                        value={name} onChange={event => setName(event.target.value)} />
                </label>
                <br />
                <label htmlFor="image">Image:</label>
                <select id="image" name="image">
                    {imageIds.map((image, index) => 
                        <option value={imageNames[index]} key={imageIds[index]}>
                        {imageNames[index]}
                    </option>
                    )}
                </select>
                <br />
                <button type="submit">Create Container</button>
            </form>

        </div>
    )
}

export default DockerForm;