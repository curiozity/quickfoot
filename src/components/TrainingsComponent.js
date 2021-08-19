import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup } from 'reactstrap';
//import { Badge } from 'react-bootstrap';
import { db } from "../firebase/firebase-config";
import soccerShoe from '../assets/icons/soccer-shoe-467.png';
import YoutubeEmbed from './YoutubeEmbed';
//import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';
import { Badge } from 'react-bootstrap';

function TrainingsComponent() {



    const [ players,setPlayers ] = useState([]);

    const fetchPlayers = async() => {

        const response = db.collection('players').orderBy("demarcacion");

        const data = await response.get();

        data.forEach( doc => {

            const loadPlayer = {
                id: doc.id,
                apodo: doc.data().apodo,
                entrena: false,
            }

            //console.log(loadPlayer);
            setPlayers(players => [...players, loadPlayer]);
            
        })

    }

    useEffect(() => {
        fetchPlayers();
    }, [ ])

    const [ trainings,setTrainings ] = useState([]);

    const fetchTrainings = async() => {

        const response = db.collection('trainings').orderBy("fecha");

        const data = await response.get();

        data.forEach( doc => {

            const loadTraining = {
                id: doc.id,
                fecha: doc.data().fecha,
                hora: doc.data().hora,
                asistentes: doc.data().asistentes,
                videos: doc.data().videos,
            }

            //console.log(loadTraining);
            setTrainings(trainings => [...trainings, loadTraining]);
            
        })

    }

    const handleNewTraining = async () => {
        try {
            await db.collection("trainings").add(state.form);
        } catch (error) {
            console.log(error)
        }
        setTrainings([]);
        fetchTrainings();
        fetchPlayers();
        setState({modalInsertar: false});

    }

    useEffect(() => {
        fetchTrainings();
    }, [ ])

    const initialState = {
        data: trainings,
        form: {
            id: '',
            fecha: '',
            hora: '',
            asistentes: [''],
            videos: ['ninguno'],
        },
        modalInsertar: false,
        modalEditar: false,
    };

    const [state, setState] = useState(initialState);

    const handleChangeAdd = (e) => {
        setState({
            form:{
                ...state.form,
                [e.target.name]: e.target.value,
            },
            modalInsertar: true,
        })
    }

    const handleChangeEdit = (e) => {
        setState({
            form:{
                ...state.form,
                [e.target.name]: e.target.value,
            },
            modalEditar: true,
        })
    }

    const mostrarModalInsertar = () => {
        setState({modalInsertar: true})
    }

    const ocultarModalInsertar = () => {
        setState({modalInsertar: false})
    }

    const [videosAdd, setVideosAdd] = useState([])

    const mostrarModalEditar = ( registro, indice ) => {
        setState({modalEditar: true, form: registro});
        setPlayers(registro.asistentes);
        setVideosAdd(trainings[indice].videos)
    }

    const ocultarModalEditar = () => {
        setState({modalEditar: false})
    }

    const handleEditTraining = async (data) => {
        try {
            await db.collection("trainings").doc(data.id).update(state.form);
        } catch (error) {
            console.log(error)
        }
        
        setState({modalEditar: false});
    }

    const handleBadgeChange = ( index ) => {

        const playersAsisten = [...players];
                
        // const playersAsisten = [...players]; // copying the old datas array

        playersAsisten[index].entrena ? playersAsisten[index].entrena = false : playersAsisten[index].entrena = true;

        setPlayers(playersAsisten);

        setState({
            form:{
                ...state.form,
                asistentes: players,
            },
            modalInsertar: true,
        })

        console.log(players)
    }

    const handleBadgeChangeEdit = ( index ) => {

        const playersAsisten = [...players];

        console.log(playersAsisten);

        playersAsisten[index].entrena ? playersAsisten[index].entrena = false : playersAsisten[index].entrena = true;

        setPlayers(playersAsisten);

        setState({
            form:{
                ...state.form,
                asistentes: players,
            },
            modalEditar: true,
        })

        //console.log(players)
    }

    const handleDeleteTraining = async ( id ) => {
        try {
            await db.collection("trainings").doc(id).delete();
            fetchTrainings();
        } catch (error) {
            console.log(error)
        }
    }

    const [videos, setVideos] = useState([]);

    const [vtext, setVtext] = useState("");

    const handleAddingVideo = (e) => {
        setVtext(e.target.value);
        console.log(vtext);
    }

    const handleAddVideo = (e) => {

        console.log("vtext", vtext);

        console.log("Videos antes", videos)

        setVideos( videos => [...videos, vtext] );

        console.log("Videos antes", videos)

        // console.log("State:", state.form.videos);

        console.log("Videos despues", videos);
    }

    useEffect(() => {
        let estado = false;
        if (videos.length > 0) {
            estado = true
        } else {
            estado = false;
        }
        // Utilizo la variable estado para saber si está insertando ya que al usar el setState se borra el estado del modalInsertar
        
        setState({
            form:{
                ...state.form,
                videos: videos,
            },
            modalInsertar: estado,
        })
    }, [videos])

    return (
        <>
            <h6 className="block text-light bg-secondary p-2">Sesiones de entrenamiento ({trainings.length})</h6>

            <Container>

                <Button color="success" onClick={ mostrarModalInsertar }>Añadir nueva sesión</Button>
                <br />
                <Table>
                    <thead><tr><th>Fecha</th><th>Hora</th><th>Asistentes</th></tr></thead>
                    <tbody>
                        {
                            trainings.map(( training, indice ) => <tr key={training.id}><td>{ training.fecha }</td><td>{ training.hora }</td><td>Ver detalle</td><td><Button color="primary" onClick={ () => mostrarModalEditar(training, indice) }>Detalles</Button> <Button color="danger" onClick={ () => handleDeleteTraining( training.id ) }>Eliminar</Button></td></tr>)
                        }
                    </tbody>
                </Table>

            </Container>

            <Modal isOpen={state.modalInsertar}>
                <ModalHeader>
                        <div>
                            <h1>Insertar registro</h1>
                        </div>
                </ModalHeader>

                <ModalBody>

                    <FormGroup>
                        <label>Fecha:</label>
                        <input className="form-control" name="fecha" type="date" onChange={ handleChangeAdd } />
                    </FormGroup>

                    <FormGroup>
                        <label>Hora:</label>
                        <input className="form-control" name="hora" type="text" onChange={ handleChangeAdd } />
                    </FormGroup>
                    
                    <FormGroup>
                        <label>Asistentes:</label>                       
                        {/* <input className="form-control" name="asistentes" type="text" onChange={ handleChangeAdd } /> */}
                    </FormGroup>

                    {
                            players.map(( player, index ) => <div className="d-inline-block ms-1 mt-1" key={player.id}><Button color={ player.entrena ? "success": "secondary"} size="sm" onClick={ () => handleBadgeChange(index) }>{ player.apodo }</Button></div> )
                    }

                    <FormGroup>
                        <label>Vídeos:</label>                       
                        <input className="form-control" name="video" type="text" onChange={ handleAddingVideo } />
                        <Button color="primary" onClick={ handleAddVideo }>Añadir vídeo</Button>
                    </FormGroup>

                    {
                            videos.map(( video ) => <div className="d-inline-block ms-1 mt-1" key={video}><Badge bg="secondary">{video}</Badge></div> )
                    }

                </ModalBody>

                <ModalFooter>
                    <Button color="primary" onClick={ handleNewTraining }>Insertar</Button>
                    <Button color="danger" onClick={ ocultarModalInsertar }>Cancelar</Button>  
                </ModalFooter>
            </Modal>

            <Modal isOpen={state.modalEditar}>
                <ModalHeader>
                        <div className="row">
                            <div className="col-2"><img src={soccerShoe} width="64" alt="Soccer Shoe"/></div>
                            <div className="col-10"><h2 className="mt-3">Detalles / Editar registro</h2></div>
                            <div></div>
                        </div>
                </ModalHeader>

                <ModalBody>

                    <FormGroup>
                        <label>Id:</label>
                        <input className="form-control" name="id" type="text" readOnly value={state.form?.id || ''} />
                    </FormGroup>

                    <FormGroup>
                        <label>Fecha:</label>
                        <input className="form-control" name="fecha" type="text" onChange={ handleChangeEdit } value={state.form?.fecha || ''} />
                    </FormGroup>

                    <FormGroup>
                        <label>Hora:</label>
                        <input className="form-control" name="hora" type="text" onChange={ handleChangeEdit } value={state.form?.hora || ''} />
                    </FormGroup>

                    <FormGroup>
                        <label>Asistentes:</label>
                        {/* <input className="form-control" name="asistentes" type="text" onChange={ handleChangeEdit } value={state.form?.asistentes || ''} /> */}
                    </FormGroup>

                    {
                            players.map(( player, index ) => <div className="d-inline-block ms-1 mt-1" key={ player.id }><Button color={ player.entrena ? "success": "secondary"} size="sm" onClick={ () => handleBadgeChangeEdit(index) }>{ player.apodo }</Button></div> )
                    }

                    <FormGroup>
                        <label>Vídeos:</label>                       
                        {/* <input className="form-control" name="video" type="text" onChange={ handleAddingVideo } />
                        <Button color="primary" onClick={ handleAddVideo }>Añadir vídeo</Button> */}
                    </FormGroup>

                    {
                            videosAdd.map(( video ) => <div className="d-inline-block ms-1 mt-1" key={video}><Badge bg="secondary">{video}</Badge></div> )
                    }

                </ModalBody>

                <ModalFooter>
                    <Button color="primary" onClick={ () => handleEditTraining(state.form) }>Actualizar</Button>
                    <Button color="danger" onClick={ ocultarModalEditar }>Cancelar</Button>  
                </ModalFooter>

                <div className="p-3">
                    <h3>Vídeo de la sesión</h3>
                    <YoutubeEmbed embedId="lWpBj66L7Z8" />
                </div>
            </Modal>

            

        </>
    )
}

export default TrainingsComponent
