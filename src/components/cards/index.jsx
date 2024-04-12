import React, { useState, useEffect } from 'react';

const Card = () => {
    const [animeUrls, setAnimeUrls] = useState([]);
    const [newUrl, setNewUrl] = useState('');

    // Cargar los URLs guardados al cargar la página
    useEffect(() => {
    const storedUrls = JSON.parse(localStorage.getItem('animeUrls'));
    if (storedUrls) {
        setAnimeUrls(storedUrls);
    }
    }, []);

    // Guardar los URLs cuando se actualiza el estado
    useEffect(() => {
    localStorage.setItem('animeUrls', JSON.stringify(animeUrls));
    }, [animeUrls]);

    const handleAddUrl = () => {
    setAnimeUrls([...animeUrls, newUrl]);
    setNewUrl('');
    };

    const handleDeleteUrl = (index) => {
        const newUrls = animeUrls.filter((_, i) => i !== index);
        setAnimeUrls(newUrls);
    };
    
    return (
        <div>
            <h1>Anime Calendar</h1>
            <div>
                <input
                type="text"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="Enter anime URL"
                />
                <button onClick={handleAddUrl}>Add</button>
            </div>
            <div className="flex flex-wrap items-center justify-evenly">
                {animeUrls.map((url, index) => (
                <div key={index} className="p-4 border border-gray-200">
                    {/* Aquí puedes mostrar la card utilizando el URL */}
                    <img src={url} alt={`Anime ${index}`} />
                    <h2>Nombre del Anime</h2>
                    <button onClick={() => handleDeleteUrl(index)}>Eliminar</button>
                </div>
                ))}
            </div>
        </div>
    )
}

export default Card;