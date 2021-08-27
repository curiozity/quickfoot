import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup } from 'reactstrap';
import { db } from "../firebase/firebase-config";
import { Badge } from 'react-bootstrap';
import Select from 'react-select';

import matchIcon from '../assets/icons/ball-443.png'
import substIcon from '../assets/icons/substitution--473.png'
import redCardIcon from '../assets/icons/red-card-460.png'
import yellowCardIcon from '../assets/icons/yellow-card-489.png'
import ballIcon from '../assets/icons/ball-444.png'

import { tipoEventoOptions, competicionOptions, tipoOptions, tipoGolOptions, tipoTarjetaOptions } from '../helpers/options'

function MatchesComponent() {

    const [ players,setPlayers ] = useState([]);

    const [ playersOptions,setPlayersOptions ] = useState([]);
    const [ playersOptionsEntra,setPlayersOptionsEntra ] = useState([]);
    const [ playersOptionsSale,setPlayersOptionsSale ] = useState([]);

    const fetchPlayers = async() => {

        const response = db.collection('players').orderBy("apodo");

        const data = await response.get();

        data.forEach( doc => {

            const loadPlayer = {
                id: doc.id,
                apodo: doc.data().apodo,
                convocado: true,
            }

            setPlayers(players => [...players, loadPlayer]);

            const playerOption = {
                label: doc.data().apodo,
                value: doc.data().apodo,
                field: 'jugador',
            }

            setPlayersOptions(playersOptions => [...playersOptions, playerOption]);

            const playerOptionEntra = {
                label: doc.data().apodo,
                value: doc.data().apodo,
                field: 'entra',
            }

            setPlayersOptionsEntra(playersOptionsEntra => [...playersOptionsEntra, playerOptionEntra]);

            const playerOptionSale = {
                label: doc.data().apodo,
                value: doc.data().apodo,
                field: 'sale',
            }

            setPlayersOptionsSale(playersOptionsSale => [...playersOptionsSale, playerOptionSale]);

        })
    }

    useEffect(() => {
        fetchPlayers();
    }, [])

    const [ matches,setMatches ] = useState([])

    const fetchMatches = async() => {

        const response = db.collection('matches').orderBy("fecha");

        const data = await response.get();

        data.forEach( doc => {

            const loadMatch = {
                id: doc.id,
                temporada: doc.data().temporada,
                fecha: doc.data().fecha,
                hora: doc.data().hora,
                rival: doc.data().rival,
                campo: doc.data().campo,
                tipo: doc.data().tipo,
                convocados: doc.data().convocados,
                eventos: doc.data().eventos,
                arbitro: doc.data().arbitro,
            }

            //console.log(loadMatch);
            setMatches(matches => [...matches, loadMatch]);

        })

    }

    useEffect(() => {
        fetchMatches();
    }, [])


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
            hora: '',
            rival: {},
            campo: '',
            tipo: '',
            competicion: '',
            jornada: '',
            convocados: [],
            eventos: [],
            arbitro: {},
        },
    };

    const [formState, setFormState] = useState(initialFormState);

    const [evento, setEvento] = useState({
        id: '',
        tipo: '',
        minuto: '',
        tipogol: '',
        jugador: '',
        jugadorrival: '',
        tipotarjeta: '',
        entra: '',
        sale: '',
    })

    const [eventos, setEventos] = useState([]);

    // DECLARACIONES DE ARRAYS PARA OPTIONS





    // FIN DE DECLARACIONES INICIALES Y CARGA INICIAL

    // COMIENZO DE CONFIGURACION DE MODAL

    const mostrarModalInsertar = () => {
        setFormState({
            form:{
                ...formState.form,
                convocados: players,
            },
        })
        setState({modalInsertar: true})
    }

    const ocultarModalInsertar = () => {
        setState({modalInsertar: false})
    }

    const mostrarModalEditar = (registro) => {
        setState({modalEditar: true});
        setEventos(registro.eventos);
        setFormState({form: registro});
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

    const handleBadgeChange = ( index ) => {

        const playersAsisten = [...players];

        playersAsisten[index].convocado ? playersAsisten[index].convocado = false : playersAsisten[index].convocado = true;

        setPlayers(playersAsisten);

        setFormState({
            form:{
                ...formState.form,
                convocados: players,
            },
        })
        setState({modalInsertar: true})
    }

    const handleBadgeChangeEdit = ( index ) => {

        const playersAsisten = [...players];

        console.log(playersAsisten);

        playersAsisten[index].convocado ? playersAsisten[index].convocado = false : playersAsisten[index].convocado = true;

        setPlayers(playersAsisten);

        setFormState({
            form:{
                ...formState.form,
                convocados: players,
            },
        })
        setState({modalEditar: true})
    }

    const handleSelectChange = (selected) => {
        setFormState({
            form:{
                ...formState.form,
                [selected.field]: selected.value,
            },
        })
    }

    const handleChangeEventSelect = (selected) => {
        setEvento({
            ...evento,
            [selected.field]: selected.value,
        })
        // console.log(evento)
    }

    const handleChangeEvent = (e) => {
        setEvento({
            ...evento,
            id: Date.now(),
            [e.target.name]: e.target.value,
        })
        // console.log(evento)
    }

    const handleNewEvent = () => {
        setEventos(eventos => [...eventos, evento]);
    }

    useEffect(() => {
        setFormState({
            form:{
                ...formState.form,
                eventos: eventos,
            },
        });

        setEvento({
            ...evento,
            tipo: '',
            minuto: '',
            tipogol: '',
            jugador: '',
            jugadorrival: '',
            tipotarjeta: '',
            entra: '',
            sale: '',

        })
    }, [eventos])

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

        setMatches([]);
        fetchMatches();

        setState({
            modalEditar: false,
        });
    }

    //// FIN DE FUNCIONES PARA EDITAR

    const handleDeleteMatch = async ( id ) => {
        try {
            await db.collection("matches").doc(id).delete();
            fetchMatches();
        } catch (error) {
            console.log(error)
        }
    }

    const deleteEvent = (id) => {
        const newEvents = [...eventos];
        const index = eventos.findIndex( i => i.id === id);
        console.log(id, index);

        newEvents.splice(index, 1); // Para borrar elemento indicado con el índice i
        setEventos(newEvents);
    }

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
                            matches.map(( match ) => <tr key={match.id}><td>{ match.fecha }</td><td>{ match.rival }</td><td>3-2</td><td><Button color="primary" onClick={ () => mostrarModalEditar(match) }>Detalles</Button> <Button color="danger" onClick={ () => handleDeleteMatch( match.id ) }>Eliminar</Button></td></tr>)
                        }
                    </tbody>
                </Table>


            </Container>

            <Modal isOpen={state.modalInsertar} size="lg" style={{maxWidth: '900px', width: '100%'}}>
                <ModalHeader>
                    <div className="row">
                        <div className="col-2"><img src={ matchIcon } width="64" alt="Partido" /></div>
                        <div className="col-10">
                            <div className="row"
                                ><h2>Añadir nuevo partido</h2>
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
                    <h4 className="bg-secondary text-white">Datos generales</h4>
                    <FormGroup className="row d-flex flex-row">
                        <div className="col-3">
                            <label>Fecha:</label>
                            <input className="form-control" name="fecha" type="date" onChange={ handleChangeAdd } />
                        </div>

                        <div className="col-3">
                            <label>Hora:</label>
                            <input className="form-control" name="hora" type="time" onChange={ handleChangeAdd } />
                        </div>

                        <div className="col-3">
                            <label>Rival:</label>
                            <input className="form-control" name="rival" type="text" onChange={ handleChangeAdd } />
                        </div>

                        <div className="col-3">
                            <label>Campo:</label>
                            <input className="form-control" name="campo" type="text" onChange={ handleChangeAdd } />
                        </div>

                    </FormGroup>

                    <FormGroup className="row d-flex flex-row">
                        <div className="col-3">
                            <label>Temporada:</label>
                            <input className="form-control" name="temporada" type="text" readOnly value="21/22" />
                        </div>
                        <div className="col-3">
                            <label>Tipo:</label>
                            <Select
                                name="tipo"
                                options={tipoOptions}
                                className="basic-single"
                                classNamePrefix="select"
                                onChange={ handleSelectChange }
                                placeholder={"Selecciona..."}
                            />
                        </div>
                        <div className="col-3">
                            <label>Competición:</label>
                            <Select
                                name="competicion"
                                options={competicionOptions}
                                className="basic-single"
                                classNamePrefix="select"
                                onChange={ handleSelectChange }
                                placeholder={"Selecciona..."}
                                isDisabled={formState.form.tipo === "Amistoso"}
                            />
                        </div>
                        <div className="col-3">
                            <label>Jornada:</label>
                            <input className="form-control" name="tipo" type="text" readOnly={ formState.form.tipo === "Amistoso"} onChange={ handleChangeAdd } />
                        </div>
                    </FormGroup>

                   <h4 className="bg-secondary text-white mt-3">Convocados</h4>
                    {
                            players.map(( player, index ) => <div className="d-inline-block ms-1 mt-1" key={player.id}><Button color={ player.convocado ? "success": "secondary"} size="sm" onClick={ () => handleBadgeChange(index) }>{ player.apodo }</Button></div> )
                    }

                    <h4 className="bg-secondary text-white mt-3">Eventos</h4>
                    <FormGroup  className="row d-flex flex-row">
                        <div className="col-3">
                            <Select
                                    name="tipo"
                                    options={tipoEventoOptions}
                                    className="basic-single"
                                    classNamePrefix="select"
                                    onChange={ handleChangeEventSelect }
                                    placeholder={"Tipo de evento..."}
                                    value={evento.tipo}
                            />
                        </div>
                        <div className="col-2">
                            <input className="form-control" placeholder="Minuto..." name="minuto" type="text" onChange={ handleChangeEvent } value={evento.minuto} />
                        </div>
                        <div className={ evento.tipo === "Gol" ? "d-block col-3" : "d-none col-3" }>
                            <Select
                                name="tipogol"
                                options={tipoGolOptions}
                                className="basic-single"
                                classNamePrefix="select"
                                onChange={ handleChangeEventSelect }
                                placeholder={"Tipo de gol..."}
                                value={evento.tipogol}
                            />
                        </div>
                        <div className={ evento.tipo === "Tarjeta" ? "d-block col-3" : "d-none col-3" }>
                            <Select
                                name="tipotarjeta"
                                options={tipoTarjetaOptions}
                                className="basic-single"
                                classNamePrefix="select"
                                onChange={ handleChangeEventSelect }
                                placeholder={"Tipo de tarjeta..."}
                            />
                        </div>
                        <div className={ evento.tipo === "Cambio" ? "d-block col-3" : "d-none col-3" }>
                            <Select
                                name="entra"
                                options={playersOptionsEntra}
                                className="basic-single"
                                classNamePrefix="select"
                                onChange={ handleChangeEventSelect }
                                placeholder={"Entra..."}
                            />
                        </div>
                        <div className={ evento.tipo === "Cambio" ? "d-block col-3" : "d-none col-3" }>
                            <Select
                                name="sale"
                                options={playersOptionsSale}
                                className="basic-single"
                                classNamePrefix="select"
                                onChange={ handleChangeEventSelect }
                                placeholder={"Sale..."}
                            />
                        </div>

                        <div className={ (evento.tipo === "Gol" && evento.tipogol ==="A favor") || evento.tipo === "Tarjeta" ? "d-block col-3" : "d-none col-3" }>
                            <Select
                                name="jugador"
                                options={playersOptions}
                                className="basic-single"
                                classNamePrefix="select"
                                onChange={ handleChangeEventSelect }
                                placeholder={"Jugador..."}
                            />
                        </div>
                        <div className="col-1 pt-1 ps-1 ms-auto">
                            <Button color="primary" size="sm" onClick={ handleNewEvent }>Añadir</Button>
                        </div>
                        <h5 className="bg-black text-light mt-2">Goles</h5>
                        <Table>
                            <thead><tr><th>Minuto</th><th>Tipo</th><th>Jugador</th></tr></thead>
                            <tbody>
                            {
                                eventos.filter( eventoFiltered => eventoFiltered.tipo === "Gol").map(evento => <tr><td>{evento.minuto}</td><td>{evento.tipogol}</td><td>{evento.jugador}</td></tr>)
                            }
                            </tbody>
                        </Table>
                        <h5 className="bg-black text-light">Cambios</h5>
                        <Table>
                            <thead><tr><th>Minuto</th><th>Entra</th><th>Sale</th></tr></thead>
                            <tbody>
                            {
                                eventos.filter( eventoFiltered => eventoFiltered.tipo === "Cambio").map(evento => <tr><td>{evento.minuto}</td><td>{evento.entra}</td><td>{evento.sale}</td></tr>)
                            }
                            </tbody>
                        </Table>
                        <h5 className="bg-black text-light">Tarjetas</h5>
                        <Table>
                            <thead><tr><th>Minuto</th><th>Tipo</th><th>Jugador</th></tr></thead>
                            <tbody>
                            {
                                eventos.filter( eventoFiltered => eventoFiltered.tipo === "Tarjeta").map(evento => <tr><td>{evento.minuto}</td><td>{evento.tipotarjeta}</td><td>{evento.jugador}</td></tr>)
                            }
                            </tbody>
                        </Table>

                    </FormGroup>

                    {/* <FormGroup>
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
                    </FormGroup> */}

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

            <Modal isOpen={state.modalEditar} size="lg" style={{maxWidth: '900px', width: '100%'}}>
                <ModalHeader>
                    <div className="row">
                        <div className="col-2"><img src={ matchIcon } width="64" alt="Partido" /></div>
                        <div className="col-10">
                            <div className="row"
                                ><h2>Detalles / Editar partido</h2>
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
                    <h4 className="bg-secondary text-white">Datos generales</h4>
                    <FormGroup>
                        <label>Id:</label>
                        <input className="form-control" name="id" type="text" readOnly value={ formState.form?.id || '' } />
                    </FormGroup>
                    <FormGroup className="row d-flex flex-row">

                        <div className="col-3">
                            <label>Fecha:</label>
                            <input className="form-control" name="fecha" type="date" onChange={ handleChangeEdit } value={ formState.form?.fecha || '' } />
                        </div>

                        <div className="col-3">
                            <label>Hora:</label>
                            <input className="form-control" name="hora" type="time" onChange={ handleChangeEdit } value={ formState.form?.hora || '' } />
                        </div>

                        <div className="col-3">
                            <label>Rival:</label>
                            <input className="form-control" name="rival" type="text" onChange={ handleChangeEdit } value={ formState.form?.rival || '' } />
                        </div>

                        <div className="col-3">
                            <label>Campo:</label>
                            <input className="form-control" name="campo" type="text" onChange={ handleChangeEdit } value={ formState.form?.campo || '' }/>
                        </div>

                    </FormGroup>

                    <FormGroup className="row d-flex flex-row">
                        <div className="col-3">
                            <label>Temporada:</label>
                            <input className="form-control" name="temporada" type="text" readOnly value="21/22" />
                        </div>
                        <div className="col-3">
                            <label>Tipo:</label>
                            <Select
                                name="tipo"
                                options={tipoOptions}
                                className="basic-single"
                                classNamePrefix="select"
                                onChange={ handleSelectChange }
                                placeholder={"Selecciona..."}
                                defaultValue={{label: formState.form?.tipo, value: formState.form?.tipo}}
                            />
                        </div>
                        <div className="col-3">
                            <label>Competición:</label>
                            <Select
                                name="competicion"
                                options={competicionOptions}
                                className="basic-single"
                                classNamePrefix="select"
                                onChange={ handleSelectChange }
                                placeholder={"Selecciona..."}
                                isDisabled={formState.form.tipo === "Amistoso"}
                                defaultValue={{label: formState.form?.competicion, value: formState.form?.competicion}}
                            />
                        </div>
                        <div className="col-3">
                            <label>Jornada:</label>
                            <input className="form-control" name="tipo" type="text" readOnly={ formState.form?.tipo === "Amistoso"} onChange={ handleChangeAdd } value={formState.form?.jornada || ''} />
                        </div>
                    </FormGroup>

                   <h4 className="bg-secondary text-white mt-3">Convocados</h4>
                    {
                            players.map(( player, index ) => <div className="d-inline-block ms-1 mt-1" key={player.id}><Button color={ player.convocado ? "success": "secondary"} size="sm" onClick={ () => handleBadgeChangeEdit(index) }>{ player.apodo }</Button></div> )
                    }

                    <h4 className="bg-secondary text-white mt-3">Eventos</h4>
                    <FormGroup  className="row d-flex flex-row">
                        <div className="col-3">
                            <Select
                                    name="tipo"
                                    options={tipoEventoOptions}
                                    className="basic-single"
                                    classNamePrefix="select"
                                    onChange={ handleChangeEventSelect }
                                    placeholder={"Tipo de evento..."}
                            />
                        </div>
                        <div className="col-2">
                            <input className="form-control" placeholder="Minuto..." name="minuto" type="text" onChange={ handleChangeEvent } value={evento.minuto} />
                        </div>
                        <div className={ evento.tipo === "Gol" ? "d-block col-3" : "d-none col-3" }>
                            <Select
                                name="tipogol"
                                options={tipoGolOptions}
                                className="basic-single"
                                classNamePrefix="select"
                                onChange={ handleChangeEventSelect }
                                placeholder={"Tipo de gol..."}
                            />
                        </div>
                        <div className={ evento.tipo === "Tarjeta" ? "d-block col-3" : "d-none col-3" }>
                            <Select
                                name="tipotarjeta"
                                options={tipoTarjetaOptions}
                                className="basic-single"
                                classNamePrefix="select"
                                onChange={ handleChangeEventSelect }
                                placeholder={"Tipo de tarjeta..."}
                            />
                        </div>
                        <div className={ evento.tipo === "Cambio" ? "d-block col-3" : "d-none col-3" }>
                            <Select
                                name="entra"
                                options={playersOptionsEntra}
                                className="basic-single"
                                classNamePrefix="select"
                                onChange={ handleChangeEventSelect }
                                placeholder={"Entra..."}
                            />
                        </div>
                        <div className={ evento.tipo === "Cambio" ? "d-block col-3" : "d-none col-3" }>
                            <Select
                                name="sale"
                                options={playersOptionsSale}
                                className="basic-single"
                                classNamePrefix="select"
                                onChange={ handleChangeEventSelect }
                                placeholder={"Sale..."}
                            />
                        </div>

                        <div className={ (evento.tipo === "Gol" && evento.tipogol ==="A favor") || evento.tipo === "Tarjeta" ? "d-block col-3" : "d-none col-3" }>
                            <Select
                                name="jugador"
                                options={playersOptions}
                                className="basic-single"
                                classNamePrefix="select"
                                onChange={ handleChangeEventSelect }
                                placeholder={"Jugador..."}
                            />
                        </div>
                        <div className="col-1 pt-1 ps-1 ms-auto">
                            <Button color="primary" size="sm" onClick={ handleNewEvent }>Añadir</Button>
                        </div>
                        <h5 className="bg-black text-light mt-2">Goles</h5>
                        <Table>
                            <thead><tr><th></th><th>Minuto</th><th>Tipo</th><th>Jugador</th><th>Eliminar</th></tr></thead>
                            <tbody>
                            {
                                eventos.filter( (eventoFiltered) => eventoFiltered.tipo === "Gol").map((evento, index) => <tr key={index}><td><img src={ ballIcon } width="32" alt="Gol" /></td><td>{evento.minuto}</td><td>{evento.tipogol}</td><td>{evento.jugador}</td><td className="pl-2"><Button color="danger" size="sm" onClick={ () => deleteEvent(evento.id)}>x</Button></td></tr>)
                            }
                            </tbody>
                        </Table>
                        <h5 className="bg-black text-light">Cambios</h5>
                        <Table>
                            <thead><tr><th></th><th>Minuto</th><th>Entra</th><th>Sale</th><th>Eliminar</th></tr></thead>
                            <tbody>
                            {
                                eventos.filter( (eventoFiltered) => eventoFiltered.tipo === "Cambio").map((evento, index) => <tr key={index}><td><img src={ substIcon } width="32" alt="Cambio" /></td><td>{evento.minuto}</td><td>{evento.entra}</td><td>{evento.sale}</td><td className="pl-2"><Button color="danger" size="sm" onClick={ () => deleteEvent(evento.id)}>x</Button></td></tr>)
                            }
                            </tbody>
                        </Table>
                        <h5 className="bg-black text-light">Tarjetas</h5>
                        <Table>
                            <thead><tr><th></th><th>Minuto</th><th>Tipo</th><th>Jugador</th><th>Eliminar</th></tr></thead>
                            <tbody>
                            {
                                eventos.filter( (eventoFiltered) => eventoFiltered.tipo === "Tarjeta").map((evento, index) => <tr key={index}><td><img src={ evento.tipotarjeta === "Roja" ? redCardIcon : yellowCardIcon } width="32" alt="Tarjeta" /></td><td>{evento.minuto}</td><td>{evento.tipotarjeta}</td><td>{evento.jugador}</td><td className="pl-2"><Button color="danger" size="sm" onClick={ () => deleteEvent(evento.id)}>x</Button></td></tr>)
                            }
                            </tbody>
                        </Table>

                    </FormGroup>

                    {/* <FormGroup>
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
                    </FormGroup> */}

                    <FormGroup>
                        <label>Árbitro:</label>
                        <input className="form-control" name="arbitro" type="text" onChange={ handleChangeAdd } />
                    </FormGroup>

                </ModalBody>

                <ModalFooter>
                    <Button color="primary" onClick={ () => handleEditMatch( formState.form ) }>Actualizar</Button>
                    <Button color="danger" onClick={ ocultarModalEditar }>Cancelar</Button>
                </ModalFooter>
            </Modal>
        </>
    )
}

export default MatchesComponent;
