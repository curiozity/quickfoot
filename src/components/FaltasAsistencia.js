import React, { useState, useEffect } from 'react';
import { db } from "../firebase/firebase-config";

function FaltasAsistencia(props) {

    const [faltas, setFaltas] = useState(0)

    const fetchFaltas = async(id) => {

        try {
            const response = db.collection("trainings");
            // const response = db.collection("trainings").where("hora", "==", "10:00");
            const data = await response.get();

            console.log('Buscando...', id)

            data.forEach( doc => {

                // setfaltas([...faltas, doc.data()]);

                // console.log("Data: ", doc.data().asistentes)

                doc.data().asistentes.map( (asistencia) => {
                    if (asistencia.id === id && !asistencia.entrena) {
                        setFaltas(faltas => faltas + 1)
                    }

                }) 

                // console.log("Faltas: ", faltas);
            
            })
        } catch (e) {
            console.log("Error:", e)
        }

    }

    useEffect(() => {
        fetchFaltas(props.id);
    }, [ ])
    
    return (
        <>
            Faltas: {faltas}
        </>
    )
}

export default FaltasAsistencia
