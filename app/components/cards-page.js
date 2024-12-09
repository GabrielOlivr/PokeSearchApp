"use client";

import { useState, useEffect } from "react";
import db from "../_utils/firestore";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useUserAuth } from "../_utils/auth-context";

export default function CardsPage() {
  const { user } = useUserAuth();
  const [collectionData, setCollectionData] = useState([]);
  const SHINY_CHANCE = 0.25; // 25% shiny chance, this can be adjusted if needed 

  useEffect(() => {
    const fetchUsersCard = async () => {
      if (user) {
        try {
          const userCardsQuery = query(
            collection(db, "pokemon_inventory"),
            where("userId", "==", user.uid)
          );
          const querySnapShot = await getDocs(userCardsQuery);
          const cards = querySnapShot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCollectionData(cards);
        } catch (error) {
          console.error("Error fetching users cards: ", error);
        }
      }
    };
    fetchUsersCard();
  }, [user]);

  const drawCard = async () => {
    const id = Math.floor(Math.random() * 898) + 1;
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await response.json();

      // Determine if the card draw is shiny
      const isShiny = Math.random() < SHINY_CHANCE;
      const card = {
        name: data.name,
        sprite: isShiny ? data.sprites.front_shiny : data.sprites.front_default,
        shiny: isShiny,
        userId: user.uid,
      };

      // Save card to Firestore
      const docRef = await addDoc(collection(db, "pokemon_inventory"), card);
      setCollectionData([...collectionData, { id: docRef.id, ...card }]);
    } catch (error) {
      console.error("Failed to fetch or save Pokémon:", error);
    }
  };

  const removeCard = async (cardId) => {
    try {
      await deleteDoc(doc(db, "pokemon_inventory", cardId));
      setCollectionData(collectionData.filter((card) => card.id !== cardId));
    } catch (error) {
      console.error("Failed to remove Pokémon card:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-violet-800/80 flex flex-col items-center">
      <h1 className="text-2xl font-bold font-mono mb-4 text-center">
        Your Pokémon Collection
      </h1>
      <button
        onClick={drawCard}
        className="bg-purple-200 text-black font-mono px-4 py-2 rounded hover:bg-purple-400 mb-4"
      >
        Draw Pokémon Card
      </button>
      {collectionData.length === 0 ? (
        <div className="flex justify-center items-center">
            <p className="text-white font-mono text-center">
                You have no Pokémon cards yet.
            </p>
        </div>
  ) : (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {collectionData.map((pokemon) => (
        <div
          key={pokemon.id}
          className="border border-white bg-violet-950/75 rounded-lg p-4 text-center"
        >
          <h3 className="text-lg font-bold font-mono capitalize">
            {pokemon.name} {pokemon.shiny && "✨"}
          </h3>
          <img
            src={pokemon.sprite}
            alt={pokemon.name}
            className="mx-auto"
          />
          <button
            onClick={() => removeCard(pokemon.id)}
            className="bg-purple-200 text-black font-mono px-2 py-1 rounded hover:bg-purple-400 mt-2"
          >
            Remove Card
          </button>
        </div>
      ))}
    </div>
  )}
</div>
  );
}
