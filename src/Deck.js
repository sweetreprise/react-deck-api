import React, { useState, useRef, useEffect } from 'react';
import Card from './Card';
import axios from 'axios';
import './Deck.css'

const BASE_URL = 'https://deckofcardsapi.com/api/deck'

const Deck = () => {
    const [deck, setDeck] = useState(null);
    const [drawn, setDrawn] = useState([]);
    const [autoDraw, setAutoDraw] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        async function getData() {
            const result = await axios.get(`${BASE_URL}/new/shuffle/?deck_count=1`);
            setDeck(result.data);
        }
        getData();
    }, [setDeck]);

    useEffect(() => {
        async function getCard() {
            let { deck_id } = deck;

            try {
                let drawResult = await axios.get(`${BASE_URL}/${deck_id}/draw/?count=1`);

                if(!drawResult.data.success === true) {
                    setAutoDraw(false);
                    throw new Error("no cards remaining!");
                };

                const card = drawResult.data.cards[0];

                setDrawn(deckArray => [
                    ...deckArray,
                    {
                        id: card.code,
                        name: card.suit + " " + card.value,
                        image: card.image
                    }
                ]);
            } catch(error) {
                alert(error)
            }
        }

        if (autoDraw && !timerRef.current) {
            timerRef.current = setInterval(async() => {
                await getCard();
            }, 1000);
        }

        return () => {
            clearInterval(timerRef.current);
            timerRef.current = null;
        };
    }, [autoDraw, setAutoDraw, deck]);

    const toggleAutoDraw = () => {
        setAutoDraw(auto => !auto);
      };

    // async function getCard() {
    //     let { deck_id } = deck;

    //     try {
    //         let drawResult = await axios.get(`${BASE_URL}/${deck_id}/draw/?count=1`);

    //         if(!drawResult.data.success === true) {
    //             throw new Error("no cards remaining!")
    //         }

    //         const card = drawResult.data.cards[0];

    //         setDrawn(deckArray => [
    //             ...deckArray,
    //             {
    //                 id: card.code,
    //                 name: card.suit + " " + card.value,
    //                 image: card.image
    //             }
    //         ]);
    //     } catch(error) {
    //         alert(error)
    //     }
    // }

    const cards = drawn.map(card => (
        <Card key={card.id} name={card.name} image={card.image} />
    ));


    return (
        <div className='container'>
            {deck ? (
            <button onClick={toggleAutoDraw}>
            {autoDraw ? "STOP" : "KEEP"} DRAWING FOR ME!
            </button>
        ) : null}
            <div className='deck'>
                {cards}
            </div>
        </div>
    )
}

export default Deck;