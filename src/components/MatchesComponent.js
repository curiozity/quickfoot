import React, { useState, useEffect } from 'react';
// import SideBarPlayers from '../ui/SideBarPlayers'
import { Table, Button, Container, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup } from 'reactstrap';
import { db } from "../firebase/firebase-config";
import { Badge } from 'react-bootstrap';

//import { startListPlayers } from '../actions/players';
import matchIcon from '../assets/icons/ball-443.png'
import FaltasAsistencia from './FaltasAsistencia';


function MatchesComponent() {

    const [ matches,setMatches ] = useState([])

    const fetchMatches = async() => {

        const response = db.collection('matches').orderBy("fecha");

        const data = await response.get();

        data.forEach( doc => {

            const loadMatch = {
                id: doc.id,
                temporada: doc.data().temporada,
                fecha: doc.data().fecha,
                rival: doc.data().rival,
                campo: doc.data().campo,
                tipo: doc.data().tipo,
                convocados: doc.data().convocados,
                goles: doc.data().goles,
                tarjetas: doc.data().tarjetas,
                cambios: doc.data().cambios,
                arbitro: doc.data().arbitro,
            }

            //console.log(loadMatch);
            setMatches(matches => [...matches, loadMatch]);
            
        })

    }


    useEffect(() => {
        fetchMatches();
    }, [ ])


    const initialState = {
        modalInsertar: false,
        modalEditar: false,
    }

    const [state, setState] = useState(initialState);

    const initialFormState = {
        data: matches,
        form: {
            id: '',
            temporada: '',
            fecha: '',
            rival: {},
            campo: '',
            tipo: [],
            convocados: [],
            goles: [],
            tarjetas: [],
            cambios: [],
            arbitro: [],
        },
    };

    const [formState, setFormState] = useState(initialFormState);

    // FIN DE DECLARACIONES INICIALES Y CARGA INICIAL

    // COMIENZO DE CONFIGURACION DE MODAL

    const mostrarModalInsertar = () => {
        setState({modalInsertar: true})
    }

    const ocultarModalInsertar = () => {
        setState({modalInsertar: false})
    }

    const mostrarModalEditar = (registro) => {
        setState({modalEditar: true})
        setFormState({form: registro})
    }

    const ocultarModalEditar = () => {
        setState({modalEditar: false})
    }

    // FIN DE CONFIGURACION DE MODAL

    // COMIENZO DE FUNCIONES CRUD

    //// COMIENZO DE FUNCIONES PARA AGREGAR

    const handleChangeAdd = (e) => {
        setFormState({
            form:{
                ...formState.form,
                [e.target.name]: e.target.value,
            },
        })

        setState({
            modalInsertar: true,
        });
    }

    const handleNewMatch = async () => {
        try {
            await db.collection("matches").add(formState.form);
        } catch (error) {
            console.log(error)
        }

        fetchMatches();

        setState({
            modalInsertar: false,
        });

    }

    //// FIN DE FUNCIONES PARA AGREGAR

    //// COMIENZO DE FUNCIONES PARA EDITAR

    const handleChangeEdit = (e) => {
        setFormState({
            form:{
                ...formState.form,
                [e.target.name]: e.target.value,
            },
        })

        setState({
            modalEditar: true,
        })
    }

    const handleEditMatch = async (data) => {
        try {
            await db.collection("matches").doc(data.id).update(formState.form);
        } catch (error) {
            console.log(error)
        }
        
        setState({
            modalEditar: false,
        });
    }

    //// FIN DE FUNCIONES PARA EDITAR

    // FIN DE FUNCIONES CRUD

    // COMIENZO DE RENDERIZACION

    return (
        <>
            <h6 className="block text-light bg-secondary p-2">Partidos ({matches.length})</h6>
            
            <Container>

                <Button color="success" onClick={ mostrarModalInsertar }>Añadir nuevo partido</Button>
                <br />
                <Table>
                    <thead><tr><th>Fecha</th><th>Rival</th><th>Marcador</th></tr></thead>
                    <tbody>
                        {
                            matches.map(( match ) => <tr key={match.id}><td>{ match.fecha }</td><td>{ match.rival }</td><td>3-2</td><td><Button color="primary" onClick={ () => mostrarModalEditar(match) }>Detalles</Button> <Button color="danger">Eliminar</Button></td></tr>)
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
                        <label>Temporada:</label>
                        <input className="form-control" name="temporada" type="text" onChange={ handleChangeAdd } value="21/22" />
                    </FormGroup>

                    <FormGroup>
                        <label>Rival:</label>
                        <input className="form-control" name="rival" type="text" onChange={ handleChangeAdd } />
                    </FormGroup>

                    <FormGroup>
                        <label>Campo:</label>
                        <input className="form-control" name="campo" type="text" onChange={ handleChangeAdd } />
                    </FormGroup>

                    <FormGroup>
                        <label>Tipo:</label>
                        <input className="form-control" name="tipo" type="text" onChange={ handleChangeAdd } />
                    </FormGroup>

                    <FormGroup>
                        <label>Convocados:</label>
                        <input className="form-control" name="convocados" type="text" onChange={ handleChangeAdd } />
                    </FormGroup>

                    <FormGroup>
                        <label>Goles:</label>
                        <input className="form-control" name="goles" type="text" onChange={ handleChangeAdd } />
                    </FormGroup>

                    <FormGroup>
                        <label>Tarjetas:</label>
                        <input className="form-control" name="tarjetas" type="text" onChange={ handleChangeAdd } />
                    </FormGroup>

                    <FormGroup>
                        <label>Cambios:</label>
                        <input className="form-control" name="cambios" type="text" onChange={ handleChangeAdd } />
                    </FormGroup>

                    <FormGroup>
                        <label>Árbitro:</label>
                        <input className="form-control" name="arbitro" type="text" onChange={ handleChangeAdd } />
                    </FormGroup>

                </ModalBody>

                <ModalFooter>
                    <Button color="primary" onClick={ handleNewMatch }>Insertar</Button>
                    <Button color="danger" onClick={ ocultarModalInsertar }>Cancelar</Button>  
                </ModalFooter>
            </Modal>

            <Modal isOpen={state.modalEditar}>
                <ModalHeader>
                        <div className="row">
                            <div className="col-2"><img src={matchIcon} width="64" alt="Partido" /></div>
                            <div className="col-10">
                                <div className="row"
                                    ><h2>Detalles / Editar registro</h2>
                                </div>
                                <div className="row">
                                    <div>
                                        <h6><Badge bg="danger">Badge</Badge></h6>
                                        
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                        
                </ModalHeader>

                <ModalBody>

                    <FormGroup>
                        <label>Id:</label>
                        <input className="form-control" name="id" type="text" readOnly value={state.form?.id || ''} />
                    </FormGroup>

                    <FormGroup>
                        <label>Fecha:</label>
                        <input className="form-control" name="fecha" type="date" onChange={ handleChangeEdit } value={state.form?.fecha || ''} />
                    </FormGroup>

                    <FormGroup>
                        <label>Temporada:</label>
                        <input className="form-control" name="temporada" type="text" onChange={ handleChangeEdit } value={state.form?.temporada || ''} />
                    </FormGroup>

                    <FormGroup>
                        <label>Rival:</label>
                        <input className="form-control" name="rival" type="text" onChange={ handleChangeEdit } value={state.form?.rival || ''} />
                    </FormGroup>

                    <FormGroup>
                        <label>Campo:</label>
                        <input className="form-control" name="campo" type="text" onChange={ handleChangeEdit } value={state.form?.campo || ''} />
                    </FormGroup>

                    <FormGroup>
                        <label>Tipo:</label>
                        <input className="form-control" name="tipo" type="text" onChange={ handleChangeEdit } value={state.form?.tipo || ''} />
                    </FormGroup>

                </ModalBody>

                <ModalFooter>
                    <Button color="primary" onClick={ () => handleEditMatch(formState.form) }>Actualizar</Button>
                    <Button color="danger" onClick={ ocultarModalEditar }>Cancelar</Button>  
                </ModalFooter>
            </Modal>
        </>
    )
}

export default MatchesComponent;
