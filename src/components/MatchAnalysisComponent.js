import React, { useState, useEffect } from 'react';
import { useTimer } from 'use-timer';
import { Table, Button, Container, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup } from 'reactstrap';
import { db } from "../firebase/firebase-config";
import { Badge } from 'react-bootstrap';

import matchIcon from '../assets/icons/ball-443.png'

function MatchAnalysisComponent() {

    const [ players,setPlayers ] = useState([]);

    const fetchPlayers = async() => {

        const response = db.collection('players').orderBy("demarcacion");

        const data = await response.get();

        data.forEach( doc => {

            const loadPlayer = {
                id: doc.id,
                apodo: doc.data().apodo,
                convocado: true,
            }

            setPlayers(players => [...players, loadPlayer]);

        })
    }

    useEffect(() => {
        fetchAnalysis();
    }, [])

    const [ analysis,setAnalysis ] = useState([])

    const fetchAnalysis = async() => {

        const response = db.collection('analysis').orderBy("fecha");

        const data = await response.get();

        data.forEach( doc => {

            const loadAnalysis = {
                id: doc.id,
                nombre: doc.data().nombre,
                fecha: doc.data().fecha,
                equipo: doc.data().equipo,
                rival: doc.data().rival,
                campo: doc.data().campo,
                tipo: doc.data().tipo,
                convocados: doc.data().convocados,
                eventos: doc.data().evento,
            }

            //console.log(loadMatch);
            setAnalysis(analysis => [...analysis, loadAnalysis]);

        })

    }

    useEffect(() => {
        fetchAnalysis();
    }, [])








    const { time, start, pause, reset, status } = useTimer();
    
    return (
        <>
            <h1>Match analysis</h1>
        </>
    )
}

export default MatchAnalysisComponent;
