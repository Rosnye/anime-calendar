import React, { useState, useEffect } from 'react';

const Card = () => {
    const [animeUrls, setAnimeUrls] = useState([]);
    const [newUrl, setNewUrl] = useState('');

    useEffect(() => {
        // Abrir o crear una base de datos llamada "AnimeCalendarDB"
        const request = indexedDB.open('AnimeCalendarDB', 1);

        // Manejar errores en la apertura de la base de datos
        request.onerror = function(event) {
            console.error('Error al abrir la base de datos:', event.target.error);
        };

        // Manejar la actualización de la base de datos
        request.onupgradeneeded = function(event) {
            const db = event.target.result;

            // Crear un almacén de objetos llamado "animeUrls"
            const objectStore = db.createObjectStore('animeUrls', { keyPath: 'id', autoIncrement:true });

            // Manejar errores en la creación del almacén de objetos
            objectStore.onerror = function(event) {
                console.error('Error al crear el almacén de objetos:', event.target.error);
            };
        };

        // Obtener los URLs guardados al cargar la página
        request.onsuccess = function(event) {
            const db = event.target.result;

            // Abrir la transacción para leer los datos
            const transaction = db.transaction('animeUrls', 'readonly');
            const objectStore = transaction.objectStore('animeUrls');

            // Obtener todos los objetos en el almacén de objetos
            const getAllRequest = objectStore.getAll();

            getAllRequest.onsuccess = function(event) {
                setAnimeUrls(event.target.result.map(obj => obj.url));
            };

            // Manejar errores en la obtención de los URLs
            getAllRequest.onerror = function(event) {
                console.error('Error al obtener los URLs:', event.target.error);
            };
        };
    }, []);

    const handleAddUrl = () => {
        setAnimeUrls([...animeUrls, newUrl]);

        // Abrir la base de datos para escribir los datos
        const request = indexedDB.open('AnimeCalendarDB', 1);

        request.onsuccess = function(event) {
            const db = event.target.result;

            // Abrir la transacción para escribir los datos
            const transaction = db.transaction('animeUrls', 'readwrite');
            const objectStore = transaction.objectStore('animeUrls');

            // Agregar el nuevo URL al almacén de objetos
            const addRequest = objectStore.add({ url: newUrl });

            // Manejar errores en la adición del nuevo URL
            addRequest.onerror = function(event) {
                console.error('Error al agregar el URL:', event.target.error);
            };
        };

        setNewUrl('');
    };

    const handleDeleteUrl = (index) => {
        const newUrls = animeUrls.filter((_, i) => i !== index);
        setAnimeUrls(newUrls);

        // Abrir la base de datos para eliminar el URL
        const request = indexedDB.open('AnimeCalendarDB', 1);

        request.onsuccess = function(event) {
            const db = event.target.result;

            // Abrir la transacción para eliminar los datos
            const transaction = db.transaction('animeUrls', 'readwrite');
            const objectStore = transaction.objectStore('animeUrls');

            // Eliminar el URL del almacén de objetos
            const deleteRequest = objectStore.delete(index + 1);

            // Manejar errores en la eliminación del URL
            deleteRequest.onerror = function(event) {
                console.error('Error al eliminar el URL:', event.target.error);
            };
        };
    };
    
    return (
        <div className='pb-4 flex flex-col items-center w-full'>
            <h1 className='p-4 font-semibold text-xl'>Anime Calendar</h1>
            <div className='mb-4'>
                <input
                className='rounded bg-slate-700 text-white'
                type="text"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="Enter anime URL"
                />
                <button className='ml-4 px-2 rounded hover:scale-110 duration-300 bg-green-400 bg-opacity-60' onClick={handleAddUrl}>Add</button>
            </div>
            <div className="flex w-3/4 flex-wrap items-center justify-evenly">
                {animeUrls.map((url, index) => (
                <div key={index} className="p-4 rounded-lg border font-semibold border-gray-200 mb-4">
                    {/* Aquí puedes mostrar la card utilizando el URL */}
                    <img className='rounded' src={url} alt={`Anime ${index}`} />
                    <h2 className='py-2'>Nombre del Anime</h2>
                    <div>
                        <button className='bg-red-400 bg-opacity-50 p-1 rounded duration-300 hover:scale-110' onClick={() => handleDeleteUrl(index)}>Eliminar</button>
                        <button className='bg-blue-400 bg-opacity-50 ml-4 py-1 px-2 rounded duration-300 hover:scale-125'><a href={url}>Ir</a></button>
                    </div>
                </div>
                ))}
            </div>
        </div>
    )
}

export default Card;