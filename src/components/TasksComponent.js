import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup, Form } from 'reactstrap';
import { Badge } from 'react-bootstrap';
import Select from 'react-select';
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'
import '@firebase/storage'

import { db, firebase } from "../firebase/firebase-config";
import tacticIcon from '../assets/icons/soccer-tactics-472.png'

function TasksComponent() {

    // COMIENZO DE DECLARACIONES INICIALES

    const almacenamiento = firebase.storage();

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
                tags: doc.data().tags,
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
            tags: [],
            imagenes: [],
        },
    };

    const [formState, setFormState] = useState(initialFormState);

    /// DECLARACIONES DE ARRAYS PARA OPTIONS

    const tiempoOptions = [];
    
    for (let c = 1; c < 101; c++) {
        tiempoOptions.push({
            label: c,
            value: c,
            field: "tiempo"
        })
    }

    const intervaloOptions = [];
    
    for (let c = 1; c < 11; c++) {
        intervaloOptions.push({
            label: c,
            value: c,
            field: "intervalo"
        })
    }
    
    //// OPTIONS PARA OBJETIVOS CONDICIONALES

    const [objconOptions, setObjconOptions] = useState([]);

    const fetchObjCon = async() => {

        const response = db.collection('objcondicional').orderBy("nombre");

        const data = await response.get();

        data.forEach( doc => {

            const loadOption = {
                value: doc.data().nombre,
                label: doc.data().nombre,
                field: 'objcondicional',
            }

            setObjconOptions(objconOptions => [...objconOptions, loadOption]);
            
        })

    }

    useEffect(() => {
        fetchObjCon();
    }, [])

    //// OPTIONS PARA OBJETIVOS TACTICOS

    const [objtacOptions, setObjtacOptions] = useState([]);

    const fetchObjTac = async() => {

        const response = db.collection('objtacticos').orderBy("nombre");

        const data = await response.get();

        data.forEach( doc => {

            const loadOption = {
                value: doc.data().nombre,
                label: doc.data().nombre,
                field: 'objtactico',
            }

            setObjtacOptions(objtacOptions => [...objtacOptions, loadOption]);
            
        })

    }

    useEffect(() => {
        fetchObjTac();
    }, [])

    //// OPTIONS PARA OBJETIVOS JUEGO

    const [objjueOptions, setObjjueOptions] = useState([]);

    const fetchObjJue = async() => {

        const response = db.collection('objjuego').orderBy("nombre");

        const data = await response.get();

        data.forEach( doc => {

            const loadOption = {
                value: doc.data().nombre,
                label: doc.data().nombre,
                field: 'objjuego',
            }

            setObjjueOptions(objjueOptions => [...objjueOptions, loadOption]);
            
        })

    }

    useEffect(() => {
        fetchObjJue();
    }, [])

    /// FIN DE DECLARACIONES DE ARRAYS PARA OPTIONS

    const [tagsState, setTagsState] = useState({tags: []});

    const handleChangeTags = (tags) => {
        setTagsState({tags})
    }

    useEffect(() => {
        setFormState({
            form:{
                ...formState.form,
                tags: tagsState.tags,
            },
        })
    }, [tagsState])

    


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

    const handleSelectChange = (selected) => {
        setFormState({
            form:{
                ...formState.form,
                [selected.field]: selected.value,
            },
        })

        console.log("Selected field", selected.field)
    }

    const [image , setImage] = useState('');

    const [imgState, setImgState] = useState([]);

    const uploadImage = async ()=>{
        if(image == null)
            return;
        const refImage = almacenamiento.ref(`/images/${image.name}`);
        try {
            await refImage.put(image);
            refImage.getDownloadURL().then((url) => {
                alert("Imagen subida correctamente.");
                const imgObj = {
                    nombre: image.name,
                    url: url,
                }
            setImgState(imgState => [...imgState, imgObj]);
            });
            
        } catch (e) {
            console.log("Error al subir imagen: ", e)
        }
    }

    useEffect(() => {
        setFormState({
            form:{
                ...formState.form,
                imagenes: imgState,
            },
        })
    }, [imgState])

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
                    <thead><tr><th>Nombre</th><th>Objetivo condicional</th><th>Objetivo juego</th><th>Objetivo táctico</th></tr></thead>
                    <tbody>
                        {
                            tasks.map(( task ) => <tr key={task.id}><td>{ task.nombre }</td><td>{ task.objcondicional }</td><td>{ task.objjuego }</td><td>{ task.objtactico }</td><td><Button color="primary" onClick={ () => mostrarModalEditar(task) }>Detalles</Button> <Button color="danger" onClick={ () => handleDeleteTask( task.id ) }>Eliminar</Button></td></tr>)
                        }
                    </tbody>
                </Table>


            </Container>

            <Modal isOpen={state.modalInsertar} size="lg" style={{maxWidth: '900px', width: '100%'}}>
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
                        <label>Nombre:</label>
                        <input className="form-control" name="nombre" type="text" onChange={ handleChangeAdd } />
                    </FormGroup>

                    <FormGroup className="row d-flex flex-row">
                        <div className="col-4">
                            <label>Objetivo condicional:</label>                            
                            <Select
                                name="objcondicional"
                                options={objconOptions}
                                className="basic-single"
                                classNamePrefix="select"
                                onChange={ handleSelectChange }
                                placeholder={"Selecciona..."}
                            />
                        </div>
                        <div className="col-4">
                            <label>Objetivo juego:</label>
                            <Select
                                name="objjuego"
                                options={objjueOptions}
                                className="basic-single"
                                classNamePrefix="select"
                                onChange={ handleSelectChange }
                                placeholder={"Selecciona..."}
                            />
                        </div>
                        <div className="col-4">
                            <label>Objetivo táctico:</label>
                            <Select
                                name="objtactico"
                                options={objtacOptions}
                                className="basic-single"
                                classNamePrefix="select"
                                onChange={ handleSelectChange }
                                placeholder={'Selecciona...'}
                            />
                        </div>
                    </FormGroup>

                    <FormGroup>
                        <label>Explicación:</label>
                        <textarea className="form-control" name="explicacion" onChange={ handleChangeAdd } />
                    </FormGroup>

                    <FormGroup className="row d-flex flex-row">
                        <div className="col-6">
                            <label>Pautas:</label>
                            <textarea className="form-control" name="pautas" onChange={ handleChangeAdd } />
                        </div>
                        <div className="col-6">
                            <label>Variante:</label>
                            <textarea className="form-control" name="variante" onChange={ handleChangeAdd } />
                        </div>
                    </FormGroup>

                    <FormGroup className="row d-flex flex-row">
                        <div className="col-3">
                            <label>Espacio:</label>
                            <input className="form-control" name="espacio" type="text" onChange={ handleChangeAdd } />
                        </div>

                        <div className="col-3">
                            <label>Tiempo (minutos):</label>
                            <Select
                                name="tiempo"
                                options={tiempoOptions}
                                className="basic-single"
                                classNamePrefix="select"
                                onChange={ handleSelectChange }
                                defaultValue={{label: 1, value: 1}}
                            />
                        </div>
                        
                        <div className="col-3">
                            <label>Repeticiones:</label>
                            <input className="form-control" name="repeticiones" type="text" onChange={ handleChangeAdd } />
                        </div>

                        <div className="col-3">
                            <label>Intervalo (minutos):</label>
                            <Select
                                name="intervalo"
                                options={intervaloOptions}
                                className="basic-single"
                                classNamePrefix="select"
                                onChange={ handleSelectChange }
                                defaultValue={{label: 1, value: 1}}
                            />
                        </div>
                    </FormGroup>
                    
                    <FormGroup>
                        <label>Etiquetas:</label>
                        <TagsInput
                            value={tagsState.tags}
                            onChange={ handleChangeTags }
                            inputValue={tagsState.tags}
                            placeholder="Etiquetas..."
                            // onChangeInput={::this.handleChangeInput}
                        />
                    </FormGroup>

                    <FormGroup>
                        <input className="form-control" type="file" onChange={(e)=>{setImage(e.target.files[0])}}/>
                        <Button onClick={uploadImage}>Subir imagen</Button>
                    </FormGroup>
                    
                </ModalBody>

                <ModalFooter>
                    <Button color="primary" onClick={ handleNewTask }>Insertar</Button>
                    <Button color="danger" onClick={ ocultarModalInsertar }>Cancelar</Button>  
                </ModalFooter>
            </Modal>

            <Modal isOpen={state.modalEditar} size="lg" style={{maxWidth: '900px', width: '100%'}}>
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

                    <FormGroup className="row d-flex flex-row">
                        <div className="col-4">
                            <label>Objetivo condicional:</label>                            
                            <Select
                                name="objcondicional"
                                options={objconOptions}
                                className="basic-single"
                                classNamePrefix="select"
                                onChange={ handleSelectChange }
                                defaultValue={{label: formState.form?.objcondicional, value: formState.form?.objcondicional}}
                            />
                        </div>
                        <div className="col-4">
                            <label>Objetivo juego:</label>
                            <Select
                                name="objjuego"
                                options={objjueOptions}
                                className="basic-single"
                                classNamePrefix="select"
                                onChange={ handleSelectChange }
                                defaultValue={{label: formState.form?.objjuego, value: formState.form?.objjuego}}
                            />
                        </div>
                        <div className="col-4">
                            <label>Objetivo táctico:</label>
                            <Select
                                name="objtactico"
                                options={objtacOptions}
                                className="basic-single"
                                classNamePrefix="select"
                                onChange={ handleSelectChange }
                                defaultValue={{label: formState.form?.objtactico, value: formState.form?.objtactico}}
                            />
                        </div>
                    </FormGroup>

                    <FormGroup>
                        <label>Explicación:</label>
                        <textarea className="form-control" name="explicacion" onChange={ handleChangeAdd } value={ formState.form?.explicacion || '' }  />
                    </FormGroup>

                    <FormGroup className="row d-flex flex-row">
                        <div className="col-6">
                            <label>Pautas:</label>
                            <textarea className="form-control" name="pautas" onChange={ handleChangeAdd } value={ formState.form?.pautas || '' }  />
                        </div>
                        <div className="col-6">
                            <label>Variante:</label>
                            <textarea className="form-control" name="variante" onChange={ handleChangeAdd } value={ formState.form?.variante || '' } />
                        </div>
                    </FormGroup>

                    <FormGroup className="row d-flex flex-row">
                        <div className="col-3">
                            <label>Espacio:</label>
                            <input className="form-control" name="espacio" type="text" onChange={ handleChangeAdd } value={ formState.form?.espacio || '' }  />
                        </div>

                        <div className="col-3">
                            <label>Tiempo (minutos):</label>
                            <Select
                                name="tiempo"
                                options={tiempoOptions}
                                className="basic-single"
                                classNamePrefix="select"
                                onChange={ handleSelectChange }
                                defaultValue={{label: formState.form?.tiempo, value: formState.form?.tiempo}}
                            />
                        </div>
                        
                        <div className="col-3">
                            <label>Repeticiones:</label>
                            <input className="form-control" name="repeticiones" type="text" onChange={ handleChangeAdd } value={ formState.form?.repeticiones || '' } />
                        </div>

                        <div className="col-3">
                            <label>Intervalo (minutos):</label>
                            <Select
                                name="intervalo"
                                options={intervaloOptions}
                                className="basic-single"
                                classNamePrefix="select"
                                onChange={ handleSelectChange }
                                defaultValue={{label: formState.form?.intervalo, value: formState.form?.intervalo}}
                            />
                        </div>
                    </FormGroup>

                    <FormGroup>
                        <label>Etiquetas:</label>
                        <TagsInput
                            value={formState.form?.tags}
                            onChange={ handleChangeTags }
                            // inputValue={tagsState.tags}
                            placeholder="Etiquetas..."
                            // onChangeInput={::this.handleChangeInput}
                        />
                    </FormGroup>

                    <FormGroup>
                        <label className="mt-2">Imágenes:</label>
                        <input className="form-control" type="file" onChange={(e)=>{setImage(e.target.files[0])}}/>
                        <Button className="mt-1" onClick={uploadImage}>Subir imagen</Button>
                        
                    {
                            formState.form?.imagenes.map(( imagen, index ) => <div className="d-flex justify-content-center" key={ index }><img width="200" src={imagen.url} /></div> )
                    }
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
