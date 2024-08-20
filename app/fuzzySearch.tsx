"use client";

import React, { useEffect, useState } from 'react';
import Fuse from 'fuse.js';
import Image from 'next/image';
import playerData from './playerIds_updated.json'; // Assuming your JSON file is named `playerIds_updated.json`

// Default fallback image URL
const fallbackImage = "/NFL.svg";

type Player = {
    player_id: string;
    full_name: string;
    team: string | null;
    position: string;
    status: string;
    espn_id: string;
    gsis_id: string;
    headshot?: string;
};

interface FuzzySearchProps {
    onPlayerSelect: (player: Player) => void;
}

const FuzzySearch: React.FC<FuzzySearchProps> = ({ onPlayerSelect }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Player[]>([]);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

    const options = {
        keys: ['full_name', 'team', 'position'],
        threshold: 0.3,
        includeScore: true,
        minMatchCharLength: 2,
    };

    // Convert the player data object into an array of players
    const playersArray = Object.values(playerData) as Player[];

    const fuse = new Fuse<Player>(playersArray, options);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setQuery(input);

        if (input.length > 1) {
            const result = fuse.search(input) as { item: Player }[];
            setResults(result.map(res => res.item).filter((player: Player) => player.status === "Active"));
        } else {
            setResults([]);
        }
    };

    const handleSelect = (player: Player) => {
        setQuery(player.full_name);
        setSelectedPlayer(player);
        setResults([]);
        onPlayerSelect(player);
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
                                {player.espn_id !== null ? (
                                    <Image
                                        src={`https://a.espncdn.com/i/headshots/nfl/players/full/${player.espn_id}.png`}
                                        alt={player.full_name}
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
                                <div className="ml-2">
                                    <strong>{player.full_name}</strong> - {player.team ?? 'Free Agent'} ({player.position})
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FuzzySearch;