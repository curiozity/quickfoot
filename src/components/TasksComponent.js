import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup } from 'reactstrap';
import { Badge } from 'react-bootstrap';
import Select from 'react-select';

import { db } from "../firebase/firebase-config";
import tacticIcon from '../assets/icons/soccer-tactics-472.png'

function TasksComponent() {

    const [ tasks,setTasks ] = useState([]);

    const fetchTasks = async() => {

        const response = db.collection('tasks').orderBy("id");

        const data = await response.get();

        data.forEach( doc => {

            const loadTask = {
                id: doc.id,
                nombre: doc.data().nombre,
                objcondicional: doc.data().objcondicional,
                objjuego: doc.data().objjuego,
                objtactico: doc.data().objtactico,
                explicacion: doc.data().explicacion,
                pautas: doc.data().pautas,
                espacio: doc.data().espacio,
                variante: doc.data().variante,
                tiempo: doc.data().tiempo,
                repeticiones: doc.data().repeticiones,
                intervalo: doc.data().intervalo,
                imagenes: doc.data().imagenes,
            }

            setTasks(tasks => [...tasks, loadTask]);
            
        })

    }

    useEffect(() => {
        fetchTasks();
    }, [ ])


    const initialState = {
        modalInsertar: false,
        modalEditar: false,
    }

    const [state, setState] = useState(initialState);

    const initialFormState = {
        data: tasks,
        form: {
            id: '',
            nombre: '',
            objcondicional: '',
            objjuego: '',
            objtactico: '',
            explicacion: '',
            pautas: '',
            espacio: '',
            variante: '',
            tiempo: '',
            repeticiones: '',
            intervalo: '',
            imagenes: [],
        },
    };

    const [formState, setFormState] = useState(initialFormState);

    const [objtacOptions, setObjtacOptions] = useState([]);

    const fetchObjTac = async() => {

        const response = db.collection('objtacticos').orderBy("nombre");

        const data = await response.get();

        data.forEach( doc => {

            const loadOption = {
                value: doc.data().nombre,
                label: doc.data().nombre,
            }

            setObjtacOptions(objtacOptions => [...objtacOptions, loadOption]);
            
        })

    }

    useEffect(() => {
        fetchObjTac();
    }, [])

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

    const handleNewTask = async () => {
        try {
            await db.collection("tasks").add(formState.form);
        } catch (error) {
            console.log(error)
        }

        fetchTasks();

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

    const handleEditTask = async (data) => {
        try {
            await db.collection("tasks").doc(data.id).update(formState.form);
        } catch (error) {
            console.log(error)
        }
        
        setTasks([]);
        fetchTasks();

        setState({
            modalEditar: false,
        });
        
    }

    //// FIN DE FUNCIONES PARA EDITAR

    // COMIENZO DE FUNCIONES PARA BORRAR

    const handleDeleteTask = async ( id ) => {
        try {
            await db.collection("tasks").doc(id).delete();
            setTasks([]);
            fetchTasks();
        } catch (error) {
            console.log(error)
        }
    }

    // FIN DE FUNCIONES PARA BORRAR

    // FIN DE FUNCIONES CRUD

    // COMIENZO DE RENDERIZACION

    return (
        <>
            <h6 className="block text-light bg-secondary p-2">Tareas ({ tasks.length })</h6>
            
            <Container>

                <Button color="success" onClick={ mostrarModalInsertar }>Añadir nueva tarea</Button>
                <br />
                <Table>
                    <thead><tr><th>Título</th><th>Objetivo condicional</th><th>Objetivo juego</th><th>Objetivo táctico</th></tr></thead>
                    <tbody>
                        {
                            tasks.map(( task ) => <tr key={task.id}><td>{ task.titulo }</td><td>{ task.objcondicional }</td><td>{ task.objjuego }</td><td>{ task.objtactico }</td><td><Button color="primary" onClick={ () => mostrarModalEditar(task) }>Detalles</Button> <Button color="danger" onClick={ () => handleDeleteTask( task.id ) }>Eliminar</Button></td></tr>)
                        }
                    </tbody>
                </Table>


            </Container>

            <Modal isOpen={state.modalInsertar}>
                <ModalHeader>
                 <div className="row">
                            <div className="col-2"><img src={ tacticIcon } width="64" alt="Partido" /></div>
                            <div className="col-10">
                                <div className="row"
                                    ><h2>Añadir nueva tarea</h2>
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
                        <label>Título:</label>
                        <input className="form-control" name="titulo" type="text" onChange={ handleChangeAdd } />
                    </FormGroup>

                    <FormGroup>
                        <label>Objetivo condicional:</label>
                        <input className="form-control" name="objcondicional" type="text" onChange={ handleChangeAdd } />
                        {/* <Select
                            name="club"
                            options={clubsOptions}
                            className="basic-single"
                            classNamePrefix="select"
                            onChange={ handleSelectChange }
                        /> */}
                    </FormGroup>

                    <FormGroup>
                        <label>Objetivo juego:</label>
                        <input className="form-control" name="objjuego" type="text" onChange={ handleChangeAdd } />
                        {/* <Select
                            name="categoria"
                            options={catOptions}
                            className="basic-single"
                            classNamePrefix="select"
                            onChange={ handleSelectChange }
                        /> */}
                    </FormGroup>

                    <FormGroup>
                        <label>Objetivo táctico:</label>
                        {/* <input className="form-control" name="entrenador" type="text" onChange={ handleChangeAdd } /> */}
                        <Select
                            name="objtactico"
                            options={objtacOptions}
                            className="basic-single"
                            classNamePrefix="select"
                            onChange={ handleSelectChange }
                            placeholder={'Selecciona objetivo táctico...'}
                        />
                    </FormGroup>

                </ModalBody>

                <ModalFooter>
                    <Button color="primary" onClick={ handleNewTask }>Insertar</Button>
                    <Button color="danger" onClick={ ocultarModalInsertar }>Cancelar</Button>  
                </ModalFooter>
            </Modal>

            <Modal isOpen={state.modalEditar}>
                <ModalHeader>
                        <div className="row">
                            <div className="col-2"><img src={ tacticIcon } width="64" alt="Partido" /></div>
                            <div className="col-10">
                                <div className="row"
                                    ><h2>Detalles / Editar tarea</h2>
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
                        {/* <Select
                            className="basic-single"
                            classNamePrefix="select"
                            name="categoria"
                            defaultValue={{label: formState.form?.categoria, value: formState.form?.categoria}}
                            options={catOptions}
                            onChange={ handleSelectChange }
                        /> */}
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
                        <label>Preparador:</label>
                        <input className="form-control" name="preparador" type="text" onChange={ handleChangeEdit } value={ formState.form?.preparador || '' } />
                    </FormGroup>

                </ModalBody>

                <ModalFooter>
                    <Button color="primary" onClick={ () => handleEditTask( formState.form ) }>Actualizar</Button>
                    <Button color="danger" onClick={ ocultarModalEditar }>Cancelar</Button>  
                </ModalFooter>
            </Modal>
        </>
    )
}

export default TasksComponent;
