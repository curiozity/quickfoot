import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup } from 'reactstrap';
import { Badge } from 'react-bootstrap';
import Select from 'react-select';

import { db } from "../firebase/firebase-config";
import teamIcon from '../assets/icons/team-5703.png'

function TeamsComponent() {

    const [clubsOptions, setClubsOptions] = useState([]); // For select options and values

    const fetchClubs = async() => {

        const response = db.collection('clubs').orderBy("nombre");

        const data = await response.get();

        data.forEach( doc => {

            const loadOption = {
                value: doc.id,
                label: doc.data().nombre,
                field: 'club',
            }

            setClubsOptions(clubsOptions => [...clubsOptions, loadOption]);
            
        })

    }

    useEffect(() => {
        fetchClubs();
    }, [])

    const [catOptions, setCatOptions] = useState([]); // For select options and values

    const fetchCats = async() => {

        const response = db.collection('categorias').orderBy("categoria");

        const data = await response.get();

        data.forEach( doc => {

            const loadOption = {
                value: doc.data().categoria,
                label: doc.data().categoria,
                field: 'categoria',
            }

            setCatOptions(catOptions => [...catOptions, loadOption]);
            
        })

    }

    useEffect(() => {
        fetchCats();
    }, [])

    const [ teams,setTeams ] = useState([]);

    const fetchTeams = async() => {

        const response = db.collection('teams').orderBy("id");

        const data = await response.get();

        data.forEach( doc => {

            const loadTeam = {
                id: doc.id,
                nombre: doc.data().nombre,
                club: doc.data().club,
                categoria: doc.data().categoria,
                competicion: doc.data().competicion,
                entrenador: doc.data().entrenador,
                segundo: doc.data().segundo,
                preparador: doc.data().preparador,
                analista: doc.data().analista,
            }

            //console.log(loadMatch);
            setTeams(teams => [...teams, loadTeam]);
            
        })

    }

    useEffect(() => {
        fetchTeams();
    }, [ ])


    const initialState = {
        modalInsertar: false,
        modalEditar: false,
    }

    const [state, setState] = useState(initialState);

    const initialFormState = {
        data: teams,
        form: {
            id: '',
            nombre: '',
            club: '',
            categoria: '',
            competicion: '',
            entrenador: '',
            segundo: '',
            preparador: '',
            analista: '',
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

    const handleNewTeam = async () => {
        try {
            await db.collection("teams").add(formState.form);
        } catch (error) {
            console.log(error)
        }

        fetchTeams();

        setState({
            modalInsertar: false,
        });

    }

    // const [clubState, setClubState] = useState({
    //     selectedOption: null
    // })

    const handleSelectChange = (selected) => {
        setFormState({
            form:{
                ...formState.form,
                [selected.field]: selected.value,
            },
        })

        console.log("Selected field", selected.field)
    }

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

    const handleEditTeam = async (data) => {
        try {
            await db.collection("teams").doc(data.id).update(formState.form);
        } catch (error) {
            console.log(error)
        }
        
        setTeams([]);
        fetchTeams();

        setState({
            modalEditar: false,
        });
        
    }

    //// FIN DE FUNCIONES PARA EDITAR

    // COMIENZO DE FUNCIONES PARA BORRAR

    const handleDeleteTeam = async ( id ) => {
        try {
            await db.collection("teams").doc(id).delete();
            setTeams([]);
            fetchTeams();
        } catch (error) {
            console.log(error)
        }
    }

    // FIN DE FUNCIONES PARA BORRAR

    // FIN DE FUNCIONES CRUD

    // COMIENZO DE RENDERIZACION

    return (
        <>
            <h6 className="block text-light bg-secondary p-2">Equipos ({ teams.length })</h6>
            
            <Container>

                <Button color="success" onClick={ mostrarModalInsertar }>Añadir nuevo equipo</Button>
                <br />
                <Table>
                    <thead><tr><th>Nombre</th><th>Categoría</th><th>Entrenador</th></tr></thead>
                    <tbody>
                        {
                            teams.map(( team ) => <tr key={team.id}><td>{ team.nombre }</td><td>{ team.categoria }</td><td>{ team.entrenador }</td><td><Button color="primary" onClick={ () => mostrarModalEditar(team) }>Detalles</Button> <Button color="danger" onClick={ () => handleDeleteTeam( team.id ) }>Eliminar</Button></td></tr>)
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
                        <label>Club:</label>
                        {/* <input className="form-control" name="club" type="text" onChange={ handleChangeAdd } /> */}
                        <Select
                            name="club"
                            options={clubsOptions}
                            className="basic-single"
                            classNamePrefix="select"
                            onChange={ handleSelectChange }
                        />
                    </FormGroup>

                    <FormGroup>
                        <label>Categoría:</label>
                        {/* <input className="form-control" name="categoria" type="text" onChange={ handleChangeAdd } /> */}
                        <Select
                            name="categoria"
                            options={catOptions}
                            className="basic-single"
                            classNamePrefix="select"
                            onChange={ handleSelectChange }
                        />
                    </FormGroup>

                    <FormGroup>
                        <label>Entrenador:</label>
                        <input className="form-control" name="entrenador" type="text" onChange={ handleChangeAdd } />
                    </FormGroup>

                    <FormGroup>
                        <label>Segundo entrenador:</label>
                        <input className="form-control" name="segundo" type="text" onChange={ handleChangeAdd } />
                    </FormGroup>

                    <FormGroup>
                        <label>Preparador físico:</label>
                        <input className="form-control" name="preparador" type="text" onChange={ handleChangeAdd } />
                    </FormGroup>

                    <FormGroup>
                        <label>Analista:</label>
                        <input className="form-control" name="analista" type="text" onChange={ handleChangeAdd } />
                    </FormGroup>

                </ModalBody>

                <ModalFooter>
                    <Button color="primary" onClick={ handleNewTeam }>Insertar</Button>
                    <Button color="danger" onClick={ ocultarModalInsertar }>Cancelar</Button>  
                </ModalFooter>
            </Modal>

            <Modal isOpen={state.modalEditar}>
                <ModalHeader>
                        <div className="row">
                            <div className="col-2"><img src={ teamIcon } width="64" alt="Partido" /></div>
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
                        <input className="form-control" name="id" type="text" readOnly value={ formState.form?.id || '' } />
                    </FormGroup>

                    <FormGroup>
                        <label>Nombre:</label>
                        <input className="form-control" name="nombre" type="text" onChange={ handleChangeEdit } value={ formState.form?.nombre || '' } />
                    </FormGroup>

                    <FormGroup>
                        <label>Club:</label>
                        <input className="form-control" name="club" type="text" onChange={ handleChangeEdit } value={ formState.form?.club || '' } />
                    </FormGroup>

                    <FormGroup>
                        <label>Categoría:</label>
                        {/* <input className="form-control" name="categoria" type="text" onChange={ handleChangeEdit } value={formState.form?.categoria || ''} /> */}
                        <Select
                            className="basic-single"
                            classNamePrefix="select"
                            name="categoria"
                            defaultValue={{label: formState.form?.categoria, value: formState.form?.categoria}}
                            options={catOptions}
                            onChange={ handleSelectChange }
                        />
                    </FormGroup>

                    <FormGroup>
                        <label>Entrenador:</label>
                        <input className="form-control" name="entrenador" type="text" onChange={ handleChangeEdit } value={ formState.form?.entrenador || '' } />
                    </FormGroup>

                    <FormGroup>
                        <label>Segundo entrenador:</label>
                        <input className="form-control" name="segundo" type="text" onChange={ handleChangeEdit } value={ formState.form?.segundo || '' } />
                    </FormGroup>

                    <FormGroup>
                        <label>Preparador físico:</label>
                        <input className="form-control" name="preparador" type="text" onChange={ handleChangeEdit } value={ formState.form?.preparador || '' } />
                    </FormGroup>

                    <FormGroup>
                        <label>Analista:</label>
                        <input className="form-control" name="analista" type="text" onChange={ handleChangeEdit } value={ formState.form?.analista || '' } />
                    </FormGroup>

                </ModalBody>

                <ModalFooter>
                    <Button color="primary" onClick={ () => handleEditTeam( formState.form ) }>Actualizar</Button>
                    <Button color="danger" onClick={ ocultarModalEditar }>Cancelar</Button>  
                </ModalFooter>
            </Modal>
        </>
    )
}

export default TeamsComponent;
