import React, { useState, useEffect } from 'react';
// import SideBarPlayers from '../ui/SideBarPlayers'
import { Table, Button, Container, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup } from 'reactstrap';
import { db } from "../firebase/firebase-config";
import { Badge } from 'react-bootstrap';

//import { startListPlayers } from '../actions/players';
import playerIcon from '../assets/icons/player-icon.png'
import FaltasAsistencia from './FaltasAsistencia';

function PlayersComponent() {

    const [ players,setPlayers ] = useState([])

    const fetchPlayers = async() => {

        const response = db.collection('players').orderBy("demarcacion");

        const data = await response.get();

        data.forEach( doc => {

            const loadPlayer = {
                id: doc.id,
                nombre: doc.data().nombre,
                apellidos: doc.data().apellidos,
                apodo: doc.data().apodo,
                demarcacion: doc.data().demarcacion,
                fecha: doc.data().fecha,
            }

            //console.log(loadPlayer);
            setPlayers(players => [...players, loadPlayer]);
            
        })

    }

    //console.log(players)

    const handleNewPlayer = async () => {
        try {
            await db.collection("players").add(state.form);
        } catch (error) {
            console.log(error)
        }
        //setPlayers([]);
        fetchPlayers();
        setState({modalInsertar: false});

    }

    useEffect(() => {
        fetchPlayers();
    }, [ ])

    const initialState = {
        data: players,
        form: {
            id: '',
            nombre: '',
            apellidos: '',
            apodo: '',
            demarcacion: '',
            fecha: '',
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

    const mostrarModalEditar = (registro) => {
        setState({modalEditar: true, form: registro})
    }

    const ocultarModalEditar = () => {
        setState({modalEditar: false})
    }

    

    const handleEditPlayer = async (data) => {
        try {
            await db.collection("players").doc(data.id).update(state.form);
        } catch (error) {
            console.log(error)
        }
        
        setState({modalEditar: false});
    }

    // const players = startListPlayers();

    //console.log(players);

    return (
        <>
            <h6 className="block text-light bg-secondary p-2">Plantilla actual ({players.length})</h6>
            
            {/* <div>
                <SideBarPlayers />

            </div> */}
            <Container>

                <Button color="success" onClick={ mostrarModalInsertar }>Añadir nuevo jugador</Button>
                <br />
                <Table>
                    <thead><tr><th>Nombre</th><th>Apellidos</th><th>Demarcación</th></tr></thead>
                    <tbody>
                        {
                            players.map(( player ) => <tr key={player.id}><td>{ player.nombre }</td><td>{ player.apellidos }</td><td>{ player.demarcacion }</td><td><Button color="primary" onClick={ () => mostrarModalEditar(player) }>Detalles</Button> <Button color="danger">Eliminar</Button></td></tr>)
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
                        <label>Nombre:</label>
                        <input className="form-control" name="nombre" type="text" onChange={ handleChangeAdd } />
                    </FormGroup>

                    <FormGroup>
                        <label>Apellidos:</label>
                        <input className="form-control" name="apellidos" type="text" onChange={ handleChangeAdd } />
                    </FormGroup>

                    <FormGroup>
                        <label>Apodo:</label>
                        <input className="form-control" name="apodo" type="text" onChange={ handleChangeAdd } />
                    </FormGroup>

                    <FormGroup>
                        <label>Demarcacion:</label>
                        <input className="form-control" name="demarcacion" type="text" onChange={ handleChangeAdd } />
                    </FormGroup>

                    <FormGroup>
                        <label>Fecha nacimiento:</label>
                        <input className="form-control" name="fecha" type="text" onChange={ handleChangeAdd } />
                    </FormGroup>

                </ModalBody>

                <ModalFooter>
                    <Button color="primary" onClick={ handleNewPlayer }>Insertar</Button>
                    <Button color="danger" onClick={ ocultarModalInsertar }>Cancelar</Button>  
                </ModalFooter>
            </Modal>

            <Modal isOpen={state.modalEditar}>
                <ModalHeader>
                        <div className="row">
                            <div className="col-2"><img src={playerIcon} width="64" alt={state.form?.apodo} /></div>
                            <div className="col-10">
                                <div className="row"
                                    ><h2>Detalles / Editar registro</h2>
                                </div>
                                <div className="row">
                                    <div>
                                        <h6><Badge bg="danger"><FaltasAsistencia id={state.form?.id} /></Badge></h6>
                                        
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
                        <label>Nombre:</label>
                        <input className="form-control" name="nombre" type="text" onChange={ handleChangeEdit } value={state.form?.nombre || ''} />
                    </FormGroup>

                    <FormGroup>
                        <label>Apellidos:</label>
                        <input className="form-control" name="apellidos" type="text" onChange={ handleChangeEdit } value={state.form?.apellidos || ''} />
                    </FormGroup>

                    <FormGroup>
                        <label>Apodo:</label>
                        <input className="form-control" name="apodo" type="text" onChange={ handleChangeEdit } value={state.form?.apodo || ''} />
                    </FormGroup>

                    <FormGroup>
                        <label>Demarcacion:</label>
                        <input className="form-control" name="demarcacion" type="text" onChange={ handleChangeEdit } value={state.form?.demarcacion || ''} />
                    </FormGroup>

                    <FormGroup>
                        <label>Fecha nacimiento:</label>
                        <input className="form-control" name="fecha" type="text" onChange={ handleChangeEdit } value={state.form?.fecha || ''} />
                    </FormGroup>

                </ModalBody>

                <ModalFooter>
                    <Button color="primary" onClick={ () => handleEditPlayer(state.form) }>Actualizar</Button>
                    <Button color="danger" onClick={ ocultarModalEditar }>Cancelar</Button>  
                </ModalFooter>
            </Modal>
        </>
    )
}

export default PlayersComponent;
