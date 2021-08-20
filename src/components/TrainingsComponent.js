import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup } from 'reactstrap';
//import { Badge } from 'react-bootstrap';
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'

import { db } from "../firebase/firebase-config";
import soccerShoe from '../assets/icons/soccer-shoe-467.png';
import YoutubeEmbed from './YoutubeEmbed';
//import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';
import { Badge } from 'react-bootstrap';

function TrainingsComponent() {

    // COMIENZO DE DECLARACIONES INICIALES PARA OBTENER DATOS DE LA BD

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

            setPlayers(players => [...players, loadPlayer]);
            
        })
    }

    useEffect(() => {
        fetchPlayers();
    }, [])

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

            setTrainings(trainings => [...trainings, loadTraining]);
            
        })
    }

    
    useEffect(() => {
        fetchTrainings();
    }, [ ])

    // DECLARACIÓN INICIAL DE LOS STATES

    const initialState = {
        modalInsertar: false,
        modalEditar: false,
    }

    const [state, setState] = useState(initialState);

    const initialFormState = {
        data: trainings,
        form: {
            id: '',
            fecha: '',
            hora: '',
            asistentes: [''],
            videos: ['ninguno'],
        },
    };

    const [formState, setFormState] = useState(initialFormState);

    /// FIN DE DECLARACIONES DE ARRAYS PARA OPTIONS

    const [videosState, setVideosState] = useState({videos: []});

    const handleChangeVideos = (videos) => {
        setVideosState({videos})
    }

    useEffect(() => {
        setFormState({
            form:{
                ...formState.form,
                videos: videosState.videos,
            },
        })
    }, [videosState])

    // DECLARACIÓN DEL MODAL

    const mostrarModalInsertar = () => {
        setState({modalInsertar: true})
    }

    const ocultarModalInsertar = () => {
        setState({modalInsertar: false})
    }

    const mostrarModalEditar = ( registro, indice ) => {
        setState({modalEditar: true});
        setFormState({form: registro});
        setPlayers(registro.asistentes);
    }

    const ocultarModalEditar = () => {
        setState({modalEditar: false})
    }

    // COMIENZO DE FUNCIONES PARA AGREGAR

    const handleNewTraining = async () => {
        try {
            await db.collection("trainings").add(formState.form);
        } catch (error) {
            console.log(error)
        }
        setTrainings([]);
        fetchTrainings();
        fetchPlayers();
        setState({modalInsertar: false});
    }
    
    const handleChangeAdd = (e) => {
        setFormState({
            form:{
                ...formState.form,
                [e.target.name]: e.target.value,
            },
        })
        setState({modalInsertar: true});
    }

    // COMIENZO DE FUNCIONES PARA EDITAR

    const handleChangeEdit = (e) => {
        setFormState({
            form:{
                ...formState.form,
                [e.target.name]: e.target.value,
            },
        })
        setState({modalEditar: true})
    }

    const handleEditTraining = async (data) => {
        try {
            await db.collection("trainings").doc(data.id).update(formState.form);
        } catch (error) {
            console.log(error)
        }

        setTrainings([]);
        fetchTrainings();
        
        setState({modalEditar: false});
    }

    const handleBadgeChange = ( index ) => {

        const playersAsisten = [...players];
                
        // const playersAsisten = [...players]; // copying the old datas array

        playersAsisten[index].entrena ? playersAsisten[index].entrena = false : playersAsisten[index].entrena = true;

        setPlayers(playersAsisten);

        setFormState({
            form:{
                ...formState.form,
                asistentes: players,
            },
        })
        setState({modalInsertar: true})
    }

    const handleBadgeChangeEdit = ( index ) => {

        const playersAsisten = [...players];

        console.log(playersAsisten);

        playersAsisten[index].entrena ? playersAsisten[index].entrena = false : playersAsisten[index].entrena = true;

        setPlayers(playersAsisten);

        setFormState({
            form:{
                ...formState.form,
                asistentes: players,
            },
        })
        setState({modalEditar: true})
    }

    const handleDeleteTraining = async ( id ) => {
        try {
            await db.collection("trainings").doc(id).delete();
            fetchTrainings();
        } catch (error) {
            console.log(error)
        }
    }

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

                    {/* <FormGroup>
                        <label>Vídeos:</label>                       
                        <input className="form-control" name="video" type="text" onChange={ handleAddingVideo } />
                        <Button color="primary" onClick={ handleAddVideo }>Añadir vídeo</Button>
                    </FormGroup>

                    {
                            videos.map(( video ) => <div className="d-inline-block ms-1 mt-1" key={video}><Badge bg="secondary">{video}</Badge></div> )
                    } */}

                    <FormGroup>
                        <label>Vídeos:</label>
                        <TagsInput
                            value={videosState.videos}
                            onChange={ handleChangeVideos }
                            inputValue={videosState.videos}
                            placeholder="Vídeos..."
                            // onChangeInput={::this.handleChangeInput}
                        />
                    </FormGroup>

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
                        <input className="form-control" name="id" type="text" readOnly value={formState.form?.id || ''} />
                    </FormGroup>

                    <FormGroup>
                        <label>Fecha:</label>
                        <input className="form-control" name="fecha" type="text" onChange={ handleChangeEdit } value={formState.form?.fecha || ''} />
                    </FormGroup>

                    <FormGroup>
                        <label>Hora:</label>
                        <input className="form-control" name="hora" type="text" onChange={ handleChangeEdit } value={formState.form?.hora || ''} />
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
                        <TagsInput
                            value={formState.form?.videos}
                            onChange={ handleChangeVideos }
                            placeholder="Vídeos..."
                        />
                    </FormGroup>

                </ModalBody>

                <ModalFooter>
                    <Button color="primary" onClick={ () => handleEditTraining(formState.form) }>Actualizar</Button>
                    <Button color="danger" onClick={ ocultarModalEditar }>Cancelar</Button>  
                </ModalFooter>

                {/* <div className="p-3">
                    <h3>Vídeos de la sesión</h3>
                    {videosAdd.map((video) => {
                        <YoutubeEmbed embedId={video} />
                    })}
                    
                </div> */}
            </Modal>

            

        </>
    )
}

export default TrainingsComponent
