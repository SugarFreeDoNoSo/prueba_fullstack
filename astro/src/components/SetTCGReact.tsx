// src/components/SetTCGReact.js
import React, { useState } from 'react';
import type { ISet } from "./containerSets.astro";

const SetTCGReact = ({ set }: { set: ISet }) => {
    const [showMore, setShowMore] = useState(false);
    const [space, setSpace] = useState(1);
    const handleToggle = () => {
        const newSpace = showMore ? 1 : 2;
        setSpace(newSpace)
        setShowMore(!showMore);
    };

    return (
        <>
            {/* aqui el nuevo */}
            {showMore && (
                <div>
                    
                </div>
            )}

            
            <div id={`card-set-${set.id}`} className="  bg-white rounded-lg shadow-2xl overflow-hidden hover:shadow-lg transition-all duration-700 ease-in-out card-container">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <img src={set.symbolUrl} alt={`${set.name} symbol`} className="w-8 h-8" />
                        </div>
                        <img src={set.logoUrl} alt={`${set.name} logo`} className="w-full h-24 object-contain mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">{set.name}</h2>
                        <div className="space-y-2">
                            <p className="text-gray-600"><span className="font-semibold">Series:</span> {set.series}</p>
                            <p className="text-gray-600"><span className="font-semibold">Cards:</span> {set.printedTotal} / {set.total}</p>
                            <p className="text-gray-600"><span className="font-semibold">Release Date:</span> {new Date(set.releaseDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</p>
                        </div>
                        <button type="button" className="mt-4 w-full text-black py-2 px-4 rounded-md transition-colors duration-200" onClick={handleToggle}>
                            {showMore ? 'Ver menos' : 'Ver más'}
                        </button>


                    </div>
            </div>
        </>

    );
};

export default SetTCGReact;