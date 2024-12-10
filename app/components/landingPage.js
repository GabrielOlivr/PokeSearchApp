"use client";
import React, { useState, useEffect } from "react";
import SearchBar from "./search-bar";
import { useUserAuth } from "../_utils/auth-context";
import CardsPage from "./cards-page";

export default function LandingPage() {
  const [pokemon, setPokemon] = useState(null); 
  const { gitHubSignIn, user, firebaseSignOut } = useUserAuth();
  const [userName, setUserName] = useState("");
  const [searchAttempted, setSearchAttempted] = useState(false); 

  const fetchPokemon = async (query) => {
    setSearchAttempted(true); 
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`
      );
      const data = await response.json();

      setPokemon({
        name: data.name,
        sprite: data.sprites.front_default,
        type: data.types.map((type) => type.type.name).join(", "),
        species: data.species.name,
        height: data.height,
        weight: data.weight,
        abilities: data.abilities.map((ability) => ability.ability.name).join(", "),
      });
    } catch {
      setPokemon(null);
    }
  };

  useEffect(() => {
    if (user) {
      setUserName(user.displayName || user.email);
    }
  }, [user]);

  const handleLogin = async () => {
    try {
      await gitHubSignIn();
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogOut = async () => {
    try {
      await firebaseSignOut();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="bg-[url('/img/pk.png')] bg-cover bg-center bg-no-repeat min-h-screen">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold font-mono flex items-center space-x-4">
            PokeSearch
          </h1>
          <div className="flex items-center space-x-4">
            {user && (
              <p className="text-sm text-white font-mono">Logged in as: {userName}</p>
            )}
            {!user ? (
              <button
                onClick={handleLogin}
                className="bg-violet-600 text-white px-4 py-2 rounded font-mono hover:bg-violet-400"
              >
                Login
              </button>
            ) : (
              <button
                onClick={handleLogOut}
                className="bg-violet-600 text-white px-4 py-2 rounded font-mono hover:bg-violet-400"
              >
                Logout
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center space-y-4">
            <div className="bg-violet-800/75 text-white p-4 rounded shadow-lg w-full max-w-lg">
                <h2 className="text-lg font-bold font-mono mb-2 flex justify-center">Welcome to PokeSearch!</h2>
                <ul className="list-disc pl-6 space-y-2 text-sm font-mono">
                    <li>
                        Use the search bar below to browse Pokémon and view their detailed stats.
                    </li>
                    <li>
                        <strong>Log in</strong> to start collecting Pokémon cards and build your collection!
                    </li>
                    <li>
                        When you draw a card, there is a <strong>25% chance</strong> of receiving a shiny card!
                        Keep trying to build your ultimate shiny collection.
                    </li>
                </ul>
            </div>
          <SearchBar onSearch={fetchPokemon} />
          {searchAttempted && pokemon === null && (
            <p className="text-red-500 font-mono mr-24">Pokémon not found.</p>
          )}
          {pokemon && (
            <div className="flex justify-center items-center mt-8">
              <div className="bg-white/75 text-black p-4 rounded shadow-lg w-full max-w-md">
                <h2 className="flex justify-center items-center text-xl font-bold font-mono mb-4">
                  {pokemon.name.toUpperCase()}
                </h2>
                <img
                  src={pokemon.sprite}
                  alt={pokemon.name}
                  className="mx-auto mb-2"
                />
                <p>
                  <strong className="font-mono text-lg">Type:</strong> {pokemon.type}
                </p>
                <p>
                  <strong className="font-mono text-lg">Species:</strong> {pokemon.species}
                </p>
                <p>
                  <strong className="font-mono text-lg">Height:</strong> {pokemon.height}
                </p>
                <p>
                  <strong className="font-mono text-lg">Weight:</strong> {pokemon.weight}
                </p>
                <p>
                  <strong className="font-mono text-lg">Abilities:</strong> {pokemon.abilities}
                </p>
              </div>
            </div>
          )}
          {user && (
            <CardsPage />
          )}
        </div>
      </div>
    </main>
  );
}
