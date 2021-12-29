import React, { useEffect } from 'react'
import { useState } from 'react';

const BrowseItems = () => {
    const [items, setItems] = useState([]);

    const getItems = async () => {
        try {
            const response = await fetch("http://localhost:4000/auth/items")
            const itemData = await response.json();
            setItems(itemData);
            for (var i = 0; i < itemData.length; i += 1) {
                console.log(itemData[i]); //Print all of the items to the console for debugging
            }
        } catch (err) {
            console.error(err.message)
        }
    };

    useEffect(() => {
        getItems();
    }, []);


    return (
        <div>
            Browse items list
            {items.map(item => (
                <div key={item.id}>
                    <h1>{item.itemname}</h1>
                    <p>{item.descr}</p>
                    <p>{item.giveaway}</p>
                    <p>{item.lendlength}</p>
                    <p>{item.photo}</p>
                    <p>{item.username}</p>
                </div>
            ))}
        </div>
    )
}

export default BrowseItems;