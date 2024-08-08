"use client";

import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import Image from 'next/image';
import playerData from '../lib/sleeper/players_id_mapping.json'

// Default fallback image URL
const fallbackImage = "/NFL.svg";

const FuzzySearch = () => {
    type Player = {
        display_name: string;
        team_abbr: string;
        position: string;
        status: string;
        gsis_id: string;
        headshot?: string;
    };
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Player[]>([]);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null); // Specify type for selectedPlayer

    // Configure Fuse.js options
    const options = {
        keys: ['display_name', 'team_abbr', 'position'], // Adjust keys according to your data
        threshold: 0.3, // Controls fuzziness
        includeScore: true,
        minMatchCharLength: 2,
    };

    // Create Fuse instance
    const fuse = new Fuse<Player>(playerData as Player[], options); // Specify the type for Fuse

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setQuery(input);

        if (input.length > 1) {
            const result = fuse.search(input) as { item: Player }[]; // Cast result to the correct type
            setResults(result.map(res => res.item).filter((player: Player) => player.status === "ACT")); // Filter out retired players
        } else {
            setResults([]);
        }
    };

    // Handle player selection
    const handleSelect = (player: any) => {
        setQuery(player.display_name);
        setSelectedPlayer(player);
        setResults([]);
    };

    return (
        <div className="player-search">
            <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Search for a player..."
                className="p-2 border rounded"
            />

            {results.length > 0 && (
                <ul className="search-results bg-white border rounded mt-2 overflow-y-auto">
                    {results.slice(0, 5).map((player, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelect(player)}
                            className={`p-2 hover:bg-gray-100 cursor-pointer ${selectedPlayer?.gsis_id === player.gsis_id ? 'bg-green-200' : ''}`}
                        >
                            <div className="flex items-center">
                                {player.headshot ? (
                                    <Image
                                        src={player.headshot}
                                        alt={player.display_name}
                                        width={50}
                                        height={50}
                                    />
                                ) : (
                                    <Image
                                        src={fallbackImage}
                                        alt="Default player"
                                        width={50}
                                        height={50}
                                    />
                                )}
                                <div>
                                    <strong>{player.display_name}</strong> - {player.team_abbr} ({player.position})
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {selectedPlayer && (
                <div className="mt-4">
                    <p><strong>Selected Player:</strong> {selectedPlayer.display_name}</p>
                    <p><strong>GSIS ID:</strong> {selectedPlayer.gsis_id}</p>
                </div>
            )}
        </div>
    );
};

export default FuzzySearch;